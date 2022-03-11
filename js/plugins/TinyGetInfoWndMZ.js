//=============================================================================
// Plugin for RPG Maker MZ
// TinyGetInfoWndMZ.js
//=============================================================================
// [Release Note]
// This is the MZ version of TinyGetInfoWnd.js the RMMV plugin.

/*:
 * @target MZ
 * @plugindesc Display one-line window of gaining/losing items information
 * @author Sasuke KANNAZUKI, Peachround
 *
 * @param Event Command Switch
 * @text Switch Id for Event Command
 * @desc If the switch ON, display window when it changes an item
 * number or gold by an event command
 * @type switch
 * @default 10
 * 
 * @param Y position type
 * @text Y Position Type
 * @desc Windows' position. (0:Top 1:Bottom)
 * @type select
 * @option Top
 * @value 0
 * @option Bottom
 * @value 1
 * @default 0
 * 
 * @param Window Duration
 * @text Window Duration Frames
 * @desc How many frames to display (1sec=60frames, Default:200)
 * @type number
 * @min 0
 * @default 200
 * 
 * @param textGainItem
 * @text Title Text for Gain Item
 * @desc title text display on the window when gain item(s).
 * %1 is replaced to the item's kind(weapon/armor/item/gold).
 * @type string
 * @default You got %1
 * 
 * @param Display Loss
 * @text Display Loss?
 * @desc Whether to display item/gold loss
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 * 
 * @param textLoseItem
 * @parent Display Loss
 * @text Title Text for Lose Item
 * @desc title text display on the window when lose item(s).
 * %1 is replaced to the item's kind(weapon/armor/item/gold).
 * @type string
 * @default You lost %1
 *
 * @param Display at Battle
 * @text Display on Battle?
 * @desc Whether to display it not only map but also on battle
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 * 
 * @param wordMoney
 * @text Word for Gold
 * @desc the word that represents the kind 'gold'(=money)
 * @type string
 * @default money
 *
 * @param iconMoney
 * @text Icon for Gold
 * @desc the Icon ID that represents the kind 'gold'(=money)
 * @type number
 * @min 0
 * @default 313
 *
 * @param Item SE filename
 * @desc the filename of the SE that plays when you gain item(s).
 * note: It doesn't play when you lose item(s).
 * @default Evasion1
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Item SE volume
 * @parent Item SE filename
 * @desc the volume of the SE that plays when you gain item(s).
 * @type number
 * @min 0
 * @default 90
 * 
 * @param Item SE pitch
 * @parent Item SE filename
 * @desc the pitch of the SE that plays when you gain item(s).
 * @type number
 * @max 100000
 * @min 10
 * @default 100
 * 
 * @param Weapon SE filename
 * @desc the filename of the SE that plays when you gain weapon(s).
 * note: It doesn't play when you lose weapon(s).
 * @default Equip1
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Weapon SE volume
 * @parent Weapon SE filename
 * @desc the volume of the SE that plays when you gain weapon(s).
 * @type number
 * @min 0
 * @default 90
 * 
 * @param Weapon SE pitch
 * @desc the pitch of the SE that plays when you gain weapon(s).
 * @type number
 * @max 100000
 * @min 10
 * @default 100
 * 
 * @param Armor SE filename
 * @desc the filename of the SE that plays when you gain armor(s).
 * note: It doesn't play when you lose armor(s).
 * @default Evasion2
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Armor SE volume
 * @parent Armor SE filename
 * @desc the volume of the SE that plays when you gain armor(s).
 * @type number
 * @min 0
 * @default 90
 * 
 * @param Armor SE pitch
 * @parent Armor SE filename
 * @desc the pitch of the SE that plays when you gain armor(s).
 * @type number
 * @max 100000
 * @min 10
 * @default 100
 * 
 * @param Money SE filename
 * @desc the filename of the SE that plays when you gain money.
 * note: It doesn't play when you lose money.
 * @default Coin
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Money SE volume
 * @parent Money SE filename
 * @desc the volume of the SE that plays when you gain money.
 * @type number
 * @min 0
 * @default 90
 * 
 * @param Money SE pitch
 * @parent Money SE filename
 * @desc the pitch of the SE that plays when you gain money.
 * @type number
 * @max 100000
 * @min 10
 * @default 100
 *
 * @command getItem
 * @text Get/Lose Item/Equipment
 * @desc Get or Lose Item, Weapon or Armor.
 * And display it one-line window.
 *
 * @arg type
 * @text Item Type
 * @desc Select item, weapon or armor.
 * @type select
 * @option item
 * @value item
 * @option weapon
 * @value weapon
 * @option armor
 * @value armor
 * @default item
 *
 * @arg id
 * @text Item ID
 * @desc ID of item, weapon or armor.
 * @type number
 * @min 1
 * @default 1
 *
 * @arg number
 * @desc You can lose the item by setting minus value.
 * @type number
 * @min -999999
 * @default 1
 *
 * @command getVarItem
 * @text Get/Lose Item/Equipment(by variable).
 * @desc You can set item ID and change number by variable.
 * And display it one-line window.
 *
 * @arg type
 * @text Item Type
 * @desc Select item, weapon or armor.
 * @type select
 * @option item
 * @value item
 * @option weapon
 * @value weapon
 * @option armor
 * @value armor
 * @default item
 *
 * @arg varIdOfItemId
 * @text Variable ID for Item
 * @desc Variable ID to store ID of Item/Equipment
 * @type variable
 * @default 1
 *
 * @arg varIdOfNumber
 * @text Variable ID for Number
 * @desc Variable ID to store number to change
 * @type variable
 * @default 2
 *
 * @command getGold
 * @text Get/Lose Gold.
 * @desc Gold means money.
 * And display it one-line window.
 *
 * @arg value
 * @desc You can lose gold by setting minus value.
 * @type number
 * @min -9999999999
 * @default 100
 *
 * @command getVarGold
 * @text Get/Lose Gold (by variable)
 * @desc You can set value by variable.
 * And display it one-line window.
 *
 * @arg varIdOfValue
 * @text Variable ID for Value
 * @desc Variable ID to store value to change
 * @type variable
 * @default 1
 *
 * @command duration
 * @text Change Duration
 * @desc Change One-line GetInfo Window Duration Frames
 *
 * @arg frames
 * @desc How many frames to display (1sec=60frames, Default:200)
 * @type number
 * @min 0
 * @default 200
 *
 * @command durationVar
 * @text Change Duration(by variable)
 * @desc Change One-line GetInfo Window Duration Frames by Variable
 *
 * @arg framesVarId
 * @text Variable ID for Frames
 * @desc Variable ID to store value of frames.
 * (1sec=60frames, Default:200frames)
 * @type variable
 * @default 1
 *
 * @help
 * This plugin runs under RPG Maker MZ.
 *
 * This plugin displays item getting information window by one line.
 *
 * [Summary]
 * There is 2 methods to display one-line information window.
 * *1. Call By Plugin Command*
 *  Displays window and changes the number of specified item and so on.
 * *2. Set specified switch ON that is set at option*
 *  Set switch ID to the option 'Switch Id for Event Command'.
 *  During the switch is ON, the window displays when interpreter
 *  executes the event command that changes the number of item and so on.
 *
 * [Note Description]
 * <info:the_explanation> : the_explanation displays when gain/lose the item.
 *  If it isn't written down, it displays the first line of the item's
 *  description.
 *
 * [Note]
 * - The number of lost item is no more than the party has.
 *  When you have only 3 and execute 'lose 5' for the item,
 *  it will display 'lost 3'.
 *  If you don't have the item, even if execute 'lose', do not display window.
 *
 * [Copyright]
 * This plugin is written by Sasuke KANNAZUKI,
 * based on a Peachround's RGSS2 script specification.
 * (Note: Peachround's Japanese name is Momomaru.)
 * Thanks to Peachround.
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 *
 */
