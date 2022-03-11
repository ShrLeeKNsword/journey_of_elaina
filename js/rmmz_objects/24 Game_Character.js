//-----------------------------------------------------------------------------
// Game_Character
//
// The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.

/**
 * 游戏人物
 * 
 * 游戏玩家，游戏追随者，游戏交通工具和游戏事件的超类。
 */
function Game_Character() {
    this.initialize(...arguments);
}

Game_Character.prototype = Object.create(Game_CharacterBase.prototype);
Game_Character.prototype.constructor = Game_Character;

/**路线结束*/
Game_Character.ROUTE_END = 0;
/**路线移动下*/
Game_Character.ROUTE_MOVE_DOWN = 1;
/**路线移动左*/
Game_Character.ROUTE_MOVE_LEFT = 2;
/**路线移动右*/
Game_Character.ROUTE_MOVE_RIGHT = 3;
/**路线移动上*/
Game_Character.ROUTE_MOVE_UP = 4;
/**路线移动下左*/
Game_Character.ROUTE_MOVE_LOWER_L = 5;
/**路线移动下右*/
Game_Character.ROUTE_MOVE_LOWER_R = 6;
/**路线移动上左*/
Game_Character.ROUTE_MOVE_UPPER_L = 7;
/**路线移动上右*/
Game_Character.ROUTE_MOVE_UPPER_R = 8;
/**路线移动随机*/
Game_Character.ROUTE_MOVE_RANDOM = 9;
/**路线移动接近*/
Game_Character.ROUTE_MOVE_TOWARD = 10;
/**路线移动远离*/
Game_Character.ROUTE_MOVE_AWAY = 11;
/**路线移动前进*/
Game_Character.ROUTE_MOVE_FORWARD = 12;
/**路线移动后退*/
Game_Character.ROUTE_MOVE_BACKWARD = 13;
/**路线跳*/
Game_Character.ROUTE_JUMP = 14;
/**路线等待*/
Game_Character.ROUTE_WAIT = 15;
/**路线转下*/
Game_Character.ROUTE_TURN_DOWN = 16;
/**路线转左*/
Game_Character.ROUTE_TURN_LEFT = 17;
/**路线转右*/
Game_Character.ROUTE_TURN_RIGHT = 18;
/**路线转上*/
Game_Character.ROUTE_TURN_UP = 19;
/**路线转90度右*/
Game_Character.ROUTE_TURN_90D_R = 20;
/**路线转90度左*/
Game_Character.ROUTE_TURN_90D_L = 21;
/**路线转180度*/
Game_Character.ROUTE_TURN_180D = 22;
/**路线转90度左右*/
Game_Character.ROUTE_TURN_90D_R_L = 23;
/**路线转随机*/
Game_Character.ROUTE_TURN_RANDOM = 24;
/**路线转向游戏者*/
Game_Character.ROUTE_TURN_TOWARD = 25;
/**路线转离游戏者*/
Game_Character.ROUTE_TURN_AWAY = 26;
/**路线开关开*/
Game_Character.ROUTE_SWITCH_ON = 27;
/**路线开关关*/
Game_Character.ROUTE_SWITCH_OFF = 28;
/**路线改变移动速度*/
Game_Character.ROUTE_CHANGE_SPEED = 29;
/**路线改变移动频率*/
Game_Character.ROUTE_CHANGE_FREQ = 30;
/**路线行走动画开*/
Game_Character.ROUTE_WALK_ANIME_ON = 31;
/**路线行走动画关*/
Game_Character.ROUTE_WALK_ANIME_OFF = 32;
/**路线踏步动画开*/
Game_Character.ROUTE_STEP_ANIME_ON = 33;
/**路线踏步动画关*/
Game_Character.ROUTE_STEP_ANIME_OFF = 34;
/**路线方向固定开*/
Game_Character.ROUTE_DIR_FIX_ON = 35;
/**路线方向固定关*/
Game_Character.ROUTE_DIR_FIX_OFF = 36;
/**路线穿透开*/
Game_Character.ROUTE_THROUGH_ON = 37;
/**路线穿透关*/
Game_Character.ROUTE_THROUGH_OFF = 38;
/**路线透明开*/
Game_Character.ROUTE_TRANSPARENT_ON = 39;
/**路线透明关*/
Game_Character.ROUTE_TRANSPARENT_OFF = 40;
/**路线改变图像*/
Game_Character.ROUTE_CHANGE_IMAGE = 41;
/**路线改变不透明度*/
Game_Character.ROUTE_CHANGE_OPACITY = 42;
/**路线改变合成方式*/
Game_Character.ROUTE_CHANGE_BLEND_MODE = 43;
/**路线播放se*/
Game_Character.ROUTE_PLAY_SE = 44;
/**路线脚本*/
Game_Character.ROUTE_SCRIPT = 45;

