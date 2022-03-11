//=============================================================================
// ItemNameMsg.js
//=============================================================================
// [Update History]
// 2015.Oct.15 Ver1.0.0 First Release as a KADOKAWA Plugin on RMMV.
// 2020.Apr.02 Ver1.1.0 Support behaviour on RMMZ.

/*:
 * @target MV MZ
 * @plugindesc at message window, \ITEM[] replace to item name.
 * @author Sasuke KANNAZUKI
 * 
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV and MZ.
 *
 * this plugin replces \ITEM[type,item_id] to the item name,
 * where type is 0=item, 1=weapon, 2=armor.
 * 
 * this plugin also replaces following notations:
 * \DESC[type,item_id] : item description.
 * \DESC1[type,item_id] : 1st line of item description.
 * \DESC2[type,item_id] : 2nd line of item description.
 * \MONEY : party gold(money) number
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */
/*:ja
 * @target MV MZ
 * @plugindesc メッセージウィンドウで \ITEM[] をアイテム名に置き換えます。
 * @author 神無月サスケ
 * 
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMVおよびMZに対応しています。
 *
 * ■概要
 * このプラグインは、アイテムの名前に置き換えるエスケープ文字を定義します。
 *
 * \ITEM[type,item_id]の書式で記述し、typeは、0=アイテム、1=武器、2=防具です。
 *
 * また、このプラグインは、以下の置き換えも行います。
 * \DESC[type,item_id] : アイテムの説明
 * \DESC1[type,item_id] : アイテムの説明の1行目
 * \DESC2[type,item_id] : アイテムの説明の2行目
 * \MONEY : パーティーの現在の所持金額
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function() {
  var _Window_Base_convertEscapeCharacters =
   Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = _Window_Base_convertEscapeCharacters.call(this, text);
    // convert \ITEM[item_id] to item name.
    text = text.replace(/\x1bITEM\[(\d+)\s*,\s*(\d+)\]/gi, function() {
      return this.itemName(parseInt(arguments[1]), parseInt(arguments[2]));
    }.bind(this));
    // convert \DESC[item_id] to item description.
    text = text.replace(/\x1bDESC\[(\d+)\s*,\s*(\d+)\]/gi, function() {
      return this.itemDesc(parseInt(arguments[1]), parseInt(arguments[2]));
    }.bind(this));
    // convert \DESC1[item_id] to item description.
    text = text.replace(/\x1bDESC1\[(\d+)\s*,\s*(\d+)\]/gi, function() {
      return this.itemDesc1(parseInt(arguments[1]), parseInt(arguments[2]));
    }.bind(this));
    // convert \DESC2[item_id] to item description.
    text = text.replace(/\x1bDESC2\[(\d+)\s*,\s*(\d+)\]/gi, function() {
      return this.itemDesc2(parseInt(arguments[1]), parseInt(arguments[2]));
    }.bind(this));
    text = text.replace(/\x1bMONEY/gi, String($gameParty.gold()));
    return text;
  };

  Window_Base.prototype.getItem = function(t, n) {
    var item = null;
    switch(t){
    case 0:
      item = n >= 1 ? $dataItems[n] : null;
      break;
    case 1:
      item = n >= 1 ? $dataWeapons[n] : null;
      break;
    case 2:
      item = n >= 1 ? $dataArmors[n] : null;
      break;
    }
    return item;
  };

  Window_Base.prototype.itemName = function(t, n) {
    item = this.getItem(t, n);
    return item ? item.name : '';
  };

  Window_Base.prototype.itemDesc = function(t, n) {
    item = this.getItem(t, n);
    return item ? item.description : '';
  };

  Window_Base.prototype.itemDesc1 = function(t, n) {
    item = this.getItem(t, n);
    return item ? item.description.split('\n')[0] : '';
  };

  Window_Base.prototype.itemDesc2 = function(t, n) {
    item = this.getItem(t, n);
    return item ? (item.description.split('\n')[1] || '') : '';
  };

})();