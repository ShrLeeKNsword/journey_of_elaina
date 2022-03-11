//-----------------------------------------------------------------------------
// Game_Screen
//
// The game object class for screen effect data, such as changes in color tone
// and flashes.

/**
 * 游戏画面
 * 
 * 画面效果数据（例如色调变化/闪烁）的游戏对象类
 */
function Game_Screen() {
    this.initialize(...arguments);
}

/**
 * 初始化
 */
Game_Screen.prototype.initialize = function() {
    this.clear();
};

/**
 * 清除
 */
Game_Screen.prototype.clear = function() {
    this.clearFade();
    this.clearTone();
    this.clearFlash();
    this.clearShake();
    this.clearZoom();
    this.clearWeather();
    this.clearPictures();
};

/**
 * 当战斗开始
 */
Game_Screen.prototype.onBattleStart = function() {
    this.clearFade();
    this.clearFlash();
    this.clearShake();
    this.clearZoom();
    this.eraseBattlePictures();
};

/**
 * 亮度
 */
Game_Screen.prototype.brightness = function() {
    return this._brightness;
};

/**
 * 色调
 */
Game_Screen.prototype.tone = function() {
    return this._tone;
};

/**
 * 闪烁颜色
 */
Game_Screen.prototype.flashColor = function() {
    return this._flashColor;
};

/**
 * 震动
 */
Game_Screen.prototype.shake = function() {
    return this._shake;
};

/**
 * 缩放x
 */
Game_Screen.prototype.zoomX = function() {
    return this._zoomX;
};

/**
 * 缩放y
 */
Game_Screen.prototype.zoomY = function() {
    return this._zoomY;
};

/**
 * 缩放比例
 */
Game_Screen.prototype.zoomScale = function() {
    return this._zoomScale;
};

/**
 * 天气种类
 */
Game_Screen.prototype.weatherType = function() {
    return this._weatherType;
};

/**
 * 天气强度
 */
Game_Screen.prototype.weatherPower = function() {
    return this._weatherPower;
};

/**
 * 图片
 * @param {number} pictureId 图片id
 * 
 */
Game_Screen.prototype.picture = function(pictureId) {
    const realPictureId = this.realPictureId(pictureId);
    return this._pictures[realPictureId];
};

/**
 * 真实图片id
 * @param {number} pictureId 图片id
 */
Game_Screen.prototype.realPictureId = function(pictureId) {
    if ($gameParty.inBattle()) {
        return pictureId + this.maxPictures();
    } else {
        return pictureId;
    }
};

/**
 * 清除淡入淡出
 */
Game_Screen.prototype.clearFade = function() {
    /**
     * 亮度
     */
    this._brightness = 255;
    /**
     * 淡出持续时间  
     */
    this._fadeOutDuration = 0;
    /**
     * 淡入持续时间
     */
    this._fadeInDuration = 0;
};

/**
 * 清除色调
 */
Game_Screen.prototype.clearTone = function() {
    /**
     * 色调
     */
    this._tone = [0, 0, 0, 0];
    /**
     * 色调目标
     */
    this._toneTarget = [0, 0, 0, 0];
    /**
     * 色调持续时间
     */
    this._toneDuration = 0;
};

/**
 * 清除闪烁
 */
Game_Screen.prototype.clearFlash = function() {
    /**
     * 闪烁颜色
     */
    this._flashColor = [0, 0, 0, 0];
    /**
     * 闪烁持续时间
     */
    this._flashDuration = 0;
};

/**
 * 清除震动
 */
Game_Screen.prototype.clearShake = function() {
    /**
     * 震动强度
     */
    this._shakePower = 0;
    /**
     * 震动速度
     */
    this._shakeSpeed = 0;
    /**
     * 震动持续时间
     */
    this._shakeDuration = 0;
    /**
     * 震动方向
     */
    this._shakeDirection = 1;
    /**
     * 震动
     */
    this._shake = 0;
};

/**
 * 清除缩放
 */
Game_Screen.prototype.clearZoom = function() {
    /**
     * 缩放x
     */
    this._zoomX = 0;
    /**
     * 缩放y
     */
    this._zoomY = 0;
    /**
     * 缩放比例
     */
    this._zoomScale = 1;
    /**
     * 缩放比例目标
     */
    this._zoomScaleTarget = 1;
    /**
     * 缩放时间
     */
    this._zoomDuration = 0;
};

