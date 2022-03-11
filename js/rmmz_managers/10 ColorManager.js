//-----------------------------------------------------------------------------
// ColorManager
//
// The static class that handles the window colors.

/**
 * 颜色管理器
 * 
 * 处理窗口颜色的静态类。
 */
function ColorManager() {
    throw new Error("This is a static class");
}

/**
 * 加载窗口皮肤
 */
ColorManager.loadWindowskin = function() {
    this._windowskin = ImageManager.loadSystem("Window");
};

/**
 * 文字颜色
 * @param {number} n 选择值
 */
ColorManager.textColor = function(n) {
    const px = 96 + (n % 8) * 12 + 6;
    const py = 144 + Math.floor(n / 8) * 12 + 6;
    return this._windowskin.getPixel(px, py);
};

/**
 * 普通颜色
 */
ColorManager.normalColor = function() {
    return this.textColor(0);
};

/**
 * 系统颜色
 */
ColorManager.systemColor = function() {
    return this.textColor(16);
};

/**
 * 危机颜色
 */
ColorManager.crisisColor = function() {
    return this.textColor(17);
};

/**
 * 死亡颜色
 */
ColorManager.deathColor = function() {
    return this.textColor(18);
};

/**
 * 仪表背景颜色
 */
ColorManager.gaugeBackColor = function() {
    return this.textColor(19);
};

/**
 * hp仪表颜色1
 */
ColorManager.hpGaugeColor1 = function() {
    return this.textColor(20);
};

/**
 * hp仪表颜色2
 */
ColorManager.hpGaugeColor2 = function() {
    return this.textColor(21);
};

/**
 * mp仪表颜色1
 */
ColorManager.mpGaugeColor1 = function() {
    return this.textColor(22);
};

/**
 * mp仪表颜色2
 */
ColorManager.mpGaugeColor2 = function() {
    return this.textColor(23);
};

/**
 * mp消耗颜色
 */
ColorManager.mpCostColor = function() {
    return this.textColor(23);
};

/**
 * 能力提升颜色
 */
ColorManager.powerUpColor = function() {
    return this.textColor(24);
};

/**
 * 能力下降颜色
 */
ColorManager.powerDownColor = function() {
    return this.textColor(25);
};

/**
 * ct仪表颜色1
 */
ColorManager.ctGaugeColor1 = function() {
    return this.textColor(26);
};

/**
 * ct仪表颜色2
 */
ColorManager.ctGaugeColor2 = function() {
    return this.textColor(27);
};

/**
 * tp仪表颜色1
 */
ColorManager.tpGaugeColor1 = function() {
    return this.textColor(28);
};

/**
 * tp仪表颜色2
 */
ColorManager.tpGaugeColor2 = function() {
    return this.textColor(29);
};


/**
 * tp消耗颜色
 */
ColorManager.tpCostColor = function() {
    return this.textColor(29);
};

/**
 * 填充颜色
 */
ColorManager.pendingColor = function() {
    return this._windowskin.getPixel(120, 120);
};

/**
 * hp颜色
 * @param {Game_Battler} actor 角色
 */
ColorManager.hpColor = function(actor) {
    if (!actor) {
        return this.normalColor();
    } else if (actor.isDead()) {
        return this.deathColor();
    } else if (actor.isDying()) {
        return this.crisisColor();
    } else {
        return this.normalColor();
    }
};

/**
 * mp颜色
 */
ColorManager.mpColor = function(/*actor*/) {
    return this.normalColor();
};

/**
 * tp颜色
 */
ColorManager.tpColor = function(/*actor*/) {
    return this.normalColor();
};

/**
 * 参数改变文字颜色
 * @param {number} change 改变
 */
ColorManager.paramchangeTextColor = function(change) {
    if (change > 0) {
        return this.powerUpColor();
    } else if (change < 0) {
        return this.powerDownColor();
    } else {
        return this.normalColor();
    }
};

/**
 * 伤害颜色
 * @param {number} colorType 颜色种类
 */
ColorManager.damageColor = function(colorType) {
    switch (colorType) {
        case 0: // HP damage
            //hp伤害
            return "#ffffff";
        case 1: // HP recover
            //hp恢复
            return "#b9ffb5";
        case 2: // MP damage
            //MP伤害
            return "#ffff90";
        case 3: // MP recover
            //MP恢复
            return "#80b0ff";
        default:
            //其他
            return "#808080";
    }
};

/**
 * 轮廓颜色
 */
ColorManager.outlineColor = function() {
    return "rgba(0, 0, 0, 0.6)";
};

/**
 * 暗色1
 */
ColorManager.dimColor1 = function() {
    return "rgba(0, 0, 0, 0.6)";
};

/**
 * 暗色2
 */
ColorManager.dimColor2 = function() {
    return "rgba(0, 0, 0, 0)";
};

/**
 * 项目返回颜色1
 */
ColorManager.itemBackColor1 = function() {
    return "rgba(32, 32, 32, 0.5)";
};

/**
 * 项目返回颜色2
 */
ColorManager.itemBackColor2 = function() {
    return "rgba(0, 0, 0, 0.5)";
};

