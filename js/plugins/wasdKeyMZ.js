//=============================================================================
// wasd利用移動プラグイン
// wasdKeyMZ.js
// Copyright (c) 2020 湿度ケイ
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc wasd移動に対応させます。
 * @author 湿度ケイ
 *
 * @help
 *
 * wasd移動に対応するプラグインです。
 *
 */
(function() {
	Input.keyMapper = {
    //キーマップ
		9: 'tab',       // tab
		13: 'ok',       // enter
		16: 'shift',    // shift
		17: 'control',  // control
		18: 'control',  // alt
		27: 'escape',   // escape
		32: 'ok',       // space
		33: 'pageup',   // pageup
		34: 'pagedown', // pagedown
		37: 'left',     // left arrow
		38: 'up',       // up arrow
		39: 'right',    // right arrow
		40: 'down',     // down arrow
		45: 'escape',   // insert
		81: 'pageup',   // Q
		87: 'pagedown', // W
		88: 'escape',   // X
		90: 'ok',       // Z
		96: 'escape',   // numpad 0
		98: 'down',     // numpad 2
		100: 'left',    // numpad 4
		102: 'right',   // numpad 6
		104: 'up',      // numpad 8
		120: 'debug',    // F9
    //WASDに対応
		65: 'left',     // left arrow
		87: 'up',       // up arrow
		68: 'right',    // right arrow
		83: 'down'     // down arrow
	};
})();
