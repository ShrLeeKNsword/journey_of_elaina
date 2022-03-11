//-----------------------------------------------------------------------------
// FontManager
//
// The static class that loads font files.

/**
 * 字体管理器
 * 
 * 加载字体文件的静态类。
 * @mz 新增
 */
function FontManager() {
    throw new Error("This is a static class");
}

/**
 * 网址组
 */
FontManager._urls = {};
/**
 * 状态组
 */
FontManager._states = {};

/**
 * 读取
 * @param {string} family 字体系列
 * @param {string} filename 文件名称
 */
FontManager.load = function(family, filename) {
    if (this._states[family] !== "loaded") {
        if (filename) {
            const url = this.makeUrl(filename);
            this.startLoading(family, url);
        } else {
            this._urls[family] = "";
            this._states[family] = "loaded";
        }
    }
};

/**
 * 是准备好的
 */
FontManager.isReady = function() {
    for (const family in this._states) {
        const state = this._states[family];
        if (state === "loading") {
            return false;
        }
        if (state === "error") {
            this.throwLoadError(family);
        }
    }
    return true;
};

/**
 * 开始加载
 * @param {string} family 字体系列
 * @param {string} url 网址
 */
FontManager.startLoading = function(family, url) {
    const source = "url(" + url + ")";
    const font = new FontFace(family, source);
    this._urls[family] = url;
    this._states[family] = "loading";
    font.load()
        .then(() => {
            document.fonts.add(font);
            this._states[family] = "loaded";
            return 0;
        })
        .catch(() => {
            this._states[family] = "error";
        });
};

/**
 * 抛出加载错误
 * @param {string} family 字体系列
 */
FontManager.throwLoadError = function(family) {
    const url = this._urls[family];
    const retry = () => this.startLoading(family, url);
    throw ["LoadError", url, retry];
};

/**
 * 生成网址
 * @param {string} filename 文件名称
 */
FontManager.makeUrl = function(filename) {
    return "fonts/" + Utils.encodeURI(filename);
};

