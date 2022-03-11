//-----------------------------------------------------------------------------
/**
 * 触控输入
 * The static class that handles input data from the mouse and touchscreen.
 * 处理来自鼠标和触摸屏的输入数据的静态类。
 *
 * @namespace
 */
function TouchInput() {
    throw new Error("This is a static class");
}

/**
 * 初始化
 * Initializes the touch system.
 * 初始化触摸系统。
 */
TouchInput.initialize = function() {
    this.clear();
    this._setupEventHandlers();
};

/**
 * 键重复等待
 * The wait time of the pseudo key repeat in frames.
 * 按键重复的等待时间以帧为单位。
 *
 * @type number
 */
TouchInput.keyRepeatWait = 24;

/**
 * 键重复间隔
 * The interval of the pseudo key repeat in frames.
 * 按键重复的等待间隔以帧为单位。
 *
 * @type number
 */
TouchInput.keyRepeatInterval = 6;

/**
 * 移动阈值
 * The threshold number of pixels to treat as moved.
 * 视为移动的像素的阈值数量。
 *
 * @type number
 * @mz 新增
 */
TouchInput.moveThreshold = 10;

/**
 * 清除
 * Clears all the touch data.
 * 清除所有触摸数据。
 */
TouchInput.clear = function() {
    this._mousePressed = false;
    this._screenPressed = false;
    this._pressedTime = 0;
    this._clicked = false;
    this._newState = this._createNewState();
    this._currentState = this._createNewState();
    this._x = 0;
    this._y = 0;
    this._triggerX = 0;
    this._triggerY = 0;
    this._moved = false;
    this._date = 0;
};

/**
 * 更新
 * Updates the touch data.
 * 更新触摸数据。
 */
TouchInput.update = function() {
    this._currentState = this._newState;
    this._newState = this._createNewState();
    this._clicked = this._currentState.released && !this._moved;
    if (this.isPressed()) {
        this._pressedTime++;
    }
};

/**
 * 是点击
 * Checks whether the mouse button or touchscreen has been pressed and
 * released at the same position.
 * 检查是否在同一位置按下并释放了鼠标按钮或触摸屏。
 *
 * @returns {boolean} 如果单击鼠标按钮或触摸屏，则为true。True if the mouse button or touchscreen is clicked.
 * @mz 新增
 */
TouchInput.isClicked = function() {
    return this._clicked;
};

/**
 * 是按下
 * Checks whether the mouse button or touchscreen is currently pressed down.
 * 检查当前是否按下了鼠标按钮或触摸屏。
 *
 * @returns {boolean} True if the mouse button or touchscreen is pressed.
 */
TouchInput.isPressed = function() {
    return this._mousePressed || this._screenPressed;
};

/**
 * 是触发
 * Checks whether the left mouse button or touchscreen is just pressed.
 * 检查是否仅按下了鼠标左键或触摸屏。
 *
 * @returns {boolean} 如果触发了鼠标按钮或触摸屏，则为true。True if the mouse button or touchscreen is triggered.
 */
TouchInput.isTriggered = function() {
    return this._currentState.triggered;
};

/**
 * 是重复
 * Checks whether the left mouse button or touchscreen is just pressed
 * or a pseudo key repeat occurred.
 * 检查是否仅按下了鼠标左键或触摸屏或重复按键。
 *
 * @returns {boolean} 如果重复鼠标按钮或触摸屏，则为true。True if the mouse button or touchscreen is repeated.
 */
TouchInput.isRepeated = function() {
    return (
        this.isPressed() &&
        (this._currentState.triggered ||
            (this._pressedTime >= this.keyRepeatWait &&
                this._pressedTime % this.keyRepeatInterval === 0))
    );
};

/**
 * 是长按
 * Checks whether the left mouse button or touchscreen is kept depressed.
 * 检查鼠标左键或触摸屏是否保持按下状态。
 * 
 * @returns {boolean} 如果长按鼠标左键或触摸屏，则为true。True if the left mouse button or touchscreen is long-pressed.
 */
TouchInput.isLongPressed = function() {
    return this.isPressed() && this._pressedTime >= this.keyRepeatWait;
};

/**
 * 是取消的
 * Checks whether the right mouse button is just pressed.
 * 检查是否仅按下了鼠标右键。
 *
 * @returns {boolean} 如果仅按下鼠标右键，则为true。True if the right mouse button is just pressed.
 */
