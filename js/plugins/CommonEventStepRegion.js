//=============================================================================
// Plugin for RPG Maker MZ
// CommonEventStepRegion.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Enables to Set/Reset Common Event Id to Each Region On Step
 * @author Sasuke KANNAZUKI
 *
 * @command set
 * @text Set Common Event to Region ID
 * @desc If Region ID is already set, it will overwritten.
 *
 * @arg regionId
 * @text Region ID
 * @desc 
 * @type number
 * @min 1
 * @default 1
 *
 * @arg commonEventId
 * @text Common Event ID
 * @desc 
 * @type common_event
 * @default 1
 *
 * @command reset
 * @text Reset Region ID Setting
 * @desc 
 *
 * @arg regionId
 * @text Region ID
 * @desc 
 * @type number
 * @min 1
 * @default 1
 *
 * @command resetAll
 * @text Reset All Region IDs setting
 * @desc 
 *
 * @help 
 * This plugin runs under RPG Maker MZ.
 * 
 * This plugin can set/reset common event id to each region.
 * The Common Event invokes when step the tile whose region is set.
 *
 * [Summary]
 * You can set following operation by plugin commands.
 * - Set common event ID to the specified region.
 * - Reset it to the region.
 * - Reset all regions setting to common event
 *
 * [Note]
 * - If player doing force route moving, common event isn't invoked,
 * but the place is the destination of the force route, it invokes.
 *  - As the exception, event isn't called at the destination
 *   when the route is "Skip If Cannot Move" and the route contains
 *   cannot movement command and skipped at least once.
 *
 * [Recommended Usage]
 * - Make slipping(player keep moving without blockade) ice tiles.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc タイルを踏んだ時、リージョンIDに応じてコモンイベントを起動
 * @author 神無月サスケ
 *
 * @command set
 * @text リージョンIDにコモンイベント紐付け
 * @desc 既にコモンイベントが紐づけされている場合、上書きされます。
 *
 * @arg regionId
 * @text リージョンID
 * @desc 
 * @type number
 * @min 1
 * @default 1
 *
 * @arg commonEventId
 * @text コモンイベントID
 * @desc 
 * @type common_event
 * @default 1
 *
 * @command reset
 * @text リージョンIDリセット
 * @desc コモンイベントとの紐づけを解除します
 *
 * @arg regionId
 * @text リージョンID
 * @desc 
 * @type number
 * @min 1
 * @default 1
 *
 * @command resetAll
 * @text 全リージョンIDリセット
 * @desc 全リージョンのコモンイベント紐づけを一斉解除
 * 
 * @help 
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * このプラグインは、各リージョンにコモンイベントIDを紐付けします。
 * プレイヤーがそのリージョンのタイルの上に乗った時にそのコモンイベントが
 * 起動する仕組みです。
 *
 * ■概要
 * セットおよびリセットはすべてプラグインコマンドで行います。
 * ・リージョンIDにコモンイベントを紐付け
 * ・リージョンIDのコモンイベント紐付けを解除
 * ・全てのリージョンIDのコモンイベント紐付けを解除
 *
 * ■注意
 * ・移動ルートの強制中はリージョンによるコモンイベントは起動しませんが、
 * 移動ルートの終着点にリージョンが設定されていた場合は起動します。
 *   ただし、移動ルートに「移動できない場合は飛ばす」がチェックされ、
 *   移動中に一度でも移動できずに飛ばしたことがある場合、
 *   終着点でのコモンイベントは実行されません。
 *
 * ■主な使用例
 * ・氷の滑る床（障害物にぶつかるまで同じ方向に移動し続ける）
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'CommonEventStepRegion';

  //
  // process plugin commands
  //
  PluginManager.registerCommand(pluginName, 'set' , args => {
    const regionId = +args.regionId;
    const commonId = +args.commonEventId;
    if (!$gamePlayer._regionCommonIds) {
      $gamePlayer._regionCommonIds = {};
    }
    $gamePlayer._regionCommonIds[regionId] = commonId;
  });

  PluginManager.registerCommand(pluginName, 'reset' , args => {
    if (!$gamePlayer._regionCommonIds) {
      return;
    }
    const regionId = +args.regionId;
    $gamePlayer._regionCommonIds[regionId] = null;
  });

  PluginManager.registerCommand(pluginName, 'resetAll' , args => {
    $gamePlayer._regionCommonIds = null;
  });

  //
  // invoke common event according to the tile's region
  //
  const invokeRegionCommon = () => {
    if ($gamePlayer._regionCommonIds) {
      const regionId = $gamePlayer.regionId();
      let cId;
      if (regionId && (cId = $gamePlayer._regionCommonIds[regionId])) {
        $gameTemp.reserveCommonEvent(cId);
      }
    }
  };

  //
  // on after movement
  //
  const _Game_Party_onPlayerWalk = Game_Party.prototype.onPlayerWalk;
  Game_Party.prototype.onPlayerWalk = function() {
    invokeRegionCommon();
    _Game_Party_onPlayerWalk.call(this);
  };

  //
  // after force movement, continue movement
  //
  const _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function () {
    _Game_Temp_initialize.call(this);
    this._regionMoveFailure = false;
  };

  const _Game_Player_setMovementSuccess =
    Game_Player.prototype.setMovementSuccess;
  Game_Player.prototype.setMovementSuccess = function(success) {
    _Game_Player_setMovementSuccess.call(this, success);
    if (!success) {
      $gameTemp._regionMoveFailure = true;
    }
  };

  const _Game_Player_processRouteEnd = Game_Player.prototype.processRouteEnd;
  Game_Player.prototype.processRouteEnd = function () {
    _Game_Player_processRouteEnd.call(this);
    if (!$gameTemp._regionMoveFailure) {
      invokeRegionCommon();
    }
    $gameTemp._regionMoveFailure = false;
  };

})();
