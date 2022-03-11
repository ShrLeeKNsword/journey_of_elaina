//-----------------------------------------------------------------------------
// SceneManager
//
// The static class that manages scene transitions.

/**
 * 场景管理器
 * 
 * 管理场景过渡的静态类。
 */
function SceneManager() {
    throw new Error("This is a static class");
}

/**
 * 场景
 */
SceneManager._scene = null;
/**
 * 下一个场景
 */
SceneManager._nextScene = null;
/**
 * 堆栈
 */
SceneManager._stack = [];
/**
 * 退出
 */
SceneManager._exiting = false;
/**
 * 上一个场景
 */
SceneManager._previousScene = null;
/**
 * 上一个场景的类
 */
SceneManager._previousClass = null;
/**
 * 背景位图
 */
SceneManager._backgroundBitmap = null;
/**
 * 平稳的增量时间
 */
SceneManager._smoothDeltaTime = 1;
/**
 * 经过的时间
 */
SceneManager._elapsedTime = 0;

/**
 * 运行
 * @param {Scene_Base} sceneClass 场景类
 */
SceneManager.run = function(sceneClass) {
    try {
        this.initialize();
        this.goto(sceneClass);
        Graphics.startGameLoop();
    } catch (e) {
        this.catchException(e);
    }
};

/**
 * 初始化
 */
SceneManager.initialize = function() {
    this.checkBrowser();
    this.checkPluginErrors();
    this.initGraphics();
    this.initAudio();
    this.initVideo();
    this.initInput();
    this.setupEventHandlers();
};

/**
 * 检查浏览器
 */
SceneManager.checkBrowser = function() {
    if (!Utils.canUseWebGL()) {
        throw new Error("Your browser does not support WebGL.");
    }
    if (!Utils.canUseWebAudioAPI()) {
        throw new Error("Your browser does not support Web Audio API.");
    }
    if (!Utils.canUseCssFontLoading()) {
        throw new Error("Your browser does not support CSS Font Loading.");
    }
    if (!Utils.canUseIndexedDB()) {
        throw new Error("Your browser does not support IndexedDB.");
    }
};

/**
 * 检查插件错误
 */
SceneManager.checkPluginErrors = function() {
    PluginManager.checkErrors();
};

/**
 * 初始化图形
 */
SceneManager.initGraphics = function() {
    if (!Graphics.initialize()) {
        throw new Error("Failed to initialize graphics.");
    }
    Graphics.setTickHandler(this.update.bind(this));
};

/**
 * 初始化音频
 */
SceneManager.initAudio = function() {
    WebAudio.initialize();
};

/**
 * 初始化视频
 */
SceneManager.initVideo = function() {
    Video.initialize(Graphics.width, Graphics.height);
};

/**
 * 初始化输入
 */
SceneManager.initInput = function() {
    Input.initialize();
    TouchInput.initialize();
};

/**
 * 设置事件处理程序
 */
SceneManager.setupEventHandlers = function() {
    window.addEventListener("error", this.onError.bind(this));
    window.addEventListener("unhandledrejection", this.onReject.bind(this));
    window.addEventListener("unload", this.onUnload.bind(this));
    document.addEventListener("keydown", this.onKeyDown.bind(this));
};

/**
 * 更新
 * @param {number} deltaTime 增量时间
 */
SceneManager.update = function(deltaTime) {
    try {
        const n = this.determineRepeatNumber(deltaTime);
        for (let i = 0; i < n; i++) {
            this.updateMain();
        }
    } catch (e) {
        this.catchException(e);
    }
};

/**
 * 确定重复数目
 * @param {number} deltaTime 增量时间
 */
