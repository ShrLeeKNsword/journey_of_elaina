/*:
 * @target MZ
 * @plugindesc 画面シェイクを縦揺れに変更するよ
 * @author ゆわか
 *
 * @param Switch ID
 * @desc 揺れ方を変更するスイッチのＩＤです。
 * @default 0
 * @type switch
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 *　パラメータで指定した番号のスイッチを
 *　ＯＮにすると縦揺れに変更、ＯＦＦにすると横揺れに戻ります。
 *　
 *　フロントビュー戦闘でダメージを受けたときの揺れも
 *　同じように変更されるのでご注意ください。
 *
 * プラグインコマンドはありません。
 * ＲＰＧツクールＭＺ専用のプラグインです。
 *
 * 使用報告不要・クレジット不要・改変可・商用利用可。
 * もし何か問題が起きても、当方は一切責任を負いません。ご了承ください。
 */

(function() {

    var parameters = PluginManager.parameters('ShakingChange');
    var switchId = Number(parameters['Switch ID'] || 0);

//rmmz_sprites.js　より抜粋
Spriteset_Base.prototype.updatePosition = function() {
    const screen = $gameScreen;
    const scale = screen.zoomScale();
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = Math.round(-screen.zoomX() * (scale - 1));
    this.y = Math.round(-screen.zoomY() * (scale - 1));

//揺れ方向
if($gameSwitches.value(switchId)){
    this.y += Math.round(screen.shake()); 
   } else {
    this.x += Math.round(screen.shake()); 
   }

};

})();