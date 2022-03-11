//-----------------------------------------------------------------------------
/**
 * 输入
 * The static class that handles input data from the keyboard and gamepads.
 * 处理来自键盘和游戏手柄的输入数据的静态类。
 *
 * @namespace
 */
function Input() {
    throw new Error("This is a static class");
}

/**
 * 初始化
 * Initializes the input system.
 * 初始化输入系统。
 */
Input.initialize = function() {
    this.clear();
    this._setupEventHandlers();
};

/**
 * 键重复等待
 * The wait time of the key repeat in frames.
 * 键重复的等待时间（以帧为单位）。
 *
 * @type number
 */
Input.keyRepeatWait = 24;

/**
 * 键重复间隔
 * The interval of the key repeat in frames.
 * 键重复的间隔（以帧为单位）。
 *
 * @type number
 */
Input.keyRepeatInterval = 6;

/**
 * 键映射
 * A hash table to convert from a virtual key code to a mapped key name.
 * 从虚拟键代码转换为映射键名称的哈希表。
 *
 * @type Object
 */
Input.keyMapper = {
    9: "tab", // tab
    13: "ok", // enter
    16: "shift", // shift
    17: "control", // control
    18: "control", // alt
    27: "escape", // escape
    32: "ok", // space
    33: "pageup", // pageup
    34: "pagedown", // pagedown
    37: "left", // left arrow
    38: "up", // up arrow
    39: "right", // right arrow
    40: "down", // down arrow
    45: "escape", // insert
    81: "pageup", // Q
    87: "pagedown", // W
    88: "escape", // X
    90: "ok", // Z
    96: "escape", // numpad 0
    98: "down", // numpad 2
    100: "left", // numpad 4
    102: "right", // numpad 6
    104: "up", // numpad 8
    120: "debug" // F9
};

/**
 * 游戏手柄映射
 * A hash table to convert from a gamepad button to a mapped key name.
 * 从游戏手柄按钮转换为映射键名的哈希表。
 *
 * @type Object
 */
Input.gamepadMapper = {
    0: "ok", // A
    1: "cancel", // B
    2: "shift", // X
    3: "menu", // Y
    4: "pageup", // LB
    5: "pagedown", // RB
    12: "up", // D-pad up
    13: "down", // D-pad down
    14: "left", // D-pad left
    15: "right" // D-pad right
};

/**
 * 清除
 * Clears all the input data.
 * 清除所有输入数据。
 */
Input.clear = function() {
    this._currentState = {};
    this._previousState = {};
    this._gamepadStates = [];
    this._latestButton = null;
    this._pressedTime = 0;
    this._dir4 = 0;
    this._dir8 = 0;
    this._preferredAxis = "";
    this._date = 0;
    this._virtualButton = null;
};

/**
 * 更新
 * Updates the input data.
 * 更新输入数据。
 */
Input.update = function() {
    this._pollGamepads();
    if (this._currentState[this._latestButton]) {
        this._pressedTime++;
    } else {
        this._latestButton = null;
    }
    for (const name in this._currentState) {
        if (this._currentState[name] && !this._previousState[name]) {
            this._latestButton = name;
            this._pressedTime = 0;
            this._date = Date.now();
        }
        this._previousState[name] = this._currentState[name];
    }
    if (this._virtualButton) {
        this._latestButton = this._virtualButton;
        this._pressedTime = 0;
        this._virtualButton = null;
    }
    this._updateDirection();
};

/**
 * 是按下
 * Checks whether a key is currently pressed down.
 * 检查当前是否按下了某个键。
 *
 * @param {string} keyName 键的映射名称。- The mapped name of the key.
 * @returns {boolean} 如果按下该键，则为true。True if the key is pressed.
 */
Input.isPressed = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isPressed("escape")) {
        return true;
    } else {
        return !!this._currentState[keyName];
    }
};

/**
 * 是触发
 * Checks whether a key is just pressed.
 * 检查是否刚按下了一个键。
 *
 * @param {string} keyName 键的映射名称。- The mapped name of the key.
 * @returns {boolean} 如果按键是触发则为真。True if the key is triggered.
 */
Input.isTriggered = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isTriggered("escape")) {
        return true;
    } else {
        return this._latestButton === keyName && this._pressedTime === 0;
    }
};

/**
 * 是重复
 * Checks whether a key is just pressed or a key repeat occurred.
 * 检查是否是刚刚下一个键或是否重复按键。
 *
 * @param {string} keyName 键的映射名称。- The mapped name of the key.
 * @returns {boolean} 如果重复按键，则为true。True if the key is repeated.
 */
Input.isRepeated = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isRepeated("escape")) {
        return true;
    } else {
        return (
            this._latestButton === keyName &&
            (this._pressedTime === 0 ||
                (this._pressedTime >= this.keyRepeatWait &&
                    this._pressedTime % this.keyRepeatInterval === 0))
        );
    }
};

/**
 * 是长按
 * Checks whether a key is kept depressed.
 * 检查按键是否保持按下状态。
 *
 * @param {string} keyName 键的映射名称。- The mapped name of the key.
 * @returns {boolean} 如果长按该键，则为true。True if the key is long-pressed.
 */
Input.isLongPressed = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isLongPressed("escape")) {
        return true;
    } else {
        return (
            this._latestButton === keyName &&
            this._pressedTime >= this.keyRepeatWait
        );
    }
};

/**
 * 4方向
 * The four direction value as a number of the numpad, or 0 for neutral.
 * 四个方向的数值，以数字键盘的数量表示；如果为零，则为0。
 *
 * @readonly
 * @type number
 * @name Input.dir4
 */
