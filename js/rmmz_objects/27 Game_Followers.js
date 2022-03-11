//-----------------------------------------------------------------------------
// Game_Followers
//
// The wrapper class for a follower array.

/**
 * 游戏随从组
 * 
 * 随从数组的包装器类。
 */
function Game_Followers() {
    this.initialize(...arguments);
}

/**初始化*/
Game_Followers.prototype.initialize = function() {
    this._visible = $dataSystem.optFollowers;
    this._gathering = false;
    this._data = [];
    this.setup();
};

/**
 * 安装
 * @mz 新增
 */
Game_Followers.prototype.setup = function() {
    this._data = [];
    for (let i = 1; i < $gameParty.maxBattleMembers(); i++) {
        this._data.push(new Game_Follower(i));
    }
};

/**是显示*/
Game_Followers.prototype.isVisible = function() {
    return this._visible;
};

/**显示*/
Game_Followers.prototype.show = function() {
    this._visible = true;
};

/**隐藏*/
Game_Followers.prototype.hide = function() {
    this._visible = false;
};

/**
 * 数据
 * @mz 新增
*/
Game_Followers.prototype.data = function() {
    return this._data.clone();
};

/**
 * 反向数据
 * @mz 新增
 */
Game_Followers.prototype.reverseData = function() {
    return this._data.clone().reverse();
};

/**从者*/
Game_Followers.prototype.follower = function(index) {
    return this._data[index];
};

/**
 * @mv
 * Game_Followers.prototype.forEach
 * Game_Followers.prototype.reverseEach 
 * 被删除
 */




/**
 * 刷新
 */
Game_Followers.prototype.refresh = function() {
    for (const follower of this._data) {
        follower.refresh();
    }
};

/**更新*/
Game_Followers.prototype.update = function() {
    if (this.areGathering()) {
        if (!this.areMoving()) {
            this.updateMove();
        }
        if (this.areGathered()) {
            this._gathering = false;
        }
    }
    for (const follower of this._data) {
        follower.update();
    }
};

/**更新移动*/
Game_Followers.prototype.updateMove = function() {
    for (let i = this._data.length - 1; i >= 0; i--) {
        const precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
        this._data[i].chaseCharacter(precedingCharacter);
    }
};

/**跳跃全都*/
Game_Followers.prototype.jumpAll = function() {
    if ($gamePlayer.isJumping()) {
        for (const follower of this._data) {
            const sx = $gamePlayer.deltaXFrom(follower.x);
            const sy = $gamePlayer.deltaYFrom(follower.y);
            follower.jump(sx, sy);
        }
    }
};

/**同步*/
Game_Followers.prototype.synchronize = function(x, y, d) {
    for (const follower of this._data) {
        follower.locate(x, y);
        follower.setDirection(d);
    }
};

/**集合*/
Game_Followers.prototype.gather = function() {
    this._gathering = true;
};

/**是集合中*/
Game_Followers.prototype.areGathering = function() {
    return this._gathering;
};

/**显示从者组*/
Game_Followers.prototype.visibleFollowers = function() {
    return this._data.filter(follower => follower.isVisible());
};

/**是移动中*/
Game_Followers.prototype.areMoving = function() {
    return this.visibleFollowers().some(follower => follower.isMoving());
};

/**是集合后*/
Game_Followers.prototype.areGathered = function() {
    return this.visibleFollowers().every(follower => follower.isGathered());
};

/**是有人碰撞*/
Game_Followers.prototype.isSomeoneCollided = function(x, y) {
    return this.visibleFollowers().some(follower => follower.pos(x, y));
};

