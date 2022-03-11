//-----------------------------------------------------------------------------
// Sprite_Enemy
//
// The sprite for displaying an enemy.

/**
 * 精灵敌人
 * 
 * 用于显示敌人的精灵。
 */
function Sprite_Enemy() {
    this.initialize(...arguments);
}

Sprite_Enemy.prototype = Object.create(Sprite_Battler.prototype);
Sprite_Enemy.prototype.constructor = Sprite_Enemy;

/**初始化 
 * @param {*} battler 
 */
Sprite_Enemy.prototype.initialize = function(battler) {
    Sprite_Battler.prototype.initialize.call(this, battler);
};

Sprite_Enemy.prototype.initMembers = function() {
    Sprite_Battler.prototype.initMembers.call(this);
    this._enemy = null;
    this._appeared = false;
    this._battlerName = "";
    this._battlerHue = 0;
    this._effectType = null;
    this._effectDuration = 0;
    this._shake = 0;
    this.createStateIconSprite();
};

Sprite_Enemy.prototype.createStateIconSprite = function() {
    this._stateIconSprite = new Sprite_StateIcon();
    this.addChild(this._stateIconSprite);
};

Sprite_Enemy.prototype.setBattler = function(battler) {
    Sprite_Battler.prototype.setBattler.call(this, battler);
    this._enemy = battler;
    this.setHome(battler.screenX(), battler.screenY());
    this._stateIconSprite.setup(battler);
};

/**
 * 更新 
 */
Sprite_Enemy.prototype.update = function() {
    Sprite_Battler.prototype.update.call(this);
    if (this._enemy) {
        this.updateEffect();
        this.updateStateSprite();
    }
};

Sprite_Enemy.prototype.updateBitmap = function() {
    Sprite_Battler.prototype.updateBitmap.call(this);
    const name = this._enemy.battlerName();
    const hue = this._enemy.battlerHue();
    if (this._battlerName !== name || this._battlerHue !== hue) {
        this._battlerName = name;
        this._battlerHue = hue;
        this.loadBitmap(name);
        this.setHue(hue);
        this.initVisibility();
    }
};

Sprite_Enemy.prototype.loadBitmap = function(name) {
    if ($gameSystem.isSideView()) {
        this.bitmap = ImageManager.loadSvEnemy(name);
    } else {
        this.bitmap = ImageManager.loadEnemy(name);
    }
};

Sprite_Enemy.prototype.setHue = function(hue) {
    Sprite_Battler.prototype.setHue.call(this, hue);
    for (const child of this.children) {
        if (child.setHue) {
            child.setHue(-hue);
        }
    }
};

Sprite_Enemy.prototype.updateFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
    if (this._effectType === "bossCollapse") {
        this.setFrame(0, 0, this.bitmap.width, this._effectDuration);
    } else {
        this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
    }
};

Sprite_Enemy.prototype.updatePosition = function() {
    Sprite_Battler.prototype.updatePosition.call(this);
    this.x += this._shake;
};

Sprite_Enemy.prototype.updateStateSprite = function() {
    this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
    if (this._stateIconSprite.y < 20 - this.y) {
        this._stateIconSprite.y = 20 - this.y;
    }
};

Sprite_Enemy.prototype.initVisibility = function() {
    this._appeared = this._enemy.isAlive();
    if (!this._appeared) {
        this.opacity = 0;
    }
};

Sprite_Enemy.prototype.setupEffect = function() {
    if (this._appeared && this._enemy.isEffectRequested()) {
        this.startEffect(this._enemy.effectType());
        this._enemy.clearEffect();
    }
    if (!this._appeared && this._enemy.isAlive()) {
        this.startEffect("appear");
    } else if (this._appeared && this._enemy.isHidden()) {
        this.startEffect("disappear");
    }
};

Sprite_Enemy.prototype.startEffect = function(effectType) {
    this._effectType = effectType;
    switch (this._effectType) {
        case "appear":
            this.startAppear();
            break;
        case "disappear":
            this.startDisappear();
            break;
        case "whiten":
            this.startWhiten();
            break;
        case "blink":
            this.startBlink();
            break;
        case "collapse":
            this.startCollapse();
            break;
        case "bossCollapse":
            this.startBossCollapse();
            break;
        case "instantCollapse":
            this.startInstantCollapse();
            break;
    }
    this.revertToNormal();
};

Sprite_Enemy.prototype.startAppear = function() {
    this._effectDuration = 16;
    this._appeared = true;
};

Sprite_Enemy.prototype.startDisappear = function() {
    this._effectDuration = 32;
    this._appeared = false;
};

Sprite_Enemy.prototype.startWhiten = function() {
    this._effectDuration = 16;
};

Sprite_Enemy.prototype.startBlink = function() {
    this._effectDuration = 20;
};

Sprite_Enemy.prototype.startCollapse = function() {
    this._effectDuration = 32;
    this._appeared = false;
};

Sprite_Enemy.prototype.startBossCollapse = function() {
    this._effectDuration = this.bitmap.height;
    this._appeared = false;
};

Sprite_Enemy.prototype.startInstantCollapse = function() {
    this._effectDuration = 16;
    this._appeared = false;
};

Sprite_Enemy.prototype.updateEffect = function() {
    this.setupEffect();
    if (this._effectDuration > 0) {
        this._effectDuration--;
        switch (this._effectType) {
            case "whiten":
                this.updateWhiten();
                break;
            case "blink":
                this.updateBlink();
                break;
            case "appear":
                this.updateAppear();
                break;
            case "disappear":
                this.updateDisappear();
                break;
            case "collapse":
                this.updateCollapse();
                break;
            case "bossCollapse":
                this.updateBossCollapse();
                break;
            case "instantCollapse":
                this.updateInstantCollapse();
                break;
        }
        if (this._effectDuration === 0) {
            this._effectType = null;
        }
    }
};

Sprite_Enemy.prototype.isEffecting = function() {
    return this._effectType !== null;
};

Sprite_Enemy.prototype.revertToNormal = function() {
    this._shake = 0;
    this.blendMode = 0;
    this.opacity = 255;
    this.setBlendColor([0, 0, 0, 0]);
};

Sprite_Enemy.prototype.updateWhiten = function() {
    const alpha = 128 - (16 - this._effectDuration) * 10;
    this.setBlendColor([255, 255, 255, alpha]);
};

Sprite_Enemy.prototype.updateBlink = function() {
    this.opacity = this._effectDuration % 10 < 5 ? 255 : 0;
};

Sprite_Enemy.prototype.updateAppear = function() {
    this.opacity = (16 - this._effectDuration) * 16;
};

Sprite_Enemy.prototype.updateDisappear = function() {
    this.opacity = 256 - (32 - this._effectDuration) * 10;
};

Sprite_Enemy.prototype.updateCollapse = function() {
    this.blendMode = 1;
    this.setBlendColor([255, 128, 128, 128]);
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
};

Sprite_Enemy.prototype.updateBossCollapse = function() {
    this._shake = (this._effectDuration % 2) * 4 - 2;
    this.blendMode = 1;
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
    this.setBlendColor([255, 255, 255, 255 - this.opacity]);
    if (this._effectDuration % 20 === 19) {
        SoundManager.playBossCollapse2();
    }
};

Sprite_Enemy.prototype.updateInstantCollapse = function() {
    this.opacity = 0;
};

Sprite_Enemy.prototype.damageOffsetX = function() {
    return Sprite_Battler.prototype.damageOffsetX.call(this);
};

Sprite_Enemy.prototype.damageOffsetY = function() {
    return Sprite_Battler.prototype.damageOffsetY.call(this) - 8;
};

