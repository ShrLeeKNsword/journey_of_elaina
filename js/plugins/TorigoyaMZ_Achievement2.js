/*---------------------------------------------------------------------------*
 * TorigoyaMZ_Achievement2.js v.1.4.0
 *---------------------------------------------------------------------------*
 * 2020/11/26 00:53 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 成就系统 (v.1.4.0)
 * @author Ruたん/<译>公孖。狼
 * @license public domain
 * @version 1.4.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_Achievement2.js
 * @help
 * 成就系统插件 (v.1.4.0)
 * https://torigoya-plugin.rutan.dev
 *
 * 您将可以设定成就和奖杯系统。
 * 使用方法请参照以下详细记录。
 * https://torigoya-plugin.rutan.dev/system/achievement2/
 *
 * ------------------------------------------------------------
 * ■ 设定方法
 * ------------------------------------------------------------
 *
 * 通过此插件的设定写入成就系统。
 * 此处的排列顺序与屏幕画面相同。
 * （如若您自行修改为倒叙排列亦可）
 *
 * ------------------------------------------------------------
 * ■ 游戏中激活成就
 * ------------------------------------------------------------
 *
 * 可以从插件指令中调用激活成就的处理机能。
 *
 * ------------------------------------------------------------
 * ■ 有关其他调用插件使用方法
 * ------------------------------------------------------------
 * 请确认以下记录。
 * https://torigoya-plugin.rutan.dev/system/achievement2/
 *
 * @param base
 * @text ■ 基本设定
 *
 * @param baseAchievementData
 * @text 注册成就情报
 * @type struct<Achievement>[]
 * @parent base
 * @default []
 *
 * @param baseSaveSlot
 * @text 保存数据的项目名
 * @type string
 * @parent base
 * @default achievement
 *
 * @param popup
 * @text ■ 弹出设定
 *
 * @param popupEnable
 * @text 弹出提示开关
 * @desc 取得成就时是否弹出窗口提示？
 * @type boolean
 * @parent popup
 * @on 是
 * @off 否
 * @default true
 *
 * @param popupPosition
 * @text 弹出位置
 * @desc 取得成就时弹出窗口出现位置
 * @type select
 * @parent popup
 * @option 左上
 * @value leftUp
 * @option 右上
 * @value rightUp
 * @default leftUp
 *
 * @param popupTopY
 * @text 弹出位置: 上端
 * @desc 取得成就时弹出窗口出现位置的上端
 * @type number
 * @parent popup
 * @min 0
 * @default 10
 *
 * @param popupAnimationType
 * @text 特效
 * @desc 取得成就时动画特效
 * 「背景虚化」需要导入Torigoya_FrameTween.js得以实现
 * @type select
 * @parent popup
 * @option 背景虚化
 * @value tween
 * @option 立即显示
 * @value open
 * @default tween
 *
 * @param popupWait
 * @text 对应耗时
 * @desc 取得成就时弹出窗口耗时（精确至秒）
 * ※不包含特效时间
 * @type number
 * @parent popup
 * @decimals 2
 * @min 0
 * @default 1.25
 *
 * @param popupWidth
 * @text 窗口尺寸
 * @desc 取得成就时弹出窗口尺寸（px）
 * 过于小的话文字将超出窗口
 * @type number
 * @parent popup
 * @min 200
 * @default 300
 *
 * @param popupPadding
 * @text 窗口余白
 * @desc 取得成就时弹出窗口余白部分大小
 * @type number
 * @parent popup
 * @min 0
 * @default 10
 *
 * @param popupTitleFontSize
 * @text 成就名文字尺寸
 * @desc 取得成就时窗口表示
 * 已取得成就名的文字尺寸
 * @type number
 * @parent popup
 * @min 16
 * @default 20
 *
 * @param popupTitleColor
 * @text 成就名文字颜色
 * @desc 成就名文字对应颜色
 * ※\c[数字] ←数字框内写入对应编号
 * @type number
 * @parent popup
 * @min 0
 * @default 1
 *
 * @param popupMessage
 * @text 成就提示
 * @desc 取得成就时弹出窗口
 * 获悉成就提示
 * @type string
 * @parent popup
 * @default 成就已激活
 *
 * @param popupMessageFontSize
 * @text 提示文字尺寸
 * @desc 取得成就时弹出窗口
 * 获悉成就提示对应文字尺寸
 * @type number
 * @parent popup
 * @min 12
 * @default 16
 *
 * @param popupSound
 * @text 音效
 * @desc 设定激活成就时音效
 * @type struct<Sound>
 * @parent popup
 * @default {"soundName":"Saint5","soundVolume":"90"}
 *
 * @param popupWindowImage
 * @text 窗口UI
 * @desc 激活成就时窗口UI图像素材
 * @type file
 * @require true
 * @parent popup
 * @dir img/system/
 * @default Window
 *
 * @param popupOpacity
 * @text 窗口背景透明度
 * @desc 窗口背景透明度(0～255)
 * -1等类似情况下为默认透明度
 * @type number
 * @parent popup
 * @min -1
 * @max 255
 * @default -1
 *
 * @param titleMenu
 * @text ■ タイトル / メニュー画面設定
 *
 * @param titleMenuUseInTitle
 * @text 标题 / 菜单界面设定
 *
 * @param titleMenuUseInTitle
 * @text 显示标题界面
 * @desc 是否在成就菜单中显示标题界面？
 * @type boolean
 * @parent titleMenu
 * @on 是
 * @off 否
 * @default true
 *
 * @param titleMenuUseInMenu
 * @text メ显示菜单界面
 * @desc 是否再成就菜单中显示菜单界面？
 * @type boolean
 * @parent titleMenu
 * @on 是
 * @off 否
 * @default true
 *
 * @param titleMenuText
 * @text 项目名
 * @desc 标题和菜单显示前提下
 * 成就菜单中对应项目名
 * @type string
 * @parent title
 * @default 成就
 *
 * @param achievementMenu
 * @text ■ 成就界面设定
 *
 * @param achievementMenuHiddenTitle
 * @text 未激活成就名称
 * @desc 成就界面中未取得成就对应名称
 * @type string
 * @parent achievementMenu
 * @default ？？？？？
 *
 * @param achievementMenuHiddenIcon
 * @text 未激活成就图标ID
 * @desc 成就界面中未激活成就对应图标ID
 * @type number
 * @parent achievementMenu
 * @default 0
 *
 * @param advanced
 * @text ■ 高级指令设定
 *
 * @param advancedFontFace
 * @text 弹出式字体
 * @desc 成就激活时弹出的气泡式文本。
 * 未设置的情况仅可窗口文本描述。
 * @type string
 * @parent advanced
 * @default
 *
 * @param advancedOverwritable
 * @text 已激活成就熄灭
 * @desc 使已激活成就可以重复获取
 * @type boolean
 * @parent advanced
 * @on 是
 * @off 否
 * @default false
 *
 * @command gainAchievement
 * @text 指定成就
 * @desc 取得被指定成就
 *
 * @arg key
 * @text 指定成就ID
 * @desc 为想取得成就指定ID
 * @type string
 *
 * @command removeAchievement
 * @text 消除已激活成就
 * @desc 使已激活成就切换为未激活状态。原本为未激活则不会有任何改变。
 *
 * @arg key
 * @text 消除成就ID
 * @desc 为想消除成就指定ID
 * @type string
 *
 * @command openSceneAchievement
 * @text 显示成就界面
 * @desc 显示已取得成就一览界面。
 *
 * @command resetAchievement
 * @text 全部成就消除（谨慎！）
 * @desc 全部成就切换为未取得状态。请谨慎使用！
 */

