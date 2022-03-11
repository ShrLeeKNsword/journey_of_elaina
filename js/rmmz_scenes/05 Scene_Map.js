//-----------------------------------------------------------------------------
// Scene_Map
//
// The scene class of the map screen.

/**
 * 场景地图
 * 
 * 地图画面的场景类。
 */
function Scene_Map() {
    this.initialize(...arguments);
}

Scene_Map.prototype = Object.create(Scene_Message.prototype);
Scene_Map.prototype.constructor = Scene_Map;

/**
 * 初始化
 */
Scene_Map.prototype.initialize = function() {
    Scene_Message.prototype.initialize.call(this);
    this._waitCount = 0;
    this._encounterEffectDuration = 0;
    this._mapLoaded = false;
    this._touchCount = 0;
    this._menuEnabled = false;
};

/**
 * 创建
 */
Scene_Map.prototype.create = function() {
    Scene_Message.prototype.create.call(this);
    this._transfer = $gamePlayer.isTransferring();
    this._lastMapWasNull = !$dataMap;
    if (this._transfer) {
        DataManager.loadMapData($gamePlayer.newMapId());
        this.onTransfer();
    } else if (!$dataMap || $dataMap.id !== $gameMap.mapId()) {
        DataManager.loadMapData($gameMap.mapId());
    }
};

/**
 * 是准备好的
 */
Scene_Map.prototype.isReady = function() {
    if (!this._mapLoaded && DataManager.isMapLoaded()) {
        this.onMapLoaded();
        this._mapLoaded = true;
    }
    return this._mapLoaded && Scene_Message.prototype.isReady.call(this);
};

/**
 * 当地图加载后
 */
Scene_Map.prototype.onMapLoaded = function() {
    if (this._transfer) {
        $gamePlayer.performTransfer();
    }
    this.createDisplayObjects();
};

/**
 * 当转移时
 */
Scene_Map.prototype.onTransfer = function() {
    ImageManager.clear();
    EffectManager.clear();
};

/**
 * 开始
 */
Scene_Map.prototype.start = function() {
    Scene_Message.prototype.start.call(this);
    SceneManager.clearStack();
    if (this._transfer) {
        this.fadeInForTransfer();
        this.onTransferEnd();
    } else if (this.needsFadeIn()) {
        this.startFadeIn(this.fadeSpeed(), false);
    }
    this.menuCalling = false;
};

/**
 * 当转移结束时
 */
Scene_Map.prototype.onTransferEnd = function() {
    this._mapNameWindow.open();
    $gameMap.autoplay();
    if (this.shouldAutosave()) {
        this.requestAutosave();
    }
};

/**
 * 需要自动保存
 */
Scene_Map.prototype.shouldAutosave = function() {
    return !this._lastMapWasNull;
};

/**
 * 更新 
 */
Scene_Map.prototype.update = function() {
    Scene_Message.prototype.update.call(this);
    this.updateDestination();
    this.updateMenuButton();
    this.updateMapNameWindow();
    this.updateMainMultiply();
    if (this.isSceneChangeOk()) {
        this.updateScene();
    } else if (SceneManager.isNextScene(Scene_Battle)) {
        this.updateEncounterEffect();
    }
    this.updateWaitCount();
};

/**
 * 更新主要加速
 */
Scene_Map.prototype.updateMainMultiply = function() {
    if (this.isFastForward()) {
        this.updateMain();
    }
    this.updateMain();
};

/**
 * 更新主要
 */
Scene_Map.prototype.updateMain = function() {
    $gameMap.update(this.isActive());
    $gamePlayer.update(this.isPlayerActive());
    $gameTimer.update(this.isActive());
    $gameScreen.update();
};

/**
 * 是玩家活动的
 */
Scene_Map.prototype.isPlayerActive = function() {
    return this.isActive() && !this.isFading();
};

/**
 * 是快进
 */
Scene_Map.prototype.isFastForward = function() {
    return (
        $gameMap.isEventRunning() &&
        !SceneManager.isSceneChanging() &&
        (Input.isLongPressed("ok") || TouchInput.isLongPressed())
    );
};

/**
 * 停止
 */
Scene_Map.prototype.stop = function() {
    Scene_Message.prototype.stop.call(this);
    $gamePlayer.straighten();
    this._mapNameWindow.close();
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else if (SceneManager.isNextScene(Scene_Map)) {
        this.fadeOutForTransfer();
    } else if (SceneManager.isNextScene(Scene_Battle)) {
        this.launchBattle();
    }
};

/**
 * 是忙碌的
 */
Scene_Map.prototype.isBusy = function() {
    return (
        this.isMessageWindowClosing() ||
        this._waitCount > 0 ||
        this._encounterEffectDuration > 0 ||
        Scene_Message.prototype.isBusy.call(this)
    );
};

/**
 * 终止
 */
