class SuperToolBox {
  constructor() {
    this.clipboardCache = "";
    this.audioPlayer = null;
    this.lastKey = "";
    window.addEventListener('keydown', (e) => { this.lastKey = e.key; });
  }

  getInfo() {
    return {
      id: 'WToolbox',
      name: 'W的高级工具箱',
      color1: '#2053c2',
      color2: '#0c3ba0',
      color3: '#07235f',
      iconURI: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTIwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9Z2IwIHgxPSI1MCUiIHgyPSI1MCUiIHkxPSIwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldDAlIiBzdG9wLWNvbG9yPSIjNDBmOWYwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMWM1MGIwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iNTUiIGZpbGw9IiMxMTIiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI0OCIgZmlsbD11cmwoI2diMCkiLz48cGF0aCBkPSJNMzggODBWMzBsMTIgMjggMTItMjh2NTBIMzgiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJODIgODBWMzBsMTIgMjggMTItMjh2NTBIMzgiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',

      blocks: [
        {opcode:'getFullTime',blockType:'reporter',text:'当前完整时间'},
        {opcode:'getWeek',blockType:'reporter',text:'当前星期'},
        '---',
        {opcode:'getOS',blockType:'reporter',text:'获取操作系统'},
        {opcode:'getBrowser',blockType:'reporter',text:'获取浏览器'},
        {opcode:'getCPU',blockType:'reporter',text:'获取CPU'},
        {opcode:'getDevice',blockType:'reporter',text:'获取设备类型'},
        {opcode:'getKey',blockType:'reporter',text:'当前按下的按键'},
        {opcode:'getStageWidth',blockType:'reporter',text:'获取舞台宽度'},
        {opcode:'getStageHeight',blockType:'reporter',text:'获取舞台高度'},
        {opcode:'captureStage',blockType:'command',text:'截取舞台截图并下载'},
        '---',
        {opcode:'aiChat',blockType:'reporter',text:'AI 问 [question]',
          arguments:{question:{type:'string',defaultValue:'你好'}}},
        '---',
        {opcode:'powerCalc',blockType:'reporter',text:'计算[NUM]的[POW]次幂',
          arguments:{NUM:{type:'number',defaultValue:2},POW:{type:'number',defaultValue:3}}},
        {
          opcode: 'circleArea',
          blockType: 'reporter',
          text: '计算圆面积 半径[R] π取到第[N]位',
          arguments: {
            R: { type: 'number', defaultValue: 5 },
            N: { type: 'number', defaultValue: 2 }
          }
        },
        '---',
        {opcode:'probRandomNum',blockType:'reporter',text:'从[min]到[max]随机数 抽到[tar]概率[per]%',
          arguments:{min:{type:'number',defaultValue:1},max:{type:'number',defaultValue:10},tar:{type:'number',defaultValue:5},per:{type:'number',defaultValue:30}}},
        '---',
        {opcode:'translateLang',blockType:'reporter',text:'将文本[txt]转为[lang]',
          arguments:{txt:{type:'string',defaultValue:'你好'},lang:{type:'string',menu:'langMenu',defaultValue:'en'}}},
        {opcode:'simpToTrad',blockType:'reporter',text:'简体转繁体 [text]',arguments:{text:{type:'string',defaultValue:'简体文字'}}},
        {opcode:'tradToSimp',blockType:'reporter',text:'繁体转简体 [text]',arguments:{text:{type:'string',defaultValue:'繁體文字'}}},
        '---',
        {opcode:'toUpper',blockType:'reporter',text:'转大写 [T]',
          arguments:{T:{type:'string',defaultValue:'hello'}}},
        {opcode:'toLower',blockType:'reporter',text:'转小写 [T]',
          arguments:{T:{type:'string',defaultValue:'HELLO'}}},
        '---',
        {opcode:'toPinyin',blockType:'reporter',text:'文字转拼音 [T]',
          arguments:{T:{type:'string',defaultValue:'你好'}}},
        {opcode:'toChinese',blockType:'reporter',text:'拼音转文字 [T]',
          arguments:{T:{type:'string',defaultValue:'ni hao'}}},
        '---',

        // ========== 新增：验证格式是否正确（下拉菜单） ==========
        {opcode:'checkValid',blockType:'reporter',text:'验证 [text] 是否为 [type]',
          arguments:{
            text:{type:'string',defaultValue:'输入内容'},
            type:{type:'string',menu:'checkMenu',defaultValue:'wechat'}
          }
        },
        '---',

        {opcode:'joinSwapStr',blockType:'reporter',text:'连接[A]换位符[B]',
          arguments:{A:{type:'string',defaultValue:'文本1'},B:{type:'string',defaultValue:'文本2'}}},
        '---',
        {opcode:'copyText',blockType:'command',text:'复制文本[TXT]',
          arguments:{TXT:{type:'string',defaultValue:'内容'}}},
        {opcode:'getCopiedText',blockType:'reporter',text:'读取已复制文本'},
        '---',
        {
          opcode: 'encodeAny',
          blockType: 'reporter',
          text: '编码 [TEXT] 方式 [METHOD]',
          arguments: {
            TEXT: { type: 'string', defaultValue: '输入内容' },
            METHOD: { type: 'string', menu: 'encodeMenu', defaultValue: 'url' }
          }
        },
        {
          opcode: 'decodeAny',
          blockType: 'reporter',
          text: '解码 [TEXT] 方式 [METHOD]',
          arguments: {
            TEXT: { type: 'string', defaultValue: '输入内容' },
            METHOD: { type: 'string', menu: 'decodeMenu', defaultValue: 'url' }
          }
        },
        '---',
        {opcode:'fullScreenSwitch',blockType:'command',text:'全屏模式[STATUS]',
          arguments:{STATUS:{type:'string',menu:'screenMenu',defaultValue:'open'}}},
        {opcode:'sentimentAnalyze',blockType:'reporter',text:'情感分析文本[TXT]',
          arguments:{TXT:{type:'string',defaultValue:'今天很开心'}}},
        '---',
        {opcode:'loadCostumeFromUrl',blockType:'command',text:'从URL加载造型[URL]',
          arguments:{URL:{type:'string',defaultValue:'https://scratch.mit.edu/static/images/scratch_cat1.svg'}}},
        {opcode:'playMusicUrl',blockType:'command',text:'URL播放音乐[URL]',
          arguments:{URL:{type:'string',defaultValue:'https://www.gequbao.com/music/131187'}}},
        {opcode:'stopMusic',blockType:'command',text:'停止播放音乐'},
        '---',
        {opcode:'showAlert',blockType:'command',text:'弹窗标题[TITLE]内容[MSG]',
          arguments:{TITLE:{type:'string',defaultValue:'提示'},MSG:{type:'string',defaultValue:'消息'}}},
        '---',
        {opcode:'parseLrcText',blockType:'reporter',text:'解析JSON歌词[JSON]取第[IDX]行文字',
          arguments:{JSON:{type:'string'},IDX:{type:'number',defaultValue:1}}},
        {opcode:'parseLrcTime',blockType:'reporter',text:'解析JSON歌词[JSON]取第[IDX]行时间',
          arguments:{JSON:{type:'string'},IDX:{type:'number',defaultValue:1}}},
        '---',
        {opcode:'openUrlCurr',blockType:'command',text:'当前页跳转网址[URL]',
          arguments:{URL:{type:'string',defaultValue:'https://www.gequbao.com/music/131187'}}},
        {opcode:'openUrlNew',blockType:'command',text:'新标签页打开网址[URL]',
          arguments:{URL:{type:'string',defaultValue:'https://www.gequbao.com/music/131187'}}},
        {opcode:'setPageTitle',blockType:'command',text:'设置网页标题为[TITLE]',
          arguments:{TITLE:{type:'string',defaultValue:'Scratch工具箱'}}},
        {opcode:'setPageIcon',blockType:'command',text:'设置网页图标地址[ICON]',
          arguments:{ICON:{type:'string',defaultValue:''}}},
        {opcode:'refreshPage',blockType:'command',text:'刷新当前网页'},
        {opcode:'closePage',blockType:'command',text:'关闭当前网页'},
        '---',
        {opcode:'getSwapChar',blockType:'reporter',text:'换位符'},
        {
          opcode: 'getHexColorFromPicker',
          blockType: 'reporter',
          text: '颜色码 [COLOR]',
          arguments: { COLOR: { type: 'color', defaultValue: '#07235f' } }
        }
      ],

      menus: {
        encodeMenu: {
          items: [
            {text:'URL编码',value:'url'},{text:'Base64编码',value:'base64'},
            {text:'Unicode编码',value:'unicode'},{text:'HTML编码',value:'html'}
          ]
        },
        decodeMenu: {
          items: [
            {text:'URL解码',value:'url'},{text:'Base64解码',value:'base64'},
            {text:'Unicode解码',value:'unicode'},{text:'HTML解码',value:'html'}
          ]
        },
        screenMenu:{
          items:[
            {text:'开启全屏',value:'open'},
            {text:'关闭全屏',value:'close'}
          ]
        },
        langMenu:{
          items:[
            {text:'中文',value:'zh'},
            {text:'英文',value:'en'},
            {text:'日语',value:'ja'},
            {text:'韩语',value:'ko'},
            {text:'法语',value:'fr'}
          ]
        },

        // ========== 新增：验证下拉菜单 ==========
        checkMenu:{
          items:[
            {text:"微信号",value:"wechat"},
            {text:"抖音号",value:"douyin"},
            {text:"小红书号",value:"xiaohongshu"},
            {text:"邮箱",value:"email"},
            {text:"网址",value:"url"},
            {text:"JSON",value:"json"},
            {text:"Python代码",value:"python"},
            {text:"C++代码",value:"cpp"},
            {text:"C#代码",value:"csharp"},
            {text:"Java代码",value:"java"},
            {text:"HTML代码",value:"html"},
            {text:"OpenGL代码",value:"opengl"}
          ]
        }

      }
    };
  }

