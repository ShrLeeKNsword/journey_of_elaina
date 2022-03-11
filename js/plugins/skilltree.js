/*:
@target MV MZ
@plugindesc 技能树系统 v1.6.2
@author うなぎおおとろ/<译>公孖。狼
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SkillTree.js

@param SpName
@type string
@default SP
@desc
指定游戏中SP的表达语句.

@param MaxSp
@type number
@default 9999
@desc
设定SP上限最大值.

@param EnabledSkillTreeSwitchId
@type switch
@default 0
@desc
通过ID指令设定技能树有效/无效的开关,决定是否在菜单选项中开启技能树功能.若指定为0则通常在选项菜单显示技能树.

@param EnableGetSpWhenBattleEnd
@type boolean
@default true
@desc
设定为true的话,战斗结束时将会获得SP奖赏.

@param EnableGetSpWhenLevelUp
@type boolean
@default true
@desc
设定为true的话,等级提升时将会获得SP奖赏.

@param ViewMode
@type string
@default wide
@desc
设定为wide则,横向展开技能树.设定为long则,纵向展开技能树.

@param EnableMZLayout
@type boolean
@default false
@desc
设定为true的话,将会与MZ的官方布局形式完美契合.(MZ限定)

@param IconWidth
@type number
@default 32
@desc
设定图标的横向宽度.

@param IconHeight
@type number
@default 32
@desc
设定图标的纵向宽度.

@param IconSpaceWidth
@type number
@default 32
@desc
设定图标间横向间隔宽度.

@param IconSpaceHeight
@type number
@default 32
@desc
设定图标间纵向间隔宽度.

@param ViewLineWidth
@type number
@default 3
@desc
设定线框粗细.

@param ViewLineColorBase
@type string
@default #000000
@desc
设定未取得技能的线框颜色.

@param ViewLineColorLearned
@type string
@default #00aaff
@desc
设定已取得技能的线框颜色.

@param ViewBeginXOffset
@type number
@default 24
@desc
设定技能树展示的起始X坐标.

@param ViewBeginYOffset
@type number
@default 24
@desc
设定技能树展示的起始Y坐标.

@param ViewCursorOfs
@type number
@default 6
@desc
设定光标相对于技能树图标的坐标偏移.

@param ViewRectColor
@type string
@default #ffff00
@desc
设定包裹着已取得技能图标的线框颜色.

@param ViewRectOfs
@type number
@default 1
@desc
设定围绕已取得技能图标的线框或线框UI图片的坐标偏移.

@param LearnSkillSeFileName
@type file
@dir audio/se
@default Item3
@desc
设定习得技能时播放的SE音效文件名.

@param LearnSkillSeVolume
@type number
@default 90
@desc
设定习得技能时所播放SE音效音量.

@param LearnSkillSePitch
@type number
@default 100
@desc
设定习得技能时所播放SE音效音高.

@param LearnSkillSePan
@type number
@default 0
@desc
设定习得技能时所播放SE音效的平移.

@param MenuSkillTreeText
@type string
@default 技能树
@desc
菜单选项中显示技能树功能选项时,在此可以自定义名称.

@param NeedSpText
@type string
@default 必要%1:
@desc
设定技能未取得前在技能树窗口显示其所需SP数值.%1:SP名

@param OpenedNodeText
@type string
@default 已习得
@desc
设定技能取得后,原本显示所需SP文字替换为已习得.

@param NodeOpenConfirmationText
@type string
@default 扣除%1%2学习%3么?
@desc
为了让玩家切实感受技能是否习得,设定学习技能时出现的公屏文字.%1:SP消耗值, %2:SP名, %3:习得技能名

@param NodeOpenYesText
@type string
@default 学习
@desc
为了让玩家学习技能保留主动权,选择学习技能时显示文字.

@param NodeOpenNoText
@type string
@default 不学
@desc
为了让玩家学习技能保留主动权,选择不学习技能时显示文字.

@param BattleEndGetSpText
@type string
@default %1%2已入手.
@desc
设定战斗结束后获取SP值时出现的公屏文字.%1:SP入手值, %2:SP名

@param LevelUpGetSpText
@type string
@default %1%2已入手.
@desc
设定等级提升时获取SP值出现的公屏文字.%1:SP入手值, %2:SP名

@help
此为技能树导入插件.
关于具体设定方法,请参照「SkillTreeConfig.js」进行参数配置.

[许可]
本插件、可在遵循MIT许可协议下自由使用.
*/

const SkillTreePluginName = document.currentScript.src.match(/.+\/(.+)\.js/)[1];
let $skillTreeData = null;
let $skillTreeConfigLoader = null;
const $skillTreeMapLoaders = {};

const skt_open = (actorId) => {
    $gameParty.setMenuActor($gameActors.actor(actorId));
    SceneManager.push(SkillTreeClassAlias.Scene_SkillTree);
};

const skt_gainSp = (actorId, value) => {
    const actor = $gameParty.members().find(actor => actor.actorId() === actorId);
    if (actor) actor.gainSp(value);
};

const skt_skillReset = (actorId) => {
    const totalSp = $skillTreeData.totalSpAllTypes(actorId);
    $skillTreeData.skillResetAllTypes(actorId);
    $skillTreeData.gainSp(actorId, totalSp);
};

const skt_totalSp = (actorId, variableId) => {
    const totalSp = $skillTreeData.totalSpAllTypes(actorId);
    $gameVariables.setValue(variableId, totalSp)
};

const skt_enableType = (actorId, typeName) => {
    const types = $skillTreeData.types(actorId);
    let targetType = null;
    for (const type of types) {
        if (type.skillTreeName() === typeName) {
            targetType = type;
        }
    }
    if (!targetType) return;
    targetType.setEnabled(true);
}

const skt_disableType = (actorId, typeName) => {
    const types = $skillTreeData.types(actorId);
    let targetType = null;
    for (const type of types) {
        if (type.skillTreeName() === typeName) {
            targetType = type;
        }
    }
    if (!targetType) return;
    targetType.setEnabled(false);
}

const skt_migrationType = (actorId, fromTypeName, toTypeName, reset) => {
    let dstType = null;
    let srcType = null;
    const types = $skillTreeData.types(actorId);
    for (const type of types) {
        if (type.skillTreeName() === fromTypeName) {
            srcType = type;
        } else if (type.skillTreeName() === toTypeName) {
            dstType = type;
        }
    }
    if (!dstType || !srcType) return;
    srcType.setEnabled(false);
    dstType.setEnabled(true);
    if (reset) {
        const resetSp = $skillTreeData.totalSp(srcType);
        $skillTreeData.skillReset(srcType);
        $skillTreeData.gainSp(actorId, resetSp);
    } else {
        $skillTreeData.copyTree(dstType, srcType);
        $skillTreeData.skillReset(srcType);
    }
};