/**初始化*/
Game_Character.prototype.initialize = function() {
    Game_CharacterBase.prototype.initialize.call(this);
};

/**初始化成员*/
Game_Character.prototype.initMembers = function() {
    Game_CharacterBase.prototype.initMembers.call(this);
    this._moveRouteForcing = false;
    this._moveRoute = null;
    this._moveRouteIndex = 0;
    this._originalMoveRoute = null;
    this._originalMoveRouteIndex = 0;
    this._waitCount = 0;
};

/**记录移动路线*/
Game_Character.prototype.memorizeMoveRoute = function() {
    this._originalMoveRoute = this._moveRoute;
    this._originalMoveRouteIndex = this._moveRouteIndex;
};

/**恢复移动路线*/
Game_Character.prototype.restoreMoveRoute = function() {
    this._moveRoute = this._originalMoveRoute;
    this._moveRouteIndex = this._originalMoveRouteIndex;
    this._originalMoveRoute = null;
};

/**是强制移动路线*/
Game_Character.prototype.isMoveRouteForcing = function() {
    return this._moveRouteForcing;
};

/**设置移动路线*/
Game_Character.prototype.setMoveRoute = function(moveRoute) {
    if (this._moveRouteForcing) {
        this._originalMoveRoute = moveRoute;
        this._originalMoveRouteIndex = 0;
    } else {
        this._moveRoute = moveRoute;
        this._moveRouteIndex = 0;
    }
};

/**强制移动路线*/
Game_Character.prototype.forceMoveRoute = function(moveRoute) {
    if (!this._originalMoveRoute) {
        this.memorizeMoveRoute();
    }
    this._moveRoute = moveRoute;
    this._moveRouteIndex = 0;
    this._moveRouteForcing = true;
    this._waitCount = 0;
};

/**更新停止*/
Game_Character.prototype.updateStop = function() {
    Game_CharacterBase.prototype.updateStop.call(this);
    if (this._moveRouteForcing) {
        this.updateRoutineMove();
    }
};

/**更新移动路线*/
Game_Character.prototype.updateRoutineMove = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
    } else {
        this.setMovementSuccess(true);
        const command = this._moveRoute.list[this._moveRouteIndex];
        if (command) {
            this.processMoveCommand(command);
            this.advanceMoveRouteIndex();
        }
    }
};

