// =============================================================================
// ABMZ_EnemyHate.js
// Version: 1.18
// -----------------------------------------------------------------------------
// Copyright (c) 2015 ヱビ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [Homepage]: ヱビ的日志
//             http://www.zf.em-net.ne.jp/~ebi-games/
// =============================================================================


/*:
 * @target MZ
 * @plugindesc v1.18 敌方攻击仇恨值最高成员
 * 仇恨值伴随战斗行动变化
 * @author ヱビ/<译>公孖。狼
 * @url http://www.zf.em-net.ne.jp/~ebi-games/
 *
 * @requiredAssets img/system/hateline
 * 
 * @param DisplayHateLine
 * @text 展示仇恨条
 * @type boolean
 * @on 是
 * @off 否
 * @desc 设定仇恨条是否出现。
 * @default false
 * 
 * @param DebugMode
 * @text 调试模式
 * @type boolean
 * @on 是
 * @off 否
 * @desc 设定为ON时仇恨值开启点数增长。
 * @default false
 * 
 * @param DamageHateFormula
 * @text HP伤害公式
 * @desc 遭受HP伤害时增长仇恨值的公式。
 * @default damage
 * 
 * @param MPDamageHateFormula
 * @text MP伤害公式
 * @desc 遭受MP伤害时增长仇恨值的公式。
 * @default MPDamage * 5
 * 
 * @param HealHateFormula
 * @text 治疗公式
 * @desc 己方受到治疗时增长仇恨值公式。
 * @default healPoint * 2
 * 
 * @param BuffHateFormula
 * @text 增益Buff公式
 * @desc 己方增益Buff加成时仇恨值增长公式。
 * @default enemy.atk * 4
 * 
 * @param DebuffHateFormula
 * @text 减益Buff公式
 * @desc 敌方减益Buff附加时仇恨值增长公式。
 * @default enemy.atk * 4
 * 
 * @param StateToEnemyHateFormula
 * @text 敌方状态附加公式
 * @desc 敌方附加状态时仇恨值增长公式。
 * @default enemy.atk * 4
 * 
 * @param StateToActorHateFormula
 * @text 己方状态附加公式
 * @desc 己方附加状态时仇恨值增长公式。
 * @default enemy.atk * 4
 * 
 * @param RemoveStateHateFormula
 * @text 己方状态解除公式
 * @desc 己方状态解除时仇恨值增长公式。
 * @default enemy.atk * 4
 * 
 * @param ReduceOthersHate
 * @text 仇恨减弱模式
 * @type boolean
 * @on 是
 * @off 否
 * @desc 是否开放己方仇恨增长行动中的减弱模式？
 * @default false
 * 
 * @param OthersHateRateFormula
 * @text 己方仇恨减弱公式
 * @type string
 * @desc 己方仇恨减弱时的比例公式。
 * @default (100 - (point / enemy.atk)) / 100
 * 
 * @param ---EnemyList---
 * @text ---敌方列表---
 * 
 * @param ShowEnemyList
 * @text 展示敌方列表
 * @parent ---EnemyList---
 * @type boolean
 * @on 是
 * @off 否
 * @desc 展示敌方列表么？
 * @default false
 *
 * @param EnemyListX
 * @text 敌方列表位置X
 * @parent ---EnemyList---
 * @type number
 * @desc 敌方列表的X坐标。
 * @default 0
 *
 * @param EnemyListY
 * @text 敌方列表位置Y
 * @parent ---EnemyList---
 * @type number
 * @desc 敌方列表的Y坐标。
 * @default 0
 * 
 * @param HateIconList
 * @text 仇恨图标列表
 * @parent ---EnemyList---
 * @type string
 * @desc 仇恨排名的图标列表。由左至右排名上升。以半角空格划分。默认：64 5 4 16
 * @default 64 5 4 16
 *
 * @param EnemyListFontSize
 * @text 敌方列表字体尺寸
 * @parent ---EnemyList---
 * @type number
 * @desc 敌方列表的字体尺寸。
 * @default 24
 *
 * @param EnemyListLineHeight
 * @text 敌方列表单行高度
 * @parent ---EnemyList---
 * @type number
 * @desc 敌方列表的单行高度。
 * @default 32
 *
 * @param EnemyListWidth
 * @text 敌方列表宽度
 * @parent ---EnemyList---
 * @type number
 * @desc 敌方列表的宽度。
 * @default 240
 *
 * 
 * 
 * @param HateGaugeColor1
 * @text 仇恨程度色1
 * @parent ---EnemyList---
 * @type number
 * @desc 仇恨程度的颜色1。
 * @default 2
 * 
 * @param HateGaugeColor2
 * @text 仇恨程度色2
 * @parent ---EnemyList---
 * @type number
 * @desc 仇恨程度的颜色2。
 * @default 10
 *
 * 
 * 
 * @param ---HateGauge---
 * @text 仇恨程度
 * 
 * @param ShowHateGauge
 * @text 展示仇恨程度
 * @parent ---HateGauge---
 * @type boolean
 * @on 是
 * @off 否
 * @desc 展示队伍仇恨测算么？
 * @default false
 * 
 * @param HateGaugeWidth
 * @text 仇恨程度宽度
 * @parent ---HateGauge---
 * @type number
 * @desc 仇恨程度的宽度。
 * @default 180
 * 
 * @param HateGaugeX
 * @text  仇恨程度X位置
 * @parent ---HateGauge---
 * @type text
 * @desc 相应成员仇恨程度的X坐标。
 * index:成员编号、length:成员人数
 * @default Graphics.boxWidth /6 * (index +1)
 * 
 * @param HateGaugeY
 * @text  仇恨程度Y位置
 * @parent ---HateGauge---
 * @type text
 * @desc 相应成员仇恨程度的Y坐标。
 * index:成员编号、length:成员人数
 * @default  320
 * 
 * @param ShowEnemyNameOnHateGauge
 * @text 展示敌名（仇恨程度）
 * @parent ---HateGauge---
 * @type boolean
 * @on 是
 * @off 否
 * @desc 仇恨程度中展示敌名么？
 * @default  true
 * 
 * @help
 * ============================================================================
 * 插件功能
 * ============================================================================
 * 
 * 敌方攻击仇恨值最高成员。
 * 仇恨值伴随战斗行动变化。
 * 
 * ============================================================================
 * 插件命令
 * ============================================================================
 *  - v1.10
 * ShowHateLine
 *   展示仇恨条。
 * HideHateLine
 *   隐藏仇恨条。
 *  - v1.13
 * ShowEnemyHateList
 *   展示敌方列表。
 * HideEnemyHateList
 *   隐藏敌方列表。
 * ShowHateGauge
 *   展示仇恨程度。
 * HideHateGauge
 *   隐藏仇恨程度。
 * 
 * ============================================================================
 * 自动累计仇恨值
 * ============================================================================
 * 
 * 角色对敌人使用技能或物品、目标对使用者增长仇恨值。
 * 针对敌方的仇恨值增长行动：
 *   HP・MP伤害、减益Buff施加、Buff解除、附加状态
 * 
 * 角色对队友使用技能或物品、以该当队友为目标的敌人
 * 对使用者增长仇恨值。
 * 针对己方的仇恨值增长行动：
 *   HP治疗、附加状态、状态解除、Buff加持
 * 
 * 借助插件参数设定公式计算仇恨增长数值。
 * 计算公式、
 * ----------------------------------------------------------------------------
 * HP伤害  （仅限对象为敌）  ： damage
 * MP伤害  （仅限对象为敌）  ： MPDamage
 * 治疗点（仅限对象为友）： healPoint
 * 技能释放者                      ： a, user
 * 技能目标                  ： b, target
 * 仇恨增长敌                  ： enemy
 * 变量                                ： v
 * ----------------------------------------------------------------------------
 * 可以运用。
 * 
 * 技能释放者、目标、敌、变量与技能的伤害公式相同。
 * 例１：释放者的最大HP
 *         user.mhp
 * 例２：编号为12的变量
 *         v[12]
 * 
 * 吸收HP・MP的攻击伤害、仇恨增长2倍。
 * 
 * ============================================================================
 * 「拉仇恨率」的性质变化
 * ============================================================================
 * 
 * 「特殊能力值 拉仇恨率」将有助于增长仇恨值。
 * 综上所述、可以制作有助于拉仇恨的装备或状态。
 * 
 * ============================================================================
 * 仇恨条
 * ============================================================================
 * 
 * 插件参数展示仇恨条设定为1时、侧视中可展示仇恨条。
 * 展示是、请在img/system文件夹中放入"hateline.png" 素材。
 * 本图片将纵向拉伸展示。
 * 
 * ============================================================================
 * 状态仇恨增长公式
 * ============================================================================
 * 
 * 状态备注栏：
 *   <HATE_formula: 式>
 *     标记本标签的状态无论是敌方还是己方附加或解除都将增长仇恨值。
 * 
 *     例如、默认防御行动、根据插件参数以自己为目标的敌人应当增长仇恨值
 *     防御的状态备注栏中写入<HATE_formula:0>的话仇恨将不会增长。
 * 
 *   <HATE_remove_formula: 公式>
 *     本标记可以设定己方解除状态时的仇恨值增长公式。
 *     状态附加或接触时相要不同仇恨计算公式时可使用。
 * 
 *   <HATE_property: 性质>
 *     默认情况、给予敌方增益状态、己方减益状态也将增长仇恨值、
 *     た時もヘイトが増加しますが、借助本标签设定的状态
 *     可以根据不同对象相应不增长仇恨。
 * 
 *     ========================================================================
 *     可写入性质内容类别：
 *     ------------------------------------------------------------------------
 *     good    : 只有本状态附加至伙伴时方才增长本人仇恨值。
 *     neutral : 不增长仇恨值。
 *     bad     : 本状态附加至敌方时、
 *               己方相同状态解除时方才增长本人仇恨值。
 *     ========================================================================
 * 
 * ============================================================================
 * 影响仇恨值的技能、物品
 * ============================================================================
 * 
 * 可制作增减仇恨值的技能或物品。
 * 
 * 技能、物品备注栏：
 *   <HATE_control: 由谁, 向谁, 公式>
 *     ========================================================================
 *    「由谁」的部分可写入类别:
 *     ------------------------------------------------------------------------
 *     user          : 使用者是敌人、该敌人增长仇恨值。
 *     target        : 技能目标是敌人、该目标增长仇恨值。
 *     whoHateUser   : 使用者是角色、以该角色为目标的敌人增长仇恨值。
 *     whoHateTarget : 技能目标是角色、以该角色为目标的敌人增长仇恨值。
 *     all           : 敌方全员增长仇恨值。
 *                     技能范围为敌方全员的技能标注上写入上述target的标签。
 *                     仇恨值计算在每次发动技能效果时执行。
 *     exceptUser    : 技能使用者为敌人、使用者除外全部敌人增长仇恨值。
 *     exceptTarget  : 技能目标为敌人、目标敌人除外全部敌人增长仇恨值。
 *     ========================================================================
 * 
 *     ========================================================================
 *    「向谁」的部分可写入类别
 *     ------------------------------------------------------------------------
 *     user          : 技能使用者为角色时、该角色被增长仇恨值。
 *     target        : 技能目标为角色时、目标角色被增长仇恨值。
 *     exceptUser    : 技能使用者为角色时、该角色除外全队被增长仇恨值。
 *     targetsTarget : 技能目标为敌人时、该敌人的攻击目标角色被增长仇恨值。
 *     ========================================================================
 * 
 *     计算公式、除上述之外
 *     ------------------------------------------------------------------------
 *     亦可写入被仇恨的角色 ： actor
 *     ------------------------------------------------------------------------
 *     当计算结果为负数时仇恨值同步减弱。
 *     本标签可重复设定多个技能。
 *     需要注意的是、第1回合写入标签敌人攻击的的目标角色改变的话、
 *     「由谁」「向谁」的判断结果将同步变化。
 * 
 * --- 例 ---
 * 「挑拨」
 * 对敌单体发动技能、目标对本人的仇恨值为敌人攻击力 × 12 翻倍增长
 * <HATE_control:target, user, enemy.atk * 12>
 * 
 * 「隐匿」
 * 对自身发动技能、来自敌方全员的仇恨为本人敏捷性 × 4 翻倍减弱
 * <HATE_control:all, user, actor.agi * -4>
 * 
 * 「掩护」
 * 对队友单体发动技能、以该队友为攻击目标的敌人
 * 将会对发动者产生该发动者最大HP一半的仇恨增长、
 * 敌方全员对该队友的仇恨为发动者最大HP4分之1比例减弱
 * <HATE_control:whoHateTarget, user, user.mhp / 2>
 * <HATE_control:all, target, -user.mhp / 4>
 * 
 * 「集中火力号令」（敌方专用）
 * 对敌单体发动技能、敌方全员对各自攻击目标增长50仇恨值
 * <HATE_control: all, target, 50>
 * 
 * 「诱敌之笛」（物品）
 * 对敌单体使用物品、敌方全员对己方全队的仇恨值为
 * 使用者魔法攻击力 × 8翻倍增长
 * <HATE_control: all, target, user.mat * 8>
 * 
 * ============================================================================
 * 不累计仇恨值技能、物品
 * ============================================================================
 * 
 * 技能、物品备注栏：
 *   <HATE_no>
 *     本插件可以使技能造成伤害不增长仇恨值。
 *     上述有关仇恨值增减标签的效果依旧有效。
 * 
 * ============================================================================
 * 不累计仇恨值的敌人状态 - v1.03
 * ============================================================================
 * 
 * 例如、「睡眠」等无法把握持续回合的状态、
 * 始终累计仇恨值或许会令人困扰。
 * 
 * 状态备注栏：
 *   <HATE_cantHate>
 *     写入本标签、附加该当状态的敌人将不会因此变动仇恨值。
 * 
 * ============================================================================
 * 仇恨查看方法
 * ============================================================================
 * 
 * 插件参数 调试模式 设定为 ON 时增长多少仇恨数值、
 * 借助F8快捷键呼出 Developer Tools 在Console修改。
 * 
 * 另外、 调试模式 设定为 ON 插件参数中仇恨增长公式不合理时
 * 亦可通过Console修改。
 * 
 * 尽管可以查看增长后仇恨数值、查看仇恨累计值需要一捏捏复杂操作。
 * 
 * 仇恨累计值可写入Game_Enemy狼_hates脚本命令进行查看、
 * 狼的位置写入角色相应ID。
 * 
 * 查看当前仇恨累计值
 * 打开Developer Tools中 Sources 标签、点击右上的 Watch Expressions 的＋
 * 找到$gameTroop。
 * 点击$gameTroop左侧偏右三角即可查看内容、翻查_enemies。
 * （大概率在最上端）
 * 查看_enemies内容、或许只能看见敌人的数字编号、这实际上是攻击目标。
 * 将_hates打开翻查、左侧紫色数字即为角色ID、
 * 右侧青色文字则为当前仇恨累计值。
 * 
 * ============================================================================
 * 攻击者除外仇恨值减弱 - v1.06
 * ============================================================================
 * 
 * 遇到持久战、拉开了仇恨值差距、这将使得局面一边倒回天乏力。
 * 因此、增设了某名成员增长仇恨值、其余成员仇恨值减弱的功能。
 * 可在以下插件参数中设定。
 * 
 * ReduceOthersHate
 *   设定是否开启本功能。默认为OFF状态。
 * 
 * OthersHateRateFormula
 *   本公式的计算结果与仇恨值挂钩。
 *   计算公式、
 *   --------------------------------------------------------------------------
 *   仇恨增长值           ： point
 *   敌人                 ： enemy
 *   减弱仇恨的角色 ： actor
 *   --------------------------------------------------------------------------
 * 
 * ---例---
 * 默认情况下
 * (100 - (point / enemy.atk)) / 100
 * 
 * 攻击者增长敌人攻击力4倍的仇恨值、
 * (100 - 4) / 100 = 0.96
 * 攻击者除外其余成员的当前仇恨值变为0.96倍。
 * 
 * 攻击者增长敌人攻击力15倍的仇恨值、
 * (100 - 15) / 100 = 0.85
 * 攻击者除外其余成员的当前仇恨值变为0.85倍。
 * 
 * 调试模式 设定为 ON 时、展示攻击者除外全员仇恨数值。
 * 
 * ============================================================================
 * 攻击仇恨排位第2及以下的角色 - v1.09
 * ============================================================================
 * 
 * 技能备注栏：
 *   <HATE_target: x>
 *     攻击仇恨排名第x位的成员。
 *   例：
 *   <HATE_target: 3>
 *     攻击仇恨排名第3位的成员。队伍仅有2人则默认攻击排行榜第2。
 * 
 * 
 * ============================================================================
 * 敌方列表、队伍列表 - v1.13
 * ============================================================================
 * 
 * ○敌方列表
 *   查看成为敌人攻击目标的各角色仇恨值窗口。
 * 
 * ◆展示项目
 * ・攻击目标角色名字
 * ・敌方全员的
 *   ・名字
 *   ・攻击目标角色仇恨排位（仇恨图标）
 *   ・攻击目标校色仇恨程度
 * 
 * ○仇恨程度
 *   查看目标敌人或行动中敌人针对各角色仇恨值窗口。
 * 
 * ◆展示项目
 * ・目标敌人名字
 * ・角色全员的
 *   ・名字
 *   ・该当角色的仇恨排位（仇恨图标）
 *   ・该当角色的仇恨程度
 * 
 * 借助插件参数可进行各项设定。
 * 插件参数中的ON、OFF项为功能开关。
 * （请详细参照综上插件参数）
 * 
 * ============================================================================
 * YEP_BattleAICore.js的功能扩展
 * ============================================================================
 * 
 * YEP_BattleAICore.js是由Yanfly制作的设定敌方智能行动模式的插件。
 * AB_EnemyHate.js在此基础上添加了仇恨系统的功能。
 * 利用本功能请在插件管理界面将AB_EnemyHate.js放置于YEP_BattleAICore.js的下方。
 * 
 * 追加条件:
 * HATE ELEMENT X case
 * HATE stat PARAM eval
 * HATE STATE === state name
 * HATE STATE !== state name
 * 
 * 在YEP_BattleAICore.js的功能基础上开头加上"HATE "即可。
 * 开头加上"HATE "后、可查看仇恨值最高角色的状态。
 * 此处的条件对目标无法生效。
 * 
 * 追加目标:
 * HATE
 * 
 * 写入条件的角色中仇恨值最高者成为攻击目标。
 * 
 * --- 例 ---
 * 如若仇恨值最高的角色处于中毒状态攻击该角色、
 * 否则也将进入中毒状态
 * <AI Priority>
 * HATE State === Poison: Attack, HATE
 * Always: Poison, HATE
 * </AI Priority>
 * 
 * 如若仇恨值最高的角色HP处于70%以下进行双重攻击、
 * 否则该角色将遭受攻击
 * <AI Priority>
 * HATE HP% param <= 70%: Dual Attack, HATE
 * Always: Attack, HATE
 * </AI Priority>
 * 
 * ============================================================================
 * 更新履历
 * ============================================================================
 * 
 * 版本 1.18
 *   修复隐藏敌方列表时、仇恨下降情况下出现报错中断游戏的漏洞。
 * 
 * 版本 1.17
 *   修复战斗中无法开关仇恨程度和敌方列表显示与否的漏洞。
 *   另外战败或逃走时将不再展示仇恨程度。
 * 
 * 版本 1.16
 *   针对MZ移植
 * 
 * 版本 1.15
 *   修复攻击时报错并且游戏中断问题。
 * 
 * 版本 1.14
 * 修复仇恨条设定为ON时依然不展示仇恨条问题。
 * 战斗中以敌人为攻击目标时可展示该敌人仇恨程度。
 * 战斗结束后、不再展示仇恨程度。
 * 可设定不展示仇恨程度中敌人名。
 * 择选敌方角色时不展示额外内容。
 * 
 * 版本 1.13
 *   增设队伍列表和敌方列表。
 *   
 * 
 * 版本 1.12
 *   修复仇恨值为负时游戏中断问题。
 * 
 * 版本 1.11
 *   导入YEP_BattleStatusWindow时、正试图战斗仇恨条画面拉伸。
 * 
 * 版本 1.10
 *   增设仇恨条展示与否的插件参数开关。
 * 
 * 版本 1.09
 *   加入设定攻击仇恨值排名X位的角色的标签<HATE_target: x>。
 * 
 * 版本 1.08
 *   仇恨值相同时、先攻击距离近的角色。
 *   插件参数仇恨管理「由谁」中增设「使用者除外」「目标除外」、
 *   「向谁」中增设「使用者除外」「目标除外」。
 * 
 * 版本 1.07
 *   修复仇恨条显示怪异问题。
 *   插件参数展示仇恨条设定为ON时、正视图战斗亦能显示。
 * 
 * 版本 1.06
 *   追加对攻击者除外增长仇恨值功能。
 *   更容易出现错误提示。
 * 
 * 版本 1.05
 *   追加MV版本 1.1.0 
 *   杜绝「不包含未使用文件名」hateline.png 漏洞。
 * 
 * 版本 1.04
 *   使复活后敌人可以显示仇恨条。
 * 
 * 版本 1.03
 *   追加状态栏标签<HATE_cantHate>。
 * 
 * 版本 1.02
 *   修正与YEP_BattleEnginCore.js 同时导入时仇恨条千奇百怪问题
 * 
 * 版本 1.01
 *   修正整队加入替换加入队外成员时无法顺畅的漏洞
 *   ※修正后、队伍替换新成员为了能确保成员数据全复原
 *     在插件参数中$gameActors注册该当成员数据是必须的。
 * 
 * 版本 1.00
 *   问世
 * 
 * ============================================================================
 * 利用规则
 * ============================================================================
 * 
 * ・无需署名鸣谢
 * ・可用于商业盈利目的
 * ・可任意编改
 *     不过、请务必保留源代码抬头的许可标识。
 * ・可随意转发
 * ・可用于成人游戏、暴力游戏
 * 
 * 
 * @command ShowHateLine
 * @text 展示仇恨条
 * @desc 战斗中展示仇恨条。
 * 
 * @command HideHateLine
 * @text 隐藏仇恨条
 * @desc 战斗中隐藏仇恨条。
 * 
 * @command ShowEnemyHateList
 * @text 展示敌方列表
 * @desc 战斗中展示角色选择目标敌人的列表。
 * 
 * @command HideEnemyHateList
 * @text 隐藏敌方列表
 * @desc 战斗中隐藏角色选择目标敌人的列表。
 * 
 * @command ShowHateGauge
 * @text 展示仇恨计量
 * @desc 战斗中展示目标敌人对某位角色的仇恨程度。
 * 
 * @command HideHateGauge
 * @text 隐藏仇恨计量
 * @desc 战斗中隐藏目标敌人对某位角色的仇恨程度。
 * 
 */

