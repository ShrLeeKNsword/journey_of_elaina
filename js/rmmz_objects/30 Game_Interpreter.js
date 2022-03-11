//-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.

/**
 * 游戏解释器
 * 
 * 运行事件命令的解释器。
 */
function Game_Interpreter() {
    this.initialize(...arguments);
}

/**
 * 初始化
 * @param {number} depth 深度 
 */
Game_Interpreter.prototype.initialize = function(depth) {
    /**
     * 深度
     */
    this._depth = depth || 0;
    this.checkOverflow();
    this.clear();
    /**
     * 分支
     */
    this._branch = {};
    /**
     * 缩进
     */
    this._indent = 0;
    /**
     * 帧数
     */
    this._frameCount = 0;
    /**
     * 冻结检查器
     */
    this._freezeChecker = 0;
};

/**
 * 检查溢出
 */
Game_Interpreter.prototype.checkOverflow = function() {
    if (this._depth >= 100) {
        throw new Error("Common event calls exceeded the limit");
    }
};

/**
 * 清除
 */
Game_Interpreter.prototype.clear = function() {
    /**
     * 地图id
     */
    this._mapId = 0;
    /**
     * 事件id
     */
    this._eventId = 0;
    /**
     * 列表
     */
    this._list = null;
    /**
     * 索引
     */
    this._index = 0;
    /**
     * 等待计数
     */
    this._waitCount = 0;
    /**
     * 等待模式
     */
    this._waitMode = "";
    /**
     * 注释组
     */
    this._comments = "";
    /**
     * 角色id
     */
    this._characterId = 0;
    /**
     * 子解释器
     */
    this._childInterpreter = null;
};

/**
 * 建立
 * @param {[]} list 命令列表
 * @param {number} eventId 事件id
 */
Game_Interpreter.prototype.setup = function(list, eventId) {
    this.clear();
    this._mapId = $gameMap.mapId();
    this._eventId = eventId || 0;
    this._list = list;
    this.loadImages();
};

/**
 * 加载图像
 */
Game_Interpreter.prototype.loadImages = function() {
    // [Note] The certain versions of MV had a more complicated preload scheme.
    //   However it is usually sufficient to preload face and picture images.
    
    // [Note] 某些版本的MV具有更复杂的预加载方案。
    // 但是，通常只要预加载面部和图片图像就足够了。
    const list = this._list.slice(0, 200);
    for (const command of list) {
        switch (command.code) {
            case 101: // Show Text  显示文字
                ImageManager.loadFace(command.parameters[0]);
                break;
            case 231: // Show Picture  显示图片
                ImageManager.loadPicture(command.parameters[1]);
                break;
        }
    }
};

/**
 * 事件id
 */
Game_Interpreter.prototype.eventId = function() {
    return this._eventId;
};

/**
 * 在当前地图上
 */
Game_Interpreter.prototype.isOnCurrentMap = function() {
    return this._mapId === $gameMap.mapId();
};

/**
 * 安装保留的公共事件
 */
Game_Interpreter.prototype.setupReservedCommonEvent = function() {
    if ($gameTemp.isCommonEventReserved()) {
        const commonEvent = $gameTemp.retrieveCommonEvent();
        if (commonEvent) {
            this.setup(commonEvent.list);
            return true;
        }
    }
    return false;
};

/**
 * 在运行中
 */
Game_Interpreter.prototype.isRunning = function() {
    return !!this._list;
};

/**
 * 更新
 */
Game_Interpreter.prototype.update = function() {
    //当 在运行中()
    while (this.isRunning()) {
        //如果返回值为true则跳出循环
        if (this.updateChild() || this.updateWait()) {
            break;
        }
        if (SceneManager.isSceneChanging()) {
            break;
        }
        if (!this.executeCommand()) {
            break;
        }
        if (this.checkFreeze()) {
            break;
        }
    }
};

/**
 * 更新子解释器
 */
Game_Interpreter.prototype.updateChild = function() {
    if (this._childInterpreter) {
        this._childInterpreter.update();
        if (this._childInterpreter.isRunning()) {
            return true;
        } else {
            this._childInterpreter = null;
        }
    }
    return false;
};

/**
 * 更新等待
 */
Game_Interpreter.prototype.updateWait = function() {
    return this.updateWaitCount() || this.updateWaitMode();
};

/**
 * 更新等待计数
 */
Game_Interpreter.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    }
    return false;
};

/**
 * 更新等待模式
 */
Game_Interpreter.prototype.updateWaitMode = function() {
    let character = null;
    let waiting = false;
    switch (this._waitMode) {
        case "message":
            waiting = $gameMessage.isBusy();
            break;
        case "transfer":
            waiting = $gamePlayer.isTransferring();
            break;
        case "scroll":
            waiting = $gameMap.isScrolling();
            break;
        case "route":
            character = this.character(this._characterId);
            waiting = character && character.isMoveRouteForcing();
            break;
        case "animation":
            character = this.character(this._characterId);
            waiting = character && character.isAnimationPlaying();
            break;
        case "balloon":
            character = this.character(this._characterId);
            waiting = character && character.isBalloonPlaying();
            break;
        case "gather":
            waiting = $gamePlayer.areFollowersGathering();
            break;
        case "action":
            waiting = BattleManager.isActionForced();
            break;
        case "video":
            waiting = Video.isPlaying();
            break;
        case "image":
            waiting = !ImageManager.isReady();
            break;
    }
    if (!waiting) {
        this._waitMode = "";
    }
    return waiting;
};

/**
 * 设置等待模式
 * @param {string} waitMode 等待模式 
 */
Game_Interpreter.prototype.setWaitMode = function(waitMode) {
    this._waitMode = waitMode;
};

/**
 * 等待
 * @param {number} duration 持续时间
 */
Game_Interpreter.prototype.wait = function(duration) {
    this._waitCount = duration;
};

/**
 * 渐变速度
 */
Game_Interpreter.prototype.fadeSpeed = function() {
    return 24;
};

/**
 * 执行命令
 */
Game_Interpreter.prototype.executeCommand = function() {
    const command = this.currentCommand();
    if (command) {
        /**
         * 缩进
         */
        this._indent = command.indent;
        const methodName = "command" + command.code;
        if (typeof this[methodName] === "function") {
            if (!this[methodName](command.parameters)) {
                return false;
            }
        }
        this._index++;
    } else {
        this.terminate();
    }
    return true;
};

/**
 * 检查冻结
 */
Game_Interpreter.prototype.checkFreeze = function() {
    if (this._frameCount !== Graphics.frameCount) {
        this._frameCount = Graphics.frameCount;
        this._freezeChecker = 0;
    }
    if (this._freezeChecker++ >= 100000) {
        return true;
    } else {
        return false;
    }
};

/**
 * 终止
 */
Game_Interpreter.prototype.terminate = function() {
    this._list = null;
    this._comments = "";
};

/**
 * 跳过分支
 */
Game_Interpreter.prototype.skipBranch = function() {
    while (this._list[this._index + 1].indent > this._indent) {
        this._index++;
    }
};

/**
 * 当前命令
 * @returns {object} 命令
 */
