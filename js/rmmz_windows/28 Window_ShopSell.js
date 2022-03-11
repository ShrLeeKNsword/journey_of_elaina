//-----------------------------------------------------------------------------
// Window_ShopSell
//
// The window for selecting an item to sell on the shop screen.

function Window_ShopSell() {
    this.initialize(...arguments);
}

Window_ShopSell.prototype = Object.create(Window_ItemList.prototype);
Window_ShopSell.prototype.constructor = Window_ShopSell;

/**
 * 初始化
 * @param {Rectangle} rect 矩形
 */
Window_ShopSell.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
};

Window_ShopSell.prototype.isEnabled = function(item) {
    return item && item.price > 0;
};

