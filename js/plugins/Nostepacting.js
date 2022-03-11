/*:
 * @target MZ
 * @plugindesc Prevents you from stepping forward in side view combat when acting.
 * @author yuwaka
 *
 * @help
 * Prevents you from stepping forward in side view combat when acting.
 * Move forward only during command input.
 *
 * There is no plug-in command.
 * Privately for RPG Maker MZ.
 *
 */

/*:ja
 * @target MZ
 * @plugindesc サイドビュー戦闘で行動時に一歩前に出ないようにする。
 * @author yuwaka
 *
 * @help
 * サイドビュー戦闘で行動時に一歩前に出ないようにします。
 * コマンド入力時のみ前に出ます。
 *
 * プラグインコマンドはありません。
 * RPGツクールMZ専用です。
 *ツクールの規約に沿って自由に改変・使用してください。
 */

//改変元rmmz_sprites.js　アクターがアクションを起こす時っぽい条件をコメントアウト。

Sprite_Actor.prototype.shouldStepForward = function() {
    return this._actor.isInputting();// || this._actor.isActing();
};