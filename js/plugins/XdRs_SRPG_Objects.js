//=================================================================================================
// XS_Objects.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc [XS.SRPG] 游戏对象。
* @author 芯☆淡茹水
* @help
*
*
*/
//=================================================================================================
;var XdRsData = XdRsData || {};
XdRsData.SRPG = XdRsData.SRPG || {};
//=================================================================================================
// 战斗信息控制 + AI控制
//=================================================================================================
function Xs_Control() {
    this.initialize.apply(this, arguments);
}
Xs_Control.prototype.initialize = function() {
    this._eventId = 0;
};
Xs_Control.prototype.setup = function(eventId) {
    if (this._eventId !== eventId) {
        this._eventId = eventId;
        this._data = [];
        for (var i=0;i<this.event().list.length;++i) {
            if (this.event().list[i].code === 108) this._data.push(i);
        }
    }
    this._eventsData = {};
    var note = this.note(2);
    if (note.match(/<FE:(\d+)>/)) this._eventsData.FE = +RegExp.$1;
    if (note.match(/<AE:(\d+)>/)) this._eventsData.AE = +RegExp.$1;
    if (note.match(/<TE:(\d+)>/)) this._eventsData.TE = +RegExp.$1;
    if (note.match(/<BE:(\d+)>/)) this._eventsData.BE = +RegExp.$1;
    if (note.match(/<CE:(\d+)>/)) this._eventsData.CE = +RegExp.$1;
};
Xs_Control.prototype.id = function() {
    return this._eventId;
};
Xs_Control.prototype.event = function() {
    return $dataCommonEvents[this._eventId];
};
Xs_Control.prototype.note = function(index) {
    if (!this.event()) return '';
    index = this._data[index];
    if (!this.event().list[index]) return '';
    if (this.event().list[index].code !== 108) return '';
    var note = this.event().list[index].parameters[0];
    for (var i=1;i<this.event().list.length;++i) {
        var list = this.event().list[index+i];
        if (!list || list.code === 108) break;
        if (list.code === 408) note += '\\n' + list.parameters[0];
    }
    return note;
};
Xs_Control.prototype.gameName = function() {
    return this.event() ? this.event().name : '初始';
};
Xs_Control.prototype.gameAim = function() {
    return this.note(0);
};
Xs_Control.prototype.campName = function(camp) {
    var arr = ['我方','敌方'];
    var note = this.note(1);
    if (!!note) arr = note.split(',');
    return arr[camp] || '';
};
Xs_Control.prototype.runEvent = function(sym) {
    var id = this._eventsData[sym] || 0;
    $gameTemp.reserveCommonEvent(id);
    return id > 0;
};
Xs_Control.prototype.onVictory = function() {
    $gameTemp.reserveCommonEvent(this.id());
};
Xs_Control.prototype.onDestruction = function() {
    this.runEvent('FE') || SceneManager.goto(Scene_Gameover);
};
Xs_Control.prototype.wait = function() {
    this._waitCount = 40;
};
Xs_Control.prototype.isActive = function() {
    if (this._waitCount) return false;
    if (Xs_Manager.controlLimit() || Xs_Manager._phase !== 'round') return false;
    return true;
};
Xs_Control.prototype.selectSubject = function() {
    this._subject = null;
    var result = Xs_Manager.selectNextUnit();
    while (result < 2 && !Xs_Manager.isPlayerRound()) {
        result === 0 && Xs_Manager.selectNextCamp();
        result === 1 && Xs_Manager.pushIndex();
        result = Xs_Manager.selectNextUnit();
    }
    if (!Xs_Manager.isPlayerRound()) {
        this._subject = Xs_Manager.currentUnit();
    }
    if (this._subject) {
        Xs_Manager.selectTarget(this._subject);
        this._actionStep = 1;
    }
    this._moveTarget = null;
    this._target = null;
    this._usedSkil = null;
    this.wait();
};
Xs_Control.prototype.transitionToNextUnit = function() {
    if (this._subject) {
        this._subject.setXsStandby(true);
        this._subject = null;
        this._actionStep = 0;
        this.wait();
    }
};
Xs_Control.prototype.checkUpSubject = function() {
    this._actionStep = 0;
    if (this._subject) {
        this._subject.deductionXsAction();
        if (!this._subject.canXsAct()) {
            this._subject = null;
            this.wait();
        } else this._actionStep = 1;
    }
};
Xs_Control.prototype.tryToAttack = function() {
    if (!this._subject) return false;
    var arr = this._subject.getXsRangeTargets();
    if (!arr.length) return false;
    arr = arr.sort(function(a, b){return a.hp - b.hp;});
    this._target = arr[0];
    return true;
};
Xs_Control.prototype.tryToMovedAttack = function() {
    if (!this._subject) return false;
    var target = this._subject.xsNearestRival();
    if (!target) return false;
    var point = Xs_Manager.getPointByTarget(this._subject, target);
    if (!point) return false;
    var arr = this._subject.getXsRangeTargets(point.x, point.y);
    return !!arr.length;
};
Xs_Control.prototype.update = function() {
    this.updateWait();
    this.updateAction();
};
Xs_Control.prototype.updateWait = function() {
    if (this._waitCount) this._waitCount--;
};
Xs_Control.prototype.updateAction = function() {
    if (!this.isActive()) return;
    if (!this._subject) return this.selectSubject();
    if (this._subject && this._actionStep) {
        if (this['updateStep'+this._actionStep]) {
            this['updateStep'+this._actionStep]();
        }
    }
};
Xs_Control.prototype.updateWait = function() {
    if (this._waitCount) this._waitCount--;
};
Xs_Control.prototype.updateStep1 = function() {
    if (this._subject.xsTargetPoint()) this._actionStep = 2;
    else if (this._subject.aiType() === 3) return this.transitionToNextUnit();
    else if (this._subject.aiType() === 2) {
        if (this.tryToAttack()) this._actionStep = 6;
        else this.transitionToNextUnit();
    }
    else if (this._subject.aiType() === 1) {
        if (this.tryToAttack()) this._actionStep = 6;
        else if (this.tryToMovedAttack()) this._actionStep = 2;
        else this.transitionToNextUnit();
    } else this._actionStep = this.tryToAttack() ? 6 : 2;
};
Xs_Control.prototype.updateStep2 = function() {
    if (this._subject.xsTargetPoint()) this._moveTarget = this._subject.xsTargetPoint();
    else this._moveTarget = this._subject.xsNearestRival();
    if (!this._moveTarget) return this.transitionToNextUnit();
    Xs_Manager.displayMove(this._subject);
    this._actionStep = 3;
    this.wait();
};
Xs_Control.prototype.updateStep3 = function() {
    var tp = this._moveTarget;
    if (this._moveTarget.constructor === Game_Character) {
        tp = new Point(this._moveTarget.x, this._moveTarget.y);
    }
    var point = Xs_Manager.getNearestPointBy(tp);
    Xs_Manager.selectPoint(point, true, 'scroll');
    this._actionStep = 4;
    this.wait();
};
Xs_Control.prototype.updateStep4 = function() {
    Xs_Manager._spriteset._xsMoveGrid.hide();
    this._subject.setXsMovePoint(Xs_Manager.cursorCoordinate());
    this._actionStep = 5;
    this.wait();
};
Xs_Control.prototype.updateStep5 = function() {
    if (!this.tryToAttack()) this.checkUpSubject();
    else this._actionStep = 6;
};
Xs_Control.prototype.updateStep6 = function() {
    var skills = this._subject.xsBattler().xsAttackSkills().filter(function(skill){
        return this._subject.xsCanUse(skill, this._target);
    }, this);
    this._usedSkill = skills[Math.randomInt(skills.length)];
    if (!this._usedSkill) {
        this.checkUpSubject();
    }else {
        Xs_Manager.displayAttack(this._subject, this._usedSkill);
        this._actionStep = 7;
        this.wait();
    }
};
Xs_Control.prototype.updateStep7 = function() {
    Xs_Manager.selectTarget(this._target);
    this._actionStep = 8;
    this.wait();
};
Xs_Control.prototype.updateStep8 = function() {
    this._subject.turnTowardCharacter(this._target);
    var point = new Point(this._target.x, this._target.y);
    Xs_Manager._spriteset._xsAtkGrid.inputOnOk(point, true);
    if (XdRsData.SRPG.isPlainMapGun(this._usedSkill)) {
        this._actionStep = 9;
        this.wait();
    }
};
Xs_Control.prototype.updateStep9 = function() {
    var point = new Point(this._target.x, this._target.y);
    Xs_Manager._spriteset._xsAtkGrid.inputOnOk(point, true);
};
//=================================================================================================
// Game_Temp 修改
//=================================================================================================
Game_Temp.prototype.xsInitiator = function() {
    return this._xsInitiator;
};
Game_Temp.prototype.setXsInitiator = function(unit) {
    this._xsInitiator = unit;
};
Game_Temp.prototype.xsAnmDirection = function() {
    return this._xsAnmDirection || 0;
};
Game_Temp.prototype.setXsAnmDirection = function(direction) {
    this._xsAnmDirection  = direction;
};
Game_Temp.prototype.isXsCursorLocking = function() {
    return this._xsCursorLocked;
};
Game_Temp.prototype.setXsCursorLocked = function(state) {
    this._xsCursorLocked = state;
};
Game_Temp.prototype.requestLoopAnimation = function(targets, animationId) {
    this._loopAnimationQueue = this._loopAnimationQueue || [];
    if ($dataAnimations[animationId]) {
        const request = {
            targets: targets,
            animationId: animationId,
            mirror: false
        };
        this._loopAnimationQueue.push(request);
    }
};
Game_Temp.prototype.retrieveLoopAnimation = function() {
    if (!this._loopAnimationQueue) return null;
    return this._loopAnimationQueue.shift();
};
//=================================================================================================
// Game_System 修改
//=================================================================================================
XdRsData.SRPG.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    XdRsData.SRPG.Game_System_initialize.call(this);
    this.changeXsCampDisplay(true);
    this.changeXsGridDisplay(true);
};
Game_System.prototype.isXsCampDisplay = function() {
    return this._xsCampDisplay;
};
Game_System.prototype.isXsGridDisplay = function() {
    return this._xsGridDisplay;
};
Game_System.prototype.changeXsCampDisplay = function(state) {
    this._xsCampDisplay = state;
};
Game_System.prototype.changeXsGridDisplay = function(state) {
    this._xsGridDisplay = state;
};
XdRsData.SRPG.Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
Game_System.prototype.onBeforeSave = function() {
    XdRsData.SRPG.Game_System_onBeforeSave.call(this);
    this.setupXsData();
};
XdRsData.SRPG.Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
Game_System.prototype.onAfterLoad = function() {
    XdRsData.SRPG.Game_System_onAfterLoad.call(this);
    $gameTroop.inheritXsBattlers(this._xsActors);
    Xs_Manager.setControl(this._xsControl);
    Xs_Manager.continue(this._xsManager);
};
Game_System.prototype.setupXsData = function() {
    this._xsControl = Xs_Manager._control;
    this._xsManager = Xs_Manager.makeSaveData();
    this._xsActors  = $gameTroop._enemies;
    this.rememberXsUnits();
};
Game_System.prototype.rememberXsUnits = function() {
    if (!Xs_Manager.isRuning()) return;
    this._xsEvents  = $gameMap._events;
    this._xsPlayers = $gameMap._xsPlayers;
    this._xsCoordinate = Xs_Manager.cursorCoordinate();
};
Game_System.prototype.clearXsData = function() {
    this._xsControl = null;
    this._xsManager = null;
    this._xsActors  = null;
    this._xsEvents  = null;
    this._xsPlayers = null;
    this._xsCoordinate = null;
};
Game_System.prototype.getStoredActors = function() {
    var actors = this._xsActors || [];
    this._xsActors = null;
    return actors;
};
Game_System.prototype.getStoredEvents = function() {
    var events = this._xsEvents;
    this._xsEvents = null;
    return events;
};
Game_System.prototype.getStoredPlayers = function() {
    var players = this._xsPlayers;
    this._xsPlayers = null;
    return players;
};
Game_System.prototype.getXsInitialCod = function() {
    if (this._xsCoordinate) {
        var point = this._xsCoordinate;
        this._xsCoordinate = null;
        return point;
    }
    return new Point(Math.floor($gameMap.width()/2), Math.floor($gameMap.height()/2));
};
//=================================================================================================
// Game_Action 修改
//=================================================================================================
Game_Action.prototype.setXsTarget = function(target) {
    this._xsTarget = target;
};
XdRsData.SRPG.Game_Action_makeTargets = Game_Action.prototype.makeTargets;
Game_Action.prototype.makeTargets = function() {
    if (this._xsTarget) return this.repeatTargets([this._xsTarget]);
    return XdRsData.SRPG.Game_Action_makeTargets.call(this);
};
XdRsData.SRPG.Game_Action_testApply = Game_Action.prototype.testApply;
Game_Action.prototype.testApply = function(target) {
    if (Xs_Manager.isRuning()) return !!target;
    return XdRsData.SRPG.Game_Action_testApply.call(this, target);
};
//=================================================================================================
// Game_BattlerBase 修改
//=================================================================================================
XdRsData.SRPG.Game_BattlerBase_isOccasionOk = Game_BattlerBase.prototype.isOccasionOk;
Game_BattlerBase.prototype.isOccasionOk = function(item) {
    if ($gameParty.isinBattle_SRPG()) return [0, 1].contains(item.occasion);
    return XdRsData.SRPG.Game_BattlerBase_isOccasionOk.call(this, item);
};
Game_BattlerBase.prototype.isAvoid = function() {
    if (!Xs_Manager.isRuning()) return false;
    var action = this.currentAction();
    return action && action.isSkill() && action.item().id === 3;
};
//=================================================================================================
// Game_Battler 修改
//=================================================================================================
Game_Battler.prototype.addXsAction = function(action) {
    this._actions = [];
    this._actions.push(action);
};
Game_Battler.prototype.isXsStrikeBackAction = function() {
    if (!this._actions.length) return false;
    var action = this.currentAction();
    if (!action.item())  return false;
    if (action.isItem()) return true;
    return ![2, 3].contains(action.item().id);
};
XdRsData.SRPG.Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function() {
    if (Xs_Manager.isRuning()) {
        this.setActionState('undecided');
        this.clearMotion();
    }else XdRsData.SRPG.Game_Battler_onBattleStart.call(this);
};
XdRsData.SRPG.Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
Game_Battler.prototype.onBattleEnd = function() {
    if (Xs_Manager.isRuning()) {
        this.clearResult();
        this.clearActions();
    }else XdRsData.SRPG.Game_Battler_onBattleEnd.call(this);
};
//=================================================================================================
// Game_Actor 修改
//=================================================================================================
Object.defineProperty(Game_Actor.prototype, 'camp', {
    get: function() { return this._camp;},
    set: function(value) {
        if (this._camp !== value) {
            this._camp = value;
            this.onCampChanged();
        }
    }, 
    configurable: true
});
XdRsData.SRPG.Game_Actor_initialize = Game_Actor.prototype.initialize;
Game_Actor.prototype.initialize = function(actorId, camp) {
    XdRsData.SRPG.Game_Actor_initialize.call(this, actorId);
    this._camp = camp || 0;
    this._xsITCid = 0;
};
Game_Actor.prototype.onCampChanged = function() {
};
Game_Actor.prototype.xsITCid = function() {
    return this._xsITCid;
};
Game_Actor.prototype.setXsITCid = function(id) {
    this._xsITCid = id;
};
Game_Actor.prototype.xsUnit = function() {
    if (this.xsITCid() > 0) return $gameMap.event(this.xsITCid());
    return $gameMap.xsPlayerById(this._actorId);
};
XdRsData.SRPG.Game_Actor_xparam = Game_Actor.prototype.xparam;
Game_Actor.prototype.xparam = function(xparamId) {
    var base = XdRsData.SRPG.Game_Actor_xparam.call(this, xparamId);
    if (xparamId > 1 || !Xs_Manager.isRuning()) return base;
    return (this.xparamXsRate(xparamId) + 1) * base;
};
Game_Actor.prototype.xparamXsRate = function(xparamId) {
    var rate = 0;
    var unit = this.xsUnit();
    if (xparamId === 1 && this.isAvoid()) rate += 0.3;
    if (unit) {
        var sym = ['HIT','EVA'][xparamId];
        var tg = unit.terrainTag();
        rate += (XdRsData.SRPG.getTerrainBuffer(tg, sym) - 100) / 100;
    }
    return rate;
};
Game_Actor.prototype.xsRecoverByTerrainTag = function() {
    var unit = this.xsUnit();
    if (unit) {
        var tg = unit.terrainTag();
        var rh = XdRsData.SRPG.getTerrainBuffer(tg, 'REH');
        var rm = XdRsData.SRPG.getTerrainBuffer(tg, 'REM');
        var addHp = Math.floor(rh * this.mhp / 100);
        var addMp = Math.floor(rm * this.mmp / 100);
        this.setHp(this.hp+addHp);
        this.setMp(this.mp+addMp);
        addHp !== 0 && unit.refreshXsStatus();
    }
};
Game_Actor.prototype.xsSpaceType = function() {
    return +this.actor().meta.SpaceType || 0;
};
Game_Actor.prototype.xsMoveDistance = function() {
    var d = 1;
    if (this.actor().meta.MoveDistance) {
        d = +this.actor().meta.MoveDistance;
    } else if (this.currentClass().meta.MoveDistance) {
        d = +this.currentClass().meta.MoveDistance;
    }
    return d;
};
// 攻击该对象所得到的 EXP 计算。(costHp: 攻击时，减少的该对象的血量； subjectLevel: 攻击者等级)
Game_Actor.prototype.xsExp = function(costHp, subjectLevel) {
    var exp = (costHp + (this.isDead() ? this.mhp : 0)) / 5;
    var dv = subjectLevel - this.level;
    var md = Math.min(5, Math.abs(dv));
    var rate = dv > 0 ? md * 0.19 : md * 0.1;
    exp += dv > 0 ? -(exp * rate) :(exp * rate);
    return Math.floor(exp > 0 ? Math.max(1, exp) : exp);
};
Game_Actor.prototype.xsGold = function() {
    return (+this.actor().meta.XsGold || 0) * this._level;
};
Game_Actor.prototype.xsSkills = function() {
    return [$dataSkills[1]].concat(this.skills());
};
Game_Actor.prototype.xsAttackSkills = function() {
    return this.xsSkills().filter(function(skill){
        return XdRsData.SRPG.isForOpponent(skill);
    });
};
Game_Actor.prototype.xsAuxiliarySkills = function() {
    return this.xsSkills().filter(function(skill){
        return XdRsData.SRPG.isForFriend(skill);
    });
};
Game_Actor.prototype.xsAttackSkillByMaxRange = function() {
    return this.xsAttackSkills().sort(function(a, b){
        var r1 = XdRsData.SRPG.maxSkillRange(a);
        var r2 = XdRsData.SRPG.maxSkillRange(b);
        return r2 - r1;
    }).shift();
};
Game_Actor.prototype.xsAuxiliarySkillByMaxRange = function() {
    return this.xsAuxiliarySkills().sort(function(a, b){
        var r1 = XdRsData.SRPG.maxSkillRange(a);
        var r2 = XdRsData.SRPG.maxSkillRange(b);
        return r2 - r1;
    }).shift();
};
Game_Actor.prototype.maxXsNumActions = function() {
    var id = this._actorId,  classId = this._classId;
    var atk = this.atk,def = this.def,mat = this.mat;
    var mdf = this.mdf,agi = this.agi,luk = this.luk;
    var formula = XdRsData.SRPG.parameters['numActionsFormula'];
    try {return eval(formula) || 0;}
    catch(e) {
        console.error('最大行动次数算式错误！\n'+e.message);
        return 1;
    }
};
//=================================================================================================
// Game_Actors 修改
//=================================================================================================
Game_Actors.prototype.appoint = function(actor, itcId) {
    this._data[actor.actorId()] = actor;
    this._data[actor.actorId()].setXsITCid(itcId);
};
//=================================================================================================
// Game_Unit 修改
//=================================================================================================
XdRsData.SRPG.Game_Unit_initialize = Game_Unit.prototype.initialize;
Game_Unit.prototype.initialize = function() {
    XdRsData.SRPG.Game_Unit_initialize.call(this);
    this.onBattleEnd_SRPG();
};
Game_Unit.prototype.isinBattle_SRPG = function() {
    return this._inBattleSRPG;
};
Game_Unit.prototype.onBattleStart_SRPG = function() {
    this._inBattleSRPG = true;
};
Game_Unit.prototype.onBattleEnd_SRPG = function() {
    this._inBattleSRPG = false;
};
//=================================================================================================
// Game_Party 修改
//=================================================================================================
Game_Party.prototype.hasActor = function(actorId) {
    return this._actors.contains(actorId);
};
//=================================================================================================
// Game_Troop 修改
//=================================================================================================
Game_Troop.prototype.onBattleStart_SRPG = function() {
    Game_Unit.prototype.onBattleStart_SRPG.call(this);
    this._enemies = $gameSystem.getStoredActors();
};
Game_Troop.prototype.getEnemyId = function() {
    var id = 1;
    while(!!this._enemies[id]) id++;
    return id;
};
Game_Troop.prototype.addXsEnemy = function(actorId, level, camp) {
    if (!this.isinBattle_SRPG()) return 0;
    if ($dataActors[actorId]) {
        var id = this.getEnemyId();
        this._enemies[id] = new Game_Actor(actorId, camp);
        this._enemies[id].changeLevel(level);
        this._enemies[id].recoverAll();
        return id;
    }
    return 0;
};
Game_Troop.prototype.removeXsEnemy = function(id) {
    if (!this.isinBattle_SRPG()) return;
    if (this._enemies[id]) this._enemies[id] = null;
};
Game_Troop.prototype.xsBattlerNums = function(camp) {
    return this._enemies.filter(function(m){
        return m && m.camp === camp;
    }).length;
};
Game_Troop.prototype.inheritXsBattlers = function(battlers) {
    this._enemies = battlers;
};
Game_Troop.prototype.onBattleEnd_SRPG = function() {
    Game_Unit.prototype.onBattleEnd_SRPG.call(this);
    this._enemies = [];
};
//=================================================================================================
// Game_Map 修改
//=================================================================================================
XdRsData.SRPG.Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    XdRsData.SRPG.Game_Map_initialize.call(this);
    this.clearXsPlayers();
};
Game_Map.prototype.xsMapName = function() {
    return this.displayName() || $dataMapInfos[this._mapId].name;
};
XdRsData.SRPG.Game_Map_setupEvents = Game_Map.prototype.setupEvents;
Game_Map.prototype.setupEvents = function() {
    !this.setupXsStoredEvents() && XdRsData.SRPG.Game_Map_setupEvents.call(this);
};
Game_Map.prototype.setupXsStoredEvents = function() {
    this._events = $gameSystem.getStoredEvents();
    this._events && this.refreshTileEvents();
    return !!this._events;
};
Game_Map.prototype.clearXsPlayers = function() {
    this._xsPlayers = $gameSystem.getStoredPlayers() || [];
};
Game_Map.prototype.getOrgPointByIndex = function(obj) {
    var id = obj.xsIndex() + 1;
    for (var x=0;x<this.width();++x) {
        for (var y=0;y<this.height();++y) {
            if (this.regionId(x, y) === id) return this.correctPlace(obj, x, y);
        }
    }
    return this.correctPlace(obj, 0, 0);
};
Game_Map.prototype.addXsPlayers = function(actor, x, y) {
    var id = 0;
    if (actor) {
        var battleIndex = actor.index();
        id = this._xsPlayers.length;
        this._xsPlayers[id] = new Game_XsPlayer(id, battleIndex, x, y);
        Xs_Manager.addMiniWindowPart(this._xsPlayers[id]);
    }
    return this._xsPlayers[id];
};
Game_Map.prototype.xsPlayer = function(index) {
    return this._xsPlayers[index];
};
Game_Map.prototype.xsPlayerById = function(id) {
    return this._xsPlayers.filter(function(p){
        return p.xsBattler().actorId() === id;
    }).shift();
};
Game_Map.prototype.isSomeUnitPos = function(obj, x, y) {
    var arr = this._events.concat(this._xsPlayers);
    return arr.some(function(a){
        if (!a || a === obj || !a.pos(x, y)) return false;
        return a.isXsEffective() && !a.isNormalPriority();
    });
};
Game_Map.prototype.correctPlace = function(obj, x, y) {
    var index = 0;
    var ax = x, ay = y;
    var data = [[-1, 0],[1, 0],[0, -1],[0, 1]];
    while (this.isSomeUnitPos(obj, x, y)) {
        if (index >= 4) break;
        x = ax + data[index][0];
        y = ay + data[index][1];
        index++;
    }
    return new Point(x, y);
};
XdRsData.SRPG.Game_Map_setupStartingEvent = Game_Map.prototype.setupStartingEvent;
Game_Map.prototype.setupStartingEvent = function() {
    if (this.setupXsStartingMapEvent()) return true;
    return XdRsData.SRPG.Game_Map_setupStartingEvent.call(this);
};
Game_Map.prototype.setupXsStartingMapEvent = function() {
    var events = this.events();
    for (var i=0; i<events.length; ++i) {
        var event = events[i];
        if (event.isXsStarting()) {
            var list = event.xsList();
            event.setXsStartingFlag(null);
            if (list) {
                this._interpreter.setup(list, event.eventId());
                return true;
            }
        }
    }
    return false;
};
Game_Map.prototype.playAppearAnm = function(eventId) {
    if (this.event(eventId)) {
        var anmId = +XdRsData.SRPG.parameters['appearAnm'] || 0;
        $gameTemp.requestAnimation([this.event(eventId)], anmId);
    }
};
Game_Map.prototype.xsAllUnits = function() {
    return this.events().concat(this._xsPlayers);
};
Game_Map.prototype.xsUnits = function(x, y) {
    var data = [];
    var arr = this.xsAllUnits();
    for (var i=0;i<arr.length;++i) {
        if (arr[i] && !!arr[i].xsBattler() && arr[i].pos(x, y)) {
            data.push(arr[i]);
        }
    }
    return data;
};
Game_Map.prototype.xsUnit = function(x, y) {
    return this.xsUnits(x, y)[0];
};
Game_Map.prototype.xsAliveUnit = function(x, y) {
    var arr = this.xsUnits(x, y);
    for (var i=0;i<arr.length;++i) {
        if (arr[i] && !!arr[i].isXsEffective() && arr[i].pos(x, y)) {
            return arr[i];
        }
    }
    return null;
};
Game_Map.prototype.xsUnitsByCamp = function(camp) {
    return this.xsAllUnits().filter(function(unit){
        return unit && unit.isXsEffective() && unit.camp() === camp;
    }).sort(function(a,b){return a.xsIndex() - b.xsIndex();});
};
Game_Map.prototype.isXsAllDead = function(camp) {
    return !this.xsUnitsByCamp(camp).some(function(unit){
        return unit.isXsEffective();
    });
};
Game_Map.prototype.scrollXsUnit = function(index) {
    var camp = Xs_Manager.playerCamp();
    var arr = !camp ? this._xsPlayers : this.events();
    var max = Xs_Manager.battlerNums(camp);
    index = (index+1) % max;
    while (!arr[index] || !arr[index].isXsEffective() || arr[index].camp() !== camp) {
        index = (index+1) % max;
    };
    return arr[index];
};
Game_Map.prototype.getXsLeader = function(camp) {
    var arr = !camp ? this._xsPlayers : this.events();
    var index = 0;
    while (!arr[index] || !arr[index].isXsEffective() || arr[index].camp() !== camp) index++;
    return arr[index];
};
Game_Map.prototype.startXsScroll = function(x, y) {
    var rw = this.width() - this.screenTileX();
    var fh = this.height() - this.screenTileY();
    x = Math.max(0, Math.min(rw, x));
    y = Math.max(0, Math.min(fh, y));
    this._xsScrollPoint = new Point(x, y);
};
Game_Map.prototype.startXsStandbySign = function(subject, item) {
    var arr = this.xsAllUnits();
    for (var i=0;i<arr.length;++i) {
        if (!arr[i] || !arr[i].isXsEffective()) continue;
        arr[i].setXsStandbySign(subject.xsCanUse(item, arr[i]) ? 1 : 0);
    }
};
Game_Map.prototype.startXsStandbySignByPoints = function(poins, ox, oy) {
    var arr = this.xsAllUnits();
    for (var i=0;i<arr.length;++i) {
        if (!arr[i] || !arr[i].isXsEffective()) continue;
        var result = poins.some(function(p){return arr[i].pos(p.x+ox, p.y+oy);});
        arr[i].setXsStandbySign(result ? 1 : 0);
    }
};
Game_Map.prototype.renewXsStandbySign = function() {
    var arr = this.xsAllUnits();
    for (var i=0;i<arr.length;++i) {
        if (!arr[i] || !arr[i].isXsEffective()) continue;
        arr[i].setXsStandbySign(null);
    }
};
Game_Map.prototype.refreshXsStatus = function() {
    var arr = this.xsAllUnits();
    for (var i=0;i<arr.length;++i) {
        arr[i] && arr[i].refreshXsStatus();
    }
};
Game_Map.prototype.xsRecoverByTerrainTag = function() {
    var arr = this.xsAllUnits();
    for (var i=0;i<arr.length;++i) {
        arr[i].isXsEffective() && arr[i].xsBattler().xsRecoverByTerrainTag();
    }
};
XdRsData.SRPG.Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function(sceneActive) {
    XdRsData.SRPG.Game_Map_update.call(this, sceneActive);
    this.updateXsScroll();
};
XdRsData.SRPG.Game_Map_updateEvents = Game_Map.prototype.updateEvents;
Game_Map.prototype.updateEvents = function() {
    XdRsData.SRPG.Game_Map_updateEvents.call(this);
    for (var i=0;i<this._xsPlayers.length;++i) this._xsPlayers[i].update();
};
Game_Map.prototype.updateXsScroll = function() {
    if (!this._xsScrollPoint) return;
    if (this._xsScrollPoint.y < this._displayY)        this.scrollUp(0.5);
    else if (this._xsScrollPoint.y > this._displayY)   this.scrollDown(0.5);
    else if (this._xsScrollPoint.x === this._displayX) this._xsScrollPoint = null;
    if (!this._xsScrollPoint) return;
    if (this._xsScrollPoint.x < this._displayX)        this.scrollLeft(0.5);
    else if (this._xsScrollPoint.x > this._displayX)   this.scrollRight(0.5);
    else if (this._xsScrollPoint.y === this._displayY) this._xsScrollPoint = null;
};
//=================================================================================================
// Game_CharacterBase 修改
//=================================================================================================
XdRsData.SRPG.Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable;
Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
    if (Xs_Manager.isRuning()) {
        var x2 = $gameMap.roundXWithDirection(x, d);
        var y2 = $gameMap.roundYWithDirection(y, d);
        if (XdRsData.SRPG.isBlocked(x, y) || XdRsData.SRPG.isBlocked(x2, y2)) return false;
        if (this.isXsCharacter()) {
            var type = this.xsBattler().xsSpaceType();
            if (type === 1) return $gameMap.isValid(x, y);
            if (type === 2) {
                if ($gameMap.terrainTag(x, y) === 2 || $gameMap.terrainTag(x2, y2) === 2) {
                    return true;
                }
            }
        }
    }
    return XdRsData.SRPG.Game_CharacterBase_isMapPassable.call(this, x, y, d);
};
XdRsData.SRPG.Game_CharacterBase_isCollidedWithCharacters = Game_CharacterBase.prototype.isCollidedWithCharacters;
Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y) {
    if (Xs_Manager.isRuning()) return this.isCollidedWithXsEvents(x, y) || this.isCollidedWithXsPlayers(x, y);
    return XdRsData.SRPG.Game_CharacterBase_isCollidedWithCharacters.call(this, x, y);
};
Game_CharacterBase.prototype.isCollidedWithXsEvents = function(x, y) {
    var events = $gameMap.eventsXyNt(x, y);
    return events.some(function(event) {
        if (!event.isNormalPriority() || !event.isXsEffective()) return false;
        if (event === this || this.isXsAlly(event))  return false;
        return true;
    }, this);
};
Game_CharacterBase.prototype.isCollidedWithXsPlayers = function(x, y) {
    return $gameMap._xsPlayers.some(function(p){
        return p.isXsEffective() && p !== this && p.pos(x, y) && !this.isXsAlly(p);
    }, this);
};
XdRsData.SRPG.Game_CharacterBase_refreshBushDepth = Game_CharacterBase.prototype.refreshBushDepth;
Game_CharacterBase.prototype.refreshBushDepth = function() {
    if (Xs_Manager.isRuning() && this.isXsCharacter()) {
        if (this.xsBattler().xsSpaceType() === 1) {
            this._bushDepth = 0;
            return;
        }
    }
    XdRsData.SRPG.Game_CharacterBase_refreshBushDepth.call(this);
};
//=================================================================================================
// Game_Character 修改
//=================================================================================================
XdRsData.SRPG.Game_Character_initMembers = Game_Character.prototype.initMembers;
Game_Character.prototype.initMembers = function() {
    XdRsData.SRPG.Game_Character_initMembers.call(this);
    this._xsStandbySign = null;
    this.restoreXsAction();
};
Game_Character.prototype.feedbackXsData = function(data) {
    this._xsSpriteData = data;
};
Game_Character.prototype.hasStepAnime = function() {
    var result = Game_CharacterBase.prototype.hasStepAnime.call(this);
    if (result && Xs_Manager.isRuning()) result = !this.isXsStandby();
    return result;
};
Game_Character.prototype.xsBodyRect = function() {
    if (!this._xsSpriteData) return null;
    var width = this._xsSpriteData.width;
    var height = this._xsSpriteData.height;
    return new Rectangle(this.screenX(), this.screenY(), width, height);
};
Game_Character.prototype.xsTerrainAttenuationValue = function(x, y, d) {
    if (!this.canPass(x, y, d)) return 9999;
    if (this.xsBattler().xsSpaceType() === 1) return 1;
    return XdRsData.SRPG.getTerrainBuffer($gameMap.terrainTag(x, y), 'MOV') + 1;
};
Game_Character.prototype.isXsStandby = function() {
    return this._xsStandby;
};
Game_Character.prototype.isBlackAndWhite = function() {
    if (this._xsStandbySign !== null) {
        return this._xsStandbySign === 0;
    }
    return this.isXsStandby();
};
Game_Character.prototype.setXsStandby = function(state) {
    this._xsStandby = state;
    if (state) {
        this.clearXsLastXsMoveData();
        Xs_Manager.ejectTurnEndChoice();
    }
};
Game_Character.prototype.setXsStandbySign = function(state) {
    this._xsStandbySign = state;
};
Game_Character.prototype.setXsMovePoint = function(point) {
    this._xsMovePoint = point;
    if (point) {
        this._xsNumActions--;
        this._xsMoveCount = 600;
        this._lastXsMoveData = {'x':this._x, 'y':this._y,'d':this._direction};
    }else {
        this._xsMoveCount = 0;
        Xs_Manager.playerCamp() === this.camp() && Xs_Manager.startCommand(this, true);
    }
    Xs_Manager.setPause(!!point);
};
Game_Character.prototype.onXsCommandCancel = function() {
    if (!this._xsStandby && this.isXsMoved()) {
        this.locate(this._lastXsMoveData.x, this._lastXsMoveData.y);
        this.setDirection(this._lastXsMoveData.d);
        this.clearXsLastXsMoveData();
        this._xsNumActions++;
        Xs_Manager.selectTarget(this);
        Xs_Manager.startCommand(this, true);
    }
};
Game_Character.prototype.clearXsLastXsMoveData = function() {
    this._lastXsMoveData = null;
};
Game_Character.prototype.xsBattler = function() {
    return null;
};
Game_Character.prototype.isXsCharacter = function() {
    return !!this.xsBattler();
};
Game_Character.prototype.isXsEffective = function() {
    return this.isXsCharacter() && this.xsBattler().isAlive();
};
Game_Character.prototype.aiType = function() {
    return 0;
};
Game_Character.prototype.xsTargetPoint = function() {
    return this._xsTargetPoint;
};
Game_Character.prototype.clearXsTargetPoint = function() {
    return this._xsTargetPoint = null;
};
Game_Character.prototype.camp = function() {
    return this.isXsCharacter() ? this.xsBattler().camp : null;
};
Game_Character.prototype.isXsPlayer = function() {
    return this.camp() === Xs_Manager.playerCamp();
};
Game_Character.prototype.isXsComputer = function() {
    return !this.isGamePlayer();
};
Game_Character.prototype.isXsAlly = function(obj) {
    if (this.camp() === null || obj.camp() === null) return false;
    return Xs_Manager.isAlly(this.camp(), obj.camp());
};
Game_Character.prototype.xsAllHostileUnits = function() {
    if (this.camp() === null) return [];
    return $gameMap.xsAllUnits().filter(function(unit){
        return unit.isXsEffective() && !this.isXsAlly(unit);
    }, this);
};
Game_Character.prototype.xsAllFriendlyUnits = function() {
    if (this.camp() === null) return [];
    return $gameMap.xsAllUnits().filter(function(unit){
        return unit.isXsEffective() && this.isXsAlly(unit);
    }, this);
};
Game_Character.prototype.xsNearestRival = function() {
    return this.xsAllHostileUnits().sort(function(a, b){
         var d1 = $gameMap.distance(this._x, this._y, a.x, a.y);
         var d2 = $gameMap.distance(this._x, this._y, b.x, b.y);
         return d1 - d2;
    }.bind(this)).shift();
};
Game_Character.prototype.isWithinRange = function(item, target, ox, oy) {
    if (!item || !target) return false;
    var type = target.xsBattler().xsSpaceType();
    if (type === 0 && item.meta.NoAE) return false;
    if (type === 1 && item.meta.NoAA) return false;
    if (type === 2 && target.terrainTag() === 2 && item.meta.NoAS) return false;
    ox = ox || this._x;
    oy = oy || this._y;
    if (XdRsData.SRPG.isSpecialMapGun(item)) {
        return this.isWithinSpecialMapGunRange(item, target, ox, oy);
    }
    var distance = $gameMap.distance(ox,oy,target.x,target.y);
    var range = XdRsData.SRPG.itemRange(item);
    if (XdRsData.SRPG.isForFriend(item) && distance === 0) return true;
    return distance >= range[0] && distance <= range[1];
};
Game_Character.prototype.isWithinSpecialMapGunRange = function(item, target, ox, oy) {
    var d = this.direction();
    var sx = this.deltaXFrom(target.x);
    var sy = this.deltaYFrom(target.y);
    if (Math.abs(sx) > Math.abs(sy)) d = (sx > 0 ? 4 : 6);
    else if (sy !== 0) d = (sy > 0 ? 8 : 2);
    var arr = XdRsData.SRPG.getItemMapGunPoints(item);
    return arr.some(function(p){
        var rp = XdRsData.SRPG.getRealPointByDirection(p, d);
        return target.pos(rp.x+ox, rp.y+oy);
    });
};
Game_Character.prototype.isXsItemVaild = function(item, isStrikeBack) {
    if (!this.isXsEffective()) return false;
    if (!this.xsBattler().canUse(item)) return false;
    if (this.isXsMoved() && !item.meta.XsAllTimes) return false;
    if (XdRsData.SRPG.isMapGun(item)) {
        return !isStrikeBack && !Xs_Manager.isInBattle();
    }
    var isFriend = XdRsData.SRPG.isForFriend(item);
    var targets = isFriend ? this.xsAllFriendlyUnits() : this.xsAllHostileUnits();
    if (targets.some(function(target){
        return this.isWithinRange(item, target);
    }, this)) return true;
    return false;
};
Game_Character.prototype.xsCanUse = function(item, target, ox, oy) {
    if (!this.isXsEffective() || !target || !target.isXsEffective()) return false;
    if (item === 'itc') return target.canITC(this.xsBattler());
    if (!this.xsBattler().canUse(item)) return false;
    if ((this.isXsMoved() || ox && oy) && !item.meta.XsAllTimes) return false;
    if (!this.isWithinRange(item, target, ox, oy)) return false;
    if (!!item.meta.XsWhole) return true;
    if (this.isXsAlly(target)) return XdRsData.SRPG.isForFriend(item);
    else return XdRsData.SRPG.isForOpponent(item);
};
Game_Character.prototype.canITC = function() {
    return false;
};
Game_Character.prototype.canXsPlayerControl = function() {
    if (!Xs_Manager.isRuning()) return false;
    return Xs_Manager.playerCamp() === this.camp();
};
Game_Character.prototype.canXsAct = function() {
    if (!this.isXsEffective()) return false;
    return !this._xsStandby && this._xsNumActions > 0;
};
Game_Character.prototype.canXsAttack = function() {
    if (!this.isXsEffective()) return false;
    var skills = this.xsBattler().xsSkills();
    for (var i=0;i<skills.length;++i) {
        if (this.isXsItemVaild(skills[i])) return true;
    }
    return false;
};
Game_Character.prototype.getXsRangeTargets = function(ox, oy) {
    var skills = this.xsBattler().xsSkills().filter(function(skill){
        if (!this.xsBattler().canUse(skill)) return false;
        return XdRsData.SRPG.isForOpponent(skill);
    }, this);
    if (!skills.length) return [];
    var arr = [];
    var targets = this.xsAllHostileUnits();
    for (var i=0;i<skills.length;++i) {
        for (var j=0;j<targets.length;++j) {
            if (this.xsCanUse(skills[i], targets[j], ox, oy)) {
                arr.push(targets[j]);
            }
        }
    }
    return arr;
};
Game_Character.prototype.deductionXsAction = function() {
    if (this.isXsMoved()) {
        this._lastXsMoveData = null;
        this._xsNumActions++;
    }
    this._xsNumActions--;
    Xs_Manager._control.runEvent('AE');
    if (this._xsNumActions <= 0) this.setXsStandby(true);
};
Game_Character.prototype.restoreXsAction = function() {
    this.isXsEffective() && this.setXsStandby(false);
    this._xsNumActions = this.isXsEffective() ? this.xsBattler().maxXsNumActions() : 0;
};
Game_Character.prototype.isXsMoved = function() {
    return !!this._lastXsMoveData;
};
XdRsData.SRPG.Game_Character_update = Game_Character.prototype.update;
Game_Character.prototype.update = function() {
    XdRsData.SRPG.Game_Character_update.call(this);
    this.updateXsMove();
};
Game_Character.prototype.updateXsMove = function() {
    if (this._xsMoveCount) {
        this._xsMoveCount--;
        if (!this._xsMoveCount) return this.onXsMoveEnd();
    }
    if (this._xsMovePoint && !this.isMoving()) {
        var p = this._xsMovePoint;
        if (this.pos(p.x, p.y)) this.onXsMoveEnd();
        else this.moveStraight(this.findDirectionTo(p.x, p.y));
    }
};
Game_Character.prototype.onXsMoveEnd = function() {
    this.setXsMovePoint(null);
};
Game_Character.prototype.aroundTargets = function() {
    var arr = [];
    for (var x =-1; x<2; ++x) {
        for (var y=-1; y<2; ++y) {
            if (Math.abs(x) === Math.abs(y)) continue;
            var target = $gameMap.xsUnit(this._x+x, this._y+y);
            target && arr.push(target);
        }
    }
    return arr;
};
Game_Character.prototype.xsEnemiesCanITC = function() {
    return this.aroundTargets().filter(function(e){
        return e.canITC(this.xsBattler());
    }, this);
};
Game_Character.prototype.getXsCommandList = function() {
    if (!this.canXsPlayerControl()) return ['state'];
    var arr = this.canXsAct() ? ['move'] : [];
    !this._xsStandby  && this.canXsAttack() && arr.push('atk');
    !this.isXsMoved() && this.canXsAct() && this.camp() === 0 && arr.push('item');
    arr.push('state');
    if (!this._xsStandby) {
        if (this.camp() === 0) {
            !!this.getFootEventWord() && arr.push('event');
            this.xsEnemiesCanITC().length > 0 && arr.push('itc');
        }
        arr.push('standby');
    }
    return arr;
};
Game_Character.prototype.xsFootEvent = function() {
    var arr = $gameMap.eventsXy(this._x, this._y);
    var event = arr.shift();
    while(event && event === this) event = arr.shift();
    return event;
};
Game_Character.prototype.getFootEventWord = function() {
    var event = this.xsFootEvent();
    if (!event || !event.page() || event.page().list.length < 2) return '';
    if (event.page().list[0].code === 108) {
         if (event.page().list[0].parameters[0].match(/<XsCommand:(\S+)>/)) {
             return RegExp.$1;
         }
    }
    return '';
};
Game_Character.prototype.startXsFootEvent = function() {
    var event = this.xsFootEvent();
    if (event) {
        $gameTemp.setXsInitiator(this);
        this.deductionXsAction();
        event.start();
    }
};
Game_Character.prototype.isXsCommandVaild = function(sym) {
    if (sym === 'event') return true;
    return !!XdRsData.SRPG.commandWord(sym);
};
Game_Character.prototype.getXsStrikeBackSkill = function(target) {
    if (!this.isXsEffective()) return null;
    if (this.isXsAlly(target)) return $dataSkills[2];
    var skills = this.xsBattler().xsAttackSkills();
    skills = skills.filter(function(skill){
        return !XdRsData.SRPG.isMapGun(skill) && this.xsCanUse(skill, target);
    }, this);
    var skill = skills[Math.randomInt(skills.length)];
    return skill || $dataSkills[3];
};
Game_Character.prototype.makeXsBattleData = function(attacker, item, passive) {
    var data = {};
    data.obj = this;
    if (this === attacker) data.item = item;
    else data.item = passive ? this.getXsStrikeBackSkill(attacker) : item;
    return data;
};
Game_Character.prototype.refreshXsStatus = function() {
    if (!this.isXsCharacter()) return;
    if (this.xsBattler().isDead()) this.onXsDie();
};
Game_Character.prototype.onXsDie = function() {
    Xs_Manager.window('info').refresh();
};
Game_Character.prototype.lookAtEachOther = function(character) {
    if (!character) return;
    this.turnTowardCharacter(character);
    character.turnTowardCharacter(this);
};
XdRsData.SRPG.Game_Character_turnTowardPlayer = Game_Character.prototype.turnTowardPlayer;
Game_Character.prototype.turnTowardPlayer = function() {
    !Xs_Manager.isRuning() && XdRsData.SRPG.Game_Character_turnTowardPlayer.call(this);
};
//=================================================================================================
// Game_Player 修改
//=================================================================================================
XdRsData.SRPG.Game_Player_canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function() {
    return !Xs_Manager.isRuning() && XdRsData.SRPG.Game_Player_canMove.call(this);
};
XdRsData.SRPG.Game_Player_opacity = Game_Player.prototype.opacity;
Game_Player.prototype.opacity = function() {
    return Xs_Manager.isRuning() ? 0 : XdRsData.SRPG.Game_Player_opacity.call(this);
};
//=================================================================================================
// Game_XsPlayer（玩家角色专用 Character）
//=================================================================================================
function Game_XsPlayer() {
    this.initialize.apply(this, arguments);
}
Game_XsPlayer.prototype = Object.create(Game_Character.prototype);
Game_XsPlayer.prototype.constructor = Game_XsPlayer;
Game_XsPlayer.prototype.initialize = function(index, battleIndex, x, y) {
    Game_Character.prototype.initialize.call(this);
    this._xsIndex = index;
    this._battleIndex = battleIndex;
    this.setStepAnime(eval(XdRsData.SRPG.parameters['stepAnm']));
    var speed = +(XdRsData.SRPG.parameters['moveSpeed'] || 4);
    this.setMoveSpeed(Math.max(1, Math.min(6, speed)));
    if (x !== undefined && y !== undefined) this.locate(x, y);
    else {
        var p = $gameMap.getOrgPointByIndex(this);
        this.locate(p.x, p.y);
    }
    this.refresh();
};
Game_XsPlayer.prototype.playAppearAnm = function() {
    var anmId = +XdRsData.SRPG.parameters['appearAnm'] || 0;
    $gameTemp.requestAnimation([this], anmId);
};
Game_XsPlayer.prototype.xsIndex = function() {
    return this._xsIndex;
};
Game_XsPlayer.prototype.xsBattler = function() {
    return $gameParty.members()[this._battleIndex];
};
Game_XsPlayer.prototype.refresh = function() {
    if (!this.isXsEffective()) return this.xsDisappear();
    var characterName = this.xsBattler().characterName();
    var characterIndex = this.xsBattler().characterIndex();
    this.setImage(characterName, characterIndex);
};
Game_XsPlayer.prototype.xsDisappear = function() {
    this.setImage('', 0);
};
Game_XsPlayer.prototype.onXsDie = function() {
    if (this._isXsDead) return;
    this._isXsDead = true;
    var id = +(XdRsData.SRPG.parameters['deadAnm'] || 0);
    $gameTemp.requestAnimation([this], id);
    var result = false;
    if (this.xsBattler().actor().meta.XsDeathEvent) {
        var id = +this.xsBattler().actor().meta.XsDeathEvent;
        result = !!$dataCommonEvents[id];
        $gameTemp.reserveCommonEvent(id);
    }
    !result && this.xsDisappear();
};
//=================================================================================================
// Game_Event 修改
//=================================================================================================
XdRsData.SRPG.Game_Event_initMembers = Game_Event.prototype.initMembers;
Game_Event.prototype.initMembers = function() {
    XdRsData.SRPG.Game_Event_initMembers.call(this);
    this.setXsStartingFlag(null);
    this._aiType = 0;
};
XdRsData.SRPG.Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
    XdRsData.SRPG.Game_Event_setupPage.call(this);
    Xs_Manager.isRuning() && this.setupXsEnemy();
};
Game_Event.prototype.setupXsEnemy = function() {
    this._xsId = null;
    if (this.page()) {
        var list = this.page().list[0];
        if (list && list.code === 108) {
            var note = list.parameters[0];
            if (note.match(/<XsId:(\d+)>/)) {
                var actorId = +RegExp.$1;
                var level = note.match(/<XsLevel:(\d+)>/) ? +RegExp.$1 : 1;
                var camp = note.match(/<XsCamp:(\d+)>/) ? +RegExp.$1 : 1;
                this._aiType = note.match(/<XsAi:(\d+)>/) ? +RegExp.$1 : 0;
                if (note.match(/<XsTP:(\S+)>/)) {
                    var arr = RegExp.$1.split(',').map(function(n){return +n;});
                    this._xsTargetPoint = new Point(arr[0], arr[1]);
                }
                this._xsId = $gameTroop.addXsEnemy(actorId, level, camp);
                if (this._xsId > 0) {
                    Xs_Manager.setupCamps(this.camp());
                    this.restoreXsAction();
                    this.correctPlace();
                }
            }
        }
    }
};
Game_Event.prototype.correctPlace = function() {
    var p = $gameMap.correctPlace(this, this._x, this._y);
    this.locate(p.x, p.y);
};
Game_Event.prototype.aiType = function() {
    return this._aiType;
};
Game_Event.prototype.changeAiType = function(type) {
    if (!this.isXsEffective()) return;
    this._aiType = Math.max(0, Math.min(3, type));
};
Game_Event.prototype.xsIndex = function() {
    return this._eventId;
};
Game_Event.prototype.xsBattler = function() {
    if (this._actorId) return $gameActors.actor(this._actorId);
    return $gameTroop.members()[this._xsId];
};
Game_Event.prototype.isXsStarting = function() {
    return this._xsStartIndex !== null;
};
Game_Event.prototype.setXsStartingFlag = function(index) {
    this._xsStartIndex = index;
};
Game_Event.prototype.xsList = function() {
    if (!this.isXsNotePage(this._xsStartIndex)) return null;
    return this.event().pages[this._xsStartIndex].list;
};
Game_Event.prototype.isXsNotePage = function(index) {
    var page = this.event().pages[index];
    if (!page || page.image.tileId > 0 || !!page.image.characterName) return false;
    return page.list && page.list.length > 1;
};
Game_Event.prototype.canITC = function(actor) {
    if (!this.xsBattler() || !this.xsBattler().isAlive()) return false;
    if ($gameParty.hasActor(this.xsBattler().actorId()))  return false;
    if (actor.camp !== 0 || !!this._actorId || !this.isXsNotePage(0)) return false;
    var list = this.event().pages[0].list;
    if (list[0].code !== 108) return false;
    var note = list[0].parameters[0];
    if (note.match(/<ITC:(\S+)>/)) {
        var arr = RegExp.$1.split(',').map(function(n){return +n;});
        return arr.contains(actor.actorId());
    } 
    return /<ITC>/.test(note);
};
Game_Event.prototype.startITC = function(subUnit) {
    $gameTemp.setXsInitiator(subUnit);
    subUnit.deductionXsAction();
    this.lookAtEachOther(subUnit);
    this.setXsStartingFlag(0);
};
Game_Event.prototype.onITCok = function() {
    $gameTemp.setXsInitiator(null);
    this.xsBattler().camp = 0;
    this._actorId = this.xsBattler().actorId();
    $gameParty._actors.push(this._actorId);
    $gameActors.appoint(this.xsBattler(), this._eventId);
    Xs_Manager.addFightingActor(this._actorId);
    if (Xs_Manager.currentCamp() === 0) {
        this.restoreXsAction();
    }
    Xs_Manager.window('info').refresh();
};
Game_Event.prototype.onXsActionEnd = function() {
    Game_Character.prototype.onXsActionEnd.call(this);
    this.setXsStartingFlag(0);
};
Game_Event.prototype.onXsDie = function() {
    this.start();
};
//=================================================================================================
// Game_Interpreter 修改
//=================================================================================================
Game_Interpreter.prototype.xsEvent = function() {
    return $gameMap.event(this._eventId);
};
XdRsData.SRPG.Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function() {
    if (Xs_Manager.isRuning() && Xs_Manager.isPrompting()) return true;
    if (this._waitMode === 'xsPlaceEnemy') {
        if (!Xs_Manager.isInLayoutEnemys()) {
            this._waitMode = '';
            return false;
        }
        return true;
    }
    if (this._waitMode === 'xsPlaceActor') {
        if (!Xs_Manager.isInLayoutActors()) {
            this._waitMode = '';
            return false;
        }
        return true;
    }
    return XdRsData.SRPG.Game_Interpreter_updateWaitMode.call(this);
};
//=================================================================================================
// end
//=================================================================================================