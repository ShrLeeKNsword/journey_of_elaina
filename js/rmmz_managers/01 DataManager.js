//-----------------------------------------------------------------------------
// DataManager
//
// The static class that manages the database and game objects.

/**
 * 数据管理器
 * 
 * 管理数据库和游戏对象的静态类。
 */
function DataManager() {
    throw new Error("This is a static class");
}

/**数据角色组 */
$dataActors = null;
/**数据职业组 */
$dataClasses = null;
/**数据技能组 */
$dataSkills = null;
/**数据物品组 */
$dataItems = null;
/**数据武器组 */
$dataWeapons = null;
/**数据防具组 */
$dataArmors = null;
/**数据敌人组 */
$dataEnemies = null;
/**数据敌群组 */
$dataTroops = null;
/**数据状态组 */
$dataStates = null;
/**数据动画组 */
$dataAnimations = null;
/**数据图块设置 */
$dataTilesets = null;
/**数据公共事件组 */
$dataCommonEvents = null;
/**数据系统 */
$dataSystem = null;
/**数据地图信息组 */
$dataMapInfos = null;
/**数据地图 */
$dataMap = null;
/**游戏临时 */
$gameTemp = null;
/**游戏系统 */
$gameSystem = null;
/**游戏画面 */
$gameScreen = null;
/**游戏计时 */
$gameTimer = null;
/**游戏消息 */
$gameMessage = null;
/**游戏开关组 */
$gameSwitches = null;
/**游戏变量组 */
$gameVariables = null;
/**游戏独立开关组 */
$gameSelfSwitches = null;
/**游戏角色组 */
$gameActors = null;
/**游戏队伍 */
$gameParty = null;
/**游戏敌群 */
$gameTroop = null;
/**游戏地图 */
$gameMap = null;
/**游戏玩家 */
$gamePlayer = null;
/**测试事件 */
$testEvent = null;

/**
 * 全局信息
 */
DataManager._globalInfo = null;
/**
 * 错误组
 * 
 * @mv 中为 DataManager._errorUrl 非数组 
 */
DataManager._errors = [];

/**数据库文件列表 */
DataManager._databaseFiles = [
    { name: "$dataActors", src: "Actors.json" },
    { name: "$dataClasses", src: "Classes.json" },
    { name: "$dataSkills", src: "Skills.json" },
    { name: "$dataItems", src: "Items.json" },
    { name: "$dataWeapons", src: "Weapons.json" },
    { name: "$dataArmors", src: "Armors.json" },
    { name: "$dataEnemies", src: "Enemies.json" },
    { name: "$dataTroops", src: "Troops.json" },
    { name: "$dataStates", src: "States.json" },
    { name: "$dataAnimations", src: "Animations.json" },
    { name: "$dataTilesets", src: "Tilesets.json" },
    { name: "$dataCommonEvents", src: "CommonEvents.json" },
    { name: "$dataSystem", src: "System.json" },
    { name: "$dataMapInfos", src: "MapInfos.json" }
];

/**
 * 加载全局信息
 * @mz 修改
 * 
*/
DataManager.loadGlobalInfo = function() {
    StorageManager.loadObject("global")
        .then(globalInfo => {
            this._globalInfo = globalInfo;
            this.removeInvalidGlobalInfo();
            return 0;
        })
        .catch(() => {
            this._globalInfo = [];
        });
};

/**
 * 删除无效的全局信息
 * @mz 新增
 */
DataManager.removeInvalidGlobalInfo = function() {
    const globalInfo = this._globalInfo;
    for (const info of globalInfo) {
        const savefileId = globalInfo.indexOf(info);
        if (!this.savefileExists(savefileId)) {
            delete globalInfo[savefileId];
        }
    }
};

/**
 * 保存全局信息
 */
DataManager.saveGlobalInfo = function() {
    StorageManager.saveObject("global", this._globalInfo);
};

/**
 * 是全局信息加载后
 * @mz 新增
 */
