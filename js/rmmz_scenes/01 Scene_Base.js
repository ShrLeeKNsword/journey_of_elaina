//-----------------------------------------------------------------------------
// Scene_Base
//
// The superclass of all scenes within the game.

/**
 * 场景基础
 * 
 * 游戏中所有场景的超类。
 */
function Scene_Base() {
    this.initialize(...arguments);
}

Scene_Base.prototype = Object.create(Stage.prototype);
Scene_Base.prototype.constructor = Scene_Base;
/**
 * 初始化
 */
Scene_Base.prototype.initialize = function() {
    Stage.prototype.initialize.call(this);
    /**
     * 开始的
     */
    this._started = false;
    /**
     * 活动的
     */
    this._active = false;
    /**
     * 淡入淡出标记
     */
    this._fadeSign = 0;
    /**
     * 淡入淡出持续时间
     */
    this._fadeDuration = 0;
    /**
     * 淡入淡出白色
     */
    this._fadeWhite = 0;
    /**
     * 淡入淡出不透明度
     */
    this._fadeOpacity = 0;
    this.createColorFilter();
};

/**
 * 创建
 */
Scene_Base.prototype.create = function() {
    //
};

/**
 * 是活动的
 */
Scene_Base.prototype.isActive = function() {
    return this._active;
};

/**
 * 是准备好的
 */
Scene_Base.prototype.isReady = function() {
    return (
        ImageManager.isReady() &&
        EffectManager.isReady() &&
        FontManager.isReady()
    );
};

/**
 * 开始
 */
/**
 * 开始
 */
Scene_Base.prototype.start = function() {
    this._started = true;
    this._active = true;
};

/**
 * 更新
 */
Scene_Base.prototype.update = function() {
    this.updateFade();
    this.updateColorFilter();
    this.updateChildren();
    AudioManager.checkErrors();
};

/**
 * 停止
 */
Scene_Base.prototype.stop = function() {
    this._active = false;
};

/**
 * 是开始的
 */
Scene_Base.prototype.isStarted = function() {
    return this._started;
};

/**
 * 是忙碌的
 */
Scene_Base.prototype.isBusy = function() {
    return this.isFading();
};

/**
 * 是淡入淡出中
 */
Scene_Base.prototype.isFading = function() {
    return this._fadeDuration > 0;
};

/**
 * 终止
 */
/**
 * 终止
 */
Scene_Base.prototype.terminate = function() {
    //
};

/**
 * 创建窗口层
 */
Scene_Base.prototype.createWindowLayer = function() {
    this._windowLayer = new WindowLayer();
    this._windowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
    this._windowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
    this.addChild(this._windowLayer);
};

/**
 * 添加窗口
 * @param {Window} window 窗口
 */
Scene_Base.prototype.addWindow = function(window) {
    this._windowLayer.addChild(window);
};

/**
 * 开始淡入
 * @param {number} duration 持续时间
 * @param {boolean} white 是白色
 */
Scene_Base.prototype.startFadeIn = function(duration, white) {
    this._fadeSign = 1;
    this._fadeDuration = duration || 30;
    this._fadeWhite = white;
    this._fadeOpacity = 255;
    this.updateColorFilter();
};

/**
 * 开始淡出
 * @param {number} duration 持续时间
 * @param {boolean} white 是白色
 */
Scene_Base.prototype.startFadeOut = function(duration, white) {
    this._fadeSign = -1;
    this._fadeDuration = duration || 30;
    this._fadeWhite = white;
    this._fadeOpacity = 0;
    this.updateColorFilter();
};

/**
 * 创建颜色滤镜
 */
Scene_Base.prototype.createColorFilter = function() {
    this._colorFilter = new ColorFilter();
    this.filters = [this._colorFilter];
};

/**
 * 更新颜色滤镜
 */
Scene_Base.prototype.updateColorFilter = function() {
    const c = this._fadeWhite ? 255 : 0;
    const blendColor = [c, c, c, this._fadeOpacity];
    this._colorFilter.setBlendColor(blendColor);
};

/**
 * 更新淡入淡出
 */
Scene_Base.prototype.updateFade = function() {
    if (this._fadeDuration > 0) {
        const d = this._fadeDuration;
        if (this._fadeSign > 0) {
            this._fadeOpacity -= this._fadeOpacity / d;
        } else {
            this._fadeOpacity += (255 - this._fadeOpacity) / d;
        }
        this._fadeDuration--;
    }
};

/**
 * 更新子
 */
