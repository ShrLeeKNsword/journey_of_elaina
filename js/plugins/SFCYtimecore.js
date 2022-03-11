//=============================================================================
// SFCY time core
// SFCY TIME CORE
// Version: 0.1
// License: MIT
//=============================================================================
/*:
 * @target MZ
 * @plugindesc SFCY TIME CORE
 * @author sfcy
 *
 * @help
 * 介绍
 * 这是个用来读取时间的插件。
 * 注意 
 * 1.请确保你部署的变量位置。是空的，否则将会覆盖你原有的变量。
 * 2.如果发现任何问题，请联系神奇的号码。qq770436947
 * 3.目前已知的问题在第一张地图无法读取。
 * 发展历程。
 * 0.1
 * 第一次做出来。
 *
 *
 * //=============================================================================
 * End of Help File
 * //=============================================================================
 * @plugindesc v0.1 允许你读取时间并记录
 * @author sfcy
 *
 * @param hour
 * @desc 用于记录小时的变量. 默认: 61
 * @default 61
 *
 * @param minute
 * @desc 用于记录分钟的变量. 默认: 62
 * @default 62
 *
 * @param second
 * @desc 用于记录秒的变量. 默认: 63
 * @default 63
 *
 * @param year
 * @desc 用于记录年的变量. 默认: 35
 * @default 35
 *
 * @param recently year
 * @desc 用于校验年的变量. 默认: 38
 * @default 38
 *
 * @param mouth
 * @desc 用于记录月的变量. 默认: 36
 * @default 36
 *
 * @param recently mouth
 * @desc 用于校验月的变量. 默认: 39
 * @default 39
 *
 * @param day
 * @desc 用于记录日的变量. 默认: 37
 * @default 37
 *
 * @param recently day
 * @desc 用于校验日的变量. 默认: 40
 * @default 40 
 *
 * @param common
 * @desc 用于触发签到的公共事件. 默认: 18
 * @default 18
 */
 
// Imported
var sfcy = PluginManager.parameters('sfcytimecore')
var day =Number( sfcy['day'] || 37)
var mouth =Number( sfcy['mouth'] || 36)
var year =Number( sfcy['year'] || 35)
var recentlyday =Number( sfcy['recentlyday'] || 40)
var recentlymouth =Number( sfcy['recentlymouth'] || 39)
var recentlyyear =Number( sfcy['recentlyyear'] || 38)
var common =Number( sfcy['common'] || 18)
var second =Number( sfcy['second'] || 63)
var minute =Number( sfcy['minute'] || 62)
var hour =Number( sfcy['hour'] || 61)




var oldUpdate = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {oldUpdate.call(this)
  var date = new Date();
  $gameVariables.setValue(hour, date.getHours())
  $gameVariables.setValue(minute, date.getMinutes())
  $gameVariables.setValue(second, date.getSeconds())
  $gameVariables.setValue(year, date.getFullYear()); 
  $gameVariables.setValue(mouth, date.getMonth() + 1); 
  $gameVariables.setValue(day, date.getDate()); 
  if ($gameVariables.value(day) != $gameVariables.value(recentlyday) || 
      $gameVariables.value(year) != $gameVariables.value(recentlyyear) ||
      $gameVariables.value(mouth) != $gameVariables.value(recentlymouth)) {
      $gameTemp.reserveCommonEvent(common);}
  $gameVariables.setValue(recentlyyear, $gameVariables.value(year)); 
  $gameVariables.setValue(recentlymouth, $gameVariables.value(mouth)); 
  $gameVariables.setValue(recentlyday, $gameVariables.value(day));
this.lastMapId = $gameMap.mapId();
}
