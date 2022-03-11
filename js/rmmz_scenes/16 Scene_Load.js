//-----------------------------------------------------------------------------
// Scene_Load
//
// The scene class of the load screen.

/**
 * 场景读档
 * 
 * 读档画面的场景类别。
 */
function Scene_Load() {
    this.initialize(...arguments);
}

Scene_Load.prototype = Object.create(Scene_File.prototype);
Scene_Load.prototype.constructor = Scene_Load;

/**
 * 初始化
 */
Scene_Load.prototype.initialize = function() {
    Scene_File.prototype.initialize.call(this);
    this._loadSuccess = false;
};

/**
 * 终止
 */
Scene_Load.prototype.terminate = function() {
    Scene_File.prototype.terminate.call(this);
    if (this._loadSuccess) {
        $gameSystem.onAfterLoad();
    }
};

/**
 * 模式
 */
Scene_Load.prototype.mode = function() {
    return "load";
};

/**
 * 帮助窗口文字
 */
Scene_Load.prototype.helpWindowText = function() {
    return TextManager.loadMessage;
};

/**
 * 第一个存档文件ID
 */
Scene_Load.prototype.firstSavefileId = function() {
    return DataManager.latestSavefileId();
};

/**
 * 在存档文件上确定
 */
Scene_Load.prototype.onSavefileOk = function() {
    Scene_File.prototype.onSavefileOk.call(this);
    const savefileId = this.savefileId();
    if (this.isSavefileEnabled(savefileId)) {
        this.executeLoad(savefileId);
    } else {
        this.onLoadFailure();
    }
};

/**
 * 执行加载
 * @param {number} savefileId 存档文件ID
 */
Scene_Load.prototype.executeLoad = function(savefileId) {
    DataManager.loadGame(savefileId)
        .then(() => this.onLoadSuccess())
        .catch(() => this.onLoadFailure());
};

/**
 * 当加载成功
 */
Scene_Load.prototype.onLoadSuccess = function() {
    SoundManager.playLoad();
    this.fadeOutAll();
    this.reloadMapIfUpdated();
    SceneManager.goto(Scene_Map);
    this._loadSuccess = true;
};

/**
 * 当加载失败
 */
Scene_Load.prototype.onLoadFailure = function() {
    SoundManager.playBuzzer();
    this.activateListWindow();
};

/**
 * 重新加载地图（如果已更新）
 */
Scene_Load.prototype.reloadMapIfUpdated = function() {
    if ($gameSystem.versionId() !== $dataSystem.versionId) {
        const mapId = $gameMap.mapId();
        const x = $gamePlayer.x;
        const y = $gamePlayer.y;
        $gamePlayer.reserveTransfer(mapId, x, y);
        $gamePlayer.requestMapReload();
    }
};

