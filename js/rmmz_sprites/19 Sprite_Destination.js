//-----------------------------------------------------------------------------
// Sprite_Destination
//
// The sprite for displaying the destination place of the touch input.

/**
 * 精灵目的地
 * 
 * 用于显示触摸输入的目标位置的精灵。
 * @mz 与mv无差异
 */
function Sprite_Destination() {
    this.initialize(...arguments);
}

Sprite_Destination.prototype = Object.create(Sprite.prototype);
Sprite_Destination.prototype.constructor = Sprite_Destination;

/**初始化 */
Sprite_Destination.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.createBitmap();
    this._frameCount = 0;
};

/**
 * 销毁
 * @param {*} options 
 */
Sprite_Destination.prototype.destroy = function(options) {
    if (this.bitmap) {
        this.bitmap.destroy();
    }
    Sprite.prototype.destroy.call(this, options);
};

/**
 * 更新 
 */
Sprite_Destination.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if ($gameTemp.isDestinationValid()) {
        this.updatePosition();
        this.updateAnimation();
        this.visible = true;
    } else {
        this._frameCount = 0;
        this.visible = false;
    }
};

/**
 * 创建位图
 */
Sprite_Destination.prototype.createBitmap = function() {
    const tileWidth = $gameMap.tileWidth();
    const tileHeight = $gameMap.tileHeight();
    this.bitmap = new Bitmap(tileWidth, tileHeight);
    this.bitmap.fillAll("white");
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.blendMode = 1;
};

/**
 * 更新位置
 */
Sprite_Destination.prototype.updatePosition = function() {
    const tileWidth = $gameMap.tileWidth();
    const tileHeight = $gameMap.tileHeight();
    const x = $gameTemp.destinationX();
    const y = $gameTemp.destinationY();
    this.x = ($gameMap.adjustX(x) + 0.5) * tileWidth;
    this.y = ($gameMap.adjustY(y) + 0.5) * tileHeight;
};

/**
 * 更新动画
 */
Sprite_Destination.prototype.updateAnimation = function() {
    this._frameCount++;
    this._frameCount %= 20;
    this.opacity = (20 - this._frameCount) * 6;
    this.scale.x = 1 + this._frameCount / 20;
    this.scale.y = this.scale.x;
};

