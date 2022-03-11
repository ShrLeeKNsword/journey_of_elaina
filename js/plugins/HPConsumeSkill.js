//=============================================================================
// HPConsumeSkill.js (ver.1.1.0)
//=============================================================================
// [Update History]
// 2015.Nov.XX Ver1.0.0 First Release as one of KADOKAWA RMMV Plugins.
// 2020.Jan.XX Ver1.1.0 Update to run under also MZ

/*:
 * @target MV MZ
 * @plugindesc make the skill that consumes HP, not only MP and/or TP
 * @author Sasuke KANNAZUKI
 *
 * @param Consume HP Color
 * @desc the text color ID of display consume HP
 * (Ex. 17 is Crisis Color Yellow)
 * @type number
 * @default 17
 * 
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV and MZ.
 *
 * This plugin enables to make HP consume skill.
 *
 * [Usage]
 * write following format at skill's note:
 *  <hp_cost:30>  # the skill consumes 30 HP.
 *
 * The skill can use even if subject's HP is less than skill's HP Cost.
 *  In that case, let the subject's HP be 1.
 *  (i.e. subject won't die by the skill.)
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc HP消費技
 * @author 神無月サスケ
 *
 * @param Consume HP Color
 * @text 消費HP表示色
 * @desc 表示色のシステムID(例:17=黄色)
 * @type number
 * @default 17
 * 
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMVおよびMZに対応しています。
 *
 * このプラグインはHP消費技の作成を可能にします。
 *
 * ■仕様
 * スキルのメモ欄に「<hp_cost:30>」といった書式で書いてください。
 * この場合、HPを30消費します。
 *
 * 入力時や術使用時のHPが、消費HPより低い場合でも選択、実行可能で、
 * この場合使用後のHPは1になります。（つまり、この技で戦闘不能にはならない）
 *
 * - HPの消費は、技を使う前になされます。
 * - HPと同時に、MPやTPを消費する技も作成可能ですが、
 *  ウィンドウでは消費HPのみが表示されます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php

 */

(function() {

  //
  // process parameters
  //
  var parameters = PluginManager.parameters('HPConsumeSkill');
  var hpConsumeColor = Number(parameters['Consume HP Color'] || 17);

  // --------------------
  // Process Data in item.note
  // *for efficiency, note is processed at first.
  // --------------------

  var _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.call(this);
    DataManager.processHpCost();
  };

  DataManager.processHpCost = function() {
    for (var i = 1; i < $dataSkills.length; i++) {
      var skill = $dataSkills[i];
      var result = skill.meta.hp_cost;
      if (result){
        skill.hpCost = Number(result);
      } else {
        skill.hpCost = 0;
      }
    }
  };

  // --------------------
  // exec consume HP cost
  // --------------------

  Game_BattlerBase.prototype.skillHpCost = function(skill) {
    return skill.hpCost;
  };

  var _Game_BattlerBase_paySkillCost =
    Game_BattlerBase.prototype.paySkillCost;
  Game_BattlerBase.prototype.paySkillCost = function(skill) {
    _Game_BattlerBase_paySkillCost.call(this, skill);
    if (this._hp > this.skillHpCost(skill)) {
      this._hp -= this.skillHpCost(skill);
    } else {
      this._hp = 1;
    }
  };

  // --------------------
  // draw HP cost
  // --------------------

  var _Window_SkillList_drawSkillCost = 
   Window_SkillList.prototype.drawSkillCost;
  Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
    if (this._actor.skillHpCost(skill) > 0) {
      var c = 'ColorManager' in window ? ColorManager : this;
      this.changeTextColor(c.textColor(hpConsumeColor));
      this.drawText(this._actor.skillHpCost(skill), x, y, width, 'right');
      return;
    }
    _Window_SkillList_drawSkillCost.call(this, skill, x, y, width);
  };

})();
