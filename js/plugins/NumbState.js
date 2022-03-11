//=============================================================================
// NumbStates.js (Ver1.2.1)
//=============================================================================
// 2015.Oct.30 Ver1.0.0  First Release
// 2019.Jul.03 Ver1.1.0  Solve the conflict with BeforeCommon.js
// 2019.Dec.08 Ver1.2.0  (closed release) Update to run under also MZ
// 2020.Feb.20 Ver1.2.1  displaying message become selectable

/*:
 * @target MV MZ
 * @plugindesc Make the state that battler become numb.
 * @author Sasuke KANNAZUKI
 *
 * @param dispMsgType
 * @text Display Message Type
 * @desc Where to set message displays when numb occur
 * @type select
 * @option This plugin's option
 * @value plugin
 * @option State Messages in Data Base
 * @value state
 * @default plugin
 *
 * @param NumbMsg
 * @text Numb Message
 * @desc Text to display when one cannot move by numb. 
 * %1 is replaced to battler's name, %2 is state's name.
 * @type string
 * @default %1 cannot move by the numb!
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV and MZ.
 *
 * This plugin enables to make the state numb (different from paralysis).
 *
 * [Summary]
 * The numb is the state that sometimes the battler cannot move in spite of
 * the command is inputtable.
 * 
 * [State Note]
 * To invoke this state, write down the state's note as follows.
 *   <numb_rate:35> # cannot execute action by 35%
 *
 * [About 'Display Message Type' Option]
 * The message display when numb occur is selectable from followings:
 * - When you select 'This plugin's option',
 *  it will display this plugin's 'Numb Message' option.
 * - When you select 'State Messages in Data Base',
 *  it will display the state's message "If the state persists".
 *  If you select this, when the battler avoid to occur numb,
 *  it will not display the message.
 * 
 * When you make plural states that numb occur,
 * latter setting may be useful.
 * 
 * [Note]
 * It's preferred that the numb state's restriction is None.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MV MZ
 * @plugindesc 一定確率で行動できないステート(Ver1.2)
 * @author 神無月サスケ
 *
 * @param dispMsgType
 * @text 発動時メッセージタイプ
 * @desc 動けない時に表示するメッセージの設定箇所
 * @type select
 * @option パラメータで直接設定
 * @value plugin
 * @option データベースのステート
 * @value state
 * @default plugin
 *
 * @param NumbMsg
 * @parent dispMsgType
 * @text 発動時表示文
 * @desc 身体が痺れて動けない場合に表示する文章。
 * %1がバトラー名に置き換えられます
 * @type string
 * @default %1は身体がしびれて動けない！
 *
 * @help このプラグインにプラグインコマンドはありません。
 * このプラグインはRPGツクールMVおよびMZに対応しています。
 *
 * 痺れ(numb)は、入力は常に受け付けるものの特定の確率で動けなくなる状態で
 * ツクール標準の眠り/麻痺とは異なります。
 * 
 * ■書式
 * 「ステート」のメモに以下のように書いてください。
 *   <numb_rate:35>
 *  この場合、このステートになったら 35% の確率で行動できなくなります。
 *
 * ■オプション「発動時メッセージタイプ」について：
 * この状態が発動し、動けなくなった際に表示する文章は、
 * オプションの「発動時メッセージタイプ」で指定します。
 * ・「パラメータで直接設定」を選ぶと、
 * このプラグインで設定した「発動時表示文」が表示されます。
 * ・「データベースのステート」を選ぶと
 * 「この状態が継続しているとき」のメッセージが表示されます。
 * こちらを選ぶと、通常に行動できた時は、
 * このメッセージは表示されません。
 * 
 * この状態が発動するステートを複数作りたい場合は、
 * 後者が便利です。
 * 
 * ■注意
 * ステートの「行動制約」は「なし（＝入力可）」にするのが望ましいです。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function() {
  //
  // process parameters
  //
  var parameters = PluginManager.parameters('NumbState');
  var dispMsgType = parameters['dispMsgType'] || 'plugin'
  var NumbText = (parameters['NumbMsg'] || "%1 cannot move by the numb!");

  //
  // select the message type and display occasion
  //
  var _Game_BattlerBase_mostImportantStateText =
    Game_BattlerBase.prototype.mostImportantStateText;
  Game_BattlerBase.prototype.mostImportantStateText = function() {
    var _stateTmp;
    if (dispMsgType === 'state') {
      _statesTmp = this._states.clone();
      this._states = this._states.filter(function (stateId) {
        return !$dataStates[stateId].meta.numb_rate;
      });
    }
    var text = _Game_BattlerBase_mostImportantStateText.call(this);
    if (dispMsgType === 'state') {
      this._states = _statesTmp;
    }
    return text;
  };

  //
  // evaluate and execute numb
  //
  Game_BattlerBase.prototype.numb_occur = function() {
    for (var id = 0; id < this._states.length; id++) {
      var stateId = this._states[id];
      var result = $dataStates[stateId].meta.numb_rate;
      if (result) {
        if(Math.randomInt(100) < Number(result)) {
          return stateId;
        }
      }
    }
    return 0;
  };

  var _BattleManager_processTurn = BattleManager.processTurn;
  BattleManager.processTurn = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    // from BeforeCommon.js
    if (this._execBeforeCommon) {
      _BattleManager_processTurn.call(this);
      return;
    }
    var stateId;
    if (action && (stateId = subject.numb_occur())){
      subject.clearActions();
      this._logWindow.displayNumbOccur(subject, stateId);
    }
    _BattleManager_processTurn.call(this);
  };

  Window_BattleLog.prototype.displayNumbOccur = function(subject, stateId){
    var text = '';
    var state = $dataStates[stateId];
    switch (dispMsgType) {
    case 'plugin':
      text = NumbText;
      break;
    case 'state':
      text = state.message3;
      break;
    }
    this.push('addText', text.format(subject.name(), state.name));
    this.push('clear');
  };

})();

