(function(Scratch) {
    "use strict";

    class VocalSyntheExtension {
        constructor() {
            this.switchStates = {
                "启用自动淡入淡出": true
            };
            this.cacheA = {};
            this.cacheB = {};
            this.trackMeta = {};
            this.trackMissingFiles = {};
            this.accumulateBuffer = null;
            this.renderFinished = false;
            this.audioCtx = null;
            this._jsZipLoading = null;
            this._cachedWavBase64 = "";
        }

        async _ensureJSZip() {
            if (typeof JSZip !== "undefined") return true;
            if (this._jsZipLoading) return this._jsZipLoading;
            const self = this;
            this._jsZipLoading = new Promise(function(resolve) {
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
                script.onload = function() { resolve(true); };
                script.onerror = function() { resolve(false); };
                document.head.appendChild(script);
            });
            return await this._jsZipLoading;
        }

        async getAudioContext() {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.audioCtx.state === "suspended") {
                await this.audioCtx.resume();
            }
            return this.audioCtx;
        }

        applyFade(buffer, fadeSec) {
            if (typeof fadeSec === "undefined") fadeSec = 0.03;
            const ctx = this.audioCtx;
            const totalSample = buffer.length;
            const fadeSamples = Math.min(Math.floor(fadeSec * ctx.sampleRate), Math.floor(totalSample / 3));
            if (fadeSamples < 10) return buffer;
            const channels = buffer.numberOfChannels;
            for (let ch = 0; ch < channels; ch++) {
                const data = buffer.getChannelData(ch);
                for (let i = 0; i < fadeSamples; i++) data[i] *= i / fadeSamples;
                for (let i = totalSample - fadeSamples; i < totalSample; i++) data[i] *= (totalSample - i) / fadeSamples;
            }
            return buffer;
        }

        _applyCustomFade(buffer, fadeInSec, fadeOutSec) {
            const ctx = this.audioCtx;
            const totalSample = buffer.length;
            const sampleRate = ctx.sampleRate;
            let fadeInSamples = Math.floor(fadeInSec * sampleRate);
            let fadeOutSamples = Math.floor(fadeOutSec * sampleRate);
            if (fadeInSamples + fadeOutSamples > totalSample) {
                const ratio = totalSample / (fadeInSamples + fadeOutSamples);
                fadeInSamples = Math.floor(fadeInSamples * ratio);
                fadeOutSamples = Math.floor(fadeOutSamples * ratio);
            }
            if (fadeInSamples < 10 && fadeOutSamples < 10) return buffer;
            const channels = buffer.numberOfChannels;
            for (let ch = 0; ch < channels; ch++) {
                const data = buffer.getChannelData(ch);
                for (let i = 0; i < fadeInSamples && i < totalSample; i++) data[i] *= i / fadeInSamples;
                for (let i = totalSample - fadeOutSamples; i < totalSample; i++) {
                    if (i < 0) continue;
                    data[i] *= (totalSample - i) / fadeOutSamples;
                }
            }
            return buffer;
        }

        // ========== SOLA 时长拉伸（修复：源位置用 dstPos/scale 驱动，保证填满） ==========
        _solaStretch(sourceBuffer, targetDurationSec) {
            const ctx = this.audioCtx;
            const sampleRate = sourceBuffer.sampleRate;
            const channels = sourceBuffer.numberOfChannels;
            const srcLength = sourceBuffer.length;
            const targetLength = Math.round(targetDurationSec * sampleRate);
            const scale = targetLength / srcLength;
            if (Math.abs(scale - 1) < 0.001) return sourceBuffer;
            const outputBuffer = ctx.createBuffer(channels, targetLength, sampleRate);
            const frameSize = Math.round(sampleRate * 0.03);
            const searchRange = Math.round(sampleRate * 0.01);
            const hopSize = Math.round(frameSize / 2);
            const outputHop = Math.max(1, Math.round(hopSize * scale));

            for (let ch = 0; ch < channels; ch++) {
                const src = sourceBuffer.getChannelData(ch);
                const dst = outputBuffer.getChannelData(ch);
                let dstPos = 0;
                let prevFrameEnd = 0;

                while (dstPos < targetLength) {
                    // 关键修复：源理论位置 = 输出位置 / scale，与输出同步推进
                    const theoreticalStart = Math.max(0, Math.min(srcLength - frameSize, Math.floor(dstPos / scale)));
                    let bestStart = theoreticalStart;
                    let bestCorr = -Infinity;
                    const searchStart = Math.max(0, theoreticalStart - searchRange);
                    const searchEnd = Math.min(srcLength - frameSize, theoreticalStart + searchRange);

                    if (prevFrameEnd > 0 && searchEnd >= searchStart) {
                        const refLen = Math.min(hopSize, frameSize);
                        const refOffset = Math.max(0, prevFrameEnd - refLen);
                        for (let s = searchStart; s <= searchEnd; s++) {
                            let corr = 0, energy = 0;
                            for (let k = 0; k < refLen; k++) {
                                const srcIdx = s + k;
                                if (srcIdx >= srcLength) break;
                                corr += src[refOffset + k] * src[srcIdx];
                                energy += src[srcIdx] * src[srcIdx];
                            }
                            if (energy > 0) corr /= Math.sqrt(energy);
                            if (corr > bestCorr) { bestCorr = corr; bestStart = s; }
                        }
                    }

                    const copyLen = Math.min(frameSize, srcLength - bestStart, targetLength - dstPos);
                    const crossLen = Math.min(hopSize, copyLen);

                    if (dstPos === 0) {
                        for (let i = 0; i < copyLen; i++) dst[dstPos + i] = src[bestStart + i];
                    } else {
                        for (let i = 0; i < crossLen; i++) {
                            const fade = i / crossLen;
                            dst[dstPos + i] = dst[dstPos + i] * (1 - fade) + src[bestStart + i] * fade;
                        }
                        for (let i = crossLen; i < copyLen; i++) {
                            dst[dstPos + i] = src[bestStart + i];
                        }
                    }

                    prevFrameEnd = bestStart + copyLen;
                    dstPos += outputHop;
                }
            }
            return outputBuffer;
        }

        _safeLoopStretch(sourceBuffer, targetDurationSec) {
            const ctx = this.audioCtx;
            const sampleRate = sourceBuffer.sampleRate;
            const channels = sourceBuffer.numberOfChannels;
            const srcLength = sourceBuffer.length;
            const targetLength = Math.round(targetDurationSec * sampleRate);
            if (Math.abs(targetLength - srcLength) < 10) return sourceBuffer;
            const outputBuffer = ctx.createBuffer(channels, targetLength, sampleRate);
            const crossFadeSamples = Math.min(Math.floor(sampleRate * 0.03), Math.floor(srcLength * 0.1));

            for (let ch = 0; ch < channels; ch++) {
                const src = sourceBuffer.getChannelData(ch);
                const dst = outputBuffer.getChannelData(ch);
                const headLength = Math.min(srcLength, targetLength);
                for (let i = 0; i < headLength; i++) dst[i] = src[i];

                let loopStartSample = Math.floor(srcLength * 0.3);
                const searchStart = Math.floor(srcLength * 0.3);
                const searchEnd = Math.floor(srcLength * 0.7);
                let lastVal = src[searchStart];
                for (let i = searchStart; i < searchEnd; i++) {
                    if (lastVal <= 0 && src[i] > 0) { loopStartSample = i; break; }
                    lastVal = src[i];
                }

                const loopBodyLength = srcLength - loopStartSample;
                let writePos = headLength;
                while (writePos < targetLength) {
                    const remain = targetLength - writePos;
                    const copyLen = Math.min(loopBodyLength, remain);
                    const crossLen = Math.min(crossFadeSamples, copyLen);
                    for (let i = 0; i < crossLen; i++) {
                        const fade = i / crossLen;
                        let srcIdx = loopStartSample + i;
                        if (srcIdx >= srcLength) srcIdx = srcLength - 1;
                        dst[writePos + i] = dst[writePos + i] * (1 - fade) + src[srcIdx] * fade;
                    }
                    for (let i = crossLen; i < copyLen; i++) {
                        let srcIdx = loopStartSample + i;
                        if (srcIdx >= srcLength) srcIdx = srcLength - 1;
                        dst[writePos + i] = src[srcIdx];
                    }
                    writePos += copyLen;
                }
            }
            return outputBuffer;
        }

        _trimBuffer(sourceBuffer, targetDurationSec) {
            const ctx = this.audioCtx;
            const sampleRate = sourceBuffer.sampleRate;
            const targetLength = Math.round(targetDurationSec * sampleRate);
            if (targetLength >= sourceBuffer.length) return sourceBuffer;
            const output = ctx.createBuffer(sourceBuffer.numberOfChannels, targetLength, sampleRate);
            for (let ch = 0; ch < sourceBuffer.numberOfChannels; ch++) {
                output.getChannelData(ch).set(sourceBuffer.getChannelData(ch).subarray(0, targetLength));
            }
            this.applyFade(output, 0.01);
            return output;
        }

        mixAtTime(sourceBuffer, startTimeSec, volumePercent) {
            if (typeof volumePercent === "undefined") volumePercent = 100;
            const ctx = this.audioCtx;
            const sampleRate = ctx.sampleRate;
            const startSample = Math.floor(startTimeSec * sampleRate);
            const srcCh = sourceBuffer.numberOfChannels;
            const srcLen = sourceBuffer.length;
            const totalNeedSamples = startSample + srcLen;
            const vol = volumePercent / 100;

            if (!this.accumulateBuffer || this.accumulateBuffer.length < totalNeedSamples) {
                const oldBuf = this.accumulateBuffer;
                const oldCh = oldBuf ? oldBuf.numberOfChannels : srcCh;
                const newCh = Math.max(oldCh, srcCh);
                this.accumulateBuffer = ctx.createBuffer(newCh, totalNeedSamples, sampleRate);
                if (oldBuf) {
                    for (let c = 0; c < oldBuf.numberOfChannels; c++) {
                        const oldData = oldBuf.getChannelData(c);
                        const newData = this.accumulateBuffer.getChannelData(c);
                        for (let i = 0; i < oldBuf.length; i++) newData[i] = oldData[i];
                    }
                }
            }

            const targetCh = this.accumulateBuffer.numberOfChannels;
            for (let ch = 0; ch < targetCh; ch++) {
                const dstData = this.accumulateBuffer.getChannelData(ch);
                const srcData = sourceBuffer.getChannelData(Math.min(ch, srcCh - 1));
                for (let i = 0; i < srcLen; i++) {
                    const pos = startSample + i;
                    if (pos < 0 || pos >= dstData.length) continue;
                    dstData[pos] += srcData[i] * vol;
                    if (dstData[pos] > 1) dstData[pos] = Math.tanh(dstData[pos] - 1) + 1;
                    if (dstData[pos] < -1) dstData[pos] = Math.tanh(dstData[pos] + 1) - 1;
                }
            }
        }

        audioBufferToWav(buffer) {
            const numChannels = buffer.numberOfChannels;
            const sampleRate = buffer.sampleRate;
            const bitDepth = 16;
            const bytesPerSample = bitDepth / 8;
            const blockAlign = numChannels * bytesPerSample;
            const dataLength = buffer.length * blockAlign;
            const arrayBuffer = new ArrayBuffer(44 + dataLength);
            const view = new DataView(arrayBuffer);

            function writeStr(offset, str) {
                for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
            }
            writeStr(0, "RIFF");
            view.setUint32(4, arrayBuffer.byteLength - 8, true);
            writeStr(8, "WAVE");
            writeStr(12, "fmt ");
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true);
            view.setUint16(22, numChannels, true);
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * blockAlign, true);
            view.setUint16(32, blockAlign, true);
            view.setUint16(34, bitDepth, true);
            writeStr(36, "data");
            view.setUint32(40, dataLength, true);

            let offset = 44;
            for (let s = 0; s < buffer.length; s++) {
                for (let c = 0; c < numChannels; c++) {
                    const sample = buffer.getChannelData(c)[s];
                    const intSample = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
                    view.setInt16(offset, intSample, true);
                    offset += 2;
                }
            }
            return new Blob([arrayBuffer], { type: "audio/wav" });
        }

        async generateWavBase64() {
            this._cachedWavBase64 = "";
            if (!this.accumulateBuffer || !this.renderFinished) return;
            try {
                const blob = this.audioBufferToWav(this.accumulateBuffer);
                const buf = await blob.arrayBuffer();
                const bytes = new Uint8Array(buf);
                let binaryStr = "";
                for (let i = 0; i < bytes.length; i++) binaryStr += String.fromCharCode(bytes[i]);
                this._cachedWavBase64 = btoa(binaryStr);
            } catch (e) {
                console.error("生成base64失败", e);
                this._cachedWavBase64 = "";
            }
        }

        getWavBase64Text() { return this._cachedWavBase64; }

        _detectPitchYIN(audioData, sampleRate, threshold) {
            if (typeof threshold === "undefined") threshold = 0.12;
            const winSize = 2048;
            const hopSize = 256;
            const minFreq = 80;
            const maxFreq = 800;
            const results = [];
            const tauMin = Math.floor(sampleRate / maxFreq);
            const tauMax = Math.ceil(sampleRate / minFreq);
            const bufferSize = audioData.length;
            let lastFreq = 0;
            const energyThreshold = 0.0008;

            for (let i = 0; i + winSize <= bufferSize; i += hopSize) {
                const frame = audioData.subarray(i, i + winSize);
                let frameEnergy = 0;
                for (let k = 0; k < winSize; k++) frameEnergy += frame[k] * frame[k];
                frameEnergy /= winSize;
                const time = (i + winSize / 2) / sampleRate;

                if (frameEnergy < energyThreshold) {
                    results.push({ freq: lastFreq > 0 ? lastFreq : 0, time: time, lowEnergy: true });
                    continue;
                }

                const yinBuffer = new Float32Array(tauMax + 1);
                for (let tau = tauMin; tau <= tauMax; tau++) {
                    let sum = 0;
                    for (let j = 0; j < winSize - tau; j++) {
                        const delta = frame[j] - frame[j + tau];
                        sum += delta * delta;
                    }
                    yinBuffer[tau] = sum;
                }
                let runningSum = 0;
                yinBuffer[0] = 1;
                for (let tau = 1; tau <= tauMax; tau++) {
                    runningSum += yinBuffer[tau];
                    yinBuffer[tau] *= tau / runningSum;
                }

                let tauFound = -1;
                let minVal = 1;
                for (let tau = tauMin; tau <= tauMax; tau++) {
                    if (yinBuffer[tau] < minVal &&
                        tau > tauMin && yinBuffer[tau] < yinBuffer[tau - 1] &&
                        tau < tauMax && yinBuffer[tau] < yinBuffer[tau + 1]) {
                        minVal = yinBuffer[tau];
                        tauFound = tau;
                        break;
                    }
                }

                if (tauFound !== -1 && minVal < threshold) {
                    const x0 = tauFound > 0 ? tauFound - 1 : tauFound;
                    const x2 = tauFound < tauMax ? tauFound + 1 : tauFound;
                    const s0 = yinBuffer[x0], s1 = yinBuffer[tauFound], s2 = yinBuffer[x2];
                    const denom = 2 * (2 * s1 - s0 - s2);
                    const betterTau = denom !== 0 ? tauFound + (s2 - s0) / denom : tauFound;
                    let freq = sampleRate / betterTau;

                    if (lastFreq > 0 && freq > lastFreq * 1.7 && freq < lastFreq * 2.3) freq = freq / 2;
                    if (lastFreq > 0 && freq < lastFreq * 0.6 && freq > lastFreq * 0.4) freq = freq * 2;
                    if (lastFreq > 0 && Math.abs(freq - lastFreq) / lastFreq > 0.2) freq = lastFreq * 0.7 + freq * 0.3;
                    lastFreq = freq;
                    results.push({ freq: freq, time: time, lowEnergy: false });
                } else {
                    results.push({ freq: lastFreq > 0 ? lastFreq : 0, time: time, lowEnergy: true });
                }
            }
            return results;
        }

        _getPitchMarks(audioData, pitchResults, sampleRate) {
            const validPitches = pitchResults.filter(function(p) { return p.freq > 0; });
            if (validPitches.length < 3) return [];
            const smoothedPeriods = [];
            const windowSize = 5;
            for (let i = 0; i < validPitches.length; i++) {
                let sum = 0, count = 0;
                for (let j = Math.max(0, i - windowSize); j <= Math.min(validPitches.length - 1, i + windowSize); j++) {
                    sum += sampleRate / validPitches[j].freq;
                    count++;
                }
                smoothedPeriods.push({ time: validPitches[i].time, period: sum / count });
            }
            const marks = [];
            let currentSample = 0;
            let idx = 0;
            while (currentSample < audioData.length) {
                while (idx < smoothedPeriods.length - 1 && smoothedPeriods[idx + 1].time * sampleRate < currentSample) idx++;
                let period;
                if (idx >= smoothedPeriods.length - 1) {
                    period = smoothedPeriods[smoothedPeriods.length - 1].period;
                } else {
                    const t1 = smoothedPeriods[idx].time * sampleRate;
                    const t2 = smoothedPeriods[idx + 1].time * sampleRate;
                    const ratio = (currentSample - t1) / (t2 - t1);
                    period = smoothedPeriods[idx].period * (1 - ratio) + smoothedPeriods[idx + 1].period * ratio;
                }
                marks.push(Math.round(currentSample));
                currentSample += period;
            }
            return marks.filter(function(m) { return m >= 0 && m < audioData.length; });
        }

        _getSemitonesAtTime(pitchCurve, time) {
            if (!pitchCurve || pitchCurve.length === 0) return 0;
            if (pitchCurve.length === 1) return pitchCurve[0][1];
            if (time <= pitchCurve[0][0]) return pitchCurve[0][1];
            if (time >= pitchCurve[pitchCurve.length - 1][0]) return pitchCurve[pitchCurve.length - 1][1];
            for (let i = 0; i < pitchCurve.length - 1; i++) {
                const t1 = pitchCurve[i][0], v1 = pitchCurve[i][1];
                const t2 = pitchCurve[i + 1][0], v2 = pitchCurve[i + 1][1];
                if (time >= t1 && time <= t2) {
                    const ratio = (time - t1) / (t2 - t1);
                    return v1 + (v2 - v1) * ratio;
                }
            }
            return 0;
        }

        _interpAnchorPoints(points, time) {
            if (!points || points.length === 0) return 0;
            if (points.length === 1) return points[0].val;
            if (time <= points[0].t) return points[0].val;
            if (time >= points[points.length - 1].t) return points[points.length - 1].val;
            for (let i = 0; i < points.length - 1; i++) {
                if (time >= points[i].t && time <= points[i + 1].t) {
                    const span = points[i + 1].t - points[i].t;
                    if (span <= 0) return points[i].val;
                    const ratio = (time - points[i].t) / span;
                    return points[i].val + (points[i + 1].val - points[i].val) * ratio;
                }
            }
            return 0;
        }

        _clipGlobalPitchCurve(globalAnchors, startTime, segmentGlobalDuration, targetLocalDuration) {
            if (!globalAnchors || !Array.isArray(globalAnchors) || globalAnchors.length === 0) return [];
            if (segmentGlobalDuration <= 0) segmentGlobalDuration = targetLocalDuration;
            const endTime = startTime + segmentGlobalDuration;
            const points = globalAnchors
                .map(function(p) { return { t: p.globalTimeSec, val: p.toneVal }; })
                .sort(function(a, b) { return a.t - b.t; });
            const toLocal = function(globalT) {
                let rel = (globalT - startTime) / segmentGlobalDuration;
                rel = Math.max(0, Math.min(1, rel));
                return rel * targetLocalDuration;
            };
            const EPS = 1e-6;
            const startVal = this._interpAnchorPoints(points, startTime);
            const endVal = this._interpAnchorPoints(points, endTime - EPS);
            const result = [[0, startVal]];
            for (let i = 0; i < points.length; i++) {
                if (points[i].t > startTime + EPS && points[i].t < endTime - EPS) {
                    result.push([toLocal(points[i].t), points[i].val]);
                }
            }
            result.push([targetLocalDuration, endVal]);
            return result;
        }

        _globalPitchProcess(fullBuf, anchors) {
            const totalSec = fullBuf.duration;
            if (!anchors || !Array.isArray(anchors) || anchors.length === 0) {
                console.log("[全局变调] 无锚点，跳过");
                return fullBuf;
            }
            const pts = anchors
                .map(function(p) { return { t: p.globalTimeSec, val: p.toneVal }; })
                .sort(function(a, b) { return a.t - b.t; });
            const filtered = [];
            for (let i = 0; i < pts.length; i++) {
                if (pts[i].t >= 0 && pts[i].t <= totalSec) filtered.push(pts[i]);
            }
            if (filtered.length === 0) {
                console.log("[全局变调] 锚点全部超出轨道范围，跳过");
                return fullBuf;
            }
            if (filtered[0].t > 0.001) {
                filtered.unshift({ t: 0, val: this._interpAnchorPoints(filtered, 0) });
            }
            if (filtered[filtered.length - 1].t < totalSec - 0.001) {
                filtered.push({ t: totalSec, val: this._interpAnchorPoints(filtered, totalSec) });
            }
            const pitchCurve = [];
            for (let i = 0; i < filtered.length; i++) pitchCurve.push([filtered[i].t, filtered[i].val]);

            console.log("[全局变调] 轨道时长:" + totalSec.toFixed(3) + "s 锚点数:" + pitchCurve.length);
            return this._pitchShiftPSOLA(fullBuf, pitchCurve);
        }

        _pitchShiftPSOLA(sourceBuffer, pitchCurve) {
            const ctx = this.audioCtx;
            const sampleRate = sourceBuffer.sampleRate;
            const channels = sourceBuffer.numberOfChannels;
            const outLength = sourceBuffer.length;
            const outputBuffer = ctx.createBuffer(channels, outLength, sampleRate);

            for (let ch = 0; ch < channels; ch++) {
                const data = outputBuffer.getChannelData(ch);
                for (let i = 0; i < outLength; i++) data[i] = 0;
            }

            const monoData = sourceBuffer.getChannelData(0);
            const pitchResults = this._detectPitchYIN(monoData, sampleRate);
            const srcMarks = this._getPitchMarks(monoData, pitchResults, sampleRate);

            if (srcMarks.length < 5) {
                for (let ch = 0; ch < channels; ch++) {
                    outputBuffer.getChannelData(ch).set(sourceBuffer.getChannelData(ch));
                }
                console.warn("[PSOLA] 基频点不足(" + srcMarks.length + ")，原样输出");
                return outputBuffer;
            }

            const avgPeriod = (srcMarks[srcMarks.length - 1] - srcMarks[0]) / (srcMarks.length - 1);
            const avgFreq = sampleRate / avgPeriod;
            console.log("[PSOLA] 平均基频:" + avgFreq.toFixed(1) + "Hz 标记点:" + srcMarks.length + "个 输出时长:" + (outLength / sampleRate).toFixed(3) + "s");

            for (let ch = 0; ch < channels; ch++) {
                const inputData = sourceBuffer.getChannelData(ch);
                const outputData = outputBuffer.getChannelData(ch);
                this._applyPSOLA(inputData, outputData, srcMarks, pitchCurve, sampleRate, outLength);
            }
            return outputBuffer;
        }

        _applyPSOLA(input, output, srcMarks, pitchCurve, sampleRate, outLength) {
            let dstSample = 0;
            let srcIdx = 0;
            const self = this;
            const winRatio = 0.9;
            const srcMarksLen = srcMarks.length;

            while (dstSample < outLength) {
                const currentTime = dstSample / sampleRate;
                const semitones = self._getSemitonesAtTime(pitchCurve, currentTime);
                const pitchRatio = Math.pow(2, semitones / 12);
                const srcTime = dstSample;

                while (srcIdx < srcMarksLen - 1 && srcMarks[srcIdx + 1] < srcTime) srcIdx++;
                let bestIdx = srcIdx;
                if (srcIdx < srcMarksLen - 1) {
                    const distPrev = srcTime - srcMarks[srcIdx];
                    const distNext = srcMarks[srcIdx + 1] - srcTime;
                    if (distNext < distPrev) bestIdx = srcIdx + 1;
                }

                const srcPos = srcMarks[bestIdx];
                const prevMark = bestIdx > 0 ? srcMarks[bestIdx - 1] : srcMarks[bestIdx];
                const nextMark = bestIdx < srcMarksLen - 1 ? srcMarks[bestIdx + 1] : srcMarks[bestIdx];
                let srcPeriod = (nextMark - prevMark) / 2;
                if (srcPeriod < 1) srcPeriod = 1;
                let dstPeriod = Math.round(srcPeriod / pitchRatio);
                if (dstPeriod < 1) dstPeriod = 1;

                const halfWin = Math.floor(srcPeriod * winRatio / 2);
                const srcStart = Math.max(0, srcPos - halfWin);
                const srcEnd = Math.min(input.length, srcPos + halfWin);
                const segLen = srcEnd - srcStart;
                const winOffset = halfWin - (srcPos - srcStart);

                for (let j = 0; j < segLen; j++) {
                    const winIdx = j + winOffset;
                    const win = 0.5 * (1 - Math.cos(Math.PI * winIdx / halfWin));
                    const outPos = dstSample - halfWin + j;
                    const srcIdxReal = srcStart + j;
                    if (outPos >= 0 && outPos < outLength && srcIdxReal >= 0 && srcIdxReal < input.length) {
                        output[outPos] += input[srcIdxReal] * win;
                    }
                }
                dstSample += dstPeriod;
                if (dstPeriod < 1) dstSample++;
            }
        }

        getRawAudioFileVolumeAtTime(trackId, audioFileName, fileLocalSec) {
            const track = this.cacheA[trackId];
            if (!track) return 0;
            const audioBuf = track[audioFileName];
            if (!audioBuf) return 0;
            const sampleRate = audioBuf.sampleRate;
            const totalSample = audioBuf.length;
            const targetSample = Math.floor(fileLocalSec * sampleRate);
            if (targetSample < 0 || targetSample >= totalSample) return 0;
            const channelData = audioBuf.getChannelData(0);
            const windowSample = Math.floor(0.005 * sampleRate);
            let sumSquare = 0, count = 0;
            for (let i = -windowSample; i <= windowSample; i++) {
                const idx = targetSample + i;
                if (idx >= 0 && idx < totalSample) {
                    sumSquare += channelData[idx] * channelData[idx];
                    count++;
                }
            }
            if (count <= 0) return 0;
            return Math.min(1, Math.max(0, Math.sqrt(sumSquare / count)));
        }

        addRawAudioToAccumulate(args) {
            const track = Scratch.Cast.toString(args.TRACK);
            const fileName = Scratch.Cast.toString(args.FILENAME);
            const startSec = Scratch.Cast.toNumber(args.STARTSEC);
            const volPercent = Scratch.Cast.toNumber(args.VOL);
            const trackData = this.cacheA[track];
            if (!trackData) { console.warn("声库轨道不存在:", track); return; }
            const audioBuf = trackData[fileName];
            if (!audioBuf) { console.warn("音频文件不存在:", fileName); return; }
            this.mixAtTime(audioBuf, startSec, volPercent);
            this.renderFinished = true;
        }

        getInfo() {
            return {
                id: 'vocalsynthe',
                name: '虚拟歌声合成引擎',
                color1: '#66ccff',
                color2: '#77ddff',
                color3: '#55bbee',
                menus: {
                    trackMetaSelect: [
                        { text: "名称", value: "libName" },
                        { text: "制作人", value: "author" },
                        { text: "8位发行时间码", value: "releaseDate" },
                        { text: "应援口号", value: "slogan" },
                        { text: "应援色", value: "supportColor" },
                        { text: "代表色", value: "mainColor" },
                        { text: "配音员", value: "voiceActor" },
                        { text: "语种", value: "lang" }
                    ]
                },
                blocks: [
                    { opcode: "importZipToA", blockType: Scratch.BlockType.COMMAND, text: "导入ZIP声库至缓存A轨道 [TRACK]", arguments: { TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" } } },
                    { opcode: "importAudioToA", blockType: Scratch.BlockType.COMMAND, text: "导入单个WAV/MP3到缓存A轨道 [TRACK]", arguments: { TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" } } },
                    { opcode: "addRawAudioToAccumulate", blockType: Scratch.BlockType.COMMAND, text: "添加声库[TRACK]音频[FILENAME]到累计渲染第[STARTSEC]秒 音量[VOL]%", arguments: { TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" }, FILENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "a.wav" }, STARTSEC: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, VOL: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 } } },
                    { opcode: "deleteTrackA", blockType: Scratch.BlockType.COMMAND, text: "删除缓存A音轨 [TRACK]", arguments: { TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" } } },
                    { opcode: "clearAllA", blockType: Scratch.BlockType.COMMAND, text: "清空缓存A全部音轨" },
                    { opcode: "clearAllB", blockType: Scratch.BlockType.COMMAND, text: "一键清空全部B轨道缓存" },
                    { opcode: "copyTrackAtoA", blockType: Scratch.BlockType.COMMAND, text: "将音轨 [SRC] 复制到音轨 [DST]", arguments: { SRC: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" }, DST: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal1" } } },
                    { opcode: "setTrackMetaText", blockType: Scratch.BlockType.COMMAND, text: "设置轨道 [TRACK] [META] = [CONTENT]", arguments: { TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" }, META: { type: Scratch.ArgumentType.STRING, menu: "trackMetaSelect", defaultValue: "libName" }, CONTENT: { type: Scratch.ArgumentType.STRING, defaultValue: "" } } },
                    { opcode: "getTrackAInfo", blockType: Scratch.BlockType.REPORTER, text: "缓存A轨道 [TRACK] 校验信息", arguments: { TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" } } },
                    { opcode: "getTrackMeta", blockType: Scratch.BlockType.REPORTER, text: "轨道 [TRACK] 信息 [META]", arguments: { TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" }, META: { type: Scratch.ArgumentType.STRING, menu: "trackMetaSelect", defaultValue: "libName" } } },
                    { opcode: "listAudioFile", blockType: Scratch.BlockType.REPORTER, text: "缓存A轨道 [TRACK] 所有音频文件名", arguments: { TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" } } },
                    { opcode: "previewAudio", blockType: Scratch.BlockType.COMMAND, text: "预览播放A轨道 [TRACK] 音频 [FILE]", arguments: { TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" }, FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "a.wav" } } },
                    { opcode: "previewPitchShifted", blockType: Scratch.BlockType.COMMAND, text: "预览变调 [SEMI]半音 A轨道 [TRACK] 文件 [FILE]", arguments: { SEMI: { type: Scratch.ArgumentType.NUMBER, defaultValue: "0" }, TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" }, FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "a.wav" } } },
                    { opcode: "getRawAudioFileVolumeAtTime", blockType: Scratch.BlockType.REPORTER, text: "声库[TRACK]音频[FILENAME]在[SEC]秒原始音量", arguments: { TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" }, FILENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "a.wav" }, SEC: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1 } } },
                    { opcode: "setBSpeed", blockType: Scratch.BlockType.COMMAND, text: "设置B轨道 [TRACK] 变速倍率 [SPEED]", arguments: { TRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal1" }, SPEED: { type: Scratch.ArgumentType.STRING, defaultValue: "1" } } },
                    { opcode: "loadJSONtoB", blockType: Scratch.BlockType.COMMAND, text: "将轨道JSON载入B轨道 [BTRACK] JSON [JSONTEXT] 速度 [SPEED]", arguments: { BTRACK: { type: Scratch.ArgumentType.STRING, defaultValue: "test" }, JSONTEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "{}" }, SPEED: { type: Scratch.ArgumentType.STRING, defaultValue: "1" } } },
                    { opcode: "renderFromJSON", blockType: Scratch.BlockType.COMMAND, text: "JSON直接渲染 [JSONDATA] 全局变速 [SPEED]", arguments: { JSONDATA: { type: Scratch.ArgumentType.STRING, defaultValue: '{"片段列表":[],"轨道全局音高锚点":[]}' }, SPEED: { type: Scratch.ArgumentType.STRING, defaultValue: "1" } } },
                    { opcode: "renderAccumulateTrack", blockType: Scratch.BlockType.COMMAND, text: "使用A轨道（[trackName]）声库渲染json([jsonStr])", arguments: { trackName: { type: Scratch.ArgumentType.STRING, defaultValue: "vocal" }, jsonStr: { type: Scratch.ArgumentType.STRING, defaultValue: "{}" } } },
                    { opcode: "clearAccumulateBuffer", blockType: Scratch.BlockType.COMMAND, text: "清空全部累积渲染结果" },
                    { opcode: "generateWavBase64", blockType: Scratch.BlockType.COMMAND, text: "生成累积音频Base64缓存" },
                    { opcode: "getWavBase64Text", blockType: Scratch.BlockType.REPORTER, text: "获取渲染结果Base64文本" },
                    { opcode: "uploadAccumulateAudio", blockType: Scratch.BlockType.COMMAND, text: "上传成品 POST地址:[postUrl] 文件名:[fileName]", arguments: { postUrl: { type: Scratch.ArgumentType.STRING, defaultValue: "http://127.0.0.1:8080/upload" }, fileName: { type: Scratch.ArgumentType.STRING, defaultValue: "merged_output" } } },
                    { opcode: "validateJSON", blockType: Scratch.BlockType.REPORTER, text: "校验B轨道JSON合法性 [JSONTEXT]", arguments: { JSONTEXT: { type: Scratch.ArgumentType.STRING, defaultValue: "{}" } } },
                    { opcode: "hasRenderAudio", blockType: Scratch.BlockType.BOOLEAN, text: "是否渲染出成品音频" },
                    { opcode: "getRenderDuration", blockType: Scratch.BlockType.REPORTER, text: "渲染音频总时长 (秒)" },
                    { opcode: "setSwitch", blockType: Scratch.BlockType.COMMAND, text: "设置开关 [SWITCHNAME] 状态 [VAL]", arguments: { SWITCHNAME: { type: Scratch.ArgumentType.STRING, defaultValue: "启用自动淡入淡出" }, VAL: { type: Scratch.ArgumentType.BOOLEAN } } },
                    { opcode: "toggleSwitch", blockType: Scratch.BlockType.COMMAND, text: "切换开关 [SWITCHNAME] 状态", arguments: { SWITCHNAME: { type: Scratch.ArgumentType.STRING, defaultValue: "启用自动淡入淡出" } } },
                    { opcode: "getSwitchState", blockType: Scratch.BlockType.BOOLEAN, text: "开关 [SWITCHNAME] 是否开启", arguments: { SWITCHNAME: { type: Scratch.ArgumentType.STRING, defaultValue: "启用自动淡入淡出" } } }
                ]
            };
        }

        setSwitch(args) { this.switchStates[args.SWITCHNAME] = !!args.VAL; }
        toggleSwitch(args) {
            const k = args.SWITCHNAME;
            this.switchStates[k] = typeof this.switchStates[k] === "undefined" ? true : !this.switchStates[k];
        }
        getSwitchState(args) {
            const val = this.switchStates[args.SWITCHNAME];
            return typeof val === "undefined" ? false : val;
        }

        setTrackMetaText(args) {
            const t = args.TRACK, m = args.META, c = args.CONTENT;
            if (!this.trackMeta[t]) this.trackMeta[t] = {};
            this.trackMeta[t][m] = c;
        }
        getTrackMeta(args) {
            const meta = this.trackMeta[args.TRACK] || {};
            const val = meta[args.META];
            return typeof val === "undefined" ? "" : val;
        }

        importAudioToA(args) {
            const tn = args.TRACK;
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".wav,.mp3";
            input.style.display = "none";
            document.body.appendChild(input);
            const self = this;
            input.onchange = async function(e) {
                const f = e.target.files[0];
                if (!f) { document.body.removeChild(input); return; }
                try {
                    const ctx = await self.getAudioContext();
                    const buf = await f.arrayBuffer();
                    const aud = await ctx.decodeAudioData(buf);
                    if (!self.cacheA[tn]) self.cacheA[tn] = {};
                    self.cacheA[tn][f.name] = aud;
                    console.log("单音频导入成功", f.name);
                } catch (err) {
                    console.error("导入音频失败", err);
                }
                document.body.removeChild(input);
            };
            input.click();
        }

        importZipToA(args) {
            const targetTrack = args.TRACK;
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".zip";
            input.style.display = "none";
            document.body.appendChild(input);
            const self = this;
            input.onchange = async function(e) {
                const ready = await self._ensureJSZip();
                if (!ready) { console.error("JSZip加载失败"); document.body.removeChild(input); return; }
                const f = e.target.files[0];
                if (!f) { document.body.removeChild(input); return; }
                try {
                    const zip = await JSZip.loadAsync(f);
                    const ctx = await self.getAudioContext();
                    self.cacheA[targetTrack] = {};
                    self.trackMeta[targetTrack] = {};
                    self.trackMissingFiles[targetTrack] = [];
                    const manifestFile = zip.file("manifest.json");
                    const syllableList = [];
                    if (manifestFile) {
                        try {
                            const txt = await manifestFile.async("string");
                            const manifest = JSON.parse(txt);
                            self.trackMeta[targetTrack] = manifest;
                            if (manifest.syllableList) {
                                for (let si = 0; si < manifest.syllableList.length; si++) syllableList.push(manifest.syllableList[si]);
                            }
                            console.log("manifest加载成功", manifest.libName);
                        } catch (err) { console.warn("manifest.json解析失败", err); }
                    }
                    const fileList = Object.keys(zip.files);
                    const insideWavSet = new Set();
                    for (let fi = 0; fi < fileList.length; fi++) {
                        const fname = fileList[fi];
                        const zf = zip.files[fname];
                        if (zf.dir) continue;
                        const lfname = fname.toLowerCase();
                        if (!(lfname.endsWith(".wav") || lfname.endsWith(".mp3"))) continue;
                        const baseName = fname.split("/").pop();
                        insideWavSet.add(baseName);
                        const ab = await zf.async("arraybuffer");
                        const audioBuf = await ctx.decodeAudioData(ab);
                        self.cacheA[targetTrack][baseName] = audioBuf;
                    }
                    const missing = [];
                    for (let s = 0; s < syllableList.length; s++) {
                        if (!insideWavSet.has(syllableList[s])) missing.push(syllableList[s]);
                    }
                    self.trackMissingFiles[targetTrack] = missing;
                    console.log("ZIP声库导入完成", targetTrack, "缺失:", missing);
                } catch (err) {
                    console.error("ZIP导入异常", err);
                }
                document.body.removeChild(input);
            };
            input.click();
        }

        async deleteTrackA(args) {
            const tn = args.TRACK;
            delete this.cacheA[tn];
            delete this.trackMeta[tn];
            delete this.trackMissingFiles[tn];
        }
        async clearAllA() { this.cacheA = {}; this.trackMeta = {}; this.trackMissingFiles = {}; }
        async clearAllB() { this.cacheB = {}; }
        async copyTrackAtoA(args) {
            const src = args.SRC, dst = args.DST;
            if (!this.cacheA[src]) return;
            this.cacheA[dst] = Object.assign({}, this.cacheA[src]);
            if (this.trackMeta[src]) this.trackMeta[dst] = Object.assign({}, this.trackMeta[src]);
            if (this.trackMissingFiles[src]) this.trackMissingFiles[dst] = this.trackMissingFiles[src].slice();
        }

        getTrackAInfo(args) {
            const tn = args.TRACK;
            const trackData = this.cacheA[tn];
            if (!trackData || Object.keys(trackData).length === 0) return "未导入";
            const missing = this.trackMissingFiles[tn] || [];
            if (missing.length === 0) return "校验通过";
            return "缺失:" + missing.join(",");
        }

        listAudioFile(args) {
            const tn = args.TRACK;
            if (!this.cacheA[tn]) return "";
            return Object.keys(this.cacheA[tn]).join(",");
        }

        async previewAudio(args) {
            const tn = args.TRACK, fname = args.FILE;
            if (!this.cacheA[tn] || !this.cacheA[tn][fname]) return;
            const ctx = await this.getAudioContext();
            const src = ctx.createBufferSource();
            src.buffer = this.cacheA[tn][fname];
            src.connect(ctx.destination);
            src.start();
        }

        async previewPitchShifted(args) {
            const tn = args.TRACK, fname = args.FILE;
            const semi = parseFloat(args.SEMI) || 0;
            if (!this.cacheA[tn] || !this.cacheA[tn][fname]) return;
            const ctx = await this.getAudioContext();
            const sourceBuf = this.cacheA[tn][fname];
            const curve = [[0, semi], [sourceBuf.duration, semi]];
            const processed = this._pitchShiftPSOLA(sourceBuf, curve);
            const src = ctx.createBufferSource();
            src.buffer = processed;
            src.connect(ctx.destination);
            src.start();
        }

        async setBSpeed(args) {
            const tn = args.TRACK;
            const spd = Number(args.SPEED) || 1;
            if (!this.cacheB[tn]) this.cacheB[tn] = {};
            this.cacheB[tn].speed = spd;
        }

        getRawAudioFileVolumeAtTime(args) {
            return this.getRawAudioFileVolumeAtTime(
                Scratch.Cast.toString(args.TRACK),
                Scratch.Cast.toString(args.FILENAME),
                Scratch.Cast.toNumber(args.SEC)
            );
        }

        // ========== 核心渲染：先混音 → 全局变调 → 全局变速 ==========
        async renderFromJSON(args) {
            console.log("【渲染入口】renderFromJSON 启动");
            try {
                const jsonStr = args.JSONDATA;
                const globalSpeed = parseFloat(args.SPEED) || 1;
                let task;
                try {
                    task = JSON.parse(jsonStr);
                    console.log("【JSON解析】片段数:", (task["片段列表"] || []).length, "锚点数:", (task["轨道全局音高锚点"] || []).length);
                } catch (parseErr) {
                    console.error("JSON解析失败：", parseErr);
                    this.renderFinished = false;
                    return;
                }

                const ctx = await this.getAudioContext();
                const fadeSwitchEnabled = this.getSwitchState({ SWITCHNAME: "启用自动淡入淡出" });
                const globalPitchAnchors = task["轨道全局音高锚点"] || [];
                const hasGlobalPitch = Array.isArray(globalPitchAnchors) && globalPitchAnchors.length > 0;
                const clipList = Array.isArray(task["片段列表"]) ? task["片段列表"] : [];
                console.log("待渲染片段数量：", clipList.length, "全局变速:", globalSpeed);

                this.accumulateBuffer = null;
                this.renderFinished = false;

                // 第一步：片段混音（只做时长拉伸+淡入淡出）
                for (let c = 0; c < clipList.length; c++) {
                    const clip = clipList[c];
                    const srcTrack = clip["来源A声库轨道"];
                    const audioFileName = clip["音频文件"];
                    const startSec = parseFloat(clip["轨道全局起始秒"]) || 0;
                    const playDuration = parseFloat(clip["播放时长"]) || 0;
                    const volPercent = Number(clip["音量%"]) || 100;
                    const fadeInSec = parseFloat(clip["淡入秒"]) || 0;
                    const fadeOutSec = parseFloat(clip["淡出秒"]) || 0;

                    if (!srcTrack || !audioFileName) { console.warn("片段缺少声库或文件名，跳过", clip); continue; }
                    const voiceLib = this.cacheA[srcTrack];
                    if (!voiceLib) { console.warn("声库轨道不存在：", srcTrack); continue; }
                    const sourceBuf = voiceLib[audioFileName];
                    if (!sourceBuf) { console.warn("采样文件缺失：", audioFileName); continue; }

                    let useBuf = sourceBuf;
                    const actualDuration = playDuration > 0 ? playDuration : sourceBuf.duration;

                    if (playDuration > 0 && Math.abs(playDuration - useBuf.duration) > 0.001) {
                        const scaleRatio = actualDuration / useBuf.duration;
                        if (scaleRatio >= 0.8 && scaleRatio <= 1.2) {
                            useBuf = this._solaStretch(useBuf, actualDuration);
                        } else if (scaleRatio > 1.2) {
                            useBuf = this._safeLoopStretch(useBuf, actualDuration);
                        } else {
                            useBuf = this._trimBuffer(useBuf, actualDuration);
                        }
                    }

                    if (fadeSwitchEnabled && (fadeInSec > 0 || fadeOutSec > 0)) {
                        useBuf = this._applyCustomFade(useBuf, fadeInSec, fadeOutSec);
                    } else if (fadeSwitchEnabled) {
                        useBuf = this.applyFade(useBuf);
                    }

                    console.log("片段" + (c+1) + " [" + audioFileName + "] " +
                        startSec.toFixed(3) + "~" + (startSec + actualDuration).toFixed(3) + "s" +
                        " 源长" + sourceBuf.duration.toFixed(3) + "s" +
                        " 处理后" + useBuf.duration.toFixed(3) + "s 音量" + volPercent + "%");

                    this.mixAtTime(useBuf, startSec, volPercent);
                }

                if (!this.accumulateBuffer) {
                    console.error("渲染结果为空");
                    this.renderFinished = false;
                    return;
                }
                console.log("【混音完成】未变调轨道时长:", this.accumulateBuffer.duration.toFixed(3) + "s");

                // 第二步：全局 PSOLA 变调
                if (hasGlobalPitch) {
                    this.accumulateBuffer = this._globalPitchProcess(this.accumulateBuffer, globalPitchAnchors);
                    console.log("【全局变调完成】时长:", this.accumulateBuffer.duration.toFixed(3) + "s");
                }

                // 第三步：全局变速（SOLA 整轨拉伸，保持音高）
                if (globalSpeed !== 1 && Math.abs(globalSpeed - 1) > 0.001 && this.accumulateBuffer) {
                    const originalDuration = this.accumulateBuffer.duration;
                    const targetDuration = originalDuration / globalSpeed;
                    console.log("【全局变速】原长:" + originalDuration.toFixed(3) + "s 目标:" + targetDuration.toFixed(3) + "s 倍率:" + globalSpeed + "x");
                    const speedRatio = targetDuration / originalDuration;
                    if (speedRatio >= 0.8 && speedRatio <= 1.2) {
                        this.accumulateBuffer = this._solaStretch(this.accumulateBuffer, targetDuration);
                    } else if (speedRatio > 1.2) {
                        this.accumulateBuffer = this._safeLoopStretch(this.accumulateBuffer, targetDuration);
                    } else {
                        this.accumulateBuffer = this._trimBuffer(this.accumulateBuffer, targetDuration);
                    }
                    console.log("【全局变速完成】最终时长:", this.accumulateBuffer.duration.toFixed(3) + "s");
                }

                this.renderFinished = true;
                console.log("✅渲染完成，总时长：", this.accumulateBuffer.duration.toFixed(3) + "s");
            } catch (e) {
                console.error("渲染异常：", e);
                this.renderFinished = false;
            }
        }

        renderAccumulateTrack() { console.warn("renderAccumulateTrack 暂未实现"); }

        async uploadAccumulateAudio(args) {
            if (!this.accumulateBuffer || !this.renderFinished) { console.error("无渲染结果，无法上传"); return; }
            try {
                const wavBlob = this.audioBufferToWav(this.accumulateBuffer);
                const formData = new FormData();
                formData.append("file", wavBlob, (args.fileName || "output") + ".wav");
                const resp = await fetch(args.postUrl, { method: "POST", body: formData });
                if (resp.ok) console.log("上传成功", await resp.text());
                else console.error("上传失败，状态码：", resp.status);
            } catch (e) { console.error("上传请求异常", e); }
        }

        async clearAccumulateBuffer() {
            this.accumulateBuffer = null;
            this.renderFinished = false;
            this._cachedWavBase64 = "";
        }

        validateJSON(args) {
            try { JSON.parse(args.JSONTEXT); return true; } catch (e) { return false; }
        }

        async loadJSONtoB(args) {
            try {
                const obj = JSON.parse(args.JSONTEXT);
                const bt = args.BTRACK;
                if (!this.cacheB[bt]) this.cacheB[bt] = {};
                this.cacheB[bt].data = obj;
                this.cacheB[bt].speed = Number(args.SPEED) || 1;
            } catch (err) { console.error("载入B轨道JSON失败", err); }
        }

        hasRenderAudio() { return !!this.accumulateBuffer && this.renderFinished; }
        getRenderDuration() { return this.accumulateBuffer ? this.accumulateBuffer.duration : 0; }
    }

    Scratch.extensions.register(new VocalSyntheExtension());
})(Scratch);
