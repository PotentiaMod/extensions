(async function (Scratch) {
  "use strict";

  // Google Noto Emoji
  const speakerUri = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiB2aWV3Qm94PSIwIDAgMTI4IDEyOCI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYmRiZGJkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSI1Ij48cGF0aCBkPSJNMTEyLjQ5IDgxLjg5YzEzLjMxLTE4LjAzIDEyLjM4LTQzLjYxLTMuNDQtNjAuNjVDOTMuMjMgNC4xOSA2Ny43OSAxLjM1IDQ4LjgyIDEzLjI5Ii8+PHBhdGggZD0iTTEwMi42NyA3MS4xNWM3LjY2LTEyLjQ3IDYuNDUtMjkuMDMtNC00MC4yOFM3MS44IDE3LjE2IDU4LjggMjMuODgiLz48cGF0aCBkPSJNOTIuNDcgNTkuNjRjMi4xMS02LjQ1Ljc2LTEzLjgyLTQuMTctMTkuMTRjLTQuOTQtNS4zMi0xMi4xOS03LjIyLTE4Ljc4LTUuNTkiLz48L2c+PHBhdGggZmlsbD0iI2MxYzFjMSIgZD0iTTkzLjQzIDk4LjUycy0yMy42Ni02LjIxLTQxLjIxIDEwLjQyYy03LjU1IDcuMTYtMTIuODkgMTIuNDctMTQuMTggMTMuNzZjLTQuMDMgNC4wMy0xNC40IDIuOTYtMjQuNDctNy4xMXMtMTEuNjMtMjIuMS03LjYtMjYuMTJjLjYtLjYgNy4zNC02LjU5IDE0LjgyLTE0LjVjNy45OS04LjQ2IDYuNTUtMjAuMjcgNy4wNi0yNy41NmMuNjEtOC43NiAyLjIyLTEyLjIzIDIuMjItMTIuMjN6Ii8+PGVsbGlwc2UgY3g9IjYxLjc2IiBjeT0iNjYuODQiIGZpbGw9IiM5Nzk3OTciIHJ4PSIxNy45MiIgcnk9IjQ0LjgiIHRyYW5zZm9ybT0icm90YXRlKC00NS4wMDEgNjEuNzU4IDY2LjgzNykiLz48cGF0aCBmaWxsPSIjNzE3MTcxIiBkPSJNODAuNzMgNjMuNjRzLTE3LjM2IDEzLjYxLTguMTcgMzIuNjdMNDAuMzcgNjkuNjlsLTEyLjQtMjYuODFsMi4xMS03LjcxbDEwLjE1LTIuNWwxNS42NiA3LjgzbDE4LjU0IDEzLjY3eiIvPjxwYXRoIGZpbGw9IiNjMWMxYzEiIGQ9Im00My45MiA3MC4wMWw4LjctNS45N2wxMi4xIDEyLjFsLTUuMjIgOS4yOGMtOS40Mi03LjQtMTUuNTgtMTUuNDEtMTUuNTgtMTUuNDEiLz48ZWxsaXBzZSBjeD0iNTguNjciIGN5PSI3MC4wOSIgZmlsbD0iI2RiZGJkYiIgcng9IjQuMDYiIHJ5PSI4LjU2IiB0cmFuc2Zvcm09InJvdGF0ZSgtNDUuMDAxIDU4LjY2OSA3MC4wOSkiLz48cGF0aCBmaWxsPSIjZGJkYmRiIiBkPSJNMjMuNTkgNzkuMDJjMy4zNC00LjM2IDMuNi02LjU1IDQuNzMtMTEuOTNjMy4xOSA2Ljk3IDguNDEgMTMuOTkgMTQuNDggMTguNjdjLTIuNjkuOTItMy4wMS0uOTYtNS41MS40Yy0yLjA4IDEuMTMtMy45OSAyLjU0LTUuODUgNC4wMWMtNC4yMiAzLjMxIDEuOS0yLjAzLTEuOCAxLjc1Yy0uNi42Mi02LjA1IDYuMzctNi4wNSA2LjM3cy0zLjMxLS41Ny00LjI3LTIuMTNjLS41OC0uOTUtMi4xMy04LjExLTIuMTMtOC4xMXM1LjQxLTcuNzQgNi40LTkuMDMiLz48cGF0aCBmaWxsPSIjYzFjMWMxIiBkPSJNMjMuNTcgMTIyLjc1Yy0uMDQtLjAxLS4wOS0uMDEtLjE1LS4wM2MtLjAxIDAtLjAyIDAtLjAzLS4wMWMtLjAxIDAtLjAzLS4wMS0uMDUtLjAxYy4xMy4wNi4yNi4xMi4zOC4xOGwtLjEtLjEzYy0uMDIuMDEtLjAzIDAtLjA1IDBNNTMuNiAxMDcuN2MtLjQ1LjM5LS45MS43OS0xLjM4IDEuMjRjLjQ2LS40My45Mi0uODQgMS4zOC0xLjI0Ii8+PHBhdGggZmlsbD0iI2VhZWFlYSIgZD0iTTIwLjQ2IDEyMi4yMnEtLjEwNS0uMDE1LS4xOC0uMDN6bS44MS4xNGMtLjI4LS4wNS0uNTYtLjA5LS44MS0uMTRjLjIzLjA0LjUuMDkuODEuMTRtLTEuMjItLjIxYy0uMTItLjAyLS4yMy0uMDQtLjMxLS4wNWMuMDkuMDIuMTkuMDMuMzEuMDVtLjIzLjA0Yy0uMDgtLjAxLS4xNi0uMDMtLjIzLS4wNGMuMDcuMDIuMTQuMDMuMjMuMDRtMi4zMi40Yy0uMTMtLjAyLS4yNS0uMDQtLjM3LS4wNmMuMTMuMDEuMjUuMDQuMzcuMDZtLjU3LjA5Yy0uMTYtLjAzLS4zNS0uMDYtLjU3LS4xYy4xOC4wNC4zNy4wNy41Ny4xbS0xLjI1LS4yMWMtLjI0LS4wNC0uNDYtLjA4LS42NS0uMTFjLjIyLjA0LjQ0LjA3LjY1LjExbS4zMS4wNWMtLjEtLjAyLS4yLS4wMy0uMzEtLjA1Yy4xLjAyLjIxLjA0LjMxLjA1bS0yLjYzLS40NGMtLjA0LS4wMS0uMDYtLjAxLS4wOC0uMDFjLjAyIDAgLjA1IDAgLjA4LjAxbTM1LjMxLTE1LjQzYy0uNDMuMzMtLjg2LjY3LTEuMyAxLjA1Yy40Mi0uMzcuODYtLjcgMS4zLTEuMDVNMTkuNzQgMTIyLjFjLS4wNi0uMDEtLjEtLjAyLS4xNC0uMDJjLjA0LjAxLjA5LjAxLjE0LjAybS0uMjEtLjAzcS0uMDMtLjAxNSAwIDBtNC4wNC42OGMuMDIgMCAuMDMuMDEuMDUuMDFjMCAwLS4wMi0uMDEtLjA1LS4wMW0tLjIzLS4wNGMuMDIgMCAuMDMuMDEuMDUuMDFjLS4wMiAwLS4wNC0uMDEtLjA1LS4wMW0uMDQuMDFjLjAxIDAgLjAyIDAgLjAzLjAxYy0uMDEtLjAxLS4wMi0uMDEtLjAzLS4wMW0uMDMgMHEuMTA1LjAxNS4xNS4wM2MtLjA1LS4wMS0uMDktLjAyLS4xNS0uMDMiLz48cGF0aCBmaWxsPSIjOGE4YThhIiBkPSJtMzcuMzIgMTIzLjMxbC0uMjEuMTV6bS0xLjk4IDEuMDJjLS4xMi4wNC0uMjUuMDgtLjM3LjEyYy4xMy0uMDQuMjUtLjA4LjM3LS4xMm0tMy40LjU0Yy0uNDggMC0uOTgtLjAxLTEuNDktLjA2Yy41MS4wNCAxLjAxLjA2IDEuNDkuMDZtMjAuNDItMTYuMDVjLS4wNS4wNC0uMDkuMDgtLjE0LjEyYy4wNS0uMDQuMS0uMDguMTQtLjEybS0yOC43NCAxMy45NGM5LjI2IDEuNTYgMTIuMTQtMS45MiAxMi4xNC0xLjkyYzMuMzUtMy44MiA5Ljk5LTEwLjQ2IDEyLjgyLTEzLjI2Yy02LjE2LTIuMjUtMTEuODQtNS42Mi0xNi42MS0xMC4zOGMtNS43NC01Ljc0LTEwLjMxLTE0LjA3LTEyLjQ0LTIwLjkxYy02Ljk3IDcuMjYtMTMgMTIuNjItMTMuNTcgMTMuMTljLTQuMDMgNC4wMy0yLjQ3IDE2LjA1IDcuNiAyNi4xMmM1LjkgNS45IDExLjg4IDguNjkgMTYuNjUgOS4xOWMtMS45OS0uMjItNC4xOS0uODMtNi41MS0xLjl6Ii8+PHBhdGggZmlsbD0iIzk3OTc5NyIgZD0iTTQyLjc5IDExOC4wMmMtLjkyLjg5LTEuNzIgMS42OC0yLjQgMi4zNmMuNjgtLjY3IDEuNDgtMS40NiAyLjQtMi4zNm0tNi42NiA1Ljk5Yy0uMjUuMTItLjUyLjIyLS43OS4zMmMuMjgtLjEuNTQtLjIuNzktLjMybS45OC0uNTVjLS4yNi4xOC0uNTQuMzQtLjgzLjQ5Yy4yOS0uMTUuNTctLjMyLjgzLS40OW0tNi42NiAxLjM0Yy0uMDctLjAxLS4xNC0uMDEtLjIyLS4wMmMuMDcuMDEuMTUuMDIuMjIuMDJtMy4wOS0uMDVjLS4xOS4wMy0uMzguMDUtLjU3LjA3Yy4xOS0uMDIuMzgtLjA0LjU3LS4wN20tMS4yNC4xMWgtLjM2cS4xOC4wMTUuMzYgMG0yLjY3LS40MWMtLjI1LjA3LS41MS4xNC0uNzguMTljLjI3LS4wNi41My0uMTIuNzgtLjE5Ii8+PHBhdGggZmlsbD0iIzRmNGY0ZiIgZD0iTTM1Ljc3IDEyMC44M3MtMi44OSAzLjQ5LTEyLjE0IDEuOTJsLjEuMTNjMi4zMiAxLjA3IDQuNTIgMS42OCA2LjUxIDEuOWMuMDcuMDEuMTQuMDEuMjIuMDJjLjUxLjA1IDEuMDEuMDcgMS40OS4wNmguMzZjLjIzLS4wMS40NS0uMDMuNjYtLjA0Yy4xOS0uMDIuMzgtLjA0LjU3LS4wN2MuMjItLjAzLjQ0LS4wNy42Ni0uMTFjLjI3LS4wNi41My0uMTIuNzgtLjE5Yy4xMy0uMDQuMjUtLjA4LjM3LS4xMmMuMjctLjA5LjU0LS4yLjc5LS4zMmMuMDUtLjAyLjEtLjA0LjE0LS4wNmMuMy0uMTUuNTctLjMxLjgzLS40OWwuMjEtLjE1Yy4yNi0uMTkuNTEtLjM5LjczLS42MWMuNC0uNCAxLjItMS4yIDIuMzQtMi4zMmMuNjgtLjY3IDEuNDktMS40NiAyLjQtMi4zNmMuMy0uMy42Mi0uNjEuOTUtLjkzYzIuMy0yLjI0IDUuMTgtNS4wMiA4LjQ5LTguMTVjLjA1LS4wNC4wOS0uMDguMTMtLjEyYy0xLjI4LS4zNi0yLjUzLS43OS0zLjc3LTEuMjRjLTIuODMgMi44LTkuNDcgOS40NC0xMi44MiAxMy4yNSIvPjxwYXRoIGZpbGw9IiNlYWVhZWEiIGQ9Ik03MS42MyA5OC42M2MtMS4wMi0uNDctMi4wOS0xLjAyLTMuMTUtMS42NGMtNi4wMi0zLjU0LTExLjY2LTcuMDctMTEuNjYtNy4wN2MuNTQgMS45Mi0uMTggMi44OCAyLjU5IDUuMjljMS45OSAxLjcyIDEuNSA0Ljk1LS45IDZjLTQuODMgMi4xMi03LjM2IDMuNzgtOC41OSA1LjA1YzAgMC0uNS41LTEuMzMgMS4zMmMxLjI0LjQ1IDIuNS44OCAzLjc3IDEuMjRjLjQyLS40Ljg0LS43NiAxLjI0LTEuMTFjLjQzLS4zNy44Ny0uNzEgMS4zLTEuMDVjOC44Ny02LjgyIDE0LjExLTIuNDEgMjUuMDUtNS4yNWMwLS4wMS0zLjc5LS42OS04LjMyLTIuNzhtLTEwLjUyIDMuOTNxLTEuMDIuNTU1LTIuMDQgMS4xN3ExLjAwNS0uNjE1IDIuMDQtMS4xN20tMi4wOCAxLjE5Yy0xLjM5Ljg1LTIuNzcgMS44Mi00LjEyIDIuODljMS4zNS0xLjA3IDIuNzMtMi4wMyA0LjEyLTIuODltOS4yOS00LjIxYy40LS4xMi43OS0uMjYgMS4xOS0uMzdjLS4zOS4xMi0uNzkuMjUtMS4xOS4zN20tNy4wOSAyLjk2Yy42NS0uMzUgMS4zMS0uNjcgMS45Ni0uOThjLS42NS4zLTEuMzEuNjMtMS45Ni45OG0yLjI0LTEuMTFjLjYxLS4yOCAxLjIxLS41NCAxLjgyLS43OGMtLjYuMjQtMS4yMS41MS0xLjgyLjc4bTIuMzQtLjk3Yy41My0uMiAxLjA2LS40MSAxLjU5LS41OGMtLjUzLjE3LTEuMDYuMzctMS41OS41OCIvPjxwYXRoIGZpbGw9IiNjMWMxYzEiIGQ9Ik0yMCA4My4zNUMxNC4yOCA4OS40MiA3Ljc4IDk2LjA5IDcuNzggOTYuMDlzLS4zOCA1LjU2IDQuOCAxMS44MWMwIDAgNy4wMi03LjAyIDEzLjUyLTEzLjI5Yy0zLjY3LTQuNTctNS4zOC04LjkzLTYuMS0xMS4yNiIvPjxwYXRoIGZpbGw9IiNlMWUxZTEiIGQ9Ik05NS4yNiAxMDAuMzRjLTguMjYgOC4yNi0yOC45LjA5LTQ3Ljk5LTE5LjAxQzI4LjE3IDYyLjIzIDIwIDQxLjYgMjguMjYgMzMuMzRzMjcuMDcgMS43MyA0Ni4xNyAyMC44M2MxOS4wOSAxOS4xIDI5LjA5IDM3LjkxIDIwLjgzIDQ2LjE3TTMxLjkgMzYuOTljLTUuMTMgNS4xMyAxLjQxIDIzLjExIDE5LjAxIDQwLjdzMzUuNTcgMjQuMTQgNDAuNyAxOS4wMVM5MC4yIDczLjU5IDcyLjYgNTZTMzcuMDMgMzEuODYgMzEuOSAzNi45OSIvPjxwYXRoIGZpbGw9IiNkYmRiZGIiIGQ9Ik0zMi4wMSA1My42NGMuOTMgMi4wMyAyLjI1IDcuMjkgMTIuMTYgMTkuMDNjLjM0LjQgMS43NCAyLjIxLjg1IDMuMWMtLjU5LjU5LTEuNjctLjEzLTIuOTEtMS4zN2MtNC44NC00Ljg0LTkuMzctMTAuOTctMTIuNzctMTguMWMtMS45Mi00LjAzIDEuMzgtNS40NiAyLjY3LTIuNjYiLz48L3N2Zz4=`;

  const speechSynthesis = window.speechSynthesis;

  // Made by ddededodediamante
  class SpeechSynthesisExtension {
    constructor() {
      this.pitch = 1;
      this.rate = 1;
      this.volume = 1;
      this.voice = null;
      this.voices = [];

      speechSynthesis.onvoiceschanged = () => {
        this.voices = speechSynthesis.getVoices();

        if (!this.voice && this.voices.length > 0) {
          this.voice = this.voices[0];
        }
      };
    }

    allVoices() {
      return this.voices.map((v) => v.name);
    }

    getInfo() {
      return {
        id: "ddeSpeechSynthesis",
        name: "Speech Synthesis",
        color1: "#5595aa",
        blockIconURI: speakerUri,
        blocks: [
          {
            opcode: "speak",
            blockType: Scratch.BlockType.COMMAND,
            text: "speak [text]",
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello!",
              },
            },
          },
          {
            opcode: "action",
            blockType: Scratch.BlockType.COMMAND,
            text: "[action] speech",
            arguments: {
              action: {
                type: Scratch.ArgumentType.STRING,
                menu: "actions",
              },
            },
          },
          "---",
          {
            opcode: "setPitch",
            blockType: Scratch.BlockType.COMMAND,
            text: "set pitch to [pitch]",
            arguments: {
              pitch: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: "setRate",
            blockType: Scratch.BlockType.COMMAND,
            text: "set rate to [rate]",
            arguments: {
              rate: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: "setVolume",
            blockType: Scratch.BlockType.COMMAND,
            text: "set volume to [volume]",
            arguments: {
              volume: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
          {
            opcode: "setVoice",
            blockType: Scratch.BlockType.COMMAND,
            text: "set voice to [voiceName]",
            arguments: {
              voiceName: {
                type: Scratch.ArgumentType.STRING,
                menu: "voices",
              },
            },
          },
          "---",
          {
            opcode: "getVoices",
            blockType: Scratch.BlockType.REPORTER,
            text: "get available voices",
          },
        ],
        menus: {
          voices: {
            acceptReporters: false,
            items: "allVoices",
          },
          actions: {
            acceptReporters: true,
            items: ["stop", "pause", "resume"],
          },
        },
      };
    }

    speak({ text }) {
      if (!text || text === "") return;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = this.pitch;
      utterance.rate = this.rate;
      utterance.volume = this.volume;
      if (this.voice) utterance.voice = this.voice;

      speechSynthesis.speak(utterance);
    }

    action({ action }) {
      switch (action) {
        case "stop":
          return speechSynthesis.cancel();
        case "pause":
          return speechSynthesis.pause();
        case "resume":
          return speechSynthesis.resume();
      }
      speechSynthesis.pause();
    }

    setPitch({ pitch }) {
      this.pitch = Math.max(0, Math.min(2, pitch));
    }

    setRate({ rate }) {
      this.rate = Math.max(0.1, Math.min(10, rate));
    }

    setVolume({ volume }) {
      this.volume = Math.max(0, Math.min(1, volume));
    }

    setVoice({ voiceName }) {
      const selectedVoice = this.voices.find((v) => v.name === voiceName);
      if (selectedVoice) this.voice = selectedVoice;
    }

    getVoices() {
      return JSON.stringify(this.allVoices());
    }
  }

  Scratch.extensions.register(new SpeechSynthesisExtension());
})(Scratch);
