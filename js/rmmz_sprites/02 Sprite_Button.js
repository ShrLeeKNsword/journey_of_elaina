//-----------------------------------------------------------------------------
// Sprite_Button
//
// The sprite for displaying a button.

/**
 * 精灵按钮
 * 
 * 用于显示按钮的精灵。
 */
function Sprite_Button() {
    this.initialize(...arguments);
}

Sprite_Button.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_Button.prototype.constructor = Sprite_Button;

/**
 * 初始化
 * @param {string} buttonType 按钮类型
 */
Sprite_Button.prototype.initialize = function(buttonType) {
    Sprite_Clickable.prototype.initialize.call(this);
    this._buttonType = buttonType;
    this._clickHandler = null;
    this._coldFrame = null;
    this._hotFrame = null;
    this.setupFrames();
};

/**
 * 安装框架
 */
Sprite_Button.prototype.setupFrames = function() {
    const data = this.buttonData();
    const x = data.x * this.blockWidth();
    const width = data.w * this.blockWidth();
    const height = this.blockHeight();
    this.loadButtonImage();
    this.setColdFrame(x, 0, width, height);
    this.setHotFrame(x, height, width, height);
    this.updateFrame();
    this.updateOpacity();
};

/**
 * 块宽
 */
Sprite_Button.prototype.blockWidth = function() {
    return 48;
};

/**
 * 块高
 */
Sprite_Button.prototype.blockHeight = function() {
    return 48;
};

Sprite_Button.prototype.loadButtonImage = function() {
    this.bitmap = ImageManager.loadSystem("ButtonSet");
};

/**
 * 按钮数据
 */
Sprite_Button.prototype.buttonData = function() {
    const buttonTable = {
        cancel: { x: 0, w: 2 },
        pageup: { x: 2, w: 1 },
        pagedown: { x: 3, w: 1 },
        down: { x: 4, w: 1 },
        up: { x: 5, w: 1 },
        down2: { x: 6, w: 1 },
        up2: { x: 7, w: 1 },
        ok: { x: 8, w: 2 },
        menu: { x: 10, w: 1 }
    };
    return buttonTable[this._buttonType];
};

/**
 * 更新 
 */
Sprite_Button.prototype.update = function() {
    Sprite_Clickable.prototype.update.call(this);
    this.checkBitmap();
    this.updateFrame();
    this.updateOpacity();
    this.processTouch();
};

/**
 * 检查位图
 */
Sprite_Button.prototype.checkBitmap = function() {
    if (this.bitmap.isReady() && this.bitmap.width < this.blockWidth() * 11) {
        // Probably MV image is used
        throw new Error("ButtonSet image is too small");
    }
};

/**
 * 更新框架
 */
Sprite_Button.prototype.updateFrame = function() {
    const frame = this.isPressed() ? this._hotFrame : this._coldFrame;
    if (frame) {
        this.setFrame(frame.x, frame.y, frame.width, frame.height);
    }
};

/**
 * 更新不透明度
 */
Sprite_Button.prototype.updateOpacity = function() {
    this.opacity = this._pressed ? 255 : 192;
};

/**
 * 设置冷框
 * @param {*} x 
 * @param {*} y 
 * @param {*} width 
 * @param {*} height 
 */
Sprite_Button.prototype.setColdFrame = function(x, y, width, height) {
    this._coldFrame = new Rectangle(x, y, width, height);
};

/**
 * 设置热框
 * @param {*} x 
 * @param {*} y 
 * @param {*} width 
 * @param {*} height 
 */
Sprite_Button.prototype.setHotFrame = function(x, y, width, height) {
    this._hotFrame = new Rectangle(x, y, width, height);
};

/**
 * 设置点击处理程序
 */
Sprite_Button.prototype.setClickHandler = function(method) {
    this._clickHandler = method;
};

/**
 * 当点击
 */
Sprite_Button.prototype.onClick = function() {
    if (this._clickHandler) {
        this._clickHandler();
    } else {
        //虚拟点击
        Input.virtualClick(this._buttonType);
    }
};

