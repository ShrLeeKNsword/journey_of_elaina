//=============================================================================
// Plugin for RPG Maker MZ
// ChangeEquipOnBattleMZ.js
//=============================================================================
// [Update History]
// This plugin is the MZ version of ChangeWeaponOnBattle.js the MV plugin.
// 2019.Dec.13 Ver1.0.0 First Release

/*:
 * @target MZ
 * @plugindesc Add equipment change command to actor commands
 * @author Sasuke KANNAZUKI
 *
 * @param commandName
 * @text Command Name
 * @desc Displaying command name that changes equipments.
 * @type string
 * @default Equip
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 * 
 * [Summary]
 * This plugin adds equip change command to actor command on battle.
 * The command doesn't consume turn.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc 戦闘コマンドに装備変更を追加
 * @author 神無月サスケ
 *
 * @param commandName
 * @text コマンド名
 * @desc 装備変更コマンドの表示名です。
 * @type string
 * @default 装備変更
 *
 * @help このプラグインにプラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * ■概要
 * このプラグインは戦闘のアクターコマンドに「装備変更」を追加します。
 * このコマンドは、ターンを消費しません。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'ChangeEquipOnBattleMZ';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const commandName = parameters['commandName'] || 'Equip';

  //
  // Equip slot for battle
  //
  function Window_BattleEquipSlot() {
    this.initialize.apply(this, arguments);
  }

  Window_BattleEquipSlot.prototype = Object.create(Window_EquipSlot.prototype);
  Window_BattleEquipSlot.prototype.constructor = Window_BattleEquipSlot;

  Window_BattleEquipSlot.prototype.show = function() {
    Window_EquipSlot.prototype.show.call(this);
    this.showHelpWindow();
  };

  Window_BattleEquipSlot.prototype.hide = function() {
    Window_EquipSlot.prototype.hide.call(this);
    this.hideHelpWindow();
  };

  //
  // add equipment windows for check active.
  //
  const _Scene_Battle_isAnyInputWindowActive =
   Scene_Battle.prototype.isAnyInputWindowActive;
  Scene_Battle.prototype.isAnyInputWindowActive = function() {
    if(_Scene_Battle_isAnyInputWindowActive.call(this)) {
      return true;
    }
    return (this._equipSlotWindow.active || this._equipItemWindow.active);
  };

  //
  // create new windows for equipments
  //
  const _Scene_Battle_createAllWindows =
    Scene_Battle.prototype.createAllWindows;
  Scene_Battle.prototype.createAllWindows = function() {
    _Scene_Battle_createAllWindows.call(this);
    this.createEquipStatusWindow();
    this.createEquipSlotWindow();
    this.createEquipItemWindow();
  };

  Scene_Battle.prototype.createEquipStatusWindow = function() {
    const rect = this.equipStatusWindowRect();
    this._equipStatusWindow = new Window_EquipStatus(rect);
    this._equipStatusWindow.hide();
    this.addWindow(this._equipStatusWindow);
  };

  Scene_Battle.prototype.equipStatusWindowRect = function() {
    const wx = 0;
    const wy = this.buttonAreaBottom();
    // ww is based on Scene_Equip.prototype.statusWidth
    const ww = 312;
    // wh is based on Scene_Equip.prototype.mainAreaHeight
    const wh = Graphics.boxHeight - this.buttonAreaHeight() -
      this.calcWindowHeight(2, false);
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_Battle.prototype.createEquipSlotWindow = function() {
    const rect = this.equipSlotAndItemWindowRect();
    this._equipSlotWindow = new Window_BattleEquipSlot(rect);
    this._equipSlotWindow.setHelpWindow(this._helpWindow);
    this._equipSlotWindow.setStatusWindow(this._equipStatusWindow);
    this._equipSlotWindow.setHandler('ok', this.onEquipSlotOk.bind(this));
    this._equipSlotWindow.setHandler('cancel',
      this.onEquipSlotCancel.bind(this)
    );
    this._equipSlotWindow.hide();
    this.addWindow(this._equipSlotWindow);
  };

  Scene_Battle.prototype.createEquipItemWindow = function() {
    const rect = this.equipSlotAndItemWindowRect();
    this._equipItemWindow = new Window_EquipItem(rect);
    this._equipItemWindow.setHelpWindow(this._helpWindow);
    this._equipItemWindow.setStatusWindow(this._equipStatusWindow);
    this._equipItemWindow.setHandler('ok', this.onEquipItemOk.bind(this));
    this._equipItemWindow.setHandler('cancel',
      this.onEquipItemCancel.bind(this)
    );
    this._equipSlotWindow.setItemWindow(this._equipItemWindow);
    this._equipItemWindow.hide();
    this.addWindow(this._equipItemWindow);
  };

  Scene_Battle.prototype.equipSlotAndItemWindowRect = function() {
    const wx = this._equipStatusWindow.width;
    const wy = this._equipStatusWindow.y;
    const ww = Graphics.boxWidth - wx;
    const wh = this._equipStatusWindow.height;
    return new Rectangle(wx, wy, ww, wh);
  };

  //
  // add command to actor command window
  //
  const _Scene_Battle_createActorCommandWindow =
   Scene_Battle.prototype.createActorCommandWindow;
  Scene_Battle.prototype.createActorCommandWindow = function() {
    _Scene_Battle_createActorCommandWindow.call(this);
    this._actorCommandWindow.setHandler('equip', this.commandEquip.bind(this));
  };

  const _Window_ActorCommand_makeCommandList =
   Window_ActorCommand.prototype.makeCommandList;
  Window_ActorCommand.prototype.makeCommandList = function() {
    _Window_ActorCommand_makeCommandList.call(this);
    if (this._actor) {
      this.addEquipCommand();
    }
  };

  Window_ActorCommand.prototype.addEquipCommand = function() {
    this.addCommand(commandName, 'equip');
  };

  //
  // process handlers
  //
  Scene_Battle.prototype.refreshActor = function() {
    const actor = BattleManager.actor();
    this._equipStatusWindow.setActor(actor);
    this._equipSlotWindow.setActor(actor);
    this._equipItemWindow.setActor(actor);
  };

  Scene_Battle.prototype.commandEquip = function() {
    this.refreshActor();
    this._equipStatusWindow.show();
    this._equipSlotWindow.refresh();
    this._equipSlotWindow.show();
    this._equipSlotWindow.activate();
    this._equipSlotWindow.select(0);
  };

  Scene_Battle.prototype.onEquipSlotOk = function() {
    this._equipSlotWindow.hide();
    this._equipItemWindow.show();
    this._equipItemWindow.activate();
    this._equipItemWindow.select(0);
  };

  Scene_Battle.prototype.onEquipSlotCancel = function() {
    this._equipStatusWindow.hide();
    this._equipSlotWindow.hide();
    this._actorCommandWindow.activate();
    this._actorCommandWindow.select(0);
  };

  Scene_Battle.prototype.onEquipItemOk = function() {
    SoundManager.playEquip();
    this.executeEquipChange();
    this.hideEquipItemWindow();
    this._equipSlotWindow.refresh();
    this._equipItemWindow.refresh();
    this._equipStatusWindow.refresh();
  };

  Scene_Battle.prototype.onEquipItemCancel = function() {
    this.hideEquipItemWindow();
  };

  Scene_Battle.prototype.executeEquipChange = function() {
    const actor = BattleManager.actor();
    const slotId = this._equipSlotWindow.index();
    const item = this._equipItemWindow.item();
    actor.changeEquip(slotId, item);
  };

  Scene_Battle.prototype.hideEquipItemWindow = function() {
    this._equipSlotWindow.show();
    this._equipSlotWindow.activate();
    this._equipItemWindow.hide();
    this._equipItemWindow.deselect();
  };

})();
