//=================================================================================================
// XS_Scene.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc [XS.SRPG] 游戏场景。
* @author 芯☆淡茹水
* @help
*
*/
//=================================================================================================
;var XdRsData = XdRsData || {};
XdRsData.SRPG = XdRsData.SRPG || {};
//=================================================================================================
// Scene_Base 修改
//=================================================================================================
XdRsData.SRPG.Scene_Base_isAutosaveEnabled = Scene_Base.prototype.isAutosaveEnabled;
Scene_Base.prototype.isAutosaveEnabled = function() {
    return !Xs_Manager.isRuning() && XdRsData.SRPG.Scene_Base_isAutosaveEnabled.call(this);
};
//=================================================================================================
// Scene_Map 修改
//=================================================================================================
XdRsData.SRPG.Scene_Map_createWindowLayer = Scene_Map.prototype.createWindowLayer;
Scene_Map.prototype.createWindowLayer = function() {
    this.createXsWindowLayer();
    XdRsData.SRPG.Scene_Map_createWindowLayer.call(this);
};
XdRsData.SRPG.Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    XdRsData.SRPG.Scene_Map_createDisplayObjects.call(this);
    Xs_Manager.isRuning() && this.createXsWindows();
};
Scene_Map.prototype.createXsWindowLayer = function() {
    this._xsWindowLayer = new Sprite();
    this._xsWindowLayer.currentXsCod = this.currentXsCod.bind(this);
    this.addChild(this._xsWindowLayer);
};
Scene_Map.prototype.createXsWindows = function() {
    this._spriteset.createXsParts();
    this._xsWindows = {};
    this._xsWindows.tarInfo = new Xs_WindowTerrainInfo();
    this._xsWindows.info    = new Xs_WindowBattlerInfo();
    this._xsWindows.select  = new Xs_WindowActorSelect();
    this._xsWindows.command = new Xs_WindowCommand();
    this._xsWindows.status  = new Xs_WindowUnitStatus();
    this._xsWindows.menu    = new Xs_MenuCommand();
    this._xsWindows.duel    = new Xs_DuelInfo();
    this._xsWindows.item    = new Xs_WindowItemSelection();
    this._xsWindows.choice  = new Xs_WindowChoice();
    this._xsWindows.control = new Xs_BattleControl();
    this._xsWindows.tips    = new Xs_WindowTips();
    Object.keys(this._xsWindows).forEach(function(key){
        !['choice','tips'].contains(key) && this._xsWindowLayer.addChild(this._xsWindows[key]);
    }, this);
    if (XdRsData.SRPG.isFightOnMapOnly()) {
        this._xsWindows.figInfo = new Xs_WindowMapFightInfo();
        this._xsWindowLayer.addChild(this._xsWindows.figInfo);
    }
    this._xsWindows.menu.createChildWindows();
    this._xsWindowLayer.addChild(this._xsWindows.choice);
    this._xsWindowLayer.addChild(this._xsWindows.tips);
    Xs_Manager.setSpriteset(this._spriteset);
    Xs_Manager.setWindows(this._xsWindows);
};
Scene_Map.prototype.onXsFinish = function() {
    this.removeXsWindows();
    this._spriteset.removeXsParts();
};
Scene_Map.prototype.removeXsWindows = function() {
    if (!this._xsWindows) return;
    this._xsWindows.menu.removeChildWindows();
    Object.keys(this._xsWindows).forEach(function(key){
        this._xsWindowLayer.removeChild(this._xsWindows[key]);
    }, this);
    this._xsWindows = null;
};
XdRsData.SRPG.Scene_Map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function() {
    $gameSystem.rememberXsUnits();
    XdRsData.SRPG.Scene_Map_terminate.call(this);
};
Scene_Map.prototype.currentXsCod = function() {
    return this._spriteset.currentXsCod();
};
XdRsData.SRPG.Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    XdRsData.SRPG.Scene_Map_update.call(this);
    Xs_Manager.update();
};
XdRsData.SRPG.Scene_Map_updateScene = Scene_Map.prototype.updateScene;
Scene_Map.prototype.updateScene = function() {
    !Xs_Manager.isRuning() && XdRsData.SRPG.Scene_Map_updateScene.call(this);
};
XdRsData.SRPG.Scene_Map_updateMenuButton = Scene_Map.prototype.updateMenuButton;
Scene_Map.prototype.updateMenuButton = function() {
    if (Xs_Manager.isRuning()) {
        if (this._menuButton && this._menuButton.visible) {
            this._menuButton.hide();
        }
    } else XdRsData.SRPG.Scene_Map_updateMenuButton.call(this);
};
//=================================================================================================
// end
//=================================================================================================