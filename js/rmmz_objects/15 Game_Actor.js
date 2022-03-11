//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

/**
 * 游戏角色
 * 
 * 角色的游戏对象类。
 */
function Game_Actor() {
    this.initialize(...arguments);
}

Game_Actor.prototype = Object.create(Game_Battler.prototype);
Game_Actor.prototype.constructor = Game_Actor;

/**
 * 等级
 */
Object.defineProperty(Game_Actor.prototype, "level", {
    get: function() {
        /**
         * 等级
         * @type {number}
         */
        return this._level;
    },
    configurable: true
});

/**
 * 初始化
 * @param {number} actorId 角色id 
 */
Game_Actor.prototype.initialize = function(actorId) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(actorId);
};

/**
 * 初始化成员
 */
Game_Actor.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    /**
     * 角色id
     * @type {number}
     */
    this._actorId = 0;
    /**
     * 名称
     * @type {string}
     */
    this._name = "";
    /**
     * 昵称
     * @type {string}
     */
    this._nickname = "";
    /**
     * 职业id
     * @type {number}
     */
    this._classId = 0;
    /**
     * 等级
     * @type {number}
     */
    this._level = 0;
    /**
     * 行走图名称
     * @type {string}
     */
    this._characterName = "";
    /**
     * 行走图索引
     * @type {number}
     */
    this._characterIndex = 0;
    /**
     * 脸图名称
     * @type {string}
     */
    this._faceName = "";
    /**
     * 脸图索引
     * @type {number}
     */
    this._faceIndex = 0;
    /**
     * 战斗图名称
     * @type {string}
     */
    this._battlerName = "";
    /**
     * 经验值
     */
    this._exp = {};
    /**
     * 技能组
     */
    this._skills = [];
    /**
     * 装备组
     */
    this._equips = [];
    /**
     * 动作输入索引
     * @type {string}
     */
    this._actionInputIndex = 0;
    /**
     * 最后菜单技能 
     * @type {Game_Item}
     */
    this._lastMenuSkill = new Game_Item();
    /**
     * 最后战斗技能 
     * @type {Game_Item}
     */
    this._lastBattleSkill = new Game_Item();
    /**
     * 最后命令符号 
     * @type {string} 
     */
    this._lastCommandSymbol = "";
};

/**
 * 安装
 * @param {number} actorId 角色id
 */
Game_Actor.prototype.setup = function(actorId) {
    const actor = $dataActors[actorId];
    this._actorId = actorId;
    this._name = actor.name;
    this._nickname = actor.nickname;
    /**
     * 人物简介
     * @type {string}
     */
    this._profile = actor.profile;
    this._classId = actor.classId;
    this._level = actor.initialLevel;
    this.initImages();
    this.initExp();
    this.initSkills();
    this.initEquips(actor.equips);
    this.clearParamPlus();
    this.recoverAll();
};

/**
 * 角色id
 * @returns {number}
 */
Game_Actor.prototype.actorId = function() {
    return this._actorId;
};

/**
 * 角色数据
 */
Game_Actor.prototype.actor = function() {
    return $dataActors[this._actorId];
};

/**
 * 名称
 */
Game_Actor.prototype.name = function() {
    return this._name;
};

/**
 * 设置名称
 * @param {string} name 名称
 */
Game_Actor.prototype.setName = function(name) {
    this._name = name;
};

/**昵称*/
Game_Actor.prototype.nickname = function() {
    return this._nickname;
};

/**
 * 设置昵称
 * @param {string} nickname 昵称
 * 
*/
Game_Actor.prototype.setNickname = function(nickname) {
    this._nickname = nickname;
};

/**
 * 人物简介
 * @returns {string}
 */
Game_Actor.prototype.profile = function() {
    return this._profile;
};

/**
 * 设置人物简介
 * @param {string} profile 人物简介
 */
Game_Actor.prototype.setProfile = function(profile) {
    this._profile = profile;
};

/**
 * 行走图名称
 */
