(function (_Scratch) {
    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

    // 设置多语言支持
    translate.setup({
        zh: {
            'extensionName': 'Miku [初音未来] ',
            'openLinkBlock': '打开Miku视频',
            'getVideoUrlBlock': '视频链接',
            'getBGMBlock': '视频音乐',
            'getMusicNameBlock': '音乐链接'
        },
        en: {
            'extensionName': 'Miku ',
            'openLinkBlock': 'Open Miku',
            'getVideoUrlBlock': 'Get Video URL',
            'getBGMBlock': 'Get BGM',
            'getMusicNameBlock': 'Get Music Name'
        }
    });

    class MikuInfoExtension {
        constructor (_runtime) {
            this._runtime = _runtime;
            this.videoUrl = 'https://m.ccw.site/creator-college/videos/9804e2656a0b7e483fcc3f0c9cdda60a.mp4'; // 视频链接
            this.bgm = 'Miku oo ee oo'; // 背景音乐名称
            this.musicName = 'http://m701.music.126.net/20240823153848/1b31d52439a076f71c30e28fbe8652a8/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/34592501341/be61/42e1/e2f2/d63c05cb7b0e4ae5c62b5cbcfa11ccac.mp3'; // 音乐名称
        }

        getInfo () {
            return {
                id: 'openMikuLink',
                name: translate({id: 'extensionName'}),
                color1: '#39D59F',
                color2: '#39D59F',
                blocks: [
                    {
                        opcode: 'openMikuLink',
                        blockType: BlockType.COMMAND,
                        text: translate({id: 'openLinkBlock'})
                    },
                    {
                        opcode: 'getVideoUrl',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getVideoUrlBlock'})
                    },
                    {
                        opcode: 'getBGM',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getBGMBlock'})
                    },
                    {
                        opcode: 'getMusicName',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getMusicNameBlock'})
                    }
                ]
            };
        }

        openMikuLink () {
            const url = this.videoUrl;
            window.open(url, '_blank');
        }

        getVideoUrl () {
            return this.videoUrl;
        }

        getBGM () {
            return this.bgm;
        }

        getMusicName () {
            return this.musicName;
        }
    }

    extensions.register(new MikuInfoExtension(runtime));
}(Scratch));