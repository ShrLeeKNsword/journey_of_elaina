//-----------------------------------------------------------------------------
// Spriteset_Battle
//
// The set of sprites on the battle screen.

/**
 * 精灵组战斗
 * 
 * 战斗画面上的精灵集合。
 */
function Spriteset_Battle() {
    this.initialize(...arguments);
}

Spriteset_Battle.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_Battle.prototype.constructor = Spriteset_Battle;

/**初始化 */
Spriteset_Battle.prototype.initialize = function() {
    Spriteset_Base.prototype.initialize.call(this);
    this._battlebackLocated = false;
};

/**
 * 加载系统图片
 */
Spriteset_Battle.prototype.loadSystemImages = function() {
    Spriteset_Base.prototype.loadSystemImages.call(this);
    ImageManager.loadSystem("Shadow2");
    ImageManager.loadSystem("Weapons1");
    ImageManager.loadSystem("Weapons2");
    ImageManager.loadSystem("Weapons3");
};

/**
 * 创建较下的层
 */
Spriteset_Battle.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBackground();
    this.createBattleback();
    this.createBattleField();
    this.createEnemies();
    this.createActors();
};

/**
 * 创建背景
 */
Spriteset_Battle.prototype.createBackground = function() {
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this._baseSprite.addChild(this._backgroundSprite);
};

/**
 * 创建精灵战斗背景
 */
Spriteset_Battle.prototype.createBattleback = function() {
    this._back1Sprite = new Sprite_Battleback(0);
    this._back2Sprite = new Sprite_Battleback(1);
    this._baseSprite.addChild(this._back1Sprite);
    this._baseSprite.addChild(this._back2Sprite);
};

/**
 * 创建战斗区域
 */
Spriteset_Battle.prototype.createBattleField = function() {
    const width = Graphics.boxWidth;
    const height = Graphics.boxHeight;
    const x = (Graphics.width - width) / 2;
    const y = (Graphics.height - height) / 2;
    this._battleField = new Sprite();
    this._battleField.setFrame(0, 0, width, height);
    this._battleField.x = x;
    this._battleField.y = y - this.battleFieldOffsetY();
    this._baseSprite.addChild(this._battleField);
    this._effectsContainer = this._battleField;
};

/**
 * 战斗区域偏移量Y
 */
Spriteset_Battle.prototype.battleFieldOffsetY = function() {
    return 24;
};

/**
 * 更新 
 */
Spriteset_Battle.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateActors();
    this.updateBattleback();
    this.updateAnimations();
};

/**
 * 更新战斗背景
 */
Spriteset_Battle.prototype.updateBattleback = function() {
    if (!this._battlebackLocated) {
        this._back1Sprite.adjustPosition();
        this._back2Sprite.adjustPosition();
        this._battlebackLocated = true;
    }
};

/**
 * 创建敌人组
 */
Spriteset_Battle.prototype.createEnemies = function() {
    const enemies = $gameTroop.members();
    const sprites = [];
    for (const enemy of enemies) {
        sprites.push(new Sprite_Enemy(enemy));
    }
    sprites.sort(this.compareEnemySprite.bind(this));
    for (const sprite of sprites) {
        this._battleField.addChild(sprite);
    }
    this._enemySprites = sprites;
};

/**
 * 比较敌人精灵
 * @param {*} a 
 * @param {*} b 
 */
Spriteset_Battle.prototype.compareEnemySprite = function(a, b) {
    if (a.y !== b.y) {
        return a.y - b.y;
    } else {
        return b.spriteId - a.spriteId;
    }
};

/**
 * 创建角色
 */
Spriteset_Battle.prototype.createActors = function() {
    this._actorSprites = [];
    if ($gameSystem.isSideView()) {
        for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
            const sprite = new Sprite_Actor();
            this._actorSprites.push(sprite);
            this._battleField.addChild(sprite);
        }
    }
};

/**
 * 更新角色
 */
Spriteset_Battle.prototype.updateActors = function() {
    const members = $gameParty.battleMembers();
    for (let i = 0; i < this._actorSprites.length; i++) {
        this._actorSprites[i].setBattler(members[i]);
    }
};

/**
 * 寻找目标精灵
 * @param {*} target 
 */
Spriteset_Battle.prototype.findTargetSprite = function(target) {
    return this.battlerSprites().find(sprite => sprite.checkBattler(target));
};

/**
 * 战斗者精灵组
 */
Spriteset_Battle.prototype.battlerSprites = function() {
    return this._enemySprites.concat(this._actorSprites);
};

/**
 * 是效果中
 */
Spriteset_Battle.prototype.isEffecting = function() {
    return this.battlerSprites().some(sprite => sprite.isEffecting());
};

/**
 * 是任何移动中
 */
Spriteset_Battle.prototype.isAnyoneMoving = function() {
    return this.battlerSprites().some(sprite => sprite.isMoving());
};

/**
 * 是忙碌
 */
Spriteset_Battle.prototype.isBusy = function() {
    return this.isAnimationPlaying() || this.isAnyoneMoving();
};

//-----------------------------------------------------------------------------