/*~struct~Sound:
 * @param soundName
 * @text 音效文件名
 * @desc 取得成就音效文件名
 * 空白的情况下将木有提示音效
 * @type file
 * @require true
 * @dir audio/se/
 * @default Saint5
 *
 * @param soundVolume
 * @text 音效音量
 * @desc 取得成就音效音量
 * @type number
 * @min 0
 * @max 100
 * @default 90
 */

/*~struct~Achievement:
 * @param key
 * @text 管理ID
 * @desc 完成成就时提示语（例: 游戏通关）
 * 数字或者中文都行 / 无法与单项成就挂钩
 * @type string
 *
 * @param title
 * @text 成就名
 * @desc 成就界面所表示成就名
 * （例：激战魔王勇夺胜利！）
 * @type string
 * @default
 *
 * @param description
 * @text 成就详情
 * @desc 成就界面详细说明（2行程度）
 * @type multiline_string
 * @default
 *
 * @param icon
 * @text 成就对应图标ID
 * @type number
 * @default 0
 *
 * @param hint
 * @text 成就教程
 * @desc 未取得成就时的知道方法（2行程度）
 * 空白栏显示常规说明文字
 * @type multiline_string
 * @default
 *
 * @param isSecret
 * @text 隐秘成就
 * @desc 此成就为隐秘状态
 * 未取得成就一览无法显示
 * @type boolean
 * @on 隐秘
 * @off 公开
 * @default false
 *
 * @param note
 * @text 备注
 * @desc 此为备注栏。
 * 与MZ备注栏相同使用功能。
 * @type multiline_string
 * @default
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_Achievement2';
    }

    function pickStringValueFromParameter(parameter, key, defaultValue = '') {
        if (!parameter.hasOwnProperty(key)) return defaultValue;
        return ''.concat(parameter[key] || '');
    }

    function pickNumberValueFromParameter(parameter, key, defaultValue = 0) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parseFloat(parameter[key]);
    }

    function pickBooleanValueFromParameter(parameter, key, defaultValue = 'false') {
        return ''.concat(parameter[key] || defaultValue) === 'true';
    }

    function pickIntegerValueFromParameter(parameter, key, defaultValue = 0) {
        if (!parameter.hasOwnProperty(key) || parameter[key] === '') return defaultValue;
        return parseInt(parameter[key], 10);
    }

    function pickStructSound(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            soundName: pickStringValueFromParameter(parameter, 'soundName', 'Saint5'),
            soundVolume: pickNumberValueFromParameter(parameter, 'soundVolume', 90),
        };
    }

    function pickStructAchievement(parameter) {
        parameter = parameter || {};
        if (typeof parameter === 'string') parameter = JSON.parse(parameter);
        return {
            key: pickStringValueFromParameter(parameter, 'key', undefined),
            title: pickStringValueFromParameter(parameter, 'title', ''),
            description: pickStringValueFromParameter(parameter, 'description', ''),
            icon: pickNumberValueFromParameter(parameter, 'icon', 0),
            hint: pickStringValueFromParameter(parameter, 'hint', ''),
            isSecret: pickBooleanValueFromParameter(parameter, 'isSecret', false),
            note: pickStringValueFromParameter(parameter, 'note', ''),
        };
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.4.0',
            baseAchievementData: ((parameters) => {
                parameters = parameters || [];
                if (typeof parameters === 'string') parameters = JSON.parse(parameters);
                return parameters.map((parameter) => {
                    return pickStructAchievement(parameter);
                });
            })(parameter.baseAchievementData),
            baseSaveSlot: pickStringValueFromParameter(parameter, 'baseSaveSlot', 'achievement'),
            popupEnable: pickBooleanValueFromParameter(parameter, 'popupEnable', true),
            popupPosition: pickStringValueFromParameter(parameter, 'popupPosition', 'leftUp'),
            popupTopY: pickIntegerValueFromParameter(parameter, 'popupTopY', 10),
            popupAnimationType: pickStringValueFromParameter(parameter, 'popupAnimationType', 'tween'),
            popupWait: pickNumberValueFromParameter(parameter, 'popupWait', 1.25),
            popupWidth: pickNumberValueFromParameter(parameter, 'popupWidth', 300),
            popupPadding: pickNumberValueFromParameter(parameter, 'popupPadding', 10),
            popupTitleFontSize: pickNumberValueFromParameter(parameter, 'popupTitleFontSize', 20),
            popupTitleColor: pickNumberValueFromParameter(parameter, 'popupTitleColor', 1),
            popupMessage: pickStringValueFromParameter(parameter, 'popupMessage', '実績を獲得しました'),
            popupMessageFontSize: pickNumberValueFromParameter(parameter, 'popupMessageFontSize', 16),
            popupSound: ((parameter) => {
                return pickStructSound(parameter);
            })(parameter.popupSound),
            popupWindowImage: pickStringValueFromParameter(parameter, 'popupWindowImage', 'Window'),
            popupOpacity: pickNumberValueFromParameter(parameter, 'popupOpacity', -1),
            titleMenuUseInTitle: pickBooleanValueFromParameter(parameter, 'titleMenuUseInTitle', true),
            titleMenuUseInMenu: pickBooleanValueFromParameter(parameter, 'titleMenuUseInMenu', true),
            titleMenuText: pickStringValueFromParameter(parameter, 'titleMenuText', '実績'),
            achievementMenuHiddenTitle: pickStringValueFromParameter(
                parameter,
                'achievementMenuHiddenTitle',
                '？？？？？'
            ),
            achievementMenuHiddenIcon: pickNumberValueFromParameter(parameter, 'achievementMenuHiddenIcon', 0),
            advancedFontFace: pickStringValueFromParameter(parameter, 'advancedFontFace', ''),
            advancedOverwritable: pickBooleanValueFromParameter(parameter, 'advancedOverwritable', false),
        };
    }

    function isThenable(obj) {
        return obj && typeof obj['then'] === 'function';
    }

    class AchievementManager {
        get achievements() {
            return this._achievements;
        }

        get unlockInfo() {
            return this._unlockInfo;
        }

        get options() {
            return this._options;
        }

        /**
         * 生成
         * @param options
         */
        constructor(options = {}) {
            this._options = options;
            this._achievements = [];
            this._unlockInfo = new Map();
            this._handlers = [];
            this._isReady = false;
        }

        /**
         * 初期化処理
         */
        init() {
            if (this.options.onInit) {
                const result = this.options.onInit(this);
                if (isThenable(result)) {
                    result.then(() => (this._isReady = true));
                } else {
                    this._isReady = true;
                }
            } else {
                this._isReady = true;
            }
        }

        /**
         * 初期化完了
         * @returns {*}
         */
        isReady() {
            return this._isReady;
        }

        /**
         * 実績マスター情報の登録
         */
        setAchievements(achievements) {
            this._achievements = achievements.map((achievement) => {
                if (achievement.note) {
                    DataManager.extractMetadata(achievement);
                } else {
                    achievement.meta = {};
                }
                return achievement;
            });
        }

        /**
         * 獲得済み実績の保存
         * @returns {Promise}
         */
        save() {
            if (this.options.onSave) {
                const result = this.options.onSave(this);
                return isThenable(result) ? result : Promise.resolve();
            }
            return Promise.resolve();
        }

        /**
         * 実績リストを取得
         * @returns {{unlockInfo: any, achievement: *}[]}
         */
        data() {
            return this._achievements.map((achievement) => ({
                achievement,
                unlockInfo: this.unlockInfo.get(achievement.key) || null,
            }));
        }

        /**
         * 指定キーの実績情報を取得
         * @param {string} key  取得する実績のキー
         * @returns {Achievement|null}
         */
        getAchievement(key) {
            key = this.normalizeKey(key);
            return this._achievements.find((achievement) => achievement.key === key) || null;
        }

        /**
         * 獲得済み実績の件数を取得
         * @returns {number}
         */
        getUnlockedCount() {
            return this.unlockInfo.size;
        }

        /**
         * 実績獲得情報の取得
         * @param {string} key  取得するする実績のキー
         * @returns {any | null}
         */
        getUnlockInfo(key) {
            key = this.normalizeKey(key);
            return this.unlockInfo.get(''.concat(key)) || null;
        }

        /**
         * 指定キーの実績が獲得済みであるか？
         * @param {string} key  確認する実績のキー
         * @returns {boolean}
         */
        isUnlocked() {
            return Array.from(arguments).every((key) => {
                key = this.normalizeKey(key);
                return this.unlockInfo.has(key);
            });
        }

        /**
         * すべての実績が獲得済みであるか？
         * @returns {boolean}
         */
        isAllUnlocked() {
            return this.achievements.every((achievement) => {
                return this.unlockInfo.has(achievement.key);
            });
        }

        /**
         * 指定キーの実績が獲得可能であるか？
         * @param {string} key  確認する実績のキー
         * @returns {boolean}
         */
        isUnlockable(key) {
            key = this.normalizeKey(key);
            if (!this.getAchievement(key)) return false;
            if (!this.options.overwritable && this.unlockInfo.has(key)) return false;

            return true;
        }

        /**
         * 指定キーの実績を獲得する
         * @param {string} key  獲得する実績のキー
         * @returns {boolean}   実績獲得処理が実行されたか
         */
        unlock(key) {
            key = this.normalizeKey(key);
            if (!this.isUnlockable(key)) return false;
            this.unlockInfo.set(key, this.makeUnlockData(key));
            this.notify(key);
            this.save();
            return true;
        }

        /**
         * 実績獲得情報を生成する
         * ※アドオンプラグイン等で再定義・加工される想定
         * @param {string} _key 獲得する実績のキー
         * @returns {{date: number}}
         */
        makeUnlockData(_key) {
            return {
                date: Date.now(),
            };
        }

        /**
         * 指定キーの実績獲得イベントの通知
         * @param {string} key 獲得した実績のキー
         */
        notify(key) {
            key = this.normalizeKey(key);
            const achievement = this.getAchievement(key);
            if (!achievement) return;
            const unlockInfo = this.unlockInfo.get(key);
            if (!unlockInfo) return;

            this._handlers.forEach((handler) => {
                handler({ achievement, unlockInfo });
            });
        }

        /**
         * 指定キーの実績を削除する
         * @param key
         */
        remove(key) {
            key = ''.concat(key);
            this.unlockInfo.delete(key);
        }

        /**
         * 全実績を削除する
         * @note 削除後にセーブ処理を呼び出す
         */
        clear() {
            this.resetData();
            this.save();
        }

        /**
         * 実績データのリセット
         */
        resetData() {
            this.unlockInfo.clear();
        }

        /**
         * 実績獲得通知イベントの購読開始
         * @param {Handler} handler
         */
        on(handler) {
            this._handlers.push(handler);
        }

        /**
         * 実績獲得通知イベントの購読解除
         * @param {Handler} handler
         */
        off(handler) {
            this._handlers = this._handlers.filter((h) => h !== handler);
        }

        /**
         * @callback Handler
         * @param {{achievement: any, unlockInfo: any}} responseCode
         */

        /**
         * keyの文字列化
         * @param key
         * @returns {string}
         * @private
         */
        normalizeKey(key) {
            return typeof key === 'string' ? key : ''.concat(key);
        }

        /**
         * 保存したいデータの出力
         */
        createSaveContents() {
            return {
                unlockInfo: Array.from(this.unlockInfo.entries()),
            };
        }

        /**
         * データのインポート
         * @param data
         */
        extractSaveContents(data) {
            try {
                this.resetData();
                data.unlockInfo.forEach(([key, value]) => {
                    if (!this.getAchievement(key)) return;
                    this.unlockInfo.set(key, value);
                });
            } catch (e) {
                console.error(e);
            }
        }
    }

    class AchievementPopupManager {
        get options() {
            return this._options;
        }

        /**
         * 生成
         * @param {AchievementManager} manager
         * @param {any} options
         */
        constructor(manager, options = {}) {
            this._manager = manager;
            this._options = options;
            this._stacks = [];
            this._stackAnimations = [];
            this._soundAnimator = null;
        }

        /**
         * 初期化処理
         */
        init() {
            this._manager.on(this.onNotify.bind(this));
        }

        /**
         * リセット処理
         */
        reset() {
            this._stackAnimations.forEach((tween) => {
                tween.abort();
            });
            this._stacks.forEach(this.destroyPopupWindow.bind(this));

            this._stacks.length = 0;
            this._stackAnimations.length = 0;
        }

        /**
         * 通知処理
         * @param {{achievement: Achievement, unlockInfo: any}} data
         */
        onNotify(data) {
            const popupWindow = this._options.createPopupWindow(data);
            const isLeftUp = this._options.popupPosition === 'leftUp';
            const x = isLeftUp ? this.leftX() : this.rightX() - popupWindow.width;
            const y = (() => {
                let y = this.topY();
                for (let i = 0; i < this._stacks.length; ++i) {
                    const target = this._stacks[i];
                    if (Math.abs(target.y - y) > (target.height + popupWindow.height) / 2) continue;
                    y += popupWindow.y + popupWindow.height + 10;
                }
                return y;
            })();

            if (this._options.popupAnimationType === 'tween' && (Torigoya.FrameTween || Torigoya.Tween)) {
                this._showWithTween(popupWindow, x, y);
            } else {
                this._showWithoutTween(popupWindow, x, y);
            }
        }

        /**
         * Tweenを使った表示処理
         * @param popupWindow
         * @param x
         * @param y
         * @private
         */
        _showWithTween(popupWindow, x, y) {
            const isLeftUp = this._options.popupPosition === 'leftUp';
            const originalOpacity = popupWindow.opacity;
            const originalBackOpacity = popupWindow.backOpacity;

            const Easing = (Torigoya.FrameTween || Torigoya.Tween).Easing;

            const tween = (Torigoya.FrameTween || Torigoya.Tween)
                .create(popupWindow, {
                    x: x + popupWindow.width * (isLeftUp ? -1 : 1),
                    y,
                    opacity: 0,
                    backOpacity: 0,
                    contentsOpacity: 0,
                })
                .to(
                    {
                        x: x,
                        opacity: originalOpacity,
                        backOpacity: originalBackOpacity,
                        contentsOpacity: 255,
                    },

                    30,
                    Easing.easeOutCircular
                )
                .wait(Math.floor(this._options.popupWait * 60))
                .to(
                    {
                        y: y - popupWindow.height,
                        opacity: 0,
                        backOpacity: 0,
                        contentsOpacity: 0,
                    },

                    30,
                    Easing.easeInCircular
                )
                .call(() => {
                    this._stacks = this._stacks.filter((stack) => popupWindow !== stack);
                    this.destroyPopupWindow(popupWindow);
                });
            tween.start();

            this._stacks.push(popupWindow);
            this._stacks.sort((a, b) => a.y - b.y);
            this._stackAnimations.push(tween);

            if (this._soundAnimator) {
                this._soundAnimator.abort();
                this._soundAnimator = null;
            }

            this._soundAnimator = (Torigoya.FrameTween || Torigoya.Tween)
                .create({})
                .wait(1)
                .call(() => {
                    this._options.playSe();
                });
            this._soundAnimator.start();
        }

        /**
         * Tweenを使わない表示処理
         * @param popupWindow
         * @param x
         * @param y
         * @private
         */
        _showWithoutTween(popupWindow, x, y) {
            popupWindow.x = x;
            popupWindow.y = y;
            popupWindow.openness = 0;
            popupWindow.open();
            setTimeout(() => {
                popupWindow.close();
                this._stacks = this._stacks.filter((stack) => popupWindow !== stack);
                setTimeout(() => {
                    if (popupWindow.parent) popupWindow.parent.removeChild(popupWindow);
                }, 500);
            }, this._options.popupWait * 1000);

            this._stacks.push(popupWindow);
            this._stacks.sort((a, b) => a.y - b.y);

            this._options.playSe();
        }

        /**
         * 一番左端
         * @returns {number}
         */
        leftX() {
            return 10;
        }

        /**
         * 一番右端
         * @returns {number}
         */
        rightX() {
            return Graphics.width - 10;
        }

        /**
         * 表示Y座標:上端
         * @returns {number}
         */
        topY() {
            return this._options.topY === undefined ? 10 : this._options.topY;
        }

        /**
         * ポップアップウィンドウの廃棄処理
         * @param popupWindow
         */
        destroyPopupWindow(popupWindow) {
            if (popupWindow.parent) popupWindow.parent.removeChild(popupWindow);
            if (typeof popupWindow.destroy === 'function') popupWindow.destroy();
        }
    }

    Torigoya.Achievement2 = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    // -------------------------------------------------------------------------
    // 実績マネージャ

    Torigoya.Achievement2.Manager = new AchievementManager({
        onInit(manager) {
            manager.setAchievements(Torigoya.Achievement2.parameter.baseAchievementData);

            return StorageManager.loadObject(Torigoya.Achievement2.parameter.baseSaveSlot)
                .then((data) => manager.extractSaveContents(data))
                .catch((e) => {
                    console.error(e);
                    manager.resetData();
                });
        },
        onSave(manager) {
            return StorageManager.saveObject(
                Torigoya.Achievement2.parameter.baseSaveSlot,
                manager.createSaveContents()
            );
        },
        overwritable: Torigoya.Achievement2.parameter.advancedOverwritable,
    });

    // -------------------------------------------------------------------------
    // 実績ポップアップ表示マネージャ

    Torigoya.Achievement2.PopupManager = new AchievementPopupManager(Torigoya.Achievement2.Manager, {
        popupPosition: Torigoya.Achievement2.parameter.popupPosition,
        popupWait: Torigoya.Achievement2.parameter.popupWait,
        popupAnimationType: Torigoya.Achievement2.parameter.popupAnimationType,
        topY: Torigoya.Achievement2.parameter.popupTopY,
        createPopupWindow(item) {
            const popupWindow = new Window_AchievementPopup(item);
            SceneManager._scene.addChild(popupWindow); // 行儀悪い

            return popupWindow;
        },
        playSe() {
            const name = Torigoya.Achievement2.parameter.popupSound.soundName;
            if (!name) return;

            AudioManager.playSe({
                name,
                pan: 0,
                pitch: 100,
                volume: Torigoya.Achievement2.parameter.popupSound.soundVolume,
            });
        },
    });

    // -------------------------------------------------------------------------
    // 実績ポップアップウィンドウ

    class Window_AchievementPopup extends Window_Base {
        initialize(item) {
            const rect = new Rectangle(0, 0, this.windowWidth(), this.windowHeight());
            super.initialize(rect);
            this._item = item;
            this.refresh();
        }

        updatePadding() {
            this.padding = this.standardPadding();
        }

        windowWidth() {
            return Torigoya.Achievement2.parameter.popupWidth;
        }

        windowHeight() {
            return this.titleFontSize() + this.messageFontSize() + this.standardPadding() * 2 + 5;
        }

        standardPadding() {
            return Torigoya.Achievement2.parameter.popupPadding;
        }

        labelFontFace() {
            return Torigoya.Achievement2.parameter.advancedFontFace || $gameSystem.mainFontFace();
        }

        titleFontSize() {
            return Torigoya.Achievement2.parameter.popupTitleFontSize;
        }

        messageFontSize() {
            return Torigoya.Achievement2.parameter.popupMessageFontSize;
        }

        lineHeight() {
            return this.titleFontSize();
        }

        resetFontSettings() {
            super.resetFontSettings();
            this.contents.fontFace = this.labelFontFace();
            this.contents.fontSize = this.titleFontSize();
        }

        refresh() {
            this.contents.clear();
            this.drawIcon(this._item.achievement.icon, 0, 0);
            this.drawTitle();
            this.drawMessage();
        }

        drawTitle() {
            this.resetFontSettings();
            this.drawTextEx(
                '\\c['.concat(Torigoya.Achievement2.parameter.popupTitleColor, ']') + this._item.achievement.title,
                40,
                0
            );
        }

        drawMessage() {
            const textWidth = this.windowWidth() - this.standardPadding() * 2 - 40;
            const y = this.titleFontSize() + 5;
            this.resetTextColor();
            this.contents.fontSize = this.messageFontSize();
            this.contents.drawText(
                Torigoya.Achievement2.parameter.popupMessage,
                40,
                y,
                textWidth,
                this.messageFontSize(),
                'left'
            );
        }

        calcTextHeight() {
            return this.contents.fontSize;
        }

        loadWindowskin() {
            this.windowskin = ImageManager.loadSystem(Torigoya.Achievement2.parameter.popupWindowImage);
        }

        updateBackOpacity() {
            return Torigoya.Achievement2.parameter.popupOpacity === -1
                ? super.updateBackOpacity()
                : Torigoya.Achievement2.parameter.popupOpacity;
        }
    }

    Torigoya.Achievement2.Window_AchievementPopup = Window_AchievementPopup;

    // -------------------------------------------------------------------------
    // 実績一覧ウィンドウ

    class Window_AchievementList extends Window_Selectable {
        initialize(rect) {
            super.initialize(rect);
            this._data = [];
            this.refresh();
        }

        maxItems() {
            return this._data ? this._data.length : 0;
        }

        item() {
            return this._data ? this._data[this.index()] : null;
        }

        makeItemList() {
            this._data = Torigoya.Achievement2.Manager.data().filter((param) => this.isVisibleItem(param));
        }

        isCurrentItemEnabled() {
            return !this.item();
        }

        isVisibleItem({ achievement, unlockInfo }) {
            if (unlockInfo) return true;
            return !achievement.isSecret;
        }

        drawItem(index) {
            const item = this._data[index];
            this.resetFontSettings();

            if (!item) return;

            const rect = this.itemLineRect(index);
            this.resetTextColor();

            const iconWidth = ImageManager.iconWidth + 8;
            if (item.unlockInfo) {
                this.changePaintOpacity(true);
                this.drawIcon(item.achievement.icon, rect.x, rect.y + (rect.height - ImageManager.iconHeight) / 2);
                this.drawText(item.achievement.title, rect.x + iconWidth, rect.y, rect.width - iconWidth, 'left');
            } else {
                this.changePaintOpacity(false);
                this.drawIcon(Torigoya.Achievement2.parameter.achievementMenuHiddenIcon, rect.x, rect.y);
                this.drawText(
                    Torigoya.Achievement2.parameter.achievementMenuHiddenTitle,
                    rect.x + iconWidth,
                    rect.y,
                    rect.width - iconWidth,
                    'left'
                );
            }
        }

        refresh() {
            this.makeItemList();
            this.paint();
        }

        updateHelp() {
            const item = this.item();
            if (item) {
                this.setHelpWindowItem({
                    description: item.unlockInfo
                        ? item.achievement.description
                        : item.achievement.hint || item.achievement.description,
                });
            } else {
                this.setHelpWindowItem(null);
            }
        }

        playBuzzerSound() {
            // nothing to do
        }
    }

    Torigoya.Achievement2.Window_AchievementList = Window_AchievementList;

    // -------------------------------------------------------------------------
    // 実績表示シーン

    class Scene_Achievement extends Scene_MenuBase {
        create() {
            super.create();
            this.createHelpWindow();

            this._listWindow = new Window_AchievementList(this.listWindowRect());
            this._listWindow.setHandler('ok', this.onListOk.bind(this));
            this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
            this._listWindow.setHelpWindow(this._helpWindow);
            this.addWindow(this._listWindow);
        }

        listWindowRect() {
            const wx = 0;
            const wy = this.mainAreaTop();
            const ww = Graphics.boxWidth;
            const wh = this.mainAreaHeight();
            return new Rectangle(wx, wy, ww, wh);
        }

        start() {
            super.start();
            this._listWindow.select(0);
            this._listWindow.activate();
        }

        onListOk() {
            this.onListCancel();
        }

        onListCancel() {
            this.popScene();
        }
    }

    Torigoya.Achievement2.Scene_Achievement = Scene_Achievement;

    (() => {
        // -------------------------------------------------------------------------
        // タイトル画面への追加

        if (Torigoya.Achievement2.parameter.titleMenuUseInTitle) {
            const upstream_Window_TitleCommand_makeCommandList = Window_TitleCommand.prototype.makeCommandList;
            Window_TitleCommand.prototype.makeCommandList = function () {
                upstream_Window_TitleCommand_makeCommandList.apply(this);
                this.addCommand(Torigoya.Achievement2.parameter.titleMenuText, 'Torigoya_Achievement', true);
            };

            const upstream_Scene_Title_createCommandWindow = Scene_Title.prototype.createCommandWindow;
            Scene_Title.prototype.createCommandWindow = function () {
                upstream_Scene_Title_createCommandWindow.apply(this);
                this._commandWindow.setHandler('Torigoya_Achievement', this.commandTorigoyaAchievement.bind(this));
            };

            Scene_Title.prototype.commandTorigoyaAchievement = function () {
                this._commandWindow.close();
                SceneManager.push(Torigoya.Achievement2.Scene_Achievement);
            };
        }

        // -------------------------------------------------------------------------
        // メニュー画面への追加

        if (Torigoya.Achievement2.parameter.titleMenuUseInMenu) {
            const upstream_Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
            Window_MenuCommand.prototype.addOriginalCommands = function () {
                upstream_Window_MenuCommand_addOriginalCommands.apply(this);
                this.addCommand(Torigoya.Achievement2.parameter.titleMenuText, 'Torigoya_Achievement', true);
            };

            const upstream_Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
            Scene_Menu.prototype.createCommandWindow = function () {
                upstream_Scene_Menu_createCommandWindow.apply(this);
                this._commandWindow.setHandler('Torigoya_Achievement', this.commandTorigoyaAchievement.bind(this));
            };

            Scene_Menu.prototype.commandTorigoyaAchievement = function () {
                SceneManager.push(Torigoya.Achievement2.Scene_Achievement);
            };
        }

        // -------------------------------------------------------------------------
        // シーン管理

        const upstream_Scene_Boot_onSceneTerminate = SceneManager.onSceneTerminate;
        SceneManager.onSceneTerminate = function () {
            Torigoya.Achievement2.PopupManager.reset();
            upstream_Scene_Boot_onSceneTerminate.apply(this);
        };

        // -------------------------------------------------------------------------
        // 起動処理

        const upstream_Scene_Boot_onDatabaseLoaded = Scene_Boot.prototype.onDatabaseLoaded;
        Scene_Boot.prototype.onDatabaseLoaded = function () {
            upstream_Scene_Boot_onDatabaseLoaded.apply(this);
            ImageManager.loadSystem(Torigoya.Achievement2.parameter.popupWindowImage);
            Torigoya.Achievement2.Manager.init();
        };

        const upstream_Scene_Boot_start = Scene_Boot.prototype.start;
        Scene_Boot.prototype.start = function () {
            upstream_Scene_Boot_start.apply(this);
            if (Torigoya.Achievement2.parameter.popupEnable) {
                Torigoya.Achievement2.PopupManager.init();
            }
        };

        const upstream_Scene_Boot_isReady = Scene_Boot.prototype.isReady;
        Scene_Boot.prototype.isReady = function () {
            return upstream_Scene_Boot_isReady.apply(this) && Torigoya.Achievement2.Manager.isReady();
        };

        // -------------------------------------------------------------------------
        // プラグインコマンド

        function commandGainAchievement({ key }) {
            Torigoya.Achievement2.Manager.unlock(''.concat(key).trim());
        }

        function commandRemoveAchievement({ key }) {
            Torigoya.Achievement2.Manager.remove(''.concat(key).trim());
        }

        function commandOpenSceneAchievement() {
            SceneManager.push(Torigoya.Achievement2.Scene_Achievement);
        }

        function commandResetAchievement() {
            Torigoya.Achievement2.Manager.clear();
        }

        PluginManager.registerCommand(Torigoya.Achievement2.name, 'gainAchievement', commandGainAchievement);
        PluginManager.registerCommand(Torigoya.Achievement2.name, 'clearAchievement', commandRemoveAchievement);
        PluginManager.registerCommand(Torigoya.Achievement2.name, 'openSceneAchievement', commandOpenSceneAchievement);
        PluginManager.registerCommand(Torigoya.Achievement2.name, 'resetAchievement', commandResetAchievement);
    })();
})();