Scene_Map.prototype.terminate = function() {
    Scene_Message.prototype.terminate.call(this);
    if (!SceneManager.isNextScene(Scene_Battle)) {
        this._spriteset.update();
        this._mapNameWindow.hide();
        this.hideMenuButton();
        SceneManager.snapForBackground();
    }
    $gameScreen.clearZoom();
};

/**
 * 需要淡入
 */
Scene_Map.prototype.needsFadeIn = function() {
    return (
        SceneManager.isPreviousScene(Scene_Battle) ||
        SceneManager.isPreviousScene(Scene_Load)
    );
};

/**
 * 需要缓慢淡出
 */
Scene_Map.prototype.needsSlowFadeOut = function() {
    return (
        SceneManager.isNextScene(Scene_Title) ||
        SceneManager.isNextScene(Scene_Gameover)
    );
};

/**
 * 更新等待计数
 */
Scene_Map.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    }
    return false;
};

/**
 * 更新目的地
 */
Scene_Map.prototype.updateDestination = function() {
    if (this.isMapTouchOk()) {
        this.processMapTouch();
    } else {
        $gameTemp.clearDestination();
        this._touchCount = 0;
    }
};

/**
 * 更新菜单按钮
 */
Scene_Map.prototype.updateMenuButton = function() {
    if (this._menuButton) {
        const menuEnabled = this.isMenuEnabled();
        if (menuEnabled === this._menuEnabled) {
            this._menuButton.visible = this._menuEnabled;
        } else {
            this._menuEnabled = menuEnabled;
        }
    }
};

/**
 * 隐藏菜单按钮
 */
Scene_Map.prototype.hideMenuButton = function() {
    if (this._menuButton) {
        this._menuButton.visible = false;
        this._menuEnabled = false;
    }
};

/**
 * 更新地图名称窗口
 */
Scene_Map.prototype.updateMapNameWindow = function() {
    if ($gameMessage.isBusy()) {
        this._mapNameWindow.close();
    }
};

/**
 * 是菜单启用
 */
Scene_Map.prototype.isMenuEnabled = function() {
    return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning();
};

/**
 * 是地图触摸确定 
 */
Scene_Map.prototype.isMapTouchOk = function() {
    return this.isActive() && $gamePlayer.canMove();
};

/**
 * 处理地图触摸
 */
Scene_Map.prototype.processMapTouch = function() {
    if (TouchInput.isTriggered() || this._touchCount > 0) {
        if (TouchInput.isPressed() && !this.isAnyButtonPressed()) {
            if (this._touchCount === 0 || this._touchCount >= 15) {
                this.onMapTouch();
            }
            this._touchCount++;
        } else {
            this._touchCount = 0;
        }
    }
};

/**
 * 是按下任何按钮
 */
Scene_Map.prototype.isAnyButtonPressed = function() {
    return this._menuButton && this._menuButton.isPressed();
};

/**
 * 当地图触摸
 */
Scene_Map.prototype.onMapTouch = function() {
    const x = $gameMap.canvasToMapX(TouchInput.x);
    const y = $gameMap.canvasToMapY(TouchInput.y);
    $gameTemp.setDestination(x, y);
};

/**
 * 是场景更改可以
 */
Scene_Map.prototype.isSceneChangeOk = function() {
    return this.isActive() && !$gameMessage.isBusy();
};

/**
 * 更新场景
 */
Scene_Map.prototype.updateScene = function() {
    this.checkGameover();
    if (!SceneManager.isSceneChanging()) {
        this.updateTransferPlayer();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateEncounter();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateCallMenu();
    }
    if (!SceneManager.isSceneChanging()) {
        this.updateCallDebug();
    }
};

/**
 * 创建显示对象组
 */
Scene_Map.prototype.createDisplayObjects = function() {
    this.createSpriteset();
    this.createWindowLayer();
    this.createAllWindows();
    this.createButtons();
};

/**
 * 创建精灵组
 */
Scene_Map.prototype.createSpriteset = function() {
    this._spriteset = new Spriteset_Map();
    this.addChild(this._spriteset);
    this._spriteset.update();
};

/**
 * 创建所有窗口
 */
Scene_Map.prototype.createAllWindows = function() {
    this.createMapNameWindow();
    Scene_Message.prototype.createAllWindows.call(this);
};

/**
 * 创建地图名称窗口
 */
Scene_Map.prototype.createMapNameWindow = function() {
    const rect = this.mapNameWindowRect();
    this._mapNameWindow = new Window_MapName(rect);
    this.addWindow(this._mapNameWindow);
};

/**
 * 地图名称窗口矩形
 */
Scene_Map.prototype.mapNameWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = 360;
    const wh = this.calcWindowHeight(1, false);
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建按钮组
 */
Scene_Map.prototype.createButtons = function() {
    if (ConfigManager.touchUI) {
        this.createMenuButton();
    }
};

/**
 * 创建菜单按钮
 */
