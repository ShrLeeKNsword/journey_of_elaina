//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

/**
 * 游戏动作
 * 
 * 战斗动作的游戏对象类。
 */
function Game_Action() {
    this.initialize(...arguments);
}

/** 效果 恢复HP */
Game_Action.EFFECT_RECOVER_HP = 11;
/** 效果 恢复MP */
Game_Action.EFFECT_RECOVER_MP = 12;
/** 效果 获得TP */
Game_Action.EFFECT_GAIN_TP = 13;
/** 效果 添加状态 */
Game_Action.EFFECT_ADD_STATE = 21;
/** 效果 删除状态 */
Game_Action.EFFECT_REMOVE_STATE = 22;
/** 效果 添加BUFF */
Game_Action.EFFECT_ADD_BUFF = 31;
/** 效果 添加DEBUFF */
Game_Action.EFFECT_ADD_DEBUFF = 32;
/** 效果 消除BUFF */
Game_Action.EFFECT_REMOVE_BUFF = 33;
/** 效果 消除DEBUFF */
Game_Action.EFFECT_REMOVE_DEBUFF = 34;
/** 效果 特殊 */
Game_Action.EFFECT_SPECIAL = 41;
/** 效果 成长 */
Game_Action.EFFECT_GROW = 42;
/** 效果 学习技能 */
Game_Action.EFFECT_LEARN_SKILL = 43;
/** 效果 公共事件 */
Game_Action.EFFECT_COMMON_EVENT = 44;
/** 特殊效果 逃跑 */
Game_Action.SPECIAL_EFFECT_ESCAPE = 0;
/** 攻击类型 必中 */
Game_Action.HITTYPE_CERTAIN = 0;
/** 攻击类型 物理 */
Game_Action.HITTYPE_PHYSICAL = 1;
/** 攻击类型 魔法 */
Game_Action.HITTYPE_MAGICAL = 2;

/**
 * 初始化
 * @param {Game_Battler} subject 主体
 * @param {boolean} forcing 强制
 */
Game_Action.prototype.initialize = function(subject, forcing) {
    /**
     * 主体角色id
     * @type {number}
     */
    this._subjectActorId = 0;
    /**
     * 主体敌人索引
     * @type {number}
     */
    this._subjectEnemyIndex = -1;
    /**
     * 强制 
     */
    this._forcing = forcing || false;
    //设置主体(subject)
    this.setSubject(subject);
    //清除()
    this.clear();
};

/**
 * 清除
 */
Game_Action.prototype.clear = function() {
    /**
     * 项目
     * @type {Game_Item} 
     */
    this._item = new Game_Item();
    /** 
     * 目标索引 
     */
    this._targetIndex = -1;
};

/**
 * 设置主体
 * @param {Game_Battler} subject 主体
 */
Game_Action.prototype.setSubject = function(subject) {
    if (subject.isActor()) {
        this._subjectActorId = subject.actorId();
        this._subjectEnemyIndex = -1;
    } else {
        this._subjectEnemyIndex = subject.index();
        this._subjectActorId = 0;
    }
};

/**
 * 主体
 * @returns {Game_Battler}  返回动作的主体
 */
Game_Action.prototype.subject = function() {
    if (this._subjectActorId > 0) {
        return $gameActors.actor(this._subjectActorId);
    } else {
        return $gameTroop.members()[this._subjectEnemyIndex];
    }
};

/**
 * 朋友小组
 * 
 */
Game_Action.prototype.friendsUnit = function() {
    return this.subject().friendsUnit();
};

/**
 * 对手小组
 */
Game_Action.prototype.opponentsUnit = function() {
    return this.subject().opponentsUnit();
};

/**
 * 设置敌人动作
 * @param {{}} action 动作数据
 */
Game_Action.prototype.setEnemyAction = function(action) {
    if (action) {
        this.setSkill(action.skillId);
    } else {
        this.clear();
    }
};

/**
 * 设置攻击
 */
Game_Action.prototype.setAttack = function() {
    this.setSkill(this.subject().attackSkillId());
};

/**
 * 设置防御
 */
Game_Action.prototype.setGuard = function() {
    this.setSkill(this.subject().guardSkillId());
};

/**
 * 设置技能
 * @param {number} skillId 技能id
 */
