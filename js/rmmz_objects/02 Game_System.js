//-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.

/**
 * 游戏系统
 * 
 * 系统数据的游戏对象类。
 */
function Game_System() {
    this.initialize(...arguments);
}

/**
 * 初始化
 */
Game_System.prototype.initialize = function() {
    /**
     * 存档已启用
     */
    this._saveEnabled = true;
    /**
     * 菜单已启用
     */
    this._menuEnabled = true;
    /**
     * 遇到已启用
     */
    this._encounterEnabled = true;
    /**
     * 队形启用
     */
    this._formationEnabled = true;
    /**
     * 战斗计数
     */
    this._battleCount = 0;
    /**
     * 胜利计数
     */
    this._winCount = 0;
    /**
     * 逃跑计数
     */
    this._escapeCount = 0;
    /**
     * 存档计数
     */
    this._saveCount = 0;
    /**
     * 版本id
     */
    this._versionId = 0;
    /**
     * 存档文件id
     */
    this._savefileId = 0;
    /**
     * 保存帧数
     */
    this._framesOnSave = 0;
    /**
     * 存档中的bgm
     */
    this._bgmOnSave = null;
    /**
     * 存档中的bgs
     */
    this._bgsOnSave = null;
    /**
     * 窗口色调
     */
    this._windowTone = null;
    /**
     * 战斗bgm
     */
    this._battleBgm = null;
    /**
     * 胜利me
     */
    this._victoryMe = null;
    /**
     * 失败me
     */
    this._defeatMe = null;
    /**
     * 保存的bgm
     */
    this._savedBgm = null;
    this._walkingBgm = null;
};

/**
 * 是日文
 */
Game_System.prototype.isJapanese = function() {
    return $dataSystem.locale.match(/^ja/);
};

/**
 * 是中文
 */
Game_System.prototype.isChinese = function() {
    return $dataSystem.locale.match(/^zh/);
};

/**
 * 是韩文
 */
Game_System.prototype.isKorean = function() {
    return $dataSystem.locale.match(/^ko/);
};

/**
 * 是中日韩
 */
Game_System.prototype.isCJK = function() {
    return $dataSystem.locale.match(/^(ja|zh|ko)/);
};

/**
 * 是俄文
 */
Game_System.prototype.isRussian = function() {
    return $dataSystem.locale.match(/^ru/);
};

/**
 * 是侧视图
 */
Game_System.prototype.isSideView = function() {
    return $dataSystem.optSideView;
};

/**
 * 已启用自动保存
 */
Game_System.prototype.isAutosaveEnabled = function() {
    return $dataSystem.optAutosave;
};

/**
 * 是允许存档
 */
Game_System.prototype.isSaveEnabled = function() {
    return this._saveEnabled;
};

/**
 * 禁止存档
 */
Game_System.prototype.disableSave = function() {
    this._saveEnabled = false;
};

/**
 * 允许保存
 */
Game_System.prototype.enableSave = function() {
    this._saveEnabled = true;
};

/**
 * 是允许菜单
 */
Game_System.prototype.isMenuEnabled = function() {
    return this._menuEnabled;
};

/**
 * 禁止菜单
 */
Game_System.prototype.disableMenu = function() {
    this._menuEnabled = false;
};

/**
 * 允许菜单
 */
Game_System.prototype.enableMenu = function() {
    this._menuEnabled = true;
};

/**
 * 是允许遭遇
 */
Game_System.prototype.isEncounterEnabled = function() {
    return this._encounterEnabled;
};

/**
 * 禁止遇敌
 */
Game_System.prototype.disableEncounter = function() {
    this._encounterEnabled = false;
};

/**
 * 允许遇敌
 */
Game_System.prototype.enableEncounter = function() {
    this._encounterEnabled = true;
};

/**
 * 是允许编队
 */
Game_System.prototype.isFormationEnabled = function() {
    return this._formationEnabled;
};

/**
 * 禁止编队
 */
Game_System.prototype.disableFormation = function() {
    this._formationEnabled = false;
};

/**
 * 允许编队
 */
Game_System.prototype.enableFormation = function() {
    this._formationEnabled = true;
};

/**
 * 战斗计数
 */
Game_System.prototype.battleCount = function() {
    return this._battleCount;
};

/**
 * 胜利计数
 */
Game_System.prototype.winCount = function() {
    return this._winCount;
};

/**
 * 逃跑计数
 */
Game_System.prototype.escapeCount = function() {
    return this._escapeCount;
};

/**
 * 存档计数
 */
Game_System.prototype.saveCount = function() {
    return this._saveCount;
};

