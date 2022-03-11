//-----------------------------------------------------------------------------
// Sprite_AnimationMV
//
// The sprite for displaying an old format animation.

/**
 * 精灵动画MV
 * 
 * 用于显示旧格式动画的精灵。
 * @mz 用于mv兼容
 */
function Sprite_AnimationMV() {
    this.initialize(...arguments);
}

Sprite_AnimationMV.prototype = Object.create(Sprite.prototype);
Sprite_AnimationMV.prototype.constructor = Sprite_AnimationMV;

/**初始化 */
Sprite_AnimationMV.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};

/**初始化成员 */
Sprite_AnimationMV.prototype.initMembers = function() {
    this._targets = [];
    this._animation = null;
    this._mirror = false;
    this._delay = 0;
    this._rate = 4;
    this._duration = 0;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._screenFlashDuration = 0;
    this._hidingDuration = 0;
    this._hue1 = 0;
    this._hue2 = 0;
    this._bitmap1 = null;
    this._bitmap2 = null;
    this._cellSprites = [];
    this._screenFlashSprite = null;
    this.z = 8;
};

// prettier-ignore
/**安装 */
Sprite_AnimationMV.prototype.setup = function(
    targets, animation, mirror, delay
) {
    this._targets = targets;
    this._animation = animation;
    this._mirror = mirror;
    this._delay = delay;
    if (this._animation) {
        this.setupRate();
        this.setupDuration();
        this.loadBitmaps();
        this.createCellSprites();
        this.createScreenFlashSprite();
    }
};

/**
 * 安装速度
 */
Sprite_AnimationMV.prototype.setupRate = function() {
    this._rate = 4;
};

/**
 * 安装持续时间
 */
Sprite_AnimationMV.prototype.setupDuration = function() {
    this._duration = this._animation.frames.length * this._rate + 1;
};

/**
 * 更新 
 */
Sprite_AnimationMV.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateMain();
    this.updateFlash();
    this.updateScreenFlash();
    this.updateHiding();
};

/**
 * 更新闪烁
 */
Sprite_AnimationMV.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        const d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
        for (const target of this._targets) {
            target.setBlendColor(this._flashColor);
        }
    }
};

/**
 * 更新屏幕闪光灯
 */
Sprite_AnimationMV.prototype.updateScreenFlash = function() {
    if (this._screenFlashDuration > 0) {
        const d = this._screenFlashDuration--;
        if (this._screenFlashSprite) {
            this._screenFlashSprite.x = -this.absoluteX();
            this._screenFlashSprite.y = -this.absoluteY();
            this._screenFlashSprite.opacity *= (d - 1) / d;
            this._screenFlashSprite.visible = this._screenFlashDuration > 0;
        }
    }
};

/**
 * 绝对X
 */
Sprite_AnimationMV.prototype.absoluteX = function() {
    let x = 0;
    let object = this;
    while (object) {
        x += object.x;
        object = object.parent;
    }
    return x;
};

/**
 * 绝对Y
 */
Sprite_AnimationMV.prototype.absoluteY = function() {
    let y = 0;
    let object = this;
    while (object) {
        y += object.y;
        object = object.parent;
    }
    return y;
};

/**
 * 更新隐藏
 */
Sprite_AnimationMV.prototype.updateHiding = function() {
    if (this._hidingDuration > 0) {
        this._hidingDuration--;
        if (this._hidingDuration === 0) {
            for (const target of this._targets) {
                target.show();
            }
        }
    }
};

/**
 * 是播放中
 */
Sprite_AnimationMV.prototype.isPlaying = function() {
    return this._duration > 0;
};

/**
 * 加载位图
 */
Sprite_AnimationMV.prototype.loadBitmaps = function() {
    const name1 = this._animation.animation1Name;
    const name2 = this._animation.animation2Name;
    this._hue1 = this._animation.animation1Hue;
    this._hue2 = this._animation.animation2Hue;
    this._bitmap1 = ImageManager.loadAnimation(name1);
    this._bitmap2 = ImageManager.loadAnimation(name2);
};

/**
 * 是准备好
 */
Sprite_AnimationMV.prototype.isReady = function() {
    return (
        this._bitmap1 &&
        this._bitmap1.isReady() &&
        this._bitmap2 &&
        this._bitmap2.isReady()
    );
};

/**
 * 创建单元精灵组
 */
Sprite_AnimationMV.prototype.createCellSprites = function() {
    this._cellSprites = [];
    for (let i = 0; i < 16; i++) {
        const sprite = new Sprite();
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        this._cellSprites.push(sprite);
        this.addChild(sprite);
    }
};

/**
 * 创建屏幕闪烁精灵
 */
Sprite_AnimationMV.prototype.createScreenFlashSprite = function() {
    this._screenFlashSprite = new ScreenSprite();
    this.addChild(this._screenFlashSprite);
};

/**
 * 更新主要
 */
