//=================================================================================================
// MiniMap.js
//=================================================================================================
/*:
 * @target MZ
 * @plugindesc 小地图 (22-2-22)
 * @author 芯☆淡茹水
 * @help
 * 〓 使用说明 〓
 * 
 * 1，该小地图所使用的地图图像，为编辑器所截图的地图图片。
 *    请在地图编辑完成后，在编辑器地图列表名字处鼠标右键选择截图，
 *    截图保存到工程 img/pictures 文件夹里。
 * 
 * 2, 需要小地图的地图，请在 地图备注 里备注: <MiniImg:name>
 *    name: 截图的地图图片名。
 * 
 * 3, 地图上各种 角色/队友/事件 的标志，使用系统图标(IconSet)来标示。
 *    备注图标序号标志时写: <MiniIndex:n>    n: 图标序号。
 *    角色的标志备注，在 数据库 - 角色备注 里写 <MiniIndex:n> 
 *    事件的标志备注，在该事件当前页内容 第一项 ，选择 注释 里写 <MiniIndex:n>
 *    ※所有角色或事件初始都没有图标标志※
 * 
 * 4, 该插件与地图黑雾插件(XdRs_MapFog)兼容。
 * 
 * 
 * 〓 插件命令 〓
 * 
 * 关闭小地图（将小地图移出屏幕外） : CloseMiniMap
 * 
 * 
 * @param window
 * @text 〓 窗口设置 〓
 * @default
 * 
 * @param uiName
 * @parent window
 * @type file
 * @dir img/pictures
 * @text 窗口UI图片
 * @desc 小地图窗口UI图片，留空不使用图片时为默认窗口。
 * @default
 * 
 * @param windowX
 * @parent window
 * @type number
 * @text 小地图窗口X坐标
 * @desc 小地图窗口X坐标。
 * @default 2
 *  
 * @param windowWidth
 * @parent window
 * @type number
 * @text 小地图窗口宽
 * @desc 使用默认窗口时，窗口的宽度是多少(像素)。
 * @default 272
 * 
 * @param windowHeight
 * @parent window
 * @type number
 * @text 小地图窗口高
 * @desc 使用默认窗口时，窗口的高度是多少(像素)。
 * @default 208
 * 
 * @param windowEdge
 * @parent window
 * @type number
 * @text 小地图窗口的边宽
 * @desc 小地图显示区域为窗口宽减去四周的边宽。
 * @default 6
 * 
 * @param map
 * @text 〓 地图设置 〓
 * @default
 * 
 * @param keyCode
 * @parent map
 * @type number
 * @text 小地图快捷键
 * @desc 键盘键值,十进制，例：M 键为 77。
 * @default 77
 * 
 * @param scale
 * @parent map
 * @type number
 * @min 20
 * @max 100
 * @text 初始小地图缩放比例
 * @desc 最小20，最大100,（百分比）。
 * @default 45
 * 
 * @param scaleMin
 * @parent map
 * @type number
 * @min 10
 * @text 最小缩放倍率
 * @desc 按钮操作缩放地图的最小缩放倍率（百分比）。
 * @default 25
 * 
 * @param scaleMax
 * @parent map
 * @type number
 * @min 10
 * @text 最大缩放倍率
 * @desc 按钮操作缩放地图的最大缩放倍率（百分比）。
 * @default 80
 * 
 * @param iconScale
 * @parent map
 * @type boolean
 * @text 图标标志是否缩放
 * @desc 图标标志是否随小地图一起缩放。
 * @default true
 * 
 * @param twinkle
 * @parent map
 * @text 主角闪烁颜色
 * @desc 格式：红,绿,蓝。留空表示不闪烁。
 * @default 255,255,255
 * 
 * 
 * @param text
 * @text 〓 描绘设置 〓
 * @default
 * 
 * @param nameText
 * @parent text
 * @type struct<Text>
 * @text 地图名描绘设置
 * @desc 地图名描绘设置。
 * @default {"enable":"true","x":"4","y":"0","size":"18","color":"2","width":"100","height":"20","align":"0"}
 * 
 * @param coxText
 * @parent text
 * @type struct<Text>
 * @text 角色X坐标描绘设置
 * @desc 角色X坐标描绘设置。
 * @default {"enable":"true","x":"4","y":"156","size":"16","color":"3","width":"48","height":"20","align":"0"}
 * 
 * @param coyText
 * @parent text
 * @type struct<Text>
 * @text 角色Y坐标描绘设置
 * @desc 角色Y坐标描绘设置。
 * @default {"enable":"true","x":"54","y":"156","size":"16","color":"3","width":"48","height":"20","align":"0"}
 * 
 * @param button
 * @text 〓 按钮设置 〓
 * @default
 * 
 * @param buttonOpt
 * @parent button
 * @type struct<Button>
 * @text 收放按钮设置
 * @desc 收放按钮设置。
 * @default {"enable":"true","index":"73","indexA":"74","x":"290","y":"18"}
 * 
 * @param buttonElg
 * @parent button
 * @type struct<Button>
 * @text 放大按钮设置
 * @desc 放大按钮设置。
 * @default {"enable":"true","index":"245","indexA":"0","x":"54","y":"226"}
 * 
 * @param buttonNro
 * @parent button
 * @type struct<Button>
 * @text 缩小按钮设置
 * @desc 缩小按钮设置。
 * @default {"enable":"true","index":"244","indexA":"0","x":"18","y":"226"}
 * 
 * 
 * @command CloseMiniMap
 * @text 关闭小地图
 * @desc 小地图移出屏幕外。
 * 
 */ 