/**进行移动命令*/
Game_Character.prototype.processMoveCommand = function(command) {
    const gc = Game_Character;
    const params = command.parameters;
    switch (command.code) {
        case gc.ROUTE_END:
            this.processRouteEnd();
            break;
        case gc.ROUTE_MOVE_DOWN:
            this.moveStraight(2);
            break;
        case gc.ROUTE_MOVE_LEFT:
            this.moveStraight(4);
            break;
        case gc.ROUTE_MOVE_RIGHT:
            this.moveStraight(6);
            break;
        case gc.ROUTE_MOVE_UP:
            this.moveStraight(8);
            break;
        case gc.ROUTE_MOVE_LOWER_L:
            this.moveDiagonally(4, 2);
            break;
        case gc.ROUTE_MOVE_LOWER_R:
            this.moveDiagonally(6, 2);
            break;
        case gc.ROUTE_MOVE_UPPER_L:
            this.moveDiagonally(4, 8);
            break;
        case gc.ROUTE_MOVE_UPPER_R:
            this.moveDiagonally(6, 8);
            break;
        case gc.ROUTE_MOVE_RANDOM:
            this.moveRandom();
            break;
        case gc.ROUTE_MOVE_TOWARD:
            this.moveTowardPlayer();
            break;
        case gc.ROUTE_MOVE_AWAY:
            this.moveAwayFromPlayer();
            break;
        case gc.ROUTE_MOVE_FORWARD:
            this.moveForward();
            break;
        case gc.ROUTE_MOVE_BACKWARD:
            this.moveBackward();
            break;
        case gc.ROUTE_JUMP:
            this.jump(params[0], params[1]);
            break;
        case gc.ROUTE_WAIT:
            this._waitCount = params[0] - 1;
            break;
        case gc.ROUTE_TURN_DOWN:
            this.setDirection(2);
            break;
        case gc.ROUTE_TURN_LEFT:
            this.setDirection(4);
            break;
        case gc.ROUTE_TURN_RIGHT:
            this.setDirection(6);
            break;
        case gc.ROUTE_TURN_UP:
            this.setDirection(8);
            break;
        case gc.ROUTE_TURN_90D_R:
            this.turnRight90();
            break;
        case gc.ROUTE_TURN_90D_L:
            this.turnLeft90();
            break;
        case gc.ROUTE_TURN_180D:
            this.turn180();
            break;
        case gc.ROUTE_TURN_90D_R_L:
            this.turnRightOrLeft90();
            break;
        case gc.ROUTE_TURN_RANDOM:
            this.turnRandom();
            break;
        case gc.ROUTE_TURN_TOWARD:
            this.turnTowardPlayer();
            break;
        case gc.ROUTE_TURN_AWAY:
            this.turnAwayFromPlayer();
            break;
        case gc.ROUTE_SWITCH_ON:
            $gameSwitches.setValue(params[0], true);
            break;
        case gc.ROUTE_SWITCH_OFF:
            $gameSwitches.setValue(params[0], false);
            break;
        case gc.ROUTE_CHANGE_SPEED:
            this.setMoveSpeed(params[0]);
            break;
        case gc.ROUTE_CHANGE_FREQ:
            this.setMoveFrequency(params[0]);
            break;
        case gc.ROUTE_WALK_ANIME_ON:
            this.setWalkAnime(true);
            break;
        case gc.ROUTE_WALK_ANIME_OFF:
            this.setWalkAnime(false);
            break;
        case gc.ROUTE_STEP_ANIME_ON:
            this.setStepAnime(true);
            break;
        case gc.ROUTE_STEP_ANIME_OFF:
            this.setStepAnime(false);
            break;
        case gc.ROUTE_DIR_FIX_ON:
            this.setDirectionFix(true);
            break;
        case gc.ROUTE_DIR_FIX_OFF:
            this.setDirectionFix(false);
            break;
        case gc.ROUTE_THROUGH_ON:
            this.setThrough(true);
            break;
        case gc.ROUTE_THROUGH_OFF:
            this.setThrough(false);
            break;
        case gc.ROUTE_TRANSPARENT_ON:
            this.setTransparent(true);
            break;
        case gc.ROUTE_TRANSPARENT_OFF:
            this.setTransparent(false);
            break;
        case gc.ROUTE_CHANGE_IMAGE:
            this.setImage(params[0], params[1]);
            break;
        case gc.ROUTE_CHANGE_OPACITY:
            this.setOpacity(params[0]);
            break;
        case gc.ROUTE_CHANGE_BLEND_MODE:
            this.setBlendMode(params[0]);
            break;
        case gc.ROUTE_PLAY_SE:
            AudioManager.playSe(params[0]);
            break;
        case gc.ROUTE_SCRIPT:
            eval(params[0]);
            break;
    }
};

/**三角x从*/
Game_Character.prototype.deltaXFrom = function(x) {
    return $gameMap.deltaX(this.x, x);
};

