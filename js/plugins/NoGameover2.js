//=============================================================================
// NoGameover2.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc 全滅してもゲームオーバーにならない。
 * @author ゆわか

 * @param Switch ID
 * @desc マップ上でも戦闘でも全滅したときにONにするスイッチのIDです。
 * @default 0
 * @type switch
 *
 * @param Switch ID2
 * @desc 戦闘で全滅したときにONにするスイッチのIDです。
 * @default 0
 * @type switch
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 *　自動的にフェードアウトするようにしています。
 *　フェードインはスイッチで呼び出すコモンイベントへ入れて
 *　好きなタイミングで行ってください。
 *
 *　自動的にメニューを禁止するようにしています。
 *　メニューアイコンの点滅を防ぐためです。
 *　必要に応じて、禁止を解いてください。
 *
 *　（フェードアウトやメニューを禁止したくなければ、コメントアウトしてね）
 *
 *　イベント中の戦闘で、敗北の設定をしている場合は、そちらが優先されます。
 *
 * プラグインコマンドはありません。
 * ＲＰＧツクールＭＺ専用のプラグインです。
 * ツクールの規約に沿って自由に改変、使用してください。
 *
 *　ＲＰＧツクールＭＶサンプルゲーム「シーピラート」のプラグインを
 *　参考にさせて頂きました。
 *　ありがとうございます。
 */

(function() {

    var parameters = PluginManager.parameters('NoGameover2');
    var switchId = Number(parameters['Switch ID'] || 0);
    var switchId2 = Number(parameters['Switch ID2'] || 0);

//rpg_managers.jsより（戦闘で全滅した場合）
BattleManager.updateBattleEnd = function() {
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if (!this._escaped && $gameParty.isAllDead()) {
        if (this._canLose) {
            $gameParty.reviveBattleMembers();
            SceneManager.pop();
        } else {
            //SceneManager.goto(Scene_Gameover);//ゲームオーバーを表示するぜ
	    $gameSystem.disableMenu()//メニューを禁止するぜ
            $gameScreen.startFadeOut(10); //フェードアウトするぜ
	    $gameSwitches.setValue(switchId, true); //全滅したぜ
	    $gameSwitches.setValue(switchId2, true); //戦闘中に全滅したぜ
            $gameParty.reviveBattleMembers(); //みんな生き返るぜ
            SceneManager.pop(); //マップ画面へ移動するぜ
        }
    } else {
        SceneManager.pop();
    }
    this._phase = "";
};

//rmmz_scenes.jsより（フィールドで全滅した場合）
Scene_Base.prototype.checkGameover = function() {
    if ($gameParty.isAllDead()) {
//        SceneManager.goto(Scene_Gameover);//ゲームオーバーを表示するぜ
	    $gameSystem.disableMenu()//メニューを禁止するぜ
            $gameScreen.startFadeOut(10); //フェードアウトするぜ
	    $gameSwitches.setValue(switchId, true); //全滅したぜ
            $gameParty.reviveBattleMembers(); //みんな生き返るぜ
    }
};

})();
