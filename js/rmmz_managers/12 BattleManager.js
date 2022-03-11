//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

/**
 * 战斗管理器
 * 
 * 管理战斗进度的静态类。
 */
function BattleManager() {
    throw new Error("This is a static class");
}

/**
 * 安装
 * @param {number} troopId 敌群id
 * @param {boolean} canEscape 能逃跑
 * @param {boolean} canLose 能失败
 */
BattleManager.setup = function(troopId, canEscape, canLose) {
    this.initMembers();
    /**
     * 能逃跑
     */
    this._canEscape = canEscape;
    /**
     * 能失败
     */
    this._canLose = canLose;
    $gameTroop.setup(troopId);
    $gameScreen.onBattleStart();
    this.makeEscapeRatio();
};

/**
 * 初始化成员
 */
BattleManager.initMembers = function() {
    /**
     * 阶段
     */
    this._phase = "";
    /**
     * 输入中
     * @mz 新增
     */
    this._inputting = false;
    /**
     * 能逃跑
     */
    this._canEscape = false;
    /**
     * 能失败
     */
    this._canLose = false;
    /**
     * 战斗测试
     */
    this._battleTest = false;
    /**
     * 事件呼叫返回
     */
    this._eventCallback = null;
    /**
     * 先发制人的
     */
    this._preemptive = false;
    /**
     * 突然袭击的
     */
    this._surprise = false;
    /**
     * 当前角色
     * 
     * @mz 
     * 替代了mv中的this._actorIndex
     */
    this._currentActor = null;
    /**
     * 动作强制战斗者
     */
    this._actionForcedBattler = null;
    /**
     * 地图bgm
     */
    this._mapBgm = null;
    /**
     * 地图bgs
     */
    this._mapBgs = null;
    /**
     * 动作战斗者组
     */
    this._actionBattlers = [];
    /**
     * 主体
     */
    this._subject = null;
    /**
     * 动作
     */
    this._action = null;
    /**
     * 目标组
     */
    this._targets = [];
    /**
     * 日志窗口
     */
    this._logWindow = null;
    /**
     * @mz 
     * mv中的
     * this._statusWindow 状态窗口
     * 被删除
     */
    /**
     * 精灵组
     */
    this._spriteset = null;
    /**
     * 逃跑概率
     */
    this._escapeRatio = 0;
    /**
     * 逃跑的
     */
    this._escaped = false;
    /**
     * 奖励
     */
    this._rewards = {};
    /**
     * tpb需要队伍命令
     * @mz 新增
     */
    this._tpbNeedsPartyCommand = true;
    /**
     * @mz
     * mv 中的 
     * this._turnForced 回合强制的
     * 被删除
     */
};

/**
 * 是Tpb
 * @mz 新增
 */
BattleManager.isTpb = function() {
    return $dataSystem.battleSystem >= 1;
};

/**
 * 是即时的Tpb
 * @mz 新增
 * 
 */
BattleManager.isActiveTpb = function() {
    return $dataSystem.battleSystem === 1;
};

/**
 * 是战斗测试
 */
BattleManager.isBattleTest = function() {
    return this._battleTest;
};

/**
 * 设置战斗测试
 * @param {boolean} battleTest 战斗测试
 */
BattleManager.setBattleTest = function(battleTest) {
    this._battleTest = battleTest;
};

/**
 * 设置事件回调方法
 * @param {function} callback 回调方法
 */
BattleManager.setEventCallback = function(callback) {
    this._eventCallback = callback;
};

/**
 * 设置日志窗口
 * @param {Window_BattleLog} logWindow 日志窗口
 */
BattleManager.setLogWindow = function(logWindow) {
    this._logWindow = logWindow;
};

/**
 * @mz 
 * mv 中的 BattleManager.setStatusWindow 设置状态窗口 
 * 被删除 
 */

/**
 * 设置精灵组
 * @param {*} spriteset 精灵组
 */