SceneManager.determineRepeatNumber = function(deltaTime) {
    // [Note] We consider environments where the refresh rate is higher than
    //   60Hz, but ignore sudden irregular deltaTime.
    //[Note] 我们考虑刷新率高于60Hz的环境，但忽略突然的不规则增量时间。
    this._smoothDeltaTime *= 0.8;
    this._smoothDeltaTime += Math.min(deltaTime, 2) * 0.2;
    if (this._smoothDeltaTime >= 0.9) {
        this._elapsedTime = 0;
        return Math.round(this._smoothDeltaTime);
    } else {
        this._elapsedTime += deltaTime;
        if (this._elapsedTime >= 1) {
            this._elapsedTime -= 1;
            return 1;
        }
        return 0;
    }
};

/**
 * 终止
 */
SceneManager.terminate = function() {
    window.close();
};

/**
 * 当错误
 * @param {*} event 事件
 */
SceneManager.onError = function(event) {
    console.error(event.message);
    console.error(event.filename, event.lineno);
    try {
        this.stop();
        Graphics.printError("Error", event.message, event);
        AudioManager.stopAll();
    } catch (e) {
        //
    }
};

/**
 * 当拒绝时
 * @param {*} event 事件
 */
SceneManager.onReject = function(event) {
    // Catch uncaught exception in Promise
    event.message = event.reason;
    this.onError(event);
};

/**
 * 当卸载时
 */
SceneManager.onUnload = function() {
    ImageManager.clear();
    EffectManager.clear();
    AudioManager.stopAll();
};

/**
 * 按下按键
 * @param {*} event 事件
 */
SceneManager.onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
            case 116: // F5
                //重新加载游戏()
                this.reloadGame();
                break;
            case 119: // F8
                //显示开发工具()
                this.showDevTools();
                break;
        }
    }
};

/**
 * 重新加载游戏
 */
SceneManager.reloadGame = function() {
    if (Utils.isNwjs()) {
        chrome.runtime.reload();
    }
};

/**
 * 显示开发工具
 */
SceneManager.showDevTools = function() {
    if (Utils.isNwjs() && Utils.isOptionValid("test")) {
        nw.Window.get().showDevTools();
    }
};

/**
 * 捕获异常
 * @param {*} e 
 */
SceneManager.catchException = function(e) {
    if (e instanceof Error) {
        this.catchNormalError(e);
    } else if (e instanceof Array && e[0] === "LoadError") {
        this.catchLoadError(e);
    } else {
        this.catchUnknownError(e);
    }
    this.stop();
};

/**
 * 捕捉正常错误
 * @param {*} e 
 */
SceneManager.catchNormalError = function(e) {
    Graphics.printError(e.name, e.message, e);
    AudioManager.stopAll();
    console.error(e.stack);
};

/**
 * 捕获加载错误
 * @param {*} e 
 */
SceneManager.catchLoadError = function(e) {
    const url = e[1];
    const retry = e[2];
    Graphics.printError("Failed to load", url);
    if (retry) {
        Graphics.showRetryButton(() => {
            retry();
            SceneManager.resume();
        });
    } else {
        AudioManager.stopAll();
    }
};

/**
 * 捕获未知错误
 * @param {*} e 
 */
SceneManager.catchUnknownError = function(e) {
    Graphics.printError("UnknownError", String(e));
    AudioManager.stopAll();
};

/**
 * 更新主要
 */
SceneManager.updateMain = function() {
    this.updateFrameCount();
    this.updateInputData();
    this.updateEffekseer();
    this.changeScene();
    this.updateScene();
};

/**
 * 更新帧数
 */
SceneManager.updateFrameCount = function() {
    Graphics.frameCount++;
};

/**
 * 更新输入数据
 */
SceneManager.updateInputData = function() {
    Input.update();
    TouchInput.update();
};

/**
 * 更新Effekseer
 */
SceneManager.updateEffekseer = function() {
    if (Graphics.effekseer) {
        Graphics.effekseer.update();
    }
};

/**
 * 改变场景
 */
SceneManager.changeScene = function() {
    if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
        if (this._scene) {
            this._scene.terminate();
            this.onSceneTerminate();
        }
        this._scene = this._nextScene;
        this._nextScene = null;
        if (this._scene) {
            this._scene.create();
            this.onSceneCreate();
        }
        if (this._exiting) {
            this.terminate();
        }
    }
};

