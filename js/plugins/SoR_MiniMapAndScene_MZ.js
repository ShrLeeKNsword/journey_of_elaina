//=============================================================================
// SoR_MiniMapAndScene_MZ.js
// MIT License (C) 2020 蒼竜 @soryu_rpmaker
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Latest version v1.01　(2020/09/02)
//=============================================================================

/*:ja
* @plugindesc ＜ミニマップ・広域マップ＞
* @author 蒼竜　@soryu_rpmaker
* @help マップ上で画面隅にバイカラーで彩色したミニマップを表示する機能を実装します。
* 天井や崖上などの、「エディタ設定としては通れるが、ゲームとしては通れない・立ち入れない」
* 場所・領域を簡単に通行不可扱いとして塗り潰す機能など、通行可能領域の視認性を
* 容易に確保できるオプションが利用可能です。
* おまけ機能として、専用シーンによる広域マップ確認機能も利用できます。
*
* ミニマップの基本動作は、導入するのみで行えます。
* 本格的なミニマップ機能のための高度な設定は、ドキュメントを参照してください。
*
* v1.01以降，デフォルトでは表示されないようになっています。
* プラグインコマンドで明示的に1度表示処理を呼び出してください。
*
* -----------------------------------------------------------
* バージョン情報
* -----------------------------------------------------------
* v1.01 (2020/09/02)    ミニマップ開閉用のプラグインコマンド実装/広域マップ内凡例設定追加，他微細な調整
* v1.00 (2020/09/01)    公開
*
* @target MZ
* @url http://dragonflare.dip.jp/dcave/
*
*
* @param Minimap_Radius
* @desc ミニマップ半径 (default: 128)
* @default 128
* @type number
* @param MiniMap_Position
* @desc ミニマップ描画位置(default: 0)
* @type select
* @option 右上
* @value 0
* @option 左上
* @value 1
* @option 右下
* @value 2
* @option 左下
* @value 3
* @default 0
*
* @param Minimap_PixelSize
* @desc ミニマップを着色する1マス分の大きさ (default: 8)
* @default 8
* @type number
* @param -----リージョン関係-----
* @param PaintColor_Passable
* @desc 通行可能地点をマッピングする色 (default: rgba(80,80,80,1.0))
* @default rgba(80,80,80,1.0)
* @type string
* @param PaintColor_InPassable
* @desc 通行不可能地点をマッピングする色 (default: rgba(55,55,255,1.0))
* @default rgba(55,55,255,1.0)
* @type string
*
* @param RegionID_TransferPoint
* @desc 場所移動地点を示すリージョンID, 0で無効 (default: 0)
* @default 0
* @type number
* @param PaintColor_TransferPoint
* @desc RegionID_TransferPointで指定した場所移動発生地点をマッピングする色 (default:rgba(255,255,55,1.0))
* @default rgba(255,255,55,1.0)
* @type string
*
* @param RegionID_InpassableSearch
* @desc 通行不可化する閉領域を示すリージョンID, 0で無効 (default: 0)
* @default 0
* @type number
* @param Inpassable_IsolatedPoint
* @desc 孤立してしまった通行可能地点を通行不可扱いとしてマッピング (default: false)
* @default false
* @type boolean
*
*
* @param --------画像系--------
* @param Minimap_FrontLayerImage 
* @desc ミニマップUIベース画像 (default: base)
* @type file
* @dir img/SoRMap
* @default base
* @param MapIcon_Player
* @desc プレイヤー現在地表示アイコン (default: player)
* @type file
* @dir img/SoRMap
* @default player
* @param MapIcon_EnemySymbol
* @desc 敵シンボル現在地表示アイコン (default: enemy)
* @type file
* @dir img/SoRMap
* @default enemy
* @param MapIcon_NPCSymbol
* @desc NPC現在地表示アイコン (default: npc)
* @type file
* @dir img/SoRMap
* @default npc
* @param MapIcon_TreasureSymbol
* @desc 宝箱表示アイコン (default: treasure)
* @type file
* @dir img/SoRMap
* @default treasure
*
* @param -----広域マップ-----
* @param Name_AreaMapScene
* @desc 広域マップモード時にタイトルウィンドウに表示する名前 (default:AreaMap)
* @default AreaMap
* @type string
* @param UseLegend_AreaMapScene
* @desc 'true'の時、広域マップシーンにおいて凡例を表示 (default: true)
* @default true
* @type boolean
* @param CallButton_ForAreaMap
* @desc マップ上で、広域マップを呼び出すボタン設定、無指定でキーによる呼び出し無効 (default: none)
* @default 
* @type string
*
* @param LegendPlayer_ForAreaMap
* @desc 広域マップ凡例内のプレイヤー現在地アイコンを示す文字列 (default: 現在地)
* @default 現在地
* @type string
* @param LegendEnemy_ForAreaMap
* @desc 広域マップ凡例内のエネミーアイコンを示す文字列 (default: エネミー)
* @default エネミー
* @type string
* @param LegendNPC_ForAreaMap
* @desc 広域マップ凡例内のNPCアイコンを示す文字列 (default: NPC)
* @default NPC
* @type string
* @param LegendTreasure_ForAreaMap
* @desc 広域マップ凡例内の宝箱アイコンを示す文字列 (default: 宝箱)
* @default 宝箱
* @type string
* @param --------その他--------
* @param Padding_MinimapInnerPos
* @desc ミニマップ内部位置補正。円形くりぬきサイズ調整用(default: -8)
* @default -8
* @type number
* @param Padding_MinimapInnerRad
* @desc ミニマップ内部半径補正。円形くりぬきサイズ調整用(default: 10)
* @default 10
* @type number
*
*
* @command OpenMiniMap
* @text ミニマップオープン[ミニマップ・マップシーン]
* @desc ミニマップを表示します。使用開始時に1度は明示的に呼び出してください。
* @command CloseMiniMap
* @text ミニマップクローズ[ミニマップ・マップシーン]
* @desc ミニマップを隠します。カットシーン等で明示的に呼び出して下さい。
* @command ReloadSymbolTags
* @text イベントシンボル情報リロード[ミニマップ・マップシーン]
* @desc ミニマップに掲載するイベントのタグを再読み込みします。
* @command CallAreaMap
* @text 広域マップシーン呼び出し[ミニマップ・マップシーン]
* @desc 広域マップを確認する専用シーンを呼び出します。
*
*/
/*:
* @plugindesc <Minimap and Area Map>
* @author Soryu　@soryu_rpmaker
* @help This plugin introduce a function to draw a minimap on the map scene
* drawn with two colors. The advantage of this plugin is the equipment of
* autonomous mapping for the region where the player cannot arrive but 
* it is passable on the editor with fewer work, which leads to high visibility
* of passable areas on the map for players. Besides, the scene of area map viewer is also available.
*
* This plugin works just installing in your games in principle.
* However, you should read the document for the usage of high functional minimap. 
*
* From v1.01, the minimap does not appear on the screen in default.
* Call a plugin command explicitly once to show the minimap. 
* -----------------------------------------------------------
* Version info.
* -----------------------------------------------------------
* v1.01 (Sep. 2nd, 2020)       Add plugins commands for minimap open/close.
                               Add Configurations for texts of the legend in the area map scene.
* v1.00 (Sep. 1st, 2020)       released!
*
* @target MZ
* @url http://dragonflare.dip.jp/dcave/index_e.php
*
* @param Minimap_Radius
* @desc Radius of minimap window(default: 128)
* @default 128
* @type number
* @param MiniMap_Position
* @desc Position of minimap window(default: 0)
* @type select
* @option Upper right
* @value 0
* @option Upper left
* @value 1
* @option Lower right
* @value 2
* @option Lower left
* @value 3
* @default 0
*
* @param Minimap_PixelSize
* @desc Pixel size of each tile on the minimap (default: 8)
* @default 8
* @type number
* @param -----Region Settings-----
* @param PaintColor_Passable
* @desc Color to paint passable region (default: rgba(80,80,80,1.0))
* @default rgba(80,80,80,1.0)
* @type string
* @param PaintColor_InPassable
* @desc Color to paint inpassable region (default: rgba(55,55,255,1.0))
* @default rgba(55,55,255,1.0)
* @type string
*
* @param RegionID_TransferPoint
* @desc Region ID to indicate regions which map transfer occur, set 0 to disable (default: 0)
* @default 0
* @type number
* @param PaintColor_TransferPoint
* @desc Color to paint the region of RegionID_TransferPoint (default:rgba(255,255,55,1.0))
* @default rgba(255,255,55,1.0)
* @type string
*
* @param RegionID_InpassableSearch
* @desc Region ID to designate the inpassable region, set 0 to disable (default: 0)
* @default 0
* @type number
* @param Inpassable_IsolatedPoint
* @desc Flag to treat isolated point of passable as inpassable (default: false)
* @default false
* @type boolean
*
*
* @param --------Images--------
* @param Minimap_FrontLayerImage 
* @desc Base image of minimap (default: base)
* @type file
* @dir img/SoRMap
* @default base
* @param MapIcon_Player
* @desc Icon for current player position (default: player)
* @type file
* @dir img/SoRMap
* @default player
* @param MapIcon_EnemySymbol
* @desc Icon for current enemies position (default: enemy)
* @type file
* @dir img/SoRMap
* @default enemy
* @param MapIcon_NPCSymbol
* @desc Icon for current NPC position (default: npc)
* @type file
* @dir img/SoRMap
* @default npc
* @param MapIcon_TreasureSymbol
* @desc Icon for treasures position (default: treasure)
* @type file
* @dir img/SoRMap
* @default treasure
*
* @param -----For Area Map-----
* @param Name_AreaMapScene
* @desc The name of title for Area Map displayed in the Area Map scene (default:AreaMap)
* @default AreaMap
* @type string
* @param UseLegend_AreaMapScene
* @desc If 'true', legend of icons are displayed in the Area Map scene. (default: true)
* @default true
* @type boolean
* @param CallButton_ForAreaMap
* @desc Key to call the area map scene on the map, set nothing to disable. (default: none)
* @default 
* @type string
*
* @param LegendPlayer_ForAreaMap
* @desc Text indicating player icon in the legend of area map (default: Player)
* @default Player
* @type string
* @param LegendEnemy_ForAreaMap
* @desc Text indicating player icon in the legend of area map (default: Enemy)
* @default Enemy
* @type string
* @param LegendNPC_ForAreaMap
* @desc Text indicating player icon in the legend of area map (default: NPC)
* @default NPC
* @type string
* @param LegendTreasure_ForAreaMap
* @desc Text indicating player icon in the legend of area map (default: Treasure)
* @default Treasure
* @type string
* @param --------Othres--------
* @param Padding_MinimapInnerPos
* @desc Position correction of inner minimap. (default: -8)
* @default -8
* @type number
* @param Padding_MinimapInnerRad
* @desc Radius correction of inner minimap. (default: 10)
* @default 10
* @type number
*
*
* @command OpenMiniMap
* @text Open Minimap[Minimap&Scene]
* @desc Display minimap.
* @command CloseMiniMap
* @text Close Minimap[Minimap&Scene]
* @desc Hide minimap. Call explicitly for events as cutscenes.
* @command ReloadSymbolTags
* @text Reload Symbol[Minimap&Scene]
* @desc Reload the symbol tags for minimap.
* @command CallAreaMap
* @text Call Area Map[Minimap&Scene]
* @desc Call and transit to the area map scene.
*
*/

