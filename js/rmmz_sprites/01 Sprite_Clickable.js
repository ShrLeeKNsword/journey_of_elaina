//-----------------------------------------------------------------------------
// Sprite_Clickable
//
// The sprite class with click handling functions.

/**
 * 精灵可点击
 * 
 * 具有点击处理功能的精灵类。
 */
function Sprite_Clickable() {
    this.initialize(...arguments);
}

Sprite_Clickable.prototype = Object.create(Sprite.prototype);
Sprite_Clickable.prototype.constructor = Sprite_Clickable;

/**
 * 初始化
 */
Sprite_Clickable.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._pressed = false;
    this._hovered = false;
};

/**
 * 更新 
 */
Sprite_Clickable.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.processTouch();
};

/**
 * 处理触摸
 */
Sprite_Clickable.prototype.processTouch = function() {
    if (this.isClickEnabled()) {
        if (this.isBeingTouched()) {
            if (!this._hovered && TouchInput.isHovered()) {
                this._hovered = true;
                this.onMouseEnter();
            }
            if (TouchInput.isTriggered()) {
                this._pressed = true;
                this.onPress();
            }
        } else {
            if (this._hovered) {
                this.onMouseExit();
            }
            this._pressed = false;
            this._hovered = false;
        }
        if (this._pressed && TouchInput.isReleased()) {
            this._pressed = false;
            this.onClick();
        }
    } else {
        this._pressed = false;
        this._hovered = false;
    }
};

/**
 * 是按下
 */
Sprite_Clickable.prototype.isPressed = function() {
    return this._pressed;
};

/**
 * 是单击启用
 */
Sprite_Clickable.prototype.isClickEnabled = function() {
    return this.worldVisible;
};

/**
 * 是存在触摸
 */
Sprite_Clickable.prototype.isBeingTouched = function() {
    const touchPos = new Point(TouchInput.x, TouchInput.y);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.hitTest(localPos.x, localPos.y);
};

/**
 * 命中测试
 * @param {number} x x坐标
 * @param {number} y y坐标
 */
Sprite_Clickable.prototype.hitTest = function(x, y) {
    const rect = new Rectangle(
        -this.anchor.x * this.width,
        -this.anchor.y * this.height,
        this.width,
        this.height
    );
    return rect.contains(x, y);
};

/**
 * 当鼠标输入时
 */
Sprite_Clickable.prototype.onMouseEnter = function() {
    //
};

/**
 * 当鼠标退出时
 */
Sprite_Clickable.prototype.onMouseExit = function() {
    //
};

/**
 * 当按时
 */
Sprite_Clickable.prototype.onPress = function() {
    //
};

/**
 * 当点击
 */
Sprite_Clickable.prototype.onClick = function() {
    //
};

