//-----------------------------------------------------------------------------
/**
 * The static class that carries out graphics processing.
 * 进行图形处理的静态类。
 *
 * @namespace Graphics 图形
 */
function Graphics() {
    throw new Error("This is a static class");
}

/**
 * Initializes the graphics system.
 * 初始化图形系统。
 *
 * @returns {boolean} 如果有图形系统，则为true。True if the graphics system is available.
 * 
 * @mz 与mv相比没有了设置相应参数的输入
 */
Graphics.initialize = function() {
    this._width = 0;
    this._height = 0;
    this._defaultScale = 1;
    this._realScale = 1;
    this._errorPrinter = null;
    this._tickHandler = null;
    this._canvas = null;
    this._fpsCounter = null;
    this._loadingSpinner = null;
    this._stretchEnabled = this._defaultStretchMode();
    this._app = null;
    this._effekseer = null;
    this._wasLoading = false;

    /**
     * 帧数
     * The total frame count of the game screen.
     * 游戏画面的总帧数。
     *
     * @type number
     * @name Graphics.frameCount
     */
    this.frameCount = 0;

    /**
     * 窗口宽度
     * The width of the window display area.
     * 窗口显示区域的宽度。
     *
     * @type number
     * @name Graphics.boxWidth
     */
    this.boxWidth = this._width;

    /**
     * 窗口高度
     * The height of the window display area.
     * 窗口显示区域的高度。
     *
     * @type number
     * @name Graphics.boxHeight
     */
    this.boxHeight = this._height;

    this._updateRealScale();
    this._createAllElements();
    this._disableContextMenu();
    this._setupEventHandlers();
    this._createPixiApp();
    this._createEffekseerContext();

    return !!this._app;
};

/**
 * The PIXI.Application object.
 * PIXI.Application 应用程序对象。
 *
 * @readonly
 * @type PIXI.Application
 * @name Graphics.app
 */
Object.defineProperty(Graphics, "app", {
    get: function() {
        return this._app;
    },
    configurable: true
});

/**
 * The context object of Effekseer.
 * Effekseer的上下文对象。
 *
 * @readonly
 * @type EffekseerContext
 * @name Graphics.effekseer
 */
Object.defineProperty(Graphics, "effekseer", {
    get: function() {
        return this._effekseer;
    },
    configurable: true
});

/**
 * 设置Tick处理程序
 * Register a handler for tick events.
 * 注册一个Tick事件处理程序。
 *
 * @param {function} handler 要添加的侦听器功能以进行更新。- The listener function to be added for updates.
 */
Graphics.setTickHandler = function(handler) {
    this._tickHandler = handler;
};

/**
 * 开始游戏循环
 * Starts the game loop.
 */
Graphics.startGameLoop = function() {
    if (this._app) {
        this._app.start();
    }
};

/**
 * 停止游戏循环
 * Stops the game loop.
 */
Graphics.stopGameLoop = function() {
    if (this._app) {
        this._app.stop();
    }
};

/**
 * 设置舞台
 * Sets the stage to be rendered.
 * 设置要渲染的舞台。
 *
 * @param {Stage} stage 要渲染的舞台对象。- The stage object to be rendered.
 */
Graphics.setStage = function(stage) {
    if (this._app) {
        this._app.stage = stage;
    }
};

/**
 * 开始加载
 * Shows the loading spinner.
 * 显示加载微调器。
 */
Graphics.startLoading = function() {
    if (!document.getElementById("loadingSpinner")) {
        document.body.appendChild(this._loadingSpinner);
    }
};

/**
 * 结束加载
 * Erases the loading spinner.
 * 擦除加载微调器。
 *
 * @returns {boolean} 如果加载微调器处于活动状态，则为True。True if the loading spinner was active.
 */
Graphics.endLoading = function() {
    if (document.getElementById("loadingSpinner")) {
        document.body.removeChild(this._loadingSpinner);
        return true;
    } else {
        return false;
    }
};

