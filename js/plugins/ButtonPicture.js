//=============================================================================
// RPG Maker MZ - Button Picture
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Makes a picture clickable.
 * @author Yoji Ojima
 *
 * @help ButtonPicture.js
 *
 * This plugin provides a command to call a common event when a picture is
 * clicked.
 *
 * Use it in the following procedure.
 *   1. Execute "Show Picture" to display your button image.
 *   2. Call the plugin command "Set Button Picture".
 *
 * @command set
 * @text Set Button Picture
 * @desc Makes the specified picture clickable.
 *
 * @arg pictureId
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @text Picture Number
 * @desc Control number of the picture.
 *
 * @arg commonEventId
 * @type common_event
 * @default 1
 * @text Common Event
 * @desc Common event to call when the picture is clicked.
 */

/*:ja
 * @target MZ
 * @plugindesc ピクチャをクリック可能にします。
 * @author Yoji Ojima
 *
 * @help ButtonPicture.js
 *
 * このプラグインは、ピクチャのクリック時にコモンイベントを呼び出すコマンドを
 * 提供します。
 *
 * 次の手順で使用してください。
 *   1. 「ピクチャの表示」を実行して、ボタン画像を表示します。
 *   2. プラグインコマンド「ボタンピクチャの設定」を呼び出します。
 *
 * @command set
 * @text ボタンピクチャの設定
 * @desc 指定したピクチャをクリック可能にします。
 *
 * @arg pictureId
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @text ピクチャ番号
 * @desc ピクチャの管理番号です。
 *
 * @arg commonEventId
 * @type common_event
 * @default 1
 * @text コモンイベント
 * @desc ピクチャがクリックされた時に呼び出すコモンイベントです。
 */

/*:zh
 * @target MZ
 * @plugindesc 使图片可点击。
 * @author Yoji Ojima
 *
 * @help ButtonPicture.js
 *
 * 该插件提供了单击图片时调用公共事件的命令。
 *
 * 在以下过程中使用它。
 *   1. 执行“显示图片”以显示按钮图像。
 *   2. 调用插件命令“设置按钮图片”。
 *
 * @command set
 * @text 按钮图片设置
 * @desc 使指定的图片可单击。
 *
 * @arg pictureId
 * @type number
 * @min 1
 * @max 100
 * @default 1
 * @text 图片编号
 * @desc 图片的管理编号。
 *
 * @arg commonEventId
 * @type common_event
 * @default 1
 * @text 公共事件
 * @desc 单击图片时要调用的常见事件。
 */

(() => {
    const pluginName = "ButtonPicture";

    PluginManager.registerCommand(pluginName, "set", args => {
        const pictureId = Number(args.pictureId);
        const commonEventId = Number(args.commonEventId);
        const picture = $gameScreen.picture(pictureId);
        if (picture) {
            picture.mzkp_commonEventId = commonEventId;
        }
    });

    Sprite_Picture.prototype.isClickEnabled = function() {
        const picture = this.picture();
        return picture && picture.mzkp_commonEventId && !$gameMessage.isBusy();
    };

    Sprite_Picture.prototype.onClick = function() {
        $gameTemp.reserveCommonEvent(this.picture().mzkp_commonEventId);
    };

    Spriteset_Base.prototype.mzkp_isAnyPicturePressed = function() {
        return this._pictureContainer.children.some(sprite =>
            sprite.isPressed()
        );
    };

    const _Scene_Map_isAnyButtonPressed =
        Scene_Map.prototype.isAnyButtonPressed;
    Scene_Map.prototype.isAnyButtonPressed = function() {
        return (
            _Scene_Map_isAnyButtonPressed.apply(this, arguments) ||
            this._spriteset.mzkp_isAnyPicturePressed()
        );
    };
})();
