//-----------------------------------------------------------------------------
// Scene_Gameover
//
// The scene class of the game over screen.

/**
 * 场景游戏终结
 * 
 * 游戏终结画面的场景类别。
 */
function Scene_Gameover() {
    this.initialize(...arguments);
}

Scene_Gameover.prototype = Object.create(Scene_Base.prototype);
Scene_Gameover.prototype.constructor = Scene_Gameover;

/**
 * 初始化
 */
Scene_Gameover.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

/**
 * 创建
 */
Scene_Gameover.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.playGameoverMusic();
    this.createBackground();
};

/**
 * 开始
 */
Scene_Gameover.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this.adjustBackground();
    this.startFadeIn(this.slowFadeSpeed(), false);
};

/**
 * 更新 
 */
Scene_Gameover.prototype.update = function() {
    if (this.isActive() && !this.isBusy() && this.isTriggered()) {
        this.gotoTitle();
    }
    Scene_Base.prototype.update.call(this);
};

/**
 * 停止 
 */
Scene_Gameover.prototype.stop = function() {
    Scene_Base.prototype.stop.call(this);
    this.fadeOutAll();
};

/**
 * 终止
 */
Scene_Gameover.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    AudioManager.stopAll();
};

/**
 * 播放游戏终结音乐
 */
Scene_Gameover.prototype.playGameoverMusic = function() {
    AudioManager.stopBgm();
    AudioManager.stopBgs();
    AudioManager.playMe($dataSystem.gameoverMe);
};

/**
 * 创建背景
 */
Scene_Gameover.prototype.createBackground = function() {
    this._backSprite = new Sprite();
    this._backSprite.bitmap = ImageManager.loadSystem("GameOver");
    this.addChild(this._backSprite);
};

/**
 * 调整背景
 */
Scene_Gameover.prototype.adjustBackground = function() {
    this.scaleSprite(this._backSprite);
    this.centerSprite(this._backSprite);
};

/**
 * 是触发
 */
Scene_Gameover.prototype.isTriggered = function() {
    return Input.isTriggered("ok") || TouchInput.isTriggered();
};

/**
 * 转到标题
 */
Scene_Gameover.prototype.gotoTitle = function() {
    SceneManager.goto(Scene_Title);
};


//-----------------------------------------------------------------------------