/**
 * 打印错误
 * Displays the error text to the screen.
 * 在屏幕上显示错误文本。
 *
 * @param {string} name 错误的名称。- The name of the error.
 * @param {string} message 错误消息。- The message of the error.
 * @param {Error} [error] 错误对象。- The error object.
 */
Graphics.printError = function(name, message, error = null) {
    if (!this._errorPrinter) {
        this._createErrorPrinter();
    }
    this._errorPrinter.innerHTML = this._makeErrorHtml(name, message, error);
    this._wasLoading = this.endLoading();
    this._applyCanvasFilter();
};

/**
 * 显示重试按钮
 * Displays a button to try to reload resources.
 * 显示一个按钮以尝试重新加载资源。
 *
 * @param {function} retry 按下按钮时要调用的回调函数。
 * - The callback function to be called when the button
 *                           is pressed.
 */
Graphics.showRetryButton = function(retry) {
    const button = document.createElement("button");
    button.id = "retryButton";
    button.innerHTML = "Retry";
    // [Note] stopPropagation() is required for iOS Safari.
    button.ontouchstart = e => e.stopPropagation();
    button.onclick = () => {
        Graphics.eraseError();
        retry();
    };
    this._errorPrinter.appendChild(button);
    button.focus();
};

/**
 * 擦除错误
 * Erases the loading error text.
 * 清除加载错误文本。
 */
Graphics.eraseError = function() {
    if (this._errorPrinter) {
        this._errorPrinter.innerHTML = this._makeErrorHtml();
        if (this._wasLoading) {
            this.startLoading();
        }
    }
    this._clearCanvasFilter();
};

/**
 * 页面到画布X
 * Converts an x coordinate on the page to the corresponding
 * x coordinate on the canvas area.
 * 将页面上的y坐标转换为相应的画布区域上的y坐标。
 * @param {number} x -要转换页面上的x坐标。- The x coordinate on the page to be converted.
 * @returns {number} 画布区域上的x坐标。The x coordinate on the canvas area.
 */
Graphics.pageToCanvasX = function(x) {
    if (this._canvas) {
        const left = this._canvas.offsetLeft;
        return Math.round((x - left) / this._realScale);
    } else {
        return 0;
    }
};

/**
 * 页面到画布Y
 * Converts a y coordinate on the page to the corresponding
 * y coordinate on the canvas area.
 * 将页面上的y坐标转换为相应的画布区域上的y坐标。
 * @param {number} y -要转换页面上的y坐标。- The y coordinate on the page to be converted.
 * @returns {number} 画布区域上的y坐标。The y coordinate on the canvas area.
 */
Graphics.pageToCanvasY = function(y) {
    if (this._canvas) {
        const top = this._canvas.offsetTop;
        return Math.round((y - top) / this._realScale);
    } else {
        return 0;
    }
};

/**
 * Checks whether the specified point is inside the game canvas area.
 * 检查指定点是否在游戏画布区域内。
 *
 * @param {number} x -画布区域上的x坐标。- The x coordinate on the canvas area.
 * @param {number} y -画布区域上的y坐标。- The y coordinate on the canvas area.
 * @returns {boolean} 如果指定点在游戏画布区域内，则为True。True if the specified point is inside the game canvas area.
 */
Graphics.isInsideCanvas = function(x, y) {
    return x >= 0 && x < this._width && y >= 0 && y < this._height;
};

/**
 * Shows the game screen.
 * 显示游戏画面。
 */
Graphics.showScreen = function() {
    this._canvas.style.opacity = 1;
};

/**
 * Hides the game screen.
 * 隐藏游戏画面。
 */
Graphics.hideScreen = function() {
    this._canvas.style.opacity = 0;
};

/**
 * 调整大小
 * Changes the size of the game screen.
 * 更改游戏屏幕的大小。
 *
 * @param {number} width 游戏屏幕的宽度。- The width of the game screen.
 * @param {number} height 游戏屏幕的高度。- The height of the game screen.
 */
Graphics.resize = function(width, height) {
    this._width = width;
    this._height = height;
    this._updateAllElements();
};

