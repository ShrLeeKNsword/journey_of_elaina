//=============================================================================
// Plugin for RPG Maker MZ
// ItemCombineScene.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Make new menu scene that combine items to make reinforced item
 * @author Sasuke KANNAZUKI
 *
 * @param isDebugMode
 * @text Is debug mode?
 * @desc When select yes, it outputs recipe list on console at boot the game. Set off at release.
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
 * @param commandName
 * @text Menu Command Name
 * @desc At menu scene, menu adds new command that call combine system. Set its name.
 * @type string
 * @default Reinforce Item
 *
 * @param playType
 * @text Play Type at Success
 * @desc When combine successes, play SE? ME? or none?
 * @type select
 * @option SE
 * @option ME
 * @option Not play anything
 * @value none
 * @default ME
 *
 * @param seName
 * @parent playType
 * @text SE at Success
 * @desc SE that plays when combine success. When it supposed to play ME or none, it ignores this setting.
 * @default Chime2
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param meName
 * @parent playType
 * @text ME at Success
 * @desc ME that plays when combine success. When it supposed to play SE or none, it ignores this setting.
 * @default Item
 * @require 1
 * @dir audio/me/
 * @type file
 *
 * @param dummy4text
 * @text [Text Settings]
 * @desc
 *
 * @param textBefore
 * @parent dummy4text
 * @text Before:
 * @desc the string that means item BEFORE combine
 * (Default: Before:)
 * @type string
 * @default Before:
 *
 * @param textAfter
 * @parent dummy4text
 * @text After:
 * @desc the string that means item AFTER combine
 * (Default: After:)
 * @type string
 * @default After:
 *
 * @param textCombineYes
 * @parent dummy4text
 * @text Yes to Combine
 * @desc the string that the answer of 'Are you sure to Combine?' is 'Yes'.
 * @type string
 * @default Yes
 *
 * @param textCombineNo
 * @parent dummy4text
 * @text No to Combine
 * @desc the string that the answer of 'Are you sure to Combine?' is 'No'.
 * @type string
 * @default No
 *
 * @param textSelectMaterial
 * @parent dummy4text
 * @text Select Material
 * @desc the string that means 'select the material'
 * @type string
 * @default Select the material.
 *
 * @param textSelectFromCandidate
 * @text Select Item to Reinforce
 * @parent dummy4text
 * @desc the string that means 'select the item to reinforce.'
 * @type string
 * @default Select the item to reinforce.
 *
 * @param textSureToCombineEquipped
 * @text Sure to Combine Equipped
 * @parent dummy4text
 * @desc the string that means "Are you sure to combine %1's equip?". It replaces %1 to actor's name
 * @type string
 * @default Are you sure to combine %1's equip?
 *
 * @param textSureToCombineNormal
 * @text Sure to Combine Normal Item
 * @parent dummy4text
 * @desc the string that means "Are you sure to combine them?"
 * @type string
 * @default Are you sure to combine them?
 *
 * @help
 * This plugin runs under RPG Maker MZ.
 * This plugin enables to make item combine system.
 *
 * This plugin's system is to reinforce item(including equip)
 * by material item.
 *
 * [Summary]
 * This plugin adds the new command to menu command window.
 * The command calls item reinforce system by combining items.
 *
 * [Note Setting]
 * Write down to item(including equip)'s note as follows to set the item
 * 'material item'(Ex. 'Stone of xxxx').
 * <Material:xxxx>
 * Replace xxxx to unique string. For example, SolarStone, MoonStone,
 * and so on.
 * This string will be the key of the note in item to reinforce.
 *
 * ex:
 * <Material:SolarStone>
 * <Material:MoonStone>
 *
 * Write down to the note of candidate items(including equips) to reinforce.
 * <xxxx:20>
 * <xxxx:1,15>
 * Replace xxxx to the string that set to the material item's value such as
 * SolarStone, MoonStone, and so on.
 * When the value is number such as 20, the item will will be reinforced to
 * id is 20 of the same category(item, weapon, armor).
 * If you need to set reinforced item different category, write such
 * as <xxxx:1,15>.
 * In this case, the item will be reinforced to weapon's ID15.
 * (0=item, 1=weapon, 2=armor)
 *
 * ex:
 * <SolarStone:20>
 * <MoonStone:1,15>
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc メニューから呼び出し可能なアイテム合成シーンの作成
 * @author 神無月サスケ
 *
 * @param isDebugMode
 * @text デバッグモード？
 * @desc Yes を選ぶと起動時にコンソールに合成法一覧を表示。リリースの時はNoに。
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
 * @param commandName
 * @text メニューコマンド名
 * @desc アイテム合成システムをメニューコマンドから呼び出す際の
 * コマンド名
 * @type string
 * @default アイテム強化
 *
 * @param playType
 * @text 成功時演奏タイプ
 * @desc 合成成功時にSE,MEのどちらを演奏するか
 * あるいは何も演奏しないか
 * @type select
 * @option SE
 * @option ME
 * @option なし
 * @value none
 * @default ME
 *
 * @param seName
 * @parent playType
 * @text 成功時SE
 * @desc 合成成功時に演奏するSE名です。MEを演奏するか、
 * 何も演奏しない場合、この設定は無視されます。
 * @default Chime2
 * @require 1
 * @dir audio/se/
 * @type file
 *
 * @param meName
 * @parent playType
 * @text 成功時ME
 * @desc 合成成功時に演奏するME名です。SEを演奏するか、
 * 何も演奏しない場合、この設定は無視されます。
 * @default Item
 * @require 1
 * @dir audio/me/
 * @type file
 *
 * @param dummy4text
 * @text [文字列設定]
 * @desc
 *
 * @param textBefore
 * @parent dummy4text
 * @text 合成前：
 * @desc 「合成前：」を意味するテキスト
 * @type string
 * @default 合成前：
 *
 * @param textAfter
 * @parent dummy4text
 * @text 合成後：
 * @desc 「合成後：」を意味するテキスト
 * @type string
 * @default 合成後：
 *
 * @param textCombineYes
 * @parent dummy4text
 * @text 合成する
 * @desc 「合成しますか？」に「はい」と答えるテキスト
 * @type string
 * @default 合成する
 *
 * @param textCombineNo
 * @parent dummy4text
 * @text 合成しない
 * @desc 「合成しますか？」に「いいえ」と答えるテキスト
 * @type string
 * @default 合成しない
 *
 * @param textSelectMaterial
 * @parent dummy4text
 * @text 合成素材選択
 * @desc 「合成素材を選んでください」を意味するテキスト
 * @type string
 * @default 合成素材を選んでください。
 *
 * @param textSelectFromCandidate
 * @text 強化用アイテム選択
 * @parent dummy4text
 * @desc 「強化するアイテムを選んでください」を意味するテキスト
 * @type string
 * @default 強化するアイテムを選んでください。
 *
 * @param textSureToCombineEquipped
 * @text 装備品合成確認
 * @parent dummy4text
 * @desc 「%1が装備中です。装備したまま合成しますか？」を意味するテキスト。%1がアクター名に置き換えられます。
 * @type string
 * @default %1が装備中です。装備したまま合成しますか？
 *
 * @param textSureToCombineNormal
 * @text 通常アイテム合成確認
 * @parent dummy4text
 * @desc 「このアイテムを合成しますか？」を意味するテキスト
 * @type string
 * @default このアイテムを合成しますか？
 *
 * @help
 * このプラグインは、RPGツクールMZに対応しています。
 * このプラグインは、アイテム合成システムを作成します。
 *
 * ■概要
 * このプラグインを導入するとメニューに新しいコマンドが追加されます。
 * （名前はオプションで指定したものになります）
 * そのコマンドを選択するとアイテム合成画面が表示されます。
 *
 * このプラグインでの合成は、合成素材に指定されたアイテム
 * （武器、防具でも可）によって、アイテムや装備を強化する、
 * といったスタイルを取ります。
 *
 * ■メモの設定方法
 * 合成素材となるアイテム（例：○○の石）を設定する場合、
 * アイテムまたは装備のメモ欄に、以下のように書いてください。
 * <Material:xxxx>
 * xxxx は文字列です。アイテムに応じて、SolarStone, MoonStoneなど、
 * 一意のアイテム名にしてください。
 * これが、強化候補アイテムのメモのキーとなります。
 *
 * 例：
 * <Material:SolarStone>
 * <Material:MoonStone>
 *
 * 強化候補アイテムには、以下のようにメモで書いてください。
 * <xxxx:20>
 * <xxxx:1,15>
 * ここで、xxxxを、SolarStone, MoonStoneなど、
 * 合成素材の値として指定した文字列に置き換えてください。
 * 20など、数値を入れた場合、同じカテゴリ（アイテム、装備）の
 * 該当するIDのアイテムに強化されます。
 * 異なるカテゴリにしたい場合は、<xxxx:1,15> のように書くと、
 * 武器のID15番になります。(0=アイテム, 1=武器, 2=防具)
 *
 * 例：
 * <SolarStone:20>
 * <MoonStone:1,15>
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'ItemCombineScene';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const isDebugMode = eval(parameters['isDebugMode'] || 'false');
  const commandName = parameters['commandName'] || 'Reinforce Item';
  const playType = parameters['playType'] || 'ME';
  const seName = parameters['seName'] || 'Chime2';
  const meName = parameters['meName'] || 'Item';
  const textBefore = parameters['textBefore'] || '';
  const textAfter = parameters['textAfter'] || '';
  const textCombineYes = parameters['textCombineYes'] || '';
  const textCombineNo = parameters['textCombineNo'] || '';
  const textSelectMaterial = parameters['textSelectMaterial'] || '';
  const textSelectFromCandidate = parameters['textSelectFromCandidate'] || '';
  const textSureToCombineEquipped = parameters['textSureToCombineEquipped'] ||
    '';
  const textSureToCombineNormal = parameters['textSureToCombineNormal'] || '';

  // ------------------------------------------------------------
  // utility functions
  // ------------------------------------------------------------

  //
  // for efficiency, item type and id is converted to single number.
  //

  // type: 0=item, 1=weapon, 2=armor
  const itemToNum = (type, id) => (type << 12) + id;
  const typeOfNum = n => n >> 12;
  const idOfNum = n => n & 0xfff;
  const numToItem = n => typeAndIdToItem(typeOfNum(n), idOfNum(n));
  const typeAndIdToItem = (type, id) => {
    switch (type) {
    case 0: return $dataItems[id];
    case 1: return $dataWeapons[id];
    case 2: return $dataArmors[id];
    default: return null;
    }
  };
  const typeOfItem = item => {
    if (DataManager.isItem(item)) { return 0;
    } else if (DataManager.isWeapon(item)) { return 1;
    } else if (DataManager.isArmor(item)) { return 2;
    } else { return null; }
  };

  //
  // functions to deal with note description
  //
  const metaReg = /([0-2]\,)?([0-9]+)/;
  const metaToItem = (type, valueStr) => {
    const r = metaReg.exec(valueStr);
    if (!r) { return null; }
    if (r[1]) { type = +r[1][0]; }
    return typeAndIdToItem(type, +r[2]);
  };

  //
  // important functions when combine items.
  //
  const posessor = item => {
    if (!item) { return -1; }
    if ($gameParty.numItems(item) > 0) { return 0; }
    const actor = $gameParty.members().find(a => a.equips().includes(item));
    return actor ? actor.actorId() : -1;
  };
  const execCombine = (materialNum, candidateNum) => {
    const material = numToItem(materialNum);
    const candidate = numToItem(candidateNum);
    if (!material || !candidate) { return null; }
    const result = metaToItem(typeOfNum(candidateNum),
      candidate.meta[material.meta.Material]
    );
    if (!result) { return null; }
    $gameParty.loseItem(material, 1, true);
    $gameParty.loseItem(candidate, 1, true);
    $gameParty.gainItem(result, 1);
    return result;
  };

  // ------------------------------------------------------------
  // for efficiency, process the note at first.
  // ------------------------------------------------------------

  let materials, candidates;

  const _Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    _Scene_Boot_start.call(this);
    processMaterialItems();
    debugOutput();
  };

  const processMaterialItems = () => {
    parseMaterialNames();
    parseCombineCandidates();
  };

  // materials = {material item => material type string(e.g. SolarStone)}
  parseMaterialNames = function () {
    materials = {};
    parseForMaterial($dataItems, 0);
    parseForMaterial($dataWeapons, 1);
    parseForMaterial($dataArmors, 2);
  };

  const parseForMaterial = (dataArray, typeId) => {
    let item;
    for (let id = 1; id < dataArray.length; id++) {  
      if ((item = dataArray[id]) && item.meta.Material) {
        materials[itemToNum(typeId, id)] = item.meta.Material;
      }
    }
  };

  // candidates = {material item => array of candidate items to combine}
  const parseCombineCandidates = () => {
    candidates = {};
    for (const materialItem of Object.keys(materials)) {
      parseForCandidates(materialItem, $dataItems, 0);
      parseForCandidates(materialItem, $dataWeapons, 1);
      parseForCandidates(materialItem, $dataArmors, 2);
    }
  };

  const parseForCandidates = (materialItem, dataArray, typeId) => {
    let name = materials[materialItem];
    let objItem;
    if (!candidates[materialItem]) {
      candidates[materialItem] = [];
    }
    for(let id = 1; id < dataArray.length; id++) {
      if((objItem = dataArray[id]) && objItem.meta[name]) {
        candidates[materialItem].push(itemToNum(typeId, id));
      }
    }
  };

  //
  // accessors to the inner data.
  //
  Game_System.prototype.materials = function() {
    return materials;
  };

  Game_System.prototype.candidates = function() {
    return candidates;
  };

  // 
  // for debug to see the list and number of usage of each stone
  // 
  const debugOutput = () => {
    if (!isDebugMode) {
      return;
    }
    let materialItem, objItem, combineItem, number;
    for (const materialItemId of Object.keys(materials)) {
      number = 0;
      materialItem = numToItem(materialItemId);
      console.log(materialItem ? materialItem.name + '：' : 'invalid!');
      if (!materialItem) {
        continue;
      }
      for (const objItemId of candidates[materialItemId]) {
        objItem = numToItem(objItemId);
        if (objItem) {
          combineItem = metaToItem(typeOfNum(objItemId),
            objItem.meta[materialItem.meta.Material]
          );
          if (combineItem) {
            number++;
            console.log(number + ' ' + objItem.name + '→' + combineItem.name);
          } else {
            console.log('  ' + objItem.name + '→ combined item is invalid!!');
          }
        } else {
          console.log('invalid item!');
        }
      }
    }
  };

  // ------------------------------------------------------------
  // define scene
  // ------------------------------------------------------------

  function Scene_ItemCombine() {
    this.initialize(...arguments);
  }

  Scene_ItemCombine.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_ItemCombine.prototype.constructor = Scene_ItemCombine;

  Scene_ItemCombine.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this.phase = 'material';
  };

  Scene_ItemCombine.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createMaterialWindow();
    this.createRecipeWindow();
    this.createCandidateWindow();
    this.createYesOrNoWindow();
    this.createNavigationWindow();
  };

  Scene_ItemCombine.prototype.helpAreaHeight = function() {
    return 0;
  };

  Scene_ItemCombine.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    this._navigationWindow.setPhase(this.phase,
      this._candidateWindow.itemNum()
    );
  };

  //
  // create navigation window
  //
  Scene_ItemCombine.prototype.createNavigationWindow = function() {
    const rect = this.navigationWindowRect();
    this._navigationWindow = new Window_Navigation(rect);
    this.addWindow(this._navigationWindow);
  };

  Scene_ItemCombine.prototype.navigationWindowRect = function() {
    const wx = 0;
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(1, false);
    const wy = this.mainAreaTop();
    return new Rectangle(wx, wy, ww, wh);
  };

  //
  // create material window
  //
  Scene_ItemCombine.prototype.createMaterialWindow = function() {
    const rect = this.materialWindowRect();
    this._materialWindow = new Window_MaterialItem(rect);
    this.addWindow(this._materialWindow);
    this._materialWindow.refresh();
    this._materialWindow.setHandler("cancel", this.popScene.bind(this));
    this._materialWindow.activate();

  };

  Scene_ItemCombine.prototype.materialWindowRect = function() {
    const wx = 0;
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(2, true);
    const wy = this.mainAreaTop() + this.calcWindowHeight(1, false);
    return new Rectangle(wx, wy, ww, wh);
  };

  //
  // create candidate window
  //
  Scene_ItemCombine.prototype.createCandidateWindow = function() {
    const rect = this.candidateWindowRect();
    this._candidateWindow = new Window_Candidate(rect, this._materialWindow);
    this._candidateWindow.setRecipeWindow(this._recipeWindow);
    this._materialWindow.setHandler("ok", this.onMaterialOk.bind(this));
    this._candidateWindow.setHandler("ok", this.onCandidateOK.bind(this));
    this._candidateWindow.setHandler("cancel",
      this.onCandidateCancel.bind(this)
    );
    this.addWindow(this._candidateWindow);
  };

  Scene_ItemCombine.prototype.candidateWindowRect = function() {
    const wx = 0;
    const ww = Graphics.boxWidth;
    const wy = this._materialWindow.y + this._materialWindow.height;
    const wh = this._recipeWindow.y - wy;
    return new Rectangle(wx, wy, ww, wh);
  };

  Scene_ItemCombine.prototype.onMaterialOk = function() {
    this.phase = 'candidate';
    this._materialWindow.deactivate();
    this._candidateWindow.activate();
    this._candidateWindow.selectLast();
  };

  Scene_ItemCombine.prototype.onCandidateCancel = function() {
    this.phase = 'material';
    this._candidateWindow.deselect();
    this._candidateWindow.deactivate();
    this._materialWindow.activate();
    this._recipeWindow.clear();
  };

  Scene_ItemCombine.prototype.onCandidateOK = function() {
    this.phase = 'determine';
    this._candidateWindow.deactivate();
    this._yesNoWindow.select(1);
    this._yesNoWindow.activate();
    this._yesNoWindow.show();
  };

  //
  // create recipe window
  //
  Scene_ItemCombine.prototype.createRecipeWindow = function() {
    const rect = this.recipeWindowRect();
    this._recipeWindow = new Window_Recipe(rect);
    this.addWindow(this._recipeWindow);
  };

  Scene_ItemCombine.prototype.recipeWindowRect = function() {
    const wx = 0;
    const ww = Graphics.boxWidth;
    const wh = this.calcWindowHeight(6, false);
    const wy = this.mainAreaBottom() - wh;
    return new Rectangle(wx, wy, ww, wh);
  };

  //
  // create yes or no window
  //
  Scene_ItemCombine.prototype.createYesOrNoWindow = function() {
    const rect = this.materialWindowRect();
    this._yesNoWindow = new Window_CombineYesOrNo(rect);
    this._yesNoWindow.setHandler("ok", this.onYesOrNoOk.bind(this));
    this._yesNoWindow.setHandler("cancel", this.onYesOrNoCancel.bind(this));
    this.addWindow(this._yesNoWindow);
  };

  Scene_ItemCombine.prototype.onYesOrNoOk = function () {
    const materialNum = this._materialWindow.itemNum();
    const candidateNum = this._candidateWindow.itemNum();
    const posessorId = posessor(numToItem(candidateNum));
    const resultItem = execCombine(materialNum, candidateNum);
    if (posessorId > 0) {
      changeEquip(posessorId, resultItem);
    }
    playCombineSuccessSe();
    this.processAllWindows();
    this.phase = 'material';
  };

  Scene_ItemCombine.prototype.processAllWindows = function() {
    this._materialWindow.refresh();
    this._candidateWindow._catEnabled =
      this._materialWindow.isCurrentItemEnabled();
    this._candidateWindow.deselect();
    this._candidateWindow.refresh();
    this._recipeWindow.clear();
    this._yesNoWindow.deactivate();
    this._yesNoWindow.hide();
    this._materialWindow.activate();
  };

  const changeEquip = (actorId, item) => {
    const actor = $gameActors.actor(actorId);
    if (actor && item && item.etypeId) {
      actor.changeEquip(item.etypeId - 1, item);
    }
  };

  const playCombineSuccessSe = () => {
    switch (playType) {
    case 'SE':
      AudioManager.playStaticSe({name:seName, pitch:100, volume:90});
      break;
    case 'ME':
      AudioManager.playMe({name:meName, pitch:100, volume:90});
      break;
    default:
      SoundManager.playOk();
    }    
  };

  Scene_ItemCombine.prototype.onYesOrNoCancel = function () {
    this._yesNoWindow.deactivate();
    this._yesNoWindow.hide();
    this._candidateWindow.activate();
    SoundManager.playCancel();
    this.phase = 'candidate';
  };

  //
  // call from main menu
  //
  const _Window_MenuCommand_addMainCommands =
   Window_MenuCommand.prototype.addMainCommands;
  Window_MenuCommand.prototype.addMainCommands = function() {
    _Window_MenuCommand_addMainCommands.call(this);
    this.addCommand(commandName, "combine");
  };

  const _Scene_Menu_createCommandWindow = 
   Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler("combine", this.commandCombine.bind(this));
  };

  Scene_Menu.prototype.commandCombine = function() {
    SceneManager.push(Scene_ItemCombine);
  };

  //-------------------------------------------------------------------------
  // Window_CombineYesOrNo
  //
  // The window to display navigation in one line
   function Window_Navigation() {
    this.initialize(...arguments);
  }

  Window_Navigation.prototype = Object.create(Window_Base.prototype);
  Window_Navigation.prototype.constructor = Window_Navigation;

  Window_Navigation.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._phase = 'none';
    this.refresh();
  };

  Window_Navigation.prototype.setPhase = function(phase, itemNum) {
    if (this._phase !== phase) {
      this._phase = phase;
      this._itemNum = itemNum;
      this.refresh();
    }
  };

  Window_Navigation.prototype.refresh = function() {
    this.contents.clear();
    let text = '';
    switch(this._phase) {
    case 'material':
      text = textSelectMaterial;
      break;
    case 'candidate':
      text = textSelectFromCandidate;
      break;
    case 'determine':
      const actorId = posessor(numToItem(this._itemNum));
      if (actorId) {
        const name = $gameActors.actor(actorId).actor().name;
        text = textSureToCombineEquipped.format(name);
      } else {
        text = textSureToCombineNormal;
      }
      break;
    }
    if (text) {
      this.changeTextColor(ColorManager.systemColor());
      let rect = this.baseTextRect();
      this.drawText(text, rect.x, rect.y, rect.width);
    }
  };

  //-------------------------------------------------------------------------
  // Window_CombineYesOrNo
  //
  // The window to determine to execute combine or not.
  function Window_CombineYesOrNo() {
    this.initialize(...arguments);
  }

  Window_CombineYesOrNo.prototype = Object.create(Window_Command.prototype);
  Window_CombineYesOrNo.prototype.constructor = Window_CombineYesOrNo;

  Window_CombineYesOrNo.prototype.initialize = function(rect) {
    Window_Command.prototype.initialize.call(this, rect);
    this.deactivate();
    this.select(1);
    this.hide();
  };

  Window_CombineYesOrNo.prototype.makeCommandList = function() {
    this.addCommand(textCombineYes, "ok");
    this.addCommand(textCombineNo, "cancel");
  };

  Window_CombineYesOrNo.prototype.playOkSound = function() {
    //
  };


  //-------------------------------------------------------------------------
  // Window_Candidate
  //
  // The window for selecting item to combine with material.

  function Window_Candidate() {
    this.initialize(...arguments);
  }

  Window_Candidate.prototype = Object.create(Window_ItemList.prototype);
  Window_Candidate.prototype.constructor = Window_Candidate;

  Window_Candidate.prototype.initialize = function(rect, materialWindow) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._materialWindow = materialWindow;
    const category = materialWindow.itemNum() || null;
    this._catEnabled = materialWindow.isCurrentItemEnabled();
    this.setCategory(category);
  };

  Window_Candidate.prototype.setRecipeWindow = function(recipeWindow) {
    this._recipeWindow = recipeWindow;
  };

  Window_Candidate.prototype.includes = function(item) {
    const itemNum = itemToNum(typeOfItem(item), item.id);
    return $gameParty.hasItem(item, true) &&
      Object.keys(candidates[this._category]).includes(
      itemToNum(typeOfItem(item), item.id)
    );
  };

  Window_Candidate.prototype.needsNumber = function() {
    return false;
  };

  Window_Candidate.prototype.isEnabled = function(item) {
    return this._catEnabled && item;
  };

  Window_Candidate.prototype.makeItemList = function() {
    this._data = [];
    this._itemNum = [];
    let candidateItem;
    for (const candidateId of candidates[this._category]) {
      candidateItem = numToItem(candidateId);
      if ($gameParty.hasItem(candidateItem, true)) {
        this._data.push(candidateItem);
        this._itemNum.push(candidateId);
      }
    }
    if (this._data.length === 0) {
      this._data.push(null);
    }
  };

  Window_Candidate.prototype.itemNum = function() {
    return this._index >= 0 ? this._itemNum[this._index] : null;
  };

  Window_Candidate.prototype.updateHelp = function() {
    // do nothing
  };

  Window_Candidate.prototype.update = function() {
    Window_ItemList.prototype.update.call(this);
    const category = this._materialWindow.itemNum() || null;
    this._catEnabled = this._materialWindow.isCurrentItemEnabled();
    this.setCategory(category);
    this._recipeWindow.setItem(this.itemNum(), this._category);
  };

  //-------------------------------------------------------------------------
  // Window_MaterialItem
  //
  // The window for selecting an material item on the item combining screen.

  function Window_MaterialItem() {
    this.initialize(...arguments);
  }

  Window_MaterialItem.prototype = Object.create(Window_ItemList.prototype);
  Window_MaterialItem.prototype.constructor = Window_MaterialItem;

  Window_MaterialItem.prototype.initialize = function(rect) {
    Window_ItemList.prototype.initialize.call(this, rect);
    this._index = 0;
  };

  Window_MaterialItem.prototype.isEnabled = function(item) {
    return $gameParty.hasItem(item);
  };

  Window_MaterialItem.prototype.includes = function(item) {
    return !item || !!item.meta.Material;
  };

  Window_MaterialItem.prototype.needsNumber = function() {
    return true;
  };

  Window_MaterialItem.prototype.makeItemList = function() {
    this._data = [];
    this._itemNum = [];
    let materialItem;
    for (const materialItemId of Object.keys(materials)) {
      materialItem = numToItem(materialItemId);
      if (materialItem) {
        this._data.push(materialItem);
        this._itemNum.push(materialItemId);
      }
    }
    if (this._data.length === 0) {
      this._data.push(null);
    }
  };

  Window_MaterialItem.prototype.itemNum = function() {
    return this._index >= 0 ? this._itemNum[this._index] : null;
  };

  Window_MaterialItem.prototype.updateHelp = function() {
    // nothing to do
  };

  //-------------------------------------------------------------------------
  // Window_Recipe
  //
  function Window_Recipe() {
    this.initialize(...arguments);
  }

  Window_Recipe.prototype = Object.create(Window_Base.prototype);
  Window_Recipe.prototype.constructor = Window_Recipe;

  Window_Recipe.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._itemNum = 0;
    this._category = null;
    this.refresh();
  };

  Window_Recipe.prototype.setItem = function(itemNum, category) {
    if (this._itemNum !== itemNum || this._category !== category) {
      this._itemNum = itemNum;
      this._category = category;
      this.refresh();
    }
  };

  Window_Recipe.prototype.clear = function() {
    this.setItem(0, null);
  };

  Window_Recipe.prototype.refresh = function() {
    this.contents.clear();
    let text, rect, rect2;
    if (this._itemNum && this._category) {
      // draw before change
      this.changeTextColor(ColorManager.systemColor());
      text = textBefore;
      rect = this.baseTextRect();
      this.drawText(text, rect.x, rect.y, rect.width);
      // draw item icon and name
      const baseItem = numToItem(this._itemNum);
      if (!baseItem) {
        return;
      }
      rect2 = this.baseTextRect();
      rect2.x += this.textWidth(text);
      rect2.width -= rect2.x;
      this.drawItemName(baseItem, rect2.x, rect2.y, rect2.width);
      // draw item description
      this.resetTextColor();
      rect = this.baseTextRect();
      rect.y += this.fittingHeight(0) + $gameSystem.windowPadding();
      this.drawTextEx(baseItem.description, rect.x, rect.y, rect.width);
      // draw after change
      this.changeTextColor(ColorManager.systemColor());
      text = textAfter;
      rect = this.baseTextRect();
      rect.y += this.fittingHeight(2) + $gameSystem.windowPadding();
      this.drawText(text, rect.x, rect.y, rect.width);
      // draw icon and name
      const categoryItem = numToItem(this._category);
      const combineItem = metaToItem(typeOfNum(this._itemNum),
        baseItem.meta[categoryItem.meta.Material]
      );
      if (!combineItem) {
        return;
      }
      rect2 = this.baseTextRect();
      rect2.x += this.textWidth(text);
      rect2.width -= rect2.x;
      rect2.y = rect.y;
      this.drawItemName(combineItem, rect2.x, rect2.y, rect2.width);
      // draw item description
      rect = this.baseTextRect();
      rect.y += this.fittingHeight(3) + $gameSystem.windowPadding();
      this.drawTextEx(combineItem.description, rect.x, rect.y, rect.width);
    }
  };

})();
