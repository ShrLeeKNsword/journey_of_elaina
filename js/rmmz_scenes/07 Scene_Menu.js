//-----------------------------------------------------------------------------
// Scene_Menu
//
// The scene class of the menu screen.

/**
 * 场景菜单
 * 
 * 菜单屏幕的场景类别。
 */
function Scene_Menu() {
    this.initialize(...arguments);
}

Scene_Menu.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Menu.prototype.constructor = Scene_Menu;

/**
 * 初始化
 */
Scene_Menu.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

/**
 * 帮助区域高度
 */
Scene_Menu.prototype.helpAreaHeight = function() {
    return 0;
};

/**
 * 创建
 */
Scene_Menu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
    this.createGoldWindow();
    this.createStatusWindow();
};

/**
 * 开始
 */
Scene_Menu.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._statusWindow.refresh();
};

/**
 * 创建命令窗口
 */
Scene_Menu.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    const commandWindow = new Window_MenuCommand(rect);
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("skill", this.commandPersonal.bind(this));
    commandWindow.setHandler("equip", this.commandPersonal.bind(this));
    commandWindow.setHandler("status", this.commandPersonal.bind(this));
    commandWindow.setHandler("formation", this.commandFormation.bind(this));
    commandWindow.setHandler("options", this.commandOptions.bind(this));
    commandWindow.setHandler("save", this.commandSave.bind(this));
    commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
    commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(commandWindow);
    /** 命令窗口 */
    this._commandWindow = commandWindow;
};

/**
 * 命令窗口矩形
 */
Scene_Menu.prototype.commandWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.mainAreaHeight() - this.goldWindowRect().height;
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建金钱窗口
 */
Scene_Menu.prototype.createGoldWindow = function() {
    const rect = this.goldWindowRect();
    /** 金钱窗口 */
    this._goldWindow = new Window_Gold(rect);
    this.addWindow(this._goldWindow);
};

/**
 * 金钱窗口矩形
 */
Scene_Menu.prototype.goldWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(1, true);
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = this.mainAreaBottom() - wh;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建状态窗口
 */
Scene_Menu.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    /** 状态窗口 */
    this._statusWindow = new Window_MenuStatus(rect);
    this.addWindow(this._statusWindow);
};

/**
 * 状态窗口矩形
 */
Scene_Menu.prototype.statusWindowRect = function() {
    const ww = Graphics.boxWidth - this.mainCommandWidth();
    const wh = this.mainAreaHeight();
    const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 命令物品
 */
Scene_Menu.prototype.commandItem = function() {
    SceneManager.push(Scene_Item);
};

/**
 * 命令个人
 */
Scene_Menu.prototype.commandPersonal = function() {
    this._statusWindow.setFormationMode(false);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler("ok", this.onPersonalOk.bind(this));
    this._statusWindow.setHandler("cancel", this.onPersonalCancel.bind(this));
};

/**
 * 命令编队
 */
Scene_Menu.prototype.commandFormation = function() {
    this._statusWindow.setFormationMode(true);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
    this._statusWindow.setHandler("cancel", this.onFormationCancel.bind(this));
};

/**
 * 命令选项
 */
Scene_Menu.prototype.commandOptions = function() {
    SceneManager.push(Scene_Options);
};

/**
 * 命令保存
 */
Scene_Menu.prototype.commandSave = function() {
    SceneManager.push(Scene_Save);
};

/**
 * 命令游戏结束
 */
Scene_Menu.prototype.commandGameEnd = function() {
    SceneManager.push(Scene_GameEnd);
};

/**
 * 当个人确定
 */
Scene_Menu.prototype.onPersonalOk = function() {
    switch (this._commandWindow.currentSymbol()) {
        case "skill":
            SceneManager.push(Scene_Skill);
            break;
        case "equip":
            SceneManager.push(Scene_Equip);
            break;
        case "status":
            SceneManager.push(Scene_Status);
            break;
    }
};

/**
 * 当个人取消
 */
Scene_Menu.prototype.onPersonalCancel = function() {
    this._statusWindow.deselect();
    this._commandWindow.activate();
};

/**
 * 当编队确定
 */
Scene_Menu.prototype.onFormationOk = function() {
    const index = this._statusWindow.index();
    const pendingIndex = this._statusWindow.pendingIndex();
    if (pendingIndex >= 0) {
        $gameParty.swapOrder(index, pendingIndex);
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.redrawItem(index);
    } else {
        this._statusWindow.setPendingIndex(index);
    }
    this._statusWindow.activate();
};

/**
 * 当编队取消
 */
Scene_Menu.prototype.onFormationCancel = function() {
    if (this._statusWindow.pendingIndex() >= 0) {
        this._statusWindow.setPendingIndex(-1);
        this._statusWindow.activate();
    } else {
        this._statusWindow.deselect();
        this._commandWindow.activate();
    }
};