var Imported = Imported || {};

(function() {
	const pluginName = "SoR_MiniMapAndScene_MZ";
    const Param = PluginManager.parameters(pluginName);

    const Minimap_Radius = Number(Param['Minimap_Radius']) || 0;
    const Minimap_PixelSize = Number(Param['Minimap_PixelSize']) || 0;

    const RegionID_TransferPoint = Number(Param['RegionID_TransferPoint']) || 0;
    const RegionID_InpassableSearch = Number(Param['RegionID_InpassableSearch']) || 0;
    const Inpassable_IsolatedPoint = Boolean(Param['Inpassable_IsolatedPoint'] === 'true') || false;
    const MiniMap_Position = Number(Param['MiniMap_Position']) || 0;

    const PaintColor_Passable = String(Param['PaintColor_Passable']) || 'rgba(80,80,80,1.0)';
    const PaintColor_InPassable = String(Param['PaintColor_InPassable']) || 'rgba(55,55,255,1.0)';
    const PaintColor_TransferPoint = String(Param['PaintColor_TransferPoint']) || 'rgba(255,255,55,1.0)';

    const Minimap_FrontLayerImage = String(Param['Minimap_FrontLayerImage']) || '';
    const MapIcon_Player = String(Param['MapIcon_Player']) || '';
    const MapIcon_EnemySymbol = String(Param['MapIcon_EnemySymbol']) || '';
    const MapIcon_NPCSymbol = String(Param['MapIcon_NPCSymbol']) || '';
    const MapIcon_TreasureSymbol = String(Param['MapIcon_TreasureSymbol']) || '';

    const Name_AreaMapScene = String(Param['Name_AreaMapScene']) || '';
    const UseLegend_AreaMapScene = Boolean(Param['UseLegend_AreaMapScene'] === 'true' || false);
    const CallButton_ForAreaMap = String(Param['CallButton_ForAreaMap']) || '';

    const Padding_MinimapInnerPos = Number(Param['Padding_MinimapInnerPos']) || 0;
    const Padding_MinimapInnerRad = Number(Param['Padding_MinimapInnerRad']) || 0;

    const LegendPlayer_ForAreaMap = String(Param['LegendPlayer_ForAreaMap']) || '';
    const LegendEnemy_ForAreaMap = String(Param['LegendEnemy_ForAreaMap']) || '';
    const LegendNPC_ForAreaMap = String(Param['LegendNPC_ForAreaMap']) || '';
    const LegendTreasure_ForAreaMap = String(Param['LegendTreasure_ForAreaMap']) || '';
 
    let SoR_MM_Isopen = true;


ImageManager.loadBattleMMSprite = function(filename) {
    return this.loadBitmap('img/SoRMap/', filename, 0, true);
}


const SoR_MMS_ST_commandNewGame = Scene_Title.prototype.commandNewGame;
Scene_Title.prototype.commandNewGame = function() {
    SoR_MM_Isopen = false;
    SoR_MMS_ST_commandNewGame.call(this);
}


const SoR_MMS_SM_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    this.createMiniMapWindow();
    SoR_MMS_SM_createAllWindows.call(this);
}

Scene_Map.prototype.createMiniMapWindow = function() {
    const rect = this.SoR_MiniMapWindowRect();
    this.MiniMapObj = new SoR_MiniMap(rect);
    this.addWindow(this.MiniMapObj);

    this.MiniMapObj.traverseMap();
    this.MiniMapObj.paintMiniMap();
    this.MiniMapObj.DrawMinimapBase();
    this.MiniMapObj.SearchEventSymbols();
}

const SoR_MMS_SM_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    SoR_MMS_SM_start.call(this);
    this.MiniMapObj.updateMinimap();// initialization for drawing 
}


