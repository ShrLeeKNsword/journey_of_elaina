//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.

/**
 * 游戏临时
 * 
 * 保存未包含在存档中的临时数据的游戏对象类。
 */
function Game_Temp() {
    this.initialize(...arguments);
}

/**
 * 初始化
 */
Game_Temp.prototype.initialize = function() {
    /**
     * 是游戏测试
     * @type {boolean}
     */
    this._isPlaytest = Utils.isOptionValid("test");
    /**
     * 目的地x坐标
     * @type {null|number}
     */
    this._destinationX = null;
    /**
     * 目的地y坐标
     * @type {null|number}
     */
    this._destinationY = null;
    /**
     * 触摸目标
     */
    this._touchTarget = null;
    /**
     * 触摸状态
     */
    this._touchState = "";
    /**
     * 需要战斗刷新
     */
    this._needsBattleRefresh = false;
    /**
     * 公共事件队列
     */
    this._commonEventQueue = [];
    /**
     * 动画队列
     */
    this._animationQueue = [];
    /**
     * 气泡队列
     */
    this._balloonQueue = [];
    /**
     * 最后动作数据
     */
    this._lastActionData = [0, 0, 0, 0, 0, 0];
};

/**
 * 是游戏测试
 * @returns {boolean} 是否是游戏测试
 */
Game_Temp.prototype.isPlaytest = function() {
    return this._isPlaytest;
};

/**
 * 设置目的地
 * @param {number} x 目的地x坐标
 * @param {number} y 目的地y坐标
 */
Game_Temp.prototype.setDestination = function(x, y) {
    this._destinationX = x;
    this._destinationY = y;
};

/**
 * 清除目的地
 */
Game_Temp.prototype.clearDestination = function() {
    this._destinationX = null;
    this._destinationY = null;
};

/**
 * 是目的地有效
 * @returns {boolean} 是否是有效的目的地(目的地x不为null)
 */
Game_Temp.prototype.isDestinationValid = function() {
    return this._destinationX !== null;
};

/**
 * 目的地x坐标
 */
Game_Temp.prototype.destinationX = function() {
    return this._destinationX;
};

/**
 * 目的地y坐标
 */
Game_Temp.prototype.destinationY = function() {
    return this._destinationY;
};

/**
 * 设置触摸状态
 * @param {*} target 触摸目标
 * @param {string} state 触摸状态
 */
Game_Temp.prototype.setTouchState = function(target, state) {
    this._touchTarget = target;
    this._touchState = state;
};

/**
 * 清除触摸状态
 */
Game_Temp.prototype.clearTouchState = function() {
    this._touchTarget = null;
    this._touchState = "";
};

/**
 * 触摸目标
 */
Game_Temp.prototype.touchTarget = function() {
    return this._touchTarget;
};

/**
 * 触摸状态
 * @returns {string} 触摸状态
 */
Game_Temp.prototype.touchState = function() {
    return this._touchState;
};

/**
 * 请求战斗刷新
 */
Game_Temp.prototype.requestBattleRefresh = function() {
    if ($gameParty.inBattle()) {
        this._needsBattleRefresh = true;
    }
};

/**
 * 清除战斗刷新请求
 */
Game_Temp.prototype.clearBattleRefreshRequest = function() {
    this._needsBattleRefresh = false;
};

/**
 * 是请求战斗刷新的
 */
Game_Temp.prototype.isBattleRefreshRequested = function() {
    return this._needsBattleRefresh;
};

/**
 * 保存公共事件
 * @param {number} commonEventId 公共事件id
 */
Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
    this._commonEventQueue.push(commonEventId);
};

/**
 * 取回公共事件
 */
Game_Temp.prototype.retrieveCommonEvent = function() {
    return $dataCommonEvents[this._commonEventQueue.shift()];
};

/**
 * 是有保存的公共事件
 */
Game_Temp.prototype.isCommonEventReserved = function() {
    return this._commonEventQueue.length > 0;
};

// prettier-ignore
/**
 * 请求动画
 * @param {[]} targets 目标
 * @param {number} animationId 动画id
 * @param {boolean}  [mirror] 镜像
 */
Game_Temp.prototype.requestAnimation = function(
    targets, animationId, mirror = false
) {
    if ($dataAnimations[animationId]) {
        const request = {
            targets: targets,
            animationId: animationId,
            mirror: mirror
        };
        this._animationQueue.push(request);
        for (const target of targets) {
            if (target.startAnimation) {
                target.startAnimation();
            }
        }
    }
};

/**
 * 取回动画
 */
Game_Temp.prototype.retrieveAnimation = function() {
    return this._animationQueue.shift();
};

/**
 * 请求气泡
 * @param {*} target 
 * @param {*} balloonId 
 */
Game_Temp.prototype.requestBalloon = function(target, balloonId) {
    const request = { target: target, balloonId: balloonId };
    this._balloonQueue.push(request);
    if (target.startBalloon) {
        target.startBalloon();
    }
};

/**
 * 取回气泡
 */
Game_Temp.prototype.retrieveBalloon = function() {
    return this._balloonQueue.shift();
};

/**
 * 最后的动作数据
 * @param {number} type 种类
 * @returns {number} 动作数据 
 */
Game_Temp.prototype.lastActionData = function(type) {
    return this._lastActionData[type] || 0;
};

/**
 * 设置最后的动作数据
 * @param {number} type 种类
 * @param {number} value 值
 */
Game_Temp.prototype.setLastActionData = function(type, value) {
    this._lastActionData[type] = value;
};


/**
 * 设置最后使用的技能id
 * @param {numebr} skillID 技能id
 */
Game_Temp.prototype.setLastUsedSkillId = function(skillID) {
    this.setLastActionData(0, skillID);
};

/**
 * 设置最后使用的物品id
 * @param {numebr} itemID 物品id
 */
Game_Temp.prototype.setLastUsedItemId = function(itemID) {
    this.setLastActionData(1, itemID);
};

/**
 * 设置最后主体角色id
 * @param {numebr} actorID 角色id
 */
Game_Temp.prototype.setLastSubjectActorId = function(actorID) {
    this.setLastActionData(2, actorID);
};

/**
 * 设置最后主体敌人索引
 * @param {number} enemyIndex 敌人索引
 */
Game_Temp.prototype.setLastSubjectEnemyIndex = function(enemyIndex) {
    this.setLastActionData(3, enemyIndex);
};

/**
 * 设置最后目标角色id
 * @param {number} actorID 角色id
 */
Game_Temp.prototype.setLastTargetActorId = function(actorID) {
    this.setLastActionData(4, actorID);
};

/**
 * 设置最后目标敌人索引
 * @param {number} enemyIndex 敌人索引
 */
Game_Temp.prototype.setLastTargetEnemyIndex = function(enemyIndex) {
    this.setLastActionData(5, enemyIndex);
};

