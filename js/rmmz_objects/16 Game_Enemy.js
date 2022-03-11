//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.

/**
 * 游戏敌人
 * 
 * 敌人的游戏对象类。
 */
function Game_Enemy() {
    this.initialize(...arguments);
}

Game_Enemy.prototype = Object.create(Game_Battler.prototype);
Game_Enemy.prototype.constructor = Game_Enemy;

/**
 * 初始化
 * @param {number} enemyId 敌人id
 * @param {number} x x坐标
 * @param {number} y y坐标
 */
Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(enemyId, x, y);
};

/**
 * 初始化成员
 */
Game_Enemy.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    /**
     * 敌人id
     */
    this._enemyId = 0;
    /**
     * 标记
     */
    this._letter = "";
    /**
     * 复数
     */
    this._plural = false;
    /**
     * 画面x
     */
    this._screenX = 0;
    /**
     * 画面y
     */
    this._screenY = 0;
};

/**
 * 安装
 * @param {number} enemyId 敌人id
 * @param {number} x x坐标
 * @param {number} y y坐标
 */
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    this._enemyId = enemyId;
    this._screenX = x;
    this._screenY = y;
    this.recoverAll();
};

/**是敌人*/
Game_Enemy.prototype.isEnemy = function() {
    return true;
};

/**朋友小组*/
Game_Enemy.prototype.friendsUnit = function() {
    return $gameTroop;
};

/**对手小组*/
Game_Enemy.prototype.opponentsUnit = function() {
    return $gameParty;
};

/**索引*/
Game_Enemy.prototype.index = function() {
    return $gameTroop.members().indexOf(this);
};

/**是战斗成员*/
Game_Enemy.prototype.isBattleMember = function() {
    return this.index() >= 0;
};

/**敌人id*/
Game_Enemy.prototype.enemyId = function() {
    return this._enemyId;
};

/**
 * 敌人数据
 * 
*/
Game_Enemy.prototype.enemy = function() {
    return $dataEnemies[this._enemyId];
};

/**特征对象组*/
Game_Enemy.prototype.traitObjects = function() {
    return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());
};

/**基础参数*/
Game_Enemy.prototype.paramBase = function(paramId) {
    return this.enemy().params[paramId];
};

/**经验值*/
Game_Enemy.prototype.exp = function() {
    return this.enemy().exp;
};

/**金钱*/
Game_Enemy.prototype.gold = function() {
    return this.enemy().gold;
};

/**制作掉落物品组*/
Game_Enemy.prototype.makeDropItems = function() {
    const rate = this.dropItemRate();
    return this.enemy().dropItems.reduce((r, di) => {
        if (di.kind > 0 && Math.random() * di.denominator < rate) {
            return r.concat(this.itemObject(di.kind, di.dataId));
        } else {
            return r;
        }
    }, []);
};

/**掉落物品比例*/
Game_Enemy.prototype.dropItemRate = function() {
    return $gameParty.hasDropItemDouble() ? 2 : 1;
};

/**
 * 物品对象 
 * @param {number} kind  种类
 * @param {number} dataId 数据id
 */
Game_Enemy.prototype.itemObject = function(kind, dataId) {
    if (kind === 1) {
        return $dataItems[dataId];
    } else if (kind === 2) {
        return $dataWeapons[dataId];
    } else if (kind === 3) {
        return $dataArmors[dataId];
    } else {
        return null;
    }
};

/**是精灵显示*/
Game_Enemy.prototype.isSpriteVisible = function() {
    return true;
};

/**画面x*/
Game_Enemy.prototype.screenX = function() {
    return this._screenX;
};

/**画面y*/
Game_Enemy.prototype.screenY = function() {
    return this._screenY;
};

/**战斗者名称*/
Game_Enemy.prototype.battlerName = function() {
    return this.enemy().battlerName;
};

/**战斗者色相*/
Game_Enemy.prototype.battlerHue = function() {
    return this.enemy().battlerHue;
};

/**原始名称*/
Game_Enemy.prototype.originalName = function() {
    return this.enemy().name;
};

/**名称*/
Game_Enemy.prototype.name = function() {
    return this.originalName() + (this._plural ? this._letter : "");
};

/**是标记空*/
Game_Enemy.prototype.isLetterEmpty = function() {
    return this._letter === "";
};

/**设置标记  
 * @param {string} letter 标记
 */
Game_Enemy.prototype.setLetter = function(letter) {
    this._letter = letter;
};

/**设置复数 
 * @param {boolean} plural 复数
 */
Game_Enemy.prototype.setPlural = function(plural) {
    this._plural = plural;
};

/**表现动作开始
 * @param {Game_Action} action 动作
 * 
*/
Game_Enemy.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
    this.requestEffect("whiten");
};