Game_Interpreter.prototype.currentCommand = function() {
    return this._list[this._index];
};

/**
 * 下一个事件代码
 * @returns {number} 下一个事件命令的代码
 */
Game_Interpreter.prototype.nextEventCode = function() {
    const command = this._list[this._index + 1];
    if (command) {
        return command.code;
    } else {
        return 0;
    }
};

/**
 * 迭代演员id
 * @param {number} param 参数:0 全部成员 | id 对应角色
 * @param {function} callback  回调函数
 */
Game_Interpreter.prototype.iterateActorId = function(param, callback) {
    if (param === 0) {
        $gameParty.members().forEach(callback);
    } else {
        const actor = $gameActors.actor(param);
        if (actor) {
            callback(actor);
        }
    }
};

/**
 * 迭代演员加强
 * @param {number} param1 参数1 控制参数
 * @param {number} param2 参数2 参数1为0时为id,为其他时为对应变量
 * @param {function} callback 回调函数 
 */
Game_Interpreter.prototype.iterateActorEx = function(param1, param2, callback) {
    if (param1 === 0) {
        this.iterateActorId(param2, callback);
    } else {
        this.iterateActorId($gameVariables.value(param2), callback);
    }
};

/**
 * 迭代角色索引
 * @param {number} param 参数: 小于0 队伍全部成员| index 队伍对应成员
 * @param {function} callback 回调函数
 */
Game_Interpreter.prototype.iterateActorIndex = function(param, callback) {
    if (param < 0) {
        $gameParty.members().forEach(callback);
    } else {
        const actor = $gameParty.members()[param];
        if (actor) {
            callback(actor);
        }
    }
};

/**
 * 迭代敌人索引
 * @param {number} param 参数 <0 全部成员 | 索引对应敌人
 * @param {function} callback 回调函数
 */
Game_Interpreter.prototype.iterateEnemyIndex = function(param, callback) {
    if (param < 0) {
        $gameTroop.members().forEach(callback);
    } else {
        const enemy = $gameTroop.members()[param];
        if (enemy) {
            callback(enemy);
        }
    }
};

/**
 * 迭代战斗者
 * @param {number} param1 参数1 
 * @param {number} param2 参数2 参数1为0时为迭代敌人, 为其他时为迭代角色 
 * @param {function} callback 回调函数
 */
Game_Interpreter.prototype.iterateBattler = function(param1, param2, callback) {
    if ($gameParty.inBattle()) {
        if (param1 === 0) {
            this.iterateEnemyIndex(param2, callback);
        } else {
            this.iterateActorId(param2, callback);
        }
    }
};

/**
 * 人物
 * @param {number} param 参数 <0 游戏玩家 | 0 当前事件 | >0 对应事件
 * @returns {Game_Character} 游戏人物
 */
Game_Interpreter.prototype.character = function(param) {
    if ($gameParty.inBattle()) {
        return null;
    } else if (param < 0) {
        return $gamePlayer;
    } else if (this.isOnCurrentMap()) {
        return $gameMap.event(param > 0 ? param : this._eventId);
    } else {
        return null;
    }
};

// prettier-ignore
// 更漂亮的无视
/**
 * 
 * @param {number} operation 操作 0 返回value | 返回 -value
 * @param {number} operandType 操作数类型: 0 操作数的值 | 对应变量的值
 * @param {number} operand  操作数 
 */
Game_Interpreter.prototype.operateValue = function(
    operation, operandType, operand
) {
    const value = operandType === 0 ? operand : $gameVariables.value(operand);
    return operation === 0 ? value : -value;
};

/**
 * 改变Hp
 * @param {Game_Battler} target 目标
 * @param {number} value 值
 * @param {boolean} allowDeath 允许死亡
 */
Game_Interpreter.prototype.changeHp = function(target, value, allowDeath) {
    if (target.isAlive()) {
        if (!allowDeath && target.hp <= -value) {
            value = 1 - target.hp;
        }
        target.gainHp(value);
        if (target.isDead()) {
            target.performCollapse();
        }
    }
};

// Show Text
/**
 * 显示文字
 * @param {[]} params 参数组
 */
Game_Interpreter.prototype.command101 = function(params) {
    if ($gameMessage.isBusy()) {
        return false;
    }
    $gameMessage.setFaceImage(params[0], params[1]);
    $gameMessage.setBackground(params[2]);
    $gameMessage.setPositionType(params[3]);
    $gameMessage.setSpeakerName(params[4]);
    while (this.nextEventCode() === 401) {
        // Text data
        this._index++;
        $gameMessage.add(this.currentCommand().parameters[0]);
    }
    switch (this.nextEventCode()) {
        case 102: // Show Choices
            this._index++;
            this.setupChoices(this.currentCommand().parameters);
            break;
        case 103: // Input Number
            this._index++;
            this.setupNumInput(this.currentCommand().parameters);
            break;
        case 104: // Select Item
            this._index++;
            this.setupItemChoice(this.currentCommand().parameters);
            break;
    }
    this.setWaitMode("message");
    return true;
};

// Show Choices
/**
 * 显示选择
 * @param {[]} params 参数组
 */
Game_Interpreter.prototype.command102 = function(params) {
    if ($gameMessage.isBusy()) {
        return false;
    }
    this.setupChoices(params);
    this.setWaitMode("message");
    return true;
};

/**
 * 设置选择
 * @param {[]} params 参数组
 */
Game_Interpreter.prototype.setupChoices = function(params) {
    const choices = params[0].clone();
    const cancelType = params[1] < choices.length ? params[1] : -2;
    const defaultType = params.length > 2 ? params[2] : 0;
    const positionType = params.length > 3 ? params[3] : 2;
    const background = params.length > 4 ? params[4] : 0;
    $gameMessage.setChoices(choices, defaultType, cancelType);
    $gameMessage.setChoiceBackground(background);
    $gameMessage.setChoicePositionType(positionType);
    $gameMessage.setChoiceCallback(n => {
        this._branch[this._indent] = n;
    });
};

// When [**]
/**
 * 当  时
 * @param {[]} params 参数组
 * 如果不等于则跳过分支
 */
Game_Interpreter.prototype.command402 = function(params) {
    if (this._branch[this._indent] !== params[0]) {
        this.skipBranch();
    }
    return true;
};

// When Cancel
/**
 * 当取消时
 */
Game_Interpreter.prototype.command403 = function() {
    if (this._branch[this._indent] >= 0) {
        this.skipBranch();
    }
    return true;
};

// Input Number
/**
 * 输入数字
 * @param {*} params 
 */
Game_Interpreter.prototype.command103 = function(params) {
    if ($gameMessage.isBusy()) {
        return false;
    }
    this.setupNumInput(params);
    this.setWaitMode("message");
    return true;
};

/**
 * 安装数字输入
 * @param {*} params 
 */
Game_Interpreter.prototype.setupNumInput = function(params) {
    $gameMessage.setNumberInput(params[0], params[1]);
};

// Select Item
/**
 * 选择物品
 * @param {*} params 
 */
Game_Interpreter.prototype.command104 = function(params) {
    if ($gameMessage.isBusy()) {
        return false;
    }
    this.setupItemChoice(params);
    this.setWaitMode("message");
    return true;
};