(function() {
	'use strict';
	const pluginName = "ABMZ_EnemyHate";
	var parameters = PluginManager.parameters('ABMZ_EnemyHate');
	var displayHateLine = eval(parameters['DisplayHateLine']);
	var HateDebugMode = eval(parameters['DebugMode']);
	var DamageHateFormula = (parameters['DamageHateFormula'] || 0);
	var MPDamageHateFormula = (parameters['MPDamageHateFormula'] || 0);
	var HealHateFormula = (parameters['HealHateFormula'] || 0);
	var BuffHateFormula = (parameters['BuffHateFormula'] || 0);
	var DebuffHateFormula = (parameters['DebuffHateFormula'] || 0);
	var StateToEnemyHateFormula = (parameters['StateToEnemyHateFormula'] || 0);
	var StateToActorHateFormula = (parameters['StateToActorHateFormula'] || 0);
	var RemoveStateHateFormula = (parameters['RemoveStateHateFormula'] || 0);
	var ReduceOthersHate = eval(parameters['ReduceOthersHate'] == 1);
	var OthersHateRateFormula = (parameters['OthersHateRateFormula'] || 0);
	var ShowEnemyList = eval(parameters['ShowEnemyList']);
	var EnemyListX = Number(parameters['EnemyListX']);
	var EnemyListY = Number(parameters['EnemyListY']);
	var HateIconList =parameters['HateIconList'].split(' ');
	var EnemyListFontSize = Number(parameters['EnemyListFontSize']);
	var EnemyListLineHeight = Number(parameters['EnemyListLineHeight']);
	var EnemyListWidth = Number(parameters['EnemyListWidth']);
	var HateGaugeColor1 = Number(parameters['HateGaugeColor1']);
	var HateGaugeColor2 = Number(parameters['HateGaugeColor2']);
	var ShowHateGauge = eval(parameters['ShowHateGauge']);
	var HateGaugeWidth = Number(parameters['HateGaugeWidth']);
	var HateGaugeX = String(parameters['HateGaugeX']);
	var HateGaugeY = String(parameters['HateGaugeY']);
	var ShowEnemyNameOnHateGauge = eval(parameters['ShowEnemyNameOnHateGauge']);

//=============================================================================
// Game_Interpreter
//=============================================================================

//	const pluginName = "ABMZ_EnemyHate";

	PluginManager.registerCommand(pluginName, "ShowHateLine", args => {
			$gameSystem.setDispHateLine(true);
	});

	PluginManager.registerCommand(pluginName, "HideHateLine", args => {
			$gameSystem.setDispHateLine(false);
	});

	PluginManager.registerCommand(pluginName, "ShowEnemyHateList", args => {
			$gameSystem.setDispEnemyHateList(true);
			if ($gameParty.inBattle()) {
				
		    SceneManager._scene._ABEnemyListWindow.show();
			}
	});

	PluginManager.registerCommand(pluginName, "HideEnemyHateList", args => {
			$gameSystem.setDispEnemyHateList(false);
			if ($gameParty.inBattle()) {
		    SceneManager._scene._ABEnemyListWindow.hide();
			}
	});

	PluginManager.registerCommand(pluginName, "ShowHateGauge", args => {
			$gameSystem.setDispHateGauge(true);
	});

	PluginManager.registerCommand(pluginName, "HideHateGauge", args => {
			$gameSystem.setDispHateGauge(false);
			if ($gameParty.inBattle()) {
				SceneManager._scene.hideHateWindow();
			}
	});


	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.call(this, command, args);
		if (command === 'ShowHateLine') {
			$gameSystem.setDispHateLine(true);
		} else if (command === 'HideHateLine') {
			$gameSystem.setDispHateLine(false);
		} else if (command === 'ShowEnemyHateList') {
			$gameSystem.setDispEnemyHateList(true);
			if ($gameParty.inBattle()) {
		    SceneManager._scene._ABEnemyListWindow.show();
			}
		} else if (command === 'HideEnemyHateList') {
			$gameSystem.setDispEnemyHateList(false);
			if ($gameParty.inBattle()) {
		    SceneManager._scene._ABEnemyListWindow.hide();
			}
		} else if (command === 'ShowHateGauge') {
			$gameSystem.setDispHateGauge(true);
		} else if (command === 'HideHateGauge') {
			$gameSystem.setDispHateGauge(false);
			if ($gameParty.inBattle()) {
				SceneManager._scene.hideHateWindow();
			}
		}
	};

// v1.10
//=============================================================================
// Game_System
//=============================================================================

	Game_System.prototype.initDispHateLine = function() {
		this._dispHateLine = displayHateLine;
	};

	Game_System.prototype.setDispHateLine = function(value) {
		this._dispHateLine = value;
	};

	Game_System.prototype.isDispHateLine = function() {
		if (this._dispHateLine === undefined) this.initDispHateLine();
		return this._dispHateLine;
	};



	Game_System.prototype.initDispEnemyHateList = function() {
		this._dispEnemyHateList = ShowEnemyList;
	};

	Game_System.prototype.setDispEnemyHateList = function(value) {
		this._dispEnemyHateList = value;
	};

	Game_System.prototype.isDispEnemyHateList = function() {
		if (this._dispEnemyHateList === undefined) this.initDispEnemyHateList();
		return this._dispEnemyHateList;
	};



	Game_System.prototype.initDispHateGauge = function() {
		this._dispHateGauge = ShowHateGauge;
	};

	Game_System.prototype.setDispHateGauge = function(value) {
		this._dispHateGauge = value;
	};

	Game_System.prototype.isDispHateGauge = function() {
		if (this._dispHateGauge === undefined) this.initDispHateGauge();
		return this._dispHateGauge;
	};


//=============================================================================
// Game_Enemy
//=============================================================================
	var Game_Enemy_prototype_setup = Game_Enemy.prototype.setup;
	Game_Enemy.prototype.setup = function(enemyId, x, y) {
		Game_Enemy_prototype_setup.call(this, enemyId, x, y);
		this._hates = [];
		var allActors = $gameActors._data;
		var enemy = this;
		allActors.forEach(function(actor) {
			if (!actor) return;
			enemy._hates[actor.actorId()] = Math.randomInt(10);
		});
	};

	Game_Enemy.prototype.hates = function() {
		return this._hates;
	};

	Game_Enemy.prototype.hate = function(index, point) {
		this._hates[index] += point;
		if (this._hates[index] < 0) this._hates[index] = 0;
		if (HateDebugMode) {
			console.log(this.name() + "の" + $gameActors.actor(index).name() + "へのヘイトが" + point + "ポイント増加");
		}
		if (point > 0) this.reduceOthersHates(index, point);
	};

	Game_Enemy.prototype.reduceOthersHates = function(index, point) {
		if (!ReduceOthersHate) return;
		var enemy = this;
		var actors = $gameParty.battleMembers();
		actors.forEach(function(actor) {
			if (actor.actorId() == index) return;
			var rate = 1;
			try {
				rate = eval(OthersHateRateFormula);
				if (isNaN(rate)) {
					throw new Error("「" + OthersHateRateFormula + "」の計算結果は数値ではありません。");
				}
			} catch (e) {
				if (HateDebugMode) {
					console.log(e.toString());
				}
				rate = 1;
			}
			enemy.multiplyHate(actor.actorId(), rate);
		});
	};

	Game_Enemy.prototype.hateOrder = function(actorId) {
		var hatesArray = [];
		
		if (typeof this._hates === "undefined") {
			return false;
		}
		var hates = this._hates;
		var max = -99999999999999999999;
	
		$gameParty.aliveMembers().forEach(function(member) {
			if (!member.isBattleMember()) return;
			var i = member.actorId();
			
			var hateObj = {};
			hateObj.i = i;
			hateObj.hate = hates[i];
			hatesArray.push(hateObj);
		});

		// 降順ソート
		hatesArray.sort(function(a,b){
			if (a.hate > b.hate) return -1;
			if (a.hate < b.hate) return 1;
			return 0;
		});
		var hateOrder = null;
		hatesArray.forEach(function(hateObj, i) {
			if (hateObj.i == actorId) {
				hateOrder = i;
				return;
			}
		});
		return hateOrder;
		
	};

	Game_Enemy.prototype.multiplyHate = function(index, rate) {
		if (rate < 0) return;
		var hate = this._hates[index] * rate;
		hate = Math.round(hate);
		this._hates[index] = hate;
		if (HateDebugMode) {
			console.log(this.name() + "の" + $gameActors.actor(index).name() + "へのヘイトが" + hate + "になった");
		}
	};

	Game_Enemy.prototype.hateTarget = function() {
		return $gameParty.hateTarget(this._hates);
	}

	Game_Enemy.prototype.hateTargetNumber = function(no) {
		return $gameParty.hateTargetNumber(this._hates, no);
	}

	Game_Enemy.prototype.hateTargetOf = function(group) {
		if (typeof this._hates === "undefined") {
			return false;
		}
		var hates = this._hates;
		var max = -99999999999999999999;
		var mainTarget;
		group.forEach(function(member) {
			if (!member.isActor()) return false;
			if (!member.isBattleMember()) return false;
			var i = member.actorId();
			if (max < hates[i]) {
				max = hates[i];
				mainTarget = member;
			}
		});
		return mainTarget;
	}

	Game_Enemy.prototype.canHate = function() {
		return !this._states.some(function(stateId){
			var state = $dataStates[stateId];
			if (!state) return false;
			if (state.meta.HATE_cantHate) return true;
			return false;
		});
	};

//=============================================================================
// Game_Party
//=============================================================================
	
	Game_Party.prototype.hateTarget = function(hates) {
		// 
		var max = -1;
		var mainTarget;
		this.aliveMembers().forEach(function(member) {
			if (!member.isBattleMember()) return;
			var i = member.actorId();
			if (max < hates[i]) {
				max = hates[i];
				mainTarget = member;
			}
		});
		return mainTarget;
	};
	Game_Party.prototype.hateTargetNumber = function(hates, no) {
		var hatesArray = [];
		var targetIndex = 0;

		var mainTarget;
		this.aliveMembers().forEach(function(member) {
			if (!member.isBattleMember()) return;
			var i = member.actorId();
			
			var hateObj = {};
			hateObj.i = i;
			hateObj.hate = hates[i];
			hatesArray.push(hateObj);
		});

		// 降順ソート
		hatesArray.sort(function(a,b){
			if (a.hate > b.hate) return -1;
			if (a.hate < b.hate) return 1;
			return 0;
		});
		
		// hatesArrayの(no-1)番目のiを選択。
		// (no-1)番目がない場合最後のインデックスを選択。
		if ((no-1) < hatesArray.length) {
			targetIndex = hatesArray[no - 1].i;
		} else {
			targetIndex = hatesArray[hatesArray.length - 1].i;
		}
		mainTarget = $gameActors.actor(targetIndex);
		return mainTarget;
		
	};
	var _Game_Party_prototype_refresh = Game_Party.prototype.refresh;
	Game_Party.prototype.refresh = function() {
		// 
		_Game_Party_prototype_refresh.call(this);
		if (this.inBattle()) {
			SceneManager._scene.initHateGaugeWindows();
		}
	};
	var _Game_Party_prototype_addActor = Game_Party.prototype.addActor;
	Game_Party.prototype.addActor = function(actorId) {
		_Game_Party_prototype_addActor.call(this, actorId);
		if (this.inBattle()) {
			SceneManager._scene.initHateGaugeWindows();
		}
	};
	var _Game_Party_prototype_removeActor = Game_Party.prototype.removeActor;
	Game_Party.prototype.removeActor = function(actorId) {
		_Game_Party_prototype_removeActor.call(this, actorId);
		
		if (this.inBattle()) {
			SceneManager._scene.initHateGaugeWindows();
		}
	};
//=============================================================================
// Game_Actor
//=============================================================================

	Game_Actor.prototype.whoHateMe = function() {
		var who = [];
		var enemies = $gameTroop.aliveMembers();
		for (var i=0,l=enemies.length; i < l; i++) {
			if (enemies[i].hateTarget() == this) {
				who.push(enemies[i]);
			}
		}
		return who;
	}
	
//=============================================================================
// Sprite_Battler
//=============================================================================

var _Sprite_Battler_prototype_updatePosition = Sprite_Battler.prototype.updatePosition;

Sprite_Actor.prototype.updatePosition = function() {
	if ($gameSystem.isSideView()) {
		_Sprite_Battler_prototype_updatePosition.call(this);
		return;
	}
	if (SceneManager._scene._statusWindow) {
		var statusWindow = SceneManager._scene._statusWindow;
		this.x = this._homeX - SceneManager._scene._partyCommandWindow.width + 80 + statusWindow.x;
		this.y = this._homeY;
	}
};

//=============================================================================
// Game_Action
//=====
	// 上書き
	Game_Action.prototype.targetsForOpponents = function() {
		var targets = [];
		var unit = this.opponentsUnit();
		if (this.isForRandom()) {
			for (var i = 0; i < this.numTargets(); i++) {
				targets.push(unit.randomTarget());
			}
		} else if (this.isForOne()) {
			if (this._targetIndex < 0) {
				// 使用者がアクターだった場合
				if (this._subjectActorId > 0) {
					targets.push(unit.randomTarget());

				// 使用者が敵キャラだった場合
				} else {
					// v1.09
					if (this._item.object().meta.HATE_target) {
						var no = Number(this._item.object().meta.HATE_target);
						targets.push(unit.hateTargetNumber(this.subject().hates(), no));
					} else {
						targets.push(unit.hateTarget(this.subject().hates()));
					}
				}
			} else {
				targets.push(unit.smoothTarget(this._targetIndex));
			}
		} else {
			targets = unit.aliveMembers();
		}
		return targets;
	};

	Game_Action.prototype.confusionTarget = function() {
		switch (this.subject().confusionLevel()) {
		case 1:
			if (this._subjectActorId > 0)
				return this.opponentsUnit().randomTarget();
			return this.opponentsUnit().hateTarget(this.subject().hates());
		case 2:
			if (Math.randomInt(2) === 0) {
			return this.opponentsUnit().randomTarget();
			}
			return this.friendsUnit().randomTarget();
		default:
			return this.friendsUnit().randomTarget();
		}
	};

	var Game_Action_prototype_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
		Game_Action_prototype_apply.call(this, target);
		this.varyHate(target);
	};

	Game_Action.prototype.varyHate = function(target) {
		if (this._subjectActorId > 0) {
			if (target.isActor()) {
				if (!this._item.object().meta.HATE_no) {
					this.actorToActorVaryHate(target);
				}
			} else {
				if (!this._item.object().meta.HATE_no) {
					this.actorToEnemyVaryHate(target);
				}
			}
		}
		this.controlHate(target);
	};

	Game_Action.prototype.actorToEnemyVaryHate = function(target) {
		var result = target.result();
		var user = this.subject();
		var a = user;
		var b = target;
		var enemy = target;
		var v = $gameVariables._data;
		var hate = 0;

		var damage = Math.max(result.hpDamage, 0);
		var MPDamage = Math.max(result.mpDamage, 0);

		if (!enemy.canHate()) return;

		if (damage) {
			var add = 0;
			try {
				add = eval(DamageHateFormula);

				if (isNaN(add)) {
					throw new Error("「" + DamageHateFormula + "」の計算結果は数値ではありません。");
				}
			} catch (e) {
				if (HateDebugMode) {
					console.log(e.toString());
				}
				add = 0;
			}
			hate += add;
		}

		if (MPDamage) {
			var add = 0;
			try {
				add = eval(MPDamageHateFormula);
				if (isNaN(add)) {
					throw new Error("「" + MPDamageHateFormula + "」の計算結果は数値ではありません。");
				}
			} catch (e) {
				if (HateDebugMode) {
					console.log(e.toString());
				}
				add = 0;
			}
			hate += add;
		}

		if (result.drain) hate = Math.floor(hate * 2);

		var addedStateObjects = result.addedStateObjects();
		addedStateObjects.forEach(function(state) {
			var property = state.meta.HATE_property;
			if (property && (property.match(/good/) || property.match(/neutral/))) return;
			var HATE_formula = state.meta.HATE_formula;
			var add = 0;
			if (HATE_formula) {
				try {
					add = eval(HATE_formula);
					if (isNaN(add)) {
					throw new Error("「" + HATE_formula + "」の計算結果は数値ではありません。");
					}
				} catch (e) {
					if (HateDebugMode) {
						console.log(e.toString());
					}
					add = 0;
				}
			} else {
				try {
					add = eval(StateToEnemyHateFormula);
					if (isNaN(add)) {
					throw new Error("「" + StateToEnemyHateFormula + "」の計算結果は数値ではありません。");
					}
				} catch (e) {
					if (HateDebugMode) {
						console.log(e.toString());
					}
					add = 0;
				}
			}
			hate += add;
		});

		if (result.addedDebuffs.length + result.removedBuffs.length > 0) {
			var add = 0;
			try {
				add = eval(DebuffHateFormula);
				if (isNaN(add)) {
					throw new Error("「" + DebuffHateFormula + "」の計算結果は数値ではありません。");
				}
			} catch (e) {
				if (HateDebugMode) {
					console.log(e.toString());
					add = 0;
				}
			}
			add = (result.addedDebuffs.length + result.removedBuffs.length) * add;
			hate += add;
		}

		hate = Math.ceil(hate * user.tgr);

		target.hate(user.actorId(), hate);
		/*if (HateDebugMode) {
			console.log(target.name() + "の" + user.name() + "へのヘイトが" + hate + "ポイント増加");
		}*/
	
	};



	Game_Action.prototype.actorToActorVaryHate = function(target) {
		var result = target.result();
		var user = this.subject();
		var a = user;
		var b = target;
		var enemies = target.whoHateMe();
		var v = $gameVariables._data;

		var healPoint = Math.max(-result.hpDamage, 0);

		for (var i=0, l=enemies.length; i<l; i++) {
			var hate = 0;
			var enemy = enemies[i];
	
			if (!enemy.canHate()) continue;

			if (healPoint) {
				var add = 0;
				try {
					add = eval(HealHateFormula);
					if (isNaN(add)) {
						throw new Error("「" + HealHateFormula + "」の計算結果は数値ではありません。");
					}
				} catch (e) {
					if (HateDebugMode) {
						console.log(e.toString());
					}
					add = 0;
				}
				hate += add;
			}

			var addedStateObjects = result.addedStateObjects();
			addedStateObjects.forEach(function(state) {
				var property = state.meta.HATE_property;
				if (property && (property.match(/bad/) || property.match(/neutral/))) return;
				var HATE_formula = state.meta.HATE_formula;
				var add = 0;
				if (HATE_formula) {
					try {
						add = eval(HATE_formula);
						if (isNaN(add)) {
							throw new Error("「" + HATE_formula + "」の計算結果は数値ではありません。");
						}
					} catch (e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						add = 0;
					}
				} else {
					try {
						add = eval(StateToActorHateFormula);
						if (isNaN(add)) {
							throw new Error("「" + StateToActorHateFormula + "」の計算結果は数値ではありません。");
						}
					} catch (e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						add = 0;
					}
				}
				hate += add;
			});

			var removedStateObjects = result.removedStateObjects();
			removedStateObjects.forEach(function(state) {
				var property = state.meta.HATE_property;
				if (property && (property.match(/good/) || property.match(/neutral/))) return;
				var HATE_formula = state.meta.HATE_formula;
				var HATE_remove_formula = state.meta.HATE_remove_formula;
				var add = 0;
				
				if (HATE_remove_formula) {
					try {
						add = eval(HATE_remove_formula);
						if (isNaN(add)) {
							throw new Error("「" + HATE_remove_formula + "」の計算結果は数値ではありません。");
						}
					} catch (e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						add = 0;
					}
				} else if (HATE_formula) {
					try {
						add = eval(HATE_formula);
						if (isNaN(add)) {
							throw new Error("「" + HATE_formula + "」の計算結果は数値ではありません。");
						}
					} catch (e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						add = 0;
					}
				} else {
					try {
						add = eval(RemoveStateHateFormula);
						if (isNaN(add)) {
							throw new Error("「" + RemoveStateHateFormula + "」の計算結果は数値ではありません。");
						}
					} catch (e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						add = 0;
					}
				}
				hate += add;
			});

			if (result.addedBuffs.length > 0) {
				var add = 0;
				try {
					add = eval(BuffHateFormula);
					if (isNaN(add)) {
						throw new Error("「" + BuffHateFormula + "」の計算結果は数値ではありません。");
					}
				} catch (e) {
					if (HateDebugMode) {
						console.log(e.toString());
					}
					add = 0;
				}
				add = result.addedBuffs.length * add;
				hate += add;
			}

			hate = Math.ceil(hate * user.tgr);

			enemy.hate(user.actorId(), hate);
			/*if (HateDebugMode) {
				console.log(enemy.name() + "の" + user.name() + "へのヘイトが" + hate + "ポイント増加");
			}*/
		}
	};

	Game_Action.prototype.controlHate = function(target) {
		
		var result = target.result();
		var user = this.subject();
		var a = user;
		var b = target;
		var v = $gameVariables._data;
		var enemies = [];
		var actors = [];
		var hate;
		var action = this;

		var damage = Math.max(result.hpDamage, 0);
		var MPDamage = Math.max(result.mpDamage, 0);

		var hateControls = this._item.object().hateControls;
		for (var i = 0; i < hateControls.length; i++) {
			var HATE_enemy = hateControls[i].enemy;
			var HATE_actor = hateControls[i].actor;
			var HATE_formula = hateControls[i].formula;
			var enemies = this.haterEnemies(target, HATE_enemy);
			var actors = this.hatedActors(target, HATE_actor);
			
			enemies.forEach(function(enemy) {
				if (!enemy.canHate()) return;
				actors.forEach(function(actor) {
					try {
						hate = eval(HATE_formula);
						if (isNaN(hate)) {
							throw new Error("「" + HATE_formula + "」の計算結果は数値ではありません。");
						}
					} catch(e) {
						if (HateDebugMode) {
							console.log(e.toString());
						}
						hate = 0;
					}
					hate = Math.ceil(hate * actor.tgr);
					if (hate != 0) action.makeSuccess(target);
					enemy.hate(actor.actorId(), hate);
				});
			});
		}
	};

	Game_Action.prototype.haterEnemies = function(target, HATE_enemy) {

		if (HATE_enemy.match(/^user$/i)) {
			return this.enemiesUser(target);

		} else if (HATE_enemy.match(/^target$/i)) {
			return this.enemiesTarget(target);

		} else if (HATE_enemy.match(/^whoHateUser$/i)) {
			return this.enemiesWhoHateUser(target);

		} else if (HATE_enemy.match(/^whoHateTarget$/i)) {
			return this.enemiesWhoHateTarget(target);

		} else if (HATE_enemy.match(/^all$/i)) {
			return $gameTroop.aliveMembers();

		} else if (HATE_enemy.match(/^exceptUser$/i)) {
			return this.enemiesExceptUser(target);

		} else if (HATE_enemy.match(/^exceptTarget$/i)) {
			return this.enemiesExceptTarget(target);

		}
		return [];
	};

	Game_Action.prototype.enemiesUser = function(target) {
		var enemies = [];
		var user = this.subject();
		if (user.isEnemy()) enemies.push(user);
		return enemies;
	};

	Game_Action.prototype.enemiesTarget = function(target) {
		var enemies = [];
		if (target.isEnemy()) enemies.push(target);
		return enemies;
	};

	Game_Action.prototype.enemiesWhoHateUser = function(target) {
		var enemies = [];
		var user = this.subject();
		if (user.isActor()) {
			enemies = user.whoHateMe();
		}
		return enemies;
	};

	Game_Action.prototype.enemiesWhoHateTarget = function(target) {
		var enemies = [];
		if (target.isActor()) {
			enemies = target.whoHateMe();
		}
		return enemies;
	};

	Game_Action.prototype.enemiesExceptUser = function(target) {
		var enemies = [];
		var user = this.subject();
		if (user.isEnemy()) {
			enemies = $gameTroop.aliveMembers().filter(function(enemy) {
				return enemy != user;
			});
		}
		return enemies;
	};

	Game_Action.prototype.enemiesExceptTarget = function(target) {
		var enemies = [];
		if (target.isEnemy()) {
			enemies = $gameTroop.aliveMembers().filter(function(enemy) {
				return enemy != target;
			});
		}
		return enemies;
	};


	Game_Action.prototype.hatedActors = function (target, HATE_actor) {

		if (HATE_actor.match(/^user$/i)) {
			return this.actorsUser(target);

		} else if (HATE_actor.match(/^target$/i)) {
			return this.actorsTarget(target);

		} else if (HATE_actor.match(/^exceptUser$/i)) {
			return this.actorsExceptUser(target);

		} else if (HATE_actor.match(/^targetsTarget$/i)) {
			return this.actorsTargetsTarget(target);

		}
		return [];
	};

	Game_Action.prototype.actorsUser = function(target) {
		var actors = [];
		var user = this.subject();
		if (user.isActor()) {
			actors.push(user);
		}
		return actors;
	};

	Game_Action.prototype.actorsTarget = function(target) {
		var actors = [];
		if (target.isActor()) {
			actors.push(target);
		}
		return actors;
	};

	Game_Action.prototype.actorsExceptUser = function(target) {
		var actors = [];
		var user = this.subject();
		if (user.isActor()) {
			actors = $gameParty.aliveMembers().filter(function(actor) {
				return actor != user;
			});
		}
		return actors;
	};

	Game_Action.prototype.actorsTargetsTarget = function(target) {
		var actors = [];
		if (target.isEnemy()) {
			actors.push(target.hateTarget());
		}
		return actors;
	};