Scene_Map.prototype.SoR_MiniMapWindowRect = function() {
    const ww = Graphics.width;
    const wh = Graphics.height;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};


const SoR_MMS_SM_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    SoR_MMS_SM_update.call(this);
    this.checkHitKeyForAreaMapCall();
};



Scene_Map.prototype.checkHitKeyForAreaMapCall = function() {
    if(this.isBusy() || $gameMap.isEventRunning() || $gameMessage.isBusy()) return;
    if(CallButton_ForAreaMap!="" && Input.isTriggered(CallButton_ForAreaMap)){
        SceneManager.push(Scene_SoREntireMap);
    }
};



//////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
function SoR_MiniMap() {
    this.initialize(...arguments);
}
SoR_MiniMap.prototype = Object.create(Window_Base.prototype);
SoR_MiniMap.prototype.constructor = SoR_MiniMap;
Object.defineProperty(SoR_MiniMap.prototype, "innerWidth", {
    get: function() { return this._width; },
    set: function(value) { this.height = value; },
    configurable: true
});
Object.defineProperty(SoR_MiniMap.prototype, "innerHeight", {
    get: function() { return this._height; },
    set: function(value) { this.height = value; },
    configurable: true
});


SoR_MiniMap.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.openness = SoR_MM_Isopen ? 255:0;
    this.visible = true;
    this.opacity = 0;

    this.mapdata = [];
    this.mapimg = null;     //minimap sprite
    this.map_sx = 0;        //sizeofmap
    this.map_sy = 0;
    this.centerx = -1;
    this.centery = -1;
    this.cursor_dir = -1;
    this.pixelsize = Minimap_PixelSize;     //pixel size on minimap
    this.minimap_rad = Minimap_Radius; //radius
    this.map_padd = 0; //boundary cells on minimap

    this.inpassable_ck = [];
    this.inpass_ck_visited = [];

    this.EVsymbols = [];
    
    this.MinimapLocate(MiniMap_Position);
    this.InitImages();
}

