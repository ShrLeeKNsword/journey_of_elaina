//=============================================================================
// KZR_WeatherDamage.js
// Version : 1.01
// -----------------------------------------------------------------------------
// [Homepage]: かざり - ホームページ名なんて飾りです。偉い人にはそれがわからんのですよ。 -
//             http://nyannyannyan.bake-neko.net/
// -----------------------------------------------------------------------------
// [Version]
// 1.01 2017/01/20 ヘルプ文章更新
// 1.00 2017/01/20 公開
//=============================================================================

/*:
 * @plugindesc 根据天气的不同，伤害和命中率会发生变化。 
 * @author ぶちょー
 *
 * @help
 * 请在技能的备注栏中写下如下内容。 
 *
 * 【伤害波动】
 * <WD_DamageUp:type,rate>
 * type : 天气（雨：rain, 风暴：storm, 雪：snow）
 *        附加天气（暴风雪：blizzard, 下降的光：downlight, 上升的光：uplight）
 * rate : 伤害波动率（%）
 * （例） <WD_DamageUp:snow,150>  下雪的时候，伤害为150%
 * （例） <WD_DamageUp:rain,50>   下雨时，伤害为50%
 *
 * 【命中率变化】
 * <WD_HitChange:type,plus>
 * type : 天气（雨：rain, 风暴：storm, 雪：snow）
 *        附加天气（暴风雪：blizzard, 下降的光：downlight, 上升的光：uplight）
 * plus : 命中率增加量(负数减少)
 *      : certain （必中）
 * （例） <WD_HitChange:rain,10>  下雨的时候，命中率增加10%
 * （例） <WD_HitChange:storm,certain>  暴风雨的时候，必中
 *
 * 【追加天候について】
 * プラグイン KZR_WeatherControl.js を導入してください。
 */

//-----------------------------------------------------------------------------
// Game_Action
//
var _kzr_WD_Game_Action_itemHit = Game_Action.prototype.itemHit;
Game_Action.prototype.itemHit = function(target) {
    if (this.WD_HitTypeCertain()) return 1.0;
    var hit = _kzr_WD_Game_Action_itemHit.call(this, target);
    var notedata = this.item().note.split(/[\r\n]+/);
    var note = /(?:WD_HitChange:(\S+),(-)?(\d+))/i;
    for (var i = 0; i < notedata.length; i++) {
      if (notedata[i].match(note)) {
          if (RegExp.$1 === $gameScreen.weatherType()) {
              var plus = parseInt(RegExp.$3) * 0.01;
              hit += RegExp.$2 ? plus * (-1) : plus;
          }
      }
    }
    return hit;
};

var _kzr_WD_Game_Action_itemEva = Game_Action.prototype.itemEva;
Game_Action.prototype.itemEva = function(target) {
    if (this.WD_HitTypeCertain()) return 0;
    return _kzr_WD_Game_Action_itemEva.call(this, target);
};

Game_Action.prototype.WD_HitTypeCertain = function() {
    var notedata = this.item().note.split(/[\r\n]+/);
    var note = /(?:WD_HitChange:(\S+),certain)/i;
    for (var i = 0; i < notedata.length; i++) {
      if (notedata[i].match(note)) {
          if (RegExp.$1 === $gameScreen.weatherType()) return true;
      }
    }
    return false;
};

var _kzr_WD_Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
    var value = _kzr_WD_Game_Action_makeDamageValue.call(this, target, critical);
    var notedata = this.item().note.split(/[\r\n]+/);
    var note = /(?:WD_DamageUp:(\S+),(\d+))/i;
    for (var i = 0; i < notedata.length; i++) {
      if (notedata[i].match(note)) {
          if (RegExp.$1 === $gameScreen.weatherType()) {
              value *= parseInt(RegExp.$2) * 0.01;
          }
      }
    }
    return parseInt(value);
};
