//-----------------------------------------------------------------------------
// Scene_Save
//
// The scene class of the save screen.

/**
 * 场景存档
 * 
 * 存档画面的场景类别。
 */
function Scene_Save() {
    this.initialize(...arguments);
}

Scene_Save.prototype = Object.create(Scene_File.prototype);
Scene_Save.prototype.constructor = Scene_Save;

/**
 * 初始化
 */
Scene_Save.prototype.initialize = function() {
    Scene_File.prototype.initialize.call(this);
};

/**
 * 模式
 */
Scene_Save.prototype.mode = function() {
    return "save";
};

/**
 * 帮助窗口文字
 */
Scene_Save.prototype.helpWindowText = function() {
    return TextManager.saveMessage;
};

/**
 * 第一个存档文件ID
 */
Scene_Save.prototype.firstSavefileId = function() {
    return $gameSystem.savefileId();
};

/**
 * 当存档文件确定
 */
Scene_Save.prototype.onSavefileOk = function() {
    Scene_File.prototype.onSavefileOk.call(this);
    const savefileId = this.savefileId();
    if (this.isSavefileEnabled(savefileId)) {
        this.executeSave(savefileId);
    } else {
        this.onSaveFailure();
    }
};

/**
 * 执行存档
 * @param {*} savefileId 
 */
Scene_Save.prototype.executeSave = function(savefileId) {
    $gameSystem.setSavefileId(savefileId);
    $gameSystem.onBeforeSave();
    DataManager.saveGame(savefileId)
        .then(() => this.onSaveSuccess())
        .catch(() => this.onSaveFailure());
};

/**
 * 当存档成功
 */
Scene_Save.prototype.onSaveSuccess = function() {
    SoundManager.playSave();
    this.popScene();
};

/**
 * 当存档失败
 */
Scene_Save.prototype.onSaveFailure = function() {
    SoundManager.playBuzzer();
    this.activateListWindow();
};

