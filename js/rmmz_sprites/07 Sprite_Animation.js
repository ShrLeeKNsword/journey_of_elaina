//-----------------------------------------------------------------------------
// Sprite_Animation
//
// The sprite for displaying an animation.

/**
 * 精灵动画
 * 
 * 一个显示动画的精灵
 */
function Sprite_Animation() {
    this.initialize(...arguments);
}

Sprite_Animation.prototype = Object.create(Sprite.prototype);
Sprite_Animation.prototype.constructor = Sprite_Animation;

/**初始化 */
Sprite_Animation.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};

/**初始化成员 */
Sprite_Animation.prototype.initMembers = function() {
    this._targets = [];
    this._animation = null;
    this._mirror = false;
    this._delay = 0;
    this._previous = null;
    this._effect = null;
    this._handle = null;
    this._playing = false;
    this._started = false;
    this._frameIndex = 0;
    this._maxTimingFrames = 0;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._viewportSize = 4096;
    this._originalViewport = null;
    this.z = 8;
};

/**
 * 销毁
 * @param {*} options 
 */
Sprite_Animation.prototype.destroy = function(options) {
    Sprite.prototype.destroy.call(this, options);
    if (this._handle) {
        this._handle.stop();
    }
    this._effect = null;
    this._handle = null;
    this._playing = false;
    this._started = false;
};

// prettier-ignore
/**
 * 安装
 * @param {*} targets 
 * @param {*} animation 
 * @param {*} mirror 
 * @param {*} delay 
 * @param {*} previous 
 */
Sprite_Animation.prototype.setup = function(
    targets, animation, mirror, delay, previous
) {
    this._targets = targets;
    this._animation = animation;
    this._mirror = mirror;
    this._delay = delay;
    this._previous = previous;
    this._effect = EffectManager.load(animation.effectName);
    this._playing = true;
    const timings = animation.soundTimings.concat(animation.flashTimings);
    for (const timing of timings) {
        if (timing.frame > this._maxTimingFrames) {
            this._maxTimingFrames = timing.frame;
        }
    }
};

/**
 * 更新 
 */
Sprite_Animation.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._delay > 0) {
        this._delay--;
    } else if (this._playing) {
        if (!this._started && this.canStart()) {
            if (this._effect) {
                if (this._effect.isLoaded) {
                    this._handle = Graphics.effekseer.play(this._effect);
                    this._started = true;
                } else {
                    EffectManager.checkErrors();
                }
            } else {
                this._started = true;
            }
        }
        if (this._started) {
            this.updateEffectGeometry();
            this.updateMain();
            this.updateFlash();
        }
    }
};

/**能开始 */
Sprite_Animation.prototype.canStart = function() {
    if (this._previous && this.shouldWaitForPrevious()) {
        return !this._previous.isPlaying();
    } else {
        return true;
    }
};

/**
 * 应该等待上一个
 */
Sprite_Animation.prototype.shouldWaitForPrevious = function() {
    // [Note] Effekseer is very heavy on some mobile devices, so we don't
    //   display many effects at the same time.
    return Utils.isMobileDevice();
};

/**
 * 更新效果几何
 */
Sprite_Animation.prototype.updateEffectGeometry = function() {
    const scale = this._animation.scale / 100;
    const r = Math.PI / 180;
    const rx = this._animation.rotation.x * r;
    const ry = this._animation.rotation.y * r;
    const rz = this._animation.rotation.z * r;
    if (this._handle) {
        this._handle.setLocation(0, 0, 0);
        this._handle.setRotation(rx, ry, rz);
        this._handle.setScale(scale, scale, scale);
        this._handle.setSpeed(this._animation.speed / 100);
    }
};

/**
 * 更新主要
 */
Sprite_Animation.prototype.updateMain = function() {
    this.processSoundTimings();
    this.processFlashTimings();
    this._frameIndex++;
    this.checkEnd();
};

/**
 * 处理声音时序
 */
Sprite_Animation.prototype.processSoundTimings = function() {
    for (const timing of this._animation.soundTimings) {
        if (timing.frame === this._frameIndex) {
            AudioManager.playSe(timing.se);
        }
    }
};

/**
 * 处理闪烁时序
 */
Sprite_Animation.prototype.processFlashTimings = function() {
    for (const timing of this._animation.flashTimings) {
        if (timing.frame === this._frameIndex) {
            this._flashColor = timing.color.clone();
            this._flashDuration = timing.duration;
        }
    }
};

/**
 * 检查结束
 */
