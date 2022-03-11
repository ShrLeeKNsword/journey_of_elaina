//-----------------------------------------------------------------------------
/**
 * 位图
 * The basic object that represents an image.
 * 表示图像的基本对象。
 *
 * @class
 * @param {number} width 位图的宽度。- The width of the bitmap.
 * @param {number} height 位图的高度。- The height of the bitmap.
 */
function Bitmap() {
    this.initialize(...arguments);
}

/**
 * 初始化
 * @param {number} width 位图的宽度。- The width of the bitmap.
 * @param {number} height 位图的高度。- The height of the bitmap.
 */
Bitmap.prototype.initialize = function(width, height) {
    this._canvas = null;
    this._context = null;
    this._baseTexture = null;
    this._image = null;
    this._url = "";
    this._paintOpacity = 255;
    this._smooth = true;
    this._loadListeners = [];

    // "none", "loading", "loaded", or "error"
    this._loadingState = "none";

    if (width > 0 && height > 0) {
        this._createCanvas(width, height);
    }

    /**
     * The face name of the font.
     *
     * @type string
     */
    this.fontFace = "sans-serif";

    /**
     * The size of the font in pixels.
     *
     * @type number
     */
    this.fontSize = 16;

    /**
     * Whether the font is bold.
     *
     * @type boolean
     */
    this.fontBold = false;

    /**
     * Whether the font is italic.
     *
     * @type boolean
     */
    this.fontItalic = false;

    /**
     * The color of the text in CSS format.
     *
     * @type string
     */
    this.textColor = "#ffffff";

    /**
     * The color of the outline of the text in CSS format.
     *
     * @type string
     */
    this.outlineColor = "rgba(0, 0, 0, 0.5)";

    /**
     * The width of the outline of the text.
     *
     * @type number
     */
    this.outlineWidth = 3;
};

/**
 * 加载
 * Loads a image file.
 * 加载图像文件。
 *
 * @param {string} url - The image url of the texture.
 * @returns {Bitmap} The new bitmap object.
 */
Bitmap.load = function(url) {
    const bitmap = Object.create(Bitmap.prototype);
    bitmap.initialize();
    bitmap._url = url;
    bitmap._startLoading();
    return bitmap;
};

/**
 * 拍摄游戏屏幕快照。
 * Takes a snapshot of the game screen.
 *
 * @param {Stage} stage - The stage object.
 * @returns {Bitmap} The new bitmap object.
 */
Bitmap.snap = function(stage) {
    const width = Graphics.width;
    const height = Graphics.height;
    const bitmap = new Bitmap(width, height);
    const renderTexture = PIXI.RenderTexture.create(width, height);
    if (stage) {
        const renderer = Graphics.app.renderer;
        renderer.render(stage, renderTexture);
        stage.worldTransform.identity();
        const canvas = renderer.extract.canvas(renderTexture);
        bitmap.context.drawImage(canvas, 0, 0);
        canvas.width = 0;
        canvas.height = 0;
    }
    renderTexture.destroy({ destroyBase: true });
    bitmap.baseTexture.update();
    return bitmap;
};

/**
 * 是准备好的
 * Checks whether the bitmap is ready to render.
 * 检查位图是否准备好渲染。
 *
 * @returns {boolean} 如果准备好渲染位图，则为true。True if the bitmap is ready to render.
 */
Bitmap.prototype.isReady = function() {
    return this._loadingState === "loaded" || this._loadingState === "none";
};

/**
 * 是错误
 * Checks whether a loading error has occurred.
 * 检查是否发生加载错误。
 *
 * @returns {boolean} 如果发生加载错误，则为True。True if a loading error has occurred.
 */
Bitmap.prototype.isError = function() {
    return this._loadingState === "error";
};

/**
 * 网址
 * The url of the image file.
 * 图像文件的网址。
 *
 * @readonly
 * @type string
 * @name Bitmap#url
 */
Object.defineProperty(Bitmap.prototype, "url", {
    get: function() {
        return this._url;
    },
    configurable: true
});

/**
 * 基本纹理
 * The base texture that holds the image.
 * 保留图像的基本纹理。
 *
 * @readonly
 * @type PIXI.BaseTexture
 * @name Bitmap#baseTexture
 */
Object.defineProperty(Bitmap.prototype, "baseTexture", {
    get: function() {
        return this._baseTexture;
    },
    configurable: true
});

