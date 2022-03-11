/*:
 * @target MZ
 * @plugindesc パーティコマンドに1ターン自動戦闘を追加
 * @author yuwaka
 *
 * @param autosuteid
 * @text ステート番号
 * @desc 自動戦闘時に付与するステートのID
 * @default 11
 * @type number
 * @min 1
 *
 * @param autocommandname
 * @text コマンド名
 * @desc パーティコマンドに追加するコマンドの呼び名
 * @default オート
 * @type string
 *
 * @help
 * ステートを使った簡易自動戦闘システムです。
 * 
 * 1ターンだけ自動戦闘をさせる場合は
 * 特徴に「特殊フラグ・自動戦闘」をつけたステートを作成してください。
 * 解除条件は
 * 「戦闘終了時に解除」と「行動制約によって解除」にチェックを入れて
 * 自動解除のタイミングの持続ターンは「0～0」と指定してください。
 * 
 * 数ターン継続させる場合でも、ターンの最初の数字は0にしてください。
 * 任意のタイミングで解除したい場合は
 * バトルイベントで頑張るか別のプラグインを探してください。
 * 
 * コマンド挿入場所は、「戦う」と「逃げる」の間です。
 * 変更したい場合は、直接このファイルを編集してください。
 * パーティコマンドを変更するほかのプラグインとは競合します。
 *
 * プラグインコマンドはありません。
 * RPGツクールMZ専用です。
 * ツクールの規約に沿って自由に改変、使用してください。
 */


(function(){

//パラメータ用変数の設定
    var parameters = PluginManager.parameters('StateAutoBattle');
    var autosuteid = Number(parameters['autosuteid'] || 11);
    var autocommandname = parameters['autocommandname'] || 'オート';


// rmmz_windows コマンドの順番を変えたい時はthis.addCommandの３行の順番を変える
Window_PartyCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.fight, "fight");
    this.addCommand(autocommandname, "auto");//追加
    this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
};

//rmmz_scenes
Scene_Battle.prototype.createPartyCommandWindow = function() {
    const rect = this.partyCommandWindowRect();
    const commandWindow = new Window_PartyCommand(rect);
    commandWindow.setHandler("fight", this.commandFight.bind(this));
    commandWindow.setHandler("auto", this.commandAuto.bind(this));//追加
    commandWindow.setHandler("escape", this.commandEscape.bind(this));
    commandWindow.deselect();
    this.addWindow(commandWindow);
    this._partyCommandWindow = commandWindow;
};

//新しいシーンを追加、ここでステートを付与している。
Scene_Battle.prototype.commandAuto = function() {
    $gameParty.members().forEach(function(actor) {
    actor.addState(autosuteid);
    });
   BattleManager.updateTurnEnd();
};


}());