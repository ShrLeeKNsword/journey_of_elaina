//-----------------------------------------------------------------------------
// Game_Message
//
// The game object class for the state of the message window that displays text
// or selections, etc.

/**
 * 游戏消息
 * 
 * 显示文本或选择的消息窗口状态的游戏对象类 。
 * 
 */
function Game_Message() {
    this.initialize(...arguments);
}

/**
 * 初始化
 */
Game_Message.prototype.initialize = function() {
    this.clear();
};

/**
 * 清除
 */
Game_Message.prototype.clear = function() {
    /**
     * 文本组
     */
    this._texts = [];
    /**
     * 选项组
     */
    this._choices = [];
    /**
     * 讲话者姓名
     */
    this._speakerName = "";
    /**
     * 脸图名称
     */
    this._faceName = "";
    /**
     * 脸图素引
     */
    this._faceIndex = 0;
    /**
     * 背景
     */
    this._background = 0;
    /**
     * 位置种类
     */
    this._positionType = 2;
    /**
     * 选项默认种类
     */
    this._choiceDefaultType = 0;
    /**
     * 选项取消种类
     */
    this._choiceCancelType = 0;
    /**
     * 选项背景
     */
    this._choiceBackground = 0;
    /**
     * 选项位置类型
     * 0 左侧 1 中间 2 右侧
     */
    this._choicePositionType = 2;
    /**
     * 名称输入变量id
     */
    this._numInputVariableId = 0;
    /**
     * 名称输入最大位数
     */
    this._numInputMaxDigits = 0;
    /**
     * 物品选择变量id
     */
    this._itemChoiceVariableId = 0;
    /**
     * 物品选择种类id 
     */
    this._itemChoiceItypeId = 0;
    /**
     * 滚动模式
     */
    this._scrollMode = false;
    /**
     * 滚动速度
     */
    this._scrollSpeed = 2;
    /**
     * 非快速滚动
     */
    this._scrollNoFast = false;
    /**
     * 选项回调函数
     */
    this._choiceCallback = null;
};

/**
 * 选择组
 */
Game_Message.prototype.choices = function() {
    return this._choices;
};

/**
 * 讲话者姓名
 */
Game_Message.prototype.speakerName = function() {
    return this._speakerName;
};

/**
 * 脸图名称
 */
Game_Message.prototype.faceName = function() {
    return this._faceName;
};

/**
 * 脸图索引
 */
Game_Message.prototype.faceIndex = function() {
    return this._faceIndex;
};

/**
 * 背景
 */
Game_Message.prototype.background = function() {
    return this._background;
};

/**
 * 位置种类
 */
Game_Message.prototype.positionType = function() {
    return this._positionType;
};


/**
 * 选项默认种类
 */
Game_Message.prototype.choiceDefaultType = function() {
    return this._choiceDefaultType;
};

/**
 * 选项取消种类
 */
Game_Message.prototype.choiceCancelType = function() {
    return this._choiceCancelType;
};

/**
 * 选项背景
 */
Game_Message.prototype.choiceBackground = function() {
    return this._choiceBackground;
};

/**
 * 选项位置种类
 */
Game_Message.prototype.choicePositionType = function() {
    return this._choicePositionType;
};

/**
 * 数字输入变量id
 */
Game_Message.prototype.numInputVariableId = function() {
    return this._numInputVariableId;
};

/**
 * 数字输入最大位数
 * 
 */
Game_Message.prototype.numInputMaxDigits = function() {
    return this._numInputMaxDigits;
};

/**
 * 物品选择变量id
 */
Game_Message.prototype.itemChoiceVariableId = function() {
    return this._itemChoiceVariableId;
};

/**
 * 物品选择种类id
 */
Game_Message.prototype.itemChoiceItypeId = function() {
    return this._itemChoiceItypeId;
};

/**
 * 滚动模式
 */
Game_Message.prototype.scrollMode = function() {
    return this._scrollMode;
};

/**
 * 滚动速度
 */
Game_Message.prototype.scrollSpeed = function() {
    return this._scrollSpeed;
};

/**
 * 滚动不快速
 */
Game_Message.prototype.scrollNoFast = function() {
    return this._scrollNoFast;
};

/**
 * 添加
 * @param {string} text 文本
 */
Game_Message.prototype.add = function(text) {
    this._texts.push(text);
};

