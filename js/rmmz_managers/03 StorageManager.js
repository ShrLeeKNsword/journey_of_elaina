//-----------------------------------------------------------------------------
// StorageManager
//
// The static class that manages storage for saving game data.

/**
 * 存储管理器
 * 
 * 管理用于保存游戏数据的存储的静态类。
 * @mz 修改较大,json使用pako压缩,网络使用forage,本地使用fs
 */
function StorageManager() {
    throw new Error("This is a static class");
}

/**
 * forage键组 
 * 
 */
StorageManager._forageKeys = [];
/**
 * forage键组更新后
 */
StorageManager._forageKeysUpdated = false;

/**
 * 是本地模式
 */
StorageManager.isLocalMode = function() {
    return Utils.isNwjs();
};

/**
 * 保存对象
 * @param {*} saveName 保存名称
 * @param {object} object 对象
 */
StorageManager.saveObject = function(saveName, object) {
    return this.objectToJson(object)
        .then(json => this.jsonToZip(json))
        .then(zip => this.saveZip(saveName, zip));
};

/**
 * 加载对象
 * @param {*} saveName 保存名称
 */
StorageManager.loadObject = function(saveName) {
    return this.loadZip(saveName)
        .then(zip => this.zipToJson(zip))
        .then(json => this.jsonToObject(json));
};

/**
 * 对象转json
 * @param {object} object 对象
 */
