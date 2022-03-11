//=============================================================================
// SoR_MapActionIndicator_MZ_alpha.js
// MIT License (C) 2020 蒼竜 @soryu_rpmaker
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Latest version v1.00 (2020/08/28)
//=============================================================================
/*:ja
* @plugindesc ＜マップアクションインジケータ: Type-α＞
* @author 蒼竜　@soryu_rpmaker
* @help マップ上の「決定ボタン」を起動トリガーとするイベントをプレイヤーが起動可能な状態にあるとき、
* ゲーム画面にイベント起動が可能である旨を表示するウィンドウを作成します。
*
* 根幹の描画スタイルによってスクリプトを分けています。
* 好みのスタイルのものを1つだけ選んで導入してください。
* (このスクリプトは、"Type-α"のものです。)
*
* 導入したいイベントに「注釈」コマンドで以下のタグを挿入してください。
* <Action Indicator:【任意のテキスト】>
*
* 【任意のテキスト】部分に好きな表示「話す」、「調べる」等を入力してください。
* また2種類の制御文字が搭載されています。
* - \K[X] ... Xに指定した文字を「入力キー」として追加表示 
* - \I[Y] ... Yに指定したアイコンIDを「アクションアイコン」として追加表示
* -----------------------------------------------------------
* バージョン情報
* -----------------------------------------------------------
* v1.00 (2020/08/28)       公開
*
* @target MZ
* @url http://dragonflare.dip.jp/dcave/
*
*
* @param Indicator_Style
* @desc アクションインジケータ描画スタイル(default: 0-黒背景)
* @type select
* @option 黒背景
* @value 0
* @option ウィンドウスキン使用
* @value 1
* @default 0
*
* @param TextColor_ActionName
* @desc アクション名称部分のカラー、Window.pngの連番に対応 (default: 3)
* @default 3
* @type number
* @param TextColor_ActionKey
* @desc キー部分のカラー、Window.pngの連番に対応 (default: 14)
* @default 14
* @type number
*
* @param Default_DecisionKey
* @desc キー無指定時にデフォルトで表示するキー部分表示文字列 (default: none)
* @default 
* @type string
*
* @param VehicleOn_text
* @desc 乗り物に搭乗可能時に表示するテキスト (default: 乗る)
* @default 乗る
* @type string
* @param VehicleOn_icon
* @desc 乗り物に搭乗可能時に表示するアイコン。0で非表示 (default: 0)
* @default 0
* @type number
* @param VehicleOn_key
* @desc 乗り物に搭乗可能時に表示するキー表示部分 (default: Ｚ)
* @default Ｚ
* @type string
*
* @param VehicleOff_text
* @desc 乗り物から降りられる時に表示するテキスト (default: 降りる)
* @default 降りる
* @type string
* @param VehicleOff_icon
* @desc 乗り物に降りられる時に表示するアイコン。0で非表示 (default: 0)
* @default 0
* @type number
* @param VehicleOff_key
* @desc 乗り物に降りられる時に表示するキー表示部分 (default: Ｚ)
* @default Ｚ
* @type string
*/