//=============================================================================
// DataManager
//=============================================================================
	var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
	DataManager.isDatabaseLoaded = function() {
		if (!DataManager_isDatabaseLoaded.call(this)) return false;
		this.processHateNotetags($dataSkills);
		this.processHateNotetags($dataItems);
		return true;
	};

	DataManager.processHateNotetags = function(group) {
		var note1 = /<HATE_control:[ ]*(user|target|whoHateUser|whoHateTarget|all|exceptUser|exceptTarget)[ ]*,[ ]*(user|target|exceptUser|targetsTarget)[ ]*,[ ]*(.+)[ ]*>/i;
		for (var n = 1; n < group.length; n++) {
			var obj = group[n];
			var notedata = obj.note.split(/[\r\n]+/);

			obj.hateControls = [];

			for (var i = 0; i < notedata.length; i++) {
				var line = notedata[i];
				if (line.match(note1)) {
					var control = {};
					control.enemy = RegExp.$1;
					control.actor = RegExp.$2;
					control.formula = RegExp.$3;
					obj.hateControls.push(control);
				}
			}
		}
	};

//=============================================================================
// displayHateLine
//=============================================================================
// v1.10からコメントアウト
//	if(displayHateLine) {
//=============================================================================
// HateLine
//=============================================================================
	
		var HateLine = function() {
			this.initialize.apply(this, arguments);
		};
		HateLine.prototype = Object.create(Sprite.prototype);
		HateLine.prototype.constructer = HateLine;

		HateLine.prototype.initialize = function(enemy, spriteset) {
			Sprite.prototype.initialize.call(this);
			this._enemy = enemy;
			this._spriteset = spriteset;
			this._enemySprite = null;
			this._actorNo = -1;
			this.bitmap = ImageManager.loadSystem("hateline");
			this._ex = 0;
			this._ey = 0;	
			this._ax = 0;
			this._ay = 0;
			this.z = 0;

			this.findEnemySprite();
		};

		HateLine.prototype.findEnemySprite = function() {
			var enemy = this._enemy;
			var enemySprites = this._spriteset._enemySprites;
			for (var i=0,l=enemySprites.length; i < l; i++){
				if (enemySprites[i]._enemy == enemy) {
					this._enemySprite = enemySprites[i];
					break;
				}
			}
		};

		HateLine.prototype.updateBindSprites = function() {
			this.updateBindEnemySprite();
			this.updateBindActorSprite();
		};

		HateLine.prototype.updateBindEnemySprite = function() {
			var sprite = this._enemySprite;
			this._ex = sprite.x;
			this._ey = sprite.y;
		};

		HateLine.prototype.updateBindActorSprite = function() {
			var actor = this._enemy.hateTarget();
			if (actor) {
				if ($gameSystem.isSideView()) {
					var sprite = this._spriteset._actorSprites[actor.index()];
					this._ax = sprite.x;
					this._ay = sprite.y;
				} else {
					this._actorNo = actor.index();
					const rect = SceneManager._scene._statusWindow.itemRectWithPadding(this._actorNo);
					this._ax = rect.x + rect.width/2 + SceneManager._scene._statusWindow.x;
					this._ay = 450;
				}
			}
		};
		HateLine.prototype.updatePosition = function() {
			var dx = this._ex - this._ax;
			var dy = this._ey - this._ay;
			var distance = Math.floor(Math.pow(dx*dx+dy*dy,0.5));

			this.x = this._ax;
			this.y = this._ay;
			this.scale.y = distance / this.height;
			//this.rotation = Math.PI * 3 / 2 + Math.atan(dy/dx);
			this.rotation = Math.atan2(dy,dx) - Math.PI / 2;
		};

		HateLine.prototype.update = function() {
			Sprite.prototype.update.call(this);
			if (this._enemy.isHidden() || this._enemy.isDead()) {
				this.hide();
				return;
			}
			this.show();
			this.updateBindSprites();
			this.updatePosition();
			// v1.10
			this.updateVisible();
		};
		// v1.10
		HateLine.prototype.updateVisible = function() {
			this.visible = $gameSystem.isDispHateLine();
		};


