//=============================================================================
// MPP_Pseudo3DBattle.js
//=============================================================================
// Copyright (c) 2021 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc A function to move the camera three-dimensionally during battle is added.
 * @author Mokusei Penguin
 * @url
 * 
 * @help [version 1.3.0]
 * This plugin is for RPG Maker MZ.
 * 
 * ※ Note
 *  1. This plugin is not compatible with plugins that move or change
 *     the shape of combat characters. We cannot handle conflicts
 *     with such plugins.
 *  2. Due to the fact that 2D images are used originally,
 *     not all images can be supported.
 *  3. If you place an enemy character in the lower left (or lower right),
 *     you may see the edges of the background. Avoid placement or adjust
 *     with plugin parameters.
 *  4. If you want to change the movement of the camera,
 *     modify the code directly.
 * 
 * ▼ Plugin command
 *  - In the item to enter a numerical value, select the text and
 *    write v[N] to refer to the variable N.
 *  
 *  〇 enemyFocus
 *   - The viewpoint moves so that the specified enemy is near the center.
 *  
 *  〇 actorFocus
 *   - The viewpoint moves so that the specified actor is near the center.
 *  
 *  〇 moveHome
 *   - Move to the viewpoint at the beginning of the battle.
 * 
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠ is half-width)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 * 
 *  @command enemyFocus
 *      @desc 
 *      @arg index
 *          @desc -1:Entire Troop
 *          @type number
 *              @min -1
 *              @max 7
 *          @default 0
 *      @arg scale
 *          @desc 100:1x
 *          @type number
 *              @min 50
 *              @max 150
 *          @default 100
 *      @arg duration
 *          @desc 
 *          @type number
 *              @min 0
 *              @max 999
 *          @default 60
 * 
 *  @command actorFocus
 *      @desc 
 *      @arg id
 *          @text ID
 *          @desc 0:Entire Party
 *          @type number
 *              @min 0
 *              @max 999
 *          @default 1
 *      @arg scale
 *          @desc 100:1x
 *          @type number
 *              @min 50
 *              @max 150
 *          @default 100
 *      @arg duration
 *          @desc 
 *          @type number
 *              @min 0
 *              @max 999
 *          @default 60
 * 
 *  @command moveHome
 *      @desc 
 *      @arg duration
 *          @desc 
 *          @type number
 *              @min 0
 *              @max 999
 *          @default 60
 * 
 * 
 * 
 *  @param Battleback Scale
 *      @desc Increase the value slightly only if you can see the edges of the background.
 *      @type number
 *          @min 1.0
 *          @max 9.9
 *          @decimals 1
 *      @default 1.3
 * 
 *  @param Drift Delay
 *      @desc No changes are needed unless you have a good reason.
 *      @type number
 *          @min 0
 *          @max 999
 *      @default 120
 * 
 *  @param Battleback2 Pivot Y Fixes
 *      @desc If you don't like the position of the origin Y in the battle background, set it.
 *      @type struct<Battleback>[]
 *      @default ["{\"Battleback2 Image\":\"Town2\",\"Pivot Y\":\"182\"}"]
 * 
 */

/*~struct~Battleback:ja
 *  @param Battleback2 Image
 *      @desc 
 *      @type file
 *          @require 1
 *          @dir img/battlebacks2
 *      @default 
 *
 *  @param Pivot Y
 *      @desc 
 *      @type number
 *          @min 1
 *          @max 9999
 *      @default 256
 *
 */

/*:
 * @target MZ
 * @plugindesc 在战斗中增加伪3D视角的功能。
 * @author 木星ペンギン
 * @url
 * 
 * @help [version 1.3.0]
 * 此插件适用于 RPG Maker MZ。
 * 
 * ※ 注意
 *  1. 此插件与移动或改变战斗角色形状的插件不兼容。
 *     无法处理与此类插件的冲突。
 *  2. 由于最初使用的是 2D 图像，因此并非所有图像都支持。
 *  3. 如果将敌方角色放置在左下方（或右下方），您可能会看到背景的边缘。
 *     避免放置或调整插件参数。
 *  4. 想更改视角的运动时，直接修改代码。
 * 
 * ▼ 插件命令
 *  - 在输入数值的项目中，
 *    选择文本并写入 v[N] 以引用变量 N。 
 *  
 *  〇 敵キャラフォーカス / enemyFocus
 *   - 视角向设置的敌方角色中心靠近移动。
 *  
 *  〇 アクターフォーカス / actorFocus
 *   - 视角向设置的角色中心靠近移动。
 *  
 *  〇 ホームに移動 / moveHome
 *   - 移动到战斗开始时的视角。
 * 
 * ================================
 * Mail : wood_penguin＠yahoo.co.jp (＠は半角)
 * Blog : http://woodpenguin.blog.fc2.com/
 * License : MIT license
 * 
 *  @command enemyFocus
 *      @text 敌人角色角色
 *      @desc 
 *      @arg index
 *          @text インデックス
 *          @desc -1:敌方全体
 *          @type number
 *              @min -1
 *              @max 7
 *          @default 0
 *      @arg scale
 *          @text 放大率
 *          @desc 100:等倍
 *          @type number
 *              @min 50
 *              @max 150
 *          @default 100
 *      @arg duration
 *          @text 时间
 *          @desc 
 *          @type number
 *              @min 0
 *              @max 999
 *          @default 60
 * 
 *  @command actorFocus
 *      @text 角色视角
 *      @desc 
 *      @arg id
 *          @text ID
 *          @desc 0:我方全体
 *          @type number
 *              @min 0
 *              @max 999
 *          @default 1
 *      @arg scale
 *          @text 放大率
 *          @desc 100:等倍
 *          @type number
 *              @min 50
 *              @max 150
 *          @default 100
 *      @arg duration
 *          @text 时间
 *          @desc 
 *          @type number
 *              @min 0
 *              @max 999
 *          @default 60
 * 
 *  @command moveHome
 *      @text 恢复视角
 *      @desc 
 *      @arg duration
 *          @text 时间
 *          @desc 
 *          @type number
 *              @min 0
 *              @max 999
 *          @default 60
 * 
 * 
 *  @param Battleback Scale
 *      @text 战斗背景 放大率
 *      @desc 仅在能看到背景边缘的情况下，请稍微提高数值。
 *      @type number
 *          @min 1.0
 *          @max 9.9
 *          @decimals 1
 *      @default 1.3
 * 
 *  @param Drift Delay
 *      @text 移动延迟
 *      @desc 除非有需求，否则不需要更改。
 *      @type number
 *          @min 0
 *          @max 999
 *      @default 120
 * 
 *  @param Battleback2 Pivot Y Fixes
 *      @text 战斗背景2 原点Y修正
 *      @desc 如果不喜欢战斗背景原点y的位置，在这里设置。
 *      @type struct<Battleback>[]
 *      @default ["{\"Battleback2 Image\":\"Town2\",\"Pivot Y\":\"182\"}"]
 * 
 */

