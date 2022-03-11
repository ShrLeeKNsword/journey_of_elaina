//-----------------------------------------------------------------------------
// Window_BattleSkill
//
// The window for selecting a skill to use on the battle screen.

/**
 * 窗口战斗技能  
 * 在战斗画面上选择要使用的技能的窗口
 */
function Window_BattleSkill() {
    this.initialize(...arguments);
}

Window_BattleSkill.prototype = Object.create(Window_SkillList.prototype);
Window_BattleSkill.prototype.constructor = Window_BattleSkill;

/**
 * 初始化
 * @param {Rectangle} rect 矩形
 */
Window_BattleSkill.prototype.initialize = function(rect) {
    Window_SkillList.prototype.initialize.call(this, rect);
    this.hide();
};

/**
 * 显示
 */
Window_BattleSkill.prototype.show = function() {
    this.selectLast();
    this.showHelpWindow();
    Window_SkillList.prototype.show.call(this);
};

/**
 * 隐藏
 */
Window_BattleSkill.prototype.hide = function() {
    this.hideHelpWindow();
    Window_SkillList.prototype.hide.call(this);
};

