/*
==================================================YUSHIFISHISH EXTJS============================================================================
AUTHOR @FISHISHOUO @孟夫子驾到
COPYRIGHT 2018-NOW YUSHIFISHISH FISHISHOUO ALL RIGHTS RESERVED
THANKS @孟夫子驾到
EXTENSION FOR BILIBILI VIDEOS
PROXY
现在是我自己的
    https://corsproxy.yushifishish.dpdns.org/?url=
API
    https://api.mir6.com/api/bzjiexi?myKey=3c27354b2b5c72c32c22f66e5de609ec
YUSHIFISHISH! SUKI!! LOVE!!! >w<
==================================================SCRATCH EXTENTIONS============================================================================
*/
let Skin;
try {Skin = Scratch.runtime.renderer.exports.Skin;}
catch (e) {
    try {Skin = Scratch.vm.renderer.exports.Skin}
    catch (e2){this.addOperationLog('extension::init', 'Failed to get Skin class: ' + e2.message, 'error');}
}
export class VideoSkin extends Skin {
    constructor(id, renderer, video) {
        super(id);
        this.gl = renderer.gl;
        this.renderer = renderer;
        this._texture = this.gl.createTexture();
        this.size = [video.videoWidth * 0.5, video.videoHeight * 0.5]; //按照舞台校准
        this._rotationCenter = [this.size[0] / 2, this.size[1] / 2];
        this.video = video;
    }
    set size(size) {this._size = size;}
    get size() {return this._size;}
    getTexture(scale) {
        this.size = [this.video.videoWidth * 0.5, this.video.videoHeight * 0.5];
        this._rotationCenter = [this.size[0] / 2, this.size[1] / 2];
        this.gl.bindTexture(this.gl.TEXTURE_2D, this._texture);
        if (!this.video) return
        this.gl.texImage2D(this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            this.video
        );
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        requestAnimationFrame(() => this.emit(Skin.Events.WasAltered)); // request next frame
        return this._texture;
    }
    dispose() {super.dispose();}
}
class ImageSkinFromBase64 extends Skin {
    constructor(id, renderer, dataUrl) {
        super(id);
        this.renderer = renderer;
        this.gl = renderer.gl;
        this._texture = this.gl.createTexture();
        this._dataUrl = dataUrl;
        this._image = null;
        this._loaded = false;
        this._size = [0, 0];
        this._rotationCenter = [0, 0];
        const img = new Image();
        const self = this;
        img.onload = function() {
            self._image = this;
            self._loaded = true;
            self._size = [this.width * 0.5, this.height * 0.5];
            self._rotationCenter = [self._size[0] / 2, self._size[1] / 2];
            self.emit(Skin.Events.WasAltered);
        };
        img.src = dataUrl;
    }
    get size() {return this._size;}
    get rotationCenter() {return this._rotationCenter;}
    getTexture(scale) {
        if (!this._loaded || !this._image) return null;
        this.gl.bindTexture(this.gl.TEXTURE_2D, this._texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this._image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        return this._texture;
    }
    dispose() {super.dispose();}
}
(function (Scratch) {
    const {translate,extensions,vm,runtime} = Scratch;
    //if( vm.runtime.platform.name === 'Gandi' && vm.runtime.platform.url === 'https://getgandi.com/') console.log("BilibiliVideoEXT load successful in GandiIDE")
    //else{alert('你用在了错误的编辑器，请支持GandiIDE');return}
    const extension_block_icon = "https://m.ccw.site/user_projects_assets/4ba7d3eea5c5846e8fd3e6ef6ff43056.png"
    const extension_menu_icon = "https://m.ccw.site/user_projects_assets/a5d5c881de9065b577772614a03161e8.png"
    const extension_extend_icon = "https://m.ccw.site/user_projects_assets/26f77810f7a24047b6aff28bd044cfe0.png"
    const extension_id = 'BilibiliVideoEXT';
    const extension_exampleVideoID = 'BV1Ri5J6nEGk';
    class BilibiliVideoExtension {
        constructor(runtime) {
            alert("因为最新的Gandi要求，现在已经无法直接使用该扩展，必须使用脚本跨过CSP。只需跨过csp扩展基本功能可用。我们将在下一个大版本（我有没有时间还是个问题）回用之前的覆盖网页机制，确保在下个版本重新用原来的方法运用B站视频扩展。现在人要使用的话你可以点击扩展不可用按钮跳转到创作者学院文章（简短）以获得更多的信息，或者加入Gandi反馈交流群和白猫的项目大会群（以获得跨过csp的方法，吗）。联系我：QQ 3899512800 …总之谢谢大家理解和以前的支持！希望大家不要放弃本扩展！              FishishOuO 8月29日13:25:33")
            this.runtime = runtime || {};
            this.videos = {};
            this.cachedVideoData = {};
            this.limit = 0;
            this.uapi = [
                "https://corsproxy.yushifishish.dpdns.org/?url="
            ];
            this.apivideo = 0;
            runtime.on('PROJECT_STOP_ALL', () => { this.stopVideo({ VIDEO_ID: 'ALL' }) });
            runtime.on('RUNTIME_PAUSED', () => { this.pauseVideo({ VIDEO_ID: 'ALL' }) });
            runtime.on('PROJECT_RUN_PAUSE', () => { this.pauseVideo({ VIDEO_ID: 'ALL' }) });
            runtime.on('RUNTIME_UNPAUSED', () => { this.resumeVideo({ VIDEO_ID: 'ALL' }) });
            runtime.on('PROJECT_RUN_RESUME', () => { this.resumeVideo({ VIDEO_ID: 'ALL' }) });
        }
        getInfo() {
            translate.setup({
                "zh": {
                    "BilibiliVideoEXT_extensionName": "B站视频扩展",
                    "BilibiliVideoEXT_extensionDescription": "使用网页覆盖播放B站视频链接或者base64视频~ 并且可以获取视频内容哦~ ",
                    "BilibiliVideoEXT_label_aboutExtension": "*关于此扩展",
                    "BilibiliVideoEXT_btn_terms": "神秘使用条款",
                    "BilibiliVideoEXT_label_tip1": "*鼠标停留在积木上可显示教程说明,",
                    "BilibiliVideoEXT_label_tip2": "*鼠标如果按下视频页面按下按键将控制视频而不是舞台.",
                    "BilibiliVideoEXT_label_playBilibili": "*播放b站视频",
                    "BilibiliVideoEXT_label_dustbin": "*废弃积木",

                    "BilibiliVideoEXT_playBilibiliVideo_text": "播放b站视频 [BILIBILI_ID] 并命名为 [NEW_ID]",
                    "BilibiliVideoEXT_playBilibiliVideo_tooltip": "播放b站视频 [VIDEO_ID] 并命名为[NEW_ID]\n（可以播放BV AV视频，输入格式错误会提示，ID可以用,分割）\n（BILIBILI_ID:'BV'.../'av'...;NEW_ID:~string,~string,~string,~elc./*BAN:'ALL'）\n在当前角色/背景生成一个B站视频，并用一个或者多个ID号命名",
                    
                    "BilibiliVideoEXT_playVideoById_text": "播放视频ID [VIDEO_ID]",
                    "BilibiliVideoEXT_playVideoById_tooltip": "播放视频ID [VIDEO_ID]\n（直接播放已存在的视频ID）\n（VIDEO_ID:~string,~string,~string,~elc.）\n播放指定ID的视频",
                    
                    "BilibiliVideoEXT_pauseVideo_text": "暂停ID [VIDEO_ID] 视频",
                    "BilibiliVideoEXT_pauseVideo_tooltip": "暂停ID [VIDEO_ID] 视频\n（暂停当前ID的视频）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n暂停ID对应的视频的播放",
                    
                    "BilibiliVideoEXT_resumeVideo_text": "继续ID [VIDEO_ID] 视频",
                    "BilibiliVideoEXT_resumeVideo_tooltip": "继续ID [VIDEO_ID] 视频\n（继续播放已暂停的视频）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n恢复ID对应的视频的播放",
                    
                    "BilibiliVideoEXT_isVideoPaused_text": "视频ID [VIDEO_ID] 在暂停吗？",
                    "BilibiliVideoEXT_isVideoPaused_tooltip": "视频ID [VIDEO_ID] 在暂停吗？\n（检查ID对应的视频是否处于暂停状态）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n如果视频暂停返回 true，否则返回 false",
                    
                    "BilibiliVideoEXT_setVideoPlaybackRate_text": "设置ID [VIDEO_ID] 视频倍速为 [RATE]",
                    "BilibiliVideoEXT_setVideoPlaybackRate_tooltip": "设置ID [VIDEO_ID] 视频倍速为 [RATE]\n（倍速指视频播放速度，1.0为正常速度）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n设置ID对应的视频的播放速度",
                    
                    "BilibiliVideoEXT_getCurrentVideoTime_text": "视频ID [VIDEO_ID] 对应的视频播放到 [TIME_TYPE]",
                    "BilibiliVideoEXT_getCurrentVideoTime_tooltip": "视频ID [VIDEO_ID] 播放到 [TIME_TYPE]\n（ID对应ID对应的视频，不是输入BV AV）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n输出ID对应的视频的播放时间",
                    
                    "BilibiliVideoEXT_seekToTime_text": "将ID [VIDEO_ID] 视频切换到 [MINUTE] 分 [SECOND] 秒",
                    "BilibiliVideoEXT_seekToTime_tooltip": "将ID [VIDEO_ID] 视频切换到 [MINUTE] 分 [SECOND] 秒\n（切换视频播放位置到指定时间）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n设置ID对应的视频的当前播放时间",
                    
                    "BilibiliVideoEXT_stopVideo_text": "停止播放 ID [VIDEO_ID]",
                    "BilibiliVideoEXT_stopVideo_tooltip": "停止播放 ID [VIDEO_ID]\n（停止渲染）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n停止正在播放的视频并删除边界。\n对于渲染，停止视频之后要切换造型，扩展不会自动帮你把造型切换回去",
                    
                    "BilibiliVideoEXT_label_statusList": "*视频状态列表",
                    
                    "BilibiliVideoEXT_getList_text": "[CHOSEN] 列表",
                    "BilibiliVideoEXT_getList_tooltip": "[CHOSEN] 列表\n（列表是['...','...']这样的）输出列表",
                    
                    "BilibiliVideoEXT_getListCount_text": "[CHOSEN] 列表的项目数",
                    "BilibiliVideoEXT_getListCount_tooltip": "[CHOSEN] 列表的项目数\n（列表是['...','...']这样的）输出列表的项目数",
                    
                    "BilibiliVideoEXT_getListItem_text": "[CHOSEN] 列表的第 [NUMBER] 项",
                    "BilibiliVideoEXT_getListItem_tooltip": "[CHOSEN] 列表的第 [NUMBER] 项\n（列表是['...','...']这样的）输出列表的某个项",
                    
                    "BilibiliVideoEXT_getListHasItem_text": "[CHOSEN] 列表包含项目 [STRING] ?",
                    "BilibiliVideoEXT_getListHasItem_tooltip": "[CHOSEN] 列表包含项目 [STRING] ?\n（列表是['...','...']这样的）查找列表是否包含某个项目",
                    
                    "BilibiliVideoEXT_getListHasText_text": "[CHOSEN] 列表包含文本 [STRING] ?",
                    "BilibiliVideoEXT_getListHasText_tooltip": "[CHOSEN] 列表包含文本 [STRING] ?\n（列表是['...','...']这样的）查找列表是否包含某个文本，即使这不是一个项目",
                    
                    "BilibiliVideoEXT_getListItemCount_text": "[CHOSEN] 列表包含的项目 [STRING] 的新列表",
                    "BilibiliVideoEXT_getListItemCount_tooltip": "[CHOSEN] 列表包含的项目 [STRING] 的数量\n（列表是['...','...']这样的）输出列表包含项目的新列表",
                    
                    "BilibiliVideoEXT_getListTextCount_text": "[CHOSEN] 列表包含文本 [STRING] 的新列表",
                    "BilibiliVideoEXT_getListTextCount_tooltip": "[CHOSEN] 列表包含文本 [STRING] ?\n（列表是['...','...']这样的）输出列表包含文本的新列表",
                    
                    "BilibiliVideoEXT_listType_allID": "所有的视频ID",
                    "BilibiliVideoEXT_listType_nowID": "正在播放的视频ID",
                    "BilibiliVideoEXT_listType_base64ID": "注册为Base64视频的视频ID",
                    "BilibiliVideoEXT_listType_bilibiliVideoID": "注册为B站视频的视频ID（不是BV/AV）",
                    "BilibiliVideoEXT_label_bilibiliInfo": "*b站视频获取信息",
                    
                    "BilibiliVideoEXT_getCurrentVideoTitle_text": "ID [VIDEO_ID] 对应的视频的标题",
                    "BilibiliVideoEXT_getCurrentVideoTitle_tooltip": "ID [VIDEO_ID] 对应的视频的标题\n（ID对应ID对应的视频，不是输入BV AV）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n输出ID对应的视频的标题tag",
                    
                    "BilibiliVideoEXT_getCurrentVideoAuthor_text": "ID [VIDEO_ID] 对应的视频的UP主",
                    "BilibiliVideoEXT_getCurrentVideoAuthor_tooltip": "ID [VIDEO_ID] 对应的视频的UP主\n（ID对应ID对应的视频，不是输入BV AV）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n输出ID对应的视频的UP主tag",
                    
                    "BilibiliVideoEXT_getCurrentVideoStats_text": "ID [VIDEO_ID] 对应的视频的[STAT_TYPE]",
                    "BilibiliVideoEXT_getCurrentVideoStats_tooltip": "ID [VIDEO_ID] 对应的视频的[STAT_TYPE]\n（ID对应ID对应的视频，不是输入BV AV）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n输出ID对应的视频的标题[点赞,收藏,分享,播放量,弹幕数]",
                    
                    "BilibiliVideoEXT_getCurrentVideoStats_STAT_TYPE_default": "点赞",
                    
                    "BilibiliVideoEXT_getCurrentVideoDuration_text": "ID [VIDEO_ID] 对应的视频的时长",
                    "BilibiliVideoEXT_getCurrentVideoDuration_tooltip": "ID [VIDEO_ID] 对应的视频的时长\n（ID对应ID对应的视频，不是输入BV AV）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n输出ID对应的视频的时长",
                    
                    "BilibiliVideoEXT_getVideoTitle_text": "暂不可用 [BILIBILI_ID]视频的标题",
                    "BilibiliVideoEXT_getVideoTitle_tooltip": "[BILIBILI_ID]视频的标题\n（输入BV AV视频，输入格式错误会提示）\n输出指定视频的标题tag",
                    
                    "BilibiliVideoEXT_getVideoAuthor_text": "暂不可用 [BILIBILI_ID]视频的UP主",
                    "BilibiliVideoEXT_getVideoAuthor_tooltip": "[BILIBILI_ID]视频的UP主\n（输入BV AV视频，输入格式错误会提示）\n输出指定视频的UP主",
                    
                    "BilibiliVideoEXT_getVideoStats_text": "暂不可用 [BILIBILI_ID]视频的[STAT_TYPE]",
                    "BilibiliVideoEXT_getVideoStats_tooltip": "[BILIBILI_ID]视频的[STAT_TYPE]\n（输入BV AV视频，输入格式错误会提示）\n输出指定视频的[点赞,收藏,分享,播放量,弹幕数]",
                    
                    "BilibiliVideoEXT_getVideoStats_STAT_TYPE_default": "点赞",
                    
                    "BilibiliVideoEXT_getVideoDuration_text": "暂不可用 [BILIBILI_ID]视频的时长",
                    "BilibiliVideoEXT_getVideoDuration_tooltip": "暂不可用[BILIBILI_ID]视频的时长\n（输入BV AV视频，输入格式错误会提示）\n输出指定视频的时长tag",
                    
                    "BilibiliVideoEXT_showVideoCover_text": "暂不可用 显示B站视频 [BILIBILI_ID] 的封面图片",
                    "BilibiliVideoEXT_showVideoCover_tooltip": "显示B站视频 [BILIBILI_ID] 的封面图片\n（输入BV/AV格式的视频ID，在当前角色上显示封面）",
                    
                    "BilibiliVideoEXT_showCurrentVideoCover_text": "暂不可用 显示当前视频[VIDEO_ID]的封面图片",
                    "BilibiliVideoEXT_showCurrentVideoCover_tooltip": "显示当前视频[VIDEO_ID]的封面图片\n（VIDEO_ID:~string）\n（输入已播放视频的ID，在当前角色上显示封面）",
                    
                    "BilibiliVideoEXT_searchVideo_text": "暂不可用 搜索视频 [KEYWORD] 第 [PAGE] 页",
                    "BilibiliVideoEXT_searchVideo_tooltip": "搜索视频 [KEYWORD] 第 [PAGE] 页\n（根据关键词搜索B站视频）\n（关键词: 搜索关键词; 页码: 搜索结果页码）\n输出搜索结果列表，格式为JSON",
                    
                    "BilibiliVideoEXT_getCurrentVideoDesc_text": "ID [VIDEO_ID] 对应的视频的简介",
                    "BilibiliVideoEXT_getCurrentVideoDesc_tooltip": "ID [VIDEO_ID] 对应的视频的简介\n（ID对应ID对应的视频，不是输入BV AV）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n输出ID对应的视频的简介",
                    
                    "BilibiliVideoEXT_getVideoDesc_text": "暂不可用 [BILIBILI_ID]视频的简介",
                    "BilibiliVideoEXT_getVideoDesc_tooltip": "[BILIBILI_ID]视频的简介\n（输入BV AV视频，输入格式错误会提示）\n输出指定视频的简介",
                    
                    "BilibiliVideoEXT_label_playBase64": "*播放Base64视频",
                    "BilibiliVideoEXT_btn_uploadVideo": "上传视频并转换为Base64",
                    
                    "BilibiliVideoEXT_playVideoByBase64_text": "暂不可用 播放Base64视频 [BASE64_STR] 并命名为 [NEW_ID]",
                    "BilibiliVideoEXT_playVideoByBase64_tooltip": "播放Base64视频 [BASE64_STR] 并命名为 [NEW_ID]\n（NEW_ID:~string,~string,~string,~elc./*BAN:'ALL'）\nbase64是什么请搜百度\n播放base64视频",
                    
                    "BilibiliVideoEXT_base64ToScratch_text": "实验 转换 [MENU] 并将其中值为 [INPUT] 的“播放Base64视频”积木的值改为 [CHANGE]",
                    "BilibiliVideoEXT_base64ToScratch_tooltip": "转换 [MENU] 并将其中值为 [INPUT] 的“播放Base64视频”积木的值改为 [CHANGE]\n（project.json为作品文件解压包里面的作品主文件）将作品上传，将里面的内容修改再导出。",
                    
                    "BilibiliVideoEXT_chosenType_sc3": "Scratch作品",
                    
                    "BilibiliVideoEXT_getLastBase64String_text": "最后一次的Base64字符串",
                    "BilibiliVideoEXT_getLastBase64String_tooltip": "最后一次的Base64字符串\n（最后一次指刚刚播放/复制那一次，不会保存在作品中）\n输出最后一次播放/复制的base64字符串",
                    
                    "BilibiliVideoEXT_getBase64VideoSize_text": "当前 [VIDEO_ID] 视频大小(MB)",
                    "BilibiliVideoEXT_getBase64VideoSize_tooltip": "当前 [VIDEO_ID] 视频大小(MB)\n（MB MB 不是 KB）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n输出视频大小",
                    
                    "BilibiliVideoEXT_getBase64VideoType_text": "当前 [VIDEO_ID] 视频格式",
                    "BilibiliVideoEXT_getBase64VideoType_tooltip": "当前 [VIDEO_ID] 视频格式\n（video/xxx）\n（VIDEO_ID:~string,~string,~string,~elc./'ALL'）\n输出视频格式",
                    
                    "BilibiliVideoEXT_alert_invalidVideoId": "无效的视频ID（BV或av格式）",
                    "BilibiliVideoEXT_alert_requestLimit": "您的请求达到上限。",
                    "BilibiliVideoEXT_alert_videoTooLarge": "视频文件过大，请选择1000MB以下的视频",
                    "BilibiliVideoEXT_alert_invalidBase64": "无效的Base64视频格式（需以data:video/开头）",
                    "BilibiliVideoEXT_alert_playVideoFirst": "请先播放视频",
                    "BilibiliVideoEXT_alert_searchFailed": "搜索失败",
                    "BilibiliVideoEXT_alert_proxyFailed": "所有跨域代理均失败，请换个时间重试",
                    "BilibiliVideoEXT_alert_noVideoData": "未解析到视频数据，可能是番剧/电影/电视剧（米人API不支持）",
                    "BilibiliVideoEXT_alert_bvidEmpty": "B站视频ID不能为空",
                    "BilibiliVideoEXT_alert_videoIdEmpty": "视频ID不能为空",
                    "BilibiliVideoEXT_alert_noValidId": "过滤后无有效视频ID（ALL 为保留指令，不可使用）",
                    "BilibiliVideoEXT_alert_searchKeywordEmpty": "搜索关键词不能为空",
                    "BilibiliVideoEXT_alert_base64Empty": "Base64字符串不能为空",
                    "BilibiliVideoEXT_alert_failedGetStage": "无法获取舞台信息",
                    "BilibiliVideoEXT_msg_videoConverted": "视频转换成功！",
                    "BilibiliVideoEXT_msg_copySuccess": "Base64字符串已复制",
                    "BilibiliVideoEXT_statType_like": "点赞",
                    "BilibiliVideoEXT_statType_coin": "投币",
                    "BilibiliVideoEXT_statType_favorite": "收藏",
                    "BilibiliVideoEXT_statType_share": "分享",
                    "BilibiliVideoEXT_statType_view": "播放量",
                    "BilibiliVideoEXT_statType_danmaku": "弹幕数",
                    "BilibiliVideoEXT_msg_videoConverting": "正在转换视频...",
                    "BilibiliVideoEXT_label_filename": "文件名",
                    "BilibiliVideoEXT_label_size": "大小",
                    "BilibiliVideoEXT_btn_playVideo": "播放视频",
                    "BilibiliVideoEXT_label_cancel": "取消",
                    "BilibiliVideoEXT_btn_play": "播放",
                    "BilibiliVideoEXT_label_localVideo": "本地视频",
                    "BilibiliVideoEXT_label_localPlay": "本地播放",
                    "BilibiliVideoEXT_label_noVideoPlaying": "无视频播放",
                    "BilibiliVideoEXT_label_unknown": "未知"
                },
                "en": {
                    "BilibiliVideoEXT_extensionName": "Bilibili Video Extension",
                    "BilibiliVideoEXT_extensionDescription": "Play Bilibili video links or Base64 videos via web overlay ~ and you can also get video content ~",
                    "BilibiliVideoEXT_label_aboutExtension": "*About This Extension",
                    "BilibiliVideoEXT_btn_terms": "*Terms of Use",
                    "BilibiliVideoEXT_label_tip1": "*Hover over blocks to view tutorial instructions.",
                    "BilibiliVideoEXT_label_tip2": "*Pressing keys on the video page will control the video instead of the stage.",
                    "BilibiliVideoEXT_label_playBilibili": "*Play Bilibili Video",
                    "BilibiliVideoEXT_label_dustbin": "*Deprecated Blocks",
                    "BilibiliVideoEXT_playBilibiliVideo_text": "Play Bilibili video [BILIBILI_ID] and name it [NEW_ID]",
                    "BilibiliVideoEXT_playBilibiliVideo_tooltip": "Play Bilibili video [VIDEO_ID] and name it [NEW_ID]\n(Supports BV / AV videos; alerts for invalid formats. Multiple IDs can be separated by commas)\n(BILIBILI_ID:'BV'.../'av'...;NEW_ID:~string,~string,~string.../*BAN:'ALL'*/)\nCreate a Bilibili video on the current sprite/background and assign one or more custom IDs",
                    "BilibiliVideoEXT_playVideoById_text": "Play video ID [VIDEO_ID]",
                    "BilibiliVideoEXT_playVideoById_tooltip": "Play video ID [VIDEO_ID]\n(Directly play an existing registered video ID)\n(VIDEO_ID:~string,~string,~string...)\nPlay the video corresponding to the specified ID",
                    "BilibiliVideoEXT_pauseVideo_text": "Pause video with ID [VIDEO_ID]",
                    "BilibiliVideoEXT_pauseVideo_tooltip": "Pause video with ID [VIDEO_ID]\n(Pause the video of the given ID)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nPause playback of the matched video ID",
                    "BilibiliVideoEXT_resumeVideo_text": "Resume video with ID [VIDEO_ID]",
                    "BilibiliVideoEXT_resumeVideo_tooltip": "Resume video with ID [VIDEO_ID]\n(Resume a paused video)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nResume playback of the matched video ID",
                    "BilibiliVideoEXT_isVideoPaused_text": "Is video ID [VIDEO_ID] paused?",
                    "BilibiliVideoEXT_isVideoPaused_tooltip": "Is video ID [VIDEO_ID] paused?\n(Check pause state of the specified video ID)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nReturns true if paused, otherwise false",
                    "BilibiliVideoEXT_setVideoPlaybackRate_text": "Set playback speed of ID [VIDEO_ID] to [RATE]",
                    "BilibiliVideoEXT_setVideoPlaybackRate_tooltip": "Set playback speed of ID [VIDEO_ID] to [RATE]\n(1.0 = normal speed)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nSet playback speed for the matched video ID",
                    "BilibiliVideoEXT_getCurrentVideoTime_text": "Current playback time of video ID [VIDEO_ID] at [TIME_TYPE]",
                    "BilibiliVideoEXT_getCurrentVideoTime_tooltip": "Current playback time of video ID [VIDEO_ID] at [TIME_TYPE]\n(Uses custom registered ID, not raw BV/AV)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nOutput the current playback time of the matched video ID",
                    "BilibiliVideoEXT_seekToTime_text": "Jump video ID [VIDEO_ID] to [MINUTE] min [SECOND] sec",
                    "BilibiliVideoEXT_seekToTime_tooltip": "Jump video ID [VIDEO_ID] to [MINUTE] min [SECOND] sec\n(Seek video playback to specified time point)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nSet current playback position of the matched video ID",
                    "BilibiliVideoEXT_stopVideo_text": "Stop playback of ID [VIDEO_ID]",
                    "BilibiliVideoEXT_stopVideo_tooltip": "Stop playback of ID [VIDEO_ID]\n(Stop rendering)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nStop the playing video and remove rendering bounds.\nFor rendering mode, you need to switch costumes manually; the extension will not auto-switch",
                    "BilibiliVideoEXT_label_statusList": "*Video Status List",
                    "BilibiliVideoEXT_getList_text": "[CHOSEN] list",
                    "BilibiliVideoEXT_getList_tooltip": "[CHOSEN] list\n(List format: ['...','...'])\nOutput the full list",
                    "BilibiliVideoEXT_getListCount_text": "Item count of [CHOSEN] list",
                    "BilibiliVideoEXT_getListCount_tooltip": "Item count of [CHOSEN] list\n(List format: ['...','...'])\nOutput total items in the list",
                    "BilibiliVideoEXT_getListItem_text": "Item [NUMBER] of [CHOSEN] list",
                    "BilibiliVideoEXT_getListItem_tooltip": "Item [NUMBER] of [CHOSEN] list\n(List format: ['...','...'])\nOutput the specific item by index",
                    "BilibiliVideoEXT_getListHasItem_text": "Does [CHOSEN] list contain exact item [STRING]?",
                    "BilibiliVideoEXT_getListHasItem_tooltip": "Does [CHOSEN] list contain exact item [STRING]?\n(List format: ['...','...'])\nCheck full exact match for a list item",
                    "BilibiliVideoEXT_getListHasText_text": "Does [CHOSEN] list contain text [STRING]?",
                    "BilibiliVideoEXT_getListHasText_tooltip": "Does [CHOSEN] list contain text [STRING]?\n(List format: ['...','...'])\nCheck partial text match even if not a full item",
                    "BilibiliVideoEXT_getListItemCount_text": "New list with exact item [STRING] from [CHOSEN] list",
                    "BilibiliVideoEXT_getListItemCount_tooltip": "Count exact item [STRING] in [CHOSEN] list\n(List format: ['...','...'])\nOutput new list with fully matched items",
                    "BilibiliVideoEXT_getListTextCount_text": "New list containing text [STRING] from [CHOSEN] list",
                    "BilibiliVideoEXT_getListTextCount_tooltip": "New list containing text [STRING] from [CHOSEN] list\n(List format: ['...','...'])\nOutput new list with items that contain the text",
                    "BilibiliVideoEXT_listType_allID": "All video IDs",
                    "BilibiliVideoEXT_listType_nowID": "Currently playing video IDs",
                    "BilibiliVideoEXT_listType_base64ID": "Video IDs registered as Base64 videos",
                    "BilibiliVideoEXT_listType_bilibiliVideoID": "Video IDs registered as Bilibili videos (not BV/AV)",
                    "BilibiliVideoEXT_label_bilibiliInfo": "*Get Bilibili Video Info",
                    "BilibiliVideoEXT_getCurrentVideoTitle_text": "Title of video ID [VIDEO_ID]",
                    "BilibiliVideoEXT_getCurrentVideoTitle_tooltip": "Title of video ID [VIDEO_ID]\n(Uses custom registered ID, not raw BV/AV)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nOutput title tag of the matched video ID",
                    "BilibiliVideoEXT_getCurrentVideoAuthor_text": "Uploader of video ID [VIDEO_ID]",
                    "BilibiliVideoEXT_getCurrentVideoAuthor_tooltip": "Uploader of video ID [VIDEO_ID]\n(Uses custom registered ID, not raw BV/AV)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nOutput uploader tag of the matched video ID",
                    "BilibiliVideoEXT_getCurrentVideoStats_text": "[STAT_TYPE] of video ID [VIDEO_ID]",
                    "BilibiliVideoEXT_getCurrentVideoStats_tooltip": "[STAT_TYPE] of video ID [VIDEO_ID]\n(Uses custom registered ID, not raw BV/AV)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nOutput video stats [Likes, Coins, Favorites, Shares, Views, Danmaku]",
                    "BilibiliVideoEXT_getCurrentVideoStats_STAT_TYPE_default": "Likes",
                    "BilibiliVideoEXT_getCurrentVideoDuration_text": "Duration of video ID [VIDEO_ID]",
                    "BilibiliVideoEXT_getCurrentVideoDuration_tooltip": "Duration of video ID [VIDEO_ID]\n(Uses custom registered ID, not raw BV/AV)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nOutput duration of the matched video ID",
                    "BilibiliVideoEXT_getVideoTitle_text": "Title of [BILIBILI_ID] video",
                    "BilibiliVideoEXT_getVideoTitle_tooltip": "Title of [BILIBILI_ID] video\n(Input BV/AV ID; alerts for invalid format)\nOutput title tag of the specified video",
                    "BilibiliVideoEXT_getVideoAuthor_text": "Uploader of [BILIBILI_ID] video",
                    "BilibiliVideoEXT_getVideoAuthor_tooltip": "Uploader of [BILIBILI_ID] video\n(Input BV/AV ID; alerts for invalid format)\nOutput uploader name of the specified video",
                    "BilibiliVideoEXT_getVideoStats_text": "[STAT_TYPE] of [BILIBILI_ID] video",
                    "BilibiliVideoEXT_getVideoStats_tooltip": "[STAT_TYPE] of [BILIBILI_ID] video\n(Input BV/AV ID; alerts for invalid format)\nOutput stats [Likes, Coins, Favorites, Shares, Views, Danmaku] of the specified video",
                    "BilibiliVideoEXT_getVideoStats_STAT_TYPE_default": "Likes",
                    "BilibiliVideoEXT_getVideoDuration_text": "Duration of [BILIBILI_ID] video",
                    "BilibiliVideoEXT_getVideoDuration_tooltip": "Duration of [BILIBILI_ID] video\n(Input BV/AV ID; alerts for invalid format)\nOutput duration tag of the specified video",
                    "BilibiliVideoEXT_showVideoCover_text": "Show cover image of Bilibili video [BILIBILI_ID]",
                    "BilibiliVideoEXT_showVideoCover_tooltip": "Show cover image of Bilibili video [BILIBILI_ID]\n(Input BV/AV ID; display cover on current sprite)",
                    "BilibiliVideoEXT_showCurrentVideoCover_text": "Show cover image of registered video [VIDEO_ID]",
                    "BilibiliVideoEXT_showCurrentVideoCover_tooltip": "Show cover image of registered video [VIDEO_ID]\n(VIDEO_ID:~string)\n(Input registered video ID; display cover on current sprite)",
                    "BilibiliVideoEXT_searchVideo_text": "Search videos [KEYWORD] page [PAGE]",
                    "BilibiliVideoEXT_searchVideo_tooltip": "Search videos [KEYWORD] page [PAGE]\n(Search Bilibili videos by keyword)\n(Keyword: search term; Page: result page number)\nReturn search result list in JSON format",
                    "BilibiliVideoEXT_getCurrentVideoDesc_text": "Description of video ID [VIDEO_ID]",
                    "BilibiliVideoEXT_getCurrentVideoDesc_tooltip": "Description of video ID [VIDEO_ID]\n(Uses custom registered ID, not raw BV/AV)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nOutput description of the matched video ID",
                    "BilibiliVideoEXT_getVideoDesc_text": "Description of [BILIBILI_ID] video",
                    "BilibiliVideoEXT_getVideoDesc_tooltip": "Description of [BILIBILI_ID] video\n(Input BV/AV ID; alerts for invalid format)\nOutput description of the specified video",
                    "BilibiliVideoEXT_label_playBase64": "*Play Base64 Video",
                    "BilibiliVideoEXT_btn_uploadVideo": "Upload Video and Convert to Base64",
                    "BilibiliVideoEXT_playVideoByBase64_text": "Play Base64 video [BASE64_STR] and name it [NEW_ID]",
                    "BilibiliVideoEXT_playVideoByBase64_tooltip": "Play Base64 video [BASE64_STR] and name it [NEW_ID]\n(NEW_ID:~string,~string,~string.../*BAN:'ALL'*/)\nSearch what Base64 is on Baidu\nPlay Base64 encoded video",
                    "BilibiliVideoEXT_base64ToScratch_text": "EXPERIMENTAL FEATURE : Convert [MENU] and change \"Play Base64 Video\" block value from [INPUT] to [CHANGE]",
                    "BilibiliVideoEXT_base64ToScratch_tooltip": "EXPERIMENTAL FEATURE : Convert [MENU] and change \"Play Base64 Video\" block value from [INPUT] to [CHANGE]\n(project.json is the main file inside extracted project package) Upload project, modify content, then export again.",
                    "BilibiliVideoEXT_chosenType_sc3": "Scratch Project",
                    "BilibiliVideoEXT_getLastBase64String_text": "Last Base64 String",
                    "BilibiliVideoEXT_getLastBase64String_tooltip": "Last Base64 String\n(Refers to last played/copied; not saved in project)\nOutput the last used Base64 string",
                    "BilibiliVideoEXT_getBase64VideoSize_text": "Current [VIDEO_ID] video size (MB)",
                    "BilibiliVideoEXT_getBase64VideoSize_tooltip": "Current [VIDEO_ID] video size (MB)\n(Unit: MB, not KB)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nOutput video file size",
                    "BilibiliVideoEXT_getBase64VideoType_text": "Current [VIDEO_ID] video format",
                    "BilibiliVideoEXT_getBase64VideoType_tooltip": "Current [VIDEO_ID] video format\n(video/xxx)\n(VIDEO_ID:~string,~string,~string.../'ALL')\nOutput video MIME format",
                    "BilibiliVideoEXT_alert_invalidVideoId": "Invalid video ID (BV or AV format)",
                    "BilibiliVideoEXT_alert_requestLimit": "Request limit reached.",
                    "BilibiliVideoEXT_alert_videoTooLarge": "Video file is too large, please select a video under 1000MB",
                    "BilibiliVideoEXT_alert_invalidBase64": "Invalid Base64 video format (must start with data:video/)",
                    "BilibiliVideoEXT_alert_playVideoFirst": "Please play a video first",
                    "BilibiliVideoEXT_alert_searchFailed": "Search failed",
                    "BilibiliVideoEXT_alert_proxyFailed": "All cross-domain proxies failed, please try again later",
                    "BilibiliVideoEXT_alert_noVideoData": "No video data parsed, may be anime/movie/TV drama (Miren API not supported)",
                    "BilibiliVideoEXT_alert_bvidEmpty": "Bilibili video ID cannot be empty",
                    "BilibiliVideoEXT_alert_videoIdEmpty": "Video ID cannot be empty",
                    "BilibiliVideoEXT_alert_noValidId": "No valid video IDs after filtering (ALL is a reserved command and cannot be used)",
                    "BilibiliVideoEXT_alert_searchKeywordEmpty": "Search keyword cannot be empty",
                    "BilibiliVideoEXT_alert_base64Empty": "Base64 string cannot be empty",
                    "BilibiliVideoEXT_alert_failedGetStage": "Failed to get stage info",
                    "BilibiliVideoEXT_msg_videoConverted": "Video converted successfully!",
                    "BilibiliVideoEXT_msg_copySuccess": "Base64 string copied",
                    "BilibiliVideoEXT_statType_like": "Likes",
                    "BilibiliVideoEXT_statType_coin": "Coins",
                    "BilibiliVideoEXT_statType_favorite": "Favorites",
                    "BilibiliVideoEXT_statType_share": "Shares",
                    "BilibiliVideoEXT_statType_view": "Views",
                    "BilibiliVideoEXT_statType_danmaku": "Danmaku Count",
                    "BilibiliVideoEXT_msg_videoConverting": "Converting video...",
                    "BilibiliVideoEXT_label_filename": "File Name",
                    "BilibiliVideoEXT_label_size": "Size",
                    "BilibiliVideoEXT_btn_playVideo": "Play Video",
                    "BilibiliVideoEXT_label_cancel": "Cancel",
                    "BilibiliVideoEXT_btn_play": "Play",
                    "BilibiliVideoEXT_label_localVideo": "Local Video",
                    "BilibiliVideoEXT_label_localPlay": "Local Play",
                    "BilibiliVideoEXT_label_noVideoPlaying": "No video playing",
                    "BilibiliVideoEXT_label_unknown": "Unknown"
                },
                "ja": {
                    "BilibiliVideoEXT_extensionName": "Bilibili動画拡張機能",
                    "BilibiliVideoEXT_extensionDescription": "ウェブオーバーレイでBilibili動画リンクまたはBase64動画を再生～ 動画情報の取得も可能です～",
                    "BilibiliVideoEXT_label_aboutExtension": "*この拡張機能について",
                    "BilibiliVideoEXT_btn_terms": "*利用規約",
                    "BilibiliVideoEXT_label_tip1": "*ブロックの上にマウスを置くと説明が表示されます",
                    "BilibiliVideoEXT_label_tip2": "*動画画面でキーを押すと、ステージではなく動画を操作します",
                    "BilibiliVideoEXT_label_playBilibili": "*Bilibili動画を再生",
                    "BilibiliVideoEXT_label_dustbin": "*廃止ブロック",
                    "BilibiliVideoEXT_playBilibiliVideo_text": "Bilibili動画 [BILIBILI_ID] を再生し [NEW_ID] と命名",
                    "BilibiliVideoEXT_playBilibiliVideo_tooltip": "Bilibili動画 [VIDEO_ID] を再生し [NEW_ID] と命名\n（BV/AV形式に対応、形式不正時に警告、IDはカンマで複数指定可）\n（BILIBILI_ID:'BV'…/'av'…;NEW_ID:~文字列,~文字列,~文字列…/*禁止:'ALL'*/）\n現在のスプライト/背景にBilibili動画を生成し、任意のIDで名前を付けます",
                    "BilibiliVideoEXT_playVideoById_text": "動画ID [VIDEO_ID] を再生",
                    "BilibiliVideoEXT_playVideoById_tooltip": "動画ID [VIDEO_ID] を再生\n（登録済みの動画IDを直接再生）\n（VIDEO_ID:~文字列,~文字列,~文字列…）\n指定したIDの動画を再生します",
                    "BilibiliVideoEXT_pauseVideo_text": "ID [VIDEO_ID] の動画を一時停止",
                    "BilibiliVideoEXT_pauseVideo_tooltip": "ID [VIDEO_ID] の動画を一時停止\n（指定IDの動画を停止）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n対応するIDの動画再生を一時停止",
                    "BilibiliVideoEXT_resumeVideo_text": "ID [VIDEO_ID] の動画を再開",
                    "BilibiliVideoEXT_resumeVideo_tooltip": "ID [VIDEO_ID] の動画を再開\n（一時停止中の動画を再生再開）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n対応するIDの動画再生を再開",
                    "BilibiliVideoEXT_isVideoPaused_text": "動画ID [VIDEO_ID] は一時停止中ですか？",
                    "BilibiliVideoEXT_isVideoPaused_tooltip": "動画ID [VIDEO_ID] は一時停止中ですか？\n（指定IDの動画の停止状態を確認）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n停止中なら true、それ以外は false を返す",
                    "BilibiliVideoEXT_setVideoPlaybackRate_text": "ID [VIDEO_ID] の動画再生速度を [RATE] に設定",
                    "BilibiliVideoEXT_setVideoPlaybackRate_tooltip": "ID [VIDEO_ID] の動画再生速度を [RATE] に設定\n（1.0 が標準速度）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n対応するIDの動画再生速度を変更",
                    "BilibiliVideoEXT_getCurrentVideoTime_text": "動画ID [VIDEO_ID] の再生位置 [TIME_TYPE]",
                    "BilibiliVideoEXT_getCurrentVideoTime_tooltip": "動画ID [VIDEO_ID] の再生位置 [TIME_TYPE]\n（登録した独自IDを使用、BV/AVではない）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n対応するIDの動画再生時間を出力",
                    "BilibiliVideoEXT_seekToTime_text": "ID [VIDEO_ID] の動画を [MINUTE] 分 [SECOND] 秒に移動",
                    "BilibiliVideoEXT_seekToTime_tooltip": "ID [VIDEO_ID] の動画を [MINUTE] 分 [SECOND] 秒に移動\n（再生位置を指定時間にジャンプ）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n対応するIDの動画再生位置を設定",
                    "BilibiliVideoEXT_stopVideo_text": "ID [VIDEO_ID] の再生を停止",
                    "BilibiliVideoEXT_stopVideo_tooltip": "ID [VIDEO_ID] の再生を停止\n（描画レンダリングを停止）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n再生中の動画を停止し表示領域を削除します。\nレンダリング使用時は手動でコスチュームを切り替えてください",
                    "BilibiliVideoEXT_label_statusList": "*動画ステータスリスト",
                    "BilibiliVideoEXT_getList_text": "[CHOSEN] リスト",
                    "BilibiliVideoEXT_getList_tooltip": "[CHOSEN] リスト\n（リスト形式：['...','...']）リスト全体を出力",
                    "BilibiliVideoEXT_getListCount_text": "[CHOSEN] リストの項目数",
                    "BilibiliVideoEXT_getListCount_tooltip": "[CHOSEN] リストの項目数\n（リスト形式：['...','...']）リスト内の要素数を出力",
                    "BilibiliVideoEXT_getListItem_text": "[CHOSEN] リストの第 [NUMBER] 項目",
                    "BilibiliVideoEXT_getListItem_tooltip": "[CHOSEN] リストの第 [NUMBER] 項目\n（リスト形式：['...','...']）指定番号の項目を出力",
                    "BilibiliVideoEXT_getListHasItem_text": "[CHOSEN] リストに完全一致項目 [STRING] は存在しますか？",
                    "BilibiliVideoEXT_getListHasItem_tooltip": "[CHOSEN] リストに完全一致項目 [STRING] は存在しますか？\n（リスト形式：['...','...']）完全一致で項目の有無を判定",
                    "BilibiliVideoEXT_getListHasText_text": "[CHOSEN] リストに文字 [STRING] が含まれますか？",
                    "BilibiliVideoEXT_getListHasText_tooltip": "[CHOSEN] リストに文字 [STRING] が含まれますか？\n（リスト形式：['...','...']）部分一致で文字を含むか判定",
                    "BilibiliVideoEXT_getListItemCount_text": "[CHOSEN] リストから項目 [STRING] を抽出した新規リスト",
                    "BilibiliVideoEXT_getListItemCount_tooltip": "[CHOSEN] リスト内の項目 [STRING] の数\n（リスト形式：['...','...']）完全一致項目だけのリストを出力",
                    "BilibiliVideoEXT_getListTextCount_text": "[CHOSEN] リストから文字 [STRING] を含む新規リスト",
                    "BilibiliVideoEXT_getListTextCount_tooltip": "[CHOSEN] リストに文字 [STRING] を含むもの\n（リスト形式：['...','...']）部分一致文字を含む項目リストを出力",
                    "BilibiliVideoEXT_listType_allID": "すべての動画ID",
                    "BilibiliVideoEXT_listType_nowID": "再生中の動画ID",
                    "BilibiliVideoEXT_listType_base64ID": "Base64動画として登録された動画ID",
                    "BilibiliVideoEXT_listType_bilibiliVideoID": "Bilibili動画として登録された動画ID（BV/AVではない）",
                    "BilibiliVideoEXT_label_bilibiliInfo": "*Bilibili動画情報取得",
                    "BilibiliVideoEXT_getCurrentVideoTitle_text": "動画ID [VIDEO_ID] のタイトル",
                    "BilibiliVideoEXT_getCurrentVideoTitle_tooltip": "動画ID [VIDEO_ID] のタイトル\n（登録した独自IDを使用、BV/AVではない）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n対応IDの動画タイトルを出力",
                    "BilibiliVideoEXT_getCurrentVideoAuthor_text": "動画ID [VIDEO_ID] のUP主",
                    "BilibiliVideoEXT_getCurrentVideoAuthor_tooltip": "動画ID [VIDEO_ID] のUP主\n（登録した独自IDを使用、BV/AVではない）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n対応IDの投稿者名を出力",
                    "BilibiliVideoEXT_getCurrentVideoStats_text": "動画ID [VIDEO_ID] の[STAT_TYPE]",
                    "BilibiliVideoEXT_getCurrentVideoStats_tooltip": "動画ID [VIDEO_ID] の[STAT_TYPE]\n（登録した独自IDを使用、BV/AVではない）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n高評価・コイン・お気に入り・シェア・再生数・コメント数を出力",
                    "BilibiliVideoEXT_getCurrentVideoStats_STAT_TYPE_default": "高評価",
                    "BilibiliVideoEXT_getCurrentVideoDuration_text": "動画ID [VIDEO_ID] の長さ",
                    "BilibiliVideoEXT_getCurrentVideoDuration_tooltip": "動画ID [VIDEO_ID] の長さ\n（登録した独自IDを使用、BV/AVではない）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n対応IDの動画時間を出力",
                    
                    "BilibiliVideoEXT_getVideoTitle_text": "[BILIBILI_ID] 動画のタイトル",
                    "BilibiliVideoEXT_getVideoTitle_tooltip": "[BILIBILI_ID] 動画のタイトル\n（BV/AVを入力、形式不正時に警告）\n指定動画のタイトルを出力",
                    "BilibiliVideoEXT_getVideoAuthor_text": "[BILIBILI_ID] 動画のUP主",
                    "BilibiliVideoEXT_getVideoAuthor_tooltip": "[BILIBILI_ID] 動画のUP主\n（BV/AVを入力、形式不正時に警告）\n指定動画の投稿者を出力",
                    "BilibiliVideoEXT_getVideoStats_text": "[BILIBILI_ID] 動画の[STAT_TYPE]",
                    "BilibiliVideoEXT_getVideoStats_tooltip": "[BILIBILI_ID] 動画の[STAT_TYPE]\n（BV/AVを入力、形式不正時に警告）\n高評価・コイン・お気に入り・シェア・再生数・コメント数を出力",
                    "BilibiliVideoEXT_getVideoStats_STAT_TYPE_default": "高評価",
                    "BilibiliVideoEXT_getVideoDuration_text": "[BILIBILI_ID] 動画の長さ",
                    "BilibiliVideoEXT_getVideoDuration_tooltip": "[BILIBILI_ID] 動画の長さ\n（BV/AVを入力、形式不正時に警告）\n指定動画の再生時間を出力",
                    "BilibiliVideoEXT_showVideoCover_text": "Bilibili動画 [BILIBILI_ID] のサムネイルを表示",
                    "BilibiliVideoEXT_showVideoCover_tooltip": "Bilibili動画 [BILIBILI_ID] のサムネイルを表示\n（BV/AV形式IDを入力、現在のスプライトにサムネイルを表示）",

                    "BilibiliVideoEXT_showCurrentVideoCover_text": "登録済み動画ID [VIDEO_ID] のサムネイルを表示",
                    "BilibiliVideoEXT_showCurrentVideoCover_tooltip": "登録済み動画ID [VIDEO_ID] のサムネイルを表示\n（VIDEO_ID:~文字列）\n登録済みの動画IDからサムネイルをスプライトに表示",
                    "BilibiliVideoEXT_searchVideo_text": "動画検索 [KEYWORD] 第 [PAGE] ページ",
                    "BilibiliVideoEXT_searchVideo_tooltip": "動画検索 [KEYWORD] 第 [PAGE] ページ\n（キーワードでBilibili動画を検索）\n（キーワード：検索語；ページ：結果ページ番号）\n検索結果をJSON形式のリストで返す",
                    "BilibiliVideoEXT_getCurrentVideoDesc_text": "動画ID [VIDEO_ID] の概要説明",
                    "BilibiliVideoEXT_getCurrentVideoDesc_tooltip": "動画ID [VIDEO_ID] の概要説明\n（登録した独自IDを使用）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n対応IDの動画概要文を出力",
                    "BilibiliVideoEXT_getVideoDesc_text": "[BILIBILI_ID] 動画の概要説明",
                    "BilibiliVideoEXT_getVideoDesc_tooltip": "[BILIBILI_ID] 動画の概要説明\n（BV/AVを入力、形式不正時に警告）\n指定動画の概要文を出力",

                    "BilibiliVideoEXT_label_playBase64": "*Base64動画を再生",
                    "BilibiliVideoEXT_btn_uploadVideo": "動画をアップロードしてBase64に変換",
                    "BilibiliVideoEXT_playVideoByBase64_text": "Base64動画 [BASE64_STR] を再生し [NEW_ID] と命名",
                    "BilibiliVideoEXT_playVideoByBase64_tooltip": "Base64動画 [BASE64_STR] を再生し [NEW_ID] と命名\n（NEW_ID:~文字列,~文字列,~文字列…/*禁止:'ALL'*/）\nBase64の意味は検索してください\nBase64形式の動画を再生",
                    "BilibiliVideoEXT_base64ToScratch_text": "EXPERIMENTAL FEATURE:[MENU] を変換し、値 [INPUT] の「Base64動画を再生」ブロックを [CHANGE] に変更",
                    "BilibiliVideoEXT_base64ToScratch_tooltip": "EXPERIMENTAL FEATURE:[MENU] を変換し、値 [INPUT] の「Base64動画を再生」ブロックを [CHANGE] に変更\n（project.json は作品ファイルを解凍した中のメインファイル）作品をアップロード→編集→再エクスポート可能",
                    "BilibiliVideoEXT_chosenType_sc3": "Scratch作品",
                    "BilibiliVideoEXT_getLastBase64String_text": "最後のBase64文字列",
                    "BilibiliVideoEXT_getLastBase64String_tooltip": "最後のBase64文字列\n（直前に再生/コピーした内容、作品には保存されない）\n最後に使用したBase64文字列を出力",
                    "BilibiliVideoEXT_getBase64VideoSize_text": "現在 [VIDEO_ID] 動画サイズ(MB)",
                    "BilibiliVideoEXT_getBase64VideoSize_tooltip": "現在 [VIDEO_ID] 動画サイズ(MB)\n（単位はMB、KBではない）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n動画のファイルサイズを出力",
                    "BilibiliVideoEXT_getBase64VideoType_text": "現在 [VIDEO_ID] 動画形式",
                    "BilibiliVideoEXT_getBase64VideoType_tooltip": "現在 [VIDEO_ID] 動画形式\n（video/xxx）\n（VIDEO_ID:~文字列,~文字列,~文字列…/'ALL'）\n動画のMIME形式を出力",
                    "BilibiliVideoEXT_alert_invalidVideoId": "動画IDが不正です（BVまたはav形式）",
                    "BilibiliVideoEXT_alert_requestLimit": "リクエスト回数が上限に達しました",
                    "BilibiliVideoEXT_alert_videoTooLarge": "動画サイズが大きすぎます、1000MB以下の動画を選択してください",
                    "BilibiliVideoEXT_alert_invalidBase64": "Base64形式が不正です（data:video/ から始めてください）",
                    "BilibiliVideoEXT_alert_playVideoFirst": "先に動画を再生してください",
                    "BilibiliVideoEXT_alert_searchFailed": "検索に失敗しました",
                    "BilibiliVideoEXT_alert_proxyFailed": "すべてのクロスドメインプロキシが失敗、時間を置いて再試行してください",
                    "BilibiliVideoEXT_alert_noVideoData": "動画データを解析できません。番組・映画・ドラマは米人APIに非対応",
                    "BilibiliVideoEXT_alert_bvidEmpty": "Bilibili動画IDを空にすることはできません",
                    "BilibiliVideoEXT_alert_videoIdEmpty": "動画IDを空にすることはできません",
                    "BilibiliVideoEXT_alert_noValidId": "フィルタ後に有効なIDがありません（ALL は予約語のため使用不可）",
                    "BilibiliVideoEXT_alert_searchKeywordEmpty": "検索キーワードを空にすることはできません",
                    "BilibiliVideoEXT_alert_base64Empty": "Base64文字列を空にすることはできません",
                    "BilibiliVideoEXT_alert_failedGetStage": "ステージ情報を取得できません",
                    "BilibiliVideoEXT_msg_videoConverted": "動画変換に成功しました！",
                    "BilibiliVideoEXT_msg_copySuccess": "Base64文字列をコピーしました",
                    "BilibiliVideoEXT_statType_like": "高評価",
                    "BilibiliVideoEXT_statType_coin": "コイン",
                    "BilibiliVideoEXT_statType_favorite": "お気に入り",
                    "BilibiliVideoEXT_statType_share": "シェア",
                    "BilibiliVideoEXT_statType_view": "再生数",
                    "BilibiliVideoEXT_statType_danmaku": "コメント数",
                    "BilibiliVideoEXT_msg_videoConverting": "動画を変換中...",
                    "BilibiliVideoEXT_label_filename": "ファイル名",
                    "BilibiliVideoEXT_label_size": "サイズ",
                    "BilibiliVideoEXT_btn_playVideo": "動画を再生",
                    "BilibiliVideoEXT_label_cancel": "キャンセル",
                    "BilibiliVideoEXT_btn_play": "再生",
                    "BilibiliVideoEXT_label_localVideo": "ローカル動画",
                    "BilibiliVideoEXT_label_localPlay": "ローカル再生",
                    "BilibiliVideoEXT_label_noVideoPlaying": "再生中の動画なし",
                    "BilibiliVideoEXT_label_unknown": "不明"
                }
            });
            return {
                blockIconURI: extension_block_icon,
                id: 'BilibiliVideoEXT',
                name: translate({
                    id: "BilibiliVideoEXT_extensionName"
                }),
                color1: '#FF69B4',
                color2: '#EE5E85',
                docsURI: 'https://learn.ccw.site/article/ae1df28c-9c3b-4cba-a8d2-c48dc38f8aa7',
                blocks: [
                    {func: "extcantuse",text: "警告⚠️扩展不可用⚠️",blockType:"button"},
                    {text: translate({id: "BilibiliVideoEXT_label_tip1"}),blockType: Scratch.BlockType.LABEL},
                    {text: translate({id: "BilibiliVideoEXT_label_tip2"}),blockType: Scratch.BlockType.LABEL},
                    {text: translate({id: "BilibiliVideoEXT_label_playBilibili"}),blockType: Scratch.BlockType.LABEL},
                    {opcode: 'playBilibiliVideo',blockType: Scratch.BlockType.COMMAND,text: translate({id: "BilibiliVideoEXT_playBilibiliVideo_text"}),tooltip: translate({id: "BilibiliVideoEXT_playBilibiliVideo_tooltip"}),arguments: {BILIBILI_ID: {type: Scratch.ArgumentType.STRING,defaultValue: extension_exampleVideoID},NEW_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'playVideoById',blockType: Scratch.BlockType.COMMAND,text: translate({id: "BilibiliVideoEXT_playVideoById_text"}),tooltip: translate({id: "BilibiliVideoEXT_playVideoById_tooltip"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'stopVideo',blockType: Scratch.BlockType.COMMAND,tooltip: translate({id: "BilibiliVideoEXT_stopVideo_tooltip"}),text: translate({id: "BilibiliVideoEXT_stopVideo_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'pauseVideo',blockType: Scratch.BlockType.COMMAND,tooltip: translate({id: "BilibiliVideoEXT_pauseVideo_tooltip"}),text: translate({id: "BilibiliVideoEXT_pauseVideo_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'resumeVideo',blockType: Scratch.BlockType.COMMAND,tooltip: translate({id: "BilibiliVideoEXT_resumeVideo_tooltip"}),text: translate({id: "BilibiliVideoEXT_resumeVideo_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'isVideoPaused',blockType: Scratch.BlockType.BOOLEAN,text: translate({id: "BilibiliVideoEXT_isVideoPaused_text"}),tooltip: translate({id: "BilibiliVideoEXT_isVideoPaused_tooltip"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'setVideoPlaybackRate',blockType: Scratch.BlockType.COMMAND,tooltip: translate({id: "BilibiliVideoEXT_setVideoPlaybackRate_tooltip"}),text: translate({id: "BilibiliVideoEXT_setVideoPlaybackRate_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'},RATE: {type: Scratch.ArgumentType.NUMBER,defaultValue: 1.0}}},
                    {opcode: 'getCurrentVideoTime',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getCurrentVideoTime_tooltip"}),text: translate({id: "BilibiliVideoEXT_getCurrentVideoTime_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'},TIME_TYPE: {type: Scratch.ArgumentType.STRING,menu: 'timeType',defaultValue: "mm:ss"}}},
                    {opcode: 'seekToTime',blockType: Scratch.BlockType.COMMAND,text: translate({id: "BilibiliVideoEXT_seekToTime_text"}),tooltip: translate({id: "BilibiliVideoEXT_seekToTime_tooltip"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'},MINUTE: {type: Scratch.ArgumentType.NUMBER,defaultValue: 0},SECOND: {type: Scratch.ArgumentType.NUMBER,defaultValue: 0}}},
                    "---",
                    {text: translate({id: "BilibiliVideoEXT_label_statusList"}),blockType: Scratch.BlockType.LABEL},
                    {opcode: 'getList',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getList_tooltip"}),text: translate({id: "BilibiliVideoEXT_getList_text"}),arguments: {CHOSEN: {type: Scratch.ArgumentType.STRING,menu: "listType",defaultValue: translate({id: "BilibiliVideoEXT_listType_allID"})}}},
                    {opcode: 'getListCount',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getListCount_tooltip"}),text: translate({id: "BilibiliVideoEXT_getListCount_text"}),arguments: {CHOSEN: {type: Scratch.ArgumentType.STRING,menu: "listType",defaultValue: translate({id: "BilibiliVideoEXT_listType_allID"})}}},
                    {opcode: 'getListItem',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getListItem_tooltip"}),text: translate({id: "BilibiliVideoEXT_getListItem_text"}),arguments: {CHOSEN: {type: Scratch.ArgumentType.STRING,menu: "listType",defaultValue: translate({id: "BilibiliVideoEXT_listType_allID"})},NUMBER: {type: Scratch.ArgumentType.NUMBER,defaultValue: 1}}},
                    {opcode: 'getListHasItem',blockType: Scratch.BlockType.BOOLEAN,tooltip: translate({id: "BilibiliVideoEXT_getListHasItem_tooltip"}),text: translate({id: "BilibiliVideoEXT_getListHasItem_text"}),arguments: {CHOSEN: {type: Scratch.ArgumentType.STRING,menu: "listType",defaultValue: translate({id: "BilibiliVideoEXT_listType_allID"})},STRING: {type: Scratch.ArgumentType.STRING,defaultValue: "video1"}}},
                    {opcode: 'getListHasText',blockType: Scratch.BlockType.BOOLEAN,tooltip: translate({id: "BilibiliVideoEXT_getListHasText_tooltip"}),text: translate({id: "BilibiliVideoEXT_getListHasText_text"}),arguments: {CHOSEN: {type: Scratch.ArgumentType.STRING,menu: "listType",defaultValue: translate({id: "BilibiliVideoEXT_listType_allID"})},STRING: {type: Scratch.ArgumentType.STRING,defaultValue: "video1"}}},
                    {opcode: 'getListItemCount',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getListItemCount_tooltip"}),text: translate({id: "BilibiliVideoEXT_getListItemCount_text"}),arguments: {CHOSEN: {type: Scratch.ArgumentType.STRING,menu: "listType",defaultValue: translate({id: "BilibiliVideoEXT_listType_allID"})},STRING: {type: Scratch.ArgumentType.STRING,defaultValue: "video1"}}},
                    {opcode: 'getListTextCount',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getListTextCount_tooltip"}),text: translate({id: "BilibiliVideoEXT_getListTextCount_text"}),arguments: {CHOSEN: {type: Scratch.ArgumentType.STRING, menu: "listType", defaultValue: translate({id: "BilibiliVideoEXT_listType_allID"})},STRING: {type: Scratch.ArgumentType.STRING,defaultValue: "video1"}}},
                    "---",
                    {text: translate({id: "BilibiliVideoEXT_label_bilibiliInfo"}),blockType: Scratch.BlockType.LABEL},
                    {opcode: 'getCurrentVideoTitle',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getCurrentVideoTitle_tooltip"}),text: translate({id: "BilibiliVideoEXT_getCurrentVideoTitle_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'getCurrentVideoAuthor',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getCurrentVideoAuthor_tooltip"}),text: translate({id: "BilibiliVideoEXT_getCurrentVideoAuthor_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'getCurrentVideoStats',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getCurrentVideoStats_tooltip"}),text: translate({id: "BilibiliVideoEXT_getCurrentVideoStats_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'},STAT_TYPE: {type: Scratch.ArgumentType.STRING,menu: 'statType',defaultValue: translate({id: "BilibiliVideoEXT_getCurrentVideoStats_STAT_TYPE_default"})}}},
                    {opcode: 'getCurrentVideoDuration',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getCurrentVideoDuration_tooltip"}),text: translate({id: "BilibiliVideoEXT_getCurrentVideoDuration_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'getCurrentVideoCover',hideFromPalette:1,blockType: Scratch.BlockType.REPORTER,text:"getCurrentVideoCover",arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'showCurrentVideoCover',blockType: Scratch.BlockType.COMMAND,text: translate({id: "BilibiliVideoEXT_showCurrentVideoCover_text"}),tooltip: translate({id: "BilibiliVideoEXT_showCurrentVideoCover_tooltip"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'getCurrentVideoDesc',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getCurrentVideoDesc_tooltip"}),text: translate({id: "BilibiliVideoEXT_getCurrentVideoDesc_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    "---",
                    {opcode: 'getVideoTitle',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getVideoTitle_tooltip"}),text: translate({id: "BilibiliVideoEXT_getVideoTitle_text"}),arguments: {BILIBILI_ID: {type: Scratch.ArgumentType.STRING,defaultValue: extension_exampleVideoID}}},
                    {opcode: 'getVideoAuthor',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getVideoAuthor_tooltip"}),text: translate({id: "BilibiliVideoEXT_getVideoAuthor_text"}),arguments: {BILIBILI_ID: {type: Scratch.ArgumentType.STRING,defaultValue: extension_exampleVideoID}}},
                    {opcode: 'getVideoStats',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getVideoStats_tooltip"}),text: translate({id: "BilibiliVideoEXT_getVideoStats_text"}),arguments: {BILIBILI_ID: {type: Scratch.ArgumentType.STRING,defaultValue: extension_exampleVideoID},STAT_TYPE: {type: Scratch.ArgumentType.STRING,menu: 'statType',defaultValue: translate({id: "BilibiliVideoEXT_getVideoStats_STAT_TYPE_default"})}}},
                    {opcode: 'getVideoDuration',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getVideoDuration_tooltip"}),text: translate({id: "BilibiliVideoEXT_getVideoDuration_text"}),arguments: {BILIBILI_ID: {type: Scratch.ArgumentType.STRING,defaultValue: extension_exampleVideoID}}},
                    {opcode: 'getVideoCover',hideFromPalette:1,blockType: Scratch.BlockType.REPORTER,text:"getVideoCover",arguments: {BILIBILI_ID: {type: Scratch.ArgumentType.STRING,defaultValue: extension_exampleVideoID}}},
                    {opcode: 'showVideoCover',blockType: Scratch.BlockType.COMMAND,text: translate({id: "BilibiliVideoEXT_showVideoCover_text"}),tooltip: translate({id: "BilibiliVideoEXT_showVideoCover_tooltip"}),arguments: {BILIBILI_ID: {type: Scratch.ArgumentType.STRING,defaultValue: extension_exampleVideoID}}},
                    {opcode: 'getVideoDesc',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_getVideoDesc_tooltip"}),text: translate({id: "BilibiliVideoEXT_getVideoDesc_text"}),arguments: {BILIBILI_ID: {type: Scratch.ArgumentType.STRING,defaultValue: extension_exampleVideoID}}},
                    '---',
                    {opcode: 'searchVideo',blockType: Scratch.BlockType.REPORTER,tooltip: translate({id: "BilibiliVideoEXT_searchVideo_tooltip"}),text:translate({id: "BilibiliVideoEXT_searchVideo_text"}),arguments: {KEYWORD: {type: Scratch.ArgumentType.STRING,defaultValue: 'Scratch'},PAGE: {type: Scratch.ArgumentType.NUMBER,defaultValue: 1}}},
                    '---',
                    {text: translate({id: "BilibiliVideoEXT_label_playBase64"}),blockType: Scratch.BlockType.LABEL},
                    {func: 'uploadVideoToBase64',text: translate({id: "BilibiliVideoEXT_btn_uploadVideo"}),color1: '#b500ff',color2: '#bd1cff',blockIconURI: extension_extend_icon,blockType: 'button'},
                    {opcode: 'playVideoByBase64',blockType: Scratch.BlockType.COMMAND,text: translate({id: "BilibiliVideoEXT_playVideoByBase64_text"}),tooltip: translate({id: "BilibiliVideoEXT_playVideoByBase64_tooltip"}),color1: '#b500ff',color2: '#bd1cff',blockIconURI: extension_extend_icon,arguments: {BASE64_STR: {type: Scratch.ArgumentType.STRING,defaultValue: 'data:video/mp4;base64,'},NEW_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'getLastBase64String',blockType: Scratch.BlockType.REPORTER,blockIconURI: extension_extend_icon,color1: '#b500ff',color2: '#bd1cff',tooltip: translate({id: "BilibiliVideoEXT_getLastBase64String_tooltip"}),text: translate({id: "BilibiliVideoEXT_getLastBase64String_text"})},
                    {opcode: 'getBase64VideoSize',blockType: Scratch.BlockType.REPORTER,color1: '#b500ff',color2: '#bd1cff',blockIconURI: extension_extend_icon,tooltip: translate({id: "BilibiliVideoEXT_getBase64VideoSize_tooltip"}),text: translate({id: "BilibiliVideoEXT_getBase64VideoSize_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    {opcode: 'getBase64VideoType',blockType: Scratch.BlockType.REPORTER,color1: '#b500ff',color2: '#bd1cff',blockIconURI: extension_extend_icon,tooltip: translate({id: "BilibiliVideoEXT_getBase64VideoType_tooltip"}),text: translate({id: "BilibiliVideoEXT_getBase64VideoType_text"}),arguments: {VIDEO_ID: {type: Scratch.ArgumentType.STRING,defaultValue: 'video1'}}},
                    '---',
                    {text: translate({id: "BilibiliVideoEXT_label_aboutExtension"}),blockType: Scratch.BlockType.LABEL},
                    {func: 'aboutAPILICENCE',text: translate({id: "BilibiliVideoEXT_btn_terms"}),blockType: 'button'},
                    '---',
                    {text: "Experimental Features",blockType:Scratch.BlockType.LABEL},
                    {opcode: 'base64ToScratch',blockType: Scratch.BlockType.COMMAND,blockIconURI: extension_extend_icon,color1: '#b500ff',color2: '#bd1cff',tooltip:translate({id: "BilibiliVideoEXT_base64ToScratch_tooltip"}),text:translate({id: "BilibiliVideoEXT_base64ToScratch_text"}),arguments: {INPUT: {type: Scratch.ArgumentType.STRING,defaultValue: 'data:video/mp4;base64,'},CHANGE:{type: Scratch.ArgumentType.STRING,defaultValue: 'data:video/mp4;base64,'},MENU: {type: Scratch.ArgumentType.STRING,menu: 'chosenType',defaultValue: 'project.json'}}},
                    {opcode: 'openOptLog',blockType:Scratch.BlockType.COMMAND,text:"Open or close Errlog Alert."},
                    {opcode: 'custProxy',blockType:Scratch.BlockType.COMMAND,text:"Customization Cors Proxy [INPUT]",arguments:{INPUT: {type: Scratch.ArgumentType.STRING,defaultValue: "https://子域名.域名.com/(?…=)"}}},
                    {opcode: "refreshProxy",blockType:Scratch.BlockType.COMMAND,text:"Clear all the Customization cors proxy"},
                    {opcode: 'corsproxyOK',blockType:Scratch.BlockType.REPORTER,text:"The corsproxyOK or not?",hideFromPalette:1}

                ],
                menus: {
                    statType: {acceptReporters: false,items: [translate({id: "BilibiliVideoEXT_statType_like"}),translate({id: "BilibiliVideoEXT_statType_coin"}),translate({id: "BilibiliVideoEXT_statType_favorite"}),translate({id: "BilibiliVideoEXT_statType_share"}),translate({id: "BilibiliVideoEXT_statType_view"}),translate({id: "BilibiliVideoEXT_statType_danmaku"})]},
                    timeType: {acceptReporters: false,items: ["mm:ss","ss","ms"]},
                    chosenType: {acceptReporters: false,items: [translate({id: "BilibiliVideoEXT_chosenType_sc3"}),"project.json"]},
                    listType: {acceptReporters: true,items: [translate({id: "BilibiliVideoEXT_listType_allID"}),translate({id: "BilibiliVideoEXT_listType_nowID"}),translate({id: "BilibiliVideoEXT_listType_base64ID"}),translate({id: "BilibiliVideoEXT_listType_bilibiliVideoID"})]}
                }
            }
        }
        async corsproxyOK(){
            try{
                const headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Referer': 'https://www.ccw.site/',
                    'Origin':'https://www.ccw.site',
                    'Accept': 'application/json, text/plain, */*'
                }
                const a = await fetch("https://corsproxy.yushifishish.dpdns.org/?url=https://api.mir6.com/api/yulu",{headers})
                if(!a.ok) throw new Error(`HTTP(S) ${a.status + ","+ a.statusText}`)
                let b = await a.json()
                if(b.contents) b=JSON.parse(b.contents)
                let r = b.text
                return r
            }catch(err){
                return err.message;
            }
        }
        extcantuse(){open("https://learn.ccw.site/article/d6c26263-58a1-43d5-9a41-c65571dd4fc1")}
        openOptLog(){
            if(this.opt) this.opt=false
            else this.opt=true
        }
        custProxy(args){
            this.uapi.push(args.INPUT.trim())
            this.addOperationLog("exp:custp","Add a new Cors proxy:"+args.INPUT.trim(),"info","Now:"+this.uapi.join(","))
        }
        refreshProxy(){
            this.uapi=["https://corsproxy.yushifishish.dpdns.org/?url="]
            this.addOperationLog("exp:custp","Clear","info","Now:"+this.uapi.join(","))
        }
        addOperationLog(blockId="Gunmu", message="Gungun and Mumu", type = 'info',content = "No Message.") {
            const timestamp = new Date().toLocaleTimeString();
            if (type == 'die') {
                message = message + '\n-DIELOG SHOULD RESTART EXTENSION FIRST';
            }
            const outerStyle = 'padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #87CEEB; font-weight: bold;';
            const innerStyle = 'padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: #FF6699; font-weight: bold;';
            const labelStyle = 'font-family: monospace; color: #87CEEB; font-weight: bold;';
            const valueStyle = 'font-family: monospace; color: #FF6699; font-weight: bold;';
            const timeStyle = 'font-family: monospace; color: #888; font-style: italic;';
            const logMessage = `%c EXT.js from Yushifishish %c BilibiliVideoEXT %c\n%cSENDER: %c${blockId}%c\n%cMESSAGE: %c${message+"("+content+")"}%c\n%cTIME: %c${timestamp}`;
            if(this.opt){
                alert(logMessage)
            }
            const logStyles = [
                outerStyle,
                innerStyle,
                '',
                labelStyle,
                valueStyle,
                '',
                labelStyle,
                valueStyle,
                '',
                labelStyle,
                timeStyle
            ];
            if (type == 'warning') {
                console.warn(logMessage, ...logStyles);
            } else if (type == 'error' || type == 'die') {
                console.error(logMessage, ...logStyles);
            } else {
                console.log(logMessage, ...logStyles);
            }
        }
        aboutAPILICENCE() {
            this.addOperationLog('info::about', 'Opening API license page');
            open('https://learn.ccw.site/article/5a05f4dd-4b2d-4a5b-a69b-31bd6241420a')
        }
        open(url) {
            this.addOperationLog('info::open', `Opening URL: ${url}`);
            window.open(url)
        }
        
        async _fetchWithProxy(targetUrl, attempt = 0, retryCount = 0, fdbk = '') {
            const headers = {
                //"x-cors-api-key": "live_2e3b685f005ca86aff2a792f20104c0d09fc3631cca45c81",
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Referer': 'https://www.ccw.site/',
                'Origin': 'https://www.ccw.site',
                'Accept': 'application/json, text/plain, */*'
            };
            if (attempt >= this.uapi.length) {
                if (retryCount < 3) {
                    this.addOperationLog('proxy::retry', `All proxies failed, retrying (${retryCount + 1}/3)`, 'warning');
                    return this._fetchWithProxy(targetUrl, 0, retryCount + 1);
                } else {
                    console.warn("Old sys yfsh::Warn\n" + fdbk )
                    throw new Error(translate({id: 'BilibiliVideoEXT_alert_proxyFailed'}));
                }
            }
            const proxy = this.uapi[attempt];
            var fullUrl = proxy + encodeURIComponent(targetUrl)
            if(!proxy.includes("?")){
                fullUrl = proxy + targetUrl
            }
            try {
                const response = await fetch(fullUrl, { headers });
                if (!response.ok) throw new Error(`代理返回错误：${response.status}`);

                let data = await response.json();
                if (data.contents) {
                    data = JSON.parse(data.contents);
                }
                this.addOperationLog('proxy::fetch', `Fetched API data: ${JSON.stringify(data)}`);
                return data;
            } catch (error) {
                this.addOperationLog('proxy::retry', `Proxy ${proxy.split('/')[2]} retry failed: ${error.message}`, 'warning',error);
                return this._fetchWithProxy(targetUrl, attempt + 1, retryCount,fdbk + fullUrl + " : " + error.message + " ; \n");
            }
        }
        async _fetchImageAsBase64(imageUrl) {
            try {
                const proxyUrl = 'https://corsproxy.yushifishish.dpdns.org/?url=' + encodeURIComponent(imageUrl);
                const response = await fetch(proxyUrl, {
                    headers: {
                        //握草我在这里写了两个User-Agent握草我是不是沙币窝艹我艹我艹我艹我艹我艹我艹我艹我艹我艹我艹我艹我艹我艹我艹我艹我艹我艹
                        'Referer': 'https://www.ccw.site/',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                       // "x-cors-api-key" : "live_2e3b685f005ca86aff2a792f20104c0d09fc3631cca45c81"
                    }
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (e) {
                this.addOperationLog('image::fetch', `Failed to fetch image: ${e.message}`, 'error',e);
                return null;
            }
        }
        async _getVideoDirectLink(videoId) {
            this.limit++;
            //删除了限制
            console.log("YOU HAVE BEEN USE "+this.limit+" TIMES!!! QWQ…MY API…MY MONEY………")
            const isBV = videoId.toUpperCase().startsWith('BV');
            const videoUrl = isBV ?
                `https://www.bilibili.com/video/${videoId}` :
                `https://www.bilibili.com/video/av${videoId.replace('av', '')}`;
            const mirenApiUrl = `https://api.mir6.com/api/bzjiexi?url=${encodeURIComponent(videoUrl)}&type=json&myKey=3c27354b2b5c72c32c22f66e5de609ec`;
            this.addOperationLog('api::request', `Miren API original URL: ${mirenApiUrl}`);
            const apiData = await this._fetchWithProxy(mirenApiUrl);

            if (apiData.code !== 200) {
                throw new Error(`解析失败：${apiData.msg || translate({id: 'BilibiliVideoEXT_label_unknown'}),' Err'}`);
            }
            if (!apiData.data || apiData.data.length === 0) {
                throw new Error(translate({id: 'BilibiliVideoEXT_alert_noVideoData'}));
            }
            //videoData是视频里的，我忘了
            const videoData = apiData.data[0];
            const videoDirectUrl = videoData.video_url;
            const videoTitle = apiData.title
            const videoDurationStr = videoData.durationFormat || translate({id: 'BilibiliVideoEXT_label_unknown'});
            const videoAuthor = apiData.user?.name || translate({id: 'BilibiliVideoEXT_label_unknown'});
            const videoCover = apiData.imgurl || '';
            const videoDesc = apiData.desc || '';
        
            let videoDuration = null;
            if (typeof videoDurationStr === 'string') {
                const match = videoDurationStr.match(/(\d+)分(\d+)秒/);
                if (match) {
                    videoDuration = parseInt(match[1]) * 60 + parseInt(match[2]);
                }
            } else if (typeof videoDurationStr === 'number') {
                videoDuration = videoDurationStr;
            }
            return {
                url: videoDirectUrl,
                title: videoTitle,
                duration: videoDuration,
                author: videoAuthor,
                cover:videoCover,
                desc:videoDesc
            };
        }
        async _fetchVideoData(videoId) {
            try {
                const isBV = videoId.toUpperCase().startsWith('BV');
                const apiUrl = isBV ?
                    `https://api.bilibili.com/x/web-interface/view?bvid=${videoId}` :
                    `https://api.bilibili.com/x/web-interface/view?aid=${videoId.replace('av', '')}`;
                const data = await this._fetchWithProxy(apiUrl);
                this.addOperationLog('video::fetch', `Fetched video data: ${JSON.stringify(data)}`);
                return data.code === 0 ? data.data : null;
            } catch (error) {
                this.addOperationLog('video::fetch', `Failed to fetch video data: ${error.message}`, 'error',error);
                return null;
            }
        }
        async _getCachedVideoData(videoId) {
            if (!this.cachedVideoData[videoId]) {
                this.addOperationLog('cache::fetch', `Fetching video data from API: ${videoId}`);
                this.cachedVideoData[videoId] = await this._fetchVideoData(videoId);
            } else {
                this.addOperationLog('cache::hit', `Using cached video data: ${videoId}`);
            }
            return this.cachedVideoData[videoId];
        }
        async _applyVideoCover(picUrl, originalTarget) {
            const base64Data = await this._fetchImageAsBase64(picUrl);
            if (!base64Data) {
                this.addOperationLog('video::cover', `Failed to fetch cover image`, 'error');
                return;
            }
            
            let drawableId;
            try {
                drawableId = originalTarget.drawableID;
            } catch (e) {
                drawableId = originalTarget._drawableID || originalTarget.drawableId;
            }
            
            try {
                const renderer = this.runtime.renderer || Scratch.vm.renderer;
                const nextSkinId = renderer._nextSkinId++;
                const newSkin = renderer._allSkins[nextSkinId] = new ImageSkinFromBase64(nextSkinId, renderer, base64Data);
                const drawable = renderer._allDrawables[drawableId];
                if (drawable) {
                    drawable.skin = newSkin;
                    this.addOperationLog('video::cover', `Cover applied to drawable ${drawableId}`);
                }
            } catch (e) {
                this.addOperationLog('video::cover', `Failed to apply cover: ${e.message}`, 'error',e);
            }
        }
        
        _createVideoElement(videoUrl) {
            const video = document.createElement('video');
            video.src = videoUrl;
            video.autoplay = true;
            video.crossOrigin = "anonymous"
            video.muted = false;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            video.controls = false;
            video.allowFullscreen = true;
            video.style.pointerEvents = 'auto';
            return video;
        }
        
        async playBilibiliVideo(args, /* Meng Fuzi patch: 用于获取当前角色 */util) {
            const originalTarget = util.target;
            const bilibiliId = args.BILIBILI_ID.trim();
            const videoIdInput = args.NEW_ID.trim();
            if (!bilibiliId) {
                this.addOperationLog('video::error', 'Bilibili ID cannot be empty', 'error');
                throw new Error(translate({id: 'BilibiliVideoEXT_alert_bvidEmpty'}));
            }
            if (!videoIdInput) {
                this.addOperationLog('video::error', 'Video ID cannot be empty', 'error');
                throw new Error(translate({id: 'BilibiliVideoEXT_alert_videoIdEmpty'}));
            }
            const videoIds = videoIdInput.split(',')
                .map(id => id.trim())
                .filter(id => id)
                .filter(id => id.toUpperCase() !== 'ALL');
            if (videoIds.length === 0) {
                this.addOperationLog('video::error', 'No valid video ID after filtering (ALL is reserved)', 'error',"videoIds.lenhgth===0");
                throw new Error(translate({id: 'BilibiliVideoEXT_alert_noValidId'}));
            }
            this.addOperationLog('video::play', `Parsed ${videoIds.length} valid IDs: ${videoIds.join(', ')}`);
            const promises = videoIds.map(async (videoId) => {
                try {
                    if (this.videos[videoId]) {
                        this.stopVideo({ VIDEO_ID: videoId });
                    }
                    this.addOperationLog('video::play', `Starting play ${bilibiliId} as [${videoId}]`);
                    const videoData = await this._getVideoDirectLink(bilibiliId);
                    const videoElement = this._createVideoElement(videoData.url);
                    return new Promise((resolve, reject) => {
                        videoElement.addEventListener('loadedmetadata', async () => {
                            this.addOperationLog('video::load', `Video [${videoId}] metadata loaded`);
                            try {
                                await videoElement.play();
                                this.addOperationLog('video::play', `Video [${videoId}] started`);
                            } catch (e) {
                                this.addOperationLog('video::play', `Error playing video [${videoId}]: ${e.message}`, 'error',e);
                                reject(e);
                                return;
                            }
                            try {
                                const renderer = this.runtime.renderer || Scratch.vm.renderer;
                                const nextId = renderer._nextSkinId++;
                                const newSkin = renderer._allSkins[nextId] = new VideoSkin(nextId, renderer, videoElement);
                                let drawableId;
                                try {
                                    drawableId = originalTarget.drawableID;
                                } catch (e) {
                                    drawableId = originalTarget._drawableID || originalTarget.drawableId;
                                }
                                const drawable = renderer._allDrawables[drawableId];
                                drawable.skin = newSkin;

                            } catch (e) {
                                this.addOperationLog('video::play', `Error setting video skin [${videoId}]: ${e.message}`, 'error',e);
                                reject(e);
                                return;
                            }
                            this.videos[videoId] = {
                                element: videoElement,
                                data: {
                                    title: videoData.title,
                                    owner: { name: videoData.author },
                                    duration: videoData.duration,
                                    desc: videoData.desc || '',
                                    pic:videoData.cover || '',
                                    stat: {
                                        like: 'N/A', coin: 'N/A', favorite: 'N/A',
                                        share: 'N/A', view: 'N/A', danmaku: 'N/A'
                                    }
                                },
                                bilibiliId: bilibiliId
                            };
                            (async () => {
                                try {
                                    const metadata = await this._fetchVideoData(bilibiliId);
                                    if (metadata && this.videos[videoId]) {
                                        this.videos[videoId].data = {
                                            ...this.videos[videoId].data,
                                            stat: metadata.stat || this.videos[videoId].data.stat,
                                            pic: metadata.pic,
                                        };
                                    }
                                } catch (error) {
                                    this.addOperationLog('video::play', `Error fetching video metadata [${videoId}]: ${error.message}`, 'error',error);
                                    reject(error);
                                    return;
                                }
                            })();
                            resolve();
                        });
                        videoElement.addEventListener('error', (error) => {
                            const msg = `[${videoId}] load error: ${error.target.error.message}`;
                            this.addOperationLog('video::error', msg, 'error',error);
                            reject(new Error(msg));
                        });
                    });

                } catch (error) {
                    this.addOperationLog('video::play', `Error loading video [${videoId}]: ${error.message}`, 'error',error);
                    reject(error);
                    return Promise.resolve();
                }
            });
            await Promise.all(promises);

        }
        async playVideoById(args, /* Meng Fuzi patch: 用于获取当前角色 */util) {
            const originalTarget = util.target;
            return new Promise((resolve, reject) => {
                const videoId = args.VIDEO_ID.trim();
                this.addOperationLog('video::play', `Playing video by ID: ${videoId}`);
                if (!this.videos[videoId]) {
                    const errorMsg = `Video with ID ${videoId} does not exist`;
                    this.addOperationLog('video::play', errorMsg, 'error',"!this.videos[videoId]");
                    reject(new Error(errorMsg));
                    return;
                }
                const video = this.videos[videoId];
                try {
                    video.element.play();
                    this.addOperationLog('video::play', `Video ${videoId} started playing`);
                } catch (e) {
                    this.addOperationLog('video::play', `Error playing video [${videoId}]: ${e.message}`, 'error',e);
                    reject(e);
                    return;
                }
                try {
                    const renderer = this.runtime.renderer || Scratch.vm.renderer;
                    const nextId = renderer._nextSkinId++;
                    const newSkin = renderer._allSkins[nextId] = new VideoSkin(nextId, renderer, video.element);
                    let drawableId;
                    try {
                        drawableId = originalTarget.drawableID;
                    } catch (e) {
                        drawableId = originalTarget._drawableID || originalTarget.drawableId;
                    }
                    const drawable = renderer._allDrawables[drawableId];
                    drawable.skin = newSkin;
                    this.addOperationLog('video::render', `Video ${videoId} rendered to stage`);
                } catch (e) {
                    this.addOperationLog('video::render', `Error setting video skin [${videoId}]: ${e.message}`, 'error',e);
                    reject(e);
                    return;
                }
                resolve();
            });
        }
        
        stopVideo(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                Object.keys(this.videos).forEach(id => {
                    this._stopSingleVideo(id);
                });
                this.addOperationLog('video::stop', 'All videos stopped');
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                idList.forEach(id => {
                    if (this.videos[id]) {
                        this._stopSingleVideo(id);
                    }
                });
                this.addOperationLog('video::stop', `Multiple videos stopped: ${videoId}`);
            } else if (this.videos[videoId]) {
                this._stopSingleVideo(videoId);
                this.addOperationLog('video::stop', `Video ${videoId} stopped`);
            }
        }
        _stopSingleVideo(videoId) {
            const video = this.videos[videoId];
            if (video?.element) {
                try {
                    video.element.pause();
                } catch (e) {
                    this.addOperationLog('video::stop', `Error pausing video [${videoId}]: ${e.message}`, 'error',e);
                    reject(e);
                    return;
                }
                video.element = null;
            }
            delete this.videos[videoId];
        }
        
        pauseVideo(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                Object.keys(this.videos).forEach(id => {
                    if (this.videos[id]?.element) {
                        this.videos[id].element.pause();
                    }
                });
                this.addOperationLog('video::pause', 'All videos paused');
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                idList.forEach(id => {
                    if (this.videos[id]?.element) {
                        try {
                            this.videos[id].element.pause();
                        } catch (e) {
                            this.addOperationLog('video::pause', `Error pausing video [${id}]: ${e.message}`, 'error',e);
                        }
                    }
                });
                this.addOperationLog('video::pause', `Multiple videos paused: ${videoId}`);
            } else if (this.videos[videoId]?.element) {
                this.videos[videoId].element.pause();
                this.addOperationLog('video::pause', `Video ${videoId} paused`);
            }
        }
        resumeVideo(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                try {
                    Object.keys(this.videos).forEach(id => {
                        if (this.videos[id]?.element) {
                            this.videos[id].element.play();
                        }
                    });
                    this.addOperationLog('video::resume', 'All videos resumed');
                } catch (e) {
                    this.addOperationLog('video::resume', `Error resuming videos: ${e.message}`, 'error',e);
                    reject(e);
                    return;
                }
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                idList.forEach(id => {
                    if (this.videos[id]?.element) {
                        this.videos[id].element.play();
                    }
                });
                this.addOperationLog('video::resume', `Multiple videos resumed: ${videoId}`);
            } else if (this.videos[videoId]?.element) {
                try {
                    this.videos[videoId].element.play();
                } catch (e) {
                    this.addOperationLog('video::resume', `Video ${videoId} resumed`);
                }
            }
        }
        isVideoPaused(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                const allPaused = Object.keys(this.videos).every(id => {
                    return !this.videos[id]?.element || this.videos[id].element.paused;
                });
                this.addOperationLog('video::info', `All videos paused status: ${allPaused}`);
                return allPaused;
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                const result = {};
                idList.forEach(id => {
                    if (this.videos[id]?.element) {
                        result[id] = this.videos[id].element.paused;
                    } else {
                        result[id] = false;
                    }
                });
                this.addOperationLog('video::info', `Multiple videos paused status: ${videoId}`);
                return result;
            } else if (this.videos[videoId]?.element) {
                const isPaused = this.videos[videoId].element.paused;
                this.addOperationLog('video::info', `Video ${videoId} paused status: ${isPaused}`);
                return isPaused;
            } else {
                this.addOperationLog('video::info', `No video ${videoId} currently playing for pause check`, 'warning');
                return false;
            }
        }
        setVideoPlaybackRate(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            const rate = parseFloat(args.RATE) || 1.0;
            if (videoId === 'ALL') {
                Object.keys(this.videos).forEach(id => {
                    if (this.videos[id]?.element) {
                        this.videos[id].element.playbackRate = Math.max(0.1, Math.min(16, rate));
                    }
                });
                this.addOperationLog('video::rate', `All videos playback rate set to: ${rate}`);
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                idList.forEach(id => {
                    if (this.videos[id]?.element) {
                        this.videos[id].element.playbackRate = Math.max(0.1, Math.min(16, rate));
                    }
                });
                this.addOperationLog('video::rate', `Multiple videos playback rate set to: ${rate} (IDs: ${videoId})`);
            } else if (this.videos[videoId]?.element) {
                this.videos[videoId].element.playbackRate = Math.max(0.1, Math.min(16, rate));
                this.addOperationLog('video::rate', `Video ${videoId} playback rate set to: ${rate}`);
            }
        }
        getCurrentVideoTime(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            const timeType = args.TIME_TYPE;
            if (videoId === 'ALL') {
                const allTimes = {};
                Object.keys(this.videos).forEach(id => {
                    if (this.videos[id]?.element) {
                        allTimes[id] = this._getVideoTime(this.videos[id].element, timeType);
                    }
                });
                this.addOperationLog('video::info', `Got all video times`);
                return JSON.stringify(allTimes);
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                const result = {};
                idList.forEach(id => {
                    if (this.videos[id]?.element) {
                        result[id] = this._getVideoTime(this.videos[id].element, timeType);
                    } else {
                        result[id] = '0';
                    }
                });
                this.addOperationLog('video::info', `Got multiple video times: ${videoId}`);
                return JSON.stringify(result);
            } else if (this.videos[videoId]?.element) {
                return this._getVideoTime(this.videos[videoId].element, timeType);
            } else {
                this.addOperationLog('video::info', `No video ${videoId} currently playing for time query`, 'warning');
                return '0';
            }
        }
        _getVideoTime(videoElement, timeType) {
            const time = videoElement.currentTime;
            const timeTypeMap = {
                'mm:ss': () => {
                    const mins = Math.floor(time / 60);
                    const secs = Math.floor(time % 60);
                    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                },
                'ss': () => {
                    return Math.floor(time).toString();
                },
                'ms': () => {
                    return Math.floor(time * 1000).toString();
                }
            };
            const formatter = timeTypeMap[timeType] || timeTypeMap['mm:ss'];
            return formatter ? formatter() : '0';
        }
        seekToTime(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            const minute = Number(args.MINUTE) || 0;
            const second = Number(args.SECOND) || 0;
            const time = minute * 60 + second;
            if (videoId === 'ALL') {
                Object.keys(this.videos).forEach(id => {
                    if (this.videos[id]?.element) {
                        this.videos[id].element.currentTime = time;
                    }
                });
                this.addOperationLog('video::seek', `All videos seeked to ${minute}:${second}`);
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                idList.forEach(id => {
                    if (this.videos[id]?.element) {
                        this.videos[id].element.currentTime = time;
                    }
                });
                this.addOperationLog('video::seek', `Multiple videos seeked to ${minute}:${second} (IDs: ${videoId})`);
            } else if (this.videos[videoId]?.element) {
                this.videos[videoId].element.currentTime = time;
                this.addOperationLog('video::seek', `Video ${videoId} seeked to ${minute}:${second}`);
            }
        }

        async getVideoTitle(args) {
            const data = await this._getCachedVideoData(args.BILIBILI_ID);
            const title = data?.title || translate({id: 'BilibiliVideoEXT_label_unknown'});
            this.addOperationLog('video::info', `Got video title: ${title}`);
            return title;
        }
        async getVideoAuthor(args) {
            const data = await this._getCachedVideoData(args.BILIBILI_ID);
            const author = data?.owner?.name || translate({id: 'BilibiliVideoEXT_label_unknown'});
            this.addOperationLog('video::info', `Got video author: ${author}`);
            return author;
        }
        async getVideoStats(args) {
            const data = await this._getCachedVideoData(args.BILIBILI_ID);
            if (!data) {
                this.addOperationLog('video::info', 'No video data available for stats', 'warning');
                return 0;
            }
            const statMap = {
                [translate({
                    id: "BilibiliVideoEXT_statType_like"
                })]: 'like',
                [translate({
                    id: "BilibiliVideoEXT_statType_coin"
                })]: 'coin',
                [translate({
                    id: "BilibiliVideoEXT_statType_favorite"
                })]: 'favorite',
                [translate({
                    id: "BilibiliVideoEXT_statType_share"
                })]: 'share',
                [translate({
                    id: "BilibiliVideoEXT_statType_view"
                })]: 'view',
                [translate({
                    id: "BilibiliVideoEXT_statType_danmaku"
                })]: 'danmaku'
            };
            return data.stat[statMap[args.STAT_TYPE]] || 0;
        }
        async getVideoCover(args) {
           //alert用中文
           alert('请使用新的showVideoCover功能。args:'+JSON.stringify(args));
        }
        async showVideoCover(args, util) {
            const bilibiliId = args?.BILIBILI_ID;
            if (!bilibiliId) {
                this.addOperationLog('video::error', 'Bilibili ID cannot be empty', 'error');
                return;
            }
            
            const originalTarget = util?.target;
            
            try {
                const data = await this._getCachedVideoData(bilibiliId);
                const pic = data?.pic;
                if (pic) {
                    await this._applyVideoCover(pic, originalTarget);
                    this.addOperationLog('video::cover', `Video ${bilibiliId} cover shown`);
                } else {
                    this.addOperationLog('video::cover', `No cover available for ${bilibiliId}`, 'warning');
                }
            } catch (e) {
                this.addOperationLog('video::error', `Failed to show cover: ${e.message}`, 'error',e);
            }
        }
        getCurrentVideoTitle(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                const allTitles = {};
                Object.keys(this.videos).forEach(id => {
                    if (this.videos[id]?.data) {
                        allTitles[id] = this.videos[id].data.title || translate({id: 'BilibiliVideoEXT_label_unknown'});
                    }
                });
                this.addOperationLog('video::info', `Got all video titles`);
                return JSON.stringify(allTitles);
            }else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                const result = {};
                idList.forEach(id => {
                    if (this.videos[id]?.data) {
                        result[id] = this.videos[id].data.title || translate({id: 'BilibiliVideoEXT_label_unknown'});
                    } else {
                        result[id] = translate({id: 'BilibiliVideoEXT_alert_playVideoFirst'});
                    }
                });
                this.addOperationLog('video::info', `Got multiple video titles: ${videoId}`);
                return JSON.stringify(result);
            } else if (this.videos[videoId]?.data) {
                const title = this.videos[videoId].data.title || translate({id: 'BilibiliVideoEXT_alert_playVideoFirst'});
                this.addOperationLog('video::info', `Got video ${videoId} title: ${title}`);
                return title;
            } else {
                this.addOperationLog('video::info', `No video ${videoId} currently playing`, 'warning');
                return translate({id: 'BilibiliVideoEXT_alert_playVideoFirst'});
            }
        }
        getCurrentVideoAuthor(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                const allAuthors = {};
                Object.keys(this.videos).forEach(id => {
                    if (this.videos[id]?.data) {
                        allAuthors[id] = this.videos[id].data.owner?.name || translate({id: 'BilibiliVideoEXT_label_unknown'});
                    }
                });
                this.addOperationLog('video::info', `Got all video authors`);
                return JSON.stringify(allAuthors);
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                const result = {};
                idList.forEach(id => {
                    if (this.videos[id]?.data) {
                        result[id] = this.videos[id].data.owner?.name || translate({id: 'BilibiliVideoEXT_label_unknown'});
                    } else {
                        result[id] = translate({id: "BilibiliVideoEXT_label_unknown"});
                    }
                });
                this.addOperationLog('video::info', `Got multiple video authors: ${videoId}`);
                return JSON.stringify(result);
            } else if (this.videos[videoId]?.data) {
                const author = this.videos[videoId].data.owner?.name || translate({id: 'BilibiliVideoEXT_label_unknown'});
                this.addOperationLog('video::info', `Got video ${videoId} author: ${author}`);
                return author;
            } else {
                this.addOperationLog('video::info', `No video ${videoId} currently playing`, 'warning');
                return translate({id: "BilibiliVideoEXT_label_unknown"});
            }
        }
        getCurrentVideoStats(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                const allStats = {};
                Object.keys(this.videos).forEach(id => {
                    if (this.videos[id]?.data) {
                        allStats[id] = this.videos[id].data.stat || {};
                    }
                });
                this.addOperationLog('video::info', `Got all video stats`);
                return JSON.stringify(allStats);
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                const result = {};
                idList.forEach(id => {
                    if (this.videos[id]?.data) {
                        result[id] = this._getVideoStats(this.videos[id].data, args.STAT_TYPE);
                    } else {
                        result[id] = translate({id: 'BilibiliVideoEXT_alert_playVideoFirst'});
                    }
                });
                this.addOperationLog('video::info', `Got multiple video stats: ${videoId}`);
                return JSON.stringify(result);
            } else if (this.videos[videoId]?.data) {
                return this._getVideoStats(this.videos[videoId].data, args.STAT_TYPE);
            } else {
                this.addOperationLog('video::info', `No video ${videoId} currently playing`, 'warning');
                return translate({id: 'BilibiliVideoEXT_alert_playVideoFirst'});
            }
        }
        _getVideoStats(videoData, statType) {
            const statMap = {
                [translate({
                    id: "BilibiliVideoEXT_statType_like"
                })]: 'like',
                [translate({
                    id: "BilibiliVideoEXT_statType_coin"
                })]: 'coin',
                [translate({
                    id: "BilibiliVideoEXT_statType_favorite"
                })]: 'favorite',
                [translate({
                    id: "BilibiliVideoEXT_statType_share"
                })]: 'share',
                [translate({
                    id: "BilibiliVideoEXT_statType_view"
                })]: 'view',
                [translate({
                    id: "BilibiliVideoEXT_statType_danmaku"
                })]: 'danmaku'
            };
            const statValue = videoData.stat[statMap[statType]] || 0;
            this.addOperationLog('video::info', `Got video stat ${statType}: ${statValue}`);
            return statValue;
        }
        getCurrentVideoDuration(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                const allDurations = {};
                Object.keys(this.videos).forEach(id => {
                    if (this.videos[id]) {
                        allDurations[id] = this._getVideoDuration(this.videos[id]);
                    }
                });
                this.addOperationLog('video::info', `Got all video durations`);
                return JSON.stringify(allDurations);
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                const result = {};
                idList.forEach(id => {
                    if (this.videos[id]) {
                        result[id] = this._getVideoDuration(this.videos[id]);
                    } else {
                        result[id] = translate({id: "BilibiliVideoEXT_label_unknown"});
                    }
                });
                this.addOperationLog('video::info', `Got multiple video durations: ${videoId}`);
                return JSON.stringify(result);
            } else if (this.videos[videoId]) {
                return this._getVideoDuration(this.videos[videoId]);
            } else {
                this.addOperationLog('video::info', `No video ${videoId} currently playing`, 'warning');
                return translate({id: "BilibiliVideoEXT_label_unknown"});
            }
        }
        _getVideoDuration(video) {
            if (video.data && typeof video.data.duration === 'number') {
                const mins = Math.floor(video.data.duration / 60);
                const secs = Math.floor(video.data.duration % 60);
                const duration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                this.addOperationLog('video::info', `Got video duration: ${duration}`);
                return duration;
            }
            if (video.element && !isNaN(video.element.duration)) {
                const mins = Math.floor(video.element.duration / 60);
                const secs = Math.floor(video.element.duration % 60);
                const duration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                this.addOperationLog('video::info', `Got video duration from video element: ${duration}`);
                return duration;
            }
            this.addOperationLog('video::info', 'No video duration available', 'warning');
            return translate({id: "BilibiliVideoEXT_label_unknown"});
        }
        getCurrentVideoCover(args){
            alert('请使用新的showCurrentVideoCover功能。args:'+JSON.stringify(args));
        }
        async showCurrentVideoCover(args, util) {
            const videoId = args?.VIDEO_ID;
            if (!videoId) {
                this.addOperationLog('video::cover', 'Video ID is required', 'error');
                return;
            }
            const originalTarget = util?.target;
            const pic = this.videos[videoId]?.data?.pic;
            if (pic) {
                await this._applyVideoCover(pic, originalTarget);
                this.addOperationLog('video::cover', `Showed video ${videoId} cover`);
            } else {
                this.addOperationLog('video::cover', `No video ${videoId} or cover not available`, 'warning');
            }
        }
        getCurrentVideoDesc(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                const allDescs = {};
                Object.keys(this.videos).forEach(id => {
                    if (this.videos[id]?.data) {
                        allDescs[id] = this.videos[id].data.desc || translate({id: "BilibiliVideoEXT_label_unknown"});
                    }
                });
                this.addOperationLog('video::info', `Got all video descriptions`);
                return JSON.stringify(allDescs);
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                const result = {};
                idList.forEach(id => {
                    if (this.videos[id]?.data) {
                        result[id] = this.videos[id].data.desc || translate({id: "BilibiliVideoEXT_label_unknown"});
                    } else {
                        result[id] = translate({id: "BilibiliVideoEXT_label_unknown"});
                    }
                });
                this.addOperationLog('video::info', `Got multiple video descriptions: ${videoId}`);
                return JSON.stringify(result);
            } else if (this.videos[videoId]?.data) {
                const desc = this.videos[videoId].data.desc || translate({id: "BilibiliVideoEXT_label_unknown"});
                this.addOperationLog('video::info', `Got video ${videoId} description`);
                return desc;
            } else {
                this.addOperationLog('video::info', `No video ${videoId} currently playing`, 'warning');
                return translate({id: "BilibiliVideoEXT_label_unknown"});
            }
        }
        async getVideoDesc(args) {
            const data = await this._getCachedVideoData(args.BILIBILI_ID);
            const desc = data?.desc || translate({id: "BilibiliVideoEXT_label_unknown"});
            this.addOperationLog('video::info', `Got video description`);
            return desc;
        }
        async getVideoDuration(args) {
            const data = await this._getCachedVideoData(args.BILIBILI_ID);
            if (!data?.duration) {
                this.addOperationLog('video::info', 'No video duration available', 'warning');
                return translate({id: "BilibiliVideoEXT_label_unknown"});
            }
            const mins = Math.floor(data.duration / 60);
            const secs = Math.floor(data.duration % 60);
            const duration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            this.addOperationLog('video::info', `Got video duration: ${duration}`);
            return duration;
        }

        async searchVideo(args) {
            const keyword = args.KEYWORD.trim();
            const page = Math.max(1, Math.floor(args.PAGE || 1));
            if (!keyword) {
                this.addOperationLog('search::error', 'Search keyword cannot be empty', 'error');
                return JSON.stringify({ error: translate({id: 'BilibiliVideoEXT_alert_searchKeywordEmpty'}) });
            }
            this.addOperationLog('search::request', `Searching videos with keyword: ${keyword}, page: ${page}`);
            try {
                const apiUrl = `https://api.bilibili.com/x/web-interface/search/all/v2?keyword=${encodeURIComponent(keyword)}&page=${page}&page_size=20`;
                const data = await this._fetchWithProxy(apiUrl);
                if (data.code !== 0) {
                    this.addOperationLog('search::error', `API returned error: ${data.message}`, 'error');
                    return JSON.stringify({ error: data.message || translate({id: 'BilibiliVideoEXT_alert_searchFailed'}) });
                }
                const videoResults = data.data?.result?.find(item => item.result_type === 'video')?.data || [];
                const formattedResults = videoResults.map(item => ({
                    bvid: item.bvid,
                    aid: item.aid,
                    title: item.title,
                    author: item.author,
                    play: item.play,
                    danmaku: item.danmaku,
                    length: item.duration,
                    pic: item.pic,
                    desc: item.description
                }));
                this.addOperationLog('search::success', `Found ${formattedResults.length} videos for keyword: ${keyword}`);
                return JSON.stringify(formattedResults);
            } catch (error) {
                this.addOperationLog('search::error', `Search failed: ${error.message}`, 'error',error);
                return JSON.stringify({ error: translate({id: 'BilibiliVideoEXT_alert_searchFailed'}) + ': ' + error.message });
            }
        }

        async playVideoByBase64(args, util) {
            const base64Str = args.BASE64_STR.trim();
            const videoIdInput = args.NEW_ID.trim();
            const originalTarget = util?.target;
            if (!base64Str) {
                this.addOperationLog('base64::error', 'Base64 string cannot be empty', 'error');
                throw new Error(translate({id: 'BilibiliVideoEXT_alert_base64Empty'}));
            }
            if (!base64Str.startsWith('data:video/')) {
                this.addOperationLog('base64::error', 'Invalid Base64 video format', 'error');
                throw new Error(translate({ id: "BilibiliVideoEXT_alert_invalidBase64" }));
            }
            if (!videoIdInput) {
                this.addOperationLog('base64::error', 'Video ID cannot be empty', 'error');
                throw new Error(translate({id: 'BilibiliVideoEXT_alert_videoIdEmpty'}));
            }
            const videoIds = videoIdInput.split(',')
                .map(id => id.trim())
                .filter(id => id)
                .filter(id => id.toUpperCase() !== 'ALL');
            if (videoIds.length === 0) {
                this.addOperationLog('base64::error', 'No valid video ID after filtering (ALL is not allowed)', 'error');
                throw new Error(translate({id: 'BilibiliVideoEXT_alert_noValidId'}));
            }
            this.addOperationLog('base64::play', `Parsed ${videoIds.length} valid video IDs: ${videoIds.join(', ')}`);
            for (const videoId of videoIds) {
                try {
                    if (this.videos[videoId]) {
                        this.stopVideo({ VIDEO_ID: videoId });
                    }
                    this.addOperationLog('base64::play', `Starting to play Base64 video as [${videoId}]`);
                    const videoElement = this._createVideoElement(base64Str);
                    videoElement.addEventListener('loadedmetadata', async () => {
                        this.addOperationLog('base64::load', `Base64 video [${videoId}] metadata loaded`);
                        try {
                            await videoElement.play();
                            this.addOperationLog('base64::play', `Base64 video [${videoId}] started playing`);
                        } catch (e) {
                            this.addOperationLog('base64::play', `Failed to play [${videoId}]: ${e.message}`, 'warning',e);
                            return;
                        }
                        if (util && util.target) {
                            try {
                                const renderer = this.runtime.renderer || Scratch.vm.renderer;
                                const nextId = renderer._nextSkinId++;
                                const newSkin = renderer._allSkins[nextId] = new VideoSkin(nextId, renderer, videoElement);
                                let drawableId;
                                try {
                                    drawableId = originalTarget.drawableID;
                                } catch (e) {
                                    drawableId = originalTarget._drawableID || originalTarget.drawableId;
                                }
                                const drawable = renderer._allDrawables[drawableId];
                                drawable.skin = newSkin;
                                this.addOperationLog('base64::render', `Base64 video [${videoId}] rendered to stage`);
                            } catch (e) {
                                this.addOperationLog('base64::render', `Failed to render [${videoId}]: ${e.message}`, 'error',e);
                            }
                        }
                        this.videos[videoId] = {
                            element: videoElement,
                            data: {
                                title: 'Base64 Video',
                                owner: { name: 'Local' },
                                duration: videoElement.duration,
                                //不是我写这个hyw 唉算了
                                stat: {
                                    like: 'N/A',
                                    coin: 'N/A',
                                    favorite: 'N/A',
                                    share: 'N/A',
                                    view: 'N/A',
                                    danmaku: 'N/A'
                                }
                            }
                        };
                    });
                    videoElement.addEventListener('error', (error) => {
                        const errorMsg = `[${videoId}] loading error: ${error.target.error.message}`;
                        this.addOperationLog('base64::error', errorMsg, 'error',error);
                    });
                } catch (videoError) {
                    this.addOperationLog('base64::error', `Process video [${videoId}] failed: ${videoError.message}`, 'error',videoError);
                }
            }
            this.addOperationLog('base64::finish', `All valid videos processed: ${videoIds.length} videos`);
        }
        getLastBase64String() {
            this.addOperationLog('base64::info', 'Got last Base64 string');
            return this.lastBase64String || '';
        }
        getBase64VideoName(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                const allNames = {};
                Object.keys(this.videos).forEach(id => {
                    allNames[id] = this.videos[id]?.data?.title || 'Base64 Video';
                });
                this.addOperationLog('base64::info', `Got all Base64 video names`);
                return JSON.stringify(allNames);
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                const result = {};
                idList.forEach(id => {
                    result[id] = this.videos[id]?.data?.title || 'Base64 Video';
                });
                this.addOperationLog('base64::info', `Got multiple Base64 video names: ${videoId}`);
                return JSON.stringify(result);
            } else if (this.videos[videoId]) {
                const name = this.videos[videoId].data?.title || 'Base64 Video';
                this.addOperationLog('base64::info', `Got Base64 video ${videoId} name: ${name}`);
                return name;
            } else {
                this.addOperationLog('base64::info', `No Base64 video ${videoId} currently playing`, 'warning');
                return 'Base64 Video';
            }
        }
        getBase64VideoSize(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                const allSizes = {};
                Object.keys(this.videos).forEach(id => {
                    const video = this.videos[id];
                    if (!video.bilibiliId) {
                        allSizes[id] = this._getBase64VideoSize(video);
                    }
                });
                this.addOperationLog('base64::info', `Got all Base64 video sizes`);
                return JSON.stringify(allSizes);
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                const result = {};
                idList.forEach(id => {
                    const video = this.videos[id];
                    if (!video) {
                        result[id] = '0';
                    } else if (video.bilibiliId) {
                        result[id] = '0';
                    } else {
                        result[id] = this._getBase64VideoSize(video);
                    }
                });
                this.addOperationLog('base64::info', `Got multiple Base64 video sizes: ${videoId}`);
                return JSON.stringify(result);
            } else if (this.videos[videoId]) {
                const video = this.videos[videoId];
                if (video.bilibiliId) {
                    this.addOperationLog('base64::info', `Video ${videoId} is not a Base64 video`, 'warning');
                    return '0';
                }
                const size = this._getBase64VideoSize(video);
                this.addOperationLog('base64::info', `Got Base64 video ${videoId} size: ${size} MB`);
                return size;
            } else {
                this.addOperationLog('base64::info', `No Base64 video ${videoId} currently playing`, 'warning');
                return '0';
            }
        }
        _getBase64VideoSize(video) {
            if (!video || !video.element || !video.element.src) {
                return '0';
            }
            const base64Str = video.element.src;
            const base64Data = base64Str.split(',')[1];
            if (!base64Data) {
                return '0';
            }
            const byteLength = (base64Data.length * 3) / 4;
            const sizeInMB = (byteLength / (1024 * 1024)).toFixed(2);
            return sizeInMB;
        }
        getBase64VideoType(args) {
            const videoId = args?.VIDEO_ID || 'ALL';
            if (videoId === 'ALL') {
                const allTypes = {};
                Object.keys(this.videos).forEach(id => {
                    const video = this.videos[id];
                    if (!video.bilibiliId) {
                        allTypes[id] = this._getBase64VideoType(video);
                    }
                });
                this.addOperationLog('base64::info', `Got all Base64 video types`);
                return JSON.stringify(allTypes);
            } else if (videoId.includes(',')) {
                const idList = videoId.split(',')
                    .map(id => id.trim())
                    .filter(id => id);
                const result = {};
                idList.forEach(id => {
                    const video = this.videos[id];
                    if (!video) {
                        result[id] = 'video/mp4';
                    } else if (video.bilibiliId) {
                        result[id] = 'video/mp4';
                    } else {
                        result[id] = this._getBase64VideoType(video);
                    }
                });
                this.addOperationLog('base64::info', `Got multiple Base64 video types: ${videoId}`);
                return JSON.stringify(result);
            } else if (this.videos[videoId]) {
                const video = this.videos[videoId];
                if (video.bilibiliId) {
                    this.addOperationLog('base64::info', `Video ${videoId} is not a Base64 video`, 'warning');
                    return 'video/mp4';
                }
                const type = this._getBase64VideoType(video);
                this.addOperationLog('base64::info', `Got Base64 video ${videoId} type: ${type}`);
                return type;
            } else {
                this.addOperationLog('base64::info', `No Base64 video ${videoId} currently playing`, 'warning');
                return 'video/mp4';
            }
        }
        _getBase64VideoType(video) {
            if (!video || !video.element || !video.element.src) {
                return 'video/mp4';
            }
            const base64Str = video.element.src;
            const match = base64Str.match(/data:(video\/[^;]+);base64,/);
            return match ? match[1] : 'video/mp4';
        }
        uploadVideoToBase64() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';
            input.style.display = 'none';
            document.body.appendChild(input);
            input.onchange = (e) => {
                const file = e.target.files[0];
                document.body.removeChild(input);
                if (!file) return;
                if (file.size > 50 * 1024 * 1024) {
                    alert(translate({
                        id: "BilibiliVideoEXT_alert_videoTooLarge"
                    }));
                    return;
                }
                const loader = this._createGlassEffectLoader();
                document.body.appendChild(loader);
                const reader = new FileReader();
                reader.onprogress = (e) => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        loader.querySelector('#progressBar').style.width = `${percent}%`;
                    }
                };
                reader.onload = (event) => {
                    loader.remove();
                    const base64Str = event.target.result;
                    this.lastBase64String = base64Str;
                    this._showGlassEffectResult(base64Str, file);
                };
                reader.readAsDataURL(file);
            };
            input.click();
        }
        _fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        }
        _createGlassEffectLoader() {
            //不太会css，ai救我
            const loader = document.createElement('div');
            loader.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 20px;
                border-radius: 8px;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            `;
            loader.innerHTML = `
                <p style="color: #333; margin: 0 0 10px 0;">${translate({ id: "BilibiliVideoEXT_msg_videoConverting" })}</p>
                <div style="width: 300px; height: 8px; background: rgba(255,255,255,0.3); border-radius: 4px;">
                    <div id="progressBar" style="width: 0%; height: 100%; background: #FF69B4; border-radius: 4px; transition: width 0.3s ease;"></div>
                </div>
            `;
            return loader;
        }
        _showGlassEffectResult(base64Str, file) {
            //不太会css，ai救我
            const resultDiv = document.createElement('div');
            resultDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                padding: 20px;
                border-radius: 8px;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            `;
            const defaultVideoId = file.name.replace(/\.[^/.]+$/, "");
            resultDiv.innerHTML = `
                <p style="color: #333; margin-top: 0;">${translate({ id: "BilibiliVideoEXT_msg_videoConverted" })}</p>
                <p style="color: #333; margin: 5px 0;">${translate({ id: "BilibiliVideoEXT_label_filename" })}: ${file.name}</p>
                <p style="color: #333; margin: 5px 0;">${translate({ id: "BilibiliVideoEXT_label_size" })}: ${(file.size / (1024 * 1024)).toFixed(2)}MB</p>
                <p style="color: #333; margin: 5px 0; word-break: break-all;">Base64前缀: ${base64Str.substring(0, 50)}...</p>
                <div style="margin: 10px 0;">
                    <label style="color: #333; display: block; margin-bottom: 5px;">视频ID:</label>
                    <input type="text" id="videoNameInput" value="${defaultVideoId}" style="width: 100%; padding: 8px; border: none; border-radius: 4px; background: rgba(255, 255, 255, 0.1);">
                </div>
                <div style="margin: 15px 0;">
                    <button id="copyBtn" style="padding: 8px 16px; background: #FF69B480; color: white; border: none; border-radius: 4px; cursor: pointer;">${translate({ id: "BilibiliVideoEXT_msg_copySuccess" })}</button>
                    <button id="confirmBtn" style="margin-left: 10px; padding: 8px 16px; background: rgba(76, 175, 80, 0.8); color: white; border: none; border-radius: 4px; cursor: pointer;">确认</button>
                    <button id="cancelBtn" style="margin-left: 10px; padding: 8px 16px; background: rgba(200, 200, 200, 0.5); border: none; border-radius: 4px; cursor: pointer;">${translate({ id: "BilibiliVideoEXT_label_cancel" })}</button>
                </div>
            `;
            document.body.appendChild(resultDiv);
            resultDiv.querySelector('#copyBtn').addEventListener('click', () => {
                navigator.clipboard.writeText(base64Str).then(() => alert(translate({
                    id: "BilibiliVideoEXT_msg_copySuccess"
                })));
            });
            resultDiv.querySelector('#confirmBtn').addEventListener('click', () => {
                const videoId = resultDiv.querySelector('#videoNameInput').value.trim() || defaultVideoId;
                this.lastBase64String = base64Str;
                this.addOperationLog('base64::save', `Base64 video saved with ID: ${videoId}`);
                resultDiv.remove();
                alert(`视频已转换成功！视频ID: ${videoId}`);
            });
            resultDiv.querySelector('#cancelBtn').addEventListener('click', () => {
                resultDiv.remove();
            });
        }
        _validateBase64Format(base64Str) {
            if (!base64Str || !base64Str.startsWith('data:video/')) {
                alert(translate({
                    id: "BilibiliVideoEXT_alert_invalidBase64"
                }));
                return false;
            }
            return true;
        }
        _getListByType(chosen) {
            let list = [];
            const listMap = {
                [translate({id: "BilibiliVideoEXT_listType_allID"})]: 'allID',
                [translate({id: "BilibiliVideoEXT_listType_nowID"})]: 'nowID',
                [translate({id: "BilibiliVideoEXT_listType_base64ID"})]: 'base64ID',
                [translate({id: "BilibiliVideoEXT_listType_bilibiliVideoID"})]: 'bilibiliVideoID'
            };
            const normalizedChosen = listMap[chosen] || chosen;
            switch (normalizedChosen) {
                case 'allID':
                    list = Object.keys(this.videos);
                    break;
                case 'nowID':
                    list = Object.keys(this.videos).filter(id => this.videos[id]?.element);
                    break;
                case 'base64ID':
                    list = Object.keys(this.videos).filter(id => !this.videos[id]?.bilibiliId);
                    break;
                case 'bilibiliVideoID':
                    list = Object.keys(this.videos).filter(id => this.videos[id]?.bilibiliId);
                    break;
                default:
                    try {
                        let processedChosen = normalizedChosen;
                        if (processedChosen.startsWith('[') && processedChosen.endsWith(']')) {
                            processedChosen = processedChosen.replace(/'([^']*)'/g, '"$1"');
                        }
                        list = JSON.parse(processedChosen);
                        if (!Array.isArray(list)) {
                            list = [];
                        }
                    } catch (e) {
                        list = [normalizedChosen];
                    }
                    break;
            }
            return list;
        }
        getList(args) {
            const chosen = args.CHOSEN;
            const list = this._getListByType(chosen);
            this.addOperationLog('list::get', `Got ${chosen} list: ${list.length} items`);
            return JSON.stringify(list);
        }
        getListCount(args) {
            const chosen = args.CHOSEN;
            const list = this._getListByType(chosen);
            const count = list.length;
            this.addOperationLog('list::count', `Got ${chosen} list count: ${count}`);
            return count.toString();
        }
        getListItem(args) {
            const chosen = args.CHOSEN;
            const number = Math.max(1, Math.floor(args.NUMBER || 1)) - 1; // 转换为0-based索引
            const list = this._getListByType(chosen);
            const item = list[number] || '';
            this.addOperationLog('list::item', `Got ${chosen} list item at index ${number + 1}: ${item}`);
            return item;
        }
        getListHasItem(args) {
            const chosen = args.CHOSEN;
            const string = args.STRING;
            const list = this._getListByType(chosen);
            const hasItem = list.includes(string);
            this.addOperationLog('list::hasItem', `${chosen} list has item ${string}: ${hasItem}`);
            return hasItem;
        }
        getListHasText(args) {
            const chosen = args.CHOSEN;
            const string = args.STRING;
            const list = this._getListByType(chosen);
            const hasText = list.some(item => String(item).includes(string));
            this.addOperationLog('list::hasText', `${chosen} list has text ${string}: ${hasText}`);
            return hasText;
        }
        getListItemCount(args) {
            const chosen = args.CHOSEN;
            const string = args.STRING;
            const list = this._getListByType(chosen);
            const filteredList = list.filter(item => item === string);
            this.addOperationLog('list::itemCount', `Got ${filteredList.length} items matching ${string} in ${chosen} list`);
            return JSON.stringify(filteredList);
        }
        getListTextCount(args) {
            const chosen = args.CHOSEN;
            const string = args.STRING;
            const list = this._getListByType(chosen);
            const filteredList = list.filter(item => String(item).includes(string));
            this.addOperationLog('list::textCount', `Got ${filteredList.length} items containing ${string} in ${chosen} list`);
            return JSON.stringify(filteredList);
        }
        //BASE64 TO SCRATCH(EXPERIMENTAL FEATURE
        //你将会看到AI大刀阔斧写石山打分。
        base64ToScratch(args) {
            const input = args.INPUT;
            const change = args.CHANGE;
            const menu = args.MENU;
            this.addOperationLog('base64::convert', `Converting ${menu} with input ${input.substring(0, 50)}... to ${change.substring(0, 50)}...`);
            this._showBase64ToScratchDialog(input, change, menu);
        }
        _showBase64ToScratchDialog(input, change, menu) {
            //ai救我
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 500px;
                padding: 25px;
                border-radius: 12px;
                z-index: 99999;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            `;
            modal.innerHTML = `
                <h3 style="color: #333; margin-top: 0; text-align: center;">Base64转Scratch</h3>
                <div style="margin: 15px 0; padding: 15px; background: rgba(255,107,107,0.2); border-radius: 8px; border-left: 4px solid #ff6b6b;">
                    <p style="color: #333; margin: 5px 0; font-size: 13px; line-height: 1.5;"><strong>⚠️ 警告:</strong> Scratch本身不支持MP4文件，使用base64存储会导致作品文件过大，涉及角色被点击后作品可能崩溃！强烈建议使用广播、添加新角色或在B站发视频的方式！</p>
                </div>
                <div style="margin: 15px 0; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <p style="color: #333; margin: 5px 0; font-size: 13px;"><strong>查找:</strong> ${input.substring(0, 50)}...</p>
                    <p style="color: #333; margin: 5px 0; font-size: 13px;"><strong>替换:</strong> ${change.substring(0, 50)}...</p>
                </div>
                <div style="margin: 20px 0; text-align: center;">
                    <label style="color: #333; display: block; margin-bottom: 10px;">上传project.json文件</label>
                    <input type="file" id="projectFileInput" accept=".json" style="display: none;">
                    <button id="uploadProjectBtn" style="padding: 10px 20px; background: rgba(76,175,80,0.8); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">选择project.json</button>
                    <span id="projectFileName" style="margin-left: 10px; color: #333;"></span>
                </div>
                <div id="searchResult" style="margin: 15px 0; display: none;">
                    <p style="color: #333;">找到 <span id="matchCount" style="color: #ff6b6b; font-weight: bold;">0</span> 个playVideoByBase64积木</p>
                </div>
                <div style="margin: 20px 0; text-align: center;">
                    <button id="processBtn" disabled style="padding: 10px 30px; background: rgba(158,158,158,0.6); color: white; border: none; border-radius: 4px; cursor: not-allowed; font-size: 14px;">下载修改后的文件</button>
                    <button id="cancelBtn" style="margin-left: 10px; padding: 10px 30px; background: rgba(200,200,200,0.5); border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">取消</button>
                </div>
            `;
            document.body.appendChild(modal);
            const projectInput = modal.querySelector('#projectFileInput');
            let projectJson = null;
            let matchCount = 0;
            modal.querySelector('#uploadProjectBtn').addEventListener('click', () => projectInput.click());
            projectInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    modal.querySelector('#projectFileName').textContent = file.name;
                    const text = await file.text();
                    try {
                        projectJson = JSON.parse(text);
                        const targets = projectJson.targets || [];
                        matchCount = 0;
                        let totalBlocks = 0;
                        let foundOpcodes = [];
                        for (const target of targets) {
                            const blocks = target.blocks || {};
                            for (const blockId in blocks) {
                                totalBlocks++;
                                const block = blocks[blockId];
                                if (block && block.opcode) {
                                    if (!foundOpcodes.includes(block.opcode)) {
                                        foundOpcodes.push(block.opcode);
                                    }
                                    if (block.opcode === 'BilibiliVideoEXT_playVideoByBase64') {
                                        const inputs = block.inputs || {};
                                        let inputValue = null;
                                        if (inputs.BASE64_STR) {
                                            const base64Str = inputs.BASE64_STR;
                                            if (Array.isArray(base64Str) && base64Str[1]) {
                                                const inner = base64Str[1];
                                                if (Array.isArray(inner) && inner[1]) {
                                                    inputValue = inner[1];
                                                } else if (typeof inner === 'string') {
                                                    inputValue = inner;
                                                }
                                            }
                                        }
                                        if (inputValue === input) {
                                            matchCount++;
                                        }
                                    }
                                }
                            }
                        }
                        modal.querySelector('#matchCount').textContent = matchCount;
                        modal.querySelector('#searchResult').style.display = 'block';
                        if (matchCount > 0) {
                            const btn = modal.querySelector('#processBtn');
                            btn.style.background = '#4CAF50';
                            btn.style.cursor = 'pointer';
                            btn.disabled = false;
                        }
                    } catch (err) {
                        alert('project.json格式错误: ' + err.message);
                        projectJson = null;
                    }
                }
            });
            modal.querySelector('#processBtn').addEventListener('click', () => {
                if (!projectJson) return;
                const targets = projectJson.targets || [];
                let modifiedCount = 0;
                for (const target of targets) {
                    const blocks = target.blocks || {};
                    for (const blockId in blocks) {
                        const block = blocks[blockId];
                        if (block && block.opcode === 'BilibiliVideoEXT_playVideoByBase64') {
                            const inputs = block.inputs || {};
                            let inputValue = null;
                            if (inputs.BASE64_STR) {
                                const base64Str = inputs.BASE64_STR;
                                if (Array.isArray(base64Str) && base64Str[1]) {
                                    const inner = base64Str[1];
                                    if (Array.isArray(inner) && inner[1]) {
                                        inputValue = inner[1];
                                    } else if (typeof inner === 'string') {
                                        inputValue = inner;
                                    }
                                }
                            }
                            if (inputValue === input) {
                                inputs.BASE64_STR = [1, [10, change]];
                                modifiedCount++;
                            }
                        }
                    }
                }
                const blob = new Blob([JSON.stringify(projectJson)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'project.json';
                a.click();
                URL.revokeObjectURL(url);
                modal.remove();
                this.addOperationLog('base64::convert', `Replaced BASE64_STR in ${modifiedCount} playVideoByBase64 blocks`);
                alert(`替换完成！共修改 ${modifiedCount} 个积木。`);
            });
            modal.querySelector('#cancelBtn').addEventListener('click', () => modal.remove());
        }
    }
    //TURBOWARP要加上这个！也删除下面那个
    /*if (typeof extensions !== 'undefined' && extensions.register) {
        const runtimeArg = typeof runtime !== 'undefined' ? runtime : null;
        extensions.register(new BilibiliVideoExtension(runtimeArg));
    }*/
    window.tempExt = {
        Extension: BilibiliVideoExtension,
        info: {
            name: 'B站视频扩展',
            description: '使用网页覆盖播放B站视频链接或者base64视频~ 并且可以获取视频内容哦~ ',
            extensionId: extension_id,
            iconURL: extension_menu_icon,
            insetIconURL: extension_block_icon,
            featured: true,
            disabled: false,
            collaboratorList: [{
                collaborator: 'FishishOuO @ CCW',
                collaboratorURL: 'https://www.ccw.site/student/67baf2bb3778fc282d62c9e8',
            }, {
                collaborator: '孟夫子驾到 @CCW',
                collaboratorURL: 'https://www.ccw.site/student/63c2807d669fa967f17f5559'
            }]
        },
    }
})(Scratch);