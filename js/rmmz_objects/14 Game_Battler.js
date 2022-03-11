//-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

/**
 * 游戏战斗者
 * 
 * 游戏角色和游戏敌人的超类。它包含精灵和动作的方法。
 */
function Game_Battler() {
    this.initialize(...arguments);
}

Game_Battler.prototype = Object.create(Game_BattlerBase.prototype);
Game_Battler.prototype.constructor = Game_Battler;

/**初始化*/
Game_Battler.prototype.initialize = function() {
    Game_BattlerBase.prototype.initialize.call(this);
};

/**初始化成员*/
Game_Battler.prototype.initMembers = function() {
    Game_BattlerBase.prototype.initMembers.call(this);
    this._actions = [];
    this._speed = 0;
    this._result = new Game_ActionResult();
    this._actionState = "";
    this._lastTargetIndex = 0;
    this._damagePopup = false;
    this._effectType = null;
    this._motionType = null;
    this._weaponImageId = 0;
    this._motionRefresh = false;
    this._selected = false;
    this._tpbState = "";
    this._tpbChargeTime = 0;
    this._tpbCastTime = 0;
    this._tpbIdleTime = 0;
    this._tpbTurnCount = 0;
    this._tpbTurnEnd = false;
};

/**
 * @mv Game_Battler.prototype.clearAnimations 被移除
 */

/**清除伤害跃上*/
Game_Battler.prototype.clearDamagePopup = function() {
    this._damagePopup = false;
};

/**清除武器动画*/
Game_Battler.prototype.clearWeaponAnimation = function() {
    this._weaponImageId = 0;
};

/**清除效果*/
Game_Battler.prototype.clearEffect = function() {
    this._effectType = null;
};

/**清除动作*/
Game_Battler.prototype.clearMotion = function() {
    this._motionType = null;
    this._motionRefresh = false;
};

/**请求效果*/
Game_Battler.prototype.requestEffect = function(effectType) {
    this._effectType = effectType;
};

/**请求动作*/
Game_Battler.prototype.requestMotion = function(motionType) {
    this._motionType = motionType;
};

/**请求动作刷新*/
Game_Battler.prototype.requestMotionRefresh = function() {
    this._motionRefresh = true;
};

/**选择*/
Game_Battler.prototype.select = function() {
    this._selected = true;
};

/**取消选择*/
Game_Battler.prototype.deselect = function() {
    this._selected = false;
};

/**
 * @mv  Game_Battler.prototype.isAnimationRequested 被移除 
 */

/**是伤害跃上请求*/
Game_Battler.prototype.isDamagePopupRequested = function() {
    return this._damagePopup;
};

/**是效果请求*/
Game_Battler.prototype.isEffectRequested = function() {
    return !!this._effectType;
};

/**是动作请求*/
Game_Battler.prototype.isMotionRequested = function() {
    return !!this._motionType;
};

/**是武器动画请求*/
Game_Battler.prototype.isWeaponAnimationRequested = function() {
    return this._weaponImageId > 0;
};

/**是动作刷新请求*/
Game_Battler.prototype.isMotionRefreshRequested = function() {
    return this._motionRefresh;
};

/**是选择的*/
Game_Battler.prototype.isSelected = function() {
    return this._selected;
};

/**效果种类*/
Game_Battler.prototype.effectType = function() {
    return this._effectType;
};

/**动作种类*/
Game_Battler.prototype.motionType = function() {
    return this._motionType;
};

/**武器图片id*/
Game_Battler.prototype.weaponImageId = function() {
    return this._weaponImageId;
};

/**
 * @mv Game_Battler.prototype.shiftAnimation 被移除
 */
/** 
 * @mv Game_Battler.prototype.startAnimation
 */

/**开始伤害跃上*/
Game_Battler.prototype.startDamagePopup = function() {
    this._damagePopup = true;
};

/**
 * 需要伤害跃上
 * @mz 新增
 */
Game_Battler.prototype.shouldPopupDamage = function() {
    const result = this._result;
    return (
        result.missed ||
        result.evaded ||
        result.hpAffected ||
        result.mpDamage !== 0
    );
};

