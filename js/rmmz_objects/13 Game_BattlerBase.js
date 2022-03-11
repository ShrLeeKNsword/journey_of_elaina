//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters calculation.

/**
 * 游戏战斗者基础
 * 
 * Game Battler的超类。它主要包含参数计算。
 * 
 */
function Game_BattlerBase() {
    this.initialize(...arguments);
}

/**特征元素比例*/
Game_BattlerBase.TRAIT_ELEMENT_RATE = 11;
/**特征负面效果比例*/
Game_BattlerBase.TRAIT_DEBUFF_RATE = 12;
/**特征状态比例*/
Game_BattlerBase.TRAIT_STATE_RATE = 13;
/**特征状态无效化*/
Game_BattlerBase.TRAIT_STATE_RESIST = 14;
/**特征参数*/
Game_BattlerBase.TRAIT_PARAM = 21;
/**特征x参数*/
Game_BattlerBase.TRAIT_XPARAM = 22;
/**特征s参数*/
Game_BattlerBase.TRAIT_SPARAM = 23;
/**特征攻击元素*/
Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;
/**特征攻击状态*/
Game_BattlerBase.TRAIT_ATTACK_STATE = 32;
/**特征攻击速度*/
Game_BattlerBase.TRAIT_ATTACK_SPEED = 33;
/**特征攻击次数*/
Game_BattlerBase.TRAIT_ATTACK_TIMES = 34;
/**
 * 特征攻击技能
 * @mz 新增
*/
Game_BattlerBase.TRAIT_ATTACK_SKILL = 35;
/**特征技能增加*/
Game_BattlerBase.TRAIT_STYPE_ADD = 41;
/**特征类型封印*/
Game_BattlerBase.TRAIT_STYPE_SEAL = 42;
/**特征技能增加*/
Game_BattlerBase.TRAIT_SKILL_ADD = 43;
/**特征技能封印*/
Game_BattlerBase.TRAIT_SKILL_SEAL = 44;
/**特征装备武器*/
Game_BattlerBase.TRAIT_EQUIP_WTYPE = 51;
/**特征装备防具*/
Game_BattlerBase.TRAIT_EQUIP_ATYPE = 52;
/**特征装备固定*/
Game_BattlerBase.TRAIT_EQUIP_LOCK = 53;
/**特征装备封印*/
Game_BattlerBase.TRAIT_EQUIP_SEAL = 54;
/**特征孔种类*/
Game_BattlerBase.TRAIT_SLOT_TYPE = 55;
/**特征行动添加*/
Game_BattlerBase.TRAIT_ACTION_PLUS = 61;
/**特征特殊标记*/
Game_BattlerBase.TRAIT_SPECIAL_FLAG = 62;
/**特征死亡种类*/
Game_BattlerBase.TRAIT_COLLAPSE_TYPE = 63;
/**特征队伍能力*/
Game_BattlerBase.TRAIT_PARTY_ABILITY = 64;
/**标记id自动战斗*/
Game_BattlerBase.FLAG_ID_AUTO_BATTLE = 0;
/**标记id防御*/
Game_BattlerBase.FLAG_ID_GUARD = 1;
/**标记id替代*/
Game_BattlerBase.FLAG_ID_SUBSTITUTE = 2;
/**标记id保留tp*/
Game_BattlerBase.FLAG_ID_PRESERVE_TP = 3;
/**项目正面效果开始*/
Game_BattlerBase.ICON_BUFF_START = 32;
/**项目负面效果开始*/
Game_BattlerBase.ICON_DEBUFF_START = 48;