DataManager.isGlobalInfoLoaded = function() {
    return !!this._globalInfo;
};

/**
 * 加载数据库
 */
DataManager.loadDatabase = function() {
    const test = this.isBattleTest() || this.isEventTest();
    const prefix = test ? "Test_" : "";
    for (const databaseFile of this._databaseFiles) {
        this.loadDataFile(databaseFile.name, prefix + databaseFile.src);
    }
    if (this.isEventTest()) {
        this.loadDataFile("$testEvent", prefix + "Event.json");
    }
};

/**
 * 加载数据文件
 * @param {string} name 名称
 * @param {string} src 文件名
 */
DataManager.loadDataFile = function(name, src) {
    const xhr = new XMLHttpRequest();
    const url = "data/" + src;
    window[name] = null;
    xhr.open("GET", url);
    xhr.overrideMimeType("application/json");
    xhr.onload = () => this.onXhrLoad(xhr, name, src, url);
    xhr.onerror = () => this.onXhrError(name, src, url);
    xhr.send();
};

/**
 * 当Xhr加载
 * @param {XMLHttpRequest} xhr xhr对象
 * @param {string} name 名称
 * @param {string} src 文件名
 * @param {string} url 网址
 */
DataManager.onXhrLoad = function(xhr, name, src, url) {
    if (xhr.status < 400) {
        window[name] = JSON.parse(xhr.responseText);
        this.onLoad(window[name]);
    } else {
        this.onXhrError(name, src, url);
    }
};

/**
 * 当Xhr错误
 * @param {string} name 名称
 * @param {string} src 文件名
 * @param {string} url 网址
 */
DataManager.onXhrError = function(name, src, url) {
    const error = { name: name, src: src, url: url };
    this._errors.push(error);
};

/**
 * 是数据库已加载
 */
DataManager.isDatabaseLoaded = function() {
    this.checkError();
    for (const databaseFile of this._databaseFiles) {
        if (!window[databaseFile.name]) {
            return false;
        }
    }
    return true;
};

/**
 * 加载地图数据
 * @param {number} mapId 地图id
 */
DataManager.loadMapData = function(mapId) {
    if (mapId > 0) {
        const filename = "Map%1.json".format(mapId.padZero(3));
        this.loadDataFile("$dataMap", filename);
    } else {
        this.makeEmptyMap();
    }
};

/**
 * 制作空地图
 */
DataManager.makeEmptyMap = function() {
    $dataMap = {};
    $dataMap.data = [];
    $dataMap.events = [];
    $dataMap.width = 100;
    $dataMap.height = 100;
    $dataMap.scrollType = 3;
};

/**
 * 是地图已加载
 */
DataManager.isMapLoaded = function() {
    this.checkError();
    return !!$dataMap;
};

/**
 * 当加载
 * @param {object} object 对象
 */
DataManager.onLoad = function(object) {
    if (this.isMapObject(object)) {
        this.extractMetadata(object);
        this.extractArrayMetadata(object.events);
    } else {
        this.extractArrayMetadata(object);
    }
};

/**
 * 是地图对象
 * @param {object} object 对象
 */
DataManager.isMapObject = function(object) {
    return !!(object.data && object.events);
};

/**
 * 提取数组元数据
 * @param {object[]} array 数组
 */
DataManager.extractArrayMetadata = function(array) {
    if (Array.isArray(array)) {
        for (const data of array) {
            if (data && "note" in data) {
                this.extractMetadata(data);
            }
        }
    }
};

/**
 * 提取元数据
 * @param {object} data 数据
 */
DataManager.extractMetadata = function(data) {
    const regExp = /<([^<>:]+)(:?)([^>]*)>/g;
    data.meta = {};
    for (;;) {
        const match = regExp.exec(data.note);
        if (match) {
            if (match[2] === ":") {
                data.meta[match[1]] = match[3];
            } else {
                data.meta[match[1]] = true;
            }
        } else {
            break;
        }
    }
};

/**
 * 检查错误
 */