TouchInput.isCancelled = function() {
    return this._currentState.cancelled;
};

/**
 * 是移动的
 * Checks whether the mouse or a finger on the touchscreen is moved.
 * 检查触摸屏上的鼠标或手指是否移动。
 *
 * @returns {boolean} 如果移动了触摸屏上的鼠标或手指，则为true。True if the mouse or a finger on the touchscreen is moved.
 */
TouchInput.isMoved = function() {
    return this._currentState.moved;
};

/**
 * 是悬停
 * Checks whether the mouse is moved without pressing a button.
 * 检查是否在不按下按钮的情况下移动了鼠标。
 *
 * @returns {boolean} 如果将鼠标悬停，则为true。True if the mouse is hovered.
 */
TouchInput.isHovered = function() {
    return this._currentState.hovered;
};

/**
 * Checks whether the left mouse button or touchscreen is released.
 * 检查是否释放了鼠标左键或触摸屏。
 *
 * @returns {boolean} 如果释放鼠标按钮或触摸屏，则为true。True if the mouse button or touchscreen is released.
 */
TouchInput.isReleased = function() {
    return this._currentState.released;
};

/**
 * 滚动x
 * The horizontal scroll amount.
 * 水平滚动量。
 *
 * @readonly
 * @type number
 * @name TouchInput.wheelX
 */
Object.defineProperty(TouchInput, "wheelX", {
    get: function() {
        return this._currentState.wheelX;
    },
    configurable: true
});

/**
 * 滚动y
 * The vertical scroll amount.
 * 垂直滚动量。
 *
 * @readonly
 * @type number
 * @name TouchInput.wheelY
 */
Object.defineProperty(TouchInput, "wheelY", {
    get: function() {
        return this._currentState.wheelY;
    },
    configurable: true
});

/**
 * x坐标
 * The x coordinate on the canvas area of the latest touch event.
 * 最近一次触摸事件的画布区域上的x坐标。
 *
 * @readonly
 * @type number
 * @name TouchInput.x
 */
Object.defineProperty(TouchInput, "x", {
    get: function() {
        return this._x;
    },
    configurable: true
});

/**
 * y坐标
 * The y coordinate on the canvas area of the latest touch event.
 * 最近一次触摸事件的画布区域上的y坐标。
 *
 * @readonly
 * @type number
 * @name TouchInput.y
 */
Object.defineProperty(TouchInput, "y", {
    get: function() {
        return this._y;
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
 * @name TouchInput.date
 */
Object.defineProperty(TouchInput, "date", {
    get: function() {
        return this._date;
    },
    configurable: true
});

/**
 * 创建新状态
 * @mz 新增
 */
TouchInput._createNewState = function() {
    return {
        triggered: false,
        cancelled: false,
        moved: false,
        hovered: false,
        released: false,
        wheelX: 0,
        wheelY: 0
    };
};

/**
 * 安装事件处理程序
 */
TouchInput._setupEventHandlers = function() {
    const pf = { passive: false };
    document.addEventListener("mousedown", this._onMouseDown.bind(this));
    document.addEventListener("mousemove", this._onMouseMove.bind(this));
    document.addEventListener("mouseup", this._onMouseUp.bind(this));
    document.addEventListener("wheel", this._onWheel.bind(this), pf);
    document.addEventListener("touchstart", this._onTouchStart.bind(this), pf);
    document.addEventListener("touchmove", this._onTouchMove.bind(this), pf);
    document.addEventListener("touchend", this._onTouchEnd.bind(this));
    document.addEventListener("touchcancel", this._onTouchCancel.bind(this));
    window.addEventListener("blur", this._onLostFocus.bind(this));
};

/**
 * 当鼠标按下
 * @param {*} event 事件 
 */
TouchInput._onMouseDown = function(event) {
    if (event.button === 0) {
        this._onLeftButtonDown(event);
    } else if (event.button === 1) {
        this._onMiddleButtonDown(event);
    } else if (event.button === 2) {
        this._onRightButtonDown(event);
    }
};

/**
 * 当鼠标左键按下
 * @param {*} event 事件 
 */
TouchInput._onLeftButtonDown = function(event) {
    const x = Graphics.pageToCanvasX(event.pageX);
    const y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._mousePressed = true;
        this._pressedTime = 0;
        this._onTrigger(x, y);
    }
};

/**
 * 当鼠标中键按下
 */
TouchInput._onMiddleButtonDown = function(/*event*/) {
    //
};

/**
 * 当鼠标右键按下
 * @param {*} event 事件 
 */
TouchInput._onRightButtonDown = function(event) {
    const x = Graphics.pageToCanvasX(event.pageX);
    const y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._onCancel(x, y);
    }
};

/**
 * 当鼠标移动
 * @param {*} event 事件 
 */
TouchInput._onMouseMove = function(event) {
    const x = Graphics.pageToCanvasX(event.pageX);
    const y = Graphics.pageToCanvasY(event.pageY);
    if (this._mousePressed) {
        this._onMove(x, y);
    } else if (Graphics.isInsideCanvas(x, y)) {
        this._onHover(x, y);
    }
};

/**
 * 当鼠标抬起
 * @param {*} event 事件 
 */
TouchInput._onMouseUp = function(event) {
    if (event.button === 0) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        this._mousePressed = false;
        this._onRelease(x, y);
    }
};

