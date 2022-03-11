//-----------------------------------------------------------------------------
// Game_Actors
//
// The wrapper class for an actor array.

/**
 * 游戏角色组
 * 
 * 游戏角色数组的包装器类。
 */
function Game_Actors() {
    this.initialize(...arguments);
}

/**初始化*/
Game_Actors.prototype.initialize = function() {
    /**
     * 数据
     * @type {Game_Actor[]}
     */
    this._data = [];
};

/**
 * 角色
 * @param {number} actorId 角色id
 * @returns {Game_Actor|null}
 */
Game_Actors.prototype.actor = function(actorId) {
    if ($dataActors[actorId]) {
        if (!this._data[actorId]) {
            this._data[actorId] = new Game_Actor(actorId);
        }
        return this._data[actorId];
    }
    return null;
};

