/*:
 * @target MZ
 * @plugindesc Start with an actor command in time progress battle.
 * @author yuwaka
 *
 * @help
 * Skip the first party command “Fight, Escape” in Time Progress Battle
 * and start by entering the actor command. (Does not affect turn-based combat)
 * 
 * To invoke a party command, press the cancel key or the back icon.
 *
 * There is no plug-in command.
 * Privately for RPG Maker MZ.
 *
 */

/*:ja
 * @target MZ
 * @plugindesc タイムプログレス戦闘でアクターコマンドから開始します。
 * @author yuwaka
 *
 * @help
 * タイムプログレス戦闘で最初のパーティコマンド「戦う、逃げる」をスキップし
 * アクターコマンドの入力から開始します。 （ターン制戦闘には影響しません）
 * 
 * パーティコマンドを呼び出すには、キャンセルキーまたは戻るアイコンを押します。
 *
 * プラグインコマンドはありません。
 * RPGツクールMZ専用です。
 *
 */

// プラグインで定義した変数が外に漏れないようにする（競合対策）
(() => {
    // 元のBattleManager.initMembers関数を覚えておく
    const _BattleManager_initMembers = BattleManager.initMembers;
    // 再定義して・・・
    BattleManager.initMembers = function() {
        // 覚えておいた元の関数を呼び出す
        _BattleManager_initMembers.apply(this, arguments);
        // 追加部分
        this._tpbNeedsPartyCommand = false;
    };
})();