Game_Actor.prototype.characterName = function() {
    return this._characterName;
};

/**
 * 行走图索引
 */
Game_Actor.prototype.characterIndex = function() {
    return this._characterIndex;
};


/**脸图名称*/
Game_Actor.prototype.faceName = function() {
    return this._faceName;
};

/**脸图索引*/
Game_Actor.prototype.faceIndex = function() {
    return this._faceIndex;
};

/**战斗图名称*/
Game_Actor.prototype.battlerName = function() {
    return this._battlerName;
};

/**清除状态组*/
Game_Actor.prototype.clearStates = function() {
    Game_Battler.prototype.clearStates.call(this);
    this._stateSteps = {};
};

/**抹去状态*/
Game_Actor.prototype.eraseState = function(stateId) {
    Game_Battler.prototype.eraseState.call(this, stateId);
    delete this._stateSteps[stateId];
};

/**抹去状态计数*/
Game_Actor.prototype.resetStateCounts = function(stateId) {
    Game_Battler.prototype.resetStateCounts.call(this, stateId);
    this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
};

/**初始化图片*/
Game_Actor.prototype.initImages = function() {
    const actor = this.actor();
    this._characterName = actor.characterName;
    this._characterIndex = actor.characterIndex;
    this._faceName = actor.faceName;
    this._faceIndex = actor.faceIndex;
    this._battlerName = actor.battlerName;
};

/**经验值为等级*/
Game_Actor.prototype.expForLevel = function(level) {
    const c = this.currentClass();
    const basis = c.expParams[0];
    const extra = c.expParams[1];
    const acc_a = c.expParams[2];
    const acc_b = c.expParams[3];
    return Math.round(
        (basis * Math.pow(level - 1, 0.9 + acc_a / 250) * level * (level + 1)) /
            (6 + Math.pow(level, 2) / 50 / acc_b) +
            (level - 1) * extra
    );
};

/**初始化经验值*/
Game_Actor.prototype.initExp = function() {
    this._exp[this._classId] = this.currentLevelExp();
};

/**当前经验值*/
Game_Actor.prototype.currentExp = function() {
    return this._exp[this._classId];
};

/**当前等级经验值*/
Game_Actor.prototype.currentLevelExp = function() {
    return this.expForLevel(this._level);
};

/**下一级经验值*/
Game_Actor.prototype.nextLevelExp = function() {
    return this.expForLevel(this._level + 1);
};

/**下一级需要经验值*/
Game_Actor.prototype.nextRequiredExp = function() {
    return this.nextLevelExp() - this.currentExp();
};

/**最大等级*/
Game_Actor.prototype.maxLevel = function() {
    return this.actor().maxLevel;
};

/**是最大等级*/
Game_Actor.prototype.isMaxLevel = function() {
    return this._level >= this.maxLevel();
};

/**初始化技能*/
Game_Actor.prototype.initSkills = function() {
    this._skills = [];
    for (const learning of this.currentClass().learnings) {
        if (learning.level <= this._level) {
            this.learnSkill(learning.skillId);
        }
    }
};

/**初始化装备组*/
Game_Actor.prototype.initEquips = function(equips) {
    const slots = this.equipSlots();
    const maxSlots = slots.length;
    this._equips = [];
    for (let i = 0; i < maxSlots; i++) {
        this._equips[i] = new Game_Item();
    }
    for (let j = 0; j < equips.length; j++) {
        if (j < maxSlots) {
            this._equips[j].setEquip(slots[j] === 1, equips[j]);
        }
    }
    this.releaseUnequippableItems(true);
    this.refresh();
};

/**装备槽组*/
Game_Actor.prototype.equipSlots = function() {
    const slots = [];
    for (let i = 1; i < $dataSystem.equipTypes.length; i++) {
        slots.push(i);
    }
    if (slots.length >= 2 && this.isDualWield()) {
        slots[1] = 1;
    }
    return slots;
};

/**
 * 装备组
 * @return {object[]} 装备组的数据组
 * 
 */
