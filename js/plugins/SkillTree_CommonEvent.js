/*:ja
@target MV MZ
@plugindesc スキルツリー コモンイベント拡張 v1.2.0
@author うなぎおおとろ
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SkillTree_LayoutEx.js

@help
スキルツリーのコモンイベントを拡張します。

このプラグインを導入することで、スキル取得時およびスキル忘却時に
コモンイベントを実行することができるようになります。
この機能を使用すれば、スキルツリーを使用したキャラクターの
成長システムを簡単に作ることができるようになります。

[使用方法]
skillTreeInfoの登録内容は[スキル名, スキルID, 必要SP, アイコン情報]となっていますが、
これを以下の形式に拡張します。
[スキル名, スキルIDまたはコモンイベント, 必要SP, アイコン情報]

スキル情報は以下の形式で指定します。
[スキル取得時に実行するコモンイベントID, スキル忘却時に実行するコモンイベントID, JSコード(省略可能)]
コモンイベントIDに0を指定した場合、該当のイベントは実行されません。
また、JSコードを指定した場合、コモンイベントの実行前にJSコードを実行することができます。

[ライセンス]
このプラグインは、MITライセンスの条件の下で利用可能です。
*/

(() => {
"use strict";

SkillTreeNodeInfo.prototype.learnSkill = function() {

};

SkillTreeNodeInfo.prototype.forgetSkill = function() {

};

})();