Sprite_Animation.prototype.checkEnd = function() {
    if (
        this._frameIndex > this._maxTimingFrames &&
        this._flashDuration === 0 &&
        !(this._handle && this._handle.exists)
    ) {
        this._playing = false;
    }
};

/**
 * 更新闪烁
 */
Sprite_Animation.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        const d = this._flashDuration--;
        this._flashColor[3] *= (d - 1) / d;
        for (const target of this._targets) {
            target.setBlendColor(this._flashColor);
        }
    }
};

/**
 * 是播放中
 */
Sprite_Animation.prototype.isPlaying = function() {
    return this._playing;
};

/**
 * 设置旋转
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
Sprite_Animation.prototype.setRotation = function(x, y, z) {
    if (this._handle) {
        this._handle.setRotation(x, y, z);
    }
};

/**
 * 渲染
 * @param {*} renderer 
 */
Sprite_Animation.prototype._render = function(renderer) {
    if (this._targets.length > 0 && this._handle && this._handle.exists) {
        this.onBeforeRender(renderer);
        this.saveViewport(renderer);
        this.setProjectionMatrix(renderer);
        this.setCameraMatrix(renderer);
        this.setViewport(renderer);
        Graphics.effekseer.beginDraw();
        Graphics.effekseer.drawHandle(this._handle);
        Graphics.effekseer.endDraw();
        this.resetViewport(renderer);
        this.onAfterRender(renderer);
    }
};

/**
 * 设置投影矩阵
 * @param {*} renderer 
 */
Sprite_Animation.prototype.setProjectionMatrix = function(renderer) {
    const x = this._mirror ? -1 : 1;
    const y = -1;
    const p = -(this._viewportSize / renderer.view.height);
    // prettier-ignore
    Graphics.effekseer.setProjectionMatrix([
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, 1, p,
        0, 0, 0, 1,
    ]);
};

/**
 * 设置相机矩阵
 */
Sprite_Animation.prototype.setCameraMatrix = function(/*renderer*/) {
    // prettier-ignore
    Graphics.effekseer.setCameraMatrix([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -10, 1
    ]);
};

/**
 * 设置视口
 * @param {*} renderer 
 */
Sprite_Animation.prototype.setViewport = function(renderer) {
    const vw = this._viewportSize;
    const vh = this._viewportSize;
    const vx = this._animation.offsetX - vw / 2;
    const vy = this._animation.offsetY - vh / 2;
    const pos = this.targetPosition(renderer);
    renderer.gl.viewport(vx + pos.x, vy + pos.y, vw, vh);
};

/**
 * 目标位置
 * @param {*} renderer 
 */
Sprite_Animation.prototype.targetPosition = function(renderer) {
    const pos = new Point();
    if (this._animation.displayType === 2) {
        pos.x = renderer.view.width / 2;
        pos.y = renderer.view.height / 2;
    } else {
        for (const target of this._targets) {
            const tpos = this.targetSpritePosition(target);
            pos.x += tpos.x;
            pos.y += tpos.y;
        }
        pos.x /= this._targets.length;
        pos.y /= this._targets.length;
    }
    return pos;
};

/**
 * 目标精灵位置
 * @param {*} sprite 
 */
Sprite_Animation.prototype.targetSpritePosition = function(sprite) {
    const point = new Point(0, -sprite.height / 2);
    sprite.updateTransform();
    return sprite.worldTransform.apply(point);
};

/**
 * 保存视口
 * @param {*} renderer 
 */
Sprite_Animation.prototype.saveViewport = function(renderer) {
    // [Note] Retrieving the viewport is somewhat heavy.
    if (!this._originalViewport) {
        this._originalViewport = renderer.gl.getParameter(renderer.gl.VIEWPORT);
    }
};

/**
 * 重置视口
 * @param {*} renderer 
 */
Sprite_Animation.prototype.resetViewport = function(renderer) {
    const vp = this._originalViewport;
    renderer.gl.viewport(vp[0], vp[1], vp[2], vp[3]);
};

/**
 * 当渲染前
 * @param {*} renderer 
 */
Sprite_Animation.prototype.onBeforeRender = function(renderer) {
    renderer.batch.flush();
    renderer.geometry.reset();
};

/**
 * 当渲染后
 * @param {*} renderer 
 */
Sprite_Animation.prototype.onAfterRender = function(renderer) {
    renderer.texture.contextChange();
    renderer.texture.reset();
    renderer.geometry.reset();
    renderer.state.reset();
    renderer.shader.reset();
    renderer.framebuffer.reset();
};

