/*:
@target MV MZ
@plugindesc 技能树布局扩展 v1.2.0
@author うなぎおおとろ/<译>公孖。狼
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SkillTree_LayoutEx.js

@help
扩展技能树布局.
导入本插件,可进行如下操作.
・技能树中展示技能图标
・图标展示界面背景图
・图标界面添加人物图像
・展示技能类型选项图标
・展示技能树窗口界面背景图

[技能树图标中显示技能名]
其中"icon_ex"应用于图标信息.
使用图标场合为 ["icon_ex", 图标背景图, iconIndex]
iconIndex...使用图标的索引
            iconIndex可省略.省略时,默认使用已设定技能的图标.
图标背景图...需指定背景图的文件名,以及背景的索引.
                 指定索引的情况,以[背景图的文件名,X轴索引,Y轴索引]形式设定.
fileName...图片文件名名.图片放置于「img/pictures」文件夹中.

[展示技能类型选项图标]
设定技能树中技能类型,在类型信息栏追加图标显示,使其出现于选择项中.
类型信息按如下形式设定.

[类型类别, 类型名称, 类型简述, 类型开关, 图标索引]
类型类别...类型分类系统中设定独特标识区分类别.
类型名称...类型一览窗口展示类型名称.
类型简述...类型一览窗口展示类型简述.
类型开关...类型有效设定为true,无效设定为false.
图标索引...使用图标的索引

[许可]
本插件可在遵循MIT许可下自由利用.

@param IconXOfs
@type number
@default 5
@desc
设定图标X坐标偏移.

@param OpenedImage
@type struct <OpenedImage>
@desc
为已习得技能追加图像.

@param ChangeOpenedTextColor
@type boolean
@default true
@desc
设定为true可变更已习得技能文字颜色.

@param IconFontSize
@type number
@default 20
@desc
设定技能文字字体尺寸.

@param BackgroundImage
@type struct <BackgroundImage>
@desc
设定技能树界面背景图.
*/

/*~struct~OpenedImage:
@param EnableOpenedImage
@type boolean
@default false
@desc
设定为true为已习得技能添加图像.

@param FileName
@type file
@dir img
@desc
设定已习得技能添加图像的文件名.

@param XOfs
@type number
@default 0
@desc
设定已习得技能添加图像的X坐标偏移.

@param YOfs
@type number
@default 0
@desc
设定已习得技能添加图像的Y坐标偏移.
*/

/*~struct~BackgroundImage:
@param FileName
@type file
@dir img
@desc
设定技能树界面背景图的文件名.

@param BackgroundImage2
@type struct <BackgroundImage2>[]
@dir img
@desc
设定技能树界面追加图像的文件名.

@param BackgroundImage2XOfs
@type number
@default 240
@desc
设定技能树界面追加图像的X坐标偏移.

@param BackgroundImage2YOfs
@type number
@default 300
@desc
设定技能树界面追加图像的Y坐标偏移.
*/

/*~struct~BackgroundImage2:
@param FileName
@type file
@dir img
@desc
设定技能树子场景的背景图文件名.

@param ActorId
@type actor
@desc
设定角色ID.
*/

const SkillTree_LayoutExPluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];