Game_Action.prototype.setSkill = function(skillId) {
    this._item.setObject($dataSkills[skillId]);
};

/**
 * 设置物品
 * @param {number} itemId 物品id
 */
Game_Action.prototype.setItem = function(itemId) {
    this._item.setObject($dataItems[itemId]);
};

/**
 * 设置项目对象
 * @param {*} object 项目对象
 */
Game_Action.prototype.setItemObject = function(object) {
    this._item.setObject(object);
};

/**
 * 设置目标
 * @param {number} targetIndex 目标索引
 */
Game_Action.prototype.setTarget = function(targetIndex) {
    this._targetIndex = targetIndex;
};

/**
 * 项目
 */
Game_Action.prototype.item = function() {
    return this._item.object();
};

/**
 * 是技能
 */
Game_Action.prototype.isSkill = function() {
    return this._item.isSkill();
};

/**
 * 是物品
 */
Game_Action.prototype.isItem = function() {
    return this._item.isItem();
};

/**
 * 重复次数
 */
Game_Action.prototype.numRepeats = function() {
    let repeats = this.item().repeats;
    if (this.isAttack()) {
        repeats += this.subject().attackTimesAdd();
    }
    return Math.floor(repeats);
};

/**
 * 检查项目范围
 * @param {*} list 列表
 */
Game_Action.prototype.checkItemScope = function(list) {
    return list.includes(this.item().scope);
};

/**
 * 是为了对手
 */
Game_Action.prototype.isForOpponent = function() {
    return this.checkItemScope([1, 2, 3, 4, 5, 6, 14]);
};

/**
 * 是为了朋友
 */
Game_Action.prototype.isForFriend = function() {
    return this.checkItemScope([7, 8, 9, 10, 11, 12, 13, 14]);
};

/**
 * 是为了所有人
 */
Game_Action.prototype.isForEveryone = function() {
    return this.checkItemScope([14]);
};

/**
 * 是为了活着的朋友
 */
Game_Action.prototype.isForAliveFriend = function() {
    return this.checkItemScope([7, 8, 11, 14]);
};

/**
 * 是为了死去的朋友
 */
Game_Action.prototype.isForDeadFriend = function() {
    return this.checkItemScope([9, 10]);
};

/**
 * 是为了自己的
 */
Game_Action.prototype.isForUser = function() {
    return this.checkItemScope([11]);
};

/**
 * 是为了一个
 */
Game_Action.prototype.isForOne = function() {
    return this.checkItemScope([1, 3, 7, 9, 11, 12]);
};

/**
 * 是为了随机
 */
Game_Action.prototype.isForRandom = function() {
    return this.checkItemScope([3, 4, 5, 6]);
};

/**
 * 是为了所有
 */
Game_Action.prototype.isForAll = function() {
    return this.checkItemScope([2, 8, 10, 13, 14]);
};

/**
 * 需要选择
 */
Game_Action.prototype.needsSelection = function() {
    return this.checkItemScope([1, 7, 9, 12]);
};

/**
 * 目标数量
 */
Game_Action.prototype.numTargets = function() {
    return this.isForRandom() ? this.item().scope - 2 : 0;
};

/**
 * 检查伤害类型
 * @param {*} list 列表 
 */
Game_Action.prototype.checkDamageType = function(list) {
    return list.includes(this.item().damage.type);
};

/**
 * 是hp效果
 */
Game_Action.prototype.isHpEffect = function() {
    return this.checkDamageType([1, 3, 5]);
};

/**
 * 是mp效果
 */
Game_Action.prototype.isMpEffect = function() {
    return this.checkDamageType([2, 4, 6]);
};

/**
 * 是伤害
 */
Game_Action.prototype.isDamage = function() {
    return this.checkDamageType([1, 2]);
};

/**
 * 是恢复
 */
Game_Action.prototype.isRecover = function() {
    return this.checkDamageType([3, 4]);
};

/**
 * 是吸取
 */
Game_Action.prototype.isDrain = function() {
    return this.checkDamageType([5, 6]);
};

/**
 * 是Hp恢复
 */
Game_Action.prototype.isHpRecover = function() {
    return this.checkDamageType([3]);
};

/**
 * 是MP恢复
 */
