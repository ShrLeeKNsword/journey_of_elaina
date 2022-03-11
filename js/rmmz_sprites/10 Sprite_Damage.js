//-----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.

/**
 * 精灵伤害
 * 
 * 用于显示弹出伤害的精灵。
 * 
 * @mz 使用的绘制文字而非截取图片
 */
function Sprite_Damage() {
    this.initialize(...arguments);
}

Sprite_Damage.prototype = Object.create(Sprite.prototype);
Sprite_Damage.prototype.constructor = Sprite_Damage;

/**初始化 */
Sprite_Damage.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._duration = 90;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._colorType = 0;
};

/**
 * 销毁 
 * @param {*} options 
 */
Sprite_Damage.prototype.destroy = function(options) {
    for (const child of this.children) {
        if (child.bitmap) {
            child.bitmap.destroy();
        }
    }
    Sprite.prototype.destroy.call(this, options);
};

/**安装 
 * @param {*} target 
 */
Sprite_Damage.prototype.setup = function(target) {
    const result = target.result();
    if (result.missed || result.evaded) {
        this._colorType = 0;
        this.createMiss();
    } else if (result.hpAffected) {
        this._colorType = result.hpDamage >= 0 ? 0 : 1;
        this.createDigits(result.hpDamage);
    } else if (target.isAlive() && result.mpDamage !== 0) {
        this._colorType = result.mpDamage >= 0 ? 2 : 3;
        this.createDigits(result.mpDamage);
    }
    if (result.critical) {
        this.setupCriticalEffect();
    }
};

/**
 * 安装关键作用
 */
Sprite_Damage.prototype.setupCriticalEffect = function() {
    this._flashColor = [255, 0, 0, 160];
    this._flashDuration = 60;
};

/**
 * 字体
 */
Sprite_Damage.prototype.fontFace = function() {
    return $gameSystem.numberFontFace();
};

/**
 * 字体大小
 */
Sprite_Damage.prototype.fontSize = function() {
    return $gameSystem.mainFontSize() + 4;
};

/**
 * 伤害颜色
 */
Sprite_Damage.prototype.damageColor = function() {
    return ColorManager.damageColor(this._colorType);
};

/**
 * 轮廓颜色
 */
Sprite_Damage.prototype.outlineColor = function() {
    return "rgba(0, 0, 0, 0.7)";
};

/**
 * 轮廓宽度
 */
Sprite_Damage.prototype.outlineWidth = function() {
    return 4;
};

/**
 * 创建闪避
 */
Sprite_Damage.prototype.createMiss = function() {
    const h = this.fontSize();
    const w = Math.floor(h * 3.0);
    const sprite = this.createChildSprite(w, h);
    sprite.bitmap.drawText("Miss", 0, 0, w, h, "center");
    sprite.dy = 0;
};

/**
 * 创建数字
 * @param {*} value 
 */
Sprite_Damage.prototype.createDigits = function(value) {
    const string = Math.abs(value).toString();
    const h = this.fontSize();
    const w = Math.floor(h * 0.75);
    for (let i = 0; i < string.length; i++) {
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.drawText(string[i], 0, 0, w, h, "center");
        sprite.x = (i - (string.length - 1) / 2) * w;
        sprite.dy = -i;
    }
};

/**
 * 创建子精灵
 * @param {*} width 
 * @param {*} height 
 */
Sprite_Damage.prototype.createChildSprite = function(width, height) {
    const sprite = new Sprite();
    sprite.bitmap = this.createBitmap(width, height);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.y = -40;
    sprite.ry = sprite.y;
    this.addChild(sprite);
    return sprite;
};

/**
 * 创建位图
 * @param {*} width 
 * @param {*} height 
 */
Sprite_Damage.prototype.createBitmap = function(width, height) {
    const bitmap = new Bitmap(width, height);
    bitmap.fontFace = this.fontFace();
    bitmap.fontSize = this.fontSize();
    bitmap.textColor = this.damageColor();
    bitmap.outlineColor = this.outlineColor();
    bitmap.outlineWidth = this.outlineWidth();
    return bitmap;
};

/**
 * 更新 
 */
Sprite_Damage.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._duration > 0) {
        this._duration--;
        for (const child of this.children) {
            this.updateChild(child);
        }
    }
    this.updateFlash();
    this.updateOpacity();
};

/**
 * 更新子代
 * @param {*} sprite 
 */
Sprite_Damage.prototype.updateChild = function(sprite) {
    sprite.dy += 0.5;
    sprite.ry += sprite.dy;
    if (sprite.ry >= 0) {
        sprite.ry = 0;
        sprite.dy *= -0.6;
    }
    sprite.y = Math.round(sprite.ry);
    sprite.setBlendColor(this._flashColor);
};

/**
 * 更新闪烁
 */
Sprite_Damage.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        const d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
    }
};

/**
 * 更新不透明度
 */
Sprite_Damage.prototype.updateOpacity = function() {
    if (this._duration < 10) {
        this.opacity = (255 * this._duration) / 10;
    }
};

/**
 * 是播放中
 */
Sprite_Damage.prototype.isPlaying = function() {
    return this._duration > 0;
};

