class KukeChatJsonTool {
    constructor() {
        this.jsonCache = [];
    }

    getInfo() {
        return {
            id: "kukechat_json",
            name: "KukeChat数据解析工具",
            color1: '#ff6622',
            color2: '#ee5511',
            color3: '#dd4400',
            docsLabel: "安装kukechat拓展",
            docsURI: "https://assets.ccw.site/extension/kukechat",
            blocks: [
                {
                    opcode: 'parseJson',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '解析JSON文本 [JSON_TEXT] 存入全局缓存',
                    arguments: {
                        JSON_TEXT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'getIndexField',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '缓存下标 [INDEX] 的 [FIELD_SELECT]',
                    arguments: {
                        INDEX: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1
                        },
                        FIELD_SELECT: {
                            type: Scratch.ArgumentType.DROPDOWN_MENU,
                            menu: 'fieldList'
                        }
                    }
                },
                {
                    opcode: 'getAllFieldJoin',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '缓存下标所有的 [FIELD_ALL]',
                    arguments: {
                        FIELD_ALL: {
                            type: Scratch.ArgumentType.DROPDOWN_MENU,
                            menu: 'fieldList'
                        }
                    }
                },
                {
                    opcode: 'searchByKey',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '匹配 [KEY_TYPE] 为 [TARGET_VAL] 对应的 [GET_FIELD]',
                    arguments: {
                        KEY_TYPE: {
                            type: Scratch.ArgumentType.DROPDOWN_MENU,
                            menu: 'keyMenu'
                        },
                        TARGET_VAL: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 2738
                        },
                        GET_FIELD: {
                            type: Scratch.ArgumentType.DROPDOWN_MENU,
                            menu: 'getMenu'
                        }
                    }
                },
                {
                    opcode: 'clearCache',
                    blockType: Scratch.BlockType.COMMAND,
                    text: '清空JSON全局缓存'
                }
            ],
            menus: {
                fieldList: [
                    {text: 'id(顶层条目ID)', value: 'id'},
                    {text: 'conversation_id(会话ID)', value: 'conversation_id'},
                    {text: 'user_id(用户ID)', value: 'user_id'},
                    {text: 'role(身份角色)', value: 'role'},
                    {text: 'level(等级)', value: 'level'},
                    {text: 'level_exp(当前经验)', value: 'level_exp'},
                    {text: 'next_level_exp(升级所需经验)', value: 'next_level_exp'},
                    {text: 'activity_score(活跃积分)', value: 'activity_score'},
                    {text: 'total_checkins(总签到次数)', value: 'total_checkins'},
                    {text: 'current_checkin_streak(连续签到)', value: 'current_checkin_streak'},
                    {text: 'best_checkin_streak(最高连续签到)', value: 'best_checkin_streak'},
                    {text: 'last_checkin_date(上次签到日期)', value: 'last_checkin_date'},
                    {text: 'last_active_at(最后活跃时间)', value: 'last_active_at'},
                    {text: 'joined_at(入群时间)', value: 'joined_at'},
                    {text: 'muted(是否禁言)', value: 'muted'},
                    {text: 'pinned(是否置顶)', value: 'pinned'},
                    {text: 'remark(备注)', value: 'remark'},
                    {text: 'title(头衔)', value: 'title'},
                    {text: 'user-id(用户ID)', value: 'u_id'},
                    {text: 'username(用户名)', value: 'username'},
                    {text: 'nickname(昵称)', value: 'nickname'},
                    {text: 'avatar_url(头像链接)', value: 'avatar_url'},
                    {text: 'bio(个人简介)', value: 'bio'},
                    {text: 'profile_title(主页标题)', value: 'profile_title'},
                    {text: 'profile_tagline(个性标语)', value: 'profile_tagline'},
                    {text: 'profile_location(所在地)', value: 'profile_location'},
                    {text: 'profile_interests(兴趣标签)', value: 'profile_interests'},
                    {text: 'profile_layout(主页布局)', value: 'profile_layout'},
                    {text: 'profile_card_style(卡片样式)', value: 'profile_card_style'},
                    {text: 'profile_accent_color(主题色)', value: 'profile_accent_color'},
                    {text: 'profile_cover_url(封面链接)', value: 'profile_cover_url'},
                    {text: 'presence_status(在线状态)', value: 'presence_status'},
                    {text: 'presence_text(在线文案)', value: 'presence_text'},
                    {text: 'is_bot(是否机器人)', value: 'is_bot'},
                    {text: 'bot_owner_id(机器人主人ID)', value: 'bot_owner_id'},
                    {text: 'created_at(账号创建时间)', value: 'created_at'}
                ],
                keyMenu: [
                    {text: 'id', value: 'id'},
                    {text: 'user_id', value: 'user_id'}
                ],
                getMenu: [
                    {text: 'username', value: 'username'},
                    {text: 'nickname', value: 'nickname'},
                    {text: 'bio', value: 'bio'},
                    {text: 'profile_location', value: 'profile_location'}
                ]
            }
        };
    }

    parseJson(args) {
        const jsonStr = args.JSON_TEXT;
        try {
            this.jsonCache = JSON.parse(jsonStr);
            if (!Array.isArray(this.jsonCache)) this.jsonCache = [];
        } catch {
            this.jsonCache = [];
        }
    }

    clearCache() {
        this.jsonCache = [];
    }

    getIndexField(args) {
        let index = Number(args.INDEX);
        if (isNaN(index)) return '';
        const realIdx = Math.floor(index) - 1;
        if (realIdx < 0 || realIdx >= this.jsonCache.length) return '';
        const item = this.jsonCache[realIdx];
        if (!item) return '';
        const field = args.FIELD_SELECT;

        switch (field) {
            case 'id': return item.id ?? '';
            case 'conversation_id': return item.conversation_id ?? '';
            case 'user_id': return item.user_id ?? '';
            case 'role': return item.role ?? '';
            case 'level': return item.level ?? '';
            case 'level_exp': return item.level_exp ?? '';
            case 'next_level_exp': return item.next_level_exp ?? '';
            case 'activity_score': return item.activity_score ?? '';
            case 'total_checkins': return item.total_checkins ?? '';
            case 'current_checkin_streak': return item.current_checkin_streak ?? '';
            case 'best_checkin_streak': return item.best_checkin_streak ?? '';
            case 'last_checkin_date': return item.last_checkin_date ?? '';
            case 'last_active_at': return item.last_active_at ?? '';
            case 'joined_at': return item.joined_at ?? '';
            case 'muted': return item.muted ?? '';
            case 'pinned': return item.pinned ?? '';
            case 'remark': return item.remark ?? '';
            case 'title': return item.title ?? '';
            case 'u_id': return item.user?.id ?? '';
            case 'username': return item.user?.username ?? '';
            case 'nickname': return item.user?.nickname ?? '';
            case 'avatar_url': return item.user?.avatar_url ?? '';
            case 'bio': return item.user?.bio ?? '';
            case 'profile_title': return item.user?.profile_title ?? '';
            case 'profile_tagline': return item.user?.profile_tagline ?? '';
            case 'profile_location': return item.user?.profile_location ?? '';
            case 'profile_interests': return item.user?.profile_interests ?? '';
            case 'profile_layout': return item.user?.profile_layout ?? '';
            case 'profile_card_style': return item.user?.profile_card_style ?? '';
            case 'profile_accent_color': return item.user?.profile_accent_color ?? '';
            case 'profile_cover_url': return item.user?.profile_cover_url ?? '';
            case 'presence_status': return item.user?.presence_status ?? '';
            case 'presence_text': return item.user?.presence_text ?? '';
            case 'is_bot': return item.user?.is_bot ?? '';
            case 'bot_owner_id': return item.user?.bot_owner_id ?? '';
            case 'created_at': return item.user?.created_at ?? '';
            default: return '';
        }
    }

    getAllFieldJoin(args) {
        const field = args.FIELD_ALL;
        const list = this.jsonCache.map(item => {
            switch (field) {
                case 'id': return item.id ?? '';
                case 'conversation_id': return item.conversation_id ?? '';
                case 'user_id': return item.user_id ?? '';
                case 'role': return item.role ?? '';
                case 'level': return item.level ?? '';
                case 'level_exp': return item.level_exp ?? '';
                case 'next_level_exp': return item.next_level_exp ?? '';
                case 'activity_score': return item.activity_score ?? '';
                case 'total_checkins': return item.total_checkins ?? '';
                case 'current_checkin_streak': return item.current_checkin_streak ?? '';
                case 'best_checkin_streak': return item.best_checkin_streak ?? '';
                case 'last_checkin_date': return item.last_checkin_date ?? '';
                case 'last_active_at': return item.last_active_at ?? '';
                case 'joined_at': return item.joined_at ?? '';
                case 'muted': return item.muted ?? '';
                case 'pinned': return item.pinned ?? '';
                case 'remark': return item.remark ?? '';
                case 'title': return item.title ?? '';
                case 'u_id': return item.user?.id ?? '';
                case 'username': return item.user?.username ?? '';
                case 'nickname': return item.user?.nickname ?? '';
                case 'avatar_url': return item.user?.avatar_url ?? '';
                case 'bio': return item.user?.bio ?? '';
                case 'profile_title': return item.user?.profile_title ?? '';
                case 'profile_tagline': return item.user?.profile_tagline ?? '';
                case 'profile_location': return item.user?.profile_location ?? '';
                case 'profile_interests': return item.user?.profile_interests ?? '';
                case 'profile_layout': return item.user?.profile_layout ?? '';
                case 'profile_card_style': return item.user?.profile_card_style ?? '';
                case 'profile_accent_color': return item.user?.profile_accent_color ?? '';
                case 'profile_cover_url': return item.user?.profile_cover_url ?? '';
                case 'presence_status': return item.user?.presence_status ?? '';
                case 'presence_text': return item.user?.presence_text ?? '';
                case 'is_bot': return item.user?.is_bot ?? '';
                case 'bot_owner_id': return item.user?.bot_owner_id ?? '';
                case 'created_at': return item.user?.created_at ?? '';
                default: return '';
            }
        });
        return list.join(',');
    }

    searchByKey(args) {
        const keyName = args.KEY_TYPE;
        const targetValue = Number(args.TARGET_VAL);
        const needField = args.GET_FIELD;
        for (let item of this.jsonCache) {
            if (Number(item[keyName]) === targetValue && item.user) {
                switch (needField) {
                    case 'username': return item.user.username ?? '';
                    case 'nickname': return item.user.nickname ?? '';
                    case 'bio': return item.user.bio ?? '';
                    case 'profile_location': return item.user.profile_location ?? '';
                }
            }
        }
        return '';
    }
}

Scratch.extensions.register(new KukeChatJsonTool());