//=============================================================================
// Spriteset_Battle
//=============================================================================
		
		Spriteset_Battle.prototype.createHateLines = function() {
			if (!$gameSystem.isDispHateLine()) return;
			var enemies = $gameTroop.members();
			var hateLines = [];
			var index = this._battleField.getChildIndex(this._enemySprites[0]);
			for (var i = 0,l = enemies.length; i < l; i++) {
				hateLines[i] = new HateLine(enemies[i], this);
				this._battleField.addChildAt(hateLines[i], index);
			}
			this._hateLines = hateLines;
		};
		
		var Spriteset_Battle_prototype_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
		Spriteset_Battle.prototype.createLowerLayer = function() {
			Spriteset_Battle_prototype_createLowerLayer.call(this);
			/*if ($gameSystem.isSideView())*/ this.createHateLines();
		}
		
//	}




//=============================================================================
// Window_ABEnemyList
//=============================================================================



	var Window_ABEnemyList = function() {
		this.initialize.apply(this, arguments);
	};

	Window_ABEnemyList.prototype = Object.create(Window_Base.prototype);
	Window_ABEnemyList.prototype.constructor = Window_ABEnemyList;

	Window_ABEnemyList.prototype.initialize = function(x, y, width, height) {
		height = 9*EnemyListLineHeight + 18*2;
		var rect = new Rectangle(x, y, width, height);
		Window_Base.prototype.initialize.call(this, rect);
		this._actor = null;
		this._enemy = null;
		this._flag = "";
    this.contents.fontSize = EnemyListFontSize;
	};
	Window_ABEnemyList.prototype.lineHeight = function() {
		return EnemyListLineHeight;
	};
	var _Window_ABEnemyList_prototype_show = Window_ABEnemyList.prototype.show;
	Window_ABEnemyList.prototype.show = function() {
		if (!$gameSystem.isDispEnemyHateList()) return;
		_Window_ABEnemyList_prototype_show.call(this);
	};

	Window_ABEnemyList.prototype.setActorAndShow = function(actor) {
		this._actor = actor;
		this._flag = "actor";
		this.refresh();
		this.show();
	};

	Window_ABEnemyList.prototype.setEnemyAndShow = function(enemy) {
		//this._enemy = enemy;
		//this._flag = "enemy";
		//this.refresh();
		//this.show();
	};

	Window_ABEnemyList.prototype.refresh = function() {
		if (this._flag == "actor") {
			this.showEnemyList();
		} else if (this._flag == "enemy") {
			this.ShowHateGauge();
		} else {
			this.contents.clear();
		}
	};


	Window_ABEnemyList.prototype.showEnemyList = function() {
		this.contents.clear();
		var actor = this._actor;
		if (!actor) return;
		var cw = this.contents.width;
		if (!$gameSystem.isDispEnemyHateList()) return;
		this.drawText(actor.name(), 0, 0, cw);
		var y = this.lineHeight();
		var enemies = $gameTroop.aliveMembers();
		for (var i=0, l=enemies.length; i<l; i++) {
			var enemy = enemies[i];
			var hates = enemy.hates();
			var maxHate = -9999999;
			for (var j=0,jl=hates.length; j<jl; j++) {
				if (maxHate < hates[j]) {
					maxHate = hates[j];
				}
			}
			var hate = enemy._hates[actor.actorId()];
			var hateOrder = enemy.hateOrder(actor.actorId());
			// console.log(hateOrder);
			this.drawIcon(Number(HateIconList[hateOrder]), 0, y);
			var color1 = ColorManager.textColor(HateGaugeColor1);
			var color2 = ColorManager.textColor(HateGaugeColor2);
			var rate = hate/maxHate;
			if (!rate) rate = 0;
			this.drawGauge(32, y, cw-32, rate, color1, color2);
			this.drawText(enemy.name(), 32, y, cw-32);
			y += this.lineHeight();
		}
	};
	Window_ABEnemyList.prototype.ShowHateGauge = function() {
		this.contents.clear();
		var enemy = this._enemy;
		if (!enemy) return;
		if (!$gameSystem.isDispEnemyHateList()) return;
		this.drawText(enemy.name(), 0, 0, cw);
		var y = this.lineHeight();
		var actors = $gameParty.battleMembers();
		var hates = enemy.hates();
		var maxHate = -9999999;
		for (var i=0,l=hates.length; i<l; i++) {
			if (maxHate < hates[i]) {
				maxHate = hates[i];
			}
		}
		var hatesArray = [];
		$gameParty.aliveMembers().forEach(function(member) {
			if (!member.isBattleMember()) return;
			var i = member.actorId();
			
			var hateObj = {};
			hateObj.i = i;
			hateObj.hate = hates[i];
			hatesArray.push(hateObj);
		});

		// 降順ソート
		hatesArray.sort(function(a,b){
			if (a.hate > b.hate) return -1;
			if (a.hate < b.hate) return 1;
			return 0;
		});
		for (var i=0, l=hatesArray.length; i<l; i++) {
			var hate = hatesArray[i].hate;
			var actorId = hatesArray[i].i;
			var actor = $gameActors.actor(actorId);
			
			/*if (actor.isDead()) {
				y += this.lineHeight();
				continue;
			}*/
			var hate = enemy._hates[actorId];
			var hateOrder = enemy.hateOrder(actorId);
			// console.log(hateOrder);
			this.drawIcon(Number(HateIconList[hateOrder]), 0, y);
			var color1 = ColorManager.textColor(HateGaugeColor1);
			var color2 = ColorManager.textColor(HateGaugeColor2);
    	this.drawActorCharacter(actor, cw-40, y+40, 32, 32);

			var rate = hate/maxHate;
			if (!rate) rate = 0;
			this.drawGauge(32, y, cw-32, rate, color1, color2);
			this.drawText(actor.name(), 32, y, cw-32);
			y += this.lineHeight();
		}
	};