/**
 * 安装项目选择
 * @param {*} params 
 */
Game_Interpreter.prototype.setupItemChoice = function(params) {
    $gameMessage.setItemChoice(params[0], params[1] || 2);
};

// Show Scrolling Text
/**
 * 显示滚动文字
 * @param {*} params 
 */
Game_Interpreter.prototype.command105 = function(params) {
    if ($gameMessage.isBusy()) {
        return false;
    }
    $gameMessage.setScroll(params[0], params[1]);
    while (this.nextEventCode() === 405) {
        this._index++;
        $gameMessage.add(this.currentCommand().parameters[0]);
    }
    this.setWaitMode("message");
    return true;
};

// Comment
/**
 * 注释
 * @param {*} params 
 */
Game_Interpreter.prototype.command108 = function(params) {
    this._comments = [params[0]];
    while (this.nextEventCode() === 408) {
        this._index++;
        this._comments.push(this.currentCommand().parameters[0]);
    }
    return true;
};

// Conditional Branch
/**
 * 条件分支
 * @param {*} params 
 */
Game_Interpreter.prototype.command111 = function(params) {
    let result = false;
    let value1, value2;
    let actor, enemy, character;
    switch (params[0]) {
        case 0: // Switch
            result = $gameSwitches.value(params[1]) === (params[2] === 0);
            break;
        case 1: // Variable
            value1 = $gameVariables.value(params[1]);
            if (params[2] === 0) {
                value2 = params[3];
            } else {
                value2 = $gameVariables.value(params[3]);
            }
            switch (params[4]) {
                case 0: // Equal to
                    result = value1 === value2;
                    break;
                case 1: // Greater than or Equal to
                    result = value1 >= value2;
                    break;
                case 2: // Less than or Equal to
                    result = value1 <= value2;
                    break;
                case 3: // Greater than
                    result = value1 > value2;
                    break;
                case 4: // Less than
                    result = value1 < value2;
                    break;
                case 5: // Not Equal to
                    result = value1 !== value2;
                    break;
            }
            break;
        case 2: // Self Switch
            if (this._eventId > 0) {
                const key = [this._mapId, this._eventId, params[1]];
                result = $gameSelfSwitches.value(key) === (params[2] === 0);
            }
            break;
        case 3: // Timer
            if ($gameTimer.isWorking()) {
                if (params[2] === 0) {
                    result = $gameTimer.seconds() >= params[1];
                } else {
                    result = $gameTimer.seconds() <= params[1];
                }
            }
            break;
        case 4: // Actor
            actor = $gameActors.actor(params[1]);
            if (actor) {
                const n = params[3];
                switch (params[2]) {
                    case 0: // In the Party
                        result = $gameParty.members().includes(actor);
                        break;
                    case 1: // Name
                        result = actor.name() === n;
                        break;
                    case 2: // Class
                        result = actor.isClass($dataClasses[n]);
                        break;
                    case 3: // Skill
                        result = actor.hasSkill(n);
                        break;
                    case 4: // Weapon
                        result = actor.hasWeapon($dataWeapons[n]);
                        break;
                    case 5: // Armor
                        result = actor.hasArmor($dataArmors[n]);
                        break;
                    case 6: // State
                        result = actor.isStateAffected(n);
                        break;
                }
            }
            break;
        case 5: // Enemy
            enemy = $gameTroop.members()[params[1]];
            if (enemy) {
                switch (params[2]) {
                    case 0: // Appeared
                        result = enemy.isAlive();
                        break;
                    case 1: // State
                        result = enemy.isStateAffected(params[3]);
                        break;
                }
            }
            break;
        case 6: // Character
            character = this.character(params[1]);
            if (character) {
                result = character.direction() === params[2];
            }
            break;
        case 7: // Gold
            switch (params[2]) {
                case 0: // Greater than or equal to
                    result = $gameParty.gold() >= params[1];
                    break;
                case 1: // Less than or equal to
                    result = $gameParty.gold() <= params[1];
                    break;
                case 2: // Less than
                    result = $gameParty.gold() < params[1];
                    break;
            }
            break;
        case 8: // Item
            result = $gameParty.hasItem($dataItems[params[1]]);
            break;
        case 9: // Weapon
            result = $gameParty.hasItem($dataWeapons[params[1]], params[2]);
            break;
        case 10: // Armor
            result = $gameParty.hasItem($dataArmors[params[1]], params[2]);
            break;
        case 11: // Button
            switch (params[2] || 0) {
                case 0:
                    result = Input.isPressed(params[1]);
                    break;
                case 1:
                    result = Input.isTriggered(params[1]);
                    break;
                case 2:
                    result = Input.isRepeated(params[1]);
                    break;
            }
            break;
        case 12: // Script
            result = !!eval(params[1]);
            break;
        case 13: // Vehicle
            result = $gamePlayer.vehicle() === $gameMap.vehicle(params[1]);
            break;
    }
    this._branch[this._indent] = result;
    if (this._branch[this._indent] === false) {
        this.skipBranch();
    }
    return true;
};

// Else
/**
 * 其他
 */
Game_Interpreter.prototype.command411 = function() {
    if (this._branch[this._indent] !== false) {
        this.skipBranch();
    }
    return true;
};

// Loop
/**
 * 循环
 */
Game_Interpreter.prototype.command112 = function() {
    return true;
};

// Repeat Above
/**
 * 重复循环
 */
Game_Interpreter.prototype.command413 = function() {
    do {
        this._index--;
    } while (this.currentCommand().indent !== this._indent);
    return true;
};

// Break Loop
/**
 * 跳出循环
 */
Game_Interpreter.prototype.command113 = function() {
    let depth = 0;
    while (this._index < this._list.length - 1) {
        this._index++;
        const command = this.currentCommand();
        if (command.code === 112) {
            depth++;
        }
        if (command.code === 413) {
            if (depth > 0) {
                depth--;
            } else {
                break;
            }
        }
    }
    return true;
};

// Exit Event Processing
/**
 * 退出事件处理
 */
Game_Interpreter.prototype.command115 = function() {
    this._index = this._list.length;
    return true;
};

// Common Event
/**
 * 公共事件
 * @param {*} params 
 */
Game_Interpreter.prototype.command117 = function(params) {
    const commonEvent = $dataCommonEvents[params[0]];
    if (commonEvent) {
        const eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(commonEvent.list, eventId);
    }
    return true;
};

/**
 * 安装子解释器
 * @param {[]} list 命令列表
 * @param {number} eventId 事件id
 */
Game_Interpreter.prototype.setupChild = function(list, eventId) {
    this._childInterpreter = new Game_Interpreter(this._depth + 1);
    this._childInterpreter.setup(list, eventId);
};

// Label
/**
 * 标签
 */
Game_Interpreter.prototype.command118 = function() {
    return true;
};

// Jump to Label
/**
 * 跳转到标签
 * @param {*} params 
 */
Game_Interpreter.prototype.command119 = function(params) {
    const labelName = params[0];
    for (let i = 0; i < this._list.length; i++) {
        const command = this._list[i];
        if (command.code === 118 && command.parameters[0] === labelName) {
            this.jumpTo(i);
            return;
        }
    }
    return true;
};