/*:ja
 * @target MZ
 * @plugindesc アイテムの入手/消失を1行ウィンドウで表示します
 * @author 神無月サスケ (原案：ももまる)
 *
 * @param Event Command Switch
 * @text イベントコマンド用スイッチID
 * @desc このスイッチがONの時、イベントコマンドでアイテム類や
 * 所持金の増減を行った時ウィンドウ表示
 * @type switch
 * @default 10
 * 
 * @param Y position type
 * @text 表示Y座標タイプ
 * @desc 複数のウィンドウを並べる位置(0:上部 1:下部)
 * @type select
 * @option 上部
 * @value 0
 * @option 下部
 * @value 1
 * @default 0
 * 
 * @param Window Duration
 * @text 表示フレーム時間
 * @desc ウィンドウを表示するフレーム数
 * ※1秒＝60フレーム (既定値：200)
 * @type number
 * @min 0
 * @default 200
 * 
 * @param textGainItem
 * @text 入手時表示タイトル
 * @desc アイテムを入手した時に表示するタイトル部分のテキスト。
 * %1がアイテム種別(アイテム/武器/防具/お金)に置き換わる
 * @type string
 * @default %1入手！
 * 
 * @param Display Loss
 * @text 消失時も表示？
 * @desc 消失時にもウィンドウを表示するか
 * @type boolean
 * @on する
 * @off しない
 * @default true
 * 
 * @param textLoseItem
 * @parent Display Loss
 * @text 消失時表示タイトル
 * @desc アイテムを消失した時に表示するタイトル部分のテキスト。
 * %1がアイテム種別(アイテム/武器/防具/お金)に置き換わる
 * @type string
 * @default %1消失……。
 *
 * @param Display at Battle
 * @text 戦闘中も表示？
 * @desc 戦闘中にもウィンドウを表示するか
 * @type boolean
 * @on する
 * @off しない
 * @default true
 * 
 * @param wordMoney
 * @text 「お金」用テキスト
 * @desc アイテム種別の「お金」を表すテキスト
 * @type string
 * @default お金
 *
 * @param iconMoney
 * @text 「お金」用アイコンID
 * @desc お金入手/消失時に表示するアイコンID
 * @type number
 * @min 0
 * @default 313
 *
 * @param Item SE filename
 * @text アイテムSEファイル名
 * @desc アイテムを入手した時に演奏されるSEのファイル名。
 * 注意：消失した時は演奏されません。
 * @default Evasion1
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Item SE volume
 * @text アイテムSEボリューム
 * @parent Item SE filename
 * @desc アイテムを入手した時に演奏されるSEのボリューム
 * @type number
 * @min 0
 * @default 90
 * 
 * @param Item SE pitch
 * @text アイテムSEピッチ
 * @parent Item SE filename
 * @desc アイテムを入手した時に演奏されるSEのピッチ
 * @type number
 * @max 100000
 * @min 10
 * @default 100
 * 
 * @param Weapon SE filename
 * @text 武器SEファイル名
 * @desc 武器を入手した時に演奏されるSEのファイル名です。
 * 注意：消失した時は演奏されません。
 * @default Equip1
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Weapon SE volume
 * @text 武器SEボリューム
 * @parent Weapon SE filename
 * @desc 武器を入手した時に演奏されるSEのボリューム
 * @type number
 * @min 0
 * @default 90
 * 
 * @param Weapon SE pitch
 * @text 武器SEピッチ
 * @parent Weapon SE filename
 * @desc 武器を入手した時に演奏されるSEのピッチ
 * @type number
 * @max 100000
 * @min 10
 * @default 100
 * 
 * @param Armor SE filename
 * @text 防具SEファイル名
 * @desc 防具を入手した時に演奏されるSEのファイル名。
 * 注意：消失した時は演奏されません。
 * @default Evasion2
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Armor SE volume
 * @text 防具SEボリューム
 * @parent Armor SE filename
 * @desc 防具を入手した時に演奏されるSEのボリューム
 * @type number
 * @min 0
 * @default 90
 * 
 * @param Armor SE pitch
 * @text 防具SEピッチ
 * @parent Armor SE filename
 * @desc 防具を入手した時に演奏されるSEのピッチ
 * @type number
 * @max 100000
 * @min 10
 * @default 100
 * 
 * @param Money SE filename
 * @text お金SEファイル名
 * @desc お金を入手した時に演奏されるSEのファイル名。
 * 注意：消失した時は演奏されません。
 * @default Coin
 * @require 1
 * @dir audio/se/
 * @type file
 * 
 * @param Money SE volume
 * @text お金SEボリューム
 * @parent Money SE filename
 * @desc お金を入手した時に演奏されるSEのボリューム
 * @type number
 * @min 0
 * @default 90
 * 
 * @param Money SE pitch
 * @text お金SEピッチ
 * @parent Money SE filename
 * @desc お金を入手した時に演奏されるSEのピッチ
 * @type number
 * @max 100000
 * @min 10
 * @default 100
 *
 * @command getItem
 * @text アイテムや装備の増減
 * @desc アイテムを増減し1行ウィンドウで表示します。
 *
 * @arg type
 * @text アイテム種別
 * @desc item=アイテム, weapon=武器, armor=防具
 * @type select
 * @option アイテム
 * @value item
 * @option 武器
 * @value weapon
 * @option 防具
 * @value armor
 * @default item
 *
 * @arg id
 * @text アイテムID
 * @desc アイテム(または武器防具)のID
 * @type number
 * @min 1
 * @default 1
 *
 * @arg number
 * @text 増減値
 * @desc マイナス値を指定すると減少させることが出来ます。
 * @type number
 * @min -999999
 * @default 1
 *
 * @command getVarItem
 * @text アイテムや装備の増減(変数指定)
 * @desc アイテムを増減し1行ウィンドウで表示します。
 * 増減するアイテムIDや増減値を変数で指定します。
 *
 * @arg type
 * @text アイテム種別
 * @desc item=アイテム, weapon=武器, armor=防具
 * @type select
 * @option アイテム
 * @value item
 * @option 武器
 * @value weapon
 * @option 防具
 * @value armor
 * @default item
 *
 * @arg varIdOfItemId
 * @text アイテム用変数ID
 * @desc アイテム(または装備)のIDを格納する変数ID
 * @type variable
 * @default 1
 *
 * @arg varIdOfNumber
 * @text 増減値用変数ID
 * @desc 増減値を格納する変数ID
 * @type variable
 * @default 2
 *
 * @command getGold
 * @text お金の増減
 * @desc お金を増減し1行ウィンドウで表示します。
 *
 * @arg value
 * @text 増減額
 * @desc マイナス値を指定すると減少させることが出来ます。
 * @type number
 * @min -9999999999
 * @default 100
 *
 * @command getVarGold
 * @text お金の増減(変数指定)
 * @desc お金を増減し1行ウィンドウで表示します。
 * 増減額を変数で指定します。
 *
 * @arg varIdOfValue
 * @text 増減額用変数ID
 * @desc 増減額を格納する変数ID
 * @type variable
 * @default 1
 *
 * @command duration
 * @text 表示時間変更
 * @desc アイテム増減1行ウィンドウの表示フレーム数変更
 *
 * @arg frames
 * @text フレーム数
 * @desc ウィンドウを表示するフレーム数
 * ※1秒＝60フレーム (既定値：200)
 * @type number
 * @min 0
 * @default 200
 *
 * @command durationVar
 * @text 表示時間変更(変数指定)
 * @desc アイテム増減1行ウィンドウの表示フレーム数変更
 * フレーム数は変数で指定します。
 *
 * @arg framesVarId
 * @text フレーム数の変数ID
 * @desc フレーム数を格納する変数ID
 * ※1秒＝60フレーム (既定値：200フレーム)
 * @type variable
 * @default 1
 *
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * このプラグインは、アイテムや装備、所持金の増減の際に、
 * 画面に1行ウィンドウを表示することを可能にします。
 *
 * ■概要
 * 画面に1行ウィンドウを表示させるには、以下のいずれかを行います。
 * ◆ プラグインコマンドを呼び出す：
 *  オプションで指定したアイテムや装備、お金の増減とともに、
 *  ウィンドウが表示されます。
 * ◆ オプションのスイッチ「イベントコマンド用スイッチID」をONにする：
 *  このスイッチがONの間、イベントコマンドで増減を行うと、
 *  同時にウィンドウが表示されるようになります。
 *
 * ■メモの書式
 * <info:the_explanation> : the_explanation の文章が、アイテムの説明として
 *  入手/消失時に表示されます。省略した場合は、アイテムの説明の1行目が
 *  表示されます。
 *
 * ■注意
 * アイテムの消失は、所持している数に関連します。
 * 例えば5個消失コマンドを実行して、3個しか持っていない場合「3個消失」と
 * 表示されます。また、該当アイテムをひとつも持っていない場合は、
 * 消失ウィンドウは表示されません。
 *
 * ■謝辞
 * このプラグインは、ももまる様のRGSS2素材の仕様をベースに作られました。
 * ももまる様に謝意を示します。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 *
 */

