//=============================================================================
// RPG Maker MZ - Overpass Plugin
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Overpass Plugin
 * @author triacontane(original Yoji Ojima)
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url
 *
 * @param overPathRegion
 * @text Overpass Region
 * @desc Region ID set for bridge or other overpass sections.
 * @default 0
 * @type number
 *
 * @param overPathTerrainTag
 * @text Overpass Terrain Tag
 * @desc Terrain tag set for bridge or other overpass sections.
 * @default 0
 * @type number
 *
 * @param gatewayRegion
 * @text Overpass Entrance Region
 * @desc Region ID set for overpass entrances, such as both ends of a bridge.
 * @default 0
 * @type number
 *
 * @param gatewayTerrainTag
 * @text Overpass Entrance Terrain Tag
 * @desc Terrain tag set for overpass entrances, such as both ends of a bridge.
 * @default 0
 * @type number
 *
 * @help OverpassTile.js
 *
 * Overpasses, such as bridges, can be represented on the map.
 * This plugin improves functionality for RPG Maker MV's official "OverpassTile.js" plugin's MZ.
 *
 * Since you can specify not only regions but terrain tags,
 * considerations are made for event launches and collision determination as well.
 * The plugin does not make considerations for vehicles.
 *
 * Specifications for Determination of Passage
 * -When at the entrance of a bridge
 * 　→The player can always move towards the overpass.
 * -When on an overpass
 * 　→If on top of a bridge, the player can always move towards the entrance of the bridge and overpass.
 * 　→If under a bridge, the player can never move toward the bridge's entrance.
 * -If movement allowance was not determined from the above conditions
 * 　→Follows the map's original passage settings.
 *
 * The plugin can take event launch determination and collision determination into consideration.
 * -Events with different heights (over and under a bridge) will launch, without collision.
 */

/*:ja
 * @target MZ
 * @plugindesc 立体交差を作成します。
 * @author トリアコンタン(original Yoji Ojima)
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url
 *
 * @param overPathRegion
 * @text 立体交差リージョン
 * @desc 橋などの立体交差部分に設定するリージョンIDです。
 * @default 0
 * @type number
 *
 * @param overPathTerrainTag
 * @text 立体交差地形タグ
 * @desc 橋などの立体交差部分に設定する地形タグです。
 * @default 0
 * @type number
 *
 * @param gatewayRegion
 * @text 立体交差入り口リージョン
 * @desc 橋の両端など、立体交差の入り口部分に設定するリージョンIDです。
 * @default 0
 * @type number
 *
 * @param gatewayTerrainTag
 * @text 立体交差入り口地形タグ
 * @desc 橋の両端など、立体交差の入り口部分に設定するリージョンIDです。
 * @default 0
 * @type number
 *
 * @help OverpassTile.js
 *
 * マップ上で橋などの立体交差を表現できます。
 * ツクールMV公式プラグイン「OverpassTile.js」のMZ向け機能強化版です。
 *
 * リージョンだけでなく地形タグも指定可能で、
 * さらにイベントの起動や衝突判定に関する考慮がなされています。
 * 乗り物の存在は考慮しません。
 *
 * 通行可能判定に関する仕様
 * ・橋の入り口にいる場合
 * 　→立体交差に対して必ず移動できます。
 * ・立体交差にいる場合
 * 　→橋の上にいる場合、立体交差と橋の入り口に対して必ず移動できます。
 * 　→橋の下にいる場合、橋の入り口に対して必ず移動できません。
 * ・上記の条件で移動可否を判定しなかった場合
 * 　→マップの本来の通行設定に従います。
 *
 * イベントの起動判定、衝突判定を考慮できます。
 * ・高さが異なる（橋の上と下にいる）イベントは起動、衝突しません。
 */

