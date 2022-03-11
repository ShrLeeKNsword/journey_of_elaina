//-----------------------------------------------------------------------------
// ImageManager
//
// The static class that loads images, creates bitmap objects and retains them.

/**
 * 图像管理器
 * 
 * 加载图像，创建位图对象并保留它们的静态类。
 */
function ImageManager() {
    throw new Error("This is a static class");
}

/**
 * 图标宽
 */
ImageManager.iconWidth = 32;
/**
 * 图标高
 */
ImageManager.iconHeight = 32;
/**
 * 脸图宽
 */
ImageManager.faceWidth = 144;
/**
 * 脸图高
 */
ImageManager.faceHeight = 144;

/**
 * 储存
 */
ImageManager._cache = {};
/**
 * 系统
 */
ImageManager._system = {};
/**
 * 空位图
 */
ImageManager._emptyBitmap = new Bitmap(1, 1);

/**
 * 读取动画
 * @param {string} filename 
 */
ImageManager.loadAnimation = function(filename) {
    return this.loadBitmap("img/animations/", filename);
};

/**
 * 读取战斗背景1
 * @param {string} filename 
 */
ImageManager.loadBattleback1 = function(filename) {
    return this.loadBitmap("img/battlebacks1/", filename);
};

/**
 * 读取战斗背景2
 * @param {string} filename 
 */
ImageManager.loadBattleback2 = function(filename) {
    return this.loadBitmap("img/battlebacks2/", filename);
};

/**
 * 读取敌人
 * @param {string} filename 
 */
ImageManager.loadEnemy = function(filename) {
    return this.loadBitmap("img/enemies/", filename);
};

/**
 * 读取行走图
 * @param {string} filename 
 */
ImageManager.loadCharacter = function(filename) {
    return this.loadBitmap("img/characters/", filename);
};

/**
 * 读取脸图
 * @param {string} filename 
 */
ImageManager.loadFace = function(filename) {
    return this.loadBitmap("img/faces/", filename);
};

/**
 * 读取远景图
 * @param {string} filename 
 */
ImageManager.loadParallax = function(filename) {
    return this.loadBitmap("img/parallaxes/", filename);
};

/**
 * 读取图片
 * @param {string} filename 
 */
ImageManager.loadPicture = function(filename) {
    return this.loadBitmap("img/pictures/", filename);
};

/**
 * 读取sv角色
 * @param {string} filename 
 */
ImageManager.loadSvActor = function(filename) {
    return this.loadBitmap("img/sv_actors/", filename);
};

/**
 * 读取sv敌人
 * @param {string} filename 
 */
ImageManager.loadSvEnemy = function(filename) {
    return this.loadBitmap("img/sv_enemies/", filename);
};

/**
 * 读取系统
 * @param {string} filename 
 */
ImageManager.loadSystem = function(filename) {
    return this.loadBitmap("img/system/", filename);
};

/**
 * 读取图块组
 * @param {string} filename 
 */
ImageManager.loadTileset = function(filename) {
    return this.loadBitmap("img/tilesets/", filename);
};

/**
 * 读取标题画面1
 * @param {string} filename 
 */
ImageManager.loadTitle1 = function(filename) {
    return this.loadBitmap("img/titles1/", filename);
};

/**
 * 读取标题画面2
 * @param {string} filename 
 */
ImageManager.loadTitle2 = function(filename) {
    return this.loadBitmap("img/titles2/", filename);
};

/**
 * 读取图片
 * @param {string} folder 文件夹
 * @param {string} filename 文件名
 */
ImageManager.loadBitmap = function(folder, filename) {
    if (filename) {
        const url = folder + Utils.encodeURI(filename) + ".png";
        return this.loadBitmapFromUrl(url);
    } else {
        return this._emptyBitmap;
    }
};

/**
 * 从网址加载位图
 * @param {string} url 网址
 */
ImageManager.loadBitmapFromUrl = function(url) {
    const cache = url.includes("/system/") ? this._system : this._cache;
    if (!cache[url]) {
        cache[url] = Bitmap.load(url);
    }
    return cache[url];
};

/**
 * 清除
 */
ImageManager.clear = function() {
    const cache = this._cache;
    for (const url in cache) {
        cache[url].destroy();
    }
    this._cache = {};
};

/**
 * 是准备好的
 */
ImageManager.isReady = function() {
    for (const cache of [this._cache, this._system]) {
        for (const url in cache) {
            const bitmap = cache[url];
            if (bitmap.isError()) {
                this.throwLoadError(bitmap);
            }
            if (!bitmap.isReady()) {
                return false;
            }
        }
    }
    return true;
};

/**
 * 抛出加载错误
 * @param {*} bitmap 
 */
ImageManager.throwLoadError = function(bitmap) {
    const retry = bitmap.retry.bind(bitmap);
    throw ["LoadError", bitmap.url, retry];
};

/**
 * 是对象行走图
 * @param {string} filename 
 */
ImageManager.isObjectCharacter = function(filename) {
    const sign = filename.match(/^[!$]+/);
    return sign && sign[0].includes("!");
};

/**
 * 是大行走图
 * @param {string} filename 
 */
ImageManager.isBigCharacter = function(filename) {
    const sign = filename.match(/^[!$]+/);
    return sign && sign[0].includes("$");
};

/**
 * 是0远景图
 * @param {string} filename 
 */
ImageManager.isZeroParallax = function(filename) {
    return filename.charAt(0) === "!";
};


/**
 * @mz mv中的 ImageManager.reserve...方法被删除
 */