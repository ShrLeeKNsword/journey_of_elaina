//-----------------------------------------------------------------------------
// Scene_Name
//
// The scene class of the name input screen.

/**
 * 场景名称
 * 
 * 名称输入画面的场景类。
 */
function Scene_Name() {
    this.initialize(...arguments);
}

Scene_Name.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Name.prototype.constructor = Scene_Name;

/**
 * 初始化
 */
Scene_Name.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

/**
 * 准备
 * @param {number} actorId 角色id
 * @param {number} maxLength 最大长度
 */
Scene_Name.prototype.prepare = function(actorId, maxLength) {
    this._actorId = actorId;
    this._maxLength = maxLength;
};

/**
 * 创建
 */
Scene_Name.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameActors.actor(this._actorId);
    this.createEditWindow();
    this.createInputWindow();
};

/**
 * 开始
 */
Scene_Name.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editWindow.refresh();
};

/**
 * 创建编辑窗口
 */
Scene_Name.prototype.createEditWindow = function() {
    const rect = this.editWindowRect();
    this._editWindow = new Window_NameEdit(rect);
    this._editWindow.setup(this._actor, this._maxLength);
    this.addWindow(this._editWindow);
};

/**
 * 编辑窗口矩形
 */
Scene_Name.prototype.editWindowRect = function() {
    const inputWindowHeight = this.calcWindowHeight(9, true);
    const padding = $gameSystem.windowPadding();
    const ww = 600;
    const wh = ImageManager.faceHeight + padding * 2;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建输入窗口
 */
Scene_Name.prototype.createInputWindow = function() {
    const rect = this.inputWindowRect();
    this._inputWindow = new Window_NameInput(rect);
    this._inputWindow.setEditWindow(this._editWindow);
    this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
    this.addWindow(this._inputWindow);
};

/**
 * 输入窗口矩形
 */
Scene_Name.prototype.inputWindowRect = function() {
    const wx = this._editWindow.x;
    const wy = this._editWindow.y + this._editWindow.height + 8;
    const ww = this._editWindow.width;
    const wh = this.calcWindowHeight(9, true);
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 当输入确定
 */
Scene_Name.prototype.onInputOk = function() {
    this._actor.setName(this._editWindow.name());
    this.popScene();
};

