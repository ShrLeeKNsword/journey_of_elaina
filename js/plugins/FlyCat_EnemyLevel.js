//=============================================================================
// RPG Maker MZ - 敌人等级、名字显示插件
//=============================================================================

/*:
 * @target MZ
 * @plugindesc 给敌人加上等级、显示名字
 * @author 飞猫工作室
 * 
 * @param 等级姓名文字显示开关
 * @type boolean
 * @text 设置是否显示等级姓名
 * @desc 设置是否显示等级姓名（打开为true,关闭为false）
 * @default true
 * 
 * @param 字体X坐标
 * @text 修改字体X坐标位置
 * @desc 修改字体X坐标位置（左为-，右为+）
 * @default -40
 * 
 * @param 字体Y坐标
 * @text 修改字体Y坐标位置
 * @desc 修改字体Y坐标位置（上为-，下为+）
 * @default 0
 *
 * @param 等级文字显示
 * @text 修改等级的显示文字
 * @desc 修改等级的显示文字
 * @default Lv
 * @help
 * 1.在敌人数据库的备注里设置等级属性：<level:n>
 * 2.支持在技能公式里使用敌方的level属性。用法：b.level
 * 3.显示敌人等级姓名
 * 4.承接MV、MZ定制插件  QQ：903516931 
 */
var Imported = Imported || {};
Imported.FlyCat_EnemyLevel = true;

var FlyCat = FlyCat || {};
FlyCat.EnemyLevel = {};
FlyCat.parameters = PluginManager.parameters('FlyCat_EnemyLevel');
FlyCat.FrontX = Number(FlyCat.parameters['字体X坐标'] || -40);
FlyCat.FrontY = Number(FlyCat.parameters['字体Y坐标'] || 0);
FlyCat.LevelText = String(FlyCat.parameters['等级文字显示'] || "Lv ");
FlyCat.LevelButton = FlyCat.parameters['等级姓名文字显示开关'];

Object.defineProperty(Game_Enemy.prototype, "level", {
    get: function () {
        return this._level;
    },
    configurable: true
});

FlyCat.EnemyLevel.Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function (enemyId, x, y) {
    FlyCat.EnemyLevel.Game_Enemy_setup.call(this, enemyId, x, y);
    const enemy = $dataEnemies[enemyId];
    if (enemy) {
        this._level = Number(enemy.meta.level) || 1;

    }
};

Game_Enemy.prototype.name = function () {
    return FlyCat.LevelText + this.level + this.originalName() + (this._plural ? this._letter : "");
};

FlyCat.setBattler = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function (battler) {
    FlyCat.setBattler.call(this, battler);
    const bitmap = new Bitmap(100, 30);
    bitmap.fontSize = 12;
    const name = this._enemy.name();
    bitmap.drawText(name, 0, 0, 100, 30, "left");
    if (this._nameSprite) {
        this.removeChild(this._nameSprite);
        this._nameSprite = null;
    }
    this._nameSprite = new Sprite(bitmap)
    this.addChild(this._nameSprite)


    this._nameSprite.visible = eval(FlyCat.LevelButton);
    this._nameSprite.x = FlyCat.FrontX;
    this._nameSprite.y = FlyCat.FrontY;
};
