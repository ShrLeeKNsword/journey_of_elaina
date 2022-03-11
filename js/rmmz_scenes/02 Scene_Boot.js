//-----------------------------------------------------------------------------
// Scene_Boot
//
// The scene class for initializing the entire game.

/**
 * 场景启动
 * 
 * 用于初始化整个游戏的场景类。
 */
function Scene_Boot() {
    this.initialize(...arguments);
}

Scene_Boot.prototype = Object.create(Scene_Base.prototype);
Scene_Boot.prototype.constructor = Scene_Boot;

/**
 * 初始化
 */
Scene_Boot.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
    /**
     * 数据库已加载
     */
    this._databaseLoaded = false;
};

/**
 * 创建
 */
Scene_Boot.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    DataManager.loadDatabase();
    StorageManager.updateForageKeys();
};

/**
 * 是准备好
 */
Scene_Boot.prototype.isReady = function() {
    if (!this._databaseLoaded) {
        if (
            DataManager.isDatabaseLoaded() &&
            StorageManager.forageKeysUpdated()
        ) {
            this._databaseLoaded = true;
            this.onDatabaseLoaded();
        }
        return false;
    }
    return Scene_Base.prototype.isReady.call(this) && this.isPlayerDataLoaded();
};

/**
 * 当数据库加载后
 */
Scene_Boot.prototype.onDatabaseLoaded = function() {
    this.setEncryptionInfo();
    this.loadSystemImages();
    this.loadPlayerData();
    this.loadGameFonts();
};

/**
 * 设置加密信息
 */
Scene_Boot.prototype.setEncryptionInfo = function() {
    const hasImages = $dataSystem.hasEncryptedImages;
    const hasAudio = $dataSystem.hasEncryptedAudio;
    const key = $dataSystem.encryptionKey;
    Utils.setEncryptionInfo(hasImages, hasAudio, key);
};

/**
 * 加载系统映像
 */
Scene_Boot.prototype.loadSystemImages = function() {
    ColorManager.loadWindowskin();
    ImageManager.loadSystem("IconSet");
};

/**
 * 加载玩家数据
 */
Scene_Boot.prototype.loadPlayerData = function() {
    DataManager.loadGlobalInfo();
    ConfigManager.load();
};

/**
 * 加载游戏字体
 */
Scene_Boot.prototype.loadGameFonts = function() {
    const advanced = $dataSystem.advanced;
    FontManager.load("rmmz-mainfont", advanced.mainFontFilename);
    FontManager.load("rmmz-numberfont", advanced.numberFontFilename);
};

/**
 * 是播放器数据已加载
 */
Scene_Boot.prototype.isPlayerDataLoaded = function() {
    return DataManager.isGlobalInfoLoaded() && ConfigManager.isLoaded();
};

/**
 * 开始
 */
Scene_Boot.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SoundManager.preloadImportantSounds();
    if (DataManager.isBattleTest()) {
        DataManager.setupBattleTest();
        SceneManager.goto(Scene_Battle);
    } else if (DataManager.isEventTest()) {
        DataManager.setupEventTest();
        SceneManager.goto(Scene_Map);
    } else {
        this.startNormalGame();
    }
    this.resizeScreen();
    this.updateDocumentTitle();
};

/**
 * 开始普通游戏
 */
Scene_Boot.prototype.startNormalGame = function() {
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    SceneManager.goto(Scene_Title);
    Window_TitleCommand.initCommandPosition();
};

/**
 * 调整屏幕大小
 */
Scene_Boot.prototype.resizeScreen = function() {
    const screenWidth = $dataSystem.advanced.screenWidth;
    const screenHeight = $dataSystem.advanced.screenHeight;
    Graphics.resize(screenWidth, screenHeight);
    this.adjustBoxSize();
    this.adjustWindow();
};

/**
 * 调整盒子尺寸
 */
Scene_Boot.prototype.adjustBoxSize = function() {
    const uiAreaWidth = $dataSystem.advanced.uiAreaWidth;
    const uiAreaHeight = $dataSystem.advanced.uiAreaHeight;
    const boxMargin = 4;
    Graphics.boxWidth = uiAreaWidth - boxMargin * 2;
    Graphics.boxHeight = uiAreaHeight - boxMargin * 2;
};

/**
 * 调整窗口
 */
Scene_Boot.prototype.adjustWindow = function() {
    if (Utils.isNwjs()) {
        const xDelta = Graphics.width - window.innerWidth;
        const yDelta = Graphics.height - window.innerHeight;
        window.moveBy(-xDelta / 2, -yDelta / 2);
        window.resizeBy(xDelta, yDelta);
    }
};

/**
 * 更新文件标题
 */
Scene_Boot.prototype.updateDocumentTitle = function() {
    document.title = $dataSystem.gameTitle;
};

/**
 * 检查玩家位置
 */
Scene_Boot.prototype.checkPlayerLocation = function() {
    if ($dataSystem.startMapId === 0) {
        throw new Error("Player's starting position is not set");
    }
};

