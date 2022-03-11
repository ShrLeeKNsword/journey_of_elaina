//=================================================================================================
// XS_PluginCommand.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc [XS.SRPG] 插件命令。
* @author 芯☆淡茹水
* @help
* 
* 战棋模式的插件命令，所有插件命令皆归于此。
*
* @command ReadyStartXs
* @text 准备开始战棋模式游戏
* @desc 准备开始战棋模式游戏。
*
* @arg commonEventId
* @type number
* @min 0
* @max 999
* @default 0
* @text 公共事件ID
* @desc 备注战斗信息与胜利后运行的公共事件的ID（必要参数）。
* 
* @arg mapId
* @type number
* @min 0
* @max 999
* @default 0
* @text 进行战棋模式战斗的地图ID
* @desc 进行战棋模式战斗的地图ID。（非必要参数，写 0 默认为当前地图）。
*
*
* @command ShowXsGameName
* @text 显示该场战斗的章节名字
* @desc 显示该场战斗的章节名字（名字为 战斗信息公共事件 的名字）。
*
*
* @command StartXs
* @text 开始战棋模式游戏
* @desc 开始战棋模式游戏。
*
* @arg camp
* @type number
* @min 0
* @max 99
* @default 0
* @text 开始战棋模式游戏时，初始开始行动的 阵营序号 
* @desc 开始战棋模式游戏时，初始开始行动的 阵营序号 。（非必要参数，默认 0）。
*
*
* @command FinishXs
* @text 结束战棋模式游戏。
* @desc 结束战棋模式游戏。
*
*
* @command SelectXsTarget
* @text 使地图上的光标选中一个 角色/敌人
* @desc 使地图上的光标选中一个 角色/敌人。
*
* @arg id
* @type number
* @min 0
* @max 999
* @default 0
* @text 角色/敌人ID
* @desc 角色/敌人ID （角色是角色ID， 敌人是事件ID）(必要参数)。
* 
* @arg type
* @type number
* @min 0
* @max 1
* @default 0
* @text 对象类型
* @desc 对象类型（写 1 表示敌人； 不写表示角色）。（非必要参数，默认 0）。
*
*
* @command AddForceActor
* @text 添加该场战斗的强制出战角色
* @desc 添加该场战斗的强制出战角色。
*
* @arg id
* @type number
* @min 0
* @max 999
* @default 0
* @text 强制出战角色ID
* @desc 强制出战角色ID (必要参数)。
*
*
* @command PlaceXsEnemies
* @text 布置出战的敌人
* @desc 布置出战的敌人。
*
* @arg note
* @type text
* @default
* @text 出战的单个或多个敌人事件数据
* @desc 出战的单个或多个敌人事件数据 (必要参数，格式详见插件说明)。
*
*
* @command PlaceXsActors
* @text 开始选择出战角色
* @desc 开始选择出战角色。
*
* @arg max
* @type number
* @min 0
* @max 999
* @default 0
* @text 当次可以选择的最大出战人数
* @desc 当次可以选择的最大出战人数 (非必要参数，省略表示队伍内所有成员都出战)。
*
*
* @command XsAlliance
* @text 两个阵营结盟
* @desc 两个阵营结盟。
*
* @arg camp1
* @type number
* @min 0
* @max 999
* @default 0
* @text 阵营1序号
* @desc 阵营1序号 (必要参数)。
*
* @arg camp2
* @type number
* @min 0
* @max 999
* @default 0
* @text 阵营2序号
* @desc 阵营2序号 (必要参数)。
*
*
* @command XsRescindCovenant
* @text 两个阵营解盟
* @desc 两个阵营解盟。
*
* @arg camp1
* @type number
* @min 0
* @max 999
* @default 0
* @text 阵营1序号
* @desc 阵营1序号 (必要参数)。
*
* @arg camp2
* @type number
* @min 0
* @max 999
* @default 0
* @text 阵营2序号
* @desc 阵营2序号 (必要参数)。
*
*
* @command XsReinforcements
* @text 中途增援角色
* @desc 中途增援角色。
*
* @arg id
* @type number
* @min 0
* @max 999
* @default 0
* @text 增援角色的ID
* @desc 增援角色的ID (必要参数)。
*
* @arg x
* @type number
* @min 0
* @max 9999
* @default 0
* @text 增援角色出现的 X 坐标
* @desc 增援角色出现的 X 坐标 (必要参数)。
*
* @arg y
* @type number
* @min 0
* @max 9999
* @default 0
* @text 增援角色出现的 Y 坐标
* @desc 增援角色出现的 Y 坐标 (必要参数)。
*
*
* @command SetEventSelfSwitch
* @text 操作当前地图上事件的独立开关
* @desc 操作当前地图上事件的独立开关。
*
* @arg id
* @type number
* @min 0
* @max 999
* @default 0
* @text 事件的ID
* @desc 事件的ID。(必要参数)。
*
* @arg type
* @type text
* @default
* @text 开关类型（ABCD）
* @desc 开关类型（ABCD） (必要参数)。
*
* @arg state
* @type boolean
* @default true
* @text 开关打开/关闭
* @desc 开关打开/关闭。
*
*
* @command XsVictory
* @text 游戏胜利
* @desc 游戏胜利。
*
*
* @command XsFail
* @text 游戏失败
* @desc 游戏失败。
*
*/
//=================================================================================================
;(() => {
const PluginName = 'XdRs_SRPG_PluginCommand';
PluginManager.registerCommand(PluginName, "ReadyStartXs", args => {
    SceneManager.readyStartXs(+args.commonEventId, +args.mapId);
});
PluginManager.registerCommand(PluginName, "ShowXsGameName", () => {
    Xs_Manager.showGameName();
});
PluginManager.registerCommand(PluginName, "StartXs", args => {
    Xs_Manager.start(+args.camp);
});
PluginManager.registerCommand(PluginName, "FinishXs", () => {
    Xs_Manager.finish();
});
PluginManager.registerCommand(PluginName, "SelectXsTarget", args => {
    if (!Xs_Manager.isRuning()) return;
    const id = +args.id;
    const type = +args.type;
    const target = type ? $gameMap.event(id) : $gameMap.xsPlayerById(id);
    Xs_Manager.selectTarget(target);
});
PluginManager.registerCommand(PluginName, "AddForceActor", args => {
    Xs_Manager.addForceFightActor(+args.id);
});
PluginManager.registerCommand(PluginName, "PlaceXsEnemies", args => {
    Xs_Manager.layOutEnemys(args.note || '') && $gameMap._interpreter.setWaitMode('xsPlaceEnemy');
});
PluginManager.registerCommand(PluginName, "PlaceXsActors", args => {
    Xs_Manager.readyLayOutActors(+args.max) && $gameMap._interpreter.setWaitMode('xsPlaceActor');
});
PluginManager.registerCommand(PluginName, "XsAlliance", args => {
    Xs_Manager.alliance(+args.camp1, +args.camp2);
});
PluginManager.registerCommand(PluginName, "XsRescindCovenant", args => {
    Xs_Manager.rescindCovenant(+args.camp1, +args.camp2);
});
PluginManager.registerCommand(PluginName, "XsReinforcements", args => {
    Xs_Manager.reinforcements(+args.id, +args.x, +args.y);
});
PluginManager.registerCommand(PluginName, "SetEventSelfSwitch", args => {
    const event = $gameMap.event(+args.id);
    if (!event || !args.type) return;
    const key = [$gameMap.mapId(), +args.id, args.type];
    $gameSelfSwitches.setValue(key, eval(args.state));
});
PluginManager.registerCommand(PluginName, "XsVictory", () => {
    Xs_Manager._control.onVictory();
});
PluginManager.registerCommand(PluginName, "XsFail", () => {
    Xs_Manager._control.onDestruction();
});
})();
//=================================================================================================
// end
//=================================================================================================