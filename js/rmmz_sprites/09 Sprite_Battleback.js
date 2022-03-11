//-----------------------------------------------------------------------------
// Sprite_Battleback
//
// The sprite for displaying a background image in battle.

/**
 * 精灵战斗背景
 * 
 * 在战斗中显示背景图像的精灵。
 */
function Sprite_Battleback() {
    this.initialize(...arguments);
}

Sprite_Battleback.prototype = Object.create(TilingSprite.prototype);
Sprite_Battleback.prototype.constructor = Sprite_Battleback;

/**
 * 初始化
 * @param {*} type 
 */
Sprite_Battleback.prototype.initialize = function(type) {
    TilingSprite.prototype.initialize.call(this);
    if (type === 0) {
        this.bitmap = this.battleback1Bitmap();
    } else {
        this.bitmap = this.battleback2Bitmap();
    }
};

/**
 * 调整位置
 */
Sprite_Battleback.prototype.adjustPosition = function() {
    this.width = Math.floor((1000 * Graphics.width) / 816);
    this.height = Math.floor((740 * Graphics.height) / 624);
    this.x = (Graphics.width - this.width) / 2;
    if ($gameSystem.isSideView()) {
        this.y = Graphics.height - this.height;
    } else {
        this.y = 0;
    }
    const ratioX = this.width / this.bitmap.width;
    const ratioY = this.height / this.bitmap.height;
    const scale = Math.max(ratioX, ratioY, 1.0);
    this.scale.x = scale;
    this.scale.y = scale;
};

/**
 * 战斗背景1位图
 */
Sprite_Battleback.prototype.battleback1Bitmap = function() {
    return ImageManager.loadBattleback1(this.battleback1Name());
};

/**
 * 战斗背景2位图
 */
Sprite_Battleback.prototype.battleback2Bitmap = function() {
    return ImageManager.loadBattleback2(this.battleback2Name());
};

/**
 * 战斗背景1名称
 * 
 */
Sprite_Battleback.prototype.battleback1Name = function() {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback1Name;
    } else if ($gameMap.battleback1Name() !== null) {
        return $gameMap.battleback1Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback1Name();
    } else {
        return "";
    }
};

/**
 * 战斗背景2名称
 * 
 */
Sprite_Battleback.prototype.battleback2Name = function() {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback2Name;
    } else if ($gameMap.battleback2Name() !== null) {
        return $gameMap.battleback2Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback2Name();
    } else {
        return "";
    }
};

/**
 * 大地图战斗背景1名称
 */
Sprite_Battleback.prototype.overworldBattleback1Name = function() {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback1Name();
    } else {
        return this.normalBattleback1Name();
    }
};

/**
 * 大地图战斗背景2名称
 */
Sprite_Battleback.prototype.overworldBattleback2Name = function() {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback2Name();
    } else {
        return this.normalBattleback2Name();
    }
};


/**正常战斗背景1名称 */
Sprite_Battleback.prototype.normalBattleback1Name = function() {
    return (
        this.terrainBattleback1Name(this.autotileType(1)) ||
        this.terrainBattleback1Name(this.autotileType(0)) ||
        this.defaultBattleback1Name()
    );
};

/**正常战斗背景2名称 */
Sprite_Battleback.prototype.normalBattleback2Name = function() {
    return (
        this.terrainBattleback2Name(this.autotileType(1)) ||
        this.terrainBattleback2Name(this.autotileType(0)) ||
        this.defaultBattleback2Name()
    );
};

/**范围战斗背景1名称  */
Sprite_Battleback.prototype.terrainBattleback1Name = function(type) {
    switch (type) {
        case 24:
        case 25:
            return "Wasteland";
        case 26:
        case 27:
            return "DirtField";
        case 32:
        case 33:
            return "Desert";
        case 34:
            return "Lava1";
        case 35:
            return "Lava2";
        case 40:
        case 41:
            return "Snowfield";
        case 42:
            return "Clouds";
        case 4:
        case 5:
            return "PoisonSwamp";
        default:
            return null;
    }
};

/**范围战斗背景2名称  */
Sprite_Battleback.prototype.terrainBattleback2Name = function(type) {
    switch (type) {
        case 20:
        case 21:
            return "Forest";
        case 22:
        case 30:
        case 38:
            return "Cliff";
        case 24:
        case 25:
        case 26:
        case 27:
            return "Wasteland";
        case 32:
        case 33:
            return "Desert";
        case 34:
        case 35:
            return "Lava";
        case 40:
        case 41:
            return "Snowfield";
        case 42:
            return "Clouds";
        case 4:
        case 5:
            return "PoisonSwamp";
    }
};

/**默认战斗背景1名称 */
Sprite_Battleback.prototype.defaultBattleback1Name = function() {
    return "Grassland";
};

/**默认战斗背景2名称 */
Sprite_Battleback.prototype.defaultBattleback2Name = function() {
    return "Grassland";
};

/**船战斗背景1名称 */
Sprite_Battleback.prototype.shipBattleback1Name = function() {
    return "Ship";
};

/**船战斗背景2名称 */
Sprite_Battleback.prototype.shipBattleback2Name = function() {
    return "Ship";
};

/**自动图块种类 */
Sprite_Battleback.prototype.autotileType = function(z) {
    return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
};

