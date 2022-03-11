﻿//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

/**
 * 游戏队伍
 * $gameParty 
 * 
 * 队伍的游戏对象类。包括诸如金钱和物品的信息。
 */
function Game_Party() {
    this.initialize(...arguments);
}

Game_Party.prototype = Object.create(Game_Unit.prototype);
Game_Party.prototype.constructor = Game_Party;

/**游戏队伍 能力遭遇减半*/
Game_Party.ABILITY_ENCOUNTER_HALF = 0;
/**游戏队伍 能力遭遇无效*/
Game_Party.ABILITY_ENCOUNTER_NONE = 1;
/**游戏队伍 能力突然袭击 */
Game_Party.ABILITY_CANCEL_SURPRISE = 2;
/**游戏队伍 能力先发制人*/
Game_Party.ABILITY_RAISE_PREEMPTIVE = 3;
/**游戏队伍 能力金钱双倍*/
Game_Party.ABILITY_GOLD_DOUBLE = 4;
/**游戏队伍 能力物品掉落双倍*/
Game_Party.ABILITY_DROP_ITEM_DOUBLE = 5;

/**初始化*/
Game_Party.prototype.initialize = function() {
    Game_Unit.prototype.initialize.call(this);
    this._gold = 0;
    this._steps = 0;
    this._lastItem = new Game_Item();
    this._menuActorId = 0;
    this._targetActorId = 0;
    this._actors = [];
    this.initAllItems();
};

/**初始化所有物品*/
Game_Party.prototype.initAllItems = function() {
    this._items = {};
    this._weapons = {};
    this._armors = {};
};

/**存在*/
Game_Party.prototype.exists = function() {
    return this._actors.length > 0;
};

/**成员数量*/
Game_Party.prototype.size = function() {
    return this.members().length;
};

/**是空的*/
Game_Party.prototype.isEmpty = function() {
    return this.size() === 0;
};

/**成员组*/
Game_Party.prototype.members = function() {
    return this.inBattle() ? this.battleMembers() : this.allMembers();
};

/**所有成员组*/
Game_Party.prototype.allMembers = function() {
    return this._actors.map(id => $gameActors.actor(id));
};

/**战斗成员组*/
Game_Party.prototype.battleMembers = function() {
    return this.allMembers()
        .slice(0, this.maxBattleMembers())
        .filter(actor => actor.isAppeared());
};

/**最大战斗成员数*/
Game_Party.prototype.maxBattleMembers = function() {
    return 4;
};

/**领导者*/
Game_Party.prototype.leader = function() {
    return this.battleMembers()[0];
};

/**删除无效成员
 * @mz 新增
*/
Game_Party.prototype.removeInvalidMembers = function() {
    for (const actorId of this._actors) {
        if (!$dataActors[actorId]) {
            this._actors.remove(actorId);
        }
    }
};

/**复活战斗成员组*/
Game_Party.prototype.reviveBattleMembers = function() {
    for (const actor of this.battleMembers()) {
        if (actor.isDead()) {
            actor.setHp(1);
        }
    }
};

/**物品组*/
Game_Party.prototype.items = function() {
    return Object.keys(this._items).map(id => $dataItems[id]);
};

/**武器组*/
Game_Party.prototype.weapons = function() {
    return Object.keys(this._weapons).map(id => $dataWeapons[id]);
};

/**防具组*/
Game_Party.prototype.armors = function() {
    return Object.keys(this._armors).map(id => $dataArmors[id]);
};

/**装备物品组*/
Game_Party.prototype.equipItems = function() {
    return this.weapons().concat(this.armors());
};

/**所有物品组*/
Game_Party.prototype.allItems = function() {
    return this.items().concat(this.equipItems());
};

/**物品容器*/
Game_Party.prototype.itemContainer = function(item) {
    if (!item) {
        return null;
    } else if (DataManager.isItem(item)) {
        return this._items;
    } else if (DataManager.isWeapon(item)) {
        return this._weapons;
    } else if (DataManager.isArmor(item)) {
        return this._armors;
    } else {
        return null;
    }
};

/**安装开始成员*/
Game_Party.prototype.setupStartingMembers = function() {
    this._actors = [];
    for (const actorId of $dataSystem.partyMembers) {
        if ($gameActors.actor(actorId)) {
            this._actors.push(actorId);
        }
    }
};

/**名称*/
Game_Party.prototype.name = function() {
    const numBattleMembers = this.battleMembers().length;
    if (numBattleMembers === 0) {
        return "";
    } else if (numBattleMembers === 1) {
        return this.leader().name();
    } else {
        return TextManager.partyName.format(this.leader().name());
    }
};

/**安装战斗测试*/
Game_Party.prototype.setupBattleTest = function() {
    this.setupBattleTestMembers();
    this.setupBattleTestItems();
};