(() => {
"use strict";

class PluginParamsParser {
    static parse(params, typeData, predictEnable = true) {
        return new PluginParamsParser(predictEnable).parse(params, typeData);
    }

    constructor(predictEnable = true) {
        this._predictEnable = predictEnable;
    }

    parse(params, typeData, loopCount = 0) {
        if (++loopCount > 255) throw new Error("endless loop error");
        const result = {};
        for (const name in typeData) {
            result[name] = this.convertParam(params[name], typeData[name], loopCount);
        }
        if (!this._predictEnable) return result;
        if (typeof params === "object" && !(params instanceof Array)) {
            for (const name in params) {
                if (result[name]) continue;
                const param = params[name];
                const type = this.predict(param);
                result[name] = this.convertParam(param, type, loopCount);
            }
        }
        return result;
    }

    convertParam(param, type, loopCount) {
        if (typeof type === "string") {
            return this.cast(param, type);
        } else if (typeof type === "object" && type instanceof Array) {
            const aryParam = JSON.parse(param);
            if (type[0] === "string") {
                return aryParam.map(strParam => this.cast(strParam, type[0]));
            } else {
                return aryParam.map(strParam => this.parse(JSON.parse(strParam), type[0]), loopCount);
            }
        } else if (typeof type === "object") {
            return this.parse(JSON.parse(param), type, loopCount);
        } else {
            throw new Error(`${type} is not string or object`);
        }
    }

    cast(param, type) {
        switch(type) {
        case "any":
            if (!this._predictEnable) throw new Error("Predict mode is disable");
            return this.cast(param, this.predict(param));
        case "string":
            return param;
        case "number":
            if (param.match(/\d+\.\d+/)) return parseFloat(param);
            return parseInt(param);
        case "boolean":
            return param === "true";
        default:
            throw new Error(`Unknow type: ${type}`);
        }
    }

    predict(param) {
        if (param.match(/^\d+$/) || param.match(/^\d+\.\d+$/)) {
            return "number";
        } else if (param === "true" || param === "false") {
            return "boolean";
        } else {
            return "string";
        }
    }
}

const typeDefine = {
    OpenedImage: {},
    BackgroundImage: {
        BackgroundImage2: [{}]
    },
};
const params = PluginParamsParser.parse(PluginManager.parameters(SkillTree_LayoutExPluginName), typeDefine);

const OpenedImage = params.OpenedImage;
const BackgroundImage = params.BackgroundImage;
const ChangeOpenedTextColor = params.ChangeOpenedTextColor;
const IconXOfs = params.IconXOfs;
const IconFontSize = params.IconFontSize;

const skillTreeParams = PluginParamsParser.parse(PluginManager.parameters(SkillTreePluginName), {});
const IconWidth = skillTreeParams.IconWidth;
const IconHeight = skillTreeParams.IconHeight;
const ViewRectColor = skillTreeParams.ViewRectColor;
const ViewRectOfs = skillTreeParams.ViewRectOfs;

const SkillTreeNodeInfo = SkillTreeClassAlias.SkillTreeNodeInfo;
const SkillTreeNode = SkillTreeClassAlias.SkillTreeNode;
const SkillTreeTopNode = SkillTreeClassAlias.SkillTreeTopNode;
const SkillDataType = SkillTreeClassAlias.SkillDataType;
const SkillTreeMapLoader = SkillTreeClassAlias.SkillTreeMapLoader;
const SkillTreeConfigLoadError = SkillTreeClassAlias.SkillTreeConfigLoadError;
const SkillTreeConfigLoader = SkillTreeClassAlias.SkillTreeConfigLoader;
const SkillTreeData = SkillTreeClassAlias.SkillTreeData;
const SkillTreeManager = SkillTreeClassAlias.SkillTreeManager;
const Scene_SkillTree = SkillTreeClassAlias.Scene_SkillTree;
const Window_TypeSelect = SkillTreeClassAlias.Window_TypeSelect;
const Window_ActorInfo = SkillTreeClassAlias.Window_ActorInfo;
const Window_SkillTreeNodeInfo = SkillTreeClassAlias.Window_SkillTreeNodeInfo;
const Window_SkillTree = SkillTreeClassAlias.Window_SkillTree;
const Window_NodeOpen = SkillTreeClassAlias.Window_NodeOpen;
const SkillTreeView = SkillTreeClassAlias.SkillTreeView;

const _Scene_SkillTree_isReady = Scene_SkillTree.prototype.isReady;
Scene_SkillTree.prototype.isReady = function() {
    if (!_Scene_SkillTree_isReady.call(this)) return false;
    if (OpenedImage.FileName) {
        const openedImage = ImageManager.loadBitmap("img/", OpenedImage.FileName);
        if (!openedImage.isReady()) return false;
    }
    if (BackgroundImage.FileName) {
        const backgroundImage1 = ImageManager.loadBitmap("img/", BackgroundImage.FileName);
        if (!backgroundImage1.isReady()) return false;
    }
    for (const img2 of BackgroundImage.BackgroundImage2) {
        if (img2.FileName) {
            const backgroundImage2 = ImageManager.loadBitmap("img/", img2.FileName);
            if (!backgroundImage2.isReady()) return false;
        }
    }
    return true;
};

SkillTreeNodeInfo.prototype.iconBitmap = function(opened) {
    if (this._iconData[0] === "img") {
        return ImageManager.loadPicture(this._iconData[1]);
    } else if (this._iconData[0] === "icon") {
        let iconIndex;
        if (this._iconData.length >= 2) {
            iconIndex = this._iconData[1];
        } else {
            iconIndex = this.skill().iconIndex;
        }
        return this.trimIconset(iconIndex);
    } else if (this._iconData[0] === "icon_ex") {
        return this.iconExBitmap(opened);
    }
    throw new Error(`Unknown ${this._iconData[0]}`);
};

SkillTreeNodeInfo.prototype.iconExBitmap = function(opened) {
    let iconIndex;
    if (this._iconData.length >= 3) {
        iconIndex = this._iconData[2];
    } else {
        iconIndex = this.skill().iconIndex;
    }
    const iconBitmap = this.trimIconset(iconIndex);
    const dstBitmap = new Bitmap(IconWidth, IconHeight);
    const dx = IconXOfs;
    let dy = (IconHeight - 32) / 2;
    if (IconHeight % 2 !== 0) dy -= 1;
    if (this._iconData.length >= 2 && this._iconData[1]) {
        if (typeof this._iconData[1] === "string") {
            const backBitmap = ImageManager.loadPicture(this._iconData[1]);
            if (!backBitmap.isReady()) return backBitmap;
            dstBitmap.blt(backBitmap, 0, 0, IconWidth, IconHeight, 0, 0);
        } else {
            const backBitmap = ImageManager.loadPicture(this._iconData[1][0]);
            if (!backBitmap.isReady()) return backBitmap;
            const x = this._iconData[1][1] * IconWidth;
            const y = this._iconData[1][2] * IconHeight;
            dstBitmap.blt(backBitmap, x, y, IconWidth, IconHeight, 0, 0);
        }
    }
    dstBitmap.blt(iconBitmap, 0, 0, 32, 32, dx, dy);
    const textWidth = IconWidth - 32 - dx - IconXOfs;
    dstBitmap.fontSize = IconFontSize;
    const iconTextSpace = 5;
    if (ChangeOpenedTextColor && opened) {
        const tmpTextColor = dstBitmap.textColor;
        dstBitmap.textColor = this.crisisColor();
        dstBitmap.drawText(this.skill().name, 32 + dx + iconTextSpace, dy, textWidth, 32, "left");
        dstBitmap.textColor = tmpTextColor;
    } else {
        dstBitmap.drawText(this.skill().name, 32 + dx + iconTextSpace, dy, textWidth, 32, "left");
    }
    return dstBitmap;
};

SkillTreeNodeInfo.prototype.crisisColor = function() {
    if (Utils.RPGMAKER_NAME === "MZ") return ColorManager.crisisColor();
    const dummyWindow = new Window_Base(0, 0, 0, 0);
    return dummyWindow.crisisColor();
}

SkillTreeNode.prototype.iconBitmap = function() {
    return this._info.iconBitmap(this.isOpened());
}

SkillTreeView.prototype.viewDrawNode = function(bitmap) {
    for (const node of Object.values(this._skillTreeManager.getAllNodes())) {
        let [px, py] = SkillTreeView.getPixelXY(node.point);
        if (node.isSelectable()) {
            this.drawIcon(bitmap, node.iconBitmap(), px, py);
        } else {
            this.drawIcon(bitmap, node.iconBitmap(), px, py, 96);
        }
        if (node.isOpened()) {
            if (OpenedImage.EnableOpenedImage) {
                const x = px + OpenedImage.XOfs;
                const y = py + OpenedImage.YOfs;
                const openedImage = ImageManager.loadBitmap("img/", OpenedImage.FileName);
                bitmap.blt(openedImage, 0, 0, openedImage.width, openedImage.height, x, y);
            } else {
                const x = px - ViewRectOfs;
                const y = py - ViewRectOfs;
                const width = IconWidth + ViewRectOfs * 2;
                const height = IconHeight + ViewRectOfs * 2;
                this.drawRect(bitmap, ViewRectColor, x, y, width, height);
            }
        }
    }
}

SkillTreeConfigLoader.prototype.loadTypes = function(actorId) {
    let cfgTypes = null;
    let typesArray = [];
    for (let cfg of this._configData.skillTreeTypes) {
        if (cfg.actorId === actorId) {
            cfgTypes = cfg.types;
            break;
        }
    }
    if (!cfgTypes) throw new SkillTreeConfigLoadError(`Missing types from actorId:${actorId}`);
    for (let cfgType of cfgTypes) {
        const enabled = (cfgType.length === 3 ? true : cfgType[3]);
        const type = new SkillDataType(cfgType[0], actorId, cfgType[1], cfgType[2], enabled);
        type.setIconIndex(cfgType[4] ? cfgType[4] : null);
        typesArray.push(type);
    }
    return typesArray;
};

SkillDataType.prototype.setIconIndex = function(iconIndex) {
    this._iconIndex = iconIndex;
};

SkillDataType.prototype.iconIndex = function() {
    return this._iconIndex;
};

Window_TypeSelect.prototype.drawItem = function(index) {
    let rect;
    if (Utils.RPGMAKER_NAME === "MZ") {
        rect = this.itemLineRect(index);
    } else {
        rect = this.itemRectForText(index);
    }
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    const iconIndex = this._types[index].iconIndex();
    if (iconIndex) {
        this.drawItemName({ name: this.commandName(index), iconIndex: iconIndex }, rect.x, rect.y);
    } else {
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, this.itemTextAlign());
    }
};

Scene_SkillTree.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    if (BackgroundImage.FileName) {
        const bitmap1 = ImageManager.loadBitmap("img/", BackgroundImage.FileName);
        this._backgroundSprite.bitmap = bitmap1;
        const sprite = new Sprite();
        sprite.x = BackgroundImage.BackgroundImage2XOfs;
        sprite.y = BackgroundImage.BackgroundImage2YOfs;
        this._backgroundSprite.addChild(sprite);
        this._backgroundSprite2 = sprite;
        this.addChild(this._backgroundSprite);
    } else {
        this._backgroundFilter = new PIXI.filters.BlurFilter();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this.addChild(this._backgroundSprite);
        this.setBackgroundOpacity(192);
    }
};

Scene_SkillTree.prototype.getBackgroundImage2 = function(actorId) {
    const img2 = BackgroundImage.BackgroundImage2.find(img2 => img2.ActorId === actorId);
    if (img2) return ImageManager.loadBitmap("img/", img2.FileName);
    return null;
};

const _Scene_SkillTree_updateActor = Scene_SkillTree.prototype.updateActor;
Scene_SkillTree.prototype.updateActor = function() {
    _Scene_SkillTree_updateActor.call(this);
    this.updateBackgroundImage2();
};

Scene_SkillTree.prototype.updateBackgroundImage2 = function() {
    if (!this._backgroundSprite2) return;
    const backgroundImage2 = this.getBackgroundImage2($gameParty.menuActor().actorId());
    if (backgroundImage2) this._backgroundSprite2.bitmap = backgroundImage2;
};

})();