BattleManager.setSpriteset = function(spriteset) {
    this._spriteset = spriteset;
};

/**
 * 当遭遇
 * 计算先发制人和突然袭击
 */
BattleManager.onEncounter = function() {
    this._preemptive = Math.random() < this.ratePreemptive();
    this._surprise = Math.random() < this.rateSurprise() && !this._preemptive;
};

/**
 * 先发制人比例
 * @returns {number}
 */
BattleManager.ratePreemptive = function() {
    return $gameParty.ratePreemptive($gameTroop.agility());
};

/**突然袭击比例
 * @returns {number} 
 */
BattleManager.rateSurprise = function() {
    return $gameParty.rateSurprise($gameTroop.agility());
};

/**保存bgm和bgs */
BattleManager.saveBgmAndBgs = function() {
    this._mapBgm = AudioManager.saveBgm();
    this._mapBgs = AudioManager.saveBgs();
};

/**播放战斗bgm */
BattleManager.playBattleBgm = function() {
    AudioManager.playBgm($gameSystem.battleBgm());
    AudioManager.stopBgs();
};

/**播放胜利me */
BattleManager.playVictoryMe = function() {
    AudioManager.playMe($gameSystem.victoryMe());
};

/**播放失败me */
BattleManager.playDefeatMe = function() {
    AudioManager.playMe($gameSystem.defeatMe());
};

/**重播bgm和bgs */
BattleManager.replayBgmAndBgs = function() {
    if (this._mapBgm) {
        AudioManager.replayBgm(this._mapBgm);
    } else {
        AudioManager.stopBgm();
    }
    if (this._mapBgs) {
        AudioManager.replayBgs(this._mapBgs);
    }
};

/**
 * 制作逃跑概率
 * 
 */
BattleManager.makeEscapeRatio = function() {
    /**
     * 逃跑概率 = 0.5 * 游戏队伍.敏捷() / 游戏敌群.敏捷()
     */
    this._escapeRatio = (0.5 * $gameParty.agility()) / $gameTroop.agility();
};

/**
 * 更新
 * @param {*} timeActive 活动时间
 */
BattleManager.update = function(timeActive) {
    if (!this.isBusy() && !this.updateEvent()) {
        this.updatePhase(timeActive);
    }
    if (this.isTpb()) {
        this.updateTpbInput();
    }
};

/**
 * 更新阶段
 * @param {*} timeActive 活动时间
 * @mz 新增 
 * mv中的内容被集中处理
 */
BattleManager.updatePhase = function(timeActive) {
    switch (this._phase) {
        case "start":
            this.updateStart();
            break;
        case "turn":
            this.updateTurn(timeActive);
            break;
        case "action":
            this.updateAction();
            break;
        case "turnEnd":
            this.updateTurnEnd();
            break;
        case "battleEnd":
            this.updateBattleEnd();
            break;
    }
};

/**
 * 更新事件
 */
BattleManager.updateEvent = function() {
    switch (this._phase) {
        case "start":
        case "turn":
        case "turnEnd":
            if (this.isActionForced()) {
                this.processForcedAction();
                return true;
            } else {
                return this.updateEventMain();
            }
    }
    return this.checkAbort();
};

/**
 * 更新事件主要
 */
BattleManager.updateEventMain = function() {
    $gameTroop.updateInterpreter();
    $gameParty.requestMotionRefresh();
    if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
        return true;
    }
    $gameTroop.setupBattleEvent();
    if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
        return true;
    }
    return false;
};

/**
 * 是忙碌
 */
BattleManager.isBusy = function() {
    return (
        $gameMessage.isBusy() ||
        this._spriteset.isBusy() ||
        this._logWindow.isBusy()
    );
};

/**
 * 更新Tpb输入
 */
BattleManager.updateTpbInput = function() {
    if (this._inputting) {
        this.checkTpbInputClose();
    } else {
        this.checkTpbInputOpen();
    }
};