/* ---------------------------------------------------------------------------
 * struct<Text>
 * ---------------------------------------------------------------------------
*/
 /*~struct~Text: 
 *
 * @param enable
 * @type boolean
 * @text 是否启用
 * @desc 是否描绘该文字。
 * @default true
 * 
 * @param x
 * @type number
 * @text 该文字描绘的X坐标
 * @desc 该文字描绘在小地图窗口上的X坐标。
 * @default 0
 * 
 * @param y
 * @type number
 * @text 该文字描绘的Y坐标
 * @desc 该文字描绘在小地图窗口上的Y坐标。
 * @default 0
 * 
 * @param size
 * @type number
 * @text 文字描绘的字体大小
 * @desc 文字描绘的字体大小。
 * @default 26
 * 
 * @param color
 * @type number
 * @text 该文字描绘的色号
 * @desc 该文字描绘的色号。
 * @default 0
 * 
 * @param width
 * @type number
 * @text 文字描绘的矩形宽度
 * @desc 文字描绘的矩形宽度。
 * @default 100
 * 
 * @param height
 * @type number
 * @text 文字描绘的矩形高度
 * @desc 文字描绘的矩形高度。
 * @default 24
 * 
 * @param align
 * @type number
 * @text 文字描绘的对其方式
 * @desc 该文字描绘的对其方式（0:左；1:中；2:右）。
 * @default 0
 */
