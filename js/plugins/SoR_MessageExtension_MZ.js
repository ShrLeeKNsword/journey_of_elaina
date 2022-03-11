//=============================================================================
// SoR_MessageExtension_MZ.js
// MIT License (C) 2020 蒼竜 @soryu_rpmaker
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Latest version v1.00 (2020/08/26)
//=============================================================================
/*:ja
* @plugindesc ＜メッセージウィンドウ拡張＞
* @author 蒼竜
* @help メッセージ入力時の制御文字を追加し、
* ストーリーの表現を豊かにするメッセージウィンドウ表示方式の
* 変更・拡張を行います。機能は今後のバージョンアップに従って断続的に拡張されていきます。
*
* 搭載されている制御文字と機能は次の通り。
*
* \nw系 - 名前ウィンドウを設置。MZ追加の標準機能と同等のもので、
* (類似プラグインで実装された)MVからのプロジェクト移植を簡易にするためのものです。
* \nw[\a<ID>] ... <ID>番のアクターの名前を入れた名前ウィンドウを表示
* \nw[<TEXT>] ... 任意の<TEXT>を入れた名前ウィンドウを表示
*
* \msgev - テキスト・顔グラフィックが十分収まる最小限のウィンドウを生成し、
* イベントの頭上にメッセージバルーン形式で表示します。
* 本プラグインは特に、メッセージサイズを基準にしたウィンドウサイズを生成し、
* 顔グラフィックの頭部分がウィンドウ外へ出るようなレイアウトになっています。
* \msgev[<EID>] ... <EID>番のイベント上にメッセージを表示。0でプレイヤー頭上
*
* \CTR系 (テスト実装中) - メッセージのセンタリングを行います。
* \msgevと併用のためではなく、デフォルトウィンドウを用いたシネマシーンの演出を
* 想定した機能となります。
* \CTR[<line>] ... <line>行目を中央揃えにする
* \CTR[<lineX>-<lineY>] ... <lineX>から<lineY>行を中央揃えにする
* \CTR[all] ... 全ての行を中央揃え(最も描画幅の長いものを基準)にする。名前ウィンドウの横位置も調整する。
*
* -----------------------------------------------------------
* バージョン情報
* -----------------------------------------------------------
* v1.00 (2020/08/26)       公開
* @target MZ
* @url http://dragonflare.dip.jp/dcave/
*/
/*:
* @plugindesc <Message Window Extension>
* @author Soryu
* @help This plugin adds EscapeCharacters to extend message window system,
* which will be updated to add more functions for your dramatic game scenes.
*
* Followings are current implemented the EscapeCharacters for additional functions.
* Use them in your message windows.
*
* \nw series - Put a name box, which corresponds to the default function in MZ.
* This is supposed to reduce the burden porting a game project from MV with a plugin 
* to implement similar function.
* \nw[\a<ID>] ... Draw a name box with <ID>-th actor name.
* \nw[<TEXT>] ... Draw a name box with arbitrary <TEXT>.
*
* \msgev - Make a minimum size of message window which can accomodate face graphic
* and messages on the target event. The width of message window in this plugin is
* determined by the message length which is different expression from other existing plugins.
* Thus, the head of face graphic is sometimes beyond the window frame.
* \msgev[<EID>] ... Draw a message ballon on the <EID>-th event. <EID> = 0 means above the player.
*
*
* \CTR series (Experimental) - Conduct centering of messages
* This is not for use with \msgev but for helping the default window 
* to express cinematic scenes.
* \CTR[<X>] ... Centering of line <X>
* \CTR[<X>-<Y>] ... Centering of lines <X> to <Y>
* \CTR[all] ... Centering of all messages based on the largest draw width. NameBox is also adjusted.
*
* -----------------------------------------------------------
* Version Info.
* -----------------------------------------------------------
* v1.00 (Aug. 26th, 2020)       released!
* @target MZ
* @url http://dragonflare.dip.jp/dcave/index_e.php
*/

/*
Scene_Message.prototype.messageWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(8, false) + 8;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};
*/