const SkillTreeClassAlias = (() => {
"use strict";

const params = PluginManager.parameters(SkillTreePluginName);
const SpName = params["SpName"];
const MaxSp = parseInt(params["MaxSp"]);

const EnableGetSpWhenBattleEnd = (params["EnableGetSpWhenBattleEnd"] === "true" ? true : false);
const EnableGetSpWhenLevelUp = (params["EnableGetSpWhenLevelUp"] === "true" ? true : false);
const EnabledSkillTreeSwitchId = parseInt(params["EnabledSkillTreeSwitchId"]);
const EnableMZLayout = (params["EnableMZLayout"] === "true" ? true : false);

const ViewMode = params["ViewMode"];
const IconWidth = parseInt(params["IconWidth"]);
const IconHeight = parseInt(params["IconHeight"]);
const IconSpaceWidth = parseInt(params["IconSpaceWidth"]);
const IconSpaceHeight = parseInt(params["IconSpaceHeight"]);
const ViewLineWidth = parseInt(params["ViewLineWidth"]);
const ViewLineColorBase = params["ViewLineColorBase"];
const ViewLineColorLearned = params["ViewLineColorLearned"];
const ViewBeginXOffset = parseInt(params["ViewBeginXOffset"]);
const ViewBeginYOffset = parseInt(params["ViewBeginYOffset"]);
const ViewCursorOfs = parseInt(params["ViewCursorOfs"]);
const ViewRectOfs = parseInt(params["ViewRectOfs"]);
const ViewRectColor = params["ViewRectColor"];

const LearnSkillSeFileName = params["LearnSkillSeFileName"];
const LearnSkillSeVolume = parseInt(params["LearnSkillSeVolume"]);
const LearnSkillSePitch = parseInt(params["LearnSkillSePitch"]);
const LearnSkillSePan = parseInt(params["LearnSkillSePan"]);

const MenuSkillTreeText = params["MenuSkillTreeText"];
const NeedSpText = params["NeedSpText"];
const OpenedNodeText = params["OpenedNodeText"];
const NodeOpenConfirmationText = params["NodeOpenConfirmationText"];
const NodeOpenYesText = params["NodeOpenYesText"];
const NodeOpenNoText = params["NodeOpenNoText"];
const BattleEndGetSpText = params["BattleEndGetSpText"];
const LevelUpGetSpText = params["LevelUpGetSpText"];

class HttpResponse {
    constructor(result, xhr, event) {
        this._result = result;
        this._xhr = xhr;
        this._event = event;
    }

    result() {
        return this._result;
    }

    status() {
        return this._xhr.status;
    }

    response() {
        return this._xhr.response;
    }
}

class HttpRequest {
    static get(path, opt, responseCallback) {
        const req = new HttpRequest(path, "GET", opt, responseCallback);
        req.send();
        return req;
    }

    static post(path, params, opt, responseCallback) {
        const req = new HttpRequest(path, "POST", opt, responseCallback);
        req.send(params);
        return req;
    }

    constructor(path, method, opt, responseCallback) {
        this._path = path;
        this._method = method;
        this._responseCallback = responseCallback;
        this._mimeType = opt.mimeType;
    }

    send(params = null) {
        const xhr = new XMLHttpRequest();
        xhr.open(this._method, this._path);
        if (this._mimeType) xhr.overrideMimeType(this._mimeType);
        let json = null;
        if (params) json = JSON.stringify(params);
        xhr.addEventListener("load", (e) => {
            this._responseCallback(new HttpResponse("load", xhr, e));
        });
        xhr.addEventListener("error", (e) => {
            this._responseCallback(new HttpResponse("error", xhr, e));
        });
        xhr.send(json);
    }
}

class SkillTreeNodeInfo {
    constructor(actorId, skillId, needSp, iconData, helpMessage) {
        this._actorId = actorId;
        this._skillId = skillId;
        this._needSp = needSp;
        this._iconData = iconData;
        this._helpMessage = helpMessage;
    }

    actor() {
        const actor = $gameActors.actor(this._actorId);
        if (!actor) throw new Error(`actor id: ${this._actorId} is not found.`)
        return actor;
    }

    skill() {
        const skill = $dataSkills[this._skillId];
        if (!skill) throw new Error(`skill id: ${this._skillId} is not found.`)
        return skill;
    }

    canLearn(nowSp) {
        return nowSp >= this._needSp;
    }

    learnSkill() {
        this.actor().learnSkill(this._skillId);
    }

    forgetSkill() {
        this.actor().forgetSkill(this._skillId);
    }

    trimIconset(iconIndex) {
        const srcBitmap = ImageManager.loadSystem("IconSet");
        const dstBitmap = new Bitmap(32, 32);
        const sx = iconIndex % 16 * 32;
        const sy = Math.floor(iconIndex / 16) * 32;
        dstBitmap.blt(srcBitmap, sx, sy, 32, 32, 0, 0);
        return dstBitmap;
    }

    iconBitmap() {
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
        }
        throw new Error(`Unknown ${this._iconData[0]}`);
    }

    needSp() {
        return this._needSp;
    }

    helpMessage() {
        return this._helpMessage;
    }
}

class SkillTreeNode {
    constructor(tag) {
        this._tag = tag
        this._parents = [];
        this._childs = [];
        this._info = null;
        this._opened = false;
        this._point = null;
        this._reservedPoint = null;
    }

    get point() { return this._point; }
    set point(_point) { this._point = _point; }

    tag() {
        return this._tag;
    }

    info() {
        return this._info;
    }

    reservedPoint() {
        return this._reservedPoint;
    }

    setReservedPoint(point) {
        this._reservedPoint = point;
    }

    parents() {
        return this._parents;
    }

    childs() {
        return this._childs;
    }

    getAllChilds() {
        let allChilds = [this];
        for (const child of this._childs) {
            allChilds = allChilds.concat(child.getAllChilds());
        }
        return allChilds;
    }

    parent(index) {
        if (index < 0) index = this._parents.length - index;
        return this._parents[index % this._parents.length];
    }

    child(index) {
        if (index < 0) index = this._childs.length - index;
        return this._childs[index % this._childs.length];
    }

    addChild(child) {
        if (!child) throw new Error("child is none.");
        child._parents.push(this);
        this._childs.push(child);
    }

    setup(info) {
        this._info = info;
    }

    isOpenable(nowSp) {
        return this.isSelectable() && !this.isOpened() && this._info.canLearn(nowSp);
    }

    isSelectable() {
        for (const parent of this._parents) {
            if (!parent.isOpened()) return false;
        }
        return true;
    }

    isOpened() {
        return this._opened;
    }

    setOpenedStatus(openStatus) {
        this._opened = openStatus;
    }

    open() {
        this._info.learnSkill();
        this._opened = true;
    }

    close() {
        this._info.forgetSkill();
        this._opened = false;
    }

    clearPointNode() {
        this.point = null;
        if (this._childs.length === 0) return;
        for (const child of this._childs) {
            child.clearPointNode();
        }
    }

    makePointNode(x, y, mode) {
        if (this.reservedPoint()) {
            this.point = this.reservedPoint();
            x = this.reservedPoint().x;
            y = this.reservedPoint().y;
        } else {
            if (this.point) {
                if (mode === "wide") {
                    if (x < this.point.x) {
                        this.point = { x: this.point.x, y: y };
                    } else {
                        this.point = { x: x, y: this.point.y };
                    }
                } else if (mode === "long") {
                    if (y < this.point.y) {
                        this.point = { x: x, y: this.point.y };
                    } else {
                        this.point = { x: this.point.x, y: y };
                    }
                }
            } else {
                this.point = { x: x, y: y };
            }
        }
        if (this._childs.length === 0) return 1;
        if (mode === "wide") {
            let yOfs = 0;
            for (const child of this._childs) {
                yOfs += child.makePointNode(x + 1, y + yOfs, mode);
            }
            return yOfs;
        } else if (mode === "long") {
            let xOfs = 0;
            for (const child of this._childs) {
                xOfs += child.makePointNode(x + xOfs, y + 1, mode);
            }
            return xOfs;
        }
    }

    needSp() {
        return this._info.needSp();
    }

    iconBitmap() {
        return this._info.iconBitmap();
    }

    helpMessage() {
        return this._info.helpMessage();
    }
}

class SkillTreeTopNode extends SkillTreeNode {
    constructor() {
        super(null);
        this._opened = true;
        const dummyInfo = new SkillTreeNodeInfo(null, null, 0, 0, "");
        this.setup(dummyInfo);
    }

    getAllChilds() {
        let allChilds = [];
        for (const child of this._childs) {
            allChilds = allChilds.concat(child.getAllChilds());
        }
        return allChilds;
    }

    skillReset() {
        for (const child of this._childs) {
            if (child.isOpened()) child.skillReset();
        }
    }
}

class SkillDataType {
    constructor(skillTreeName, actorId, message, helpMessage, enabled) {
        this._skillTreeName = skillTreeName;
        this._actorId = actorId;
        this._message = message;
        this._helpMessage = helpMessage;
        this._enabled = enabled;
    }

    message() {
        return this._message;
    }

    skillTreeName() {
        return this._skillTreeName;
    }

    skillTreeTag() {
        return `${this._skillTreeName}_actorId${this._actorId}`;
    }

    helpMessage() {
        return this._helpMessage;
    }

    enabled() {
        return this._enabled;
    }

    setEnabled(enabled) {
        this._enabled = enabled;
    }
}

class SkillTreeMapLoader {
    constructor(mapId) {
        this._mapId = mapId;
        this._mapData = null;
    }

    applyMapData(type) {
        const allNodes = $skillTreeData.getAllNodesByType(type);
        for (const eventData of this.mapData().events) {
            if (!eventData) continue;
            let nodeTag = eventData.note;
            let node = allNodes[nodeTag];
            if (!node) continue;
            node.setReservedPoint({ x: eventData.x, y: eventData.y });
        }
    }

    isLoaded() {
        return this._response;
    }

    mapData() {
        return JSON.parse(this._response);
    }

    loadMap() {
        const fileName = "Map%1.json".format(this._mapId.padZero(3));
        this.loadData(fileName);
    }

    loadData(fileName) {
        HttpRequest.get(`data/${fileName}`, { mimeType: "application/json" }, (res) => {
            if (res.result() === "error") {
                throw new Error(`Unknow file: ${fileName}`);
            } else if (res.status() === 200) {
                this._response = res.response();
            } else {
                throw new Error(`Load failed: ${fileName}`);
            }
        });
    }
}

class SkillTreeConfigLoadError extends Error {}

class SkillTreeConfigLoader {
    constructor() {
        this._configData = loadSkillTreeConfig();
    }

    configData() {
        return this._configData;
    }

    loadConfig(actorId) {
        let types = $skillTreeData.types(actorId);
        if (!types) {
            types = this.loadTypes(actorId);
            $skillTreeData.setTypes(actorId, types);
        }
        for (const type of types) {
            let topNode = $skillTreeData.topNode(type);
            if (!topNode) {
                topNode = this.loadSkillTreeNodes(type);
                $skillTreeData.setTopNode(type, topNode);
                this.loadSkillTreeInfo(actorId, $skillTreeData.getAllNodesByType(type));
            }
        }
    }

    loadTypes(actorId) {
        let cfgTypes = null;
        let typesArray = [];
        for (const cfg of this._configData.skillTreeTypes) {
            if (cfg.actorId === actorId) {
                cfgTypes = cfg.types;
                break;
            }
        }
        if (!cfgTypes) throw new SkillTreeConfigLoadError(`Missing types from actorId:${actorId}`);
        for (const cfgType of cfgTypes) {
            const enabled = (cfgType.length === 3 ? true : cfgType[3]);
            typesArray.push(new SkillDataType(cfgType[0], actorId, cfgType[1], cfgType[2], enabled));
        }
        return typesArray;
    }

    loadSkillTreeNodes(type) {
        const nodes = {};
        let derivative = null;
        for (const skillTreeType in this._configData.skillTreeDerivative) {
            if (skillTreeType === type.skillTreeName()) {
                derivative = this._configData.skillTreeDerivative[skillTreeType];
                break;
            }
        }
        if (!derivative) throw new SkillTreeConfigLoadError(`Missing skill type name ${type.skillTreeName()}`);
        for (const data of derivative) {
            const nodeTag = data[0];
            nodes[nodeTag] = new SkillTreeNode(nodeTag);
        }
        for (const data of derivative) {
            const nodeTag = data[0];
            if (data.length >= 2) {
                const childsTag = data[1];
                for (const childTag of childsTag) {
                    if (!nodes[childTag]) throw new SkillTreeConfigLoadError(`Unknow derivative ${childTag}`);
                    nodes[nodeTag].addChild(nodes[childTag]);
                }
            }
        }
        const topNode = new SkillTreeTopNode();
        for (const node of Object.values(nodes)) {
            if (node.parents().length === 0) topNode.addChild(node);
        }
        if (topNode.length === 0) throw new SkillTreeConfigLoadError(`Missing top nodes`);
        return topNode;
    }

    loadSkillTreeInfo(actorId, allNodes) {
        for (const cfgInfoKey in this._configData.skillTreeInfo) {
            const cfgInfo = this._configData.skillTreeInfo[cfgInfoKey];
            const nodeTag = cfgInfo[0];
            const node = allNodes[nodeTag];
            if (!node) continue;
            const skillId = cfgInfo[1];
            const needSp = cfgInfo[2];
            let iconData = ["icon"];
            if (cfgInfo.length >= 4) iconData = cfgInfo[3];
            let helpMessage = "";
            if (cfgInfo.length >= 5) helpMessage = cfgInfo[4];
            const info = new SkillTreeNodeInfo(actorId, skillId, needSp, iconData, helpMessage);
            node.setup(info);
        }
        for (const node of Object.values(allNodes)) {
            if (!node.info()) throw new SkillTreeConfigLoadError(`Node ${node.tag()} is missing node info`);
        }
    }
}

class SkillTreeData {
    constructor() {
        this._actorSp = {};
        this._topNodes = {};
        this._allTypes = {};
    }

    actorIds() {
        return Object.keys(this._actorSp);
    }

    sp(actorId) {
        return this._actorSp[actorId];
    }

    setSp(actorId, sp) {
        this._actorSp[actorId] = sp;
    }

    gainSp(actorId, sp) {
        const nowSp = this.sp(actorId);
        this.setSp(actorId, nowSp + sp);
    }

    topNode(type) {
        return this._topNodes[type.skillTreeTag()];
    }

    setTopNode(type, topNode) {
        this._topNodes[type.skillTreeTag()] = topNode;
    }

    types(actorId) {
        return this._allTypes[actorId];
    }

    enableTypes(actorId) {
        return this.types(actorId).filter((type) => type.enabled());
    }

    setTypes(actorId, types) {
        this._allTypes[actorId] = types;
    }

    totalSp(type) {
        let resetSp = 0;
        for (const node of Object.values(this.getAllNodesByType(type))) {
            if (node.isOpened()) resetSp += node.needSp();
        }
        return resetSp;
    }

    skillReset(type) {
        for (const node of Object.values(this.getAllNodesByType(type))) {
            if (node.isOpened()) node.close();
        }
    }

    totalSpAllTypes(actorId) {
        let resetSp = 0;
        for (const type of this.enableTypes(actorId)) {
            resetSp += this.totalSp(type);
        }
        return resetSp;
    }

    skillResetAllTypes(actorId) {
        for (const type of this.enableTypes(actorId)) {
            this.skillReset(type);
        }
    }

    copyTree(dstType, srcType) {
        const dst = this.getAllNodesByType(dstType);
        const src = this.getAllNodesByType(srcType);
        for (const tag in src) {
            const srcNode = src[tag];
            const dstNode = dst[tag];
            if (srcNode && dstNode && srcNode.isOpened()) {
                srcNode.close();
                dstNode.open();
            }
        }
    }

    makePoint(type, mode) {
        this.topNode(type).clearPointNode();
        // Start point is -1 because first node is dummy. 
        if (mode === "wide") {
            this.topNode(type).makePointNode(-1, 0, mode);
        } else if (mode === "long") {
            this.topNode(type).makePointNode(0, -1, mode);
        } else {
            throw new Error(`Unknown ${ViewMode}`);
        }
    }

    getAllNodesByType(type) {
        const nodes = {};
        for (const node of this.topNode(type).getAllChilds()) {
            nodes[node.tag()] = node; 
        }
        return nodes;
    }

    makeSaveContents() {
        let contents = {};
        for (const actorId of this.actorIds()) {
            contents[actorId] = { sp: this.sp(actorId) };
            for (const type of this.types(actorId)) {
                const openedStatus = {};
                const nodes = this.getAllNodesByType(type);
                for (const tag in nodes) {
                    openedStatus[tag] = nodes[tag].isOpened();
                }
                contents[type.skillTreeTag()] = {
                    enabled: type.enabled(),
                    openedStatus: openedStatus,
                };
            }
        }
        return contents;
    }

    loadSaveContents(contents) {
        for (let actorId = 1; actorId < $dataActors.length; actorId++) {
            if (!contents[actorId]) continue;
            $skillTreeConfigLoader.loadConfig(actorId);
            this.setSp(actorId, contents[actorId].sp);
            for (const type of this.types(actorId)) {
                type.setEnabled(contents[type.skillTreeTag()].enabled);
                const nodes = this.getAllNodesByType(type);
                for (const tag in nodes) {
                    nodes[tag].setOpenedStatus(contents[type.skillTreeTag()].openedStatus[tag]);
                }
            }
        }
    }
}

class SkillTreeManager {
    constructor() {
        this.reset();
    }

    reset() {
        this._actorId = null;
        this._type = null;
        this._selectNode = null;
    }

    topNode() {
        return $skillTreeData.topNode(this._type);
    }

    selectTopNode(topNode) {
        this.select(topNode.child(0));
    }

    type() {
        return this._type;
    }

    actorId() {
        return this._actorId;
    }

    setType(type) {
        this._type = type;
    }

    setActorId(actorId) {
        this._actorId = actorId;
    }

    selectNode() {
        if (!this._selectNode) throw new Error("selectNode is null");
        return this._selectNode;
    }

    changeChildNode() {
        const nextNode = this._selectNode.child(0);
        if (nextNode) {
            this._selectNode = nextNode;
            return true;
        }
        return false;
    }

    changeParentNode() {
        const nextNode = this._selectNode.parent(0);
        if (nextNode && !(nextNode instanceof SkillTreeTopNode)) {
            this._selectNode = nextNode;
            return true;
        }
        return false;
    }

    changeNextNode() {
        parent = this._selectNode.parent(0);
        if (!parent) throw new Error("Unknown parent");
        const i = parent.childs().indexOf(this._selectNode);
        const nextNode = parent.child(i + 1);
        if (nextNode !== this._selectNode) {
            this._selectNode = nextNode;
            return true;
        }
        return false;
    }

    changePrevNode() {
        parent = this._selectNode.parent(0);
        if (!parent) throw new Error("Unknown parent");
        const i = parent.childs().indexOf(this._selectNode);
        const nextNode = parent.child(i - 1);
        if (nextNode !== this._selectNode) {
            this._selectNode = nextNode;
            return true;
        }
        return false;
    }

    maxXY() {
        let maxX = 0;
        let maxY = 0;
        const nodes = this.getAllNodes();
        for (const node of Object.values(nodes)) {
            const x = node.point.x;
            const y = node.point.y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }
        return [maxX, maxY];
    }

    searchNode(xWay, yWay) {
        const nodes = Object.values(this.getAllNodes());
        if (xWay !== 0) {
            let candidates = nodes.filter(node => node.point.y === this._selectNode.point.y);
            if (candidates.length === 0) {
                return null;
            } else if (xWay === 1) {
                candidates = candidates.filter(node => node.point.x > this._selectNode.point.x)
                const fars = candidates.map(candidate => candidate.point.x - this._selectNode.point.x);
                const i = fars.indexOf(Math.min(...fars))
                return candidates[i];
            } else if (xWay === -1) {
                candidates = candidates.filter(node => node.point.x < this._selectNode.point.x)
                const fars = candidates.map(candidate => candidate.point.x - this._selectNode.point.x);
                const i = fars.indexOf(Math.max(...fars))
                return candidates[i];
            }
        } else if (yWay !== 0) {
            let candidates = nodes.filter(node => node.point.x === this._selectNode.point.x);
            if (candidates.length === 0) {
                return null;
            } else if (yWay === 1) {
                candidates = candidates.filter(node => node.point.y > this._selectNode.point.y)
                const fars = candidates.map(candidate => candidate.point.y - this._selectNode.point.y);
                const i = fars.indexOf(Math.min(...fars))
                return candidates[i];
            } else if (yWay === -1) {
                candidates = candidates.filter(node => node.point.y < this._selectNode.point.y)
                const fars = candidates.map(candidate => candidate.point.y - this._selectNode.point.y);
                const i = fars.indexOf(Math.max(...fars))
                return candidates[i];
            }
        }
    }

    right() {
        const node = this.searchNode(1, 0);
        if (node) {
            this._selectNode = node;
            return true;
        }
        if (ViewMode === "wide") {
            return this.changeChildNode();
        } else if (ViewMode === "long") {
            return this.changeNextNode();
        }
    }

    left() {
        const node = this.searchNode(-1, 0);
        if (node) {
            this._selectNode = node;
            return true;
        }
        if (ViewMode === "wide") {
            return this.changeParentNode();
        } else if (ViewMode === "long") {
            return this.changePrevNode();
        }
    }

    up() {
        const node = this.searchNode(0, -1);
        if (node) {
            this._selectNode = node;
            return true;
        }
        if (ViewMode === "wide") {
            return this.changePrevNode();
        } else if (ViewMode === "long") {
            return this.changeParentNode();
        }
    }

    down() {
        const node = this.searchNode(0, 1);
        if (node) {
            this._selectNode = node;
            return true;
        }
        if (ViewMode === "wide") {
            return this.changeNextNode();
        } else if (ViewMode === "long") {
            return this.changeChildNode();
        }
    }

    select(node) {
        if (node !== this._selectNode) {
            this._selectNode = node;
            return true;
        }
        return false;
    }

    isSelectNodeOpenable() {
        return this._selectNode.isOpenable($skillTreeData.sp(this._actorId));
    }

    selectNodeOpen() {
        this._selectNode.open();
        $skillTreeData.gainSp(this._actorId, -this._selectNode.needSp());
    }

    makePoint() {
        $skillTreeData.makePoint(this._type, ViewMode);
    }

    getAllNodes() {
        return $skillTreeData.getAllNodesByType(this._type);
    }
}

class Scene_SkillTree extends Scene_MenuBase {
    create() {
        super.create();
        this._skillTreeManager = new SkillTreeManager($skillTreeData);
        this.updateActor();
        this.createHelpWindow();
        this.createActorInfoWindow();
        this.createTypeSelectWindow();
        this.updateSkillTree();
        this.createSkillTreeNodeInfo();
        this.createSKillTreeWindow();
        this.createNodeOpenWindow();
        this.applyMapDatas();
    }

    isReady() {
        if (!super.isReady()) return false;
        for (const actor of $gameParty.members()) {
            const faceImage = ImageManager.loadFace(actor.faceName());
            if (!faceImage.isReady()) return false;
        }
        // Do not use flatMap because some browsers do not support it.
        for (const actor of $gameParty.members()) {
            for (const type of $skillTreeData.types(actor.actorId())) {
                for (const node of Object.values($skillTreeData.getAllNodesByType(type))) {
                    if (!node.iconBitmap().isReady()) return false;
                }
            }
        }
        return true;
    }

    start() {
        super.start();
        this._windowTypeSelect.showHelpWindow();
        this._windowTypeSelect.refresh();
        this._windowTypeSelect.open();
        this._windowTypeSelect.activate();
        this._windowTypeSelect.show();
        this._windowActorInfo.refresh();
        this._windowActorInfo.open();
        this._windowActorInfo.show();
        this._windowSkillTree.refresh();
        this._windowSkillTree.open();
        this._windowSkillTree.show();
        this._windowSkillTreeNodeInfo.refresh();
        this._windowNodeOpen.refresh();
    }

    applyMapDatas() {
        for (const skillTreeName in $skillTreeMapLoaders) {
            for (const actorId of $skillTreeData.actorIds()) {
                const mapLoader = $skillTreeMapLoaders[skillTreeName];
                const type = $skillTreeData.types(actorId).find(t => t.skillTreeName() === skillTreeName);
                if (!type) continue;
                mapLoader.applyMapData(type);
            }
        }
    }

    createTypeSelectWindow() {
        this._windowTypeSelect = new Window_TypeSelect(this.typeSelectWindowRect(), this.getSkillTreeTypes());
        this.typeSelectWindowSetupHandlers();
        this._windowTypeSelect.close();
        this._windowTypeSelect.deactivate();
        this._windowTypeSelect.hideHelpWindow();
        this._windowTypeSelect.hide();
        this.addWindow(this._windowTypeSelect);
    }

    resetTypeSelectWindow() {
        this._windowTypeSelect.reset(this.getSkillTreeTypes());
        this.typeSelectWindowSetupHandlers();
        this._windowTypeSelect.refresh();
        this._windowTypeSelect.deactivate();
        this._windowTypeSelect.hideHelpWindow();
        this._windowTypeSelect.show();
    }

    typeSelectWindowSetupHandlers() {
        this._windowTypeSelect.setHandler("cancel", this.typeCancel.bind(this));
        this._windowTypeSelect.setHandler("select", this.updateSkillTree.bind(this));
        this._windowTypeSelect.setHandler("pagedown", this.nextActor.bind(this));
        this._windowTypeSelect.setHandler("pageup", this.previousActor.bind(this));
        this._windowTypeSelect.setHelpWindow(this._helpWindow);
        for (let i = 0; i < this.getSkillTreeTypes().length; i++) {
            this._windowTypeSelect.setHandler(`type${i}`, this.typeOk.bind(this));
        }
    }

    createActorInfoWindow() {
        this._windowActorInfo = new Window_ActorInfo(this.actorInfoWindowRect(), this.actor().actorId());
        this._windowActorInfo.close();
        this._windowActorInfo.deactivate();
        this._windowActorInfo.hide();
        this.addWindow(this._windowActorInfo);
    }

    resetActorInfoWindow() {
        this._windowActorInfo.reset(this.actor().actorId());
        this._windowActorInfo.refresh();
        this._windowActorInfo.deactivate();
        this._windowActorInfo.show();
    }

    createSkillTreeNodeInfo() {
        this._windowSkillTreeNodeInfo = new Window_SkillTreeNodeInfo(this.skillTreeNodeInfoWindowRect(), this._skillTreeManager);
        this._windowSkillTreeNodeInfo.close();
        this._windowSkillTreeNodeInfo.deactivate();
        this._windowSkillTreeNodeInfo.hide();
        this.addWindow(this._windowSkillTreeNodeInfo);
    }

    createSKillTreeWindow() {
        this._windowSkillTree = new Window_SkillTree(this.skillTreeWindowRect(),
                                                        this._skillTreeManager,
                                                        this._windowTypeSelect,
                                                        this._windowSkillTreeNodeInfo);
        this._windowSkillTree.setHandler("ok", this.skillTreeOk.bind(this));
        this._windowSkillTree.setHandler("cancel", this.skillTreeCance.bind(this));
        this._windowSkillTree.setHelpWindow(this._helpWindow);
        this._windowSkillTree.deactivate();
        this._windowSkillTree.hideHelpWindow();
        this._windowSkillTree.hide();
        this.addWindow(this._windowSkillTree);
    }

    createNodeOpenWindow() {
        this._windowNodeOpen = new Window_NodeOpen(this.nodeOpenWindowRect(), this._skillTreeManager);
        this._windowNodeOpen.setHandler("yes", this.nodeOpenOk.bind(this));
        this._windowNodeOpen.setHandler("no", this.nodeOpenCancel.bind(this));
        this._windowNodeOpen.setHandler("cancel", this.nodeOpenCancel.bind(this));
        this._windowNodeOpen.close();
        this._windowNodeOpen.deactivate();
        this._windowNodeOpen.hide();
        this.addWindow(this._windowNodeOpen);
    }

    isBottomHelpMode() {
        if (Utils.RPGMAKER_NAME === "MZ" && EnableMZLayout) return super.isBottomHelpMode();
        return false;
    }

    isBottomButtonMode() {
        if (Utils.RPGMAKER_NAME === "MZ" && EnableMZLayout) return super.isBottomButtonMode();
        return false;
    }

    isRightInputMode() {
        if (Utils.RPGMAKER_NAME === "MZ" && EnableMZLayout) return super.isRightInputMode();
        return false;
    }

    buttonAreaTop() {
        if (Utils.RPGMAKER_NAME === "MZ") return super.buttonAreaTop();
        return this.isBottomButtonMode() ? Graphics.boxHeight : 0;
    }

    buttonAreaHeight() {
        if (Utils.RPGMAKER_NAME === "MZ") return super.buttonAreaHeight();
        return 0;
    }

    mainCommandWidth() {
        if (Utils.RPGMAKER_NAME === "MZ") return super.mainCommandWidth();
        return 240;
    }

    helpWindowRect() {
        if (Utils.RPGMAKER_NAME === "MZ") return super.helpWindowRect();
        return new Rectangle(this._helpWindow.x, this._helpWindow.y, this._helpWindow.width, this._helpWindow.height);
    }

    typeSelectWindowRect() {
        const actorInfoWindowRect = this.actorInfoWindowRect();
        const x = actorInfoWindowRect.x;
        const w = actorInfoWindowRect.width;
        let y;
        if (this.isBottomHelpMode()) {
            if (this.isBottomButtonMode()) {
                y = 0;
            } else {
                y = this.buttonAreaBottom();
            }
        } else if (this.isBottomButtonMode()) {
            const helpWindowRect = this.helpWindowRect();
            y = helpWindowRect.y + helpWindowRect.height;
        } else {
            const helpWindowRect = this.helpWindowRect();
            y = helpWindowRect.y + helpWindowRect.height;
        }
        const h = actorInfoWindowRect.y - y;
        return new Rectangle(x, y, w, h);
    }

    actorInfoWindowRect() {
        const skillTreeNodeInfoWindowRect = this.skillTreeNodeInfoWindowRect();
        const x = skillTreeNodeInfoWindowRect.x;
        const w = skillTreeNodeInfoWindowRect.width;
        const h = 200;
        const y = skillTreeNodeInfoWindowRect.y - h;
        return new Rectangle(x, y, w, h);
    }

    skillTreeNodeInfoWindowRect() {
        const w = this.mainCommandWidth();
        let x;
        if (this.isRightInputMode()) {
            x = Graphics.boxWidth - w;
        } else {
            x = 0;
        }
        const h = 110;
        let y;
        if (this.isBottomHelpMode()) {
            const helpWindowRect = this.helpWindowRect();
            y = helpWindowRect.y - h;
        } else {
            if (this.isBottomButtonMode()) {
                y = this.buttonAreaTop() - h;
            } else {
                y = Graphics.boxHeight - h;
            }
        }
        return new Rectangle(x, y, w, h);
    }

    skillTreeWindowRect() {            
        const typeSelectWindowRect = this.typeSelectWindowRect();
        let x;
        if (this.isRightInputMode()) {
            x = 0;
        } else {
            x = typeSelectWindowRect.width;
        }
        const w = Graphics.boxWidth - typeSelectWindowRect.width;
        const y = typeSelectWindowRect.y;
        let h;
        if (this.isBottomHelpMode()) {
            const helpWindowRect = this.helpWindowRect();
            h = helpWindowRect.y - y;
        } else if (this.isBottomButtonMode()) {
            h = this.buttonAreaTop() - y;
        } else {
            h = Graphics.boxHeight - y;
        }
        return new Rectangle(x, y, w, h);
    }

    nodeOpenWindowRect() {
        const w = 640;
        const h = 160;
        const x = Graphics.boxWidth / 2 - w / 2;
        const y = Graphics.boxHeight / 2 - h / 2;
        return new Rectangle(x, y, w, h);
    }

    typeOk() {
        this.changeTypeWindowToSkillTreeWindow();
    }

    typeCancel() {
        this.popScene();
    }

    skillTreeOk() {
        this.changeSkillTreeWindowToNodeOpenWindow();
    }

    skillTreeCance() {
        this.changeSkillTreeWindowToTypeWindow();
    }

    nodeOpenOk() {
        this._skillTreeManager.selectNodeOpen();
        this.playLearnSkillSe();
        this.changeNodeOpenWindowToSkillTreeWindow();
        this._windowSkillTree.refresh();
        this._windowActorInfo.refresh();
    }

    nodeOpenCancel() {
        this.changeNodeOpenWindowToSkillTreeWindow();
    }

    needsPageButtons() {
        return true;
    }

    arePageButtonsEnabled() {
        return this._windowTypeSelect.active;
    }

    getSkillTreeTypes() {
        return $skillTreeData.enableTypes(this.actor().actorId());
    }

    updateSkillTree() {
        const type = this._windowTypeSelect.type();
        if (type) {
            this._skillTreeManager.reset();
            this._skillTreeManager.setActorId(this.actor().actorId());
            this._skillTreeManager.setType(type);
            this._skillTreeManager.selectTopNode($skillTreeData.topNode(type));
            if (this._windowSkillTree) {
                this._windowSkillTree.setDrawState("createView");
                this._windowSkillTree.refresh();
            }
        } else {
            if (this._windowSkillTree) this._windowSkillTree.setDrawState("undraw");
        }

    }

    changeTypeWindowToSkillTreeWindow() {
        this._windowTypeSelect.deactivate();
        this._windowTypeSelect.hideHelpWindow();
        this._windowSkillTreeNodeInfo.refresh();
        this._windowSkillTreeNodeInfo.open();
        this._windowSkillTreeNodeInfo.show();
        this._windowSkillTree.refresh();
        this._windowSkillTree.showHelpWindow();
        this._windowSkillTree.activate();
    }

    changeSkillTreeWindowToTypeWindow() {
        this._windowSkillTree.deactivate();
        this._windowSkillTree.hideHelpWindow();
        this._windowSkillTreeNodeInfo.close();
        this._windowTypeSelect.showHelpWindow();
        this._windowTypeSelect.activate();
        this._windowTypeSelect.open();
    }

    changeSkillTreeWindowToNodeOpenWindow() {
        this._windowSkillTree.deactivate();
        this._windowNodeOpen.refresh();
        this._windowNodeOpen.activate();
        this._windowNodeOpen.show();
        this._windowNodeOpen.open();
    }

    changeNodeOpenWindowToSkillTreeWindow() {
        this._windowNodeOpen.deactivate();
        this._windowNodeOpen.close();
        this._windowSkillTree.open();
        this._windowSkillTree.showHelpWindow();
        this._windowSkillTree.activate();
    }

    onActorChange() {
        super.onActorChange();
        this.resetTypeSelectWindow();
        this.resetActorInfoWindow();
        this._windowTypeSelect.showHelpWindow();
        this._windowTypeSelect.open();
        this._windowTypeSelect.activate();
        this._windowTypeSelect.show();
        this.updateSkillTree();
    }

    playLearnSkillSe() {
        if (LearnSkillSeFileName === "") return;
        const se = {
            name: LearnSkillSeFileName,
            pan: LearnSkillSePan,
            pitch: LearnSkillSePitch,
            volume: LearnSkillSeVolume,
        }
        AudioManager.playSe(se);
    }
}

class Window_TypeSelect extends Window_Command {
    initialize(rect, types) {
        this._windowRect = rect;
        this._types = types;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
            super.initialize(0, 0);
            this.updatePlacement();
        }
    }

    reset(types) {
        this._index = 0;
        this._types = types;
        this._handlers = {};
    }

    type() {
        return this._types[this.index()];
    }

    select(index) {
        super.select(index);
        this.callHandler("select");
    }

    updateHelp() {
        let description = "";
        if (this.type()) description = this.type().helpMessage();
        this.setHelpWindowItem({ description: description });
    }

    windowWidth() {
        return this._windowRect.width;
    }

    windowHeight() {
        return this._windowRect.height;
    }

    updatePlacement() {
        this.x = this._windowRect.x;
        this.y = this._windowRect.y;
    }

    makeCommandList() {
        let i = 0;
        for (const type of this._types) {
            this.addCommand(type.message(), `type${i}`);
            i++;
        }
    }
}

