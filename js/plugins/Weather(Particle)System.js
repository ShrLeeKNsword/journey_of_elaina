// source_name 源素材图片名字，必须位于img/weather/目录下
// spawn_range_x 粒子出生点的横坐标随机范围
// spawn_range_y 粒子出生点的纵坐标随机范围
// anchor_range 粒子图片锚点的随机范围，0.5为以图片的中心为锚点
// move_speed_range_x 粒子的横向移动速度随机范围
// move_speed_range_y 粒子的纵向移动速度随机范围
// scale_range 粒子的尺寸随机范围，暂未考虑单独对横向或者纵向尺寸的随机
// rotate_speed_range 粒子旋转速度随机范围，以弧度为单位，用Math.PI代表π值
// disappear_rect_x 粒子的横向消失点的范围（如果横向速度为正，则粒子在横坐标大于第二个值时消失，否则在小于第一个值时消失）
// disappear_rect_y 粒子的纵向消失点的范围（如果纵向速度为正，则粒子在纵坐标大于第二个值时消失，否则在小于第一个值时消失）
// spawn_interval 粒子每次被刷新后，间隔多少帧才会刷新第二次
// spawn_number 粒子每次被刷新时，创建的粒子数量

function StartTest1() {
    var source_name = "snow"
    var spawn_range_x = [Graphics.width / 2, Graphics.width / 2]
    var spawn_range_y = [Graphics.height / 2, Graphics.height / 2]
    var anchor_range = [0.5, 0.5]
    var move_speed_range_x = [-5, 5]
    var move_speed_range_y = [-5, 5]
    var scale_range = [0.5, 1]
    var rotate_speed_range = [-0.1, 0.1]
    var disappear_rect_x = [0, Graphics.width]
    var disappear_rect_y = [0, Graphics.height]
    var spawn_interval = 60
    var spawn_number = 600
    _MakeWeather(source_name, spawn_range_x, spawn_range_y, move_speed_range_x, move_speed_range_y, scale_range, rotate_speed_range, disappear_rect_x, disappear_rect_y, spawn_interval, anchor_range, spawn_number)
}
function StartTest2() {
    var source_name = "snow"
    var spawn_range_x = [-200, Graphics.width]
    var spawn_range_y = [-100, -200]
    var anchor_range = [0.5, 0.5]
    var move_speed_range_x = [-2, 2]
    var move_speed_range_y = [5, 5]
    var scale_range = [0.5, 1]
    var rotate_speed_range = [-0.1, 0.1]
    var disappear_rect_x = [Graphics.width + 200, Graphics.width + 200]
    var disappear_rect_y = [Graphics.height + 200, Graphics.height + 200]
    var spawn_interval = 120
    var spawn_number = 600
    _MakeWeather(source_name, spawn_range_x, spawn_range_y, move_speed_range_x, move_speed_range_y, scale_range, rotate_speed_range, disappear_rect_x, disappear_rect_y, spawn_interval, anchor_range, spawn_number)
}
function StartTest3() {
    var source_name = "snow"
    var spawn_range_x = [-200, Graphics.width]
    var spawn_range_y = [-100, -200]
    var anchor_range = [0.5, 0.5]
    var move_speed_range_x = [-5, 5]
    var move_speed_range_y = [2, 5]
    var scale_range = [0.5, 1]
    var rotate_speed_range = [-0.1, 0.1]
    var disappear_rect_x = [Graphics.width + 200, Graphics.width + 200]
    var disappear_rect_y = [Graphics.height + 200, Graphics.height + 200]
    var spawn_interval = 120
    var spawn_number = 600
    _MakeWeather(source_name, spawn_range_x, spawn_range_y, move_speed_range_x, move_speed_range_y, scale_range, rotate_speed_range, disappear_rect_x, disappear_rect_y, spawn_interval, anchor_range, spawn_number)
}
function StartTest4() {
    var source_name = "snow"
    var spawn_range_x = [-200, Graphics.width]
    var spawn_range_y = [-100, -200]
    var anchor_range = [0.5, 0.5]
    var move_speed_range_x = [-2, 2]
    var move_speed_range_y = [2, 5]
    var scale_range = [0.5, 1]
    var rotate_speed_range = [-0.1, 0.1]
    var disappear_rect_x = [0, Graphics.width + 200]
    var disappear_rect_y = [0, Graphics.height + 200]
    var spawn_interval = 0
    var spawn_number = 1
    _MakeWeather(source_name, spawn_range_x, spawn_range_y, move_speed_range_x, move_speed_range_y, scale_range, rotate_speed_range, disappear_rect_x, disappear_rect_y, spawn_interval, anchor_range, spawn_number)
}
function StartTest5() {
    var source_name = "snow"
    var spawn_range_x = [Graphics.width+200, Graphics.width+200]
    var spawn_range_y = [0, Graphics.height]
    var anchor_range = [0.5, 0.5]
    var move_speed_range_x = [-20, -10]
    var move_speed_range_y = [0, 0]
    var scale_range = [0.5, 1]
    var rotate_speed_range = [-0.1, 0.1]
    var disappear_rect_x = [-200, Graphics.width + 200]
    var disappear_rect_y = [-200, Graphics.height + 200]
    var spawn_interval = 0
    var spawn_number = 1
    _MakeWeather(source_name, spawn_range_x, spawn_range_y, move_speed_range_x, move_speed_range_y, scale_range, rotate_speed_range, disappear_rect_x, disappear_rect_y, spawn_interval, anchor_range, spawn_number)
}
function StartSnow() {
    var source_name = "snow"
    var spawn_range_x = [-400, Graphics.width]
    var spawn_range_y = [-200, -200]
    var anchor_range = [1, 1]
    var move_speed_range_x = [1, 3]
    var move_speed_range_y = [5, 8]
    var scale_range = [0.5, 1]
    var rotate_speed_range = [-0.1, 0.1]
    var disappear_rect_x = [-200, Graphics.width + 200]
    var disappear_rect_y = [-200, Graphics.height + 200]
    var spawn_interval = 0
    var spawn_number = 1
    _MakeWeather(source_name, spawn_range_x, spawn_range_y, move_speed_range_x, move_speed_range_y, scale_range, rotate_speed_range, disappear_rect_x, disappear_rect_y, spawn_interval, anchor_range, spawn_number)
}
function StopWeather() {
    if (typeof SceneManager._scene.particleMonitor != "undefined") {
        _RemoveFromScene(SceneManager._scene.particleMonitor)
        delete(SceneManager._scene.particleMonitor)
    }
}

