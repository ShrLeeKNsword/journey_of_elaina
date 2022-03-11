//-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.

/**
 * 游戏动作结果
 * 
 * 战斗动作的游戏对象类。为了方便起见，此类中的所有成员变量都是公共的。
 * 
 * @mv 大致相同
 * 
 */
function Game_ActionResult() {
    this.initialize(...arguments);
}

/**
 * 初始化
 */
Game_ActionResult.prototype.initialize = function() {
    this.clear();
};

/**
 * 清除
 */
Game_ActionResult.prototype.clear = function() {
    /**
     * 使用的
     */
    this.used = false;
    /**
     * 未击中的  
     */
    this.missed = false;
    /**
     * 闪避的
     */
    this.evaded = false;
    /**
     * 物理的
     */
    this.physical = false;
    /**
     * 吸收
     */
    this.drain = false;
    /**
     * 会心
     */
    this.critical = false;
    /**
     * 成功
     */
    this.success = false;
    /**
     * hp效果
     */
    this.hpAffected = false;
    /**
     * hp伤害
     */
    this.hpDamage = 0;
    /**
     * mp伤害
     */
    this.mpDamage = 0;
    /**
     * tp伤害
     */
    this.tpDamage = 0;
    /**
     * 添加的状态组
     */
    this.addedStates = [];
    /**
     * 移除的状态组
     */
    this.removedStates = [];
    /**
     * 添加的增益效果组
     */
    this.addedBuffs = [];
    /**
     * 添加的减益效果组
     */
    this.addedDebuffs = [];
    /**
     * 移除的效果组
     */
    this.removedBuffs = [];
};

/**
 * 添加的状态对象组
 */
Game_ActionResult.prototype.addedStateObjects = function() {
    return this.addedStates.map(id => $dataStates[id]);
};

/**
 * 移除的状态对象组
 */
Game_ActionResult.prototype.removedStateObjects = function() {
    return this.removedStates.map(id => $dataStates[id]);
};

/**
 * 是状态影响后
 * @return {boolean} 
 */
Game_ActionResult.prototype.isStatusAffected = function() {
    return (
        this.addedStates.length > 0 ||
        this.removedStates.length > 0 ||
        this.addedBuffs.length > 0 ||
        this.addedDebuffs.length > 0 ||
        this.removedBuffs.length > 0
    );
};

/**
 * 是击中
 * @return {boolean} 
*/
Game_ActionResult.prototype.isHit = function() {
    return this.used && !this.missed && !this.evaded;
};

/**
 * 是状态已经添加
 * @param {number} stateId 状态id
 * @return {boolean} 
*/
Game_ActionResult.prototype.isStateAdded = function(stateId) {
    return this.addedStates.includes(stateId);
};

/**
 * 增加添加的状态
 * @param {number} stateId 状态id 
*/
Game_ActionResult.prototype.pushAddedState = function(stateId) {
    if (!this.isStateAdded(stateId)) {
        this.addedStates.push(stateId);
    }
};

/**
 * 是状态移除已经添加
 * @param {number} stateId 状态id
 * @return {boolean} 
*/
Game_ActionResult.prototype.isStateRemoved = function(stateId) {
    return this.removedStates.includes(stateId);
};

/**
 * 增加移除状态
 * @param {number} stateId 状态id 
*/
Game_ActionResult.prototype.pushRemovedState = function(stateId) {
    if (!this.isStateRemoved(stateId)) {
        this.removedStates.push(stateId);
    }
};

/**
 * 是增益效果已经添加
 * @param {number} paramId 参数id 
 * @return {boolean} 
*/
Game_ActionResult.prototype.isBuffAdded = function(paramId) {
    return this.addedBuffs.includes(paramId);
};

/**
 * 增加添加的增益效果
 * @param {number} paramId 参数id 
*/
Game_ActionResult.prototype.pushAddedBuff = function(paramId) {
    if (!this.isBuffAdded(paramId)) {
        this.addedBuffs.push(paramId);
    }
};

/**
 * 是减益效果已经添加
 * @param {number} paramId 参数id 
 * @return {boolean} 
*/
Game_ActionResult.prototype.isDebuffAdded = function(paramId) {
    return this.addedDebuffs.includes(paramId);
};

/**
 * 增加添加的减益效果
 * @param {number} paramId 参数id 
*/
Game_ActionResult.prototype.pushAddedDebuff = function(paramId) {
    if (!this.isDebuffAdded(paramId)) {
        this.addedDebuffs.push(paramId);
    }
};

/**
 * 是效果移除已经添加
 * @param {number} paramId 参数id 
*/
Game_ActionResult.prototype.isBuffRemoved = function(paramId) {
    return this.removedBuffs.includes(paramId);
};

/**
 * 增加移除的效果
 * @param {number} paramId 参数id 
*/
Game_ActionResult.prototype.pushRemovedBuff = function(paramId) {
    if (!this.isBuffRemoved(paramId)) {
        this.removedBuffs.push(paramId);
    }
};

