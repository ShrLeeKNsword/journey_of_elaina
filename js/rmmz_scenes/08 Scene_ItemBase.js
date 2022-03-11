//-----------------------------------------------------------------------------
// Scene_ItemBase
//
// The superclass of Scene_Item and Scene_Skill.

/**
 * 场景项目基础
 * 
 * 场景物品和场景技能的超类。
 */
function Scene_ItemBase() {
    this.initialize(...arguments);
}

Scene_ItemBase.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ItemBase.prototype.constructor = Scene_ItemBase;

/**
 * 初始化
 */
Scene_ItemBase.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

/**
 * 创建
 */
Scene_ItemBase.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
};

/**
 * 创建角色窗口
 */
Scene_ItemBase.prototype.createActorWindow = function() {
    const rect = this.actorWindowRect();
    this._actorWindow = new Window_MenuActor(rect);
    this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
    this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
    this.addWindow(this._actorWindow);
};

/**
 * 角色窗口矩形
 */
Scene_ItemBase.prototype.actorWindowRect = function() {
    const wx = 0;
    const wy = Math.min(this.mainAreaTop(), this.helpAreaTop());
    const ww = Graphics.boxWidth - this.mainCommandWidth();
    const wh = this.mainAreaHeight() + this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 项目
 */
Scene_ItemBase.prototype.item = function() {
    return this._itemWindow.item();
};

/**
 * 使用者
 */
Scene_ItemBase.prototype.user = function() {
    return null;
};

/**
 * 是向左光标
 */
Scene_ItemBase.prototype.isCursorLeft = function() {
    return this._itemWindow.index() % 2 === 0;
};

/**
 * 显示角色窗口
 */
Scene_ItemBase.prototype.showActorWindow = function() {
    if (this.isCursorLeft()) {
        this._actorWindow.x = Graphics.boxWidth - this._actorWindow.width;
    } else {
        this._actorWindow.x = 0;
    }
    this._actorWindow.show();
    this._actorWindow.activate();
};

/**
 * 隐藏角色窗口
 */
Scene_ItemBase.prototype.hideActorWindow = function() {
    this._actorWindow.hide();
    this._actorWindow.deactivate();
};

/**
 * 是角色窗口处于活动状态
 */
Scene_ItemBase.prototype.isActorWindowActive = function() {
    return this._actorWindow && this._actorWindow.active;
};

/**
 * 是角色确定
 */
Scene_ItemBase.prototype.onActorOk = function() {
    if (this.canUse()) {
        this.useItem();
    } else {
        SoundManager.playBuzzer();
    }
};

/**
 * 是角色取消
 */
Scene_ItemBase.prototype.onActorCancel = function() {
    this.hideActorWindow();
    this.activateItemWindow();
};

/**
 * 决定项目
 */
Scene_ItemBase.prototype.determineItem = function() {
    const action = new Game_Action(this.user());
    const item = this.item();
    action.setItemObject(item);
    if (action.isForFriend()) {
        this.showActorWindow();
        this._actorWindow.selectForItem(this.item());
    } else {
        this.useItem();
        this.activateItemWindow();
    }
};

/**
 * 使用项目
 */
Scene_ItemBase.prototype.useItem = function() {
    this.playSeForItem();
    this.user().useItem(this.item());
    this.applyItem();
    this.checkCommonEvent();
    this.checkGameover();
    this._actorWindow.refresh();
};

/**
 * 激活项目窗口
 */
Scene_ItemBase.prototype.activateItemWindow = function() {
    this._itemWindow.refresh();
    this._itemWindow.activate();
};

/**
 * 项目目标角色
 */
Scene_ItemBase.prototype.itemTargetActors = function() {
    const action = new Game_Action(this.user());
    action.setItemObject(this.item());
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return $gameParty.members();
    } else {
        return [$gameParty.members()[this._actorWindow.index()]];
    }
};

/**
 * 能使用
 */
Scene_ItemBase.prototype.canUse = function() {
    return this.user().canUse(this.item()) && this.isItemEffectsValid();
};

/**
 * 是项目效果有效
 */
Scene_ItemBase.prototype.isItemEffectsValid = function() {
    const action = new Game_Action(this.user());
    action.setItemObject(this.item());
    return this.itemTargetActors().some(target => action.testApply(target));
};

/**
 * 应用项目
 */
Scene_ItemBase.prototype.applyItem = function() {
    const action = new Game_Action(this.user());
    action.setItemObject(this.item());
    for (const target of this.itemTargetActors()) {
        for (let i = 0; i < action.numRepeats(); i++) {
            action.apply(target);
        }
    }
    action.applyGlobal();
};

/**
 * 检查公共事件
 */
Scene_ItemBase.prototype.checkCommonEvent = function() {
    if ($gameTemp.isCommonEventReserved()) {
        SceneManager.goto(Scene_Map);
    }
};

