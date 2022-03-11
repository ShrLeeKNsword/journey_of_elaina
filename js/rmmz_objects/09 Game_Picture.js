//-----------------------------------------------------------------------------
// Game_Picture
//
// The game object class for a picture.

/**
 * 游戏图片
 * 
 * 图片的游戏对象类。
 */
function Game_Picture() {
    this.initialize(...arguments);
}

/**
 * 初始化
 */
Game_Picture.prototype.initialize = function() {
    this.initBasic();
    this.initTarget();
    this.initTone();
    this.initRotation();
};

/**
 * 名称
 */
Game_Picture.prototype.name = function() {
    return this._name;
};

/**
 * 原点
 */
Game_Picture.prototype.origin = function() {
    return this._origin;
};

/**
 * x坐标
 */
Game_Picture.prototype.x = function() {
    return this._x;
};

/**
 * y坐标
 */
Game_Picture.prototype.y = function() {
    return this._y;
};

/**
 * 比例x
 */
Game_Picture.prototype.scaleX = function() {
    return this._scaleX;
};

/**
 * 比例y
 */
Game_Picture.prototype.scaleY = function() {
    return this._scaleY;
};

/**
 * 不透明度 
 */
Game_Picture.prototype.opacity = function() {
    return this._opacity;
};

/**
 * 合成模式
 */
Game_Picture.prototype.blendMode = function() {
    return this._blendMode;
};

/**
 * 色调
 */
Game_Picture.prototype.tone = function() {
    return this._tone;
};

/**
 * 角度
 */
Game_Picture.prototype.angle = function() {
    return this._angle;
};

/**
 * 初始化基础
 */
Game_Picture.prototype.initBasic = function() {
    /**
     * 名称
     * @type {string}
     */
    this._name = "";
    /**
     * 原点
     * @type {number}
     */
    this._origin = 0;
    /**
     * x坐标
     * @type {number}
     */
    this._x = 0;
    /**
     * y坐标
     * @type {number}
     */
    this._y = 0;
    /**
     * 比例x
     * @type {number}
     */
    this._scaleX = 100;
    /**
     * 比例y
     * @type {number}
     */
    this._scaleY = 100;
    /**
     * 不透明度
     * @type {number}
     */
    this._opacity = 255;
    /**
     * 合成模式
     * @type {number}
     */
    this._blendMode = 0;
};

Game_Picture.prototype.initTarget = function() {
    /**
     * 目标x
     * @type {number}
     */
    this._targetX = this._x;
    /**
     * 目标y
     * @type {number}
     */
    this._targetY = this._y;
    /**
     * 目标比例x
     * @type {number}
     */
    this._targetScaleX = this._scaleX;
    /**
     * 目标比例y
     * @type {number}
     */
    this._targetScaleY = this._scaleY;
    /**
     * 目标不透明度
     * @type {number}
     */
    this._targetOpacity = this._opacity;
    /**
     * 持续时间
     * @type {number}
     */
    this._duration = 0;
    /**
     * 整个持续时间
     * @type {number}
     */
    this._wholeDuration = 0;
    /**
     * 缓动种类
     * @type {number}
     */
    this._easingType = 0;
    /**
     * 缓动指数
     * @type {number}
     */
    this._easingExponent = 0;
};

/**
 * 初始化色调
 */
Game_Picture.prototype.initTone = function() {
    /**
     * 色调
     */
    this._tone = null;
    /**
     * 色调目标
     */
    this._toneTarget = null;
    /**
     * 色调持续时间
     * @type {number}
     */
    this._toneDuration = 0;
};

/**
 * 初始化旋转
 */
Game_Picture.prototype.initRotation = function() {
    /**
     * 角度
     * @type {number}
     */
    this._angle = 0;
    /**
     * 旋转速度
     * @type {number}
     */
    this._rotationSpeed = 0;
};

// prettier-ignore
/**
 * 显示
 * @param {string} name 名称
 * @param {numebr} origin 原点
 * @param {numebr} x x坐标
 * @param {numebr} y y坐标
 * @param {numebr} scaleX 比例x
 * @param {numebr} scaleY 比例y
 * @param {numebr} opacity 不透明度
 * @param {numebr} blendMode 合成模式
 */
Game_Picture.prototype.show = function(
    name, origin, x, y, scaleX, scaleY, opacity, blendMode
) {
    this._name = name;
    this._origin = origin;
    this._x = x;
    this._y = y;
    this._scaleX = scaleX;
    this._scaleY = scaleY;
    this._opacity = opacity;
    this._blendMode = blendMode;
    this.initTarget();
    this.initTone();
    this.initRotation();
};

