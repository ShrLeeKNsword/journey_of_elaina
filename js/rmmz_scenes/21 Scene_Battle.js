//-----------------------------------------------------------------------------
// Scene_Battle
//
// The scene class of the battle screen.

/**
 * 场景战斗
 * 
 * 战斗画面的场景类别。
 */
function Scene_Battle() {
    this.initialize(...arguments);
}

Scene_Battle.prototype = Object.create(Scene_Message.prototype);
Scene_Battle.prototype.constructor = Scene_Battle;

/**
 * 初始化
 */
Scene_Battle.prototype.initialize = function() {
    Scene_Message.prototype.initialize.call(this);
};

/**
 * 创建
 */
Scene_Battle.prototype.create = function() {
    Scene_Message.prototype.create.call(this);
    this.createDisplayObjects();
};

/**
 * 开始
 */
Scene_Battle.prototype.start = function() {
    Scene_Message.prototype.start.call(this);
    BattleManager.playBattleBgm();
    BattleManager.startBattle();
    this._statusWindow.refresh();
    this.startFadeIn(this.fadeSpeed(), false);
};

/**
 * 更新 
 */
Scene_Battle.prototype.update = function() {
    const active = this.isActive();
    $gameTimer.update(active);
    $gameScreen.update();
    this.updateVisibility();
    if (active && !this.isBusy()) {
        this.updateBattleProcess();
    }
    Scene_Message.prototype.update.call(this);
};

/**
 * 更新可见性
 */
Scene_Battle.prototype.updateVisibility = function() {
    this.updateLogWindowVisibility();
    this.updateStatusWindowVisibility();
    this.updateInputWindowVisibility();
    this.updateCancelButton();
};

/**
 * 更新战斗流程
 */
Scene_Battle.prototype.updateBattleProcess = function() {
    BattleManager.update(this.isTimeActive());
};

/**
 * 是时间活跃
 */
Scene_Battle.prototype.isTimeActive = function() {
    if (BattleManager.isActiveTpb()) {
        return !this._skillWindow.active && !this._itemWindow.active;
    } else {
        return !this.isAnyInputWindowActive();
    }
};

/**
 * 是任何输入窗口处于活动状态
 */
Scene_Battle.prototype.isAnyInputWindowActive = function() {
    return (
        this._partyCommandWindow.active ||
        this._actorCommandWindow.active ||
        this._skillWindow.active ||
        this._itemWindow.active ||
        this._actorWindow.active ||
        this._enemyWindow.active
    );
};

/**
 * 更改输入窗口
 */
Scene_Battle.prototype.changeInputWindow = function() {
    this.hideSubInputWindows();
    if (BattleManager.isInputting()) {
        if (BattleManager.actor()) {
            this.startActorCommandSelection();
        } else {
            this.startPartyCommandSelection();
        }
    } else {
        this.endCommandSelection();
    }
};

/**
 * 停止
 */
Scene_Battle.prototype.stop = function() {
    Scene_Message.prototype.stop.call(this);
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else {
        this.startFadeOut(this.fadeSpeed(), false);
    }
    this._statusWindow.close();
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
};

/**
 * 终止
 */
Scene_Battle.prototype.terminate = function() {
    Scene_Message.prototype.terminate.call(this);
    $gameParty.onBattleEnd();
    $gameTroop.onBattleEnd();
    AudioManager.stopMe();
    if (this.shouldAutosave()) {
        this.requestAutosave();
    }
};

/**
 * 需要自动保存
 */
Scene_Battle.prototype.shouldAutosave = function() {
    return SceneManager.isNextScene(Scene_Map);
};

/**
 * 需要缓慢淡出
 */
Scene_Battle.prototype.needsSlowFadeOut = function() {
    return (
        SceneManager.isNextScene(Scene_Title) ||
        SceneManager.isNextScene(Scene_Gameover)
    );
};

/**
 * 更新日志窗口可见性
 */
Scene_Battle.prototype.updateLogWindowVisibility = function() {
    this._logWindow.visible = !this._helpWindow.visible;
};