/**
 * 检查Tpb输入关闭
 */
BattleManager.checkTpbInputClose = function() {
    if (!this.isPartyTpbInputtable() || this.needsActorInputCancel()) {
        this.cancelActorInput();
        this._currentActor = null;
        this._inputting = false;
    }
};

/**
 * 检查Tpb输入打开
 */
BattleManager.checkTpbInputOpen = function() {
    if (this.isPartyTpbInputtable()) {
        if (this._tpbNeedsPartyCommand) {
            this._inputting = true;
            this._tpbNeedsPartyCommand = false;
        } else {
            this.selectNextCommand();
        }
    }
};

/**
 * 是队伍Tpb可输入
 */
BattleManager.isPartyTpbInputtable = function() {
    return $gameParty.canInput() && this.isTpbMainPhase();
};

/**
 * 需要角色输入取消
 */
BattleManager.needsActorInputCancel = function() {
    return this._currentActor && !this._currentActor.canInput();
};

/**
 * 是Tpb主要阶段
 */
BattleManager.isTpbMainPhase = function() {
    return ["turn", "turnEnd", "action"].includes(this._phase);
};

/**
 * 是输入中
 */
BattleManager.isInputting = function() {
    return this._inputting;
};

/**
 * 是在回合
 */
BattleManager.isInTurn = function() {
    return this._phase === "turn";
};

/**
 * 是回合结束
 */
BattleManager.isTurnEnd = function() {
    return this._phase === "turnEnd";
};

/**
 * 是中止
 */
BattleManager.isAborting = function() {
    return this._phase === "aborting";
};

/**
 * 是战斗结束
 */
BattleManager.isBattleEnd = function() {
    return this._phase === "battleEnd";
};

/**
 * 能逃跑
 */
BattleManager.canEscape = function() {
    return this._canEscape;
};

/**
 * 能失败
 */
BattleManager.canLose = function() {
    return this._canLose;
};

/**
 * 是逃跑的
 */
BattleManager.isEscaped = function() {
    return this._escaped;
};

/**
 * 角色
 */
BattleManager.actor = function() {
    return this._currentActor;
};

/**
 * 开始战斗
 */
BattleManager.startBattle = function() {
    this._phase = "start";
    $gameSystem.onBattleStart();
    $gameParty.onBattleStart(this._preemptive);
    $gameTroop.onBattleStart(this._surprise);
    this.displayStartMessages();
};

/**
 * 显示开始消息
 */
BattleManager.displayStartMessages = function() {
    for (const name of $gameTroop.enemyNames()) {
        $gameMessage.add(TextManager.emerge.format(name));
    }
    if (this._preemptive) {
        $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
    } else if (this._surprise) {
        $gameMessage.add(TextManager.surprise.format($gameParty.name()));
    }
};

/**开始输入 */
BattleManager.startInput = function() {
    this._phase = "input";
    this._inputting = true;
    $gameParty.makeActions();
    $gameTroop.makeActions();
    this._currentActor = null;
    if (this._surprise || !$gameParty.canInput()) {
        this.startTurn();
    }
};

/**
 * 输入中动作
 */
BattleManager.inputtingAction = function() {
    return this._currentActor ? this._currentActor.inputtingAction() : null;
};

/**
 * 选择下一个命令
 */
BattleManager.selectNextCommand = function() {
    if (this._currentActor) {
        if (this._currentActor.selectNextCommand()) {
            return;
        }
        this.finishActorInput();
    }
    this.selectNextActor();
};

/**
 * 选择下一个角色
 */
BattleManager.selectNextActor = function() {
    this.changeCurrentActor(true);
    if (!this._currentActor) {
        if (this.isTpb()) {
            this.changeCurrentActor(true);
        } else {
            this.startTurn();
        }
    }
};

/**
 * 选择上一个命令
 */
