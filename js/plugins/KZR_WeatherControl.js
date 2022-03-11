//=============================================================================
// KZR_WeatherControl.js
// Version : 1.02
// -----------------------------------------------------------------------------
// [Homepage]: かざり - ホームページ名なんて飾りです。偉い人にはそれがわからんのですよ。 -
//             http://nyannyannyan.bake-neko.net/
// -----------------------------------------------------------------------------
// [Version]
// 1.02 2017/01/21 イベントのテストプレイ時、エラーが出るのを修正
// 1.01 2017/01/20 天候「吹雪」「下降する光」「上昇する光」を追加
//                 雪・吹雪のとき、雪の大きさをランダムに変化させることが可能に
// 1.00 2017/01/17 公開
//=============================================================================

/*:
 * @plugindesc 移动地图时天气会自动改变，即使在战斗中天气也会改变。 
 * @author ぶちょー
 *
 * @param SnowRandom
 * @desc 下雪或暴风雪时，大小随机变化。 
 * true / false
 * @default true
 *
 * @param InBattle
 * @desc 在战斗中改变天气。 
 * true / false
 * @default true
 *
 * @help
 * 【自动天气变化】
 * 请在地图的备注栏中填写以下内容。 
 * <AutoWeather:type,power>
 * type  : 天气（无：none, 雨：rain, 风暴：storm, 雪：snow, 暴风雪:blizzard,
 *              下降的光：downlight, 上升的光：uplight）
 * power : 强度
 * （例）<AutoWeather:rain,5> # 强度为5级的雨
 * （例）<AutoWeather:none>   # 无天气(不需要指定强度)
 *
 * 【天气变化】
 * 在插件命令中描述如下。
 * 更改天气类型的持续时间。
 * type  : 天气（无：none, 雨：rain, 风暴：storm, 雪：snow, 暴风雪:blizzard,
 *              下降的光：downlight, 上升的光：upligt）
 * power : 强度
 * duration : 时间（如果省略则为 60） 
 * wait : 等到完成（如果省略则为 false） 
 *（例）ChangeWeather blizzard 25 60 true # 强度为 25 的暴风雪 * 将暴风雪设置为更强。 
 *（例）ChangeWeather rain 5 # 强度为5级的雨
 */

 (function() {
   var parameters = PluginManager.parameters('KZR_WeatherControl');
   var WC_SnowRandom = eval(parameters['SnowRandom'] || 'true');
   var WC_InBattle   = eval(parameters['InBattle'] || 'true');

  //-----------------------------------------------------------------------------
  // Game_Map
  //
  var _kzr_WC_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
       _kzr_WC_Game_Map_setup.call(this, mapId);
       this.WC_AutoWeather();
  };

  Game_Map.prototype.WC_AutoWeather = function() {
      var notedata = (this._mapId > 0) ? $dataMap.note.split(/[\r\n]+/) : "";
      var note1 = /(?:AutoWeather:(\S+),(\d+))/i;
      var note2 = /(?:AutoWeather:none)/i;
      for (var i = 0; i < notedata.length; i++) {
          if (notedata[i].match(note1)) {
              $gameScreen.changeWeather(RegExp.$1, parseInt(RegExp.$2), 0);
          } else if (notedata[i].match(note2)) {
              $gameScreen.changeWeather('none', 0, 0);
          }
      }
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //
  var _kzr_WC_Game_Interpreter_command236 = Game_Interpreter.prototype.command236;
  Game_Interpreter.prototype.command236 = function() {
      _kzr_WC_Game_Interpreter_command236.call(this);
      if (WC_InBattle) {
          $gameScreen.changeWeather(this._params[0], this._params[1], this._params[2]);
          if (this._params[3]) {
              this.wait(this._params[2]);
          }
      }
      return true;
  };

  var _kzr_WC_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
      _kzr_WC_Game_Interpreter_pluginCommand.call(this, command, args);
      if (command === 'ChangeWeather') {
          var d = args[2] ? parseInt(args[2]) : 60;
          var w = args[3] ? args[3] : false;
          $gameScreen.changeWeather(args[0], parseInt(args[1]), d);
          if (w) this.wait(d);
      };
  };

  //-----------------------------------------------------------------------------
  // Weather
  //
  var _kzr_WC_Weather_createBitmaps = Weather.prototype._createBitmaps;
  Weather.prototype._createBitmaps = function() {
      _kzr_WC_Weather_createBitmaps.call(this);
      this._lightBitmap = new Bitmap(21, 21);
      this._lightBitmap.drawCircle(10, 10, 10, 'white')
  };

  var _kzr_WC_Weather_addSprite = Weather.prototype._addSprite;
  Weather.prototype._addSprite = function() {
      if (((this.type === 'blizzard' || this.type === 'snow') && WC_SnowRandom) ||
            this.type === 'uplight'  || this.type === 'downlight') {
          var sprite = new Sprite(this.viewport);
          scale = Math.random() * 0.5 + 0.5;
          sprite.scale._x = scale;
          sprite.scale._y = scale;
          sprite.opacity = 0;
          this._sprites.push(sprite);
          this.addChild(sprite);
      } else {
          _kzr_WC_Weather_addSprite.call(this);
      }
  };

  var _kzr_WC_Weather_updateSprite = Weather.prototype._updateSprite;
  Weather.prototype._updateSprite = function(sprite) {
      switch (this.type) {
        case 'blizzard':
            this._updateBlizzardSprite(sprite);
            break;
        case 'downlight':
            this._updateDownlightSprite(sprite);
            break;
        case 'uplight':
            this._updateUplightSprite(sprite);
            break;
      }
      _kzr_WC_Weather_updateSprite.call(this, sprite);
  };

  Weather.prototype._updateBlizzardSprite = function(sprite) {
      sprite.bitmap = this._snowBitmap;
      sprite.rotation = Math.PI / 8;
      sprite.ax -= 12 * Math.sin(sprite.rotation);
      sprite.ay += 3 * Math.cos(sprite.rotation);
      sprite.opacity -= 4;
  };

  Weather.prototype._updateDownlightSprite = function(sprite) {
      sprite.bitmap = this._lightBitmap;
      sprite.rotation = Math.PI / 16;
      sprite.ay += Math.cos(sprite.rotation);
      sprite.opacity -= 2;
  };

  Weather.prototype._updateUplightSprite = function(sprite) {
      sprite.bitmap = this._lightBitmap;
      sprite.rotation = Math.PI / 16;
      sprite.ay -= Math.cos(sprite.rotation);
      sprite.opacity -= 2;
  };

  var _kzr_WC_Weather_rebornSprite = Weather.prototype._rebornSprite;
  Weather.prototype._rebornSprite = function(sprite) {
      _kzr_WC_Weather_rebornSprite.call(this, sprite);
      if (this.type === 'uplight') {
          sprite.ay = Math.randomInt(Graphics.height * 1.3) + this.origin.y;
      }
  };

if (WC_InBattle) {
  //-----------------------------------------------------------------------------
  // Spriteset_Battle
  //
  var _kzr_WC_Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
  Spriteset_Battle.prototype.createLowerLayer = function() {
      _kzr_WC_Spriteset_Battle_createLowerLayer.call(this);
      this.createWeather();
  };

  Spriteset_Battle.prototype.createWeather = function() {
      this._weather = new Weather();
      this.addChild(this._weather);
  };

  var _kzr_WC_Spriteset_Battle_update = Spriteset_Battle.prototype.update;
  Spriteset_Battle.prototype.update = function() {
      _kzr_WC_Spriteset_Battle_update.call(this);
      this.updateWeather();
  };

  Spriteset_Battle.prototype.updateWeather = function() {
      this._weather.type = $gameScreen.weatherType();
      this._weather.power = $gameScreen.weatherPower();
      this._weather.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
      this._weather.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
  };

}

})();