SoR_MiniMap.prototype.MinimapLocate = function(p){
    let px = 0, py =0;
    const padd = this.minimap_rad*2+8;

    switch(p){
        case 0:
            px = Graphics.width-padd;
            py = -12;
        break;
        case 1:
            px = 4;
            py = -12;
        break;
        case 2:
            px = Graphics.width-padd;
            py = Graphics.height-padd;
        break;
        case 3:
            px = 4;
            py = Graphics.height-padd;
        break;
    }
    this.move(px,py,(this.minimap_rad+2)*2,(this.minimap_rad+2)*2);    
}


SoR_MiniMap.prototype.InitImages = function() {
    if(Minimap_FrontLayerImage!=="") this.basespr = ImageManager.loadBattleMMSprite(Minimap_FrontLayerImage);
    else this.basespr = new Bitmap(1,1);

    if(MapIcon_Player!=="") this.p_cursor = ImageManager.loadBattleMMSprite(MapIcon_Player);
    else this.p_cursor = new Bitmap(4,1);

    if(MapIcon_EnemySymbol!=="") this.e_cursor = ImageManager.loadBattleMMSprite(MapIcon_EnemySymbol);
    else this.e_cursor = new Bitmap(4,1);

    if(MapIcon_NPCSymbol!=="") this.npc_cursor = ImageManager.loadBattleMMSprite(MapIcon_NPCSymbol);
    else this.npc_cursor = new Bitmap(1,1);   

    if(MapIcon_TreasureSymbol!=="") this.tre_cursor = ImageManager.loadBattleMMSprite(MapIcon_TreasureSymbol);
    else this.tre_cursor = new Bitmap(2,1);

}



SoR_MiniMap.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.updateMinimap();
}




SoR_MiniMap.prototype.isUpdateRequired = function(testx,testy,d) {
    //player
    if(this.centerx == testx && this.centery == testy && this.cursor_dir == d);
    else return true;

    for(let i=0; i<this.EVsymbols.length;i++){
        const ev = this.EVsymbols[i];
        const p_ev = $gameMap.events()[ev.eid-1];
    
        const x = p_ev._x;
        const y = p_ev._y;
        const page = p_ev.findProperPageIndex()+1;//0 origin to 1 origin in the game
        const dir = p_ev._direction;
    
        if(this.EVsymbols[i]._x == x && this.EVsymbols[i]._y == y && this.EVsymbols[i]._d == dir && this.EVsymbols[i]._page == page);
        else return true;
    }

    return false;
}

SoR_MiniMap.prototype.updateMinimap = function() {
    const pd = this.map_padd;
    const px = $gamePlayer._x;
    const py = $gamePlayer._y;
    const d = $gamePlayer._direction;
 
    let testx = (px+pd)*this.pixelsize - this.minimap_rad;
    let testy = (py+pd)*this.pixelsize - this.minimap_rad;

    
    if(!this.isUpdateRequired(testx,testy,d)) return;

        this.centerx = testx;
        this.centery = testy;
        this.contents.clear();

        this.DrawMinimapBase();
        this.DrawSymbolCursor();
        this.DrawPlayerCursor(d);
        this.DrawMinimapEdgeSpr();
        this.DrawMinimapMask();
}

SoR_MiniMap.prototype.DrawPlayerCursor = function(d) {
    this.cursor_dir = d;
    const wd = Math.floor(this.p_cursor.width/4);
    const ht = this.p_cursor.height;
    const pixs = Math.floor(this.pixelsize/2);
    this.contents.blt(this.p_cursor, (d/2-1)*wd, 0, wd, ht, this.minimap_rad-ht+pixs, this.minimap_rad-ht+pixs);
}