BattleManager.selectPreviousCommand = function() {
    if (this._currentActor) {
        if (this._currentActor.selectPreviousCommand()) {
            return;
        }
        this.cancelActorInput();
    }
    this.selectPreviousActor();
};

/**
 * 选择上一个角色
 */
BattleManager.selectPreviousActor = function() {
    if (this.isTpb()) {
        this.changeCurrentActor(true);
        if (!this._currentActor) {
            this._inputting = $gameParty.canInput();
        }
    } else {
        this.changeCurrentActor(false);
    }
};

/**
 * 更改当前角色
 * @param {boolean} forward 选择后面一个
 */
BattleManager.changeCurrentActor = function(forward) {
    const members = $gameParty.battleMembers();
    let actor = this._currentActor;
    for (;;) {
        const currentIndex = members.indexOf(actor);
        actor = members[currentIndex + (forward ? 1 : -1)];
        if (!actor || actor.canInput()) {
            break;
        }
    }
    this._currentActor = actor ? actor : null;
    this.startActorInput();
};

/**
 * 开始角色输入
 */
BattleManager.startActorInput = function() {
    if (this._currentActor) {
        this._currentActor.setActionState("inputting");
        this._inputting = true;
    }
};

/**
 * 完成角色输入
 */
BattleManager.finishActorInput = function() {
    if (this._currentActor) {
        if (this.isTpb()) {
            this._currentActor.startTpbCasting();
        }
        this._currentActor.setActionState("waiting");
    }
};

/**
 * 取消角色输入
 */
BattleManager.cancelActorInput = function() {
    if (this._currentActor) {
        this._currentActor.setActionState("undecided");
    }
};

/**
 * 更新开始
 */
BattleManager.updateStart = function() {
    if (this.isTpb()) {
        this._phase = "turn";
    } else {
        this.startInput();
    }
};

/**
 * 开始回合
 */
BattleManager.startTurn = function() {
    this._phase = "turn";
    $gameTroop.increaseTurn();
    $gameParty.requestMotionRefresh();
    if (!this.isTpb()) {
        this.makeActionOrders();
        this._logWindow.startTurn();
        this._inputting = false;
    }
};

/**
 * 更新回合
 * @param {*} timeActive 活动时间
 */
BattleManager.updateTurn = function(timeActive) {
    $gameParty.requestMotionRefresh();
    if (this.isTpb() && timeActive) {
        this.updateTpb();
    }
    if (!this._subject) {
        this._subject = this.getNextSubject();
    }
    if (this._subject) {
        this.processTurn();
    } else if (!this.isTpb()) {
        this.endTurn();
    }
};

/**
 * 更新tpb
 */
BattleManager.updateTpb = function() {
    $gameParty.updateTpb();
    $gameTroop.updateTpb();
    this.updateAllTpbBattlers();
    this.checkTpbTurnEnd();
};

/**
 * 更新所有Tpb战斗者 
 */
BattleManager.updateAllTpbBattlers = function() {
    for (const battler of this.allBattleMembers()) {
        this.updateTpbBattler(battler);
    }
};

/**
 * 更新Tpb 战斗者 
 * @param {Game_Battler} battler 战斗者 
 */
BattleManager.updateTpbBattler = function(battler) {
    if (battler.isTpbTurnEnd()) {
        battler.onTurnEnd();
        battler.startTpbTurn();
        this.displayBattlerStatus(battler, false);
    } else if (battler.isTpbReady()) {
        battler.startTpbAction();
        this._actionBattlers.push(battler);
    } else if (battler.isTpbTimeout()) {
        battler.onTpbTimeout();
        this.displayBattlerStatus(battler, true);
    }
};

/**
 * 检查Tpb回合结束
 */
BattleManager.checkTpbTurnEnd = function() {
    if ($gameTroop.isTpbTurnEnd()) {
        this.endTurn();
    }
};

/**
 * 进行回合
 */
BattleManager.processTurn = function() {
    const subject = this._subject;
    const action = subject.currentAction();
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
    } else {
        this.endAction();
        this._subject = null;
    }
};

