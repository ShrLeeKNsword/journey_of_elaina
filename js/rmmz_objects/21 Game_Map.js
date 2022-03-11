//-----------------------------------------------------------------------------
// Game_Map
//
// The game object class for a map. It contains scrolling and passage
// determination functions.

/**
 * 游戏地图
 * $gameMap 
 * 地图的游戏对象类。它包含滚动和通过确认功能。
 */
function Game_Map() {
    this.initialize(...arguments);
}

/**
 * 初始化
 */
Game_Map.prototype.initialize = function() {
    /**
     * 事件解释器
     */
    this._interpreter = new Game_Interpreter();
    /** 地图id */
    this._mapId = 0;
    /** 图块设置id */
    this._tilesetId = 0;
    this._events = [];
    this._commonEvents = [];
    this._vehicles = [];
    this._displayX = 0;
    this._displayY = 0;
    this._nameDisplay = true;
    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;
    this._parallaxName = "";
    this._parallaxZero = false;
    this._parallaxLoopX = false;
    this._parallaxLoopY = false;
    this._parallaxSx = 0;
    this._parallaxSy = 0;
    this._parallaxX = 0;
    this._parallaxY = 0;
    this._battleback1Name = null;
    this._battleback2Name = null;
    this.createVehicles();
};

/**
 * 安装
 * @param {number} mapId 地图id
 */
Game_Map.prototype.setup = function(mapId) {
    if (!$dataMap) {
        throw new Error("The map data is not available");
    }
    this._mapId = mapId;
    this._tilesetId = $dataMap.tilesetId;
    this._displayX = 0;
    this._displayY = 0;
    this.refereshVehicles();
    this.setupEvents();
    this.setupScroll();
    this.setupParallax();
    this.setupBattleback();
    this._needsRefresh = false;
};

/**
 * 是事件运行中
 */
Game_Map.prototype.isEventRunning = function() {
    return this._interpreter.isRunning() || this.isAnyEventStarting();
};

/**图块宽*/
Game_Map.prototype.tileWidth = function() {
    return 48;
};

/**图块高*/
Game_Map.prototype.tileHeight = function() {
    return 48;
};

/**地图id*/
Game_Map.prototype.mapId = function() {
    return this._mapId;
};

/**图块设置id*/
Game_Map.prototype.tilesetId = function() {
    return this._tilesetId;
};

/**显示x*/
Game_Map.prototype.displayX = function() {
    return this._displayX;
};

/**显示y*/
Game_Map.prototype.displayY = function() {
    return this._displayY;
};

/**远景图名称*/
Game_Map.prototype.parallaxName = function() {
    return this._parallaxName;
};

/**战斗背景1名称*/
Game_Map.prototype.battleback1Name = function() {
    return this._battleback1Name;
};

/**战斗背景2名称*/
Game_Map.prototype.battleback2Name = function() {
    return this._battleback2Name;
};

/**请求刷新*/
Game_Map.prototype.requestRefresh = function() {
    this._needsRefresh = true;
};

/**是名称显示允许*/
Game_Map.prototype.isNameDisplayEnabled = function() {
    return this._nameDisplay;
};

/**禁止名称显示*/
Game_Map.prototype.disableNameDisplay = function() {
    this._nameDisplay = false;
};

/**能够名称显示*/
Game_Map.prototype.enableNameDisplay = function() {
    this._nameDisplay = true;
};

/**创造交通工具组*/
Game_Map.prototype.createVehicles = function() {
    this._vehicles = [];
    this._vehicles[0] = new Game_Vehicle("boat");
    this._vehicles[1] = new Game_Vehicle("ship");
    this._vehicles[2] = new Game_Vehicle("airship");
};

/**刷新交通工具组*/
Game_Map.prototype.refereshVehicles = function() {
    for (const vehicle of this._vehicles) {
        vehicle.refresh();
    }
};

/**交通工具组*/
Game_Map.prototype.vehicles = function() {
    return this._vehicles;
};

/**交通工具*/
Game_Map.prototype.vehicle = function(type) {
    if (type === 0 || type === "boat") {
        return this.boat();
    } else if (type === 1 || type === "ship") {
        return this.ship();
    } else if (type === 2 || type === "airship") {
        return this.airship();
    } else {
        return null;
    }
};

/**小船*/
Game_Map.prototype.boat = function() {
    return this._vehicles[0];
};

/**帆船*/
Game_Map.prototype.ship = function() {
    return this._vehicles[1];
};

/**天空船*/
Game_Map.prototype.airship = function() {
    return this._vehicles[2];
};

