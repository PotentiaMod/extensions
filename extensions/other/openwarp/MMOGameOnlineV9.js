// Name: MMO
// ID: MMOGameOnlineV9
// Description: Massively Multiplayer Online
// By: Hugh <https://space.bilibili.com/3546737813752345?spm_id_from=333.1007.0.0>

(function() {
  "use strict";
  class MMOGameOnline {
    constructor() {
      this.wsUrl = "wss://pub-ws.xtt.moe/ws";
      this.ws = null;
      this.myPid = "P" + Date.now() + Math.floor(Math.random()*9999);
      this.room = "";
      this.players = new Map();
      this.onJoinFlag = false;
      this.onLeaveFlag = false;
      this.onPosFlag = false;
      this.lastJoinPid = "";
      this.lastUpdatePid = "";
      this.connecting = false;
      this.lastSend = 0;
      this.sendCd = 120;
    }

    getInfo() {
      return {
        id: "MMOGameOnlineV9",
        name: "MMO多人联机_积木正常版",
        color1: "#FF9500",
        color2: "#E68900",
        blocks: [
          {
            opcode: "connect",
            blockType: "command",
            text: "连接MMO大厅"
          },
          {
            opcode: "createRoom",
            blockType: "command",
            text: "创建房间 [房间号]",
            arguments: {
              r: {type: "string", defaultValue: "12345", menu: null}
            }
          },
          {
            opcode: "joinRoom",
            blockType: "command",
            text: "加入房间 [房间号]",
            arguments: {
              r: {type: "string", defaultValue: "12345", menu: null}
            }
          },
          {
            opcode: "sendPos",
            blockType: "command",
            text: "发送坐标 X:[X] Y:[Y]",
            arguments: {
              X: {type: "number", defaultValue: 0},
              Y: {type: "number", defaultValue: 0}
            }
          },
          {
            opcode: "whenJoin",
            blockType: "hat",
            text: "当玩家进入房间"
          },
          {
            opcode: "whenLeave",
            blockType: "hat",
            text: "当玩家离开房间"
          },
          {
            opcode: "whenPosUpd",
            blockType: "hat",
            text: "当玩家位置更新"
          },
          {
            opcode: "onlineNum",
            blockType: "reporter",
            text: "在线玩家数量"
          },
          {
            opcode: "getJoinPid",
            blockType: "reporter",
            text: "新进玩家ID"
          },
          {
            opcode: "getUpdPid",
            blockType: "reporter",
            text: "更新位置玩家ID"
          },
          {
            opcode: "getPidX",
            blockType: "reporter",
            text: "玩家 [PID] 的X",
            arguments: {PID: {type: "string", defaultValue:"P123"}}
          },
          {
            opcode: "getPidY",
            blockType: "reporter",
            text: "玩家 [PID] 的Y",
            arguments: {PID: {type: "string", defaultValue:"P123"}}
          }
        ]
      };
    }

    connect() {
      if(this.connecting) return;
      if(this.ws && this.ws.readyState === WebSocket.OPEN) return;
      this.connecting = true;
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = ()=>this.connecting = false;
      this.ws.onclose = ()=>{this.connecting=false;this.ws=null;};
      this.ws.onerror = ()=>{this.connecting=false;this.ws=null;};
      this.ws.onmessage = e=>{
        try{
          let d = JSON.parse(e.data);
          if(d.room !== this.room) return;
          if(d.type === "join"){
            this.players.set(d.pid, {x:0,y:0,live:true});
            this.lastJoinPid = d.pid;
            this.onJoinFlag = true;
          }
          if(d.type === "leave"){
            if(this.players.has(d.pid)) this.players.get(d.pid).live = false;
            this.onLeaveFlag = true;
          }
          if(d.type === "pos"){
            if(!this.players.has(d.pid)) this.players.set(d.pid,{x:d.x,y:d.y,live:true});
            else {let p=this.players.get(d.pid);p.x=d.x;p.y=d.y;}
            this.lastUpdatePid = d.pid;
            this.onPosFlag = true;
          }
        }catch(e){}
      };
    }

    createRoom({r}){
      if(!this.ws || this.ws.readyState!==WebSocket.OPEN)return;
      this.room = r;
      this.players.clear();
      this.players.set(this.myPid,{x:0,y:0,live:true});
      this._send({type:"join",room:r,pid:this.myPid});
    }

    joinRoom({r}){
      if(!this.ws || this.ws.readyState!==WebSocket.OPEN)return;
      this.room = r;
      this.players.clear();
      this.players.set(this.myPid,{x:0,y:0,live:true});
      this._send({type:"join",room:r,pid:this.myPid});
    }

    sendPos({X,Y}){
      let now = Date.now();
      if(now - this.lastSend < this.sendCd) return;
      if(!this.ws || this.ws.readyState!==WebSocket.OPEN)return;
      if(!this.room)return;
      this.lastSend = now;
      let me = this.players.get(this.myPid);
      me.x = X; me.y = Y;
      this._send({type:"pos",room:this.room,pid:this.myPid,x:X,y:Y});
    }

    _send(o){this.ws.send(JSON.stringify(o));}

    whenJoin(){let f=this.onJoinFlag;this.onJoinFlag=false;return f;}
    whenLeave(){let f=this.onLeaveFlag;this.onLeaveFlag=false;return f;}
    whenPosUpd(){let f=this.onPosFlag;this.onPosFlag=false;return f;}

    onlineNum(){
      let n=0;
      this.players.forEach(v=>{if(v.live)n++;});
      return n;
    }
    getJoinPid(){return this.lastJoinPid;}
    getUpdPid(){return this.lastUpdatePid;}
    getPidX({PID}){return this.players.has(PID)?this.players.get(PID).x:0;}
    getPidY({PID}){return this.players.has(PID)?this.players.get(PID).y:0;}
  }
  Scratch.extensions.register(new MMOGameOnline());
})();