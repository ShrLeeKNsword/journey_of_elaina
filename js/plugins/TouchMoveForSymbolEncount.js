/*:
 * @target MV MZ
 * @plugindesc タッチ移動時イベントシンボルを避けないようにします。
 * @author 湿度ケイ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMVとMZに対応しています。
 *
 * ■概要
 * タッチ移動時の経路探索上限を減らすことで、イベントシンボルを避けないようにし、シンボルエンカウントとのエンカウント率を上げます。
 * ※注意：副作用として通常のタッチ移動のスペックを大きく損ないます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function() {

  //
  // overwrite
  //
  Game_Character.prototype.searchLimit = function() {
      return 2;
  };

})();
