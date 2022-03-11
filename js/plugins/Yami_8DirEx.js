//=============================================================================
// Yami_8DirEx.js
//=============================================================================
// [Update History]
// 2016.May.27 Ver1.0.0 First Release
// 2019.Dec.07 Ver1.0.1 Support running under also RPG Maker MZ

/*:
 * @target MV MZ
 * @plugindesc Player can 8-dir move, also touch input movement.
 * @author Sasuke KANNAZUKI, Yami
 *
 * @param dir4 Switch ID
 * @type number
 * @min 0
 * @desc when this ID's switch is true, player moves 4-dir.
 * If set 0, it's always 8-dir.
 * @default 100
 *
 * @help This plugin does not provide plugin commands.
 * This plugin runs under RPG Maker MV and MZ.
 *
 * This plugin enables player 8-dir move.
 *
 * [Summary]
 * This is the extended version of Yami's Yami_8DIR.js.
 * - also at touch input, player moves 8-dir.
 * - when fail to diagonally move, perform straight move.
 * - by a switch, toggle 8-dir and 4-dir easily.
 *
 * [License]
 * Thanks to Yami.
 * This plugin is released under MIT license.
 * http://opensource.org/licenses/mit-license.php
 */
/*:ja
 * @target MV MZ
 * @plugindesc 8方向移動(タッチパネル対応版)
 * @author 神無月サスケ, Yami
 *
 * @param dir4 Switch ID
 * @type number
 * @min 0
 * @desc このIDのスイッチがONの時は 4方向移動になります。
 * 0を指定すると、常に8方向移動になります。
 * @default 100
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * このプラグインは、RPGツクールMVおよびMZに対応しています。
 *
 * このプラグインは、8方向移動を可能にします。
 *
 * ■概要
 * このプラグインは、Yami氏の Yami_8DIR.js の改良版です。
 * - タッチパネルで移動する際も8方向移動を行います。
 * - 斜め移動に失敗した時、直進可能ならそちらの方に進みます。
 * - スイッチの指定で8方向と4方向を切り替えられます。
 *
 * ■ライセンス表記
 * Yami様に謝意を示します。
 * このプラグインは MIT ライセンスで配布されます。
 * ご自由にお使いください。
 * http://opensource.org/licenses/mit-license.php
 */