/**安装事件组*/
Game_Map.prototype.setupEvents = function() {
    this._events = [];
    this._commonEvents = [];
    for (const event of $dataMap.events.filter(event => !!event)) {
        this._events[event.id] = new Game_Event(this._mapId, event.id);
    }
    for (const commonEvent of this.parallelCommonEvents()) {
        this._commonEvents.push(new Game_CommonEvent(commonEvent.id));
    }
    this.refreshTileEvents();
};

/**事件组*/
Game_Map.prototype.events = function() {
    return this._events.filter(event => !!event);
};

/**事件*/
Game_Map.prototype.event = function(eventId) {
    return this._events[eventId];
};

/**抹去事件*/
Game_Map.prototype.eraseEvent = function(eventId) {
    this._events[eventId].erase();
};

/**自动公共事件组
 * @mz 新增
*/
Game_Map.prototype.autorunCommonEvents = function() {
    return $dataCommonEvents.filter(
        commonEvent => commonEvent && commonEvent.trigger === 1
    );
};

/**并行公共事件组*/
Game_Map.prototype.parallelCommonEvents = function() {
    return $dataCommonEvents.filter(
        commonEvent => commonEvent && commonEvent.trigger === 2
    );
};

/** 
 * 安装滚动 
 */
Game_Map.prototype.setupScroll = function() {
    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;
};

/**安装远景图*/
Game_Map.prototype.setupParallax = function() {
    this._parallaxName = $dataMap.parallaxName || "";
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    this._parallaxLoopX = $dataMap.parallaxLoopX;
    this._parallaxLoopY = $dataMap.parallaxLoopY;
    this._parallaxSx = $dataMap.parallaxSx;
    this._parallaxSy = $dataMap.parallaxSy;
    this._parallaxX = 0;
    this._parallaxY = 0;
};

/**安装战斗背景*/
Game_Map.prototype.setupBattleback = function() {
    if ($dataMap.specifyBattleback) {
        this._battleback1Name = $dataMap.battleback1Name;
        this._battleback2Name = $dataMap.battleback2Name;
    } else {
        this._battleback1Name = null;
        this._battleback2Name = null;
    }
};

/**设置显示位置*/
Game_Map.prototype.setDisplayPos = function(x, y) {
    if (this.isLoopHorizontal()) {
        this._displayX = x.mod(this.width());
        this._parallaxX = x;
    } else {
        const endX = this.width() - this.screenTileX();
        this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
        this._parallaxX = this._displayX;
    }
    if (this.isLoopVertical()) {
        this._displayY = y.mod(this.height());
        this._parallaxY = y;
    } else {
        const endY = this.height() - this.screenTileY();
        this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
        this._parallaxY = this._displayY;
    }
};

/**远景图ox*/
Game_Map.prototype.parallaxOx = function() {
    if (this._parallaxZero) {
        return this._parallaxX * this.tileWidth();
    } else if (this._parallaxLoopX) {
        return (this._parallaxX * this.tileWidth()) / 2;
    } else {
        return 0;
    }
};

/**远景图oy*/
Game_Map.prototype.parallaxOy = function() {
    if (this._parallaxZero) {
        return this._parallaxY * this.tileHeight();
    } else if (this._parallaxLoopY) {
        return (this._parallaxY * this.tileHeight()) / 2;
    } else {
        return 0;
    }
};

/**图块设置*/
Game_Map.prototype.tileset = function() {
    return $dataTilesets[this._tilesetId];
};

/**图块设置标志组*/
Game_Map.prototype.tilesetFlags = function() {
    const tileset = this.tileset();
    if (tileset) {
        return tileset.flags;
    } else {
        return [];
    }
};

/**显示名称*/
Game_Map.prototype.displayName = function() {
    return $dataMap.displayName;
};

/**宽*/
Game_Map.prototype.width = function() {
    return $dataMap.width;
};

/**高*/
Game_Map.prototype.height = function() {
    return $dataMap.height;
};

/**数据*/
Game_Map.prototype.data = function() {
    return $dataMap.data;
};

/**是横向循环*/
Game_Map.prototype.isLoopHorizontal = function() {
    return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
};

/**是纵向循环*/
Game_Map.prototype.isLoopVertical = function() {
    return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
};

/**是奔跑禁止*/
Game_Map.prototype.isDashDisabled = function() {
    return $dataMap.disableDashing;
};

/**遭遇表*/
Game_Map.prototype.encounterList = function() {
    return $dataMap.encounterList;
};

/**遭遇步数*/
Game_Map.prototype.encounterStep = function() {
    return $dataMap.encounterStep;
};