/**安装战斗测试成员*/
Game_Party.prototype.setupBattleTestMembers = function() {
    for (const battler of $dataSystem.testBattlers) {
        const actor = $gameActors.actor(battler.actorId);
        if (actor) {
            actor.changeLevel(battler.level, false);
            actor.initEquips(battler.equips);
            actor.recoverAll();
            this.addActor(battler.actorId);
        }
    }
};

/**安装战斗测试物品*/
Game_Party.prototype.setupBattleTestItems = function() {
    for (const item of $dataItems) {
        if (item && item.name.length > 0) {
            this.gainItem(item, this.maxItems(item));
        }
    }
};

/**最高等级*/
Game_Party.prototype.highestLevel = function() {
    return Math.max(...this.members().map(actor => actor.level));
};

/**增加角色*/
Game_Party.prototype.addActor = function(actorId) {
    if (!this._actors.includes(actorId)) {
        this._actors.push(actorId);
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
        $gameTemp.requestBattleRefresh();
        if (this.inBattle()) {
            const actor = $gameActors.actor(actorId);
            if (this.battleMembers().includes(actor)) {
                actor.onBattleStart();
            }
        }
    }
};

/**移除角色*/
Game_Party.prototype.removeActor = function(actorId) {
    if (this._actors.includes(actorId)) {
        const actor = $gameActors.actor(actorId);
        const wasBattleMember = this.battleMembers().includes(actor);
        this._actors.remove(actorId);
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
        $gameTemp.requestBattleRefresh();
        if (this.inBattle() && wasBattleMember) {
            actor.onBattleEnd();
        }
    }
};

/**金钱*/
Game_Party.prototype.gold = function() {
    return this._gold;
};

/**获得金钱
 * @param {number} amount 量
 */
Game_Party.prototype.gainGold = function(amount) {
    this._gold = (this._gold + amount).clamp(0, this.maxGold());
};

/** 
 * 失去金钱
 * @param {number} amount 量
 */
Game_Party.prototype.loseGold = function(amount) {
    this.gainGold(-amount);
};

/**最大金钱*/
Game_Party.prototype.maxGold = function() {
    return 99999999;
};

/**步数*/
Game_Party.prototype.steps = function() {
    return this._steps;
};

/**增加步数*/
Game_Party.prototype.increaseSteps = function() {
    this._steps++;
};

/**物品数量*/
Game_Party.prototype.numItems = function(item) {
    const container = this.itemContainer(item);
    return container ? container[item.id] || 0 : 0;
};

/**最大物品数*/
Game_Party.prototype.maxItems = function(/*item*/) {
    return 99;
};

/**有最大物品数*/
Game_Party.prototype.hasMaxItems = function(item) {
    return this.numItems(item) >= this.maxItems(item);
};

/**有项目
 * @param {object} item 项目 
 * @param {boolean} includeEquip 包括装备
 */
Game_Party.prototype.hasItem = function(item, includeEquip) {
    if (this.numItems(item) > 0) {
        return true;
    } else if (includeEquip && this.isAnyMemberEquipped(item)) {
        return true;
    } else {
        return false;
    }
};

/**是任何成员装备 
 * @param {object} item 项目
 */
Game_Party.prototype.isAnyMemberEquipped = function(item) {
    return this.members().some(actor => actor.equips().includes(item));
};

/**
 * 获得物品
 * @param {object} item 项目 
 * @param {number} amount 量
 * @param {boolean} includeEquip 包括装备
 */
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    const container = this.itemContainer(item);
    if (container) {
        const lastNumber = this.numItems(item);
        const newNumber = lastNumber + amount;
        container[item.id] = newNumber.clamp(0, this.maxItems(item));
        if (container[item.id] === 0) {
            delete container[item.id];
        }
        if (includeEquip && newNumber < 0) {
            this.discardMembersEquip(item, -newNumber);
        }
        $gameMap.requestRefresh();
    }
};

/**抛弃成员装备*/
Game_Party.prototype.discardMembersEquip = function(item, amount) {
    let n = amount;
    for (const actor of this.members()) {
        while (n > 0 && actor.isEquipped(item)) {
            actor.discardEquip(item);
            n--;
        }
    }
};

/**失去物品*/
Game_Party.prototype.loseItem = function(item, amount, includeEquip) {
    this.gainItem(item, -amount, includeEquip);
};

/**消耗物品*/
Game_Party.prototype.consumeItem = function(item) {
    if (DataManager.isItem(item) && item.consumable) {
        this.loseItem(item, 1);
    }
};

/**能使用*/
Game_Party.prototype.canUse = function(item) {
    return this.members().some(actor => actor.canUse(item));
};

/**能输入*/
Game_Party.prototype.canInput = function() {
    return this.members().some(actor => actor.canInput());
};

/**是全部死了*/
Game_Party.prototype.isAllDead = function() {
    if (Game_Unit.prototype.isAllDead.call(this)) {
        return this.inBattle() || !this.isEmpty();
    } else {
        return false;
    }
};