/**
 * 清除天气
 */
Game_Screen.prototype.clearWeather = function() {
    /**
     * 天气种类
     */
    this._weatherType = "none";
    /**
     * 天气强度
     */
    this._weatherPower = 0;
    /**
     * 天气强度目标
     */
    this._weatherPowerTarget = 0;
    /**
     * 天气持续时间
     */
    this._weatherDuration = 0;
};

/**
 * 清除图片组
 */
Game_Screen.prototype.clearPictures = function() {
    /**
     * 图片组
     */
    this._pictures = [];
};

/**
 * 删除战斗图片
 */
Game_Screen.prototype.eraseBattlePictures = function() {
    this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
};

/**
 * 最大图片数
 */
Game_Screen.prototype.maxPictures = function() {
    return 100;
};

/**
 * 开始淡出
 * @param {number} duration 持续时间
 */
Game_Screen.prototype.startFadeOut = function(duration) {
    this._fadeOutDuration = duration;
    this._fadeInDuration = 0;
};

/**
 * 开始淡入
 * @param {number} duration 持续时间
 */
Game_Screen.prototype.startFadeIn = function(duration) {
    this._fadeInDuration = duration;
    this._fadeOutDuration = 0;
};

/**
 * 开始着色
 * @param {[number,number,number,number]} tone 色调
 * @param {number} duration 持续时间
 */
Game_Screen.prototype.startTint = function(tone, duration) {
    this._toneTarget = tone.clone();
    this._toneDuration = duration;
    if (this._toneDuration === 0) {
        this._tone = this._toneTarget.clone();
    }
};

/**
 * 开始闪烁
 * @param {[number,number,number,number]} color 颜色
 * @param {number} duration 持续时间
 */
Game_Screen.prototype.startFlash = function(color, duration) {
    this._flashColor = color.clone();
    this._flashDuration = duration;
};

/**
 * 开始震动
 * @param {number} power 强度
 * @param {number} speed 速度
 * @param {number} duration 持续时间
 */
Game_Screen.prototype.startShake = function(power, speed, duration) {
    this._shakePower = power;
    this._shakeSpeed = speed;
    this._shakeDuration = duration;
};

/**
 * 开始缩放
 * @param {number} x 缩放x
 * @param {number} y 缩放y
 * @param {number} scale 目标比例
 * @param {number} duration 持续时间
 */
Game_Screen.prototype.startZoom = function(x, y, scale, duration) {
    this._zoomX = x;
    this._zoomY = y;
    this._zoomScaleTarget = scale;
    this._zoomDuration = duration;
};

/**
 * 设置缩放
 * @param {number} x 缩放x
 * @param {number} y 缩放y
 * @param {number} scale 目标比例
 */
Game_Screen.prototype.setZoom = function(x, y, scale) {
    this._zoomX = x;
    this._zoomY = y;
    this._zoomScale = scale;
};

/**
 * 改变天气
 * @param {string} type 种类
 * @param {number} power 强度
 * @param {number} duration 持续时间
 */
Game_Screen.prototype.changeWeather = function(type, power, duration) {
    if (type !== "none" || duration === 0) {
        this._weatherType = type;
    }
    this._weatherPowerTarget = type === "none" ? 0 : power;
    this._weatherDuration = duration;
    if (duration === 0) {
        this._weatherPower = this._weatherPowerTarget;
    }
};

/**
 * 更新
 */
Game_Screen.prototype.update = function() {
    this.updateFadeOut();
    this.updateFadeIn();
    this.updateTone();
    this.updateFlash();
    this.updateShake();
    this.updateZoom();
    this.updateWeather();
    this.updatePictures();
};

/**
 * 更新淡出
 */
Game_Screen.prototype.updateFadeOut = function() {
    if (this._fadeOutDuration > 0) {
        const d = this._fadeOutDuration;
        this._brightness = (this._brightness * (d - 1)) / d;
        this._fadeOutDuration--;
    }
};

/**
 * 更新淡入
 */
Game_Screen.prototype.updateFadeIn = function() {
    if (this._fadeInDuration > 0) {
        const d = this._fadeInDuration;
        this._brightness = (this._brightness * (d - 1) + 255) / d;
        this._fadeInDuration--;
    }
};

/**
 * 更新色调
 */