/**是大地图*/
Game_Map.prototype.isOverworld = function() {
    return this.tileset() && this.tileset().mode === 0;
};

/**画面显示图块x*/
Game_Map.prototype.screenTileX = function() {
    return Graphics.width / this.tileWidth();
};

/**画面显示图块y*/
Game_Map.prototype.screenTileY = function() {
    return Graphics.height / this.tileHeight();
};

/**校正x(显示区域的x)*/
Game_Map.prototype.adjustX = function(x) {
    if (
        this.isLoopHorizontal() &&
        x < this._displayX - (this.width() - this.screenTileX()) / 2
    ) {
        return x - this._displayX + $dataMap.width;
    } else {
        return x - this._displayX;
    }
};

/**校正y(显示区域的y)*/
Game_Map.prototype.adjustY = function(y) {
    if (
        this.isLoopVertical() &&
        y < this._displayY - (this.height() - this.screenTileY()) / 2
    ) {
        return y - this._displayY + $dataMap.height;
    } else {
        return y - this._displayY;
    }
};

/**环x*/
Game_Map.prototype.roundX = function(x) {
    return this.isLoopHorizontal() ? x.mod(this.width()) : x;
};

/**环y*/
Game_Map.prototype.roundY = function(y) {
    return this.isLoopVertical() ? y.mod(this.height()) : y;
};

/**x和方向*/
Game_Map.prototype.xWithDirection = function(x, d) {
    return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
};

/**y和方向*/
Game_Map.prototype.yWithDirection = function(y, d) {
    return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
};

/**环x和方向*/
Game_Map.prototype.roundXWithDirection = function(x, d) {
    return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
};

/**环y和方向*/
Game_Map.prototype.roundYWithDirection = function(y, d) {
    return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
};

/**三角x*/
Game_Map.prototype.deltaX = function(x1, x2) {
    let result = x1 - x2;
    if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
        if (result < 0) {
            result += this.width();
        } else {
            result -= this.width();
        }
    }
    return result;
};

/**三角y*/
Game_Map.prototype.deltaY = function(y1, y2) {
    let result = y1 - y2;
    if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
        if (result < 0) {
            result += this.height();
        } else {
            result -= this.height();
        }
    }
    return result;
};

/**距离*/
Game_Map.prototype.distance = function(x1, y1, x2, y2) {
    return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
};

/**画布到地图x*/
Game_Map.prototype.canvasToMapX = function(x) {
    const tileWidth = this.tileWidth();
    const originX = this._displayX * tileWidth;
    const mapX = Math.floor((originX + x) / tileWidth);
    return this.roundX(mapX);
};

/**画布到地图y*/
Game_Map.prototype.canvasToMapY = function(y) {
    const tileHeight = this.tileHeight();
    const originY = this._displayY * tileHeight;
    const mapY = Math.floor((originY + y) / tileHeight);
    return this.roundY(mapY);
};

/**自动播放*/
Game_Map.prototype.autoplay = function() {
    if ($dataMap.autoplayBgm) {
        if ($gamePlayer.isInVehicle()) {
            $gameSystem.saveWalkingBgm2();
        } else {
            AudioManager.playBgm($dataMap.bgm);
        }
    }
    if ($dataMap.autoplayBgs) {
        AudioManager.playBgs($dataMap.bgs);
    }
};

/**刷新如果需要*/
Game_Map.prototype.refreshIfNeeded = function() {
    if (this._needsRefresh) {
        this.refresh();
    }
};

/**刷新*/
Game_Map.prototype.refresh = function() {
    for (const event of this.events()) {
        event.refresh();
    }
    for (const commonEvent of this._commonEvents) {
        commonEvent.refresh();
    }
    this.refreshTileEvents();
    this._needsRefresh = false;
};

/**刷新图块事件组*/
Game_Map.prototype.refreshTileEvents = function() {
    this._tileEvents = this.events().filter(event => event.isTile());
};

/**事件组xy*/
Game_Map.prototype.eventsXy = function(x, y) {
    return this.events().filter(event => event.pos(x, y));
};

/**事件组xy无穿越*/
Game_Map.prototype.eventsXyNt = function(x, y) {
    return this.events().filter(event => event.posNt(x, y));
};

/**图块事件组xy*/
Game_Map.prototype.tileEventsXy = function(x, y) {
    return this._tileEvents.filter(event => event.posNt(x, y));
};

/**事件idxy*/
Game_Map.prototype.eventIdXy = function(x, y) {
    const list = this.eventsXy(x, y);
    return list.length === 0 ? 0 : list[0].eventId();
};

