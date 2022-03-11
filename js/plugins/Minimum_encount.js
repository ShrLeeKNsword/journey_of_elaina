//=============================================================================
// Minimum_encount.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc ランダムエンカウントの最低歩数の初期値を設定します。
 * @author ゆわか
 *
 * @param minienm
 * @desc 最低歩数を読み取る変数
 * @type variable
 * @default 1
 *
 * @param formula
 * @desc エンカウント率の計算式（ツクールのデフォルトは1です）
 * 1：歩数+歩数+最低　2：歩数+最低　その他はヘルプ参照
 * @default 1
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 *　ランダムエンカウントの最低歩数の初期値と
 *　エンカウント率の計算式を設定できます。
 *
 *　指定した変数の中身が0の場合、マップに入った直後にエンカウントする可能性があります。
 *　いつでも最低歩数を変更できますが、次のエンカウントまでは前の歩数のままなので
 *　すぐに数値を反映したい場合は、変更後場所移動してください。
 *
 *　歩数は、マップで指定した「敵出現歩数」の数値以下が0を含めランダムで選ばれます。
 *　
 *　計算式（formula）に3を入れると
 *　ランダム要素を省いて指定した最低歩数の固定値でエンカウントします。
 *
 *　計算式（formula）に4～6を入れると
 *　最低歩数用の変数の中身ではなく番号を最低歩数として利用できます。
 *　マップごとに変更しなくてよく、変数を消費したくない場合にご利用ください。
 *　4：歩数+歩数+最低　5：歩数+最低　6：固定値歩数
 *
 *　このプラグインは、kuroさんのブログ
 *　「RPGツクールMVでアプリリリースを目指す開発室」
 *　http://fanblogs.jp/tabirpglab/
 *　の初心者向け講座「ツクールMV エンカウント率を調整」を参考に作成しました。
 *　kuroさんありがとうございます。
 *
 * ＲＰＧツクールＭＶ・ＭＺ兼用のプラグインです。
 * 使用報告不要・クレジット不要・改変可・商用利用可。
 * もし何か問題が起きても、当方は一切責任を負いません。ご了承ください。
 */

(function() {
//パラメータ用変数の設定
    var parameters = PluginManager.parameters('Minimum_encount');
    var minienm = Number(parameters['minienm'] || 1);
    var formula = Number(parameters['formula'] || 1);

//rmmz_objects.jsより抜粋
Game_Player.prototype.makeEncounterCount = function() {
    var n = $gameMap.encounterStep();
if (formula == 1){
    this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + ($gameVariables.value(minienm));
     } else {
  if (formula == 2){
    this._encounterCount = Math.randomInt(n)+ $gameVariables.value(minienm);
     } else {
  if (formula == 3){
    this._encounterCount = $gameVariables.value(minienm);
     } else {
  if (formula == 4){
    this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + minienm;
     } else {
  if (formula == 5){
    this._encounterCount = Math.randomInt(n) + minienm;
     } else {
    this._encounterCount = minienm;
     }
     }
     }
     }
     }
};


})();
