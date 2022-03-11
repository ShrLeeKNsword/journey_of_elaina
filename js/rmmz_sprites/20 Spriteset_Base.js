//-----------------------------------------------------------------------------
// Spriteset_Base
//
// The superclass of Spriteset_Map and Spriteset_Battle.

/**
 * 精灵组基地
 * 
 * Spriteset Map和Spriteset Battle的超类。
 * 
 * @mz 把原本mv中动画显示的处理放到了这里
 */
function Spriteset_Base() {
    this.initialize(...arguments);
}

Spriteset_Base.prototype = Object.create(Sprite.prototype);
Spriteset_Base.prototype.constructor = Spriteset_Base;

/**初始化 */
Spriteset_Base.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.setFrame(0, 0, Graphics.width, Graphics.height);
    this.loadSystemImages();
    this.createLowerLayer();
    this.createUpperLayer();
    this._animationSprites = [];
};

/**
 * 销毁
 * @param {*} options 
 */
Spriteset_Base.prototype.destroy = function(options) {
    this.removeAllAnimations();
    Sprite.prototype.destroy.call(this, options);
};

/**
 * 加载系统图像
 * 
 * @mz 新增
 */
Spriteset_Base.prototype.loadSystemImages = function() {
    //
};

/**创建较下的层 */
Spriteset_Base.prototype.createLowerLayer = function() {
    this.createBaseSprite();
    this.createBaseFilters();
};

/**创建上面的层 */
Spriteset_Base.prototype.createUpperLayer = function() {
    this.createPictures();
    this.createTimer();
    this.createOverallFilters();
};

/**
 * 更新 
 */
Spriteset_Base.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBaseFilters();
    this.updateOverallFilters();
    this.updatePosition();
    this.updateAnimations();
};

/**创建基础精灵 */
Spriteset_Base.prototype.createBaseSprite = function() {
    this._baseSprite = new Sprite();
    this._blackScreen = new ScreenSprite();
    this._blackScreen.opacity = 255;
    this.addChild(this._baseSprite);
    this._baseSprite.addChild(this._blackScreen);
};

/**创建基本过滤器
 * @mz 使用了ColorFilter,代替 mv中的 createToneChanger
 */
Spriteset_Base.prototype.createBaseFilters = function() {
    this._baseSprite.filters = [];
    this._baseColorFilter = new ColorFilter();
    this._baseSprite.filters.push(this._baseColorFilter);
};

/**创建图片组 */
Spriteset_Base.prototype.createPictures = function() {
    const rect = this.pictureContainerRect();
    this._pictureContainer = new Sprite();
    this._pictureContainer.setFrame(rect.x, rect.y, rect.width, rect.height);
    for (let i = 1; i <= $gameScreen.maxPictures(); i++) {
        this._pictureContainer.addChild(new Sprite_Picture(i));
    }
    this.addChild(this._pictureContainer);
};

/**
 * 图片内容矩形
 */
Spriteset_Base.prototype.pictureContainerRect = function() {
    return new Rectangle(0, 0, Graphics.width, Graphics.height);
};

/**创建计时器 */
Spriteset_Base.prototype.createTimer = function() {
    this._timerSprite = new Sprite_Timer();
    this.addChild(this._timerSprite);
};

/**
 * 创建整体过滤器
 * @mz 代替 mv中的createScreenSprites效果
 */
Spriteset_Base.prototype.createOverallFilters = function() {
    this.filters = [];
    this._overallColorFilter = new ColorFilter();
    this.filters.push(this._overallColorFilter);
};

/**
 * 更新基础过滤器
 */
Spriteset_Base.prototype.updateBaseFilters = function() {
    const filter = this._baseColorFilter;
    filter.setColorTone($gameScreen.tone());
};

/**
 * 更新整体过滤器
 */
Spriteset_Base.prototype.updateOverallFilters = function() {
    const filter = this._overallColorFilter;
    filter.setBlendColor($gameScreen.flashColor());
    filter.setBrightness($gameScreen.brightness());
};

/**
 * 更新位置
 */
Spriteset_Base.prototype.updatePosition = function() {
    const screen = $gameScreen;
    const scale = screen.zoomScale();
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = Math.round(-screen.zoomX() * (scale - 1));
    this.y = Math.round(-screen.zoomY() * (scale - 1));
    this.x += Math.round(screen.shake());
};

