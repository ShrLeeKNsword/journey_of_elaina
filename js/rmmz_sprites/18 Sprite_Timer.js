//-----------------------------------------------------------------------------
// Sprite_Timer
//
// The sprite for displaying the timer.

/**
 * 精灵计时器
 * 
 * 用于显示计时器的精灵。
 */
function Sprite_Timer() {
    this.initialize(...arguments);
}

Sprite_Timer.prototype = Object.create(Sprite.prototype);
Sprite_Timer.prototype.constructor = Sprite_Timer;

/**初始化 */
Sprite_Timer.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._seconds = 0;
    this.createBitmap();
    this.update();
};

/**
 * 销毁
 * @param {*} options 
 */
Sprite_Timer.prototype.destroy = function(options) {
    this.bitmap.destroy();
    Sprite.prototype.destroy.call(this, options);
};

/**
 * 创建位图
 * @mz 新增了自定的字体和字体大小
 */
Sprite_Timer.prototype.createBitmap = function() {
    this.bitmap = new Bitmap(96, 48);
    this.bitmap.fontFace = this.fontFace();
    this.bitmap.fontSize = this.fontSize();
    this.bitmap.outlineColor = ColorManager.outlineColor();
};

/**
 * 字体
 * @mz 新增
 */
Sprite_Timer.prototype.fontFace = function() {
    return $gameSystem.numberFontFace();
};

/**
 * 字体大小
 * @mz 新增
 */
Sprite_Timer.prototype.fontSize = function() {
    return $gameSystem.mainFontSize() + 8;
};

/**
 * 更新 
 */
Sprite_Timer.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updatePosition();
    this.updateVisibility();
};

/**
 * 更新位图
 */
Sprite_Timer.prototype.updateBitmap = function() {
    if (this._seconds !== $gameTimer.seconds()) {
        this._seconds = $gameTimer.seconds();
        this.redraw();
    }
};

/**
 * 重绘
 */
Sprite_Timer.prototype.redraw = function() {
    const text = this.timerText();
    const width = this.bitmap.width;
    const height = this.bitmap.height;
    this.bitmap.clear();
    this.bitmap.drawText(text, 0, 0, width, height, "center");
};

/**
 * 计时器文本
 */
Sprite_Timer.prototype.timerText = function() {
    const min = Math.floor(this._seconds / 60) % 60;
    const sec = this._seconds % 60;
    return min.padZero(2) + ":" + sec.padZero(2);
};

/**
 * 更新位置
 */
Sprite_Timer.prototype.updatePosition = function() {
    this.x = (Graphics.width - this.bitmap.width) / 2;
    this.y = 0;
};

/**
 * 更新可见性
 */
Sprite_Timer.prototype.updateVisibility = function() {
    this.visible = $gameTimer.isWorking();
};

