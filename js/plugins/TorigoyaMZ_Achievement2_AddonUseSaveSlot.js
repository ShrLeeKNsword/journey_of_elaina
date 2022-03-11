/*---------------------------------------------------------------------------*
 * TorigoyaMZ_Achievement2_AddonUseSaveSlot.js v.1.0.0
 *---------------------------------------------------------------------------*
 * 2020/11/26 00:53 (JST)
 *---------------------------------------------------------------------------*
 * Ruたん ( @ru_shalm )
 * https://torigoya-plugin.rutan.dev
 *---------------------------------------------------------------------------*/

/*:
 * @target MZ
 * @plugindesc 成就系统附件: 另行存储 (v.1.0.0)
 * @author Ruたん/<译>公孖。狼
 * @license public domain
 * @version 1.0.0
 * @url https://raw.githubusercontent.com/rutan/torigoya-rpg-maker-plugin/gh-pages/TorigoyaMZ_Achievement2_AddonUseSaveSlot.js
 * @base TorigoyaMZ_Achievement2
 * @orderAfter TorigoyaMZ_Achievement2
 * @help
 * 成就系统附件: 另行存储 (v.1.0.0)
 * https://torigoya-plugin.rutan.dev
 *
 * 本插件为「成就系统」附加功能。
 * 请放置于成就系统插件身下。
 *
 * 成就数据另行保存、便于二周目调用。
 * 本插件无参数设定项目。
 *
 * 【注意】
 * 启用本插件后、标题画面中无法正常允许成就系统。
 * 请在成就系统插件内、关闭成就系统在标题画面中的项目展示。
 */

(function () {
    'use strict';

    const Torigoya = (window.Torigoya = window.Torigoya || {});

    function getPluginName() {
        const cs = document.currentScript;
        return cs ? cs.src.split('/').pop().replace(/\.js$/, '') : 'TorigoyaMZ_Achievement2_AddonUseSaveSlot';
    }

    function readParameter() {
        const parameter = PluginManager.parameters(getPluginName());
        return {
            version: '1.0.0',
        };
    }

    function checkPlugin(obj, errorMessage) {
        if (typeof obj !== 'undefined') return;
        alert(errorMessage);
        throw errorMessage;
    }

    checkPlugin(Torigoya.Achievement2, '「実績アドオン:セーブ別実績」より上に「実績プラグイン」が導入されていません。');

    Torigoya.Achievement2.Addons = Torigoya.Achievement2.Addons || {};
    Torigoya.Achievement2.Addons.UseSaveSlot = {
        name: getPluginName(),
        parameter: readParameter(),
    };

    (() => {
        // -------------------------------------------------------------------------
        // Manager

        Torigoya.Achievement2.Manager.options.onInit = function (manager) {
            manager.setAchievements(Torigoya.Achievement2.parameter.baseAchievementData);
        };

        Torigoya.Achievement2.Manager.options.onSave = null;

        // -------------------------------------------------------------------------
        // DataManager

        const upstream_DataManager_createGameObjects = DataManager.createGameObjects;
        DataManager.createGameObjects = function () {
            upstream_DataManager_createGameObjects.apply(this);
            Torigoya.Achievement2.Manager.resetData();
        };

        const upstream_DataManager_makeSaveContents = DataManager.makeSaveContents;
        DataManager.makeSaveContents = function () {
            const contents = upstream_DataManager_makeSaveContents.apply(this);
            contents.torigoyaAchievement2 = Torigoya.Achievement2.Manager.createSaveContents();
            return contents;
        };

        const upstream_DataManager_extractSaveContents = DataManager.extractSaveContents;
        DataManager.extractSaveContents = function (contents) {
            upstream_DataManager_extractSaveContents.apply(this, arguments);

            const { torigoyaAchievement2 } = contents;
            if (torigoyaAchievement2) {
                Torigoya.Achievement2.Manager.extractSaveContents(torigoyaAchievement2);
            }
        };
    })();
})();