Game_Actor.prototype.equips = function() {
    return this._equips.map(item => item.object());
};

/**
 * 武器组
 * @return {object[]} 武器组的数据组
 * 
 */
Game_Actor.prototype.weapons = function() {
    return this.equips().filter(item => item && DataManager.isWeapon(item));
};

/**
 * 防具组
 * @return {object[]} 防具组的数据组 
 * 
 */
Game_Actor.prototype.armors = function() {
    return this.equips().filter(item => item && DataManager.isArmor(item));
};

/**
 * 有武器
 * @param {object} weapon 武器
 * @return {boolean}
 * 
 */
Game_Actor.prototype.hasWeapon = function(weapon) {
    return this.weapons().includes(weapon);
};

/**有防具
 * @param {object} armor 武器
 * @return {boolean} 
 */
Game_Actor.prototype.hasArmor = function(armor) {
    return this.armors().includes(armor);
};

/**是装备改变可以
 * @param {number} slotId 槽id
 */
Game_Actor.prototype.isEquipChangeOk = function(slotId) {
    return (
        !this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
        !this.isEquipTypeSealed(this.equipSlots()[slotId])
    );
};

/**
 * 改变装备
 * @param {number} slotId 槽id
 * @param {object} item 装备数据
 */
Game_Actor.prototype.changeEquip = function(slotId, item) {
    if (
        this.tradeItemWithParty(item, this.equips()[slotId]) &&
        (!item || this.equipSlots()[slotId] === item.etypeId)
    ) {
        this._equips[slotId].setObject(item);
        this.refresh();
    }
};

/**强制改变装备
 * @param {number} slotId 槽id
 * @param {object} item 装备数据
 */
Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
    this._equips[slotId].setObject(item);
    this.releaseUnequippableItems(true);
    this.refresh();
};

/**
 * 交换物品和队伍
 *  
 * @param {object} newItem 新项目数据
 * @param {object} oldItem 旧项目数据
 */
Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
    if (newItem && !$gameParty.hasItem(newItem)) {
        return false;
    } else {
        $gameParty.gainItem(oldItem, 1);
        $gameParty.loseItem(newItem, 1);
        return true;
    }
};


/**
 * 改变装备通过id
 * 
 * @param {number} etypeId 装备种类id
 * @param {number} itemId 项目id
 */
Game_Actor.prototype.changeEquipById = function(etypeId, itemId) {
    const slotId = etypeId - 1;
    if (this.equipSlots()[slotId] === 1) {
        this.changeEquip(slotId, $dataWeapons[itemId]);
    } else {
        this.changeEquip(slotId, $dataArmors[itemId]);
    }
};

/**是装备
 *   
 * @param {object} item 项目数据
 */
Game_Actor.prototype.isEquipped = function(item) {
    return this.equips().includes(item);
};

/**
 * 丢弃装备
 * @param {object} item 项目数据
 */
Game_Actor.prototype.discardEquip = function(item) {
    const slotId = this.equips().indexOf(item);
    if (slotId >= 0) {
        this._equips[slotId].setObject(null);
    }
};

/**
 * 解放不能装备的物品
 * @param {boolean} forcing 强制
 */
Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
    for (;;) {
        const slots = this.equipSlots();
        const equips = this.equips();
        let changed = false;
        for (let i = 0; i < equips.length; i++) {
            const item = equips[i];
            if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
                if (!forcing) {
                    this.tradeItemWithParty(null, item);
                }
                this._equips[i].setObject(null);
                changed = true;
            }
        }
        if (!changed) {
            break;
        }
    }
};

/**清除装备*/
Game_Actor.prototype.clearEquipments = function() {
    const maxSlots = this.equipSlots().length;
    for (let i = 0; i < maxSlots; i++) {
        if (this.isEquipChangeOk(i)) {
            this.changeEquip(i, null);
        }
    }
};