//=============================================================================
// MVからの雑な移行
//=============================================================================

Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 8;
    this.contents.fillRect(x, gaugeY, width, 6, ColorManager.textColor(19));
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};

//=============================================================================
// Window_ABHateGauge
//=============================================================================


	var Window_ABHateGauge = function() {
		this.initialize.apply(this, arguments);
	};

	Window_ABHateGauge.prototype = Object.create(Window_Base.prototype);
	Window_ABHateGauge.prototype.constructor = Window_ABHateGauge;

	Window_ABHateGauge.prototype.initialize = function(x, y, width, height) {
		//height = 1*EnemyListLineHeight;
		height = 60;
		var rect = new Rectangle(x, y, width, height);
		Window_Base.prototype.initialize.call(this, rect);
		this._actor = null;
		this._enemy = null;
		this.anchor = 1;
		this.setBackgroundType(2);
    this.contents.fontSize = EnemyListFontSize;
		this.show();
	};
	Window_ABHateGauge.prototype.lineHeight = function() {
		return EnemyListLineHeight;
	};
	Window_ABHateGauge.prototype.standardPadding = function() {
		return 0;
	};

	var Window_ABHateGauge_prototype_show = Window_ABHateGauge.prototype.show;
	Window_ABHateGauge.prototype.show = function() {
		if (!$gameSystem.isDispHateGauge()) return;
		Window_ABHateGauge_prototype_show.call(this);
	};
	
	Window_ABHateGauge.prototype.setActor = function(actor) {
		this._actor = actor;
		this.refresh();
	};

	Window_ABHateGauge.prototype.setEnemyAndShow = function(enemy) {
		this._enemy = enemy;
		this.show();
		this.refresh();
		this.open();
	};

	Window_ABHateGauge.prototype.refresh = function() {
		this.contents.clear();
		var enemy = this._enemy;
		var cw = this.contents.width;
		if (!$gameSystem.isDispHateGauge()) return;
		if (!enemy) return;
		var actor = this._actor;
		if (!actor) return;

		var hates = enemy.hates();
		var hate = enemy._hates[actor._actorId];
		var maxHate = -9999999;
		for (var i=0,l=hates.length; i<l; i++) {
			if (maxHate < hates[i]) {
				maxHate = hates[i];
			}
		}
		if (maxHate < 0) maxHate = 1;
		var hateOrder = enemy.hateOrder(actor.actorId());
		// console.log(hateOrder);
		this.drawIcon(Number(HateIconList[hateOrder]), 0, 0);
		var color1 = ColorManager.textColor(HateGaugeColor1);
		var color2 = ColorManager.textColor(HateGaugeColor2);
    //this.drawActorCharacter(actor, cw-40, y+40, 32, 32);
		var rate = hate/maxHate;
		if (!rate) rate = 0;

		
		this.drawGauge(0, 0,  cw-32, hate/maxHate, color1, color2);
	
		if (ShowEnemyNameOnHateGauge) {
			this.drawText(enemy.name(), 32, 0, cw-32);
		}
		//y += this.lineHeight();
	
	};
