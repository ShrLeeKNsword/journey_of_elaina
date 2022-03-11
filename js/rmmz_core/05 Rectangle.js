//-----------------------------------------------------------------------------
/**
 * The rectangle class.
 * 矩形类。
 *
 * @class
 * @extends PIXI.Rectangle
 * @param {number} x 左上角的x坐标。- The x coordinate for the upper-left corner.
 * @param {number} y 左上角的y坐标。- The y coordinate for the upper-left corner.
 * @param {number} width 矩形的宽度。- The width of the rectangle.
 * @param {number} height 矩形的高度。- The height of the rectangle.
 */
function Rectangle() {
    this.initialize(...arguments);
}

Rectangle.prototype = Object.create(PIXI.Rectangle.prototype);
Rectangle.prototype.constructor = Rectangle;

/**
 * 初始化
 * @param {number} x 左上角的x坐标。- The x coordinate for the upper-left corner.
 * @param {number} y 左上角的y坐标。- The y coordinate for the upper-left corner.
 * @param {number} width 矩形的宽度。- The width of the rectangle.
 * @param {number} height 矩形的高度。- The height of the rectangle.
 */
Rectangle.prototype.initialize = function(x, y, width, height) {
    PIXI.Rectangle.call(this, x, y, width, height);
};