/**最好装备*/
Game_Actor.prototype.optimizeEquipments = function() {
    const maxSlots = this.equipSlots().length;
    this.clearEquipments();
    for (let i = 0; i < maxSlots; i++) {
        if (this.isEquipChangeOk(i)) {
            this.changeEquip(i, this.bestEquipItem(i));
        }
    }
};


/**
 * 最好装备项目
 * @param {number} slotId 槽id
 * @return {object}
 */
Game_Actor.prototype.bestEquipItem = function(slotId) {
    const etypeId = this.equipSlots()[slotId];
    const items = $gameParty
        .equipItems()
        .filter(item => item.etypeId === etypeId && this.canEquip(item));
    let bestItem = null;
    let bestPerformance = -1000;
    for (let i = 0; i < items.length; i++) {
        const performance = this.calcEquipItemPerformance(items[i]);
        if (performance > bestPerformance) {
            bestPerformance = performance;
            bestItem = items[i];
        }
    }
    return bestItem;
};

/**
 * 计算装备项目成绩
 * @param {object} item 项目数据
 */
Game_Actor.prototype.calcEquipItemPerformance = function(item) {
    return item.params.reduce((a, b) => a + b);
};

/**
 * 是技能武器种类可以 
 * @param {object} skill 技能数据
 */
Game_Actor.prototype.isSkillWtypeOk = function(skill) {
    const wtypeId1 = skill.requiredWtypeId1;
    const wtypeId2 = skill.requiredWtypeId2;
    if (
        (wtypeId1 === 0 && wtypeId2 === 0) ||
        (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
        (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))
    ) {
        return true;
    } else {
        return false;
    }
};


/**
 * 是武器种类装备后
 * @param {number} wtypeId 武器种类id
 */
Game_Actor.prototype.isWtypeEquipped = function(wtypeId) {
    return this.weapons().some(weapon => weapon.wtypeId === wtypeId);
};

/**刷新*/
Game_Actor.prototype.refresh = function() {
    this.releaseUnequippableItems(false);
    Game_Battler.prototype.refresh.call(this);
};

/**
 * 隐藏
 */
Game_Actor.prototype.hide = function() {
    Game_Battler.prototype.hide.call(this);
    $gameTemp.requestBattleRefresh();
};

/**是角色*/
Game_Actor.prototype.isActor = function() {
    return true;
};

/**朋友小组*/
Game_Actor.prototype.friendsUnit = function() {
    return $gameParty;
};

/**对手小组*/
Game_Actor.prototype.opponentsUnit = function() {
    return $gameTroop;
};

/**索引*/
Game_Actor.prototype.index = function() {
    return $gameParty.members().indexOf(this);
};

/**是战斗成员*/
Game_Actor.prototype.isBattleMember = function() {
    return $gameParty.battleMembers().includes(this);
};

/**是编队改变可以*/
Game_Actor.prototype.isFormationChangeOk = function() {
    return true;
};

/**当前职业*/
Game_Actor.prototype.currentClass = function() {
    return $dataClasses[this._classId];
};

/**是职业*/
Game_Actor.prototype.isClass = function(gameClass) {
    return gameClass && this._classId === gameClass.id;
};

/**技能种类组
 * @mz 新增
*/
Game_Actor.prototype.skillTypes = function() {
    const skillTypes = this.addedSkillTypes().sort((a, b) => a - b);
    return skillTypes.filter((x, i, self) => self.indexOf(x) === i);
};

/**
 * 技能组 
 * 
*/
Game_Actor.prototype.skills = function() {
    const list = [];
    for (const id of this._skills.concat(this.addedSkills())) {
        if (!list.includes($dataSkills[id])) {
            list.push($dataSkills[id]);
        }
    }
    return list;
};

/**可用技能组*/
Game_Actor.prototype.usableSkills = function() {
    return this.skills().filter(skill => this.canUse(skill));
};

/**特性对象组*/
Game_Actor.prototype.traitObjects = function() {
    const objects = Game_Battler.prototype.traitObjects.call(this);
    objects.push(this.actor(), this.currentClass());
    for (const item of this.equips()) {
        if (item) {
            objects.push(item);
        }
    }
    return objects;
};