/**
 * 图像
 * The bitmap image.
 * 位图图像。
 *
 * @readonly
 * @type HTMLImageElement
 * @name Bitmap#image
 */
Object.defineProperty(Bitmap.prototype, "image", {
    get: function() {
        return this._image;
    },
    configurable: true
});

/**
 * 画布
 * The bitmap canvas.
 * 位图画布。
 *
 * @readonly
 * @type HTMLCanvasElement
 * @name Bitmap#canvas
 */
Object.defineProperty(Bitmap.prototype, "canvas", {
    get: function() {
        this._ensureCanvas();
        return this._canvas;
    },
    configurable: true
});

/**
 * 上下文
 * The 2d context of the bitmap canvas.
 * 位图画布的2d上下文。
 *
 * @readonly
 * @type CanvasRenderingContext2D
 * @name Bitmap#context
 */
Object.defineProperty(Bitmap.prototype, "context", {
    get: function() {
        this._ensureCanvas();
        return this._context;
    },
    configurable: true
});

/**
 * 宽
 * The width of the bitmap.
 * 位图的宽度。
 *
 * @readonly
 * @type number
 * @name Bitmap#width
 */
Object.defineProperty(Bitmap.prototype, "width", {
    get: function() {
        const image = this._canvas || this._image;
        return image ? image.width : 0;
    },
    configurable: true
});

/**
 * 高
 * The height of the bitmap.
 *
 * @readonly
 * @type number
 * @name Bitmap#height
 */
Object.defineProperty(Bitmap.prototype, "height", {
    get: function() {
        const image = this._canvas || this._image;
        return image ? image.height : 0;
    },
    configurable: true
});

/**
 * 矩形
 * The rectangle of the bitmap.
 * 位图的矩形。
 *
 * @readonly
 * @type Rectangle
 * @name Bitmap#rect
 */
Object.defineProperty(Bitmap.prototype, "rect", {
    get: function() {
        return new Rectangle(0, 0, this.width, this.height);
    },
    configurable: true
});

/**
 * 平滑
 * Whether the smooth scaling is applied.
 * 是否应用平滑缩放。
 *
 * @type boolean
 * @name Bitmap#smooth
 */
Object.defineProperty(Bitmap.prototype, "smooth", {
    get: function() {
        return this._smooth;
    },
    set: function(value) {
        if (this._smooth !== value) {
            this._smooth = value;
            this._updateScaleMode();
        }
    },
    configurable: true
});

/**
 * 绘图对象的不透明度
 * The opacity of the drawing object in the range (0, 255).
 * 绘图对象的不透明度在（0，255）范围内。
 *
 * @type number
 * @name Bitmap#paintOpacity
 */
Object.defineProperty(Bitmap.prototype, "paintOpacity", {
    get: function() {
        return this._paintOpacity;
    },
    set: function(value) {
        if (this._paintOpacity !== value) {
            this._paintOpacity = value;
            this.context.globalAlpha = this._paintOpacity / 255;
        }
    },
    configurable: true
});

/**
 * 销毁
 * Destroys the bitmap.
 * 销毁位图。
 */
Bitmap.prototype.destroy = function() {
    if (this._baseTexture) {
        this._baseTexture.destroy();
        this._baseTexture = null;
    }
    this._destroyCanvas();
};

/**
 * 调整大小
 * Resizes the bitmap.
 * 调整位图的大小。
 *
 * @param {number} width 位图的新宽度。- The new width of the bitmap.
 * @param {number} height 位图的新高度。- The new height of the bitmap.
 */
Bitmap.prototype.resize = function(width, height) {
    width = Math.max(width || 0, 1);
    height = Math.max(height || 0, 1);
    this.canvas.width = width;
    this.canvas.height = height;
    this.baseTexture.width = width;
    this.baseTexture.height = height;
};

/**
 * 
 * Performs a block transfer.
 * 执行块传输。
 *
 * @param {Bitmap} source 要绘制的位图。- The bitmap to draw.
 * @param {number} sx 源中的x坐标。- The x coordinate in the source.
 * @param {number} sy 源中的y坐标。- The y coordinate in the source.
 * @param {number} sw 源图像的宽度。 - The width of the source image.
 * @param {number} sh 源图像的高度。- The height of the source image.
 * @param {number} dx 目标中的x坐标。- The x coordinate in the destination.
 * @param {number} dy 目标中的y坐标。- The y coordinate in the destination.
 * @param {number} [dw=sw] 在目标中绘制图像的宽度。The width to draw the image in the destination.
 * @param {number} [dh=sh] 在目标中绘制图像的高度。The height to draw the image in the destination.
 */