Sprite_AnimationMV.prototype.updateMain = function() {
    if (this.isPlaying() && this.isReady()) {
        if (this._delay > 0) {
            this._delay--;
        } else {
            this._duration--;
            this.updatePosition();
            if (this._duration % this._rate === 0) {
                this.updateFrame();
            }
            if (this._duration <= 0) {
                this.onEnd();
            }
        }
    }
};

/**
 * 更新位置
 */
Sprite_AnimationMV.prototype.updatePosition = function() {
    if (this._animation.position === 3) {
        this.x = this.parent.width / 2;
        this.y = this.parent.height / 2;
    } else if (this._targets.length > 0) {
        const target = this._targets[0];
        const parent = target.parent;
        const grandparent = parent ? parent.parent : null;
        this.x = target.x;
        this.y = target.y;
        if (this.parent === grandparent) {
            this.x += parent.x;
            this.y += parent.y;
        }
        if (this._animation.position === 0) {
            this.y -= target.height;
        } else if (this._animation.position === 1) {
            this.y -= target.height / 2;
        }
    }
};

/**
 * 更新框架
 */
Sprite_AnimationMV.prototype.updateFrame = function() {
    if (this._duration > 0) {
        const frameIndex = this.currentFrameIndex();
        this.updateAllCellSprites(this._animation.frames[frameIndex]);
        for (const timing of this._animation.timings) {
            if (timing.frame === frameIndex) {
                this.processTimingData(timing);
            }
        }
    }
};

/**
 * 当前帧索引
 */
Sprite_AnimationMV.prototype.currentFrameIndex = function() {
    return (
        this._animation.frames.length -
        Math.floor((this._duration + this._rate - 1) / this._rate)
    );
};

/**
 * 更新所有细胞精灵
 * @param {*} frame 
 */
Sprite_AnimationMV.prototype.updateAllCellSprites = function(frame) {
    if (this._targets.length > 0) {
        for (let i = 0; i < this._cellSprites.length; i++) {
            const sprite = this._cellSprites[i];
            if (i < frame.length) {
                this.updateCellSprite(sprite, frame[i]);
            } else {
                sprite.visible = false;
            }
        }
    }
};

/**
 * 更新单元精灵
 * @param {*} sprite 
 * @param {*} cell 
 */
Sprite_AnimationMV.prototype.updateCellSprite = function(sprite, cell) {
    const pattern = cell[0];
    if (pattern >= 0) {
        const sx = (pattern % 5) * 192;
        const sy = Math.floor((pattern % 100) / 5) * 192;
        const mirror = this._mirror;
        sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
        sprite.setHue(pattern < 100 ? this._hue1 : this._hue2);
        sprite.setFrame(sx, sy, 192, 192);
        sprite.x = cell[1];
        sprite.y = cell[2];
        sprite.rotation = (cell[4] * Math.PI) / 180;
        sprite.scale.x = cell[3] / 100;

        if (cell[5]) {
            sprite.scale.x *= -1;
        }
        if (mirror) {
            sprite.x *= -1;
            sprite.rotation *= -1;
            sprite.scale.x *= -1;
        }

        sprite.scale.y = cell[3] / 100;
        sprite.opacity = cell[6];
        sprite.blendMode = cell[7];
        sprite.visible = true;
    } else {
        sprite.visible = false;
    }
};

/**
 * 处理时序数据
 * @param {*} timing 
 */
Sprite_AnimationMV.prototype.processTimingData = function(timing) {
    const duration = timing.flashDuration * this._rate;
    switch (timing.flashScope) {
        case 1:
            this.startFlash(timing.flashColor, duration);
            break;
        case 2:
            this.startScreenFlash(timing.flashColor, duration);
            break;
        case 3:
            this.startHiding(duration);
            break;
    }
    if (timing.se) {
        AudioManager.playSe(timing.se);
    }
};

/**
 * 开始闪烁
 * @param {*} color 
 * @param {*} duration 
 */
Sprite_AnimationMV.prototype.startFlash = function(color, duration) {
    this._flashColor = color.clone();
    this._flashDuration = duration;
};

/**
 * 开始屏幕闪烁
 * @param {*} color 
 * @param {*} duration 
 */
Sprite_AnimationMV.prototype.startScreenFlash = function(color, duration) {
    this._screenFlashDuration = duration;
    if (this._screenFlashSprite) {
        this._screenFlashSprite.setColor(color[0], color[1], color[2]);
        this._screenFlashSprite.opacity = color[3];
    }
};

/**
 * 开始隐藏
 * @param {*} duration 
 */
Sprite_AnimationMV.prototype.startHiding = function(duration) {
    this._hidingDuration = duration;
    for (const target of this._targets) {
        target.hide();
    }
};

/**
 * 当结束
 */
Sprite_AnimationMV.prototype.onEnd = function() {
    this._flashDuration = 0;
    this._screenFlashDuration = 0;
    this._hidingDuration = 0;
    for (const target of this._targets) {
        target.setBlendColor([0, 0, 0, 0]);
        target.show();
    }
};