/**滚动向下*/
Game_Map.prototype.scrollDown = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY += distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        const lastY = this._displayY;
        this._displayY = Math.min(
            this._displayY + distance,
            this.height() - this.screenTileY()
        );
        this._parallaxY += this._displayY - lastY;
    }
};

/**滚动向左*/
Game_Map.prototype.scrollLeft = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += $dataMap.width - distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX -= distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        const lastX = this._displayX;
        this._displayX = Math.max(this._displayX - distance, 0);
        this._parallaxX += this._displayX - lastX;
    }
};

/**滚动向右*/
Game_Map.prototype.scrollRight = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX += distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        const lastX = this._displayX;
        this._displayX = Math.min(
            this._displayX + distance,
            this.width() - this.screenTileX()
        );
        this._parallaxX += this._displayX - lastX;
    }
};

/**滚动向上*/
Game_Map.prototype.scrollUp = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += $dataMap.height - distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY -= distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        const lastY = this._displayY;
        this._displayY = Math.max(this._displayY - distance, 0);
        this._parallaxY += this._displayY - lastY;
    }
};

/**是有效的*/
Game_Map.prototype.isValid = function(x, y) {
    return x >= 0 && x < this.width() && y >= 0 && y < this.height();
};

/**检查通道*/
Game_Map.prototype.checkPassage = function(x, y, bit) {
    const flags = this.tilesetFlags();
    const tiles = this.allTiles(x, y);
    for (const tile of tiles) {
        const flag = flags[tile];
        if ((flag & 0x10) !== 0) {
            // [*] No effect on passage
            continue;
        }
        if ((flag & bit) === 0) {
            // [o] Passable
            return true;
        }
        if ((flag & bit) === bit) {
            // [x] Impassable
            return false;
        }
    }
    return false;
};

/**图块id*/
Game_Map.prototype.tileId = function(x, y, z) {
    const width = $dataMap.width;
    const height = $dataMap.height;
    return $dataMap.data[(z * height + y) * width + x] || 0;
};

/**层图块组*/
Game_Map.prototype.layeredTiles = function(x, y) {
    const tiles = [];
    for (let i = 0; i < 4; i++) {
        tiles.push(this.tileId(x, y, 3 - i));
    }
    return tiles;
};

/**所有图块组*/
Game_Map.prototype.allTiles = function(x, y) {
    const tiles = this.tileEventsXy(x, y).map(event => event.tileId());
    return tiles.concat(this.layeredTiles(x, y));
};

/**自动图块种类*/
Game_Map.prototype.autotileType = function(x, y, z) {
    const tileId = this.tileId(x, y, z);
    return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
};

/**是可通行的*/
Game_Map.prototype.isPassable = function(x, y, d) {
    return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
};

/**是小船可通行的*/
Game_Map.prototype.isBoatPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0200);
};

/**是帆船可通行的*/
Game_Map.prototype.isShipPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0400);
};

/**是天空船陆地可以*/
Game_Map.prototype.isAirshipLandOk = function(x, y) {
    return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
};

/**检查层图块标志*/
Game_Map.prototype.checkLayeredTilesFlags = function(x, y, bit) {
    const flags = this.tilesetFlags();
    return this.layeredTiles(x, y).some(tileId => (flags[tileId] & bit) !== 0);
};

/**是梯子*/
Game_Map.prototype.isLadder = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
};

/**是灌木丛*/
Game_Map.prototype.isBush = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
};

/**是柜台*/
Game_Map.prototype.isCounter = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
};

/**是伤害地形*/
Game_Map.prototype.isDamageFloor = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
};

/**地域标签*/
Game_Map.prototype.terrainTag = function(x, y) {
    if (this.isValid(x, y)) {
        const flags = this.tilesetFlags();
        const tiles = this.layeredTiles(x, y);
        for (const tile of tiles) {
            const tag = flags[tile] >> 12;
            if (tag > 0) {
                return tag;
            }
        }
    }
    return 0;
};

/**区域id*/
Game_Map.prototype.regionId = function(x, y) {
    return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
};

/**开始滚动*/
Game_Map.prototype.startScroll = function(direction, distance, speed) {
    this._scrollDirection = direction;
    this._scrollRest = distance;
    this._scrollSpeed = speed;
};

/**是滚动中*/
Game_Map.prototype.isScrolling = function() {
    return this._scrollRest > 0;
};

