//-----------------------------------------------------------------------------
// Sprite_Character
//
// The sprite for displaying a character.

/**
 * 精灵人物
 * 
 * 用于显示人物的精灵。
 */
function Sprite_Character() {
    this.initialize(...arguments);
}

Sprite_Character.prototype = Object.create(Sprite.prototype);
Sprite_Character.prototype.constructor = Sprite_Character;

/**
 * 初始化
 * @param {Game_Character} character 人物
 */
Sprite_Character.prototype.initialize = function(character) {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.setCharacter(character);
};

/**
 * 初始化成员
 */
Sprite_Character.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._character = null;
    this._balloonDuration = 0;
    this._tilesetId = 0;
    this._upperBody = null;
    this._lowerBody = null;
};

/**
 * 设置人物
 * @param {Game_Character} character 人物
 */
Sprite_Character.prototype.setCharacter = function(character) {
    this._character = character;
};

/**
 * 检查人物
 * @param {Game_Character} character 人物
 */
Sprite_Character.prototype.checkCharacter = function(character) {
    return this._character === character;
};

/**
 * 更新 
 */
Sprite_Character.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateOther();
    this.updateVisibility();
};

/**
 * 更新可见性
 */
Sprite_Character.prototype.updateVisibility = function() {
    Sprite.prototype.updateVisibility.call(this);
    if (this.isEmptyCharacter() || this._character.isTransparent()) {
        this.visible = false;
    }
};

/**
 * 是图块
 */
Sprite_Character.prototype.isTile = function() {
    return this._character.isTile();
};

/**
 * 是对象人物
 */
Sprite_Character.prototype.isObjectCharacter = function() {
    return this._character.isObjectCharacter();
};

/**
 * 是空人物
 */
Sprite_Character.prototype.isEmptyCharacter = function() {
    return this._tileId === 0 && !this._characterName;
};

/**
 * 图块组位图
 * @param {number} tileId 图块id 
 */
Sprite_Character.prototype.tilesetBitmap = function(tileId) {
    const tileset = $gameMap.tileset();
    const setNumber = 5 + Math.floor(tileId / 256);
    return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
};

/**
 * 更新位图
 */
Sprite_Character.prototype.updateBitmap = function() {
    if (this.isImageChanged()) {
        this._tilesetId = $gameMap.tilesetId();
        this._tileId = this._character.tileId();
        this._characterName = this._character.characterName();
        this._characterIndex = this._character.characterIndex();
        if (this._tileId > 0) {
            this.setTileBitmap();
        } else {
            this.setCharacterBitmap();
        }
    }
};

/**
 * 是图像改变
 */
Sprite_Character.prototype.isImageChanged = function() {
    return (
        this._tilesetId !== $gameMap.tilesetId() ||
        this._tileId !== this._character.tileId() ||
        this._characterName !== this._character.characterName() ||
        this._characterIndex !== this._character.characterIndex()
    );
};

/**
 * 设置图块位图
 */
Sprite_Character.prototype.setTileBitmap = function() {
    this.bitmap = this.tilesetBitmap(this._tileId);
};

/**
 * 设置人物位图
 */
Sprite_Character.prototype.setCharacterBitmap = function() {
    this.bitmap = ImageManager.loadCharacter(this._characterName);
    this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
};

/**
 * 更新帧
 */
Sprite_Character.prototype.updateFrame = function() {
    if (this._tileId > 0) {
        this.updateTileFrame();
    } else {
        this.updateCharacterFrame();
    }
};

/**
 * 更新图块帧
 */
Sprite_Character.prototype.updateTileFrame = function() {
    const tileId = this._tileId;
    const pw = this.patternWidth();
    const ph = this.patternHeight();
    const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
    const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};

/**
 * 更新人物帧
 */
Sprite_Character.prototype.updateCharacterFrame = function() {
    const pw = this.patternWidth();
    const ph = this.patternHeight();
    const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
    const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
    this.updateHalfBodySprites();
    if (this._bushDepth > 0) {
        const d = this._bushDepth;
        this._upperBody.setFrame(sx, sy, pw, ph - d);
        this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
        this.setFrame(sx, sy, 0, ph);
    } else {
        this.setFrame(sx, sy, pw, ph);
    }
};

/**
 * 人物块x
 */
Sprite_Character.prototype.characterBlockX = function() {
    if (this._isBigCharacter) {
        return 0;
    } else {
        const index = this._character.characterIndex();
        return (index % 4) * 3;
    }
};

/**
 * 人物块y
 */
Sprite_Character.prototype.characterBlockY = function() {
    if (this._isBigCharacter) {
        return 0;
    } else {
        const index = this._character.characterIndex();
        return Math.floor(index / 4) * 4;
    }
};

/**
 * 角色图案X
 */
Sprite_Character.prototype.characterPatternX = function() {
    return this._character.pattern();
};

/**
 * 角色图案Y
 */
Sprite_Character.prototype.characterPatternY = function() {
    return (this._character.direction() - 2) / 2;
};

/**
 * 图案宽度
 */
Sprite_Character.prototype.patternWidth = function() {
    if (this._tileId > 0) {
        return $gameMap.tileWidth();
    } else if (this._isBigCharacter) {
        return this.bitmap.width / 3;
    } else {
        return this.bitmap.width / 12;
    }
};

/**
 * 图案高度
 */
Sprite_Character.prototype.patternHeight = function() {
    if (this._tileId > 0) {
        return $gameMap.tileHeight();
    } else if (this._isBigCharacter) {
        return this.bitmap.height / 4;
    } else {
        return this.bitmap.height / 8;
    }
};

/**
 * 更新半身精灵
 */
Sprite_Character.prototype.updateHalfBodySprites = function() {
    if (this._bushDepth > 0) {
        this.createHalfBodySprites();
        this._upperBody.bitmap = this.bitmap;
        this._upperBody.visible = true;
        this._upperBody.y = -this._bushDepth;
        this._lowerBody.bitmap = this.bitmap;
        this._lowerBody.visible = true;
        this._upperBody.setBlendColor(this.getBlendColor());
        this._lowerBody.setBlendColor(this.getBlendColor());
        this._upperBody.setColorTone(this.getColorTone());
        this._lowerBody.setColorTone(this.getColorTone());
        this._upperBody.blendMode = this.blendMode;
        this._lowerBody.blendMode = this.blendMode;
    } else if (this._upperBody) {
        this._upperBody.visible = false;
        this._lowerBody.visible = false;
    }
};

/**
 * 创建半身精灵
 */
Sprite_Character.prototype.createHalfBodySprites = function() {
    if (!this._upperBody) {
        this._upperBody = new Sprite();
        this._upperBody.anchor.x = 0.5;
        this._upperBody.anchor.y = 1;
        this.addChild(this._upperBody);
    }
    if (!this._lowerBody) {
        this._lowerBody = new Sprite();
        this._lowerBody.anchor.x = 0.5;
        this._lowerBody.anchor.y = 1;
        this._lowerBody.opacity = 128;
        this.addChild(this._lowerBody);
    }
};

/**
 * 更新位置
 */
Sprite_Character.prototype.updatePosition = function() {
    this.x = this._character.screenX();
    this.y = this._character.screenY();
    this.z = this._character.screenZ();
};

/**
 * 更新其他
 */
Sprite_Character.prototype.updateOther = function() {
    this.opacity = this._character.opacity();
    this.blendMode = this._character.blendMode();
    this._bushDepth = this._character.bushDepth();
};