/**攻击元素组*/
Game_Actor.prototype.attackElements = function() {
    const set = Game_Battler.prototype.attackElements.call(this);
    if (this.hasNoWeapons() && !set.includes(this.bareHandsElementId())) {
        set.push(this.bareHandsElementId());
    }
    return set;
};

/**没有武器*/
Game_Actor.prototype.hasNoWeapons = function() {
    return this.weapons().length === 0;
};

/**空手元素id*/
Game_Actor.prototype.bareHandsElementId = function() {
    return 1;
};

/**
 * 参数基础
 * @param {number} paramId 参数id
 * @mz 新增
*/
Game_Actor.prototype.paramBase = function(paramId) {
    return this.currentClass().params[paramId][this._level];
};

/**
 * 参数增加
 * @param {number} paramId 参数id
 * @mz 新增
 */
Game_Actor.prototype.paramPlus = function(paramId) {
    let value = Game_Battler.prototype.paramPlus.call(this, paramId);
    for (const item of this.equips()) {
        if (item) {
            value += item.params[paramId];
        }
    }
    return value;
};

/**
 * 攻击动画id  
 */
Game_Actor.prototype.attackAnimationId1 = function() {
    if (this.hasNoWeapons()) {
        return this.bareHandsAnimationId();
    } else {
        const weapons = this.weapons();
        return weapons[0] ? weapons[0].animationId : 0;
    }
};

/**
 * 攻击动画id 2
*/
Game_Actor.prototype.attackAnimationId2 = function() {
    const weapons = this.weapons();
    return weapons[1] ? weapons[1].animationId : 0;
};

/**
 * 赤手动画id
 * 
*/
Game_Actor.prototype.bareHandsAnimationId = function() {
    return 1;
};

/**
 * 改变经验值
 * @param {number} exp 经验值
 * @param {boolean} show 显示
 */
Game_Actor.prototype.changeExp = function(exp, show) {
    this._exp[this._classId] = Math.max(exp, 0);
    const lastLevel = this._level;
    const lastSkills = this.skills();
    while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
        this.levelUp();
    }
    while (this.currentExp() < this.currentLevelExp()) {
        this.levelDown();
    }
    if (show && this._level > lastLevel) {
        this.displayLevelUp(this.findNewSkills(lastSkills));
    }
    this.refresh();
};

/**等级上升*/
Game_Actor.prototype.levelUp = function() {
    this._level++;
    for (const learning of this.currentClass().learnings) {
        if (learning.level === this._level) {
            this.learnSkill(learning.skillId);
        }
    }
};

/**等级下降*/
Game_Actor.prototype.levelDown = function() {
    this._level--;
};

/**寻找新技能组*/
Game_Actor.prototype.findNewSkills = function(lastSkills) {
    const newSkills = this.skills();
    for (const lastSkill of lastSkills) {
        newSkills.remove(lastSkill);
    }
    return newSkills;
};

/**显示等级上升*/
Game_Actor.prototype.displayLevelUp = function(newSkills) {
    const text = TextManager.levelUp.format(
        this._name,
        TextManager.level,
        this._level
    );
    $gameMessage.newPage();
    $gameMessage.add(text);
    for (const skill of newSkills) {
        $gameMessage.add(TextManager.obtainSkill.format(skill.name));
    }
};

/**获得经验值*/
Game_Actor.prototype.gainExp = function(exp) {
    const newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
    this.changeExp(newExp, this.shouldDisplayLevelUp());
};

/**最后经验值比例*/
Game_Actor.prototype.finalExpRate = function() {
    return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
};

/**保留成员的经验值比例*/
Game_Actor.prototype.benchMembersExpRate = function() {
    return $dataSystem.optExtraExp ? 1 : 0;
};

/**需要显示等级上升*/
Game_Actor.prototype.shouldDisplayLevelUp = function() {
    return true;
};

