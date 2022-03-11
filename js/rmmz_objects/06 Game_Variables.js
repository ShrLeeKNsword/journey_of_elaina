//-----------------------------------------------------------------------------
// Game_Variables
//
// The game object class for variables.

/**
 * 游戏变量
 * 
 * 变量的游戏对象类。
 */
function Game_Variables() {
    this.initialize(...arguments);
}

/**
 * 初始化
 */
Game_Variables.prototype.initialize = function() {
    this.clear();
};

/**
 * 清除
 */
Game_Variables.prototype.clear = function() {
    /**
     * 数据 
     */
    this._data = [];
};

/**
 * 值
 * @param {number} variableId 变量id
 * @returns {*|number} 返回变量值
 */
Game_Variables.prototype.value = function(variableId) {
    return this._data[variableId] || 0;
};

/**
 * 设置值
 * @param {number} variableId 变量id
 * @param {*|number} value 值 如果为数字则向下取整
 */
Game_Variables.prototype.setValue = function(variableId, value) {
    if (variableId > 0 && variableId < $dataSystem.variables.length) {
        if (typeof value === "number") {
            value = Math.floor(value);
        }
        this._data[variableId] = value;
        this.onChange();
    }
};

/**
 * 当改变
 */
Game_Variables.prototype.onChange = function() {
    //游戏地图.请求刷新()
    $gameMap.requestRefresh();
};