/**开始武器动画*/
Game_Battler.prototype.startWeaponAnimation = function(weaponImageId) {
    this._weaponImageId = weaponImageId;
};

/**动作*/
Game_Battler.prototype.action = function(index) {
    return this._actions[index];
};

/**设置动作*/
Game_Battler.prototype.setAction = function(index, action) {
    this._actions[index] = action;
};

/**动作组总个数*/
Game_Battler.prototype.numActions = function() {
    return this._actions.length;
};

/**清除动作组*/
Game_Battler.prototype.clearActions = function() {
    this._actions = [];
};

/**结果*/
Game_Battler.prototype.result = function() {
    return this._result;
};

/**清除结果*/
Game_Battler.prototype.clearResult = function() {
    this._result.clear();
};

/**
 * 清除Tpb充电时间
 * @mz 新增
 */
Game_Battler.prototype.clearTpbChargeTime = function() {
    this._tpbState = "charging";
    this._tpbChargeTime = 0;
};
/**
 * 应用Tpb惩罚
 * @mz 新增 
 */
Game_Battler.prototype.applyTpbPenalty = function() {
    this._tpbState = "charging";
    this._tpbChargeTime -= 1;
};

/**
 * 初始Tpb充电时间
 * @param {boolean} advantageous  是否有利
 * @mz 新增 
 */
Game_Battler.prototype.initTpbChargeTime = function(advantageous) {
    const speed = this.tpbRelativeSpeed();
    this._tpbState = "charging";
    this._tpbChargeTime = advantageous ? 1 : speed * Math.random() * 0.5;
    if (this.isRestricted()) {
        this._tpbChargeTime = 0;
    }
};

/**
 * tpb充电时间
 * @mz 新增
 */
Game_Battler.prototype.tpbChargeTime = function() {
    return this._tpbChargeTime;
};

/**
 * 开始Tpb分配
 * @mz 新增
 */
Game_Battler.prototype.startTpbCasting = function() {
    this._tpbState = "casting";
    this._tpbCastTime = 0;
};

/**
 * 开始Tpb动作
 * @mz 新增
 */
Game_Battler.prototype.startTpbAction = function() {
    this._tpbState = "acting";
};

/**
 * 是Tpb充电
 * @mz 新增
 */
Game_Battler.prototype.isTpbCharged = function() {
    return this._tpbState === "charged";
};

/**
 * 是TPb准备好
 * @mz 新增
 */
Game_Battler.prototype.isTpbReady = function() {
    return this._tpbState === "ready";
};

/**
 * 是Tpb超时
 * @mz 新增
 */
Game_Battler.prototype.isTpbTimeout = function() {
    return this._tpbIdleTime >= 1;
};

/**
 * 更新tpb
 * @mz 新增
 */
Game_Battler.prototype.updateTpb = function() {
    if (this.canMove()) {
        this.updateTpbChargeTime();
        this.updateTpbCastTime();
        this.updateTpbAutoBattle();
    }
    if (this.isAlive()) {
        this.updateTpbIdleTime();
    }
};

/**
 * 更新Tpb充电时间
 * @mz 新增
 */
Game_Battler.prototype.updateTpbChargeTime = function() {
    if (this._tpbState === "charging") {
        this._tpbChargeTime += this.tpbAcceleration();
        if (this._tpbChargeTime >= 1) {
            this._tpbChargeTime = 1;
            this.onTpbCharged();
        }
    }
};

/**
 * 更新Tpb投放时间
 * @mz 新增
 */
Game_Battler.prototype.updateTpbCastTime = function() {
    if (this._tpbState === "casting") {
        this._tpbCastTime += this.tpbAcceleration();
        if (this._tpbCastTime >= this.tpbRequiredCastTime()) {
            this._tpbCastTime = this.tpbRequiredCastTime();
            this._tpbState = "ready";
        }
    }
};

/**
 * 更新tpb自动战斗
 * @mz 新增
 */
Game_Battler.prototype.updateTpbAutoBattle = function() {
    if (this.isTpbCharged() && !this.isTpbTurnEnd() && this.isAutoBattle()) {
        this.makeTpbActions();
    }
};