Bitmap.prototype.blt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    try {
        const image = source._canvas || source._image;
        this.context.globalCompositeOperation = "source-over";
        this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        this._baseTexture.update();
    } catch (e) {
        //
    }
};

/**
 * 获得像素颜色
 * Returns pixel color at the specified point.
 * 返回指定点的像素颜色。
 *
 * @param {number} x 位图中像素的x坐标。- The x coordinate of the pixel in the bitmap.
 * @param {number} y 位图中像素的y坐标。- The y coordinate of the pixel in the bitmap.
 * @returns {string} 像素颜色（十六进制格式）。The pixel color (hex format).
 */
Bitmap.prototype.getPixel = function(x, y) {
    const data = this.context.getImageData(x, y, 1, 1).data;
    let result = "#";
    for (let i = 0; i < 3; i++) {
        result += data[i].toString(16).padZero(2);
    }
    return result;
};

/**
 * 获取Alpha像素
 * Returns alpha pixel value at the specified point.
 * 返回指定点的Alpha像素值。
 *
 * @param {number} x 位图中像素的x坐标。- The x coordinate of the pixel in the bitmap.
 * @param {number} y 位图中像素的y坐标。- The y coordinate of the pixel in the bitmap.
 * @returns {string} Alpha值。The alpha value.
 */
Bitmap.prototype.getAlphaPixel = function(x, y) {
    const data = this.context.getImageData(x, y, 1, 1).data;
    return data[3];
};

/**
 * 清除矩形
 * Clears the specified rectangle.
 * 清除指定的矩形。
 *
 * @param {number} x 左上角的x坐标。- The x coordinate for the upper-left corner.
 * @param {number} y 左上角的y坐标。- The y coordinate for the upper-left corner.
 * @param {number} width 要清除的矩形的宽度。- The width of the rectangle to clear.
 * @param {number} height 要清除的矩形的高度。- The height of the rectangle to clear.
 */
Bitmap.prototype.clearRect = function(x, y, width, height) {
    this.context.clearRect(x, y, width, height);
    this._baseTexture.update();
};

/**
 * 清除
 * Clears the entire bitmap.
 * 清除整个位图。
 */
Bitmap.prototype.clear = function() {
    this.clearRect(0, 0, this.width, this.height);
};

/**
 * 填充矩形
 * Fills the specified rectangle.
 * 填充指定的矩形。
 *
 * @param {number} x 左上角的x坐标。- The x coordinate for the upper-left corner.
 * @param {number} y 左上角的y坐标。- The y coordinate for the upper-left corner.
 * @param {number} width 要填充的矩形的宽度。- The width of the rectangle to fill.
 * @param {number} height 要填充的矩形的高度。- The height of the rectangle to fill.
 * @param {string} color CSS格式的矩形的颜色。- The color of the rectangle in CSS format.
 */
Bitmap.prototype.fillRect = function(x, y, width, height, color) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    context.restore();
    this._baseTexture.update();
};

/**
 * 全部填充
 * Fills the entire bitmap.
 * 填充整个位图。
 *
 * @param {string} color CSS格式的矩形的颜色。- The color of the rectangle in CSS format.
 */
Bitmap.prototype.fillAll = function(color) {
    this.fillRect(0, 0, this.width, this.height, color);
};

/**
 * 画矩形框
 * Draws the specified rectangular frame.
 * 绘制指定的矩形框。
 *
 * @param {number} x 左上角的x坐标。- The x coordinate for the upper-left corner.
 * @param {number} y 左上角的y坐标。- The y coordinate for the upper-left corner.
 * @param {number} width 要填充的矩形的宽度。- The width of the rectangle to fill.
 * @param {number} height 要填充的矩形的高度。- The height of the rectangle to fill.
 * @param {string} color CSS格式的矩形的颜色。- The color of the rectangle in CSS format.
 */
Bitmap.prototype.strokeRect = function(x, y, width, height, color) {
    const context = this.context;
    context.save();
    context.strokeStyle = color;
    context.strokeRect(x, y, width, height);
    context.restore();
    this._baseTexture.update();
};