SoR_MiniMap.prototype.DrawSymbolCursor = function() {
    const pd = this.map_padd;

    for(let i=0; i<this.EVsymbols.length;i++){

    const ev = this.EVsymbols[i];
    const p_ev = $gameMap.events()[ev.eid-1];

    const x = p_ev._x;
    const y = p_ev._y;
    const flags = ev.flags;
    const page = p_ev.findProperPageIndex()+1;//0 origin to 1 origin in the game
    const dir = p_ev._direction;
    let treasure_flag = 0;

    this.EVsymbols[i]._x = x;
    this.EVsymbols[i]._y = y;
    this.EVsymbols[i]._d = dir;
    this.EVsymbols[i]._page = page;

    if(page<=0) continue;

    if(ev.type==2){//treasure
        if(flags.indexOf(page)!=-1) treasure_flag=1;
    }
    else{//enemy, npc
        if(ev.type==0){
            if(p_ev._erased) continue;
        }
        if(ev.flags.length!=0){
            //Isenable visible symbols
            if(flags.indexOf(page)==-1) continue;
        }
    }
    let posx = ($gamePlayer._x-x)*this.pixelsize;
    let posy = ($gamePlayer._y-y)*this.pixelsize;

    let wd = 0;
    let ht = 0;
    const pixs = Math.floor(this.pixelsize/2);

    if(ev.type==0){
      wd = this.e_cursor.width/4;
      ht = this.e_cursor.height;
      this.contents.blt(this.e_cursor, (dir/2-1)*wd, 0, wd, ht, this.minimap_rad-posx-ht+pixs, this.minimap_rad-posy-ht+pixs);
    }
    else if(ev.type==1){
      wd = this.npc_cursor.width;
      ht = this.npc_cursor.height;
      this.contents.blt(this.npc_cursor, 0, 0, wd, ht, this.minimap_rad-posx-ht+pixs, this.minimap_rad-posy-ht+pixs);
    }
    else if(ev.type==2){
      wd = this.tre_cursor.width/2;
      ht = this.tre_cursor.height;
      this.contents.blt(this.tre_cursor, treasure_flag*wd, 0, wd, ht, this.minimap_rad-posx-ht+pixs, this.minimap_rad-posy-ht+pixs);
    }
    

    }
}


SoR_MiniMap.prototype.SearchEventSymbols = function() {
   const evs = $gameMap.events();

   for(let i=0; i<evs.length;i++){
    const ev = evs[i];
    const mt = ev.event().meta;
        if(Imported.SoR_EnemySymbolEncounter_MZ && mt.EnemySymbol){
            if(this.EVsymbols.find(elem => elem.eid == ev._eventId) === undefined) this.EVsymbols.push({type:0,eid:ev._eventId, flags:[] });
        }
        else if(mt.MMSymbolNPC){
            let tagcode = [];
            if(this.EVsymbols.find(elem => elem.eid == ev._eventId) === undefined){
         
               if(mt.MMSymbolNPC!==true)  tagcode = AnalyzeMMSymbolTag(mt.MMSymbolNPC); //read additional meta
               this.EVsymbols.push({type:1,eid:ev._eventId, flags:tagcode});
            }
        }
        else if(mt.MMSymbolTreasure){
            if(this.EVsymbols.find(elem => elem.eid == ev._eventId) === undefined){

                if(mt.MMSymbolTreasure!==true){
                     tagcode = AnalyzeMMSymbolTag(mt.MMSymbolTreasure); //read additional meta
                     this.EVsymbols.push({type:2,eid:ev._eventId, flags:tagcode});
                }

            }
        }
   }

}


function AnalyzeMMSymbolTag(str){
    let tag = [];

    const spl_str = str.split(',');
    const regex = /(\d+)\s*-\s*(\d+)/;
    
    for (let i = 0; i < spl_str.length; i++){
       if (regex.test(spl_str[i]) == true){
         const begin = Number(RegExp.$1);
         const end = Number(RegExp.$2);
         for (let j = begin; j <= end; j++) tag.push(j); //ranged ID
       }
       else tag.push(Number(spl_str[i])); //one ID
    }
    
  return tag;
}



SoR_MiniMap.prototype.DrawMinimapBase = function() {
    const padx = -8;
    const pady = -8;
    const posx = padx+this.centerx;
    const posy = pady+this.centery;
    
    this.contents.mapblt(this.mapimg, posx, posy, this.minimap_rad*2, this.minimap_rad*2, -16, -16);
}

SoR_MiniMap.prototype.DrawMinimapEdgeSpr = function() {
    const padx = -8;
    const pady = -8;
    const posx = padx+this.centerx;
    const posy = pady+this.centery;
    
    this.basespr.addLoadListener(function() {
        this.contents.blt(this.basespr, 0, 0, this.minimap_rad*4, this.minimap_rad*4, padx, pady, this.minimap_rad*2,this.minimap_rad*2);
    }.bind(this));
}

SoR_MiniMap.prototype.DrawMinimapMask = function() {
    const padx = -8;
    const pady = -8;
    const posx = padx+this.centerx;
    const posy = pady+this.centery;
    
    this.contents.mapmaskblt(this.minimap_rad);
}



Bitmap.prototype.mapblt = function(source, sx, sy, sw, sh, dx, dy, dw, dh) {
    const padx = -8;
    const pady = -8;

    dw = dw || sw;
    dh = dh || sh;
    try {
        //mapimage
        const image = source._canvas || source._image;
        this.context.globalCompositeOperation = "source-over";
        this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
    } catch (e) {
        //
    }
}


Bitmap.prototype.mapmaskblt = function(rad) {
    const padx = Padding_MinimapInnerPos;
    const pady = Padding_MinimapInnerPos;
        //masking
        this.context.globalCompositeOperation = "destination-in";
        this.context.arc(padx+rad,pady+rad, rad-Padding_MinimapInnerRad, 0, Math.PI * 2);
        this.context.fill();
        this._baseTexture.update();
}