Object.defineProperties(Game_BattlerBase.prototype, {
    // Hit Points
    /** Hit Points hp生命值 */
    hp: {
        get: function() {
            return this._hp;
        },
        configurable: true
    },
    // Magic Points
    /** Magic Points mp魔法值 */
    mp: {
        get: function() {
            return this._mp;
        },
        configurable: true
    },
    // Tactical Points
    /** Tactical Points tp战术值 */
    tp: {
        get: function() {
            return this._tp;
        },
        configurable: true
    },
    // Maximum Hit Points
    /** Maximum Hit Points   最大hp生命值 */
    mhp: {
        get: function() {
            return this.param(0);
        },
        configurable: true
    },
    // Maximum Magic Points
    /** Maximum Magic Points  最大mp魔法值 */
    mmp: {
        get: function() {
            return this.param(1);
        },
        configurable: true
    },
    // ATtacK power
    /** ATtacK power  攻击力 */
    atk: {
        get: function() {
            return this.param(2);
        },
        configurable: true
    },
    // DEFense power
    /** DEFense power  防御力 */
    def: {
        get: function() {
            return this.param(3);
        },
        configurable: true
    },
    // Magic ATtack power
    /** Magic ATtack power  魔法攻击力 */
    mat: {
        get: function() {
            return this.param(4);
        },
        configurable: true
    },
    // Magic DeFense power
    /** Magic DeFense power  魔法防御力 */
    mdf: {
        get: function() {
            return this.param(5);
        },
        configurable: true
    },
    // AGIlity
    /** AGIlity  敏捷 */
    agi: {
        get: function() {
            return this.param(6);
        },
        configurable: true
    },
    // LUcK
    /** LUcK  运气 */
    luk: {
        get: function() {
            return this.param(7);
        },
        configurable: true
    },
    // HIT rate
    /** HIT rate 命中比例 */
    hit: {
        get: function() {
            return this.xparam(0);
        },
        configurable: true
    },
    // EVAsion rate
    /** EVAsion rate 闪避比例 */
    eva: {
        get: function() {
            return this.xparam(1);
        },
        configurable: true
    },
    // CRItical rate
    /** CRItical rate 会心比例 */
    cri: {
        get: function() {
            return this.xparam(2);
        },
        configurable: true
    },
    // Critical EVasion rate
    /** Critical EVasion rate 会心回避比例 */
    cev: {
        get: function() {
            return this.xparam(3);
        },
        configurable: true
    },
    // Magic EVasion rate
    /** Magic EVasion rate  魔法躲避比例 */
    mev: {
        get: function() {
            return this.xparam(4);
        },
        configurable: true
    },
    // Magic ReFlection rate
    /** Magic ReFlection rate 魔法反射比例 */
    mrf: {
        get: function() {
            return this.xparam(5);
        },
        configurable: true
    },
    // CouNTer attack rate
    /** CouNTer attack rate 反击比例 */
    cnt: {
        get: function() {
            return this.xparam(6);
        },
        configurable: true
    },
    // Hp ReGeneration rate
    /** Hp ReGeneration rate hp恢复比例 */
    hrg: {
        get: function() {
            return this.xparam(7);
        },
        configurable: true
    },
    // Mp ReGeneration rate
    /** Mp ReGeneration rate  mp恢复比例 */
    mrg: {
        get: function() {
            return this.xparam(8);
        },
        configurable: true
    },
    // Tp ReGeneration rate
    /** Tp ReGeneration rate  tp恢复比例 */
    trg: {
        get: function() {
            return this.xparam(9);
        },
        configurable: true
    },
    // TarGet Rate
    /** TarGet Rate  目标比例 */
    tgr: {
        get: function() {
            return this.sparam(0);
        },
        configurable: true
    },
    // GuaRD effect rate
    /** GuaRD effect rate 防守效果比例 */
    grd: {
        get: function() {
            return this.sparam(1);
        },
        configurable: true
    },
    // RECovery effect rate
    /** RECovery effect rate  恢复效果比例 */
    rec: {
        get: function() {
            return this.sparam(2);
        },
        configurable: true
    },
    // PHArmacology
    /** PHArmacology  药物知识 */
    pha: {
        get: function() {
            return this.sparam(3);
        },
        configurable: true
    },
    // Mp Cost Rate
    /** Mp Cost Rate   mp消耗比例 */
    mcr: {
        get: function() {
            return this.sparam(4);
        },
        configurable: true
    },
    // Tp Charge Rate
    /** Tp Charge Rate tp充能比例 */
    tcr: {
        get: function() {
            return this.sparam(5);
        },
        configurable: true
    },
    // Physical Damage Rate
    /** Physical Damage Rate  物理伤害比例 */
    pdr: {
        get: function() {
            return this.sparam(6);
        },
        configurable: true
    },
    // Magic Damage Rate
    /** Magical Damage Rate  魔法伤害比例 */
    mdr: {
        get: function() {
            return this.sparam(7);
        },
        configurable: true
    },
    // Floor Damage Rate
    /** Floor Damage Rate    地面伤害比例 */
    fdr: {
        get: function() {
            return this.sparam(8);
        },
        configurable: true
    },
    // EXperience Rate
    /** EXperience Rate  经验值比例 */
    exr: {
        get: function() {
            return this.sparam(9);
        },
        configurable: true
    }
});