/**
 * 结束战斗者动作
 * @param {*} battler 
 */
BattleManager.endBattlerActions = function(battler) {
    battler.setActionState(this.isTpb() ? "undecided" : "done");
    battler.onAllActionsEnd();
    battler.clearTpbChargeTime();
    this.displayBattlerStatus(battler, true);
};

/**
 * 结束回合
 */
BattleManager.endTurn = function() {
    this._phase = "turnEnd";
    this._preemptive = false;
    this._surprise = false;
    if (!this.isTpb()) {
        this.endAllBattlersTurn();
    }
};

/**
 * 结束所有战斗者回合
 */
BattleManager.endAllBattlersTurn = function() {
    for (const battler of this.allBattleMembers()) {
        battler.onTurnEnd();
        this.displayBattlerStatus(battler, false);
    }
};

/**
 * 显示战斗者状态
 * @param {*} battler 战斗者
 * @param {boolean} current 当前
 */
BattleManager.displayBattlerStatus = function(battler, current) {
    this._logWindow.displayAutoAffectedStatus(battler);
    if (current) {
        this._logWindow.displayCurrentState(battler);
    }
    this._logWindow.displayRegeneration(battler);
};

/**
 * 更新回合结束
 */
BattleManager.updateTurnEnd = function() {
    if (this.isTpb()) {
        this.startTurn();
    } else {
        this.startInput();
    }
};

/**
 * 获得下一个主体
 */
BattleManager.getNextSubject = function() {
    for (;;) {
        const battler = this._actionBattlers.shift();
        if (!battler) {
            return null;
        }
        if (battler.isBattleMember() && battler.isAlive()) {
            return battler;
        }
    }
};

/**
 * 所有战斗成员
 */
BattleManager.allBattleMembers = function() {
    return $gameParty.battleMembers().concat($gameTroop.members());
};

/**
 * 制定行动指令组
 */
BattleManager.makeActionOrders = function() {
    const battlers = [];
    if (!this._surprise) {
        battlers.push(...$gameParty.battleMembers());
    }
    if (!this._preemptive) {
        battlers.push(...$gameTroop.members());
    }
    for (const battler of battlers) {
        battler.makeSpeed();
    }
    battlers.sort((a, b) => b.speed() - a.speed());
    this._actionBattlers = battlers;
};

/**
 * 开始动作
 */
BattleManager.startAction = function() {
    const subject = this._subject;
    const action = subject.currentAction();
    const targets = action.makeTargets();
    this._phase = "action";
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item());
    this._action.applyGlobal();
    this._logWindow.startAction(subject, action, targets);
};

/**
 * 更新动作
 */
BattleManager.updateAction = function() {
    const target = this._targets.shift();
    if (target) {
        this.invokeAction(this._subject, target);
    } else {
        this.endAction();
    }
};

/**
 * 结束动作
 */
BattleManager.endAction = function() {
    this._logWindow.endAction(this._subject);
    this._phase = "turn";
    if (this._subject.numActions() === 0) {
        this.endBattlerActions(this._subject);
        this._subject = null;
    }
};

/**
 * 调用动作
 * @param {Game_Battler} subject 主体
 * @param {Game_Battler} target 目标
 */
BattleManager.invokeAction = function(subject, target) {
    this._logWindow.push("pushBaseLine");
    if (Math.random() < this._action.itemCnt(target)) {
        this.invokeCounterAttack(subject, target);
    } else if (Math.random() < this._action.itemMrf(target)) {
        this.invokeMagicReflection(subject, target);
    } else {
        this.invokeNormalAction(subject, target);
    }
    subject.setLastTarget(target);
    this._logWindow.push("popBaseLine");
};

/**
 * 调用正常动作
 * @param {*} subject 
 * @param {*} target 
 */
