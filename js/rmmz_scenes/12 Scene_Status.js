//-----------------------------------------------------------------------------
// Scene_Status
//
// The scene class of the status screen.

/**
 * 场景状态
 * 
 * 状态画面的场景类别。
 */
function Scene_Status() {
    this.initialize(...arguments);
}

Scene_Status.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Status.prototype.constructor = Scene_Status;

/**
 * 初始化
 */
Scene_Status.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

/**
 * 创建
 */
Scene_Status.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createProfileWindow();
    this.createStatusWindow();
    this.createStatusParamsWindow();
    this.createStatusEquipWindow();
};

/**
 * 帮助区域高度
 */
Scene_Status.prototype.helpAreaHeight = function() {
    return 0;
};

/**
 * 创建人物简介窗口
 */
Scene_Status.prototype.createProfileWindow = function() {
    const rect = this.profileWindowRect();
    this._profileWindow = new Window_Help(rect);
    this.addWindow(this._profileWindow);
};

/**
 * 人物简介窗口矩形
 */
Scene_Status.prototype.profileWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.profileHeight();
    const wx = 0;
    const wy = this.mainAreaBottom() - wh;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建状态窗口
 */
Scene_Status.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_Status(rect);
    this._statusWindow.setHandler("cancel", this.popScene.bind(this));
    this._statusWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._statusWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._statusWindow);
};

/**
 * 状态窗口矩形
 */
Scene_Status.prototype.statusWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.statusParamsWindowRect().y - wy;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建状态参数窗口
 */
Scene_Status.prototype.createStatusParamsWindow = function() {
    const rect = this.statusParamsWindowRect();
    this._statusParamsWindow = new Window_StatusParams(rect);
    this.addWindow(this._statusParamsWindow);
};

/**
 * 状态参数窗口矩形
 */
Scene_Status.prototype.statusParamsWindowRect = function() {
    const ww = this.statusParamsWidth();
    const wh = this.statusParamsHeight();
    const wx = 0;
    const wy = this.mainAreaBottom() - this.profileHeight() - wh;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建状态装备窗口
 */
Scene_Status.prototype.createStatusEquipWindow = function() {
    const rect = this.statusEquipWindowRect();
    this._statusEquipWindow = new Window_StatusEquip(rect);
    this.addWindow(this._statusEquipWindow);
};

/**
 * 状态装备窗口矩形
 */
Scene_Status.prototype.statusEquipWindowRect = function() {
    const ww = Graphics.boxWidth - this.statusParamsWidth();
    const wh = this.statusParamsHeight();
    const wx = this.statusParamsWidth();
    const wy = this.mainAreaBottom() - this.profileHeight() - wh;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 状态参数宽度
 */
Scene_Status.prototype.statusParamsWidth = function() {
    return 300;
};

/**
 * 状态参数高度
 */
Scene_Status.prototype.statusParamsHeight = function() {
    return this.calcWindowHeight(6, false);
};

/**
 * 人物简介高度
 */
Scene_Status.prototype.profileHeight = function() {
    return this.calcWindowHeight(2, false);
};

/**
 * 开始
 */
Scene_Status.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this.refreshActor();
};

/**
 * 需要页面按钮
 */
Scene_Status.prototype.needsPageButtons = function() {
    return true;
};

/**
 * 刷新角色
 */
Scene_Status.prototype.refreshActor = function() {
    const actor = this.actor();
    this._profileWindow.setText(actor.profile());
    this._statusWindow.setActor(actor);
    this._statusParamsWindow.setActor(actor);
    this._statusEquipWindow.setActor(actor);
};

/**
 * 当角色改变
 */
Scene_Status.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    this._statusWindow.activate();
};

