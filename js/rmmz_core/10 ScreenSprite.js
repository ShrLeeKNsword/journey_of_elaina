//-----------------------------------------------------------------------------
/**
 * 屏幕精灵
 * The sprite which covers the entire game screen.
 * 覆盖整个游戏屏幕的精灵。
 *
 * @class
 * @extends PIXI.Container
 */
function ScreenSprite() {
    this.initialize(...arguments);
}

ScreenSprite.prototype = Object.create(PIXI.Container.prototype);
ScreenSprite.prototype.constructor = ScreenSprite;

/**
 * 初始化
 */
ScreenSprite.prototype.initialize = function() {
    PIXI.Container.call(this);
    this._graphics = new PIXI.Graphics();
    this.addChild(this._graphics);
    this.opacity = 0;
    this._red = -1;
    this._green = -1;
    this._blue = -1;
    this.setBlack();
};

/**
 * 不透明度
 * The opacity of the sprite (0 to 255).
 * 精灵的不透明度（0-255）
 *
 * @type number
 * @name ScreenSprite#opacity
 */
Object.defineProperty(ScreenSprite.prototype, "opacity", {
    get: function() {
        return this.alpha * 255;
    },
    set: function(value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**
 * 销毁
 * Destroys the screen sprite.
 * 销毁屏幕精灵。
 * @mz 新增
 */
ScreenSprite.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.Container.prototype.destroy.call(this, options);
};

/**
 * @mz 
 * 相比mv 没有了 blendMode 和 anchor
 */

/**
 * 设置黑色
 * Sets black to the color of the screen sprite.
 * 将黑色设置为屏幕精灵的颜色。
 */
ScreenSprite.prototype.setBlack = function() {
    this.setColor(0, 0, 0);
};

/**
 * 设置白色
 * Sets white to the color of the screen sprite.
 * 将白色设置为屏幕精灵的颜色。
 */
ScreenSprite.prototype.setWhite = function() {
    this.setColor(255, 255, 255);
};

/**
 * 设置颜色
 * Sets the color of the screen sprite by values.
 * 通过值设置屏幕精灵的颜色。
 *
 * @param {number} r 红色值，范围为（0，255）。- The red value in the range (0, 255).
 * @param {number} g 绿色值，范围为（0，255）。- The green value in the range (0, 255).
 * @param {number} b 蓝色值，范围为（0，255）。- The blue value in the range (0, 255).
 */
ScreenSprite.prototype.setColor = function(r, g, b) {
    if (this._red !== r || this._green !== g || this._blue !== b) {
        r = Math.round(r || 0).clamp(0, 255);
        g = Math.round(g || 0).clamp(0, 255);
        b = Math.round(b || 0).clamp(0, 255);
        this._red = r;
        this._green = g;
        this._blue = b;
        const graphics = this._graphics;
        graphics.clear();
        graphics.beginFill((r << 16) | (g << 8) | b, 1);
        graphics.drawRect(-50000, -50000, 100000, 100000);
    }
};

