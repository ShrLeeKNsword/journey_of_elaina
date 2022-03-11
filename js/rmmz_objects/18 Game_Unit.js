//-----------------------------------------------------------------------------
// Game_Unit
//
// The superclass of Game_Party and Game_Troop.

/**
 * 游戏小组
 * 
 * 游戏队伍和游戏敌群的超类。
 */
function Game_Unit() {
    this.initialize(...arguments);
}

/**初始化*/
Game_Unit.prototype.initialize = function() {
    /**
     * 在战斗
     */
    this._inBattle = false;
};

/**
 * 在战斗
 */
Game_Unit.prototype.inBattle = function() {
    return this._inBattle;
};

/**
 * 成员组
 */
Game_Unit.prototype.members = function() {
    return [];
};

/**
 * 活的成员组
 */
Game_Unit.prototype.aliveMembers = function() {
    return this.members().filter(member => member.isAlive());
};

/**死的成员组*/
Game_Unit.prototype.deadMembers = function() {
    return this.members().filter(member => member.isDead());
};

/**可动成员组*/
Game_Unit.prototype.movableMembers = function() {
    return this.members().filter(member => member.canMove());
};

/**清除动作组*/
Game_Unit.prototype.clearActions = function() {
    for (const member of this.members()) {
        member.clearActions();
    }
};

/**敏捷*/
Game_Unit.prototype.agility = function() {
    const members = this.members();
    const sum = members.reduce((r, member) => r + member.agi, 0);
    return Math.max(1, sum / Math.max(1, members.length));
};

/**目标比例和*/
Game_Unit.prototype.tgrSum = function() {
    return this.aliveMembers().reduce((r, member) => r + member.tgr, 0);
};

/**随机目标*/
Game_Unit.prototype.randomTarget = function() {
    let tgrRand = Math.random() * this.tgrSum();
    let target = null;
    for (const member of this.aliveMembers()) {
        tgrRand -= member.tgr;
        if (tgrRand <= 0 && !target) {
            target = member;
        }
    }
    return target;
};

/**随机死亡目标*/
Game_Unit.prototype.randomDeadTarget = function() {
    const members = this.deadMembers();
    return members.length ? members[Math.randomInt(members.length)] : null;
};

/**流畅目标*/
Game_Unit.prototype.smoothTarget = function(index) {
    const member = this.members()[Math.max(0, index)];
    return member && member.isAlive() ? member : this.aliveMembers()[0];
};

/**流畅死亡目标*/
Game_Unit.prototype.smoothDeadTarget = function(index) {
    const member = this.members()[Math.max(0, index)];
    return member && member.isDead() ? member : this.deadMembers()[0];
};

/**清除结果*/
Game_Unit.prototype.clearResults = function() {
    for (const member of this.members()) {
        member.clearResult();
    }
};

/**当战斗开始*/
Game_Unit.prototype.onBattleStart = function(advantageous) {
    for (const member of this.members()) {
        member.onBattleStart(advantageous);
    }
    this._inBattle = true;
};

/**当战斗结束*/
Game_Unit.prototype.onBattleEnd = function() {
    this._inBattle = false;
    for (const member of this.members()) {
        member.onBattleEnd();
    }
};

/**制作动作*/
Game_Unit.prototype.makeActions = function() {
    for (const member of this.members()) {
        member.makeActions();
    }
};

/**选择
 * @param {Game_Battler} activeMember 活跃成员
 */
Game_Unit.prototype.select = function(activeMember) {
    for (const member of this.members()) {
        if (member === activeMember) {
            member.select();
        } else {
            member.deselect();
        }
    }
};

/**是全部死了*/
Game_Unit.prototype.isAllDead = function() {
    return this.aliveMembers().length === 0;
};

/**替代战斗者*/
Game_Unit.prototype.substituteBattler = function() {
    for (const member of this.members()) {
        if (member.isSubstitute()) {
            return member;
        }
    }
    return null;
};

/**
 * tpb基本速度
 * @mz 新增
 */
Game_Unit.prototype.tpbBaseSpeed = function() {
    const members = this.members();
    return Math.max(...members.map(member => member.tpbBaseSpeed()));
};

/**
 * tpb参考时间
 * @mz 新增
 */
Game_Unit.prototype.tpbReferenceTime = function() {
    return BattleManager.isActiveTpb() ? 240 : 60;
};

/**
 * 更新tpb
 * @mz 新增
 */
Game_Unit.prototype.updateTpb = function() {
    for (const member of this.members()) {
        member.updateTpb();
    }
};

