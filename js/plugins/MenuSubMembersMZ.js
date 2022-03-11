//=============================================================================
// Plugin for RPG Maker MZ
// MenuSubMembersMZ.js
//=============================================================================
// [Update History]
// This plugin is the MZ version of MenuSubMember.js the MV plugin.
// 2020.Jul.07 Fix bug when members are change on battle.

/*:
 * @target MZ
 * @plugindesc Display sub members at menu window and map as followers
 * @author Sasuke KANNAZUKI
 *
 * @param subMemberIdVal1
 * @text Var ID for sub member 1
 * @desc Variable ID for actor ID of sub member 1.
 * @type variable
 * @default 1
 *
 * @param subMemberIdVal2
 * @text Var ID for sub member 2
 * @desc Variable ID for actor ID of sub member 2.
 * @type variable
 * @default 2
 *
 * @param subMemberIdVal3
 * @text Var ID for sub member 3
 * @desc Variable ID for actor ID of sub member 3.
 * @type variable
 * @default 3
 *
 * @param subMemberIdVal4
 * @text Var ID for sub member 4
 * @desc Variable ID for actor ID of sub member 4.
 * @type variable
 * @default 4
 *
 * @param subMemberText
 * @text Sub Members Text
 * @desc Text to display that means sub members.
 * @type string
 * @default Sub Members
 *
 * @param displayIfNone
 * @text Display if none?
 * @desc Does display window if no sub members?
 * @type boolean
 * @on Yes
 * @off No
 * @default false
 *
 * @param subMemberNoneText
 * @parent displayIfNone
 * @text Display text when none
 * @desc Text to display when party has no sub members.
 * @type string
 * @default None
 *
 * @param DisplayOnMap
 * @text Display on map?
 * @desc Does display sub members on map as followers?
 * @type boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param additionalFollower
 * @text Additional Follower
 * @desc The increase number of display actor as follower.
 * @type number
 * @min 0
 * @default 4
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MZ.
 *
 * This plugin enables to make sub members.
 * Sub member is an actor that neither to attend the battle
 * nor to display on actor window,
 * but display both on menu at sub member window and on map as follower.
 * 
 * [Summary]
 * The party can attend at most 4 sub members.
 * If the party don't set sub member(s), set 0 the variable ID.
 *
 * You can also increase the number of displaying actors as followers.
 * Set the option "Additional Follower". The default number is 4,
 * it means you can display 8 actors.
 * This setting is independent from the number of sub members.
 *
 * When number of party actors is more than displayable, some footer actors
 * are excluded from followers.
 * On another front, it displays all sub members always as followers.
 *
 * [Note]
 * This plugin is only for default menu.
 * It cannot use on menu that changed layout.(ex. AltMenuScreen.js).
 *
 * [License]
 * this plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */

