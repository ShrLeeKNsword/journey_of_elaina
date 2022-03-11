//=============================================================================
// Plugin for RPG Maker MZ
// PlayMsgWndCharSeMZ.js
//=============================================================================
// [Release Note]
// This plugin is the MZ version of PlayMsgWndCharSE.js the RMMV plugin.

/*:
 * @target MZ
 * @plugindesc Play SE for Each Letter on Message Window
 * @author Sasuke KANNAZUKI
 *
 * @param default SE
 * @text Map's Default SE ID
 * @desc Be 0, 1 or 2.
 * when 0 is set, not play as default.
 * @type number
 * @max 2
 * @min 0
 * @default 1
 *
 * @param battle default SE
 * @text Battle's Default SE ID
 * @desc Be 0, 1 or 2.
 * when 0 is set, not play as default.
 * @type number
 * @max 2
 * @min 0
 * @default 0
 *
 * @param interval
 * @text Interval Letter Number
 * @desc Number of letter that skip without playing SE.
 * When it sets 0, do play at each letter. (Default:2)
 * @type number
 * @min 0
 * @default 2
 *
 * @param name1
 * @text File Name of SE ID:1
 * @desc 
 * @default Cursor1
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume1
 * @parent name1
 * @text Volume of SE ID:1
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch1
 * @parent name1
 * @text Pitch of SE ID:1
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 *
 * @param name2
 * @text File Name of SE ID:2
 * @desc
 * @default Cursor2
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume2
 * @parent name2
 * @text Volume of SE ID:2
 * @desc Default:90
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch2
 * @parent name2
 * @text Pitch of SE ID:2
 * @desc Default:100
 * @type number
 * @max 1000000
 * @min 10
 * @default 125
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 *
 * This plugin enables to play SE(=Sound Effect) on message window
 * when each letter displays.
 *
 * You can set 2 SEs, and select which to use case by case.
 * 
 * [Summary]
 * At message window, SE can change by following notation:
 * \SE[0] : stop SE
 * \SE[1] : play SE ID 1 at each letter.
 * \SE[2] : play SE ID 2 at each letter.
 * This setting is reset when map or scene changes.
 * Note that 'scene change' includes open/close menu on map.
 *
 * When \> is set in message window,
 * It forces to play char SE once.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 *


 */