BattleManager.invokeNormalAction = function(subject, target) {
    const realTarget = this.applySubstitute(target);
    this._action.apply(realTarget);
    this._logWindow.displayActionResults(subject, realTarget);
};

/**
 * 调用反击
 * @param {*} subject 
 * @param {*} target 
 */
BattleManager.invokeCounterAttack = function(subject, target) {
    const action = new Game_Action(target);
    action.setAttack();
    action.apply(subject);
    this._logWindow.displayCounter(target);
    this._logWindow.displayActionResults(target, subject);
};

/**
 * 调用魔法反射
 * @param {*} subject 
 * @param {*} target 
 */
BattleManager.invokeMagicReflection = function(subject, target) {
    this._action._reflectionTarget = target;
    this._logWindow.displayReflection(target);
    this._action.apply(subject);
    this._logWindow.displayActionResults(target, subject);
};

/**
 * 应用替代
 * @param {*} target 
 */
BattleManager.applySubstitute = function(target) {
    if (this.checkSubstitute(target)) {
        const substitute = target.friendsUnit().substituteBattler();
        if (substitute && target !== substitute) {
            this._logWindow.displaySubstitute(substitute, target);
            return substitute;
        }
    }
    return target;
};

/**
 * 检查替代
 * @param {*} target 
 */
BattleManager.checkSubstitute = function(target) {
    return target.isDying() && !this._action.isCertainHit();
};

/**
 * 是强制动作
 */
BattleManager.isActionForced = function() {
    return !!this._actionForcedBattler;
};

/**
 * 强制动作
 * @param {*} battler 
 */
BattleManager.forceAction = function(battler) {
    this._actionForcedBattler = battler;
    this._actionBattlers.remove(battler);
};

/**
 * 进行强制动作
 */
BattleManager.processForcedAction = function() {
    if (this._actionForcedBattler) {
        if (this._subject) {
            this.endBattlerActions(this._subject);
        }
        this._subject = this._actionForcedBattler;
        this._actionForcedBattler = null;
        this.startAction();
        this._subject.removeCurrentAction();
    }
};

/**
 * 中止
 */
BattleManager.abort = function() {
    this._phase = "aborting";
};

/**
 * 检查战斗结束
 */
BattleManager.checkBattleEnd = function() {
    if (this._phase) {
        if (this.checkAbort()) {
            return true;
        } else if ($gameParty.isAllDead()) {
            this.processDefeat();
            return true;
        } else if ($gameTroop.isAllDead()) {
            this.processVictory();
            return true;
        }
    }
    return false;
};

/**
 * 检查中止
 */
BattleManager.checkAbort = function() {
    if ($gameParty.isEmpty() || this.isAborting()) {
        this.processAbort();
    }
    return false;
};

/**
 * 进行胜利
 */
BattleManager.processVictory = function() {
    $gameParty.removeBattleStates();
    $gameParty.performVictory();
    this.playVictoryMe();
    this.replayBgmAndBgs();
    this.makeRewards();
    this.displayVictoryMessage();
    this.displayRewards();
    this.gainRewards();
    this.endBattle(0);
};

/**
 * 进行逃跑
 */
BattleManager.processEscape = function() {
    $gameParty.performEscape();
    SoundManager.playEscape();
    const success = this._preemptive || Math.random() < this._escapeRatio;
    if (success) {
        this.onEscapeSuccess();
    } else {
        this.onEscapeFailure();
    }
    return success;
};

/**
 * 当逃跑成功
 */
BattleManager.onEscapeSuccess = function() {
    this.displayEscapeSuccessMessage();
    this._escaped = true;
    this.processAbort();
};

/**
 * 当逃跑失败
 */
BattleManager.onEscapeFailure = function() {
    $gameParty.onEscapeFailure();
    this.displayEscapeFailureMessage();
    this._escapeRatio += 0.1;
    if (!this.isTpb()) {
        this.startTurn();
    }
};

/**
 * 进行中止
 */