Game_Action.prototype.isMpRecover = function() {
    return this.checkDamageType([4]);
};

/**
 * 是必中
 */
Game_Action.prototype.isCertainHit = function() {
    return this.item().hitType === Game_Action.HITTYPE_CERTAIN;
};

/**
 * 是物理
 */
Game_Action.prototype.isPhysical = function() {
    return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;
};

/**
 * 是魔法
 */
Game_Action.prototype.isMagical = function() {
    return this.item().hitType === Game_Action.HITTYPE_MAGICAL;
};

/**
 * 是攻击
 */
Game_Action.prototype.isAttack = function() {
    return this.item() === $dataSkills[this.subject().attackSkillId()];
};

/**
 * 是防御
 */
Game_Action.prototype.isGuard = function() {
    return this.item() === $dataSkills[this.subject().guardSkillId()];
};

/**
 * 是魔法技能
 */
Game_Action.prototype.isMagicSkill = function() {
    if (this.isSkill()) {
        return $dataSystem.magicSkills.includes(this.item().stypeId);
    } else {
        return false;
    }
};

/**
 * 决定随机目标
 */
Game_Action.prototype.decideRandomTarget = function() {
    let target;
    if (this.isForDeadFriend()) {
        target = this.friendsUnit().randomDeadTarget();
    } else if (this.isForFriend()) {
        target = this.friendsUnit().randomTarget();
    } else {
        target = this.opponentsUnit().randomTarget();
    }
    if (target) {
        this._targetIndex = target.index();
    } else {
        this.clear();
    }
};

/**
 * 设置混乱
 */
Game_Action.prototype.setConfusion = function() {
    this.setAttack();
};

/**
 * 准备
 */
Game_Action.prototype.prepare = function() {
    if (this.subject().isConfused() && !this._forcing) {
        this.setConfusion();
    }
};

/**
 * 是有效的
 * @returns {boolean}
 */
Game_Action.prototype.isValid = function() {
    return (this._forcing && this.item()) || this.subject().canUse(this.item());
};

/**速度
 * @return {number} 
 */
Game_Action.prototype.speed = function() {
    const agi = this.subject().agi;
    let speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
    if (this.item()) {
        speed += this.item().speed;
    }
    if (this.isAttack()) {
        speed += this.subject().attackSpeed();
    }
    return speed;
};

/**
 * 制作目标组
 */
Game_Action.prototype.makeTargets = function() {
    const targets = [];
    if (!this._forcing && this.subject().isConfused()) {
        targets.push(this.confusionTarget());
    } else if (this.isForEveryone()) {
        targets.push(...this.targetsForEveryone());
    } else if (this.isForOpponent()) {
        targets.push(...this.targetsForOpponents());
    } else if (this.isForFriend()) {
        targets.push(...this.targetsForFriends());
    }
    return this.repeatTargets(targets);
};

/**
 * 重复目标
 * @param {Game_Battler[]} targets 目标组
 */
Game_Action.prototype.repeatTargets = function(targets) {
    const repeatedTargets = [];
    const repeats = this.numRepeats();
    for (const target of targets) {
        if (target) {
            for (let i = 0; i < repeats; i++) {
                repeatedTargets.push(target);
            }
        }
    }
    return repeatedTargets;
};

/**
 * 混乱目标
 */
Game_Action.prototype.confusionTarget = function() {
    switch (this.subject().confusionLevel()) {
        case 1:
            return this.opponentsUnit().randomTarget();
        case 2:
            if (Math.randomInt(2) === 0) {
                return this.opponentsUnit().randomTarget();
            }
            return this.friendsUnit().randomTarget();
        default:
            return this.friendsUnit().randomTarget();
    }
};

/**
 * 目标为了所有人
 * 
 */
Game_Action.prototype.targetsForEveryone = function() {
    const opponentMembers = this.opponentsUnit().aliveMembers();
    const friendMembers = this.friendsUnit().aliveMembers();
    return opponentMembers.concat(friendMembers);
};

/**
 * 目标为了对手
 */
Game_Action.prototype.targetsForOpponents = function() {
    const unit = this.opponentsUnit();
    if (this.isForRandom()) {
        return this.randomTargets(unit);
    } else {
        return this.targetsForAlive(unit);
    }
};

/**
 * 目标为了朋友
 */
