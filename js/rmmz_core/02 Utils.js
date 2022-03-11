//-----------------------------------------------------------------------------
/**
 * 定义实用程序方法的静态类。
 * The static class that defines utility methods.
 *
 * @namespace Utils 实用程序
 */
function Utils() {
    throw new Error("This is a static class");
}

/**
 * RPG制造商的名称。当前版本中是“MZ”。
 * 
 * The name of the RPG Maker. "MZ" in the current version.
 *
 * @type string
 * @constant
 */
Utils.RPGMAKER_NAME = "MZ";

/**
 * RPG Maker的版本。
 * The version of the RPG Maker.
 *
 * @type string
 * @constant
 */
Utils.RPGMAKER_VERSION = "1.0.0";

/**
 * 检查当前RPG Maker版本是否大于或等于给定的版本。
 * 
 * Checks whether the current RPG Maker version is greater than or equal to
 * the given version.
 *
 * @param {string} version "x.x.x" 格式字符串进行比较。 - The "x.x.x" format string to compare.
 * @returns {boolean} 如果当前版本大于或等于给定的版本，则为True
 *。True if the current version is greater than or equal
 *                    to the given version.
 */
Utils.checkRMVersion = function(version) {
    const array1 = this.RPGMAKER_VERSION.split(".");
    const array2 = String(version).split(".");
    for (let i = 0; i < array1.length; i++) {
        const v1 = parseInt(array1[i]);
        const v2 = parseInt(array2[i]);
        if (v1 > v2) {
            return true;
        } else if (v1 < v2) {
            return false;
        }
    }
    return true;
};

/**
 * 检查选项是否在查询字符串中。
 * Checks whether the option is in the query string.
 *
 * @param {string} name 选项名称。- The option name.
 * @returns {boolean} 如果选项在查询字符串中，则为True。 True if the option is in the query string.
 */
Utils.isOptionValid = function(name) {
    const args = location.search.slice(1);
    if (args.split("&").includes(name)) {
        return true;
    }
    if (this.isNwjs() && nw.App.argv.length > 0) {
        return nw.App.argv[0].split("&").includes(name);
    }
    return false;
};

/**
 * 检查平台是否为NW.js。
 * Checks whether the platform is NW.js.
 *
 * @returns {boolean} 如果平台为NW.js，则为true. True if the platform is NW.js.
 */
Utils.isNwjs = function() {
    return typeof require === "function" && typeof process === "object";
};

/**
 * 检查平台是否为RPG Atsumaru。
 * Checks whether the platform is RPG Atsumaru.
 *
 * @returns {boolean} 如果平台是RPG Atsumaru，则为true。 True if the platform is RPG Atsumaru.
 */
Utils.isAtsumaru = function() {
    return typeof RPGAtsumaru === "object";
};

/**
 * 检查平台是否为移动设备。
 * Checks whether the platform is a mobile device.
 *
 * @returns {boolean} 如果平台是移动设备，则为True。 True if the platform is a mobile device.
 */
Utils.isMobileDevice = function() {
    const r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i;
    return !!navigator.userAgent.match(r);
};

/**
 * 检查浏览器是否为Mobile Safari。
 * Checks whether the browser is Mobile Safari.
 *
 * @returns {boolean} 如果浏览器是Mobile Safari，则为True。True if the browser is Mobile Safari.
 */
Utils.isMobileSafari = function() {
    const agent = navigator.userAgent;
    return !!(
        agent.match(/iPhone|iPad|iPod/) &&
        agent.match(/AppleWebKit/) &&
        !agent.match("CriOS")
    );
};

/**
 * 检查浏览器是否为Android Chrome。
 * Checks whether the browser is Android Chrome.
 *
 * @returns {boolean} 如果浏览器是Android Chrome，则为true。True if the browser is Android Chrome.
 */
Utils.isAndroidChrome = function() {
    const agent = navigator.userAgent;
    return !!(agent.match(/Android/) && agent.match(/Chrome/));
};

/**
 * 检查浏览器是否正在访问本地文件。
 * Checks whether the browser is accessing local files.
 *
 * @returns {boolean} 如果浏览器正在访问本地文件，则为True。True if the browser is accessing local files.
 */
Utils.isLocal = function() {
    return window.location.href.startsWith("file:");
};

/**
 * 检查浏览器是否支持WebGL。
 * Checks whether the browser supports WebGL.
 *
 * @returns {boolean} 如果浏览器支持Web GL，则为true。True if the browser supports WebGL.
 */
Utils.canUseWebGL = function() {
    try {
        const canvas = document.createElement("canvas");
        return !!canvas.getContext("webgl");
    } catch (e) {
        return false;
    }
};

/**
 * 检查浏览器是否支持Web Audio API。
 * Checks whether the browser supports Web Audio API.
 *
 * @returns {boolean} 如果浏览器支持Web Audio API，则为True。True if the browser supports Web Audio API.
 */
Utils.canUseWebAudioAPI = function() {
    return !!(window.AudioContext || window.webkitAudioContext);
};