Object.defineProperty(Input, "dir4", {
    get: function() {
        return this._dir4;
    },
    configurable: true
});

/**
 * 8方向
 * The eight direction value as a number of the numpad, or 0 for neutral.
 * 八个方向的数值，以数字键盘的数量表示；如果为零，则为0。
 *
 * @readonly
 * @type number
 * @name Input.dir8
 */
Object.defineProperty(Input, "dir8", {
    get: function() {
        return this._dir8;
    },
    configurable: true
});

/**
 * 时间
 * The time of the last input in milliseconds.
 * 最后输入的时间（以毫秒为单位）。
 *
 * @readonly
 * @type number
 * @name Input.date
 */
Object.defineProperty(Input, "date", {
    get: function() {
        return this._date;
    },
    configurable: true
});

/**
 * 虚拟点击
 * @param {string} buttonName 按键名称
 * @mz 新增
 */
Input.virtualClick = function(buttonName) {
    this._virtualButton = buttonName;
};

/**
 * 安装事件处理程序
 */
Input._setupEventHandlers = function() {
    document.addEventListener("keydown", this._onKeyDown.bind(this));
    document.addEventListener("keyup", this._onKeyUp.bind(this));
    window.addEventListener("blur", this._onLostFocus.bind(this));
};

/**
 * 当键按下
 * @param {*} event 事件 
 */
Input._onKeyDown = function(event) {
    if (this._shouldPreventDefault(event.keyCode)) {
        event.preventDefault();
    }
    if (event.keyCode === 144) {
        // Numlock
        this.clear();
    }
    const buttonName = this.keyMapper[event.keyCode];
    if (buttonName) {
        this._currentState[buttonName] = true;
    }
};

/**
 * 需要防止默认
 * @param {number} keyCode 键编码
 */
Input._shouldPreventDefault = function(keyCode) {
    switch (keyCode) {
        case 8: // backspace
        case 9: // tab
        case 33: // pageup
        case 34: // pagedown
        case 37: // left arrow
        case 38: // up arrow
        case 39: // right arrow
        case 40: // down arrow
            return true;
    }
    return false;
};

/**
 * 当键抬起
 * @param {*} event 事件 
 */
Input._onKeyUp = function(event) {
    const buttonName = this.keyMapper[event.keyCode];
    if (buttonName) {
        this._currentState[buttonName] = false;
    }
};

/**
 * 当失去焦点
 */
Input._onLostFocus = function() {
    this.clear();
};

/**
 * 轮询游戏手柄
 */
Input._pollGamepads = function() {
    if (navigator.getGamepads) {
        const gamepads = navigator.getGamepads();
        if (gamepads) {
            for (const gamepad of gamepads) {
                if (gamepad && gamepad.connected) {
                    this._updateGamepadState(gamepad);
                }
            }
        }
    }
};

/**
 * 更新游戏手柄状态
 * @param {Gamepad} gamepad 游戏手柄
 */
Input._updateGamepadState = function(gamepad) {
    const lastState = this._gamepadStates[gamepad.index] || [];
    const newState = [];
    const buttons = gamepad.buttons;
    const axes = gamepad.axes;
    const threshold = 0.5;
    newState[12] = false;
    newState[13] = false;
    newState[14] = false;
    newState[15] = false;
    for (let i = 0; i < buttons.length; i++) {
        newState[i] = buttons[i].pressed;
    }
    if (axes[1] < -threshold) {
        newState[12] = true; // up
    } else if (axes[1] > threshold) {
        newState[13] = true; // down
    }
    if (axes[0] < -threshold) {
        newState[14] = true; // left
    } else if (axes[0] > threshold) {
        newState[15] = true; // right
    }
    for (let j = 0; j < newState.length; j++) {
        if (newState[j] !== lastState[j]) {
            const buttonName = this.gamepadMapper[j];
            if (buttonName) {
                this._currentState[buttonName] = newState[j];
            }
        }
    }
    this._gamepadStates[gamepad.index] = newState;
};

/**
 * 更新方向
 */
Input._updateDirection = function() {
    let x = this._signX();
    let y = this._signY();
    this._dir8 = this._makeNumpadDirection(x, y);
    if (x !== 0 && y !== 0) {
        if (this._preferredAxis === "x") {
            y = 0;
        } else {
            x = 0;
        }
    } else if (x !== 0) {
        this._preferredAxis = "y";
    } else if (y !== 0) {
        this._preferredAxis = "x";
    }
    this._dir4 = this._makeNumpadDirection(x, y);
};

/**
 * 标志X
 */
Input._signX = function() {
    const left = this.isPressed("left") ? 1 : 0;
    const right = this.isPressed("right") ? 1 : 0;
    return right - left;
};

/**
 * 标志Y
 */
Input._signY = function() {
    const up = this.isPressed("up") ? 1 : 0;
    const down = this.isPressed("down") ? 1 : 0;
    return down - up;
};

/**
 * 生成数字键盘方向
 * @param {number} x x坐标 
 * @param {number} y y坐标 
 */
Input._makeNumpadDirection = function(x, y) {
    if (x === 0 && y === 0) {
        return 0;
    } else {
        return 5 - y * 3 + x;
    }
};

/**
 * 是Escape兼容
 * @param {string} keyName 键名 
 * 当为 "cancel"  和 "menu" 时 调用 "escape"
 */
Input._isEscapeCompatible = function(keyName) {
    return keyName === "cancel" || keyName === "menu";
};