BattleManager.processAbort = function() {
    $gameParty.removeBattleStates();
    this._logWindow.clear();
    this.replayBgmAndBgs();
    this.endBattle(1);
};

/**
 * 进行失败
 */
BattleManager.processDefeat = function() {
    this.displayDefeatMessage();
    this.playDefeatMe();
    if (this._canLose) {
        this.replayBgmAndBgs();
    } else {
        AudioManager.stopBgm();
    }
    this.endBattle(2);
};

/**
 * 结束战斗
 * @param {number} result 结果 0 胜利 1 中止 2失败
 */
BattleManager.endBattle = function(result) {
    this._phase = "battleEnd";
    this.cancelActorInput();
    this._inputting = false;
    if (this._eventCallback) {
        this._eventCallback(result);
    }
    if (result === 0) {
        $gameSystem.onBattleWin();
    } else if (this._escaped) {
        $gameSystem.onBattleEscape();
    }
};

/**
 * 更新战斗结束
 */
BattleManager.updateBattleEnd = function() {
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if (!this._escaped && $gameParty.isAllDead()) {
        if (this._canLose) {
            $gameParty.reviveBattleMembers();
            SceneManager.pop();
        } else {
            SceneManager.goto(Scene_Gameover);
        }
    } else {
        SceneManager.pop();
    }
    this._phase = "";
};

/**
 * 制作奖励
 */
BattleManager.makeRewards = function() {
    this._rewards = {
        gold: $gameTroop.goldTotal(),
        exp: $gameTroop.expTotal(),
        items: $gameTroop.makeDropItems()
    };
};

/**
 * 显示胜利消息
 */
BattleManager.displayVictoryMessage = function() {
    $gameMessage.add(TextManager.victory.format($gameParty.name()));
};

/**
 * 显示失败消息
 */
BattleManager.displayDefeatMessage = function() {
    $gameMessage.add(TextManager.defeat.format($gameParty.name()));
};

/**
 * 显示逃跑成功消息
 */
BattleManager.displayEscapeSuccessMessage = function() {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
};

/**
 * 显示逃跑失败消息
 */
BattleManager.displayEscapeFailureMessage = function() {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
    $gameMessage.add("\\." + TextManager.escapeFailure);
};

/**
 * 显示奖励
 */
BattleManager.displayRewards = function() {
    this.displayExp();
    this.displayGold();
    this.displayDropItems();
};

/**
 * 显示Exp经验值
 */
BattleManager.displayExp = function() {
    const exp = this._rewards.exp;
    if (exp > 0) {
        const text = TextManager.obtainExp.format(exp, TextManager.exp);
        $gameMessage.add("\\." + text);
    }
};

/**
 * 显示金钱
 */
BattleManager.displayGold = function() {
    const gold = this._rewards.gold;
    if (gold > 0) {
        $gameMessage.add("\\." + TextManager.obtainGold.format(gold));
    }
};

/**
 * 显示掉落物品
 */
BattleManager.displayDropItems = function() {
    const items = this._rewards.items;
    if (items.length > 0) {
        $gameMessage.newPage();
        for (const item of items) {
            $gameMessage.add(TextManager.obtainItem.format(item.name));
        }
    }
};

/**
 * 获取奖励
 */
BattleManager.gainRewards = function() {
    this.gainExp();
    this.gainGold();
    this.gainDropItems();
};

/**
 * 获取exp经验值
 */
BattleManager.gainExp = function() {
    const exp = this._rewards.exp;
    for (const actor of $gameParty.allMembers()) {
        actor.gainExp(exp);
    }
};

/**
 * 获取金钱
 */
BattleManager.gainGold = function() {
    $gameParty.gainGold(this._rewards.gold);
};

/**
 * 获取掉落物品
 */
BattleManager.gainDropItems = function() {
    const items = this._rewards.items;
    for (const item of items) {
        $gameParty.gainItem(item, 1);
    }
};