/**
 * 跳到
 * @param {*} index 
 */
Game_Interpreter.prototype.jumpTo = function(index) {
    const lastIndex = this._index;
    const startIndex = Math.min(index, lastIndex);
    const endIndex = Math.max(index, lastIndex);
    let indent = this._indent;
    for (let i = startIndex; i <= endIndex; i++) {
        const newIndent = this._list[i].indent;
        if (newIndent !== indent) {
            this._branch[indent] = null;
            indent = newIndent;
        }
    }
    this._index = index;
};

// Control Switches
/**
 * 控制开关
 * @param {*} params 
 */
Game_Interpreter.prototype.command121 = function(params) {
    for (let i = params[0]; i <= params[1]; i++) {
        $gameSwitches.setValue(i, params[2] === 0);
    }
    return true;
};

// Control Variables
/**
 * 控制变量
 * @param {*} params 
 */
Game_Interpreter.prototype.command122 = function(params) {
    const startId = params[0];
    const endId = params[1];
    const operationType = params[2];
    const operand = params[3];
    let value = 0;
    let randomMax = 1;
    switch (operand) {
        case 0: // Constant
            value = params[4];
            break;
        case 1: // Variable
            value = $gameVariables.value(params[4]);
            break;
        case 2: // Random
            value = params[4];
            randomMax = params[5] - params[4] + 1;
            randomMax = Math.max(randomMax, 1);
            break;
        case 3: // Game Data
            value = this.gameDataOperand(params[4], params[5], params[6]);
            break;
        case 4: // Script
            value = eval(params[4]);
            break;
    }
    for (let i = startId; i <= endId; i++) {
        if (typeof value === "number") {
            const realValue = value + Math.randomInt(randomMax);
            this.operateVariable(i, operationType, realValue);
        } else {
            this.operateVariable(i, operationType, value);
        }
    }
    return true;
};

/**
 * 游戏数据操作
 * @param {number} type 种类 
 * @param {number} param1 参数1
 * @param {number} param2 参数1
 */
Game_Interpreter.prototype.gameDataOperand = function(type, param1, param2) {
    let actor, enemy, character;
    switch (type) {
        case 0: // Item
            return $gameParty.numItems($dataItems[param1]);
        case 1: // Weapon
            return $gameParty.numItems($dataWeapons[param1]);
        case 2: // Armor
            return $gameParty.numItems($dataArmors[param1]);
        case 3: // Actor
            actor = $gameActors.actor(param1);
            if (actor) {
                switch (param2) {
                    case 0: // Level
                        return actor.level;
                    case 1: // EXP
                        return actor.currentExp();
                    case 2: // HP
                        return actor.hp;
                    case 3: // MP
                        return actor.mp;
                    case 12: // TP
                        return actor.tp;
                    default:
                        // Parameter
                        if (param2 >= 4 && param2 <= 11) {
                            return actor.param(param2 - 4);
                        }
                }
            }
            break;
        case 4: // Enemy
            enemy = $gameTroop.members()[param1];
            if (enemy) {
                switch (param2) {
                    case 0: // HP
                        return enemy.hp;
                    case 1: // MP
                        return enemy.mp;
                    case 10: // TP
                        return enemy.tp;
                    default:
                        // Parameter
                        if (param2 >= 2 && param2 <= 9) {
                            return enemy.param(param2 - 2);
                        }
                }
            }
            break;
        case 5: // Character
            character = this.character(param1);
            if (character) {
                switch (param2) {
                    case 0: // Map X
                        return character.x;
                    case 1: // Map Y
                        return character.y;
                    case 2: // Direction
                        return character.direction();
                    case 3: // Screen X
                        return character.screenX();
                    case 4: // Screen Y
                        return character.screenY();
                }
            }
            break;
        case 6: // Party
            actor = $gameParty.members()[param1];
            return actor ? actor.actorId() : 0;
        case 8: // Last
            return $gameTemp.lastActionData(param1);
        case 7: // Other
            switch (param1) {
                case 0: // Map ID
                    return $gameMap.mapId();
                case 1: // Party Members
                    return $gameParty.size();
                case 2: // Gold
                    return $gameParty.gold();
                case 3: // Steps
                    return $gameParty.steps();
                case 4: // Play Time
                    return $gameSystem.playtime();
                case 5: // Timer
                    return $gameTimer.seconds();
                case 6: // Save Count
                    return $gameSystem.saveCount();
                case 7: // Battle Count
                    return $gameSystem.battleCount();
                case 8: // Win Count
                    return $gameSystem.winCount();
                case 9: // Escape Count
                    return $gameSystem.escapeCount();
            }
            break;
    }
    return 0;
};

/**
 * 操作变量
 * @param {number} variableId  变量编号
 * @param {number} operationType 操作类型
 * @param {number|any} value 值 
 */
Game_Interpreter.prototype.operateVariable = function(
    variableId,
    operationType,
    value
) {
    try {
        const oldValue = $gameVariables.value(variableId);
        switch (operationType) {
            case 0: // Set
                $gameVariables.setValue(variableId, value);
                break;
            case 1: // Add
                $gameVariables.setValue(variableId, oldValue + value);
                break;
            case 2: // Sub
                $gameVariables.setValue(variableId, oldValue - value);
                break;
            case 3: // Mul
                $gameVariables.setValue(variableId, oldValue * value);
                break;
            case 4: // Div
                $gameVariables.setValue(variableId, oldValue / value);
                break;
            case 5: // Mod
                $gameVariables.setValue(variableId, oldValue % value);
                break;
        }
    } catch (e) {
        $gameVariables.setValue(variableId, 0);
    }
};

// Control Self Switch
/**
 * 控制独立开关
 * @param {*} params 
 */
Game_Interpreter.prototype.command123 = function(params) {
    if (this._eventId > 0) {
        const key = [this._mapId, this._eventId, params[0]];
        $gameSelfSwitches.setValue(key, params[1] === 0);
    }
    return true;
};

// Control Timer
/**
 * 控制计时器
 * @param {*} params 
 */
Game_Interpreter.prototype.command124 = function(params) {
    if (params[0] === 0) {
        // Start
        $gameTimer.start(params[1] * 60);
    } else {
        // Stop
        $gameTimer.stop();
    }
    return true;
};

// Change Gold
/**
 * 改变金钱
 * @param {*} params 
 */
Game_Interpreter.prototype.command125 = function(params) {
    const value = this.operateValue(params[0], params[1], params[2]);
    $gameParty.gainGold(value);
    return true;
};

// Change Items
/**
 * 改变物品
 * @param {*} params 
 */
Game_Interpreter.prototype.command126 = function(params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    $gameParty.gainItem($dataItems[params[0]], value);
    return true;
};

// Change Weapons
/**
 * 改变武器
 * @param {*} params 
 */
Game_Interpreter.prototype.command127 = function(params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    $gameParty.gainItem($dataWeapons[params[0]], value, params[4]);
    return true;
};

// Change Armors
/**
 * 改变防具
 * @param {*} params 
 */
Game_Interpreter.prototype.command128 = function(params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    $gameParty.gainItem($dataArmors[params[0]], value, params[4]);
    return true;
};