class Window_ActorInfo extends Window_Base {
    initialize(rect, actorId) {
        this._actorId = actorId;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
            super.initialize(rect.x, rect.y, rect.width, rect.height);
        }
    }

    reset(actorId) {
        this._actorId = actorId;
    }

    refresh() {
        if (this.contents) {
            this.contents.clear();
            this.draw();
        }
    }

    actor() {
        const actor = $gameActors.actor(this._actorId);
        if (!actor) throw new Error(`actor id: ${this._actorId} is not found.`)
        return actor;
    }

    draw() {
        const textWidth = this.width - this.padding * 2;
        this.drawActorFace(this.actor(), 0, 0, textWidth, this.height - 100);
        this.drawText(`${this.actor().name()}`, 0, this.height - 100, textWidth, "left");
        this.changeTextColor(this.systemColor());
        const nowSp = $skillTreeData.sp(this._actorId);
        this.drawText(SpName, 0, this.height - 70, textWidth);
        this.resetTextColor();
        const nowSpTextX = this.textWidth(SpName) + (textWidth - this.textWidth(SpName)) / 2;
        this.drawText(nowSp.toString(), 0, this.height - 70, nowSpTextX, "right");
    }

    systemColor() {
        if (Utils.RPGMAKER_NAME === "MZ") return ColorManager.systemColor();
        return super.systemColor();
    }

    drawActorFace(actor, x, y, width, height) {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
    }
}

