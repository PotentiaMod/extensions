class myextend {
    getInfo() {
        return{
            id:"szdewangyecaozuo",
            name:"鼠子的游戏的操作",
            color2:"#00ff01",
            color1:"#003a00",
            color3:"#00ff01",
            color4:"#00ff01",
            color5:"#00ff01",
            blocks:[
                {
                    opcode:'text1',
                    blockType:Scratch.BlockType.LABEL,
                    text:'这些积木不可以拼在循环里面！！！',
                    
                    
                },    
                {
                    opcode:'block1',
                    blockType:Scratch.BlockType.COMMAND,
                    text:'游戏弹出[zi]',
                    arguments:{
                        zi:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:'开心的小鼠子',
                        },
                    }
                },
                {
                    opcode:'block2',
                    blockType:Scratch.BlockType.COMMAND,
                    text:'将游戏改为名叫[zi]',
                    arguments:{
                        zi:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:'鼠子的拓展',
                        },
                    }
                },
                {
                    opcode:'sz',
                    blockType:Scratch.BlockType.REPORTER,
                    text:'游戏输入框 名称:[sz1]默认值:[sz2]',
                    arguments:{
                        sz1:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:'鼠子你好啊',
                        },
                        sz2:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:'你好',
                        },
                    }
                },
                {
                    opcode:'bool1',
                    blockType:Scratch.BlockType.BOOLEAN,
                    text:'游戏条件判断 名称:[saa]默认值:[ssa]',
                    arguments:{
                        saa:{
                            type:Scratch.ArgumentType.STRING,
                            defaultValue:'鼠子你好啊',
                        },
                        ssa:{
                                type:Scratch.ArgumentType.STRING,
                                menu:'true1'
                            }
                    }
                },
                {
                    opcode:'aa',
                    blockType:Scratch.BlockType.COMMAND,
                    text:'将玩家赶出游戏',
                },
                {
                    opcode:'zai',
                    blockType:Scratch.BlockType.BOOLEAN,
                    text:'玩家在线?',
                    arguments:{
                        
                    }
                },
                
                
                
                   
                                                
            ],
            menus:{
                true1:{
                    acceptReporters:true,
                    items:["true","false"],
                }
            }
        }
        
    }
    block1(args){
        alert(args.zi)
    }
    block2(args) {
        const title = args.zi;
        document.title = title;
      }
      sz (args) {
            return window.prompt(args.sz1,args.sz2);
      }
      bool1 (args) {
            return window.confirm(args.saa,args.ssa);
            
      }
      aa (args) {
            window.close()
            window.location.reload()

      }
      zai(args){
            //window.zai=true;
            window.addEventListener('focus', function() {window.zai=true;});
            window.addEventListener('blur', function() {window.zai=false});
            return window.zai;
         }
         
      
    
}   
Scratch.extensions.register(new myextend())             