DataManager.checkError = function() {
    if (this._errors.length > 0) {
        const error = this._errors.shift();
        const retry = () => {
            this.loadDataFile(error.name, error.src);
        };
        throw ["LoadError", error.url, retry];
    }
};

/**
 * 是战斗测试
 */
DataManager.isBattleTest = function() {
    return Utils.isOptionValid("btest");
};

/**
 * 是事件测试
 */
DataManager.isEventTest = function() {
    return Utils.isOptionValid("etest");
};

/**
 * 是技能
 * @param {object} item 项目数据
 */
DataManager.isSkill = function(item) {
    return item && $dataSkills.includes(item);
};

/**
 * 是物品
 * @param {object} item 项目数据
 */
DataManager.isItem = function(item) {
    return item && $dataItems.includes(item);
};

/**
 * 是武器
 * @param {object} item 项目数据
 */
DataManager.isWeapon = function(item) {
    return item && $dataWeapons.includes(item);
};

/**
 * 是防具
 * @param {object} item 项目数据
 */
DataManager.isArmor = function(item) {
    return item && $dataArmors.includes(item);
};

/**
 * 创建游戏对象组
 */
DataManager.createGameObjects = function() {
    $gameTemp = new Game_Temp();
    $gameSystem = new Game_System();
    $gameScreen = new Game_Screen();
    $gameTimer = new Game_Timer();
    $gameMessage = new Game_Message();
    $gameSwitches = new Game_Switches();
    $gameVariables = new Game_Variables();
    $gameSelfSwitches = new Game_SelfSwitches();
    $gameActors = new Game_Actors();
    $gameParty = new Game_Party();
    $gameTroop = new Game_Troop();
    $gameMap = new Game_Map();
    $gamePlayer = new Game_Player();
};

/**
 * 安装新游戏
 */
DataManager.setupNewGame = function() {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.setupForNewGame();
    Graphics.frameCount = 0;
};

/**
 * 安装战斗测试
 */
DataManager.setupBattleTest = function() {
    this.createGameObjects();
    $gameParty.setupBattleTest();
    BattleManager.setup($dataSystem.testTroopId, true, false);
    BattleManager.setBattleTest(true);
    BattleManager.playBattleBgm();
};

/**
 * 安装事件测试
 */
DataManager.setupEventTest = function() {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer(-1, 8, 6);
    $gamePlayer.setTransparent(false);
};

/**
 * 是否存在任何存档文件
 */
DataManager.isAnySavefileExists = function() {
    return this._globalInfo.some(x => x);
};

/**
 * 最新的存档文件ID
 */
DataManager.latestSavefileId = function() {
    const globalInfo = this._globalInfo;
    const validInfo = globalInfo.slice(1).filter(x => x);
    const latest = Math.max(...validInfo.map(x => x.timestamp));
    const index = globalInfo.findIndex(x => x && x.timestamp === latest);
    return index > 0 ? index : 0;
};

/**
 * 最早的保存文件ID
 * @mz 新增
 */
DataManager.earliestSavefileId = function() {
    const globalInfo = this._globalInfo;
    const validInfo = globalInfo.slice(1).filter(x => x);
    const earliest = Math.min(...validInfo.map(x => x.timestamp));
    const index = globalInfo.findIndex(x => x && x.timestamp === earliest);
    return index > 0 ? index : 0;
};

/**
 * 空的存档文件ID
 */
DataManager.emptySavefileId = function() {
    const globalInfo = this._globalInfo;
    const maxSavefiles = this.maxSavefiles();
    if (globalInfo.length < maxSavefiles) {
        return Math.max(1, globalInfo.length);
    } else {
        const index = globalInfo.slice(1).findIndex(x => !x);
        return index >= 0 ? index + 1 : -1;
    }
};

/**
 * 加载全部存档文件图像
 */
DataManager.loadAllSavefileImages = function() {
    for (const info of this._globalInfo.filter(x => x)) {
        this.loadSavefileImages(info);
    }
};