/**三角y从*/
Game_Character.prototype.deltaYFrom = function(y) {
    return $gameMap.deltaY(this.y, y);
};

/**移动随机*/
Game_Character.prototype.moveRandom = function() {
    const d = 2 + Math.randomInt(4) * 2;
    if (this.canPass(this.x, this.y, d)) {
        this.moveStraight(d);
    }
};

/**移动向人物*/
Game_Character.prototype.moveTowardCharacter = function(character) {
    const sx = this.deltaXFrom(character.x);
    const sy = this.deltaYFrom(character.y);
    if (Math.abs(sx) > Math.abs(sy)) {
        this.moveStraight(sx > 0 ? 4 : 6);
        if (!this.isMovementSucceeded() && sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
        }
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
        if (!this.isMovementSucceeded() && sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6);
        }
    }
};

/**移动远离从人物*/
Game_Character.prototype.moveAwayFromCharacter = function(character) {
    const sx = this.deltaXFrom(character.x);
    const sy = this.deltaYFrom(character.y);
    if (Math.abs(sx) > Math.abs(sy)) {
        this.moveStraight(sx > 0 ? 6 : 4);
        if (!this.isMovementSucceeded() && sy !== 0) {
            this.moveStraight(sy > 0 ? 2 : 8);
        }
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 2 : 8);
        if (!this.isMovementSucceeded() && sx !== 0) {
            this.moveStraight(sx > 0 ? 6 : 4);
        }
    }
};

/**转向人物*/
Game_Character.prototype.turnTowardCharacter = function(character) {
    const sx = this.deltaXFrom(character.x);
    const sy = this.deltaYFrom(character.y);
    if (Math.abs(sx) > Math.abs(sy)) {
        this.setDirection(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
        this.setDirection(sy > 0 ? 8 : 2);
    }
};

/**转离人物*/
Game_Character.prototype.turnAwayFromCharacter = function(character) {
    const sx = this.deltaXFrom(character.x);
    const sy = this.deltaYFrom(character.y);
    if (Math.abs(sx) > Math.abs(sy)) {
        this.setDirection(sx > 0 ? 6 : 4);
    } else if (sy !== 0) {
        this.setDirection(sy > 0 ? 2 : 8);
    }
};

/**转向游戏者*/
Game_Character.prototype.turnTowardPlayer = function() {
    this.turnTowardCharacter($gamePlayer);
};

/**转离游戏者*/
Game_Character.prototype.turnAwayFromPlayer = function() {
    this.turnAwayFromCharacter($gamePlayer);
};

/**移动向游戏者*/
Game_Character.prototype.moveTowardPlayer = function() {
    this.moveTowardCharacter($gamePlayer);
};

/**移动远离游戏者*/
Game_Character.prototype.moveAwayFromPlayer = function() {
    this.moveAwayFromCharacter($gamePlayer);
};

/**移动前进*/
Game_Character.prototype.moveForward = function() {
    this.moveStraight(this.direction());
};

/**移动后退(不转身)*/
Game_Character.prototype.moveBackward = function() {
    const lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.moveStraight(this.reverseDir(this.direction()));
    this.setDirectionFix(lastDirectionFix);
};

/**进行路线结束*/
Game_Character.prototype.processRouteEnd = function() {
    if (this._moveRoute.repeat) {
        this._moveRouteIndex = -1;
    } else if (this._moveRouteForcing) {
        this._moveRouteForcing = false;
        this.restoreMoveRoute();
    }
};

/**增加移动路线索引*/
Game_Character.prototype.advanceMoveRouteIndex = function() {
    const moveRoute = this._moveRoute;
    if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
        let numCommands = moveRoute.list.length - 1;
        this._moveRouteIndex++;
        if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
            this._moveRouteIndex = 0;
        }
    }
};

/**右转90*/
Game_Character.prototype.turnRight90 = function() {
    switch (this.direction()) {
        case 2:
            this.setDirection(4);
            break;
        case 4:
            this.setDirection(8);
            break;
        case 6:
            this.setDirection(2);
            break;
        case 8:
            this.setDirection(6);
            break;
    }
};

