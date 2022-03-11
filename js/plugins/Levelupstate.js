/*:
 * @target MZ
 * @plugindesc レベルアップ時にステートを付与
 * @author yuwaka
 *
 * @param leupid
 * @text ステート番号
 * @desc 付与するステートのID
 * @default 11
 * @type number
 * @min 1
 *
 * @help
 * サイドビュー戦闘用のステートを使ったレベルアップ表示システムです。
 * 
 * レベルアップ時に付与するステートを作成し
 * 「優先度」を99くらいに設定。
 * 「重ね合わせ」を設定。
 * 「解除条件」の「戦闘終了時に解除」をチェック。
 * 
 * 「重ね合わせ」のアニメーションは自分で作ってください。
 * 枠が余ってない場合は、誰かに重ね合わせのアニメを増やすプラグインを
 * 作ってもらうか、探してみてください。
 *
 * レベルアップメッセージと付与タイミングを合わせたい場合は
 * 誰かに作ってもらうか、探してみてください。
 *
 * プラグインコマンドはありません。
 * RPGツクールMZ専用です。
 * ツクールの規約に沿って自由に改変、使用してください。
 */


(function(){

//パラメータ用変数の設定
    var parameters = PluginManager.parameters('Levelupstate');
    var leupid = Number(parameters['leupid'] || 11);



// rmmz_objects より抜粋
Game_Actor.prototype.levelUp = function() {
    this._level++;
	if($gameParty.inBattle()){
	$gameActors.actor(this._actorId).addState(leupid);
	}
    for (const learning of this.currentClass().learnings) {
        if (learning.level === this._level) {
            this.learnSkill(learning.skillId);
        }
    }
};


}());