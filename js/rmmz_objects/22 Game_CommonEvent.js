//-----------------------------------------------------------------------------
// Game_CommonEvent
//
// The game object class for a common event. It contains functionality for
// running parallel process events.

/**
 * 游戏公共事件
 * 
 * 公共事件的游戏对象类。它包含用于运行并行流程事件的功能。
 */
function Game_CommonEvent() {
    this.initialize(...arguments);
}

/**
 * 初始化
 * @param {number} commonEventId 公共事件id
 */
Game_CommonEvent.prototype.initialize = function(commonEventId) {
    this._commonEventId = commonEventId;
    this.refresh();
};

/**
 * 事件数据
 */
Game_CommonEvent.prototype.event = function() {
    return $dataCommonEvents[this._commonEventId];
};

/**
 * 列表
 */
Game_CommonEvent.prototype.list = function() {
    return this.event().list;
};

/**
 * 刷新
 */
Game_CommonEvent.prototype.refresh = function() {
    if (this.isActive()) {
        if (!this._interpreter) {
            this._interpreter = new Game_Interpreter();
        }
    } else {
        this._interpreter = null;
    }
};

/**
 * 是活动的
 */
Game_CommonEvent.prototype.isActive = function() {
    const event = this.event();
    return event.trigger === 2 && $gameSwitches.value(event.switchId);
};

/**
 * 更新
 */
Game_CommonEvent.prototype.update = function() {
    if (this._interpreter) {
        if (!this._interpreter.isRunning()) {
            this._interpreter.setup(this.list());
        }
        this._interpreter.update();
    }
};