// ============================================================================================================
// 主逻辑区
// 如果需要自行定制额外效果（比如让特定类型的粒子最多停留8秒，然后淡出），则在下方增加相关逻辑
// ============================================================================================================

ImageManager.loadWeather = function(filename, hue) {
    return this.loadBitmap('img/weather/', filename, hue, true)
}
function _MakeWeather(source_name, spawn_range_x, spawn_range_y, move_speed_range_x, move_speed_range_y, scale_range, rotate_speed_range, disappear_rect_x, disappear_rect_y, spawn_interval, anchor_range, spawn_number) {
    var image = ImageManager.loadWeather(source_name)
    function MakeSingleParticle() {
        var sprite = new Sprite(image)
        sprite.speedX = _MakeRandomValue(move_speed_range_x[0], move_speed_range_x[1])
        sprite.speedY = _MakeRandomValue(move_speed_range_y[0], move_speed_range_y[1])
        sprite.condX = sprite.speedX > 0
            ? function() { return sprite.x >= sprite.disappearX }
            : function() { return sprite.x <= sprite.disappearX }
        sprite.condY = sprite.speedY > 0
            ? function() { return sprite.y >= sprite.disappearY }
            : function() { return sprite.y <= sprite.disappearY }
        sprite.condCheck = function() { return sprite.condX() || sprite.condY() }
        if (sprite.condCheck()) { return }
        sprite.x = _MakeRandomValue(spawn_range_x[0], spawn_range_x[1])
        sprite.y = _MakeRandomValue(spawn_range_y[0], spawn_range_y[1])
        sprite.anchor.x = sprite.anchor.y = _MakeRandomValue(anchor_range[0], anchor_range[1])
        sprite.scale.y = sprite.scale.x = _MakeRandomValue(scale_range[0], scale_range[1])
        sprite.disappearX = sprite.speedX > 0 ? disappear_rect_x[1] : disappear_rect_x[0]
        sprite.disappearY = sprite.speedY > 0 ? disappear_rect_y[1] : disappear_rect_y[0]
        sprite.rotateSpeed = _MakeRandomValue(rotate_speed_range[0], rotate_speed_range[1])
        sprite.update = function() {
            sprite.x += sprite.speedX
            sprite.y += sprite.speedY
            sprite.rotation += sprite.rotateSpeed
            if (sprite.condCheck()) {
                _RemoveFromScene(sprite)
            }
        }
        _AddToScene(sprite)
    }
    function MakeParticle() {
        if (Graphics.frameCount % (spawn_interval+1) != 0) { return }
        for (var i = 0; i < spawn_number; i++) {
            MakeSingleParticle()
        }
    }
    StopWeather()
    SceneManager._scene.particleMonitor = new Sprite()
    SceneManager._scene.particleMonitor.update = MakeParticle
    _AddToScene(SceneManager._scene.particleMonitor)
}
function _MakeRandomValue(min, max) {
    // 实际上min和max的位置颠倒也不会影响最终结果
    return min + Math.random() * (max - min)
}
function _AddToScene(child) {
    SceneManager._scene.addChild(child)
}
function _RemoveFromScene(child) {
    SceneManager._scene.removeChild(child)
}