(() => {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);

    /**
     * Game_CharacterBase
     */
    const _Game_CharacterBase_isMapPassable = Game_CharacterBase.prototype.isMapPassable;
    Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
        const passable = this.isMapPassableOnOverPath(x, y, d);
        if (passable !== undefined) {
            return passable;
        }
        return _Game_CharacterBase_isMapPassable.apply(this, arguments)
    };

    const _Game_CharacterBase_isCollidedWithEvents = Game_CharacterBase.prototype.isCollidedWithEvents;
    Game_CharacterBase.prototype.isCollidedWithEvents = function(x, y) {
        return _Game_CharacterBase_isCollidedWithEvents.apply(this, arguments) &&
            this.isCollidedWithSameHigherEvents(x, y);
    };

    Game_CharacterBase.prototype.isCollidedWithSameHigherEvents = function(x, y) {
        const events = $gameMap.eventsXyNt(x, y);
        return events.some(event => event.isNormalPriority() && this.isSameHigher(event));
    };

    Game_CharacterBase.prototype.isSameHigher = function(target) {
        return Math.abs(this.getHigherLevel() - target.getHigherLevel()) <= 1;
    };

    Game_CharacterBase.prototype.getHigherLevel = function() {
        if (!this._higher) {
            return this.isOnOverPath() ? -1 : 0;
        } else {
            return this.isOnOverPath() ? 2 : 1;
        }
    };

    Game_CharacterBase.prototype.isMapPassableOnOverPath = function(x, y, d) {
        const overPath = $gameMap.isOverPath(x, y);
        const gateway = $gameMap.isGatewayOverPath(x, y);
        const advancedX = $gameMap.roundXWithDirection(x, d);
        const advancedY = $gameMap.roundYWithDirection(y, d);
        const advancedOverPath = $gameMap.isOverPath(advancedX, advancedY);
        const advancedGateway = $gameMap.isGatewayOverPath(advancedX, advancedY);
        if (gateway && advancedOverPath) {
            return true;
        } else if (overPath) {
            if (this._higher) {
                return advancedOverPath || advancedGateway;
            } else if (advancedGateway) {
                return false;
            }
        }
        return undefined;
    };

    const _Game_CharacterBase_refreshBushDepth = Game_CharacterBase.prototype.refreshBushDepth;
    Game_CharacterBase.prototype.refreshBushDepth = function() {
        _Game_CharacterBase_refreshBushDepth.apply(this, arguments);
        this.updateOverPath();
    };

    Game_CharacterBase.prototype.updateOverPath = function() {
        if (this.isOnGateway()) {
            this._higher = true;
        } else if (!this.isOnOverPath()) {
            this._higher = false;
        }
    };

    Game_CharacterBase.prototype.isOnGateway = function() {
        return $gameMap.isGatewayOverPath(this.x, this.y);
    };

    Game_CharacterBase.prototype.isOnOverPath = function() {
        return $gameMap.isOverPath(this.x, this.y);
    };

    const _Game_CharacterBase_screenZ = Game_CharacterBase.prototype.screenZ;
    Game_CharacterBase.prototype.screenZ = function() {
        const z = _Game_CharacterBase_screenZ.apply(this, arguments);
        return this.isHigherPriority() ? z + 3 : z;
    };

    Game_CharacterBase.prototype.isHigherPriority = function() {
        return this._higher;
    };

    Game_CharacterBase.prototype.updateOverPathOnLocate = function() {
        this._higher = this.isOnOverPath() || this.isOnGateway();
    };

    /**
     * Game_Character
     */
    const _Game_Character_findDirectionTo = Game_Character.prototype.findDirectionTo;
    Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
        let result = _Game_Character_findDirectionTo.apply(this, arguments);
        if (result + this._prevFindDirectionTo === 10) {
            result = 0;
        }
        this._prevFindDirectionTo = result;
        return result;
    };

    const _Game_Player_moveByInput = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        if (!$gameTemp.isDestinationValid()) {
            this._prevFindDirectionTo = 0;
        }
        _Game_Player_moveByInput.apply(this, arguments);
    };

    /**
     * Game_Event
     */
    const _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function() {
        if (this.isTriggerIn([0, 1, 2]) && !this.isSameHigher($gamePlayer)) {
            return;
        }
        _Game_Event_start.apply(this, arguments);
    };

    const _Game_Event_isCollidedWithEvents = Game_Event.prototype.isCollidedWithEvents;
    Game_Event.prototype.isCollidedWithEvents = function(x, y) {
        return _Game_Event_isCollidedWithEvents.apply(this, arguments) &&
            this.isCollidedWithSameHigherEvents(x, y);
    };

    const _Game_Event_isCollidedWithPlayerCharacters = Game_Event.prototype.isCollidedWithPlayerCharacters;
    Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y) {
        if (!this.isSameHigher($gamePlayer)) {
            return false;
        }
        return _Game_Event_isCollidedWithPlayerCharacters.apply(this, arguments);
    };

    /**
     * Game_Followers
     */
    Game_Followers.prototype.updateOverPathOnLocate = function() {
        this._data.forEach(follower => {
            follower.updateOverPathOnLocate();
        })
    };

    /**
     * Game_Map
     */
    Game_Map.prototype.isRegionOrTerrainTag = function(x, y, regionId, terrainTag) {
        if (regionId > 0 && this.regionId(x, y) === regionId) {
            return true;
        } else if (terrainTag > 0 && this.terrainTag(x, y) === terrainTag) {
            return true;
        } else {
            return false;
        }
    };

    Game_Map.prototype.isOverPath = function(x, y) {
        return this.isRegionOrTerrainTag(x, y, param.overPathRegion, param.overPathTerrainTag);
    };

    Game_Map.prototype.isGatewayOverPath = function(x, y) {
        return this.isRegionOrTerrainTag(x, y, param.gatewayRegion, param.gatewayTerrainTag);
    };

    const _Tilemap_isOverpassPosition = Tilemap.prototype._isOverpassPosition;
    Tilemap.prototype._isOverpassPosition = function(mx, my) {
        const result = _Tilemap_isOverpassPosition.apply(this, arguments);
        return result || ($gameMap && $gameMap.isOverPath(mx, my));
    };
})();
