//-----------------------------------------------------------------------------
// Game_Switches
//
// The game object class for switches.

/**
 * 游戏开关
 * 
 * 开关的游戏对象类。
 */
function Game_Switches() {
    this.initialize(...arguments);
}

/**
 * 初始化
 */
Game_Switches.prototype.initialize = function() {
    this.clear();
};

/**
 * 清除
 */
Game_Switches.prototype.clear = function() {
    this._data = [];
};

/**
 * 值
 * @param {number} switchId 开关id
 * @returns {boolean} 开关是否打开
 */
Game_Switches.prototype.value = function(switchId) {
    return !!this._data[switchId];
};

/**
 * 设置值
 * @param {number} switchId 开关id 
 * @param {boolean} value 值
 */
Game_Switches.prototype.setValue = function(switchId, value) {
    //如果 开关id>0 并且 开关id < 系统开关组数量
    if (switchId > 0 && switchId < $dataSystem.switches.length) {
        this._data[switchId] = value;
        this.onChange();
    }
};

/**
 * 当改变
 */
Game_Switches.prototype.onChange = function() {
    //游戏地图.请求刷新()
    $gameMap.requestRefresh();
};