/**
 * 宽
 * The width of the game screen.
 * 游戏屏幕的宽度。
 *
 * @type number
 * @name Graphics.width
 */
Object.defineProperty(Graphics, "宽度", {
    get: function() {
        return this._width;
    },
    set: function(value) {
        if (this._width !== value) {
            this._width = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

/**
 * 高
 * The height of the game screen.
 * 游戏屏幕的高度。
 *
 * @type number
 * @name Graphics.height
 */
Object.defineProperty(Graphics, "height", {
    get: function() {
        return this._height;
    },
    set: function(value) {
        if (this._height !== value) {
            this._height = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

/**
 * 默认比例
 * The default zoom scale of the game screen.
 * 游戏屏幕的默认缩放比例。
 *
 * @type number
 * @name Graphics.defaultScale
 */
Object.defineProperty(Graphics, "defaultScale", {
    get: function() {
        return this._defaultScale;
    },
    set: function(value) {
        if (this._defaultScale !== value) {
            this._defaultScale = value;
            this._updateAllElements();
        }
    },
    configurable: true
});

/**
 * 创建所有元素
 */
Graphics._createAllElements = function() {
    this._createErrorPrinter();
    this._createCanvas();
    this._createLoadingSpinner();
    this._createFPSCounter();
};

/**
 * 更新所有元素
 */
Graphics._updateAllElements = function() {
    this._updateRealScale();
    this._updateErrorPrinter();
    this._updateCanvas();
    this._updateVideo();
};

/**
 * 当Tick
 * @param {number} deltaTime 增量时间
 */
Graphics._onTick = function(deltaTime) {
    this._fpsCounter.startTick();
    if (this._tickHandler) {
        this._tickHandler(deltaTime);
    }
    if (this._canRender()) {
        this._app.render();
    }
    this._fpsCounter.endTick();
};

/**
 * 可以渲染
 */
Graphics._canRender = function() {
    return !!this._app.stage;
};

/**
 * 更新真实比例
 */
Graphics._updateRealScale = function() {
    if (this._stretchEnabled && this._width > 0 && this._height > 0) {
        const h = this._stretchWidth() / this._width;
        const v = this._stretchHeight() / this._height;
        this._realScale = Math.min(h, v);
        window.scrollTo(0, 0);
    } else {
        this._realScale = this._defaultScale;
    }
};

/**
 * 拉伸宽度
 */
Graphics._stretchWidth = function() {
    if (Utils.isMobileDevice()) {
        return document.documentElement.clientWidth;
    } else {
        return window.innerWidth;
    }
};

/**
 * 拉伸高度
 */
Graphics._stretchHeight = function() {
    if (Utils.isMobileDevice()) {
        // [Note] Mobile browsers often have special operations at the top and
        //   bottom of the screen.
        // [Note] 移动浏览器通常在屏幕的顶部和底部具有特殊的操作。
        const rate = Utils.isLocal() ? 1.0 : 0.9;
        return document.documentElement.clientHeight * rate;
    } else {
        return window.innerHeight;
    }
};

/**
 * 制作错误HTML
 * @param {string} name 名称
 * @param {string} message 消息
 */
Graphics._makeErrorHtml = function(name, message /*, error*/) {
    const nameDiv = document.createElement("div");
    const messageDiv = document.createElement("div");
    nameDiv.id = "errorName";
    messageDiv.id = "errorMessage";
    nameDiv.innerHTML = Utils.escapeHtml(name || "");
    messageDiv.innerHTML = Utils.escapeHtml(message || "");
    return nameDiv.outerHTML + messageDiv.outerHTML;
};

/**
 * 默认拉伸模式
 */
Graphics._defaultStretchMode = function() {
    return Utils.isNwjs() || Utils.isMobileDevice();
};

/**
 * 创建错误打印 
 */
Graphics._createErrorPrinter = function() {
    this._errorPrinter = document.createElement("div");
    this._errorPrinter.id = "errorPrinter";
    this._errorPrinter.innerHTML = this._makeErrorHtml();
    document.body.appendChild(this._errorPrinter);
};

/**
 * 更新错误打印
 */
Graphics._updateErrorPrinter = function() {
    const width = 640 * this._realScale;
    const height = 100 * this._realScale;
    this._errorPrinter.style.width = width + "px";
    this._errorPrinter.style.height = height + "px";
};

/**
 * 创建画布
 */
Graphics._createCanvas = function() {
    this._canvas = document.createElement("canvas");
    this._canvas.id = "gameCanvas";
    this._updateCanvas();
    document.body.appendChild(this._canvas);
};

/**
 * 更新画布
 */
Graphics._updateCanvas = function() {
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    this._canvas.style.zIndex = 1;
    this._centerElement(this._canvas);
};

/**
 * 更新影片
 */
Graphics._updateVideo = function() {
    const width = this._width * this._realScale;
    const height = this._height * this._realScale;
    Video.resize(width, height);
};

/**
 * 创建加载微调器
 */
Graphics._createLoadingSpinner = function() {
    const loadingSpinner = document.createElement("div");
    const loadingSpinnerImage = document.createElement("div");
    loadingSpinner.id = "loadingSpinner";
    loadingSpinnerImage.id = "loadingSpinnerImage";
    loadingSpinner.appendChild(loadingSpinnerImage);
    this._loadingSpinner = loadingSpinner;
};

/**
 * 创建FPSCounter
 */
Graphics._createFPSCounter = function() {
    this._fpsCounter = new Graphics.FPSCounter();
};

/**
 * 中心元素
 * @param {*} element 元素
 */
Graphics._centerElement = function(element) {
    const width = element.width * this._realScale;
    const height = element.height * this._realScale;
    element.style.position = "absolute";
    element.style.margin = "auto";
    element.style.top = 0;
    element.style.left = 0;
    element.style.right = 0;
    element.style.bottom = 0;
    element.style.width = width + "px";
    element.style.height = height + "px";
};

/**
 * 禁用上下文菜单
 */
Graphics._disableContextMenu = function() {
    const elements = document.body.getElementsByTagName("*");
    const oncontextmenu = () => false;
    for (const element of elements) {
        element.oncontextmenu = oncontextmenu;
    }
};

/**
 * 应用画布过滤器
 */
Graphics._applyCanvasFilter = function() {
    if (this._canvas) {
        this._canvas.style.opacity = 0.5;
        this._canvas.style.filter = "blur(8px)";
        this._canvas.style.webkitFilter = "blur(8px)";
    }
};

/**
 * 清除画布过滤器
 */
Graphics._clearCanvasFilter = function() {
    if (this._canvas) {
        this._canvas.style.opacity = 1;
        this._canvas.style.filter = "";
        this._canvas.style.webkitFilter = "";
    }
};

/**
 * 设置事件处理程序
 */
Graphics._setupEventHandlers = function() {
    window.addEventListener("resize", this._onWindowResize.bind(this));
    document.addEventListener("keydown", this._onKeyDown.bind(this));
};

/**
 * 当窗口上调整大小
 */
Graphics._onWindowResize = function() {
    this._updateAllElements();
};

/**
 * 当按下按键
 * @param {*} event 事件
 */
Graphics._onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
            case 113: // F2
                event.preventDefault();
                //切换FPS计数器
                this._switchFPSCounter();
                break;
            case 114: // F3
                event.preventDefault();
                //切换拉伸模式
                this._switchStretchMode();
                break;
            case 115: // F4
                event.preventDefault();
                //切换全屏
                this._switchFullScreen();
                break;
        }
    }
};

/**
 * 切换FPS计数器
 */
Graphics._switchFPSCounter = function() {
    this._fpsCounter.switchMode();
};

/**
 * 切换拉伸模式
 */
Graphics._switchStretchMode = function() {
    this._stretchEnabled = !this._stretchEnabled;
    this._updateAllElements();
};

/**
 * 切换全屏
 */
Graphics._switchFullScreen = function() {
    if (this._isFullScreen()) {
        this._cancelFullScreen();
    } else {
        this._requestFullScreen();
    }
};

/**
 * 是全屏
 */
Graphics._isFullScreen = function() {
    return (
        document.fullScreenElement ||
        document.mozFullScreen ||
        document.webkitFullscreenElement
    );
};

/**
 * 请求全屏
 */
Graphics._requestFullScreen = function() {
    const element = document.body;
    if (element.requestFullScreen) {
        element.requestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
};

/**
 * 取消全屏
 */
Graphics._cancelFullScreen = function() {
    if (document.cancelFullScreen) {
        document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
};

/**
 * 创建Pixi App
 */
Graphics._createPixiApp = function() {
    try {
        this._setupPixi();
        this._app = new PIXI.Application({
            view: this._canvas,
            autoStart: false
        });
        this._app.ticker.remove(this._app.render, this._app);
        this._app.ticker.add(this._onTick, this);
    } catch (e) {
        this._app = null;
    }
};

/**
 * 安装Pixi 
 */
Graphics._setupPixi = function() {
    PIXI.utils.skipHello();
    PIXI.settings.GC_MAX_IDLE = 600;
};

/**
 * 创建Effekseer上下文
 */
Graphics._createEffekseerContext = function() {
    if (this._app && window.effekseer) {
        try {
            this._effekseer = effekseer.createContext();
            if (this._effekseer) {
                this._effekseer.init(this._app.renderer.gl);
            }
        } catch (e) {
            this._app = null;
        }
    }
};

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// FPSCounter
//
// This is based on Darsain's FPSMeter which is under the MIT license.
// The original can be found at https://github.com/Darsain/fpsmeter.

// FPS计数器
// 它基于MIT许可下的Darsain的FPSMeter。
// 原始内容可以在https://github.com/Darsain/fpsmeter 上找到 

Graphics.FPSCounter = function() {
    this.initialize(...arguments);
};

/**
 * 初始化
 */
Graphics.FPSCounter.prototype.initialize = function() {
    this._tickCount = 0;
    this._frameTime = 100;
    this._frameStart = 0;
    this._lastLoop = performance.now() - 100;
    this._showFps = true;
    this.fps = 0;
    this.duration = 0;
    this._createElements();
    this._update();
};

/**
 * 开始tick
 */
Graphics.FPSCounter.prototype.startTick = function() {
    this._frameStart = performance.now();
};

/**
 * 结束tick
 */
Graphics.FPSCounter.prototype.endTick = function() {
    const time = performance.now();
    const thisFrameTime = time - this._lastLoop;
    this._frameTime += (thisFrameTime - this._frameTime) / 12;
    this.fps = 1000 / this._frameTime;
    this.duration = Math.max(0, time - this._frameStart);
    this._lastLoop = time;
    if (this._tickCount++ % 15 === 0) {
        this._update();
    }
};

/**
 * 切换模式
 */
Graphics.FPSCounter.prototype.switchMode = function() {
    if (this._boxDiv.style.display === "none") {
        this._boxDiv.style.display = "block";
        this._showFps = true;
    } else if (this._showFps) {
        this._showFps = false;
    } else {
        this._boxDiv.style.display = "none";
    }
    this._update();
};

/**
 * 创建元素
 */
Graphics.FPSCounter.prototype._createElements = function() {
    this._boxDiv = document.createElement("div");
    this._labelDiv = document.createElement("div");
    this._numberDiv = document.createElement("div");
    this._boxDiv.id = "fpsCounterBox";
    this._labelDiv.id = "fpsCounterLabel";
    this._numberDiv.id = "fpsCounterNumber";
    this._boxDiv.style.display = "none";
    this._boxDiv.appendChild(this._labelDiv);
    this._boxDiv.appendChild(this._numberDiv);
    document.body.appendChild(this._boxDiv);
};

/**
 * 更新
 */
Graphics.FPSCounter.prototype._update = function() {
    const count = this._showFps ? this.fps : this.duration;
    this._labelDiv.textContent = this._showFps ? "FPS" : "ms";
    this._numberDiv.textContent = count.toFixed(0);
};

