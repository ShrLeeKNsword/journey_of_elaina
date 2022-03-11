//=============================================================================
// AdjustPictureGraphical.js
// ----------------------------------------------------------------------------
// (C)2020 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2020/03/14 MV版から流用作成
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc Plugin that adjust picture to graphical
 * @author triacontane
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 *
 * @param GridSize
 * @desc View grid line
 * @default 48
 * @type number
 *
 * @param TestMapId
 * @desc Event test map id
 * @default -1
 * @type number
 * @min -1
 *
 * @help Plugin that adjust picture to graphical.
 * Drag and drop on test screen.
 * this is support plugin. No impact for game.
 * Start for Event Test(Ctrl+R)
 *
 * Caution!
 * When you set status 'on' this plugin at Plugin Manager,
 * you have to save project(Ctrl+S) before test
 *
 * This plugin is released under the MIT License.
 */
/*:ja
 * @plugindesc ピクチャのグラフィカルな位置調整プラグイン。
 * @author トリアコンタン
 * @target MZ
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 *
 * @param GridSize
 * @text グリッドサイズ
 * @desc ピクチャ調整中に指定サイズでグリッドを表示します。0を指定すると非表示になります。
 * @default 48
 * @type number
 *
 * @param TestMapId
 * @text テストマップID
 * @desc 任意のマップをイベントテストの舞台に設定できます。
 * @default -1
 * @type number
 * @min -1
 *
 * @help イベントコマンドのテスト時に、ピクチャの表示位置を
 * ドラッグ＆ドロップで微調整できます。
 * 左上のタイトルバーに選択したピクチャの座標が表示されるので
 * テスト画面を表示させつつ、ピクチャの座標を調整してください。
 * なお、イベントコマンドのテスト以外では機能しません。
 * イベントコマンドのテストは、イベントエディタからイベントコマンドを
 * 選択して右クリック→テスト（Ctrl+R）で実行できます。
 *
 * 注意！
 * プラグインマネージャーから当プラグインを有効にしたら、
 * テストを行う前に「プロジェクトの保存」（Ctrl+S）を行ってください。
 *
 * このプラグインにはプラグインコマンドはありません。
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
(() => {
    'use strict';
    // イベントテスト時以外は一切の機能を無効
    if (!DataManager.isEventTest())return;

    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

    //=============================================================================
    // Input
    //  [c]を追加定義します。
    //=============================================================================
    Input.keyMapper[67] = 'copy';

    //=============================================================================
    // DataManager
    //  テスト用マップの読み込みを追加定義します。
    //=============================================================================
    const _DataManager_setupEventTest = DataManager.setupEventTest;
    DataManager.setupEventTest = function() {
        _DataManager_setupEventTest.call(this);
        if (param.TestMapId > 0) {
            $gamePlayer.reserveTransfer(mapId, 8, 6);
        }
    };

    //=============================================================================
    // Game_Picture
    //  ピクチャを掴んだ場合に移動を中断します。
    //=============================================================================
    Game_Picture.prototype.resetMove = function(x, y) {
        this._x = x;
        this._y = y;
        this._duration = 0;
    };

    //=============================================================================
    // Game_Screen
    //  最後に選択したピクチャの座標を保存します。
    //=============================================================================
    const _Game_Screen_initialize = Game_Screen.prototype.initialize;
    Game_Screen.prototype.initialize = function() {
        _Game_Screen_initialize.call(this);
        this._lastPictureX = null;
        this._lastPictureY = null;
        this._copyCount    = 0;
        this._infoPicture  = '';
        this._infoHelp     = 'Shift:ウィンドウ表示切替 Ctrl+マウス:グリッドにスナップ Ctrl+C:座標コピー ';
        this._infoCopy     = '';
        this._documentTitle = '';
    };

    const _Game_Screen_updatePictures = Game_Screen.prototype.updatePictures;
    Game_Screen.prototype.updatePictures = function() {
        _Game_Screen_updatePictures.call(this);
        if (Utils.isNwjs() && Input.isPressed('control') && Input.isTriggered('copy')) {
            if (this._lastPictureX == null || this._lastPictureY == null) return;
            const clipboard = nw.Clipboard.get();
            let copyValue = '';
            if (this._copyCount % 2 === 0) {
                copyValue = this._lastPictureX.toString();
                this._infoCopy = ' X座標[' + copyValue + ']をコピーしました。';
            } else {
                copyValue = this._lastPictureY.toString();
                this._infoCopy = ' Y座標[' + copyValue + ']をコピーしました。';
            }
            clipboard.set(copyValue, 'text');
            this._copyCount++;
        }
        const docTitle = this._infoHelp + this._infoPicture + this._infoCopy;
        if (docTitle !== this._documentTitle) {
            document.title = docTitle;
            this._documentTitle = docTitle;
        }
    };

    //=============================================================================
    // Scene_Map
    //  テストイベント時の特別な処理
    //=============================================================================
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        if (!$gameMap.isEventRunning()) this.updateEventTest();
        _Scene_Map_update.call(this);
    };

    Scene_Map.prototype.updateEventTest = function() {
        this._spriteset.checkDragPictures();
        if (Input.isTriggered('shift')) {
            if (!this._messageWindow.isOpen()) {
                this._messageWindow.open();
            } else {
                this._messageWindow.close();
            }
        }
    };

    Scene_Map.prototype.isMapTouchOk = function() {
        return false;
    };

    //=============================================================================
    // Spriteset_Base
    //  配下のピクチャから掴んでいるものを探します。
    //=============================================================================
    Spriteset_Base.prototype.checkDragPictures = function() {
        this._pictureContainer.children.reverse().some(function(picture) {
            return picture.checkDrag && picture.checkDrag();
        }, this);
        this._pictureContainer.children.reverse();
    };

    const _Spriteset_Base_createLowerLayer = Spriteset_Base.prototype.createLowerLayer;
    Spriteset_Base.prototype.createLowerLayer = function() {
        _Spriteset_Base_createLowerLayer.call(this);
        this.createGridSprite();
    };

    Spriteset_Base.prototype.createGridSprite = function() {
        const size = param.GridSize;
        if (size === 0) {
            return;
        }
        this._gridSprite = new Sprite();
        this._gridSprite.setFrame(0, 0, this.width, this.height);
        const bitmap = new Bitmap(this.width, this.height);
        for(let x = 0; x < this.width; x += size) {
            bitmap.fillRect(x, 0, 1, this.height, 'rgba(255,255,255,1.0)');
        }
        for(let y = 0; y < this.height; y += size) {
            bitmap.fillRect(0, y, this.width, 1, 'rgba(255,255,255,1.0)');
        }
        this._gridSprite.bitmap = bitmap;
        this.addChild(this._gridSprite);
    };

    //=============================================================================
    // Sprite_Picture
    //  テストイベント時にピクチャを掴みます。
    //=============================================================================
    const _Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
    Sprite_Picture.prototype.initialize = function(pictureId) {
        _Sprite_Picture_initialize.call(this, pictureId);
        this._holding = false;
        this._dx      = 0;
        this._dy      = 0;
    };

    Sprite_Picture.prototype.checkDrag = function() {
        const picture = this.picture();
        if (picture != null) {
            if (this.updateDragMove()) {
                const result                = 'PictureNum:[' + this._pictureId + '] X:[' + this.x + '] Y:[' + this.y + ']';
                $gameScreen._lastPictureX = this.x;
                $gameScreen._lastPictureY = this.y;
                $gameScreen._infoPicture  = result;
                $gameScreen._infoCopy     = '';
                if (!this._holding) console.log(result);
                picture.resetMove(this.x, this.y);
                return true;
            }
        }
        return false;
    };

    Sprite_Picture.prototype.updateDragMove = function() {
        if (this.isTriggered() || (this._holding && TouchInput.isPressed())) {
            if (!this._holding) this.hold();
            let x = TouchInput.x - this._dx;
            let y = TouchInput.y - this._dy;
            if (Input.isPressed('control')) {
                const size = param.GridSize;
                if (size !== 0) {
                    x % size > size / 2 ? x += size - x % size : x -= x % size;
                    y % size > size / 2 ? y += size - y % size : y -= y % size;
                }
            }
            this.move(x, y);
            return true;
        } else if (this._holding) {
            this.release();
            return true;
        }
        return false;
    };

    Sprite_Picture.prototype.hold = function() {
        this._holding = true;
        this._dx      = TouchInput.x - this.x;
        this._dy      = TouchInput.y - this.y;
        this.setBlendColor([255,255,255,192]);
    };

    Sprite_Picture.prototype.release = function() {
        this._holding = false;
        this.setBlendColor([0,0,0,0]);
    };

    //=============================================================================
    // Sprite_Picture
    //  タッチ操作を可能にする共通部分
    //=============================================================================
    Sprite_Picture.prototype.screenWidth = function() {
        return (this.width || 0) * this.scale.x;
    };

    Sprite_Picture.prototype.screenHeight = function() {
        return (this.height || 0) * this.scale.y;
    };

    Sprite_Picture.prototype.screenX = function() {
        return (this.x || 0) - this.anchor.x * this.screenWidth();
    };

    Sprite_Picture.prototype.screenY = function() {
        return (this.y || 0) - this.anchor.y * this.screenHeight();
    };

    Sprite_Picture.prototype.minX = function() {
        const width = this.screenWidth();
        return Math.min(this.screenX(), this.screenX() + width);
    };

    Sprite_Picture.prototype.minY = function() {
        const height = this.screenHeight();
        return Math.min(this.screenY(), this.screenY() + height);
    };

    Sprite_Picture.prototype.maxX = function() {
        const width = this.screenWidth();
        return Math.max(this.screenX(), this.screenX() + width);
    };

    Sprite_Picture.prototype.maxY = function() {
        const height = this.screenHeight();
        return Math.max(this.screenY(), this.screenY() + height);
    };

    Sprite_Picture.prototype.isTouchPosInRect = function () {
        const dx = TouchInput.x - this.x;
        const dy = TouchInput.y - this.y;
        const sin = Math.sin(-this.rotation);
        const cos = Math.cos(-this.rotation);
        const rx = this.x + Math.floor(dx * cos + dy * -sin);
        const ry = this.y + Math.floor(dx * sin + dy * cos);
        return (rx >= this.minX() && rx <= this.maxX() &&
                ry >= this.minY() && ry <= this.maxY());
    };

    Sprite_Picture.prototype.isTouchable = function() {
        return this.bitmap != null && this.visible && this.scale.x !== 0 && this.scale.y !== 0;
    };

    Sprite_Picture.prototype.isTriggered = function() {
        return this.isTouchEvent(TouchInput.isTriggered);
    };

    Sprite_Picture.prototype.isTouchEvent = function(triggerFunc) {
        return this.isTouchable() && triggerFunc.call(TouchInput) && this.isTouchPosInRect();
    };
})();