Scene_Map.prototype.createMenuButton = function() {
    this._menuButton = new Sprite_Button("menu");
    this._menuButton.x = Graphics.boxWidth - this._menuButton.width - 4;
    this._menuButton.y = this.buttonY();
    this._menuButton.visible = false;
    this.addWindow(this._menuButton);
};

/**
 * 更新传送玩家
 */
Scene_Map.prototype.updateTransferPlayer = function() {
    if ($gamePlayer.isTransferring()) {
        SceneManager.goto(Scene_Map);
    }
};

/**
 * 更新遭遇
 */
Scene_Map.prototype.updateEncounter = function() {
    if ($gamePlayer.executeEncounter()) {
        SceneManager.push(Scene_Battle);
    }
};

/**
 * 更新调用菜单
 */
Scene_Map.prototype.updateCallMenu = function() {
    if (this.isMenuEnabled()) {
        if (this.isMenuCalled()) {
            this.menuCalling = true;
        }
        if (this.menuCalling && !$gamePlayer.isMoving()) {
            this.callMenu();
        }
    } else {
        this.menuCalling = false;
    }
};

/**
 * 是菜单调用的
 */
Scene_Map.prototype.isMenuCalled = function() {
    return Input.isTriggered("menu") || TouchInput.isCancelled();
};

/**
 * 调用菜单
 */
Scene_Map.prototype.callMenu = function() {
    SoundManager.playOk();
    SceneManager.push(Scene_Menu);
    Window_MenuCommand.initCommandPosition();
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};

/**
 * 更新调用调试
 */
Scene_Map.prototype.updateCallDebug = function() {
    if (this.isDebugCalled()) {
        SceneManager.push(Scene_Debug);
    }
};

/**
 * 是调试调用的
 */
Scene_Map.prototype.isDebugCalled = function() {
    return Input.isTriggered("debug") && $gameTemp.isPlaytest();
};

/**
 * 淡入为了传送
 */
Scene_Map.prototype.fadeInForTransfer = function() {
    const fadeType = $gamePlayer.fadeType();
    switch (fadeType) {
        case 0:
        case 1:
            this.startFadeIn(this.fadeSpeed(), fadeType === 1);
            break;
    }
};

/**
 * 淡出为了传送
 */
Scene_Map.prototype.fadeOutForTransfer = function() {
    const fadeType = $gamePlayer.fadeType();
    switch (fadeType) {
        case 0:
        case 1:
            this.startFadeOut(this.fadeSpeed(), fadeType === 1);
            break;
    }
};

/**
 * 发动战斗
 */
Scene_Map.prototype.launchBattle = function() {
    BattleManager.saveBgmAndBgs();
    this.stopAudioOnBattleStart();
    SoundManager.playBattleStart();
    this.startEncounterEffect();
    this._mapNameWindow.hide();
};

/**
 * 在战斗开始时停止音频
 */
Scene_Map.prototype.stopAudioOnBattleStart = function() {
    if (!AudioManager.isCurrentBgm($gameSystem.battleBgm())) {
        AudioManager.stopBgm();
    }
    AudioManager.stopBgs();
    AudioManager.stopMe();
    AudioManager.stopSe();
};

/**
 * 开始遭遇效果
 */
Scene_Map.prototype.startEncounterEffect = function() {
    this._spriteset.hideCharacters();
    this._encounterEffectDuration = this.encounterEffectSpeed();
};

/**
 * 更新遭遇效果
 */
Scene_Map.prototype.updateEncounterEffect = function() {
    if (this._encounterEffectDuration > 0) {
        this._encounterEffectDuration--;
        const speed = this.encounterEffectSpeed();
        const n = speed - this._encounterEffectDuration;
        const p = n / speed;
        const q = ((p - 1) * 20 * p + 5) * p + 1;
        const zoomX = $gamePlayer.screenX();
        const zoomY = $gamePlayer.screenY() - 24;
        if (n === 2) {
            $gameScreen.setZoom(zoomX, zoomY, 1);
            this.snapForBattleBackground();
            this.startFlashForEncounter(speed / 2);
        }
        $gameScreen.setZoom(zoomX, zoomY, q);
        if (n === Math.floor(speed / 6)) {
            this.startFlashForEncounter(speed / 2);
        }
        if (n === Math.floor(speed / 2)) {
            BattleManager.playBattleBgm();
            this.startFadeOut(this.fadeSpeed());
        }
    }
};

/**
 * 捕捉战斗背景
 */
Scene_Map.prototype.snapForBattleBackground = function() {
    this._windowLayer.visible = false;
    SceneManager.snapForBackground();
    this._windowLayer.visible = true;
};

/**
 * 开始闪烁为了遭遇
 * @param {number} duration 持续时间 
 */
Scene_Map.prototype.startFlashForEncounter = function(duration) {
    const color = [255, 255, 255, 255];
    $gameScreen.startFlash(color, duration);
};

/**
 * 遭遇效果速度
 */
Scene_Map.prototype.encounterEffectSpeed = function() {
    return 60;
};