/**
 * 初始化
 */
Game_BattlerBase.prototype.initialize = function() {
    this.initMembers();
};

/**初始化成员 */
Game_BattlerBase.prototype.initMembers = function() {
    this._hp = 1;
    this._mp = 0;
    this._tp = 0;
    this._hidden = false;
    this.clearParamPlus();
    this.clearStates();
    this.clearBuffs();
};

/**清除参数增加 */
Game_BattlerBase.prototype.clearParamPlus = function() {
    this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
};

/**清除状态组 */
Game_BattlerBase.prototype.clearStates = function() {
    this._states = [];
    this._stateTurns = {};
};

/**抹去状态
 * @param {number} stateId 状态id 
 * 
 */
Game_BattlerBase.prototype.eraseState = function(stateId) {
    this._states.remove(stateId);
    delete this._stateTurns[stateId];
};

/**是状态影响 
 * @param {number} stateId 状态id 
 */
Game_BattlerBase.prototype.isStateAffected = function(stateId) {
    return this._states.includes(stateId);
};

/**
 * 是死亡状态影响 
 * @return {boolean}
 */
Game_BattlerBase.prototype.isDeathStateAffected = function() {
    return this.isStateAffected(this.deathStateId());
};

/**
 * 死亡状态id 
 * @return {number} 
 */
Game_BattlerBase.prototype.deathStateId = function() {
    return 1;
};

/**
 * 重置状态计数 
 * @param {number} stateId 状态id 
 */
Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    const state = $dataStates[stateId];
    const variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
    this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
};

/**
 * 是状态期满 
 * @param {number} stateId 状态id 
 */
Game_BattlerBase.prototype.isStateExpired = function(stateId) {
    return this._stateTurns[stateId] === 0;
};

/**
 * 更新状态回合
 */
Game_BattlerBase.prototype.updateStateTurns = function() {
    for (const stateId of this._states) {
        if (this._stateTurns[stateId] > 0) {
            this._stateTurns[stateId]--;
        }
    }
};

/**
 * 清除效果组 
 */
Game_BattlerBase.prototype.clearBuffs = function() {
    this._buffs = [0, 0, 0, 0, 0, 0, 0, 0];
    this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0];
};

/**
 * 抹去效果
 * @param {number} paramId 参数id 
 */
Game_BattlerBase.prototype.eraseBuff = function(paramId) {
    this._buffs[paramId] = 0;
    this._buffTurns[paramId] = 0;
};

/**
 * 效果长度
 * @return {number}
 */
Game_BattlerBase.prototype.buffLength = function() {
    return this._buffs.length;
};

/**
 * 效果 
 * @param {number} paramId 参数id 
 * @return {number} 
 */
Game_BattlerBase.prototype.buff = function(paramId) {
    return this._buffs[paramId];
};

/**是正面效果影响 
 * @param {number} paramId 参数id 
 * @return {boolean} 
 */
Game_BattlerBase.prototype.isBuffAffected = function(paramId) {
    return this._buffs[paramId] > 0;
};

/**是负面效果影响  
 * @param {number} paramId 参数id 
 * @return {boolean}
 * 
 */