Game_Screen.prototype.updateTone = function() {
    if (this._toneDuration > 0) {
        const d = this._toneDuration;
        for (let i = 0; i < 4; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this._toneDuration--;
    }
};

/**
 * 更新闪烁
 */
Game_Screen.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        const d = this._flashDuration;
        this._flashColor[3] *= (d - 1) / d;
        this._flashDuration--;
    }
};

/**
 * 更新震动
 */
Game_Screen.prototype.updateShake = function() {
    if (this._shakeDuration > 0 || this._shake !== 0) {
        const delta =
            (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
        if (
            this._shakeDuration <= 1 &&
            this._shake * (this._shake + delta) < 0
        ) {
            this._shake = 0;
        } else {
            this._shake += delta;
        }
        if (this._shake > this._shakePower * 2) {
            this._shakeDirection = -1;
        }
        if (this._shake < -this._shakePower * 2) {
            this._shakeDirection = 1;
        }
        this._shakeDuration--;
    }
};

/**
 * 更新缩放
 */
Game_Screen.prototype.updateZoom = function() {
    if (this._zoomDuration > 0) {
        const d = this._zoomDuration;
        const t = this._zoomScaleTarget;
        this._zoomScale = (this._zoomScale * (d - 1) + t) / d;
        this._zoomDuration--;
    }
};

/**
 * 更新天气
 */
Game_Screen.prototype.updateWeather = function() {
    if (this._weatherDuration > 0) {
        const d = this._weatherDuration;
        const t = this._weatherPowerTarget;
        this._weatherPower = (this._weatherPower * (d - 1) + t) / d;
        this._weatherDuration--;
        if (this._weatherDuration === 0 && this._weatherPowerTarget === 0) {
            this._weatherType = "none";
        }
    }
};

/**
 * 更新图片
 */
Game_Screen.prototype.updatePictures = function() {
    for (const picture of this._pictures) {
        if (picture) {
            picture.update();
        }
    }
};

/**
 * 开始闪烁为了伤害
 */
Game_Screen.prototype.startFlashForDamage = function() {
    this.startFlash([255, 0, 0, 128], 8);
};

// prettier-ignore
/**
 * 显示图片
 * @param {number} pictureId 图片id
 * @param {string} name 名称
 * @param {numebr} origin 原点
 * @param {numebr} x x坐标
 * @param {numebr} y y坐标
 * @param {numebr} scaleX 比例x
 * @param {numebr} scaleY 比例y
 * @param {numebr} opacity 不透明度
 * @param {numebr} blendMode 合成模式
 */
Game_Screen.prototype.showPicture = function(
    pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode
) {
    const realPictureId = this.realPictureId(pictureId);
    const picture = new Game_Picture();
    picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
    this._pictures[realPictureId] = picture;
};

// prettier-ignore
/**
 * 移动图片
 * @param {number} pictureId 图片id 
 * @param {numebr} origin 原点
 * @param {numebr} x x坐标
 * @param {numebr} y y坐标
 * @param {numebr} scaleX 比例x
 * @param {numebr} scaleY 比例y
 * @param {numebr} opacity 不透明度
 * @param {numebr} blendMode 合成模式
 * @param {number} duration 持续时间
 * @param {0|1|2|3} easingType 缓动类型 0正常, 1缓入 , 2缓出 , 3缓入缓出
 * 
 */
Game_Screen.prototype.movePicture = function(
    pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration,
    easingType
) {
    const picture = this.picture(pictureId);
    if (picture) {
        // prettier-ignore
        picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode,
                     duration, easingType);
    }
};

/**
 * 旋转图片
 * @param {number} pictureId 图片id 
 * @param {number} speed 速度
 */
Game_Screen.prototype.rotatePicture = function(pictureId, speed) {
    const picture = this.picture(pictureId);
    if (picture) {
        picture.rotate(speed);
    }
};

/**
 * 着色图片
 * @param {number} pictureId 图片id 
 * @param {[number,number,number,number]} tone 目标色调
 * @param {number} duration 持续时间
 */
Game_Screen.prototype.tintPicture = function(pictureId, tone, duration) {
    const picture = this.picture(pictureId);
    if (picture) {
        picture.tint(tone, duration);
    }
};

/**
 * 删除图片
 * @param {number} pictureId 图片id
 */
Game_Screen.prototype.erasePicture = function(pictureId) {
    const realPictureId = this.realPictureId(pictureId);
    this._pictures[realPictureId] = null;
};

