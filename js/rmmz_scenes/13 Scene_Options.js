//-----------------------------------------------------------------------------
// Scene_Options
//
// The scene class of the options screen.

/**
 * 场景选项
 * 
 * 选项画面的场景类。
 */
function Scene_Options() {
    this.initialize(...arguments);
}

Scene_Options.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Options.prototype.constructor = Scene_Options;

/**
 * 初始化
 */
Scene_Options.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

/**
 * 创建
 */
Scene_Options.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
};

/**
 * 终止
 */
Scene_Options.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
};

/**
 * 创建选项窗口
 */
Scene_Options.prototype.createOptionsWindow = function() {
    const rect = this.optionsWindowRect();
    this._optionsWindow = new Window_Options(rect);
    this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
};

/**
 * 选项窗口矩形
 */
Scene_Options.prototype.optionsWindowRect = function() {
    const n = Math.min(this.maxCommands(), this.maxVisibleCommands());
    const ww = 400;
    const wh = this.calcWindowHeight(n, true);
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = (Graphics.boxHeight - wh) / 2;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 最大命令数
 */
Scene_Options.prototype.maxCommands = function() {
    // Increase this value when adding option items.
    // 添加选项项目时增加此值。
    return 7;
};

/**
 * 最大可见命令数
 */
Scene_Options.prototype.maxVisibleCommands = function() {
    return 12;
};