Game_BattlerBase.prototype.isDebuffAffected = function(paramId) {
    return this._buffs[paramId] < 0;
};

/**是正面效果或者负面效果影响 
 * @param {number} paramId 参数id 
 * @return {boolean} 
 */
Game_BattlerBase.prototype.isBuffOrDebuffAffected = function(paramId) {
    return this._buffs[paramId] !== 0;
};

/**是最大正面效果影响 
 * @param {number} paramId 参数id 
 * @return {boolean} 
 */
Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
    return this._buffs[paramId] === 2;
};

/**是最大负面效果影响 
 * @param {number} paramId 参数id 
 * @return {boolean}
 * 
 */
Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
    return this._buffs[paramId] === -2;
};

/**增加效果 
 * @param {number} paramId 参数id 
 * 
 */
Game_BattlerBase.prototype.increaseBuff = function(paramId) {
    if (!this.isMaxBuffAffected(paramId)) {
        this._buffs[paramId]++;
    }
};

/**减少效果 
 * @param {number} paramId 参数id 
 * 
 */
Game_BattlerBase.prototype.decreaseBuff = function(paramId) {
    if (!this.isMaxDebuffAffected(paramId)) {
        this._buffs[paramId]--;
    }
};

/**结束写效果回合 
 * @param {number} paramId 参数id 
 * @param {number} turns 回合数 
 * 
 */
Game_BattlerBase.prototype.overwriteBuffTurns = function(paramId, turns) {
    if (this._buffTurns[paramId] < turns) {
        this._buffTurns[paramId] = turns;
    }
};

/**是效果期满 
 * @param {number} paramId 参数id 
 * @return {boolean} 
 */
Game_BattlerBase.prototype.isBuffExpired = function(paramId) {
    return this._buffTurns[paramId] === 0;
};

/**更新效果回合 */
Game_BattlerBase.prototype.updateBuffTurns = function() {
    for (let i = 0; i < this._buffTurns.length; i++) {
        if (this._buffTurns[i] > 0) {
            this._buffTurns[i]--;
        }
    }
};

/**死亡 */
Game_BattlerBase.prototype.die = function() {
    this._hp = 0;
    this.clearStates();
    this.clearBuffs();
};

/**复苏 */
Game_BattlerBase.prototype.revive = function() {
    if (this._hp === 0) {
        this._hp = 1;
    }
};

/**状态组 
 * @return {[object]} 数据库中的状态 
 */
Game_BattlerBase.prototype.states = function() {
    return this._states.map(id => $dataStates[id]);
};

/**状态图标组
 * @return {[number]} 
 * 
 */
Game_BattlerBase.prototype.stateIcons = function() {
    return this.states()
        .map(state => state.iconIndex)
        .filter(iconIndex => iconIndex > 0);
};

/**效果图标组
 * @return {[number]} 
 */
Game_BattlerBase.prototype.buffIcons = function() {
    const icons = [];
    for (let i = 0; i < this._buffs.length; i++) {
        if (this._buffs[i] !== 0) {
            icons.push(this.buffIconIndex(this._buffs[i], i));
        }
    }
    return icons;
};

/**状态图标索引
 * @param {number} buffLevel 增益等级
 * @param {number} paramId 参数id
 * @param {number} 
 */
Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
    if (buffLevel > 0) {
        return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
    } else if (buffLevel < 0) {
        return (
            Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId
        );
    } else {
        return 0;
    }
};

/**所有图标组
 * @return {[number]} 
 * 
 */
Game_BattlerBase.prototype.allIcons = function() {
    return this.stateIcons().concat(this.buffIcons());
};

/**特征对象组 
 * @return {[object]}  
 */
Game_BattlerBase.prototype.traitObjects = function() {
    // Returns an array of the all objects having traits. States only here.
    return this.states();
};

/**所有特征 
 * @return {[object]}  
 */
Game_BattlerBase.prototype.allTraits = function() {
    return this.traitObjects().reduce((r, obj) => r.concat(obj.traits), []);
};

/**特征组 
 * @param {number} code 编码
 * @return {[object]}  
 */