// Change Party Member
/**
 * 改变队伍成员
 * @param {*} params 
 */
Game_Interpreter.prototype.command129 = function(params) {
    const actor = $gameActors.actor(params[0]);
    if (actor) {
        if (params[1] === 0) {
            // Add
            if (params[2]) {
                // Initialize
                $gameActors.actor(params[0]).setup(params[0]);
            }
            $gameParty.addActor(params[0]);
        } else {
            // Remove
            $gameParty.removeActor(params[0]);
        }
    }
    return true;
};

// Change Battle BGM
/**
 * 改变战斗bgm
 * @param {*} params 
 */
Game_Interpreter.prototype.command132 = function(params) {
    $gameSystem.setBattleBgm(params[0]);
    return true;
};

// Change Victory ME
/**
 * 改变胜利me
 * @param {*} params 
 */
Game_Interpreter.prototype.command133 = function(params) {
    $gameSystem.setVictoryMe(params[0]);
    return true;
};

// Change Save Access
/**
 * 改变存档允许
 * @param {*} params 
 */
Game_Interpreter.prototype.command134 = function(params) {
    if (params[0] === 0) {
        $gameSystem.disableSave();
    } else {
        $gameSystem.enableSave();
    }
    return true;
};

// Change Menu Access
/**
 * 改变菜单允许
 * @param {*} params 
 */
Game_Interpreter.prototype.command135 = function(params) {
    if (params[0] === 0) {
        $gameSystem.disableMenu();
    } else {
        $gameSystem.enableMenu();
    }
    return true;
};

// Change Encounter
/**
 * 改变遭遇
 * @param {*} params 
 */
Game_Interpreter.prototype.command136 = function(params) {
    if (params[0] === 0) {
        $gameSystem.disableEncounter();
    } else {
        $gameSystem.enableEncounter();
    }
    $gamePlayer.makeEncounterCount();
    return true;
};

// Change Formation Access
/**
 * 改变编队允许
 * @param {*} params 
 */
Game_Interpreter.prototype.command137 = function(params) {
    if (params[0] === 0) {
        $gameSystem.disableFormation();
    } else {
        $gameSystem.enableFormation();
    }
    return true;
};

// Change Window Color
/**
 * 改变窗口颜色
 * @param {*} params 
 */
Game_Interpreter.prototype.command138 = function(params) {
    $gameSystem.setWindowTone(params[0]);
    return true;
};

// Change Defeat ME
/**
 * 变更失败me
 * @param {*} params 
 */
Game_Interpreter.prototype.command139 = function(params) {
    $gameSystem.setDefeatMe(params[0]);
    return true;
};

// Change Vehicle BGM
/**
 * 改变交通工具bgm
 * @param {*} params 
 */
Game_Interpreter.prototype.command140 = function(params) {
    const vehicle = $gameMap.vehicle(params[0]);
    if (vehicle) {
        vehicle.setBgm(params[1]);
    }
    return true;
};

// Transfer Player
/**
 * 传送游戏玩家
 * @param {*} params 
 */
Game_Interpreter.prototype.command201 = function(params) {
    if ($gameParty.inBattle() || $gameMessage.isBusy()) {
        return false;
    }
    let mapId, x, y;
    if (params[0] === 0) {
        // Direct designation
        mapId = params[1];
        x = params[2];
        y = params[3];
    } else {
        // Designation with variables
        mapId = $gameVariables.value(params[1]);
        x = $gameVariables.value(params[2]);
        y = $gameVariables.value(params[3]);
    }
    $gamePlayer.reserveTransfer(mapId, x, y, params[4], params[5]);
    this.setWaitMode("transfer");
    return true;
};

// Set Vehicle Location
/**
 * 设置交通工具位置
 * @param {*} params 
 */
Game_Interpreter.prototype.command202 = function(params) {
    let mapId, x, y;
    if (params[1] === 0) {
        // Direct designation
        mapId = params[2];
        x = params[3];
        y = params[4];
    } else {
        // Designation with variables
        mapId = $gameVariables.value(params[2]);
        x = $gameVariables.value(params[3]);
        y = $gameVariables.value(params[4]);
    }
    const vehicle = $gameMap.vehicle(params[0]);
    if (vehicle) {
        vehicle.setLocation(mapId, x, y);
    }
    return true;
};

// Set Event Location
/**
 * 设置事件位置
 * @param {*} params 
 */
Game_Interpreter.prototype.command203 = function(params) {
    const character = this.character(params[0]);
    if (character) {
        if (params[1] === 0) {
            // Direct designation
            character.locate(params[2], params[3]);
        } else if (params[1] === 1) {
            // Designation with variables
            const x = $gameVariables.value(params[2]);
            const y = $gameVariables.value(params[3]);
            character.locate(x, y);
        } else {
            // Exchange with another event
            const character2 = this.character(params[2]);
            if (character2) {
                character.swap(character2);
            }
        }
        if (params[4] > 0) {
            character.setDirection(params[4]);
        }
    }
    return true;
};

// Scroll Map
/**
 * 滚动地图
 * @param {*} params 
 */
Game_Interpreter.prototype.command204 = function(params) {
    if (!$gameParty.inBattle()) {
        if ($gameMap.isScrolling()) {
            this.setWaitMode("scroll");
            return false;
        }
        $gameMap.startScroll(params[0], params[1], params[2]);
        if (params[3]) {
            this.setWaitMode("scroll");
        }
    }
    return true;
};

// Set Movement Route
/**
 * 设置移动路线
 * @param {*} params 
 */
Game_Interpreter.prototype.command205 = function(params) {
    $gameMap.refreshIfNeeded();
    this._characterId = params[0];
    const character = this.character(this._characterId);
    if (character) {
        character.forceMoveRoute(params[1]);
        if (params[1].wait) {
            this.setWaitMode("route");
        }
    }
    return true;
};

// Get on/off Vehicle
/**
 * 上下交通工具
 */
Game_Interpreter.prototype.command206 = function() {
    $gamePlayer.getOnOffVehicle();
    return true;
};

// Change Transparency
/**
 * 变更透明度
 * @param {*} params 
 */
Game_Interpreter.prototype.command211 = function(params) {
    $gamePlayer.setTransparent(params[0] === 0);
    return true;
};

// Show Animation
/**
 * 显示动画
 * @param {*} params 
 */
Game_Interpreter.prototype.command212 = function(params) {
    this._characterId = params[0];
    const character = this.character(this._characterId);
    if (character) {
        $gameTemp.requestAnimation([character], params[1]);
        if (params[2]) {
            this.setWaitMode("animation");
        }
    }
    return true;
};

// Show Balloon Icon
/**
 * 显示气泡图标
 * @param {*} params 
 */
Game_Interpreter.prototype.command213 = function(params) {
    this._characterId = params[0];
    const character = this.character(this._characterId);
    if (character) {
        $gameTemp.requestBalloon(character, params[1]);
        if (params[2]) {
            this.setWaitMode("balloon");
        }
    }
    return true;
};

// Erase Event
/**
 * 消除事件
 */
