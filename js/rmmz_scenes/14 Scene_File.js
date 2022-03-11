//-----------------------------------------------------------------------------
// Scene_File
//
// The superclass of Scene_Save and Scene_Load.

/**
 * 场景文件
 * 
 * 场景存档和场景加载的超类。
 */
function Scene_File() {
    this.initialize(...arguments);
}

Scene_File.prototype = Object.create(Scene_MenuBase.prototype);
Scene_File.prototype.constructor = Scene_File;

/**
 * 初始化
 */
Scene_File.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

/**
 * 创建
 */
Scene_File.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    DataManager.loadAllSavefileImages();
    this.createHelpWindow();
    this.createListWindow();
    this._helpWindow.setText(this.helpWindowText());
};

/**
 * 帮助区域高度
 */
Scene_File.prototype.helpAreaHeight = function() {
    return 0;
};

/**
 * 开始
 */
Scene_File.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._listWindow.refresh();
};

/**
 * 存档文件id
 */
Scene_File.prototype.savefileId = function() {
    return this._listWindow.savefileId();
};

/**
 * 是启用存档文件
 * @param {*} savefileId 
 */
Scene_File.prototype.isSavefileEnabled = function(savefileId) {
    return this._listWindow.isEnabled(savefileId);
};

/**
 * 创建帮助窗口
 */
Scene_File.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
};

/**
 * 帮助窗口矩形
 */
Scene_File.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(1, false);
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建列表窗口
 */
Scene_File.prototype.createListWindow = function() {
    const rect = this.listWindowRect();
    this._listWindow = new Window_SavefileList(rect);
    this._listWindow.setHandler("ok", this.onSavefileOk.bind(this));
    this._listWindow.setHandler("cancel", this.popScene.bind(this));
    this._listWindow.setMode(this.mode(), this.needsAutosave());
    this._listWindow.selectSavefile(this.firstSavefileId());
    this._listWindow.refresh();
    this.addWindow(this._listWindow);
};

/**
 * 列表窗口矩形
 */
Scene_File.prototype.listWindowRect = function() {
    const wx = 0;
    const wy = this.mainAreaTop() + this._helpWindow.height;
    const ww = Graphics.boxWidth;
    const wh = this.mainAreaHeight() - this._helpWindow.height;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 模式
 */
Scene_File.prototype.mode = function() {
    return null;
};

/**
 * 需要自动存档
 */
Scene_File.prototype.needsAutosave = function() {
    return $gameSystem.isAutosaveEnabled();
};

/**
 * 激活列表窗口
 */
Scene_File.prototype.activateListWindow = function() {
    this._listWindow.activate();
};

/**
 * 帮助窗口文字
 */
Scene_File.prototype.helpWindowText = function() {
    return "";
};

/**
 * 第一个存档文件id
 */
Scene_File.prototype.firstSavefileId = function() {
    return 0;
};

/**
 * 在存档文件确定
 */
Scene_File.prototype.onSavefileOk = function() {
    //
};

