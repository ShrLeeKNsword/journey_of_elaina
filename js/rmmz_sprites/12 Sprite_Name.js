//-----------------------------------------------------------------------------
// Sprite_Name
//
// The sprite for displaying a status gauge.

/**
 * 精灵名称
 * 
 * 用于显示状态仪表的精灵
 */
function Sprite_Name() {
    this.initialize(...arguments);
}

Sprite_Name.prototype = Object.create(Sprite.prototype);
Sprite_Name.prototype.constructor = Sprite_Name;

/**
 * 初始化
 */
Sprite_Name.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.createBitmap();
};

/**
 * 初始化成员
 */
Sprite_Name.prototype.initMembers = function() {
    this._battler = null;
    this._name = "";
    this._textColor = "";
};

/**
 * 销毁
 * @param {*} options 
 */
Sprite_Name.prototype.destroy = function(options) {
    this.bitmap.destroy();
    Sprite.prototype.destroy.call(this, options);
};

/**
 * 创建位图
 */
Sprite_Name.prototype.createBitmap = function() {
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.bitmap = new Bitmap(width, height);
};

/**
 * 位图宽度
 */
Sprite_Name.prototype.bitmapWidth = function() {
    return 128;
};

/**
 * 位图高度
 */
Sprite_Name.prototype.bitmapHeight = function() {
    return 24;
};

/**
 * 字体
 */
Sprite_Name.prototype.fontFace = function() {
    return $gameSystem.mainFontFace();
};

/**
 * 字体大小
 */
Sprite_Name.prototype.fontSize = function() {
    return $gameSystem.mainFontSize();
};

/**
 * 安装
 * @param {*} battler 
 */
Sprite_Name.prototype.setup = function(battler) {
    this._battler = battler;
    this.updateBitmap();
};

/**
 * 更新 
 */
Sprite_Name.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
};

/**
 * 更新位图
 */
Sprite_Name.prototype.updateBitmap = function() {
    const name = this.name();
    const color = this.textColor();
    if (name !== this._name || color !== this._textColor) {
        this._name = name;
        this._textColor = color;
        this.redraw();
    }
};

/**
 * 名称
 */
Sprite_Name.prototype.name = function() {
    return this._battler ? this._battler.name() : "";
};

/**
 * 文本颜色
 */
Sprite_Name.prototype.textColor = function() {
    return ColorManager.hpColor(this._battler);
};

/**
 * 轮廓颜色
 */
Sprite_Name.prototype.outlineColor = function() {
    return ColorManager.outlineColor();
};

/**
 * 轮廓宽度
 */
Sprite_Name.prototype.outlineWidth = function() {
    return 3;
};

/**
 * 重画
 */
Sprite_Name.prototype.redraw = function() {
    const name = this.name();
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.setupFont();
    this.bitmap.clear();
    this.bitmap.drawText(name, 0, 0, width, height, "left");
};

/**
 * 安装字体
 */
Sprite_Name.prototype.setupFont = function() {
    this.bitmap.fontFace = this.fontFace();
    this.bitmap.fontSize = this.fontSize();
    this.bitmap.textColor = this.textColor();
    this.bitmap.outlineColor = this.outlineColor();
    this.bitmap.outlineWidth = this.outlineWidth();
};

