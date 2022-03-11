//-----------------------------------------------------------------------------
// Sprite_Battler
//
// The superclass of Sprite_Actor and Sprite_Enemy.

/**
 * 
 * 精灵战斗者
 */
function Sprite_Battler() {
    this.initialize(...arguments);
}

Sprite_Battler.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_Battler.prototype.constructor = Sprite_Battler;

/**
 * 初始化
 * @param {*} battler 
 */
Sprite_Battler.prototype.initialize = function(battler) {
    Sprite_Clickable.prototype.initialize.call(this);
    this.initMembers();
    this.setBattler(battler);
};

/**
 * 初始化成员
 */
Sprite_Battler.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._battler = null;
    this._damages = [];
    this._homeX = 0;
    this._homeY = 0;
    this._offsetX = 0;
    this._offsetY = 0;
    this._targetOffsetX = NaN;
    this._targetOffsetY = NaN;
    this._movementDuration = 0;
    this._selectionEffectCount = 0;
};

/**
 * 设置战斗者
 * @param {*} battler 
 */
Sprite_Battler.prototype.setBattler = function(battler) {
    this._battler = battler;
};

/**
 * 检查战斗者
 * @param {*} battler 
 */
Sprite_Battler.prototype.checkBattler = function(battler) {
    return this._battler === battler;
};

/**
 * 主要精灵
 */
Sprite_Battler.prototype.mainSprite = function() {
    return this;
};

/**
 * 设置本位
 * @param {*} x 
 * @param {*} y 
 */
Sprite_Battler.prototype.setHome = function(x, y) {
    this._homeX = x;
    this._homeY = y;
    this.updatePosition();
};

/**
 * 更新 
 */
Sprite_Battler.prototype.update = function() {
    Sprite_Clickable.prototype.update.call(this);
    if (this._battler) {
        this.updateMain();
        this.updateDamagePopup();
        this.updateSelectionEffect();
        this.updateVisibility();
    } else {
        this.bitmap = null;
    }
};

/**
 * 更新可见性
 */
Sprite_Battler.prototype.updateVisibility = function() {
    Sprite_Clickable.prototype.updateVisibility.call(this);
    if (!this._battler || !this._battler.isSpriteVisible()) {
        this.visible = false;
    }
};

/**
 * 更新主要
 */
Sprite_Battler.prototype.updateMain = function() {
    if (this._battler.isSpriteVisible()) {
        this.updateBitmap();
        this.updateFrame();
    }
    this.updateMove();
    this.updatePosition();
};

/**
 * 更新位图
 */
Sprite_Battler.prototype.updateBitmap = function() {
    //
};

/**
 * 更新帧
 */
Sprite_Battler.prototype.updateFrame = function() {
    //
};

/**
 * 更新移动
 */
Sprite_Battler.prototype.updateMove = function() {
    if (this._movementDuration > 0) {
        const d = this._movementDuration;
        this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
        this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
        this._movementDuration--;
        if (this._movementDuration === 0) {
            this.onMoveEnd();
        }
    }
};

/**
 * 更新位置
 */
Sprite_Battler.prototype.updatePosition = function() {
    this.x = this._homeX + this._offsetX;
    this.y = this._homeY + this._offsetY;
};

/**
 * 更新伤害弹出窗口
 */
Sprite_Battler.prototype.updateDamagePopup = function() {
    this.setupDamagePopup();
    if (this._damages.length > 0) {
        for (const damage of this._damages) {
            damage.update();
        }
        if (!this._damages[0].isPlaying()) {
            this.destroyDamageSprite(this._damages[0]);
        }
    }
};

/**
 * 更新选择效果
 */
Sprite_Battler.prototype.updateSelectionEffect = function() {
    const target = this.mainSprite();
    if (this._battler.isSelected()) {
        this._selectionEffectCount++;
        if (this._selectionEffectCount % 30 < 15) {
            target.setBlendColor([255, 255, 255, 64]);
        } else {
            target.setBlendColor([0, 0, 0, 0]);
        }
    } else if (this._selectionEffectCount > 0) {
        this._selectionEffectCount = 0;
        target.setBlendColor([0, 0, 0, 0]);
    }
};

/**
 * 安装伤害弹出窗口
 */
Sprite_Battler.prototype.setupDamagePopup = function() {
    if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            this.createDamageSprite();
        }
        this._battler.clearDamagePopup();
        this._battler.clearResult();
    }
};

/**
 * 创建伤害精灵
 */
Sprite_Battler.prototype.createDamageSprite = function() {
    const last = this._damages[this._damages.length - 1];
    const sprite = new Sprite_Damage();
    if (last) {
        sprite.x = last.x + 8;
        sprite.y = last.y - 16;
    } else {
        sprite.x = this.x + this.damageOffsetX();
        sprite.y = this.y + this.damageOffsetY();
    }
    sprite.setup(this._battler);
    this._damages.push(sprite);
    this.parent.addChild(sprite);
};

/**
 * 消灭伤害精灵
 * @param {*} sprite 
 */
Sprite_Battler.prototype.destroyDamageSprite = function(sprite) {
    this.parent.removeChild(sprite);
    this._damages.remove(sprite);
    sprite.destroy();
};

/**
 * 伤害补偿X
 */
Sprite_Battler.prototype.damageOffsetX = function() {
    return 0;
};

/**
 * 伤害补偿Y
 */
Sprite_Battler.prototype.damageOffsetY = function() {
    return 0;
};

/**
 * 开始移动
 * @param {*} x x坐标
 * @param {*} y y坐标
 * @param {*} duration 持续时间
 */
Sprite_Battler.prototype.startMove = function(x, y, duration) {
    if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
        this._targetOffsetX = x;
        this._targetOffsetY = y;
        this._movementDuration = duration;
        if (duration === 0) {
            this._offsetX = x;
            this._offsetY = y;
        }
    }
};

/**
 * 当移动结束
 */
Sprite_Battler.prototype.onMoveEnd = function() {
    //
};

/**
 * 正在影响
 */
Sprite_Battler.prototype.isEffecting = function() {
    return false;
};

/**
 * 是正在移动
 */
Sprite_Battler.prototype.isMoving = function() {
    return this._movementDuration > 0;
};

/**
 * 是处于本位
 */
Sprite_Battler.prototype.inHomePosition = function() {
    return this._offsetX === 0 && this._offsetY === 0;
};

/**
 * 当鼠标进入
 */
Sprite_Battler.prototype.onMouseEnter = function() {
    $gameTemp.setTouchState(this._battler, "select");
};

/**
 * 当按时
 */
Sprite_Battler.prototype.onPress = function() {
    $gameTemp.setTouchState(this._battler, "select");
};

/**
 * 当点击
 */
Sprite_Battler.prototype.onClick = function() {
    $gameTemp.setTouchState(this._battler, "click");
};