Game_Interpreter.prototype.command214 = function() {
    if (this.isOnCurrentMap() && this._eventId > 0) {
        $gameMap.eraseEvent(this._eventId);
    }
    return true;
};

// Change Player Followers
/**
 * 更改随从组(显示/隐藏)
 * @param {*} params 
 */
Game_Interpreter.prototype.command216 = function(params) {
    if (params[0] === 0) {
        $gamePlayer.showFollowers();
    } else {
        $gamePlayer.hideFollowers();
    }
    $gamePlayer.refresh();
    return true;
};

// Gather Followers
/**
 * 集合随从组
 */
Game_Interpreter.prototype.command217 = function() {
    if (!$gameParty.inBattle()) {
        $gamePlayer.gatherFollowers();
        this.setWaitMode("gather");
    }
    return true;
};

// Fadeout Screen
/**
 * 淡出画面
 */
Game_Interpreter.prototype.command221 = function() {
    if ($gameMessage.isBusy()) {
        return false;
    }
    $gameScreen.startFadeOut(this.fadeSpeed());
    this.wait(this.fadeSpeed());
    return true;
};

// Fadein Screen
/**
 * 淡入画面
 */
Game_Interpreter.prototype.command222 = function() {
    if ($gameMessage.isBusy()) {
        return false;
    }
    $gameScreen.startFadeIn(this.fadeSpeed());
    this.wait(this.fadeSpeed());
    return true;
};

// Tint Screen
/**
 * 着色画面(更改画面色调)
 */
Game_Interpreter.prototype.command223 = function(params) {
    $gameScreen.startTint(params[0], params[1]);
    if (params[2]) {
        this.wait(params[1]);
    }
    return true;
};

// Flash Screen
/**
 * 闪烁画面
 */
Game_Interpreter.prototype.command224 = function(params) {
    $gameScreen.startFlash(params[0], params[1]);
    if (params[2]) {
        this.wait(params[1]);
    }
    return true;
};

// Shake Screen
/**
 * 震动画面
 * @param {*} params 
 */
Game_Interpreter.prototype.command225 = function(params) {
    $gameScreen.startShake(params[0], params[1], params[2]);
    if (params[3]) {
        this.wait(params[2]);
    }
    return true;
};

// Wait
/**
 * 等待
 * @param {*} params 
 */
Game_Interpreter.prototype.command230 = function(params) {
    this.wait(params[0]);
    return true;
};

// Show Picture
/**
 * 显示图片
 * @param {*} params 
 */
Game_Interpreter.prototype.command231 = function(params) {
    const point = this.picturePoint(params);
    // prettier-ignore
    $gameScreen.showPicture(
        params[0], params[1], params[2], point.x, point.y,
        params[6], params[7], params[8], params[9]
    );
    return true;
};

// Move Picture
/**
 * 移动图片
 * @param {*} params 
 */
Game_Interpreter.prototype.command232 = function(params) {
    const point = this.picturePoint(params);
    // prettier-ignore
    $gameScreen.movePicture(
        params[0], params[2], point.x, point.y, params[6], params[7],
        params[8], params[9], params[10], params[12] || 0
    );
    if (params[11]) {
        this.wait(params[10]);
    }
    return true;
};

/**
 * 图片点
 * @param {*} params 
 */
Game_Interpreter.prototype.picturePoint = function(params) {
    const point = new Point();
    if (params[3] === 0) {
        // Direct designation
        point.x = params[4];
        point.y = params[5];
    } else {
        // Designation with variables
        point.x = $gameVariables.value(params[4]);
        point.y = $gameVariables.value(params[5]);
    }
    return point;
};

// Rotate Picture
/**
 * 旋转图片
 * @param {*} params 
 */
Game_Interpreter.prototype.command233 = function(params) {
    $gameScreen.rotatePicture(params[0], params[1]);
    return true;
};

// Tint Picture
/**
 * 着色图片
 * @param {*} params 
 */
Game_Interpreter.prototype.command234 = function(params) {
    $gameScreen.tintPicture(params[0], params[1], params[2]);
    if (params[3]) {
        this.wait(params[2]);
    }
    return true;
};

// Erase Picture
/**
 * 消除图片
 * @param {*} params 
 */
Game_Interpreter.prototype.command235 = function(params) {
    $gameScreen.erasePicture(params[0]);
    return true;
};

// Set Weather Effect
/**
 * 设置天气效果
 */
Game_Interpreter.prototype.command236 = function(params) {
    if (!$gameParty.inBattle()) {
        $gameScreen.changeWeather(params[0], params[1], params[2]);
        if (params[3]) {
            this.wait(params[2]);
        }
    }
    return true;
};

// Play BGM
/**
 * 播放bgm
 * @param {*} params 
 */
Game_Interpreter.prototype.command241 = function(params) {
    AudioManager.playBgm(params[0]);
    return true;
};

// Fadeout BGM
/**
 * 淡出bgm
 * @param {*} params 
 */
Game_Interpreter.prototype.command242 = function(params) {
    AudioManager.fadeOutBgm(params[0]);
    return true;
};

// Save BGM
/**
 * 保存bgm
 */
Game_Interpreter.prototype.command243 = function() {
    $gameSystem.saveBgm();
    return true;
};

// Resume BGM
/**
 * 恢复bgm
 */
Game_Interpreter.prototype.command244 = function() {
    $gameSystem.replayBgm();
    return true;
};

// Play BGS
/**
 * 播放bgs
 * @param {*} params 
 */
Game_Interpreter.prototype.command245 = function(params) {
    AudioManager.playBgs(params[0]);
    return true;
};

// Fadeout BGS
/**
 * 淡出bgs
 * @param {*} params 
 */
Game_Interpreter.prototype.command246 = function(params) {
    AudioManager.fadeOutBgs(params[0]);
    return true;
};

// Play ME
/**
 * 播放me
 * @param {*} params 
 */
Game_Interpreter.prototype.command249 = function(params) {
    AudioManager.playMe(params[0]);
    return true;
};

// Play SE
/**
 * 播放se 
 * @param {*} params 
 */
Game_Interpreter.prototype.command250 = function(params) {
    AudioManager.playSe(params[0]);
    return true;
};

// Stop SE
/**
 * 停止se
 */
Game_Interpreter.prototype.command251 = function() {
    AudioManager.stopSe();
    return true;
};

// Play Movie
/**
 * 播放影像
 * @param {*} params 
 */
Game_Interpreter.prototype.command261 = function(params) {
    if ($gameMessage.isBusy()) {
        return false;
    }
    const name = params[0];
    if (name.length > 0) {
        const ext = this.videoFileExt();
        Video.play("movies/" + name + ext);
        this.setWaitMode("video");
    }
    return true;
};

/**
 * 视频文件后缀
 */
Game_Interpreter.prototype.videoFileExt = function() {
    if (Utils.canPlayWebm()) {
        return ".webm";
    } else {
        return ".mp4";
    }
};

// Change Map Name Display
/**
 * 改变地图名称显示
 * @param {*} params 
 */
Game_Interpreter.prototype.command281 = function(params) {
    if (params[0] === 0) {
        $gameMap.enableNameDisplay();
    } else {
        $gameMap.disableNameDisplay();
    }
    return true;
};

