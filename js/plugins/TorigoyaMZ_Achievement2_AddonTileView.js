/*---------------------------------------------------------------------------*
 * TorigoyaMZ_Achievement2_AddonTileView.js v.1.1.0
 *---------------------------------------------------------------------------*
 * 2020/08/25 01:23 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 成就附加插件: 图块表示 (v.1.1.0)
 * @author Ruたん/<译>公孖。狼
 * @license public domain
 * @version 1.1.0
 * @base TorigoyaMZ_Achievement2
 * @orderAfter TorigoyaMZ_Achievement2
 * @help
 * 成就附加插件: 图块表示 (v.1.1.0)
 *
 * 本插件为「成就插件」的附加插件。
 * 请放置于成就插件的排序之下使用。
 *
 * 已取得成就一览界面将不在显示文字文本
 * 替换为以图标的形式展现
 *
 * @param base
 * @text ■ 基础设定
 *
 * @param colsSize
 * @text 展示数（横）
 * @desc 每排展示成就图标数量
 * @type number
 * @parent base
 * @min 1
 * @default 5
 *
 * @param itemPadding
 * @text 图标的空白
 * @desc 图标周围的空白(px)
 * @type number
 * @parent base
 * @min 0
 * @default 5
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_Achievement2_AddonTileView';
    }

    function pickNumberValueFromParameter(parameter, key) {
        return parseFloat(parameter[key]);
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.1.0',
            colsSize: pickNumberValueFromParameter(parameter, 'colsSize'),
            itemPadding: pickNumberValueFromParameter(parameter, 'itemPadding'),
        };
    }

    function checkPlugin(obj, errorMessage) {
        if (typeof obj !== 'undefined') return;
        alert(errorMessage);
        throw errorMessage;
    }

    checkPlugin(Torigoya.Achievement2, '「実績アドオン:タイル表示」より上に「実績プラグイン」が導入されていません。');

    Torigoya.Achievement2.Addons = Torigoya.Achievement2.Addons || {};
    Torigoya.Achievement2.Addons.TileView = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        const Window_AchievementList = Torigoya.Achievement2.Window_AchievementList;
        const parameter = Torigoya.Achievement2.Addons.TileView.parameter;

        const upstream_Window_AchievementList_initialize = Window_AchievementList.prototype.initialize;
        Window_AchievementList.prototype.initialize = function (rect) {
            this._areaRect = rect;
            upstream_Window_AchievementList_initialize.apply(this, arguments);
            this.resizeFittingItems();
            this.refresh();
        };

        Window_AchievementList.prototype.resizeFittingItems = function () {
            const { x, y, width, height } = this._areaRect;

            const h = Math.ceil(this.maxItems() / this.maxCols());
            this.width = Math.min(this.maxCols() * this.itemWidth() + this.padding * 2, width);
            this.height = Math.max(
                Math.min(h * this.itemHeight() + (h - 1) * this.rowSpacing() + this.padding * 2, height),
                this.fittingHeight(1)
            );

            this.x = x + (width - this.width) / 2;
            this.y = y + (height - this.height) / 2;
        };

        Window_AchievementList.prototype.itemPadding = function () {
            return parameter.itemPadding;
        };

        Window_AchievementList.prototype.maxCols = function () {
            return parameter.colsSize;
        };

        Window_AchievementList.prototype.itemWidth = function () {
            return ImageManager.iconWidth + parameter.itemPadding * 2 + this.colSpacing();
        };

        Window_AchievementList.prototype.itemHeight = function () {
            return ImageManager.iconHeight + parameter.itemPadding * 2 + this.rowSpacing();
        };

        Window_AchievementList.prototype.lineHeight = function () {
            return this.itemHeight();
        };

        const upstream_Window_AchievementList_drawAllItems = Window_AchievementList.prototype.drawAllItems;
        Window_AchievementList.prototype.drawAllItems = function () {
            this.resizeFittingItems();
            upstream_Window_AchievementList_drawAllItems.apply(this);
        };

        Window_AchievementList.prototype.drawItem = function (index) {
            const item = this._data[index];
            const rect = this.itemRect(index);
            this.resetFontSettings();

            if (item) {
                if (item.unlockInfo) {
                    this.changePaintOpacity(true);
                    this.drawIcon(
                        item.achievement.icon,
                        rect.x + parameter.itemPadding,
                        rect.y + parameter.itemPadding
                    );
                } else {
                    this.changePaintOpacity(false);
                    this.drawIcon(
                        Torigoya.Achievement2.parameter.achievementMenuHiddenIcon,
                        rect.x + parameter.itemPadding,
                        rect.y + parameter.itemPadding
                    );
                }
            } else {
                this.changePaintOpacity(true);
                this.drawText(
                    Torigoya.Achievement2.parameter.achievementMenuCancelMessage,
                    rect.x,
                    rect.y,
                    rect.width,
                    'center'
                );
            }
        };
    })();
})();