(function() {

    //
    // process parameters
    //
    var parameters = PluginManager.parameters('Yami_8DirEx');
    var dir4varID = Number(parameters['dir4 Switch ID'] || 100);

    //
    // original routine by Yami
    //
    Game_Player.prototype.isMoveDiagonally = function(direction) {
        return [1, 3, 7, 9].contains(direction);
    };

    Game_Player.prototype.isMoveStraight = function(direction) {
        return [2, 4, 6, 8].contains(direction);
    };

    Game_Character.prototype.getDiagonallyMovement = function(direction) {
        var horz = 0;
        var vert = 0;
        if (direction === 1) {
            horz = 4;
            vert = 2;
        } else if (direction === 3) {
            horz = 6;
            vert = 2;
        } else if (direction === 7) {
            horz = 4;
            vert = 8;
        } else if (direction === 9) {
            horz = 6;
            vert = 8;
        }
        return [horz, vert];
    };

    Game_Player.prototype.processMoveByInput = function(direction) {
        if (this.isMoveStraight(direction)) {
            this.moveStraight(direction);
        } else if (this.isMoveDiagonally(direction)) {
            var diagonal = this.getDiagonallyMovement(direction);
            this.moveDiagonally.apply(this, diagonal);
        }
    };

    //
    // by Sasuke KANNAZUKI
    // when fail to diagonally move, perform straight move.
    //
    var _Game_Player_moveDiagonally = Game_Player.prototype.moveDiagonally;
    Game_Player.prototype.moveDiagonally = function(horz, vert) {
        _Game_Player_moveDiagonally.call(this, horz, vert);
        if (!this.isMovementSucceeded()) {
            // try vertical move
            this.setMovementSuccess(this.canPass(this._x, this._y, vert));
            if (this.isMovementSucceeded()) {
                this.moveStraight(vert);
            }
            // try horizontal move
            this.setMovementSuccess(this.canPass(this._x, this._y, horz));
            if (this.isMovementSucceeded()) {
                this.moveStraight(horz);
            }
        }
    };

    // by Sasuke KANNAZUKI
    // add dir4mode.
    //
    Game_Player.prototype.moveByInput = function() {
        if (!this.isMoving() && this.canMove()) {
            var dir4mode = (!!dir4varID && $gameSwitches.value(dir4varID));
            var direction = dir4mode ? Input.dir4 :Input.dir8;
            if (direction > 0) {
                $gameTemp.clearDestination();
            } else if ($gameTemp.isDestinationValid()){
                var x = $gameTemp.destinationX();
                var y = $gameTemp.destinationY();
                if (dir4mode) {
                    direction = this.findDirectionTo(x, y);
                } else {
                    direction = this.findDiagonalDirectionTo(x, y);
                }
            }
            if (direction > 0) {
                this.processMoveByInput(direction);
            }
        }
    };

    // all following by Sasuke KANNAZUKI
    // also at touch device, diagonal move to the shortest way.
    //
    Game_Map.prototype.diagonalDistance = function(x1, y1, x2, y2) {
        var x = Math.abs(this.deltaX(x1, x2));
        var y = Math.abs(this.deltaY(y1, y2));
        return Math.min(x, y) * 3 / 2 + Math.abs(x - y);
    };

    Game_Character.prototype.findDiagonalDirectionTo = function(goalX, goalY) {
        var searchLimit = this.searchLimit()
        var mapWidth = $gameMap.width();
        var nodeList = [];
        var openList = [];
        var closedList = [];
        var start = {};
        var best = start

        if (this.x === goalX && this.y === goalY) {
            return 0;
        }

        start.parent = null;
        start.x = this.x;
        start.y = this.y;
        start.g = 0;
        start.f = $gameMap.diagonalDistance(start.x, start.y, goalX, goalY);
        nodeList.push(start);
        openList.push(start.y * mapWidth + start.x);

        while (nodeList.length > 0) {
            var bestIndex = 0;
            for (var i = 0; i < nodeList.length; i++) {
                if (nodeList[i].f < nodeList[bestIndex].f) {
                    bestIndex = i;
                }
            }

            var current = nodeList[bestIndex];
            var x1 = current.x;
            var y1 = current.y;
            var pos1 = y1 * mapWidth + x1;
            var g1 = current.g;

            nodeList.splice(bestIndex, 1);
            openList.splice(openList.indexOf(pos1), 1);
            closedList.push(pos1);

            if (current.x === goalX && current.y === goalY) {
                best = current;
                goaled = true;
                break;
            }

           if (g1 >= searchLimit) {
                continue;
            }

            for (var j = 1; j <= 9; j++) {
                if(j === 5) {
                    continue;
                }
                var directions;
                if (this.isMoveDiagonally(j)) {
                    directions = this.getDiagonallyMovement(j);
                } else { 
                    directions = [j, j];
                }
                var horz = directions[0];
                var vert = directions[1];
                var x2 = $gameMap.roundXWithDirection(x1, horz);
                var y2 = $gameMap.roundYWithDirection(y1, vert);
                var pos2 = y2 * mapWidth + x2;

                if (closedList.contains(pos2)) {
                    continue;
                }

                if (this.isMoveStraight(j)) {
                    if (!this.canPass(x1, y1, j)) {
                        continue;
                    }
                } else if (this.isMoveDiagonally(j)) {
                    if (!this.canPassDiagonally(x1, y1, horz, vert)) {
                        continue;
                    }
                }

                var g2 = g1 + 1;
                var index2 = openList.indexOf(pos2);

                if (index2 < 0 || g2 < nodeList[index2].g) {
                    var neighbor;
                    if (index2 >= 0) {
                        neighbor = nodeList[index2];
                    } else {
                        neighbor = {};
                        nodeList.push(neighbor);
                        openList.push(pos2);
                    }
                    neighbor.parent = current;
                    neighbor.x = x2;
                    neighbor.y = y2;
                    neighbor.g = g2;
                    neighbor.f = g2 + $gameMap.diagonalDistance(x2, y2, goalX, goalY);
                    if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                        best = neighbor;
                    }
                }
            }
        }
        var node = best;
        while (node.parent && node.parent !== start) {
            node = node.parent;
        }

        var deltaX1 = $gameMap.deltaX(node.x, start.x);
        var deltaY1 = $gameMap.deltaY(node.y, start.y);
        if (deltaY1 > 0) {
            return deltaX1 === 0 ? 2 : deltaX1 > 0 ? 3 : 1;
        } else if (deltaY1 < 0) {
            return deltaX1 === 0 ? 8 : deltaX1 > 0 ? 9 : 7;
        } else { // deltaY1 === 0
            if (deltaX1 !== 0) {
                return deltaX1 > 0 ? 6 : 4;
            }
        }

        var deltaX2 = this.deltaXFrom(goalX);
        var deltaY2 = this.deltaYFrom(goalY);
        if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
            if(deltaX2 > 0) {
                return deltaY2 === 0 ? 4 : deltaY2 > 0 ? 7 : 1;
            } else if (deltaX2 < 0) {
                return deltaY2 === 0 ? 6 : deltaY2 > 0 ? 9 : 3;
            } else { // deltaX2 === 0
                return deltaY2 === 0 ? 0 : deltaY2 > 0 ? 8 : 2;
            }
        } else {
            if (deltaY2 > 0) {
                return deltaX2 === 0 ? 8 : deltaX2 > 0 ? 7 : 9;
            } else if (deltaY2 < 0) {
                return deltaX2 === 0 ? 2 : deltaX2 > 0 ? 1 : 3;
            } else { // deltaY2 === 0
                return deltaX2 === 0 ? 0 : deltaX2 > 0 ? 4 : 6;
            }
        }
    };
}());