// Change Tileset
/**
 * 设置地图图块组
 * @param {*} params 
 */
Game_Interpreter.prototype.command282 = function(params) {
    const tileset = $dataTilesets[params[0]];
    const allReady = tileset.tilesetNames
        .map(tilesetName => ImageManager.loadTileset(tilesetName))
        .every(bitmap => bitmap.isReady());
    if (allReady) {
        $gameMap.changeTileset(params[0]);
        return true;
    } else {
        return false;
    }
};

// Change Battle Background
/**
 * 改变战斗背景
 * @param {*} params 
 */
Game_Interpreter.prototype.command283 = function(params) {
    $gameMap.changeBattleback(params[0], params[1]);
    return true;
};

// Change Parallax
/**
 * 改变远景图
 * @param {*} params 
 */
Game_Interpreter.prototype.command284 = function(params) {
    // prettier-ignore
    $gameMap.changeParallax(
        params[0], params[1], params[2], params[3], params[4]
    );
    return true;
};

// Get Location Info
/**
 * 获取位置信息
 * @param {*} params 
 */
Game_Interpreter.prototype.command285 = function(params) {
    let x, y, value;
    if (params[2] === 0) {
        // Direct designation
        x = params[3];
        y = params[4];
    } else if (params[2] === 1) {
        // Designation with variables
        x = $gameVariables.value(params[3]);
        y = $gameVariables.value(params[4]);
    } else {
        // Designation by a character
        const character = this.character(params[3]);
        x = character.x;
        y = character.y;
    }
    switch (params[1]) {
        case 0: // Terrain Tag
            value = $gameMap.terrainTag(x, y);
            break;
        case 1: // Event ID
            value = $gameMap.eventIdXy(x, y);
            break;
        case 2: // Tile ID (Layer 1)
        case 3: // Tile ID (Layer 2)
        case 4: // Tile ID (Layer 3)
        case 5: // Tile ID (Layer 4)
            value = $gameMap.tileId(x, y, params[1] - 2);
            break;
        default:
            // Region ID
            value = $gameMap.regionId(x, y);
            break;
    }
    $gameVariables.setValue(params[0], value);
    return true;
};

// Battle Processing
/**
 * 战斗处理
 * @param {*} params 
 */
Game_Interpreter.prototype.command301 = function(params) {
    if (!$gameParty.inBattle()) {
        let troopId;
        if (params[0] === 0) {
            // Direct designation
            troopId = params[1];
        } else if (params[0] === 1) {
            // Designation with a variable
            troopId = $gameVariables.value(params[1]);
        } else {
            // Same as Random Encounters
            troopId = $gamePlayer.makeEncounterTroopId();
        }
        if ($dataTroops[troopId]) {
            BattleManager.setup(troopId, params[2], params[3]);
            BattleManager.setEventCallback(n => {
                this._branch[this._indent] = n;
            });
            $gamePlayer.makeEncounterCount();
            SceneManager.push(Scene_Battle);
        }
    }
    return true;
};

// If Win
/**
 * 当胜利
 */
Game_Interpreter.prototype.command601 = function() {
    if (this._branch[this._indent] !== 0) {
        this.skipBranch();
    }
    return true;
};

// If Escape
/**
 * 当逃跑
 */
Game_Interpreter.prototype.command602 = function() {
    if (this._branch[this._indent] !== 1) {
        this.skipBranch();
    }
    return true;
};

// If Lose
/**
 * 当失败
 */
Game_Interpreter.prototype.command603 = function() {
    if (this._branch[this._indent] !== 2) {
        this.skipBranch();
    }
    return true;
};

// Shop Processing
/**
 * 商店处理
 * @param {*} params 
 */
Game_Interpreter.prototype.command302 = function(params) {
    if (!$gameParty.inBattle()) {
        const goods = [params];
        while (this.nextEventCode() === 605) {
            this._index++;
            goods.push(this.currentCommand().parameters);
        }
        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(goods, params[4]);
    }
    return true;
};

// Name Input Processing
/**
 * 名称输入处理
 * @param {*} params 
 */
Game_Interpreter.prototype.command303 = function(params) {
    if (!$gameParty.inBattle()) {
        if ($dataActors[params[0]]) {
            SceneManager.push(Scene_Name);
            SceneManager.prepareNextScene(params[0], params[1]);
        }
    }
    return true;
};

// Change HP
/**
 * 改变HP
 * @param {*} params 
 */
Game_Interpreter.prototype.command311 = function(params) {
    const value = this.operateValue(params[2], params[3], params[4]);
    this.iterateActorEx(params[0], params[1], actor => {
        this.changeHp(actor, value, params[5]);
    });
    return true;
};

// Change MP
/**
 * 改变MP
 * @param {*} params 
 */
Game_Interpreter.prototype.command312 = function(params) {
    const value = this.operateValue(params[2], params[3], params[4]);
    this.iterateActorEx(params[0], params[1], actor => {
        actor.gainMp(value);
    });
    return true;
};

// Change TP
/**
 * 改变TP
 * @param {*} params 
 */
Game_Interpreter.prototype.command326 = function(params) {
    const value = this.operateValue(params[2], params[3], params[4]);
    this.iterateActorEx(params[0], params[1], actor => {
        actor.gainTp(value);
    });
    return true;
};

// Change State
/**
 * 改变状态
 * @param {*} params 
 */
Game_Interpreter.prototype.command313 = function(params) {
    this.iterateActorEx(params[0], params[1], actor => {
        const alreadyDead = actor.isDead();
        if (params[2] === 0) {
            actor.addState(params[3]);
        } else {
            actor.removeState(params[3]);
        }
        if (actor.isDead() && !alreadyDead) {
            actor.performCollapse();
        }
        actor.clearResult();
    });
    return true;
};

// Recover All
/**
 * 恢复所有
 * @param {*} params 
 */
Game_Interpreter.prototype.command314 = function(params) {
    this.iterateActorEx(params[0], params[1], actor => {
        actor.recoverAll();
    });
    return true;
};

// Change EXP
/**
 * 改变经验值 EXP
 * @param {*} params 
 */
Game_Interpreter.prototype.command315 = function(params) {
    const value = this.operateValue(params[2], params[3], params[4]);
    this.iterateActorEx(params[0], params[1], actor => {
        actor.changeExp(actor.currentExp() + value, params[5]);
    });
    return true;
};

// Change Level
/**
 * 改变等级 
 * @param {*} params 
 */
Game_Interpreter.prototype.command316 = function(params) {
    const value = this.operateValue(params[2], params[3], params[4]);
    this.iterateActorEx(params[0], params[1], actor => {
        actor.changeLevel(actor.level + value, params[5]);
    });
    return true;
};

// Change Parameter
/**
 * 改变参数
 * @param {*} params 
 */
Game_Interpreter.prototype.command317 = function(params) {
    const value = this.operateValue(params[3], params[4], params[5]);
    this.iterateActorEx(params[0], params[1], actor => {
        actor.addParam(params[2], value);
    });
    return true;
};

// Change Skill
/**
 * 改变技能
 * @param {*} params 
 */