/**
 * 寻找目标精灵
 */
Spriteset_Base.prototype.findTargetSprite = function(/*target*/) {
    return null;
};

/**
 * 更新动画
 */
Spriteset_Base.prototype.updateAnimations = function() {
    for (const sprite of this._animationSprites) {
        if (!sprite.isPlaying()) {
            this.removeAnimation(sprite);
        }
    }
    this.processAnimationRequests();
};

/**
 * 处理动画请求
 */
Spriteset_Base.prototype.processAnimationRequests = function() {
    for (;;) {
        const request = $gameTemp.retrieveAnimation();
        if (request) {
            this.createAnimation(request);
        } else {
            break;
        }
    }
};

/**
 * 创建动画
 * @param {*} request 
 */
Spriteset_Base.prototype.createAnimation = function(request) {
    const animation = $dataAnimations[request.animationId];
    const targets = request.targets;
    const mirror = request.mirror;
    let delay = this.animationBaseDelay();
    const nextDelay = this.animationNextDelay();
    if (this.isAnimationForEach(animation)) {
        for (const target of targets) {
            this.createAnimationSprite([target], animation, mirror, delay);
            delay += nextDelay;
        }
    } else {
        this.createAnimationSprite(targets, animation, mirror, delay);
    }
};

/**
 * 创建动画精灵
 * @param {*} targets 
 * @param {*} animation 
 * @param {*} mirror 
 * @param {*} delay 
 */
// prettier-ignore
Spriteset_Base.prototype.createAnimationSprite = function(
    targets, animation, mirror, delay
) {
    const mv = this.isMVAnimation(animation);
    const sprite = new (mv ? Sprite_AnimationMV : Sprite_Animation)();
    const targetSprites = this.makeTargetSprites(targets);
    const baseDelay = this.animationBaseDelay();
    const previous = delay > baseDelay ? this.lastAnimationSprite() : null;
    if (this.animationShouldMirror(targets[0])) {
        mirror = !mirror;
    }
    sprite.targetObjects = targets;
    sprite.setup(targetSprites, animation, mirror, delay, previous);
    this._effectsContainer.addChild(sprite);
    this._animationSprites.push(sprite);
};

/**
 * 是MV动画
 * @param {*} animation 
 */
Spriteset_Base.prototype.isMVAnimation = function(animation) {
    return !!animation.frames;
};

/**
 * 制作目标精灵组
 * @param {*} targets 
 */
Spriteset_Base.prototype.makeTargetSprites = function(targets) {
    const targetSprites = [];
    for (const target of targets) {
        const targetSprite = this.findTargetSprite(target);
        if (targetSprite) {
            targetSprites.push(targetSprite);
        }
    }
    return targetSprites;
};

/**
 * 最后的动画精灵
 */
Spriteset_Base.prototype.lastAnimationSprite = function() {
    return this._animationSprites[this._animationSprites.length - 1];
};

/**
 * 是动画对于所有人
 * @param {*} animation 
 */
Spriteset_Base.prototype.isAnimationForEach = function(animation) {
    const mv = this.isMVAnimation(animation);
    return mv ? animation.position !== 3 : animation.displayType === 0;
};

/**
 * 动画基本延迟
 */
Spriteset_Base.prototype.animationBaseDelay = function() {
    return 8;
};

/**
 * 动画下一个延迟
 */
Spriteset_Base.prototype.animationNextDelay = function() {
    return 12;
};

/**
 * 动画应该镜像
 * @param {*} target 
 */
Spriteset_Base.prototype.animationShouldMirror = function(target) {
    return target && target.isActor && target.isActor();
};

/**
 * 删除动画
 * @param {*} sprite 
 */
Spriteset_Base.prototype.removeAnimation = function(sprite) {
    this._animationSprites.remove(sprite);
    this._effectsContainer.removeChild(sprite);
    for (const target of sprite.targetObjects) {
        if (target.endAnimation) {
            target.endAnimation();
        }
    }
    sprite.destroy();
};

/**
 * 删除所有动画
 */
Spriteset_Base.prototype.removeAllAnimations = function() {
    for (const sprite of this._animationSprites) {
        this.removeAnimation(sprite);
    }
};

/**
 * 是正在播放动画
 */
Spriteset_Base.prototype.isAnimationPlaying = function() {
    return this._animationSprites.length > 0;
};