/**
 * 更新Tpb空闲时间
 * @mz 新增
 */
Game_Battler.prototype.updateTpbIdleTime = function() {
    if (!this.canMove() || this.isTpbCharged()) {
        this._tpbIdleTime += this.tpbAcceleration();
    }
};

/**
 * tpb加速
 * @mz 新增
 */
Game_Battler.prototype.tpbAcceleration = function() {
    const speed = this.tpbRelativeSpeed();
    const referenceTime = $gameParty.tpbReferenceTime();
    return speed / referenceTime;
};

/**
 * tpb相对速度
 * @mz 新增
 */
Game_Battler.prototype.tpbRelativeSpeed = function() {
    return this.tpbSpeed() / $gameParty.tpbBaseSpeed();
};

/**
 * tpb速度
 * @mz 新增
 */
Game_Battler.prototype.tpbSpeed = function() {
    return Math.sqrt(this.agi) + 1;
};

/**
 * tpb基本速度
 * @mz 新增
 * 
 */
Game_Battler.prototype.tpbBaseSpeed = function() {
    const baseAgility = this.paramBasePlus(6);
    return Math.sqrt(baseAgility) + 1;
};

/**
 * tpb所需的投放时间
 * @mz 新增
 * 
 */
Game_Battler.prototype.tpbRequiredCastTime = function() {
    const actions = this._actions.filter(action => action.isValid());
    const items = actions.map(action => action.item());
    const delay = items.reduce((r, item) => r + Math.max(0, -item.speed), 0);
    return Math.sqrt(delay) / this.tpbSpeed();
};

/**
 * 当Tpb充电
 * @mz 新增
 * 
 */
Game_Battler.prototype.onTpbCharged = function() {
    if (!this.shouldDelayTpbCharge()) {
        this.finishTpbCharge();
    }
};

/**
 * 应该延迟Tpb充电
 * @mz 新增
 */
Game_Battler.prototype.shouldDelayTpbCharge = function() {
    return !BattleManager.isActiveTpb() && $gameParty.canInput();
};

/**
 * 完成Tpb充电
 * @mz 新增
 * 
 */
Game_Battler.prototype.finishTpbCharge = function() {
    this._tpbState = "charged";
    this._tpbTurnEnd = true;
    this._tpbIdleTime = 0;
};

/**
 * 是Tpb回合结束
 * @mz 新增
 */
Game_Battler.prototype.isTpbTurnEnd = function() {
    return this._tpbTurnEnd;
};

/**
 * 初始化tpb回合
 * @mz 新增
 */
Game_Battler.prototype.initTpbTurn = function() {
    this._tpbTurnEnd = false;
    this._tpbTurnCount = 0;
    this._tpbIdleTime = 0;
};

/**
 * 开始Tpb回合
 * @mz 新增
 */
Game_Battler.prototype.startTpbTurn = function() {
    this._tpbTurnEnd = false;
    this._tpbTurnCount++;
    this._tpbIdleTime = 0;
    if (this.numActions() === 0) {
        this.makeTpbActions();
    }
};

/**
 * 制作tpb动作组
 * @mz 新增
 */
Game_Battler.prototype.makeTpbActions = function() {
    this.makeActions();
    if (this.canInput()) {
        this.setActionState("undecided");
    } else {
        this.startTpbCasting();
        this.setActionState("waiting");
    }
};

/**
 * 当Tpb超时
 * @mz 新增
 */
Game_Battler.prototype.onTpbTimeout = function() {
    this.onAllActionsEnd();
    this._tpbTurnEnd = true;
    this._tpbIdleTime = 0;
};

/**
 * 回合计数
 * @mz 新增
 */
Game_Battler.prototype.turnCount = function() {
    if (BattleManager.isTpb()) {
        return this._tpbTurnCount;
    } else {
        return $gameTroop.turnCount() + 1;
    }
};

/**
 * 能输入
 * @mz 新增
 */
