//-----------------------------------------------------------------------------
// Scene_GameEnd
//
// The scene class of the game end screen.

/**
 * 场景游戏结束
 * 
 * 游戏结束画面的场景类别。
 */
function Scene_GameEnd() {
    this.initialize(...arguments);
}

Scene_GameEnd.prototype = Object.create(Scene_MenuBase.prototype);
Scene_GameEnd.prototype.constructor = Scene_GameEnd;

/**
 * 初始化
 */
Scene_GameEnd.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

/**
 * 创建
 */
Scene_GameEnd.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
};

/**
 * 停止
 */
Scene_GameEnd.prototype.stop = function() {
    Scene_MenuBase.prototype.stop.call(this);
    this._commandWindow.close();
};

/**
 * 创建背景
 */
Scene_GameEnd.prototype.createBackground = function() {
    Scene_MenuBase.prototype.createBackground.call(this);
    this.setBackgroundOpacity(128);
};

/**
 * 创建命令窗口
 */
Scene_GameEnd.prototype.createCommandWindow = function() {
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_GameEnd(rect);
    this._commandWindow.setHandler("toTitle", this.commandToTitle.bind(this));
    this._commandWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};

/**
 * 命令窗口矩形
 */
Scene_GameEnd.prototype.commandWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(2, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 命令到标题
 */
Scene_GameEnd.prototype.commandToTitle = function() {
    this.fadeOutAll();
    SceneManager.goto(Scene_Title);
    Window_TitleCommand.initCommandPosition();
};