StorageManager.objectToJson = function(object) {
    return new Promise((resolve, reject) => {
        try {
            const json = JsonEx.stringify(object);
            resolve(json);
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * json转对象
 * @param {string} json json文本
 */
StorageManager.jsonToObject = function(json) {
    return new Promise((resolve, reject) => {
        try {
            const object = JsonEx.parse(json);
            resolve(object);
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * json转Zip
 * @param {string} json json文本
 */
StorageManager.jsonToZip = function(json) {
    return new Promise((resolve, reject) => {
        try {
            const zip = pako.deflate(json, { to: "string", level: 1 });
            if (zip.length >= 50000) {
                console.warn("Save data is too big.");
            }
            resolve(zip);
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * zip转Json
 * @param {*} zip zip文件数据
 */
StorageManager.zipToJson = function(zip) {
    return new Promise((resolve, reject) => {
        try {
            if (zip) {
                const json = pako.inflate(zip, { to: "string" });
                resolve(json);
            } else {
                resolve("null");
            }
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * 保存zip
 * @param {*} saveName 保存名称
 * @param {*} zip zip文件数据
 */
StorageManager.saveZip = function(saveName, zip) {
    if (this.isLocalMode()) {
        return this.saveToLocalFile(saveName, zip);
    } else {
        return this.saveToForage(saveName, zip);
    }
};

/**
 * 读取zip文件
 * @param {*} saveName 保存名称
 */
StorageManager.loadZip = function(saveName) {
    if (this.isLocalMode()) {
        return this.loadFromLocalFile(saveName);
    } else {
        return this.loadFromForage(saveName);
    }
};

/**
 * 存在
 * @param {*} saveName 保存名称
 */
StorageManager.exists = function(saveName) {
    if (this.isLocalMode()) {
        return this.localFileExists(saveName);
    } else {
        return this.forageExists(saveName);
    }
};

/**
 * 移除名称
 * @param {*} saveName 保存名称
 */
StorageManager.remove = function(saveName) {
    if (this.isLocalMode()) {
        return this.removeLocalFile(saveName);
    } else {
        return this.removeForage(saveName);
    }
};

/**
 * 保存到本地文件
 * @param {*} saveName 保存名称
 * @param {*} zip zip文件数据
 */
StorageManager.saveToLocalFile = function(saveName, zip) {
    const dirPath = this.fileDirectoryPath();
    const filePath = this.filePath(saveName);
    const backupFilePath = filePath + "_";
    return new Promise((resolve, reject) => {
        this.fsMkdir(dirPath);
        this.fsUnlink(backupFilePath);
        this.fsRename(filePath, backupFilePath);
        try {
            this.fsWriteFile(filePath, zip);
            this.fsUnlink(backupFilePath);
            resolve();
        } catch (e) {
            try {
                this.fsUnlink(filePath);
                this.fsRename(backupFilePath, filePath);
            } catch (e2) {
                //
            }
            reject(e);
        }
    });
};

/**
 * 从本地文件加载
 * @param {*} saveName 保存名称
 */
StorageManager.loadFromLocalFile = function(saveName) {
    const filePath = this.filePath(saveName);
    return new Promise((resolve, reject) => {
        const data = this.fsReadFile(filePath);
        if (data) {
            resolve(data);
        } else {
            reject(new Error("Savefile not found"));
        }
    });
};

/**
 * 本地文件存在
 * @param {*} saveName 保存名称
 */
StorageManager.localFileExists = function(saveName) {
    const fs = require("fs");
    return fs.existsSync(this.filePath(saveName));
};

/**
 * 删除本地文件
 * @param {*} saveName 保存名称
 */
StorageManager.removeLocalFile = function(saveName) {
    this.fsUnlink(this.filePath(saveName));
};

/**
 * 保存到forage
 * @param {*} saveName 
 * @param {*} zip 
 */
StorageManager.saveToForage = function(saveName, zip) {
    const key = this.forageKey(saveName);
    const testKey = this.forageTestKey();
    setTimeout(() => localforage.removeItem(testKey));
    return localforage
        .setItem(testKey, zip)
        .then(localforage.setItem(key, zip))
        .then(this.updateForageKeys());
};

/**
 * 读取从forage
 * @param {*} saveName 
 */
StorageManager.loadFromForage = function(saveName) {
    const key = this.forageKey(saveName);
    return localforage.getItem(key);
};

/**
 * forage 存在
 * @param {*} saveName 
 */
StorageManager.forageExists = function(saveName) {
    const key = this.forageKey(saveName);
    return this._forageKeys.includes(key);
};

/**
 * 移除forage文件
 * @param {*} saveName 保存名称
 */
StorageManager.removeForage = function(saveName) {
    const key = this.forageKey(saveName);
    return localforage.removeItem(key).then(this.updateForageKeys());
};

/**
 * 更新forage键组
 */
StorageManager.updateForageKeys = function() {
    this._forageKeysUpdated = false;
    return localforage.keys().then(keys => {
        this._forageKeys = keys;
        this._forageKeysUpdated = true;
        return 0;
    });
};

/**
 * forage键组更新后
 */
StorageManager.forageKeysUpdated = function() {
    return this._forageKeysUpdated;
};

/**
 * fs制作文件夹
 * @param {*} path 路径
 */
StorageManager.fsMkdir = function(path) {
    const fs = require("fs");
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};

/**
 * fs重命名
 * @param {*} oldPath 旧路径
 * @param {*} newPath 新路径
 */
StorageManager.fsRename = function(oldPath, newPath) {
    const fs = require("fs");
    if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
    }
};

/**
 * fs删除文件
 * @param {*} path 路径
 */
StorageManager.fsUnlink = function(path) {
    const fs = require("fs");
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
};

/**
 * fs读取文件
 * @param {*} path 路径
 */
StorageManager.fsReadFile = function(path) {
    const fs = require("fs");
    if (fs.existsSync(path)) {
        return fs.readFileSync(path, { encoding: "utf8" });
    } else {
        return null;
    }
};

/**
 * fs写入文件
 * @param {*} path 路径
 * @param {*} data 数据
 */
StorageManager.fsWriteFile = function(path, data) {
    const fs = require("fs");
    fs.writeFileSync(path, data);
};

/**
 * 文件目录路径
 */
StorageManager.fileDirectoryPath = function() {
    const path = require("path");
    const base = path.dirname(process.mainModule.filename);
    return path.join(base, "save/");
};

/**
 * 文件地址
 * @param {string} saveName 不错没错
 */
StorageManager.filePath = function(saveName) {
    const dir = this.fileDirectoryPath();
    return dir + saveName + ".rmmzsave";
};

/**
 * forage 键
 * 
 * @param {*} saveName 
 */
StorageManager.forageKey = function(saveName) {
    const gameId = $dataSystem.advanced.gameId;
    return "rmmzsave." + gameId + "." + saveName;
};

/**
 * forage 测试键
 * 
 */
StorageManager.forageTestKey = function() {
    return "rmmzsave.test";
};

