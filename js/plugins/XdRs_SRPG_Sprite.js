//=================================================================================================
// XS_Sprite.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc [XS.SRPG] 游戏精灵。
* @author 芯☆淡茹水
* @help
*
*
*/
//=================================================================================================
;var XdRsData = XdRsData || {};
XdRsData.SRPG = XdRsData.SRPG || {};
//=================================================================================================
// 战斗控制 Sprite
//=================================================================================================
//=================================================================================================
function Sprite_Base() {
    this.initialize.apply(this, arguments);
}
Sprite_Base.prototype = Object.create(Sprite.prototype);
Sprite_Base.prototype.constructor = Sprite_Base;
Sprite_Base.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
};
//=================================================================================================
function Xs_BattleControl() {
    this.initialize.apply(this, arguments);
}
Xs_BattleControl.prototype = Object.create(Spriteset_Base.prototype);
Xs_BattleControl.prototype.constructor = Xs_BattleControl;
Xs_BattleControl.prototype.initialize = function() {
    Spriteset_Base.prototype.initialize.call(this);
    this.createBattleback();
    this.createBattleField();
    this._phase = 'init';
    this.hide();
};
Xs_BattleControl.prototype.createBattleback = function() {
    var x = Graphics.width / 2, y = Graphics.height / 2;
    this._battleBack1 = new Sprite(ImageManager.loadBattleback1($gameMap.battleback1Name()));
    this._battleBack2 = new Sprite(ImageManager.loadBattleback2($gameMap.battleback2Name()));
    if (!this._battleBack1.bitmap) {
        this._battleBack1.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this._battleBack1.bitmap.fillAll('rgb(0,0,0)');
    }
    this._battleBack1.anchor = new Point(0.5, 0.5);
    this._battleBack2.anchor = new Point(0.5, 0.5);
    this._battleBack1.move(x, y);
    this._battleBack2.move(x, y);
    this.addChild(this._battleBack1);
    this.addChild(this._battleBack2);
};
Xs_BattleControl.prototype.createBattleField = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    this._battleField = new Sprite();
    this._battleField.setFrame(x, y, width, height);
    this._battleField.x = x;
    this._battleField.y = y;
    this._effectsContainer = this._battleField;
    this.addChild(this._battleField);
};
Xs_BattleControl.prototype.startBattle = function(data1, data2, forerunner) {
    if (!data2) return;
    this._battlerData1 = data1;
    this._battlerData2 = data2;
    this._forerunner = forerunner;
    this.playBattleMusic();
    this.setupAction();
    this.createBattlerSprite();
    this.createAllWindows();
    this.show();
};
Xs_BattleControl.prototype.finish = function() {
    this.leftBattler() && this.leftBattler().onBattleEnd();
    this.rightBattler().onBattleEnd();
    if (this._forerunner === 'left' && this._battlerData1) {
        this._battlerData1.obj.deductionXsAction();
    } else this._battlerData2.obj.deductionXsAction();
    this._phase = 'init';
    this._battlerData1 = null;
    this._battlerData2 = null;
    this._forerunner = 'right';
    this.removeAllWindows();
    Xs_Manager.onBattleEnd();
    this.hide();
};
Xs_BattleControl.prototype.getCurrentBGM = function() {
    var name = this.rightBattler().actor().meta.XsBGM;
    if (this.leftBattler()) {
        var arr = [this.rightBattler().actor(), this.leftBattler().actor()];
        name = arr[0].meta.XsBGM || arr[1].meta.XsBGM;
        if (arr[0].meta.XsBGM && arr[0].meta.XsBoss) name = arr[0].meta.XsBGM;
        else if (arr[1].meta.XsBGM && arr[1].meta.XsBoss) name = arr[1].meta.XsBGM;
    }
    if (name) {
        var vol = ConfigManager.bgmVolume;
        return {'name':name,'volume':vol,'pitch':100,'pan':0};
    }
    return $gameSystem.battleBgm();
};
Xs_BattleControl.prototype.playBattleMusic = function() {
    $gameSystem.saveBgm();
    AudioManager.playBgm(this.getCurrentBGM());
};
Xs_BattleControl.prototype.setupAction = function() {
    var action1 = null;
    if (this.leftBattler()) action1 = new Game_Action(this.leftBattler());
    var action2 = new Game_Action(this.rightBattler());
    action1 && action1.setItemObject(this._battlerData1.item);
    action2.setItemObject(this._battlerData2.item);
    action1 && action1.setXsTarget(this.rightBattler());
    var target = this.leftBattler() || this.rightBattler();
    action2.setXsTarget(target);
    action1 && this.leftBattler().addXsAction(action1);
    this.rightBattler().addXsAction(action2);
    action1 && this.leftBattler().onBattleStart();
    this.rightBattler().onBattleStart();
    this._battlerArray = [];
    this._battlerArray[0] = this._forerunner === 'left' ? this.leftBattler() : this.rightBattler();
    this._battlerArray[1] = this._forerunner === 'left' ? this.rightBattler() : this.leftBattler();
    this._damageData = {'left':0,'right':0};
};
Xs_BattleControl.prototype.leftBattler = function() {
    if (!this._battlerData1) return null;
    return this._battlerData1.obj.xsBattler();
};
Xs_BattleControl.prototype.rightBattler = function() {
    return this._battlerData2.obj.xsBattler();
};
Xs_BattleControl.prototype.createBattlerSprite = function() {
    this._battlerSprites = [];
    if (this.leftBattler()) {
        this._battlerSprites[0] = new Sprite_Actor(this.leftBattler(), true);
        this._battleField.addChild(this._battlerSprites[0]);
    }
    this._battlerSprites[1] = new Sprite_Actor(this.rightBattler());
    this._battleField.addChild(this._battlerSprites[1]);
    var n = this._forerunner === 'left' ? 1 : 0;
    this._battlerSprites[n] && this._battlerSprites[n].hide();
};
Xs_BattleControl.prototype.createAllWindows = function() {
    if (this._battlerData1) {
        this._leftState  = new Xs_WindowBattleState('left', this._battlerData1);
        this.addChild(this._leftState);
    }
    var height = Window_Base.prototype.fittingHeight(10); 
    this._rightState = new Xs_WindowBattleState('right', this._battlerData2);
    this._logWindow  = new Window_BattleLog(new Rectangle(0,0,Graphics.boxWidth,height));
    this._rstWindow  = new Xs_WindowBattleResult();
    this._logWindow.setSpriteset(this);
    this.addChild(this._rightState);
    this.addChild(this._logWindow);
    this.addChild(this._rstWindow);
    this._leftState && this._leftState.setup();
    this._rightState.setup();
};
Xs_BattleControl.prototype.removeAllWindows = function() {
    this._battleField.removeChild(this._battlerSprites[0]);
    this._battleField.removeChild(this._battlerSprites[1]);
    this.removeChild(this._leftState);
    this.removeChild(this._rightState);
    this.removeChild(this._logWindow);
    this.removeChild(this._rstWindow);
    this._rstWindow = null;
    this._logWindow = null;
    this._leftState = null;
    this._rightState = null;
    this._damageData = null;
    this._battlerSprites = [];
};
Xs_BattleControl.prototype.linkage = function(type) {
    if (type === 'left') this._rightState.moveIn();
    if (type === 'right' && this._leftState) this._leftState.moveIn();
    var sprite = this._battlerSprites[type === 'left' ? 1 : 0];
    sprite && sprite.show();
};
Xs_BattleControl.prototype.refreshStatus = function() {
    this._leftState && this._leftState.refresh();
    this._rightState.refresh();
};
Xs_BattleControl.prototype.isAnimationPlaying = function() {
    return this._animationSprites.length > 0;
};
Xs_BattleControl.prototype.isAnyoneMoving = function() {
    if (this._battlerSprites[0] && this._battlerSprites[0].isMoving()) return true;
    return this._battlerSprites[1].isMoving();
};
Xs_BattleControl.prototype.isEffecting = function() {
    if (this._battlerSprites[0] && this._battlerSprites[0].isEffecting()) return true;
    return this._battlerSprites[1].isEffecting();
};
Xs_BattleControl.prototype.isBusy = function() {
    if (this._logWindow.isBusy() || this._rstWindow.isBusy()) return true;
    return this.isAnimationPlaying() || this.isEffecting() || this.isAnyoneMoving();
};
Xs_BattleControl.prototype.startTurn = function() {
    this._phase = 'turn';
};
Xs_BattleControl.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    if (this.visible && !this.isBusy()) {
        this['update_'+this._phase] && this['update_'+this._phase]();
    }
};
Xs_BattleControl.prototype.selectNextSubject = function() {
    if (!this._battlerArray.length) return null;
    var subject = this._battlerArray.shift();
    if (!subject || !subject.isAlive() || subject.isAvoid()) return null;
    return subject;
};
Xs_BattleControl.prototype.update_turn = function() {
    if (this._subject) this._logWindow._waitCount = 60;
    while (!this._subject && this._battlerArray.length > 0) {
        this._subject = this.selectNextSubject();
    }
    if (!this._subject) this.displayResult();
    else this.startAction();
};
Xs_BattleControl.prototype.update_action = function() {
    var target = this._action.makeTargets()[0];
    var lastHp = target.hp;
    this.invokeAction(this._subject, target);
    var type = this._subject === this.leftBattler() ? 'left' : 'right';
    this._damageData[type] += (lastHp - target.hp);
    if (target.isDead()) this._damageData.gold = target.xsGold();
    this._logWindow.endAction(this._subject);
    this._subject = null;
    this.startTurn();
};
Xs_BattleControl.prototype.startAction = function() {
    this._phase = 'action';
    this._logWindow.push('pushBaseLine');
    this._action = this._subject.currentAction();
    var target = this._action.makeTargets()[0];
    this._subject.useItem(this._action.item());
    this._action.applyGlobal();
    this._logWindow.startAction(this._subject, this._action, [target]);
};
Xs_BattleControl.prototype.displayResult = function() {
    var actor = this.leftBattler() && this.leftBattler().camp === 0 ? this.leftBattler() : this.rightBattler();
    if (actor.isAlive() && actor.camp === 0) {
        var type = actor === this.leftBattler() ? 'left' : 'right';
        var target = type === 'left' ? this.rightBattler() : (this.leftBattler() || this.rightBattler());
        var exp = target.xsExp(this._damageData[type], actor.level);
        var gold = this._damageData.gold || 0;
        var data = {'actor':actor,'exp':exp,'gold':gold};
        this._rstWindow.display(data);
    } else this._logWindow._waitCount = 60;
    this._phase = 'end';
};
Xs_BattleControl.prototype.update_end = function() {
    this.finish();
};
Xs_BattleControl.prototype.invokeAction = function(subject, target) {
    BattleManager.invokeAction.call(this, subject, target);
};
Xs_BattleControl.prototype.invokeNormalAction = function(subject, target) {
    BattleManager.invokeNormalAction.call(this, subject, target);
};
Xs_BattleControl.prototype.invokeCounterAttack = function(subject, target) {
    BattleManager.invokeCounterAttack.call(this, subject, target);
};
Xs_BattleControl.prototype.invokeMagicReflection = function(subject, target) {
	BattleManager.invokeMagicReflection.call(this, subject, target);
};
Xs_BattleControl.prototype.applySubstitute = function(target) {
    return target;
};
Xs_BattleControl.prototype.findTargetSprite = function(target) {
    return this._battlerSprites.find(sprite => sprite && sprite.checkBattler(target));
};
//=================================================================================================
// 地图网格
//=================================================================================================
function Sprite_MapGrid() {
    this.initialize.apply(this, arguments);
}
Sprite_MapGrid.prototype = Object.create(Sprite.prototype);
Sprite_MapGrid.prototype.constructor = Sprite_MapGrid;
Sprite_MapGrid.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.anchor = new Point(1, 1);
    var width = $gameMap.tileWidth() * $gameMap.width();
    var height = $gameMap.tileHeight() * $gameMap.height();
    this.bitmap = new Bitmap(width, height);
    this.drawGrid();
    this.z = 0;
};
Sprite_MapGrid.prototype.LineColor = function() {
    return 'rgba(0,0,0,0.5)';
};
Sprite_MapGrid.prototype.drawGrid = function() {
    for (var i=0;i<$gameMap.width();++i) {
        var x = i * $gameMap.tileWidth();
        var h = this.bitmap.height;
        this.bitmap.fillRect(x, 0, 1, h, this.LineColor());
    }
    for (var i=0;i<$gameMap.height();++i) {
        var y = i * $gameMap.tileHeight();
        var w = this.bitmap.width;
        this.bitmap.fillRect(0, y, w, 1, this.LineColor());
    }
};
Sprite_MapGrid.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.visible = $gameSystem.isXsGridDisplay();
    if (this.visible) {
        this.x = this.width + $gameMap.tileWidth() * $gameMap.adjustX(0);
        this.y = this.height + $gameMap.tileHeight() * $gameMap.adjustY(0);
    }
};
//=================================================================================================
// 设置窗口的子项目
//=================================================================================================
function Sprite_OptionsItem() {
    this.initialize.apply(this, arguments);
}
Sprite_OptionsItem.prototype = Object.create(Sprite.prototype);
Sprite_OptionsItem.prototype.constructor = Sprite_OptionsItem;
Sprite_OptionsItem.prototype.initialize = function(index) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(160, 36);
    this.bitmap.fontSize = 26;
    this._index = index;
    this.createButtons();
};
Sprite_OptionsItem.prototype.createButtons = function() {
    this._buttonL = new Xs_OptionsButton(0, 18, 'left');
    this._buttonR = new Xs_OptionsButton(this.width, 18, 'right');
    this._buttonL.setPressMethod(this.onLeftButtonPress.bind(this));
    this._buttonR.setPressMethod(this.onRightButtonPress.bind(this));
    this.addChild(this._buttonL);
    this.addChild(this._buttonR);
};
Sprite_OptionsItem.prototype.setupPosition = function() {
    var rect = this.parent.itemRect(this._index);
    this.move(rect.x+460,rect.y+10);
};
Sprite_OptionsItem.prototype.refresh = function() {
    this.bitmap.clear();
    this.bitmap.drawText(this.parent.itemText(this._index),30,0,100,36,'center');
};
Sprite_OptionsItem.prototype.isActive = function() {
    return this.parent.isActive() && this.parent._index === this._index;
};
Sprite_OptionsItem.prototype.onLeftButtonPress = function() {
    this.parent.inputOnLeft();
};
Sprite_OptionsItem.prototype.onRightButtonPress = function() {
    this.parent.inputOnRight();
};
//=================================================================================================
// 地图上的光标
//=================================================================================================
function Sprite_XsCursor() {
    this.initialize.apply(this, arguments);
}
Sprite_XsCursor.prototype = Object.create(Sprite.prototype);
Sprite_XsCursor.prototype.constructor = Sprite_XsCursor;
Sprite_XsCursor.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.anchor = new Point(0.5, 0.5);
    var w = $gameMap.tileWidth() - 2;
    var h = $gameMap.tileHeight() - 2;
    this.bitmap = new Bitmap(w, h);
    this._dirWait = 0;
    this._actionCount = 0;
    this.drawCursor();
    this.setupInitialCoordinate();
    this.z = 1;
};
Sprite_XsCursor.prototype.drawCursor = function() {
    var nw = this.bitmap.width / 4;
    var nh = this.bitmap.height / 4;
    this.bitmap.fillAll('rgb(0,0,0');
    this.bitmap.fillRect(1,1,this.bitmap.width-2,this.bitmap.height-2,'rgb(255,255,255');
    this.bitmap.fillRect(4,4,this.bitmap.width-8,this.bitmap.height-8,'rgb(0,0,0');
    this.bitmap.clearRect(6, 6,this.bitmap.width-12,this.bitmap.height-12);
    this.bitmap.clearRect(0, nh,this.bitmap.width,this.bitmap.height-nh*2);
    this.bitmap.clearRect(nw, 0,this.bitmap.width-nw*2,this.bitmap.height);
};
Sprite_XsCursor.prototype.setMoveCheck = function(check) {
    this._moveCheck = check;
};
Sprite_XsCursor.prototype.setAttackCheck = function(check) {
    this._attackCheck = check;
};
Sprite_XsCursor.prototype.setupInitialCoordinate = function() {
    var point = $gameSystem.getXsInitialCod();
    this.moveCoordinate(point, true);
};
Sprite_XsCursor.prototype.moveCoordinate = function(point, mute, mod) {
    if (!this.isSamePoint(point) && this.canMove() && point) {
        !mute && this._coordinate && SoundManager.playCursor();
        this._coordinate = point;
        this._dataX = point.x * $gameMap.tileWidth();
        this._dataY = point.y * $gameMap.tileHeight();
        this.refreshBattlerInfo(true);
        this.center(mod);
    }
};
Sprite_XsCursor.prototype.moveDirection = function(d) {
    var p = JsonEx.makeDeepCopy(this._coordinate);
    p.x += d === 4 ? -1 : (d === 6 ? 1 : 0);
    p.y += d === 8 ? -1 : (d === 2 ? 1 : 0);
    p.x = Math.max(0, Math.min(p.x, $gameMap.width()-1));
    p.y = Math.max(0, Math.min(p.y, $gameMap.height()-1));
    this.moveCoordinate(p, false, 'scroll');
    this._dirWait = 8;
};
Sprite_XsCursor.prototype.moveTarget = function(target) {
    if (!target) return;
    this.moveCoordinate(new Point(target.x, target.y), true);
};
Sprite_XsCursor.prototype.refreshBattlerInfo = function(state) {
    if (!this._coordinate) return;
    var target = state ? this.xsUnit() : null;
    Xs_Manager.refreshInfoWindow(target);
};
Sprite_XsCursor.prototype.startUnitCommand = function(state) {
    if (!this._coordinate) return;
    var target = state ? this.xsUnit() : null;
    Xs_Manager.startCommand(target);
};
Sprite_XsCursor.prototype.xsUnit = function() {
    if (!this._coordinate) return null;
    return $gameMap.xsAliveUnit(this._coordinate.x, this._coordinate.y);
};
Sprite_XsCursor.prototype.center = function(mod) {
    if (!this.visible) return;
    var sx = this._coordinate.x - Game_Player.prototype.centerX.call(this);
    var sy = this._coordinate.y - Game_Player.prototype.centerY.call(this);
    if (mod === 'scroll') $gameMap.startXsScroll(sx, sy);
    else $gameMap.setDisplayPos(sx, sy);
};
Sprite_XsCursor.prototype.isSamePoint = function(p) {
    if (!this._coordinate || !p) return false;
    return this._coordinate.x === p.x && this._coordinate.y === p.y;
};
Sprite_XsCursor.prototype.scrollSelect = function() {
    var index = -1;
    var unit = this.xsUnit();
    if (unit && unit.isXsEffective() && unit.camp() === Xs_Manager.playerCamp()) {
        index = unit.xsIndex();
    }
    this.moveTarget($gameMap.scrollXsUnit(index));
};
Sprite_XsCursor.prototype.selectPlayerLeader = function() {
    var camp = Xs_Manager.playerCamp();
    this.moveTarget($gameMap.getXsLeader(camp));
};
Sprite_XsCursor.prototype.show = function() {
    Sprite.prototype.show.call(this);
    this.center();
};
Sprite_XsCursor.prototype.onInputOk = function() {
    if (this._moveCheck && this._moveCheck.visible) {
        this._moveCheck.inputOnOk(this._coordinate);
    }else if (this._attackCheck && this._attackCheck.visible) {
        this._attackCheck.inputOnOk(this._coordinate);
    }else this.startUnitCommand(true);
};
Sprite_XsCursor.prototype.onInputCancel = function() {
    if (this._moveCheck && this._moveCheck.visible) {
        return this._moveCheck.inputOnCancel();
    }
    if (this._attackCheck && this._attackCheck.visible) {
        return this._attackCheck.inputOnCancel();
    }
};
Sprite_XsCursor.prototype.canMove = function() {
    return !$gameTemp.isXsCursorLocking() && !this._dirWait;
};
Sprite_XsCursor.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateDirWait();
    if (this.visible) {
        this.updateTwinkle();
        this.updatePosition();
        this.updateInput();
        this.updateScrollSelect();
    }
};
Sprite_XsCursor.prototype.updateDirWait = function() {
    if (this._dirWait) this._dirWait--;
    this.visible = Xs_Manager.isRuning();
};
Sprite_XsCursor.prototype.updateTwinkle = function() {
    this._actionCount = (this._actionCount+1) % 60;
    this.opacity += this._actionCount < 30 ? -5 : 5;
};
Sprite_XsCursor.prototype.updatePosition = function() {
    var x = this._dataX - $gameMap.displayX() * $gameMap.tileWidth() + $gameMap.tileWidth() / 2;
    var y = this._dataY - $gameMap.displayY() * $gameMap.tileHeight() + $gameMap.tileHeight() / 2;
    this.move(x, y);
};
Sprite_XsCursor.prototype.updateInput = function() {
    if (!Xs_Manager.canControlCursor()) return;
    if (this.canMove() && Input.dir4 > 0) this.moveDirection(Input.dir4);
    if (Input.isTriggered('ok')) return this.onInputOk();
    if (Xs_WindowBase.prototype.isSomeCanceled.call(this)) return this.onInputCancel();
    if (TouchInput.isTriggered()) {
        var p = new Point(TouchInput.coordinateX(), TouchInput.coordinateY());
        this.isSamePoint(p) ? this.onInputOk() : this.moveCoordinate(p, false, 'scroll');
    }
};
Sprite_XsCursor.prototype.updateScrollSelect = function() {
    if (!Xs_Manager.isPlayerRound()) return;
    if (!Xs_Manager.canControlCursor()) return;
    if (this._moveCheck && this._moveCheck.visible) return;
    if (this._attackCheck && this._attackCheck.visible) return;
    if (Input.isTriggered('pageup')) this.scrollSelect();
};
//=================================================================================================
// 单位头顶的阵营标志
//=================================================================================================
function Sprite_XsCampSign() {
    this.initialize.apply(this, arguments);
}
Sprite_XsCampSign.prototype = Object.create(Sprite.prototype);
Sprite_XsCampSign.prototype.constructor = Sprite_XsCampSign;
Sprite_XsCampSign.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.anchor = new Point(0.5, 1);
    this.bitmap = new Bitmap(14, 20);
    this._actionCount = 0;
    this._waitCount = Math.randomInt(60);
};
Sprite_XsCampSign.prototype.isEffectiveParent = function() {
    if (!$gameSystem.isXsCampDisplay()) return false;
    if (!this.parent || !this.parent._character) return false;
    if (!this.parent._character.isXsEffective()) return false;
    return this.parent._character.camp() !== null;
};
Sprite_XsCampSign.prototype.isOnDisplay = function() {
    return Xs_Manager.isRuning() && this.isEffectiveParent();
};
Sprite_XsCampSign.prototype.isCampChanged = function() {
    return this._lastCamp !== this.parent._character.camp();
};
Sprite_XsCampSign.prototype.refresh = function() {
    if (!this.isEffectiveParent()) return;
    this.bitmap.clear();
    var context = this.bitmap._context;
    this._lastCamp = this.parent._character.camp();
    context.fillStyle = XdRsData.SRPG.campColor(this._lastCamp);
    context.beginPath();
    context.moveTo(7, 0);
    context.lineTo(14, 4);
    context.lineTo(7, 20);
    context.lineTo(0, 4);
    context.lineTo(7, 0);
    context.fill();
    context.moveTo(0, 4);
    context.lineTo(7, 8);
    context.lineTo(14, 4);
    context.moveTo(7, 8);
    context.lineTo(7, 20);
    context.stroke();
    context.closePath();
    context.restore();
    this.bitmap._setDirty();
};
Sprite_XsCampSign.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateState();
    this.updateAction();
};
Sprite_XsCampSign.prototype.updateState = function() {
    this.visible = this.isOnDisplay();
    if (this.visible) {
        this.isCampChanged() && this.refresh();
    }
};
Sprite_XsCampSign.prototype.updateAction = function() {
    if (!this.visible) return;
    if (this._waitCount) this._waitCount--;
    else {
        this._actionCount = (this._actionCount+1) % 120;
        this.y += (this._actionCount < 60 ? -0.1 : 0.1);
    }
};
//=================================================================================================
// 小地图上单位的标志部件（圆形标志）
//=================================================================================================
function Sprite_XsMiniMapPart() {
    this.initialize.apply(this, arguments);
}
Sprite_XsMiniMapPart.prototype = Object.create(Sprite.prototype);
Sprite_XsMiniMapPart.prototype.constructor = Sprite_XsMiniMapPart;
Sprite_XsMiniMapPart.prototype.initialize = function(obj, scale) {
    Sprite.prototype.initialize.call(this);
    this._obj = obj;
    var size = Math.min($gameMap.tileWidth(), $gameMap.tileHeight());
    this.bitmap = new Bitmap(size, size);
    this.scale = new Point(scale, scale);
    this.anchor = new Point(0.5, 0.5);
    this.refreshState();
    this.hide();
};
Sprite_XsMiniMapPart.prototype.refresh = function() {
    this.bitmap.clear();
    this._lastCamp = this._obj.camp();
    var color = XdRsData.SRPG.campColor(this._lastCamp);
    var r = this.width / 2;
    var arr = [100,100,100];
    for (var i=0;i<10;++i) {
        var lineColor = 'rgb('+arr.join()+')';
        this.bitmap.drawCircle(this.width / 2, this.width / 2, r, lineColor);
        arr = arr.map(function(n){return n-10;});
        r--;
    }
    this.bitmap.drawCircle(this.width / 2, this.width / 2, r, color);
};
Sprite_XsMiniMapPart.prototype.isEffectiveObj = function() {
    return this._obj.isXsEffective();
};
Sprite_XsMiniMapPart.prototype.isCampChanged = function() {
    return this._lastCamp !== this._obj.camp();
};
Sprite_XsMiniMapPart.prototype.feedbackData = function() {
    return [this._obj.xsBattler().name(), this._obj.camp()];
};
Sprite_XsMiniMapPart.prototype.refreshState = function() {
    this.visible = Xs_Manager.isRuning() && this.isEffectiveObj();
    if (this.visible) {
        this.isCampChanged() && this.refresh();
        this.x = (this._obj.x * $gameMap.tileWidth() + $gameMap.tileWidth() / 2) * this.scale.x;
        this.y = (this._obj.y * $gameMap.tileHeight() + $gameMap.tileHeight() / 2) * this.scale.y;
    }
};
Sprite_XsMiniMapPart.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateTouch();
};
Sprite_XsMiniMapPart.prototype.updateTouch = function() {
    if (!this.visible || !this.parent.isActive()) return;
    if (TouchInput.isTriggered()) {
        this.isTouch() && this.parent.selectTarget(this._obj);
    }
};
//=================================================================================================
// 移动范围的格子
//=================================================================================================
function Sprite_MoveDisplay() {
    this.initialize.apply(this, arguments);
}
Sprite_MoveDisplay.prototype = Object.create(Sprite.prototype);
Sprite_MoveDisplay.prototype.constructor = Sprite_MoveDisplay;
Sprite_MoveDisplay.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.anchor = new Point(0.5, 0.5);
    this.hide();
    this.z = 0;
};
Sprite_MoveDisplay.prototype.hide = function() {
    this._obj = null;
    this._dataPoints = null;
    this.bitmap && this.bitmap.clear();
    Sprite.prototype.hide.call(this);
};
Sprite_MoveDisplay.prototype.isContainsCod = function(point) {
    if (!this._obj || !this._dataPoints) return false;
    return this._dataPoints.some(function(p){
        return (p.x + this._obj.x) === point.x && (p.y + this._obj.y) === point.y;
    }, this);
};
Sprite_MoveDisplay.prototype.inputOnOk = function(point) {
    if (!this.isContainsCod(point)) return SoundManager.playBuzzer();
    SoundManager.playOk();
    this._obj.setXsMovePoint(point);
    this.hide();
};
Sprite_MoveDisplay.prototype.inputOnCancel = function() {
    SoundManager.playCancel();
    $gameTemp.setXsCursorLocked(false);
    Xs_Manager.selectTarget(this._obj);
    Xs_Manager.startCommand(this._obj, true, true);
    Xs_Manager.wait(8);
    this.hide();
};
Sprite_MoveDisplay.prototype.checkWidth = function() {
    return $gameMap.tileWidth();
};
Sprite_MoveDisplay.prototype.checkHeight = function() {
    return $gameMap.tileHeight();
};
Sprite_MoveDisplay.prototype.radius = function() {
    return this._obj.xsBattler().xsMoveDistance();
};
Sprite_MoveDisplay.prototype.display = function(obj) {
    if (!obj || !obj.isXsEffective()) return false;
    this._obj = obj;
    this._dataPoints = [];
    var width = this.checkWidth() * (this.radius() * 2 + 1);
    var height = this.checkHeight() * (this.radius() * 2 + 1);
    this.bitmap = new Bitmap(width, height);
    this.drawCheck(0, 0, this.radius() + 1);
    this.updatePosition();
    this.show();
    return true;
};
Sprite_MoveDisplay.prototype.isDepicted = function(sx, sy) {
    if (sx === 0 && sy === 0) return true;
    if (this._dataPoints.some(function(p) {
        return p.x === sx && p.y === sy;
    })) return true;
    if (!$gameMap.isValid(this._obj.x+sx, this._obj.y+sy)) return true;
    var units = $gameMap.xsUnits(this._obj.x+sx, this._obj.y+sy);
    if (units.some(function(u){return u.isXsEffective();})) return true;
    return false;
};
Sprite_MoveDisplay.prototype.getNearestPointBy = function(point) {
    if (!this.visible || !point) return null;
    var ox = this._obj.x, oy = this._obj.y;
    var p = this._dataPoints.sort(function(a, b){
        var d1 = $gameMap.distance(a.x+ox, a.y+oy, point.x, point.y);
        var d2 = $gameMap.distance(b.x+ox, b.y+oy, point.x, point.y);
        return d1 - d2;
    })[0];
    return p ? new Point(p.x+ox, p.y+oy) : null;
};
Sprite_MoveDisplay.prototype.getNearestPointOnly = function(obj, x, y) {
    this.display(obj);
    var point = this.getNearestPointBy(new Point(x, y));
    this.hide();
    return point;
};
Sprite_MoveDisplay.prototype.attenuationValue = function(sx, sy, d) {
    var x = this._obj.x + sx, y = this._obj.y + sy;
    return this._obj.xsTerrainAttenuationValue(x, y, d);
};
Sprite_MoveDisplay.prototype.checkColor = function() {
    return XdRsData.SRPG.color('MV', 0.5);
};
Sprite_MoveDisplay.prototype.getNeighbor = function(x, y, n) {
    var arr = [
        [x, y + 1, n - this.attenuationValue(x, y, 2)],
        [x - 1, y, n - this.attenuationValue(x, y, 4)],
        [x + 1, y, n - this.attenuationValue(x, y, 6)],
        [x, y - 1, n - this.attenuationValue(x, y, 8)]
    ];
    return arr.filter(function(sp){
        return this.isNotInList(sp);
    }, this);
};
Sprite_MoveDisplay.prototype.isNotInList = function(sp) {
    return !this._openList.some(function(p){
        return p[0] === sp[0] && p[1] === sp[1];
    }) && !this._closedList.some(function(p){
        return p[0] === sp[0] && p[1] === sp[1];
    });
};
Sprite_MoveDisplay.prototype.drawCheck = function (ox, oy, on) {
    this._openList = [[ox, oy, on]];
    this._closedList = [];
    while (this._openList.length > 0) {
      this._openList.sort(function(a, b){return b[2] - a[2]});
      var p = this._openList.shift();
      this.helper(p);
      this._closedList.push(p);
    }
    this._closedList.length = 0;
};
Sprite_MoveDisplay.prototype.helper = function(p) {
    var x = p[0], y = p[1], n = p[2];
    if (n <= 0) return;
    this._openList = this._openList.concat(this.getNeighbor(x, y, n));
    if (this.isDepicted(x, y)) return;
    var bx = this.bitmap.width / 2 + this.checkWidth() * (x - 0.5) + 2;
    var by = this.bitmap.height / 2 + this.checkHeight() * (y - 0.5) + 2;
    var bw = this.checkWidth() - 4;
    var bh = this.checkHeight() - 4;
    this.bitmap.fillRoundRect(bx, by, bw, bh, 5, 1, "rgba(0,0,0,0.5)", this.checkColor());
    this._dataPoints.push(new Point(x, y));
};
Sprite_MoveDisplay.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.visible && this.updatePosition();
};
Sprite_MoveDisplay.prototype.updatePosition = function() {
    this.x = this._obj.screenX();
    this.y = this._obj.screenY() - $gameMap.tileHeight() / 3 - 2;
};
//=================================================================================================
// 攻击范围格子（包括使用物品，劝降）
//=================================================================================================
function Sprite_AttackDisplay() {
    this.initialize.apply(this, arguments);
}
Sprite_AttackDisplay.prototype = Object.create(Sprite_MoveDisplay.prototype);
Sprite_AttackDisplay.prototype.constructor = Sprite_AttackDisplay;
Sprite_AttackDisplay.prototype.display = function(obj, item) {
    this._obj = obj;
    this._item = item;
    this._isDisplaySign = true;
    if (XdRsData.SRPG.isSpecialMapGun(item)) {
        this._direction = 0;
        var size = this.maxMapGunSize();
        this.bitmap = new Bitmap(size, size);
        this.refreshMapGunDisplay();
        this.show();
    } else {
        if (XdRsData.SRPG.isPlainMapGun(item)) this._displayStep = 0;
        Sprite_MoveDisplay.prototype.display.call(this, obj);
    }
    if (this._obj && this._item && !XdRsData.SRPG.isMapGun(this._item)) {
        $gameMap.startXsStandbySign(this._obj, this._item);
    }
};
Sprite_AttackDisplay.prototype.hide = function() {
    Sprite_MoveDisplay.prototype.hide.call(this);
    if (this._isDisplaySign) {
        this._isDisplaySign = false;
        $gameMap.renewXsStandbySign();
    }
    $gameTemp.setXsCursorLocked(false);
    this._displayStep = null;
};
Sprite_AttackDisplay.prototype.minRadius = function() {
    return XdRsData.SRPG.minItemRange(this._item);
};
Sprite_AttackDisplay.prototype.radius = function() {
    return XdRsData.SRPG.maxItemRange(this._item);
};
Sprite_AttackDisplay.prototype.isItemForOpponent = function() {
    if (this._item === 'itc') return true;
    return XdRsData.SRPG.isForOpponent(this._item);
};
Sprite_AttackDisplay.prototype.isPointEffective = function(x, y) {
    if (!this._item) return false;
    var unit = $gameMap.xsAliveUnit(x, y);
    if (!unit) return true;
    var type = unit.xsBattler().xsSpaceType();
    if (type === 0 && this._item.meta.NoAE) return false;
    if (type === 1 && this._item.meta.NoAA) return false;
    if (type === 2 && unit.terrainTag() === 2 && this._item.meta.NoAS) return false;
    if (!!this._item.meta.XsWhole) return true;
    if (this._obj.isXsAlly(unit)) return XdRsData.SRPG.isForFriend(this._item);
    else return XdRsData.SRPG.isForOpponent(this._item);
};
Sprite_AttackDisplay.prototype.refreshStandbySign = function(ox, oy) {
    if (!this._dataPoints) return;
    var points = this._dataPoints;
    if (XdRsData.SRPG.isSpecialMapGun(this._item)) {
        points = this._dataPoints.map(function(p){
            return XdRsData.SRPG.getRealPointByDirection(p, this._direction);
        }, this);
    }
    $gameMap.startXsStandbySignByPoints(points, ox, oy);
};
Sprite_AttackDisplay.prototype.checkColor = function() {
    var sym = this.isItemForOpponent() ? 'AT' : 'RV';
    return XdRsData.SRPG.color(sym, 0.5);
};
Sprite_AttackDisplay.prototype.inputOnOk = function(point, mute) {
    point = point || Xs_Manager.cursorCoordinate();
    if (this.isMapGunDisplay()) return this.setMapGunAction(point, mute);
    if (XdRsData.SRPG.isPlainMapGun(this._item)) return this.onPlainMapGunOk(point, mute);
    if (!this.isContainsCod(point)) {
        !mute && SoundManager.playBuzzer();
        return false;
    }
    var target = $gameMap.xsAliveUnit(point.x, point.y);
    if (!this._obj.xsCanUse(this._item, target)){
        !mute && SoundManager.playBuzzer();
        return false;
    }
    !mute && SoundManager.playOk();
    if (this._item === 'itc') target.startITC(this._obj);
    else {
        if (this.isFightingOnMap([target])) return this.startFightingOnMap([target], point);
        var data1 = this._obj.makeXsBattleData(null, this._item, false);
        var data2 = target.makeXsBattleData(this._obj, 0, true);
        Xs_Manager.displayDuel(data1, data2, this._obj.isXsPlayer());
    }
    this.hide();
    return true;
};
Sprite_AttackDisplay.prototype.onPlainMapGunOk = function(point, mute) {
    if (!this._displayStep) {
        if (!this.isContainsCod(point)) return SoundManager.playBuzzer();
        !mute && SoundManager.playOk();
        this._displayStep = 1;
        $gameTemp.setXsCursorLocked(true);
        this.displyBlastRange(point);
    } else {
        $gameTemp.setXsCursorLocked(false);
        this.setMapGunAction(point, mute);
    }
};
Sprite_AttackDisplay.prototype.setMapGunAction = function(point, mute) {
    !mute && SoundManager.playOk();
    var targets = [];
    var obj = XdRsData.SRPG.isPlainMapGun(this._item) ? point : this._obj;
    for (var i=0;i<this._dataPoints.length;++i) {
        var p = this._dataPoints[i];
        if (XdRsData.SRPG.isSpecialMapGun(this._item)) {
            p =  XdRsData.SRPG.getRealPointByDirection(p, this._direction);
        }
        var target = $gameMap.xsAliveUnit(p.x+obj.x, p.y+obj.y);
        target && targets.push(target);
    }
    if (XdRsData.SRPG.isSpecialMapGun(this._item)) {
        $gameTemp.setXsAnmDirection(this._obj.direction());
    }
    this.startFightingOnMap(targets, point);
};
Sprite_AttackDisplay.prototype.isFightingOnMap = function(targets) {
    if (XdRsData.SRPG.isFightOnMapOnly()) return true;
    if (targets.length > 1) return true;
    if (XdRsData.SRPG.isMapGun(this._item)) return true;
    return false;
};
Sprite_AttackDisplay.prototype.startFightingOnMap = function(targets, point) {
    this._obj.turnTowardCharacter(point);
    var action = new Game_Action(this._obj.xsBattler());
    action.setItemObject(this._item);
    this._obj.xsBattler().addXsAction(action);
    Xs_Manager.startAction(this._obj, targets, point);
    this.hide();
};
Sprite_AttackDisplay.prototype.drawOriginSign = function() {
    var color = XdRsData.SRPG.color('MV', 0.8);
    var bx = this.bitmap.width / 2 - this.checkWidth() / 2 + 2;
    var by = this.bitmap.height / 2 - this.checkHeight() / 2 + 2;
    var bw = this.checkWidth() - 4, bh = this.checkHeight() - 4;
    this.bitmap.fillRect(bx,by,bw,bh,'rgb(0,0,0)');
    this.bitmap.fillRect(bx+2,by+2,bw-4,bh-4,color);
    this.bitmap.fillRect(bx+4,by+4,bw-8,bh-8,'rgb(0,0,0)');
    this.bitmap.clearRect(bx+6,by+6,bw-12,bh-12);
    this.drawOriginArrow(bx - this.checkWidth(), by, 'left');
    this.drawOriginArrow(bx + this.checkWidth(), by, 'right');
    this.drawOriginArrow(bx, by - this.checkHeight(), 'up');
    this.drawOriginArrow(bx, by + this.checkHeight(), 'down');
};
Sprite_AttackDisplay.prototype.drawOriginArrow = function(x, y, type) {
    var color = XdRsData.SRPG.color('MV', 0.8);
    var bw = this.checkWidth() / 2, bh = this.checkHeight() / 2;
    var sw = bw / 2, sh = bh / 2;
    x = type === 'left' ? x + bw - 4 : (type === 'right' ? x + 2 : x + sw - 2);
    y = type === 'up' ? y + bh - 4 : (type === 'down' ? y + 2 : y + sh - 2);
    this.bitmap.drawArrow(x, y, bw, bh, color, type);
};
Sprite_AttackDisplay.prototype.drawCheck = function() {
    var min = -this.radius();
    var max = this.radius() + 1;
    for (var x=min;x<max;++x) {
        for (var y=min;y<max;++y) {
            var distance = Math.abs(x) + Math.abs(y);
            var result = !this.isItemForOpponent() && x === 0 && y === 0;
            if (distance > this.radius() || distance < this.minRadius() && !result) continue;
            var bx = this.bitmap.width / 2 + this.checkWidth() * (x - 0.5) + 2;
            var by = this.bitmap.height / 2 + this.checkHeight() * (y - 0.5) + 2;
            var bw = this.checkWidth() - 4, bh = this.checkHeight() - 4;
            this.bitmap.fillRoundRect(bx,by,bw,bh,5,1,'rgba(0,0,0,0.5)',this.checkColor());
            this._dataPoints.push(new Point(x, y));
        }
    }
    this.drawOriginSign();
};
Sprite_AttackDisplay.prototype.displyBlastRange = function(point) {
    var px = point.x, py = point.y;
    this._dataPoints.length = 0;
    this.x = ($gameMap.adjustX(point.x) + 0.5) * $gameMap.tileWidth();
    this.y = ($gameMap.adjustY(point.y) + 0.5) * $gameMap.tileHeight();
    var rmin = +(this._item.meta.XsMapGunRangeMin || 0);
    var rmax = +this._item.meta.XsMapGunRangeMax;
    var min = -rmax;
    var max = rmax + 1;
    var rw = rmax * 2 + 1;
    this.bitmap = new Bitmap(this.checkWidth() * rw, this.checkHeight() * rw);
    for (var x=min;x<max;++x) {
        for (var y=min;y<max;++y) {
            var distance = Math.abs(x) + Math.abs(y);
            if (distance > rmax || distance < rmin) continue;
            if (!this.isPointEffective(px+x, py+y)) continue;
            var bx = this.bitmap.width / 2 + this.checkWidth() * (x - 0.5) + 2;
            var by = this.bitmap.height / 2 + this.checkHeight() * (y - 0.5) + 2;
            var bw = this.checkWidth() - 4, bh = this.checkHeight() - 4;
            this.bitmap.fillRoundRect(bx,by,bw,bh,5,1,'rgba(0,0,0,0.5)',this.checkColor());
            this._dataPoints.push(new Point(x, y));
        }
    }
    this.refreshStandbySign(px, py);
};
Sprite_AttackDisplay.prototype.isMapGunDisplay = function() {
    return this.visible && XdRsData.SRPG.isSpecialMapGun(this._item);
};
Sprite_AttackDisplay.prototype.refreshMapGunDisplay = function() {
    this._dataCoordinate = Xs_Manager.cursorCoordinate();
    this._obj.turnTowardCharacter(this._dataCoordinate);
    if (this._direction !== this._obj.direction()) {
        this._direction = this._obj.direction();
        this._dataPoints = this._dataPoints || [];
        this._dataPoints = XdRsData.SRPG.getItemMapGunPoints(this._item).filter(function(p){
            var rp = XdRsData.SRPG.getRealPointByDirection(p, this._direction);
            return this.isPointEffective(rp.x + this._obj.x, rp.y + this._obj.y);
        }, this);
        this.drawMapGunChecks();
        this.refreshStandbySign(this._obj.x, this._obj.y);
    }
};
Sprite_AttackDisplay.prototype.maxMapGunSize = function() {
    var n = Math.max($gameMap.tileWidth(), $gameMap.tileHeight());
    var arr = this._item.xsMapGunData.join().split(',').map(function(n){return Math.abs(+n);});
    var mx = Math.max.apply(null, arr) * 2 + 1;
    return mx * n;
};
Sprite_AttackDisplay.prototype.drawMapGunChecks = function() {
    this.bitmap.clear();
    for (var i=0;i<this._dataPoints.length;++i) {
        var p = XdRsData.SRPG.getRealPointByDirection(this._dataPoints[i], this._direction);
        var bx = this.bitmap.width / 2 + this.checkWidth() * (p.x - 0.5) + 2;
        var by = this.bitmap.height / 2 + this.checkHeight() * (p.y - 0.5) + 2;
        var bw = this.checkWidth() - 4, bh = this.checkHeight() - 4;
        this.bitmap.fillRoundRect(bx,by,bw,bh,5,1,'rgba(0,0,0,0.5)',this.checkColor());
    }
    this.drawOriginSign();
};
Sprite_AttackDisplay.prototype.update = function() {
    Sprite_MoveDisplay.prototype.update.call(this);
    this.updateMapGunDisplayed();
};
Sprite_AttackDisplay.prototype.updateMapGunDisplayed = function() {
    if (!this.isMapGunDisplay()) return;
    !this.isSamePoint() && this.refreshMapGunDisplay();
};
Sprite_AttackDisplay.prototype.isSamePoint = function() {
    if (!this._dataCoordinate) return false;
    if (this._dataCoordinate.x !== Xs_Manager.cursorCoordinate().x) return false;
    if (this._dataCoordinate.y !== Xs_Manager.cursorCoordinate().y) return false;
    return true;
};
Sprite_AttackDisplay.prototype.updatePosition = function() {
    if (this._displayStep === 1) return;
    Sprite_MoveDisplay.prototype.updatePosition.call(this);
};
//=================================================================================================
// 血条
//=================================================================================================
function Sprite_XsHpBar() {
    this.initialize.apply(this, arguments);
}
Sprite_XsHpBar.prototype = Object.create(Sprite.prototype);
Sprite_XsHpBar.prototype.constructor = Sprite_XsHpBar;
Sprite_XsHpBar.prototype.initialize = function(battler) {
    Sprite.prototype.initialize.call(this);
    this.anchor = new Point(0.5, 1);
    this.bitmap = new Bitmap(50, 8);
    this.setBattler(battler);
};
Sprite_XsHpBar.prototype.setBattler = function(battler) {
    if (this._battler !== battler) {
        this._battler = battler;
        this.refresh(battler ? battler.hp : 0);
    }
    this.hide();
};
Sprite_XsHpBar.prototype.refresh = function(hp) {
    if (!this._battler) return;
    this._lastHp = hp;
    var fw = 46 * hp / this._battler.mhp;
    this.bitmap.fillRoundRect(2, 2, 48, 6, 3, 1, 'rgb(80,80,80)', 'rgb(0,0,0)');
    this.bitmap.fillRoundRect(3, 3, fw, 4, 2, 0, 'rgba(0,0,0,0)', 'rgb(180,0,0)');
    if (this._lastHp === this._battler.hp) this._waitCount = 150;
};
Sprite_XsHpBar.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateWait();
    this.updateHp();
};
Sprite_XsHpBar.prototype.updateWait = function() {
    if (!this._waitCount) return;
    this._waitCount--;
    !this._waitCount && this.hide();
};
Sprite_XsHpBar.prototype.updateHp = function() {
    if (!this._battler) return;
    if (this._lastHp !== this._battler.hp) {
        var n = this._battler.hp - this._lastHp;
        var add = Math.min(5, Math.abs(n));
        this._lastHp += n > 0 ? add : -add;
        this.refresh(this._lastHp);
        this.show();
    }
};
//=================================================================================================
// 投射类地图炮的移动单位。
//=================================================================================================
function Sprite_XsMapGunMobile() {
    this.initialize.apply(this, arguments);
}
Sprite_XsMapGunMobile.prototype = Object.create(Sprite_Base.prototype);
Sprite_XsMapGunMobile.prototype.constructor = Sprite_XsMapGunMobile;
Sprite_XsMapGunMobile.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.call(this);
    this._obj = new Rectangle();
    this.anchor = new Point(0.5, 0.5);
    this.bitmap = new Bitmap($gameMap.tileWidth(), $gameMap.tileHeight())
    this.finish();
}
Sprite_XsMapGunMobile.prototype.start = function(data) {
    this._data = data;
    this._step = 0;
    var anmId = +this._data.item.meta.XsMapGunMobileAnm;
    if (!anmId) this.playRangAnm();
    else{
        this._speed = 5;
        $gameTemp.requestLoopAnimation([this._obj], anmId);
        if (this._data.item.meta.XsMapGunMoveSpeed) {
            this._speed = +this._data.item.meta.XsMapGunMoveSpeed;
        }
        this._speed = Math.max(this._speed, 2);
        this.moveFromCoordinate(this._data.subject.x, this._data.subject.y);
    }
    this.show();
};
Sprite_XsMapGunMobile.prototype.finish = function() {
    this._data = null;
    this._step = 0;
    this.hide();
};
Sprite_XsMapGunMobile.prototype.onActionEnd = function() {
    this.finish();
    Xs_Manager._actionStep = 2;
};
Sprite_XsMapGunMobile.prototype.playRangAnm = function() {
    this._step = 1;
    Xs_Manager.removeLoopAnimation();
    Xs_Manager.selectTarget(this._data.point);
    this.moveFromCoordinate(this._data.point.x, this._data.point.y);
    var anmId = +this._data.item.meta.XsMapGunBlastAnm;
    if (!anmId) return this.onActionEnd();
    $gameTemp.requestAnimation([this._obj], anmId);
};
Sprite_XsMapGunMobile.prototype.moveFromCoordinate = function(x, y) {
    this.x = ($gameMap.adjustX(x) + 0.5) * $gameMap.tileWidth();
    this.y = ($gameMap.adjustY(y) + 1) * $gameMap.tileHeight();
    this._obj.x = this.x;
    this._obj.y = this.y;
};
Sprite_XsMapGunMobile.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    if (!this._data) return;
    this['updateStep'+this._step] && this['updateStep'+this._step]();
};
Sprite_XsMapGunMobile.prototype.updateStep0 = function() {
    var tx = ($gameMap.adjustX(this._data.point.x) + 0.5) * $gameMap.tileWidth();
    var ty = ($gameMap.adjustY(this._data.point.y) + 1) * $gameMap.tileHeight();
    var dx = tx - this.x, dy = ty - this.y;
    var d = Math.abs(dx) + Math.abs(dy);
    if (d <= 5) {
        this.playRangAnm();
        return;
    } 
    var speed = Math.min(d, this._speed);
    var mx = speed * Math.abs(dx) / d;
    var my = speed * Math.abs(dy) / d;
    this.x += dx > 0 ? mx : -mx;
    this.y += dy > 0 ? my : -my;
};
Sprite_XsMapGunMobile.prototype.updateStep1 = function() {
    !Xs_Manager.isAnimationPlaying() && this.onActionEnd();
};
//=================================================================================================
function Sprite_LoopAnimation() {
    this.initialize.apply(this, arguments);
}
Sprite_LoopAnimation.prototype = Object.create(Sprite_Animation.prototype);
Sprite_LoopAnimation.prototype.constructor = Sprite_LoopAnimation;
Sprite_LoopAnimation.prototype.id = function() {
    return this._animationId;
};
Sprite_LoopAnimation.prototype.setup = function(targets, animationId, mirror, delay, previous) {
    this._animationId = animationId;
    var animation = $dataAnimations[animationId];
    Sprite_Animation.prototype.setup.call(this, targets, animation, mirror, delay, previous);
};
Sprite_LoopAnimation.prototype.isPlaying = function() {
    return true;
};
Sprite_LoopAnimation.prototype.updateMain = function() {
    if (this._duration <= 0) {
        this._target.setBlendColor([0, 0, 0, 0]);
        this._target.show();
        this.setupDuration();
    } else Sprite_Animation.prototype.updateMain.call(this);
};
Sprite_LoopAnimation.prototype.checkEnd = function() {
    var result = this._frameIndex > this._maxTimingFrames &&
    this._flashDuration === 0 && !(this._handle && this._handle.exists);
    if (result) {
        this._effect = null;
        this._handle = null;
        this._started = false;
        this.setup(this._targets, this._animationId, this._mirror, this._delay, this._previous);
    }
};
//=================================================================================================
// Sprite_Actor 修改
//=================================================================================================
XdRsData.SRPG.Sprite_Actor_initialize = Sprite_Actor.prototype.initialize;
Sprite_Actor.prototype.initialize = function(battler, mirror) {
    this._xsMirror = Xs_Manager.isRuning() && mirror;
    XdRsData.SRPG.Sprite_Actor_initialize.call(this, battler);
    if (this._xsMirror) this.scale.x = -1;
};
XdRsData.SRPG.Sprite_Actor_moveToStartPosition = Sprite_Actor.prototype.moveToStartPosition;
Sprite_Actor.prototype.moveToStartPosition = function() {
    !Xs_Manager.isRuning() && XdRsData.SRPG.Sprite_Actor_moveToStartPosition.call(this);
};
XdRsData.SRPG.Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
Sprite_Actor.prototype.setActorHome = function(index) {
    if (Xs_Manager.isRuning()) return this.setXsActorHome();
    XdRsData.SRPG.Sprite_Actor_setActorHome.call(this, index);
};
Sprite_Actor.prototype.setXsActorHome = function() {
    var p = XdRsData.SRPG.getBattlerHome(this._xsMirror ? 'left' : 'right');
    this.setHome(p.x, p.y);
};
XdRsData.SRPG.Sprite_Actor_stepForward = Sprite_Actor.prototype.stepForward;
Sprite_Actor.prototype.stepForward = function() {
    if (this._xsMirror) this.startMove(48, 0, 12);
    else XdRsData.SRPG.Sprite_Actor_stepForward.call(this);
};
//=================================================================================================
// Sprite_Character 修改
//=================================================================================================
XdRsData.SRPG.Sprite_Character_initialize = Sprite_Character.prototype.initialize;
Sprite_Character.prototype.initialize = function(character) {
    XdRsData.SRPG.Sprite_Character_initialize.call(this, character);
    this._xsDamages = [];
    this.createXsCamp();
    this.createXsHpBar();
};
Sprite_Character.prototype.createXsCamp = function() {
    this._xsCamp = new Sprite_XsCampSign();
    this.addChild(this._xsCamp);
};
Sprite_Character.prototype.createXsHpBar = function() {
    this._lastXsBattler = this._character.xsBattler();
    this._xsHpBar = new Sprite_XsHpBar(this._lastXsBattler);
    this.addChild(this._xsHpBar);
};
XdRsData.SRPG.Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
Sprite_Character.prototype.setCharacterBitmap = function() {
    XdRsData.SRPG.Sprite_Character_setCharacterBitmap.call(this);
    this._lastXsStandby = this._character.isBlackAndWhite();
    this.bitmap.addLoadListener(function(){
        var data = {'width':this.patternWidth(),'height':this.patternHeight()};
        this._character.feedbackXsData(data);
        this._xsCamp.y = -this.patternHeight();
        this.setupXsStyle();
    }.bind(this));
};
Sprite_Character.prototype.isXsStandbyChanged = function() {
    return this._lastXsStandby !== this._character.isBlackAndWhite();
};
Sprite_Character.prototype.setupXsStyle = function() {
    if (this._lastXsStandby) this.bitmap = Bitmap.turnBlackAndWhite(this.bitmap);
    this.updateCharacterFrame();
};
XdRsData.SRPG.Sprite_Character_update = Sprite_Character.prototype.update;
Sprite_Character.prototype.update = function() {
    XdRsData.SRPG.Sprite_Character_update.call(this);
    this.updateXsStyle();
    this.updateXsHpBar();
    this.updateXsDamagePopup();
};
Sprite_Character.prototype.updateXsStyle = function() {
    if (!Xs_Manager.isRuning() || !this._character.isXsEffective()) return;
    this.isXsStandbyChanged() && this.setCharacterBitmap();
};
Sprite_Character.prototype.updateXsHpBar = function() {
    if (this._lastXsBattler !== this._character.xsBattler()) {
        this._lastXsBattler = this._character.xsBattler();
        this._xsHpBar.setBattler(this._lastXsBattler);
    }
};
Sprite_Character.prototype.updateXsDamagePopup = function() {
    this.setupXsDamagePopup();
    if (this.isDamagePlaying()) {
        for (var i = 0; i < this._xsDamages.length; i++) {
            this._xsDamages[i].update();
        }
        if (!this._xsDamages[0].isPlaying()) {
            this.parent.removeChild(this._xsDamages[0]);
            this._xsDamages.shift();
        }
    }
};
Sprite_Character.prototype.setupXsDamagePopup = function() {
    if (!this._character.isXsCharacter() || Xs_Manager.isInBattle()) return;
    if (this._character.xsBattler().isDamagePopupRequested()) {
        var sprite = new Sprite_Damage();
        sprite.x = this.x + this.damageOffsetX();
        sprite.y = this.y + this.damageOffsetY();
        sprite.z = 5;
        sprite.setup(this._character.xsBattler());
        this._xsDamages.push(sprite);
        this.parent.addChild(sprite);
        this._character.xsBattler().clearDamagePopup();
        this._character.xsBattler().clearResult();
    }
};
Sprite_Character.prototype.isDamagePlaying = function() {
    return this._xsDamages.length > 0;
};
Sprite_Character.prototype.isXsBusy = function() {
    return this.isAnimationPlaying() || this.isDamagePlaying();
};
Sprite_Character.prototype.damageOffsetX = function() {
    return 0;
};
Sprite_Character.prototype.damageOffsetY = function() {
    return 0;
};
//=================================================================================================
XdRsData.SRPG.Sprite_Animation_initMembers = Sprite_Animation.prototype.initMembers;
Sprite_Animation.prototype.initMembers = function() {
    XdRsData.SRPG.Sprite_Animation_initMembers.call(this);
    this._xsActionX = 0;
    this._xsActionY = 0;
    this._xsDirDirection = $gameTemp.xsAnmDirection();
    $gameTemp.setXsAnmDirection(0);
};
Sprite_Animation.prototype.isEffectiveXsDirDirection = function() {
    return [2,4,6,8].contains(this._xsDirDirection);
};
Sprite_Animation.prototype.getRealXsDirDirectionAngle = function() {
    return [0, 180, 90, 270, 0][this._xsDirDirection / 2];
};
Sprite_Animation.prototype.getRealXsDirDirectionX = function() {
    return [0, 0, -180, 180, 0][this._xsDirDirection / 2];
};
Sprite_Animation.prototype.getRealXsDirDirectionY = function() {
    return [0, 300, 150, 150, 0][this._xsDirDirection / 2];
};
XdRsData.SRPG.Sprite_Animation_setup = Sprite_Animation.prototype.setup;
Sprite_Animation.prototype.setup = function(targets, animation, mirror, delay, previous) {
    XdRsData.SRPG.Sprite_Animation_setup.call(this, targets, animation, mirror, delay, previous);
    this.isEffectiveXsDirDirection() && this.setupXsDirDirection();
};
Sprite_Animation.prototype.setupXsDirDirection = function() {
    this._animation.position = 1;
    this._animation.rotation.z += this.getRealXsDirDirectionAngle();
    this._animation.offsetX += this.getRealXsDirDirectionX();
    this._animation.offsetY += this.getRealXsDirDirectionY();
};
XdRsData.SRPG.Sprite_Animation_destroy = Sprite_Animation.prototype.destroy;
Sprite_Animation.prototype.destroy = function(options) {
    this.isEffectiveXsDirDirection() && this.reductionXsDirDirection();
    XdRsData.SRPG.Sprite_Animation_destroy.call(this, options);
};
Sprite_Animation.prototype.reductionXsDirDirection = function() {
    this._animation.rotation.z -= this.getRealXsDirDirectionAngle();
    this._animation.offsetX -= this.getRealXsDirDirectionX();
    this._animation.offsetY -= this.getRealXsDirDirectionY();
};
//=================================================================================================
XdRsData.SRPG.Sprite_AnimationMV_initMembers = Sprite_AnimationMV.prototype.initMembers;
Sprite_AnimationMV.prototype.initMembers = function() {
    XdRsData.SRPG.Sprite_AnimationMV_initMembers.call(this);
    this._xsActionX = 0;
    this._xsActionY = 0;
    this._xsDirDirection = $gameTemp.xsAnmDirection();
    $gameTemp.setXsAnmDirection(0);
};
Sprite_AnimationMV.prototype.isEffectiveXsDirDirection = function() {
    return Sprite_Animation.prototype.isEffectiveXsDirDirection.call(this);
};
Sprite_AnimationMV.prototype.getRealXsDirDirectionAngle = function() {
    return Sprite_Animation.prototype.getRealXsDirDirectionAngle.call(this);
};
XdRsData.SRPG.Sprite_AnimationMV_setup = Sprite_AnimationMV.prototype.setup;
Sprite_AnimationMV.prototype.setup = function(target, animation, mirror, delay) {
    XdRsData.SRPG.Sprite_AnimationMV_setup.call(this, target, animation, mirror, delay);
    this.isEffectiveXsDirDirection() && this.setupXsDirDirection();
};
Sprite_AnimationMV.prototype.setupXsDirDirection = function() {
    this._animation.position = 1;
    this.rotation = this.getRealXsDirDirectionAngle() * Math.PI / 180;
};
//=================================================================================================
// Spriteset_Map 修改
//=================================================================================================
XdRsData.SRPG.Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function() {
    XdRsData.SRPG.Spriteset_Map_createCharacters.call(this);
    this.createXsPlayers();
};
Spriteset_Map.prototype.createXsPlayers = function() {
    this._xsSprites = [];
    this._loopAnimationSprites = [];
    if (!Xs_Manager.isRuning()) return;
    $gameMap._xsPlayers.forEach(this.addXsPlayerCharacter.bind(this));
};
Spriteset_Map.prototype.createXsParts = function() {
    this.createMapGrid();
    this.createAtkGrid();
    this.createMoveGrid();
    this.createMapCursor();
    this.createMapGunMobile();
};
Spriteset_Map.prototype.removeXsParts = function() {
    this.removeChild(this._xsMapGunMobile);
    this._tilemap.removeChild(this._xsGrid);
    this._tilemap.removeChild(this._xsCursor);
    this._tilemap.removeChild(this._xsAtkGrid);
    this._tilemap.removeChild(this._xsMoveGrid);
    this._xsGrid = null;
    this._xsCursor = null;
    this._xsAtkGrid = null;
    this._xsMoveGrid = null;
    this._xsMapGunMobile = null;
    for (var i=0;i<this._xsSprites.length;++i) {
        this._tilemap.removeChild(this._xsSprites[i]);
    }
    this._xsSprites = [];
    $gameMap.clearXsPlayers();
};
Spriteset_Map.prototype.createMapGrid = function() {
    this._xsGrid = new Sprite_MapGrid();
    this._tilemap.addChild(this._xsGrid);
};
Spriteset_Map.prototype.createMoveGrid = function() {
    this._xsMoveGrid = new Sprite_MoveDisplay();
    this._tilemap.addChild(this._xsMoveGrid);
};
Spriteset_Map.prototype.createAtkGrid = function() {
    this._xsAtkGrid = new Sprite_AttackDisplay();
    this._tilemap.addChild(this._xsAtkGrid);
};
Spriteset_Map.prototype.createMapCursor = function() {
    this._xsCursor = new Sprite_XsCursor();
    this._xsCursor.setMoveCheck(this._xsMoveGrid);
    this._xsCursor.setAttackCheck(this._xsAtkGrid);
    this._tilemap.addChild(this._xsCursor);
};
Spriteset_Map.prototype.createMapGunMobile = function() {
    this._xsMapGunMobile = new Sprite_XsMapGunMobile();
    this.addChild(this._xsMapGunMobile);
};
Spriteset_Map.prototype.addXsPlayerCharacter = function(player) {
    var sprite = new Sprite_Character(player);
    this._xsSprites.push(sprite);
    this._tilemap.addChild(sprite);
};
XdRsData.SRPG.Spriteset_Map_findTargetSprite = Spriteset_Map.prototype.findTargetSprite;
Spriteset_Map.prototype.findTargetSprite = function(target) {
    if (target.constructor === Rectangle) return this._xsMapGunMobile;
    if (target.constructor === Game_XsPlayer) {
        return this._xsSprites.find(sprite => sprite.checkCharacter(target));
    }
    return XdRsData.SRPG.Spriteset_Map_findTargetSprite.call(this, target);
};
Spriteset_Map.prototype.currentXsCod = function() {
    return this._xsCursor ? this._xsCursor._coordinate : new Point();
};
Spriteset_Map.prototype.selectTarget = function(target) {
    this._xsCursor.moveTarget(target);
};
Spriteset_Map.prototype.selectPoint = function(point, mute, mod) {
    this._xsCursor.moveCoordinate(point, mute, mod);
};
Spriteset_Map.prototype.refreshInfoState = function(state) {
    this._xsCursor.refreshBattlerInfo(state);
};
Spriteset_Map.prototype.selectPlayerLeader = function() {
    this._xsCursor.selectPlayerLeader();
};
Spriteset_Map.prototype.isXsBusy = function() {
    return this._characterSprites.some(function(s){return s.isXsBusy();}) ||
    this._xsSprites.some(function(s){return s.isXsBusy();});
};
Spriteset_Map.prototype.addBattleControl = function(control) {
    this._baseSprite.addChild(control);
};
Spriteset_Map.prototype.removeBattleControl = function(control) {
    this._baseSprite.removeChild(control);
};
Spriteset_Map.prototype.displayMapGunMobile = function(data) {
    this._xsMapGunMobile.start(data);
};
XdRsData.SRPG.Spriteset_Map_updateAnimations = Spriteset_Map.prototype.updateAnimations;
Spriteset_Map.prototype.updateAnimations = function() {
    XdRsData.SRPG.Spriteset_Map_updateAnimations.call(this);
    this.updateLoopAnimations();
};
Spriteset_Map.prototype.updateLoopAnimations = function() {
    for (const sprite of this._animationSprites) {
        if (!sprite.isPlaying()) {
            this.removeAnimation(sprite);
        }
    }
    this.processLoopAnimationRequests();
};
Spriteset_Map.prototype.processLoopAnimationRequests = function() {
    const request = $gameTemp.retrieveLoopAnimation();
    request && this.createLoopAnimation(request);
};
Spriteset_Map.prototype.createLoopAnimation = function(request) {
    const targets = request.targets;
    const mirror = request.mirror;
    const sprite = new Sprite_LoopAnimation();
    const targetSprites = this.makeTargetSprites(targets);
    sprite.targetObjects = targets;
    sprite.setup(targetSprites, request.animationId, mirror, 0, null);
    this._effectsContainer.addChild(sprite);
    this._loopAnimationSprites.push(sprite);
};
XdRsData.SRPG.Spriteset_Map_isAnimationPlaying = Spriteset_Map.prototype.isAnimationPlaying;
Spriteset_Map.prototype.isAnimationPlaying = function() {
    if (this._loopAnimationSprites && this._loopAnimationSprites.length > 0) return true;
    return XdRsData.SRPG.Spriteset_Map_isAnimationPlaying.call(this);
};
Spriteset_Map.prototype.removeLoopAnimation = function() {
    if (!this._loopAnimationSprites) return;
    var sprite = this._loopAnimationSprites[0];
    if (sprite) {
        this._loopAnimationSprites.remove(sprite);
        this._effectsContainer.removeChild(sprite);
        sprite.destroy();
    }
};
//=================================================================================================
// end
//=================================================================================================