Scene_Base.prototype.updateChildren = function() {
    for (const child of this.children) {
        if (child.update) {
            child.update();
        }
    }
};

/**
 * 移出场景
 */
Scene_Base.prototype.popScene = function() {
    SceneManager.pop();
};

/**
 * 检查游戏结束
 */
Scene_Base.prototype.checkGameover = function() {
    if ($gameParty.isAllDead()) {
        SceneManager.goto(Scene_Gameover);
    }
};

/**
 * 淡出所有
 */
Scene_Base.prototype.fadeOutAll = function() {
    const time = this.slowFadeSpeed() / 60;
    AudioManager.fadeOutBgm(time);
    AudioManager.fadeOutBgs(time);
    AudioManager.fadeOutMe(time);
    this.startFadeOut(this.slowFadeSpeed());
};

/**
 * 淡入淡出速度
 */
Scene_Base.prototype.fadeSpeed = function() {
    return 24;
};

/**
 * 缓慢淡入淡出速度
 */
Scene_Base.prototype.slowFadeSpeed = function() {
    return this.fadeSpeed() * 2;
};

/**
 * 延展精灵
 * @param {Sprite} sprite 精灵
 */
Scene_Base.prototype.scaleSprite = function(sprite) {
    const ratioX = Graphics.width / sprite.bitmap.width;
    const ratioY = Graphics.height / sprite.bitmap.height;
    const scale = Math.max(ratioX, ratioY, 1.0);
    sprite.scale.x = scale;
    sprite.scale.y = scale;
};

/**
 * 居中精灵
 * @param {Sprite} sprite 精灵
 */
Scene_Base.prototype.centerSprite = function(sprite) {
    sprite.x = Graphics.width / 2;
    sprite.y = Graphics.height / 2;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
};

/**
 * 是底部帮助模式
 */
Scene_Base.prototype.isBottomHelpMode = function() {
    return true;
};

/**
 * 是底部按钮模式
 */
Scene_Base.prototype.isBottomButtonMode = function() {
    return false;
};

/**
 * 是右侧输入模式
 */
Scene_Base.prototype.isRightInputMode = function() {
    return true;
};

/**
 * 主要命令宽度
 */
Scene_Base.prototype.mainCommandWidth = function() {
    return 240;
};

/**
 * 按钮区域顶部
 */
Scene_Base.prototype.buttonAreaTop = function() {
    if (this.isBottomButtonMode()) {
        return Graphics.boxHeight - this.buttonAreaHeight();
    } else {
        return 0;
    }
};

/**
 * 按钮区域底部
 */
Scene_Base.prototype.buttonAreaBottom = function() {
    return this.buttonAreaTop() + this.buttonAreaHeight();
};

/**
 * 按钮区域高度
 */
Scene_Base.prototype.buttonAreaHeight = function() {
    return 52;
};

/**
 * 按钮Y
 */
Scene_Base.prototype.buttonY = function() {
    const offsetY = Math.floor((this.buttonAreaHeight() - 48) / 2);
    return this.buttonAreaTop() + offsetY;
};

/**
 * 计算窗口高度
 * @param {number} numLines 行数
 * @param {boolean} selectable 可选择的
 */
Scene_Base.prototype.calcWindowHeight = function(numLines, selectable) {
    if (selectable) {
        return Window_Selectable.prototype.fittingHeight(numLines);
    } else {
        return Window_Base.prototype.fittingHeight(numLines);
    }
};

/**
 * 请求自动保存
 */
Scene_Base.prototype.requestAutosave = function() {
    if (this.isAutosaveEnabled()) {
        this.executeAutosave();
    }
};

/**
 * 已启用自动保存
 */
Scene_Base.prototype.isAutosaveEnabled = function() {
    return (
        !DataManager.isBattleTest() &&
        !DataManager.isEventTest() &&
        $gameSystem.isAutosaveEnabled() &&
        $gameSystem.isSaveEnabled()
    );
};

/**
 * 执行自动保存
 */
Scene_Base.prototype.executeAutosave = function() {
    $gameSystem.onBeforeSave();
    DataManager.saveGame(0)
        .then(() => this.onAutosaveSuccess())
        .catch(() => this.onAutosaveFailure());
};

/**
 * 自动保存成功
 */
Scene_Base.prototype.onAutosaveSuccess = function() {
    //
};

/**
 * 自动保存失败
 */
Scene_Base.prototype.onAutosaveFailure = function() {
    //
};