/*:
* @plugindesc <Action Indicator on Map>
* @author @soryu_rpmaker
* @help This plugin creates a window on the map scene which indicates
* feasible actions by player such as Talk and Investigate.
* The event must be designed to have "Event touch" trigger for the action indication.
*
* Script files are separated by the design.
* Thus, install just ONLY ONE script for your preference. 
* (This file is for "Type-Alpha".)	  
*
* Enter the following tag into events which you want as Comment command.
* <Action Indicator: [TEXT]>
*
* Put arbitrary texts into [TEXT] which you indicate.
* Following two escape characters are also available.
* - \K[X] ... Add a key indication of X.
* - \I[Y] ... Add an icon indication of an icon whose ID is Y.
* -----------------------------------------------------------
* Version Info.
* -----------------------------------------------------------
* v1.00 (Aug. 28th, 2020)       released!
*
* @param Indicator_Style
* @desc Style of the indication window (default: 0-Dark)
* @type select
* @option Dark
* @value 0
* @option WindowSkin
* @value 1
* @default 0
*
* @param TextColor_ActionName
* @desc Color of action name to be indicated, corresponding to the color in Window.png (default: 3)
* @default 3
* @type number
* @param TextColor_ActionKey
* @desc Color of action key to be indicated, corresponding to the color in Window.png  (default: 14)
* @default 14
* @type number
*
* @param Default_DecisionKey
* @desc Default texts for action key without explicit designation in tags (default: none)
* @default 
* @type string
*
* @param VehicleOn_text
* @desc Text that indicates the player can get on the vehicle (default: Get on)
* @default Get on
* @type string
* @param VehicleOn_icon
* @desc Icon that indicates the player can get on the vehicle. Set 0 to disable. (default: 0)
* @default 0
* @type number
* @param VehicleOn_key
* @desc Key that indicates the player can get on the vehicle. (default: Z)
* @default Z
* @type string
*
* @param VehicleOff_text
* @desc Text that indicates the player can get off the vehicle (default: Get off)
* @default Get off
* @type string
* @param VehicleOff_icon
* @desc Icon that indicates the player can get off the vehicle. Set 0 to disable. (default: 0)
* @default 0
* @type number
* @param VehicleOff_key
* @desc Key that indicates the player can get off the vehicle. (default: Z)
* @default Z
* @type string
*
* @target MZ
* @url http://dragonflare.dip.jp/dcave/index_e.php
*/


var Imported = Imported || {};
if(Imported.SoR_MapActionIndicatorseries) throw new Error("[SoR_MapActionIndicator_MZ] Do NOT import more than 2 types of <SoR_MapActionIndicator> series.");
Imported.SoR_MapActionIndicatorseries = true;