/*~struct~Battleback:
 *  @param Battleback2 Image
 *      @text 战斗背景2 图片
 *      @desc 
 *      @type file
 *          @require 1
 *          @dir img/battlebacks2
 *      @default 
 *
 *  @param Pivot Y
 *      @text 原点Y
 *      @desc 
 *      @type number
 *          @min 1
 *          @max 9999
 *      @default 256
 *
 */

/**
 * ▼ プラグイン製作者さん向け - 疑似3D表示への対応方法
 *  - Spriteset_Battle の this._effectsContainer.children に入っている
 *    スプライト系オブジェクトは、自動的に3D表示にします。
 * 
 *  〇 変数 _pseudo3dType
 *   - スプライトの _pseudo3dType という変数を使用することで、
 *     以下のように表示方法を指定することができます。
 *       'obj'   : 2D表示時の x, y をもとに、3D用の x, y, scale が設定されます。
 *                 本プラグインでは Sprite_Battler がこの設定になっています。
 *       'excl'  : 3D表示に対応しません。
 *       上記以外 : 2D表示時の x, y をもとに、3D用の x, y が設定されます。
 *                 Sprite_Damage のように拡大率を変更しない表示物用の設定です。
 * 
 *  〇 メソッド pseudo3dAltitude
 *   - スプライトに pseudo3dAltitude というメソッドが定義されている場合、
 *     その返り値が地面からの高さ（高度）として計算されます。
 *   - 本プラグインでは Sprite_Battler がこのメソッドを使用しています。
 * 
 */