  // ===================== 【新增】格式验证函数 =====================
  checkValid(args) {
    const t = args.text.trim();
    const type = args.type;

    if (!t) return false;

    switch (type) {
      case "wechat": return /^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/.test(t);
      case "douyin": return /^[a-zA-Z0-9_-]{3,20}$/.test(t);
      case "xiaohongshu": return /^[a-zA-Z0-9_]{3,24}$/.test(t);
      case "email": return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
      case "url": return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/.test(t);
      case "json": try { JSON.parse(t); return true; } catch { return false; }
      case "python": return /^(def |import |from |#|print\(|if |for |while |class )/.test(t);
      case "cpp": return /^(#include|using|int |void |class |cout |cin |string )/.test(t);
      case "csharp": return /^(using|namespace|class|void|int|string|Console\.|static )/.test(t);
      case "java": return /^(public|class|import|void|int|String|System\.out)/.test(t);
      case "html": return /<(!DOCTYPE|html|head|body|div|span|a|img|p|h1)/.test(t);
      case "opengl": return /(glBegin|glEnd|glVertex|glColor|glLoadIdentity|glOrtho|GL_)/.test(t);
      default: return false;
    }
  }

  // 简繁转换
  getSimpTradMap(){
    return {
      '的':'旳','一':'壹','二':'貳','三':'參','四':'肆','五':'伍','六':'陸','七':'柒','八':'捌','九':'玖','十':'拾','个':'個','后':'後','里':'裏','面':'面','发':'發','开':'開','关':'關','爱':'愛','国':'國','学':'學','电':'電','话':'話','门':'門','间':'間','听':'聽','声':'聲','万':'萬','为':'為','体':'體','无':'無','历':'歷','书':'書','车':'車','长':'長','龙':'龍','鸟':'鳥','鱼':'魚','云':'雲','来':'來','见':'見','这':'這','过':'過','当':'當','处':'處','尽':'盡','远':'遠','飞':'飛','变':'變','战':'戰','头':'頭'
    };
  }
  simpToTrad(args){
    let txt = args.text; const map = this.getSimpTradMap();
    return txt.replace(/./g,c=>map[c]||c);
  }
  tradToSimp(args){
    let txt = args.text; const map = this.getSimpTradMap();
    const rev = {}; for(let k in map) rev[map[k]]=k;
    return txt.replace(/./g,c=>rev[c]||c);
  }

  // 系统信息
  getOS() {
    const u = navigator.userAgent;
    if(u.includes('Win')) return 'Windows';if(u.includes('Mac')) return 'macOS';
    if(u.includes('Linux')) return 'Linux';if(u.includes('Android')) return 'Android';
    if(u.includes('iPhone')) return 'iOS';return '未知系统';
  }
  getBrowser() {
    const u = navigator.userAgent;
    if(u.includes('Chrome')) return 'Chrome';if(u.includes('Firefox')) return 'Firefox';
    if(u.includes('Edge')) return 'Edge';if(u.includes('Safari')) return 'Safari';
    return '未知浏览器';
  }
  getCPU() { return navigator.hardwareConcurrency || '未知核心数'; }
  getDevice() { return navigator.userAgent.includes('Mobile') ? '手机' : '电脑'; }
  getKey() { return this.lastKey || '无按键'; }
  getStageWidth(args, util) { return util.target.runtime.stageWidth || 480; }
  getStageHeight(args, util) { return util.target.runtime.stageHeight || 360; }
  captureStage(args, util) {
    const vm = util.target.runtime;
    vm.renderer.snapshot().then(imgData => {
      const a = document.createElement('a');
      a.href = imgData; a.download = `舞台截图_${Date.now()}.png`;a.click();
    });
  }

  // AI
  async aiChat(args) {
    const q = args.question.trim();if (!q) return '请输入问题';
    try {
      const res = await fetch(`https://api.oioweb.cn/api/chat?text=${encodeURIComponent(q)}`);
      const json = await res.json();return json.result || 'AI没回答';
    } catch {return 'AI请求失败';}
  }

  // 时间
  getFullTime(){
    let d=new Date();
    let y=d.getFullYear(),m=(d.getMonth()+1).toString().padStart(2,'0');
    let da=d.getDate().toString().padStart(2,'0'),h=d.getHours().toString().padStart(2,'0');
    let mi=d.getMinutes().toString().padStart(2,'0');
    let s=d.getSeconds().toString().padStart(2,'0');
    return `${y}-${m}-${da} ${h}:${mi}:${s}`;
  }
  getWeek(){
    let arr=['日','一','二','三','四','五','六'];
    return '星期'+arr[new Date().getDay()];
  }

  // 数学
  powerCalc(args){ return Math.pow(args.NUM, args.POW); }
  circleArea(args) {
    const r = args.R;const n = Math.max(0, Math.min(10, args.N));
    return (Math.PI * r * r).toFixed(n);
  }
  probRandomNum(args){
    let min = Math.floor(args.min);let max = Math.floor(args.max);
    let tar = Math.floor(args.tar);let per = Math.max(0, Math.min(100, args.per));
    if(min > max) [min,max] = [max,min];
    if(Math.random() * 100 < per) return tar;
    let res;do{res = Math.floor(Math.random()*(max-min+1))+min;}while(res === tar);
    return res;
  }

  // 翻译
  async translateLang(args) {
    const txt = args.txt.trim();const targetLang = args.lang;
    if(!txt) return "";
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(txt)}`);
      const data = await res.json();return data[0][0][0] || txt;
    } catch {return txt;}
  }

  // 文字
  toUpper(args){ return args.T.toUpperCase(); }
  toLower(args){ return args.T.toLowerCase(); }
  toPinyin(args){
    const t=args.T;
    const pinyinMap={'你':'ni','好':'hao','我':'wo','爱':'ai','中':'zhong','国':'guo','编':'bian','程':'cheng','工':'gong','具':'ju','歌':'ge','词':'ci'};
    let res='';for(let c of t) res+=(pinyinMap[c]||c)+' ';return res.trim();
  }
  toChinese(args){
    const t=args.T;
    const hanMap={'ni':'你','hao':'好','wo':'我','ai':'爱','zhong':'中','guo':'国','bian':'编','cheng':'程','gong':'工','ju':'具','ge':'歌','ci':'词'};
    return t.split(' ').map(x=>hanMap[x]||x).join('');
  }
  joinSwapStr(args){return args.A + '\u200B' + args.B;}

  // 剪贴板
  copyText(args) {this.clipboardCache = args.TXT;try{ navigator.clipboard.writeText(args.TXT); }catch(e){}}
  getCopiedText() { return this.clipboardCache; }

  // 编解码
  encodeAny(args) {
    const t=args.TEXT,m=args.METHOD;
    try{
      if(m==='url')return encodeURIComponent(t);
      if(m==='base64')return btoa(unescape(encodeURIComponent(t)));
      if(m==='unicode')return unescape(escape(t).replace(/%u/g,'\\u'));
      if(m==='html')return t.replace(/./g,c=>`&#${c.charCodeAt(0)};`);
      return '不支持';
    }catch(e){return '编码失败'}
  }
  decodeAny(args) {
    const t=args.TEXT,m=args.METHOD;
    try{
      if(m==='url')return decodeURIComponent(t);
      if(m==='base64')return decodeURIComponent(escape(atob(t)));
      if(m==='unicode')return unescape(t.replace(/\\u/g,'%u'));
      if(m==='html')return t.replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(n));
      return '不支持';
    }catch(e){return '解码失败'}
  }

  // 窗口
  fullScreenSwitch(args){
    const doc = document.documentElement;
    if(args.STATUS === 'open'){if(!document.fullscreenElement) doc.requestFullscreen().catch(()=>{});
    }else{if(document.fullscreenElement) document.exitFullscreen().catch(()=>{});}
  }
  sentimentAnalyze(args){
    const txt = args.TXT;
    const happy = ['开心','高兴','快乐','美好','喜欢','很棒','不错','赞'];
    const sad = ['难过','伤心','悲伤','糟糕','讨厌','难受','很差'];
    const angry = ['生气','愤怒','恼火','暴躁'];
    let score = 0;
    happy.forEach(w=>{if(txt.includes(w)) score+=20;});
    sad.forEach(w=>{if(txt.includes(w)) score-=20;});
    angry.forEach(w=>{if(txt.includes(w)) score-=15;});
    if(score>30) return '积极愉悦';if(score<-30) return '消极低落';if(score<0) return '略带负面';return '中性平和';
  }

  // 媒体
  async loadCostumeFromUrl(args, util) {
    try {
      const vm = util.target.runtime;const target = util.target;const url = args.URL;
      const response = await fetch(url);const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = async () => {await vm.addCostumeAt(reader.result, target, 0);target.setCostume(0);};
      reader.readAsDataURL(blob);
    } catch (e) {}
  }
  playMusicUrl(args){
    if(this.audioPlayer) this.audioPlayer.pause();
    this.audioPlayer = new Audio(args.URL);this.audioPlayer.play().catch(()=>{});
  }
  stopMusic(){if(this.audioPlayer){this.audioPlayer.pause();this.audioPlayer.currentTime = 0;}}
  showAlert(args){ alert(`【${args.TITLE}】\n${args.MSG}`); }

  // 解析
  parseLrcText(args){try{let arr=JSON.parse(args.JSON);return arr[args.IDX-1]?.text??'无数据'}catch{return'格式错误'}}
  parseLrcTime(args){try{let arr=JSON.parse(args.JSON);return arr[args.IDX-1]?.time??'无数据'}catch{return'格式错误'}}

  // 网页
  openUrlCurr(args){ location.href=args.URL; }
  openUrlNew(args){ window.open(args.URL,'_blank'); }
  setPageTitle(args){ document.title=args.TITLE; }
  setPageIcon(args){let link=document.querySelector("link[rel~='icon']")||document.createElement('link');link.rel='icon';link.href=args.ICON;document.head.appendChild(link);}
  refreshPage(){ location.reload(); }
  closePage(){ window.close(); }
  getSwapChar(){ return '\u200B'; }
  getHexColorFromPicker(args){ return args.COLOR; }
}

Scratch.extensions.register(new SuperToolBox());