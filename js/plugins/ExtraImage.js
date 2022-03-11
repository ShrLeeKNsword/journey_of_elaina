//=============================================================================
// RPG Maker MZ - Extra Image Display Per Scene Plugin
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Extra Image Display Per Scene Plugin
 * @author triacontane
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url
 *
 * @param ImageList
 * @text Image List
 * @desc A list of images to be added to all screens.
 * @default []
 * @type struct<Image>[]
 *
 * @help ExtraImage.js
 *
 * Additional image displays can be used for scenes that have an optional image specified.
 * Basic information, such as coordinates, scale, origin, etc. can be configured.
 * When a control character is specified for each parameter, the value will be retreived from the specified variable.
 *
 */

/*~struct~Image:
 *
 * @param SceneName
 * @text Target Scene
 * @desc The scene to receive the extra image. When targeting an original scene, directly input the scene class name.
 * @type select
 * @default Scene_Title
 * @option Title
 * @value Scene_Title
 * @option Map
 * @value Scene_Map
 * @option Game Over
 * @value Scene_Gameover
 * @option Battle
 * @value Scene_Battle
 * @option Main Menu
 * @value Scene_Menu
 * @option Items
 * @value Scene_Item
 * @option Skills
 * @value Scene_Skill
 * @option Equipment
 * @value Scene_Equip
 * @option Status
 * @value Scene_Status
 * @option Options
 * @value Scene_Options
 * @option Save
 * @value Scene_Save
 * @option Load
 * @value Scene_Load
 * @option Game End
 * @value Scene_End
 * @option Shop
 * @value Scene_Shop
 * @option Name Input
 * @value Scene_Name
 * @option Debug
 * @value Scene_Debug
 *
 * @param FileName
 * @text File Name
 * @desc The file to display. Select from the picture folder. File extension unnecessary.
 * @default
 * @require 1
 * @dir img/pictures
 * @type file
 *
 * @param X
 * @text X coordinate
 * @desc The X coordinate.
 * @default 0
 * @type number
 * @min -9999
 *
 * @param Y
 * @text Y coordinate
 * @desc The Y coordinate.
 * @default 0
 * @type number
 * @min -9999
 *
 * @param ScaleX
 * @text Horizontal Scale
 * @desc The horizontal scale.
 * @default 100
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param ScaleY
 * @text Vertical Scale
 * @desc The vertical scale.
 * @default 100
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param Opacity
 * @text Opacity
 * @desc The opacity.
 * @default 255
 * @type number
 * @min 0
 * @max 255
 *
 * @param BlendMode
 * @text Blend Mode
 * @desc The blend mode.
 * @default 0
 * @type select
 * @option Normal
 * @value 0
 * @option Additive
 * @value 1
 * @option Multiplicative
 * @value 2
 * @option Screen
 * @value 3
 *
 * @param Origin
 * @text Origin
 * @desc The origin.
 * @default 0
 * @type select
 * @option Upper left
 * @value 0
 * @option Center
 * @value 1
 *
 * @param Priority
 * @text Priority
 * @desc The display priority for the image. "Furthest back" is often not displayed on-screen, so it is not recommended for regular use.
 * @default 0
 * @type select
 * @option Forefront
 * @value 0
 * @option Under Window
 * @value 1
 * @option Furthest Back
 * @value 2
 *
 * @param Switch
 * @text Appearance Condition Switch
 * @desc Will be displayed on screen only when the specified switch is ON. If not specified, it will always be displayed.
 * @default 0
 * @type switch
 */
/*:ja
 * @target MZ
 * @plugindesc 各シーンに追加で任意の画像を表示します。
 * @author トリアコンタン
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url
 *
 * @param ImageList
 * @text 画像リスト
 * @desc 各画面に追加する画像のリストです。
 * @default []
 * @type struct<Image>[]
 *
 * @help ExtraImage.js
 *
 * 任意の画像を指定したシーンに追加表示できます。
 * 座標や拡大率、原点など基本的な情報を指定できます。
 * 各パラメータに制御文字を指定すると指定した変数から値を取得できます。
 *
 */