Game_Interpreter.prototype.command318 = function(params) {
    this.iterateActorEx(params[0], params[1], actor => {
        if (params[2] === 0) {
            actor.learnSkill(params[3]);
        } else {
            actor.forgetSkill(params[3]);
        }
    });
    return true;
};

// Change Equipment
/**
 * 改变装备
 * @param {*} params 
 */
Game_Interpreter.prototype.command319 = function(params) {
    const actor = $gameActors.actor(params[0]);
    if (actor) {
        actor.changeEquipById(params[1], params[2]);
    }
    return true;
};

// Change Name
/**
 * 改变名称
 * @param {*} params 
 */
Game_Interpreter.prototype.command320 = function(params) {
    const actor = $gameActors.actor(params[0]);
    if (actor) {
        actor.setName(params[1]);
    }
    return true;
};

// Change Class
/**
 * 改变职业
 * @param {*} params 
 */
Game_Interpreter.prototype.command321 = function(params) {
    const actor = $gameActors.actor(params[0]);
    if (actor && $dataClasses[params[1]]) {
        actor.changeClass(params[1], params[2]);
    }
    return true;
};

// Change Actor Images
/**
 * 改变角色图片
 * @param {*} params 
 */
Game_Interpreter.prototype.command322 = function(params) {
    const actor = $gameActors.actor(params[0]);
    if (actor) {
        actor.setCharacterImage(params[1], params[2]);
        actor.setFaceImage(params[3], params[4]);
        actor.setBattlerImage(params[5]);
    }
    $gamePlayer.refresh();
    return true;
};

// Change Vehicle Image
/**
 * 改变交通工具图片
 * @param {*} params 
 */
Game_Interpreter.prototype.command323 = function(params) {
    const vehicle = $gameMap.vehicle(params[0]);
    if (vehicle) {
        vehicle.setImage(params[1], params[2]);
    }
    return true;
};

// Change Nickname
/**
 * 改变昵称
 * @param {*} params 
 */
Game_Interpreter.prototype.command324 = function(params) {
    const actor = $gameActors.actor(params[0]);
    if (actor) {
        actor.setNickname(params[1]);
    }
    return true;
};

// Change Profile
/**
 * 改变人物简介
 * @param {*} params 
 */
Game_Interpreter.prototype.command325 = function(params) {
    const actor = $gameActors.actor(params[0]);
    if (actor) {
        actor.setProfile(params[1]);
    }
    return true;
};

// Change Enemy HP
/**
 * 改变敌人HP
 * @param {*} params 
 */
Game_Interpreter.prototype.command331 = function(params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    this.iterateEnemyIndex(params[0], enemy => {
        this.changeHp(enemy, value, params[4]);
    });
    return true;
};

// Change Enemy MP
/**
 * 改变敌人MP
 * @param {*} params 
 */
Game_Interpreter.prototype.command332 = function(params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    this.iterateEnemyIndex(params[0], enemy => {
        enemy.gainMp(value);
    });
    return true;
};

// Change Enemy TP
/**
 * 改变敌人TP
 * @param {*} params 
 */
Game_Interpreter.prototype.command342 = function(params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    this.iterateEnemyIndex(params[0], enemy => {
        enemy.gainTp(value);
    });
    return true;
};

// Change Enemy State
/**
 * 改变敌人状态
 * @param {*} params 
 */
Game_Interpreter.prototype.command333 = function(params) {
    this.iterateEnemyIndex(params[0], enemy => {
        const alreadyDead = enemy.isDead();
        if (params[1] === 0) {
            enemy.addState(params[2]);
        } else {
            enemy.removeState(params[2]);
        }
        if (enemy.isDead() && !alreadyDead) {
            enemy.performCollapse();
        }
        enemy.clearResult();
    });
    return true;
};

// Enemy Recover All
/**
 * 敌人全部恢复
 * @param {*} params 
 */
Game_Interpreter.prototype.command334 = function(params) {
    this.iterateEnemyIndex(params[0], enemy => {
        enemy.recoverAll();
    });
    return true;
};

// Enemy Appear
/**
 * 敌人出现
 * @param {*} params 
 */
Game_Interpreter.prototype.command335 = function(params) {
    this.iterateEnemyIndex(params[0], enemy => {
        enemy.appear();
        $gameTroop.makeUniqueNames();
    });
    return true;
};

// Enemy Transform
/**
 * 敌人转变
 * @param {*} params 
 */
Game_Interpreter.prototype.command336 = function(params) {
    this.iterateEnemyIndex(params[0], enemy => {
        enemy.transform(params[1]);
        $gameTroop.makeUniqueNames();
    });
    return true;
};

// Show Battle Animation
/**
 * 显示战斗动画
 * @param {*} params 
 */
Game_Interpreter.prototype.command337 = function(params) {
    let param = params[0];
    if (params[2]) {
        param = -1;
    }
    const targets = [];
    this.iterateEnemyIndex(param, enemy => {
        if (enemy.isAlive()) {
            targets.push(enemy);
        }
    });
    $gameTemp.requestAnimation(targets, params[1]);
    return true;
};

// Force Action
/**
 * 强制动作
 * @param {*} params 
 */
Game_Interpreter.prototype.command339 = function(params) {
    this.iterateBattler(params[0], params[1], battler => {
        if (!battler.isDeathStateAffected()) {
            battler.forceAction(params[2], params[3]);
            BattleManager.forceAction(battler);
            this.setWaitMode("action");
        }
    });
    return true;
};

// Abort Battle
/**
 * 中止战斗
 */
Game_Interpreter.prototype.command340 = function() {
    BattleManager.abort();
    return true;
};

// Open Menu Screen
/**
 * 打开菜单画面
 */
Game_Interpreter.prototype.command351 = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
    }
    return true;
};

// Open Save Screen
/**
 * 打开存档画面
 */
Game_Interpreter.prototype.command352 = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Save);
    }
    return true;
};

// Game Over
/**
 * 游戏结束
 */
Game_Interpreter.prototype.command353 = function() {
    SceneManager.goto(Scene_Gameover);
    return true;
};

// Return to Title Screen
/**
 * 返回到标题画面
 */
Game_Interpreter.prototype.command354 = function() {
    SceneManager.goto(Scene_Title);
    return true;
};

// Script
/**
 * 脚本
 */
Game_Interpreter.prototype.command355 = function() {
    let script = this.currentCommand().parameters[0] + "\n";
    while (this.nextEventCode() === 655) {
        this._index++;
        script += this.currentCommand().parameters[0] + "\n";
    }
    eval(script);
    return true;
};

// Plugin Command MV (deprecated)
/**
 * 插件命令MV（不建议使用）
 * @param {*} params 
 */
Game_Interpreter.prototype.command356 = function(params) {
    const args = params[0].split(" ");
    const command = args.shift();
    this.pluginCommand(command, args);
    return true;
};

/**
 * 插件命令  
 */
Game_Interpreter.prototype.pluginCommand = function() {
    // deprecated
};

// Plugin Command
/**
 * 插件命令
 * @param {*} params 
 */
Game_Interpreter.prototype.command357 = function(params) {
    PluginManager.callCommand(this, params[0], params[1], params[3]);
    return true;
};

//-----------------------------------------------------------------------------
