//-----------------------------------------------------------------------------
// Scene_Title
//
// The scene class of the title screen.

/**
 * 场景标题
 * 
 * 标题画面的场景类。
 */
function Scene_Title() {
    this.initialize(...arguments);
}

Scene_Title.prototype = Object.create(Scene_Base.prototype);
Scene_Title.prototype.constructor = Scene_Title;

/**
 * 初始化
 */
Scene_Title.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

/**
 * 创建
 */
Scene_Title.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createForeground();
    this.createWindowLayer();
    this.createCommandWindow();
};

/**
 * 开始
 */
Scene_Title.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    SceneManager.clearStack();
    this.adjustBackground();
    this.playTitleMusic();
    this.startFadeIn(this.fadeSpeed(), false);
};

/**
 * 更新 
 */
Scene_Title.prototype.update = function() {
    if (!this.isBusy()) {
        this._commandWindow.open();
    }
    Scene_Base.prototype.update.call(this);
};

/**
 * 是忙碌
 */
Scene_Title.prototype.isBusy = function() {
    return (
        this._commandWindow.isClosing() ||
        Scene_Base.prototype.isBusy.call(this)
    );
};

/**
 * 终止
 */
Scene_Title.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    SceneManager.snapForBackground();
    if (this._gameTitleSprite) {
        this._gameTitleSprite.bitmap.destroy();
    }
};

/**
 * 创建背景
 */
Scene_Title.prototype.createBackground = function() {
    this._backSprite1 = new Sprite(
        ImageManager.loadTitle1($dataSystem.title1Name)
    );
    this._backSprite2 = new Sprite(
        ImageManager.loadTitle2($dataSystem.title2Name)
    );
    this.addChild(this._backSprite1);
    this.addChild(this._backSprite2);
};

/**
 * 创建前景
 */
Scene_Title.prototype.createForeground = function() {
    this._gameTitleSprite = new Sprite(
        new Bitmap(Graphics.width, Graphics.height)
    );
    this.addChild(this._gameTitleSprite);
    if ($dataSystem.optDrawTitle) {
        this.drawGameTitle();
    }
};

/**
 * 绘制游戏标题
 */
Scene_Title.prototype.drawGameTitle = function() {
    const x = 20;
    const y = Graphics.height / 4;
    const maxWidth = Graphics.width - x * 2;
    const text = $dataSystem.gameTitle;
    const bitmap = this._gameTitleSprite.bitmap;
    bitmap.fontFace = $gameSystem.mainFontFace();
    bitmap.outlineColor = "black";
    bitmap.outlineWidth = 8;
    bitmap.fontSize = 72;
    bitmap.drawText(text, x, y, maxWidth, 48, "center");
};

/**
 * 调整背景
 */
Scene_Title.prototype.adjustBackground = function() {
    this.scaleSprite(this._backSprite1);
    this.scaleSprite(this._backSprite2);
    this.centerSprite(this._backSprite1);
    this.centerSprite(this._backSprite2);
};

/**
 * 创建命令窗口
 */
Scene_Title.prototype.createCommandWindow = function() {
    const background = $dataSystem.titleCommandWindow.background;
    const rect = this.commandWindowRect();
    this._commandWindow = new Window_TitleCommand(rect);
    this._commandWindow.setBackgroundType(background);
    this._commandWindow.setHandler("newGame", this.commandNewGame.bind(this));
    this._commandWindow.setHandler("continue", this.commandContinue.bind(this));
    this._commandWindow.setHandler("options", this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);
};

/**
 * 命令窗口矩形
 */
Scene_Title.prototype.commandWindowRect = function() {
    const offsetX = $dataSystem.titleCommandWindow.offsetX;
    const offsetY = $dataSystem.titleCommandWindow.offsetY;
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(3, true);
    const wx = (Graphics.boxWidth - ww) / 2 + offsetX;
    const wy = Graphics.boxHeight - wh - 96 + offsetY;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 命令新游戏
 */
Scene_Title.prototype.commandNewGame = function() {
    DataManager.setupNewGame();
    this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};

/**
 * 命令继续
 */
Scene_Title.prototype.commandContinue = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_Load);
};

/**
 * 命令选项
 */
Scene_Title.prototype.commandOptions = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_Options);
};

/**
 * 播放标题音乐
 */
Scene_Title.prototype.playTitleMusic = function() {
    AudioManager.playBgm($dataSystem.titleBgm);
    AudioManager.stopBgs();
    AudioManager.stopMe();
};