Game_Battler.prototype.canInput = function() {
    if (BattleManager.isTpb() && !this.isTpbCharged()) {
        return false;
    }
    return Game_BattlerBase.prototype.canInput.call(this);
};

/**
 * 刷新
 */
Game_Battler.prototype.refresh = function() {
    Game_BattlerBase.prototype.refresh.call(this);
    if (this.hp === 0) {
        this.addState(this.deathStateId());
    } else {
        this.removeState(this.deathStateId());
    }
};

/**添加状态*/
Game_Battler.prototype.addState = function(stateId) {
    if (this.isStateAddable(stateId)) {
        if (!this.isStateAffected(stateId)) {
            this.addNewState(stateId);
            this.refresh();
        }
        this.resetStateCounts(stateId);
        this._result.pushAddedState(stateId);
    }
};

/**是状态可添加*/
Game_Battler.prototype.isStateAddable = function(stateId) {
    return (
        this.isAlive() &&
        $dataStates[stateId] &&
        !this.isStateResist(stateId) &&
        !this.isStateRestrict(stateId)
    );
};

/**是状态限制*/
Game_Battler.prototype.isStateRestrict = function(stateId) {
    return $dataStates[stateId].removeByRestriction && this.isRestricted();
};

/**当限制*/
Game_Battler.prototype.onRestrict = function() {
    Game_BattlerBase.prototype.onRestrict.call(this);
    this.clearTpbChargeTime();
    this.clearActions();
    for (const state of this.states()) {
        if (state.removeByRestriction) {
            this.removeState(state.id);
        }
    }
};

/**移除状态*/
Game_Battler.prototype.removeState = function(stateId) {
    if (this.isStateAffected(stateId)) {
        if (stateId === this.deathStateId()) {
            this.revive();
        }
        this.eraseState(stateId);
        this.refresh();
        this._result.pushRemovedState(stateId);
    }
};

/**逃跑*/
Game_Battler.prototype.escape = function() {
    if ($gameParty.inBattle()) {
        this.hide();
    }
    this.clearActions();
    this.clearStates();
    SoundManager.playEscape();
};

/**添加正面效果*/
Game_Battler.prototype.addBuff = function(paramId, turns) {
    if (this.isAlive()) {
        this.increaseBuff(paramId);
        if (this.isBuffAffected(paramId)) {
            this.overwriteBuffTurns(paramId, turns);
        }
        this._result.pushAddedBuff(paramId);
        this.refresh();
    }
};

/**添加减益效果*/
Game_Battler.prototype.addDebuff = function(paramId, turns) {
    if (this.isAlive()) {
        this.decreaseBuff(paramId);
        if (this.isDebuffAffected(paramId)) {
            this.overwriteBuffTurns(paramId, turns);
        }
        this._result.pushAddedDebuff(paramId);
        this.refresh();
    }
};

/**移除效果*/
Game_Battler.prototype.removeBuff = function(paramId) {
    if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
        this.eraseBuff(paramId);
        this._result.pushRemovedBuff(paramId);
        this.refresh();
    }
};

/**移除战斗状态*/
Game_Battler.prototype.removeBattleStates = function() {
    for (const state of this.states()) {
        if (state.removeAtBattleEnd) {
            this.removeState(state.id);
        }
    }
};

/**移除所有效果*/
Game_Battler.prototype.removeAllBuffs = function() {
    for (let i = 0; i < this.buffLength(); i++) {
        this.removeBuff(i);
    }
};

/**移除状态自动*/
Game_Battler.prototype.removeStatesAuto = function(timing) {
    for (const state of this.states()) {
        if (
            this.isStateExpired(state.id) &&
            state.autoRemovalTiming === timing
        ) {
            this.removeState(state.id);
        }
    }
};

/**移除效果自动*/
Game_Battler.prototype.removeBuffsAuto = function() {
    for (let i = 0; i < this.buffLength(); i++) {
        if (this.isBuffExpired(i)) {
            this.removeBuff(i);
        }
    }
};

/**移除状态当伤害*/
Game_Battler.prototype.removeStatesByDamage = function() {
    for (const state of this.states()) {
        if (
            state.removeByDamage &&
            Math.randomInt(100) < state.chanceByDamage
        ) {
            this.removeState(state.id);
        }
    }
};