Game_Action.prototype.targetsForFriends = function() {
    const unit = this.friendsUnit();
    if (this.isForUser()) {
        return [this.subject()];
    } else if (this.isForDeadFriend()) {
        return this.targetsForDead(unit);
    } else if (this.isForAliveFriend()) {
        return this.targetsForAlive(unit);
    } else {
        return this.targetsForDeadAndAlive(unit);
    }
};

/**
 * 随机目标组
 * @param {Game_Unit} unit 小组
 */
Game_Action.prototype.randomTargets = function(unit) {
    const targets = [];
    for (let i = 0; i < this.numTargets(); i++) {
        targets.push(unit.randomTarget());
    }
    return targets;
};

/**
 * 目标为了死亡的
 * @param {Game_Unit} unit 小组
 */
Game_Action.prototype.targetsForDead = function(unit) {
    if (this.isForOne()) {
        return [unit.smoothDeadTarget(this._targetIndex)];
    } else {
        return unit.deadMembers();
    }
};

/**
 * 目标为了活着的
 * @param {Game_Unit} unit 小组
 */
Game_Action.prototype.targetsForAlive = function(unit) {
    if (this.isForOne()) {
        if (this._targetIndex < 0) {
            return [unit.randomTarget()];
        } else {
            return [unit.smoothTarget(this._targetIndex)];
        }
    } else {
        return unit.aliveMembers();
    }
};

/**
 * 目标为了活着的和死亡的
 * @param {Game_Unit} unit 小组
 */
Game_Action.prototype.targetsForDeadAndAlive = function(unit) {
    if (this.isForOne()) {
        return [unit.members()[this._targetIndex]];
    } else {
        return unit.members();
    }
};

/**
 * 评估
 */
Game_Action.prototype.evaluate = function() {
    let value = 0;
    for (const target of this.itemTargetCandidates()) {
        const targetValue = this.evaluateWithTarget(target);
        if (this.isForAll()) {
            value += targetValue;
        } else if (targetValue > value) {
            value = targetValue;
            this._targetIndex = target.index();
        }
    }
    value *= this.numRepeats();
    if (value > 0) {
        value += Math.random();
    }
    return value;
};

/**
 * 项目目标候选人
 */
Game_Action.prototype.itemTargetCandidates = function() {
    if (!this.isValid()) {
        return [];
    } else if (this.isForOpponent()) {
        return this.opponentsUnit().aliveMembers();
    } else if (this.isForUser()) {
        return [this.subject()];
    } else if (this.isForDeadFriend()) {
        return this.friendsUnit().deadMembers();
    } else {
        return this.friendsUnit().aliveMembers();
    }
};

/**
 * 评估对于目标
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.evaluateWithTarget = function(target) {
    if (this.isHpEffect()) {
        const value = this.makeDamageValue(target, false);
        if (this.isForOpponent()) {
            return value / Math.max(target.hp, 1);
        } else {
            const recovery = Math.min(-value, target.mhp - target.hp);
            return recovery / target.mhp;
        }
    }
};

/**
 * 测试应用
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.testApply = function(target) {
    return (
        this.testLifeAndDeath(target) &&
        ($gameParty.inBattle() ||
            (this.isHpRecover() && target.hp < target.mhp) ||
            (this.isMpRecover() && target.mp < target.mmp) ||
            this.hasItemAnyValidEffects(target))
    );
};

/**
 * 测试生与死
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.testLifeAndDeath = function(target) {
    if (this.isForOpponent() || this.isForAliveFriend()) {
        return target.isAlive();
    } else if (this.isForDeadFriend()) {
        return target.isDead();
    } else {
        return true;
    }
};

/**
 * 项目有任何有效效果
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.hasItemAnyValidEffects = function(target) {
    return this.item().effects.some(effect =>
        this.testItemEffect(target, effect)
    );
};

/**
 * 测试项目效果
 * @param {Game_Battler} target 目标
 * @param {*} effect 效果
 */