class Window_SkillTreeNodeInfo extends Window_Base {
    initialize(rect, skillTreeManager) {
        this._skillTreeManager = skillTreeManager;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
            super.initialize(rect.x, rect.y, rect.width, rect.height);
        }
    }

    refresh() {
        if (this.contents) {
            this.contents.clear();
            if (this._skillTreeManager.type()) this.draw();
        }
    }

    draw() {
        const textWidth = this.width - this.padding * 2;
        const selectNode = this._skillTreeManager.selectNode();
        const skill = selectNode.info().skill();
        this.drawText(skill.name, 0, 0, textWidth, "left");
        const needSp = selectNode.needSp();
        const nowSp = $skillTreeData.sp(this._skillTreeManager.actorId());
        if (selectNode.isOpened()) {
            this.drawText(OpenedNodeText, 0, 40, textWidth, "left");
        } else {
            this.drawText(NeedSpText.format(SpName), 0, 40, textWidth, "left");
            if (needSp <= nowSp) {
                this.changeTextColor(this.crisisColor());
            } else {
                this.changePaintOpacity(false);
            }
            this.drawText(`${needSp}/${nowSp}`, 0, 40, textWidth, "right");
        }
        this.resetTextColor();
        this.changePaintOpacity(true);
    }

    crisisColor() {
        if (Utils.RPGMAKER_NAME === "MZ") return ColorManager.crisisColor();
        return super.crisisColor();
    }
}

