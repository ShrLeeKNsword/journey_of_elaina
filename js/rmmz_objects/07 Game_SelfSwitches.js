//-----------------------------------------------------------------------------
// Game_SelfSwitches
//
// The game object class for self switches.

/**
 * 游戏独立开关
 * 
 * 独立开关的游戏对象类。
 */
function Game_SelfSwitches() {
    this.initialize(...arguments);
}

/**
 * 初始化
 */
Game_SelfSwitches.prototype.initialize = function() {
    this.clear();
};

/**
 * 清除
 */
Game_SelfSwitches.prototype.clear = function() {
    this._data = {};
};

/**
 * 值
 * @param {string} key 键
 * @returns {boolean} 返回独立开关值 
 */
Game_SelfSwitches.prototype.value = function(key) {
    return !!this._data[key];
};

/**
 * 设置值
 * @param {string} key 键
 * @param {boolean} value 值 
 */
Game_SelfSwitches.prototype.setValue = function(key, value) {
    if (value) {
        this._data[key] = true;
    } else {
        delete this._data[key];
    }
    this.onChange();
};

/**
 * 当改变
 */
Game_SelfSwitches.prototype.onChange = function() {
    //游戏地图.请求刷新()
    $gameMap.requestRefresh();
};