/**当游戏者走*/
Game_Party.prototype.onPlayerWalk = function() {
    for (const actor of this.members()) {
        actor.onPlayerWalk();
    }
};

/**菜单角色*/
Game_Party.prototype.menuActor = function() {
    let actor = $gameActors.actor(this._menuActorId);
    if (!this.members().includes(actor)) {
        actor = this.members()[0];
    }
    return actor;
};

/**设置菜单角色 
 * @param {*} actor 
 */
Game_Party.prototype.setMenuActor = function(actor) {
    this._menuActorId = actor.actorId();
};

/**制作菜单角色下一个*/
Game_Party.prototype.makeMenuActorNext = function() {
    let index = this.members().indexOf(this.menuActor());
    if (index >= 0) {
        index = (index + 1) % this.members().length;
        this.setMenuActor(this.members()[index]);
    } else {
        this.setMenuActor(this.members()[0]);
    }
};

/**制作菜单角色之前的*/
Game_Party.prototype.makeMenuActorPrevious = function() {
    let index = this.members().indexOf(this.menuActor());
    if (index >= 0) {
        index = (index + this.members().length - 1) % this.members().length;
        this.setMenuActor(this.members()[index]);
    } else {
        this.setMenuActor(this.members()[0]);
    }
};

/**目标角色*/
Game_Party.prototype.targetActor = function() {
    let actor = $gameActors.actor(this._targetActorId);
    if (!this.members().includes(actor)) {
        actor = this.members()[0];
    }
    return actor;
};

/**设置目标角色
 * 
 * @param {Game_Actor} actor 角色
 */
Game_Party.prototype.setTargetActor = function(actor) {
    this._targetActorId = actor.actorId();
};

/**最后项目*/
Game_Party.prototype.lastItem = function() {
    return this._lastItem.object();
};

/**设置最后项目 
 * @param {object} item 项目数据
 */
Game_Party.prototype.setLastItem = function(item) {
    this._lastItem.setObject(item);
};

/**交换命令*/
Game_Party.prototype.swapOrder = function(index1, index2) {
    const temp = this._actors[index1];
    this._actors[index1] = this._actors[index2];
    this._actors[index2] = temp;
    $gamePlayer.refresh();
};

/**行走图为了保存文件*/
Game_Party.prototype.charactersForSavefile = function() {
    return this.battleMembers().map(actor => [
        actor.characterName(),
        actor.characterIndex()
    ]);
};

/**脸图为了保存文件*/
Game_Party.prototype.facesForSavefile = function() {
    return this.battleMembers().map(actor => [
        actor.faceName(),
        actor.faceIndex()
    ]);
};

/**队伍能力*/
Game_Party.prototype.partyAbility = function(abilityId) {
    return this.battleMembers().some(actor => actor.partyAbility(abilityId));
};

/**有遭遇减半*/
Game_Party.prototype.hasEncounterHalf = function() {
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
};

/**有禁止遭遇*/
Game_Party.prototype.hasEncounterNone = function() {
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
};

/**有取消突袭*/
Game_Party.prototype.hasCancelSurprise = function() {
    return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
};

/**有提升先发制人*/
Game_Party.prototype.hasRaisePreemptive = function() {
    return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
};

/**有金钱双倍*/
Game_Party.prototype.hasGoldDouble = function() {
    return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
};

/**有掉落物品双倍*/
Game_Party.prototype.hasDropItemDouble = function() {
    return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
};

/**先发制人比例*/
Game_Party.prototype.ratePreemptive = function(troopAgi) {
    let rate = this.agility() >= troopAgi ? 0.05 : 0.03;
    if (this.hasRaisePreemptive()) {
        rate *= 4;
    }
    return rate;
};

/**突袭几率*/
Game_Party.prototype.rateSurprise = function(troopAgi) {
    let rate = this.agility() >= troopAgi ? 0.03 : 0.05;
    if (this.hasCancelSurprise()) {
        rate = 0;
    }
    return rate;
};

/**表现胜利*/
Game_Party.prototype.performVictory = function() {
    for (const actor of this.members()) {
        actor.performVictory();
    }
};

/**表现逃跑*/
Game_Party.prototype.performEscape = function() {
    for (const actor of this.members()) {
        actor.performEscape();
    }
};

/**移除战斗状态*/
Game_Party.prototype.removeBattleStates = function() {
    for (const actor of this.members()) {
        actor.removeBattleStates();
    }
};

/**请求动作刷新*/
Game_Party.prototype.requestMotionRefresh = function() {
    for (const actor of this.members()) {
        actor.requestMotionRefresh();
    }
};

/**
 * 当逃跑失败
 * @mz 新增
*/
Game_Party.prototype.onEscapeFailure = function() {
    for (const actor of this.members()) {
        actor.onEscapeFailure();
    }
};