(function() {
"use strict";

Object.defineProperty(Bitmap.prototype, "height", {
    set: function(value) { //add
		const image = this._canvas || this._image;
        image.height = value;
    }
});

const SoR_ME_SM_createMessageWindow = Scene_Message.prototype.createMessageWindow;
Scene_Message.prototype.createMessageWindow = function() {
    SoR_ME_SM_createMessageWindow.call(this);
    
    this._messageWindow.OriginalMes_Rect = this.messageWindowRect();
    this._messageWindow.defaultPadd = this._messageWindow.padding;
};



const SoR_ME_WB_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
Window_Base.prototype.convertEscapeCharacters = function(text) {
	text = SoR_ME_WB_convertEscapeCharacters.call(this,text);

    
    text = text.replace(/\x1bCTR\[(.*?)\]/gi, (_, p1) => { 
        if(p1=="all"){
            for(let i=0; i<4; i++) this.isCenterizeLine[i] = true;
            this.isCenterizeALL = true;
        }
        else if(p1.match(/(\d+?)-(\d+?)/i) != null){
            const ret = p1.match(/(\d+?)-(\d+?)/i);
            for(let i=ret[1]-1; i<=ret[2]-1; i++) this.isCenterizeLine[i] = true;
        }
        else if(!isNaN(parseInt(p1))){
            this.isCenterizeLine[p1-1] = true;
        }

        return '';        
	 });
    text = text.replace(/\x1bNW\[\x1bA(\d+?)\]/gi, (_, p1) => { 
	    $gameMessage.setSpeakerName(this.actorName(parseInt(p1))); return '';
	 });
    text = text.replace(/\x1bNW\[(.*?)\]/gi, (_, p1) => {
		$gameMessage.setSpeakerName(p1); return '';
	 });
    text = text.replace(/\x1bMSGEV\[(\d+)\]/gi, (_, p1) => {
	    if (!$gameParty.inBattle()) {
          this.requiredMesMod = true;
          this.linkMsgToEvent(p1);
		}
		return '';
	 });

	
    return text;
};


Window_Message.prototype.linkMsgToEvent = function(EventID) {
    this.targetMesEvent = EventID;
};

const SoR_ME_WM_update = Window_Message.prototype.update;
Window_Message.prototype.update = function() {
    if(this.targetMesEvent !== undefined) this.SetMessageBalloon();
    SoR_ME_WM_update.call(this);
}


const SoR_ME_WM_startMessage = Window_Message.prototype.startMessage;
Window_Message.prototype.startMessage = function() {
    this.isCenterizeLine = [false, false, false, false];
    this.CalcLineDrawWidth = [0, 0, 0, 0, 0];

    SoR_ME_WM_startMessage.call(this);

    this.CalcMessageStateForTargetMes();
    if(this.FixedMesforEvent) this.SetMessageBalloon();
    
    this.Message_CurrentPageline = 0;
    this.CenteringMessageLineText();
    if(this.isCenterizeALL) this.FixNameBoxCenterToDefaultWindow();
}



Window_Message.prototype.CalcMessageStateForTargetMes = function() {
    const tx = $gameMessage.allText();
    const textState = this.createTextState(tx, 0, 0, 0);
    textState.x = this.newLineX(textState);
    textState.startX = textState.x;
	
	const text = textState.text;
    const lines = text.split('\n');
	let maxwidth = 0;
	let len;    

    const txrec = this.textRect_onMessage(text); 

    if(!this.requiredMesMod) return;

    this.width = txrec.width + ($gameMessage.faceName()!== "" ? ImageManager.faceWidth : 0) +80;
    const w_height = txrec.height + lines.length*12 + $gameSystem.windowPadding() * 2;
    const hdiff = Window_Base.prototype.fittingHeight(4) - w_height;
	this.height = w_height;
    this.facepadd_param = {h: txrec.height, len: lines.length, pad: $gameSystem.windowPadding(), hdiff: hdiff};


    this.requiredMesMod = false;
    this.FixedMesforEvent = true;
    this.TargetMes_Lines = lines.length;
    
    this.contents._baseTexture.height = 600;
    this.contents.height = 600;
}

 






Window_Message.prototype.textRect_onMessage = function(str_allmes) {
    const orig_fsize = this.contents.fontSize;
    let exp_fsize = orig_fsize;
    let next_fsize = orig_fsize;

    let FontChangeSplitting = false;

    const str_arr = str_allmes.split('\n');
    
    let maxwidth = 0;
    let totalHeight = 0;
    for(let row=0; row<str_arr.length;row++){
            let str = str_arr[row];


            let currentWidth = 0;
            let maxheight = 0;

            let head_idx = 0;
            for(let i=0; i<str.length;i++){
                const c = str[i];
                if (c.charCodeAt(0) < 0x20) { //Is control letter?
                    const code = str[i+1];
                    i++;
                    //console.log("CODE: " + code);
                    switch(code){
                        case "{":
                            next_fsize = MkFontBigger(exp_fsize);
                            FontChangeSplitting = true;
                            break;
                        case "}":
                            next_fsize = MkFontSmaller(exp_fsize);
                            FontChangeSplitting = true;
                            break;
                        default:
                        i++;
                        break;
                    }
                }


                if(FontChangeSplitting === true || i>=str.length-1){
                    let pad_cntchar = -1;
                    if(!FontChangeSplitting && i>=str.length-1) pad_cntchar = 0;//////
                    //console.log(head_idx + " ... " + (i+pad_cntchar) + "   fsize: " +exp_fsize)
                    const test_arr = str.substring(head_idx, i+pad_cntchar);
                    this.contents.fontSize = exp_fsize;
                    const area = this.contents.measureTextRectArea(test_arr);
                    const rowtxwid = area.x;
                    const rowtxhgt = area.y;
                    if(maxheight < rowtxhgt) maxheight = rowtxhgt;//height

                    //console.log("SUBSTR: "+test_arr + "  rowwidth: " + rowtxwid + "  rowheight: " + maxheight);
                    currentWidth += rowtxwid;
                    head_idx = i+1;
                    FontChangeSplitting = false;
                    exp_fsize = next_fsize;
                }
            }//for one row

            this.CalcLineDrawWidth[row] = currentWidth;
            if(currentWidth > maxwidth) maxwidth = currentWidth;
            totalHeight += maxheight;
        }//for entire rows



    this.contents.fontSize = orig_fsize;
    this.CalcLineDrawWidth[4] = maxwidth;
    return {width: maxwidth, height: totalHeight};
}

function MkFontBigger (fs) {
    if (fs <= 96) fs += 12;
    return fs;
}
function MkFontSmaller (fs) {
    if (fs >= 24) fs -= 12;
    return fs;
}


Bitmap.prototype.measureTextRectArea = function(text) {
    const context = this.context;
    context.save();
    context.font = this._makeFontNameText();
    const wd = context.measureText(text).width;
    
    let maxhgt = 0;
    for(let i=0; i<text.length;i++){
        const hgt = context.measureText(text[i]).width;
        if (maxhgt < hgt) maxhgt = hgt;
    }

    context.restore();
    //console.log("TEST: "+ wd + "  " + maxhgt);
    return {x: wd, y: maxhgt};
};



Window_Message.prototype.SetMessageBalloon = function() {
  const tarID = this.targetMesEvent;
  let x, y, target;
	
  if(tarID <= 0) target = $gamePlayer;
  else target = $gameMap.event(tarID);
 
  if(target !== undefined && target !== null){
    x = target.screenX();
    y = target.screenY() - target.CalcSpriteHeight();
  }
  this.XtraPadding_TargetMes = 0;


  this.x = x - this.width/2;
  this.y = y - this.height -5;  // 2:-5

  //adjust for window rect
  if(this.x < 0) this.x = 0;
  else if(this.x+this.width > Graphics.width) this.x = Graphics.width-this.width;
  if(this._nameBoxWindow){
      this.FixNameBoxWindowToBalloon();
      
      if(this._nameBoxWindow.y <0){
        this._nameBoxWindow.y = 36;
        this.y = this._nameBoxWindow.y+50;
      }
    }
  if(this.y < 0) this.y=0;
  else if(this.y+this.height > Graphics.height) this.y = Graphics.height-this.height-8;
}



Window_Message.prototype.FixNameBoxWindowToBalloon = function() {
  const nw = this._nameBoxWindow;
  
  nw.contents.clear();
  const rect = nw.baseTextRect(); 
  const faceExists = $gameMessage.faceName() !== "";

  nw.drawTextEx_NameBox(nw._name, rect.x, rect.y, rect.width);
 
  let FacePad = ImageManager.faceWidth;
  if(!faceExists) FacePad = 0;
  nw.x = this.x+FacePad+12; 
  nw.y = this.y-50;
}


Window_Message.prototype.FixNameBoxCenterToDefaultWindow = function() {
    if(!this.isCenterizeALL || !this._nameBoxWindow) return;

    const nw = this._nameBoxWindow;
    
    nw.contents.clear();
    const rect = nw.baseTextRect(); 
    const faceExists = $gameMessage.faceName() !== "";
    nw.drawTextEx_NameBox(nw._name, rect.x, rect.y, rect.width);
    nw.x = this.CenterizedTextStartX;
    nw.y = this.y-rect.height -this.padding;
}

Window_Base.prototype.drawTextEx_NameBox = function(text, x, y, width) {
	this.contents.clear();
    this.contents.fontSize = 20;
    this.changeTextColor("#ffff55");//yellow
    const textState = this.createTextState(text, x, y, width);
    this.processAllText(textState); 
	  
    this.resetTextColor();	
    this.resetFontSettings();
	
	this.width = textState.outputWidth+40; // 2:40
	this.height = 52;
};





const SoR_ME_WM_drawMessageFace = Window_Message.prototype.drawMessageFace;
Window_Message.prototype.drawMessageFace = function() {
	
 if(this.targetMesEvent !== undefined){
     const tmp = this.facepadd_param;
    this.target_MesPaddY = 100 - tmp.hdiff +tmp.pad +4;

    const faceName = $gameMessage.faceName();
    const faceIndex = $gameMessage.faceIndex();
    const rtl = $gameMessage.isRTL();
    const width = ImageManager.faceWidth;
    const height = ImageManager.faceHeight;
    //console.log(this.innerWidth + "   vs  " + ImageManager.faceHeight);
    const x = rtl ? this.innerWidth - width - 4 : 4;

    this.drawFace(faceName, faceIndex, x +104, this.target_MesPaddY, width, height);	//// 2: 54
 }
 else SoR_ME_WM_drawMessageFace.call(this);

};

const SoR_ME_WB_drawFace = Window_Base.prototype.drawFace
Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {

   if(this.targetMesEvent == undefined) SoR_ME_WB_drawFace.call(this, ...arguments);
   else{

    width = width || ImageManager.faceWidth;
    height = height || ImageManager.faceHeight;
    const bitmap = ImageManager.loadFace(faceName);
    const pw = ImageManager.faceWidth;
    const ph = ImageManager.faceHeight;
    const sw = Math.min(width, pw);
    const sh = Math.min(height, ph);
    const dx = x;
    const dy = y;
    const sx = (faceIndex % 4) * pw;
    const sy = Math.floor(faceIndex/4) * ph;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
   }

};
// prettier-ignore


 

const SoR_ME_WM_newPage = Window_Message.prototype.newPage;
Window_Message.prototype.newPage = function(textState) {
	if(this.targetMesEvent !== undefined){
        
		this.XtraPadding_TargetMes = -100;
        this.padding = this.XtraPadding_TargetMes;// 2:-50
        
		//this.contents.width += -this.XtraPadding_TargetMes;
		this.contents.clear();
		this.resetFontSettings();
		this.clearFlags();
		this.updateSpeakerName();
		this.loadMessageFace();
		textState.x = textState.startX;
		textState.y = 14-this.XtraPadding_TargetMes;
		textState.height = this.CalcTextHeight_TargetMes(textState);
		
	}
	else{
     SoR_ME_WM_newPage.call(this, textState);
     this.ResetTargetWindowSetting();
     }

     
};


const SoR_ME_WB_processNewLine = Window_Base.prototype.processNewLine;
Window_Message.prototype.processNewLine = function(textState) {
    SoR_ME_WB_processNewLine.call(this,textState);
 
    this.CenteringMessageLineText();
};

Window_Message.prototype.CenteringMessageLineText = function(){
    const textState = this._textState;
     

    if(this.isCenterizeALL){
         const maxwidth = this.CalcLineDrawWidth[4];
         const ww = this.width;
         const drawing_center = (this.x+ww)/2;       
         textState.startX = drawing_center - maxwidth/2;
         textState.x = textState.startX - this.padding*2;
         if(this._nameBoxWindow) this.CenterizedTextStartX = textState.x;

    }else{//centerize each line
        if(!this.isCenterizeLine[this.Message_CurrentPageline]){
            this.Message_CurrentPageline++;
            return;
        }
        
        //console.log(this.CalcLineDrawWidth[this.Message_CurrentPageline]) 
        const ww = this.width;
        const drawing_center = (this.x+ww)/2;
        //console.log(drawing_center + " | " + this.CalcLineDrawWidth[this.Message_CurrentPageline])
        textState.startX = drawing_center - this.CalcLineDrawWidth[this.Message_CurrentPageline]/2;
        textState.x = textState.startX - this.padding*2;

        
        this.Message_CurrentPageline++;
    }
}



Window_Message.prototype.CalcTextHeight_TargetMes = function(textState) {
    const lineSpacing = this.lineHeight() - $gameSystem.mainFontSize();
    const lastFontSize = this.contents.fontSize;
    const lines = textState.text.slice(textState.index).split("\n");
    const textHeight = this.maxFontSizeInLine(lines[0]) + lineSpacing;//+ lineSpacing + 50;
    this.contents.fontSize = lastFontSize;
    return textHeight;
};


const SoR_ME_WM_newLineX = Window_Message.prototype.newLineX;
Window_Message.prototype.newLineX = function(textState) {
	 if(this.targetMesEvent !== undefined){
	    const faceExists = $gameMessage.faceName() !== "";
		const faceWidth = ImageManager.faceWidth;
		const spacing = 130;
        const margin = faceExists ? faceWidth + spacing : spacing;

		return textState.rtl ? this.innerWidth - margin : margin;
	 }
     
     return SoR_ME_WM_newLineX.call(this, textState);
};

 
 


const SoR_ME_Window_updatePauseSign = Window.prototype._updatePauseSign;
Window.prototype._updatePauseSign = function() {
	if(this.targetMesEvent !== undefined){
    const sprite = this._pauseSignSprite;
    const x = Math.floor(this._animationCount / 16) % 2;
    const y = Math.floor(this._animationCount / 16 / 2) % 2;
    const sx = 144;
    const sy = 96;
    const p = 24;
    if (!this.pause) sprite.alpha = 0;
    else if (sprite.alpha < 1) {
        sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
    }
    sprite.setFrame(sx + x * p, sy + y * p, p, p);
    sprite.visible = this.isOpen();
    
    const tmp = this.facepadd_param;

    sprite.x = this.width-32;
	sprite.y = tmp.h +tmp.pad*2 + tmp.len *12 +4;//104 +(this.TargetMes_Lines-2)*36; //2:104
	
	}
	else SoR_ME_Window_updatePauseSign.call(this);
};

 
const SoR_ME_NB_updatePlacement = Window_NameBox.prototype.updatePlacement;
Window_NameBox.prototype.updatePlacement = function() {
	if(this._messageWindow.targetMesEvent !== undefined){
		this.width = this.windowWidth();
        this.height = this.windowHeight();
		const messageWindow = this._messageWindow;
		if ($gameMessage.isRTL()) this.x = messageWindow.x + messageWindow.width - this.width;
        else this.x = messageWindow.x ;
		
		if (messageWindow.y > 0) this.y = messageWindow.y - this.height;
		else this.y = messageWindow.y + messageWindow.height;
	}
	else SoR_ME_NB_updatePlacement.call(this);
	
};




Game_CharacterBase.prototype.CalcSpriteHeight = function() {
    if (this.sprHeight !== undefined) return this.sprHeight;
    if (this.tileId() > 0) return $gameMap.tileHeight();
		
    const spr = ImageManager.loadCharacter(this.characterName());
	this.sprHeight = 0;
    if (!spr) return this.sprHeight;
    this.sprHeight = spr.height/(ImageManager.isBigCharacter(this.characterName()) ? 4 : 8); //!$

    return this.sprHeight;
};





////////////////////////////
const SoR_ME_WM_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function() {
    SoR_ME_WM_terminateMessage.call(this);

    this.FixedMesforEvent = false;
    this.targetMesEvent = undefined;
    this.requiredMesMod = false;
    this.isCenterizeALL = false;
};

Window_Message.prototype.ResetTargetWindowSetting = function() {
    const rect = this.OriginalMes_Rect;
    if(this.x !== rect.x) this.x = rect.x
    if(this.width !== rect.width)this.width = rect.width;
    if(this.height !== rect.height)this.height = rect.height;
    this.padding = this.defaultPadd;
};
}());