/**
 * 检查浏览器是否支持CSS字体加载。
 * Checks whether the browser supports CSS Font Loading.
 *
 * @returns {boolean} 如果浏览器支持CSS字体加载，则为true。True if the browser supports CSS Font Loading.
 */
Utils.canUseCssFontLoading = function() {
    return !!(document.fonts && document.fonts.ready);
};

/**
 * 检查浏览器是否支持索引数据库。
 * Checks whether the browser supports IndexedDB.
 *
 * @returns {boolean} 如果浏览器支持索引数据库，则为True。True if the browser supports IndexedDB.
 */
Utils.canUseIndexedDB = function() {
    return !!(
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB
    );
};

/**
 * 检查浏览器是否可以播放ogg文件。
 * Checks whether the browser can play ogg files.
 *
 * @returns {boolean} 如果浏览器可以播放ogg文件，则为true。True if the browser can play ogg files.
 */
Utils.canPlayOgg = function() {
    if (!Utils._audioElement) {
        Utils._audioElement = document.createElement("audio");
    }
    return !!(
        Utils._audioElement &&
        Utils._audioElement.canPlayType('audio/ogg; codecs="vorbis"')
    );
};

/**
 * 检查浏览器是否可以播放webm文件。
 * Checks whether the browser can play webm files.
 *
 * @returns {boolean} 如果浏览器可以播放webm文件，则为true。True if the browser can play webm files.
 */
Utils.canPlayWebm = function() {
    if (!Utils._videoElement) {
        Utils._videoElement = document.createElement("video");
    }
    return !!(
        Utils._videoElement &&
        Utils._videoElement.canPlayType('video/webm; codecs="vp8, vorbis"')
    );
};

/**
 * 编码URI组件而不转义斜杠字符。
 * Encodes a URI component without escaping slash characters.
 *
 * @param {string} str 输入字符串。- The input string.
 * @returns {string} 编码的字符串。Encoded string.
 */
Utils.encodeURI = function(str) {
    return encodeURIComponent(str).replace(/%2F/g, "/");
};

/**
 * 转义HTML的特殊字符。
 * Escapes special characters for HTML.
 *
 * @param {string} str 输入字符串。 - The input string.
 * @returns {string} 转义的字符串。 Escaped string.
 */
Utils.escapeHtml = function(str) {
    const entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };
    return String(str).replace(/[&<>"'/]/g, s => entityMap[s]);
};

/**
 * 检查字符串是否包含任何阿拉伯字符。
 * Checks whether the string contains any Arabic characters.
 * 如果字符串包含任何阿拉伯字符，则为True。
 * @returns {boolean} True if the string contains any Arabic characters.
 */
Utils.containsArabic = function(str) {
    const regExp = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return regExp.test(str);
};

/**
 * 设置加密信息
 * Sets information related to encryption.
 * 设置与加密有关的信息。
 *
 * @param {boolean} hasImages 图像文件是否已加密。- Whether the image files are encrypted.
 * @param {boolean} hasAudio 音频文件是否已加密。- Whether the audio files are encrypted.
 * @param {string} key 加密密钥。- The encryption key.
 */
Utils.setEncryptionInfo = function(hasImages, hasAudio, key) {
    // [Note] This function is implemented for module independence.
    this._hasEncryptedImages = hasImages;
    this._hasEncryptedAudio = hasAudio;
    this._encryptionKey = key;
};

/**
 * 有加密的图像
 * Checks whether the image files in the game are encrypted.
 * 检查游戏中的图像文件是否已加密。
 *
 * @returns {boolean} True if the image files are encrypted.
 */
Utils.hasEncryptedImages = function() {
    return this._hasEncryptedImages;
};

/**
 * 有加密的音频
 * Checks whether the audio files in the game are encrypted.
 * 检查游戏中的音频文件是否已加密。
 *
 * @returns {boolean} True if the audio files are encrypted.
 */
Utils.hasEncryptedAudio = function() {
    return this._hasEncryptedAudio;
};

/**
 * 解密数组缓冲区
 * Decrypts encrypted data.
 * 解密加密的数据。
 *
 * @param {ArrayBuffer} source 要解密的数据。- The data to be decrypted.
 * @returns {ArrayBuffer} 解密的数据。The decrypted data.
 * 
 * 
 * @mz 
 * 文件解密方面与mv相比没有区别
 * 加密后文件头部与mv相同
 * 同为加密文件的前16个字符实现加密
 * 不同处为mv加密后后缀为特殊后缀,mz加密后为 文件名 + "_"
 * 全部加密,没有之前的某些排除的设置
 * 密钥为 输入密钥的32位md5码
 *
 */
Utils.decryptArrayBuffer = function(source) {
    const header = new Uint8Array(source, 0, 16);
    const headerHex = Array.from(header, x => x.toString(16)).join(",");
    if (headerHex !== "52,50,47,4d,56,0,0,0,0,3,1,0,0,0,0,0") {
        throw new Error("Decryption error");
    }
    const body = source.slice(16);
    const view = new DataView(body);
    const key = this._encryptionKey.match(/.{2}/g);
    for (let i = 0; i < 16; i++) {
        view.setUint8(i, view.getUint8(i) ^ parseInt(key[i], 16));
    }
    return body;
};