// prettier-ignore
/**
 * 移动 
 * @param {numebr} origin 原点
 * @param {numebr} x x坐标
 * @param {numebr} y y坐标
 * @param {numebr} scaleX 比例x
 * @param {numebr} scaleY 比例y
 * @param {numebr} opacity 不透明度
 * @param {numebr} blendMode 合成模式
 * @param {number} duration 持续时间
 * @param {0|1|2|3} easingType 缓动类型 0正常, 1缓入 , 2缓出 , 3缓入缓出
 */
Game_Picture.prototype.move = function(
    origin, x, y, scaleX, scaleY, opacity, blendMode, duration, easingType
) {
    this._origin = origin;
    this._targetX = x;
    this._targetY = y;
    this._targetScaleX = scaleX;
    this._targetScaleY = scaleY;
    this._targetOpacity = opacity;
    this._blendMode = blendMode;
    this._duration = duration;
    this._wholeDuration = duration;
    this._easingType = easingType;
    this._easingExponent = 2;
};

/**
 * 旋转
 * @param {number} speed 速度
 */
Game_Picture.prototype.rotate = function(speed) {
    this._rotationSpeed = speed;
};

/**
 * 着色 
 * @param {[number,number,number,number]} tone 目标色调
 * @param {number} duration 持续时间
 */
Game_Picture.prototype.tint = function(tone, duration) {
    if (!this._tone) {
        this._tone = [0, 0, 0, 0];
    }
    this._toneTarget = tone.clone();
    this._toneDuration = duration;
    if (this._toneDuration === 0) {
        this._tone = this._toneTarget.clone();
    }
};

/**
 * 更新
 */
Game_Picture.prototype.update = function() {
    this.updateMove();
    this.updateTone();
    this.updateRotation();
};

/**
 * 更新移动
 */
Game_Picture.prototype.updateMove = function() {
    if (this._duration > 0) {
        this._x = this.applyEasing(this._x, this._targetX);
        this._y = this.applyEasing(this._y, this._targetY);
        this._scaleX = this.applyEasing(this._scaleX, this._targetScaleX);
        this._scaleY = this.applyEasing(this._scaleY, this._targetScaleY);
        this._opacity = this.applyEasing(this._opacity, this._targetOpacity);
        this._duration--;
    }
};

/**
 * 更新色调
 */
Game_Picture.prototype.updateTone = function() {
    if (this._toneDuration > 0) {
        const d = this._toneDuration;
        for (let i = 0; i < 4; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this._toneDuration--;
    }
};

/**
 * 更新旋转
 */
Game_Picture.prototype.updateRotation = function() {
    if (this._rotationSpeed !== 0) {
        this._angle += this._rotationSpeed / 2;
    }
};

/**
 * 应用缓动
 * @param {number} current 当前值
 * @param {number} target 目标值
 */
Game_Picture.prototype.applyEasing = function(current, target) {
    //持续时间
    const d = this._duration;
    //整个持续时间
    const wd = this._wholeDuration;
    //之前缓动值
    const lt = this.calcEasing((wd - d) / wd);
    //当前缓动值
    const t = this.calcEasing((wd - d + 1) / wd);
    //开始值
    const start = (current - target * lt) / (1 - lt);
    //当前值
    return start + (target - start) * t;
};

/**
 * 计算缓动
 * @param {number} t 时间比例
 */
Game_Picture.prototype.calcEasing = function(t) {
    const exponent = this._easingExponent;
    switch (this._easingType) {
        case 1: // Slow start
            return this.easeIn(t, exponent);
        case 2: // Slow end
            return this.easeOut(t, exponent);
        case 3: // Slow start and end
            return this.easeInOut(t, exponent);
        default:
            return t;
    }
};

/**
 * 缓入
 * @param {number} t 时间比例
 * @param {number} exponent 缓动指数
 */
Game_Picture.prototype.easeIn = function(t, exponent) {
    return Math.pow(t, exponent);
};

/**
 * 缓出
 * @param {number} t 时间比例
 * @param {number} exponent 缓动指数
 */
Game_Picture.prototype.easeOut = function(t, exponent) {
    return 1 - Math.pow(1 - t, exponent);
};

/**
 * 缓入缓出
 * @param {number} t 时间比例
 * @param {number} exponent 缓动指数
 */
Game_Picture.prototype.easeInOut = function(t, exponent) {
    if (t < 0.5) {
        return this.easeIn(t * 2, exponent) / 2;
    } else {
        return this.easeOut(t * 2 - 1, exponent) / 2 + 0.5;
    }
};

