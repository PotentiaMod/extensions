//Translated in English by GaiaWindWave90
(function(Scratch) {
    'use strict';
    if (!Scratch) {
        console.error('Scratch Not loaded!');
        return;
    }

    const vm = Scratch.vm;
    const runtime = vm ? vm.runtime : Scratch.runtime;

    const cache = new Map();
    const CACHE_DURATION = 5 * 60 * 1000;

    //Legacy code
    const FANDOM_WIKIS = [
        {name: 'Internetpedia', url: 'internetpedia.fandom.com/wiki/'},
        {name: 'Pokémon Wiki', url: 'pokemon.fandom.com/wiki/'},
        {name: 'Creepypasta Wiki', url: 'creepypasta.fandom.com/wiki/'},
        {name: 'Creepypasta Fanon', url: 'creepypasta-fanon.fandom.com/wiki/'},
        {name: 'SpongeBob Wiki', url: 'spongebob.fandom.com/wiki/'},
        {name: 'Minecraft', url: 'minecraft.fandom.com/wiki/'},
        {name: 'Sonic Wiki Zone', url: 'sonic.fandom.com/wiki/'},
        {name: 'Mario Wiki', url: 'mario.fandom.com/wiki/'},
        {name: 'Poppy Playtime', url: 'poppy-playtime.fandom.com/wiki/'},
        {name: 'Battle for Dream Island Wiki', url: 'battlefordreamisland.fandom.com/wiki/'},
        {name: 'Incredibox Sprunki Wiki', url: 'incredibox-sprunki.fandom.com/wiki/'},
        {name: 'Five Nights at Freddy\'s', url: 'freddy-fazbears-pizza.fandom.com/wiki/'},
        {name: 'Sanrio Wiki', url: 'hellokitty.fandom.com/wiki/'}
    ];

    class FandomWikiExtension {
        constructor() {
            this.runtime = runtime;
            this.lastError = '';
            this.lastResult = null;
            this.callbackCounter = 0;
            this.wikiStatsCache = null;
        }

        getInfo() {
            return {
                id: 'fandom',
                name: 'Fandom',
                blockIconURI: 'data:image/webp;base64,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',
                color1: '#000000', 
                color2: '#5e5e5e', 
                color3: '#D4B010',
                menuIconURI: 'data:image/webp;base64,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',
                blocks: [
                    {
                        blockType: 'label',
                        text: 'Multilingual Site Tool'
                    },
                    {
                        opcode: 'Language',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get the [L]-language sub-site of the WIKI [WIKI]',
                        arguments: {
                            WIKI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'community.fandom.com'
                            },
                            L: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'en'
                            }
                        }
                    },
                    {
                        opcode: 'en',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'English Sub-site Code'
                    },
                    {
                        blockType: 'label',
                        text: 'User Edit'
                    },
                    
                    {
                        opcode: 'getEditCount',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get the edit count of [USERNAME] on [WIKI]',
                        arguments: {
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'ExampleUser'
                            },
                            WIKI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'community.fandom.com'
                            }
                        }
                    },
                    {
                        opcode: 'getEditList',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get the edit list of [USERNAME] on [WIKI]',
                        arguments: {
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'ExampleUser'
                            },
                            WIKI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'community.fandom.com'
                            },
                            LIMIT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    {
                        opcode: 'getEditListAsJSON',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get the number [LIMIT] of edit list of [USERNAME] on [WIKI] as Json',
                        arguments: {
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'ExampleUser'
                            },
                            WIKI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'community.fandom.com'
                            },
                            LIMIT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5
                            }
                        }
                    },
                    {
                        opcode: 'getEditDetail',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get the edit detail of [FIELD] of the [INDEX] edit list.',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            FIELD: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'title',
                                menu: 'editFields'
                            }
                        }
                    },
                    {
                        opcode: 'getLastEditTime',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get the last edit time of [USERNAME] on [WIKI]',
                        arguments: {
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'ExampleUser'
                            },
                            WIKI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'community.fandom.com'
                            }
                        }
                    },
                    {
                        opcode: 'getUserInfo',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get the user [INFO] of [USERNAME] on [WIKI]',
                        arguments: {
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'ExampleUser'
                            },
                            WIKI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'community.fandom.com'
                            },
                            INFO: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'editcount',
                                menu: 'userInfoFields'
                            }
                        }
                    },
                    {
                        blockType: 'label',
                        text: 'Misc'
                    },
                    {
                        opcode: 'clearCache',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Clear cache'
                    },
                    {
                        opcode: 'getLastError',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get the last error'
                    },
                    {
                        opcode: 'isUserExists',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'Is [USERNAME] exists on [WIKI]?',
                        arguments: {
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'ExampleUser'
                            },
                            WIKI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'community.fandom.com'
                            }
                        }
                    },
                    {
                        blockType: 'label',
                        text: 'Wiki Tools'
                    },
                    {
                        opcode: 'getRandomWiki',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get random Wiki [TYPE]',
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'url',
                                menu: 'randomWikiTypes'
                            }
                        }
                    },
                    {
                        opcode: 'getWikiStats',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get stats of [WIKI]: [STAT]',
                        arguments: {
                            WIKI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'community.fandom.com'
                            },
                            STAT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'pages',
                                menu: 'wikiStatsTypes'
                            }
                        }
                    },
                    {
                        opcode: 'getWikiStaff',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get the [WIKI] staff [TYPE]',
                        arguments: {
                            WIKI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'community.fandom.com'
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'sysop',
                                menu: 'staffTypes'
                            }
                        }
                    },
                    {
                        blockType: 'label',
                        text: 'Link related'
                    },
                    {
                        opcode: 'openLink',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Open in the new window: [URL]',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://community.fandom.com'
                            }
                        }
                    },
                    {
                        opcode: 'openWikiPage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'On the page on [WIKI]: [PAGE]',
                        arguments: {
                            WIKI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'community.fandom.com'
                            },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Main_Page'
                            }
                        }
                    },
                    {
                        opcode: 'openUserProfile',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Open the user profile on [WIKI]: [USERNAME]',
                        arguments: {
                            WIKI: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'community.fandom.com'
                            },
                            USERNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'ExampleUser'
                            }
                        }
                    }
                ],
                menus: {
                    editFields: {
                        acceptReporters: true,
                        items: [
                            {text: 'Title', value: 'title'},
                            {text: 'Page ID', value: 'pageid'},
                            {text: 'Rev ID', value: 'revid'},
                            {text: 'Parent ID', value: 'parentid'},
                            {text: 'Timestamp', value: 'timestamp'},
                            {text: 'Comment', value: 'comment'},
                            {text: 'Size', value: 'size'},
                            {text: 'Size difference', value: 'sizediff'}
                        ]
                    },
                    userInfoFields: {
                        acceptReporters: true,
                        items: [
                            {text: 'Edit count', value: 'editcount'},
                            {text: 'User ID', value: 'userid'},
                            {text: 'Registration', value: 'registration'},
                            {text: 'Gender', value: 'gender'},
                            {text: 'Groups', value: 'groups'},
                            {text: 'Block ID', value: 'blockid'}
                        ]
                    },
                    randomWikiTypes: {
                        acceptReporters: true,
                        items: [
                            {text: 'URL', value: 'url'},
                            {text: 'Name', value: 'name'},
                            {text: 'Both', value: 'both'}
                        ]
                    },
                    wikiStatsTypes: {
                        acceptReporters: true,
                        items: [
                            {text: 'Pages', value: 'pages'},
                            {text: 'Articles', value: 'articles'},
                            {text: 'Files', value: 'files'},
                            {text: 'Edits', value: 'edits'},
                            {text: 'Active users', value: 'activeusers'},
                            {text: 'Admins', value: 'admins'},
                            {text: 'All as JSON', value: 'all'}
                        ]
                    },
                    staffTypes: {
                        acceptReporters: true,
                        items: [
                            {text: 'Bureaucrat', value: 'bureaucrat'},
                            {text: 'Sysop', value: 'sysop'},
                            {text: 'Content moderator', value: 'content-moderator'},
                            {text: 'Thread moderator', value: 'threadmoderator'},
                            {text: 'Rollback', value: 'rollback'},
                            {text: 'All staff', value: 'all'}
                        ]
                    }
                }
            };
        }

        _getCacheKey(wiki, username, type) {
            return `${type}:${wiki}:${username.toLowerCase()}`;
        }

        _getFromCache(key) {
            if (cache.has(key)) {
                const { data, timestamp } = cache.get(key);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    return data;
                }
                cache.delete(key);
            }
            return null;
        }

        _setCache(key, data) {
            cache.set(key, { data, timestamp: Date.now() });
        }

        
        clearCache() {
            cache.clear();
            this.lastError = '';
            this.wikiStatsCache = null;
        }

        getLastError() {
            return this.lastError;
        }

        _normalizeWikiDomain(wiki) {
            let domain = wiki.trim().toLowerCase();
            
            if (!domain.includes('.')) {
                domain = `${domain}.fandom.com`;
            }
            if (!domain.startsWith('http')) {
                domain = `https://${domain}`;
            }
            
            return domain;
        }

        _buildApiUrl(wiki, params, callbackName) {
            const domain = this._normalizeWikiDomain(wiki);
            
            params.format = 'json';
            if (callbackName) {
                params.callback = callbackName;
            }
            
            const queryString = Object.entries(params)
                .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
                .join('&');
            
            return `${domain}/api.php?${queryString}`;
        }

        _jsonpRequest(wiki, params) {
            return new Promise((resolve, reject) => {
                const callbackName = `fandom_cb_${Date.now()}_${this.callbackCounter++}`;
                
                const timeout = setTimeout(() => {
                    cleanup();
                    reject(new Error('JSONP 请求超时'));
                }, 10000);

                const cleanup = () => {
                    clearTimeout(timeout);
                    delete window[callbackName];
                    if (script && script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                };

                window[callbackName] = (data) => {
                    cleanup();
                    if (data.error) {
                        reject(new Error(`API Error: ${data.error.info || data.error.code}`));
                    } else {
                        resolve(data);
                    }
                };

                const script = document.createElement('script');
                script.src = this._buildApiUrl(wiki, params, callbackName);
                
                script.onerror = () => {
                    cleanup();
                    reject(new Error('JSONP Script failed to load.'));
                };

                document.head.appendChild(script);
            });
        }

        getRandomWiki(args) {
            const randomIndex = Math.floor(Math.random() * FANDOM_WIKIS.length);
            const wiki = FANDOM_WIKIS[randomIndex];
            
            switch(args.TYPE) {
                case 'name':
                    return wiki.name;
                case 'url':
                    return wiki.url;
                case 'both':
                default:
                    return JSON.stringify([wiki.name, wiki.url]);
            }
        }

        Language(args) {
            const str1 = String(args.WIKI);
            const str2 = String(args.L);
            return str1 + '/' + str2 + '/';
        }

        zh(){
            return 'zh';
        }

        async getWikiStats(args) {
            const { WIKI, STAT } = args;
            const cacheKey = `stats:${WIKI}`;
            
            let stats = this._getFromCache(cacheKey);
            
            if (!stats) {
                try {
                    const data = await this._jsonpRequest(WIKI, {
                        action: 'query',
                        meta: 'siteinfo',
                        siprop: 'statistics'
                    });
                    
                    stats = data.query.statistics;
                    this._setCache(cacheKey, stats);
                } catch (error) {
                    this.lastError = `Failed to retrieve wiki statistics.: ${error.message}`;
                    return `Error: ${error.message}`;
                }
            }
            
            switch(STAT) {
                case 'pages':
                    return stats.pages !== undefined ? stats.pages.toString() : '0';
                case 'articles':
                    return stats.articles !== undefined ? stats.articles.toString() : '0';
                case 'files':
                    return stats.images !== undefined ? stats.images.toString() : '0';
                case 'edits':
                    return stats.edits !== undefined ? stats.edits.toString() : '0';
                case 'activeusers':
                    return stats.activeusers !== undefined ? stats.activeusers.toString() : '0';
                case 'admins':
                    return stats.admins !== undefined ? stats.admins.toString() : '0';
                case 'all':
                default:
                    return JSON.stringify(stats);
            }
        }

        async getWikiStaff(args) {
            const { WIKI, TYPE } = args;
            
            try {
                const data = await this._jsonpRequest(WIKI, {
                    action: 'query',
                    list: 'allusers',
                    augroup: TYPE === 'all' ? 'bureaucrat|sysop|content-moderator|threadmoderator|rollback' : TYPE,
                    aulimit: 50,
                    auprop: 'groups'
                });
                
                const users = data.query.allusers;
                
                if (!users || users.length === 0) {
                    return 'None';
                }
                
                if (TYPE === 'all') {
                    // Return grouped by permission
                    const grouped = {};
                    users.forEach(user => {
                        user.groups.forEach(group => {
                            if (!grouped[group]) grouped[group] = [];
                            grouped[group].push(user.name);
                        });
                    });
                    return JSON.stringify(grouped);
                } else {
                    return users.map(u => u.name).join(', ');
                }
                
            } catch (error) {
                this.lastError = `Failed to retrieve the staff list.: ${error.message}`;
                return `Error: ${error.message}`;
            }
        }

        openLink(args) {
            const url = args.URL.trim();
            if (url) {
                window.open(url, '_blank');
            }
        }

        openWikiPage(args) {
            const domain = this._normalizeWikiDomain(args.WIKI);
            const page = encodeURIComponent(args.PAGE.replace(/ /g, '_'));
            const url = `${domain}/wiki/${page}`;
            window.open(url, '_blank');
        }

        openUserProfile(args) {
            const domain = this._normalizeWikiDomain(args.WIKI);
            const user = encodeURIComponent(args.USERNAME.replace(/ /g, '_'));
            const url = `${domain}/wiki/User:${user}`;
            window.open(url, '_blank');
        }

        async getEditCount(args) {
            const { USERNAME, WIKI } = args;
            const cacheKey = this._getCacheKey(WIKI, USERNAME, 'count');
            
            const cached = this._getFromCache(cacheKey);
            if (cached !== null) {
                return cached;
            }

            try {
                const data = await this._jsonpRequest(WIKI, {
                    action: 'query',
                    list: 'users',
                    ususers: USERNAME,
                    usprop: 'editcount'
                });

                const user = data.query.users[0];
                
                if (user && user.missing !== undefined) {
                    this.lastError = `User "${USERNAME}" does not exist`;
                    return 0;
                }
                
                const count = user.editcount || 0;
                this._setCache(cacheKey, count);
                return count;
                
            } catch (error) {
                this.lastError = `Failed to retrieve edit count.: ${error.message}`;
                return `Error: ${error.message}`;
            }
        }

        async getEditList(args) {
            const { USERNAME, WIKI, LIMIT } = args;
            const limit = Math.min(Math.max(1, parseInt(LIMIT) || 10), 50);
            
            try {
                const data = await this._jsonpRequest(WIKI, {
                    action: 'query',
                    list: 'usercontribs',
                    ucuser: USERNAME,
                    uclimit: limit,
                    ucprop: 'ids|title|timestamp|comment|size|sizediff'
                });

                const contribs = data.query.usercontribs;
                
                if (!contribs || contribs.length === 0) {
                    return 'No edit history';
                }

                const formatted = contribs.map((edit, idx) => {
                    const date = new Date(edit.timestamp).toLocaleString('zh-CN');
                    const sizeDiff = edit.sizediff > 0 ? `+${edit.sizediff}` : edit.sizediff;
                    return `${idx + 1}. [${date}] ${edit.title} (${sizeDiff} bytes): ${edit.comment || '无摘要'}`;
                }).join('\n');

                this.lastResult = contribs;
                return formatted;
                
            } catch (error) {
                this.lastError = `Failed to retrieve the list of editors.: ${error.message}`;
                return `Error: ${error.message}`;
            }
        }

        async getEditListAsJSON(args) {
            const { USERNAME, WIKI, LIMIT } = args;
            const limit = Math.min(Math.max(1, parseInt(LIMIT) || 5), 50);
            
            const cacheKey = this._getCacheKey(WIKI, USERNAME, `list_${limit}`);
            const cached = this._getFromCache(cacheKey);
            if (cached !== null) {
                this.lastResult = cached;
                return JSON.stringify(cached);
            }

            try {
                const data = await this._jsonpRequest(WIKI, {
                    action: 'query',
                    list: 'usercontribs',
                    ucuser: USERNAME,
                    uclimit: limit,
                    ucprop: 'ids|title|timestamp|comment|size|sizediff|flags|tags'
                });

                const contribs = data.query.usercontribs || [];
                
                this.lastResult = contribs;
                this._setCache(cacheKey, contribs);
                return JSON.stringify(contribs);
                
            } catch (error) {
                this.lastError = `Failed to retrieve JSON: ${error.message}`;
                return `[]`;
            }
        }

        getEditDetail(args) {
            const { INDEX, FIELD } = args;
            const index = parseInt(INDEX) - 1;
            
            if (!this.lastResult || !Array.isArray(this.lastResult)) {
                return 'Please retrieve the list of edits first.';
            }
            
            if (index < 0 || index >= this.lastResult.length) {
                return 'Index out of range';
            }
            
            const edit = this.lastResult[index];
            
            if (FIELD === 'timestamp') {
                return new Date(edit[FIELD]).toLocaleString('zh-CN');
            }
            
            if (FIELD === 'sizediff' || FIELD === 'size') {
                return edit[FIELD] !== undefined ? edit[FIELD].toString() : '0';
            }
            
            return edit[FIELD] !== undefined ? String(edit[FIELD]) : '';
        }

        async getLastEditTime(args) {
            const { USERNAME, WIKI } = args;
            
            try {
                const data = await this._jsonpRequest(WIKI, {
                    action: 'query',
                    list: 'usercontribs',
                    ucuser: USERNAME,
                    uclimit: 1,
                    ucprop: 'timestamp'
                });

                const contribs = data.query.usercontribs;
                
                if (!contribs || contribs.length === 0) {
                    return 'No edit history';
                }
                
                return new Date(contribs[0].timestamp).toLocaleString('zh-CN');
                
            } catch (error) {
                this.lastError = `Failed to retrieve the last edit time.: ${error.message}`;
                return `Error: ${error.message}`;
            }
        }

        async getUserInfo(args) {
            const { USERNAME, WIKI, INFO } = args;
            
            try {
                const props = ['editcount', 'registration', 'gender', 'groups', 'blockinfo'];
                const data = await this._jsonpRequest(WIKI, {
                    action: 'query',
                    list: 'users',
                    ususers: USERNAME,
                    usprop: props.join('|')
                });

                const user = data.query.users[0];
                
                if (!user || user.missing !== undefined) {
                    return INFO === 'blockid' ? 'false' : 'User不存在';
                }

                switch(INFO) {
                    case 'editcount':
                        return user.editcount !== undefined ? user.editcount.toString() : '0';
                    case 'userid':
                        return user.userid !== undefined ? user.userid.toString() : '';
                    case 'registration':
                        return user.registration ? new Date(user.registration).toLocaleString('zh-CN') : 'unknown';
                    case 'gender':
                        return user.gender || 'unknown';
                    case 'groups':
                        return user.groups ? user.groups.join(', ') : '';
                    case 'blockid':
                        return user.blockid !== undefined ? 'true' : 'false';
                    default:
                        return '';
                }
                
            } catch (error) {
                this.lastError = `Failed to retrieve user information.: ${error.message}`;
                return `Error: ${error.message}`;
            }
        }

        async isUserExists(args) {
            const { USERNAME, WIKI } = args;
            
            try {
                const data = await this._jsonpRequest(WIKI, {
                    action: 'query',
                    list: 'users',
                    ususers: USERNAME
                });

                const user = data.query.users[0];
                
                return user && user.missing === undefined;
                
            } catch (error) {
                this.lastError = `Failed to check if the user exists.: ${error.message}`;
                return false;
            }
        }
    }

    Scratch.extensions.register(new FandomWikiExtension());
    
})(window.Scratch);