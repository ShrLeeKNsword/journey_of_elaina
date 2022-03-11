//-----------------------------------------------------------------------------
// Game_Troop
//
// The game object class for a troop and the battle-related data.

/**
 * 游戏敌群
 * $gameTroop
 * 敌群的游戏对象类和与战斗有关的数据。
 */
function Game_Troop() {
    this.initialize(...arguments);
}

Game_Troop.prototype = Object.create(Game_Unit.prototype);
Game_Troop.prototype.constructor = Game_Troop;

// prettier-ignore
/**半字母表*/
Game_Troop.LETTER_TABLE_HALF = [
    " A"," B"," C"," D"," E"," F"," G"," H"," I"," J"," K"," L"," M",
    " N"," O"," P"," Q"," R"," S"," T"," U"," V"," W"," X"," Y"," Z"
];
// prettier-ignore
/**全字母表 */
Game_Troop.LETTER_TABLE_FULL = [
    "Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ",
    "Ｎ","Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ"
];

/**初始化*/
Game_Troop.prototype.initialize = function() {
    Game_Unit.prototype.initialize.call(this);
    this._interpreter = new Game_Interpreter();
    this.clear();
};

/**是事件运转*/
Game_Troop.prototype.isEventRunning = function() {
    return this._interpreter.isRunning();
};

/**更新事件解释器*/
Game_Troop.prototype.updateInterpreter = function() {
    this._interpreter.update();
};

/**回合计数*/
Game_Troop.prototype.turnCount = function() {
    return this._turnCount;
};

/**成员组*/
Game_Troop.prototype.members = function() {
    return this._enemies;
};

/**清除*/
Game_Troop.prototype.clear = function() {
    /**
     * 事件解释器
     */
    this._interpreter.clear();
    /**
     * 敌群id
     */
    this._troopId = 0;
    /**
     * 事件标志组
     */
    this._eventFlags = {};
    /**
     * 敌人组
     */
    this._enemies = [];
    /**
     * 回合计数
     */
    this._turnCount = 0;
    /**
     * 名称计数
     */
    this._namesCount = {};
};

/**
 * 敌群数据
 */
Game_Troop.prototype.troop = function() {
    return $dataTroops[this._troopId];
};

/**
 * 安装
 * @param {number} troopId 敌群id
 * @description 清除内容,设置敌群id,然后根据敌群数据安装每一个敌人,然后制作唯一名称
 */
Game_Troop.prototype.setup = function(troopId) {
    this.clear();
    this._troopId = troopId;
    this._enemies = [];
    for (const member of this.troop().members) {
        if ($dataEnemies[member.enemyId]) {
            const enemyId = member.enemyId;
            const x = member.x;
            const y = member.y;
            const enemy = new Game_Enemy(enemyId, x, y);
            if (member.hidden) {
                enemy.hide();
            }
            this._enemies.push(enemy);
        }
    }
    this.makeUniqueNames();
};

/**制作唯一名称*/
Game_Troop.prototype.makeUniqueNames = function() {
    const table = this.letterTable();
    for (const enemy of this.members()) {
        if (enemy.isAlive() && enemy.isLetterEmpty()) {
            const name = enemy.originalName();
            const n = this._namesCount[name] || 0;
            enemy.setLetter(table[n % table.length]);
            this._namesCount[name] = n + 1;
        }
    }
    this.updatePluralFlags();
};

/**
 * 更新复数标志
 * @mz 新增
 * 
*/
Game_Troop.prototype.updatePluralFlags = function() {
    for (const enemy of this.members()) {
        const name = enemy.originalName();
        if (this._namesCount[name] >= 2) {
            enemy.setPlural(true);
        }
    }
};

/**字母表*/
Game_Troop.prototype.letterTable = function() {
    return $gameSystem.isCJK()
        ? Game_Troop.LETTER_TABLE_FULL
        : Game_Troop.LETTER_TABLE_HALF;
};

/**敌人名称组*/
Game_Troop.prototype.enemyNames = function() {
    const names = [];
    for (const enemy of this.members()) {
        const name = enemy.originalName();
        if (enemy.isAlive() && !names.includes(name)) {
            names.push(name);
        }
    }
    return names;
};

/**满足条件
 * 
 * @param {*} page 事件页
 */
Game_Troop.prototype.meetsConditions = function(page) {
    const c = page.conditions;
    if (
        !c.turnEnding &&
        !c.turnValid &&
        !c.enemyValid &&
        !c.actorValid &&
        !c.switchValid
    ) {
        return false; // Conditions not set
    }
    if (c.turnEnding) {
        if (!BattleManager.isTurnEnd()) {
            return false;
        }
    }
    if (c.turnValid) {
        const n = this._turnCount;
        const a = c.turnA;
        const b = c.turnB;
        if (b === 0 && n !== a) {
            return false;
        }
        if (b > 0 && (n < 1 || n < a || n % b !== a % b)) {
            return false;
        }
    }
    if (c.enemyValid) {
        const enemy = $gameTroop.members()[c.enemyIndex];
        if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
            return false;
        }
    }
    if (c.actorValid) {
        const actor = $gameActors.actor(c.actorId);
        if (!actor || actor.hpRate() * 100 > c.actorHp) {
            return false;
        }
    }
    if (c.switchValid) {
        if (!$gameSwitches.value(c.switchId)) {
            return false;
        }
    }
    return true;
};

/**安装战斗事件*/
Game_Troop.prototype.setupBattleEvent = function() {
    if (!this._interpreter.isRunning()) {
        if (this._interpreter.setupReservedCommonEvent()) {
            return;
        }
        const pages = this.troop().pages;
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            if (this.meetsConditions(page) && !this._eventFlags[i]) {
                this._interpreter.setup(page.list);
                if (page.span <= 1) {
                    this._eventFlags[i] = true;
                }
                break;
            }
        }
    }
};

/**增加回合*/
Game_Troop.prototype.increaseTurn = function() {
    const pages = this.troop().pages;
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (page.span === 1) {
            this._eventFlags[i] = false;
        }
    }
    this._turnCount++;
};

/**经验值总数*/
Game_Troop.prototype.expTotal = function() {
    return this.deadMembers().reduce((r, enemy) => r + enemy.exp(), 0);
};

/**金钱总数*/
Game_Troop.prototype.goldTotal = function() {
    const members = this.deadMembers();
    return members.reduce((r, enemy) => r + enemy.gold(), 0) * this.goldRate();
};

/**金钱比例*/
Game_Troop.prototype.goldRate = function() {
    return $gameParty.hasGoldDouble() ? 2 : 1;
};

/**制作掉落物品组*/
Game_Troop.prototype.makeDropItems = function() {
    const members = this.deadMembers();
    return members.reduce((r, enemy) => r.concat(enemy.makeDropItems()), []);
};

/**
 * 是Tpb回合结束
 * @mz 新增
 */
Game_Troop.prototype.isTpbTurnEnd = function() {
    const members = this.members();
    const turnMax = Math.max(...members.map(member => member.turnCount()));
    return turnMax > this._turnCount;
};

