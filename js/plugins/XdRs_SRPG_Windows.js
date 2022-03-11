//=================================================================================================
// XS_Windows.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc [XS.SRPG] 游戏窗口。
* @author 芯☆淡茹水
* @help
*/
//=================================================================================================
;var XdRsData = XdRsData || {};
XdRsData.SRPG = XdRsData.SRPG || {};
//=================================================================================================
// 设置窗口的按钮
//=================================================================================================
function Xs_OptionsButton() {
    this.initialize.apply(this, arguments);
}
Xs_OptionsButton.prototype = Object.create(Xs_Button.prototype);
Xs_OptionsButton.prototype.constructor = Xs_OptionsButton;
Xs_OptionsButton.prototype.initialize = function(x, y, type) {
    this._type = type;
    Xs_Button.prototype.initialize.call(this, x, y, 24, 24);
};
Xs_OptionsButton.prototype.drawButton = function() {
    var color = 'rgb(255,255,255)';
    this.bitmap.drawArrow(0, 0, this.width, this.height, color, this._type);
};
//=================================================================================================
// 跳过战斗的按钮
//=================================================================================================
function Xs_SkipBattleButton() {
    this.initialize.apply(this, arguments);
}
Xs_SkipBattleButton.prototype = Object.create(Xs_Button.prototype);
Xs_SkipBattleButton.prototype.constructor = Xs_SkipBattleButton;
Xs_SkipBattleButton.prototype.initialize = function() {
    Xs_Button.prototype.initialize.call(this, 350, 50, 120, 40);
};
Xs_SkipBattleButton.prototype.drawButton = function() {
    this.bitmap.clear();
    var text = ConfigManager.isFightingOnMap ? '跳过战斗' : '显示战斗';
    var l = Math.floor(this.height / 20) + 1;
    var w = this.width - l * 2;
    var h = this.height - l * 2;
    this.bitmap.fillRoundRect(l,l,w,h,5,l,'rgb(120,120,120)','rgb(255,160,0)');
    this.bitmap.fontSize = Math.floor(this.height / 2);
    this.bitmap.drawText(text,0,0,this.width,this.height,'center');
};
Xs_SkipBattleButton.prototype.callPressMethod = function() {
    SoundManager.playOk();
    ConfigManager.isFightingOnMap = !ConfigManager.isFightingOnMap;
    ConfigManager.save();
    this.drawButton();
};
//=================================================================================================
// 地形信息窗口
//=================================================================================================
function Xs_WindowTerrainInfo() {
    this.initialize.apply(this, arguments);
}
Xs_WindowTerrainInfo.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowTerrainInfo.prototype.constructor = Xs_WindowTerrainInfo;
Xs_WindowTerrainInfo.prototype.initialize = function() {
    Xs_WindowBase.prototype.initialize.call(this, 200, 120);
    this.hide();
};
Xs_WindowTerrainInfo.prototype.drawUiFace = function() {
    this.bitmap.fillRoundRect(1,1,99,32,2,1,'rgba(0,0,0,0.5)','rgba(80,80,80,0.5)');
    this.bitmap.fillRoundRect(103,1,96,118,2,1,'rgba(0,0,0,0.5)','rgba(80,80,80,0.5)');
    this.bitmap.fillRoundRect(20,35,80,24,12,1,'rgba(0,0,0,0.5)','rgba(80,80,80,0.5)');
    this.bitmap.fillRect(60, 35, 1, 24, 'rgba(0,0,0,0.3)');
    this.bitmap.fontSize = 18;
    this.bitmap.textColor = 'rgba(0,160,200,0.5)';
    this.bitmap.outlineColor = 'rgba(0,0,0,0.2)';
    this.bitmap.drawText('X', 26, 33, 34, 30);
    this.bitmap.drawText('Y', 60, 33, 34, 30, 'right');
    for (var i=0;i<4;++i) {
        this.bitmap.fillRoundRect(135,6+i*28,58,24,10,1,'rgb(120,120,120)','rgb(30,30,30)');
    }
};
Xs_WindowTerrainInfo.prototype.setupPostion = function() {
    this.x = Graphics.width - this.width - 2;
    this.y = 2;
};
Xs_WindowTerrainInfo.prototype.drawInfo = function() {
    this.contents.clearRect(0, 0, 100, 30);
    this.contents.clearRect(100, 0, 98, 120);
    var iconIndex = XdRsData.SRPG.getTerrainIconIndex(this._terrainId);
    this.drawIcon(iconIndex, 4, 5, 24, 24);
    var text = XdRsData.SRPG.getTerrainName(this._terrainId);
    this.contents.drawText(text, 30, 2, 66, 30, 'center');
    var arr = ['REH','REM','HIT','EVA']
    for (var i=0;i<4;++i) {
        var n = XdRsData.SRPG.iconIndex(arr[i]);
        this.drawIcon(n, 108, 6+i*28, 24, 24);
        var n = XdRsData.SRPG.getTerrainBuffer(this._terrainId, arr[i])
        this.contents.drawText(''+n+'%', 135, 6+i*28, 58, 24, 'center');
    }
};
Xs_WindowTerrainInfo.prototype.refreshCoordinate = function() {
    var p = this.parent.currentXsCod();
    this._codX = p.x;
    this._codY = p.y;
    this.contents.fontSize = 16;
    this.contents.clearRect(0, 30, 100, 40);
    this.contents.drawText(''+this._codX, 24, 32, 30, 30, 'right');
    this.contents.drawText(''+this._codY, 67, 32, 30, 30);
    var terrainId = $gameMap.terrainTag(this._codX, this._codY);
    if (this._terrainId !== terrainId) {
        this._terrainId = terrainId;
        this.drawInfo();
    }
};
Xs_WindowTerrainInfo.prototype.isCodChanged = function() {
    var p = this.parent.currentXsCod();
    return this._codX !== p.x || this._codY !== p.y;
};
Xs_WindowTerrainInfo.prototype.updateOther = function() {
    this.visible = Xs_Manager._phase === 'round';
    if (this.visible) {
        this.isCodChanged() && this.refreshCoordinate();
    }
};
//=================================================================================================
// 信息提示窗口
//=================================================================================================
function Xs_WindowTips() {
    this.initialize.apply(this, arguments);
}
Xs_WindowTips.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowTips.prototype.constructor = Xs_WindowTips;
Xs_WindowTips.prototype.initialize = function() {
    this._data = [];
    Xs_WindowBase.prototype.initialize.call(this, 32, 32);
    this.activate();
    this.hide();
};
Xs_WindowTips.prototype.tip = function(text, count, endType) {
    this._maxCount = count;
    this._data.push({'text':text,'count':count,'endType':endType});
    !this.isTiping() && this.onTipsEnd();
};
Xs_WindowTips.prototype.setup = function() {
    if (!this._currentData.text) return this.onTipsEnd();
    this.contents.fontSize = 24;
    var width = this.contents.measureTextWidth(this._currentData.text) + 80;
    this.bitmap = new Bitmap(width, 55);
    this.bitmap.fontSize = 24;
    this.bitmap.fillRoundRect(3,3,width-6,52,10,3,'rgb(120,120,120)','rgb(30,30,30)');
    this.bitmap.drawText(this._currentData.text, 0, 1, this.width, this.height, 'center');
    this._currentData.count = Math.max(20, this._currentData.count);
    this.opacity = 255;
    this.setupPostion();
    this.show();
};
Xs_WindowTips.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2;
    this.y = (Graphics.height - this.height) / 2 - 40;
};
Xs_WindowTips.prototype.isTiping = function() {
    return this._currentData && this._currentData.count > 0;
};
Xs_WindowTips.prototype.onTipsEnd = function() {
    this._currentData = this._data.shift();
    this._currentData ? this.setup() : this.hide();
};
Xs_WindowTips.prototype.updateOther = function() {
    if (!this.isActive() || !this.isTiping()) return;
    this._currentData.count--;
    if ((this._maxCount - this._currentData.count) > 30) {
        if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
            SoundManager.playOk();
            this.onTipsEnd();
            return;
        }
    }
    if (this._currentData.count < 10) this.opacity -= 25;
    if (this._currentData.count <= 0) this.onTipsEnd();
};
//=================================================================================================
// 角色出战选择窗口
//=================================================================================================
function Xs_WindowActorSelect() {
    this.initialize.apply(this, arguments);
}
Xs_WindowActorSelect.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowActorSelect.prototype.constructor = Xs_WindowActorSelect;
Xs_WindowActorSelect.prototype.initialize = function() {
    this._data = [];
    this._maxSize = 0;
    this._actors = [];
    Xs_WindowBase.prototype.initialize.call(this, 760, 520);
    this.activate();
    this.hide();
};
Xs_WindowActorSelect.prototype.refreshActors = function() {
    this._actors = $gameParty.members().filter(function(a){
        return a.isAlive() && !Xs_Manager.isFighting(a.actorId());
    });
    this._data = [];
};
Xs_WindowActorSelect.prototype.drawUiFace = function() {
    var w = this.width, h = this.height;
    this.bitmap.fillRoundRect(5,5,w-10,h-10,10,5,'rgb(120,120,120)','rgb(30,30,30)');
    this.bitmap.fillRoundRect(153,25,460,56,10,3,'rgb(120,120,120)','rgb(255,255,255)');
    this.bitmap.fillRoundRect(520,92,220,32,5,2,'rgb(120,120,120)','rgb(0,200,200)');
    for (var i=0;i<6;++i) {
        this.bitmap.fillRoundRect(20, 130+i*56, 720, 52, 5, 1,'rgba(160,160,160,0.5)');
        this.bitmap.drawCircle(35, 156+i*56, 10, 'rgb(0,0,0)');
    }
    this.bitmap.fontSize = 32;
    this.bitmap.textColor = 'rgb(0,0,0)';
    this.bitmap.drawText('请选择要出战的角色', 155, 26, 450, 56, 'center');
    this.bitmap.fontSize = 20;
    this.bitmap.textColor = 'rgb(255,255,255)';
    this.bitmap.drawText('出战:', 550, 93, 100, 30);
};
Xs_WindowActorSelect.prototype.createContents = function() {
    Xs_WindowBase.prototype.createContents.call(this);
    this.contents.fontSize = 18;
    this.contents.outlineWidth = 2;
};
Xs_WindowActorSelect.prototype.createButtons = function() {
    this._buttonFix = new Xs_Button(130, 108, 220, 36, '按 ALT 键结束选择');
    this._buttonPgl = new Xs_Button(280, 488, 86, 28, '←左翻页');
    this._buttonPgr = new Xs_Button(480, 488, 86, 28, '右翻页→');
    this._buttonFix.setPressMethod(this.startDeployment.bind(this));
    this._buttonPgl.setPressMethod(this.inputOnPageup.bind(this));
    this._buttonPgr.setPressMethod(this.inputOnPagedown.bind(this));
    this.addChild(this._buttonFix);
    this.addChild(this._buttonPgl);
    this.addChild(this._buttonPgr);
};
Xs_WindowActorSelect.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2;
    this.y = (Graphics.height - this.height) / 2;
};
Xs_WindowActorSelect.prototype.isSelected = function(actorId) {
    return Xs_Manager.isForceFight(actorId) || this._data.contains(actorId);
};
Xs_WindowActorSelect.prototype.selectedNums = function() {
    return Xs_Manager.forceFightActorsSize(this._actors) + this._data.length;
};
Xs_WindowActorSelect.prototype.startSelect = function(maxSize) {
    if (maxSize) this._maxSize = maxSize;
    this.select(0, true);
    this.refreshActors();
    this.refreshPage();
    this.refresh();
    this.show();
};
Xs_WindowActorSelect.prototype.items = function() {
    return this._actors;
};
Xs_WindowActorSelect.prototype.maxItems = function() {
    return 6;
};
Xs_WindowActorSelect.prototype.itemRect = function(index) {
    return new Rectangle(25, index*56+130, 720, 52);
};
Xs_WindowActorSelect.prototype.drawItem = function(index) {
    var actor = this.pageItems()[index];
    if (!actor) return;
    this.contents.fontSize = 18;
    this.contents.outlineWidth = 2;
    var rect = this.itemRect(index);
    if (this.isSelected(actor.actorId())) {
        var iconIndex = XdRsData.SRPG.iconIndex('Select');
        if (Xs_Manager.isForceFight(actor.actorId())) {
            iconIndex = XdRsData.SRPG.iconIndex('Force');
        }
        this.drawIcon(iconIndex, rect.x+25, rect.y+10);
    }
    var characterName = actor.characterName();
    var characterIndex = actor.characterIndex();
    this.drawCharacter(characterName,characterIndex,rect.x+70,rect.y+5,48,rect.height-10);
    this.contents.drawText(actor.name(), rect.x+130, rect.y+5, 160, 26);
    this.contents.drawText(actor.currentClass().name, rect.x+130, rect.y+26, 160, 26);
    this.contents.drawText('Lv. '+actor.level.padZero(2), rect.x+260, rect.y+3, 160, 26);
    this.drawHp(actor, rect.x+520, rect.y+15);
    this.drawMp(actor, rect.x+520, rect.y+36);
};
Xs_WindowActorSelect.prototype.drawPage = function() {
    this.contents.fontSize = 24;
    this.contents.outlineWidth = 2;
    var text = '' + (this._page+1) + '/' + this._maxPage;
    this.contents.drawText(text, 20, 475, 720, 26, 'center');
};
Xs_WindowActorSelect.prototype.drawOther = function() {
    this.contents.clearRect(524,90,216,34);
    this.contents.fontSize = 20;
    this.contents.outlineWidth = 4;
    var text = '' + this.selectedNums() + '/' + this._maxSize;
    this.contents.drawText(text, 640, 93, 100, 32);
};
Xs_WindowActorSelect.prototype.startDeployment = function() {
    var artors = (Xs_Manager._forcedActors || []).concat(this._data);
    artors = artors.filter(function(id){return !Xs_Manager.isFighting(id);});
    if (!artors.length) return SoundManager.playBuzzer();
    SoundManager.playOk();
    this.startChoice('是否出战选中的角色？');
};
Xs_WindowActorSelect.prototype.canSelect = function() {
    var actor = this.item();
    if (!actor || Xs_Manager.isForceFight(actor.actorId())) return false;
    if (this._data.contains(actor.actorId())) return true;
    return this.selectedNums() < this._maxSize;
};
Xs_WindowActorSelect.prototype.onSelect = function() {
    var id = this.item().actorId();
    if (this._data.contains(id)) {
        var n = this._data.indexOf(id);
        this._data.splice(n, 1);
    } else this._data.push(id);
    this.redrawItem(this._index);
    this.drawOther();
};
Xs_WindowActorSelect.prototype.updateOther = function() {
    if (this.isActive()) {
        if (Input.isTriggered('control')) this.startDeployment();
    }
};
Xs_WindowActorSelect.prototype.onChoiceOk = function() {
    var artors = (Xs_Manager._forcedActors || []).concat(this._data);
    artors = artors.filter(function(id){return !Xs_Manager.isFighting(id);});
    artors = artors.map(function(id){
        return $gameActors.actor(id);
    });
    Xs_Manager.layOutActors(artors);
    this._maxSize = null;
    this.activate();
    this.hide();
};
Xs_WindowActorSelect.prototype.inputOnOk = function() {
    if (!this.canSelect()) return SoundManager.playBuzzer();
    SoundManager.playOk();
    this.onSelect();
};
Xs_WindowActorSelect.prototype.inputOnCancel = function() {
    SoundManager.playCancel();
    Xs_Manager.wait(8);
    this.hide();
    Xs_Manager.refreshInfoState(true);
};
//=================================================================================================
// 地图上光标所指单位的信息窗口
//=================================================================================================
function Xs_WindowBattlerInfo() {
    this.initialize.apply(this, arguments);
}
Xs_WindowBattlerInfo.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowBattlerInfo.prototype.constructor = Xs_WindowBattlerInfo;
Xs_WindowBattlerInfo.prototype.initialize = function() {
    Xs_WindowBase.prototype.initialize.call(this, Graphics.width, 200);
    this.opacity = 220;
};
Xs_WindowBattlerInfo.prototype.drawUiFace = function() {
    this.bitmap.fillRoundRect(110,70,50,24,5,2,'rgb(120,120,120)','rgb(30,30,30)');
    this.bitmap.fillRoundRect(110,96,180,36,5,2,'rgb(120,120,120)','rgb(30,30,30)');
    this.bitmap.fillRoundRect(110,136,240,26,5,2,'rgb(120,120,120)','rgb(30,30,30)');
    this.bitmap.fillRoundRect(80,165,270,26,5,2,'rgb(120,120,120)','rgb(30,30,30)');
    var arr = [0,0,0];
    var r = 70;
    var y = this.height - r - 4;
    for (var i=0;i<10;++i) {
        var color = 'rgba('+arr.join()+',0.6)';
        this.bitmap.drawCircle(74, y, r, color);
        arr = arr.map(function(n){return n += i < 5 ? 10 : -10;});
        r -= 2;
    }
};
Xs_WindowBattlerInfo.prototype.setupPostion = function() {
    this.y = Graphics.height - this.height;
};
Xs_WindowBattlerInfo.prototype.setBattler = function(battler) {
    if (this._battler !== battler) {
        this._battler = battler;
        this.refresh();
    }
};
Xs_WindowBattlerInfo.prototype.drawOther = function() {
    if (!this._battler || !this._battler.isAlive()) return this.hide();
    var text = 'Lv. ' + this._battler.level.padZero(2);
    this.contents.fontSize = 20;
    this.drawCamp(this._battler.camp, 135, 72, 18, 18);
    this.contents.drawText(this._battler.name(), 145, 98, 140, 36, 'center');
    this.contents.drawText(text, 170, 65, 140, 36);
    this.contents.fontSize = 16;
    this.drawHp(this._battler, 150, 148);
    this.drawMp(this._battler, 150, 177);
    var bitmap = ImageManager.loadFace(this._battler.faceName());
    var index = this._battler.faceIndex();
    var pw = ImageManager.faceWidth;
    var ph = ImageManager.faceHeight;
    var sx = index % 4 * pw;
    var sy = Math.floor(index / 4) * ph;
    var y = this.height - 74;
    bitmap.addLoadListener(function(){
        this.contents.circleBlt(bitmap, 74, y, 50, sx, sy, pw, ph, 100, 100)
    }.bind(this));
    this.show();
};
//=================================================================================================
// 单位行动命令选择窗口
//=================================================================================================
function Xs_WindowCommand() {
    this.initialize.apply(this, arguments);
}
Xs_WindowCommand.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowCommand.prototype.constructor = Xs_WindowCommand;
Xs_WindowCommand.prototype.initialize = function() {
    this._comannds = [];
    Xs_WindowBase.prototype.initialize.call(this, 32, 32);
    this.opacity = 220;
    this.activate();
    this.hide();
};
Xs_WindowCommand.prototype.refreshObj = function(obj, mute, keep) {
    this._obj = obj;
    this.setup(mute, keep);
};
Xs_WindowCommand.prototype.setup = function(mute, keep) {
    if (!this._obj) return this.hide();
    this._comannds = this._obj.getXsCommandList(this._isMoved);
    if (!this._comannds.length) return this.hide();
    !mute && SoundManager.playOk();
    this.setupWindow();
    this.setupPostion();
    this.refreshPage();
    !keep && this.select(0,true);
    this.activate();
    this.refresh();
    this.show();
};
Xs_WindowCommand.prototype.windowWidth = function() {
    if (!this.items().length) return 120;
    this.contents.fontSize = 16;
    var arr = this.items().map(function(sym){
        return this.contents.measureTextWidth(this.getWord(sym)) + 10;
    }, this);
    return Math.max.apply(null, arr) + 60;
};
Xs_WindowCommand.prototype.getWord = function(sym) {
    return sym === 'event' ? this._obj.getFootEventWord() : XdRsData.SRPG.commandWord(sym);
};
Xs_WindowCommand.prototype.setupWindow = function() {
    this.bitmap = new Bitmap(this.windowWidth(), 36 * this.maxItems() + 10);
    this._contentsSprite.bitmap = new Bitmap(this.width, this.height);
    this.contents = this._contentsSprite.bitmap;
    this.contents.fontSize = 16;
};
Xs_WindowCommand.prototype.setupPostion = function() {
    if (!this._obj || !this._obj.xsBodyRect()) return;
    var rect = this._obj.xsBodyRect();
    this.x = rect.x + rect.width / 2;
    if ((this.x + this.width) > Graphics.width) {
        this.x = rect.x - rect.width / 2 - this.width;
    }
    if (this.x < 0) this.x = (Graphics.width - this.width) / 2;
    this.y = Math.max(0, rect.y - this.height);
};
Xs_WindowCommand.prototype.isVaild = function() {
    return this._obj.isXsCommandVaild(this.item());
};
Xs_WindowCommand.prototype.items = function() {
    return this._comannds;
};
Xs_WindowCommand.prototype.maxItems = function() {
    return this.items().length;
};
Xs_WindowCommand.prototype.itemRect = function(index) {
    return new Rectangle(0, index*36, this.width, 36);
};
Xs_WindowCommand.prototype.refreshCursor = function() {
    if (!this._cursor) this.createCursor();
    var rect = this.itemRect(this._index);
    var y = rect.y + (rect.height - 20) / 2 + 1;
    this._cursor.move(rect.x+10, y);
    this._cursor.show();
};
Xs_WindowCommand.prototype.drawItem = function(index) {
    if (!this.items()[index]) return;
    var r = this.itemRect(index);
    var text = this.getWord(this.items()[index]);
    var tw = this.contents.measureTextWidth(text) + 10;
    var color = XdRsData.SRPG.campColor(this._obj.camp());
    this.contents.fillRoundRect(r.x+3,r.y+3,r.width-6,r.height-4,10,3,'rgb(120,120,120)','rgb(30,30,30)');
    this.contents.fillRoundRect(r.x+40,r.y+9,tw,r.height-16,2,2,'rgb(120,120,120)',color);
    this.contents.drawCircle(r.x+20, r.y+19, 10, 'rgb(0,0,0)');
    this.contents.drawText(text, r.x+40, r.y+1, tw, r.height, 'center');
};
Xs_WindowCommand.prototype.onChoiceOk = function() {
    this.activate();
    this._obj.setXsStandby(true);
    this._obj = null;
};
Xs_WindowCommand.prototype.onChoiceCancel = function() {
    Xs_WindowBase.prototype.onChoiceCancel.call(this);
    this.refreshObj(this._obj, true);
};
Xs_WindowCommand.prototype.inputOnOk = function() {
    if (!this.isVaild()) return SoundManager.playBuzzer();
    SoundManager.playOk();
    this.hide();
    switch(this.item()) {
        case 'move' :
            this._obj.clearXsLastXsMoveData();
            Xs_Manager.displayMove(this._obj);
            break;
        case 'atk' :
            Xs_Manager.startItemSelect(this._obj, 'skill');
            break;
        case 'item' :
            Xs_Manager.startItemSelect(this._obj, 'item');
            break;
        case 'state':
            Xs_Manager.displayUnitStatus(this._obj);
            break;
        case 'itc' :
            Xs_Manager.displayAttack(this._obj, 'itc');
            break;
        case 'event' :
            this._obj.startXsFootEvent();
            break;
        case 'standby' :
            this.startChoice('是否确定待机？');
            break;
    }
};
Xs_WindowCommand.prototype.inputOnCancel = function() {
    SoundManager.playCancel();
    Xs_Manager.wait(8);
    this._obj && this._obj.onXsCommandCancel();
    this.hide();
};
//=================================================================================================
// 菜单选择窗口
//=================================================================================================
function Xs_MenuCommand() {
    this.initialize.apply(this, arguments);
}
Xs_MenuCommand.prototype = Object.create(Xs_WindowBase.prototype);
Xs_MenuCommand.prototype.constructor = Xs_MenuCommand;
Xs_MenuCommand.prototype.initialize = function() {
    var height = this.items().length * 43;
    Xs_WindowBase.prototype.initialize.call(this, 240, height);
    this.opacity = 220;
    this.activate();
    this.hide();
};
Xs_MenuCommand.prototype.drawUiFace = function() {
    for (var i=0;i<this.maxItems();++i) {
        var r = this.itemRect(i);
        this.bitmap.fillRoundRect(r.x+3,r.y+3,r.width-6,r.height-3,18,3,'rgb(120,120,120)','rgb(30,30,30)');
        this.bitmap.drawCircle(r.x+20, r.y+22, 10, 'rgb(0,0,0)');
    }
};
Xs_MenuCommand.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2 - 10;
    this.y = (Graphics.height - this.height) / 2 - 40;
};
Xs_MenuCommand.prototype.createChildWindows = function() {
    this._childWindows = [];
    this._childWindows[0] = new Xs_WindowAim(this);
    this._childWindows[1] = new Xs_WindowActorQueue(this);
    this._childWindows[2] = new Xs_WindowMiniMap(this);
    this._childWindows[3] = new Xs_WindowSave(this);
    this._childWindows[4] = new Xs_WindowOptions(this);
    this._childWindows.forEach(function(w){
        this.parent.addChild(w);
    },this);
};
Xs_MenuCommand.prototype.removeChildWindows = function() {
    this._childWindows.forEach(function(w){
        this.parent.removeChild(w);
    },this);
    this._childWindows.length = 0;
};
Xs_MenuCommand.prototype.refreshCursor = function() {
    Xs_WindowCommand.prototype.refreshCursor.call(this);
};
Xs_MenuCommand.prototype.addMiniPart = function(obj) {
    this._childWindows[2] && this._childWindows[2].addPart(obj);
};
Xs_MenuCommand.prototype.show = function(mute, keep) {
    !keep && this.select(0, true);
    !mute && SoundManager.playOk();
    Xs_WindowBase.prototype.show.call(this);
};
Xs_MenuCommand.prototype.isBusy = function() {
    if (Xs_WindowBase.prototype.isBusy.call(this)) return true;
    return this._childWindows.some(function(w){ return w.isBusy();});
};
Xs_MenuCommand.prototype.isActive = function() {
    return this.visible && this._active && !this._waitCount;
};
Xs_MenuCommand.prototype.items = function() {
    return ['aim','queue','map','save','set','action'];
};
Xs_MenuCommand.prototype.maxItems = function() {
    return this.items().length;
};
Xs_MenuCommand.prototype.itemRect = function(index) {
    return new Rectangle(0, index*43, this.width, 42);
};
Xs_MenuCommand.prototype.drawItem = function(index) {
    var r = this.itemRect(index);
    var text = XdRsData.SRPG.menuWord(this.items()[index]);
    this.contents.fontSize = 20;
    this.contents.fillRoundRect(r.x+42,r.y+10,r.width-70,r.height-17,1,2,'rgb(0,120,120)');
    this.contents.clearRect(r.x+50, r.y+8, r.width-86, r.height-10);
    this.contents.drawText(text, r.x+50, r.y+7, r.width-86, r.height-10, 'center');
};
Xs_MenuCommand.prototype.displayChildWindow = function(index, sign) {
    if (this._childWindows[index]) {
        SoundManager.playOk();
        this._childWindows[index].refresh();
        this._childWindows[index].show(sign);
        this.hide();
    }
};
Xs_MenuCommand.prototype.isOperateValid = function(index) {
    if(index === 5) return true;
    if (this._childWindows[index] && this._childWindows[index].isBusy()) return true;
    return this._childWindows.every(function(w){return !w.isBusy();});
};
Xs_MenuCommand.prototype.operateChildWindow = function(index) {
    if (!this.isOperateValid(index)) return;
    if (!this._waitCount) {
        this._waitCount = 8;
        if (index === 5) this.choiceActionEnd();
        else if (this._childWindows[index]) {
            if (this._childWindows[index].isBusy()) {
                SoundManager.playCancel();
                this._childWindows[index].hide();
                this.hide();
            } else this.displayChildWindow(index, true);
        }
    }
};
Xs_MenuCommand.prototype.onChoiceOk = function() {
    this.activate();
    Xs_Manager.selectNextCamp();
};
Xs_MenuCommand.prototype.choiceActionEnd = function() {
    SoundManager.playOk();
    this.hide();
    this.startChoice('是否结束该回合的行动？');
};
Xs_MenuCommand.prototype.inputOnOk = function() {
    if (this._index === 5) this.choiceActionEnd();
    else this.displayChildWindow(this._index);
};
Xs_MenuCommand.prototype.inputOnCancel = function() {
    SoundManager.playCancel();
    Xs_Manager.wait(8);
    this.hide();
};
//=================================================================================================
// 菜单子窗口基本类
//=================================================================================================
function Xs_MenuChildBase() {
    this.initialize.apply(this, arguments);
}
Xs_MenuChildBase.prototype = Object.create(Xs_WindowBase.prototype);
Xs_MenuChildBase.prototype.constructor = Xs_MenuChildBase;
Xs_MenuChildBase.prototype.initialize = function(width, height) {
    Xs_WindowBase.prototype.initialize.call(this, width, height);
    this.opacity = 220;
    this.activate();
    this.hide();
};
Xs_MenuChildBase.prototype.show = function(isQuickDisplay) {
    this._isQuickDisplay = isQuickDisplay;
    Xs_WindowBase.prototype.show.call(this);
    this.opacity = 220;
    this.activate();
};
Xs_MenuChildBase.prototype.menuType = function() {
    return '';
};
Xs_MenuChildBase.prototype.drawUiFace = function() {
    if (!this.menuType()) return;
    var w = this.width, h = this.height;
    this.bitmap.fillRoundRect(5,5,w-10,h-10,10,5,'rgb(120,120,120)','rgb(30,30,30)');
    this.bitmap.fillRoundRect(153,35,460,56,10,3,'rgb(120,120,120)','rgb(255,255,255)');
    for (var i=0;i<6;++i) {
        this.bitmap.fillRoundRect(20, 130+i*56, 720, 52, 5, 1,'rgba(160,160,160,0.5)');
        this.bitmap.drawCircle(35, 156+i*56, 10, 'rgb(0,0,0)');
    }
    this.bitmap.fontSize = 32;
    this.bitmap.textColor = 'rgb(0,0,0)';
    var text = XdRsData.SRPG.menuWord(this.menuType());
    this.bitmap.drawText(text, 155, 36, 450, 56, 'center');
};
Xs_MenuChildBase.prototype.createContents = function() {
    Xs_WindowBase.prototype.createContents.call(this);
    if (this.menuType()) {
        this.contents.fontSize = 18;
        this.contents.outlineWidth = 2;
    }
};
Xs_MenuChildBase.prototype.createButtons = function() {
    if (!this.menuType() || this.menuType() === 'set') return;
    this._buttonPgl = new Xs_Button(280, 488, 86, 28, '←左翻页');
    this._buttonPgr = new Xs_Button(480, 488, 86, 28, '右翻页→');
    this._buttonPgl.setPressMethod(this.inputOnPageup.bind(this));
    this._buttonPgr.setPressMethod(this.inputOnPagedown.bind(this));
    this.addChild(this._buttonPgl);
    this.addChild(this._buttonPgr);
};
Xs_MenuChildBase.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2;
    this.y = (Graphics.height - this.height) / 2 - 20;
};
Xs_MenuChildBase.prototype.maxItems = function() {
    return 6;
};
Xs_MenuChildBase.prototype.itemRect = function(index) {
    return new Rectangle(25, index*56+130, 720, 52);
};
Xs_MenuChildBase.prototype.drawPage = function() {
    if (!this.menuType() || this.menuType() === 'set') return;
    this.contents.fontSize = 24;
    this.contents.outlineWidth = 2;
    var text = '' + (this._page+1) + '/' + this._maxPage;
    this.contents.drawText(text, 20, 475, 720, 26, 'center');
};
Xs_MenuChildBase.prototype.inputOnCancel = function() {
    SoundManager.playCancel();
    this.hide();
    if (this._isQuickDisplay) {
        this._supWindow.hide();
        Xs_Manager.wait(8);
    } else this._supWindow.show(true, true);
};
//=================================================================================================
// 作战目的窗口
//=================================================================================================
function Xs_WindowAim() {
    this.initialize.apply(this, arguments);
}
Xs_WindowAim.prototype = Object.create(Xs_MenuChildBase.prototype);
Xs_WindowAim.prototype.constructor = Xs_WindowAim;
Xs_WindowAim.prototype.initialize = function(supWindow) {
    this._supWindow = supWindow;
    Xs_MenuChildBase.prototype.initialize.call(this, 420, 480);
};
Xs_WindowAim.prototype.drawUiFace = function() {
    this.bitmap.fillRoundRect(5,5,this.width-10,this.height-10,10,5,'rgb(120,120,120)','rgb(30,30,30)');
    this.bitmap.fillRoundRect(64,24,300,52,8,3,'rgb(120,120,120)','rgb(255,255,255)');
    for (var i=0;i<20;++i) {
        this.bitmap.fillRect(20, 96+i*36, 380, 1, 'rgba(160,160,160,0.5)');
    }
    this.bitmap.fontSize = 30;
    this.bitmap.textColor = 'rgb(0,0,0)';
    this.bitmap.drawText('回合数:', 130, 26, 100, 48);
};
Xs_WindowAim.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2;
    this.y = (Graphics.height - this.height) / 2 - 20;
};
Xs_WindowAim.prototype.maxItems = function() {
    return 0;
};
Xs_WindowAim.prototype.drawOther = function() {
    if (!Xs_Manager._control) return;
    this.contents.fontSize = 30;
    this.contents.textColor = 'rgb(0,0,0)';
    this.contents.drawText(''+(Xs_Manager._round || 1), 130, 26, 150, 48, 'right');
    this.contents.fontSize = 20;
    this.contents.textColor = 'rgb(255,255,255)';
    var arr = Xs_Manager._control.gameAim().split(/\\n/);
    for (var i=0 ;i<arr.length;++i) {
        this.contents.drawText(arr[i], 25, i*36 +102, 370, 32);
    }
};
//=================================================================================================
// 部队表窗口
//=================================================================================================
function Xs_WindowActorQueue() {
    this.initialize.apply(this, arguments);
}
Xs_WindowActorQueue.prototype = Object.create(Xs_MenuChildBase.prototype);
Xs_WindowActorQueue.prototype.constructor = Xs_WindowActorQueue;
Xs_WindowActorQueue.prototype.initialize = function(supWindow) {
    this._supWindow = supWindow;
    Xs_MenuChildBase.prototype.initialize.call(this, 760, 520);
};
Xs_WindowActorQueue.prototype.menuType = function() {
    return 'queue';
};
Xs_WindowActorQueue.prototype.items = function() {
    return Xs_Manager._fightingActors || [];
};
Xs_WindowActorQueue.prototype.drawItem = function(index) {
    var actor = $gameActors.actor(this.pageItems()[index]);
    if (!actor) return;
    this.contents.fontSize = 18;
    this.contents.outlineWidth = 2;
    var rect = this.itemRect(index);
    var unit = this.unit(actor);
    var sym = actor.isDead() ? 'Dead' : (unit && unit.canXsAct() ? 'Free' : null);
    sym && this.drawIcon(XdRsData.SRPG.iconIndex(sym), rect.x+30, rect.y+10);
    var characterName = actor.characterName();
    var characterIndex = actor.characterIndex();
    this.drawCharacter(characterName,characterIndex,rect.x+70,rect.y+5,48,rect.height-10);
    this.contents.drawText(actor.name(), rect.x+130, rect.y+5, 160, 26);
    this.contents.drawText(actor.currentClass().name, rect.x+130, rect.y+26, 160, 26);
    this.contents.drawText('Lv. '+actor.level.padZero(2), rect.x+260, rect.y+3, 160, 26);
    this.drawHp(actor, rect.x+520, rect.y+15);
    this.drawMp(actor, rect.x+520, rect.y+36);
};
Xs_WindowActorQueue.prototype.unit = function(actor) {
    return actor ? actor.xsUnit() : null;
};
Xs_WindowActorQueue.prototype.currentUnit = function() {
    var actor = $gameActors.actor(this.pageItems()[this._index]);
    return this.unit(actor);
};
Xs_WindowActorQueue.prototype.inputOnOk = function() {
    if (!this.item() || !!Xs_Manager.playerCamp()) return SoundManager.playBuzzer();
    if (!$gameActors.actor(this.item()).isAlive()) return SoundManager.playBuzzer();
    SoundManager.playOk();
    this.hide();
    this._supWindow.hide();
    Xs_Manager.selectTarget(this.currentUnit());
    Xs_Manager.startCommand(this.currentUnit());
};
//=================================================================================================
// 小地图窗口
//=================================================================================================
function Xs_WindowMiniMap() {
    this.initialize.apply(this, arguments);
}
Xs_WindowMiniMap.prototype = Object.create(Xs_MenuChildBase.prototype);
Xs_WindowMiniMap.prototype.constructor = Xs_WindowMiniMap;
Xs_WindowMiniMap.prototype.initialize = function(supWindow) {
    this._supWindow = supWindow;
    var p = this.windowSize();
    Xs_MenuChildBase.prototype.initialize.call(this, p.x, p.y);
};
Xs_WindowMiniMap.prototype.windowSize = function() {
    var mapWidth  = $gameMap.width() * $gameMap.tileWidth() + 45;
    var mapHeight = $gameMap.height() * $gameMap.tileHeight() + 45;
    var rw = Graphics.boxWidth / mapWidth;
    var rh = Graphics.boxHeight / mapHeight;
    this._realScale = Math.min.apply(null, [rw,rh,1]);
    return new Point(mapWidth*this._realScale + 5, mapHeight*this._realScale + 5);
};
Xs_WindowMiniMap.prototype.drawUiFace = function() {
    this.bitmap.fillRoundRect(5,5,this.width-10,this.height-10,5,5,'rgb(120,120,120)','rgb(30,30,30)');
};
Xs_WindowMiniMap.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2;
    this.y = (Graphics.height - this.height) / 2;
};
Xs_WindowMiniMap.prototype.createContents = function() {
    this.createTilemap();
    this.createPartsLayer();
    Xs_MenuChildBase.prototype.createContents.call(this);
    this.contents.fontSize = 18;
};
Xs_WindowMiniMap.prototype.createTilemap = function() {
    this._tilemap = new Tilemap();
    this._tilemap.tileWidth = $gameMap.tileWidth();
    this._tilemap.tileHeight = $gameMap.tileHeight();
    this._tilemap.width = $gameMap.width() * $gameMap.tileWidth();
    this._tilemap.height = $gameMap.height() * $gameMap.tileHeight();
    this._tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
    this._tileset = $gameMap.tileset();
    if (this._tileset) {
        const bitmaps = [];
        const tilesetNames = this._tileset.tilesetNames;
        for (const name of tilesetNames) {
            bitmaps.push(ImageManager.loadTileset(name));
        }
        this._tilemap.setBitmaps(bitmaps);
        this._tilemap.flags = $gameMap.tilesetFlags();
    }
    this._tilemap.openXsMiniMapSign();
    this._tilemap.scale = new Point(this._realScale, this._realScale);
    var mg = 4 * this._realScale;
    this._tilemap.x = (this.width - this._tilemap.width * this._realScale) / 2 + mg;
    this._tilemap.y = (this.height - this._tilemap.height * this._realScale) / 2 + mg;
    this.addChild(this._tilemap);
};
Xs_WindowMiniMap.prototype.createButtons = function() {
    var arr = $gameMap.xsAllUnits();
    for (var i=0;i<arr.length;++i) this.addPart(arr[i]);
};
Xs_WindowMiniMap.prototype.createPartsLayer = function() {
    this._partsLayer = new Sprite();
    this._partsLayer.isActive = this.isActive.bind(this);
    this._partsLayer.selectTarget = this.selectTarget.bind(this);
    this._partsLayer.move(this._tilemap.x, this._tilemap.y);
    this.addChild(this._partsLayer);
};
Xs_WindowMiniMap.prototype.addPart = function(obj) {
    if (!obj) return;
    var part = new Sprite_XsMiniMapPart(obj, this._realScale);
    this._buttons.push(part);
    this._partsLayer.addChild(part);
};
Xs_WindowMiniMap.prototype.show = function(isQuickDisplay) {
    this.refreshParts();
    Xs_MenuChildBase.prototype.show.call(this, isQuickDisplay);
};
Xs_WindowMiniMap.prototype.hide = function() {
    this.contents.clear();
    Xs_MenuChildBase.prototype.hide.call(this);
};
Xs_WindowMiniMap.prototype.maxItems = function() {
    return 0;
};
Xs_WindowMiniMap.prototype.selectTarget = function(obj) {
    if (obj) {
        SoundManager.playOk();
        this.hide();
        this._supWindow.hide();
        Xs_Manager.selectTarget(obj);
    }
};
Xs_WindowMiniMap.prototype.refreshParts = function() {
    this._buttons.forEach(function(p){p.refreshState();});
};
Xs_WindowMiniMap.prototype.refreshPartName = function(name, camp) {
    this._lastName = name;
    this._lastCamp = camp;
    this.contents.clear();
    if (name) {
        var width = this.contents.measureTextWidth(name) + 40;
        var tw = $gameMap.tileWidth() / 2 * this._realScale;
        var x = TouchInput.x - this.localX() + tw;
        if ((x + width) >= this.width - 6) {
            x = TouchInput.x - this.localX() - tw - width;
        }
        var y = TouchInput.y - this.localY();
        var color = XdRsData.SRPG.campColor(camp);
        this.contents.fillRoundRect(x+2,y+2,width,30,5,2,'rgb(50,50,50)',color);
        this.contents.drawText(name, x+2,y+2,width,30,'center');
    }
};
Xs_WindowMiniMap.prototype.updateOther = function() {
    if (!this.isActive()) return;
    var name = '', camp = null;
    for (var i=0;i<this._buttons.length;++i) {
        if (!this._buttons[i].visible) continue;
        if (this._buttons[i].isTouch()) {
            var arr = this._buttons[i].feedbackData();
            name = arr[0];
            camp = arr[1];
        }
    }
    if (this._lastName !== name || this._lastCamp !== camp) {
        this.refreshPartName(name, camp);
    }
};
//=================================================================================================
// 存档窗口
//=================================================================================================
function Xs_WindowSave() {
    this.initialize.apply(this, arguments);
}
Xs_WindowSave.prototype = Object.create(Xs_MenuChildBase.prototype);
Xs_WindowSave.prototype.constructor = Xs_WindowSave;
Xs_WindowSave.prototype.initialize = function(supWindow) {
    this._supWindow = supWindow;
    this._files = [];
    for (var i=0;i<DataManager.maxSavefiles();++i) this._files.push(i+1);
    Xs_MenuChildBase.prototype.initialize.call(this, 760, 520);
};
Xs_WindowSave.prototype.menuType = function() {
    return 'save';
};
Xs_WindowSave.prototype.items = function() {
    return this._files;
};
Xs_WindowSave.prototype.isActive = function() {
    return !this._saveWait && Xs_MenuChildBase.prototype.isActive.call(this);
};
Xs_WindowSave.prototype.drawItem = function(index) {
    var fileId = this.pageItems()[index];
    if (!fileId) return;
    this.contents.fontSize = 18;
    var rect = this.itemRect(index);
    var info = DataManager.savefileInfo(fileId);
    var text = TextManager.file + ' ' + fileId;
    this.contents.drawText(text, rect.x+50,rect.y+2,150,30);
    if (!info) {
        this.contents.fontSize = 26;
        this.contents.drawText('Empty',rect.x+300,rect.y,rect.width-300,rect.height);
    }else{
        this.contents.drawText('游戏时间:', rect.x+50,rect.y+24,150,30);
        this.contents.drawText(info.playtime, rect.x+150,rect.y+24,150,30);
        this.contents.drawText(info.xsChapterName, rect.x+300,rect.y+2,rect.width-320,30,'center');
        this.contents.drawText(info.xsMapName, rect.x+300,rect.y+24,rect.width-320,30,'center');
    }
};
Xs_WindowSave.prototype.inputOnOk = function() {
    if (!this.item()) return SoundManager.playBuzzer();
    if (!!DataManager.savefileInfo(this.item())) {
        SoundManager.playOk();
        this.startChoice('是否覆盖这个'+TextManager.file+'？');
    } else this.onChoiceOk();
};
Xs_WindowSave.prototype.onChoiceOk = function() {
    $gameSystem.onBeforeSave();
    if (!DataManager.saveGame(this.item())) return SoundManager.playBuzzer();
    SoundManager.playSave();
    this._saveWait = 5;
    this.activate();
};
Xs_WindowSave.prototype.updateOther = function() {
    if (this._saveWait) {
        this._saveWait--;
        !this._saveWait && this.refresh();
    }
};
//=================================================================================================
// 设置窗口
//=================================================================================================
function Xs_WindowOptions() {
    this.initialize.apply(this, arguments);
}
Xs_WindowOptions.prototype = Object.create(Xs_MenuChildBase.prototype);
Xs_WindowOptions.prototype.constructor = Xs_WindowOptions;
Xs_WindowOptions.prototype.initialize = function(supWindow) {
    this._supWindow = supWindow;
    Xs_MenuChildBase.prototype.initialize.call(this, 760, 520);
};
Xs_WindowOptions.prototype.menuType = function() {
    return 'set';
};
Xs_WindowOptions.prototype.createButtons = function() {
    for (var i=0;i<this.maxItems();++i) {
        this._buttons[i] = new Sprite_OptionsItem(i);
        this.addChild(this._buttons[i]);
        this._buttons[i].setupPosition();
        this._buttons[i].refresh();
    }
};
Xs_WindowOptions.prototype.items = function() {
    return ['bgmVolume','bgsVolume','meVolume','seVolume','sign','grid'];
};
Xs_WindowOptions.prototype.word = function(index) {
    if (index < 4) return TextManager[this.items()[index]];
    return ['阵营标志','地图网格'][index-4];
};
Xs_WindowOptions.prototype.itemText = function(index) {
    if (index < 4) return ''+ConfigManager[this.items()[index]]+'%';
    if (index === 4) return $gameSystem.isXsCampDisplay() ? 'ON' : 'OFF';
    if (index === 5) return $gameSystem.isXsGridDisplay() ? 'ON' : 'OFF';
    return '';
};
Xs_WindowOptions.prototype.hide = function() {
    this._isVolChanged && ConfigManager.save();
    this._isVolChanged = false;
    Xs_MenuChildBase.prototype.hide.call(this);
};
Xs_WindowOptions.prototype.drawItem = function(index) {
    this.contents.fontSize = 26;
    var rect = this.itemRect(index);
    this.contents.drawText(this.word(index), rect.x+50,rect.y,200,rect.height);
};
Xs_WindowOptions.prototype.changeVal = function(type) {
    if (this._index < 4) {
        var n = ConfigManager[this.item()] + (type ? 10 : -10);
        if (n > 100) n = 0;
        if (n < 0) n = 100;
        ConfigManager[this.item()] = n;
        this._isVolChanged = true;
    }else{
        if (this._index === 4) {
            var state = !$gameSystem.isXsCampDisplay();
            $gameSystem.changeXsCampDisplay(state);
        } else if (this._index === 5) {
            var state = !$gameSystem.isXsGridDisplay();
            $gameSystem.changeXsGridDisplay(state);
        }
    }
    this._buttons[this._index].refresh();
};
Xs_WindowOptions.prototype.inputOnLeft = function() {
    SoundManager.playOk();
    this.changeVal(0);
};
Xs_WindowOptions.prototype.inputOnRight = function() {
    SoundManager.playOk();
    this.changeVal(1);
};
//=================================================================================================
// 物品/技能 选择窗口
//=================================================================================================
function Xs_WindowItemSelection() {
    this.initialize.apply(this, arguments);
}
Xs_WindowItemSelection.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowItemSelection.prototype.constructor = Xs_WindowItemSelection;
Xs_WindowItemSelection.prototype.initialize = function() {
    Xs_WindowBase.prototype.initialize.call(this, 620, 500);
    this.activate();
    this.hide();
};
Xs_WindowItemSelection.prototype.drawUiFace = function() {
    this.bitmap.clear();
    if (!this._mod) return;
    this.bitmap.fillRoundRect(5,5,this.width-10,this.height-10,5,5,'rgb(120,120,120)','rgb(30,30,30)');
    this.bitmap.gradientFillRect(8,20,500,50,'rgb(120,120,120)','rgba(0,0,0,0)');
    this.bitmap.fillRect(5,85,this.width-10,5,'rgb(120,120,120)');
    this.bitmap.fillRect(5,130,this.width-10,2,'rgb(120,120,120)');
    for (var i=0;i<8;++i) {
        this.bitmap.fillRoundRect(15,i*40+140,this.width-30,36,18,1,'rgb(120,120,120)');
        this.bitmap.drawCircle(30, i*40+158, 10, 'rgb(0,0,0)');
    }
    this.bitmap.fontSize = 32;
    var text = this._mod === 'skill' ? TextManager.skill : TextManager.item;
    this.bitmap.drawText(text+'选择', 20, 20, 480, 50);
    var x = 70, w1 = 200, w2 = 120, w3 = 100, w4 = 100;
    this.bitmap.fontSize = 24;
    this.bitmap.drawText(text, x, 90, w1, 40, 'center');
    this.bitmap.drawText('范围', x+w1, 90, w2, 40, 'center');
    if (this._mod === 'skill') {
        this.bitmap.drawText(TextManager.mpA, x+w1+w2, 90, w3, 40, 'center');
        this.bitmap.drawText(TextManager.tpA, x+w1+w2+w3, 90, w4, 40, 'center');
    } else this.bitmap.drawText('数量', x+w1+w2, 90, w3+w4, 40, 'center');
};
Xs_WindowItemSelection.prototype.createButtons = function() {
    this._buttonPgl = new Xs_Button(230, 475, 86, 28, '←左翻页');
    this._buttonPgr = new Xs_Button(410, 475, 86, 28, '右翻页→');
    this._buttonPgl.setPressMethod(this.inputOnPageup.bind(this));
    this._buttonPgr.setPressMethod(this.inputOnPagedown.bind(this));
    this.addChild(this._buttonPgl);
    this.addChild(this._buttonPgr);
};
Xs_WindowItemSelection.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2;
    this.y = (Graphics.height - this.height) / 2 - 10;
};
Xs_WindowItemSelection.prototype.startSelect = function(obj, mod, attacker, isStrikeBack) {
    if (!obj || !mod) return this.hide();
    attacker = attacker || null;
    this._isStrikeBack = isStrikeBack;
    if (this._obj !== obj || this._mod !== mod || this._attacker !== attacker) {
        this._obj = obj;
        this._mod = mod;
        this._attacker = attacker;
        this.drawUiFace();
        this.refreshPage();
        this.select(0, true);
        this.refresh();
    }
    this.show();
};
Xs_WindowItemSelection.prototype.hide = function() {
    Xs_WindowBase.prototype.hide.call(this);
    this._attacker = null;
    this._obj = null;
};
Xs_WindowItemSelection.prototype.maxItems = function() {
    return 8;
};
Xs_WindowItemSelection.prototype.items = function() {
    if (!this._mod) return [];
    if (this._mod === 'skill') return this._obj.xsBattler().xsSkills();
    return $gameParty.items();
};
Xs_WindowItemSelection.prototype.itemRect = function(index) {
    return new Rectangle(20, index*40+140, this.width-30, 36);
};
Xs_WindowItemSelection.prototype.isItemVaild = function(item) {
    if (!this._obj || !item) return false;
    if (!this._obj.isXsItemVaild(item, this._isStrikeBack)) return false;
    return !this._attacker || this._obj.xsCanUse(item, this._attacker);
};
Xs_WindowItemSelection.prototype.drawItemEffectRange = function(x, y, item) {
    if (!item) return;
    var arr = item.meta.NoAE ? [] : ['AE'];
    !item.meta.NoAA && arr.push('AA');
    !item.meta.NoAS && arr.push('AS');
    for (var i=0;i<arr.length;++i) {
        var index = XdRsData.SRPG.iconIndex(arr[i]);
        this.drawIcon(index, x+i*20, y, 18, 18);
    }
    if (XdRsData.SRPG.isMapGun(item)) {
        var lastSize = this.contents.fontSize;
        var lastColor = this.contents.textColor;
        this.contents.fontSize = 13;
        this.contents.textColor = 'rgb(180,60,0)';
        var tx = x + arr.length * 20 + 2;
        this.contents.drawText('[map]', tx, y-4, 60, 14);
        this.contents.fontSize = lastSize;
        this.contents.textColor = lastColor;
    }
};
Xs_WindowItemSelection.prototype.drawItem = function(index) {
    var item = this.pageItems()[index];
    if (!item) return;
    this.contents.fontSize = 20;
    this.contents.textColor = this.isItemVaild(item) ? 'rgb(255,255,255)' : 'rgb(160,0,0)';
    var rect = this.itemRect(index);
    this.drawIcon(item.iconIndex, rect.x+30, rect.y+4, 28, 28);
    var cw = this.contents.measureTextWidth(item.name) + 10;
    this.contents.drawText(item.name, rect.x+65, rect.y, cw, 36);
    this.drawItemEffectRange(rect.x+65+cw, rect.y+8, item);
    var text = XdRsData.SRPG.rangeText(item);
    this.contents.drawText(text, rect.x+250, rect.y, 120, 36, 'center');
    if (this._mod === 'skill') {
        var text2 = item.mpCost <= 0 ? '--' : ''+item.mpCost;
        var text3 = item.tpCost <= 0 ? '--' : ''+item.tpCost;
        this.contents.drawText(text2, rect.x+370, rect.y, 100, 36, 'center');
        this.contents.drawText(text3, rect.x+470, rect.y, 100, 36, 'center');
    } else {
        var text2 = $gameParty.numItems(item);
        this.contents.drawText(text2, rect.x+370, rect.y, 200, 36, 'center');
    }
};
Xs_WindowItemSelection.prototype.drawPage = function() {
    this.contents.fontSize = 22;
    this.contents.textColor = 'rgb(255,255,255)';
    var text = '' + (this._page+1) + '/' + this._maxPage;
    this.contents.drawText(text, 20, 462, 600, 26, 'center');
};
Xs_WindowItemSelection.prototype.drawOther = function() {
    if (!this._obj) return;
    this.contents.fontSize = 20;
    this.contents.textColor = 'rgb(255,255,255)';
    var actor = this._obj.xsBattler();
    this.contents.drawText(actor.name(), 20, 10, 580, 26, 'right');
    this.contents.fontSize = 14;
    this.drawMp(actor, 420, 50);
    this.drawTp(actor, 420, 70);
};
Xs_WindowItemSelection.prototype.inputOnOk = function() {
    if (!this.isItemVaild(this.item())) return SoundManager.playBuzzer();
    SoundManager.playOk();
    if (this._attacker) Xs_Manager.backForDuel(this.item().id);
    else Xs_Manager.displayAttack(this._obj, this.item());
    this.hide();
};
Xs_WindowItemSelection.prototype.inputOnCancel = function() {
    SoundManager.playCancel();
    if (!this._attacker) {
        Xs_Manager.startCommand(this._obj, true, true);
        Xs_Manager.wait(8);
    }
    this.hide();
};
//=================================================================================================
// 单位状态窗口
//=================================================================================================
function Xs_WindowUnitStatus() {
    this.initialize.apply(this, arguments);
}
Xs_WindowUnitStatus.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowUnitStatus.prototype.constructor = Xs_WindowUnitStatus;
Xs_WindowUnitStatus.prototype.initialize = function() {
    Xs_WindowBase.prototype.initialize.call(this, 520, 360);
    this.opacity = 220;
    this.activate();
    this.hide();
};
Xs_WindowUnitStatus.prototype.drawUiFace = function() {
    var color1 = 'rgb(120,120,120)', color2 = 'rgb(30,30,30)';
    this.bitmap.fillRoundRect(5,5,this.width-10,this.height-10,5,5,color1,color2);
    this.bitmap.fillRoundRect(15,15,100,100,5,2,color1);
};
Xs_WindowUnitStatus.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2;
    this.y = (Graphics.height - this.height) / 2 - 10;
};
Xs_WindowUnitStatus.prototype.display = function(obj) {
    this._obj = obj;
    this.refresh();
    this._obj ? this.show() : this.hide();
};
Xs_WindowUnitStatus.prototype.drawOther = function() {
    if (!this._obj) return this.hide();
    var actor = this._obj.xsBattler();
    this.drawFace(actor.faceName(), actor.faceIndex(), 17, 17, 98, 98);
    this.contents.fontSize = 24;
    this.contents.textColor = 'rgb(255,255,255)';
    this.contents.drawText(actor.name(), 130, 20, 360, 40);
    this.contents.fontSize = 22;
    this.contents.drawText('Lv.'+actor.level.padZero(2), 130, 50, 360, 40);
    this.contents.drawText(actor.currentClass().name, 130, 80, 360, 40);
    var arr = actor.stateIcons();
    for (var i=0;i<arr.length;++i) {
        this.drawIcon(arr[i], 20+34*i, 120);
    }
    this.contents.drawText('移动力:', 20, 150, 120, 40);
    this.contents.drawText(''+actor.xsMoveDistance(), 130, 150, 120, 40);
    var max = actor.maxXsNumActions();
    var now = this._obj.canXsAct() ? this._obj._xsNumActions : 0;
    this.contents.drawText('行动次数:', 20, 180, 120, 40);
    for (var i=0;i<max;++i) this.contents.drawText('☆',130+i*30,180,30,40);
    this.contents.textColor = 'rgb(160,0,200)';
    for (var i=0;i<now;++i) this.contents.drawText('★',130+i*30,180,30,40);
    this.contents.textColor = 'rgb(255,255,255)';
    this.contents.drawText('地形适应:', 20, 210, 120, 40);
    this.contents.drawText(XdRsData.SRPG.spaceWord(actor.xsSpaceType()), 130, 210, 120, 40);
    this.drawHp(actor, 20, 265, 240);
    this.drawMp(actor, 20, 290, 240);
    this.drawTp(actor, 20, 315, 240);
    if (this._obj.camp() === 0) this.drawExp(actor, 20, 335, 240);
    var rx = 300;
    this.contents.drawText('装备:', rx, 150, 150, 40);
    var equips = actor.equips();
    for (var i=0;i<equips.length;++i) {
        var equip = equips[i];
        if (!equip) continue;
        this.drawIcon(equip.iconIndex, rx+20, 190+i*32,30,30);
        this.contents.drawText(equip.name, rx+54, 185+i*32, 150, 40);
    }
};
Xs_WindowUnitStatus.prototype.inputOnCancel = function() {
    SoundManager.playCancel();
    Xs_Manager.wait(8);
    this.hide();
};
//=================================================================================================
// 战斗前，对决双方的信息窗口
//=================================================================================================
function Xs_DuelInfo() {
    this.initialize.apply(this, arguments);
}
Xs_DuelInfo.prototype = Object.create(Xs_WindowBase.prototype);
Xs_DuelInfo.prototype.constructor = Xs_DuelInfo;
Xs_DuelInfo.prototype.initialize = function() {
    Xs_WindowBase.prototype.initialize.call(this, 700, 520);
    this.activate();
    this.hide();
};
Xs_DuelInfo.prototype.drawUiFace = function() {
    var color1 = 'rgb(120,120,120)', color2 = 'rgb(30,30,30)', color3 = 'rgba(0,0,0,0)';
    var ax = this.width - 159, cw = this.width / 2;
    this.bitmap.fillRoundRect(5,5,155,155,5,5,color1,color2);
    this.bitmap.fillRoundRect(ax,5,155,155,5,5,color1,color2);
    this.bitmap.fillRoundRect(5,166,cw-10,350,5,5,color1,color2);
    this.bitmap.fillRoundRect(cw+5,166,cw-10,350,5,5,color1,color2);
    for (var i=0;i<6;++i) {
        this.bitmap.gradientFillRect(5,208+i*40,cw-20,2,color1,color3);
        this.bitmap.gradientFillRect(cw+15,208+i*40,cw-20,2,color3,color1);
    }
    this.bitmap.gradientFillRect(200,75,100,60,color3,color1);
    this.bitmap.fillRect(300,75,100,60,color1);
    this.bitmap.gradientFillRect(400,75,100,60,color1,color3);
    this.bitmap.gradientFillRect(200,80,100,50,color3,color2);
    this.bitmap.fillRect(300,80,100,50,color2);
    this.bitmap.gradientFillRect(400,80,100,50,color2,color3);
    this.bitmap.fillRoundRect(285,395,130,120,5,5,color1,color2);
    this.bitmap.clearRect(288, 398, 124, 130);
    this.bitmap.fontSize = 40;
    this.bitmap.drawText('VS',200,80,300,50,'center');
};
Xs_DuelInfo.prototype.createButtons = function() {
    var arr = ['确定','防御','回避','取消','按 ALT 键选择技能'];
    for (var i=0;i<5;++i) {
        var x = i < 4 ? 350 : 593;
        var y = i < 4 ? 420 + i * 40 : 349;
        var w = i < 4 ? 120 : 200;
        this._buttons[i] = new Xs_Button(x, y, w, 40, arr[i]);
        this._buttons[i].hide();
        this.addChild(this._buttons[i]);
    }
    this._buttons[0].setPressMethod(this.inputOnOk.bind(this));
    this._buttons[1].setPressMethod(this.setActionGuard.bind(this));
    this._buttons[2].setPressMethod(this.setActionAvoid.bind(this));
    this._buttons[3].setPressMethod(this.inputOnCancel.bind(this));
    this._buttons[4].setPressMethod(this.selectSkill.bind(this));
    this._buttons[3].y = 460;
    this._skipButton = new Xs_SkipBattleButton();
    this.addChild(this._skipButton);
};
Xs_DuelInfo.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2;
    this.y = (Graphics.height - this.height) / 2 - 10;
};
Xs_DuelInfo.prototype.isActive = function() {
    if (Xs_Manager.isWindowLimit('item')) return false;
    return Xs_WindowBase.prototype.isActive.call(this);
};
Xs_DuelInfo.prototype.display = function(data1, data2, initiative) {
    this._data1 = data1;
    this._data2 = data2;
    this._initiative = initiative;
    this._countDown = this.hasPlayer() ? 0 : 300;
    this.setupButtons();
    this.refresh();
    this.show();
};
Xs_DuelInfo.prototype.setupButtons = function() {
    var result = this.hasPlayer() && !this._initiative;
    this._canInputCancel = this.hasPlayer() && this._initiative;
    this._buttons[0].visible = true;
    this._buttons[1].visible = this._buttons[2].visible = result;
    this._buttons[3].visible = this._canInputCancel;
    this._buttons[4].visible = result;
};
Xs_DuelInfo.prototype.leftData = function() {
    if (this._data1.obj.isXsPlayer()) return this._data2;
    return this._data1;
};
Xs_DuelInfo.prototype.rightData = function() {
    if (this._data1.obj.isXsPlayer()) return this._data1;
    return this._data2;
};
Xs_DuelInfo.prototype.hasPlayer = function() {
    return this._data1.obj.isXsPlayer() || this._data2.obj.isXsPlayer();
};
Xs_DuelInfo.prototype.drawOther = function() {
    if (!this._data1 || !this._data2) return;
    this.drawLeftInfo();
    this.drawRightInfo();
};
Xs_DuelInfo.prototype.setActionGuard = function() {
    if (!this.hasPlayer()) return;
    SoundManager.playOk();
    var item = this.rightData().item;
    DataManager.isSkill
    if (DataManager.isSkill(item) && item.id!== 2) {
        this.rightData().item = $dataSkills[2];
        this.drawRightInfo();
    }
};
Xs_DuelInfo.prototype.setActionAvoid = function() {
    if (!this.hasPlayer()) return;
    SoundManager.playOk();
    var item = this.rightData().item;
    if (DataManager.isSkill(item) && item.id!== 3) {
        this.rightData().item = $dataSkills[3];
        this.drawRightInfo();
    }
};
Xs_DuelInfo.prototype.setActionSkillId = function(skillId) {
    if (!this.hasPlayer()) return;
    var item = this.rightData().item;
    if (!DataManager.isSkill(item)) return;
    if (item.id !== skillId) {
        this.rightData().item = $dataSkills[skillId];
        this.drawRightInfo();
    }
};
Xs_DuelInfo.prototype.selectSkill = function() {
    SoundManager.playOk();
    Xs_Manager.startItemSelect(this.rightData().obj, 'skill', this.leftData().obj, true);
};
Xs_DuelInfo.prototype.drawLeftInfo = function() {
    var actor = this.leftData().obj.xsBattler();
    this.contents.fontSize = 26;
    this.drawFace(actor.faceName(), actor.faceIndex(), 10, 10);
    this.drawCamp(this.leftData().obj.camp(), 162, 140, 182, 20);
    this.contents.drawText(actor.name(), 15, 170, 320, 40);
    this.contents.fontSize = 24;
    this.contents.drawText('Lv.'+actor.level.padZero(2), 15, 170, 300, 40, 'right');
    this.contents.drawText(actor.currentClass().name, 15, 210, 320, 40);
    var text = this.leftData().item.name;
    this.contents.drawText(text, 15, 290, 320, 40);
    var tagId = this.leftData().obj.terrainTag();
    this.drawIcon(XdRsData.SRPG.getTerrainIconIndex(tagId), 15, 374);
    this.contents.drawText(XdRsData.SRPG.getTerrainName(tagId), 55, 370, 280, 40);
    this.contents.fontSize = 20;
    this.drawHp(actor, 15, 430, 240);
    this.drawMp(actor, 15, 460, 240);
    this.drawTp(actor, 15, 490, 240);
};
Xs_DuelInfo.prototype.drawRightInfo = function() {
    this.contents.clearRect(360, 170, 330, 350);
    var actor = this.rightData().obj.xsBattler();
    var ax = this.width - 155;
    this.contents.fontSize = 26;
    this.drawFace(actor.faceName(), actor.faceIndex(), ax, 10);
    this.drawCamp(this.rightData().obj.camp(), 355, 140, 182, 20);
    this.contents.drawText(actor.name(), 365, 170, 320, 40, 'right');
    this.contents.fontSize = 24;
    this.contents.drawText('Lv.'+actor.level.padZero(2), 385, 170, 320, 40);
    this.contents.drawText(actor.currentClass().name, 365, 210, 320, 40, 'right');
    var text = this.rightData().item.name;
    this.contents.drawText(text, 365, 290, 320, 40, 'right');
    var tagId = this.rightData().obj.terrainTag();
    this.drawIcon(XdRsData.SRPG.getTerrainIconIndex(tagId), 653, 374);
    this.contents.drawText(XdRsData.SRPG.getTerrainName(tagId), 365, 370, 280, 40, 'right');
    this.contents.fontSize = 20;
    this.drawHp(actor, 435, 430, 240);
    this.drawMp(actor, 435, 460, 240);
    this.drawTp(actor, 435, 490, 240);
};
Xs_DuelInfo.prototype.updateOther = function() {
    if (!this.isActive() || !this._countDown) return;
    this._countDown--;
    !this._countDown && this.inputOnOk();
};
Xs_DuelInfo.prototype.inputOnOk = function() {
    SoundManager.playOk();
    if (ConfigManager.isFightingOnMap) {
        this.startFightingOnMap();
    } else {
        this._data1.obj.lookAtEachOther(this._data2.obj);
        var forerunner = this._data1 === this.leftData() ? 'left' : 'right';
        var lData = this.leftData();
        if (lData.obj === this.rightData().obj) lData = null;
        Xs_Manager.startBattle(lData, this.rightData(), forerunner);
    }
    this.hide();
};
Xs_DuelInfo.prototype.startFightingOnMap = function() {
    var objL = this.leftData().obj.xsBattler();
    var objR = this.rightData().obj.xsBattler();
    var actionL = new Game_Action(objL);
    var actionR = new Game_Action(objR);
    actionL.setItemObject(this.leftData().item);
    actionR.setItemObject(this.rightData().item);
    objL.addXsAction(actionL);
    objR.addXsAction(actionR);
    var fn = this._data1 === this.leftData() ? 'left' : 'right';
    var subject = fn === 'left' ? this.leftData().obj : this.rightData().obj;
    var targets = [fn === 'left' ? this.rightData().obj : this.leftData().obj];
    var item = fn === 'left' ? this.leftData().item : this.leftData().item;
    var point = new Point(targets[0].x, targets[0].y);
    subject.turnTowardCharacter(targets[0]);
    Xs_Manager.startAction(subject, targets, item, point);
};
Xs_DuelInfo.prototype.inputOnCancel = function() {
    if (!this._canInputCancel) return;
    SoundManager.playCancel();
    var item = this.rightData().item;
    Xs_Manager.displayAttack(this.rightData().obj, item);
    this.hide();
};
//=================================================================================================
// 战斗界面，战斗双方状态窗口
//=================================================================================================
function Xs_WindowBattleState() {
    this.initialize.apply(this, arguments);
}
Xs_WindowBattleState.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowBattleState.prototype.constructor = Xs_WindowBattleState;
Xs_WindowBattleState.prototype.initialize = function(type, data) {
    this._type = type;
    this._data = data;
    this._moveData = {};
    Xs_WindowBase.prototype.initialize.call(this, 408, 150);
    this.activate();
};
Xs_WindowBattleState.prototype.drawUiFace = function() {
    var w = this.width, h = this.height;
    var color = XdRsData.SRPG.campColor(this._data.obj.camp());
    this.bitmap.fillRoundRect(5,5,w-8,h-8,5,5,color,'rgb(30,30,30)');
    var fx = this._type === 'left' ? 15 : this.width - 90;
    this.bitmap.fillRoundRect(fx,15,78,78,3,2,'rgb(120,120,120)');
    fx = this._type === 'left' ? 230 : 20;
    this.bitmap.fillRoundRect(fx,15,160,32,3,2,'rgb(120,120,120)');
};
Xs_WindowBattleState.prototype.setupPostion = function() {
    this.x = this._type === 'left' ? -this.width : Graphics.width;
    this.y = Graphics.height - this.height;
};
Xs_WindowBattleState.prototype.setup = function() {
    if (this._type === this.parent._forerunner) {
        this.x = this._type === 'left' ? Graphics.width/2-this.width : Graphics.width/2;
        this.startMoveStage1();
    }
};
Xs_WindowBattleState.prototype.startMoveStage1 = function() {
    var n = Graphics.width / 80;
    this._moveData.count = 40;
    this._moveData.stage = 1;
    this._moveData.speed = this._type === 'left' ? n : -n;
};
Xs_WindowBattleState.prototype.startMoveStage2 = function() {
    var n = Graphics.width / 80;
    this._moveData.count = 40;
    this._moveData.stage = 2;
    this._moveData.speed = this._type === 'left' ? -n : n;
};
Xs_WindowBattleState.prototype.moveIn = function() {
    var n = Graphics.width / 80;
    this._moveData.count = 40;
    var result = this._type === 'left';
    this._moveData.speed = result ? n : -n;
};
Xs_WindowBattleState.prototype.onMoveEnd = function() {
    if (this._moveData.stage === 1) {
        this.startMoveStage2();
        this.parent.linkage(this._type);
    }else {
        if (this._moveData.stage === 2) {
            this.parent.startTurn();
        }
        this._moveData = {};
    }
};
Xs_WindowBattleState.prototype.drawOther = function() {
    this.contents.fontSize = 22;
    var actor = this._data.obj.xsBattler();
    var x = this._type === 'left' ? 17 : this.width - 88;
    this.drawFace(actor.faceName(), actor.faceIndex(), x, 17, 75, 75);
    x = this._type === 'left' ? 105 : 15;
    this.contents.drawText(actor.name(), x, 35, 290, 40, this._type);
    this.contents.fontSize = 20;
    this.contents.drawText('Lv.'+actor.level.padZero(2), x, 60, 290, 40, this._type);
    x = this._type === 'left' ? 235 : 25;
    var text = this._data.item.name;
    this.contents.drawText(text, x, 16, 150, 32, 'center');
    this.contents.fontSize = 16;
    x = this._type === 'left' ? 210 : 20;
    this.drawHp(actor, x, 90);
    this.drawMp(actor, x, 110);
    this.drawTp(actor, x, 130);
};
Xs_WindowBattleState.prototype.updateOther = function() {
    if (!this.isActive()) return;
    if (this._moveData.count) {
        this._moveData.count--;
        this.x += this._moveData.speed;
        if (!this._moveData.count) this.onMoveEnd();
    }
};
//=================================================================================================
// 战斗后的结算窗口
//=================================================================================================
function Xs_WindowBattleResult() {
    this.initialize.apply(this, arguments);
}
Xs_WindowBattleResult.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowBattleResult.prototype.constructor = Xs_WindowBattleResult;
Xs_WindowBattleResult.prototype.initialize = function() {
    this._data = null;
    Xs_WindowBase.prototype.initialize.call(this, 100, 120);
    this.activate();
    this.hide();
};
Xs_WindowBattleResult.prototype.drawUiFace = function() {
    this.bitmap.clear();
    if (!this._data) return;
    var cw1 = this.bitmap.measureTextWidth(this.expText()) + 80;
    var cw2 = this.bitmap.measureTextWidth(this.goldText()) + 80;
    var width = Math.max(cw1, cw2);
    this.bitmap = new Bitmap(width, 120);
    this._contentsSprite.bitmap = new Bitmap(width, 120);
    this.contents = this._contentsSprite.bitmap;
    this.bitmap.fillRoundRect(5,5,this.width-10,50,5,5,'rgb(120,120,120)','rgb(30,30,30)');
    this.bitmap.fillRoundRect(5,65,this.width-10,50,5,5,'rgb(120,120,120)','rgb(30,30,30)');
};
Xs_WindowBattleResult.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2;
    this.y = (Graphics.height - this.height) / 2;
};
Xs_WindowBattleResult.prototype.display = function(data) {
    this.hide();
    this._data = data;
    this._count = this._data ? 400 : 0;
    if (this._data) {
        this._data.actor.gainExp(this._data.exp);
        $gameParty.gainGold(this._data.gold);
        this.show();
    }
    this.drawUiFace();
    this.setupPostion();
    this.refresh();
};
Xs_WindowBattleResult.prototype.expText = function() {
    if (!this._data) return '';
    var expWord = TextManager.expA;
    return this._data.actor.name() + ' 获得 '+expWord+': '+this._data.exp;
};
Xs_WindowBattleResult.prototype.goldText = function() {
    if (!this._data) return '';
    var goldWord = TextManager.currencyUnit;
    return '获得 '+goldWord+': '+this._data.gold;
};
Xs_WindowBattleResult.prototype.drawOther = function() {
    if (!this._data) return;
    this.contents.drawText(this.expText(), 0, 0, this.width, 60, 'center');
    this.contents.drawText(this.goldText(), 0, 60, this.width, 60, 'center');
};
Xs_WindowBattleResult.prototype.updateOther = function() {
    if (this.isActive()) {
        if (TouchInput.isTriggered()) return this.inputOnOk();
        if (this._count) {
            this._count--;
            !this._count && this.inputOnOk();
        }
    }
};
Xs_WindowBattleResult.prototype.inputOnOk = function() {
    SoundManager.playOk();
    this.parent._logWindow._waitCount = 60;
    this.hide();
};
Xs_WindowBattleResult.prototype.inputOnCancel = function() {
    this.inputOnOk();
};
//=================================================================================================
function Xs_WindowMapFightInfo() {
    this.initialize.apply(this, arguments);
}
Xs_WindowMapFightInfo.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowMapFightInfo.prototype.constructor = Xs_WindowMapFightInfo;
Xs_WindowMapFightInfo.prototype.initialize = function() {
    Xs_WindowBase.prototype.initialize.call(this, 426, 72);
};
Xs_WindowMapFightInfo.prototype.drawUiFace = function() {
    var cw = (this.width-52) / 2;
    this.bitmap.fillRoundRect(3,3,cw,this.height-6,5,3,'rgb(120,120,120)','rgba(30,30,30,0.5)');
    this.bitmap.fillRoundRect(cw+6,3,40,this.height-6,5,3,'rgb(120,120,120)','rgba(30,30,30,0.5)');
    this.bitmap.fillRoundRect(cw+49,3,cw,this.height-6,5,3,'rgb(120,120,120)','rgba(30,30,30,0.5)');
};
Xs_WindowMapFightInfo.prototype.setupPostion = function() {
    this.y = -72;
};
Xs_WindowMapFightInfo.prototype.display = function(data) {
    if (!data) return;
    this._actionType = 1;
    this._data = data;
    this.refresh();
};
Xs_WindowMapFightInfo.prototype.finish = function() {
    this._actionType = 2;
    this._data = null;
};
Xs_WindowMapFightInfo.prototype.subActor = function() {
    return this._data.subject.xsBattler();
};
Xs_WindowMapFightInfo.prototype.targets = function() {
    return this._data.targets;
};
Xs_WindowMapFightInfo.prototype.faceSizeCount = function() {
    var size = 60;
    var height = 64;
    var max = this.targets().length;
    var cl = Math.floor(height / (size + 4));
    var mn = Math.floor(180 / (size + 4));
    while ((mn * cl) < max) {
        size -= 2;
        cl = Math.floor(height / (size + 4));
        mn = Math.floor(180 / (size + 4));
    }
    return size;
};
Xs_WindowMapFightInfo.prototype.drawOther = function() {
    if (!this._data) return;
    this.drawSubject();
    this.drawMandatorySign();
    this.drawTargets();
};
Xs_WindowMapFightInfo.prototype.drawGeneralActor = function(actor, item, type) {
    var ox = type === 'left' ? 6 : 246;
    var fx = type === 'left' ? ox : ox + 110;
    var tx = type === 'left' ? 65 : ox;
    var ty = item ? 10 : 24;
    this.contents.fontSize = 18;
    this.drawFace(actor.faceName(), actor.faceIndex(), fx, 6, 60, 60);
    this.contents.textColor = 'white';
    this.contents.drawText(actor.name(), tx, ty, 120, 24, 'center');
    if (item) {
        var cw = this.contents.measureTextWidth(item.name) + 8;
        tx = (120 - cw - 26) / 2 + tx + 4;
        this.drawIcon(item.iconIndex, tx, ty+28, 24, 24);
        this.contents.drawText(item.name, tx+26, ty+28, 90, 24);
    }
};
Xs_WindowMapFightInfo.prototype.drawSubject = function() {
    var item = this.subActor().currentAction().item();
    this.drawGeneralActor(this.subActor(), item, 'left');
};
Xs_WindowMapFightInfo.prototype.drawMandatorySign = function() {
    var color = XdRsData.SRPG.campColor(this.subActor().camp);
    this.contents.drawArrow(198, 24, 30, 24, color, 'right');
};
Xs_WindowMapFightInfo.prototype.drawTargets = function() {
    if (!this.targets().length) return;
    var targets = this.targets();
    if (targets.length === 1) {
        var actor = targets[0].xsBattler();
        this.drawGeneralActor(actor, null, 'right');
    } else {
        var size = this.faceSizeCount();
        var col = Math.floor(64 / (size + 4));
        var mtn = Math.floor(180 / (size + 4));
        var ox = (180 - (size+4) * mtn) / 2 + 246;
        var oy = (64 - (size+4) * col) / 2 + 6;
        for (var i=0;i<targets.length;++i) {
            var a = targets[i].xsBattler();
            var x = i % mtn * size + 2 + ox;
            var y = Math.floor(i / mtn) * size + 2 + oy;
            this.drawFace(a.faceName(), a.faceIndex(), x, y, size, size);
        }
    }
    
};
Xs_WindowMapFightInfo.prototype.isInPlace = function() {
    if (!this._actionType) return true;
    if (this._actionType === 1) return this.y === 0;
    return this.y === -72;
};
Xs_WindowMapFightInfo.prototype.updateOther = function() {
    if (!this._actionType) return;
    if (this.isInPlace()) this._actionType = 0;
    else this.y += (this._actionType === 1 ? 9 : -9);
};
//=================================================================================================
// end
//=================================================================================================