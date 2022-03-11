//-----------------------------------------------------------------------------
// Scene_Message
//
// The superclass of Scene_Map and Scene_Battle.

/**
 * 场景消息
 * 
 * 场景地图和场景战斗的超类。
 */
function Scene_Message() {
    this.initialize(...arguments);
}

Scene_Message.prototype = Object.create(Scene_Base.prototype);
Scene_Message.prototype.constructor = Scene_Message;

/**
 * 初始化
 */
Scene_Message.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

/**
 * 是消息窗口关闭
 */
Scene_Message.prototype.isMessageWindowClosing = function() {
    return this._messageWindow.isClosing();
};

/**
 * 创建所有窗口
 */
Scene_Message.prototype.createAllWindows = function() {
    this.createMessageWindow();
    this.createScrollTextWindow();
    this.createGoldWindow();
    this.createNameBoxWindow();
    this.createChoiceListWindow();
    this.createNumberInputWindow();
    this.createEventItemWindow();
    this.associateWindows();
};

/**
 * 创建消息窗口
 */
Scene_Message.prototype.createMessageWindow = function() {
    const rect = this.messageWindowRect();
    this._messageWindow = new Window_Message(rect);
    this.addWindow(this._messageWindow);
};

/**
 * 消息窗口矩形
 */
Scene_Message.prototype.messageWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(4, false) + 8;
    const wx = (Graphics.boxWidth - ww) / 2;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建滚动文本窗口
 */
Scene_Message.prototype.createScrollTextWindow = function() {
    const rect = this.scrollTextWindowRect();
    this._scrollTextWindow = new Window_ScrollText(rect);
    this.addWindow(this._scrollTextWindow);
};

/**
 * 滚动文本窗口矩形
 */
Scene_Message.prototype.scrollTextWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = Graphics.boxHeight;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建金钱窗口
 */
Scene_Message.prototype.createGoldWindow = function() {
    const rect = this.goldWindowRect();
    this._goldWindow = new Window_Gold(rect);
    this._goldWindow.openness = 0;
    this.addWindow(this._goldWindow);
};

/**
 * 金钱窗口矩形
 */
Scene_Message.prototype.goldWindowRect = function() {
    const ww = this.mainCommandWidth();
    const wh = this.calcWindowHeight(1, true);
    const wx = Graphics.boxWidth - ww;
    const wy = 0;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建名称框窗口
 */
Scene_Message.prototype.createNameBoxWindow = function() {
    this._nameBoxWindow = new Window_NameBox();
    this.addWindow(this._nameBoxWindow);
};

/**
 * 创建选择列表窗口
 */
Scene_Message.prototype.createChoiceListWindow = function() {
    this._choiceListWindow = new Window_ChoiceList();
    this.addWindow(this._choiceListWindow);
};


/**
 * 创建数字输入窗口
 */
Scene_Message.prototype.createNumberInputWindow = function() {
    this._numberInputWindow = new Window_NumberInput();
    this.addWindow(this._numberInputWindow);
};

/**
 * 创建事件项目窗口
 */
Scene_Message.prototype.createEventItemWindow = function() {
    const rect = this.eventItemWindowRect();
    this._eventItemWindow = new Window_EventItem(rect);
    this.addWindow(this._eventItemWindow);
};

/**
 * 事件项目窗口矩形
 */
Scene_Message.prototype.eventItemWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(4, true);
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 关联窗口组
 */
Scene_Message.prototype.associateWindows = function() {
    const messageWindow = this._messageWindow;
    messageWindow.setGoldWindow(this._goldWindow);
    messageWindow.setNameBoxWindow(this._nameBoxWindow);
    messageWindow.setChoiceListWindow(this._choiceListWindow);
    messageWindow.setNumberInputWindow(this._numberInputWindow);
    messageWindow.setEventItemWindow(this._eventItemWindow);
    this._nameBoxWindow.setMessageWindow(messageWindow);
    this._choiceListWindow.setMessageWindow(messageWindow);
    this._numberInputWindow.setMessageWindow(messageWindow);
    this._eventItemWindow.setMessageWindow(messageWindow);
};