class Window_SkillTree extends Window_Selectable {
    initialize(rect, skillTreeManager, windowTypeSelect, windowSkillTreeNodeInfo) {
        this._skillTreeManager = skillTreeManager;
        this._windowTypeSelect = windowTypeSelect;
        this._windowSkillTreeNodeInfo = windowSkillTreeNodeInfo;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
            this._viewSprite = new Sprite(new Bitmap(1, 1));
            this.addInnerChild(this._viewSprite);
        } else {
            super.initialize(rect.x, rect.y, rect.width, rect.height);
            this._bitmapCache = null;
        }
        this._skillTreeView = new SkillTreeView(skillTreeManager, rect.width, rect.height);
        this._drawState = "undraw";
        this._touchSelected = true;
    }

    setDrawState(drawState) {
        this._drawState = drawState;
    }

    update() {
        super.update();
        if (this._drawState === "undraw") this.updateCursor();
        this.updateView();
    }

    updateView() {
        if (this._drawState === "none") return;
        this.drawView();
        this._drawState = "none";
    }

    updateHelp() {
        const skill = this._skillTreeManager.selectNode().info().skill();
        this.setHelpWindowItem(skill);
        if (this._windowSkillTreeNodeInfo.isOpen()) this._windowSkillTreeNodeInfo.refresh();
    }

    updateCursor() {
        if (this.isCursorVisible() && this._skillTreeManager.type()) {
            const rect = this.getCursorRect();
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    }

    getCursorRect() {
        const rect = this._skillTreeView.getCursorRect();
        if (Utils.RPGMAKER_NAME === "MZ") {
            rect.x -= this.scrollBaseX();
            rect.y -= this.scrollBaseY();
        } else {
            const [viewX, viewY] = this._skillTreeView.viewXY();
            rect.x -= viewX;
            rect.y -= viewY;
        }
        return rect;
    }

    refreshCursor() {
        this.updateCursor();
    }
    
    refreshCursorForAll() {
    }

    isCursorVisible() {
        return this._skillTreeView && !this._windowTypeSelect.active;
    }

    refresh() {
        super.refresh();
        this.updateCursor();
        if (this._drawState === "undraw") return;
        this._drawState = "createView";
        this.updateView();
    }

    maxScrollX() {
        const x = this._viewSprite.bitmap.width + this.padding * 2 - this.width;
        return x < 0 ? 0 : x;
    }

    maxScrollY() {
        const y = this._viewSprite.bitmap.height + this.padding * 2 - this.height;
        return y < 0 ? 0 : y;
    }

    drawView() {
        if (Utils.RPGMAKER_NAME === "MZ") {
            if (this._drawState === "undraw") {
                this._viewSprite.bitmap = new Bitmap(1, 1);
            } else if (this._drawState === "createView") {
                this._viewSprite.bitmap = this.getView();
                if (this._windowTypeSelect.active) this.scrollTo(0, 0);
            } else if (this._drawState === "updateScroll") {
                const [viewX, viewY] = this._skillTreeView.viewXY();
                this.smoothScrollTo(viewX, viewY);
            }
        } else {
            this.contents.clear();
            if (this._drawState === "undraw") return;
            const view = this.getView();
            const [viewX, viewY] = this._skillTreeView.viewXY();
            this.contents.blt(view, viewX, viewY, this.width, this.height, 0, 0);
        }
    }

    getView() {
        if (Utils.RPGMAKER_NAME === "MZ") return this._skillTreeView.createView();
        if (this._drawState === "updateScroll" && this._bitmapCache) return this._bitmapCache;
        const bitmap = this._skillTreeView.createView();
        this._bitmapCache = bitmap;
        return bitmap;
    }

    isCursorMovable() {
        return this.isOpenAndActive() && !this._cursorFixed && !this._cursorAll;
    }

    isCurrentItemEnabled() {
        return this._skillTreeManager.isSelectNodeOpenable();
    }

    cursorDown(wrap) {
        const moved = this._skillTreeManager.down();
        if (moved) {
            this._drawState = "updateScroll";
            this.changeSelectNode();
        }
    }
    
    cursorUp(wrap) {
        const moved = this._skillTreeManager.up();
        if (moved) {
            this._drawState = "updateScroll";
            this.changeSelectNode();
        }
    }

    cursorRight(wrap) {
        const moved = this._skillTreeManager.right();
        if (moved) {
            this._drawState = "updateScroll";
            this.changeSelectNode();
        }
    }
    
    cursorLeft(wrap) {
        const moved = this._skillTreeManager.left();
        if (moved) {
            this._drawState = "updateScroll";
            this.changeSelectNode();
        }
    }

    changeSelectNode() {
        this._stayCount = 0;
        SoundManager.playCursor();
        this.updateCursor();
        this.callUpdateHelp();
    }

    // This method is used when Utils.RPGMAKER_NAME is MV.
    onTouch(triggered) {
        if (triggered) {
            this._touchSelected = true;
            this.onTouchOk();
        } else {
            this.onTouchSelect(triggered);
        }
    }

    onTouchSelect(trigger) {
        const localPos = this.getLocalPos();
        const hitNode = this.hitTest(localPos.x, localPos.y);
        if (!hitNode) return;
        const moved = this._skillTreeManager.select(hitNode);
        if (moved) {
            this._drawState = "updateScroll";
            this.changeSelectNode();
            this._touchSelected = false;
        } else {
            this._touchSelected = true;
        }
    }

    onTouchOk() {
        if (!this._touchSelected) return;
        const localPos = this.getLocalPos();
        const hitNode = this.hitTest(localPos.x, localPos.y);
        if (!hitNode) return;
        const moved = this._skillTreeManager.select(hitNode);
        if (moved) {
            this._drawState = "updateScroll";
            this.changeSelectNode();
        } else {
            this.processOk();
        }
    }

    getLocalPos() {
        if (Utils.RPGMAKER_NAME === "MZ") {
            const touchPos = new Point(TouchInput.x, TouchInput.y);
            return this.worldTransform.applyInverse(touchPos);
        } else {
            const x = this.canvasToLocalX(TouchInput.x);
            const y = this.canvasToLocalY(TouchInput.y);
            return { x: x, y: y };
        }
    }

    hitTest(x, y) {
        if (this.isContentsArea(x, y)) {
            const cx = x - this.padding;
            const cy = y - this.padding;
            const nodes = this._skillTreeManager.getAllNodes();
            for (const node of Object.values(nodes)) {
                let [px, py] = SkillTreeView.getPixelXY(node.point);
                if (Utils.RPGMAKER_NAME === "MZ") {
                    px -= this.scrollX();
                    py -= this.scrollY();
                } else {
                    const [viewX, viewY] = this._skillTreeView.viewXY();
                    px -= viewX;
                    py -= viewY;
                }
                const px2 = px + IconWidth;
                const py2 = py + IconHeight;
                if (px <= cx && cx < px2 && py <= cy && cy < py2) {
                    return node;
                }
            }
        }
        return null;
    }

    isContentsArea(x, y) {
        if (Utils.RPGMAKER_NAME === "MZ") return true;
        return super.isContentsArea(x, y);
    }
}