var _Window_StatusBase_prototype_placeGauge = Window_StatusBase.prototype.placeGauge;
Window_StatusBase.prototype.placeGauge = function(actor, type, x, y, enemy) {
		if (type != "hate") {
			_Window_StatusBase_prototype_placeGauge.call(this, actor, type, x, y);
			return;
		}
    const key = "actor%1-gauge-%2-enemy%3".format(actor.actorId(), type, enemy.index());
    const sprite = this.createInnerSprite(key, Sprite_Gauge);
    sprite.setup(actor, type);
		sprite.setEnemy(enemy);
    sprite.move(x, y);
    sprite.show();
};

//=============================================================================
// Sprite_Gauge
//=============================================================================
var _Sprite_Gauge_prototype_valueColor = Sprite_Gauge.prototype.valueColor;
Sprite_Gauge.prototype.valueColor = function() {
    switch (this._statusType) {
        case "hate":
            return ColorManager.normalColor();
        default:
            return _Sprite_Gauge_prototype_valueColor.call(this);
    }
};
var _Sprite_Gauge_prototype_gaugeColor1 = Sprite_Gauge.prototype.gaugeColor1;
Sprite_Gauge.prototype.gaugeColor1 = function() {
    switch (this._statusType) {
        case "hate":
            return ColorManager.textColor(HateGaugeColor1);
        default:
            return _Sprite_Gauge_prototype_gaugeColor1.call(this);
    }
};
var _Sprite_Gauge_prototype_gaugeColor2 = Sprite_Gauge.prototype.gaugeColor2;
Sprite_Gauge.prototype.gaugeColor2 = function() {
    switch (this._statusType) {
        case "hate":
            return ColorManager.textColor(HateGaugeColor2);
        default:
            return _Sprite_Gauge_prototype_gaugeColor1.call(this);
    }
};
var _Sprite_Gauge_prototype_currentValue = Sprite_Gauge.prototype.currentValue;
Sprite_Gauge.prototype.currentValue = function() {
    if (this._battler && this._enemy) {
        switch (this._statusType) {
            case "hate":
                return this._enemy._hates[this._battler._actorId];
        }
    }
    return _Sprite_Gauge_prototype_currentValue.call(this);
};
var Sprite_Gauge_prototype_currentMaxValue = Sprite_Gauge.prototype.currentMaxValue;
Sprite_Gauge.prototype.currentMaxValue = function() {
    if (this._battler && this._enemy) {
        switch (this._statusType) {
            case "hate":
								const hates = enemy.hates();
								let maxHate = -9999999;
								for (let i=0,l=hates.length; i<l; i++) {
									if (maxHate < hates[i]) {
										maxHate = hates[i];
									}
								}
								return maxHate;
        }
    }
    return Sprite_Gauge_prototype_currentMaxValue.call(this);
};

