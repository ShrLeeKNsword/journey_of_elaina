/*=============================================================================
 PluginBaseFunction.js
----------------------------------------------------------------------------
 (C)2020 Triacontane
 This software is released under the MIT License.
 http://opensource.org/licenses/mit-license.php
----------------------------------------------------------------------------
 Version
 1.0.0 2020/06/12 初版
----------------------------------------------------------------------------
 [Blog]   : https://triacontane.blogspot.jp/
 [Twitter]: https://twitter.com/triacontane/
 [GitHub] : https://github.com/triacontane/
=============================================================================*/

/*:
 * @target MZ
 * @plugindesc プラグイン共通関数
 * @author トリアコンタン
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @url https://raw.githubusercontent.com/triacontane/RPGMakerMZ/master/js/plugins/PluginBaseFunction.js
 *
 * @help PluginBaseFunction.js
 *
 * 共通関数を提供するベースプラグインです。
 * 関数、メソッドの提供のみを行い、既存の処理に影響は与えません。
 * また、機能追加によって関数を増やすことはあっても
 * 減らすことやIOを変更することはありません。
 *
 * ・追加した関数
 * マップのリロードが必要かどうかを返します。
 * $gamePlayer.isNeedMapReload();
 *
 * イベント名が引数と一致する最初のイベントを返します。
 * $gameMap.findEventByName(eventName);
 *
 * 特徴を有するデータベースのメモ欄から
 * 指定した名前に一致する最初の値を返します。
 * Game_BattlerBase.prototype.findTraitMetaFirst(names);
 *
 * 特徴を有するデータベースのメモ欄から
 * 指定した名前に一致する最大の値を返します。
 * Game_BattlerBase.prototype.findTraitMetaMax(names);
 *
 * 特徴を有するデータベースのメモ欄から
 * 指定した名前に一致する合計値を返します。
 * Game_BattlerBase.prototype.findTraitMetaSum(names);
 *
 * いずれかのウィンドウがアクティブになっているかを返します。
 * Scene_Base.prototype.isAnyWindowActive();
 *
 * 現在のシーンが指定したクラスのシーンと一致するかを返します。
 * SceneManager.isCurrentScene(sceneClass);
 *
 * データベースを指定した条件で完全一致検索して一致した最初の1件を返します。
 * DataManager.searchDataItem(dataArray, columnName, columnValue);
 *
 * 全てのシステムSEを停止します。
 * AudioManager.stopAllStaticSe();
 *
 * 指定したシステムSEを停止します。
 * AudioManager.stopStaticSe(se);
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */

(() => {
    'use strict';

    /**
     * Game_Player
     */
    Game_Player.prototype.isNeedMapReload = function() {
        return this._needsMapReload;
    };

    /**
     * Game_Map
     */
    Game_Map.prototype.findEventByName = function(eventName) {
        return $gameMap.events().filter(event => {
            return event.event().name === eventName;
        })[0] || null;
    };

    /**
     * Game_BattlerBase
     */
    Game_BattlerBase.prototype.findTraitMetaFirst = function(names) {
        for (const traitObj of this.traitObjects()) {
            const meta = PluginManagerEx.findMetaValue(traitObj, names);
            if (meta) {
                return meta;
            }
        }
    };

    Game_BattlerBase.prototype.findTraitMetaMax = function(names) {
        let maxValue = 0;
        this.traitObjects().forEach(traitObj => {
            const meta = PluginManagerEx.findMetaValue(traitObj, names);
            if (meta) {
                maxValue = Math.max(maxValue, parseInt(meta));
            }
        });
        return maxValue;
    };

    Game_BattlerBase.prototype.findTraitMetaSum = function(names) {
        return this.traitObjects().reduce((prevValue, traitObj) => {
            const meta = PluginManagerEx.findMetaValue(traitObj, names);
            if (meta) {
                prevValue = prevValue + parseInt(meta);
            }
            return prevValue;
        }, 0);
    };

    /**
     * Scene_Base.prototype.isAnyWindowActive
     * @returns {boolean}
     */
    Scene_Base.prototype.isAnyWindowActive = function() {
        if (this._windowLayer) {
            return this._windowLayer.children.some(win => {
                return win instanceof Window_Selectable && win.active;
            });
        } else {
            return false;
        }
    };

    /**
     * SceneManager
     */
    SceneManager.isCurrentScene = function(sceneClass) {
        return this._scene && this._scene.constructor === sceneClass;
    };

    /**
     * DataManager.searchDataItem
     * Search database
     * @param dataArray target
     * @param columnName condition1
     * @param columnValue condition2
     * @returns {object} result
     */
    DataManager.searchDataItem = function(dataArray, columnName, columnValue) {
        let result = 0;
        dataArray.some(dataItem => {
            if (dataItem && dataItem[columnName] === columnValue) {
                result = dataItem;
                return true;
            }
            return false;
        });
        return result;
    };

    /**
     * AudioManager.stopAllStaticSe
     * Stop all system SE.
     */
    AudioManager.stopAllStaticSe = function() {
        this._staticBuffers.forEach(function(buffer) {
            buffer.stop();
        });
        this._staticBuffers = [];
    };

    /**
     * AudioManager.stopStaticSe
     * Stop system SE.
     */
    AudioManager.stopStaticSe = function(se) {
        if (!se.name) {
            return;
        }
        for (let i = 0; i < this._staticBuffers.length; i++) {
            const buffer = this._staticBuffers[i];
            if (buffer._reservedSeName === se.name) {
                buffer.stop();
                this.updateSeParameters(buffer, se);
                break;
            }
        }
    };
})();
