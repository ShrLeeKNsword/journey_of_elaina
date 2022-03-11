//=============================================================================
// Plugin for RPG Maker MZ
// SubMembersAttendBattle.js
//=============================================================================
// [Update History]
// 2020.Jan.24: Ver0.0.1 First release to closed members
// 2020.Feb.15: Ver0.0.2 Fix bug : invoke error when member > 4 and open menu

/*:
 * @target MZ
 * @plugindesc Make Sub Members(=NPC) Attend Battle and does auto actions.
 * @author Sasuke KANNAZUKI
 *
 * @param subMemberIdVal1
 * @text Var ID for sub member 1
 * @desc Variable ID for actor ID of sub member 1.
 * @type variable
 * @default 1
 *
 * @param subMemberIdVal2
 * @text Var ID for sub member 2
 * @desc Variable ID for actor ID of sub member 2.
 * @type variable
 * @default 2
 *
 * @param subMemberIdVal3
 * @text Var ID for sub member 3
 * @desc Variable ID for actor ID of sub member 3.
 * @type variable
 * @default 3
 *
 * @param subMemberIdVal4
 * @text Var ID for sub member 4
 * @desc Variable ID for actor ID of sub member 4.
 * @type variable
 * @default 4
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 * 
 * This plugin enables Sub Members(=NPC) attend battle.
 *
 * [Summary]
 * A sub member is an actor but not displayed actor list in menu,
 * because sum members are not included in the party.
 *
 * Since sub members are not party members...
 * - at battle scene, sub members' HP/MP and other status is not displayed.
 *   Actually, sub members never become attack target.
 * - Sub members never consume HP/MP.
 * (i.e. Sub members' hp and mp is not considered while all battle situations.)
 * - Sub members never get EXP at battle end.
 * 
 * [Recommended Usage]
 * Use together with MenuSubMembersMZ.js to display sub members on menu and
 * followers on map.
 * In that case, set the options 'Var ID for submember' at the same value
 * as that of MenuSubMembersMZ.js.
 *
 * [Advanced Option]
 * Write an actor's note <NonFightNPC> and the actor doesn't attend the battle
 * when the actor become sub member.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc 同行者(NPC)を戦闘に参加させ、自動戦闘を行わせます
 * @author 神無月サスケ
 *
 * @param subMemberIdVal1
 * @text 同行者1用変数ID
 * @desc 同行者1のアクターIDを指定する変数ID
 * @type variable
 * @default 1
 *
 * @param subMemberIdVal2
 * @text 同行者2用変数ID
 * @desc 同行者2のアクターIDを指定する変数ID
 * @type variable
 * @default 2
 *
 * @param subMemberIdVal3
 * @text 同行者3用変数ID
 * @desc 同行者3のアクターIDを指定する変数ID
 * @type variable
 * @default 3
 *
 * @param subMemberIdVal4
 * @text 同行者4用変数ID
 * @desc 同行者4のアクターIDを指定する変数ID
 * @type variable
 * @default 4
 *
 * @help このプラグインにプラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * このプラグインは、同行者(NPC)を戦闘にさせることが出来ます。
 *
 * ■概要
 * 同行者とは、パーティーメンバーに属さず、メニューのアクターリストにも
 * 表示されないが、同行しているアクターです。
 *
 * 同行者はパーティーメンバーではないため、戦闘中、ステータスは表示されません。
 * 敵からの攻撃の対象になることも、仲間の回復スキルで回復することもありません。
 * すなわち、同行者のHP/MPは一切考慮されないということです。
 * また、同行者は戦闘勝利時に経験値を得ることもありません。
 *
 * ■推奨される使用法
 * MenuSubMembersMZ.js はメニュー画面および隊列に同行者を表示させます。
 * こちらと併用する場合、同行者用の変数IDを同じように設定するといいでしょう。
 *
 * ■メモの記述
 * アクターのメモに <NonFightNPC> と書いた場合、そのアクターが同行者の時
 * 戦闘には参加しません。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'SubMembersAttendBattle';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const submemberVar1 = Number(parameters['subMemberIdVal1'] || 1);
  const submemberVar2 = Number(parameters['subMemberIdVal2'] || 2);
  const submemberVar3 = Number(parameters['subMemberIdVal3'] || 3);
  const submemberVar4 = Number(parameters['subMemberIdVal4'] || 4);

  //
  // get sub members
  //
  const subMemberVarList = [submemberVar1, submemberVar2, submemberVar3,
    submemberVar4
  ];

  const _subMemberIds = () => {
    let members = [];
    for (const varId of subMemberVarList) {
      if (varId > 0) {
        const subMemberID = $gameVariables.value(varId);
        if (subMemberID > 0) {
          let actor = $dataActors[subMemberID];
          if (actor && !actor.meta.NonFightNPC) {
            members.push(subMemberID);
          }
        }
      }
    }
    return members;
  };

  //--------------------------------------------------------------------------
  // Game_SubMembers
  // The third unit following Game_Party and Game_Troop.
  //
  function Game_SubMembers() {
    this.initialize(...arguments);
  }

  Game_SubMembers.prototype = Object.create(Game_Unit.prototype);
  Game_SubMembers.prototype.constructor = Game_SubMembers;

  Game_SubMembers.prototype.initialize = function() {
    Game_Unit.prototype.initialize.call(this);
    this._inBattle = true;
    this._subMembers = _subMemberIds();
  };

  Game_SubMembers.prototype.members = function() {
    return this._subMembers.map(id => $gameActors.actor(id));
  };

  //
  // define sub member variable used only in the battle
  //
  let $gameSubMembers = null;

  const hasSubMember = () => !!$gameSubMembers;

  const _Game_Party_onBattleStart = Game_Party.prototype.onBattleStart;
  Game_Party.prototype.onBattleStart = function(advantageous) {
    _Game_Party_onBattleStart.call(this, advantageous);
    $gameSubMembers = new Game_SubMembers();
    $gameSubMembers.onBattleStart(advantageous);
  };

  const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function() {
    _Scene_Battle_terminate.call(this);
    $gameSubMembers = null;
  };

  //
  // add sub members to battle members
  //
  const _BattleManager_allBattleMembers = BattleManager.allBattleMembers;
  BattleManager.allBattleMembers = function() {
    let battleMembers = _BattleManager_allBattleMembers.call(this);
    if (hasSubMember()) {
      battleMembers = battleMembers.concat($gameSubMembers.members());
    }
    return battleMembers;
  };

  const _BattleManager_makeActionOrders = BattleManager.makeActionOrders;
  BattleManager.makeActionOrders = function() {
    _BattleManager_makeActionOrders.call(this);
    const subMembers = hasSubMember() ? $gameSubMembers.members() : [];
    for (const battler of subMembers) {
      battler.makeSpeed();
    }
    const battlers = subMembers.concat(this._actionBattlers);
    battlers.sort((a, b) => b.speed() - a.speed());
    this._actionBattlers = battlers;
  };

  //
  // judge functions whether the actor is sub member or not.
  //
  Game_BattlerBase.prototype.isSubMember = function() {
    return false;
  };

  Game_Actor.prototype.isSubMember = function () {
    if (!hasSubMember()) {
      return false;
    }
    const actorId = this.actorId();
    return $gameSubMembers._subMembers.includes(actorId) &&
      !$gameParty._actors.includes(actorId);
  };

  const _Game_Actor_isBattleMember = Game_Actor.prototype.isBattleMember;
  Game_Actor.prototype.isBattleMember = function() {
    if (_Game_Actor_isBattleMember.call(this)) {
      return true;
    } else if (hasSubMember()) {
      return $gameSubMembers.members().includes(this);
    }
    return false;
  };


  //
  // sub members cannot accept input but decide action automatically
  //
  const _Game_BattlerBase_isAutoBattle =
    Game_BattlerBase.prototype.isAutoBattle;
  Game_BattlerBase.prototype.isAutoBattle = function() {
    if (this.isSubMember()) {
      return true;
    }
    return _Game_BattlerBase_isAutoBattle.call(this);
  };

  //
  // sub members doesn't consider HP/MP
  //
  const _Game_BattlerBase_canPaySkillCost =
    Game_BattlerBase.prototype.canPaySkillCost;
  Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    if (this.isSubMember()) {
      return true;
    }
    return _Game_BattlerBase_canPaySkillCost.call(this, skill);
  };

  const _Game_Battler_useItem = Game_Battler.prototype.useItem;
  Game_Battler.prototype.useItem = function(item) {
    if (this.isSubMember()) {
      return;
    }
    _Game_Battler_useItem.call(this, item);
  };

  //
  // make sub members' action on battle
  //
  const _Game_Party_makeActions = Game_Party.prototype.makeActions;
  Game_Party.prototype.makeActions = function() {
    _Game_Party_makeActions.call(this);
    if (hasSubMember()) {
      $gameSubMembers.makeActions();
    }
  };

  const _BattleManager_updateTpb = BattleManager.updateTpb;
  BattleManager.updateTpb = function() {
    if (hasSubMember()) {
      $gameSubMembers.updateTpb();
    }
    _BattleManager_updateTpb.call(this);
  };

})();
