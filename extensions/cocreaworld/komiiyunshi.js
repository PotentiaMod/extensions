(function (_Scratch) {
    const {ArgumentType, BlockType, TargetType, Cast, translate, extensions, runtime} = _Scratch;

    translate.setup({
        zh: {
            'extensionName': 'Komii的今日运势查询',
            'getFortune': '获取ID [ID] 的今日运势 的 [TYPE]',
            'fortuneType_nature': '运势',
            'fortuneType_meaning': '详情',
            'khtmlbtn': '安装 Komii的HTML 拓展',
            'library': '扩展库',
            'code': '代码'
        },
        en: {
            'extensionName': "Komii's Daily Fortune Query",
            'getFortune': "get today's fortune for ID [ID] [TYPE]",
            'fortuneType_nature': 'nature',
            'fortuneType_meaning': 'meaning',
            'khtmlbtn': "Install Komii's HTML Extension",
            'library': 'Extension',
            'code': 'Code'
        }
    });

    class FortuneExtension {
        constructor (_runtime) {
            this._runtime = _runtime;
        }

        getInfo () {
            return {
                id: 'komiiyunshi',
                color1: '#44b4ff',
                color2: '#0099FF',
                name: translate({id: 'extensionName'}),
                blocks: [
                    {
                        opcode: 'getFortune',
                        blockType: BlockType.REPORTER,
                        text: translate({id: 'getFortune'}),
                        arguments: {
                            ID: {
                                type: ArgumentType.STRING,
                                defaultValue: "263021647"
                            },
                            TYPE: {
                                type: ArgumentType.STRING,
                                menu: 'fortuneTypeMenu',
                                defaultValue: 'nature'
                            }
                        }
                    },
                    {
                        func: 'loadKomiiHtml',
                        text: translate({id: 'khtmlbtn'}),
                        blockType: BlockType.BUTTON,
                    }
                ],
                menus: {
                    fortuneTypeMenu: {
                        acceptReporters: true,
                        items: [
                            {text: translate({id: 'fortuneType_nature'}), value: 'nature'},
                            {text: translate({id: 'fortuneType_meaning'}), value: 'meaning'}
                        ]
                    }
                }
            };
        }

        async fetchFortuneData (id) {
            let qq = Cast.toString(id) || '1';
            if (!/^\d+$/.test(qq)) {
                let ascii = '';
                for (let i = 0; i < qq.length; i++) {
                    ascii += qq.charCodeAt(i);
                }
                if (ascii.length < 6) {
                    ascii = ascii.padEnd(6, '0');
                } else if (ascii.length > 12) {
                    ascii = ascii.slice(0, 12);
                }
                qq = ascii;
            } else {
                if (qq.length < 6) {
                    qq = qq.padEnd(6, '0');
                } else if (qq.length > 12) {
                    qq = qq.slice(0, 12);
                }
            }

            const url = `https://api.lvxiaodong.com/api/qqjixiong?qq=${qq}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            
            if (result.code === 200 && result.data) {
                return result.data;
            } else {
                throw new Error(result.msg || '获取运势数据失败');
            }
        }
        
        async getFortune (args) {
            const id = Cast.toString(args.ID) || '1';
            const type = Cast.toString(args.TYPE) || 'nature';

            try {
                const data = await this.fetchFortuneData(id);
                
                if (type === 'nature') {
                    return data.nature || '';
                } else if (type === 'meaning') {
                    return data.meaning || '';
                } else {
                    return '';
                }
            } catch (error) {
                return '获取运势失败';
            }
        }

        loadKomiiHtml () {
            var pbak = prompt;
            window.prompt = function() {return "https://m.ccw.site/user_projects_assets/e6fbedff1971b8d462157bc4e8980865.js"};
            document.querySelector(`[data-tip="${translate({id: 'library'})}"]`).click();
            var exts = document.querySelectorAll('.gandi_library_extensionItemCard_2cnXl');
            var custom_ext = exts[exts.length - 1];
            custom_ext.querySelector("button").click();
            window.prompt = pbak;
            document.querySelector(`[data-tip="${translate({id: 'code'})}"]`).click();
        }
    }

    extensions.register(new FortuneExtension(runtime));

}(Scratch));