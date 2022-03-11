//-----------------------------------------------------------------------------
// Game_Item
//
// The game object class for handling skills, items, weapons, and armor. It is
// required because save data should not include the database object itself.

/**
 * 游戏项目
 * 
 * 游戏对象类，用于处理技能，物品，武器和防具。它是必需的，因为保存数据不应包括数据库对象本身。
 * 
 * @mv 大致相同
 */
function Game_Item() {
    this.initialize(...arguments);
}

/**
 * 初始化
 * @param {*} item 项目:技能，物品，武器和防具
 */
Game_Item.prototype.initialize = function(item) {
    /**
     * 数据类型
     * @type {""|"skill"|"item"|"weapon"|"armor"}
     */
    this._dataClass = "";
    /**
     * 项目id
     * @type {number}
     */
    this._itemId = 0;
    if (item) {
        this.setObject(item);
    }
};

/**
 * 是技能
 */
Game_Item.prototype.isSkill = function() {
    return this._dataClass === "skill";
};

/**
 * 是物品
 */
Game_Item.prototype.isItem = function() {
    return this._dataClass === "item";
};

/**
 * 是可用项目
 */
Game_Item.prototype.isUsableItem = function() {
    return this.isSkill() || this.isItem();
};

/**
 * 是武器
 */
Game_Item.prototype.isWeapon = function() {
    return this._dataClass === "weapon";
};

/**
 * 是防具
 */
Game_Item.prototype.isArmor = function() {
    return this._dataClass === "armor";
};

/**
 * 是装备项目
 */
Game_Item.prototype.isEquipItem = function() {
    return this.isWeapon() || this.isArmor();
};

/**
 * 是空的
 */
Game_Item.prototype.isNull = function() {
    return this._dataClass === "";
};

/**
 * 项目id
 */
Game_Item.prototype.itemId = function() {
    return this._itemId;
};

/**
 * 对象
 * @returns {null||object} 返回对应的数据对象
 */
Game_Item.prototype.object = function() {
    if (this.isSkill()) {
        return $dataSkills[this._itemId];
    } else if (this.isItem()) {
        return $dataItems[this._itemId];
    } else if (this.isWeapon()) {
        return $dataWeapons[this._itemId];
    } else if (this.isArmor()) {
        return $dataArmors[this._itemId];
    } else {
        return null;
    }
};

/**
 * 设置对象
 * @param {null|object} item 项目(数据对象)
 */
Game_Item.prototype.setObject = function(item) {
    if (DataManager.isSkill(item)) {
        this._dataClass = "skill";
    } else if (DataManager.isItem(item)) {
        this._dataClass = "item";
    } else if (DataManager.isWeapon(item)) {
        this._dataClass = "weapon";
    } else if (DataManager.isArmor(item)) {
        this._dataClass = "armor";
    } else {
        this._dataClass = "";
    }
    this._itemId = item ? item.id : 0;
};

/**
 * 设置装备
 * @param {boolean} isWeapon 是武器
 * @param {number} itemId 项目id
 */
Game_Item.prototype.setEquip = function(isWeapon, itemId) {
    this._dataClass = isWeapon ? "weapon" : "armor";
    this._itemId = itemId;
};