/**
 * 加载存档文件图像
 * @param {object} info 信息 
 */
DataManager.loadSavefileImages = function(info) {
    if (info.characters && Symbol.iterator in info.characters) {
        for (const character of info.characters) {
            ImageManager.loadCharacter(character[0]);
        }
    }
    if (info.faces && Symbol.iterator in info.faces) {
        for (const face of info.faces) {
            ImageManager.loadFace(face[0]);
        }
    }
};

/**
 * 最大存档文件数
 */
DataManager.maxSavefiles = function() {
    return 20;
};

/**
 * 存档文件信息
 * @param {number} savefileId 存档id
 */
DataManager.savefileInfo = function(savefileId) {
    const globalInfo = this._globalInfo;
    return globalInfo[savefileId] ? globalInfo[savefileId] : null;
};

/**
 * 存档文件存在
 * @param {number} savefileId 存档id
 */
DataManager.savefileExists = function(savefileId) {
    const saveName = this.makeSavename(savefileId);
    return StorageManager.exists(saveName);
};

/**
 * 保存游戏
 * @param {number} savefileId 存档id
 */
DataManager.saveGame = function(savefileId) {
    const contents = this.makeSaveContents();
    const saveName = this.makeSavename(savefileId);
    return StorageManager.saveObject(saveName, contents).then(() => {
        this._globalInfo[savefileId] = this.makeSavefileInfo();
        this.saveGlobalInfo();
        return 0;
    });
};

/**
 * 加载游戏
 * @param {number} savefileId 存档id
 */
DataManager.loadGame = function(savefileId) {
    const saveName = this.makeSavename(savefileId);
    return StorageManager.loadObject(saveName).then(contents => {
        this.createGameObjects();
        this.extractSaveContents(contents);
        this.correctDataErrors();
        return 0;
    });
};

/**
 * 制作存档名称
 * @param {number} savefileId 存档id
 */
DataManager.makeSavename = function(savefileId) {
    return "file%1".format(savefileId);
};

/**
 * 选择存档文件为了新游戏 
 * @mz 新增
 */
DataManager.selectSavefileForNewGame = function() {
    const emptySavefileId = this.emptySavefileId();
    const earliestSavefileId = this.earliestSavefileId();
    if (emptySavefileId > 0) {
        $gameSystem.setSavefileId(emptySavefileId);
    } else {
        $gameSystem.setSavefileId(earliestSavefileId);
    }
};

/**
 * 制作存档文件信息
 */
DataManager.makeSavefileInfo = function() {
    const info = {};
    info.title = $dataSystem.gameTitle;
    info.characters = $gameParty.charactersForSavefile();
    info.faces = $gameParty.facesForSavefile();
    info.playtime = $gameSystem.playtimeText();
    info.timestamp = Date.now();
    return info;
};

/**
 * 制作存档内容
 */
DataManager.makeSaveContents = function() {
    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
    const contents = {};
    contents.system = $gameSystem;
    contents.screen = $gameScreen;
    contents.timer = $gameTimer;
    contents.switches = $gameSwitches;
    contents.variables = $gameVariables;
    contents.selfSwitches = $gameSelfSwitches;
    contents.actors = $gameActors;
    contents.party = $gameParty;
    contents.map = $gameMap;
    contents.player = $gamePlayer;
    return contents;
};

/**
 * 提取保存内容
 * @param {object} contents 内容
 */
DataManager.extractSaveContents = function(contents) {
    $gameSystem = contents.system;
    $gameScreen = contents.screen;
    $gameTimer = contents.timer;
    $gameSwitches = contents.switches;
    $gameVariables = contents.variables;
    $gameSelfSwitches = contents.selfSwitches;
    $gameActors = contents.actors;
    $gameParty = contents.party;
    $gameMap = contents.map;
    $gamePlayer = contents.player;
};

/**
 * 纠正数据错误
 */
DataManager.correctDataErrors = function() {
    //游戏队伍.删除无效成员()
    $gameParty.removeInvalidMembers();
};

