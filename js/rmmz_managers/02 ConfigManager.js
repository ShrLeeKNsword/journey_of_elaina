//-----------------------------------------------------------------------------
// ConfigManager
//
// The static class that manages the configuration data.

/**
 * 配置管理器
 * 
 * 管理配置数据的静态类。
 */
function ConfigManager() {
    throw new Error("This is a static class");
}

/**
 * 总是短跑
 */
ConfigManager.alwaysDash = false;
/**
 * 命令记住
 */
ConfigManager.commandRemember = false;
/**
 * 触摸UI
 * @mz 新增
 */
ConfigManager.touchUI = true;
/**
 * 已加载
 * @mz 新增
 */
ConfigManager._isLoaded = false;

/**
 * bgm音量大小
 */
Object.defineProperty(ConfigManager, "bgmVolume", {
    get: function() {
        return AudioManager._bgmVolume;
    },
    set: function(value) {
        AudioManager.bgmVolume = value;
    },
    configurable: true
});

/**
 * bgs音量大小
 */
Object.defineProperty(ConfigManager, "bgsVolume", {
    get: function() {
        return AudioManager.bgsVolume;
    },
    set: function(value) {
        AudioManager.bgsVolume = value;
    },
    configurable: true
});

/**
 * me音量大小
 */
Object.defineProperty(ConfigManager, "meVolume", {
    get: function() {
        return AudioManager.meVolume;
    },
    set: function(value) {
        AudioManager.meVolume = value;
    },
    configurable: true
});

/**
 * se音量大小
 */
Object.defineProperty(ConfigManager, "seVolume", {
    get: function() {
        return AudioManager.seVolume;
    },
    set: function(value) {
        AudioManager.seVolume = value;
    },
    configurable: true
});

/**
 * 读取
 */
ConfigManager.load = function() {
    StorageManager.loadObject("config")
        .then(config => this.applyData(config || {}))
        .catch(() => 0)
        .then(() => {
            this._isLoaded = true;
            return 0;
        })
        .catch(() => 0);
};

/**
 * 保存
 */
ConfigManager.save = function() {
    StorageManager.saveObject("config", this.makeData());
};

/**
 * 是加载后的
 * @mz 新增
 */
ConfigManager.isLoaded = function() {
    return this._isLoaded;
};

/**
 * 制作数据
 */
ConfigManager.makeData = function() {
    const config = {};
    config.alwaysDash = this.alwaysDash;
    config.commandRemember = this.commandRemember;
    config.touchUI = this.touchUI;
    config.bgmVolume = this.bgmVolume;
    config.bgsVolume = this.bgsVolume;
    config.meVolume = this.meVolume;
    config.seVolume = this.seVolume;
    return config;
};

/**
 * 应用数据
 * @param {*} config 
 */
ConfigManager.applyData = function(config) {
    this.alwaysDash = this.readFlag(config, "alwaysDash", false);
    this.commandRemember = this.readFlag(config, "commandRemember", false);
    this.touchUI = this.readFlag(config, "touchUI", true);
    this.bgmVolume = this.readVolume(config, "bgmVolume");
    this.bgsVolume = this.readVolume(config, "bgsVolume");
    this.meVolume = this.readVolume(config, "meVolume");
    this.seVolume = this.readVolume(config, "seVolume");
};

/**
 * 读取标志
 * @param {*} config 配置
 * @param {*} name 名称
 * @param {*} defaultValue 默认值
 */
ConfigManager.readFlag = function(config, name, defaultValue) {
    if (name in config) {
        return !!config[name];
    } else {
        return defaultValue;
    }
};

/**
 * 读取音量大小
 * @param {*} config 配置
 * @param {*} name 名称
 */
ConfigManager.readVolume = function(config, name) {
    if (name in config) {
        return Number(config[name]).clamp(0, 100);
    } else {
        return 100;
    }
};