/**改变等级 
 * @param {number} level 目标等级
 * @param {boolean} show 显示
 */
Game_Actor.prototype.changeLevel = function(level, show) {
    level = level.clamp(1, this.maxLevel());
    this.changeExp(this.expForLevel(level), show);
};

/**
 * 学习技能
 * @param {number} skillId 技能id
 */
Game_Actor.prototype.learnSkill = function(skillId) {
    if (!this.isLearnedSkill(skillId)) {
        this._skills.push(skillId);
        this._skills.sort((a, b) => a - b);
    }
};

/**
 * 忘记技能
 * @param {number} skillId 技能id
 */
Game_Actor.prototype.forgetSkill = function(skillId) {
    this._skills.remove(skillId);
};

/**
 * 是学习了的技能
 * @param {number} skillId 技能id
 */
Game_Actor.prototype.isLearnedSkill = function(skillId) {
    return this._skills.includes(skillId);
};

/**
 * 有技能
 * @param {number} skillId 技能id
 */
Game_Actor.prototype.hasSkill = function(skillId) {
    return this.skills().includes($dataSkills[skillId]);
};

/**
 * 改变职业
 * @param {number} classId 职业id
 * @param {boolean} keepExp 保留经验值
 */
Game_Actor.prototype.changeClass = function(classId, keepExp) {
    if (keepExp) {
        this._exp[classId] = this.currentExp();
    }
    this._classId = classId;
    this._level = 0;
    this.changeExp(this._exp[this._classId] || 0, false);
    this.refresh();
};

/**
 * 设置行走图图像
 * @param {string} characterName 行走图名称
 * @param {number} characterIndex 行走图索引
 */
Game_Actor.prototype.setCharacterImage = function(
    characterName,
    characterIndex
) {
    this._characterName = characterName;
    this._characterIndex = characterIndex;
};

/**
 * 设置脸图图像
 * @param {string} faceName 脸图名称
 * @param {number} faceIndex 脸图索引
 */
Game_Actor.prototype.setFaceImage = function(faceName, faceIndex) {
    this._faceName = faceName;
    this._faceIndex = faceIndex;
    $gameTemp.requestBattleRefresh();
};

/**
 * 设置战斗图图像
 * @param {string} battlerName 战斗图名称
 */
Game_Actor.prototype.setBattlerImage = function(battlerName) {
    this._battlerName = battlerName;
};

/**是精灵显示*/
Game_Actor.prototype.isSpriteVisible = function() {
    return $gameSystem.isSideView();
};


/**  
 * @mv Game_Actor.prototype.startAnimation 被舍弃
 */

/**表现动作开始
 * 
 * @param {Game_Action} action 动作
 * 
*/
Game_Actor.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
};

/**表现动作
 * 
 * @param {Game_Action} action 动作
 * 
*/
Game_Actor.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
    if (action.isAttack()) {
        this.performAttack();
    } else if (action.isGuard()) {
        this.requestMotion("guard");
    } else if (action.isMagicSkill()) {
        this.requestMotion("spell");
    } else if (action.isSkill()) {
        this.requestMotion("skill");
    } else if (action.isItem()) {
        this.requestMotion("item");
    }
};

/**表现动作结束*/
Game_Actor.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};

/**表现攻击*/
Game_Actor.prototype.performAttack = function() {
    const weapons = this.weapons();
    const wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
    const attackMotion = $dataSystem.attackMotions[wtypeId];
    if (attackMotion) {
        if (attackMotion.type === 0) {
            this.requestMotion("thrust");
        } else if (attackMotion.type === 1) {
            this.requestMotion("swing");
        } else if (attackMotion.type === 2) {
            this.requestMotion("missile");
        }
        this.startWeaponAnimation(attackMotion.weaponImageId);
    }
};

/**表现伤害*/
Game_Actor.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    if (this.isSpriteVisible()) {
        this.requestMotion("damage");
    } else {
        $gameScreen.startShake(5, 5, 10);
    }
    SoundManager.playActorDamage();
};