/**更新*/
Game_Map.prototype.update = function(sceneActive) {
    this.refreshIfNeeded();
    if (sceneActive) {
        this.updateInterpreter();
    }
    this.updateScroll();
    this.updateEvents();
    this.updateVehicles();
    this.updateParallax();
};

/**更新滚动*/
Game_Map.prototype.updateScroll = function() {
    if (this.isScrolling()) {
        const lastX = this._displayX;
        const lastY = this._displayY;
        this.doScroll(this._scrollDirection, this.scrollDistance());
        if (this._displayX === lastX && this._displayY === lastY) {
            this._scrollRest = 0;
        } else {
            this._scrollRest -= this.scrollDistance();
        }
    }
};

/**滚动距离*/
Game_Map.prototype.scrollDistance = function() {
    return Math.pow(2, this._scrollSpeed) / 256;
};

/**做滚动*/
Game_Map.prototype.doScroll = function(direction, distance) {
    switch (direction) {
        case 2:
            this.scrollDown(distance);
            break;
        case 4:
            this.scrollLeft(distance);
            break;
        case 6:
            this.scrollRight(distance);
            break;
        case 8:
            this.scrollUp(distance);
            break;
    }
};

/**更新事件组*/
Game_Map.prototype.updateEvents = function() {
    for (const event of this.events()) {
        event.update();
    }
    for (const commonEvent of this._commonEvents) {
        commonEvent.update();
    }
};

/**更新交通工具组*/
Game_Map.prototype.updateVehicles = function() {
    for (const vehicle of this._vehicles) {
        vehicle.update();
    }
};

/**更新远景图*/
Game_Map.prototype.updateParallax = function() {
    if (this._parallaxLoopX) {
        this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
    }
    if (this._parallaxLoopY) {
        this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
    }
};

/**改变图块设置*/
Game_Map.prototype.changeTileset = function(tilesetId) {
    this._tilesetId = tilesetId;
    this.refresh();
};

/**改变战斗背景*/
Game_Map.prototype.changeBattleback = function(
    battleback1Name,
    battleback2Name
) {
    this._battleback1Name = battleback1Name;
    this._battleback2Name = battleback2Name;
};

/**改变远景图*/
Game_Map.prototype.changeParallax = function(name, loopX, loopY, sx, sy) {
    this._parallaxName = name;
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    if (this._parallaxLoopX && !loopX) {
        this._parallaxX = 0;
    }
    if (this._parallaxLoopY && !loopY) {
        this._parallaxY = 0;
    }
    this._parallaxLoopX = loopX;
    this._parallaxLoopY = loopY;
    this._parallaxSx = sx;
    this._parallaxSy = sy;
};

/**更新事件解释器*/
Game_Map.prototype.updateInterpreter = function() {
    for (;;) {
        this._interpreter.update();
        if (this._interpreter.isRunning()) {
            return;
        }
        if (this._interpreter.eventId() > 0) {
            this.unlockEvent(this._interpreter.eventId());
            this._interpreter.clear();
        }
        if (!this.setupStartingEvent()) {
            return;
        }
    }
};

/**解锁事件*/
Game_Map.prototype.unlockEvent = function(eventId) {
    if (this._events[eventId]) {
        this._events[eventId].unlock();
    }
};

/**安装开始事件*/
Game_Map.prototype.setupStartingEvent = function() {
    this.refreshIfNeeded();
    if (this._interpreter.setupReservedCommonEvent()) {
        return true;
    }
    if (this.setupTestEvent()) {
        return true;
    }
    if (this.setupStartingMapEvent()) {
        return true;
    }
    if (this.setupAutorunCommonEvent()) {
        return true;
    }
    return false;
};

/**安装测试事件*/
Game_Map.prototype.setupTestEvent = function() {
    if (window.$testEvent) {
        this._interpreter.setup($testEvent, 0);
        $testEvent = null;
        return true;
    }
    return false;
};

/**安装开始地图事件*/
Game_Map.prototype.setupStartingMapEvent = function() {
    for (const event of this.events()) {
        if (event.isStarting()) {
            event.clearStartingFlag();
            this._interpreter.setup(event.list(), event.eventId());
            return true;
        }
    }
    return false;
};

/**安装自动公共事件*/
Game_Map.prototype.setupAutorunCommonEvent = function() {
    for (const commonEvent of this.autorunCommonEvents()) {
        if ($gameSwitches.value(commonEvent.switchId)) {
            this._interpreter.setup(commonEvent.list);
            return true;
        }
    }
    return false;
};

/**是任何事件开始*/
Game_Map.prototype.isAnyEventStarting = function() {
    return this.events().some(event => event.isStarting());
};

