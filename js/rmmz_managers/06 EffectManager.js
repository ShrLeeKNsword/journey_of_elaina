//-----------------------------------------------------------------------------
// EffectManager
//
// The static class that loads Effekseer effects.

/**
 * 效果管理器
 * 
 * 加载Effekseer粒子效果的静态类。
 * 
 * @mz 新增
 */
function EffectManager() {
    throw new Error("This is a static class");
}

/**
 * 储存
 */
EffectManager._cache = {};
/**
 * 错误网址组
 */
EffectManager._errorUrls = [];

/**
 * 读取
 * @param {string} filename 文件名
 */
EffectManager.load = function(filename) {
    if (filename) {
        const url = this.makeUrl(filename);
        const cache = this._cache;
        if (!cache[url] && Graphics.effekseer) {
            this.startLoading(url);
        }
        return cache[url];
    } else {
        return null;
    }
};

/**
 * 开始读取
 * @param {string} url 网址 
 */
EffectManager.startLoading = function(url) {
    const onLoad = () => this.onLoad(url);
    const onError = () => this.onError(url);
    const effect = Graphics.effekseer.loadEffect(url, 1, onLoad, onError);
    this._cache[url] = effect;
    return effect;
};

/**
 * 清除
 */
EffectManager.clear = function() {
    for (const url in this._cache) {
        const effect = this._cache[url];
        Graphics.effekseer.releaseEffect(effect);
    }
    this._cache = {};
};

/**
 * 当读取
 */
EffectManager.onLoad = function(/*url*/) {
    //
};

/**
 * 当错误
 * @param {string} url 网址
 */
EffectManager.onError = function(url) {
    this._errorUrls.push(url);
};

/**
 * 制作网址
 * @param {string} filename 文件名
 */
EffectManager.makeUrl = function(filename) {
    return "effects/" + Utils.encodeURI(filename) + ".efkefc";
};

/**
 * 检查错误
 */
EffectManager.checkErrors = function() {
    const url = this._errorUrls.shift();
    if (url) {
        this.throwLoadError(url);
    }
};

/**
 * 抛出加载错误
 * @param {string} url 网址
 */
EffectManager.throwLoadError = function(url) {
    const retry = () => this.startLoading(url);
    throw ["LoadError", url, retry];
};

/**
 * 是准备好的
 */
EffectManager.isReady = function() {
    this.checkErrors();
    for (const url in this._cache) {
        const effect = this._cache[url];
        if (!effect.isLoaded) {
            return false;
        }
    }
    return true;
};