/**表现闪避*/
Game_Actor.prototype.performEvasion = function() {
    Game_Battler.prototype.performEvasion.call(this);
    this.requestMotion("evade");
};

/**表现魔法闪避*/
Game_Actor.prototype.performMagicEvasion = function() {
    Game_Battler.prototype.performMagicEvasion.call(this);
    this.requestMotion("evade");
};

/**表现反击*/
Game_Actor.prototype.performCounter = function() {
    Game_Battler.prototype.performCounter.call(this);
    this.performAttack();
};

/**表现死亡*/
Game_Actor.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    if ($gameParty.inBattle()) {
        SoundManager.playActorCollapse();
    }
};

/**表现胜利*/
Game_Actor.prototype.performVictory = function() {
    this.setActionState("done");
    if (this.canMove()) {
        this.requestMotion("victory");
    }
};

/**表现逃跑*/
Game_Actor.prototype.performEscape = function() {
    if (this.canMove()) {
        this.requestMotion("escape");
    }
};

/**制作动作表*/
Game_Actor.prototype.makeActionList = function() {
    const list = [];
    const attackAction = new Game_Action(this);
    attackAction.setAttack();
    list.push(attackAction);
    for (const skill of this.usableSkills()) {
        const skillAction = new Game_Action(this);
        skillAction.setSkill(skill.id);
        list.push(skillAction);
    }
    return list;
};

/**制作自动战斗动作*/
Game_Actor.prototype.makeAutoBattleActions = function() {
    for (let i = 0; i < this.numActions(); i++) {
        const list = this.makeActionList();
        let maxValue = Number.MIN_VALUE;
        for (const action of list) {
            const value = action.evaluate();
            if (value > maxValue) {
                maxValue = value;
                this.setAction(i, action);
            }
        }
    }
    this.setActionState("waiting");
};

/**制作混乱动作*/
Game_Actor.prototype.makeConfusionActions = function() {
    for (let i = 0; i < this.numActions(); i++) {
        this.action(i).setConfusion();
    }
    this.setActionState("waiting");
};

/**制作动作组*/
Game_Actor.prototype.makeActions = function() {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        this.setActionState("undecided");
    } else {
        this.setActionState("waiting");
    }
    if (this.isAutoBattle()) {
        this.makeAutoBattleActions();
    } else if (this.isConfused()) {
        this.makeConfusionActions();
    }
};

/**当演员走*/
Game_Actor.prototype.onPlayerWalk = function() {
    this.clearResult();
    this.checkFloorEffect();
    if ($gamePlayer.isNormal()) {
        this.turnEndOnMap();
        for (const state of this.states()) {
            this.updateStateSteps(state);
        }
        this.showAddedStates();
        this.showRemovedStates();
    }
};

/**更新状态步骤*/
Game_Actor.prototype.updateStateSteps = function(state) {
    if (state.removeByWalking) {
        if (this._stateSteps[state.id] > 0) {
            if (--this._stateSteps[state.id] === 0) {
                this.removeState(state.id);
            }
        }
    }
};

/**显示增加状态*/
Game_Actor.prototype.showAddedStates = function() {
    for (const state of this.result().addedStateObjects()) {
        if (state.message1) {
            $gameMessage.add(state.message1.format(this._name));
        }
    }
};

/**显示移除状态*/
Game_Actor.prototype.showRemovedStates = function() {
    for (const state of this.result().removedStateObjects()) {
        if (state.message4) {
            $gameMessage.add(state.message4.format(this._name));
        }
    }
};

/**步数为了回合*/
Game_Actor.prototype.stepsForTurn = function() {
    return 20;
};

/**回合结束在地图上*/
Game_Actor.prototype.turnEndOnMap = function() {
    if ($gameParty.steps() % this.stepsForTurn() === 0) {
        this.onTurnEnd();
        if (this.result().hpDamage > 0) {
            this.performMapDamage();
        }
    }
};