(function() {

    const Param = PluginManager.parameters('SoR_MapActionIndicator_MZ_Alpha');
    
    const Indicator_Style = Number(Param['Indicator_Style']) || 0;
    const TextColor_ActionName = Number(Param['TextColor_ActionName']) || 0;
    const TextColor_ActionKey = Number(Param['TextColor_ActionKey']) || 0;
    const Default_DecisionKey = String(Param['Default_DecisionKey']) || '';

    const VehicleOn_text = String(Param['VehicleOn_text']) || '';
    const VehicleOn_icon = Number(Param['VehicleOn_icon']) || 0;
    const VehicleOn_key = String(Param['VehicleOn_key']) || '';
    const VehicleOff_text = String(Param['VehicleOff_text']) || '';
    const VehicleOff_icon = Number(Param['VehicleOff_icon']) || 0;
    const VehicleOff_key = String(Param['VehicleOff_key']) || '';
        

const SoR_MAI_SM_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
Scene_Map.prototype.createDisplayObjects = function() {
    SoR_MAI_SM_createDisplayObjects.call(this);
    this.createIndicatorwindow();
}

Scene_Map.prototype.createIndicatorwindow = function() {
    const rect = this.SoR_MapIndicatorRect();
    this.ActIndicatorWindow = new SoR_MapIndicator(rect);
    this.addWindow(this.ActIndicatorWindow);
}

Scene_Map.prototype.SoR_MapIndicatorRect = function() {
    const ww = Graphics.width;
    const wh = 44;
    const wx = Graphics.width;
    const wy = Graphics.height - wh;
    return new Rectangle(wx, wy, ww, wh);
};




const SoR_MAI_SM_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    SoR_MAI_SM_update.call(this);

    if(!$gameMessage.isBusy() && !this.isBusy()){
      const ret = $gamePlayer.CheckEnableActions();
      this.ActIndicatorWindow.checkTags(ret);
    }
    else this.ActIndicatorWindow.checkTags(null);
};


//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////



Game_Player.prototype.CheckEnableActions = function() {
    const x = this._x;
    const y = this._y;
    const dir = this._direction;
    const x2 = $gameMap.roundXWithDirection(x, dir);
    const y2 = $gameMap.roundYWithDirection(y, dir);

    //Vehicle
    if(!this.isInVehicle()){
      if(this.VehicleCheckOn(x,y,x2,y2,dir) === true){
        return {icon: VehicleOn_icon, key: VehicleOn_key, text: VehicleOn_text};
      }
    }
    else{
      if(this.VehicleCheckOff(x,y,x2,y2,dir) === true){
        return {icon: VehicleOff_icon, key: VehicleOff_key, text: VehicleOff_text};
      }
    }

    if(!this.isInVehicle()){
        //Event Here
        const ret_here = this.SearchMapActionEvents(x,y,0);
        if(ret_here!=null) return ret_here;
        //Event Forward
        const ret_forward = this.SearchMapActionEvents(x2,y2,1);
        if(ret_forward!=null) return ret_forward;
    }
    return null;
}


Game_Player.prototype.VehicleCheckOn = function(x1,y1,x2,y2,dir){
    let flag = false;
    if(this._vehicleGettingOn || this._vehicleGettingOff) return flag;

    if ($gameMap.airship().pos(x1, y1) || $gameMap.ship().pos(x2, y2) || $gameMap.boat().pos(x2, y2)) flag = true;
    return flag;
}
Game_Player.prototype.VehicleCheckOff = function(x1,y1,x2,y2,dir){
    let flag = false;
    if (!this._vehicleGettingOn && !this._vehicleGettingOff && this.vehicle().isLandOk(x1,y1,dir)) flag = true;
    return flag;
}

Game_Player.prototype.SearchMapActionEvents = function(x,y, EventPriority) {
    let tag_arr = null;



    for (const event of $gameMap.eventsXy(x, y)) {
        if (event.isTriggerIn([0]) && event._priorityType === EventPriority) {
            tag_arr = this.CollectActionIndicatorTags(event);
        }
    }
    //for events over the counter
    if($gameMap.isCounter(x,y)){
        const dir = this._direction;
        const x2 = $gameMap.roundXWithDirection(x, dir);
        const y2 = $gameMap.roundYWithDirection(y, dir);
        for (const event of $gameMap.eventsXy(x2, y2)) {
            if (event.isTriggerIn([0]) && event._priorityType === EventPriority) {
                tag_arr = this.CollectActionIndicatorTags(event);
            }
        }       
    }

    return tag_arr;
}
Game_Player.prototype.CollectActionIndicatorTags = function(ev) {
    let tag_arr = null;
    const p_idx = ev.findProperPageIndex();
    if(p_idx === -1) return tag_arr;

    for(let i=0; i<ev.event().pages[p_idx].list.length;i++){
        if(ev.event().pages[p_idx].list[i].code == 108 || ev.event().pages[p_idx].list[i].code == 408){
            const com = ev.event().pages[p_idx].list[i].parameters;
            const res = ReadActionIndicatorTag(com[0]);
            if(res!=null) tag_arr = res;
        }
    }

    return tag_arr;
}

function ReadActionIndicatorTag(command){
	if(command.match(/<ActionIndicator:[ ]*(.*)[ ]*>/i)) return DecompositeInnerTag(RegExp.$1);
    else return null;
}

function DecompositeInnerTag(txt){
    let icon = 0;
    let key = Default_DecisionKey;
 
    txt = txt.replace(/\\/g, "\x1b");
    txt = txt.replace(/\x1b\x1b/g, "\\");
    txt = txt.replace(/\x1bi\[(\d+)\]/gi, (_, p1) => {
        icon = parseInt(p1);
        return "";
    });

    txt = txt.replace(/\x1bk\[(.*)\]/gi, (_, p1) => {
        key = p1;
        return "";
    });

    if(txt==="") return null;//no texts to draw
    return {icon: icon, key: key, text: txt};
}





//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
function SoR_MapIndicator() {
    this.initialize(...arguments);
}
SoR_MapIndicator.prototype = Object.create(Window_Base.prototype);
SoR_MapIndicator.prototype.constructor = SoR_MapIndicator;

Object.defineProperty(SoR_MapIndicator.prototype, "innerWidth", {
    get: function() { return this._width; },
    set: function(value) { this.height = value; },
    configurable: true
});
Object.defineProperty(SoR_MapIndicator.prototype, "innerHeight", {
    get: function() { return this._height; },
    set: function(value) { this.height = value; },
    configurable: true
});

SoR_MapIndicator.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._showCount = 0;

    this.tags = null;
    this._text = "";
    this._icon = 0;
    this._key = "";
    
    this.openness = 255;
    this.visible = true;
    this.opacity = 255;
    this.windowcontrolx = 0;
    this.padding = 4;
    this.isOpeningIndicator = false;
    this.isClosingIndicator = false;
    this.isIndicatorOpen = false;
}