Sprite_Gauge.prototype.setEnemy = function(enemy) {
	this._enemy = enemy;
    this._statusType = statusType;
    this._value = this.currentValue();
    this._maxValue = this.currentMaxValue();
    this.updateBitmap();
}
//=============================================================================
// Scene_Battle
//=============================================================================
	var Scene_Battle_prototype_createAllWindows = 
		Scene_Battle.prototype.createAllWindows;
	Scene_Battle.prototype.createAllWindows = function() {
		Scene_Battle_prototype_createAllWindows.call(this);
		this.createHateWindows();
	};

	Scene_Battle.prototype.createHateWindows = function() {
	//	if ($gameSystem.isDispEnemyHateList()) {
			this._ABEnemyListWindow = new Window_ABEnemyList(EnemyListX, EnemyListY, EnemyListWidth, Window_Base.prototype.fittingHeight(9));
			this.addWindow(this._ABEnemyListWindow);
	//	}
		if (!$gameSystem.isDispEnemyHateList()) this._ABEnemyListWindow.hide();
		this.initHateGaugeWindows();
		//if ($gameSystem.isDispHateGauge()) {
		//	this.initHateGaugeWindows();
		//}
	};

	Scene_Battle.prototype.initHateGaugeWindows = function() {
		//console.log("initgauge");
	/*	if (!$gameSystem.isDispHateGauge()) {
			return;
		}*/
		if (this.hateGaugeWindows) {
			var enemy = this.hateGaugeWindows[0]._enemy;
			for (var i=0,l=this.hateGaugeWindows.length; i<l; i++) {
				this._windowLayer.removeChild(this.hateGaugeWindows[i]);
			}
		}
		this.hateGaugeWindows = [];
		var actors = $gameParty.battleMembers()
		for (var i=0,l=actors.length; i<l; i++) {
			var actor = actors[i];
			var index = i;
			var length = l;
			var x = eval(HateGaugeX);
			var y = eval(HateGaugeY);
			var w = HateGaugeWidth;
			var h = 40;

			this.hateGaugeWindows[i] = new Window_ABHateGauge(x, y, w, h);
			this.hateGaugeWindows[i].setActor(actor);
			if (enemy) {
				this.hateGaugeWindows[i].setEnemyAndShow(enemy);
			}
			this.addWindow(this.hateGaugeWindows[i]);
			this.hateGaugeWindows[i].hide();
		}
	}
var _Scene_Battle_prototype_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
Scene_Battle.prototype.startPartyCommandSelection = function() {
    _Scene_Battle_prototype_startPartyCommandSelection.call(this);
		if (this.hateGaugeWindows) this.hideHateWindow();
};

	var _Scene_Battle_prototype_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
	Scene_Battle.prototype.startActorCommandSelection = function() {
		_Scene_Battle_prototype_startActorCommandSelection.call(this);
		if (!$gameSystem.isDispEnemyHateList()) return;
		this._ABEnemyListWindow.setActorAndShow(BattleManager.actor());
		if (this.hateGaugeWindows) this.hideHateWindow();
	};
	var _Scene_Battle_prototype_onSkillCancel = Scene_Battle.prototype.onSkillCancel;
	Scene_Battle.prototype.onSkillCancel = function() {
    _Scene_Battle_prototype_onSkillCancel.call(this);
		if (!$gameSystem.isDispEnemyHateList()) return;
		this._ABEnemyListWindow.setActorAndShow(BattleManager.actor());
		//if (this.hateGaugeWindows) this.hideHateWindow();
	};
	var _Scene_Battle_prototype_onItemCancel = Scene_Battle.prototype.onItemCancel;
	Scene_Battle.prototype.onItemCancel = function() {
		_Scene_Battle_prototype_onItemCancel.call(this);
		if (!$gameSystem.isDispEnemyHateList()) return;
		this._ABEnemyListWindow.setActorAndShow(BattleManager.actor());
		//if (this.hateGaugeWindows) this.hideHateWindow();
	};
	var _Scene_Battle_prototype_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel;
	Scene_Battle.prototype.onEnemyCancel = function() {
		_Scene_Battle_prototype_onEnemyCancel.call(this);
		if (this.hateGaugeWindows) this.hideHateWindow();
	};
	var _Scene_Battle_prototype_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
	Scene_Battle.prototype.onEnemyOk = function() {
		_Scene_Battle_prototype_onEnemyOk.call(this);
		if (this.hateGaugeWindows) this.hideHateWindow();
	};


	var _Scene_Battle_prototype_endCommandSelection = Scene_Battle.prototype.endCommandSelection;
	Scene_Battle.prototype.endCommandSelection = function() {
    _Scene_Battle_prototype_endCommandSelection.call(this);
		if (!$gameSystem.isDispEnemyHateList()) return;
		this._ABEnemyListWindow.hide();
		//if (this.hateGaugeWindows) this.hideHateWindow();
	};


	Scene_Battle.prototype.selectActor = function(actor) {
		if (this._ABEnemyListWindow) this._ABEnemyListWindow.setActorAndShow(actor);
	};
	Scene_Battle.prototype.selectEnemy = function(enemy) {
		if (!enemy) return;
		if (this._ABEnemyListWindow) this._ABEnemyListWindow.setEnemyAndShow(enemy);
		if (this.hateGaugeWindows) this.setEnemyToAllHateGaugeWindow(enemy);
	};
	Scene_Battle.prototype.refreshHateWindow = function() {
		if (this._ABEnemyListWindow) this._ABEnemyListWindow.refresh();
		if (this.hateGaugeWindows) this.refreshAllHateGaugeWindow();
	};

	
	Scene_Battle.prototype.setEnemyToAllHateGaugeWindow = function(enemy) {
		if (!this.hateGaugeWindows) return;
		for (var i=0,l=this.hateGaugeWindows.length; i<l;i++) {
			this.hateGaugeWindows[i].setEnemyAndShow(enemy);
		}
	};
	Scene_Battle.prototype.refreshAllHateGaugeWindow = function() {
		if (!this.hateGaugeWindows) return;
		for (var i=0,l=this.hateGaugeWindows.length; i<l;i++) {
			this.hateGaugeWindows[i].refresh();
			//this.hateGaugeWindows[i].show();
		}
	};
	Scene_Battle.prototype.hideHateWindow = function() {
		if (!this.hateGaugeWindows) return;
		for (var i=0,l=this.hateGaugeWindows.length; i<l;i++) {
			this.hateGaugeWindows[i].hide();
			
		}
	};

	var _Scene_Battle_prototype_commandSkill = Scene_Battle.prototype.commandSkill;
	Scene_Battle.prototype.commandSkill = function() {
		_Scene_Battle_prototype_commandSkill.call(this);
		if (!$gameSystem.isDispEnemyHateList()) return;
		this._ABEnemyListWindow.hide();
	};
	var _Scene_Battle_prototype_commandItem = Scene_Battle.prototype.commandItem;
	Scene_Battle.prototype.commandItem = function() {
	    _Scene_Battle_prototype_commandItem.call(this);
			if (!$gameSystem.isDispEnemyHateList()) return;
			this._ABEnemyListWindow.hide();
	};
