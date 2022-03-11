//=================================================================================================
// XS_Core.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc [XS.SRPG] 核心。
* @author 芯☆淡茹水
* @help
*
*/
//=================================================================================================
;var XdRsData = XdRsData || {};
XdRsData.SRPG = XdRsData.SRPG || {};
//=================================================================================================
// Bitmap 修改
//=================================================================================================
// 转换图像为 黑白色
Bitmap.turnBlackAndWhite = function(bitmap) {
    if (!bitmap || !bitmap.isReady()) return bitmap;
    var newBitmap = new Bitmap(bitmap.width, bitmap.height);
    newBitmap.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0);
    var imagedata = newBitmap._context.getImageData(0, 0, newBitmap.width, newBitmap.height);
    var data = imagedata.data, len = data.length;
    for (var i=0;i<len;i+=4) {
        if (data[i+3] > 0) {
            var n = Math.floor((data[i] + data[i+1] + data[i+2]) / 3);
            data[i] = n;  data[i+1] = n; data[i+2] = n;
        }
    }
    imagedata.data = data;
    newBitmap._context.putImageData(imagedata, 0, 0);
    return newBitmap;
};
// 设置圆角路径
Bitmap.setRoundRectPath = function(context, width, height, radius) {
    context.beginPath(0); 
    context.arc(width - radius, height - radius, radius, 0, Math.PI / 2); 
    context.lineTo(radius, height);
    context.arc(radius, height - radius, radius, Math.PI / 2, Math.PI); 
    context.lineTo(0, radius);  
    context.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);  
    context.lineTo(width - radius, 0); 
    context.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);  
    context.lineTo(width, height - radius);
    context.closePath();
};
// 描绘圆角矩形
Bitmap.prototype.fillRoundRect = function(x, y, width, height, radius, lineWidth, strokeColor, fillColor) {         
    if (2 * radius > width || 2 * radius > height) return;
    var context = this._context;
    context.save();
    context.translate(x, y); 
    Bitmap.setRoundRectPath(context, width, height, radius);
    context.lineWidth = lineWidth || 2;
    context.strokeStyle = strokeColor || 'black';
    if (fillColor) {
        context.fillStyle = fillColor;
        context.fill();
    }
    context.stroke();
    context.restore();
    this._setDirty();
};
// 锁定圆形区域， blt 图像对应的圆区域
Bitmap.prototype.circleBlt = function(source, x, y, radius, sx, sy, sw, sh, dw, dh) {
    var context = this._context;
    context.save();
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.clip();
    var dx = x - radius, dy = y - radius;
    this.blt(source, sx, sy, sw, sh, dx, dy, dw, dh);
    context.restore();
    this._setDirty();
};
// 渐变描绘圆形
Bitmap.prototype.drawCircleGD = function(x, y, radius, scale, color1, color2) {
    var context = this._context;
    var rg = context.createRadialGradient(x, y, radius, x, y, radius * scale);
    context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2, true);
	context.closePath();
	rg.addColorStop(0, color1);
	rg.addColorStop(1, color2);
	context.fillStyle = rg;
	context.fill();
    context.restore();
    this._setDirty();
};
// 描绘箭头
Bitmap.prototype.drawArrow = function(x, y, width, height, color, direction) {
    var ox = direction === 'up' ? x + width / 2 : x;
    var oy = direction === 'left' ? y + height / 2 : y;
    var sy = direction === 'right' ? y + height / 2 : (direction === 'up' ? y + height : y);
    var sx = direction === 'left' ? x + width : (direction === 'down' ? x + width / 2 : x);
    var context = this._context;
    context.beginPath();
    context.moveTo(ox, oy);
    context.lineTo(x + width, sy);
    context.lineTo(sx, y + height);
    context.lineTo(ox, oy);
	context.closePath();
	context.fillStyle = color;
    context.fill();
    context.stroke();
    context.restore();
    this._setDirty();
};
Bitmap.prototype._setDirty = function() {
    this._baseTexture.update();
};
//=================================================================================================
// TouchInput 修改
//=================================================================================================
TouchInput._onMouseMove = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._onMove(x, y);
};
TouchInput.coordinateX = function() {
    return $gameMap.canvasToMapX(this._x);
};
TouchInput.coordinateY = function() {
    return $gameMap.canvasToMapY(this._y);
};
TouchInput.inRect = function(){
    var arr = arguments;
    var tx = this._x;
    var ty = this._y;
    var x = arr.length === 1 ? arr[0].x : arr[0];
    var y = arr.length === 1 ? arr[0].y : arr[1];
    var w = arr.length === 1 ? arr[0].width  : arr[2];
    var h = arr.length === 1 ? arr[0].height : arr[3];
    return tx > x && tx < x + w && ty > y && ty < y + h;
};
//=================================================================================================
// Tilemap 修改
//=================================================================================================
Tilemap.prototype.openXsMiniMapSign = function() {
    this._xsMiniMapSign = true;
};
XdRsData.SRPG.Tilemap_update = Tilemap.prototype.update;
Tilemap.prototype.update = function() {
    if (!this._isXsUpdated && this._xsMiniMapSign) {
        XdRsData.SRPG.Tilemap_update.call(this);
        this._isXsUpdated = true;
        return;
    }
    !this._xsMiniMapSign && XdRsData.SRPG.Tilemap_update.call(this);
};
//=================================================================================================
// Sprite 修改
//=================================================================================================
Sprite.prototype.show = function() {
    this.visible = true;
};
Sprite.prototype.hide = function() {
    this.visible = false;
};
Sprite.prototype.localX = function() {
    var x = 0;
    var obj = this;
    while (obj) {
        x += obj.x;
        obj = obj.parent;
    }
    return x;
};
Sprite.prototype.localY = function() {
    var y = 0;
    var obj = this;
    while (obj) {
        y += obj.y;
        obj = obj.parent;
    }
    return y;
};
Sprite.prototype.isTouch = function() {
    if (!this.bitmap || !this.visible) return false;
    var w = this.width  * this.scale.x;
    var h = this.height * this.scale.y;
    var x = this.localX() - w * this.anchor.x;
    var y = this.localY() - h * this.anchor.y;
    return TouchInput.inRect(x, y, w, h);
};
//=================================================================================================
// SRPG 流程控制
//=================================================================================================
function Xs_Manager() {
    throw new Error('This is a static class');
}
Xs_Manager.initialize = function() {
    this._isRuning = false;
    this._round = 0;
    this._index = 0;
    this._phase = 'init';
    this._lastPhase = 'init';
    this._allCamps = [];
    this._campIndex = 0;
    this._playerCamp = 0;
    this._originCamp = 0;
    this._allianceData = {};
    this._forcedActors = [];
    this._fightingActors = [];
    this._control = new Xs_Control();
};
Xs_Manager.setup = function(eventId) {
    this._isRuning = true;
    this._maxCamp = 2;
    this._playerCamp = 0;
    this._originCamp = 0;
    this._currentCamp = 0;
    this._allianceData = {};
    this._forcedActors = [];
    this._fightingActors = [];
    this._control.setup(eventId);
};
Xs_Manager.finish = function() {
    $gameSystem.clearXsData();
    $gameParty.onBattleEnd_SRPG();
    $gameTroop.onBattleEnd_SRPG();
    this._round = 0;
    this._index = 0;
    this._phase = 'init';
    this._lastPhase = 'init';
    this._isRuning = false;
    this._windows = null;
    this._spriteset = null;
    SceneManager.endXsMode();
    this.restorePlayer();
};
Xs_Manager.isRuning = function() {
    return this._isRuning;
};
Xs_Manager.wait = function(n) {
    this._waitCount = this._waitCount || 0;
    this._waitCount = Math.max(this._waitCount, n);
};
Xs_Manager.setPause = function(state) {
    this._isPause = state;
    !state && this.wait(8);
};
Xs_Manager.isAnimationPlaying = function() {
    return this._spriteset && this._spriteset.isAnimationPlaying();
};
Xs_Manager.isBusy = function() {
    if ($gameMap.isEventRunning()) return true;
    if ($gameTemp.isCommonEventReserved()) return true;
    if (this.isAnimationPlaying()) return true;
    if (this.window('control').visible) return true;
    return this._waitCount > 0 || this._isPause;
};
Xs_Manager.window = function(sym) {
    return this._windows ? this._windows[sym] : null;
};
Xs_Manager.setWindows = function(windows) {
    this._windows = windows;
};
Xs_Manager.isWindowLimit = function() {
    for (var i=0;i<arguments.length;++i) {
        var sym = arguments[i];
        if (this.window(sym) && this.window(sym).isBusy()) return true;
    }
    return false;
};
Xs_Manager.tips = function(text, count, endType) {
    if (!this.window('tips')) return false;
    this.window('tips').tip(text, count, endType);
    return true;
};
Xs_Manager.isPrompting = function() {
    return this.window('tips') && this.window('tips').isBusy();
};
Xs_Manager.showGameName = function(count) {
    if (!this._control) return false;
    return this.tips(this._control.gameName(), count || 180);
};
Xs_Manager.setSpriteset = function(spriteset) {
    this._spriteset = spriteset;
};
Xs_Manager.startChoice = function(text, methodOk, methodCancel) {
    if (this.window('choice')) {
        this.window('choice').startChoice(text, methodOk, methodCancel);
    }
};
Xs_Manager.isChoosing = function() {
    return this.window('choice') && this.window('choice').isBusy();
};
Xs_Manager.startItemSelect = function(obj, mod, attacker, isStrikeBack) {
    this.window('item') && this.window('item').startSelect(obj, mod, attacker, isStrikeBack);
};
Xs_Manager.backForDuel = function(skillId) {
    this.window('duel').setActionSkillId(skillId);
};
Xs_Manager.isItemSelecting = function() {
    return this.window('item') && this.window('item').isBusy();
};
Xs_Manager.refreshInfoWindow = function(target) {
    if (this.window('info')) {
        var battler = target ? target.xsBattler() : null;
        if (!this.canControlCursor()) battler = null;
        this.window('info').setBattler(battler);
    };
};
Xs_Manager.refreshInfoState = function(state) {
    if (this.window('info')) {
        this._spriteset.refreshInfoState(state);
    };
};
Xs_Manager.startCommand = function(obj, mute, keep) {
    if (this.window('command') && this.isPlayerRound()) {
        this.window('command').refreshObj(obj, mute, keep);
    }
};
Xs_Manager.selectTarget = function(target) {
    this._spriteset && this._spriteset.selectTarget(target);
};
Xs_Manager.selectPoint = function(point, mute, mod) {
    this._spriteset && this._spriteset.selectPoint(point, mute, mod);
};
Xs_Manager.addMiniWindowPart = function(obj) {
    this.window('menu') && this.window('menu').addMiniPart(obj);
};
Xs_Manager.cursorCoordinate = function() {
    return this._spriteset._xsCursor._coordinate;
};
Xs_Manager.getNearestPointBy = function(point) {
    return this._spriteset._xsMoveGrid.getNearestPointBy(point);
};
Xs_Manager.displayUnitStatus = function(obj) {
    this.window('status').display(obj);
};
Xs_Manager.displayMove = function(obj) {
    this._spriteset._xsMoveGrid.display(obj);
};
Xs_Manager.getPointByTarget = function(obj, target) {
    if (!target) return null;
    return this._spriteset._xsMoveGrid.getNearestPointOnly(obj, target.x, target.y);
};
Xs_Manager.displayAttack = function(obj, item) {
    this._spriteset._xsAtkGrid.display(obj, item);
};
Xs_Manager.displayDuel = function(data1, data2, initiative) {
    this.window('duel').display(data1, data2, initiative);
};
Xs_Manager.ejectTurnEndChoice = function() {
    if (!this.isPlayerRound()) return;
    const units = $gameMap.xsUnitsByCamp(this.currentCamp());
    this._prepareTurnEndChoice = units.every(function(unit){
        return !unit.isXsEffective() || !unit.canXsAct();
    });
    this._prepareTurnEndChoice && this.wait(20);
};
Xs_Manager.startBattle = function(data1, data2, forerunner) {
    this.window('control').startBattle(data1, data2, forerunner);
};
Xs_Manager.isInBattle = function() {
    return this.window('control') && this.window('control').visible;
};
Xs_Manager.onBattleEnd = function() {
    this._control.checkUpSubject();
    $gameSystem.replayBgm();
    $gameMap.refreshXsStatus();
    this._control.runEvent('BE');
    this.wait(8);
    if (!this.isPlayerRound()) this._control.checkUpSubject();
};
Xs_Manager.startAction = function(subject, targets, point) {
    this.selectTarget(subject);
    this._currentActionData = {};
    this._currentActionData.subject = subject;
    this._currentActionData.targets = targets;
    this._currentActionData.targetPoint = point;
    this._currentActionData.action = subject.xsBattler().currentAction();
    subject.xsBattler().useItem(this.currentActionItem());
    this._phase = 'action';
    this._actionStep = 0;
    this.onBeforeAction();
    this.displayFightInfo();
};
Xs_Manager.onBeforeAction = function() {
    var item = this.currentActionItem();
    if (!item || !/<XsBeforeAction>/.test(item.note)) return;
    if (item.note.match(/<XsBeforeAction>([\S\s]*)<\/XsBeforeAction>/)) {
        var c = this._currentActionData.subject;
        var a = c.xsBattler();
        var v = $gameVariables._data;
        var ts = this._currentActionData.targets;
        var ceId = 0;
        try {eval(RegExp.$1);}
        catch (e) {
            var type = DataManager.isSkill(item) ? '技能' : '物品';
            console.error(type+'的行动前备注错误，'+type+'id 为 '+item.id);
        }
        $gameTemp.reserveCommonEvent(ceId);
    }
};
Xs_Manager.displayFightInfo = function() {
    if (!this.window('figInfo')) return;
    var data = {};
    data.subject = this._currentActionData.subject;
    data.targets = this._currentActionData.targets;
    this.window('figInfo').display(data);
};
Xs_Manager.endAction = function() {
    if (this._currentActionData && this._currentActionData.subject) {
        this.gainBooty();
        var battler = this._currentActionData.subject.xsBattler();
        battler && battler.clearActions();
        this._currentActionData.subject.deductionXsAction();
        this._control.runEvent('BE');
        if (!this.isPlayerRound()) this._control.checkUpSubject();
    }
    this.window('figInfo') && this.window('figInfo').finish();
    this._currentActionData = null;
    this._actionStep = null;
    this._phase = 'round';
};
Xs_Manager.gainBooty = function() {
    var actor = this._currentActionData.spoilsActor;
    if (!actor || actor.camp !== 0) return;
    var exp = this._currentActionData.exp;
    var gold = this._currentActionData.gold;
    var text = '';
    if (exp && actor.isAlive()) {
        actor.gainExp(exp);
        text += actor.name() + ' 获得'+TextManager.expA+': ' + exp;
    }
    if (gold) {
        $gameParty.gainGold(gold);
        if (text) text += '  ';
        text += '获得'+TextManager.currencyUnit+': ' + gold;
    }
    if (text) this.tips(text, 240);
};
Xs_Manager.anmTargetPoint = function() {
    if (!this._currentActionData) return null;
    return this._currentActionData.targetPoint;
};
Xs_Manager.isSomeGridShowing = function() {
    if (this._spriteset._xsMoveGrid) {
        if (this._spriteset._xsMoveGrid.visible) return true;
    }
    if (this._spriteset._xsAtkGrid) {
        if (this._spriteset._xsAtkGrid.visible) return true;
    }
    return false;
};
Xs_Manager.recordPlayer = function() {
    this._playerData = {};
    this._playerData.x = $gamePlayer.x;
    this._playerData.y = $gamePlayer.y;
    this._playerData.mapId = $gameMap.mapId();
};
Xs_Manager.restorePlayer = function() {
    if (!this._playerData) return;
    var mapId = this._playerData.mapId;
    if (mapId) {
        var x = this._playerData.x;
        var y = this._playerData.y;
        this.moveToDestination(mapId, x || 0, y || 0);
    }
    this._playerData = null;
};
Xs_Manager.moveToDestination = function(mapId, x, y) {
    if (mapId && $gameMap.mapId() !== mapId) {
        $gamePlayer.reserveTransfer(mapId,x,y,2,0);
    } else $gamePlayer.locate(x, y);
};
Xs_Manager.playerCamp = function() {
    return this._playerCamp || 0;
};
Xs_Manager.currentCamp = function() {
    return this._allCamps[this._campIndex];
};
Xs_Manager.changePlayerCamp = function(camp) {
    this._playerCamp = camp;
};
Xs_Manager.battlerNums = function(camp) {
    if (!camp) return this._fightingActors.length;
    return $gameTroop.xsBattlerNums(camp);
};
Xs_Manager.isPlayerRound = function() {
    if (this._phase !== 'round') return false;
    return this.playerCamp() === this.currentCamp();
};
Xs_Manager.isInLayoutActors = function() {
    return ['fixUpWait', 'fixUpActors'].contains(this._phase);
};
Xs_Manager.isInLayoutEnemys = function() {
    return this._phase === 'fixUpEnemys';
};
Xs_Manager.controlLimit = function() {
    if (this._phase !== 'round' || this.isBusy()) return true;
    return this.isPrompting() || this.isPlayerRound() || this.window('duel').isBusy();
};
Xs_Manager.canControlCursor = function() {
    if ((this._phase === 'round' && this.isBusy()) || this.isPrompting()) return false;
    if (this.isItemSelecting() || this.isChoosing()) return false;
    if (this.isWindowLimit('menu','select','command','status','duel')) return false;
    if (this.isPlayerRound()) return true;
    return this._phase === 'fixUpWait';
};
Xs_Manager.currentCampName = function() {
    return this._control.campName(this.currentCamp());
};
Xs_Manager.currentChapterName = function() {
    var turnName = ' <结束>';
    if (this.isRuning()) turnName = ' <第 '+this._round+' 回合>';
    return this._control.gameName() + turnName;
};
Xs_Manager.isForceFight = function(actorId) {
    if (!this._forcedActors) return false;
    return this._forcedActors.contains(actorId);
};
Xs_Manager.forceFightActorsSize = function(actors) {
    if (!this._forcedActors) return 0;
    return actors.filter(function(a){
        return this.isForceFight(a.actorId());
    }, this).length;
};
Xs_Manager.addForceFightActor = function(actorId) {
    if (!$gameParty.hasActor(actorId)) return;
    !this.isForceFight(actorId) && this._forcedActors.push(actorId);
};
Xs_Manager.isFighting = function(actorId) {
    if (!this._fightingActors) return false;
    return this._fightingActors.contains(actorId);
};
Xs_Manager.setControl = function(control) {
    this._control = control;
};
Xs_Manager.removeLoopAnimation = function() {
    this._spriteset && this._spriteset.removeLoopAnimation();
};
Xs_Manager.readyStart = function(eventId, mapId) {
    this.setup(eventId);
    this.recordPlayer();
    this.moveToDestination(mapId, 0, 0);
    $gameParty.onBattleStart_SRPG();
    $gameTroop.onBattleStart_SRPG();
};
Xs_Manager.continue = function(data) {
    if (!data) return;
    $gameParty.onBattleStart_SRPG();
    $gameTroop.onBattleStart_SRPG();
    this.extractData(data);
    this._phase = 'round';
    this._campTipSign = true;
    this.tips(this._control.campName(this.currentCamp())+'行动', 120);
};
Xs_Manager.extractData = function(data) {
    this._isRuning = data.isRuning;
    this._round = data.round;
    this._index = data.index;
    this._allCamps = data.allCamps;
    this._campIndex = data.campIndex;
    this._playerCamp = data.playerCamp;
    this._playerData = data.playerData;
    this._allianceData = data.allianceData;
    this._forcedActors = data.forcedActors;
    this._fightingActors = data.fightingActors;
    XdRsData.SRPG.setRoundVal(this._round);
};
Xs_Manager.makeSaveData = function() {
    if (!this.isRuning()) return null;
    var data = {};
    data.isRuning = this._isRuning;
    data.round = this._round;
    data.index = this._index;
    data.allCamps = this._allCamps;
    data.campIndex = this._campIndex;
    data.playerCamp = this._playerCamp;
    data.playerData = this._playerData;
    data.allianceData = this._allianceData;
    data.forcedActors = this._forcedActors;
    data.fightingActors = this._fightingActors;
    return data;
};
Xs_Manager.isAlly = function(camp1, camp2) {
    if (!XdRsData.SRPG.isNumber(camp1)) return true;
    if (!XdRsData.SRPG.isNumber(camp2)) return true;
    if (camp1 === camp2) return true;
    if (!this._allianceData[camp1]) return false;
    return this._allianceData[camp1].contains(camp2);
};
Xs_Manager.alliance = function(camp1, camp2) {
    if (this.isAlly(camp1, camp2)) return;
    this._allianceData[camp1] = this._allianceData[camp1] || [];
    this._allianceData[camp2] = this._allianceData[camp2] || [];
    this._allianceData[camp1].push(camp2);
    this._allianceData[camp2].push(camp1);
};
Xs_Manager.rescindCovenant = function(camp1, camp2) {
    if (!this.isAlly(camp1, camp2)) return;
    var index1 = this._allianceData[camp1].indexOf(camp2);
    var index2 = this._allianceData[camp2].indexOf(camp1);
    index1 >= 0 && this._allianceData[camp1].splice(index1, 1);
    index2 >= 0 && this._allianceData[camp2].splice(index2, 1);
};
Xs_Manager.setupCamps = function(camp) {
    if (!this._allCamps.contains(camp)) {
        this._allCamps.push(camp);
        this._allCamps = this._allCamps.sort();
    }
};
Xs_Manager.currentUnits = function() {
    return $gameMap.xsUnitsByCamp(this.currentCamp());
};
Xs_Manager.currentUnit = function() {
    return this.currentUnits()[this._index];
};
Xs_Manager.pushIndex = function(index) {
    this._index++;
};
Xs_Manager.selectNextUnit = function() {
    var max = this.currentUnits().length;
    if (this._index >= max) return 0;
    var unit = this.currentUnit();
    if (!unit || !unit.isXsEffective() || !unit.canXsAct()) return 1;
    return 2;
};
Xs_Manager.selectNextCamp = function(index) {
    this._campTipSign = true;
    this.restoreCampUnits(this.currentCamp());
    if (XdRsData.SRPG.isNumber(index)) this._campIndex = index;
    else this._campIndex = (this._campIndex+1) % this._allCamps.length;
    while($gameMap.isXsAllDead(this.currentCamp())) {
        this._campIndex = (this._campIndex+1) % this._allCamps.length;
    }
    if (this.isPlayerRound()) this._spriteset.selectPlayerLeader();
    if (this.currentCamp() === this._originCamp) return this.roundEnd();
    this._control.runEvent('CE');
    this._index = 0;
    this.wait(8);
};
Xs_Manager.roundEnd = function() {
    this._round++;
    XdRsData.SRPG.setRoundVal(this._round);
    $gameMap.xsRecoverByTerrainTag();
    this._control.runEvent('TE');
};
Xs_Manager.restoreCampUnits = function(camp) {
    if (camp < 0) return;
    var arr = $gameMap.xsAllUnits();
    for (var i=0;i<arr.length;++i) {
        if (arr[i] && arr[i].isXsEffective() && arr[i].camp() === camp) {
            arr[i].restoreXsAction();
        }
    }
};
Xs_Manager.addFightingActor = function(actorId) {
    if (!this._fightingActors.contains(actorId)) {
        this._fightingActors.push(actorId)
    }
};
Xs_Manager.startSelectActors = function(maxSize) {
    this._phase = 'fixUpWait';
    this.window('select').startSelect(maxSize);
};
Xs_Manager.readyLayOutActors = function(maxSize) {
    if (!this.isRuning()) return false;
    var actors = $gameParty.members().filter(function(a){
        return !this.isFighting(a.actorId());
    }, this);
    if (actors.length <= 0) return false;
    if (maxSize && actors.length > maxSize) {
        this.startSelectActors(maxSize);
    } else this.layOutActors(actors);
    return true;
};
Xs_Manager.layOutActors = function(actors) {
    if (this._phase === 'fixUpWait') this._lastPhase = 'init';
    else this._lastPhase = this._phase;
    this._layOutActorsData = actors;
    this._phase = 'fixUpActors';
};
Xs_Manager.layOutEnemys = function(data) {
    if (!this.isRuning()) return false;
    if (!data || !data.length) return false;
    this._layOutEnemysData = data.split('+');
    if (this._layOutEnemysData.length > 0) {
        this._lastPhase = this._phase;
        this._phase = 'fixUpEnemys';
        return true;
    }
    return false;
};
Xs_Manager.placeActor = function() {
    var actor = this._layOutActorsData.shift();
    if (!actor) return this.onLayOutEnd();
    var player = $gameMap.addXsPlayers(actor);
    this._spriteset.addXsPlayerCharacter(player);
    this.addFightingActor(actor.actorId());
    this.setupCamps(0);
    this.onPlaced(player);
    player.playAppearAnm();
};
Xs_Manager.placeEnemy = function() {
    var text = this._layOutEnemysData.shift();
    if (!text) return this.onLayOutEnd();
    var mapId = $gameMap.mapId();
    var id = text.match(/(\d+)/) ? +RegExp.$1 : 0;
    var n = text.match(/(\D)/) ? RegExp.$1 : null;
    var event = $gameMap.event(id);
    if (event && n) {
        var key = [mapId, id, n];
        $gameSelfSwitches.setValue(key, true);
        $gameMap.playAppearAnm(id);
        this.onPlaced(event);
    }
};
Xs_Manager.onPlaced = function(obj) {
    obj.restoreXsAction();
    this.selectTarget(obj);
    this._fixUpCount = XdRsData.SRPG.appearCount();
};
Xs_Manager.onLayOutEnd = function() {
    this._phase = this._lastPhase;
    this._lastPhase = 'init';
};
Xs_Manager.reinforcements = function(actorId, x, y) {
    if (!this.isRuning() || this.isFighting(actorId)) return;
    var actor = $gameActors.actor(actorId);
    if (!actor || !x || !y) return;
    if (!$gameParty._actors.contains(actorId)) {
        $gameParty.addActor(actorId);
    }
    var player = $gameMap.addXsPlayers(actor, x, y);
    this._spriteset.addXsPlayerCharacter(player);
    this.addFightingActor(actorId);
    player.restoreXsAction();
    this.selectTarget(player);
    this.wait(XdRsData.SRPG.appearCount());
    player.playAppearAnm();
};
Xs_Manager.isInputCancel = function() {
    return Xs_WindowBase.prototype.isSomeCanceled.call(this);
};
Xs_Manager.setupOrgCamp = function(originCamp) {
    originCamp = originCamp || 0;
    if (!this._allCamps.contains(originCamp)) {
        originCamp = this._allCamps[0];
    }
    var index = this._allCamps.indexOf(originCamp);
    this._originCamp = originCamp;
    return index;
};
Xs_Manager.start = function(originCamp) {
    this._phase = 'round';
    var state = this.canControlCursor();
    this.refreshInfoState(state);
    this.selectNextCamp(this.setupOrgCamp(originCamp));
};
Xs_Manager.update = function() {
    if (SceneManager.isMapScene() && this.isRuning()) {
        this.updateWait();
        this.updateFixUpCount();
        this[this._phase+'Update'] && this[this._phase+'Update']();
    }
};
Xs_Manager.updateWait = function() {
    if (this._waitCount) this._waitCount--;
};
Xs_Manager.updateFixUpCount = function() {
    if (this._fixUpCount) this._fixUpCount--;
};
Xs_Manager.initUpdate = function() {
};
Xs_Manager.fixUpEnemysUpdate = function() {
    !this._fixUpCount && this.placeEnemy();
};
Xs_Manager.fixUpActorsUpdate = function() {
    !this._fixUpCount && this.placeActor();
};
Xs_Manager.fixUpWaitUpdate = function() {
    if (this.canControlCursor() && !this._waitCount){
        if (this.isInputCancel()) {
            this.refreshInfoState(false);
            this.startSelectActors();
        }
    }
};
Xs_Manager.roundUpdate = function() {
    this._control.update();
    this.updateCampTips();
    this.updateMenuWindow();
    if (this._prepareTurnEndChoice && !this.isBusy()) {
        if (!this.window('menu').isBusy()) {
            this.window('menu').operateChildWindow(5);
        }
        this._prepareTurnEndChoice = false;
    }
};
Xs_Manager.updateCampTips = function() {
    if (this._campTipSign && this.window('tips')) {
        this._campTipSign = false;
        this.tips(this._control.campName(this.currentCamp())+'开始行动', 60);
    }
};
Xs_Manager.updateMenuWindow = function() {
    if (this.isBusy() || !this.isPlayerRound() || this.isItemSelecting()) return;
    if (this.isPrompting() || this.isChoosing() || this.isSomeGridShowing()) return;
    if (!this.window('menu') || this.window('menu').visible || this.isWindowLimit('status','duel')) return;
    if (this.isInputCancel()) return this.window('menu').show();
    this.updateShortcuts();
};
Xs_Manager.updateShortcuts = function() {
    if (this.isWindowLimit('command')) return;
    for (var i=0;i<XdRsData.SRPG.keydata().length;++i) {
        var keyName = XdRsData.SRPG.keydata()[i] + 'Xs';
        if (Input.isTriggered(keyName)) {
            return this.window('menu').operateChildWindow(i);
        }
    }
};
Xs_Manager.actionUpdate = function() {
    if (this.isBusy()) return;
    if (!this._currentActionData) return this.endAction();
    if (this['actionOnStep'+this._actionStep]) {
        this['actionOnStep'+this._actionStep]();
    }
};
Xs_Manager.currentActionSubject = function() {
    if (this._currentActionData.isStrikeBack) {
        return this._currentActionData.strikeBackTarget;
    }
    return this._currentActionData.subject;
};
Xs_Manager.currentActionItem = function() {
    var subject = this.currentActionSubject();
    var action = subject.xsBattler().currentAction();
    return action ? action.item() : null;
};
Xs_Manager.displayMapGunMobile = function() {
    this._actionStep = 99;
    var data = {};
    data.subject = this._currentActionData.subject;
    data.item = this.currentActionItem();
    data.point = this._currentActionData.targetPoint;
    this._spriteset.displayMapGunMobile(data);
};
Xs_Manager.actionOnStep0 = function() {
    this.window('info').refresh();
    var subject = this.currentActionSubject();
    var id = XdRsData.SRPG.itemUserAnm(this.currentActionItem());
    $gameTemp.requestAnimation([subject], id);
    this._actionStep = 1;
};
Xs_Manager.actionOnStep1 = function() {
    var item = this.currentActionItem();
    if (XdRsData.SRPG.isPlainMapGun(item)) {
        $gameTemp.setXsAnmDirection(0);
        this.displayMapGunMobile();
    } else {
        var subject = this.currentActionSubject();
        var id = XdRsData.SRPG.itemGlobalAnm(this.currentActionItem());
        $gameTemp.requestAnimation([subject], id);
        this._actionStep = 2;
    }
};
Xs_Manager.actionOnStep2 = function() {
    $gameTemp.setXsAnmDirection(0);
    var subject = this.currentActionSubject();
    if (this._currentActionData.isStrikeBack) {
        var target = this._currentActionData.subject;
    } else {
        var target = this._currentActionData.targets.shift();
    }
    if (!target) return this.endAction();
    this._currentActionData.currentTarget = target;
    if (target.xsBattler().isAlive()) {
        this.applyEffect(subject, target);
    }
    this.window('info').refresh();
    this._actionStep = 3;
};
Xs_Manager.actionOnStep3 = function() {
    var subject = this.currentActionSubject();
    var target = this._currentActionData.currentTarget;
    target && target.refreshXsStatus();
    this._actionStep = 2;
    if (this._currentActionData.isStrikeBack) {
        subject.xsBattler().clearActions();
        this._currentActionData.strikeBackTarget = null;
        this._currentActionData.isStrikeBack = false;
    } else if (target !== subject) {
        var battler = target.xsBattler();
        if (battler.isXsStrikeBackAction()) {
            var action = battler.currentAction();
            var result = action.isSkill() && [2,3].contains(action.item().id);
            if (!result && !target.isXsAlly(subject) && battler.isAlive()) {
                target.turnTowardCharacter(subject);
                this._currentActionData.strikeBackTarget = target;
                this._currentActionData.isStrikeBack = true;
                this._actionStep = 4;
            } else battler.clearActions();
        }
    }
};
Xs_Manager.actionOnStep4 = function() {
    var target = this._currentActionData.strikeBackTarget;
    var action = target.xsBattler().currentAction();
    target.xsBattler().useItem(action.item());
    this._actionStep = 0;
};
Xs_Manager.applyEffect = function(subject, target) {
    var lastHp = target.xsBattler().hp;
    this.selectTarget(target);
    var action = subject.xsBattler().currentAction();
    if (this._currentActionData) {
        action = action || this._currentActionData.action;
    }
    if (action) {
        $gameTemp.requestAnimation([target], action.item().animationId);
        action.apply(target.xsBattler());
        action.applyGlobal();
        target.xsBattler().startDamagePopup();
    }
    lastHp > target.xsBattler().hp && this.recordSpoils(subject, target, lastHp);
};
Xs_Manager.recordSpoils = function(subject, target, lastHp) {
    if (subject.camp() === target.camp() || subject.camp() !== 0) return;
    var actor = subject.xsBattler();
    this._currentActionData.spoilsActor = this._currentActionData.spoilsObj || actor;
    var num = lastHp - target.xsBattler().hp;
    var level = subject.xsBattler().level;
    this._currentActionData.exp = this._currentActionData.exp || 0;
    this._currentActionData.exp += target.xsBattler().xsExp(num, level);
    if (!target.xsBattler().isAlive()) {
        this._currentActionData.gold = this._currentActionData.gold || 0;
        this._currentActionData.gold += target.xsBattler().xsGold();
    }
};
//=================================================================================================
// DataManager 修改
//=================================================================================================
XdRsData.SRPG.DataManager_makeSavefileInfo = DataManager.makeSavefileInfo;
DataManager.makeSavefileInfo = function() {
    var info = XdRsData.SRPG.DataManager_makeSavefileInfo.call(this);
    info.xsMapName     = $gameMap.xsMapName();
    info.xsChapterName = Xs_Manager.currentChapterName();
    return info;
};
//=================================================================================================
// ConfigManager 修改
//=================================================================================================
ConfigManager.isFightingOnMap = false;
XdRsData.SRPG.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
    var config = XdRsData.SRPG.ConfigManager_makeData.call(this);
    config.isFightingOnMap = !!this.isFightingOnMap;
    return config;
};
XdRsData.SRPG.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
    XdRsData.SRPG.ConfigManager_applyData.call(this, config);
    this.isFightingOnMap = this.readFlag(config, 'isFightingOnMap');
};
//=================================================================================================
// SceneManager 修改
//=================================================================================================
XdRsData.SRPG.SceneManager_initialize = SceneManager.initialize;
SceneManager.initialize = function() {
    XdRsData.SRPG.SceneManager_initialize.call(this);
    XdRsData.SRPG.addInputKey();
    Xs_Manager.initialize();
};
SceneManager.isMapScene = function() {
    return this._scene && this._scene.constructor === Scene_Map;
};
SceneManager.readyStartXs = function(eventId, mapId) {
    if (!this.isMapScene() || !$dataCommonEvents[eventId]) return;
    if (!mapId || $gameMap.mapId() === mapId) this._scene.createXsWindows();
    Xs_Manager.readyStart(eventId, mapId);
};
SceneManager.endXsMode = function() {
    this.isMapScene() && this._scene.onXsFinish();
};
//=================================================================================================
// 图像窗口基础
//=================================================================================================
function Xs_WindowBase() {
    this.initialize.apply(this, arguments);
}
Xs_WindowBase.prototype = Object.create(Sprite.prototype);
Xs_WindowBase.prototype.constructor = Xs_WindowBase;
Xs_WindowBase.prototype.initialize = function(width, height, uiName, srcPoint) {
    Sprite.prototype.initialize.call(this);
    this.setupUiFace(width, height, uiName, srcPoint);
    this.createContents();
    this.setupPostion();
    this.initData();
    this.refresh();
};
Xs_WindowBase.prototype.setupUiFace = function(width, height, uiName, srcPoint) {
    this.bitmap = uiName ? ImageManager.loadPicture(uiName, 0) : new Bitmap(width, height);
    srcPoint && this.setFrame(srcPoint.x, srcPoint.y, width, height);
    !uiName && this.drawUiFace();
};
Xs_WindowBase.prototype.createContents = function() {
    this._contentsSprite = new Sprite(new Bitmap(this.width, this.height));
    this.contents = this._contentsSprite.bitmap;
    this.addChild(this._contentsSprite);
};
Xs_WindowBase.prototype.drawUiFace = function() {
};
Xs_WindowBase.prototype.setupPostion = function() {
};
Xs_WindowBase.prototype.initData = function() {
    this._index = 0;
    this._buttons = [];
    this._handlers = {};
    this._waitCount = 0;
    this._active = false;
    this.createButtons();
    this.refreshPage();
    this.maxItems() > 0 && this.createCursor();
};
Xs_WindowBase.prototype.createButtons = function() {
};
Xs_WindowBase.prototype.createCursor = function() {
    this._cursor = new Xs_WindowCursor();
    this.refreshCursor();
    this.addChild(this._cursor);
};
Xs_WindowBase.prototype.refreshPage = function() {
    this._page = 0;
    this._maxPage = Math.ceil(this.items().length / this.maxItems());
    this._maxPage = Math.max(this._maxPage, 1);
};
Xs_WindowBase.prototype.show = function() {
    Sprite.prototype.show.call(this);
    this._waitCount = 8;
};
Xs_WindowBase.prototype.activate = function() {
    this._active = true;
    this._waitCount = 8;
    this.refreshCursor();
};
Xs_WindowBase.prototype.deactivate = function() {
    this._active = false;
    this.refreshCursor();
};
Xs_WindowBase.prototype.isBusy = function() {
    return this.visible && this._active;
};
Xs_WindowBase.prototype.isActive = function() {
    return this.isBusy() && !this._waitCount;
};
Xs_WindowBase.prototype.setHandler = function(sym, method) {
    this._handlers[sym] = method;
};
Xs_WindowBase.prototype.callHandler = function(sym) {
    this._handlers[sym] && this._handlers[sym]();
};
Xs_WindowBase.prototype.isVaild = function() {
    return !this._handlers['vaild'] || this.callHandler('vaild');
};
Xs_WindowBase.prototype.callOkHandler = function() {
    if (!this._handlers['ok']) return;
    if (!this.isVaild()) return SoundManager.playBuzzer();
    SoundManager.playOk();
    this.deactivate();
    this.callHandler('ok');
};
Xs_WindowBase.prototype.callCancelHandler = function() {
    if (!this._handlers['cancel']) return;
    SoundManager.playCancel();
    this.deactivate();
    this.callHandler('cancel');
};
Xs_WindowBase.prototype.select = function(index, mute) {
    if (!this.pageItems()[index]) return;
    if (this._index !== index) {
        !mute && SoundManager.playCursor();
        this._index = index;
        this.onIndexChanged();
    }
};
Xs_WindowBase.prototype.rollIndex = function(type) {
    var max = Math.min(this.maxItems(), this.pageItems().length);
    max = max || 1;
    var index = (this._index + (type ? 1 : max - 1)) % max;
    this.select(index);
};
Xs_WindowBase.prototype.setPage = function(page) {
    if (this._page !== page) {
        SoundManager.playOk();
        this._page = page;
        this.onPageChanged();
        this.select(0, true);
    }
};
Xs_WindowBase.prototype.rollPage = function(type) {
    if (this._maxPage < 2) return;
    var max = this._maxPage;
    var page = (this._page + (type ? 1 : max - 1)) % max;
    this.setPage(page);
};
Xs_WindowBase.prototype.onIndexChanged = function() {
    this.refreshCursor();
};
Xs_WindowBase.prototype.onPageChanged = function() {
    this.refresh();
};
Xs_WindowBase.prototype.refreshCursor = function() {
    if (!this._cursor) return;
    if (!this._active) return this._cursor.hide();
    var rect = this.itemRect(this._index);
    var y = rect.y + (rect.height - 20) / 2;
    this._cursor.move(rect.x, y);
    this._cursor.show();
};
Xs_WindowBase.prototype.items = function() {
    return [];
};
Xs_WindowBase.prototype.maxItems = function() {
    return 0;
};
Xs_WindowBase.prototype.pageItems = function() {
    var n = this._page * this.maxItems();
    return this.items().slice(n, n+this.maxItems());
};
Xs_WindowBase.prototype.item = function() {
    return this.pageItems()[this._index];
};
Xs_WindowBase.prototype.itemRect = function(index) {
    return null;
};
Xs_WindowBase.prototype.itemLocalRect = function(index) {
    var rect = this.itemRect(index);
    if (!rect) return null;
    rect.x += this.localX();
    rect.y += this.localY();
    return rect;
};
Xs_WindowBase.prototype.bltBitmap = function(bitmap, rect, x, y, w, h) {
    w = w || rect.width;
    h = h || rect.height;
    var r = Math.min.apply(null, [w/rect.width,h/rect.height,1]);
    var bw = rect.width * r;
    var bh = rect.height * r;
    x += (w - bw) / 2;
    y += (h - bh) / 2;
    bitmap.addLoadListener(function() {
        this.contents.blt(bitmap, rect.x, rect.y, rect.width, rect.height, x, y, bw, bh);
    }.bind(this));
};
Xs_WindowBase.prototype.drawIcon = function(iconIndex, x, y, w, h) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = ImageManager.iconWidth;
    var ph = ImageManager.iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    var rect = new Rectangle(sx,sy,pw,ph);
    this.bltBitmap(bitmap, rect, x, y, w, h);
};
Xs_WindowBase.prototype.drawFace = function(faceName, faceIndex, x, y, w, h) {
    var bitmap = ImageManager.loadFace(faceName);
    var pw = ImageManager.faceWidth;
    var ph = ImageManager.faceHeight;
    var sx = faceIndex % 4 * pw;
    var sy = Math.floor(faceIndex / 4) * ph;
    var rect = new Rectangle(sx,sy,pw,ph);
    this.bltBitmap(bitmap, rect, x, y, w, h);
};
Xs_WindowBase.prototype.drawBar = function(x, y, now, max, text, color, width) {
    width = width || 180;
    var text2 = ''+now+'/'+max;
    var bw = now / max * (width - 2);
    this.contents.fillRoundRect(x+1, y+1, width-2, 8, 3,1,'rgb(80,80,80)','rgb(0,0,0)');
    this.contents.fillRoundRect(x+1, y+1, bw, 8, 3,1, 'rgb(0,0,0)',color);
    this.contents.drawText(text, x+5, y-15, width-10, 26);
    this.contents.drawText(text2, x+5, y-15, width-10, 26, 'right');
};
Xs_WindowBase.prototype.drawHp = function(actor, x, y, width) {
    this.drawBar(x, y, actor.hp, actor.mhp, TextManager.hpA, 'rgb(255,0,0)', width);
};
Xs_WindowBase.prototype.drawMp = function(actor, x, y, width) {
    this.drawBar(x, y, actor.mp, actor.mmp, TextManager.mpA, 'rgb(0,0,255)', width);
};
Xs_WindowBase.prototype.drawTp = function(actor, x, y, width) {
    this.drawBar(x, y, actor.tp, actor.maxTp(), TextManager.tpA, 'rgb(0,255,255)', width);
};
Xs_WindowBase.prototype.drawExp = function(actor, x, y, width) {
    this.drawBar(x, y, actor.currentExp(), actor.nextLevelExp(), TextManager.expA, 'rgb(0,255,0)', width);
};
Xs_WindowBase.prototype.drawCharacter = function(characterName, characterIndex, x, y, w, h) {
    var bitmap = ImageManager.loadCharacter(characterName);
    var big = ImageManager.isBigCharacter(characterName);
    bitmap.addLoadListener(function() {
        var pw = bitmap.width / (big ? 3 : 12);
        var ph = bitmap.height / (big ? 4 : 8);
        var n = characterIndex;
        var sx = (n % 4 * 3 + 1) * pw;
        var sy = (Math.floor(n / 4) * 4) * ph;
        var rect = new Rectangle(sx,sy,pw,ph);
        this.bltBitmap(bitmap, rect, x, y, w, h);
    }.bind(this)); 
};
Xs_WindowBase.prototype.drawCamp = function(camp, x, y, w, h) {
    var color = XdRsData.SRPG.campColor(camp);
    this.contents.fillRoundRect(x+2,y+2,w-2,h-2,5,2,'rgb(120,120,120)',color);
};
Xs_WindowBase.prototype.refresh = function() {
    this.contents.clear();
    this.drawItems();
    this.drawPage();
    this.drawOther();
};
Xs_WindowBase.prototype.drawItems = function() {
    if (!this.itemRect(0)) return;
    for (var i=0;i<this.maxItems();++i) this.drawItem(i);
};
Xs_WindowBase.prototype.drawItem = function(index) {
};
Xs_WindowBase.prototype.redrawItem = function(index) {
    if (!this.itemRect(index)) return;
    var rect = this.itemRect(index);
    this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
    this.drawItem(index);
};
Xs_WindowBase.prototype.drawPage = function() {
};
Xs_WindowBase.prototype.drawOther = function() {
};
Xs_WindowBase.prototype.callInputMethod = function(sym) {
    this['inputOn'+sym] && this['inputOn'+sym]();
};
Xs_WindowBase.prototype.isSomeCanceled = function() {
    return TouchInput.isCancelled() || Input.isTriggered('escape');
};
Xs_WindowBase.prototype.isInputAction = function(key) {
    return Input.isTriggered(key) || Input.isRepeated(key);
};
Xs_WindowBase.prototype.startChoice = function(text) {
    var methodOk = this.onChoiceOk.bind(this);
    var methodCancel = this.onChoiceCancel.bind(this);
    Xs_Manager.startChoice(text, methodOk, methodCancel);
    this.deactivate();
};
Xs_WindowBase.prototype.onChoiceOk = function() {
};
Xs_WindowBase.prototype.onChoiceCancel = function() {
    this.activate();
};
Xs_WindowBase.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateWait();
    this.updateInput();
    this.updateTouch();
    this.updateOther();
};
Xs_WindowBase.prototype.updateWait = function() {
    if (this._waitCount) this._waitCount--;
};
Xs_WindowBase.prototype.updateInput = function() {
    if (!this.isActive())               return;
    if (this.isInputAction('up'))       return this.callInputMethod('Up');
    if (this.isInputAction('left'))     return this.callInputMethod('Left');
    if (this.isInputAction('down'))     return this.callInputMethod('Down');
    if (this.isInputAction('right'))    return this.callInputMethod('Right');
    if (this.isInputAction('pageup'))   return this.callInputMethod('Pageup');
    if (this.isInputAction('pagedown')) return this.callInputMethod('Pagedown');
    if (this.isInputAction('ok'))       return this.callInputMethod('Ok');
    if (this.isSomeCanceled())          return this.callInputMethod('Cancel');
};
Xs_WindowBase.prototype.updateTouch = function() {
    if (!this.isActive() || !this.itemRect(0)) return;
    if (!TouchInput.isTriggered()) return;
    this.isTouch() && this.touchItemAction();
};
Xs_WindowBase.prototype.touchItemAction = function() {
    var index = this.getTouchIndex();
    if (index !== null) {
        index === this._index ? this.inputOnOk() : this.select(index);
    }
};
Xs_WindowBase.prototype.touchInItemRect = function(index) {
    var rect = this.itemLocalRect(index);
    return rect ? TouchInput.inRect(rect) : false;
};
Xs_WindowBase.prototype.getTouchIndex = function() {
    for (var i=0;i<this.maxItems();i++) {
        if (this.touchInItemRect(i)) return i;
    }
    return null;
};
Xs_WindowBase.prototype.updateOther = function() {
};
Xs_WindowBase.prototype.inputOnOk = function() {
    this.callOkHandler();
};
Xs_WindowBase.prototype.inputOnCancel = function() {
    this.callCancelHandler();
};
Xs_WindowBase.prototype.inputOnUp = function() {
    this.rollIndex(0);
};
Xs_WindowBase.prototype.inputOnDown = function() {
    this.rollIndex(1);
};
Xs_WindowBase.prototype.inputOnPageup = function() {
    this.rollPage(0);
};
Xs_WindowBase.prototype.inputOnPagedown = function() {
    this.rollPage(1);
};
//=================================================================================================
// 图像窗口光标
//=================================================================================================
function Xs_WindowCursor() {
    this.initialize.apply(this, arguments);
}
Xs_WindowCursor.prototype = Object.create(Sprite.prototype);
Xs_WindowCursor.prototype.constructor = Xs_WindowCursor;
Xs_WindowCursor.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(20, 20);
    this._actionCount = 0;
    this.drawCursor();
};
Xs_WindowCursor.prototype.drawCursor = function() {
    var arr = [255,255,255];
    var r = 10;
    for (var i=0;i<6;++i) {
        var color = 'rgb('+arr.join()+')';
        this.bitmap.drawCircle(10,10,r,color);
        r--;
        arr = arr.map(function(n){return n - 20;});
    }
};
Xs_WindowCursor.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this.visible) {
        this._actionCount = (this._actionCount+1) % 80;
        this.opacity += this._actionCount < 40 ? -4 : 4;
    }
};
//=================================================================================================
// 图像按钮
//=================================================================================================
function Xs_Button() {
    this.initialize.apply(this, arguments);
}
Xs_Button.prototype = Object.create(Sprite.prototype);
Xs_Button.prototype.constructor = Xs_Button;
Xs_Button.prototype.initialize = function(x, y, width, height, text, color) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(width, height);
    this.anchor = new Point(0.5, 0.5);
    this._pressCount = 0;
    this.drawButton(text, color);
    this.move(x, y);
};
Xs_Button.prototype.drawButton = function(text, color) {
    color = color || 'rgb(255,160,0)';
    var l = Math.floor(this.height / 20) + 1;
    var w = this.width - l * 2;
    var h = this.height - l * 2;
    this.bitmap.fillRoundRect(l,l,w,h,5,l,'rgb(120,120,120)',color);
    this.bitmap.fontSize = Math.floor(this.height / 2);
    this.bitmap.drawText(text,0,0,this.width,this.height,'center');
};
Xs_Button.prototype.setPressMethod = function(method) {
    this._pressMethod = method;
};
Xs_Button.prototype.callPressMethod = function() {
    this._pressMethod && this._pressMethod();
};
Xs_Button.prototype.isActive = function() {
    if (!this.visible) return false;
    return !this.parent.isActive || this.parent.isActive();
};
Xs_Button.prototype.press = function() {
    if (this._pressCount > 0 || !this.isActive()) return;
    this.scale = new Point(0.95, 0.95);
    this._pressCount = 8;
};
Xs_Button.prototype.restore = function() {
    this.scale = new Point(1, 1);
    this._pressCount = 0;
};
Xs_Button.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updatePressed();
    this.updateTouch();
};
Xs_Button.prototype.updatePressed = function() {
    if (this._pressCount > 0) {
        this._pressCount--;
        this._pressCount === 4 && this.callPressMethod();
        !this._pressCount && this.restore();
    }
};
Xs_Button.prototype.updateTouch = function() {
    if (TouchInput.isTriggered()) {
        this.isTouch() && this.press();
    }    
};
//=================================================================================================
// 询问+选择窗口
//=================================================================================================
function Xs_WindowChoice() {
    this.initialize.apply(this, arguments);
}
Xs_WindowChoice.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowChoice.prototype.constructor = Xs_WindowChoice;
Xs_WindowChoice.prototype.initialize = function() {
    this._text = '';
    Xs_WindowBase.prototype.initialize.call(this, 180, 126);
    this.activate();
    this.hide();
};
Xs_WindowChoice.prototype.startChoice = function(text, methodOk, methodCancel) {
    if (this._text !== text) {
        this._text = text;
        this.setupWindow();
        this.drawUiFace();
        this.setupPostion();
        this.refresh();
    }
    this.select(1, true);
    this.refreshCursor();
    this.setHandler('ok',     methodOk);
    this.setHandler('cancel', methodCancel);
    this._text && this.show();
};
Xs_WindowChoice.prototype.setupWindow = function() {
    if (!this._text) return;
    var width = Math.max(this.contents.measureTextWidth(this._text) + 100, 300);
    this.bitmap = new Bitmap(width, 126);
    this._contentsSprite.bitmap = new Bitmap(width, 126);
    this.contents = this._contentsSprite.bitmap;
};
Xs_WindowChoice.prototype.drawUiFace = function() {
    if (!this._text) return;
    var w = this.width, h = this.height;
    var nx = this.width - 158;
    this.bitmap.drawCircleGD(nx+16, 0, this.height-4, 0.5, 'rgba(180,60,0,0.8)', 'rgba(30,30,30,0)');
    this.bitmap.clearRect(0,0,this.width, 45);
    this.bitmap.clearRect(nx+20,50,this.width-nx-20, 76);
    this.bitmap.fillRoundRect(4,4,w-8,46,20,4,'rgba(180,60,0,0.8)','rgb(30,30,30)');
    this.bitmap.fillRoundRect(nx+4,54,148,32,14,2,'rgba(180,60,0,0.8)','rgb(30,30,30)');
    this.bitmap.fillRoundRect(nx+4,89,148,32,14,2,'rgba(180,60,0,0.8)','rgb(30,30,30)');
    this.bitmap.drawCircle(nx+20, 70, 10, 'rgb(0,0,0)');
    this.bitmap.drawCircle(nx+20, 106, 10, 'rgb(0,0,0)');
};
Xs_WindowChoice.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2;
    this.y = (Graphics.height - this.height) / 2 - 20;
};
Xs_WindowChoice.prototype.items = function() {
    return ['确定','取消'];
};
Xs_WindowChoice.prototype.maxItems = function() {
    return this.items().length;
};
Xs_WindowChoice.prototype.itemRect = function(index) {
    var nx = this.width - 158;
    return new Rectangle(nx, index*36+53, 158, 34);
};
Xs_WindowChoice.prototype.refreshCursor = function() {
    var rect = this.itemRect(this._index);
    var y = rect.y + (rect.height - 20) / 2;
    this._cursor.move(rect.x+10, y);
    this._cursor.show();
};
Xs_WindowChoice.prototype.drawItem = function(index) {
    var rect = this.itemRect(index);
    this.contents.fontSize = 22;
    this.contents.drawText(this.items()[index],rect.x+40,rect.y-2,rect.width-60,rect.height,'center');
};
Xs_WindowChoice.prototype.drawOther = function() {
    this.contents.fontSize = 28;
    this.contents.drawText(this._text,0,4,this.width,46,'center');
};
Xs_WindowChoice.prototype.inputOnOk = function() {
    if (this._index === 0) {
        if (this._handlers['ok']) {
            SoundManager.playOk();
            this.hide();
            Xs_Manager.wait(8);
            this.callHandler('ok');
            this.setHandler('ok');
        }
    } else this.inputOnCancel();
};
Xs_WindowChoice.prototype.inputOnCancel = function() {
    SoundManager.playCancel();
    this.hide();
    Xs_Manager.wait(8);
    this.callHandler('cancel');
    this.setHandler('cancel');
};
//=================================================================================================
// end
//=================================================================================================