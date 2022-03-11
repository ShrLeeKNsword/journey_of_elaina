//-----------------------------------------------------------------------------
// PluginManager
//
// The static class that manages the plugins.

/**
 * 插件管理器
 * 
 * 管理插件的静态类。
 * 
 */
function PluginManager() {
    throw new Error("This is a static class");
}

/**
 * 脚本组
 */
PluginManager._scripts = [];
/**
 * 错误网址组
 */
PluginManager._errorUrls = [];
/**
 * 参数组
 */
PluginManager._parameters = {};
/**
 * 命令组
 */
PluginManager._commands = {};

/**
 * 安装
 * @param {object[]} plugins 插件组 
 */
PluginManager.setup = function(plugins) {
    for (const plugin of plugins) {
        if (plugin.status && !this._scripts.includes(plugin.name)) {
            this.setParameters(plugin.name, plugin.parameters);
            this.loadScript(plugin.name);
            this._scripts.push(plugin.name);
        }
    }
};

/**
 * 参数组
 * @param {string} name 名称
 */
PluginManager.parameters = function(name) {
    return this._parameters[name.toLowerCase()] || {};
};

/**
 * 设置参数组
 * @param {string} name 名称
 * @param {string} parameters 参数组
 */
PluginManager.setParameters = function(name, parameters) {
    this._parameters[name.toLowerCase()] = parameters;
};

/**
 * 读取脚本
 * @param {string} filename 文件名称
 */
PluginManager.loadScript = function(filename) {
    const url = this.makeUrl(filename);
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.async = false;
    script.defer = true;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
};

/**
 * 当错误
 * @param {*} e 错误
 */
PluginManager.onError = function(e) {
    this._errorUrls.push(e.target._url);
};

/**
 * 制作网址
 * @param {string} filename 文件名 
 */
PluginManager.makeUrl = function(filename) {
    return "js/plugins/" + Utils.encodeURI(filename) + ".js";
};

/**
 * 检查错误
 */
PluginManager.checkErrors = function() {
    const url = this._errorUrls.shift();
    if (url) {
        this.throwLoadError(url);
    }
};

/**
 * 抛出读取错误
 * @param {string} url 网址
 */
PluginManager.throwLoadError = function(url) {
    throw new Error("Failed to load: " + url);
};

/**
 * 注册命令
 * @param {string} pluginName 插件名称
 * @param {string} commandName 命令名称
 * @param {function} func 方法
 */
PluginManager.registerCommand = function(pluginName, commandName, func) {
    const key = pluginName + ":" + commandName;
    this._commands[key] = func;
};

/**
 * 呼叫命令
 * @param {*} self 自己(注册时的绑定)
 * @param {string} pluginName 插件名称
 * @param {string} commandName 命令名称 
 * @param {*[]} args 参数组
 */
PluginManager.callCommand = function(self, pluginName, commandName, args) {
    const key = pluginName + ":" + commandName;
    const func = this._commands[key];
    if (typeof func === "function") {
        func.bind(self)(args);
    }
};

//-----------------------------------------------------------------------------