/**
 * 更新场景
 */
SceneManager.updateScene = function() {
    if (this._scene) {
        if (this._scene.isStarted()) {
            if (this.isGameActive()) {
                this._scene.update();
            }
        } else if (this._scene.isReady()) {
            this.onBeforeSceneStart();
            this._scene.start();
            this.onSceneStart();
        }
    }
};

/**
 * 是游戏活跃
 */
SceneManager.isGameActive = function() {
    // [Note] We use "window.top" to support an iframe.
    try {
        return window.top.document.hasFocus();
    } catch (e) {
        // SecurityError
        return true;
    }
};

/**
 * 当场景终止
 */
SceneManager.onSceneTerminate = function() {
    this._previousScene = this._scene;
    this._previousClass = this._scene.constructor;
    Graphics.setStage(null);
};

/**
 * 当场景创建
 */
SceneManager.onSceneCreate = function() {
    Graphics.startLoading();
};

/**
 * 在场景开始之前
 */
SceneManager.onBeforeSceneStart = function() {
    if (this._previousScene) {
        this._previousScene.destroy();
        this._previousScene = null;
    }
    if (Graphics.effekseer) {
        Graphics.effekseer.stopAll();
    }
};

/**
 * 当场景开始
 */
SceneManager.onSceneStart = function() {
    Graphics.endLoading();
    Graphics.setStage(this._scene);
};

/**
 * 是场景改变中
 */
SceneManager.isSceneChanging = function() {
    return this._exiting || !!this._nextScene;
};

/**
 * 是当前场景繁忙
 */
SceneManager.isCurrentSceneBusy = function() {
    return this._scene && this._scene.isBusy();
};

/**
 * 是下一个场景
 * @param {Scene_Base} sceneClass 场景类
 */
SceneManager.isNextScene = function(sceneClass) {
    return this._nextScene && this._nextScene.constructor === sceneClass;
};

/**
 * 是上一个场景
 * @param {Scene_Base} sceneClass 场景类
 */
SceneManager.isPreviousScene = function(sceneClass) {
    return this._previousClass === sceneClass;
};

/**
 * 转到
 * @param {Scene_Base} sceneClass 场景类
 */
SceneManager.goto = function(sceneClass) {
    if (sceneClass) {
        this._nextScene = new sceneClass();
    }
    if (this._scene) {
        this._scene.stop();
    }
};

/**
 * 添加到最后
 * @param {Scene_Base} sceneClass 场景类
 */
SceneManager.push = function(sceneClass) {
    this._stack.push(this._scene.constructor);
    this.goto(sceneClass);
};

/**
 * 返回最后
 */
SceneManager.pop = function() {
    if (this._stack.length > 0) {
        this.goto(this._stack.pop());
    } else {
        this.exit();
    }
};

/**
 * 退出
 */
SceneManager.exit = function() {
    this.goto(null);
    this._exiting = true;
};

/**
 * 清除堆栈
 */
SceneManager.clearStack = function() {
    this._stack = [];
};

/**
 * 停止
 */
SceneManager.stop = function() {
    Graphics.stopGameLoop();
};

/**
 * 准备下一个场景
 */
SceneManager.prepareNextScene = function() {
    this._nextScene.prepare(...arguments);
};

/**
 * 拍摄
 */
SceneManager.snap = function() {
    return Bitmap.snap(this._scene);
};

/**
 * 拍摄背景
 */
SceneManager.snapForBackground = function() {
    if (this._backgroundBitmap) {
        this._backgroundBitmap.destroy();
    }
    this._backgroundBitmap = this.snap();
};

/**
 * 背景位图
 */
SceneManager.backgroundBitmap = function() {
    return this._backgroundBitmap;
};

/**
 * 恢复
 */
SceneManager.resume = function() {
    TouchInput.update();
    Graphics.startGameLoop();
};