// prettier-ignore
/**
 * 渐变填充矩形
 * Draws the rectangle with a gradation.
 * 用渐变绘制矩形。
 *
 * @param {number} x 左上角的x坐标。- The x coordinate for the upper-left corner.
 * @param {number} y 左上角的y坐标。- The y coordinate for the upper-left corner.
 * @param {number} width 要填充的矩形的宽度。- The width of the rectangle to fill.
 * @param {number} height 要填充的矩形的高度。- The height of the rectangle to fill.
 * @param {string} color1 渐变的起始颜色。- The gradient starting color.
 * @param {string} color2 渐变结束颜色。- The gradient ending color.
 * @param {boolean} vertical 渐变是否应绘制为垂直。- Whether the gradient should be draw as vertical or not.
 */
Bitmap.prototype.gradientFillRect = function(
    x, y, width, height, color1, color2, vertical
) {
    const context = this.context;
    const x1 = vertical ? x : x + width;
    const y1 = vertical ? y + height : y;
    const grad = context.createLinearGradient(x, y, x1, y1);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    context.save();
    context.fillStyle = grad;
    context.fillRect(x, y, width, height);
    context.restore();
    this._baseTexture.update();
};

/**
 * 画圆
 * Draws a bitmap in the shape of a circle.
 * 以圆形绘制位图。
 *
 * @param {number} x 基于圆心的x坐标。- The x coordinate based on the circle center.
 * @param {number} y 基于圆心的y坐标。- The y coordinate based on the circle center.
 * @param {number} radius 圆的半径。- The radius of the circle.
 * @param {string} color CSS格式的圆圈颜色。- The color of the circle in CSS format.
 */
Bitmap.prototype.drawCircle = function(x, y, radius, color) {
    const context = this.context;
    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.fill();
    context.restore();
    this._baseTexture.update();
};

/**
 * Draws the outline text to the bitmap.
 * 将文本绘制到位图。
 *
 * @param {string} text 将要绘制的文本。- The text that will be drawn.
 * @param {number} x 文本左侧的x坐标。- The x coordinate for the left of the text.
 * @param {number} y 文本顶部的y坐标。- The y coordinate for the top of the text.
 * @param {number} maxWidth 文本的最大允许宽度。- The maximum allowed width of the text.
 * @param {number} lineHeight 文本行的高度。- The height of the text line.
 * @param {string} align 文本的对齐方式。- The alignment of the text.
 */
Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
    // [Note] Different browser makes different rendering with
    //   textBaseline == 'top'. So we use 'alphabetic' here.
    const context = this.context;
    const alpha = context.globalAlpha;
    maxWidth = maxWidth || 0xffffffff;
    let tx = x;
    let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
    if (align === "center") {
        tx += maxWidth / 2;
    }
    if (align === "right") {
        tx += maxWidth;
    }
    context.save();
    context.font = this._makeFontNameText();
    context.textAlign = align;
    context.textBaseline = "alphabetic";
    context.globalAlpha = 1;
    this._drawTextOutline(text, tx, ty, maxWidth);
    context.globalAlpha = alpha;
    this._drawTextBody(text, tx, ty, maxWidth);
    context.restore();
    this._baseTexture.update();
};

/**
 * 测量文字宽度
 * Returns the width of the specified text.
 * 返回指定文本的宽度。
 *
 * @param {string} text 要测量的文本。- The text to be measured.
 * @returns {number} 文本的宽度（以像素为单位）。The width of the text in pixels.
 */
Bitmap.prototype.measureTextWidth = function(text) {
    const context = this.context;
    context.save();
    context.font = this._makeFontNameText();
    const width = context.measureText(text).width;
    context.restore();
    return width;
};

/**
 * 添加加载监听器
 * Adds a callback function that will be called when the bitmap is loaded.
 * 添加一个在加载位图时将调用的回调函数。
 *
 * @param {function} listner 回调函数。- The callback function.
 */
Bitmap.prototype.addLoadListener = function(listner) {
    if (!this.isReady()) {
        this._loadListeners.push(listner);
    } else {
        listner(this);
    }
};

/**
 * 重试
 * Tries to load the image again.
 * 尝试再次加载图像。
 */
Bitmap.prototype.retry = function() {
    this._startLoading();
};

/**
 * 制作字体名称文字
 */