Game_Action.prototype.testItemEffect = function(target, effect) {
    switch (effect.code) {
        case Game_Action.EFFECT_RECOVER_HP:
            return (
                target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0
            );
        case Game_Action.EFFECT_RECOVER_MP:
            return (
                target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0
            );
        case Game_Action.EFFECT_ADD_STATE:
            return !target.isStateAffected(effect.dataId);
        case Game_Action.EFFECT_REMOVE_STATE:
            return target.isStateAffected(effect.dataId);
        case Game_Action.EFFECT_ADD_BUFF:
            return !target.isMaxBuffAffected(effect.dataId);
        case Game_Action.EFFECT_ADD_DEBUFF:
            return !target.isMaxDebuffAffected(effect.dataId);
        case Game_Action.EFFECT_REMOVE_BUFF:
            return target.isBuffAffected(effect.dataId);
        case Game_Action.EFFECT_REMOVE_DEBUFF:
            return target.isDebuffAffected(effect.dataId);
        case Game_Action.EFFECT_LEARN_SKILL:
            return target.isActor() && !target.isLearnedSkill(effect.dataId);
        default:
            return true;
    }
};

/**
 * 项目 物理反击比例
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.itemCnt = function(target) {
    if (this.isPhysical() && target.canMove()) {
        return target.cnt;
    } else {
        return 0;
    }
};

/**
 * 项目 魔法反射比例
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.itemMrf = function(target) {
    if (this.isMagical()) {
        return target.mrf;
    } else {
        return 0;
    }
};

/**
 * 项目命中
 */
Game_Action.prototype.itemHit = function(/*target*/) {
    const successRate = this.item().successRate;
    if (this.isPhysical()) {
        return successRate * 0.01 * this.subject().hit;
    } else {
        return successRate * 0.01;
    }
};

/**
 * 项目 闪避比例
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.itemEva = function(target) {
    if (this.isPhysical()) {
        //物理闪避
        return target.eva;
    } else if (this.isMagical()) {
        //魔法闪避
        return target.mev;
    } else {
        return 0;
    }
};

/**
 * 项目 会心比例
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.itemCri = function(target) {
    return this.item().damage.critical
        ? this.subject().cri * (1 - target.cev)
        : 0;
};

/**
 * 应用
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.apply = function(target) {
    const result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = result.used && Math.random() >= this.itemHit(target);
    result.evaded = !result.missed && Math.random() < this.itemEva(target);
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = Math.random() < this.itemCri(target);
            const value = this.makeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
        for (const effect of this.item().effects) {
            this.applyItemEffect(target, effect);
        }
        this.applyItemUserEffect(target);
    }
    this.updateLastTarget(target);
};

/**
 * 制作伤害值
 * @param {Game_Battler} target 目标
 * @param {boolean} critical  危急
 */
Game_Action.prototype.makeDamageValue = function(target, critical) {
    const item = this.item();
    const baseValue = this.evalDamageFormula(target);
    let value = baseValue * this.calcElementRate(target);
    if (this.isPhysical()) {
        value *= target.pdr;
    }
    if (this.isMagical()) {
        value *= target.mdr;
    }
    if (baseValue < 0) {
        value *= target.rec;
    }
    if (critical) {
        value = this.applyCritical(value);
    }
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
    value = Math.round(value);
    return value;
};

/**
 * 计算伤害公式
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.evalDamageFormula = function(target) {
    try {
        const item = this.item();
        const a = this.subject(); // eslint-disable-line no-unused-vars
        const b = target; // eslint-disable-line no-unused-vars
        const v = $gameVariables._data; // eslint-disable-line no-unused-vars
        const sign = [3, 4].includes(item.damage.type) ? -1 : 1;
        const value = Math.max(eval(item.damage.formula), 0) * sign;
        return isNaN(value) ? 0 : value;
    } catch (e) {
        return 0;
    }
};

/**
 * 计算元素率
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.calcElementRate = function(target) {
    if (this.item().damage.elementId < 0) {
        return this.elementsMaxRate(target, this.subject().attackElements());
    } else {
        return target.elementRate(this.item().damage.elementId);
    }
};

/**
 * 元素最大比例
 * @param {Game_Battler} target 目标
 * @param {*} elements 元素组
 */
Game_Action.prototype.elementsMaxRate = function(target, elements) {
    if (elements.length > 0) {
        const rates = elements.map(elementId => target.elementRate(elementId));
        return Math.max(...rates);
    } else {
        return 1;
    }
};

/**
 * 应用会心
 * @param {number} damage 伤害
 */