/**表现动作
 * @param {Game_Action} action 动作
 * 
*/
Game_Enemy.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
};

/**表现动作结束*/
Game_Enemy.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};

/**表现伤害*/
Game_Enemy.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    SoundManager.playEnemyDamage();
    this.requestEffect("blink");
};

/**表现死亡*/
Game_Enemy.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    switch (this.collapseType()) {
        case 0:
            this.requestEffect("collapse");
            SoundManager.playEnemyCollapse();
            break;
        case 1:
            this.requestEffect("bossCollapse");
            SoundManager.playBossCollapse1();
            break;
        case 2:
            this.requestEffect("instantCollapse");
            break;
    }
};

/**
 * 转换 
 * @param {number} enemyId 敌人id
 */
Game_Enemy.prototype.transform = function(enemyId) {
    const name = this.originalName();
    this._enemyId = enemyId;
    if (this.originalName() !== name) {
        this._letter = "";
        this._plural = false;
    }
    this.refresh();
    if (this.numActions() > 0) {
        this.makeActions();
    }
};

/**满足条件
 * @param {Game_Action} action 动作
 * 
*/
Game_Enemy.prototype.meetsCondition = function(action) {
    const param1 = action.conditionParam1;
    const param2 = action.conditionParam2;
    switch (action.conditionType) {
        case 1:
            return this.meetsTurnCondition(param1, param2);
        case 2:
            return this.meetsHpCondition(param1, param2);
        case 3:
            return this.meetsMpCondition(param1, param2);
        case 4:
            return this.meetsStateCondition(param1);
        case 5:
            return this.meetsPartyLevelCondition(param1);
        case 6:
            return this.meetsSwitchCondition(param1);
        default:
            return true;
    }
};

/**满足回合条件
 * @param {number} param1 参数
 * @param {number} param2 参数
 */
Game_Enemy.prototype.meetsTurnCondition = function(param1, param2) {
    const n = this.turnCount();
    if (param2 === 0) {
        return n === param1;
    } else {
        return n > 0 && n >= param1 && n % param2 === param1 % param2;
    }
};

/**满足hp条件
 * @param {number} param1 参数
 * @param {number} param2 参数
 */
Game_Enemy.prototype.meetsHpCondition = function(param1, param2) {
    return this.hpRate() >= param1 && this.hpRate() <= param2;
};

/**满足mp条件 
 * @param {number} param1 参数
 * @param {number} param2 参数
 */
Game_Enemy.prototype.meetsMpCondition = function(param1, param2) {
    return this.mpRate() >= param1 && this.mpRate() <= param2;
};

/**满足状态条件 
 * @param {number} param 参数
 */
Game_Enemy.prototype.meetsStateCondition = function(param) {
    return this.isStateAffected(param);
};

/**满足队伍等级条件 
 * @param {number} param 参数
 */
Game_Enemy.prototype.meetsPartyLevelCondition = function(param) {
    return $gameParty.highestLevel() >= param;
};

/**满足开关条件 
 * @param {number} param 参数
 */
Game_Enemy.prototype.meetsSwitchCondition = function(param) {
    return $gameSwitches.value(param);
};

/**是有效动作 
 * @param {Game_Action} action 动作
 */
Game_Enemy.prototype.isActionValid = function(action) {
    return (
        this.meetsCondition(action) && this.canUse($dataSkills[action.skillId])
    );
};

/**选择动作
 * @param {object[]} actionList 动作列表
 * @param {number} ratingZero 比例0
 */
Game_Enemy.prototype.selectAction = function(actionList, ratingZero) {
    const sum = actionList.reduce((r, a) => r + a.rating - ratingZero, 0);
    if (sum > 0) {
        let value = Math.randomInt(sum);
        for (const action of actionList) {
            value -= action.rating - ratingZero;
            if (value < 0) {
                return action;
            }
        }
    } else {
        return null;
    }
};

/**选择所有动作组
 * @param {object[]} actionList 动作列表
 */
Game_Enemy.prototype.selectAllActions = function(actionList) {
    const ratingMax = Math.max(...actionList.map(a => a.rating));
    const ratingZero = ratingMax - 3;
    actionList = actionList.filter(a => a.rating > ratingZero);
    for (let i = 0; i < this.numActions(); i++) {
        this.action(i).setEnemyAction(
            this.selectAction(actionList, ratingZero)
        );
    }
};

/**制作动作组*/
Game_Enemy.prototype.makeActions = function() {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        const actionList = this.enemy().actions.filter(a =>
            this.isActionValid(a)
        );
        if (actionList.length > 0) {
            this.selectAllActions(actionList);
        }
    }
    this.setActionState("waiting");
};