class Window_NodeOpen extends Window_Command {
    initialize(rect, skillTreeManager) {
        this._windowRect = rect;
        this._skillTreeManager = skillTreeManager;
        if (Utils.RPGMAKER_NAME === "MZ") {
            super.initialize(rect);
        } else {
            super.initialize(0, 0);
            this.updatePlacement();
        }
    }

    windowWidth() {
        return this._windowRect.width;
    }

    windowHeight() {
        return this._windowRect.height;
    }

    numVisibleRows() {
        return Math.ceil(this.maxItems() / this.maxCols());
    }

    updatePlacement() {
        this.x = this._windowRect.x;
        this.y = this._windowRect.y;
    }

    makeCommandList() {
        this.addCommand(NodeOpenYesText, "yes");
        this.addCommand(NodeOpenNoText, "no");
    }

    itemRect(index) {
        const rect = super.itemRect(index);
        rect.y += 48;
        return rect;
    }

    refresh() {
        super.refresh();
        if (!this._skillTreeManager.type()) return;
        const needSp = this._skillTreeManager.selectNode().needSp();
        const skillName = this._skillTreeManager.selectNode().info().skill().name;
        const textWidth = this.windowWidth() - this.padding * 2;
        this.drawText(NodeOpenConfirmationText.format(needSp, SpName, skillName), 0, 0, textWidth, "left");
    }