/**左转90*/
Game_Character.prototype.turnLeft90 = function() {
    switch (this.direction()) {
        case 2:
            this.setDirection(6);
            break;
        case 4:
            this.setDirection(2);
            break;
        case 6:
            this.setDirection(8);
            break;
        case 8:
            this.setDirection(4);
            break;
    }
};

/**转180*/
Game_Character.prototype.turn180 = function() {
    this.setDirection(this.reverseDir(this.direction()));
};

/**转左或右90*/
Game_Character.prototype.turnRightOrLeft90 = function() {
    switch (Math.randomInt(2)) {
        case 0:
            this.turnRight90();
            break;
        case 1:
            this.turnLeft90();
            break;
    }
};

/**随机转*/
Game_Character.prototype.turnRandom = function() {
    this.setDirection(2 + Math.randomInt(4) * 2);
};

/**交换*/
Game_Character.prototype.swap = function(character) {
    const newX = character.x;
    const newY = character.y;
    character.locate(this.x, this.y);
    this.locate(newX, newY);
};

/**寻找方向到*/
Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
    const searchLimit = this.searchLimit();
    const mapWidth = $gameMap.width();
    const nodeList = [];
    const openList = [];
    const closedList = [];
    const start = {};
    let best = start;

    if (this.x === goalX && this.y === goalY) {
        return 0;
    }

    start.parent = null;
    start.x = this.x;
    start.y = this.y;
    start.g = 0;
    start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
    nodeList.push(start);
    openList.push(start.y * mapWidth + start.x);

    while (nodeList.length > 0) {
        let bestIndex = 0;
        for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i].f < nodeList[bestIndex].f) {
                bestIndex = i;
            }
        }

        const current = nodeList[bestIndex];
        const x1 = current.x;
        const y1 = current.y;
        const pos1 = y1 * mapWidth + x1;
        const g1 = current.g;

        nodeList.splice(bestIndex, 1);
        openList.splice(openList.indexOf(pos1), 1);
        closedList.push(pos1);

        if (current.x === goalX && current.y === goalY) {
            best = current;
            break;
        }

        if (g1 >= searchLimit) {
            continue;
        }

        for (let j = 0; j < 4; j++) {
            const direction = 2 + j * 2;
            const x2 = $gameMap.roundXWithDirection(x1, direction);
            const y2 = $gameMap.roundYWithDirection(y1, direction);
            const pos2 = y2 * mapWidth + x2;

            if (closedList.includes(pos2)) {
                continue;
            }
            if (!this.canPass(x1, y1, direction)) {
                continue;
            }

            const g2 = g1 + 1;
            const index2 = openList.indexOf(pos2);

            if (index2 < 0 || g2 < nodeList[index2].g) {
                let neighbor = {};
                if (index2 >= 0) {
                    neighbor = nodeList[index2];
                } else {
                    nodeList.push(neighbor);
                    openList.push(pos2);
                }
                neighbor.parent = current;
                neighbor.x = x2;
                neighbor.y = y2;
                neighbor.g = g2;
                neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                    best = neighbor;
                }
            }
        }
    }

    let node = best;
    while (node.parent && node.parent !== start) {
        node = node.parent;
    }

    const deltaX1 = $gameMap.deltaX(node.x, start.x);
    const deltaY1 = $gameMap.deltaY(node.y, start.y);
    if (deltaY1 > 0) {
        return 2;
    } else if (deltaX1 < 0) {
        return 4;
    } else if (deltaX1 > 0) {
        return 6;
    } else if (deltaY1 < 0) {
        return 8;
    }

    const deltaX2 = this.deltaXFrom(goalX);
    const deltaY2 = this.deltaYFrom(goalY);
    if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
        return deltaX2 > 0 ? 4 : 6;
    } else if (deltaY2 !== 0) {
        return deltaY2 > 0 ? 8 : 2;
    }

    return 0;
};

/**搜寻限制*/
Game_Character.prototype.searchLimit = function() {
    return 12;
};