/*:ja
 * @target MZ
 * @plugindesc メッセージウィンドウで文字ごとにSEを演奏します。
 * @author 神無月サスケ
 *
 * @param default SE
 * @text マップでのデフォルトSE番号
 * @desc マップに入るたびにこの値に初期化されます。
 * 0,1,2のいずれかにしてください。0は無音です。
 * @type number
 * @max 2
 * @min 0
 * @default 1
 *
 * @param battle default SE
 * @text バトルでのデフォルトSE番号
 * @desc バトルに入るたびにこの値に初期化されます。
 * 0,1,2のいずれかにしてください。0は無音です。
 * @type number
 * @max 2
 * @min 0
 * @default 0
 * 
 * @param interval
 * @text インターバル
 * @desc 何文字スキップして音を鳴らすか(推奨値:2)。
 * 0の場合、全ての文字で音を鳴らします。
 * @type number
 * @min 0
 * @default 2
 *
 * @param name1
 * @text SE1のファイル名
 * @desc
 * @default Cursor1
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume1
 * @parent name1
 * @text SE1のボリューム
 * @desc
 * @type number
 * @min 0
 * @default 90
 *
 * @param pitch1
 * @parent name1
 * @text SE1のピッチ
 * @desc
 * @type number
 * @max 1000000
 * @min 10
 * @default 100
 *
 * @param name2
 * @text SE2のファイル名
 * @desc
 * @default Cursor2
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param volume2
 * @parent name2
 * @text SE2のボリューム
 * @desc デフォルト:90
 * @type number
 * @min 0
 * @default 75
 *
 * @param pitch2
 * @parent name2
 * @text SE2のピッチ
 * @desc デフォルト:100
 * @type number
 * @max 1000000
 * @min 10
 * @default 125
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 * 
 * このプラグインは、メッセージウィンドウで文字表示の際に、
 * ポポポポ……といった感じでSE(効果音)を鳴らすことを可能にします。
 *
 * 2種類の効果音が指定可能で、ケースに応じて使い分けることが可能です。
 *
 * ■概要
 * メッセージウィンドウで以下の書式で書くことでSEを切り替えられます。
 * \SE[0] : SEを止めます。
 * \SE[1] : SE1を鳴らします。
 * \SE[2] : SE2を鳴らします。
 * この設定は、マップかシーンが切り替わるとデフォルトにリセットされます。
 * ※シーン切り替えには、メニューの開閉も含まれます。
 *
 * 文中で \> が設定された場合、インターバル(interval)の値に関わらず、
 * 強制的に1回だけSEが演奏されます。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'PlayMsgWndCharSeMZ';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const defaultMode = Number(parameters['default SE'] || 1);
  const battleDefaultMode = Number(parameters['battle default SE'] || 0);
  const interval = Number(parameters['interval'] || 2);
  const name1 = (parameters['name1'] || 'Cursor1');
  const volume1 = Number(parameters['volume1'] || 90);
  const pitch1 = Number(parameters['pitch1'] || 100);
  const name2 = (parameters['name2'] || 'Cursor2');
  const volume2 = Number(parameters['volume2'] || 75);
  const pitch2 = Number(parameters['pitch2'] || 125);

  //
  // initialize variables
  //
  const _Window_Message_initMembers = Window_Message.prototype.initMembers;
  Window_Message.prototype.initMembers = function() {
    _Window_Message_initMembers.call(this);
    this.charSECount = 0;
    this.charSEmode = defaultMode;
  };

  //
  // set Battle Mode
  //
  const _Scene_Battle_createMessageWindow =
   Scene_Battle.prototype.createMessageWindow;
  Scene_Battle.prototype.createMessageWindow = function() {
    _Scene_Battle_createMessageWindow.call(this);
    this._messageWindow.charSEmode = battleDefaultMode;
  };

  //
  // set the char SE mode
  //  
  const _Window_Message_processEscapeCharacter =
   Window_Message.prototype.processEscapeCharacter;
  Window_Message.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case 'SE':
      this.charSEmode = this.obtainEscapeParam(textState);
      break;
    case '>':
      // force to play char SE once. 
      this.charSECount = interval + 1;
      // do not break, also do default process.
    default:
      _Window_Message_processEscapeCharacter.call(this, code, textState);
      break;
    }
  };

  //
  // play char SE at message window
  // 
  const _Window_Message_shouldBreakHere =
   Window_Message.prototype.shouldBreakHere;
  Window_Message.prototype.shouldBreakHere = function(textState) {
    const doesBreak = _Window_Message_shouldBreakHere.call(this, textState);
    if (doesBreak) {
      this.processCharSE();
    }
    return doesBreak;
  };

  Window_Message.prototype.processCharSE = function(){
    if(this._showFast) { // triggered (= skipping message)
      return;
    }
    if(!this._lineShowFast) { // unless '\>' mode
      ++this.charSECount;
    }
    if(this.charSECount > interval) {
      this.playCharSE();
      this.charSECount = 0;
    }
  };

  Window_Message.prototype.playCharSE = function(){
    switch (this.charSEmode) {
    case 0:
      // not play sound
      break;
    case 1:
      if(name1){
        let audio = {};
        audio.name = name1;
        audio.pitch = pitch1;
        audio.volume = volume1;
        AudioManager.playStaticSe(audio);
      }
      break;
    case 2:
      if(name2){
        let audio = {};
        audio.name = name2;
        audio.pitch = pitch2;
        audio.volume = volume2;
        AudioManager.playStaticSe(audio);
      }
      break;
    default:
      // not supported yet
      break;
    }
  };
})();