/*:ja
 * @target MZ
 * @plugindesc メニュー画面と隊列の最後尾に同行者を表示します
 * @author 神無月サスケ
 *
 * @param subMemberIdVal1
 * @text 同行者1用変数ID
 * @desc 同行者1のアクターIDを指定する変数ID
 * @type variable
 * @default 1
 *
 * @param subMemberIdVal2
 * @text 同行者2用変数ID
 * @desc 同行者2のアクターIDを指定する変数ID
 * @type variable
 * @default 2
 *
 * @param subMemberIdVal3
 * @text 同行者3用変数ID
 * @desc 同行者3のアクターIDを指定する変数ID
 * @type variable
 * @default 3
 *
 * @param subMemberIdVal4
 * @text 同行者4用変数ID
 * @desc 同行者4のアクターIDを指定する変数ID
 * @type variable
 * @default 4
 *
 * @param subMemberText
 * @text 同行者の表示名
 * @desc 「同行者」の意味で表示するテキスト
 * @type string
 * @default 同行者
 *
 * @param displayIfNone
 * @text 同行者0の時表示？
 * @desc 同行者がいない場合でも、ウィンドウを表示するか
 * @type boolean
 * @on する
 * @off しない
 * @default false
 *
 * @param subMemberNoneText
 * @parent displayIfNone
 * @text 同行者0の時の表示文
 * @desc 同行者がいない時に表示するテキスト
 * @type string
 * @default なし
 *
 * @param DisplayOnMap
 * @text 隊列に表示？
 * @desc 隊列歩行の最後尾に同行者を表示するか
 * @type boolean
 * @on する
 * @off しない
 * @default true
 *
 * @param additionalFollower
 * @text 隊列追加人数
 * @desc 隊列に追加するアクターの人数
 * @type number
 * @min 0
 * @default 4
 *
 * @help このプラグインにプラグインコマンドはありません。
 * このプラグインは、RPGツクールMZに対応しています。
 *
 * このプラグインは、同行者を作成可能にします。
 * 同行者とは、戦闘に参加せず、メニューでもアクターとして表示されませんが、
 * メニューで同行者として表示され、隊列にも表示可能なアクターです。
 *
 * ■概要
 * 同行者は最大4人まで設定可能です。
 * 同行者を設定しない場合は、該当する変数の値を0にしてください。
 *
 * 同行者ではなくアクターの表示人数を増やしたい場合、オプションの隊列追加人数を
 * 設定してください。デフォルト値は4で、この場合8人までアクターが表示されます。
 * この設定は同行者とは独立しています。
 *
 * アクターが表示可能人数を超えた場合、末尾のアクターは表示されません。
 * 一方、同行者は、常に全員が表示されます。
 *
 * ■注意
 * このプラグインはデフォルトのメニュー画面専用です。
 * プラグイン(AltMenuScreen.jsなど)でレイアウトを変更したケースでは使えません。
 *
 * ■ライセンス表記
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(() => {
  const pluginName = 'MenuSubMembersMZ';
  //
  // process parameters
  //
  const parameters = PluginManager.parameters(pluginName);
  const submemberVar1 = Number(parameters['subMemberIdVal1'] || 1);
  const submemberVar2 = Number(parameters['subMemberIdVal2'] || 2);
  const submemberVar3 = Number(parameters['subMemberIdVal3'] || 3);
  const submemberVar4 = Number(parameters['subMemberIdVal4'] || 4);
  const subMemberText = parameters['subMemberText'] || 'Sub Members';
  const subMemberNoneText = parameters['subMemberNoneText'] || 'None';
  let displayIfNone = String(parameters['displayIfNone'] || 'false');
  displayIfNone = eval(displayIfNone);
  let DisplayOnMap = String(parameters['DisplayOnMap'] || 'true');
  DisplayOnMap = eval(DisplayOnMap);
  const additionalFollower = Number(parameters['additionalFollower'] || 4);

  //
  // process ex-parameters
  //
  const maxSubMember = 4;

  // ----------------------------------------------------------------------
  // add window to menu scene
  //
  const _Scene_Menu_create = Scene_Menu.prototype.create;
  Scene_Menu.prototype.create = function() {
    _Scene_Menu_create.call(this);
    this.createSubMemberWindow();
  };

  Scene_Menu.prototype.createSubMemberWindow = function() {
    this._subMemberWindow = new Window_SubMember(this.subMemberWindowRect());
    this.addWindow(this._subMemberWindow);
  };

  Scene_Menu.prototype.subMemberWindowRect = function() {
    const x = this._commandWindow.x;
    const width = this._commandWindow.width;
    const height = this.calcWindowHeight(5, false);
    const y = Graphics.boxHeight - this._goldWindow.height - height;
    return new Rectangle(x, y, width, height);
  }

  const _Scene_Menu_start = Scene_Menu.prototype.start;
  Scene_Menu.prototype.start = function() {
    _Scene_Menu_start.call(this);
    this.refreshSubMemberWindow();
  };

  Scene_Menu.prototype.refreshSubMemberWindow = function () {
    const numLines = this._subMemberWindow.refresh();
    if (numLines > 0) {
      this._subMemberWindow.height = this.calcWindowHeight(numLines, false);
      this._subMemberWindow.y = Graphics.boxHeight - this._goldWindow.height -
        this._subMemberWindow.height;
      this._commandWindow.height -= this._subMemberWindow.height;
    }
  };

  //
  // sub member window
  //
  function Window_SubMember() {
    this.initialize(...arguments);
  }

  Window_SubMember.prototype = Object.create(Window_StatusBase.prototype);
  Window_SubMember.prototype.constructor = Window_SubMember;

  Window_SubMember.prototype.initialize = function(rect) {
    Window_StatusBase.prototype.initialize.call(this, rect);
  };

  Window_SubMember.prototype.setSubMember = function() {
    this.subMember = [$gameActors.actor($gameVariables.value(submemberVar1)),
      $gameActors.actor($gameVariables.value(submemberVar2)),
      $gameActors.actor($gameVariables.value(submemberVar3)),
      $gameActors.actor($gameVariables.value(submemberVar4))
    ];
  };

  Window_SubMember.prototype.refresh = function() {
    this.setSubMember();
    const width = this.width - 80;
    const lineHeight = this.lineHeight();
    this.drawSubMemberText(width);
    let isVisible = true;
    let numLines = 1;
    let y = lineHeight;
    let subMember;
    for (let i = 0; i < maxSubMember; i++) {
      if (!!(subMember = this.subMember[i])) {
        this.drawActorName(subMember, 44, y, width);
        this.drawActorCharacter(subMember, 24, y + 40);
        y += lineHeight;
        numLines++;
      }
    }
    if (y === lineHeight) {
      this.drawNoSubMemberText(y, width);
      numLines++;
      if(!displayIfNone){
        isVisible = false;
      }
    }
    this.visible = isVisible;
    return isVisible ? numLines : 0;
  };

  Window_SubMember.prototype.drawSubMemberText = function(width) {
    this.changeTextColor(ColorManager.systemColor());
    this.drawText(subMemberText, this.itemPadding(), 0, width);
    this.resetTextColor();
  };

  Window_SubMember.prototype.drawNoSubMemberText = function(y, width) {
    this.drawText(subMemberNoneText, this.itemPadding(), y, width);
  };

  // ----------------------------------------------------------------------
  // display sub members as followers
  //
  const subMemberVarList = [submemberVar1, submemberVar2, submemberVar3,
    submemberVar4
  ];
  let subMembers = [];

  //
  // sub members definition
  //
  const _Game_Followers_initialize = Game_Followers.prototype.initialize;
  Game_Followers.prototype.initialize = function() {
    _Game_Followers_initialize.call(this);
    this.createAdditionalFollowers();
    this.createSubMembers();
  };

  Game_Followers.prototype.createAdditionalFollowers = function () {
    for (let i = 0; i < additionalFollower; i++) {
      this._data.push(new Game_Follower($gameParty.maxBattleMembers() + i));
    }
  };

  Game_Followers.prototype.createSubMembers = function () {
    for (let i = 0; i < maxSubMember ; i++) {
      const follower = new Game_Follower(this._data.length + 1);
      this._data.push(follower);
      subMembers.push(follower);
    }
  };

  //
  // at each loading, recreate followers.
  //
  const _DataManager_loadGame = DataManager.loadGame;
  DataManager.loadGame = function(savefileId) {
    var isSuccess = _DataManager_loadGame.call(this, savefileId)
    if (isSuccess) {
      $gamePlayer._followers.recreateFollowers();
    }
    return isSuccess;
  };

  Game_Followers.prototype.recreateFollowers = function () {
    this._data = [];
    for (let i = 1; i < $gameParty.maxBattleMembers(); i++) {
      this._data.push(new Game_Follower(i));
    }
    this.createAdditionalFollowers();
    this.createSubMembers();
  };

  //
  // sub members display (Game_Follower)
  //
  const parameterToSubMemberActor = function (index) {
    const varId = subMemberVarList[index];
    if (varId > 0) {
      const subMemberID = $gameVariables.value(varId);
      if (subMemberID > 0) {
        return $gameActors.actor(subMemberID);
      }
    }
    return null;
  };

  // skip subMember whose actorId is 0.
  const subMemberPosition = function (index) {
    for (let newIndex = 0, i = 0; i < maxSubMember; i++) {
      const actor = parameterToSubMemberActor(i);
      if (actor) {
        if (newIndex++ === index) {
          return actor;
        }
      } else {
        continue;
      }
    }
    return null;
  };

  //
  // change subPlayer display when specified variable changes
  //
  const _Game_Variables_setValue = Game_Variables.prototype.setValue;
  Game_Variables.prototype.setValue = function(variableId, value) {
    _Game_Variables_setValue.call(this, variableId, value);
    if (DisplayOnMap) {
      if (subMemberVarList.includes(variableId)) {
        $gameTemp.needFollowerRefresh = true;
      }
    }
  };

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    if ($gameTemp.needFollowerRefresh) {
      $gamePlayer._followers.refresh();
      $gameTemp.needFollowerRefresh = false;
    }
    _Scene_Map_update.call(this);
  };

  //
  // sub members display (Spriteset_Map)
  //
  const _Spriteset_Map_createCharacters =
    Spriteset_Map.prototype.createCharacters;
  Spriteset_Map.prototype.createCharacters = function() {
    _Spriteset_Map_createCharacters.call(this);
    for (let i = 0; i < maxSubMember; i++) {
      const newCharacterSprite = new Sprite_Character(subMembers[i]);
      this._characterSprites.push(newCharacterSprite);
      this._tilemap.addChild(newCharacterSprite);
    }
  };

  // ----------------------------------------------------------------------
  // added features Ver.1.2 of MenuSubMember
  //
  // 

  const followerMaxSize = () => {
    return $gameParty.maxBattleMembers() - 1 + additionalFollower;
  };

  const hasHeader = () => {
    return false;
  };

  const hasFooter = () => {
    return false;
  };

  const numDispActor = () => {
    const actorFollowerNum = $gameParty.allMembers().length - 1;
    const ceil = followerMaxSize();
    return actorFollowerNum.clamp(0, ceil);
  };

  const numSubMembers = () => {
    let num = 0;
    if (DisplayOnMap) {
      for (let i = 0; i < 4; i++) {
        if (subMemberPosition(i)) {
          num++;
        }
      }
    }
    return num;
  };

  //
  // find followers' character
  //
  // (!!!overwrite!!!)
  Game_Follower.prototype.actor = function() {
    let lastId = 0;
    const headerNum = hasHeader() ? 1 : 0;
    // footer
    if (hasFooter() &&
      this._memberIndex === Math.min(followerMaxSize(),
      numDispActor() + numSubMembers() + 1)
    ) {
      return $gameActors.actor($gamePlayer.footerFollower());
    }
    // normal followers.
    if (this._memberIndex <= (lastId = numDispActor())) {
      return $gameParty.allMembers()[this._memberIndex - headerNum];
    }
    // menu sub member
    if (DisplayOnMap && this._memberIndex <= (lastId += numSubMembers())) {
      return subMemberPosition(this._memberIndex +
        numSubMembers() - lastId - 1
      );
    }
    return null;
  };

})();