Game_Action.prototype.applyCritical = function(damage) {
    return damage * 3;
};

/**
 * 应用分散
 * @param {number} damage 伤害 
 * @param {number} variance 分散度
 */
Game_Action.prototype.applyVariance = function(damage, variance) {
    const amp = Math.floor(Math.max((Math.abs(damage) * variance) / 100, 0));
    const v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
    return damage >= 0 ? damage + v : damage - v;
};

/**
 * 应用防御
 * @param {number} damage 伤害 
 * @param {Game_Battler} target 目标
 */
Game_Action.prototype.applyGuard = function(damage, target) {
    return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
};

/**
 * 执行伤害
 * @param {Game_Battler} target 目标
 * @param {number} value 值
 */
Game_Action.prototype.executeDamage = function(target, value) {
    const result = target.result();
    if (value === 0) {
        result.critical = false;
    }
    if (this.isHpEffect()) {
        this.executeHpDamage(target, value);
    }
    if (this.isMpEffect()) {
        this.executeMpDamage(target, value);
    }
};

/**
 * 执行hp伤害
 * @param {Game_Battler} target 目标
 * @param {number} value 值 
 */
Game_Action.prototype.executeHpDamage = function(target, value) {
    if (this.isDrain()) {
        value = Math.min(target.hp, value);
    }
    this.makeSuccess(target);
    target.gainHp(-value);
    if (value > 0) {
        target.onDamage(value);
    }
    this.gainDrainedHp(value);
};

/**
 * 执行mp伤害
 * @param {Game_Battler} target 目标
 * @param {number} value 值
 */
Game_Action.prototype.executeMpDamage = function(target, value) {
    if (!this.isMpRecover()) {
        value = Math.min(target.mp, value);
    }
    if (value !== 0) {
        this.makeSuccess(target);
    }
    target.gainMp(-value);
    this.gainDrainedMp(value);
};

/**
 * 获得吸收的Hp
 * @param {*} value 
 */
Game_Action.prototype.gainDrainedHp = function(value) {
    if (this.isDrain()) {
        let gainTarget = this.subject();
        if (this._reflectionTarget) {
            gainTarget = this._reflectionTarget;
        }
        gainTarget.gainHp(value);
    }
};

/**
 * 获得吸收的MP
 * @param {*} value 
 */
Game_Action.prototype.gainDrainedMp = function(value) {
    if (this.isDrain()) {
        let gainTarget = this.subject();
        if (this._reflectionTarget) {
            gainTarget = this._reflectionTarget;
        }
        gainTarget.gainMp(value);
    }
};