    // The SE of skill learn is played, so the SE of OK is not played.
    playOkSound() {
        if (this.currentSymbol() === "no") super.playOkSound();
    }
}

class SkillTreeView {
    constructor(skillTreeManager, windowWidth, windowHeight) {
        this._skillTreeManager = skillTreeManager;
        this._windowWidth = windowWidth;
        this._windowHeight = windowHeight;
    }

    static getPixelXY(point) {
        const px = point.x * (IconWidth + IconSpaceWidth) + ViewBeginXOffset;
        const py = point.y * (IconHeight + IconSpaceHeight) + ViewBeginYOffset;
        return [px, py];
    }

    maxPxy() {
        const [maxX, maxY] = this._skillTreeManager.maxXY();
        return SkillTreeView.getPixelXY({ x: maxX, y: maxY });
    }

    viewXY() {
        const selectNode = this._skillTreeManager.selectNode();
        const [selectNodePx, selectNodePy] = SkillTreeView.getPixelXY(selectNode.point);
        let [maxPx, maxPy] = this.maxPxy();
        maxPx += (IconWidth + IconSpaceWidth);
        maxPy += (IconHeight + IconSpaceHeight);
        let viewX, viewY;

        if (selectNodePx < this._windowWidth / 2) {
            viewX = 0;
        } else if (maxPx - selectNodePx < this._windowWidth / 2) {
            viewX = maxPx - (this._windowWidth - ViewBeginXOffset);
        } else {
            viewX = Math.floor(selectNodePx - this._windowWidth / 2);
        }

        if (selectNodePy < this._windowHeight / 2) {
            viewY = 0;
        } else if (maxPy - selectNodePy < this._windowHeight / 2) {
            viewY = maxPy - (this._windowHeight - ViewBeginYOffset);
        } else {
            viewY = Math.floor(selectNodePy - this._windowHeight / 2);
        }

        if (viewX < 0) viewX = 0;
        if (viewY < 0) viewY = 0;
        return [viewX, viewY];
    }

    viewDrawNode(bitmap) {
        for (const node of Object.values(this._skillTreeManager.getAllNodes())) {
            let [px, py] = SkillTreeView.getPixelXY(node.point);
            if (node.isSelectable()) {
                this.drawIcon(bitmap, node.iconBitmap(), px, py);
            } else {
                this.drawIcon(bitmap, node.iconBitmap(), px, py, 96);
            }
            if (node.isOpened()) {
                const x = px - ViewRectOfs;
                const y = py - ViewRectOfs;
                const width = IconWidth + ViewRectOfs * 2;
                const height = IconHeight + ViewRectOfs * 2;
                this.drawRect(bitmap, ViewRectColor, x, y, width, height, 2);
            }
        }
    }

    viewDrawLine(bitmap) {
        for (const node of Object.values( this._skillTreeManager.getAllNodes())) {
            let [px, py] = SkillTreeView.getPixelXY(node.point);
            for (const child of node.childs()) {
                let color;
                if (node.isOpened()) {
                    color = ViewLineColorLearned;
                } else {
                    color = ViewLineColorBase;
                }

                const [xDiff, yDiff] = this.nodeDiff(node, child);
                if (ViewMode === "wide") {

                    const pxOfs = IconWidth;
                    const pyOfs = IconHeight / 2;
                    if (node.point.y === child.point.y) {
                        this.drawLine(bitmap, px + pxOfs, py + pyOfs, px + pxOfs + xDiff, py + pyOfs, color);
                    } else {
                        const px1 = px + pxOfs;
                        const py1 = py + pyOfs;
                        const px2 = px1 + xDiff / 4;
                        const py2 = py1;
                        this.drawLine(bitmap, px1, py1, px2, py2, color);
                        const px3 = px2 + xDiff / 2;
                        const py3 = py2 + yDiff;
                        this.drawLine(bitmap, px2, py2, px3, py3, color);
                        const px4 = px3 + xDiff / 4;
                        const py4 = py3;
                        this.drawLine(bitmap, px3, py3, px4, py4, color);
                    }

                } else if (ViewMode === "long") {

                    const pxOfs = IconWidth / 2;
                    const pyOfs = IconHeight;
                    if (node.point.x === child.point.x) {
                        this.drawLine(bitmap, px + pxOfs, py + pyOfs, px + pxOfs, py + pyOfs + yDiff, color);
                    } else {
                        const px1 = px + pxOfs;
                        const py1 = py + pyOfs;
                        const px2 = px1;
                        const py2 = py1 + yDiff / 4;
                        this.drawLine(bitmap, px1, py1, px2, py2, color);
                        const px3 = px2 + xDiff;
                        const py3 = py2 + yDiff / 2;
                        this.drawLine(bitmap, px2, py2, px3, py3, color);
                        const px4 = px3;
                        const py4 = py3 + yDiff / 4;
                        this.drawLine(bitmap, px3, py3, px4, py4, color);
                    }

                }
            }
        }
    }

    nodeDiff(node1, node2) {
        const [px1, py1] = SkillTreeView.getPixelXY(node1.point);
        const [px2, py2] = SkillTreeView.getPixelXY(node2.point);
        let xDiff = px2 - px1;
        let yDiff = py2 - py1;
        if (ViewMode === "wide") {
            if (xDiff < 0) {
                xDiff += IconWidth;
            } else if (xDiff > 0) {
                xDiff -= IconWidth;
            }
        } else if (ViewMode === "long") {
            if (yDiff < 0) {
                yDiff += IconHeight;
            } else if (yDiff > 0) {
                yDiff -= IconHeight;
            }
        }
        return [xDiff, yDiff];
    }

    createView() {
        this._skillTreeManager.makePoint();
        const [maxPx, maxPy] = this.maxPxy();
        let width, height;
        if (Utils.RPGMAKER_NAME === "MZ") {
            width = maxPx + IconWidth + ViewBeginXOffset;
            height = maxPy + IconHeight + ViewBeginYOffset;
        } else {
            width = Math.ceil(maxPx / this._windowWidth) * this._windowWidth + IconWidth + IconSpaceWidth;
            height = Math.ceil(maxPy / this._windowHeight) * this._windowHeight + IconHeight + IconSpaceHeight;
        }
        const bitmap = new Bitmap(width, height);
        this.viewDrawLine(bitmap);
        this.viewDrawNode(bitmap);
        return bitmap;
    }

    getCursorRect() {
        this._skillTreeManager.makePoint();
        const selectNode = this._skillTreeManager.selectNode();
        const [px, py] = SkillTreeView.getPixelXY(selectNode.point);
        const x = px - ViewCursorOfs;
        const y = py - ViewCursorOfs;
        const w = IconWidth + ViewCursorOfs * 2;
        const h = IconHeight + ViewCursorOfs * 2;
        return new Rectangle(x, y, w, h);
    }

    drawLine(bitmap, x1, y1, x2, y2, color) {
        const ctx = bitmap._context;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = ViewLineWidth;
        ctx.closePath();
        ctx.stroke();
    }

    drawRect(bitmap, style, x, y, width, height, rectLineWidth) {
        const ctx = bitmap._context;
        ctx.strokeStyle = style;
        ctx.lineWidth = rectLineWidth;
        ctx.strokeRect(x, y, width, height);
    }