/* ---------------------------------------------------------------------------
 * struct<Button>
 * ---------------------------------------------------------------------------
*/
 /*~struct~Button: 
 *
 * @param enable
 * @type boolean
 * @text 是否启用
 * @desc 是否启用该按钮。
 * @default true
 * 
 * @param index
 * @type number
 * @text 按钮图像Icon序号
 * @desc 按钮图像的Icon序号。
 * @default 0
 * 
 * @param indexA
 * @type number
 * @text 按钮图像Icon序号2
 * @desc 该选项只适用于 收放按钮 ，当小地图窗口隐藏时该按钮显示的图标序号。
 * @default 0
 * 
 * @param x
 * @text 按钮X坐标
 * @desc 该按钮相对小地图窗口的X坐标。
 * @default 0
 * 
 * @param y
 * @text 按钮Y坐标
 * @desc 该按钮相对小地图窗口的Y坐标。
 * @default 0
 * 
*/
//=================================================================================================
;(() => {
//=================================================================================================
const pluginName = 'XdRs_MiniMap';
const parameters = PluginManager.parameters(pluginName);
//=================================================================================================
Input.keyMapper[parseInt(parameters['keyCode'])] = 'miniMap';
//=================================================================================================
PluginManager.registerCommand(pluginName, 'CloseMiniMap', () => {
    SceneManager.closeMiniMap();
});
//=================================================================================================
SceneManager.closeMiniMap = function() {
    if (this._scene && this._scene.constructor === Scene_Map) {
        this._scene.closeMiniMap();
    }
};
//=================================================================================================
const XR_Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    XR_Game_System_initialize.call(this);
    this.setMiniVisibility(true);
    this.changeMiniScale(parameters['scale']);
};
Game_System.prototype.miniVisibility = function() {
    return this._miniVisibility;
};
Game_System.prototype.miniScale = function() {
    return this._miniScale;
};
Game_System.prototype.setMiniVisibility = function(state) {
    this._miniVisibility = state;
};
Game_System.prototype.changeMiniScale = function(rate) {
    this._miniScale = Math.max(10, Math.min(100, rate));
};
//=================================================================================================
Game_Actor.prototype.miniIndex = function() {
    return parseInt(this.actor().meta.MiniIndex) || 0;
};
//=================================================================================================
Game_Map.prototype.miniImg = function() {
    return $dataMap ? $dataMap.meta.MiniImg : null;
};
Game_Map.prototype.miniTargets = function() {
    return this._events.concat($gamePlayer.miniTargets());
};
//=================================================================================================
Game_CharacterBase.prototype.miniIndex = function() {
    return 0;
};
//=================================================================================================
Game_Player.prototype.miniIndex = function() {
    return $gameParty.leader() ? $gameParty.leader().miniIndex() : 0;
};
Game_Player.prototype.miniTargets = function() {
    return this._followers.miniTargets().concat([this]);
};
//=================================================================================================
Game_Follower.prototype.miniIndex = function() {
    return this.actor() ? this.actor().miniIndex() : 0;
};
//=================================================================================================
Game_Followers.prototype.miniTargets = function() {
    return this._data.filter(f => !!f);
};
//=================================================================================================
const XR_Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function() {
    XR_Game_Event_setupPage.call(this);
    this.setupMiniSign();
};
Game_Event.prototype.setupMiniSign = function() {
    this._miniIndex = 0;
    if (this.page() && this.list() && this.list()[0].code === 108) {
        if (this.list()[0].parameters[0].match(/<MiniIndex:(\d+)>/)) {
            this._miniIndex = parseInt(RegExp.$1);
        }
    }
};
Game_Event.prototype.miniIndex = function() {
    return this._miniIndex || 0;
};
//=================================================================================================
function Sprite_MiniButton() {
    this.initialize(...arguments);
}
Sprite_MiniButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_MiniButton.prototype.constructor = Sprite_MiniButton;
Sprite_MiniButton.prototype.initialize = function(x, y, index, name) {
    Sprite_Clickable.prototype.initialize.call(this);
    this.bitmap = ImageManager.loadSystem('IconSet');
    this.anchor = new Point(0.5, 0.5);
    this._pressCount = 0;
    this._name = name;
    this.changeIndex(index);
    this.move(x, y);
};
Sprite_MiniButton.prototype.refreshStyle = function() {
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (this._index % 16) * pw;
    const sy = Math.floor(this._index / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};
Sprite_MiniButton.prototype.changeIndex = function(index) {
    if (this._index !== index) {
        this._index = index;
        this.refreshStyle();
    }
};
Sprite_MiniButton.prototype.isActive = function() {
    return this.worldVisible && this.parent && this.parent.isActive();
};
Sprite_MiniButton.prototype.canPress = function() {
    return this._pressCount === 0 && this.isActive();
};
Sprite_MiniButton.prototype.onPress = function() {
    if (this.canPress()) {
        const result = this.parent.onButtonPress(this._name);
        result && SoundManager.playOk();
        this.scale = new Point(0.95, 0.95);
        this._pressCount = 8;
    }
};
Sprite_MiniButton.prototype.onPressEnd = function() {
    this._pressCount = 0;
    this.scale = new Point(1, 1);
};
Sprite_MiniButton.prototype.update = function() {
    Sprite_Clickable.prototype.update.call(this);
    if (this._pressCount > 0) {
        this._pressCount--;
        this._pressCount === 0 && this.onPressEnd();
    }
};
//=================================================================================================
function Sprite_MiniSign() {
    this.initialize(...arguments);
}
Sprite_MiniSign.prototype = Object.create(Sprite.prototype);
Sprite_MiniSign.prototype.constructor = Sprite_MiniSign;
Sprite_MiniSign.prototype.initialize = function(target) {
    Sprite.prototype.initialize.call(this, ImageManager.loadSystem('IconSet'));
    this._target = target;
    this._rectFrame = null;
    this.anchor = new Point(0.5, 0.5);
    this.setupTwinkle();
    this.refresh();
};
Sprite_MiniSign.prototype.setupTwinkle = function() {
    if (this._target instanceof Game_Player) {
        const text = parameters['twinkle'].replace(/\s/g, '');
        if (text) {
            this._twinkleColor = text.split(',').map(n => parseInt(n));
            this._twinkleAlpha = 10;
            this._twinkleCount = 0;
        }
    }
};
Sprite_MiniSign.prototype.refresh = function() {
    this._miniIndex = this._target.miniIndex();
    this.visible = this._miniIndex > 0;
    this.setSignFrame();
};
Sprite_MiniSign.prototype.setSignFrame = function() {
    const rx = this._rectFrame ? this._rectFrame.x : 0;
    const ry = this._rectFrame ? this._rectFrame.y : 0;
    const rw = this._rectFrame ? this._rectFrame.width  : null;
    const rh = this._rectFrame ? this._rectFrame.height : null;
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (this._miniIndex % 16) * pw + rx;
    const sy = Math.floor(this._miniIndex / 16) * ph + ry;
    this.setFrame(sx, sy, rw || pw, rh || ph);
};
Sprite_MiniSign.prototype.refreshScale = function(scale) {
    const s = 1 / scale;
    this.scale = new Point(s, s)
};
Sprite_MiniSign.prototype.isRectChanged = function(rect) {
    if (!!this._rectFrame && !!rect) {
        return this._rectFrame.x !== rect.x ||
               this._rectFrame.y !== rect.y ||
               this._rectFrame.width !== rect.width ||
               this._rectFrame.height !== rect.height;
    }
    return true;
};
Sprite_MiniSign.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateSignIndex();
    this.updatePosition();
    this.updateTwinkle();
};
Sprite_MiniSign.prototype.updateSignIndex = function() {
    this._miniIndex !== this._target.miniIndex() && this.refresh();
};
Sprite_MiniSign.prototype.updatePosition = function() {
    if (this._miniIndex > 0 && this.parent) {
        const sx = (this._target._realX + 0.5) * $gameMap.tileWidth();
        const sy = (this._target._realY + 0.5) * $gameMap.tileHeight();
        this.x = sx - this.parent.scrollX();
        this.y = sy - this.parent.scrollY();
        this.visible = this.parent.isSignInScreen(this.x, this.y);
    }
};
Sprite_MiniSign.prototype.updateTwinkle = function() {
    if (this.visible && this._twinkleColor) {
        this._twinkleCount = (this._twinkleCount+1) % 60;
        this._twinkleAlpha += this._twinkleCount < 30 ? 3 : -3;
        this.setBlendColor(this._twinkleColor.concat([this._twinkleAlpha]));
    }
};
//=================================================================================================
function Sprite_MapMiniFog() {
    this.initialize(...arguments);
}
Sprite_MapMiniFog.prototype = Object.create(Sprite.prototype);
Sprite_MapMiniFog.prototype.constructor = Sprite_MapMiniFog;
Sprite_MapMiniFog.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.bitmap = SceneManager.getMapFogSprite().bitmap;
    this.blendMode = 2;
};
Sprite_MapMiniFog.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateVisibility();
};
Sprite_MapMiniFog.prototype.updateVisibility = function() {
    this.visible = $gameMap.hasFog();
};
//=================================================================================================
function Sprite_MiniBody() {
    this.initialize(...arguments);
}
Sprite_MiniBody.prototype = Object.create(Sprite.prototype);
Sprite_MiniBody.prototype.constructor = Sprite_MiniBody;
Sprite_MiniBody.prototype.initialize = function(viewport) {
    this._isReady = false;
    this._viewport = viewport;
    const imgName = $gameMap.miniImg();
    Sprite.prototype.initialize.call(this, ImageManager.loadPicture(imgName));
    this.bitmap.addLoadListener(this.setup.bind(this));
};
Sprite_MiniBody.prototype.setup = function() {
    this._isReady = true;
    this.createCharacters();
    this.createMapFog();
    this.changeScale($gameSystem.miniScale());
};
Sprite_MiniBody.prototype.createCharacters = function() {
    this._characterSprites = [];
    $gameMap.miniTargets().forEach(target => {
        if (target) {
            const sign = new Sprite_MiniSign(target);
            this._characterSprites.push(sign);
            this.addChild(sign);
        }
    });
};
Sprite_MiniBody.prototype.createMapFog = function() {
    if (SceneManager.getMapFogSprite && SceneManager.getMapFogSprite()) {
        this._fog = new Sprite_MapMiniFog();
        this.addChild(this._fog);
    }
};
Sprite_MiniBody.prototype.changeScale = function(scale) {
    if (this._scale !== scale) {
        this._scale = scale;
        const s = scale / 100;
        this.scale = new Point(s, s);
        $gameSystem.changeMiniScale(scale);
        this.refresh();
    }
};
Sprite_MiniBody.prototype.refresh = function() {
    const v = this._viewport;
    const s = this._scale / 100;
    const rw = this.bitmap.width * s;
    const rh = this.bitmap.height * s;
    const x = Math.max((v.w1 - v.w2) / 2, (v.w1 - rw) / 2);
    const y = Math.max((v.w1 - v.w2) / 2, (v.h1 - rh) / 2);
    this._scrollData = {'x':0,'y':0};
    this._scrollData.sw = v.w2 / s;
    this._scrollData.sh = v.h2 / s;
    if (!eval(parameters['iconScale'])) {
        this._characterSprites.forEach(c => c.refreshScale(s));
    }
    this.updateScroll(true);
    this.move(x, y);
};
Sprite_MiniBody.prototype.scrollX = function() {
    return this._scrollData.x || 0;
};
Sprite_MiniBody.prototype.scrollY = function() {
    return this._scrollData.y || 0;
};
Sprite_MiniBody.prototype.isSignInScreen = function(x, y) {
    const pw = ImageManager.iconWidth / 2 + 8;
    if ((x-pw) < 0 || (y-pw) < 0)     return false;
    if ((x+pw) > this._scrollData.sw) return false;
    if ((y+pw) > this._scrollData.sh) return false;
    return true;
};
Sprite_MiniBody.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateScroll();
};
Sprite_MiniBody.prototype.updateScroll = function(force) {
    if (this._isReady && $gameSystem.miniVisibility()) {
        const s  = this._scale / 100;
        const pw = this._viewport.w2 / s;
        const ph = this._viewport.h2 / s;
        const px = ($gamePlayer._realX + 0.5) * $gameMap.tileWidth();
        const py = ($gamePlayer._realY + 0.5) * $gameMap.tileHeight();
        const sx = Math.max(0, Math.min(this.bitmap.width - pw, (px - pw / 2)));
        const sy = Math.max(0, Math.min(this.bitmap.height - ph, (py - ph / 2)));
        if (force || (sx !== this._scrollData.x || sy !== this._scrollData.y)) {
            this._scrollData.x = sx;
            this._scrollData.y = sy;
            this.setFrame(sx, sy, pw, ph);
            this._fog && this._fog.setFrame(sx, sy, pw, ph);
            if (force) {
                this._characterSprites.forEach(c => c.updatePosition());
            }
        }
    }
};
//=================================================================================================
function Window_MiniMap() {
    this.initialize(...arguments);
}
Window_MiniMap.prototype = Object.create(Window_Base.prototype);
Window_MiniMap.prototype.constructor = Window_MiniMap;
Window_MiniMap.prototype.initialize = function(parent) {
    this._parent = parent;
    this._uiSprite = null;
    this._isReady = false;
    this._uiName = parameters['uiName'];
    if (this._uiName) {
        this._uiSprite = new Sprite(ImageManager.loadPicture(this._uiName));
        this._uiSprite.bitmap.addLoadListener(this.setupWindow.bind(this));
    } else this.setupWindow();
};
Window_MiniMap.prototype.getWindowRect = function() {
    const x = parseInt(parameters['windowX']);
    const w = parseInt(parameters['windowWidth']);
    const h = parseInt(parameters['windowHeight']);
    return new Rectangle(x, 0, w, h);
};
Window_MiniMap.prototype.setupWindow = function() {
    const rect = this.getWindowRect();
    if (this._uiSprite) {
        rect.width = this._uiSprite.width;
        rect.height = this._uiSprite.height;
    }
    rect.y = $gameSystem.miniVisibility() ? 0 : -rect.height;
    Window_Base.prototype.initialize.call(this, rect);
    this._movedY = rect.height / 10;
    this._isReady = true;
    this.createParts();
    this.refreshVisibility();
    this._parent.addChild(this);
    this._parent = null;
};
Window_MiniMap.prototype.createParts = function() {
    this.createMapBody();
    if (this._uiSprite) {
        this.opacity = 0;
        this.addChildToBack(this._uiSprite);
    }
    this.createButtons();
    this.drawMapInfo();
};
Window_MiniMap.prototype.createMapBody = function() {
    const edge = parseInt(parameters['windowEdge']);
    const w = this.width, h = this.height;
    const viewport = {'w1':w,'h1':h,'w2':w-edge*2,'h2':h-edge*2};
    this._mapBody = new Sprite_MiniBody(viewport);
    this.addChildToBack(this._mapBody);
};
Window_MiniMap.prototype.createButtons = function() {
    this._buttons = {};
    this._buttonNames = [];
    const result = $gameSystem.miniVisibility();
    ['Opt','Elg','Nro'].forEach(name => {
        if (parameters['button'+name]) {
            const struct = JSON.parse(parameters['button'+name]);
            if (!!eval(struct.enable)) {
                const x = eval(struct.x) || 0;
                const y = eval(struct.y) || 0;
                const index = parseInt(struct.index);
                this._buttons[name] = new Sprite_MiniButton(x, y, index, name);
                this.addChild(this._buttons[name]);
                this._buttonNames.push(name);
                if (name === 'Opt') {
                    this._optY = y;
                    const indexA = parseInt(struct.indexA);
                    this._optIndexData = new Point(index, indexA);
                    this._buttons[name].y = y + (result ? 0 : this.height);
                    this._buttons[name].changeIndex(result ? index : indexA);
                } else this._buttons[name].visible = result;
            }
        }
    });
};
Window_MiniMap.prototype.isHovered = function() {
    if (!this.visible) return false;
    if (Window_Scrollable.prototype.isTouchedInsideFrame.call(this)) return true;
    return this._buttonNames.some(s => this._buttons[s]._hovered);
};
Window_MiniMap.prototype.isActive = function() {
    return !$gameMap.isEventRunning();
};
Window_MiniMap.prototype.isInPlace = function() {
    if ($gameSystem.miniVisibility()) return this.y >= 0;
    return this.y <= -this.height;
};
Window_MiniMap.prototype.onButtonPress = function(buttonName) {
    if (buttonName === 'Opt') this.stretch();
    else {
        const tmp = $gameSystem.miniScale();
        const min = parseInt(parameters['scaleMin']) || 20;
        const max = Math.max(min, parseInt(parameters['scaleMax']) || 100);
        const n = buttonName === 'Elg' ? 5 : -5;
        const s = Math.max(min, Math.min(max, tmp+n));
        this._mapBody.changeScale(s);
        return tmp !== s;
    }
    return true;
};
Window_MiniMap.prototype.stretch = function(state) {
    const tmp = $gameSystem.miniVisibility();
    if (state !== void 0) $gameSystem.setMiniVisibility(!!state);
    else $gameSystem.setMiniVisibility(!tmp);
    if (tmp !== $gameSystem.miniVisibility()) {
        const p = this._optIndexData;
        if (p) this._buttons.Opt.changeIndex(tmp ? p.y : p.x);
        ['Elg','Nro'].forEach(name => {
            if (this._buttons[name]) this._buttons[name].visible = !tmp;
        });
    }
};
Window_MiniMap.prototype.drawMapInfo = function() {
    this.setupInfoData();
    this.drawInfoText('name', $gameMap.displayName());
    this.drawCoordinate('cox');
    this.drawCoordinate('coy');
};
Window_MiniMap.prototype.setupInfoData = function() {
    this._infoData = {};
    ['name','cox','coy'].forEach(s => {
        this._infoData[s] = {'enable':false};
        if (parameters[s+'Text']) {
            const struct = JSON.parse(parameters[s+'Text']);
            if (!!eval(struct.enable)) {
                this._infoData[s].enable = true;
                const x = eval(struct.x) || 0;
                const y = eval(struct.y) || 0;
                const w = eval(struct.width) || 0;
                const h = eval(struct.height) || this.lineHeight();
                this._infoData[s].rect = new Rectangle(x, y, w, h);
                this._infoData[s].align = parseInt(struct.align) || 0;
                this._infoData[s].color = parseInt(struct.color) || 0;
                this._infoData[s].size = parseInt(struct.size) || $gameSystem.mainFontSize();
            }
        }
    });
};
Window_MiniMap.prototype.drawCoordinate = function(type) {
    if (this._infoData[type].enable) {
        if (type === 'cox') this._lastX = $gamePlayer.x;
        else this._lastY = $gamePlayer.y;
        const r = this._infoData[type].rect;
        this.contents.clearRect(r.x, r.y, r.width, r.height);
        const text = type === 'cox' ? 'X: '+this._lastX : 'Y: '+this._lastY;
        this.drawInfoText(type, text);
    }
};
Window_MiniMap.prototype.drawInfoText = function(type, text) {
    if (this._infoData[type].enable) {
        const r = this._infoData[type].rect;
        const n = this._infoData[type].color;
        const align = ['left','center','right'][this._infoData[type].align];
        this.changeTextColor(ColorManager.textColor(n));
        this.contents.fontSize = this._infoData[type].size;
        this.contents.drawText(text, r.x, r.y, r.width, r.height, align);
    }
};
Window_MiniMap.prototype.isPlayerTouch = function() {
    if (!$gameSystem.miniVisibility()) return false;
    const size = $gameMap.tileWidth();
    const px = $gamePlayer.screenX() - size / 2;
    const py = $gamePlayer.screenY() - size;
    if (px > (this.x + this.width) || (px + size / 2) < this.x) return false;
    if (py < this.y || (py - size) > (this.y + this.height))    return false;
    return true;
};
Window_MiniMap.prototype.refreshVisibility = function() {
    this.visible = !this.isPlayerTouch();
};
Window_MiniMap.prototype.update = function() {
    if (this._isReady) {
        Window_Base.prototype.update.call(this);
        this.updateMove();
        this.updateMapInfo();
        if (this.isActive()) {
            this.updateInput();
        }
    }
};
Window_MiniMap.prototype.updateMove = function() {
    $gamePlayer.isMoving() && this.refreshVisibility();
    if (!this.isInPlace()) {
        const result = $gameSystem.miniVisibility();
        this.y += result ? this._movedY : -this._movedY;
        if (this.isInPlace()) {
            this.y = result ? 0 : -this.height;
        }
        if (this._buttons.Opt) {
            this._buttons.Opt.y = this._optY - this.y;
        }
    }
};
Window_MiniMap.prototype.updateMapInfo = function() {
    if (this._infoData['cox'].enable && this._lastX !== $gamePlayer.x) {
        this.drawCoordinate('cox');
    }
    if (this._infoData['coy'].enable && this._lastY !== $gamePlayer.y) {
        this.drawCoordinate('coy');
    }
};
Window_MiniMap.prototype.updateInput = function() {
    if (Input.isTriggered('miniMap')) {
        SoundManager.playOk();
        this.stretch();
    }
};
//=================================================================================================
const XR_Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    XR_Scene_Map_createAllWindows.call(this);
    this.createMiniMapWindow();
};
Scene_Map.prototype.createMiniMapWindow = function() {
    if ($gameMap.miniImg()) this._miniMapWindow = new Window_MiniMap(this);
};
Scene_Map.prototype.closeMiniMap = function() {
    this._miniMapWindow && this._miniMapWindow.stretch(false);
};
const XR_Scene_Map_isAnyButtonPressed = Scene_Map.prototype.isAnyButtonPressed;
Scene_Map.prototype.isAnyButtonPressed = function() {
    if (this._miniMapWindow && this._miniMapWindow.isHovered()) return true;
    return XR_Scene_Map_isAnyButtonPressed.call(this);
};
//=================================================================================================
})();
//=================================================================================================
// end
//=================================================================================================