Bitmap.prototype._makeFontNameText = function() {
    const italic = this.fontItalic ? "Italic " : "";
    const bold = this.fontBold ? "Bold " : "";
    return italic + bold + this.fontSize + "px " + this.fontFace;
};

/**
 * 绘制文字轮廓
 * @param {*} text 文本
 * @param {*} tx 文本x
 * @param {*} ty 文本y
 * @param {*} maxWidth 最大宽
 */
Bitmap.prototype._drawTextOutline = function(text, tx, ty, maxWidth) {
    const context = this.context;
    context.strokeStyle = this.outlineColor;
    context.lineWidth = this.outlineWidth;
    context.lineJoin = "round";
    context.strokeText(text, tx, ty, maxWidth);
};

/**
 * 绘制文字正文
 * @param {*} text 文本
 * @param {*} tx 文本x
 * @param {*} ty 文本y
 * @param {*} maxWidth 最大宽
 */
Bitmap.prototype._drawTextBody = function(text, tx, ty, maxWidth) {
    const context = this.context;
    context.fillStyle = this.textColor;
    context.fillText(text, tx, ty, maxWidth);
};

/**
 * 创建画布
 * @param {*} width 
 * @param {*} height 
 */
Bitmap.prototype._createCanvas = function(width, height) {
    this._canvas = document.createElement("canvas");
    this._context = this._canvas.getContext("2d");
    this._canvas.width = width;
    this._canvas.height = height;
    this._createBaseTexture(this._canvas);
};

/**
 * 确保画布
 */
Bitmap.prototype._ensureCanvas = function() {
    if (!this._canvas) {
        if (this._image) {
            this._createCanvas(this._image.width, this._image.height);
            this._context.drawImage(this._image, 0, 0);
        } else {
            this._createCanvas(0, 0);
        }
    }
};

/**
 * 销毁画布
 */
Bitmap.prototype._destroyCanvas = function() {
    if (this._canvas) {
        this._canvas.width = 0;
        this._canvas.height = 0;
        this._canvas = null;
    }
};

/**
 * 创建基础纹理
 * @param {*} source 
 */
Bitmap.prototype._createBaseTexture = function(source) {
    this._baseTexture = new PIXI.BaseTexture(source);
    this._baseTexture.mipmap = false;
    this._baseTexture.width = source.width;
    this._baseTexture.height = source.height;
    this._updateScaleMode();
};

/**
 * 更新比例模式
 */
Bitmap.prototype._updateScaleMode = function() {
    if (this._baseTexture) {
        if (this._smooth) {
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
        } else {
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
    }
};

/**
 * 开始加载
 */

Bitmap.prototype._startLoading = function() {
    this._image = new Image();
    this._image.onload = this._onLoad.bind(this);
    this._image.onerror = this._onError.bind(this);
    this._destroyCanvas();
    this._loadingState = "loading";
    if (Utils.hasEncryptedImages()) {
        this._startDecrypting();
    } else {
        this._image.src = this._url;
    }
};

/**
 * 开始解密
 */
Bitmap.prototype._startDecrypting = function() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", this._url + "_");
    xhr.responseType = "arraybuffer";
    xhr.onload = () => this._onXhrLoad(xhr);
    xhr.onerror = this._onError.bind(this);
    xhr.send();
};

/**
 * 当Xhr加载
 * @param {*} xhr 
 */
Bitmap.prototype._onXhrLoad = function(xhr) {
    if (xhr.status < 400) {
        const arrayBuffer = Utils.decryptArrayBuffer(xhr.response);
        const blob = new Blob([arrayBuffer]);
        this._image.src = URL.createObjectURL(blob);
    } else {
        this._onError();
    }
};

/**
 * 当加载
 */
Bitmap.prototype._onLoad = function() {
    if (Utils.hasEncryptedImages()) {
        //url.释放对象url
        URL.revokeObjectURL(this._image.src);
    }
    this._loadingState = "loaded";
    this._createBaseTexture(this._image);
    this._callLoadListeners();
};

/**
 * 调用加载侦听器
 */
Bitmap.prototype._callLoadListeners = function() {
    while (this._loadListeners.length > 0) {
        const listener = this._loadListeners.shift();
        listener(this);
    }
};

/**
 * 当错误时
 */
Bitmap.prototype._onError = function() {
    this._loadingState = "error";
};

