//-----------------------------------------------------------------------------
/**
 * The point class.
 * 点类。
 *
 * @class
 * @extends PIXI.Point
 * @param {number} x x坐标。- The x coordinate.
 * @param {number} y y坐标。- The y coordinate.
 */
function Point() {
    this.initialize(...arguments);
}

Point.prototype = Object.create(PIXI.Point.prototype);
Point.prototype.constructor = Point;

/**
 * 初始化
 * @param {number} x x坐标。- The x coordinate.
 * @param {number} y y坐标。- The y coordinate.
 */
Point.prototype.initialize = function(x, y) {
    PIXI.Point.call(this, x, y);
};

