//=============================================================================
// Plugin for RPG Maker MZ
// SetFieldSkillIdMZ.js
//=============================================================================
// [Update History]
// SetFieldSkillId.js
// 2019.Sep.05 Ver1.0.0 First Release
// 2019.Sep.16 Ver1.1.0 Add plugin command to get original item information
// SetFieldSkillIdMZ.js
// 2019.Dec.09 Ver1.0.0 FirstRelease

/*:
 * @target MZ
 * @plugindesc Set Different Skill ID on Map.
 * @author Sasuke KANNAZUKI
 *
 * @command set
 * @text Set VarId for Original
 * @desc Set original item/skill's id to the variable of specified id.
 *
 * @arg VarIdForSkill
 * @desc Variable id to store original skill id. When original is an item, store 0.
 * @type variable
 * @default 10
 *
 * @arg VarIdForItem
 * @desc Variable id to store item id. When original is a skill, store 0.
 * @type variable
 * @default 11
 *
 * @command reset
 * @text Reset VarId
 * @desc Cease to store item/skill's id anywhere.
 *
 * @help
 * This plugin runs under RPG Maker MZ.
 *
 * [Summary]
 * Set different effect battle skill/item on map
 *
 * To set different skill ID, write as follows to skill/item's memo.
 * <FieldSkillId:15>
 * In this case, the skill effect on map becomes the skill whose Id is 15.
 *
 * - When the item isn't a skill but an item, the effect becomes skill.
 * - Be sure to set occasion 'Always', otherwise cannot use it on field.
 * - Recommended usage: changed skill invokes common event.
 * - NOTE: set the same consume MP between original skill and changed skill.
 *
 * [Plugin Commands]
 * By plugin commands, you can get the information of original item/skill id.
 * - If you set variable id 0, the information won't store anywhere.
 * - Those variables become 0 when non-change item/skill is used.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc 戦闘スキルやアイテムをフィールドで使った時の効果を変更します。
 * @author 神無月サスケ
 *
 * @command set
 * @text 変更元の情報を保存開始
 * @desc マップ上で効果が変わるアイテムやスキルの使用時、
 * 元のIDを保存する変数IDを指定します。
 *
 * @arg VarIdForSkill
 * @text スキル格納変数ID
 * @desc 元のスキルIDを格納する変数ID。アイテムの時は0を代入。
 * @type variable
 * @default 10
 *
 * @arg VarIdForItem
 * @text アイテム格納変数ID
 * @desc 元のアイテムIDを格納する変数ID。スキルの時は0を代入。
 * @type variable
 * @default 11
 *
 * @command reset
 * @text 変数への保存終了
 * @desc 効果が変わるアイテムやスキル使用時の変数への格納をやめます。
 *
 * @help
 * このプラグインはRPGツクールMZに対応してます。
 * 戦闘スキルやアイテムをフィールドで使った時の効果を変更するプラグインです。
 *
 * ■概要
 * スキルやアイテムのメモに以下のように書いてください：
 * <FieldSkillId:15>
 * この場合、スキル/アイテムの効果は、フィールドではIDが15番のスキルに
 * 置き換わります。
 *
 * - アイテムのメモ欄に書いた場合でも、発動するのはスキルです。
 * - 元のスキル/アイテムの「使用可能時」は「常時」にしてください。
 *   さもないと、マップ上では使用できなくなります。
 * - おすすめの使い方：変更後のスキルはコモンイベント起動にする。
 * - 注意：オリジナルのスキルと変更後のスキルは同じ消費MPに設定してください。
 *
 * ■プラグインコマンド
 * プラグインコマンドで、変更前のアイテムやスキルのIDを変数に取得できます。
 * - 変数IDを0にした場合、情報は保存されません。
 * - 通常のアイテムやスキルを使用した場合、両方に0が格納されます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
   const pluginName = 'SetFieldSkillIdMZ';

  //
  // initialize variables
  //
  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
    this._originalSkillVarId = null;
    this._originalItemVarId = null;
  };

  const _Scene_Battle_start = Scene_Battle.prototype.start;
  Scene_Battle.prototype.start = function() {
    _Scene_Battle_start.call(this);
    this.originalItem = null;
  };

  Game_System.prototype.resetOriginalItem = function() {
    let varId = this._originalItemVarId;
    if (varId) {
      $gameVariables.setValue(varId, 0);
    }
    varId = this._originalSkillVarId;
    if (varId) {
      $gameVariables.setValue(varId, 0);
    }
  };

  //
  // process plugin commands
  //
  PluginManager.registerCommand(pluginName, 'set', args => {
    $gameSystem._originalSkillVarId = Number(args.VarIdForSkill || 0);
    $gameSystem._originalItemVarId = Number(args.VarIdForItem || 0);
  });

  PluginManager.registerCommand(pluginName, 'reset', args => {
    $gameSystem.resetOriginalItem();
    $gameSystem._originalSkillVarId = 0;
    $gameSystem._originalItemVarId = 0;
  });

  //
  // execute item change
  //
  const _Scene_ItemBase_item = Scene_ItemBase.prototype.item;
  Scene_ItemBase.prototype.item = function() {
    const item = _Scene_ItemBase_item.call(this);
    $gameTemp.originalItem = null;
    $gameSystem.resetOriginalItem();
    if (item && item.meta.FieldSkillId) {
      const itemObj = new Game_Item(item);
      if (itemObj.isUsableItem()) {
        if (itemObj.isItem()) {
          $gameTemp.originalItem = item;
          const varId = $gameSystem._originalItemVarId;
          if (varId) {
            $gameVariables.setValue(varId, item.id);
          }
        } else if (itemObj.isSkill()){
          const varId = $gameSystem._originalSkillVarId;
          if (varId) {
            $gameVariables.setValue(varId, item.id);
          }
        }
        const changedSkill = $dataSkills[Number(item.meta.FieldSkillId)];
        if (changedSkill) {
          return changedSkill;
        }
      }
    }
    return item;
  };

  const _Game_Battler_useItem = Game_Battler.prototype.useItem;
  Game_Battler.prototype.useItem = function(item) {
    if ($gameTemp.originalItem) {
      item = $gameTemp.originalItem;
      $gameTemp.originalItem = null;
    }
    _Game_Battler_useItem.call(this, item);
  };

})();