SoR_MiniMap.prototype.traverseMap = function() {
    this.map_sx = $gameMap.width();
    this.map_sy = $gameMap.height();
    this.map_padd = Math.floor(this.minimap_rad/this.pixelsize);
    const pd = this.map_padd;

    for(let j=0; j<this.map_sy+pd*2; j++){
        for(let i=0; i<this.map_sx+pd*2; i++){
            let flag = false;

            if(j<pd || j>=this.map_sy+pd || i<pd || i>=this.map_sx+pd);//boundary cells
            else{
                //regular check
                for(let d=2; d<=8; d+=2) flag = flag || $gameMap.isPassable(i-pd,j-pd,d);
                
                if(flag && Inpassable_IsolatedPoint){//Eliminate Isolated point
                    if(!$gamePlayer.isMapPassable(i-pd,j-pd,6) && !$gamePlayer.isMapPassable(i-pd,j-pd,4) && !$gamePlayer.isMapPassable(i-pd,j-pd,8) && !$gamePlayer.isMapPassable(i-pd,j-pd,2)){
                        flag = false;
                    }
                }

            }
            let tile = flag==true? 1:0;

            if(RegionID_TransferPoint>0 && RegionID_TransferPoint == $gameMap.regionId(i-pd,j-pd)) tile = 2;
            if(RegionID_InpassableSearch > 0 && RegionID_InpassableSearch == $gameMap.regionId(i-pd,j-pd)) this.inpassable_ck.push({x:i,y:j});
            this.mapdata.push(tile);
        }
    }
}



SoR_MiniMap.prototype.paintMiniMap = function() {
    const pd = this.map_padd;
    this.mapimg = new Bitmap((this.map_sx+pd*2) * this.pixelsize, (this.map_sy+pd*2) * this.pixelsize);

    if(this.inpassable_ck.length!=0) this.ProcessInppassableRegion();

    for(let j=0; j<this.map_sy+pd*2; j++){
        for(let i=0; i<this.map_sx+pd*2; i++){
            const ind = j*(this.map_sx+pd*2)+i;
            const cond = this.mapdata[ind];

            let cl;
            if(cond==2) cl = PaintColor_TransferPoint; //transfer
            else if(cond==1) cl = PaintColor_Passable; //nomal passable
            else cl = PaintColor_InPassable; //not passable

            this.mapimg.fillRect(i * this.pixelsize, j * this.pixelsize, this.pixelsize, this.pixelsize, cl);
        }
    }

    
}


SoR_MiniMap.prototype.ProcessInppassableRegion = function() {
    const pd = this.map_padd;
    this.inpass_ck_visited = Array((this.map_sx+pd*2)*(this.map_sy+pd*2));
    for(let i=0;i<this.inpassable_ck.length;i++){
        this.inpass_ck_visited.fill(false);
        const x = this.inpassable_ck[i].x;   
        const y = this.inpassable_ck[i].y;

        this.DrawInpassable(x,y);
    }
    this.inpass_ck_visited = [];
}

SoR_MiniMap.prototype.DrawInpassable = function(x,y) {//non-recursive DFS
    const pd = this.map_padd;
    let node_stack = [];
    node_stack.push({x:x,y:y});

    while(node_stack.length>0){
        const st = node_stack[node_stack.length-1];
        const ind = st.y*(this.map_sx+pd*2)+st.x;
        const x = st.x;
        const y = st.y;

        this.inpass_ck_visited[ind] = true;
        this.mapdata[ind] = 0;
        
        if($gameMap.isValid(x+1-pd,y-pd) && !this.inpass_ck_visited[y*(this.map_sx+pd*2)+x+1] && $gamePlayer.isMapPassable(x-pd,y-pd,6)){
            node_stack.push({x:x+1,y:y});
        }
        else if($gameMap.isValid(x-1-pd,y-pd) && !this.inpass_ck_visited[y*(this.map_sx+pd*2)+x-1] && $gamePlayer.isMapPassable(x-pd,y-pd,4)){
            node_stack.push({x:x-1,y:y});
        }
        else if($gameMap.isValid(x-pd,y+1-pd) && !this.inpass_ck_visited[(y+1)*(this.map_sx+pd*2)+x] && $gamePlayer.isMapPassable(x-pd,y-pd,2)){
            node_stack.push({x:x,y:y+1});
        }
        else if($gameMap.isValid(x-pd,y-1-pd) && !this.inpass_ck_visited[(y-1)*(this.map_sx+pd*2)+x] && $gamePlayer.isMapPassable(x-pd,y-pd,8)){
            node_stack.push({x:x,y:y-1});
        }
        else node_stack.pop();
    }

}



///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////


function Scene_SoREntireMap() {
    this.initialize(...arguments);
}

Scene_SoREntireMap.prototype = Object.create(Scene_Base.prototype);
Scene_SoREntireMap.prototype.constructor = Scene_SoREntireMap;

Scene_SoREntireMap.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};


Scene_SoREntireMap.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
	this.createWindowLayer();	
	this.createAreaMapWindows();
}

Scene_SoREntireMap.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this.AreaMapObj.updateMinimap();// initialization for drawing 
    this.AreaMapObj.initializeWindowPosition();
    SoundManager.playOk();
}

Scene_SoREntireMap.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    this.CheckHitKeys();
}


  // main window
Scene_SoREntireMap.prototype.createAreaMapWindows = function(){
      this.createMiniMapWindow();

      this._SceneNamewindow = new Window_Base(new Rectangle(0,0,Graphics.width,64));
      this._SceneNamewindow.setBackgroundType(0);
      this.addWindow(this._SceneNamewindow);
      this._SceneNamewindow.drawText(Name_AreaMapScene, 0, 0, this._SceneNamewindow.width, "center");
      

      const mapname = $gameMap.displayName();
      this._SceneNamewindow.contents.fontSize = 18;
      const mname_w = this._SceneNamewindow.textWidth(mapname);
      this._MapNameWindow = new Window_Base(new Rectangle(0,64,mname_w+32,56));
      this._MapNameWindow.contents.fontSize = 18;
      this._MapNameWindow.setBackgroundType(0);
      this.addWindow(this._MapNameWindow);
      this._MapNameWindow.drawText(mapname, 0, 0, this._MapNameWindow.width);

      if(UseLegend_AreaMapScene){
        this._Legendwindow = new Window_Base(new Rectangle(0,120,160,156));
        this._Legendwindow.setBackgroundType(0);
        this.addWindow(this._Legendwindow);
        this.DrawLegendWindow();
      }
}