Game_BattlerBase.prototype.traits = function(code) {
    return this.allTraits().filter(trait => trait.code === code);
};

/**特征组通过id  
 * @param {number} code 编码
 * @param {number} id id
 * @return {[object]}  
 */
Game_BattlerBase.prototype.traitsWithId = function(code, id) {
    return this.allTraits().filter(
        trait => trait.code === code && trait.dataId === id
    );
};

/**特征总比例  
 * @param {number} code 编码
 * @param {number} id id
 * @return {number}  
 */
Game_BattlerBase.prototype.traitsPi = function(code, id) {
    return this.traitsWithId(code, id).reduce((r, trait) => r * trait.value, 1);
};

/**特征总数
 * @param {number} code 编码
 * @param {number} id id
 * @return {number}  
 */
Game_BattlerBase.prototype.traitsSum = function(code, id) {
    return this.traitsWithId(code, id).reduce((r, trait) => r + trait.value, 0);
};

/**特征总数所有
 * @param {number} code 编码 
 * @return {number}  
 */
Game_BattlerBase.prototype.traitsSumAll = function(code) {
    return this.traits(code).reduce((r, trait) => r + trait.value, 0);
};

/**特征集合
 * @param {number} code 编码
 * @return {[number]}  
 */
Game_BattlerBase.prototype.traitsSet = function(code) {
    return this.traits(code).reduce((r, trait) => r.concat(trait.dataId), []);
};

/**参数基础 
 * @param {number} paramId 参数id
 * @return {number}  
 * 
 */
Game_BattlerBase.prototype.paramBase = function(/*paramId*/) {
    return 0;
};

/**参数增加 
 * @param {number} paramId 参数id
 * @return {number}  
 * 
 */
Game_BattlerBase.prototype.paramPlus = function(paramId) {
    return this._paramPlus[paramId];
};

/**参数基础及增加  
 * @param {number} paramId 参数id
 * @return {number}  
 * @mz 新增
 */
Game_BattlerBase.prototype.paramBasePlus = function(paramId) {
    return Math.max(0, this.paramBase(paramId) + this.paramPlus(paramId));
};

/**参数最小 
 * 
 * 8项基本参数在游戏中的最小设置值
 * 
 * @param {number} paramId 参数id
 * @return {number}   
 */
Game_BattlerBase.prototype.paramMin = function(paramId) {
    if (paramId === 0) {
        return 1; // MHP
    } else {
        return 0;
    }
};

/**参数最大
 *  
 * @param {number} paramId 参数id
 * @return {number}   
 * @version mz 
 * 
 */
Game_BattlerBase.prototype.paramMax = function(/*paramId*/) {
    return Infinity;
};

/**参数比例 
 * @param {number} paramId 参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.paramRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
};

/**参数效果比例 
 * @param {number} paramId 参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
    return this._buffs[paramId] * 0.25 + 1.0;
};

/**参数 
 * @param {number} paramId 参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.param = function(paramId) {
    const value =
        this.paramBasePlus(paramId) *
        this.paramRate(paramId) *
        this.paramBuffRate(paramId);
    const maxValue = this.paramMax(paramId);
    const minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

/**x参数 
 * @param {number} xparamId x参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.xparam = function(xparamId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
};

/**s参数 
 * @param {number} sparamId s参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.sparam = function(sparamId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
};

/**元素比例 
 * @param {number} elementId 元素id
 * @return {number}    
 */
Game_BattlerBase.prototype.elementRate = function(elementId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
};

/**负面效果比例
 * @param {number} paramId 参数id 
 * @return {number}   
 * 
 * */
Game_BattlerBase.prototype.debuffRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
};

/**状态比例 
 * @param {number} stateId 状态id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.stateRate = function(stateId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
};

/**状态抵抗集合 
 * @return {[number]}   
 * 
 */
Game_BattlerBase.prototype.stateResistSet = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
};

/**是状态抵抗 
 * @param {number} stateId 状态id 
 * @return {boolean}   
 * 
 */
