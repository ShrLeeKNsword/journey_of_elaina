//-----------------------------------------------------------------------------
// Scene_Equip
//
// The scene class of the equipment screen.

/**
 * 场景装备
 * 
 * 装备画面的场景类别。
 */
function Scene_Equip() {
    this.initialize(...arguments);
}

Scene_Equip.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Equip.prototype.constructor = Scene_Equip;

/**
 * 初始化
 */
Scene_Equip.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

/**
 * 创建
 */
Scene_Equip.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createStatusWindow();
    this.createCommandWindow();
    this.createSlotWindow();
    this.createItemWindow();
    this.refreshActor();
};

/**
 * 创建状态窗口
 */
Scene_Equip.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_EquipStatus(rect);
    this.addWindow(this._statusWindow);
};

/**
 * 状态窗口矩形
 */
Scene_Equip.prototype.statusWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = this.statusWidth();
    const wh = this.mainAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建命令窗口
 */
Scene_Equip.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_EquipCommand(rect);
    this._commandWindow.setHelpWindow(this._helpWindow);
    this._commandWindow.setHandler("equip", this.commandEquip.bind(this));
    this._commandWindow.setHandler("optimize", this.commandOptimize.bind(this));
    this._commandWindow.setHandler("clear", this.commandClear.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this._commandWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._commandWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._commandWindow);
};

/**
 * 命令窗口矩形
 */
Scene_Equip.prototype.commandWindowRect = function() {
    const wx = this.statusWidth();
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth - this.statusWidth();
    const wh = this.calcWindowHeight(1, true);
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建插槽窗口
 */
Scene_Equip.prototype.createSlotWindow = function() {
    const rect = this.slotWindowRect();
    this._slotWindow = new Window_EquipSlot(rect);
    this._slotWindow.setHelpWindow(this._helpWindow);
    this._slotWindow.setStatusWindow(this._statusWindow);
    this._slotWindow.setHandler("ok", this.onSlotOk.bind(this));
    this._slotWindow.setHandler("cancel", this.onSlotCancel.bind(this));
    this.addWindow(this._slotWindow);
};

/**
 * 插槽窗口矩形
 */
Scene_Equip.prototype.slotWindowRect = function() {
    const commandWindowRect = this.commandWindowRect();
    const wx = this.statusWidth();
    const wy = commandWindowRect.y + commandWindowRect.height;
    const ww = Graphics.boxWidth - this.statusWidth();
    const wh = this.mainAreaHeight() - commandWindowRect.height;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建项目窗口
 */
Scene_Equip.prototype.createItemWindow = function() {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_EquipItem(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setStatusWindow(this._statusWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._itemWindow.hide();
    this._slotWindow.setItemWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

/**
 * 项目窗口矩形
 */
Scene_Equip.prototype.itemWindowRect = function() {
    return this.slotWindowRect();
};

/**
 * 状态宽度
 */
Scene_Equip.prototype.statusWidth = function() {
    return 312;
};

/**
 * 需要页面按钮
 */
Scene_Equip.prototype.needsPageButtons = function() {
    return true;
};

/**
 * 是页面按钮启用
 */
Scene_Equip.prototype.arePageButtonsEnabled = function() {
    return !(this._itemWindow && this._itemWindow.active);
};

/**
 * 刷新角色
 */
Scene_Equip.prototype.refreshActor = function() {
    const actor = this.actor();
    this._statusWindow.setActor(actor);
    this._slotWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

/**
 * 命令装备
 */
Scene_Equip.prototype.commandEquip = function() {
    this._slotWindow.activate();
    this._slotWindow.select(0);
};

/**
 * 命令优化
 */
Scene_Equip.prototype.commandOptimize = function() {
    SoundManager.playEquip();
    this.actor().optimizeEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

/**
 * 命令清除
 */
Scene_Equip.prototype.commandClear = function() {
    SoundManager.playEquip();
    this.actor().clearEquipments();
    this._statusWindow.refresh();
    this._slotWindow.refresh();
    this._commandWindow.activate();
};

/**
 * 当插槽确定
 */
Scene_Equip.prototype.onSlotOk = function() {
    this._slotWindow.hide();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._itemWindow.select(0);
};

/**
 * 当插槽取消
 */
Scene_Equip.prototype.onSlotCancel = function() {
    this._slotWindow.deselect();
    this._commandWindow.activate();
};

/**
 * 当项目确定
 */
Scene_Equip.prototype.onItemOk = function() {
    SoundManager.playEquip();
    this.executeEquipChange();
    this.hideItemWindow();
    this._slotWindow.refresh();
    this._itemWindow.refresh();
    this._statusWindow.refresh();
};

/**
 * 执行装备改变
 */
Scene_Equip.prototype.executeEquipChange = function() {
    const actor = this.actor();
    const slotId = this._slotWindow.index();
    const item = this._itemWindow.item();
    actor.changeEquip(slotId, item);
};

/**
 * 当项目取消
 */
Scene_Equip.prototype.onItemCancel = function() {
    this.hideItemWindow();
};

/**
 * 当角色改变
 */
Scene_Equip.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    this.hideItemWindow();
    this._slotWindow.deselect();
    this._slotWindow.deactivate();
    this._commandWindow.activate();
};

/**
 * 隐藏项目窗口
 */
Scene_Equip.prototype.hideItemWindow = function() {
    this._slotWindow.show();
    this._slotWindow.activate();
    this._itemWindow.hide();
    this._itemWindow.deselect();
};

