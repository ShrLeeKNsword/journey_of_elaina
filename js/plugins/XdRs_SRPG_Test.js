//=================================================================================================
// XS_Test.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc [XS.SRPG] 地图炮范围设置 <辅助编辑类插件，非游戏正式插件>。
* @author 芯☆淡茹水
* @help
*
* 该插件状态处于 ON 时，测试游戏会自动进入设置界面，
* 可以对选择的技能进行 不规则形状 的地图炮攻击范围的设置。
*
* 以下类型的技能，将不会被纳入技能候选列表：
* 1，技能未写名字。
* 2，技能的 伤害类型 为 无 。
* 3，技能已经备注为 投掷类地图炮 。
*
*/
//=================================================================================================
function Sprite_XsMakeBg() {
    this.initialize.apply(this, arguments);
}
Sprite_XsMakeBg.prototype = Object.create(Sprite.prototype);
Sprite_XsMakeBg.prototype.constructor = Sprite_XsMakeBg;
Sprite_XsMakeBg.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(Graphics.width, Graphics.height);
    this.setupSize();
};
Sprite_XsMakeBg.prototype.setupSize = function(size) {
    size = size || 32;
    if (this._size !== size) {
        this._size = size;
        this.drawCheck();
    }
};
Sprite_XsMakeBg.prototype.drawCheck = function() {
    this.bitmap.clear();
    this.bitmap.fillAll('rgb(160,160,160)');
    var nw = Math.ceil(Graphics.width / this._size);
    var nh = Math.ceil(Graphics.height / this._size);
    for (var x=0;x<nw;++x) {
        var bx = x * this._size;
        bx -= (x > 0 ? 0.5 : 0);
        this.bitmap.fillRect(bx,0,1,this.bitmap.height,'rgb(0,0,0)');
    }
    for (var y=0;y<nw;++y) {
        var by = y*this._size;
        by -= (y > 0 ? 0.5 : 0);
        this.bitmap.fillRect(0,by,this.bitmap.width,1,'rgb(0,0,0)');
    }
};
//=================================================================================================
function Sprite_XsMapGunSet() {
    this.initialize.apply(this, arguments);
}
Sprite_XsMapGunSet.prototype = Object.create(Sprite.prototype);
Sprite_XsMapGunSet.prototype.constructor = Sprite_XsMapGunSet;
Sprite_XsMapGunSet.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(Graphics.width, Graphics.height);
    this._direction = 8;
    this.setupSize();
    this.setup();
};
Sprite_XsMapGunSet.prototype.skill = function() {
    return this._skill;
};
Sprite_XsMapGunSet.prototype.changeSkill = function(skill) {
    if (this._skill !== skill) {
        this._skill = skill;
        this._isStorage = true;
        this.setup();
    }
};
Sprite_XsMapGunSet.prototype.setupSize = function(size) {
    this._size = size || 32;
    this._ox = Math.ceil(Graphics.width / this._size / 2);
    this._oy = Math.ceil(Graphics.height / this._size / 2);
    this.refresh();
};
Sprite_XsMapGunSet.prototype.setup = function() {
    this._points = [];
    if (this._skill) this._points = this._skill.xsMapGunData || [];
    this.refresh();
};
Sprite_XsMapGunSet.prototype.refresh = function() {
    this.bitmap.clear();
    if (!this._points) return;
    var size = this._size - 2;
    var ox = this._ox * this._size + 1;
    var oy = this._oy * this._size + 1;
    var d = ['','down','left','right','up'][this._direction/2];
    this.bitmap.fillRect(ox, oy, size, size, 'green');
    this.bitmap.drawArrow(ox+4, oy+4, size-8, size-8, 'black', d);
    this._points.forEach(function(p){
        var rp = new Point(p[0], p[1]);
        rp = XdRsData.SRPG.getRealPointByDirection(rp, this._direction);
        var x = ox + rp.x * this._size;
        var y = oy + rp.y * this._size;
        this.bitmap.fillRect(x, y, size, size, 'red');
    }, this);
};
Sprite_XsMapGunSet.prototype.onInputDir4 = function(direction) {
    if (this._direction !== direction) {
        this._direction = direction;
        this.refresh();
    }
};
Sprite_XsMapGunSet.prototype.hasPoint = function(point) {
    if (!this._points || !this._points.length) return false;
    return this._points.some(function(p){
        return p[0] === point.x && p[1] === point.y;
    });
};
Sprite_XsMapGunSet.prototype.realTouchPoint = function() {
    var x = Math.floor(TouchInput.x / this._size) - this._ox;
    var y = Math.floor(TouchInput.y / this._size) - this._oy;
    if (this._direction === 8) return new Point(x, y);
    var d = this._direction;
    var rx = d === 2 ? -x : (d === 4 ? -y : y);
    var ry = d === 2 ? -y : (d === 4 ? x : -x);
    return new Point(rx, ry);
};
Sprite_XsMapGunSet.prototype.isRevoke = function() {
    if (!this._skill) return false;
    return this._points.length > 0 || !!this._skill.xsMapGunData;
};
Sprite_XsMapGunSet.prototype.revoke = function() {
    if (this._skill) {
        this._skill.xsMapGunData = null;
        this.setup();
    }
};
Sprite_XsMapGunSet.prototype.saveMapGunData = function() {
    if (!this._skill) return;
    this._skill.xsMapGunData = (!this._points || !this._points.length) ? null : this._points;
    this._isStorage = true;
    this.parent.storage();
};
Sprite_XsMapGunSet.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._isActive) {
        this.updateTouch();
        Input.dir4 && this.onInputDir4(Input.dir4);
    }
};
Sprite_XsMapGunSet.prototype.updateTouch = function() {
    if (this._skill && TouchInput.isTriggered() && !this.parent.isTouchHelp()) {
        this._isStorage = false;
        var p = this.realTouchPoint();
        if (this.hasPoint(p)) {
            for (var i=0;i<this._points.length;++i) {
                if (this._points[i][0] === p.x && this._points[i][1] === p.y) {
                    this._points.splice(i, 1);
                    break;
                }
            }
        } else this._points[this._points.length] = [p.x, p.y];
        this.refresh();
    }
};
//=================================================================================================
function Xs_WindowMakeHelp() {
    this.initialize.apply(this, arguments);
}
Xs_WindowMakeHelp.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowMakeHelp.prototype.constructor = Xs_WindowMakeHelp;
Xs_WindowMakeHelp.prototype.initialize = function() {
    Xs_WindowBase.prototype.initialize.call(this, 316, 126);
};
Xs_WindowMakeHelp.prototype.setSkill = function(skill) {
    if (this._skill !== skill) {
        this._skill = skill;
        this.refresh();
    }
};
Xs_WindowMakeHelp.prototype.drawUiFace = function() {
    this.bitmap.fillRoundRect(3,3,310,120,5,3,'rgba(0,0,0)','rgb(200,200,200)');
    this.bitmap.fillRect(3, 28, 310, 1, 'rgba(0,0,0)');
};
Xs_WindowMakeHelp.prototype.createButtons = function() {
    this._buttonUp = new Xs_Button(56, 50, 32, 32, '');
    this._buttonLeft = new Xs_Button(24, 76, 32, 32, '');
    this._buttonDown = new Xs_Button(56, 102, 32, 32, '');
    this._buttonRight = new Xs_Button(88, 76, 32, 32, '');
    this._buttonEnr = new Xs_Button(140, 98, 32, 32, '+');
    this._buttonDel = new Xs_Button(180, 98, 32, 32, '-');
    this._buttonSelect = new Xs_Button(160, 54, 96, 36, '选择技能', 'rgb(0,200,200)');
    this._buttonReset  = new Xs_Button(260, 54, 96, 36, '重置范围', 'rgb(0,200,200)');
    this._buttonSave = new Xs_Button(260, 98, 96, 36, '保存范围', 'rgb(0,200,200)');
    this._buttonUp.bitmap.drawArrow(10, 10, 12, 12, 'black', 'up');
    this._buttonLeft.bitmap.drawArrow(10, 10, 12, 12, 'black', 'left');
    this._buttonDown.bitmap.drawArrow(10, 10, 12, 12, 'black', 'down');
    this._buttonRight.bitmap.drawArrow(10, 10, 12, 12, 'black', 'right');
    this._buttonUp.setPressMethod(this.onUpButtonPress.bind(this));
    this._buttonLeft.setPressMethod(this.onLeftButtonPress.bind(this));
    this._buttonDown.setPressMethod(this.onDownButtonPress.bind(this));
    this._buttonRight.setPressMethod(this.onRightButtonPress.bind(this));
    this._buttonEnr.setPressMethod(this.onEnrButtonPress.bind(this));
    this._buttonDel.setPressMethod(this.onDelButtonPress.bind(this));
    this._buttonSelect.setPressMethod(this.onSelectButtonPress.bind(this)); 
    this._buttonReset.setPressMethod(this.onResetButtonPress.bind(this));
    this._buttonSave.setPressMethod(this.onSaveButtonPress.bind(this));
    this.addChild(this._buttonUp);
    this.addChild(this._buttonLeft);
    this.addChild(this._buttonDown);
    this.addChild(this._buttonEnr);
    this.addChild(this._buttonDel);
    this.addChild(this._buttonRight);
    this.addChild(this._buttonSelect);
    this.addChild(this._buttonReset);
    this.addChild(this._buttonSave);
};
Xs_WindowMakeHelp.prototype.drawOther = function() {
    this.contents.outlineWidth = 0;
    this.contents.fontSize = 18;
    this.contents.textColor = 'black';
    if (!this._skill) {
        this.contents.drawText('请选择技能', 0, 5, 316, 24, 'center');
        return;
    }
    var text = '技能id: ' + this._skill.id;
    this.contents.drawText(text, 10, 5, 130, 24);
    this.drawIcon(this._skill.iconIndex, 150, 5, 22, 22);
    this.contents.drawText(this._skill.name, 176, 5, 134, 24);
};
Xs_WindowMakeHelp.prototype.topRect = function() {
    return new Rectangle(this.x, this.y, this.width, 28);
};
Xs_WindowMakeHelp.prototype.onUpButtonPress = function() {
    this.parent.setDirection(8);
};
Xs_WindowMakeHelp.prototype.onLeftButtonPress = function() {
    this.parent.setDirection(4);
};
Xs_WindowMakeHelp.prototype.onRightButtonPress = function() {
    this.parent.setDirection(6);
};
Xs_WindowMakeHelp.prototype.onDownButtonPress = function() {
    this.parent.setDirection(2);
};
Xs_WindowMakeHelp.prototype.onEnrButtonPress = function() {
    this.parent.changeSize(1);
};
Xs_WindowMakeHelp.prototype.onDelButtonPress = function() {
    this.parent.changeSize(0);
};
Xs_WindowMakeHelp.prototype.onSelectButtonPress = function() {
    this.parent.startSelectSkill();
};
Xs_WindowMakeHelp.prototype.onResetButtonPress = function() {
    this.parent.resetSkill();
};
Xs_WindowMakeHelp.prototype.onSaveButtonPress = function() {
    this.parent.saveSkill();
};
Xs_WindowMakeHelp.prototype.updateOther = function() {
    if (!this.isActive()) {
        if (this._isTouched) this._isTouched = false;
        return;
    }
    if (!this._isTouched) {
        if (TouchInput.isTriggered() && TouchInput.inRect(this.topRect())) {
            this._touchX = TouchInput.x - this.x;
            this._touchY = TouchInput.y - this.y;
            this._isTouched = true;
        }
    }else{
        this._isTouched = TouchInput.isPressed();
        if (this._isTouched) {
            this.x = TouchInput.x - this._touchX;
            this.y = TouchInput.y - this._touchY;
            this.x = Math.max(0, Math.min(Graphics.width - this.width, this.x));
            this.y = Math.max(0, Math.min(Graphics.height - this.height, this.y));
        }else {
            this._touchX = null;
            this._touchY = null;
        }
    }
};
//=================================================================================================
function Xs_WindowMapGunSkillList() {
    this.initialize.apply(this, arguments);
}
Xs_WindowMapGunSkillList.prototype = Object.create(Xs_WindowBase.prototype);
Xs_WindowMapGunSkillList.prototype.constructor = Xs_WindowMapGunSkillList;
Xs_WindowMapGunSkillList.prototype.initialize = function() {
    this.setupSkills();
    Xs_WindowBase.prototype.initialize.call(this, 640, 480);
    this.activate();
};
Xs_WindowMapGunSkillList.prototype.setupSkills = function() {
    this._skills = $dataSkills.filter(XdRsData.SRPG.isDebugItem.bind(XdRsData.SRPG));
};
Xs_WindowMapGunSkillList.prototype.drawUiFace = function() {
    var w = this.width, h = this.height;
    this.bitmap.fillRoundRect(5,5,w-10,h-10,10,5,'rgb(0,0,0)','rgb(200,200,200)');
    this.bitmap.fillRoundRect(90,25,460,56,10,3,'rgb(120,120,120)','rgb(255,255,255)');
    for (var i=0;i<7;++i) {
        this.bitmap.fillRoundRect(20, 100+i*46, 600, 38, 5, 1,'rgb(0,0,0)','rgba(0,0,0,0.2)');
        this.bitmap.drawCircle(35, 120+i*46, 10, 'rgb(0,0,0)');
    }
    this.bitmap.fontSize = 32;
    this.bitmap.textColor = 'rgb(130,30,0)';
    this.bitmap.drawText('请选择设置地图炮范围的技能', 95, 26, 450, 56, 'center');
};
Xs_WindowMapGunSkillList.prototype.setupPostion = function() {
    this.x = (Graphics.width - this.width) / 2;
    this.y = (Graphics.height - this.height) / 2;
    this.contents.outlineWidth = 0;
    this.contents.fontSize = 24;
};
Xs_WindowMapGunSkillList.prototype.createButtons = function() {
    this._buttonPgl = new Xs_Button(220, 442, 86, 28, '←左翻页');
    this._buttonPgr = new Xs_Button(420, 442, 86, 28, '右翻页→');
    this._buttonPgl.setPressMethod(this.inputOnPageup.bind(this));
    this._buttonPgr.setPressMethod(this.inputOnPagedown.bind(this));
    this.addChild(this._buttonPgl);
    this.addChild(this._buttonPgr);
};
Xs_WindowMapGunSkillList.prototype.isVaild = function() {
    return !!this.item();
};
Xs_WindowMapGunSkillList.prototype.items = function() {
    return this._skills;
};
Xs_WindowMapGunSkillList.prototype.maxItems = function() {
    return 7;
};
Xs_WindowMapGunSkillList.prototype.itemRect = function(index) {
    return new Rectangle(25, index*46+101, 600, 38);
};
Xs_WindowMapGunSkillList.prototype.drawItem = function(index) {
    var skill = this.pageItems()[index];
    if (!skill) return;
    var rect = this.itemRect(index);
    var text = '技能id:' + skill.id;
    this.contents.textColor = 'rgb(0,0,0)';
    this.contents.drawText(text, rect.x + 40, rect.y, 160, 38);
    this.drawIcon(skill.iconIndex, rect.x + 200, rect.y+2);
    this.contents.drawText(skill.name, rect.x + 240, rect.y, 200, 38);
    if (XdRsData.SRPG.isSpecialMapGun(skill)) {
        this.contents.textColor = 'rgb(130,30,0)';
        this.contents.drawText('[ map ]', rect.x + 440, rect.y, 200, 38, 'center');
    }
};
Xs_WindowMapGunSkillList.prototype.drawPage = function() {
    this.contents.textColor = 'rgb(130,30,0)';
    var text = '' + (this._page+1) + '/' + this._maxPage;
    this.contents.drawText(text, 20, 430, 600, 26, 'center');
};
//=================================================================================================
function Scene_XsMapGunMake() {
    this.initialize.apply(this, arguments);
}
Scene_XsMapGunMake.prototype = Object.create(Scene_Base.prototype);
Scene_XsMapGunMake.prototype.constructor = Scene_XsMapGunMake;
Scene_XsMapGunMake.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createDebug();
    this.createHelpWindow();
    this.createListWindow();
};
Scene_XsMapGunMake.prototype.createBackground = function() {
    this._background = new Sprite_XsMakeBg();
    this.addChild(this._background);
};
Scene_XsMapGunMake.prototype.createDebug = function() {
    this._debug = new Sprite_XsMapGunSet();
    this.addChild(this._debug);
};
Scene_XsMapGunMake.prototype.createHelpWindow = function() {
    this._helpWindow = new Xs_WindowMakeHelp();
    this.addChild(this._helpWindow);
};
Scene_XsMapGunMake.prototype.createListWindow = function() {
    this._listWindow = new Xs_WindowMapGunSkillList();
    this._listWindow.setHandler('ok', this.onListOk.bind(this));
    this.addChild(this._listWindow);
};
Scene_XsMapGunMake.prototype.onListOk = function() {
    this._listWindow.hide();
    this.setSkill(this._listWindow.item());
    this.startDebug();
};
Scene_XsMapGunMake.prototype.startSelectSkill = function() {
    if (!this._debug._isStorage) {
        var msg = '是否保存当前技能编辑的地图炮范围？';
        confirm(msg) && this._debug.saveMapGunData();
    }
    this.stopDebug();
    this._listWindow.refresh();
    this._listWindow.show();
    this._listWindow.activate();
};
Scene_XsMapGunMake.prototype.resetSkill = function() {
    if (!this._debug.isRevoke()) return;
    var msg = '重置技能编辑的地图炮范围，技能将变成普通技能，是否执行？';
    if (confirm(msg)) {
        this._debug.revoke();
        this.storage(true);
    }
};
Scene_XsMapGunMake.prototype.saveSkill = function() {
    if (!this._debug.skill()) return;
    if (!this._debug._isStorage) {
        this._debug.saveMapGunData();
    }
};
Scene_XsMapGunMake.prototype.startDebug = function() {
    this._helpWindow.activate();
    this._debug._isActive = true;
};
Scene_XsMapGunMake.prototype.stopDebug = function() {
    this._helpWindow.deactivate();
    this._debug._isActive = false;
};
Scene_XsMapGunMake.prototype.isTouchHelp = function() {
    return this._helpWindow && this._helpWindow.isTouch();
};
Scene_XsMapGunMake.prototype.changeSize = function(type) {
    var size = this._debug._size + (type ? 4 : -4);
    size = Math.max(12, Math.min(48, size));
    this._background.setupSize(size);
    this._debug.setupSize(size);
};
Scene_XsMapGunMake.prototype.setSkill = function(skill) {
    this._helpWindow.setSkill(skill);
    this._debug.changeSkill(skill);
};
Scene_XsMapGunMake.prototype.setDirection = function(direction) {
    this._debug.onInputDir4(direction);
};
Scene_XsMapGunMake.prototype.storage = function(reset) {
    if (!this._debug.skill()) return;
    var fs = require('fs');
    var data = JSON.stringify($dataSkills);
    fs.writeFileSync('./data/Skills.json', data);
    alert('范围已经'+(reset ? '重置' : '储存')+'\n需关闭工程再打开才生效！');
};

//=================================================================================================
Scene_Boot.prototype.startNormalGame = function() {
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    SceneManager.goto(Scene_XsMapGunMake);
    Window_TitleCommand.initCommandPosition();
};
//=================================================================================================
// end 
//=================================================================================================