﻿//-----------------------------------------------------------------------------
// Window_MenuActor
//
// The window for selecting a target actor on the item and skill screens.

function Window_MenuActor() {
    this.initialize(...arguments);
}

Window_MenuActor.prototype = Object.create(Window_MenuStatus.prototype);
Window_MenuActor.prototype.constructor = Window_MenuActor;

/**
 * 初始化
 * @param {Rectangle} rect 矩形
 */
Window_MenuActor.prototype.initialize = function(rect) {
    Window_MenuStatus.prototype.initialize.call(this, rect);
    this.hide();
};

Window_MenuActor.prototype.processOk = function() {
    if (!this.cursorAll()) {
        $gameParty.setTargetActor($gameParty.members()[this.index()]);
    }
    this.callOkHandler();
};

Window_MenuActor.prototype.selectLast = function() {
    this.forceSelect($gameParty.targetActor().index() || 0);
};

Window_MenuActor.prototype.selectForItem = function(item) {
    const actor = $gameParty.menuActor();
    const action = new Game_Action(actor);
    action.setItemObject(item);
    this.setCursorFixed(false);
    this.setCursorAll(false);
    if (action.isForUser()) {
        if (DataManager.isSkill(item)) {
            this.setCursorFixed(true);
            this.forceSelect(actor.index());
        } else {
            this.selectLast();
        }
    } else if (action.isForAll()) {
        this.setCursorAll(true);
        this.forceSelect(0);
    } else {
        this.selectLast();
    }
};

