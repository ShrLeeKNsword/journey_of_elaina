//-----------------------------------------------------------------------------
// Sprite_Balloon
//
// The sprite for displaying a balloon icon.

/**
 * 精灵气球
 * 
 * 用于显示气球图标的精灵。
 */
function Sprite_Balloon() {
    this.initialize(...arguments);
}

Sprite_Balloon.prototype = Object.create(Sprite.prototype);
Sprite_Balloon.prototype.constructor = Sprite_Balloon;

/**初始化 */
Sprite_Balloon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};

/**初始化成员 */
Sprite_Balloon.prototype.initMembers = function() {
    this._target = null;
    this._balloonId = 0;
    this._duration = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.z = 7;
};

/**
 * 加载位图
 */
Sprite_Balloon.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem("Balloon");
    this.setFrame(0, 0, 0, 0);
};

/**
 * 安装
 * @param {*} targetSprite 目标精灵
 * @param {*} balloonId 气球ID
 * 
 * @mz 相比mv 添加了对目标精灵的绑定
 */
Sprite_Balloon.prototype.setup = function(targetSprite, balloonId) {
    this._target = targetSprite;
    this._balloonId = balloonId;
    this._duration = 8 * this.speed() + this.waitTime();
};

/**
 * 更新 
 */
Sprite_Balloon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._duration > 0) {
        this._duration--;
        if (this._duration > 0) {
            this.updatePosition();
            this.updateFrame();
        }
    }
};

/**
 * 更新位置
 * @mz 与目标精灵绑定
 */
Sprite_Balloon.prototype.updatePosition = function() {
    this.x = this._target.x;
    this.y = this._target.y - this._target.height;
};

/**
 * 更新帧
 */
Sprite_Balloon.prototype.updateFrame = function() {
    const w = 48;
    const h = 48;
    const sx = this.frameIndex() * w;
    const sy = (this._balloonId - 1) * h;
    this.setFrame(sx, sy, w, h);
};

/**
 * 速度
 */
Sprite_Balloon.prototype.speed = function() {
    return 8;
};

/**
 * 等待时间
 */
Sprite_Balloon.prototype.waitTime = function() {
    return 12;
};

/**
 * 帧索引
 */
Sprite_Balloon.prototype.frameIndex = function() {
    const index = (this._duration - this.waitTime()) / this.speed();
    return 7 - Math.max(Math.floor(index), 0);
};

/**
 * 是播放中
 */
Sprite_Balloon.prototype.isPlaying = function() {
    return this._duration > 0;
};

