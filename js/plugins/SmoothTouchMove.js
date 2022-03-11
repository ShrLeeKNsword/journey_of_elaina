//=============================================================================
// SmoothTouchMove.js
//=============================================================================
// [Update History]
// 2016.Oct.10 Ver1.0.0 First Release
// 2019.Dec.05 Ver1.0.1 Support behaviour on RPG Maker MZ.

/*:
 * @target MV MZ
 * @plugindesc on touch move, player can through events under the player
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under both RPG Maker MV and MZ.
 * 
 * [Summary]
 * Normal touch move cannot through the event under the player.
 * This plugin enables through the such events without using wait,
 * message, or any other time consuming commands.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */
/*:ja
 * @target MV MZ
 * @plugindesc タッチ移動で、プレイヤーの下のイベントを通過可能にします。
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMVとMZに対応しています。
 * 
 * ■概要
 * 従来のタッチ移動では、プレイヤーの足元にイベントが存在した場合、
 * そこで移動を打ち切ります。
 * このプラグインは、会話やウェイトなどがないイベントに限り、
 * 足元にあっても通過することを可能にします。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function() {
  var resumed = false;

  //
  // Game_Temp
  //
  var _Game_Temp_setDestination = Game_Temp.prototype.setDestination;
  Game_Temp.prototype.setDestination = function(x, y) {
    _Game_Temp_setDestination.call(this, x, y);
    resumed = false;
  };

  var _Game_Temp_clearDestination = Game_Temp.prototype.clearDestination;
  Game_Temp.prototype.clearDestination = function() {
    if (!resumed) {
      return;
    }
    _Game_Temp_clearDestination.call(this);
  };

  var resume = function () {
    resumed = true;
    $gameTemp.clearDestination();
  };

  //
  // Game_Player
  //
  var _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
  Game_Player.prototype.updateNonmoving = function(wasMoving, sceneActive) {
    _Game_Player_updateNonmoving.call(this, wasMoving, sceneActive);
    if (this.isTransferring() || !wasMoving) {
      resume();
    }
  };

  var _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
  Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
      if (this.getInputDirection()) {
        resume();
      }
    }
    _Game_Player_moveByInput.call(this);
  };

})();