Game_BattlerBase.prototype.isStateResist = function(stateId) {
    return this.stateResistSet().includes(stateId);
};

/**攻击元素组 
 * @return {[number]} 
 */
Game_BattlerBase.prototype.attackElements = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
};

/**攻击状态 
 * @return {[number]} 
 * 
 */
Game_BattlerBase.prototype.attackStates = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
};

/**攻击状态比例 
 * @return {number}     
 */
Game_BattlerBase.prototype.attackStatesRate = function(stateId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
};

/**攻击速度 
 * @return {number}    
 */
Game_BattlerBase.prototype.attackSpeed = function() {
    return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
};

/**攻击次数增加 
 * @return {number}     
 */
Game_BattlerBase.prototype.attackTimesAdd = function() {
    return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
};

/**
 * 攻击技能id
 * @mv  
 * 为{return 1;} 
 */
Game_BattlerBase.prototype.attackSkillId = function() {
    const set = this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_SKILL);
    return set.length > 0 ? Math.max(...set) : 1;
};

/**附加技能种类 
 * @return {[number]}  
 */
Game_BattlerBase.prototype.addedSkillTypes = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
};

/**是技能种类封印 
 * @return {[number]}     
 */
Game_BattlerBase.prototype.isSkillTypeSealed = function(stypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).includes(stypeId);
};

/**添加技能组 
 * @return {[number]}     
 * 
 */
Game_BattlerBase.prototype.addedSkills = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
};

/**是技能封印 
 * @param {number} skillId 技能id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isSkillSealed = function(skillId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).includes(skillId);
};

/**是装备武器种类允许  
 * @param {number} wtypeId 装备种类id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isEquipWtypeOk = function(wtypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).includes(wtypeId);
};

/**是装备防具种类允许  
 * @param {number} atypeId 防具种类id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isEquipAtypeOk = function(atypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).includes(atypeId);
};

/**是装备种类锁定  
 * @param {number} etypeId 装备种类id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isEquipTypeLocked = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).includes(etypeId);
};

/**是装备种类封印 
 * @param {number} etypeId 装备种类id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isEquipTypeSealed = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).includes(etypeId);
};

/**孔种类  
 * @return {number}  
 */
Game_BattlerBase.prototype.slotType = function() {
    const set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
    return set.length > 0 ? Math.max(...set) : 0;
};

/**是双刀流  
 * @return {boolean}  
 */
Game_BattlerBase.prototype.isDualWield = function() {
    return this.slotType() === 1;
};

/**行动添加集合 
 * @return {[number]}  
 */
Game_BattlerBase.prototype.actionPlusSet = function() {
    return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(
        trait => trait.value
    );
};

/**特别标志  
 * @param {number} flagId 标志id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.specialFlag = function(flagId) {
    return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(
        trait => trait.dataId === flagId
    );
};

/**死亡种类  
 * @return {number}  
 */
Game_BattlerBase.prototype.collapseType = function() {
    const set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
    return set.length > 0 ? Math.max(...set) : 0;
};

/**队伍能力  
 * @param {number} abilityId 能力id
 * @return {boolean}  
 */
Game_BattlerBase.prototype.partyAbility = function(abilityId) {
    return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(
        trait => trait.dataId === abilityId
    );
};

/**是自动战斗 
 * @return {boolean}   
 */
Game_BattlerBase.prototype.isAutoBattle = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
};

/**是防御 
 * @return {boolean}  
 * 
 */
Game_BattlerBase.prototype.isGuard = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
};

/**是替代 
 * @return {boolean}  
 * 
 */
Game_BattlerBase.prototype.isSubstitute = function() {
    return (
        this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove()
    );
};

/**是保留tp 
 * @return {boolean}  
 * 
 */
Game_BattlerBase.prototype.isPreserveTp = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
};

/**增加参数 
 * @param {number} paramId 参数id
 * @param {number} value 值
 */
Game_BattlerBase.prototype.addParam = function(paramId, value) {
    this._paramPlus[paramId] += value;
    this.refresh();
};

/**设置hp 
 * @param {number} hp  
 */