Scene_SoREntireMap.prototype.DrawLegendWindow = function(){

this._Legendwindow.contents.fontSize = 18;

let py = 16;

    if(MapIcon_Player!==""){
        this._Legendwindow.contents.blt(this.AreaMapObj.p_cursor, 48, 0, 16, 16, 0, py);
        this._Legendwindow.drawText(LegendPlayer_ForAreaMap,40,py-11,64,"center");
        py+=28;
    }
    if(MapIcon_EnemySymbol != ""){
        this._Legendwindow.contents.blt(this.AreaMapObj.e_cursor, 48, 0, 16, 16, 0, py);
        this._Legendwindow.drawText(LegendEnemy_ForAreaMap,40,py-11,64,"center");
        py+=28;
    }
    if(MapIcon_NPCSymbol != ""){
        this._Legendwindow.contents.blt(this.AreaMapObj.npc_cursor, 0, 0, 16, 16, 0, py);
        this._Legendwindow.drawText(LegendNPC_ForAreaMap,40,py-11,64,"center");
        py+=28;
    }
    if(MapIcon_TreasureSymbol != ""){
        this._Legendwindow.contents.blt(this.AreaMapObj.tre_cursor, 0, 0, 16, 16, 0, py);
        this._Legendwindow.drawText(LegendTreasure_ForAreaMap,40,py-11,64,"center");
        py+=28;
    }

    this._Legendwindow.height -= (128-py);
}




Scene_SoREntireMap.prototype.CheckHitKeys = function(){

    if (Input.isTriggered('up') || Input.isLongPressed('up')){
        if(this.AreaMapObj.y > Graphics.height - this.AreaMapObj.height+this.AreaMapObj.pixelsize){
        SoundManager.playCursor();
        this.AreaMapObj.y-=this.AreaMapObj.pixelsize;
        }
    }
    else if(Input.isTriggered('down') || Input.isLongPressed('down')){
        if(this.AreaMapObj.y < -this.AreaMapObj.pixelsize){
        SoundManager.playCursor();
        this.AreaMapObj.y+=this.AreaMapObj.pixelsize;
        }
    }
    else if(Input.isTriggered('right')|| Input.isLongPressed('right')){        
        if(this.AreaMapObj.x < -this.AreaMapObj.pixelsize){
        SoundManager.playCursor();
        this.AreaMapObj.x+=this.AreaMapObj.pixelsize;
        }
     
    }
    else if(Input.isTriggered('left')|| Input.isLongPressed('left')){
        if(this.AreaMapObj.x > Graphics.width - this.AreaMapObj.width+this.AreaMapObj.pixelsize){
        SoundManager.playCursor();
        this.AreaMapObj.x-=this.AreaMapObj.pixelsize;
        }
    }


    if (UseLegend_AreaMapScene && Input.isTriggered(CallButton_ForAreaMap)){
        if(!this._Legendwindow.isOpening() && !this._Legendwindow.isClosing()){
            if(!this._Legendwindow.isOpen())this._Legendwindow.open();
            if(this._Legendwindow.isOpen()) this._Legendwindow.close();
            SoundManager.playOk();
        }
      }
    

    if (Input.isTriggered('cancel') || TouchInput.isCancelled()){
         SoundManager.playCancel();
         SceneManager.pop();
    }
}



Scene_SoREntireMap.prototype.createMiniMapWindow = function() {
    const rect = this.SoR_AreaMapWindowRect();
    this.AreaMapObj = new SoR_AreaMap(rect);
    this.addWindow(this.AreaMapObj);

    this.AreaMapObj.traverseMap();
    this.AreaMapObj.FixWindowParameter();
    this.AreaMapObj.paintMiniMap();
    this.AreaMapObj.DrawMinimapBase();
    this.AreaMapObj.SearchEventSymbols();
}


Scene_SoREntireMap.prototype.SoR_AreaMapWindowRect = function() {
    const ww = Graphics.width*4;
    const wh = Graphics.height*4;
    const wx = 0;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};









//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
function SoR_AreaMap() {
    this.initialize(...arguments);
}
SoR_AreaMap.prototype = Object.create(SoR_MiniMap.prototype);
SoR_AreaMap.prototype.constructor = SoR_AreaMap;


SoR_AreaMap.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this.openness = 255;
    this.visible = true;
    this.opacity = 0;

    this.mapdata = [];
    this.mapimg = null;     //minimap sprite
    this.map_sx = 0;        //sizeofmap
    this.map_sy = 0;
    this.centerx = -1;
    this.centery = -1;
    this.cursor_dir = -1;
    this.pixelsize = 16;     //pixel size on minimap
    this.minimap_rad = 256; //radius --> for padding in entire region
    this.map_padd = 0; //boundary cells on minimap

    this.inpassable_ck = [];
    this.inpass_ck_visited = [];

    this.EVsymbols = [];
    this.InitImages();
}