    drawIcon(dstBitmap, iconBitmap, x, y, opacity = 255) {
        const tmpOpacity = dstBitmap.paintOpacity;
        dstBitmap.paintOpacity = opacity;
        const pw = IconWidth;
        const ph = IconHeight;
        dstBitmap.blt(iconBitmap, 0, 0, pw, ph, x, y);
        dstBitmap.paintOpacity = tmpOpacity;
    }
}


// Initialize skill tree.
const _DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    _DataManager_createGameObjects.call(this);
    $skillTreeData = new SkillTreeData();
};

const _Scene_Boot_create = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function() {
    _Scene_Boot_create.call(this);
    this.initSkillTreeConfig();
    this.loadSkillTreeMap();
};

Scene_Boot.prototype.initSkillTreeConfig = function() {
    $skillTreeConfigLoader = new SkillTreeConfigLoader();
};

Scene_Boot.prototype.loadSkillTreeMap = function() {
    const skillTreeMapId = $skillTreeConfigLoader.configData().skillTreeMapId;
    if (skillTreeMapId) {
        for (const skillTreeName in skillTreeMapId) {
            const mapId = skillTreeMapId[skillTreeName];
            if (mapId === 0) continue;
            const mapLoader = new SkillTreeMapLoader(mapId);
            mapLoader.loadMap();
            $skillTreeMapLoaders[skillTreeName] = mapLoader;
        }
    }
};

const _Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    if (!_Scene_Boot_isReady.call(this)) return false;
    for (const mapLoader of Object.values($skillTreeMapLoaders)) {
        if (!mapLoader.isLoaded()) return false;
    }
    return true;
};

const _Game_Party_setupStartingMembers = Game_Party.prototype.setupStartingMembers;
Game_Party.prototype.setupStartingMembers = function() {
    _Game_Party_setupStartingMembers.call(this);
    for (const actor of this.members()) {
        const actorId = actor.actorId();
        $skillTreeConfigLoader.loadConfig(actorId);
        if (!$skillTreeData.sp(actorId)) $skillTreeData.setSp(actorId, 0);
    }
};

const _Game_Party_addActor = Game_Party.prototype.addActor;
Game_Party.prototype.addActor = function(actorId) {
    _Game_Party_addActor.call(this, actorId);
    $skillTreeConfigLoader.loadConfig(actorId);
    if (!$skillTreeData.sp(actorId)) $skillTreeData.setSp(actorId, 0);
};


// Add skill tree to menu command.
const _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands = function() {
    _Window_MenuCommand_addOriginalCommands.call(this);
    if (MenuSkillTreeText !== "") this.addCommand(MenuSkillTreeText, "skillTree", this.isEnabledSkillTree());
};

Window_MenuCommand.prototype.isEnabledSkillTree = function() {
    if (EnabledSkillTreeSwitchId === 0) return true;
    return $gameSwitches.value(EnabledSkillTreeSwitchId);
};

const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler("skillTree", this.commandPersonal.bind(this));
};

const _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
Scene_Menu.prototype.onPersonalOk = function() {
    _Scene_Menu_onPersonalOk.call(this);
    switch (this._commandWindow.currentSymbol()) {
    case "skillTree":
        SceneManager.push(Scene_SkillTree);
        break;
    }
};


// Includes skill tree data in save data.
const _DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const contents = _DataManager_makeSaveContents.call(this);
    contents.skillTreeData = $skillTreeData.makeSaveContents();
    return contents;
};

const _DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    _DataManager_extractSaveContents.call(this, contents);
    if (contents.skillTreeData) $skillTreeData.loadSaveContents(contents.skillTreeData);
};


// Actor gain sp.
Game_Party.prototype.gainSp = function(sp) {
    for (const actor of this.members()) {
        actor.gainSp(sp);
    }
};

Game_Actor.prototype.gainSp = function(sp) {
    $skillTreeData.gainSp(this.actorId(), sp);
    if ($skillTreeData.sp(this.actorId()) > MaxSp) {
        $skillTreeData.setSp(this.actorId(), MaxSp);
    }
};


// Get the sp when win a battle.
Game_Enemy.prototype.sp = function() {
    const battleEndGainSp = this.enemy().meta.battleEndGainSp;
    return battleEndGainSp ? parseInt(battleEndGainSp) : 0;
};

Game_Troop.prototype.spTotal = function() {
    return this.deadMembers().reduce((r, enemy) => {
        return r + enemy.sp();
    }, 0);
};

const _BattleManager_makeRewards = BattleManager.makeRewards;
BattleManager.makeRewards = function() {
    _BattleManager_makeRewards.call(this);
    if (EnableGetSpWhenBattleEnd) this._rewards.sp = $gameTroop.spTotal();
};

const _BattleManager_gainRewards = BattleManager.gainRewards;
BattleManager.gainRewards = function() {
    _BattleManager_gainRewards.call(this);
    if (EnableGetSpWhenBattleEnd) this.gainSp();
};

BattleManager.gainSp = function() {
    $gameParty.gainSp(this._rewards.sp);
};

const _BattleManager_displayRewards = BattleManager.displayRewards;
BattleManager.displayRewards = function() {
    if (EnableGetSpWhenBattleEnd) {
        this.displayExp();
        this.displayGold();
        this.displaySp();
        this.displayDropItems();
    } else {
        _BattleManager_displayRewards.call(this);
    }
};

BattleManager.displaySp = function() {
    const sp = this._rewards.sp;
    if (sp > 0) {
        $gameMessage.add("\\." + BattleEndGetSpText.format(sp, SpName));
    }
};


// Get the sp when level up.
const _Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    this._enableGetSpWhenLevelUp = EnableGetSpWhenLevelUp;
    this._prevLevel = null;
};

Game_Temp.prototype.enableGetSpWhenLevelUp = function() {
    return this._enableGetSpWhenLevelUp;
};

Game_Temp.prototype.setEnableGetSpWhenLevelUp = function(enableGetSpWhenLevelUp) {
    return this._enableGetSpWhenLevelUp = enableGetSpWhenLevelUp;
};

Game_Temp.prototype.prevLevel = function() {
    return this._prevLevel;
};

Game_Temp.prototype.setPrevLevel = function(prevLevel) {
    return this._prevLevel = prevLevel;
};

const _Game_Actor_changeExp = Game_Actor.prototype.changeExp;
Game_Actor.prototype.changeExp = function(exp, show) {
    $gameTemp.setPrevLevel(this._level);
    _Game_Actor_changeExp.call(this, exp, show);
    $gameTemp.setPrevLevel(null);
};

const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
    _Game_Actor_levelUp.call(this);
    if ($gameTemp.enableGetSpWhenLevelUp()) {
        const sp = this.getLevelUpSp(this._level);
        if (sp > 0) this.gainSp(sp);
    }
};

const _Game_Actor_displayLevelUp = Game_Actor.prototype.displayLevelUp;
Game_Actor.prototype.displayLevelUp = function(newSkills) {
    _Game_Actor_displayLevelUp.call(this, newSkills);
    if ($gameTemp.enableGetSpWhenLevelUp()) {
        let sp = 0;
        for (let level = $gameTemp.prevLevel() + 1; level <= this._level; level++) {
            sp += this.getLevelUpSp(level);
        }
        if (sp > 0) $gameMessage.add(LevelUpGetSpText.format(sp, SpName));
    }
};

Game_Actor.prototype.getLevelUpSp = function(level) {
    for (const data of $skillTreeConfigLoader.configData().levelUpGainSp) {
        if (data.classId === this.currentClass().id) {
            const defaultGainSp = data.default;
            const sp = data[level.toString()];
            return sp ? sp : defaultGainSp;
        }
    }
    return 0;
};

// Prevent SP from increasing due to level-up processing when changing jobs.
const _Game_Actor_changeClass = Game_Actor.prototype.changeClass;
Game_Actor.prototype.changeClass = function(classId, keepExp) {
    $gameTemp.setEnableGetSpWhenLevelUp(false);
    _Game_Actor_changeClass.call(this, classId, keepExp);
    $gameTemp.setEnableGetSpWhenLevelUp(EnableGetSpWhenLevelUp);
};


// Define class alias.
return {
    SkillTreeNodeInfo: SkillTreeNodeInfo,
    SkillTreeNode: SkillTreeNode,
    SkillTreeTopNode: SkillTreeTopNode,
    SkillDataType: SkillDataType,
    SkillTreeMapLoader: SkillTreeMapLoader,
    SkillTreeConfigLoadError: SkillTreeConfigLoadError,
    SkillTreeConfigLoader: SkillTreeConfigLoader,
    SkillTreeData: SkillTreeData,
    SkillTreeManager: SkillTreeManager,
    Scene_SkillTree: Scene_SkillTree,
    Window_TypeSelect: Window_TypeSelect,
    Window_ActorInfo: Window_ActorInfo,
    Window_SkillTreeNodeInfo: Window_SkillTreeNodeInfo,
    Window_SkillTree: Window_SkillTree,
    Window_NodeOpen: Window_NodeOpen,
    SkillTreeView: SkillTreeView,
}

})();