/**
 * 应用项目效果
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.applyItemEffect = function(target, effect) {
    switch (effect.code) {
        case Game_Action.EFFECT_RECOVER_HP:
            this.itemEffectRecoverHp(target, effect);
            break;
        case Game_Action.EFFECT_RECOVER_MP:
            this.itemEffectRecoverMp(target, effect);
            break;
        case Game_Action.EFFECT_GAIN_TP:
            this.itemEffectGainTp(target, effect);
            break;
        case Game_Action.EFFECT_ADD_STATE:
            this.itemEffectAddState(target, effect);
            break;
        case Game_Action.EFFECT_REMOVE_STATE:
            this.itemEffectRemoveState(target, effect);
            break;
        case Game_Action.EFFECT_ADD_BUFF:
            this.itemEffectAddBuff(target, effect);
            break;
        case Game_Action.EFFECT_ADD_DEBUFF:
            this.itemEffectAddDebuff(target, effect);
            break;
        case Game_Action.EFFECT_REMOVE_BUFF:
            this.itemEffectRemoveBuff(target, effect);
            break;
        case Game_Action.EFFECT_REMOVE_DEBUFF:
            this.itemEffectRemoveDebuff(target, effect);
            break;
        case Game_Action.EFFECT_SPECIAL:
            this.itemEffectSpecial(target, effect);
            break;
        case Game_Action.EFFECT_GROW:
            this.itemEffectGrow(target, effect);
            break;
        case Game_Action.EFFECT_LEARN_SKILL:
            this.itemEffectLearnSkill(target, effect);
            break;
        case Game_Action.EFFECT_COMMON_EVENT:
            this.itemEffectCommonEvent(target, effect);
            break;
    }
};

/**
 * 项目效果恢复hp
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
    let value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainHp(value);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果恢复MP
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectRecoverMp = function(target, effect) {
    let value = (target.mmp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainMp(value);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果获得Tp
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectGainTp = function(target, effect) {
    let value = Math.floor(effect.value1);
    if (value !== 0) {
        target.gainTp(value);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果添加状态
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectAddState = function(target, effect) {
    if (effect.dataId === 0) {
        this.itemEffectAddAttackState(target, effect);
    } else {
        this.itemEffectAddNormalState(target, effect);
    }
};

/**
 * 项目效果添加攻击状态
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectAddAttackState = function(target, effect) {
    for (const stateId of this.subject().attackStates()) {
        let chance = effect.value1;
        chance *= target.stateRate(stateId);
        chance *= this.subject().attackStatesRate(stateId);
        chance *= this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addState(stateId);
            this.makeSuccess(target);
        }
    }
};

/** 
 * 项目效果添加正常状态 
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
    let chance = effect.value1;
    if (!this.isCertainHit()) {
        chance *= target.stateRate(effect.dataId);
        chance *= this.lukEffectRate(target);
    }
    if (Math.random() < chance) {
        target.addState(effect.dataId);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果删除状态
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectRemoveState = function(target, effect) {
    let chance = effect.value1;
    if (Math.random() < chance) {
        target.removeState(effect.dataId);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果添加BUFF
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
    target.addBuff(effect.dataId, effect.value1);
    this.makeSuccess(target);
};

/**
 * 项目效果添加DEBUFF
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
    let chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
    if (Math.random() < chance) {
        target.addDebuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果消除BUFF
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectRemoveBuff = function(target, effect) {
    if (target.isBuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果消除DEBUFF
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectRemoveDebuff = function(target, effect) {
    if (target.isDebuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

/**
 * 项目特殊
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectSpecial = function(target, effect) {
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
        target.escape();
        this.makeSuccess(target);
    }
};

/**
 * 项目效果成长
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectGrow = function(target, effect) {
    target.addParam(effect.dataId, Math.floor(effect.value1));
    this.makeSuccess(target);
};

/**
 * 项目效果学习技能
 * @param {*} target 
 * @param {*} effect 
 */
Game_Action.prototype.itemEffectLearnSkill = function(target, effect) {
    if (target.isActor()) {
        target.learnSkill(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectCommonEvent = function(/*target, effect*/) {
    //
};

/**
 * 制作成功
 * @param {*} target 
 */
Game_Action.prototype.makeSuccess = function(target) {
    target.result().success = true;
};

/**
 * 应用项目用户效果
 */
Game_Action.prototype.applyItemUserEffect = function(/*target*/) {
    const value = Math.floor(this.item().tpGain * this.subject().tcr);
    this.subject().gainSilentTp(value);
};

/**
 * 幸运效果比率
 * @param {*} target 
 */
Game_Action.prototype.lukEffectRate = function(target) {
    return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
};

/**
 * 应用防御
 */
Game_Action.prototype.applyGlobal = function() {
    for (const effect of this.item().effects) {
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
    }
    this.updateLastUsed();
    this.updateLastSubject();
};

/**
 * 更新最后使用
 */
Game_Action.prototype.updateLastUsed = function() {
    const item = this.item();
    if (DataManager.isSkill(item)) {
        $gameTemp.setLastUsedSkillId(item.id);
    } else if (DataManager.isItem(item)) {
        $gameTemp.setLastUsedItemId(item.id);
    }
};

/**
 * 更新最后主体
 */
Game_Action.prototype.updateLastSubject = function() {
    const subject = this.subject();
    if (subject.isActor()) {
        $gameTemp.setLastSubjectActorId(subject.actorId());
    } else {
        $gameTemp.setLastSubjectEnemyIndex(subject.index() + 1);
    }
};

/**
 * 更新最后目标
 * @param {*} target 
 */
Game_Action.prototype.updateLastTarget = function(target) {
    if (target.isActor()) {
        $gameTemp.setLastTargetActorId(target.actorId());
    } else {
        $gameTemp.setLastTargetEnemyIndex(target.index() + 1);
    }
};