/**
 * 当滚动
 * @param {*} event 事件 
 */
TouchInput._onWheel = function(event) {
    this._newState.wheelX += event.deltaX;
    this._newState.wheelY += event.deltaY;
    event.preventDefault();
};

/**
 * 当触摸开始
 * @param {*} event 事件 
 */
TouchInput._onTouchStart = function(event) {
    for (const touch of event.changedTouches) {
        const x = Graphics.pageToCanvasX(touch.pageX);
        const y = Graphics.pageToCanvasY(touch.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._screenPressed = true;
            this._pressedTime = 0;
            if (event.touches.length >= 2) {
                this._onCancel(x, y);
            } else {
                this._onTrigger(x, y);
            }
            event.preventDefault();
        }
    }
    if (window.cordova || window.navigator.standalone) {
        event.preventDefault();
    }
};

/**
 * 当触摸移动
 * @param {*} event 事件 
 */
TouchInput._onTouchMove = function(event) {
    for (const touch of event.changedTouches) {
        const x = Graphics.pageToCanvasX(touch.pageX);
        const y = Graphics.pageToCanvasY(touch.pageY);
        this._onMove(x, y);
    }
};

/**
 * 当触摸结束
 * @param {*} event 事件 
 */
TouchInput._onTouchEnd = function(event) {
    for (const touch of event.changedTouches) {
        const x = Graphics.pageToCanvasX(touch.pageX);
        const y = Graphics.pageToCanvasY(touch.pageY);
        this._screenPressed = false;
        this._onRelease(x, y);
    }
};

/**
 * 当触摸取消
 */
TouchInput._onTouchCancel = function(/*event*/) {
    this._screenPressed = false;
};

/**
 * 当失去焦点
 */
TouchInput._onLostFocus = function() {
    this.clear();
};

/**
 * 当触发
 * @param {number} x x坐标 
 * @param {number} y y坐标 
 */
TouchInput._onTrigger = function(x, y) {
    this._newState.triggered = true;
    this._x = x;
    this._y = y;
    this._triggerX = x;
    this._triggerY = y;
    this._moved = false;
    this._date = Date.now();
};

/**
 * 当取消
 * @param {number} x x坐标 
 * @param {number} y y坐标 
 */
TouchInput._onCancel = function(x, y) {
    this._newState.cancelled = true;
    this._x = x;
    this._y = y;
};

/**
 * 当移动
 * @param {number} x x坐标 
 * @param {number} y y坐标 
 */
TouchInput._onMove = function(x, y) {
    const dx = Math.abs(x - this._triggerX);
    const dy = Math.abs(y - this._triggerY);
    if (dx > this.moveThreshold || dy > this.moveThreshold) {
        this._moved = true;
    }
    if (this._moved) {
        this._newState.moved = true;
        this._x = x;
        this._y = y;
    }
};

/**
 * 当悬停
 * @param {number} x x坐标 
 * @param {number} y y坐标 
 * @mz 新增
 */
TouchInput._onHover = function(x, y) {
    this._newState.hovered = true;
    this._x = x;
    this._y = y;
};

/**
 * 当释放
 * @param {number} x x坐标 
 * @param {number} y y坐标 
 */
TouchInput._onRelease = function(x, y) {
    this._newState.released = true;
    this._x = x;
    this._y = y;
};