/**检查地面效果*/
Game_Actor.prototype.checkFloorEffect = function() {
    if ($gamePlayer.isOnDamageFloor()) {
        this.executeFloorDamage();
    }
};

/**执行地面伤害*/
Game_Actor.prototype.executeFloorDamage = function() {
    const floorDamage = Math.floor(this.basicFloorDamage() * this.fdr);
    const realDamage = Math.min(floorDamage, this.maxFloorDamage());
    this.gainHp(-realDamage);
    if (realDamage > 0) {
        this.performMapDamage();
    }
};

/**基础地面伤害*/
Game_Actor.prototype.basicFloorDamage = function() {
    return 10;
};

/**最大地面伤害*/
Game_Actor.prototype.maxFloorDamage = function() {
    return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
};

/**表现地图伤害*/
Game_Actor.prototype.performMapDamage = function() {
    if (!$gameParty.inBattle()) {
        $gameScreen.startFlashForDamage();
    }
};

/**清除动作*/
Game_Actor.prototype.clearActions = function() {
    Game_Battler.prototype.clearActions.call(this);
    this._actionInputIndex = 0;
};

/**输入动作*/
Game_Actor.prototype.inputtingAction = function() {
    return this.action(this._actionInputIndex);
};

/**选择下一个命令*/
Game_Actor.prototype.selectNextCommand = function() {
    if (this._actionInputIndex < this.numActions() - 1) {
        this._actionInputIndex++;
        return true;
    } else {
        return false;
    }
};

/**选择早先的命令*/
Game_Actor.prototype.selectPreviousCommand = function() {
    if (this._actionInputIndex > 0) {
        this._actionInputIndex--;
        return true;
    } else {
        return false;
    }
};

/**最后技能
 * @mz 新增
*/
Game_Actor.prototype.lastSkill = function() {
    if ($gameParty.inBattle()) {
        return this.lastBattleSkill();
    } else {
        return this.lastMenuSkill();
    }
};

/**最后菜单技能*/
Game_Actor.prototype.lastMenuSkill = function() {
    return this._lastMenuSkill.object();
};

/**
 * 设置最后菜单技能 
 * @param {object} skill 技能数据
 */
Game_Actor.prototype.setLastMenuSkill = function(skill) {
    this._lastMenuSkill.setObject(skill);
};

/**最后战斗技能*/
Game_Actor.prototype.lastBattleSkill = function() {
    return this._lastBattleSkill.object();
};

/**设置最后战斗技能
 * @param {object} skill 技能数据
 * 
*/
Game_Actor.prototype.setLastBattleSkill = function(skill) {
    this._lastBattleSkill.setObject(skill);
};

/**
 * 最后命令符号
 */
Game_Actor.prototype.lastCommandSymbol = function() {
    return this._lastCommandSymbol;
};

/**
 * 设置最后命令符号
 * @param {string} symbol 命令
 */
Game_Actor.prototype.setLastCommandSymbol = function(symbol) {
    this._lastCommandSymbol = symbol;
};

/**
 * 测试逃跑
 * @param {object} item 项目数据
 */
Game_Actor.prototype.testEscape = function(item) {
    return item.effects.some(
        effect => effect && effect.code === Game_Action.EFFECT_SPECIAL
    );
};

/**
 * 符合可用物品条件
 * @param {object} item 项目数据
 */
Game_Actor.prototype.meetsUsableItemConditions = function(item) {
    if ($gameParty.inBattle()) {
        if (!BattleManager.canEscape() && this.testEscape(item)) {
            return false;
        }
    }
    return Game_BattlerBase.prototype.meetsUsableItemConditions.call(
        this,
        item
    );
};

/**
 * 当逃生失败 
 * @mz 新增
 */
Game_Actor.prototype.onEscapeFailure = function() {
    if (BattleManager.isTpb()) {
        this.applyTpbPenalty();
    }
    this.clearActions();
    this.requestMotionRefresh();
};

