//-----------------------------------------------------------------------------
// Scene_MenuBase
//
// The superclass of all the menu-type scenes.

/**
 * 场景菜单基础
 * 
 * 所有菜单类型场景的超类。
 */
function Scene_MenuBase() {
    this.initialize(...arguments);
}

Scene_MenuBase.prototype = Object.create(Scene_Base.prototype);
Scene_MenuBase.prototype.constructor = Scene_MenuBase;

/**
 * 初始化
 */
Scene_MenuBase.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

/**
 * 创建
 */
Scene_MenuBase.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.updateActor();
    this.createWindowLayer();
    this.createButtons();
};

/**
 * 更新 
 */
Scene_MenuBase.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    this.updatePageButtons();
};

/**
 * 帮助区顶部
 */
Scene_MenuBase.prototype.helpAreaTop = function() {
    if (this.isBottomHelpMode()) {
        return this.mainAreaBottom();
    } else if (this.isBottomButtonMode()) {
        return 0;
    } else {
        return this.buttonAreaBottom();
    }
};

/**
 * 帮助区域底部
 */
Scene_MenuBase.prototype.helpAreaBottom = function() {
    return this.helpAreaTop() + this.helpAreaHeight();
};

/**
 * 帮助区高度
 */
Scene_MenuBase.prototype.helpAreaHeight = function() {
    return this.calcWindowHeight(2, false);
};

/**
 * 主要区域顶部
 */
Scene_MenuBase.prototype.mainAreaTop = function() {
    if (!this.isBottomHelpMode()) {
        return this.helpAreaBottom();
    } else if (this.isBottomButtonMode()) {
        return 0;
    } else {
        return this.buttonAreaBottom();
    }
};

/**
 * 主要区域底部
 */
Scene_MenuBase.prototype.mainAreaBottom = function() {
    return this.mainAreaTop() + this.mainAreaHeight();
};

/**
 * 主要区域高度
 */
Scene_MenuBase.prototype.mainAreaHeight = function() {
    return Graphics.boxHeight - this.buttonAreaHeight() - this.helpAreaHeight();
};

/**
 * 角色
 */
Scene_MenuBase.prototype.actor = function() {
    return this._actor;
};

/**
 * 更新角色
 */
Scene_MenuBase.prototype.updateActor = function() {
    this._actor = $gameParty.menuActor();
};

/**
 * 创建背景
 */
Scene_MenuBase.prototype.createBackground = function() {
    /** 
     * 背景滤镜  
     * 模糊滤镜 new PIXI.filters.BlurFilter 
     */
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    /** 背景精灵 */
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    this.setBackgroundOpacity(192);
};

/**
 * 设置背景不透明度
 * @param {number} opacity 不透明度
 */
Scene_MenuBase.prototype.setBackgroundOpacity = function(opacity) {
    this._backgroundSprite.opacity = opacity;
};

/**
 * 创建帮助窗口
 */
Scene_MenuBase.prototype.createHelpWindow = function() {
    const rect = this.helpWindowRect();
    /** 帮助窗口 */
    this._helpWindow = new Window_Help(rect);
    this.addWindow(this._helpWindow);
};

/**
 * 帮助窗口矩形
 */
Scene_MenuBase.prototype.helpWindowRect = function() {
    const wx = 0;
    const wy = this.helpAreaTop();
    const ww = Graphics.boxWidth;
    const wh = this.helpAreaHeight();
    return new Rectangle(wx, wy, ww, wh);
};

/**
 * 创建按钮
 */
Scene_MenuBase.prototype.createButtons = function() {
    if (ConfigManager.touchUI) {
        if (this.needsCancelButton()) {
            this.createCancelButton();
        }
        if (this.needsPageButtons()) {
            this.createPageButtons();
        }
    }
};

/**
 * 需要取消按钮
 */
Scene_MenuBase.prototype.needsCancelButton = function() {
    return true;
};

/**
 * 创建取消按钮
 */
Scene_MenuBase.prototype.createCancelButton = function() {
    /** 取消按钮 */
    this._cancelButton = new Sprite_Button("cancel");
    this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
    this._cancelButton.y = this.buttonY();
    this.addWindow(this._cancelButton);
};

/**
 * 需要页面按钮
 */
Scene_MenuBase.prototype.needsPageButtons = function() {
    return false;
};

/**
 * 创建页面按钮
 */
Scene_MenuBase.prototype.createPageButtons = function() {
    /** 页面上按钮 */
    this._pageupButton = new Sprite_Button("pageup");
    this._pageupButton.x = 4;
    this._pageupButton.y = this.buttonY();
    const pageupRight = this._pageupButton.x + this._pageupButton.width;
    /** 页面下按钮 */
    this._pagedownButton = new Sprite_Button("pagedown");
    this._pagedownButton.x = pageupRight + 4;
    this._pagedownButton.y = this.buttonY();
    this.addWindow(this._pageupButton);
    this.addWindow(this._pagedownButton);
    this._pageupButton.setClickHandler(this.previousActor.bind(this));
    this._pagedownButton.setClickHandler(this.nextActor.bind(this));
};

/**
 * 更新页面按钮
 */
Scene_MenuBase.prototype.updatePageButtons = function() {
    if (this._pageupButton && this._pagedownButton) {
        const enabled = this.arePageButtonsEnabled();
        this._pageupButton.visible = enabled;
        this._pagedownButton.visible = enabled;
    }
};

/**
 * 是页面按钮启用
 */
Scene_MenuBase.prototype.arePageButtonsEnabled = function() {
    return true;
};

/**
 * 下一位角色
 */
Scene_MenuBase.prototype.nextActor = function() {
    $gameParty.makeMenuActorNext();
    this.updateActor();
    this.onActorChange();
};

/**
 * 上一位角色
 */
Scene_MenuBase.prototype.previousActor = function() {
    $gameParty.makeMenuActorPrevious();
    this.updateActor();
    this.onActorChange();
};

/**
 * 当角色改变
 */
Scene_MenuBase.prototype.onActorChange = function() {
    SoundManager.playCursor();
};

