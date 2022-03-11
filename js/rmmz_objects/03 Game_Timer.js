//-----------------------------------------------------------------------------
// Game_Timer
//
// The game object class for the timer.

/**
 * 游戏计时器
 * 
 * 计时器的游戏对象类。
 */
function Game_Timer() {
    this.initialize(...arguments);
}

/**
 * 初始化
 */
Game_Timer.prototype.initialize = function() {
    /**
     * 帧数
     */
    this._frames = 0;
    /**
     * 工作中
     */
    this._working = false;
};

/**
 * 更新
 * @param {boolean} sceneActive 场景活动 
 */
Game_Timer.prototype.update = function(sceneActive) {
    if (sceneActive && this._working && this._frames > 0) {
        this._frames--;
        if (this._frames === 0) {
            this.onExpire();
        }
    }
};

/**
 * 开始
 * @param {number} count 计数
 */
Game_Timer.prototype.start = function(count) {
    this._frames = count;
    this._working = true;
};

/**
 * 停止
 */
Game_Timer.prototype.stop = function() {
    this._working = false;
};

/**
 * 是运行中
 */
Game_Timer.prototype.isWorking = function() {
    return this._working;
};

/**
 * 秒
 */
Game_Timer.prototype.seconds = function() {
    return Math.floor(this._frames / 60);
};

/**
 * 当到期
 */
Game_Timer.prototype.onExpire = function() {
    BattleManager.abort();
};