/**
 * 设置讲话者名称
 * @param {string} speakerName 讲话者姓名
 */
Game_Message.prototype.setSpeakerName = function(speakerName) {
    this._speakerName = speakerName ? speakerName : "";
};

/**
 * 设置脸图
 * @param {string} faceName 脸图名称
 * @param {number} faceIndex 脸图索引
 */
Game_Message.prototype.setFaceImage = function(faceName, faceIndex) {
    this._faceName = faceName;
    this._faceIndex = faceIndex;
};

/**
 * 设置背景
 * @param {number} background 背景
 */
Game_Message.prototype.setBackground = function(background) {
    this._background = background;
};

/**
 * 设置位置种类
 * @param {0|1|2} positionType 位置种类 0 上 | 1 中间 | 2 下
 */
Game_Message.prototype.setPositionType = function(positionType) {
    this._positionType = positionType;
};

/**
 * 设置选项组
 * @param {[]} choices 选项组
 * @param {number} defaultType 默认种类
 * @param {number} cancelType 取消种类
 */
Game_Message.prototype.setChoices = function(choices, defaultType, cancelType) {
    this._choices = choices;
    this._choiceDefaultType = defaultType;
    this._choiceCancelType = cancelType;
};

/**
 * 设置选项背景
 * @param {number} background 背景
 */
Game_Message.prototype.setChoiceBackground = function(background) {
    this._choiceBackground = background;
};

/**
 * 设置选项位置类型
 * @param {0|1|2} positionType 位置类型 0 左侧 | 1 中间 | 2 右侧  
 */
Game_Message.prototype.setChoicePositionType = function(positionType) {
    this._choicePositionType = positionType;
};

/**
 * 设置数字数据
 * @param {number} variableId 变量id
 * @param {number} maxDigits 最大位数
 */
Game_Message.prototype.setNumberInput = function(variableId, maxDigits) {
    this._numInputVariableId = variableId;
    this._numInputMaxDigits = maxDigits;
};

/**
 * 设置物品选择
 * @param {number} variableId 选项 
 * @param {number} itemType 物品种类
 */
Game_Message.prototype.setItemChoice = function(variableId, itemType) {
    this._itemChoiceVariableId = variableId;
    this._itemChoiceItypeId = itemType;
};

/**
 * 设置滚动
 * @param {number} speed 滚动速度
 * @param {boolean} noFast 不是快速滚动 
 */
Game_Message.prototype.setScroll = function(speed, noFast) {
    this._scrollMode = true;
    this._scrollSpeed = speed;
    this._scrollNoFast = noFast;
};

/**
 * 设置选项回调函数
 * @param {function} callback 回调函数
 */
Game_Message.prototype.setChoiceCallback = function(callback) {
    this._choiceCallback = callback;
};

/**
 * 当选择选项
 * @param {*} n 
 */
Game_Message.prototype.onChoice = function(n) {
    if (this._choiceCallback) {
        this._choiceCallback(n);
        this._choiceCallback = null;
    }
};

/**
 * 有文本
 */
Game_Message.prototype.hasText = function() {
    return this._texts.length > 0;
};

/**
 * 是选项组(存在选项组)
 */
Game_Message.prototype.isChoice = function() {
    return this._choices.length > 0;
};

/**
 * 是名称数据
 */
Game_Message.prototype.isNumberInput = function() {
    return this._numInputVariableId > 0;
};

/**
 * 是物品选择
 */
Game_Message.prototype.isItemChoice = function() {
    return this._itemChoiceVariableId > 0;
};

/**
 * 是忙碌
 */
Game_Message.prototype.isBusy = function() {
    return (
        this.hasText() ||
        this.isChoice() ||
        this.isNumberInput() ||
        this.isItemChoice()
    );
};

/**
 * 新页
 */
Game_Message.prototype.newPage = function() {
    if (this._texts.length > 0) {
        this._texts[this._texts.length - 1] += "\f";
    }
};

/**
 * 全部文本
 * @returns {string} 全部文本
 */
Game_Message.prototype.allText = function() {
    return this._texts.join("\n");
};

/**
 * 是检查字符串是否包含任何阿拉伯字符。
 */
Game_Message.prototype.isRTL = function() {
    return Utils.containsArabic(this.allText());
};

