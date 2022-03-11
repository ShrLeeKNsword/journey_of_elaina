//-----------------------------------------------------------------------------
// Sprite_Weapon
//
// The sprite for displaying a weapon image for attacking.

/**
 * 精灵武器
 * 
 * 显示用于攻击的武器图像的精灵。
 * @mz 与mv无太多差别
 */
function Sprite_Weapon() {
    this.initialize(...arguments);
}

Sprite_Weapon.prototype = Object.create(Sprite.prototype);
Sprite_Weapon.prototype.constructor = Sprite_Weapon;

/**初始化 */
Sprite_Weapon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
};

/**初始化成员 */
Sprite_Weapon.prototype.initMembers = function() {
    this._weaponImageId = 0;
    this._animationCount = 0;
    this._pattern = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.x = -16;
};

/**
 * 安装
 * @param {*} weaponImageId 武器图片ID
 */
Sprite_Weapon.prototype.setup = function(weaponImageId) {
    this._weaponImageId = weaponImageId;
    this._animationCount = 0;
    this._pattern = 0;
    this.loadBitmap();
    this.updateFrame();
};

/**
 * 更新 
 */
Sprite_Weapon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this.updateFrame();
        this._animationCount = 0;
    }
};

/**
 * 动画等待
 */
Sprite_Weapon.prototype.animationWait = function() {
    return 12;
};

/**
 * 更新图案
 */
Sprite_Weapon.prototype.updatePattern = function() {
    this._pattern++;
    if (this._pattern >= 3) {
        this._weaponImageId = 0;
    }
};

/**
 * 加载位图
 */
Sprite_Weapon.prototype.loadBitmap = function() {
    const pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
    if (pageId >= 1) {
        this.bitmap = ImageManager.loadSystem("Weapons" + pageId);
    } else {
        this.bitmap = ImageManager.loadSystem("");
    }
};

/**
 * 更新帧
 * 
 */
Sprite_Weapon.prototype.updateFrame = function() {
    if (this._weaponImageId > 0) {
        const index = (this._weaponImageId - 1) % 12;
        const w = 96;
        const h = 64;
        const sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
        const sy = Math.floor(index % 6) * h;
        this.setFrame(sx, sy, w, h);
    } else {
        this.setFrame(0, 0, 0, 0);
    }
};

/**是播放中 */
Sprite_Weapon.prototype.isPlaying = function() {
    return this._weaponImageId > 0;
};

