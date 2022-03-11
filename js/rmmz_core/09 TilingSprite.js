//-----------------------------------------------------------------------------
/**
 * 平铺精灵
 * The sprite object for a tiling image.
 *
 * 平铺图像的精灵对象
 * 
 * @class
 * @extends PIXI.TilingSprite
 * @param {Bitmap} bitmap 平铺精灵的图像。- The image for the tiling sprite.
 * 
 * @mz 相比mv 只考虑webgl情况下的处理
 */
function TilingSprite() {
    this.initialize(...arguments);
}

TilingSprite.prototype = Object.create(PIXI.TilingSprite.prototype);
TilingSprite.prototype.constructor = TilingSprite;

/**初始化 
 * @param {Bitmap} bitmap 位图
 */
TilingSprite.prototype.initialize = function(bitmap) {
    if (!TilingSprite._emptyBaseTexture) {
        TilingSprite._emptyBaseTexture = new PIXI.BaseTexture();
        TilingSprite._emptyBaseTexture.setSize(1, 1);
    }
    const frame = new Rectangle();
    const texture = new PIXI.Texture(TilingSprite._emptyBaseTexture, frame);
    PIXI.TilingSprite.call(this, texture);
    this._bitmap = bitmap;
    this._width = 0;
    this._height = 0;
    this._frame = frame;

    /**
     * 原点
     * The origin point of the tiling sprite for scrolling.
     * 用于滚动的平铺精灵的原点。
     *
     * @type Point
     */
    this.origin = new Point();

    this._onBitmapChange();
};

/**
 * 空的基础纹理
 */
TilingSprite._emptyBaseTexture = null;

/**
 * 位图
 * The image for the tiling sprite.
 * 拼贴精灵的图像。
 *
 * @type Bitmap
 * @name TilingSprite#bitmap
 */
Object.defineProperty(TilingSprite.prototype, "bitmap", {
    get: function() {
        return this._bitmap;
    },
    set: function(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            this._onBitmapChange();
        }
    },
    configurable: true
});

/**
 * 不透明度
 * The opacity of the tiling sprite (0 to 255).
 * 平铺精灵的不透明度（0到255）。
 *
 * @type number
 * @name TilingSprite#opacity
 */
Object.defineProperty(TilingSprite.prototype, "opacity", {
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
 * Destroys the tiling sprite.
 * 销毁平铺精灵。
 */
TilingSprite.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.TilingSprite.prototype.destroy.call(this, options);
};

/**
 * 更新
 * Updates the tiling sprite for each frame.
 * 更新每帧的平铺精灵。
 */
TilingSprite.prototype.update = function() {
    for (const child of this.children) {
        if (child.update) {
            child.update();
        }
    }
};

/**
 * 移动
 * 一次性设置x，y，宽度和高度。
 * Sets the x, y, width, and height all at once.
 *
 * @param {number} x 拼贴精灵的x坐标。- The x coordinate of the tiling sprite.
 * @param {number} y 拼贴精灵的y坐标。- The y coordinate of the tiling sprite.
 * @param {number} width 拼贴精灵的宽度。- The width of the tiling sprite.
 * @param {number} height 拼贴精灵的高度。- The height of the tiling sprite.
 */
TilingSprite.prototype.move = function(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this._width = width || 0;
    this._height = height || 0;
};

/**
 * 设置框架
 * Specifies the region of the image that the tiling sprite will use.
 * 指定平铺精灵将使用的图像区域。
 *
 * @param {number} x 框架的x坐标。- The x coordinate of the frame.
 * @param {number} y 框架的y坐标。- The y coordinate of the frame.
 * @param {number} width 框架的宽度。- The width of the frame.
 * @param {number} height 框架的高度。- The height of the frame.
 */
TilingSprite.prototype.setFrame = function(x, y, width, height) {
    this._frame.x = x;
    this._frame.y = y;
    this._frame.width = width;
    this._frame.height = height;
    this._refresh();
};

/**
 * 更新转换
 * Updates the transform on all children of this container for rendering.
 * 更新此容器的所有子代的变换以进行渲染。
 */
TilingSprite.prototype.updateTransform = function() {
    this.tilePosition.x = Math.round(-this.origin.x);
    this.tilePosition.y = Math.round(-this.origin.y);
    PIXI.TilingSprite.prototype.updateTransform.call(this);
};

/**
 * 当位图更改
 */
TilingSprite.prototype._onBitmapChange = function() {
    if (this._bitmap) {
        this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
    } else {
        this.texture.frame = new Rectangle();
    }
};

/**
 * 当位图加载
 */
TilingSprite.prototype._onBitmapLoad = function() {
    this.texture.baseTexture = this._bitmap.baseTexture;
    this._refresh();
};

/**
 * 刷新
 */
TilingSprite.prototype._refresh = function() {
    const texture = this.texture;
    const frame = this._frame.clone();
    if (frame.width === 0 && frame.height === 0 && this._bitmap) {
        frame.width = this._bitmap.width;
        frame.height = this._bitmap.height;
    }
    if (texture) {
        if (texture.baseTexture) {
            try {
                texture.frame = frame;
            } catch (e) {
                texture.frame = new Rectangle();
            }
        }
        texture._updateID++;
    }
};