(() => {
  const pluginName = 'TinyGetInfoWndMZ';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const dispSwitchID = Number(parameters['Event Command Switch'] || 10);
  const yPosType = Number(parameters['Y position type'] || 0);
  let wndDuration = Number(parameters['Window Duration'] || 200);
  const isDisplayLoss = eval(parameters['Display Loss'] || 'true');
  const isDisplayBattle = eval(parameters['Display at Battle'] || 'true');
  const textGainItem = parameters['textGainItem'] || 'You got %1';
  const textLoseItem = parameters['textLoseItem'] || 'You lost %1';
  const wordMoney = parameters['wordMoney'] || 'money';
  const iconMoney = Number(parameters['iconMoney'] || 360);
  const seFilename = parameters['Item SE filename'] || 'Evasion1';
  const seVolume = Number(parameters['Item SE volume'] || 90);
  const sePitch = Number(parameters['Item SE pitch'] || 100);
  const seWeaponFilename = parameters['Weapon SE filename'] || 'Equip1';
  const seWeaponVolume = Number(parameters['Weapon SE volume'] || 90);
  const seWeaponPitch = Number(parameters['Weapon SE pitch'] || 100);
  const seArmorFilename = parameters['Armor SE filename'] || 'Evasion2';
  const seArmorVolume = Number(parameters['Armor SE volume'] || 90);
  const seArmorPitch = Number(parameters['Armor SE pitch'] || 100);
  const seMoneyFilename = parameters['Money SE filename'] || 'Coin';
  const seMoneyVolume = Number(parameters['Money SE volume'] || 90);
  const seMoneyPitch = Number(parameters['Money SE pitch'] || 100);

  //
  // utility functions
  //
  const currentSpriteSet = () => {
    if (!$gameParty.inBattle() || isDisplayBattle) {
      return SceneManager._scene._spriteset;
    }
    return null;
  };

  const addGetItemWindow = (type, id, number, includeEquip) => {
    const spriteSet = currentSpriteSet();
    switch(type) {
    case 'item':
      if (!!spriteSet && !!$dataItems[id]) {
        if (number > 0) {
          const text = textGainItem.format(TextManager.item);
          spriteSet.addGetInfoWindow(id, 0, text, number);
        } else if (number < 0) {
          const text = textLoseItem.format(TextManager.item);
          spriteSet.addGetInfoWindow(id, 0, text, number);
        }
      }
      break;
    case 'weapon':
      if (!!spriteSet && !!$dataWeapons[id]) {
        if (number > 0) {
          const text = textGainItem.format(TextManager.weapon);
          spriteSet.addGetInfoWindow(id, 1, text, number);
        } else if (number < 0) {
          const text = textLoseItem.format(TextManager.weapon);
          spriteSet.addGetInfoWindow(id, 1, text, number, includeEquip);
        }
      }
      break;
    case 'armor':
      if (!!spriteSet && !!$dataArmors[id]) {
        if (number > 0) {
          const text = textGainItem.format(TextManager.armor);
          spriteSet.addGetInfoWindow(id, 2, text, number);
        } else if (number < 0) {
          const text = textLoseItem.format(TextManager.armor);
          spriteSet.addGetInfoWindow(id, 2, text, number, includeEquip);
        }
      }
      break;
    }
  };

  const addGetGoldWindow = value => {
    const spriteSet = currentSpriteSet();
    if (!!spriteSet) {
      let text;
      if (value >= 0) {
        text = textGainItem.format(wordMoney);
      } else {
        text = textLoseItem.format(wordMoney);
      }
      spriteSet.addGetInfoWindow(0, 3, text, value);
    }
  };

  //
  // process plugin commands
  //
  PluginManager.registerCommand(pluginName, 'getItem', args => {
    const type = args.type;
    const id = Number(args.id);
    const number = Number(args.number);
    addGetItemWindow(type, id, number);
  });

  PluginManager.registerCommand(pluginName, 'getVarItem', args => {
    const type = args.type;
    const id = $gameVariables.value(+args.varIdOfItemId);
    const number = $gameVariables.value(+args.varIdOfNumber);
    addGetItemWindow(type, id, number);
  });

  PluginManager.registerCommand(pluginName, 'getGold', args => {
    addGetGoldWindow(Number(args.value));
  });

  PluginManager.registerCommand(pluginName, 'getVarGold', args => {
    const value = $gameVariables.value(+args.varIdOfValue);
    addGetGoldWindow(value);
  });

  PluginManager.registerCommand(pluginName, 'duration', args => {
    $gameSystem.tinyWndDuration = Number(args.frames);
  });

  PluginManager.registerCommand(pluginName, 'durationVar', args => {
    const frames = $gameVariables.value(+args.framesVarId);
    $gameSystem.tinyWndDuration = frames;
  });

  //
  // set variables
  //
  var _Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function() {
    _Game_Temp_initialize.call(this);
    this.getInfoOccupied = [];
  };

  //
  // process spriteset
  //
  const _Spriteset_Base_initialize = Spriteset_Base.prototype.initialize;
  Spriteset_Base.prototype.initialize = function () {
    this.getInfoWndFactory = [];
    this.getInfoWnds = [];
    $gameTemp.getInfoOccupied = [];
    _Spriteset_Base_initialize.call(this);
  };

  Spriteset_Base.prototype.createInfoWindow = function(id, type, text, value,
    includeEquip
  ) {
    if(this.getInfoWndFactory.length > 0) {
      return this.getInfoWndFactory.shift().setup(id, type, text, value,
        includeEquip
      );
    } else {
      return new Window_GetInfo(id, type, text, value, includeEquip);
    }
  };

  Spriteset_Base.prototype.addGetInfoWindow = function(id, type, text, value,
    includeEquip
  ) {
    const window = this.createInfoWindow(id, type, text, value, includeEquip);
    this.getInfoWnds.push(window);
    SceneManager._scene.addChild(window);
  };

  Spriteset_Base.prototype.removeGetInfoWindow = function(window) {
    $gameTemp.getInfoOccupied[window.index] = null;
    SceneManager._scene.removeChild(window);
    this.getInfoWndFactory.push(window.reset());
  };

  Spriteset_Base.prototype.removeAllGetInfoWindows = function() {
    for(const window of this.getInfoWnds) {
      this.removeGetInfoWindow(window);
    }
    this.getInfoWnds = [];
  };

  const _Spriteset_Base_update = Spriteset_Base.prototype.update;
  Spriteset_Base.prototype.update = function() {
    _Spriteset_Base_update.call(this);
    this.updateGetInfoWindow();
  };

  Spriteset_Base.prototype.updateGetInfoWindow = function() {
    let s = this;
    this.getInfoWnds = this.getInfoWnds.filter(window => {
      if (window.needsDispose()) {
        s.removeGetInfoWindow(window);
        return false;
      }
      return true;
    });
  };

  //
  // delete all tiny windows before battle
  //
  const _Scene_Map_startEncounterEffect =
   Scene_Map.prototype.startEncounterEffect;
  Scene_Map.prototype.startEncounterEffect = function() {
    this._spriteset.removeAllGetInfoWindows();
    _Scene_Map_startEncounterEffect.call(this);
  };

  // -------------------------------------------------------------------------
  // Window_GetInfo
  // 
  // The tiny window to display item gain/lose situation on map.

  function Window_GetInfo(){
    this.initialize.apply(this, arguments);
  }

  Window_GetInfo.prototype = Object.create(Window_Base.prototype);
  Window_GetInfo.prototype.constructor = Window_GetInfo;

  const getInfoRect = () => {
    const wx = -8;
    const wy = 0;
    const ww = Graphics.boxWidth + 16;
    const wh = 105;
    return new Rectangle(wx, wy, ww, wh);
  };

  Window_GetInfo.prototype.initialize = function(id, type, text, value,
    includeEquip
  ) {
    Window_Base.prototype.initialize.call(this, getInfoRect());
    this.reset();
    this.setup(id, type, text, value, includeEquip);
  };

  Window_GetInfo.prototype.reset = function() {
    this.disposed = false;
    this.opacity = 0;
    this.backOpacity = 0;
    this.contentsOpacity = 0;
    this.count = 0;
    this.contents.clear();
	if ($gameSystem.tinyWndDuration != null) {
	  wndDuration = $gameSystem.tinyWndDuration;
	}
    return this;
  };

  const determineItem = (type, id) => {
    let data = null;
    switch(type) {
    case 0:
      data = $dataItems[id];
      break;
    case 1:
      data = $dataWeapons[id];
      break;
    case 2:
      data = $dataArmors[id];
      break;
    }
    return data;
  };

  const numItemEquip = item => {
    let numItems = 0;
    for (const actor of $gameParty.members()) {
      if (actor.isEquipped(item)) {
        numItems++;
      }
    }
    return numItems;
  };

  const getRealValue = (type, id, value, includeEquip) => {
    // check number (whether the party has enough number of item to lose)
    if(type >= 0 && type <= 2) {
      const item = determineItem(type, id);
      if(value < 0) {
        const numItems = $gameParty.numItems(item) +
          (includeEquip ? numItemEquip(item) : 0);
        if(-value > numItems){
          value = -numItems;
        }
      }
    } else if (type === 3) {
      if(value < 0) {
        if(-value > $gameParty.gold()){
          value = -$gameParty.gold();
        }
      }
    }
    return value;
  };

  Window_GetInfo.prototype.setup = function(id, type, text, value,
    includeEquip
  ) {
    value = getRealValue(type, id, value, includeEquip);
    this.gainItem(type, id, value, includeEquip);
    this.setPosition(value);
    this.drawContents(id, type, text, value);
    this.playSE(type, value);
    this.update();
    return this;
  };

  Window_GetInfo.prototype.gainItem = function(type, id, value, includeEquip) {
    if(type >= 0 && type <= 2) {
      const data = determineItem(type, id);
      $gameParty.gainItem(data, value, includeEquip);
    } else if(type === 3) {
      $gameParty.gainGold(value);
    }
  };

  Window_GetInfo.prototype.setPosition = function(value) {
    if (value === 0 || (value < 0 && !isDisplayLoss)) {
      return;
    }
    this.index = $gameTemp.getInfoOccupied.indexOf(null);
    if(this.index === -1) {
      this.index = $gameTemp.getInfoOccupied.length;
    }
    $gameTemp.getInfoOccupied[this.index] = true;
    // set Y position
    if(yPosType === 0){
      this.y = this.index * 60;
    } else {
      this.y = Graphics.boxHeight - 100 - (this.index * 60);
    }
  };

  const noteDescription = data => {
    if(data.meta.info) {
      return data.meta.info;
    }
    return data.description.replace(/[\r\n]+.*/m, "");
  };

  Window_GetInfo.prototype.drawContents = function(id, type, text, value) {
    if (value === 0 || (value < 0 && !isDisplayLoss)) {
      return;
    }
    const data = determineItem(type, id);
    // fill background
    this.contents.paintOpacity = 160;
    this.contents.fontSize = 28;
    this.contents.fillRect(0, 21, Graphics.boxWidth, 36, '#000000');
    // draw item name, number, description
    if(type >= 0 && type <= 2) {
      this.contents.paintOpacity = 255;
      this.resetTextColor();
      if(value < 0){
        this.contents.paintOpacity = 160;
      }
      this.drawItemName(data, 6, 21, 300);
      this.drawText('\xd7', 306, 21, 24, 'center');
      this.drawText(String(Math.abs(value)), 330, 21, 32, 'right');
      this.resetTextColor();
      this.drawText(noteDescription(data), 384, 21, Graphics.boxWidth - 384,
        'left'
      );
    } else if (type === 3) {
      this.contents.paintOpacity = 255;
      this.resetTextColor();
      if(value < 0){
        this.contents.paintOpacity = 160;
      }
      this.drawIcon(iconMoney, 6, 21);
      const mainText = String(Math.abs(value)) + $dataSystem.currencyUnit;
      this.drawText(mainText, 44, 21, 180, 'right');
    }
    // draw guide string
    this.contents.paintOpacity = 160;
    this.contents.fontSize = 20;
    this.contents.fillRect(0, 0, this.textWidth(text) + 6, 22, '#000000');
    this.contents.paintOpacity = 255;
    this.resetTextColor();
    this.drawText(text, 6, -8, this.textWidth(text) + 12, 'left');
  };

  Window_GetInfo.prototype.playSE = function(type, value) {
    if (value <= 0) {   // play when gain, not play when lose.
      return;
    }
    switch(type) {
    case 0: // item
      if(seFilename) {
        var audio = {name:seFilename, volume:seVolume, pitch:sePitch};
        AudioManager.playSe(audio);
      }
      break;
    case 1: // weapon
      if(seWeaponFilename) {
        var audio = {name:seWeaponFilename, volume:seWeaponVolume,
         pitch:seWeaponPitch};
        AudioManager.playSe(audio);
      }
      break;
    case 2: // armor
      if(seArmorFilename) {
        var audio = {name:seArmorFilename, volume:seArmorVolume,
         pitch:seArmorPitch};
        AudioManager.playSe(audio);
      }
      break;
    case 3: // money
      if(seMoneyFilename) {
        var audio = {name:seMoneyFilename, volume:seMoneyVolume,
         pitch:seMoneyPitch};
        AudioManager.playSe(audio);
      }
      break;
    }
  };

  Window_GetInfo.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if(++this.count < wndDuration) {
      this.contentsOpacity += 32;
    } else {
      if(yPosType === 0){
        this.y -= 2;
      } else {
        this.y += 2;
      }
      this.contentsOpacity -= 32;
    }
  };

  Window_GetInfo.prototype.needsDispose = function() {
    return this.contentsOpacity === 0;
  };

  //
  // interpreter commands
  //

  // Change Gold
  const _Game_Interpreter_command125 = Game_Interpreter.prototype.command125;
  Game_Interpreter.prototype.command125 = function(params) {
    const value = this.operateValue(params[0], params[1], params[2]);
    if ($gameSwitches.value(dispSwitchID)) {
      addGetGoldWindow(value);
    } else {
      _Game_Interpreter_command125.call(this, params);
    }
    return true;
  };

  // Change Items
  const _Game_Interpreter_command126 = Game_Interpreter.prototype.command126;
  Game_Interpreter.prototype.command126 = function(params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    if ($gameSwitches.value(dispSwitchID)) {
      addGetItemWindow('item', params[0], value);
    } else {
      _Game_Interpreter_command126.call(this, params);
    }
    return true;
  };

  // Change Weapons
  const _Game_Interpreter_command127 = Game_Interpreter.prototype.command127;
  Game_Interpreter.prototype.command127 = function(params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    if ($gameSwitches.value(dispSwitchID)) {
      addGetItemWindow('weapon', params[0], value, params[4]);
    } else {
      _Game_Interpreter_command127.call(this, params);
    }
    return true;
  };

  // Change Armors
  const _Game_Interpreter_command128 = Game_Interpreter.prototype.command128;
  Game_Interpreter.prototype.command128 = function(params) {
    const value = this.operateValue(params[1], params[2], params[3]);
    if($gameSwitches.value(dispSwitchID)) {
      addGetItemWindow('armor', params[0], value, params[4]);
    } else {
      _Game_Interpreter_command128.call(this, params);
    }
    return true;
  };

})();