/**
 * 版本id
 */
Game_System.prototype.versionId = function() {
    return this._versionId;
};

/**
 * 存档文件id
 */
Game_System.prototype.savefileId = function() {
    return this._savefileId || 0;
};

/**
 * 设置存档文件id
 * @param {number} savefileId 存档文件id 
 */
Game_System.prototype.setSavefileId = function(savefileId) {
    this._savefileId = savefileId;
};

/**
 * 窗口色调
 */
Game_System.prototype.windowTone = function() {
    return this._windowTone || $dataSystem.windowTone;
};

/**
 * 设置窗口色调
 * @param {*} value 色调
 */
Game_System.prototype.setWindowTone = function(value) {
    this._windowTone = value;
};

/**
 * 战斗bgm
 */
Game_System.prototype.battleBgm = function() {
    return this._battleBgm || $dataSystem.battleBgm;
};

/**
 * 设置战斗bgm
 * @param {*} value bgm数据
 */
Game_System.prototype.setBattleBgm = function(value) {
    this._battleBgm = value;
};

/**
 * 胜利me
 */
Game_System.prototype.victoryMe = function() {
    return this._victoryMe || $dataSystem.victoryMe;
};

/**
 * 设置胜利me
 * @param {*} value me数据
 */
Game_System.prototype.setVictoryMe = function(value) {
    this._victoryMe = value;
};

/**
 * 失败me
 */
Game_System.prototype.defeatMe = function() {
    return this._defeatMe || $dataSystem.defeatMe;
};

/**
 * 设置失败me
 * @param {*} value me数据
 */
Game_System.prototype.setDefeatMe = function(value) {
    this._defeatMe = value;
};

/**
 * 当战斗开始
 */
Game_System.prototype.onBattleStart = function() {
    this._battleCount++;
};

/**
 * 当战斗胜利
 */
Game_System.prototype.onBattleWin = function() {
    this._winCount++;
};

/**
 * 当战斗逃跑
 */
Game_System.prototype.onBattleEscape = function() {
    this._escapeCount++;
};

/**
 * 当保存前
 */
Game_System.prototype.onBeforeSave = function() {
    this._saveCount++;
    this._versionId = $dataSystem.versionId;
    this._framesOnSave = Graphics.frameCount;
    this._bgmOnSave = AudioManager.saveBgm();
    this._bgsOnSave = AudioManager.saveBgs();
};

/**
 * 当读取后
 */
Game_System.prototype.onAfterLoad = function() {
    Graphics.frameCount = this._framesOnSave;
    AudioManager.playBgm(this._bgmOnSave);
    AudioManager.playBgs(this._bgsOnSave);
};

/**
 * 游戏时间
 */
Game_System.prototype.playtime = function() {
    return Math.floor(Graphics.frameCount / 60);
};

/**
 * 游戏时间文本
 */
Game_System.prototype.playtimeText = function() {
    const time = this.playtime();
    const hour = Math.floor( time / 60 / 60);
    const min = Math.floor(time / 60) % 60;
    const sec = time % 60;
    return hour.padZero(2) + ":" + min.padZero(2) + ":" + sec.padZero(2);
};

/**
 * 保存bgm
 */
Game_System.prototype.saveBgm = function() {
    this._savedBgm = AudioManager.saveBgm();
};

/**
 * 重播bgm
 */
Game_System.prototype.replayBgm = function() {
    if (this._savedBgm) {
        AudioManager.replayBgm(this._savedBgm);
    }
};

/**
 * 保存行走bgm
 */
Game_System.prototype.saveWalkingBgm = function() {
    this._walkingBgm = AudioManager.saveBgm();
};

/**
 * 重播行走bgm
 */
Game_System.prototype.replayWalkingBgm = function() {
    if (this._walkingBgm) {
        AudioManager.playBgm(this._walkingBgm);
    }
};

/**
 * 保存行走bgm2 (当前地图bgm)
 */
Game_System.prototype.saveWalkingBgm2 = function() {
    this._walkingBgm = $dataMap.bgm;
};

/**
 * 主要字体
 */
Game_System.prototype.mainFontFace = function() {
    return "rmmz-mainfont, " + $dataSystem.advanced.fallbackFonts;
};

/**
 * 数字字体
 */
Game_System.prototype.numberFontFace = function() {
    return "rmmz-numberfont, " + this.mainFontFace();
};

/**
 * 主要字体大小
 */
Game_System.prototype.mainFontSize = function() {
    return $dataSystem.advanced.fontSize;
};

/**
 * 窗口填充
 */
Game_System.prototype.windowPadding = function() {
    return 12;
};

