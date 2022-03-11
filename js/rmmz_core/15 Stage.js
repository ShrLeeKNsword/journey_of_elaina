//-----------------------------------------------------------------------------
/**
 * 舞台
 * The root object of the display tree.
 * 显示树的根对象。
 *
 * @class
 * @extends PIXI.Container
 */
function Stage() {
    this.initialize(...arguments);
}

Stage.prototype = Object.create(PIXI.Container.prototype);
Stage.prototype.constructor = Stage;

/**
 * 初始化
 */
Stage.prototype.initialize = function() {
    PIXI.Container.call(this);
};

/**
 * 销毁
 * Destroys the stage.
 * 销毁舞台。
 */
Stage.prototype.destroy = function() {
    const options = { children: true, texture: true };
    PIXI.Container.prototype.destroy.call(this, options);
};