/**制作动作次数
 * @returns {number} 动作次数
*/
Game_Battler.prototype.makeActionTimes = function() {
    const actionPlusSet = this.actionPlusSet();
    return actionPlusSet.reduce((r, p) => (Math.random() < p ? r + 1 : r), 1);
};

/**制作动作组*/
Game_Battler.prototype.makeActions = function() {
    this.clearActions();
    if (this.canMove()) {
        const actionTimes = this.makeActionTimes();
        this._actions = [];
        for (let i = 0; i < actionTimes; i++) {
            this._actions.push(new Game_Action(this));
        }
    }
};

/**速度
 *  @returns {number} 速度
*/
Game_Battler.prototype.speed = function() {
    return this._speed;
};

/**制作速度 */
Game_Battler.prototype.makeSpeed = function() {
    this._speed = Math.min(...this._actions.map(action => action.speed())) || 0;
};

/**当前动作
 * @returns {Game_Action} 动作对象
*/
Game_Battler.prototype.currentAction = function() {
    return this._actions[0];
};

/**移除当前动作*/
Game_Battler.prototype.removeCurrentAction = function() {
    this._actions.shift();
};

/**设置最后目标
 * @param {Game_Battler} 目标
*/
Game_Battler.prototype.setLastTarget = function(target) {
    this._lastTargetIndex = target ? target.index() : 0;
};

/**强制动作
 * @param {number} skillId 技能id 
 * @param {number} targetIndex 目标索引 
 * 
*/
Game_Battler.prototype.forceAction = function(skillId, targetIndex) {
    this.clearActions();
    const action = new Game_Action(this, true);
    action.setSkill(skillId);
    if (targetIndex === -2) {
        action.setTarget(this._lastTargetIndex);
    } else if (targetIndex === -1) {
        action.decideRandomTarget();
    } else {
        action.setTarget(targetIndex);
    }
    this._actions.push(action);
};

/**用项目(技能,物品)
 * @param {object} item 物品/技能 数据对象
*/
Game_Battler.prototype.useItem = function(item) {
    if (DataManager.isSkill(item)) {
        this.paySkillCost(item);
    } else if (DataManager.isItem(item)) {
        this.consumeItem(item);
    }
};

/**消耗物品*/
Game_Battler.prototype.consumeItem = function(item) {
    $gameParty.consumeItem(item);
};

/**获得hp*/
Game_Battler.prototype.gainHp = function(value) {
    this._result.hpDamage = -value;
    this._result.hpAffected = true;
    this.setHp(this.hp + value);
};

/**获得mp*/
Game_Battler.prototype.gainMp = function(value) {
    this._result.mpDamage = -value;
    this.setMp(this.mp + value);
};

/**获得tp*/
Game_Battler.prototype.gainTp = function(value) {
    this._result.tpDamage = -value;
    this.setTp(this.tp + value);
};

/**获得无声tp*/
Game_Battler.prototype.gainSilentTp = function(value) {
    this.setTp(this.tp + value);
};

/**初始化tp*/
Game_Battler.prototype.initTp = function() {
    this.setTp(Math.randomInt(25));
};

/**清除tp*/
Game_Battler.prototype.clearTp = function() {
    this.setTp(0);
};

/**改变tp当伤害*/
Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
    const value = Math.floor(50 * damageRate * this.tcr);
    this.gainSilentTp(value);
};

/**恢复hp*/
Game_Battler.prototype.regenerateHp = function() {
    const minRecover = -this.maxSlipDamage();
    const value = Math.max(Math.floor(this.mhp * this.hrg), minRecover);
    if (value !== 0) {
        this.gainHp(value);
    }
};

/**最大下降伤害*/
Game_Battler.prototype.maxSlipDamage = function() {
    return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
};

/**恢复mp*/
Game_Battler.prototype.regenerateMp = function() {
    const value = Math.floor(this.mmp * this.mrg);
    if (value !== 0) {
        this.gainMp(value);
    }
};