//=============================================================================
// BattleManager
//=============================================================================
	var _BattleManager_changeActor = BattleManager.changeActor;
	BattleManager.changeActor = function(newActorIndex, lastActorActionState) {
		_BattleManager_changeActor.call(this, newActorIndex, lastActorActionState);
		if (!this.actor()) return;
    SceneManager._scene.selectActor(this.actor());
	};
var _BattleManager_startAction = BattleManager.startAction;
BattleManager.startAction = function() {
    _BattleManager_startAction.call(this);
		var subject = this._subject;
		var target = this._targets[0]
		if (subject.isActor()) {
			SceneManager._scene.selectActor(subject);
		}
		if (subject.isEnemy()) {
			SceneManager._scene.selectEnemy(subject);
		}
		this.updateHateGauge(subject, target);
};
var _BattleManager_invokeAction = BattleManager.invokeAction;
BattleManager.invokeAction = function(subject, target) {
	_BattleManager_invokeAction.call(this, subject, target);
	
	    SceneManager._scene.refreshHateWindow();
		this.updateHateGauge(subject, target);
};
var _BattleManager_processVictory = BattleManager.processVictory

BattleManager.processVictory = function() {
		_BattleManager_processVictory.call(this);
    SceneManager._scene.hideHateWindow();
    SceneManager._scene._ABEnemyListWindow.hide();
};
var _BattleManager_processDefeat = BattleManager.processDefeat;

BattleManager.processDefeat = function() {
	_BattleManager_processDefeat.call(this);
	SceneManager._scene.hideHateWindow();
    SceneManager._scene._ABEnemyListWindow.hide();
};

var _BattleManager_processAbort = BattleManager.processAbort;

BattleManager.processAbort = function() {
	_BattleManager_processAbort.call(this);
	SceneManager._scene.hideHateWindow();
    SceneManager._scene._ABEnemyListWindow.hide();
};
var _BattleManager_processEscape = BattleManager.processEscape;

BattleManager.processEscape = function() {
	_BattleManager_processEscape.call(this);
	SceneManager._scene.hideHateWindow();
    SceneManager._scene._ABEnemyListWindow.hide();
};
	BattleManager.updateHateGauge = function(subject, target) {
		if (!target) return;
		if (target.isEnemy()) {
			SceneManager._scene.selectEnemy(target);
		}
		
	};

//=============================================================================
// Window_BattleEnemy
//=============================================================================

var _Window_BattleEnemy_prototype_select = Window_BattleEnemy.prototype.select;
Window_BattleEnemy.prototype.select = function(index) {
    _Window_BattleEnemy_prototype_select.call(this, index);
    SceneManager._scene.selectEnemy(this.enemy());
};
//=============================================================================
// Window_BattleActor
//=============================================================================

var _Window_BattleActor_prototype_select = Window_BattleActor.prototype.select;
Window_BattleActor.prototype.select = function(index) {
    _Window_BattleActor_prototype_select.call(this, index);
    SceneManager._scene.selectActor(this.actor());
};

//=============================================================================
// 遊び
//=============================================================================




})();
//=============================================================================
// YEP_BattleAICore.js
//=============================================================================



if ("AIManager" in window) {
	AIManager_passAIConditions = AIManager.passAIConditions;
	AIManager.passAIConditions = function(line) {
		
		// HATE ELEMENT
		if (line.match(/HATE[ ]ELEMENT(.*)/i)) {
			return this.conditionElementOfHateTarget();
		}
		// HATE PARAM EVAL
		if (line.match(/HATE[ ](.*)[ ]PARAM[ ](.*)/i)) {
			var paramId = this.getParamId(String(RegExp.$1));
			var condition = String(RegExp.$2);
			return this.conditionParamOfHateTargetEval(paramId, condition);
		}
		// HATE STATE === X
		if (line.match(/HATE[ ]STATE[ ]===[ ](.*)/i)) {
			return this.conditionHateStateHas(String(RegExp.$1));
		}
		// HATE STATE !== X
    if (line.match(/HATE[ ]STATE[ ]!==[ ](.*)/i)) {
      return this.conditionHateStateNot(String(RegExp.$1));
    }
		return AIManager_passAIConditions.call(this, line);
	};

	AIManager.conditionElementOfHateTarget = function() {
		var line = this._origCondition;
		if (line.match(/HATE[ ]ELEMENT[ ](\d+)[ ](.*)/i)) {
			var elementId = parseInt(RegExp.$1);
			var type = String(RegExp.$2).toUpperCase();
		} else if (line.match(/HATE[ ]ELEMENT[ ](.*)[ ](.*)/i)) {
			var elementId = Yanfly.ElementIdRef[String(RegExp.$1).toUpperCase()];
			var type = String(RegExp.$2).toUpperCase();
		} else {
			return false;
		}
		var user = this.battler();
		var target = user.hateTarget();
		var flag = this.elementRateMatch(target, elementId, type);
		if (flag)  {
			var group = this.getActionGroup();
			this.setProperTarget(group);
		}
		return flag;
	};

	AIManager.conditionParamOfHateTargetEval = function(paramId, condition) {
		var action = this.action();
		var item = action.item();
		var user = this.battler();
		var s = $gameSwitches._data;
		var v = $gameVariables._data;
		condition = condition.replace(/(\d+)([%％])/g, function() {
			return this.convertIntegerPercent(parseInt(arguments[1]));
		}.bind(this));
		if (paramId < 0) return false;
		if (paramId >= 0 && paramId <= 7) {
			condition = 'target.param(paramId) ' + condition;
		} else if (paramId === 8) {
			condition = 'target.hp ' + condition;
		} else if (paramId === 9) {
			condition = 'target.mp ' + condition;
		} else if (paramId === 10) {
			condition = 'target.hp / target.mhp ' + condition;
		} else if (paramId === 11) {
			condition = 'target.hp / target.mmp ' + condition;
		} else if (paramId === 12) {
			condition = 'target.level ' + condition;
		}
		var target = user.hateTarget();
		var flag = eval(condition);
		if (flag) {
			var group = this.getActionGroup();
			this.setProperTarget(group);
		}
		return flag;
	};

	AIManager.conditionHateStateHas = function(condition) {
		if (condition.match(/HATE[ ]STATE[ ](\d+)/i)) {
			var stateId = parseInt(RegExp.$1);
		} else {
			var stateId = Yanfly.StateIdRef[condition.toUpperCase()];
			if (!stateId) return false;
		}
		if (!$dataStates[stateId]) return false;

		var user = this.battler();
		var target = user.hateTarget();
		var flag = target.hasState(stateId);
		if (flag) {
			var group = this.getActionGroup();
			this.setProperTarget(group);
		}
		return flag;
	};

	AIManager.conditionHateStateNot = function(condition) {
		if (condition.match(/HATE[ ]STATE[ ](\d+)/i)) {
			var stateId = parseInt(RegExp.$1);
		} else {
			var stateId = Yanfly.StateIdRef[condition.toUpperCase()];
			if (!stateId) return false;
		}
		if (!$dataStates[stateId]) return false;

		var user = this.battler();
		var target = user.hateTarget();
		var flag = target.notState(stateId);
		if (flag) {
			var group = this.getActionGroup();
			this.setProperTarget(group);
		}
		return flag;
	};

	var AIManager_setProperTarget = AIManager.setProperTarget;
	
	AIManager.setProperTarget = function(group) {
		var action = this.action();
		var user = this.battler();
		var randomTarget = group[Math.floor(Math.random() * group.length)];
		if (group.length <= 0) return action.setTarget(randomTarget.index());
		var line = this._aiTarget.toUpperCase();
		if (line.match(/HATE/i)) {
			if (action.isForOpponent()) {
				var target = user.hateTargetOf(group);
				if (target) {
					return action.setTarget(target.index());
				}
			}
			return action.setTarget(randomTarget.index());
		}

		return AIManager_setProperTarget.call(this, group);
	}
}