SoR_MapIndicator.prototype.DrawBackground = function() {	
		const color1 = ColorManager.dimColor1();
        const color2 = ColorManager.dimColor2(); 
        
        const x0 = Math.floor(this.width*0.3);
        const xL = this.width-x0;
        const yL = this.height;

		this.contents.fillRect(x0, 0 , xL, yL, color1);
		this.contents.gradientFillRect(0,0,x0,yL, color2, color1);
}

SoR_MapIndicator.prototype.checkTags = function(tag) {
    if(tag===null){
        if((this.isIndicatorOpen || this.isOpeningIndicator) && !this.isClosingIndicator){ 
            this.close();
        }
    }
    else{//regular tags
        this.SetIndicator(tag);
    }
}


SoR_MapIndicator.prototype.SetIndicator = function(tag) {
    if(this.isClosingIndicator || this._text != tag.text){
        this._text = tag.text;
        this._icon = tag.icon;
        this._key = tag.key;
        this.DrawIndicator();
        this.open();
    }
}


SoR_MapIndicator.prototype.DrawIndicator = function() {
    this.contents.clear();
    this.contents.fontSize = 22;

    const wi = this._icon===0? 0 : ImageManager.iconWidth;
    const wk = this.textWidth(this._key);
    const wt = this.textWidth(this._text);
    this.width = wi+wk+wt+80;
    this.x = Graphics.width;
    this.moveLength = Graphics.width - this.width;


    if(Indicator_Style==1){//window skin
        this.setBackgroundType(0);
        this.y = Graphics.height - this.height -6;
    }
    else{//black rect
        this.setBackgroundType(2);
        this.DrawBackground();
    }




    let tmpx = 32;
    if(wi!=0){
        this.drawIcon(this._icon, tmpx ,2);
        tmpx += (ImageManager.iconWidth+6);
    }
    if(wk!=0){
    this.changeTextColor(ColorManager.textColor(TextColor_ActionKey));
        this.drawText(this._key,tmpx,0,wk,"left");
        tmpx += (wk+16);
    }

    this.changeTextColor(ColorManager.textColor(TextColor_ActionName));
    this.drawText(this._text,tmpx,0,this.width-tmpx,"left");

    this.resetFontSettings();
    this.resetTextColor();
}


SoR_MapIndicator.prototype.open = function() {
    this.windowcontrolx = this.width;
    this.isIndicatorOpen = false;
    this.isOpeningIndicator = true;
    this.isClosingIndicator = false;
};

SoR_MapIndicator.prototype.close = function() {
    this.windowcontrolx = this.width;
    this.isOpeningIndicator = false;
    this.isClosingIndicator = true;
};

SoR_MapIndicator.prototype.update = function() {
    Window_Base.prototype.update.call(this);

    if(this.isOpeningIndicator){
        const finX = Graphics.width - this.width;
        this.x -= this.windowcontrolx/4;
        this.windowcontrolx = this.x - finX;
        if(this.windowcontrolx <= 0){
            this.x = finX;
            this.isOpeningIndicator = false;
            this.isIndicatorOpen = true;
        }
    }
    else if(this.isClosingIndicator){
        this.x += this.windowcontrolx/4;
        this.windowcontrolx = Graphics.width - this.x;
        if(this.windowcontrolx <= 0){
            this.x = Graphics.width;
            this.isClosingIndicator = false;
            this.resetIndicator();
        }
    }
    
};

SoR_MapIndicator.prototype.resetIndicator = function(tag) {
    this._text = "";
    this._icon = null;
    this._key = null;
    this.isIndicatorOpen = false;
}

})();

