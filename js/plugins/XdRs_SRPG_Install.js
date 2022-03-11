//=================================================================================================
// XS_Install.js
//=================================================================================================
/*:
* @target MZ
* @plugindesc [XS.SRPG] 总设置 + 说明。
* @author 芯☆淡茹水
* @help
*==================================================================================================
* 〓 说明 〓
*
* 1，该系统 我方/敌方 的战斗数据皆为 数据库 - 角色 。
*
* 2，该系统使用流程： 插件命令准备开始战斗 - 插件命令布置敌人/角色 - 插件命令开始战斗 - 战斗 - 判定胜负 - 插件命令结束战棋模式。
*
* 3，该系统一场战斗，最多需要 6 个公共事件。
*    第一个： 备注战斗信息与胜利后运行的公共事件， 这个是必要的。
*    第二个： 战斗失败时运行的公共事件。
*    第三个： 地图每个单位待机时运行的公共事件。
*    第四个： 每场 1V1 战斗过后运行的公共事件。
*    第五个： 当前行动的阵营发生变更时运行的公共事件。
*    第六个： 回合数发生变更时运行的公共事件。
*    除了第一个之外，其他都不是必须的，根据实际情况备注设置。
*
* 4, 地图炮（AOE技能）
*
*    A ：该系统有两种类型地图炮 => 投掷类地图炮 和 四方向地图炮 。
*        投掷类地图炮 通过备注来设置； 四方向地图炮 通过专用的设置插件来设置。
*
*    B ：投掷类地图炮 有 2 个射程， 1：普通技能的范围距离射程； 2：投掷类地图炮独有的范围爆炸射程 。
*        投掷类地图炮 的备注设置，请参照 数据备注 - 技能 。
*
*    C ：四方向地图炮 的攻击范围，请使用该系统的 XdRs_SRPG_Test 插件进行编辑。
*        插件 XdRs_SRPG_Test 打开时，测试游戏会自动进入 攻击范围 的编辑场景。
*        编辑好的 攻击范围 ，需要先 保存范围 。关闭工程，再打开工程后，才能看到效果。
*        当技能编辑的 攻击范围点 为 0个，或者重置攻击范围保存后，该技能将变成 普通技能 。
*        插件 XdRs_SRPG_Test 为辅助制作类插件，非游戏必须插件。
*
*    D ：四方向地图炮的 使用者动画，会根据使用者的朝向改变方向，基础方向为 向上 。
*        所以，编辑 四方向地图炮的使用者动画 时，动画的动作方向为 向上 。
*        该系统的范例工程也有对应的示例动画。
*
*    ※ 注意 ※
*    因为敌人AI比较简单，所以尽量少给敌人配置那种 无差别攻击 的地图炮。
*    很可能的情况是：角色只打到一个，自己的队友却干翻了一片。
*
*
*==================================================================================================
* 〓 插件命令 〓
*
* 1， 准备开始战斗 => ReadyStartXs eventId
*     eventId: 公共事件ID，编写该场战斗的必要信息，以及战斗胜利后会运行这个公共事件。（详见 数据备注 的第五条）
*
* 2， 显示该场战斗的章节名 => ShowXsGameName
*
* 3， 添加该场战斗的强制出战人员 => AddForceActor id
*     id : 角色ID（若对应角色未在队伍中，或已经出战，则命令无效）
*
* 4， 两个阵营结盟 => XsAlliance camp1 camp2
*     camp1: 阵营1的ID（0 ~ 5）
*     camp2: 阵营2的ID（0 ~ 5）
*
* 5， 两个阵营解盟 => XsRescindCovenant camp1 camp2
*     camp1: 阵营1的ID（0 ~ 5）
*     camp2: 阵营2的ID（0 ~ 5）
*
* 6， 选择出战角色 => PlaceXsActors max
*     max: 当前选择出战的最大角色个数（省略不写的效果为：角色队伍剩余角色全部出战）
*
* 7， 布置出战的敌人 => PlaceXsEnemies data
*     data: 出战的单个或多个敌人事件数据。
*           出战敌人为 转到该事件 设置的 敌人事件页 ，比如事件ID为 6 ，敌人事件页需要独立开关A
*           打开，那么就是 6A 。
*           多个之间用 + 号连接，比如 6A+7A+8C+9B
*
* 8， 中途增援角色 => XsReinforcements actorId x y
*     actorId :增援的角色ID（若该角色已经在战斗中，命令无效； 若之前该角色未加入角色队伍，则会自动加入角色队伍。）
*     x :增援角色出现的 X 坐标。
*     y :增援角色出现的 Y 坐标。
*
* 9， 使地图上的光标选中一个 角色/敌人 单位 => SelectXsTarget id type
*     id: 角色 /敌人ID （角色是角色ID， 敌人是事件ID）
*     type: 类型（写 1 表示敌人； 不写表示角色）
*
* 10，设置当前地图上事件的独立开关 => SetEventSelfSwitch evId type state
*     evId  :事件的ID。
*     type  :开关类型（ABCD）。
*     state :开关状态（ON 打开； OFF 关闭）。
*
* 11， 该场战斗胜利 => XsVictory
*
* 12，该场战斗失败 => XsFail
*     战斗的胜利/失败，均自己定义条件，在适当的条件下运行 胜利/失败 命令就行了。
*
* 13，结束战棋游戏模式 => FinishXs
*==================================================================================================
* 〓 数据备注 〓
*
* 1，角色 ：
*
*    角色移动格数备注 => <MoveDistance:n>   (n : 格数)
*    角色实际移动格数获取次序 ： 角色备注 -> 角色职业备注 -> 默认 1 格
*
*    角色地形备注 => <SpaceType:n>  
*    n : 类型（默认 0）【 0：平地； 1：空中； 2：水】
*
*    角色战斗BGM备注 => <XsBGM:name>  (name : BGM文件名)
*
*    击败该角色获得的基本金钱备注 => <XsGold:n>  (n : 金钱数) 
*    具体金钱 = 基本金钱 x 角色等级
*
* 2,职业 ：
*
*    职业移动格数备注 => <MoveDistance:n>   (n : 格数)
*
* 3,技能 ：
*
*    技能使用者动画备注 => <XsUserAnm:id>  (id : 动画ID) <无备注不播放>
*
*    技能最小射程备注 => <XsRangeMin:n>  (n : 格数) <默认：恢复技能 0 ； 攻击技能 1>
* 
*    技能最大射程备注 => <XsRangeMax:n>  (n : 格数) <默认：1>
*    
*    移动后可以使用的技能 => <XsAllTimes> <无备注移动后不能使用>
*
*    技能无差别攻击备注 => <XsWhole>  (攻击技能可以应用于队友， 恢复技能可以应用于敌人。该功能主要应用于 地图炮)。
*
*   【投掷类地图炮】技能最小爆炸范围备注 => <XsMapGunRangeMin:n>  (n : 格数) <默认：0>
*
*   【投掷类地图炮】技能最大爆炸范围备注 => <XsMapGunRangeMax:n>  (n : 格数) <只有备注了这个，技能才会被认为是 投掷类地图炮>
*
*   【投掷类地图炮】技能发射后移动时播放的弹道动画(循环动画) => <XsMapGunMobileAnm:id>  (id : 动画ID) <无备注不播放>
*
*   【投掷类地图炮】技能发射后的移动速度 => <XsMapGunMoveSpeed:s>  (s : 每帧移动的像素值) <默认 5 ； 最小限制 2>
*
*   【投掷类地图炮】技能到达目标点时爆炸的动画 => <XsMapGunBlastAnm:id>  (id : 动画ID) <无备注不播放>
* 
*    技能不能对地 => <NoAE>
* 
*    技能不能对空 => <NoAA>
* 
*    技能不能对水 => <NoAS>
* 
* 
*    技能/物品 行动前的运行备注：
*
*    <XsBeforeAction>
*    代码 ...
*    .
*    .
*    .
*    </XsBeforeAction>
* 
*    技能在行动使用前会运行标签 <XsBeforeAction> 到 </XsBeforeAction> 之间的代码，如果技能备注了这个的话。
*    代码简写：
*    item  => 当前使用的 技能/物品 。
*    a => 使用者的战斗对象（Game_Actor）
*    c => 使用者的地图单位对象（Game_Character）
*    v => 游戏变量集（使用方式为 v[n]）
*    ts => 所有被攻击者的对象数组（[Game_Character]）
*    ceId => 运行的公共事件ID（默认 0）
* 
* 
* 4，事件 ：
*
*    敌人事件备注。在敌人事件页的 ●第一项● 写 ●注释●  。
*    注释内容有： <XsId:id>     id :该敌人的角色ID。
*                <XsCamp:n>    n :该敌人的阵营序号（默认 1）。
*                <XsLevel:n>   n :该敌人的等级（默认为角色初始等级）。
*                <XsAi:type>   type :敌人AI类型:，默认 0 。
*                敌人AI类型共四种 =>  0：自由移动和攻击；1：移动和攻击进入范围敌人；2：不移动，只攻击进入射程范围的敌人；3：不移动不攻击。
*    ● 敌人事件页，在该敌人死亡时会自动运行，可转到其他页面消除敌人或变身另外敌人 ●
*
*    敌人劝降页面备注。能够劝降的敌人，标志与剧情均编辑到这个事件的 ●第一页●
*    第一页的 ●第一项● 写 ●注释● ，备注劝降标志 <ITC> 或 <ITC:id1,id2,id3...>
*    <ITC> 表示我方任意角色都可以去劝降，至于能否劝降你自己在这一页编辑事件剧情判断。
*    <ITC:id1,id2,id3...> 表示只有 id1 id2 id3  等的角色，才能去劝降（行动选择列表窗口有 劝降 选项）。
*    想使敌人劝降成功，请运行 事件 - 脚本 ： this.xsEvent().onITCok();
*
*    互动事件备注。互动事件包括 宝箱 商店 ，，，，等。
*    互动事件 ●第一项● 写 ●注释● ，备注  <XsCommand:text>  (text: 显示到角色行动选项的文字)
*    比如宝箱 <XsCommand:宝箱> ， 商店 <XsCommand:商店>  .....。
*    当点击这个选项时，就会运行事件的这一页， 运行内容根据对应情况自行编辑。
*
* 5，战棋模式启动时，代入的公共事件的编辑备注 ：
*    该场战斗名字      => 公共事件名
*    该场战斗作战目的  => 公共事件第一项注释文字
*    该场战斗阵营名称  => 公共事件第二项注释备注（格式：名字1,名字2,名字3...），以对应的 阵营序号 获取。
*    该场战斗运行的公共事件  => 公共事件第三项注释备注
*    具体为： 
*    战斗失败时运行的公共事件  => <FE:id>
*    地图每个单位待机时运行的公共事件  => <AE:id>
*    每场战斗过后运行的公共事件  => <BE:id>
*    当前行动的阵营发生变更时运行的公共事件  => <CE:id>
*    回合数发生变更时运行的公共事件  => <TE:id>
*
* 6， 地图 ：
*
*    在绘制地图时，主要铺设角色出现时的 ●区域ID● 。
*    必须从 区域ID 1 号开始，预计该场战斗共出现多少个角色，就铺设到多少号。
*    每个 区域ID号 铺设一个就行了，铺设到你设定的位置。
*
*
*==================================================================================================
*  〓 脚本判断 〓
*
*  1， 当前行动的 阵营序号 => Xs_Manager.currentCamp();
*
*  2,  改变玩家操纵的阵营 => Xs_Manager.changePlayerCamp(camp);
*      camp :阵营序号。
*      ● 更改后，原来的 角色阵营 ，将由AI接管 ● 
*
*  3， 判断某个阵营是否全灭 => $gameMap.isXsAllDead(camp);
*      camp :阵营序号。
*
*  4,  判断战棋模式是否在运行中 => Xs_Manager.isRuning();
*
*  5， 改变敌人AI类型 => $gameMap.event(id).changeAiType(type);
*      id :敌人事件ID。
*      type :AI类型（0 ~ 3）
*
*==================================================================================================
* @param ==========================================
*
* @param FightOnMapOnly
* @text 是否仅使用地图战斗模式。
* @type boolean
* @desc 开启后不会进入战斗界面战斗，不会显示战斗前的状态界面和是否跳过战斗的选择，并且没有反击机制。
* @default true
*
* @param roundVal
* @text 回合数变量。
* @type number
* @desc 记录回合数的变量ID。
* @default 5
*
* @param appearCount
* @text 部署多个角色/敌人，之间的间隔时间（帧）。
* @type number
* @desc 部署多个角色/敌人，之间的间隔时间（帧）。
* @default 10
*
* @param appearAnm
* @text 出现时播放的动画ID。
* @type number
* @desc 出现时播放的动画ID。
* @default 46
*
* @param deadAnm
* @text 角色死亡时播放的动画ID。
* @type number
* @desc 角色死亡时播放的动画ID。
* @default 54
*
* @param stepAnm
* @text 角色站立时是否走步。
* @type boolean
* @desc 角色站立时是否走步。
* @default true
*
* @param moveSpeed
* @text 角色单位移动速度。
* @type number
* @desc 角色单位移动速度。
* @default 4
*
* @param leftPoint
* @text 左边战斗角色的位置点。
* @desc 左边战斗角色的位置点。（格式：x,y）
* @default 200,400
*
* @param rightPoint
* @text 右边战斗角色的位置点。
* @desc 右边战斗角色的位置点。（格式：x,y）
* @default 600,400
*
* @param blockedRegionId
* @text 绝对不通行的 区域ID。
* @type number
* @desc 绝对不通行的 区域ID。（包括空中单位）
* @default 255
*
* @param ==========================================
*
* @param IconSelect
* @text 标示 角色已选择出战 的图标序号。
* @type number
* @desc 标示 角色已选择出战 的图标序号。
* @default 87
*
* @param IconForce
* @text 标示 角色强制出战 的图标序号。
* @type number
* @desc 标示 角色强制出战 的图标序号。
* @default 89
*
* @param IconDead
* @text 标示 角色已阵亡 的图标序号。
* @type number
* @desc 标示 角色已阵亡 的图标序号。
* @default 17
*
* @param IconFree
* @text 标示 角色可以行动 的图标序号。
* @type number
* @desc 标示 角色可以行动 的图标序号。
* @default 75
*
* @param IconREH
* @text 回血标志 的图标序号。
* @type number
* @desc 回血标志 的图标序号。
* @default 70
*
* @param IconREM
* @text 回蓝标志 的图标序号。
* @type number
* @desc 回蓝标志 的图标序号。
* @default 72
*
* @param IconHIT
* @text 命中标志 的图标序号。
* @type number
* @desc 命中标志 的图标序号。
* @default 77
*
* @param IconEVA
* @text 回避标志 的图标序号。
* @type number
* @desc 回避标志 的图标序号。
* @default 82
*
* @param IconAE
* @text 技能对地标志 的图标序号。
* @type number
* @desc 技能对地标志 的图标序号。
* @default 71
*
* @param IconAA
* @text 技能对空标志 的图标序号。
* @type number
* @desc 技能对空标志 的图标序号。
* @default 78
*
* @param IconAS
* @text 技能对海标志 的图标序号。
* @type number
* @desc 技能对海标志 的图标序号。
* @default 67
*
* @param ==========================================
*
* @param numActionsFormula
* @text 一回合最大行动次数算式。
* @type text
* @desc （id：角色ID；classId：职业ID； atk：攻击力； def：物防； mat: 魔攻； mdf：魔防； agi：敏捷； luk：运气）。
* @default 1
*
* @param ==========================================
*
* @param aimKey
* @text 作战目的 窗口快捷键键值。
* @type number
* @desc 作战目的 窗口快捷键键值（例：键盘B键 => 66）。
* @default 66
*
* @param queKey
* @text 部队表 窗口快捷键键值。
* @type number
* @desc 部队表 窗口快捷键键值（例：键盘P键 => 80）。
* @default 80
*
* @param mapKey
* @text 小地图 窗口快捷键键值。
* @type number
* @desc 小地图 窗口快捷键键值（例：键盘M键 => 77）。
* @default 77
*
* @param savKey
* @text 存档 窗口快捷键键值。
* @type number
* @desc 存档 窗口快捷键键值（例：键盘S键 => 83）。
* @default 83
*
* @param optKey
* @text 设置 窗口快捷键键值。
* @type number
* @desc 设置 窗口快捷键键值（例：键盘O键 => 79）。
* @default 79
*
* @param flsKey
* @text 结束回合 窗口快捷键键值。
* @type number
* @desc 结束回合 窗口快捷键键值（例：键盘F键 => 70）。
* @default 70
*
* @param ==========================================
*
* @param colorMV
* @text 移动格子的颜色。
* @desc 移动格子的颜色（格式：红,绿,蓝）。
* @default 0,200,200
*
* @param colorAT
* @text 攻击类 技能/物品 格子的颜色。
* @desc 攻击类 技能/物品 格子的颜色（格式：红,绿,蓝）。
* @default 180,0,0
*
* @param colorRV
* @text 恢复类 技能/物品 格子的颜色。
* @desc 恢复类 技能/物品 格子的颜色（格式：红,绿,蓝）。
* @default 0,180,0
*
* @param ==========================================
*
* @param TerrainSet0
* @text 地形ID为 0 的地形数据设置。
* @type struct<Terrain>
* @desc 地形ID为 0 的地形数据设置。
* @default
*
* @param TerrainSet1
* @text 地形ID为 1 的地形数据设置。
* @type struct<Terrain>
* @desc 地形ID为 1 的地形数据设置。
* @default 
*
* @param TerrainSet2
* @text 地形ID为 2 的地形数据设置。
* @type struct<Terrain>
* @desc 地形ID为 2 的地形数据设置。
* @default 
*
* @param TerrainSet3
* @text 地形ID为 3 的地形数据设置。
* @type struct<Terrain>
* @desc 地形ID为 3 的地形数据设置。
* @default 
*
* @param TerrainSet4
* @text 地形ID为 4 的地形数据设置。
* @type struct<Terrain>
* @desc 地形ID为 4 的地形数据设置。
* @default 
*
* @param TerrainSet5
* @text 地形ID为 5 的地形数据设置。
* @type struct<Terrain>
* @desc 地形ID为 5 的地形数据设置。
* @default 
*
* @param TerrainSet6
* @text 地形ID为 6 的地形数据设置。
* @type struct<Terrain>
* @desc 地形ID为 6 的地形数据设置。
* @default 
*
* @param TerrainSet7
* @text 地形ID为 7 的地形数据设置。
* @type struct<Terrain>
* @desc 地形ID为 7 的地形数据设置。
* @default 
*
* @param TerrainSet8
* @text 地形ID为 8 的地形数据设置。
* @type struct<Terrain>
* @desc 地形ID为 8 的地形数据设置。
* @default  
*
*/
/* ---------------------------------------------------------------------------
 * struct<Terrain>
 * ---------------------------------------------------------------------------
*/
 /*~struct~Terrain: 
 *
 * @param TerrainName
 * @text 地形名。
 * @type text
 * @desc 地形名。
 * @default
 * 
 * @param TerrainIcon
 * @text 地形图标序号。
 * @type number
 * @desc 地形图标序号。
 * @default 0
 *
 * @param TerrainREH
 * @text 地形每回合回血量百分比。
 * @type number
 * @desc 地形每回合回血量百分比（正数加，负数减）。
 * @default 0
 *
 * @param TerrainREM
 * @text 地形每回合回蓝量百分比。
 * @type number
 * @desc 地形每回合回蓝量百分比（正数加，负数减）。
 * @default 0
 *
 * @param TerrainMOV
 * @text 地形对移动的阻碍系数。
 * @type number
 * @desc 地形对移动的阻碍系数。（值越大，阻碍越大； 0 表示无阻碍）。
 * @default 0
 * 
 * @param TerrainHIT
 * @text 地形命中率。
 * @type number
 * @desc 地形命中率。
 * @default 100
 *
 * @param TerrainEVA
 * @text 地形闪避率。
 * @type number
 * @desc 地形闪避率。
 * @default 100
 * 
 * 
 *
*/
//=================================================================================================
;var $Xs_MapGunData = null;
var XdRsData = XdRsData || {};
XdRsData.SRPG = XdRsData.SRPG || {};
XdRsData.SRPG.parameters = PluginManager.parameters('XdRs_SRPG_Install');
//=================================================================================================
XdRsData.SRPG.campColor = function(camp) {
    switch(camp) {
        case 0 :return 'rgb(0,0,255)';
        case 1 :return 'rgb(255,0,0)';
        case 2 :return 'rgb(255,255,0)';
        case 3 :return 'rgb(0,255,0)';
        case 4 :return 'rgb(255,0,255)';
    }
    return 'rgb(0,0,0)';
};
XdRsData.SRPG.commandWord = function(sym) {
    switch(sym) {
        case 'move'    :return '移动';
        case 'atk'     :return '攻击';
        case 'state'   :return '状态';
        case 'item'    :return '物品';
        case 'itc'     :return '劝降';
        case 'standby' :return '待机';
    }
    return '';
};
XdRsData.SRPG.menuWord = function(sym) {
    switch(sym) {
        case 'aim'    :return '作战目的';
        case 'queue'  :return '部队表';
        case 'map'    :return '小地图';
        case 'save'   :return '储存进度';
        case 'load'   :return '读取进度';
        case 'set'    :return '设置';
        case 'action' :return '行动结束';
    }
    return '';
};
XdRsData.SRPG.spaceWord = function(type) {
    return ['地','空','水'][type] || '未知';
};
XdRsData.SRPG.keydata = function() {
    return ['aim','que','map','sav','opt','fls'];
};
XdRsData.SRPG.addInputKey = function() {
    for (var i=0;i<this.keydata().length;++i) {
        var sym = this.keydata()[i];
        var keyVal = +this.parameters[sym+'Key'] || 0;
        Input.keyMapper[keyVal] = sym + 'Xs';
    }
};
XdRsData.SRPG.terrainData = function(id) {
    if (id < 0 || id > 8) return null;
    return JSON.parse(this.parameters['TerrainSet'+id]);
};
XdRsData.SRPG.getTerrainName = function(id) {
    var data = this.terrainData(id);
    return data ? data.TerrainName : '';
};
XdRsData.SRPG.getTerrainIconIndex = function(id) {
    var data = this.terrainData(id);
    return data ? data.TerrainIcon : 0;
};
XdRsData.SRPG.getTerrainBuffer = function(id, sym) {
    var data = this.terrainData(id);
    var dft = (['HIT','EVA'].contains(sym) ? 100 : 0);
    return data ? +data['Terrain'+sym] || dft : dft;
};
XdRsData.SRPG.isFightOnMapOnly = function() {
    return !!eval(this.parameters['FightOnMapOnly']);
};
XdRsData.SRPG.setRoundVal = function(round) {
    var id = +this.parameters['roundVal'];
    $gameVariables.setValue(id, round);
};
XdRsData.SRPG.appearCount = function() {
    var s = +this.parameters['appearCount'] || 10;
    return Math.max(1, s);
};
XdRsData.SRPG.iconIndex = function(sym) {
    return +this.parameters['Icon'+sym] || 0;
};
XdRsData.SRPG.isNumber = function(obj) {
    return typeof obj === 'number' && !isNaN(obj);
};
XdRsData.SRPG.getBattlerHome = function(type) {
    var arr = this.parameters[type+'Point'].split(',');
    return new Point(+arr[0], +arr[1]);
};
XdRsData.SRPG.minItemRange = function(item) {
    if (item === 'itc') return 1;
    if (!DataManager.isItem(item) && !DataManager.isSkill(item)) return null;
    if (item.xsMapGunData) {
        var arr = item.xsMapGunData.join().split(',').map(function(n){
            return Math.abs(+n);
        });
        return Math.max(1, Math.min.apply(null, arr));
    }
    return +item.meta.XsRangeMin || 1;
};
XdRsData.SRPG.maxItemRange = function(item) {
    if (item === 'itc') return 1;
    if (!DataManager.isItem(item) && !DataManager.isSkill(item)) return null;
    if (item.xsMapGunData) {
        var arr = item.xsMapGunData.join().split(',').map(function(n){
            return Math.abs(+n);
        });
        return Math.max.apply(null, arr);
    }
    return +item.meta.XsRangeMax || 1;
};
XdRsData.SRPG.itemRange = function(item) {
    if (this.isPlainMapGun(item)) {
        var min = +(item.XsMapGunRangeMin || 0);
        var max = +item.XsMapGunRangeMax;
        return [min, max];
    }
    return [this.minItemRange(item), this.maxItemRange(item)];
};
XdRsData.SRPG.rangeText = function(item) {
    if (this.minItemRange(item) === null) return '';
    var arr = this.itemRange(item);
    if (this.isPlainMapGun(item)) {
        arr = [this.minItemRange(item), this.maxItemRange(item)];
    }
    if (arr[0] === arr[1] && arr[0] === 1) return '1';
    return ''+arr[0]+' ~ ' + arr[1];
};
XdRsData.SRPG.isForOpponent = function(item) {
    if (item === 'ITC') return true;
    return item && [1,2,3,4,5,6].contains(item.scope);
};
XdRsData.SRPG.isForFriend = function(item) {
    if (item === 'ITC') return false;
    return item && [7,8,9,10,11].contains(item.scope);
};
XdRsData.SRPG.color = function(sym, alpha) {
    alpha = alpha || 1;
    var data = this.parameters['color'+sym];
    return 'rgba('+data+','+alpha+')';
};
XdRsData.SRPG.isBlocked = function(x, y) {
    var id = +this.parameters['blockedRegionId'];
    return id && id === $gameMap.regionId(x, y);
};
XdRsData.SRPG.isDebugItem = function(item) {
    if (!this.isGameItem(item) || !item.name) return false;
    if (this.isPlainMapGun(item)) return false;
    return item.damage.type > 0;
};
XdRsData.SRPG.isGameItem = function(item) {
    return DataManager.isSkill(item) || DataManager.isItem(item);
};
XdRsData.SRPG.isMapGun = function(item) {
    return this.isPlainMapGun(item) || this.isSpecialMapGun(item);
};
XdRsData.SRPG.isPlainMapGun = function(item) {
    return this.isGameItem(item) && !!item.meta.XsMapGunRangeMax;
};
XdRsData.SRPG.isSpecialMapGun = function(item) {
    return this.isGameItem(item) && !!item.xsMapGunData;
};
XdRsData.SRPG.getItemMapGunPoints = function(item) {
    if (!this.isGameItem(item) || !item.xsMapGunData) return [];
    var arr = [];
    for (var i=0;i<item.xsMapGunData.length;++i) {
        var data = item.xsMapGunData[i];
        arr.push(new Point(data[0], data[1]));
    }
    return arr;
};
XdRsData.SRPG.getRealPointByDirection = function(point, direction) {
    if (!point || direction === 8) return point;
    var d = direction;
    var px = point.x, py = point.y;
    var x = d === 2 ? -px : (d === 4 ? py : -py);
    var y = d === 2 ? -py : (d === 4 ? -px : px);
    return new Point(x, y);
};
XdRsData.SRPG.itemUserAnm = function(item) {
    if (!item) return 0;
    return +(item.meta.XsUserAnm || 0);
};
XdRsData.SRPG.itemGlobalAnm = function(item) {
    if (!item) return 0;
    return +(item.meta.XsGlobalAnm || 0);
};
//=================================================================================================
// end
//=================================================================================================