SoR_AreaMap.prototype.initializeWindowPosition = function() {
    this.x = -this.pixelsize;
    this.y = -this.pixelsize;
    /*
    const pd = this.map_padd;
    const px = $gamePlayer._x;
    const py = $gamePlayer._y;
 
    let testx = (px+pd)*this.pixelsize/2;
    let testy = (py+pd)*this.pixelsize/2;

    this.x = Graphics.width/2-testx;
    this.y = Graphics.height/2+testy;

    if(this.y > Graphics.height - this.height+this.pixelsize) this.y = Graphics.height - this.height+this.pixelsize;
    else if(this.y < -this.pixelsize) this.y = -this.pixelsize;

    if(this.x < -this.pixelsize) this.x = -this.pixelsize;
    else if(this.x > Graphics.width - this.width+this.pixelsize) this.x = Graphics.width - this.width+this.pixelsize;
    */
}


SoR_AreaMap.prototype.FixWindowParameter = function() {
    this.minimap_rad = this.map_sx > this.map_sy? (this.map_sx+this.map_padd+8)*this.pixelsize/2 : (this.map_sy+this.map_padd+8)*this.pixelsize/2; //radius
    this.move(0,0,(this.map_sx+this.map_padd+8)*this.pixelsize,(this.map_sy+this.map_padd+8)*this.pixelsize);
}

SoR_AreaMap.prototype.updateMinimap = function() {
    const pd = this.map_padd;
    const px = $gamePlayer._x;
    const py = $gamePlayer._y;
    const d = $gamePlayer._direction;
 
    let testx = (px+pd)*this.pixelsize/2  //- this.minimap_rad;
    let testy = (py+pd)*this.pixelsize/2 //- this.minimap_rad;


        this.centerx = testx;
        this.centery = testy;
        this.contents.clear();

        this.DrawMinimapBase((this.map_sx+pd)*this.pixelsize,(this.map_sy+pd)*this.pixelsize);
        this.DrawSymbolCursor();
        this.DrawPlayerCursor(d);
}

SoR_AreaMap.prototype.DrawMinimapBase = function(xx,yy) {
    this.contents.mapblt(this.mapimg, 0, 0, xx*2, yy*2, -16, -16);
}


SoR_AreaMap.prototype.DrawPlayerCursor = function(d) {
    const pd = this.map_padd;
    const px = $gamePlayer._x;
    const py = $gamePlayer._y;
 
    let testx = (px+pd)*this.pixelsize  //- this.minimap_rad;
    let testy = (py+pd)*this.pixelsize //- this.minimap_rad;
    
    this.cursor_dir = d;
    const wd = Math.floor(this.p_cursor.width/4);
    const ht = this.p_cursor.height;
    this.contents.blt(this.p_cursor, (d/2-1)*wd, 0, wd, ht, testx-wd, testy-ht);
}

SoR_AreaMap.prototype.DrawSymbolCursor = function() {
    const pd = this.map_padd;

    for(let i=0; i<this.EVsymbols.length;i++){

    const ev = this.EVsymbols[i];
    const p_ev = $gameMap.events()[ev.eid-1];

    const x = p_ev._x;
    const y = p_ev._y;
    const flags = ev.flags;
    const page = p_ev.findProperPageIndex()+1;//0 origin to 1 origin in the game
    const dir = p_ev._direction;
    let treasure_flag = 0;

    if(page<=0) continue;

    if(ev.type==2){//treasure
        if(flags.indexOf(page)!=-1) treasure_flag=1;
    }
    else{//enemy, npc
        if(ev.type==0){
            if(p_ev._erased) continue;
        }       
        if(ev.flags.length!=0){
            //Isenable visible symbols
            if(flags.indexOf(page)==-1) continue;
        }
    }
    let posx = (x+pd)*this.pixelsize;
    let posy = (y+pd)*this.pixelsize;

    let wd = 0;
    let ht = 0;
    

    if(ev.type==0){
      wd = this.e_cursor.width/4;
      ht = this.e_cursor.height;
      this.contents.blt(this.e_cursor, (dir/2-1)*wd, 0, wd, ht, posx-ht, posy-ht);
    }
    else if(ev.type==1){
      wd = this.npc_cursor.width;
      ht = this.npc_cursor.height;
      this.contents.blt(this.npc_cursor, 0, 0, wd, ht, posx-ht, posy-ht);
    }
    else if(ev.type==2){
      wd = this.tre_cursor.width/2;
      ht = this.tre_cursor.height;
      this.contents.blt(this.tre_cursor, treasure_flag*wd, 0, wd, ht, posx-ht, posy-ht);
    }
    

    }
}

SoR_AreaMap.prototype.update = function() {}


///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

PluginManager.registerCommand(pluginName, "ReloadSymbolTags", args => { 
    if(SceneManager._scene instanceof Scene_Map){
       SceneManager._scene.MiniMapObj.SearchEventSymbols();
    }
});

PluginManager.registerCommand(pluginName, "CallAreaMap", args => { 
       SceneManager.push(Scene_SoREntireMap);
});

PluginManager.registerCommand(pluginName, "OpenMiniMap", args => { 
    if(SceneManager._scene instanceof Scene_Map){
       SceneManager._scene.MiniMapObj.open();
       SoR_MM_Isopen = true;
    }
});

PluginManager.registerCommand(pluginName, "CloseMiniMap", args => { 
    if(SceneManager._scene instanceof Scene_Map){
       SceneManager._scene.MiniMapObj.close();
       SoR_MM_Isopen = false;
    }
});



})();