//-----------------------------------------------------------------------------
// Scene_Skill
//
// The scene class of the skill screen.

/**
 * 场景技能
 * 
 * 技能画面的场景类别。
 */
function Scene_Skill() {
    this.initialize(...arguments);
}

Scene_Skill.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Skill.prototype.constructor = Scene_Skill;

/**
 * 初始化
 */
Scene_Skill.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};

/**
 * 创建
 */
Scene_Skill.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createSkillTypeWindow();
    this.createStatusWindow();
    this.createItemWindow();
    this.createActorWindow();
};

/**
 * 开始
 */
Scene_Skill.prototype.start = function() {
    Scene_ItemBase.prototype.start.call(this);
    this.refreshActor();
};

/**
 * 创建技能类型窗口
 */
Scene_Skill.prototype.createSkillTypeWindow = function() {
    const rect = this.skillTypeWindowRect();
    this._skillTypeWindow = new Window_SkillType(rect);
    this._skillTypeWindow.setHelpWindow(this._helpWindow);
    this._skillTypeWindow.setHandler("skill", this.commandSkill.bind(this));
    this._skillTypeWindow.setHandler("cancel", this.popScene.bind(this));
    this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
    this._skillTypeWindow.setHandler("pageup", this.previousActor.bind(this));
    this.addWindow(this._skillTypeWindow);
};

/**
 * 技能类型窗口矩形
 */
Scene_Skill.prototype.skillTypeWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(3, true);
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建状态窗口
 */
Scene_Skill.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    this._statusWindow = new Window_SkillStatus(rect);
    this.addWindow(this._statusWindow);
};

/**
 * 状态窗口矩形
 */
Scene_Skill.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth - this.mainCommandWidth();
    const wh = this._skillTypeWindow.height;
    const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建项目窗口
 */
Scene_Skill.prototype.createItemWindow = function() {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_SkillList(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this._skillTypeWindow.setSkillWindow(this._itemWindow);
    this.addWindow(this._itemWindow);
};

/**
 * 项目窗口矩形
 */
Scene_Skill.prototype.itemWindowRect = function() {
    const wx = 0;
    const wy = this._statusWindow.y + this._statusWindow.height;
    const ww = Graphics.boxWidth;
    const wh = this.mainAreaHeight() - this._statusWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 需要页面按钮
 */
Scene_Skill.prototype.needsPageButtons = function() {
    return true;
};

/**
 * 是页面按钮启用
 */
Scene_Skill.prototype.arePageButtonsEnabled = function() {
    return !this.isActorWindowActive();
};

/**
 * 刷新角色
 */
Scene_Skill.prototype.refreshActor = function() {
    const actor = this.actor();
    this._skillTypeWindow.setActor(actor);
    this._statusWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};

/**
 * 使用者
 */
Scene_Skill.prototype.user = function() {
    return this.actor();
};

/**
 * 命令技能
 */
Scene_Skill.prototype.commandSkill = function() {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

/**
 * 当项目确定
 */
Scene_Skill.prototype.onItemOk = function() {
    this.actor().setLastMenuSkill(this.item());
    this.determineItem();
};

/**
 * 当项目取消
 */
Scene_Skill.prototype.onItemCancel = function() {
    this._itemWindow.deselect();
    this._skillTypeWindow.activate();
};

/**
 * 播放se为了项目
 */
Scene_Skill.prototype.playSeForItem = function() {
    SoundManager.playUseSkill();
};

/**
 * 使用项目
 */
Scene_Skill.prototype.useItem = function() {
    Scene_ItemBase.prototype.useItem.call(this);
    this._statusWindow.refresh();
    this._itemWindow.refresh();
};

/**
 * 当角色改变
 */
Scene_Skill.prototype.onActorChange = function() {
    Scene_MenuBase.prototype.onActorChange.call(this);
    this.refreshActor();
    this._itemWindow.deselect();
    this._skillTypeWindow.activate();
};