Game_BattlerBase.prototype.setHp = function(hp) {
    this._hp = hp;
    this.refresh();
};

/**设置mp 
 * @param {number} mp  
 * 
 */
Game_BattlerBase.prototype.setMp = function(mp) {
    this._mp = mp;
    this.refresh();
};

/**设置tp 
 * @param {number} tp  
 * 
 */
Game_BattlerBase.prototype.setTp = function(tp) {
    this._tp = tp;
    this.refresh();
};

/**最大tp 
 * @return {number} 
 */
Game_BattlerBase.prototype.maxTp = function() {
    return 100;
};

/**刷新 */
Game_BattlerBase.prototype.refresh = function() {
    for (const stateId of this.stateResistSet()) {
        this.eraseState(stateId);
    }
    this._hp = this._hp.clamp(0, this.mhp);
    this._mp = this._mp.clamp(0, this.mmp);
    this._tp = this._tp.clamp(0, this.maxTp());
};

/**完全恢复 */
Game_BattlerBase.prototype.recoverAll = function() {
    this.clearStates();
    this._hp = this.mhp;
    this._mp = this.mmp;
};

/**hp比例 
 * @return {number}  
 */
Game_BattlerBase.prototype.hpRate = function() {
    return this.hp / this.mhp;
};

/**mp比例 
 * @return {number} 
 * 
 */
Game_BattlerBase.prototype.mpRate = function() {
    return this.mmp > 0 ? this.mp / this.mmp : 0;
};

/**tp比例 
 * @return {number} 
 * 
 */
Game_BattlerBase.prototype.tpRate = function() {
    return this.tp / this.maxTp();
};

/**隐藏 */
Game_BattlerBase.prototype.hide = function() {
    this._hidden = true;
};

/**出现 */
Game_BattlerBase.prototype.appear = function() {
    this._hidden = false;
};

/**是隐藏的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isHidden = function() {
    return this._hidden;
};

/**是出现的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isAppeared = function() {
    return !this.isHidden();
};

/**是死的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isDead = function() {
    return this.isAppeared() && this.isDeathStateAffected();
};

/**是活的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isAlive = function() {
    return this.isAppeared() && !this.isDeathStateAffected();
};

/**是濒死的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isDying = function() {
    return this.isAlive() && this._hp < this.mhp / 4;
};

/**是受限制的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isRestricted = function() {
    return this.isAppeared() && this.restriction() > 0;
};

/**能输入 
 * 
 * 是否可以在战斗中发出指令
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canInput = function() {
    // prettier-ignore
    return this.isAppeared() && this.isActor() &&
            !this.isRestricted() && !this.isAutoBattle();
};

/**能移动 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canMove = function() {
    return this.isAppeared() && this.restriction() < 4;
};

/**是混乱的 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isConfused = function() {
    return (
        this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3
    );
};

/**混乱等级 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.confusionLevel = function() {
    return this.isConfused() ? this.restriction() : 0;
};

/**是角色 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isActor = function() {
    return false;
};

/**是敌人 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isEnemy = function() {
    return false;
};

/**排序状态组 */
Game_BattlerBase.prototype.sortStates = function() {
    this._states.sort((a, b) => {
        const p1 = $dataStates[a].priority;
        const p2 = $dataStates[b].priority;
        if (p1 !== p2) {
            return p2 - p1;
        }
        return a - b;
    });
};

/**限制 
 * @return {number}  
 */
Game_BattlerBase.prototype.restriction = function() {
    const restrictions = this.states().map(state => state.restriction);
    return Math.max(0, ...restrictions);
};

/**添加新的状态 
 * @param {number} stateId
 * 
 */
Game_BattlerBase.prototype.addNewState = function(stateId) {
    if (stateId === this.deathStateId()) {
        this.die();
    }
    const restricted = this.isRestricted();
    this._states.push(stateId);
    this.sortStates();
    if (!restricted && this.isRestricted()) {
        this.onRestrict();
    }
};

/**当限制 */
Game_BattlerBase.prototype.onRestrict = function() {
    //
};