/*~struct~Image:ja
 *
 * @param SceneName
 * @text 対象シーン
 * @desc 追加対象のシーンです。オリジナルのシーンを対象にする場合はシーンクラス名を直接記入します。
 * @type select
 * @default Scene_Title
 * @option タイトル
 * @value Scene_Title
 * @option マップ
 * @value Scene_Map
 * @option ゲームオーバー
 * @value Scene_Gameover
 * @option バトル
 * @value Scene_Battle
 * @option メインメニュー
 * @value Scene_Menu
 * @option アイテム
 * @value Scene_Item
 * @option スキル
 * @value Scene_Skill
 * @option 装備
 * @value Scene_Equip
 * @option ステータス
 * @value Scene_Status
 * @option オプション
 * @value Scene_Options
 * @option セーブ
 * @value Scene_Save
 * @option ロード
 * @value Scene_Load
 * @option ゲーム終了
 * @value Scene_End
 * @option ショップ
 * @value Scene_Shop
 * @option 名前入力
 * @value Scene_Name
 * @option デバッグ
 * @value Scene_Debug
 *
 * @param FileName
 * @text ファイル名
 * @desc 表示するファイルです。ピクチャフォルダから選択します。拡張子不要。
 * @default
 * @require 1
 * @dir img/pictures
 * @type file
 *
 * @param X
 * @text X座標
 * @desc X座標です。
 * @default 0
 * @type number
 * @min -9999
 *
 * @param Y
 * @text Y座標
 * @desc Y座標です。
 * @default 0
 * @type number
 * @min -9999
 *
 * @param ScaleX
 * @text 横方向拡大率
 * @desc 横方向の拡大率です。
 * @default 100
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param ScaleY
 * @text 縦方向拡大率
 * @desc 縦方向の拡大率です。
 * @default 100
 * @type number
 * @min -2000
 * @max 2000
 *
 * @param Opacity
 * @text 不透明度
 * @desc 不透明度です。
 * @default 255
 * @type number
 * @min 0
 * @max 255
 *
 * @param BlendMode
 * @text 合成方法
 * @desc 合成方法です。
 * @default 0
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 乗算
 * @value 2
 * @option スクリーン
 * @value 3
 *
 * @param Origin
 * @text 原点
 * @desc 原点です。
 * @default 0
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 *
 * @param Priority
 * @text 優先度
 * @desc 画像の表示優先度です。最背面は画面上に表示されないことが多いので通常の使用では推奨しません。
 * @default 0
 * @type select
 * @option 最前面
 * @value 0
 * @option ウィンドウの下
 * @value 1
 * @option 最背面
 * @value 2
 *
 * @param Switch
 * @text 出現条件スイッチ
 * @desc 指定したスイッチがONのときのみ表示されます。指定しない場合、常に表示されます。
 * @default 0
 * @type switch
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);

    const _Scene_Base_create    = Scene_Base.prototype.create;
    Scene_Base.prototype.create = function() {
        _Scene_Base_create.apply(this, arguments);
        this._extraImages = this.findExtraImageList().map(imageData => {
            return new Sprite_SceneExtra(imageData);
        });
    };

    const _Scene_Base_start    = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.apply(this, arguments);
        this._extraImages.forEach(extraImage => {
            this.addChild(extraImage);
        });
    };

    Scene_Base.prototype.findExtraImageList = function() {
        const currentSceneName = PluginManagerEx.findClassName(this);
        return (param.ImageList || []).filter(function(data) {
            return data.SceneName === currentSceneName;
        }, this);
    };

    /**
     * SpriteSceneApng
     * Extra APNG sprite displayed in the scene.
     */
    class Sprite_SceneExtra extends Sprite {
        constructor(imageData) {
            super();
            this._data = imageData;
            this.update();
        }

        update() {
            this.updateBitmap();
            this.updatePosition();
            this.updateScale();
            this.updateOpacity();
            this.updateOther();
        }

        updateBitmap() {
            this.bitmap = ImageManager.loadPicture(this._data.FileName);
        }

        updatePosition() {
            this.x = this._data.X;
            this.y = this._data.Y;
        }

        updateOpacity() {
            this.opacity = this._data.Opacity;
        }

        updateScale() {
            this.scale.x = this._data.ScaleX / 100;
            this.scale.y = this._data.ScaleY / 100;
        }

        updateOther() {
            this.visible = this.isValid();
            this.blendMode = this._data.BlendMode;
        }

        isValid() {
            const switchId = this._data.Switch;
            return !switchId || $gameSwitches.value(switchId);
        }
    }
    window.Sprite_SceneExtra = Sprite_SceneExtra;
})();