/**
 * 更新状态窗口可见性
 */
Scene_Battle.prototype.updateStatusWindowVisibility = function() {
    if ($gameMessage.isBusy()) {
        this._statusWindow.close();
    } else if (this.shouldOpenStatusWindow()) {
        this._statusWindow.open();
    }
    this.updateStatusWindowPosition();
};

/**
 * 需要打开状态窗口
 */
Scene_Battle.prototype.shouldOpenStatusWindow = function() {
    return (
        this.isActive() &&
        !this.isMessageWindowClosing() &&
        !BattleManager.isBattleEnd()
    );
};

/**
 * 更新状态窗口位置
 */
Scene_Battle.prototype.updateStatusWindowPosition = function() {
    const statusWindow = this._statusWindow;
    const targetX = this.statusWindowX();
    if (statusWindow.x < targetX) {
        statusWindow.x = Math.min(statusWindow.x + 16, targetX);
    }
    if (statusWindow.x > targetX) {
        statusWindow.x = Math.max(statusWindow.x - 16, targetX);
    }
};

/**
 * 状态窗口X
 */
Scene_Battle.prototype.statusWindowX = function() {
    if (this.isAnyInputWindowActive()) {
        return this.statusWindowRect().x;
    } else {
        return this._partyCommandWindow.width / 2;
    }
};

/**
 * 更新输入窗口可见性
 */
Scene_Battle.prototype.updateInputWindowVisibility = function() {
    if ($gameMessage.isBusy()) {
        this.closeCommandWindows();
        this.hideSubInputWindows();
    } else if (this.needsInputWindowChange()) {
        this.changeInputWindow();
    }
};

/**
 * 需要输入窗口更改
 */
Scene_Battle.prototype.needsInputWindowChange = function() {
    const windowActive = this.isAnyInputWindowActive();
    const inputting = BattleManager.isInputting();
    if (windowActive && inputting) {
        return this._actorCommandWindow.actor() !== BattleManager.actor();
    }
    return windowActive !== inputting;
};

/**
 * 更新取消按钮
 */
Scene_Battle.prototype.updateCancelButton = function() {
    if (this._cancelButton) {
        this._cancelButton.visible =
            this.isAnyInputWindowActive() && !this._partyCommandWindow.active;
    }
};

/**
 * 创建显示对象
 */
Scene_Battle.prototype.createDisplayObjects = function() {
    this.createSpriteset();
    this.createWindowLayer();
    this.createAllWindows();
    this.createButtons();
    BattleManager.setLogWindow(this._logWindow);
    BattleManager.setSpriteset(this._spriteset);
    this._logWindow.setSpriteset(this._spriteset);
};

/**
 * 创建精灵组
 */
Scene_Battle.prototype.createSpriteset = function() {
    this._spriteset = new Spriteset_Battle();
    this.addChild(this._spriteset);
};

/**
 * 创建所有窗口
 */
Scene_Battle.prototype.createAllWindows = function() {
    this.createLogWindow();
    this.createStatusWindow();
    this.createPartyCommandWindow();
    this.createActorCommandWindow();
    this.createHelpWindow();
    this.createSkillWindow();
    this.createItemWindow();
    this.createActorWindow();
    this.createEnemyWindow();
    Scene_Message.prototype.createAllWindows.call(this);
};

/**
 * 创建日志窗口
 */
Scene_Battle.prototype.createLogWindow = function() {
    const rect = this.logWindowRect();
    this._logWindow = new Window_BattleLog(rect);
    this.addWindow(this._logWindow);
};

/**
 * 日志窗口矩形
 */
