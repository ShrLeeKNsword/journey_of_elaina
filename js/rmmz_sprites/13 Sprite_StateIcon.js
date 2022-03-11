//-----------------------------------------------------------------------------
// Sprite_StateIcon
//
// The sprite for displaying state icons.

/**
 * 精灵状态图标
 * 
 * 用于显示状态图标的精灵。
 * 
 * @mz 和mv区别较小
 */
function Sprite_StateIcon() {
    this.initialize(...arguments);
}

Sprite_StateIcon.prototype = Object.create(Sprite.prototype);
Sprite_StateIcon.prototype.constructor = Sprite_StateIcon;

/**初始化 */
Sprite_StateIcon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};

/**
 * 初始化成员
 */
Sprite_StateIcon.prototype.initMembers = function() {
    this._battler = null;
    this._iconIndex = 0;
    this._animationCount = 0;
    this._animationIndex = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};

/**
 * 加载位图
 */
Sprite_StateIcon.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem("IconSet");
    this.setFrame(0, 0, 0, 0);
};

/**
 * 安装
 * @param {*} battler 
 */
Sprite_StateIcon.prototype.setup = function(battler) {
    if (this._battler !== battler) {
        this._battler = battler;
        this._animationCount = this.animationWait();
    }
};

/**
 * 更新 
 */
Sprite_StateIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updateIcon();
        this.updateFrame();
        this._animationCount = 0;
    }
};

/**
 * 动画等待
 */
Sprite_StateIcon.prototype.animationWait = function() {
    return 40;
};

/**
 * 更新图标
 */
Sprite_StateIcon.prototype.updateIcon = function() {
    const icons = [];
    if (this.shouldDisplay()) {
        icons.push(...this._battler.allIcons());
    }
    if (icons.length > 0) {
        this._animationIndex++;
        if (this._animationIndex >= icons.length) {
            this._animationIndex = 0;
        }
        this._iconIndex = icons[this._animationIndex];
    } else {
        this._animationIndex = 0;
        this._iconIndex = 0;
    }
};

/**
 * 应该显示
 * @mz 新增(修改为角色的必然显示)
 */
Sprite_StateIcon.prototype.shouldDisplay = function() {
    const battler = this._battler;
    return battler && (battler.isActor() || battler.isAlive());
};

/**
 * 更新帧
 */
Sprite_StateIcon.prototype.updateFrame = function() {
    /**
     * @mz mv中为Sprite_StateIcon._iconWidth 和 Sprite_StateIcon._iconHeight 
     */
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (this._iconIndex % 16) * pw;
    const sy = Math.floor(this._iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};