/**最大重要状态文本 
 * @return {string} 
 * 
 */
Game_BattlerBase.prototype.mostImportantStateText = function() {
    for (const state of this.states()) {
        if (state.message3) {
            return state.message3;
        }
    }
    return "";
};

/**状态动作索引 
 * @return {number}  
 */
Game_BattlerBase.prototype.stateMotionIndex = function() {
    const states = this.states();
    if (states.length > 0) {
        return states[0].motion;
    } else {
        return 0;
    }
};

/**状态叠加索引 
 * @return {number} 
 * 
 */
Game_BattlerBase.prototype.stateOverlayIndex = function() {
    const states = this.states();
    if (states.length > 0) {
        return states[0].overlay;
    } else {
        return 0;
    }
};

/**是技能武器确定 
 * @param {{}} skill
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.isSkillWtypeOk = function(/*skill*/) {
    return true;
};

/**技能mp消耗 
 * @param {{}} skill
 * @return {number}
 * 
 */
Game_BattlerBase.prototype.skillMpCost = function(skill) {
    return Math.floor(skill.mpCost * this.mcr);
};

/**技能tp消耗 
 * @param {{}} skill
 * @return {number}
 * 
 */
Game_BattlerBase.prototype.skillTpCost = function(skill) {
    return skill.tpCost;
};

/**能够支付技能消耗 
 * @param {{}} skill
 * @return {boolean}
 * 
 */
Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    return (
        this._tp >= this.skillTpCost(skill) &&
        this._mp >= this.skillMpCost(skill)
    );
};

/**支付技能消耗
 * @param {{}} skill
 */
Game_BattlerBase.prototype.paySkillCost = function(skill) {
    this._mp -= this.skillMpCost(skill);
    this._tp -= this.skillTpCost(skill);
};

/**是时机允许 
 * @param {{}} item
 * @return {boolean} 
 */
Game_BattlerBase.prototype.isOccasionOk = function(item) {
    if ($gameParty.inBattle()) {
        return item.occasion === 0 || item.occasion === 1;
    } else {
        return item.occasion === 0 || item.occasion === 2;
    }
};

/**满足可用物品条件 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.meetsUsableItemConditions = function(item) {
    return this.canMove() && this.isOccasionOk(item);
};

/**满足技能条件 
 * @param {{}} skill
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
    return (
        this.meetsUsableItemConditions(skill) &&
        this.isSkillWtypeOk(skill) &&
        this.canPaySkillCost(skill) &&
        !this.isSkillSealed(skill.id) &&
        !this.isSkillTypeSealed(skill.stypeId)
    );
};

/**满足物品条件 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.meetsItemConditions = function(item) {
    return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
};

/**能用 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canUse = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isSkill(item)) {
        return this.meetsSkillConditions(item);
    } else if (DataManager.isItem(item)) {
        return this.meetsItemConditions(item);
    } else {
        return false;
    }
};

/**能装备 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canEquip = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isWeapon(item)) {
        return this.canEquipWeapon(item);
    } else if (DataManager.isArmor(item)) {
        return this.canEquipArmor(item);
    } else {
        return false;
    }
};

/**能装备武器 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canEquipWeapon = function(item) {
    return (
        this.isEquipWtypeOk(item.wtypeId) &&
        !this.isEquipTypeSealed(item.etypeId)
    );
};

/**能装备防具 
 * @param {{}} item
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canEquipArmor = function(item) {
    return (
        this.isEquipAtypeOk(item.atypeId) &&
        !this.isEquipTypeSealed(item.etypeId)
    );
};

/**防御技能id 
 * @return {number} 
 * 
 */
Game_BattlerBase.prototype.guardSkillId = function() {
    return 2;
};

/**能攻击 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canAttack = function() {
    return this.canUse($dataSkills[this.attackSkillId()]);
};

/**能防御 
 * @return {boolean} 
 * 
 */
Game_BattlerBase.prototype.canGuard = function() {
    return this.canUse($dataSkills[this.guardSkillId()]);
};