(() => {
    'use strict';
    
    const pluginName = 'MPP_Pseudo3DBattle';
    
    // Plugin Parameters
    const parameters = PluginManager.parameters(pluginName);
    const reviverParse = function(key, value) {
        try {
            return JSON.parse(value, reviverParse);
        } catch (e) {
            return value;
        }
    };
    const param_BattlebackScale = Number(parameters['Battleback Scale'] || 1.3);
    const param_DriftDelay = Number(parameters['Drift Delay'] || 0);
    const param_Battleback2PivotYFixes = JSON.parse(parameters['Battleback2 Pivot Y Fixes'] || '[]', reviverParse);
    
    // プラグインの導入順によって起こる競合を回避するための関数
    const __base = (obj, prop) => {
        if (obj.hasOwnProperty(prop)) {
            return obj[prop];
        } else {
            const proto = Object.getPrototypeOf(obj);
            return function () { return proto[prop].apply(this, arguments); };
        }
    };

    //-------------------------------------------------------------------------
    // Pseudo3DBattle
    //
    // 疑似3Dの動作を管理する静的クラスです。
    // 現在の仕様では外部プラグインからの上書き、及び再定義はできません。
    // BattleManager から最低限のメソッドにアクセスできます。

    function Pseudo3DBattle() {
        throw new Error('This is a static class');
    }

    Pseudo3DBattle._sideViewDriftBase = { x:20, y:8, altitude:16, skew:0.2 };
    Pseudo3DBattle._sideViewMoveMethods = {
        // ここのメソッドは Pseudo3DBattle を this として呼び出します。
        setup() {
            return { altitude: 50, scale: 0.7 };
        },
        startBattle() {
            return { duration: 150 };
        },
        home(duration = 60) {
            return { duration, type: 'Slow start and end' };
        },
        inputting(user) {
            const pos = this.targets2dPosition([user]);
            return {
                x: this.bringInsideX(pos.x),
                y: pos.y,
                altitude: -15,
                scale: 1.1,
                duration: 40
            };
        },
        targeting(targets) {
            const pos = this.targets2dPosition(targets);
            if (!pos) return null;
            return {
                x: this.bringInsideXByRate(pos.x, 0.4),
                y: this.bringInsideYByRate(pos.y, 0.4),
                altitude: targets.length > 1 ? 10 : -10,
                scale: targets.length > 1 ? 1 : 1.1,
                duration: this.isAction() ? 12 : 30
            };
        },
        endTargeting() {
            return { duration: this.isAction() ? 12 : 30 };
        },
        showAnimation(targets) {
            const pos = this.targets2dPosition(targets);
            if (!pos) return null;
            return {
                x: this.bringInsideXByRate(pos.x, 0.3),
                y: this.bringInsideYByRate(pos.y, 0.3),
                altitude: -20,
                scale: targets.length > 1 ? 1.05 : 1.1,
                duration: 16
            };
        },
        damage(target) {
            const pos = this.targets2dPosition([target]);
            return {
                x: this.bringInsideXByRate(pos.x, 0.3),
                y: this.bringInsideYByRate(pos.y, 0.3),
                altitude: -20,
                scale: 1.1,
                duration: 30,
                type: 'Slow start and end'
            };
        },
        collapse(target) {
            const pos = this.targets2dPosition([target]);
            return {
                x: this.bringInsideXByRate(pos.x, 0.4),
                y: this.bringInsideYByRate(pos.y, 0.4),
                altitude: -20,
                scale: 1.13,
                duration: 12
            };
        },
        endAction(duration = 45) {
            return { duration, type: 'Slow start and end' };
        },
        driftOn() {
            return {}; // can only be used with 'isWait'
        },
        driftOff() {
            return {}; // can only be used with 'isWait'
        },
        victory() {
            const pos = this.targets2dPosition($gameParty.members());
            if (!pos) return {};
            return {
                x: this.bringInsideX(pos.x),
                y: pos.y,
                altitude: -10,
                scale: 1.15,
                skew: pos.x < this.centerX() ? -0.12 : 0.12,
                duration: 90,
                isWait: true,
                type: 'Slow start and end'
            };
        },
        escape() {
            return {
                x: this.centerX(),
                y: this.centerY(),
                altitude: 50,
                scale: 0.87,
                duration: 120
            };
        },
        defeat() {
            return {
                x: this.centerX(),
                y: this.centerY(),
                altitude: 40,
                scale: 0.8,
                duration: 240,
                isWait: true
            };
        },
        focus(targets, scale, duration) {
            const pos = this.targets2dPosition(targets);
            if (!pos) return null;
            return {
                x: this.bringInsideXByRate(pos.x, 0.4),
                y: this.bringInsideYByRate(pos.y, 0.4),
                altitude: -10,
                scale,
                duration
            };
        },
        startAction: null
    };
    Pseudo3DBattle._frontViewDriftBase = { x:12, y:8, altitude:16, skew:0.1 };
    Pseudo3DBattle._frontViewMoveMethods = {
        // ここのメソッドは Pseudo3DBattle を this として呼び出します。
        setup() {
            return { y: this.centerY() + 32, altitude: -15, scale: 0.8 };
        },
        startBattle() {
            return { duration: 120 };
        },
        home(duration = 60) {
            return { duration, type: 'Slow start and end' };
        },
        showAnimation(targets) {
            if (targets.length === 0 || targets[0].isActor()) {
                return null;
            }
            const pos = this.targets2dPosition(targets);
            return {
                x: this.bringInsideXByRate(pos.x, 0.5),
                y: this.bringInsideYByRate(pos.y, 0.1),
                altitude: -5,
                scale: 1.03,
                duration: 30
            };
        },
        endAction(duration = 45) {
            return { duration, type: 'Slow start and end' };
        },
        driftOn() {
            return {}; // can only be used with 'isWait'
        },
        driftOff() {
            return {}; // can only be used with 'isWait'
        },
        victory() {
            return {
                altitude: -15,
                duration: 150,
                isWait: true,
                type: 'Slow start and end'
            };
        },
        escape() {
            return {
                x: this.centerX(),
                y: this.centerY() + 8,
                altitude: -5,
                scale: 0.95,
                duration: 60,
                type: 'Slow start and end' 
            };
        },
        focus(targets, scale, duration) {
            const pos = this.targets2dPosition(targets);
            if (!pos) return null;
            return {
                x: this.bringInsideXByRate(pos.x, 0.4),
                y: this.bringInsideYByRate(pos.y, 0.1),
                altitude: -10,
                scale,
                duration
            };
        },
        startAction: null
    };
    Pseudo3DBattle._waitMoveMethodNames = [
        'startBattle', 'home', 'inputting'
    ];
    
    Object.defineProperties(Pseudo3DBattle, {
        moveMethods: {
            get() {
                if ($gameSystem.isSideView()) {
                    return this._sideViewMoveMethods;
                } else {
                    return this._frontViewMoveMethods;
                }
            },
            configurable: true
        },
        driftBase: {
            get() {
                if ($gameSystem.isSideView()) {
                    return this._sideViewDriftBase;
                } else {
                    return this._frontViewDriftBase;
                }
            },
            configurable: true
        }
    });

    Pseudo3DBattle.initMembers = function() {
        this._centerX = Graphics.boxWidth / 2;
        this._centerY = Graphics.boxHeight / 2 + 32;
        this._homeMoveParams = {
            x: this._centerX,
            y: this._centerY,
            altitude: 0,
            scale: 1.0,
            skew: 0,
            duration: 50,
            type: 'Slow end'
        };
        this.clearBaseStatus();
        this.clearMoveCommands();
        this.clearMoveParams();
        this.clearDriftParams();
    };

    Pseudo3DBattle.clearBaseStatus = function() {
        this._baseDisplayX = this._centerX;
        this._baseDisplayY = this._centerY;
        this._baseAltitude = 0;
        this._baseScale = 1.0;
        this._baseSkew = 0;
    };
    
    Pseudo3DBattle.clearMoveCommands = function() {
        this._commands = [];
    };
    
    Pseudo3DBattle.clearMoveParams = function() {
        this._targetingMoveParams = null;
        this._actionMoveParams = null;
        this._waitMoveParams = {};
        this._moveEasing = new Easing();
    };
    
    Pseudo3DBattle.clearDriftParams = function() {
        const type = 'Slow start and end';
        const delay = param_DriftDelay;
        this._drift = Object.assign( ...Object.keys(this.driftBase).map(
            key => ({ [key]:new EasingValue(type, delay) } )
        ) );
        this._isDrift = true;
    };
    
    Pseudo3DBattle.onBattleStart = function() {
        this.clearBaseStatus();
        this.clearMoveCommands();
        this.clearMoveParams();
        this.clearDriftParams();
    };
    
    Pseudo3DBattle.driftOn = function() {
        if (!this._isDrift) {
            this._isDrift = true;
            this.refreahDrift();
        }
    };
    
    Pseudo3DBattle.driftOff = function() {
        if (this._isDrift) {
            this._isDrift = false;
            this.refreahDrift();
        }
    };
    
    Pseudo3DBattle.refreahDrift = function() {
        for (const [key, easing] of Object.entries(this._drift)) {
            this.setupDriftParams(key, easing)
        }
    };
    
    Pseudo3DBattle.isAction = function() {
        return !!this._actionMoveParams;
    };
    
    Pseudo3DBattle.isTargeting = function() {
        return !!this._targetingMoveParams;
    };
    
    Pseudo3DBattle.centerX = function() {
        return this._centerX;
    };
    
    Pseudo3DBattle.centerY = function() {
        return this._centerY;
    };
    
    Pseudo3DBattle.displayX = function() {
        return this._baseDisplayX + this._drift.x.current;
    };
    
    Pseudo3DBattle.displayY = function() {
        return this._baseDisplayY + this._drift.y.current;
    };
    
    Pseudo3DBattle.altitude = function() {
        return this._baseAltitude + this._drift.altitude.current;
    };
    
    Pseudo3DBattle.scaleX = function() {
        return this._baseScale;
    };

    Pseudo3DBattle.scaleY = function() {
        return (this._baseScale + this.altitude() / 100) / Math.cos(this.skew());
    };

    Pseudo3DBattle.skew = function() {
        const baseSkew = this._baseSkew + this._drift.skew.current;
        const deffXSkew = $gameSystem.isSideView()
            ? (this._centerX - this.displayX()) / 1000
            : (this.displayX() - this._centerX) / 1500;
        return Math.max(Math.min(baseSkew + deffXSkew, 1), -1);
    };

    Pseudo3DBattle.adjustPosition = function(x, y) {
        const displayX = this.displayX();
        const displayY = this.displayY();
        const scaleX = this.scaleX();
        const scaleY = this.scaleY();
        const radian = this.skew();
        const dy = (y - displayY) * scaleY;
        const sx = dy * Math.sin(radian);
        const sy = dy * Math.cos(radian) - dy;
        return {
            x: (x - displayX) * scaleX + this._centerX + sx,
            y: (y - displayY) * scaleY + this._centerY + sy,
            scale: scaleX + (y - displayY) / 1600
        };
    };

    Pseudo3DBattle.targets2dPosition = function(targets) {
        const sprites = BattleManager._spriteset.makeTargetSprites(targets);
        return this.targetSprites2dPosition(sprites);
    };
    
    Pseudo3DBattle.targetSprites2dPosition = function(targetSprites) {
        if (targetSprites.length === 0) {
            return null;
        }
        const pos = targetSprites.reduce((pos, target) => {
            pos.x += target.targetGroundX();
            pos.y += target.targetGroundY();
            return pos;
        }, new Point());
        pos.x /= targetSprites.length;
        pos.y /= targetSprites.length;
        return pos;
    };
    
    Pseudo3DBattle.bringInsideX = function(x) {
        return x + 64 * (x < this._centerX ? 1 : -1);
    };
    
    Pseudo3DBattle.bringInsideXByRate = function(x, rate) {
        return (x - this._centerX) * rate + this._centerX;
    };
    
    Pseudo3DBattle.bringInsideYByRate = function(y, rate) {
        return (y - this._centerY) * rate + this._centerY;
    };
    
    Pseudo3DBattle.moveTo = function(params) {
        const realParams = { ...this._homeMoveParams, ...params };
        this._baseDisplayX = realParams.x;
        this._baseDisplayY = realParams.y;
        this._baseAltitude = realParams.altitude;
        this._baseScale = realParams.scale;
        this._baseSkew = realParams.skew;
        this._moveEasing.clear();
    };

    Pseudo3DBattle.moveForTargeting = function(params) {
        const realParams = { ...this._homeMoveParams, ...params };
        const easing = this._moveEasing;
        this._targetingMoveParams = realParams;
        easing.setType(realParams.type);
        easing.setDuration(realParams.duration);
        if (!easing.isMoving()) {
            this.moveTo(realParams);
        }
    };

    Pseudo3DBattle.endTargeting = function(params) {
        if (this.isTargeting()) {
            this._targetingMoveParams = null;
            const realParams = { ...this.currentParams(), ...params };
            if (this.isAction()) {
                this.moveForAction(realParams);
            } else {
                this._waitMoveParams = {};
                this.moveForWait(realParams);
            }
        }
    };

    Pseudo3DBattle.moveForAction = function(params) {
        const realParams = { ...this._homeMoveParams, ...params };
        this._actionMoveParams = realParams;
        if (!this.isTargeting()) {
            const easing = this._moveEasing;
            easing.setType(realParams.type);
            easing.setDuration(realParams.duration);
            if (!easing.isMoving()) {
                this.moveTo(realParams);
            }
        }
    };

    Pseudo3DBattle.endAction = function(params) {
        if (this.isAction()) {
            this._actionMoveParams = null;
            if (!this.isTargeting()) {
                const realParams = { ...this._waitMoveParams, ...params };
                this._waitMoveParams = {};
                this.moveForWait(realParams);
            }
        }
    };

    Pseudo3DBattle.moveForWait = function(params) {
        const realParams = { ...this._homeMoveParams, ...params };
        if (this.differentWaitParams(realParams)) {
            this._waitMoveParams = realParams;
            if (!this.isAction() && !this.isTargeting()) {
                const easing = this._moveEasing;
                easing.setType(realParams.type);
                easing.setDuration(realParams.duration);
                if (!easing.isMoving()) {
                    this.moveTo(realParams);
                }
            }
        }
    };

    Pseudo3DBattle.differentWaitParams = function(params) {
        return ['x', 'y', 'altitude', 'scale', 'skew'].some(
            prop => this._waitMoveParams[prop] !== params[prop]
        );
    };

    Pseudo3DBattle.update = function() {
        this.updateMove();
        this.updateDrift();
    };
    
    Pseudo3DBattle.updateMove = function() {
        if (this._moveEasing.isMoving()) {
            this.updatePosition(this.currentParams());
            this._moveEasing.update();
        }
    };
    
    Pseudo3DBattle.currentParams = function() {
        return (
            this._targetingMoveParams ||
            this._actionMoveParams ||
            this._waitMoveParams
        );
    };

    Pseudo3DBattle.updatePosition = function(params) {
        const { x, y, altitude, scale, skew } = params;
        const easing = this._moveEasing;
        this._baseDisplayX = easing.apply(this._baseDisplayX, x);
        this._baseDisplayY = easing.apply(this._baseDisplayY, y);
        this._baseAltitude = easing.apply(this._baseAltitude, altitude);
        this._baseScale = easing.apply(this._baseScale, scale);
        this._baseSkew = easing.apply(this._baseSkew, skew);
    };
    
    Pseudo3DBattle.updateDrift = function() {
        for (const [key, easing] of Object.entries(this._drift)) {
            easing.update();
            if (!easing.isMoving()) {
                this.setupDriftParams(key, easing);
            }
        }
    };
    
    Pseudo3DBattle.setupDriftParams = function(key, easing) {
        easing.setTarget(this.driftTarget(key) * (Math.random() - 0.5));
        easing.setDuration(100 + Math.floor(100 * Math.random()));
    };
    
    Pseudo3DBattle.driftTarget = function(key) {
        const value = this._isDrift ? this.driftBase[key] || 0 : 0;
        return value / (this.isAction() ? 2 : 1);
    };
    
    Pseudo3DBattle.addCommand = function(methodName, args) {
        const func = this.moveMethods[methodName];
        if (typeof func === 'function') {
            const callback = func.bind(this, ...args);
            this._commands.push({ methodName, callback });
        }
    };
    
    Pseudo3DBattle.executeCommands = function() {
        while (this._commands.length > 0) {
            const { methodName, callback } = this._commands[0];
            const params = callback();
            if (params) {
                if (params.isWait && this._moveEasing.isMoving()) {
                    return;
                }
                this.applyMoveParams(methodName, params);
            }
            this._commands.shift();
        }
    };
    
    Pseudo3DBattle.applyMoveParams = function(methodName, params) {
        switch (methodName) {
            case 'setup':
                return this.moveTo(params);
            case 'targeting':
                return this.moveForTargeting(params);
            case 'endTargeting':
                return this.endTargeting(params);
            case 'driftOn':
                return this.driftOn();
            case 'driftOff':
                return this.driftOff();
            case 'endAction':
                return this.endAction(params);
            default:
                if (this._waitMoveMethodNames.includes(methodName)) {
                    return this.moveForWait(params);
                } else {
                    return this.moveForAction(params);
                }
        }
    };

    //-------------------------------------------------------------------------
    // Easing

    class Easing {
        constructor(type = '', duration = 0) {
            this.setType(type);
            this.setDuration(duration);
        }
        setType(type) {
            this._type = type || 'Slow end';
        }
        setDuration(duration) {
            this._duration = duration;
            this._wholeDuration = duration;
        }
        clear() {
            this._duration = 0;
        }
        isMoving() {
            return this._duration > 0;
        }
        update() {
            if (this._duration > 0) {
                this._duration--;
            }
        }
        apply(current, target) {
            const d = this._duration;
            const wd = this._wholeDuration;
            const lt = this.calc((wd - d) / wd);
            const t = this.calc((wd - d + 1) / wd);
            const start = (current - target * lt) / (1 - lt);
            return start + (target - start) * t;
        }
        calc(t) {
            switch (this._type) {
                case 'Slow start':
                    return this.easeIn(t);
                case 'Slow end':
                    return this.easeOut(t);
                case 'Slow start and end':
                    return this.easeInOut(t);
                default:
                    return t;
            }
        }
        easeIn(t) {
            return Math.pow(t, 2);
        }
        easeOut(t) {
            return 1 - Math.pow(1 - t, 2);
        }
        easeInOut(t) {
            if (t < 0.5) {
                return this.easeIn(t * 2) / 2;
            } else {
                return this.easeOut(t * 2 - 1) / 2 + 0.5;
            }
        }
    };

    //-------------------------------------------------------------------------
    // EasingValue

    class EasingValue extends Easing {
        constructor(type = '', duration = 0) {
            super(type, duration);
            this._value = 0;
            this._targetValue = 0;
        }
        get current() {
            return this._value;
        }
        setTarget(target) {
            this._targetValue = target;
        }
        update() {
            this._value = this.apply(this._value, this._targetValue);
            super.update();
        }
    };

    //-------------------------------------------------------------------------
    // BattleManager

    BattleManager.callPseudo3dMethod = function(methodName, ...args) {
        // 戦闘キャラの移動が Sprite_Battler クラスで行われている都合上、
        // Spriteset_Battle.prototype.update で実行します。
        Pseudo3DBattle.addCommand(methodName, args);
    };
    
    /**
     * 別プラグインから視点操作を行うためのメソッドです。
     * @param {string} methodName - メソッド名。
     * @param {function} func - 移動先のパラメータを入れた連想配列を返す関数。
     *     この関数は Pseudo3DBattle を this として呼び出されます。
     *     設定可能なパラメータ。
     *         [x] : 移動先のX座標。(デフォルト戦闘時の画面座標)
     *         [y] : 移動先のY座標。(同上)
     *         [altitude] : 視点の高さ。0がデフォルト。-50～50を推奨。
     *         [scale] : 拡大率。1.0がデフォルト。小さくしすぎると背景の端が見える可能性あり。
     *         [skew] : 傾き。-1.0～1.0で指定。
     *         [duration] : 時間。(フレーム数)
     *         [isWait] : true で前の移動が終わってから実行。
     *         [type] : イージングタイプ。(ピクチャにあるものと同じ)
     *             'Constant speed' : 一定速度。
     *             'Slow start' : ゆっくり始まる。
     *             'Slow end' : ゆっくり終わる。(デフォルト)
     *             'Slow start and end' : ゆっくり始まってゆっくり終わる。
     * @param {boolean} [wait=false] - ウェイトメソッドフラグ。
     */
    BattleManager.registerPseudo3dMethod = function(methodName, func, wait = false) {
        Pseudo3DBattle.moveMethods[methodName] = func;
        if (wait) {
            Pseudo3DBattle._waitMoveMethodNames.push(methodName);
        }
    };
    
    /**
     * ドリフト(画面の揺れ)幅を設定します。
     * @param {string} paramName - パラメータ名。'x','y','altitude','skew' で指定。
     * @param {number} value - パラメータの値。
     */
    BattleManager.setPseudo3dDriftParam = function(paramName, value) {
        if (paramName in Pseudo3DBattle.driftBase) {
            Pseudo3DBattle.driftBase[paramName] = value;
        }
    };
    
    const _BattleManager_updateEventMain = BattleManager.updateEventMain;
    BattleManager.updateEventMain = function() {
        const lastEventRunning = $gameTroop.isEventRunning();
        const result = _BattleManager_updateEventMain.apply(this, arguments);
        if (lastEventRunning && !result) {
            this.callPseudo3dMethod('endAction');
        }
        return result;
    };
    
    const _BattleManager_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function() {
        _BattleManager_startBattle.apply(this, arguments);
        Pseudo3DBattle.onBattleStart();
        this.callPseudo3dMethod('setup');
        this.callPseudo3dMethod('startBattle');
    };
    
    const _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        _BattleManager_startAction.apply(this, arguments);
        this.callPseudo3dMethod('startAction', this._subject);
    };
    
    const _BattleManager_endBattlerActions = BattleManager.endBattlerActions;
    BattleManager.endBattlerActions = function(battler) {
        _BattleManager_endBattlerActions.apply(this, arguments);
        if (!$gameTemp.isCommonEventReserved() && !$gameTroop.isEventRunning()) {
            this.callPseudo3dMethod('endAction');
        }
    };
    
    const _BattleManager_processVictory = BattleManager.processVictory;
    BattleManager.processVictory = function() {
        _BattleManager_processVictory.apply(this, arguments);
        this.callPseudo3dMethod('victory');
        if (!$gameSystem.isSideView()) {
            this.callPseudo3dMethod('driftOff');
        }
    };
    
    const _BattleManager_processEscape = BattleManager.processEscape;
    BattleManager.processEscape = function() {
        const success = _BattleManager_processEscape.apply(this, arguments);
        this.callPseudo3dMethod('escape');
        return success;
    };
    
    const _BattleManager_processDefeat = BattleManager.processDefeat;
    BattleManager.processDefeat = function() {
        _BattleManager_processDefeat.apply(this, arguments);
        this.callPseudo3dMethod('defeat');
        this.callPseudo3dMethod('driftOff');
    };
    
    //-------------------------------------------------------------------------
    // Sprite_Battler

    const _Sprite_Battler_initMembers = Sprite_Battler.prototype.initMembers;
    Sprite_Battler.prototype.initMembers = function() {
        _Sprite_Battler_initMembers.apply(this, arguments);
        this._pseudo3dType = 'obj';
    };
    
    Sprite_Battler.prototype.pseudo3dAltitude = function() {
        return this._homeY + this._offsetY - this.y;
    };
    
    Sprite_Battler.prototype.targetGroundX = function() {
        return this._homeX + (this._targetOffsetX || 0);
    };
    
    Sprite_Battler.prototype.targetGroundY = function() {
        return this._homeY + (this._targetOffsetY || 0);
    };
    
    //-------------------------------------------------------------------------
    // Sprite_Enemy

    Sprite_Enemy.prototype.targetGroundY = function() {
        const groundY = Sprite_Battler.prototype.targetGroundY.call(this);
        return groundY - this.height / 8;
    };
    
    Sprite_Enemy.prototype.pseudo3dAltitude = function() {
        const altitude = Sprite_Battler.prototype.pseudo3dAltitude.call(this);
        return altitude - this.height / 20;
    };
    
    //-------------------------------------------------------------------------
    // Sprite_Animation

    const _Sprite_Animation_updateEffectGeometry = Sprite_Animation.prototype.updateEffectGeometry;
    Sprite_Animation.prototype.updateEffectGeometry = function() {
        _Sprite_Animation_updateEffectGeometry.apply(this, arguments);
        if (this._handle && $gameParty.inBattle()) {
            const scale = this._animation.scale / 100 * this.pseudo3dTargetsScale();
            this._handle.setScale(scale, scale, scale);
        }
    };
    
    Sprite_Animation.prototype.pseudo3dTargetsScale = function() {
        if (this._animation.displayType === 2) {
            return 1;
        }
        const pos = Pseudo3DBattle.targetSprites2dPosition(this._targets);
        return pos ? Pseudo3DBattle.adjustPosition(pos.x, pos.y).scale : 1;
    };
    
    //-------------------------------------------------------------------------
    // Sprite_AnimationMV
    
    const _Sprite_AnimationMV_setup = Sprite_AnimationMV.prototype.setup;
    Sprite_AnimationMV.prototype.setup = function(t, a, m, d) {
        _Sprite_AnimationMV_setup.apply(this, arguments);
        this._pseudo3dType = this._animation.position === 3 ? 'excl' : 'obj';
    };
    
    Sprite_AnimationMV.prototype.pseudo3dAltitude = function() {
        if (this._targets.length > 0) {
            const target = this._targets[0];
            if (this._animation.position === 0) {
                return target.height;
            } else if (this._animation.position === 1) {
                return target.height / 2;
            }
        }
        return 0;
    };
    
    //-------------------------------------------------------------------------
    // ImageManager

    ImageManager.battlebackWidth = 1000;
    ImageManager.battlebackHeight = 740;

    //-------------------------------------------------------------------------
    // Sprite_Battleback

    const _Sprite_Battleback_initialize = Sprite_Battleback.prototype.initialize;
    Sprite_Battleback.prototype.initialize = function(type) {
        _Sprite_Battleback_initialize.apply(this, arguments);
        this._isPseudo3dGround = false;
        this._homeX = 0;
        this._homeY = 0;
        this._effectsOffsetX = 0;
        this._effectsOffsetY = 0;
    };
    
    const _Sprite_Battleback_adjustPosition = Sprite_Battleback.prototype.adjustPosition;
    Sprite_Battleback.prototype.adjustPosition = function() {
        _Sprite_Battleback_adjustPosition.apply(this, arguments);
        this.width = ImageManager.battlebackWidth;
        this.height = ImageManager.battlebackHeight;
    };
    
    Sprite_Battleback.prototype.setEffectsOffset = function(x, y) {
        this._effectsOffsetX = x;
        this._effectsOffsetY = y;
    };
    
    Sprite_Battleback.prototype.setupPseudo3dPosition = function(pivotY) {
        this._homeX = Graphics.width / 2;
        if ($gameSystem.isSideView()) {
            this._homeY = Graphics.height - this.height + pivotY;
        } else {
            this._homeY = pivotY;
        }
        this.anchor.x = 0.5;
        this.anchor.y = pivotY / this.height;
    };
    
    Sprite_Battleback.prototype.applyPseudo3dPlacement = function() {
        // 拡大率の計算式は正確なものではありません。
        const groundX = this._homeX - this._effectsOffsetX;
        const groundY = this._homeY - this._effectsOffsetY;
        const pos3d = Pseudo3DBattle.adjustPosition(groundX, groundY);
        this.x = pos3d.x + this._effectsOffsetX;
        this.y = pos3d.y + this._effectsOffsetY;
        const scale = this.minScreenRatio() * param_BattlebackScale;
        if (this._isPseudo3dGround) {
            this.scale.x = Pseudo3DBattle.scaleX() * scale;
            this.scale.y = Pseudo3DBattle.scaleY() * scale;
            this.skew.x = Pseudo3DBattle.skew();
        } else {
            this.scale.x = Pseudo3DBattle.scaleX() * scale;
            this.scale.y = Pseudo3DBattle.scaleX() * scale;
        }
    };

    Sprite_Battleback.prototype.minScreenRatio = function() {
        const { battlebackWidth:bw, battlebackHeight:bh } = ImageManager;
        const ratioX = (Graphics.width + bw - 816) / bw;
        const ratioY = (Graphics.height + bh - 624) / bh;
        return Math.max(ratioX, ratioY, 1.0);
    };

    //-------------------------------------------------------------------------
    // Sprite_StateIcon

    const _Sprite_StateIcon_updateIcon = Sprite_StateIcon.prototype.updateIcon;
    Sprite_StateIcon.prototype.updateIcon = function() {
        _Sprite_StateIcon_updateIcon.apply(this, arguments);
        this.updateVisibility();
    };
    
    const _Sprite_StateIcon_updateVisibility = __base(Sprite_StateIcon.prototype, 'updateVisibility');
    Sprite_StateIcon.prototype.updateVisibility = function() {
        _Sprite_StateIcon_updateVisibility.apply(this, arguments);
        this.visible = this.visible && this._iconIndex > 0;
    };
    
    //-------------------------------------------------------------------------
    // Spriteset_Battle

    const _Spriteset_Battle_initialize = Spriteset_Battle.prototype.initialize;
    Spriteset_Battle.prototype.initialize = function() {
        _Spriteset_Battle_initialize.apply(this, arguments);
        this._sprite2dPlacements = new WeakMap();
    };
    
    const _Spriteset_Battle_createBattleback = Spriteset_Battle.prototype.createBattleback;
    Spriteset_Battle.prototype.createBattleback = function() {
        _Spriteset_Battle_createBattleback.apply(this, arguments);
        this._back1Sprite._isPseudo3dGround = true;
        if (this._back1Sprite.battleback1Name() !== '') {
            this._backgroundSprite.visible = false; // Just weight reduction
        }
        if (this.fixBattlebackPivotY() > 0) {
            const index = this._baseSprite.children.indexOf(this._back1Sprite);
            this._back1FixSprite = new Sprite_Battleback(0);
            this._baseSprite.addChildAt(this._back1FixSprite, index + 1);
        }
    };
    
    const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        this.restoreSprite2dPlacements();
        _Spriteset_Battle_update.apply(this, arguments);
        this.applyPseudo3dPlacements();
        Pseudo3DBattle.executeCommands();
    };
    
    /**
     * 競合対策として、位置とサイズを2Dの状態に戻す。
     */
    Spriteset_Battle.prototype.restoreSprite2dPlacements = function() {
        for (const sprite of this.pseudo3dSprites()) {
            const placement = this._sprite2dPlacements.get(sprite);
            if (placement) {
                sprite.x = placement.x;
                sprite.y = placement.y;
                sprite.scale.x = placement.scaleX;
                sprite.scale.y = placement.scaleY;
            }
        }
    };
    
    /**
     * 疑似3D表示に対応させるスプライトの配列。
     * 追加することで疑似3D表示にある程度対応させることができます。
     * 破壊してよい配列ではないことに注意してください。
     * @returns {array}
     */
    Spriteset_Battle.prototype.pseudo3dSprites = function() {
        return this._effectsContainer.children;
    };
    
    Spriteset_Battle.prototype.applyPseudo3dPlacements = function() {
        this._back1Sprite.applyPseudo3dPlacement();
        this._back2Sprite.applyPseudo3dPlacement();
        if (this._back1FixSprite) {
            this._back1FixSprite.applyPseudo3dPlacement();
        }
        for (const sprite of this.pseudo3dSprites()) {
            if (sprite._pseudo3dType !== 'excl') {
                this.saveSprite2dPlacement(sprite);
                this.convertSprite3dPlacement(sprite);
            } else {
                this._sprite2dPlacements.delete(sprite);
            }
        }
    };
    
    Spriteset_Battle.prototype.saveSprite2dPlacement = function(sprite) {
        if (!this._sprite2dPlacements.has(sprite)) {
            this._sprite2dPlacements.set(sprite, {});
        }
        const placement = this._sprite2dPlacements.get(sprite);
        placement.x = sprite.x;
        placement.y = sprite.y;
        placement.scaleX = sprite.scale.x;
        placement.scaleY = sprite.scale.y;
    };
    
    Spriteset_Battle.prototype.convertSprite3dPlacement = function(sprite) {
        const alt = sprite.pseudo3dAltitude ? sprite.pseudo3dAltitude() : 0;
        const groundX = sprite.x;
        const groundY = sprite.y + alt;
        const pos3d = Pseudo3DBattle.adjustPosition(groundX, groundY);
        sprite.x = pos3d.x;
        sprite.y = pos3d.y - alt * pos3d.scale;
        if (sprite._pseudo3dType === 'obj') {
            // sprite.mirrored is a parameter of OcRam_Battle_Core.js
            sprite.scale.x *= sprite.mirrored ? -pos3d.scale : pos3d.scale;
            sprite.scale.y *= pos3d.scale;
        }
    };
    
    const _Spriteset_Battle_updateBattleback = Spriteset_Battle.prototype.updateBattleback;
    Spriteset_Battle.prototype.updateBattleback = function() {
        const lastBattlebackLocated = this._battlebackLocated;
        _Spriteset_Battle_updateBattleback.apply(this, arguments);
        if (!lastBattlebackLocated) {
            this.setupBattlebackEffectsOffset();
            this.setupBattlebackPseudo3dPosition();
        }
    };
    
    Spriteset_Battle.prototype.setupBattlebackEffectsOffset = function() {
        const { x, y } = this._effectsContainer;
        this._back1Sprite.setEffectsOffset(x, y);
        this._back2Sprite.setEffectsOffset(x, y);
        if (this._back1FixSprite) {
            this._back1FixSprite.setEffectsOffset(x, y);
        }
    };
    
    Spriteset_Battle.prototype.setupBattlebackPseudo3dPosition = function() {
        const pivotY = this.fixBattlebackPivotY() || this.getBattlebackPivotY();
        this._back1Sprite.setupPseudo3dPosition(pivotY);
        this._back2Sprite.setupPseudo3dPosition(pivotY);
        if (this._back1FixSprite) {
            this._back1FixSprite.adjustPosition();
            this._back1FixSprite.setupPseudo3dPosition(pivotY);
            this._back1FixSprite.height = pivotY;
            this._back1FixSprite.anchor.y = 1;
        }
    };
    
    Spriteset_Battle.prototype.fixBattlebackPivotY = function() {
        const battleback2Name = this._back2Sprite.battleback2Name();
        const param = param_Battleback2PivotYFixes.find(
            param => param['Battleback2 Image'] === battleback2Name
        );
        return param ? param['Pivot Y'] || 0 : 0;
    };
    
    Spriteset_Battle.prototype.getBattlebackPivotY = function() {
        const bitmap = this._back2Sprite.bitmap;
        const x = Math.floor(bitmap.width / 2);
        const h = bitmap.height;
        const data = bitmap.context.getImageData(x, 0, 1, h).data;
        return [...Array(h).keys()].reverse().find(
            n => data[n * 4 + 3] > 192
        ) || 0;
    };
    
    //-------------------------------------------------------------------------
    // Window_BattleLog

    const _Window_BattleLog_performCollapse = Window_BattleLog.prototype.performCollapse;
    Window_BattleLog.prototype.performCollapse = function(target) {
        _Window_BattleLog_performCollapse.apply(this, arguments);
        BattleManager.callPseudo3dMethod('collapse', target);
    };
    
    const _Window_BattleLog_showAnimation = Window_BattleLog.prototype.showAnimation;
    Window_BattleLog.prototype.showAnimation = function(s, targets, a) {
        _Window_BattleLog_showAnimation.apply(this, arguments);
        const realTargets = [ ...new Set(targets) ];
        BattleManager.callPseudo3dMethod('showAnimation', realTargets);
    };
    
    const _Window_BattleLog_displayDamage = Window_BattleLog.prototype.displayDamage;
    Window_BattleLog.prototype.displayDamage = function(target) {
        _Window_BattleLog_displayDamage.apply(this, arguments);
        BattleManager.callPseudo3dMethod('damage', target);
    };
    
    //-------------------------------------------------------------------------
    // Scene_Boot

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        Pseudo3DBattle.initMembers();
    };
    
    //-------------------------------------------------------------------------
    // Scene_Battle

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        Pseudo3DBattle.update();
        _Scene_Battle_update.apply(this, arguments);
    };
    
    const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
        _Scene_Battle_terminate.apply(this, arguments);
        Pseudo3DBattle.clearMoveCommands();
    };
    
    const _Scene_Battle_hideSubInputWindows = Scene_Battle.prototype.hideSubInputWindows;
    Scene_Battle.prototype.hideSubInputWindows = function() {
        _Scene_Battle_hideSubInputWindows.apply(this, arguments);
        if (!$gameTroop.isEventRunning()) {
            BattleManager.callPseudo3dMethod('endTargeting');
            BattleManager.callPseudo3dMethod('home');
        }
    };
    
    const _Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
    Scene_Battle.prototype.startPartyCommandSelection = function() {
        _Scene_Battle_startPartyCommandSelection.apply(this, arguments);
        BattleManager.callPseudo3dMethod('home');
    };
    
    const _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
    Scene_Battle.prototype.startActorCommandSelection = function() {
        _Scene_Battle_startActorCommandSelection.apply(this, arguments);
        BattleManager.callPseudo3dMethod('inputting', BattleManager.actor());
    };
    
    const _Scene_Battle_startActorSelection = Scene_Battle.prototype.startActorSelection;
    Scene_Battle.prototype.startActorSelection = function() {
        _Scene_Battle_startActorSelection.apply(this, arguments);
        BattleManager.callPseudo3dMethod('targeting', $gameParty.members());
    };
    
    const _Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel;
    Scene_Battle.prototype.onActorCancel = function() {
        _Scene_Battle_onActorCancel.apply(this, arguments);
        BattleManager.callPseudo3dMethod('endTargeting');
    };
    
    const _Scene_Battle_startEnemySelection = Scene_Battle.prototype.startEnemySelection;
    Scene_Battle.prototype.startEnemySelection = function() {
        _Scene_Battle_startEnemySelection.apply(this, arguments);
        BattleManager.callPseudo3dMethod('targeting', $gameTroop.aliveMembers());
    };
    
    const _Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
    Scene_Battle.prototype.onEnemyCancel = function() {
        _Scene_Battle_onEnemyCancel.apply(this, arguments);
        BattleManager.callPseudo3dMethod('endTargeting');
    };
    
    //-------------------------------------------------------------------------
    // PluginManager
   
    PluginManager.registerCommand(pluginName, 'enemyFocus', function(args) {
        const index = PluginManager.mppValue(args.index);
        const scale = PluginManager.mppValue(args.scale) / 100;
        const duration = PluginManager.mppValue(args.duration);
        const targets = [];
        this.iterateBattler(0, index, battler => {
            if (battler.isAlive()) {
                targets.push(battler);
            }
        });
        BattleManager.callPseudo3dMethod('focus', targets, scale, duration);
    });

    PluginManager.registerCommand(pluginName, 'actorFocus', function(args) {
        const id = PluginManager.mppValue(args.id);
        const scale = PluginManager.mppValue(args.scale) / 100;
        const duration = PluginManager.mppValue(args.duration);
        const targets = [];
        this.iterateBattler(1, id, battler => {
            targets.push(battler);
        });
        BattleManager.callPseudo3dMethod('focus', targets, scale, duration);
    });

    PluginManager.registerCommand(pluginName, 'moveHome', args => {
        const duration = PluginManager.mppValue(args.duration);
        BattleManager.callPseudo3dMethod('endAction', duration);
    });

    PluginManager.mppValue = function(value) {
        const match = /^V\[(\d+)\]$/i.exec(value);
        return match ? $gameVariables.value(+match[1]) : +value;
    };
    
})();