Scene_Battle.prototype.logWindowRect = function() {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(10, false);
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建状态窗口
 */
Scene_Battle.prototype.createStatusWindow = function() {
    const rect = this.statusWindowRect();
    const statusWindow = new Window_BattleStatus(rect);
    this.addWindow(statusWindow);
    this._statusWindow = statusWindow;
};

/**
 * 状态窗口矩形
 */
Scene_Battle.prototype.statusWindowRect = function() {
    const extra = 10;
    const ww = Graphics.boxWidth - 192;
    const wh = this.windowAreaHeight() + extra;
    const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
    const wy = Graphics.boxHeight - wh + extra - 4;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建队伍命令窗口
 */
Scene_Battle.prototype.createPartyCommandWindow = function() {
    const rect = this.partyCommandWindowRect();
    const commandWindow = new Window_PartyCommand(rect);
    commandWindow.setHandler("fight", this.commandFight.bind(this));
    commandWindow.setHandler("escape", this.commandEscape.bind(this));
    commandWindow.deselect();
    this.addWindow(commandWindow);
    this._partyCommandWindow = commandWindow;
};

/**
 * 队伍命令窗口矩形
 */
Scene_Battle.prototype.partyCommandWindowRect = function() {
    const ww = 192;
    const wh = this.windowAreaHeight();
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建角色命令窗口
 */
Scene_Battle.prototype.createActorCommandWindow = function() {
    const rect = this.actorCommandWindowRect();
    const commandWindow = new Window_ActorCommand(rect);
    commandWindow.y = Graphics.boxHeight - commandWindow.height;
    commandWindow.setHandler("attack", this.commandAttack.bind(this));
    commandWindow.setHandler("skill", this.commandSkill.bind(this));
    commandWindow.setHandler("guard", this.commandGuard.bind(this));
    commandWindow.setHandler("item", this.commandItem.bind(this));
    commandWindow.setHandler("cancel", this.commandCancel.bind(this));
    this.addWindow(commandWindow);
    this._actorCommandWindow = commandWindow;
};

/**
 * 角色命令窗口矩形
 */
Scene_Battle.prototype.actorCommandWindowRect = function() {
    const ww = 192;
    const wh = this.windowAreaHeight();
    const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建帮助窗口
 */
Scene_Battle.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    this._helpWindow = new Window_Help(rect);
    this._helpWindow.hide();
    this.addWindow(this._helpWindow);
};

/**
 * 帮助窗口矩形
 */
Scene_Battle.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = this.helpAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建技能窗口
 */
Scene_Battle.prototype.createSkillWindow = function() {
    const rect = this.skillWindowRect();
    this._skillWindow = new Window_BattleSkill(rect);
    this._skillWindow.setHelpWindow(this._helpWindow);
    this._skillWindow.setHandler("ok", this.onSkillOk.bind(this));
    this._skillWindow.setHandler("cancel", this.onSkillCancel.bind(this));
    this.addWindow(this._skillWindow);
};

/**
 * 技能窗口矩形
 */
Scene_Battle.prototype.skillWindowRect = function() {
    const ww = Graphics.boxWidth;
    const wh = this.windowAreaHeight();
    const wx = 0;
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建项目窗口
 */
Scene_Battle.prototype.createItemWindow = function() {
    const rect = this.itemWindowRect();
    this._itemWindow = new Window_BattleItem(rect);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
    this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
};

/**
 * 项目窗口矩形
 */
Scene_Battle.prototype.itemWindowRect = function() {
    return this.skillWindowRect();
};

/**
 * 创建角色窗口
 */
Scene_Battle.prototype.createActorWindow = function() {
    const rect = this.actorWindowRect();
    this._actorWindow = new Window_BattleActor(rect);
    this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
    this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
    this.addWindow(this._actorWindow);
};

/**
 * 角色窗口矩形
 */
Scene_Battle.prototype.actorWindowRect = function() {
    return this.statusWindowRect();
};

/**
 * 创建敌人窗口
 */
Scene_Battle.prototype.createEnemyWindow = function() {
    const rect = this.enemyWindowRect();
    this._enemyWindow = new Window_BattleEnemy(rect);
    this._enemyWindow.setHandler("ok", this.onEnemyOk.bind(this));
    this._enemyWindow.setHandler("cancel", this.onEnemyCancel.bind(this));
    this.addWindow(this._enemyWindow);
};

/**
 * 敌人窗口矩形
 */
Scene_Battle.prototype.enemyWindowRect = function() {
    const wx = this._statusWindow.x;
    const ww = this._statusWindow.width;
    const wh = this.windowAreaHeight();
    const wy = Graphics.boxHeight - wh;
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 帮助区域顶部
 */
Scene_Battle.prototype.helpAreaTop = function() {
    return 0;
};

/**
 * 帮助区域底部
 */
Scene_Battle.prototype.helpAreaBottom = function() {
    return this.helpAreaTop() + this.helpAreaHeight();
};

/**
 * 帮助区域高度
 */
Scene_Battle.prototype.helpAreaHeight = function() {
    return this.calcWindowHeight(2, false);
};

/**
 * 按钮区域顶部
 */
Scene_Battle.prototype.buttonAreaTop = function() {
    return this.helpAreaBottom();
};

/**
 * 窗口区域高度
 */
Scene_Battle.prototype.windowAreaHeight = function() {
    return this.calcWindowHeight(4, true);
};

/**
 * 创建按钮
 */
Scene_Battle.prototype.createButtons = function() {
    if (ConfigManager.touchUI) {
        this.createCancelButton();
    }
};

/**
 * 创建取消按钮
 */
Scene_Battle.prototype.createCancelButton = function() {
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
    this._cancelButton.y = this.buttonY();
    this.addWindow(this._cancelButton);
};

/**
 * 关闭命令窗口
 */
Scene_Battle.prototype.closeCommandWindows = function() {
    this._partyCommandWindow.deactivate();
    this._actorCommandWindow.deactivate();
    this._partyCommandWindow.close();
    this._actorCommandWindow.close();
};

/**
 * 隐藏子输入窗口
 */
Scene_Battle.prototype.hideSubInputWindows = function() {
    this._actorWindow.deactivate();
    this._enemyWindow.deactivate();
    this._skillWindow.deactivate();
    this._itemWindow.deactivate();
    this._actorWindow.hide();
    this._enemyWindow.hide();
    this._skillWindow.hide();
    this._itemWindow.hide();
};

/**
 * 开始队伍命令选择
 */
Scene_Battle.prototype.startPartyCommandSelection = function() {
    this._statusWindow.deselect();
    this._statusWindow.show();
    this._statusWindow.open();
    this._actorCommandWindow.setup(null);
    this._actorCommandWindow.close();
    this._partyCommandWindow.setup();
};

/**
 * 命令战斗
 */
Scene_Battle.prototype.commandFight = function() {
    this.selectNextCommand();
};

/**
 * 命令逃跑
 */
Scene_Battle.prototype.commandEscape = function() {
    BattleManager.processEscape();
    this.changeInputWindow();
};

/**
 * 开始角色命令选择
 */
Scene_Battle.prototype.startActorCommandSelection = function() {
    this._statusWindow.show();
    this._statusWindow.selectActor(BattleManager.actor());
    this._partyCommandWindow.close();
    this._actorCommandWindow.show();
    this._actorCommandWindow.setup(BattleManager.actor());
};

/**
 * 命令攻击
 */
Scene_Battle.prototype.commandAttack = function() {
    const action = BattleManager.inputtingAction();
    action.setAttack();
    this.onSelectAction();
};

/**
 * 命令技能
 */
Scene_Battle.prototype.commandSkill = function() {
    this._skillWindow.setActor(BattleManager.actor());
    this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
    this._skillWindow.refresh();
    this._skillWindow.show();
    this._skillWindow.activate();
    this._statusWindow.hide();
    this._actorCommandWindow.hide();
};

/**
 * 命令防御
 */
Scene_Battle.prototype.commandGuard = function() {
    const action = BattleManager.inputtingAction();
    action.setGuard();
    this.onSelectAction();
};

/**
 * 命令物品
 */
Scene_Battle.prototype.commandItem = function() {
    this._itemWindow.refresh();
    this._itemWindow.show();
    this._itemWindow.activate();
    this._statusWindow.hide();
    this._actorCommandWindow.hide();
};

/**
 * 命令取消
 */
Scene_Battle.prototype.commandCancel = function() {
    this.selectPreviousCommand();
};

/**
 * 选择下一个命令
 */
Scene_Battle.prototype.selectNextCommand = function() {
    BattleManager.selectNextCommand();
    this.changeInputWindow();
};

/**
 * 选择上一个命令
 */
Scene_Battle.prototype.selectPreviousCommand = function() {
    BattleManager.selectPreviousCommand();
    this.changeInputWindow();
};

/**
 * 开始角色选择
 */
Scene_Battle.prototype.startActorSelection = function() {
    this._actorWindow.refresh();
    this._actorWindow.show();
    this._actorWindow.activate();
};

/**
 * 当角色确定
 */
Scene_Battle.prototype.onActorOk = function() {
    const action = BattleManager.inputtingAction();
    action.setTarget(this._actorWindow.index());
    this.hideSubInputWindows();
    this.selectNextCommand();
};

/**
 * 当角色取消
 */
Scene_Battle.prototype.onActorCancel = function() {
    this._actorWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
        case "skill":
            this._skillWindow.show();
            this._skillWindow.activate();
            break;
        case "item":
            this._itemWindow.show();
            this._itemWindow.activate();
            break;
    }
};

/**
 * 开始敌人选择
 */
Scene_Battle.prototype.startEnemySelection = function() {
    this._enemyWindow.refresh();
    this._enemyWindow.show();
    this._enemyWindow.select(0);
    this._enemyWindow.activate();
    this._statusWindow.hide();
};

/**
 * 当敌人确定
 */
Scene_Battle.prototype.onEnemyOk = function() {
    const action = BattleManager.inputtingAction();
    action.setTarget(this._enemyWindow.enemyIndex());
    this.hideSubInputWindows();
    this.selectNextCommand();
};

/**
 * 当敌人取消
 */
Scene_Battle.prototype.onEnemyCancel = function() {
    this._enemyWindow.hide();
    switch (this._actorCommandWindow.currentSymbol()) {
        case "attack":
            this._statusWindow.show();
            this._actorCommandWindow.activate();
            break;
        case "skill":
            this._skillWindow.show();
            this._skillWindow.activate();
            break;
        case "item":
            this._itemWindow.show();
            this._itemWindow.activate();
            break;
    }
};

/**
 * 当技能确定
 */
Scene_Battle.prototype.onSkillOk = function() {
    const skill = this._skillWindow.item();
    const action = BattleManager.inputtingAction();
    action.setSkill(skill.id);
    BattleManager.actor().setLastBattleSkill(skill);
    this.onSelectAction();
};

/**
 * 当技能取消
 */
Scene_Battle.prototype.onSkillCancel = function() {
    this._skillWindow.hide();
    this._statusWindow.show();
    this._actorCommandWindow.show();
    this._actorCommandWindow.activate();
};

/**
 * 当项目确定
 */
Scene_Battle.prototype.onItemOk = function() {
    const item = this._itemWindow.item();
    const action = BattleManager.inputtingAction();
    action.setItem(item.id);
    $gameParty.setLastItem(item);
    this.onSelectAction();
};

/**
 * 当项目取消
 */
Scene_Battle.prototype.onItemCancel = function() {
    this._itemWindow.hide();
    this._statusWindow.show();
    this._actorCommandWindow.show();
    this._actorCommandWindow.activate();
};

/**
 * 当选择动作
 */
Scene_Battle.prototype.onSelectAction = function() {
    const action = BattleManager.inputtingAction();
    if (!action.needsSelection()) {
        this.selectNextCommand();
    } else if (action.isForOpponent()) {
        this.startEnemySelection();
    } else {
        this.startActorSelection();
    }
};

/**
 * 结束命令选择
 */
Scene_Battle.prototype.endCommandSelection = function() {
    this.closeCommandWindows();
    this.hideSubInputWindows();
    this._statusWindow.deselect();
    this._statusWindow.show();
};