/**恢复tp*/
Game_Battler.prototype.regenerateTp = function() {
    const value = Math.floor(100 * this.trg);
    this.gainSilentTp(value);
};

/**恢复所有*/
Game_Battler.prototype.regenerateAll = function() {
    if (this.isAlive()) {
        this.regenerateHp();
        this.regenerateMp();
        this.regenerateTp();
    }
};

/**当战斗开始*/
Game_Battler.prototype.onBattleStart = function(advantageous) {
    this.setActionState("undecided");
    this.clearMotion();
    this.initTpbChargeTime(advantageous);
    this.initTpbTurn();
    if (!this.isPreserveTp()) {
        this.initTp();
    }
};

/**当所有动作结束*/
Game_Battler.prototype.onAllActionsEnd = function() {
    this.clearResult();
    this.removeStatesAuto(1);
    this.removeBuffsAuto();
};

/**当回合结束*/
Game_Battler.prototype.onTurnEnd = function() {
    this.clearResult();
    this.regenerateAll();
    this.updateStateTurns();
    this.updateBuffTurns();
    this.removeStatesAuto(2);
};

/**当战斗结束*/
Game_Battler.prototype.onBattleEnd = function() {
    this.clearResult();
    this.removeBattleStates();
    this.removeAllBuffs();
    this.clearActions();
    if (!this.isPreserveTp()) {
        this.clearTp();
    }
    this.appear();
};

/**当伤害*/
Game_Battler.prototype.onDamage = function(value) {
    this.removeStatesByDamage();
    this.chargeTpByDamage(value / this.mhp);
};

/**设置动作状态*/
Game_Battler.prototype.setActionState = function(actionState) {
    this._actionState = actionState;
    this.requestMotionRefresh();
};

/**是未定的*/
Game_Battler.prototype.isUndecided = function() {
    return this._actionState === "undecided";
};

/**是输入*/
Game_Battler.prototype.isInputting = function() {
    return this._actionState === "inputting";
};

/**是等待*/
Game_Battler.prototype.isWaiting = function() {
    return this._actionState === "waiting";
};

/**是演出*/
Game_Battler.prototype.isActing = function() {
    return this._actionState === "acting";
};

/**是吟唱*/
Game_Battler.prototype.isChanting = function() {
    if (this.isWaiting()) {
        return this._actions.some(action => action.isMagicSkill());
    }
    return false;
};

/**是防御等待*/
Game_Battler.prototype.isGuardWaiting = function() {
    if (this.isWaiting()) {
        return this._actions.some(action => action.isGuard());
    }
    return false;
};

/**表现动作开始
 * 
 * @param {Game_Action} action 动作
 * 
*/
Game_Battler.prototype.performActionStart = function(action) {
    if (!action.isGuard()) {
        this.setActionState("acting");
    }
};

/**表现动作
 * 
 * @param {Game_Action} action 动作
 * 
 * 
*/
Game_Battler.prototype.performAction = function(/*action*/) {
    //
};

/**表现动作结束*/
Game_Battler.prototype.performActionEnd = function() {
    //
};

/**表现伤害*/
Game_Battler.prototype.performDamage = function() {
    //
};

/**表现未命中*/
Game_Battler.prototype.performMiss = function() {
    SoundManager.playMiss();
};

/**表现恢复*/
Game_Battler.prototype.performRecovery = function() {
    SoundManager.playRecovery();
};

/**表现闪避*/
Game_Battler.prototype.performEvasion = function() {
    SoundManager.playEvasion();
};

/**表现魔法闪避*/
Game_Battler.prototype.performMagicEvasion = function() {
    SoundManager.playMagicEvasion();
};

/**表现反击*/
Game_Battler.prototype.performCounter = function() {
    SoundManager.playEvasion();
};

/**表现魔法反射*/
Game_Battler.prototype.performReflection = function() {
    SoundManager.playReflection();
};

/**表现替代*/
Game_Battler.prototype.performSubstitute = function(/*target*/) {
    //
};

/**表现死亡*/
Game_Battler.prototype.performCollapse = function() {
    //
};

