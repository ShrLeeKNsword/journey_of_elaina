//-----------------------------------------------------------------------------
// AudioManager
//
// The static class that handles BGM, BGS, ME and SE.

/**
 * 音频管理器
 * 
 * 处理BGM，BGS，ME和SE的静态类。
 */
function AudioManager() {
    throw new Error("This is a static class");
}

/**
 * @mz
 * mv中的  
 * AudioManager._masterVolume  
 * AudioManager._blobUrl
 * 被删除
 */
/** 音频管理器 bgm大小 */
AudioManager._bgmVolume = 100;
/** 音频管理器 bgs大小 */
AudioManager._bgsVolume = 100;
/** 音频管理器 me大小 */
AudioManager._meVolume = 100;
/** 音频管理器 se大小 */
AudioManager._seVolume = 100;
/** 音频管理器 当前的bgm */
AudioManager._currentBgm = null;
/** 音频管理器 当前的bgs */
AudioManager._currentBgs = null;
/** 音频管理器 bgm缓存 */
AudioManager._bgmBuffer = null;
/** 音频管理器 bgs缓存 */
AudioManager._bgsBuffer = null;
/** 音频管理器 me缓存 */
AudioManager._meBuffer = null;
/** 音频管理器 se缓存 */
AudioManager._seBuffers = [];
/** 音频管理器 静态缓存 */
AudioManager._staticBuffers = [];
/** 音频管理器 重播淡入时间 */
AudioManager._replayFadeTime = 0.5;
/** 音频管理器 路径 */
AudioManager._path = "audio/";

/** bgm音量 */
Object.defineProperty(AudioManager, "bgmVolume", {
    get: function() {
        return this._bgmVolume;
    },
    set: function(value) {
        this._bgmVolume = value;
        this.updateBgmParameters(this._currentBgm);
    },
    configurable: true
});

/** bgs音量 */
Object.defineProperty(AudioManager, "bgsVolume", {
    get: function() {
        return this._bgsVolume;
    },
    set: function(value) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    },
    configurable: true
});

/** me音量 */
Object.defineProperty(AudioManager, "meVolume", {
    get: function() {
        return this._meVolume;
    },
    set: function(value) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    },
    configurable: true
});

/** se音量 */
Object.defineProperty(AudioManager, "seVolume", {
    get: function() {
        return this._seVolume;
    },
    set: function(value) {
        this._seVolume = value;
    },
    configurable: true
});

/**播放bgm 
 * @param {*} bgm 
 * @param {number} pos 位置 
 */
AudioManager.playBgm = function(bgm, pos) {
    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
    } else {
        this.stopBgm();
        if (bgm.name) {
            this._bgmBuffer = this.createBuffer("bgm/", bgm.name);
            this.updateBgmParameters(bgm);
            if (!this._meBuffer) {
                this._bgmBuffer.play(true, pos || 0);
            }
        }
    }
    this.updateCurrentBgm(bgm, pos);
};

/**
 * 重播bgm
 * @param {*} bgm 
 */
AudioManager.replayBgm = function(bgm) {
    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
    } else {
        this.playBgm(bgm, bgm.pos);
        if (this._bgmBuffer) {
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

/**
 * 是当前的bgm
 * @param {*} bgm 
 */
AudioManager.isCurrentBgm = function(bgm) {
    return (
        this._currentBgm &&
        this._bgmBuffer &&
        this._currentBgm.name === bgm.name
    );
};

/**
 * 更新bgm参数
 * @param {*} bgm 
 */
AudioManager.updateBgmParameters = function(bgm) {
    this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
};

/**
 * 更新当前的bgm
 * @param {*} bgm 
 * @param {number} pos 位置 
 */
AudioManager.updateCurrentBgm = function(bgm, pos) {
    this._currentBgm = {
        name: bgm.name,
        volume: bgm.volume,
        pitch: bgm.pitch,
        pan: bgm.pan,
        pos: pos
    };
};

/**
 * 停止bgm
 */
AudioManager.stopBgm = function() {
    if (this._bgmBuffer) {
        this._bgmBuffer.destroy();
        this._bgmBuffer = null;
        this._currentBgm = null;
    }
};

/**
 * 淡出bgm
 * @param {*} duration 
 */
AudioManager.fadeOutBgm = function(duration) {
    if (this._bgmBuffer && this._currentBgm) {
        this._bgmBuffer.fadeOut(duration);
        this._currentBgm = null;
    }
};

/**
 * 淡入bgm
 * @param {*} duration 
 */
AudioManager.fadeInBgm = function(duration) {
    if (this._bgmBuffer && this._currentBgm) {
        this._bgmBuffer.fadeIn(duration);
    }
};

/**
 * 播放bgs
 * @param {*} bgs 
 * @param {number} pos 位置 
 */
AudioManager.playBgs = function(bgs, pos) {
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.stopBgs();
        if (bgs.name) {
            this._bgsBuffer = this.createBuffer("bgs/", bgs.name);
            this.updateBgsParameters(bgs);
            this._bgsBuffer.play(true, pos || 0);
        }
    }
    this.updateCurrentBgs(bgs, pos);
};

/**
 * 重播bgs
 * @param {*} bgs 
 */
AudioManager.replayBgs = function(bgs) {
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.playBgs(bgs, bgs.pos);
        if (this._bgsBuffer) {
            this._bgsBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

/**
 * 是当前的bgs
 * @param {*} bgs 
 */
AudioManager.isCurrentBgs = function(bgs) {
    return (
        this._currentBgs &&
        this._bgsBuffer &&
        this._currentBgs.name === bgs.name
    );
};

/**
 * 更新bgs参数
 * @param {*} bgs 
 */
AudioManager.updateBgsParameters = function(bgs) {
    this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
};

/**
 * 更新当前的bgs
 * @param {*} bgs 
 * @param {number} pos 位置 
 */
AudioManager.updateCurrentBgs = function(bgs, pos) {
    this._currentBgs = {
        name: bgs.name,
        volume: bgs.volume,
        pitch: bgs.pitch,
        pan: bgs.pan,
        pos: pos
    };
};

/**
 * 停止bgs
 * 
 */
AudioManager.stopBgs = function() {
    if (this._bgsBuffer) {
        this._bgsBuffer.destroy();
        this._bgsBuffer = null;
        this._currentBgs = null;
    }
};

/**
 * 淡出bgs
 * @param {*} duration 
 */
AudioManager.fadeOutBgs = function(duration) {
    if (this._bgsBuffer && this._currentBgs) {
        this._bgsBuffer.fadeOut(duration);
        this._currentBgs = null;
    }
};

/**
 * 淡入bgs
 * @param {*} duration 
 */
AudioManager.fadeInBgs = function(duration) {
    if (this._bgsBuffer && this._currentBgs) {
        this._bgsBuffer.fadeIn(duration);
    }
};

/**
 * 播放me
 * @param {*} me 
 */
AudioManager.playMe = function(me) {
    this.stopMe();
    if (me.name) {
        if (this._bgmBuffer && this._currentBgm) {
            this._currentBgm.pos = this._bgmBuffer.seek();
            this._bgmBuffer.stop();
        }
        this._meBuffer = this.createBuffer("me/", me.name);
        this.updateMeParameters(me);
        this._meBuffer.play(false);
        this._meBuffer.addStopListener(this.stopMe.bind(this));
    }
};

/**
 * 更新me参数
 * @param {*} me 
 */
AudioManager.updateMeParameters = function(me) {
    this.updateBufferParameters(this._meBuffer, this._meVolume, me);
};

/**
 * 淡出me
 * @param {*} duration 
 */
AudioManager.fadeOutMe = function(duration) {
    if (this._meBuffer) {
        this._meBuffer.fadeOut(duration);
    }
};

/**
 * 停止me
 */
AudioManager.stopMe = function() {
    if (this._meBuffer) {
        this._meBuffer.destroy();
        this._meBuffer = null;
        if (
            this._bgmBuffer &&
            this._currentBgm &&
            !this._bgmBuffer.isPlaying()
        ) {
            this._bgmBuffer.play(true, this._currentBgm.pos);
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

/**
 * 播放se
 * @param {*} se 
 */
AudioManager.playSe = function(se) {
    if (se.name) {
        // [Note] Do not play the same sound in the same frame.
        const latestBuffers = this._seBuffers.filter(
            buffer => buffer.frameCount === Graphics.frameCount
        );
        if (latestBuffers.find(buffer => buffer.name === se.name)) {
            return;
        }
        const buffer = this.createBuffer("se/", se.name);
        this.updateSeParameters(buffer, se);
        buffer.play(false);
        this._seBuffers.push(buffer);
        this.cleanupSe();
    }
};

/**
 * 更新se参数
 * @param {*} buffer 
 * @param {*} se 
 */
AudioManager.updateSeParameters = function(buffer, se) {
    this.updateBufferParameters(buffer, this._seVolume, se);
};

/**
 * 清理se
 */
AudioManager.cleanupSe = function() {
    for (const buffer of this._seBuffers) {
        if (!buffer.isPlaying()) {
            buffer.destroy();
        }
    }
    this._seBuffers = this._seBuffers.filter(buffer => buffer.isPlaying());
};

/**
 * 停止se
 */
AudioManager.stopSe = function() {
    for (const buffer of this._seBuffers) {
        buffer.destroy();
    }
    this._seBuffers = [];
};

/**
 * 播放静态se
 * @param {*} se 
 */
AudioManager.playStaticSe = function(se) {
    if (se.name) {
        this.loadStaticSe(se);
        for (const buffer of this._staticBuffers) {
            if (buffer.name === se.name) {
                buffer.stop();
                this.updateSeParameters(buffer, se);
                buffer.play(false);
                break;
            }
        }
    }
};

/**
 * 加载静态se
 * @param {*} se 
 */
AudioManager.loadStaticSe = function(se) {
    if (se.name && !this.isStaticSe(se)) {
        const buffer = this.createBuffer("se/", se.name);
        this._staticBuffers.push(buffer);
    }
};

/**
 * 是静态se
 * @param {*} se 
 */
AudioManager.isStaticSe = function(se) {
    for (const buffer of this._staticBuffers) {
        if (buffer.name === se.name) {
            return true;
        }
    }
    return false;
};

/**
 * 停止所有
 */
AudioManager.stopAll = function() {
    this.stopMe();
    this.stopBgm();
    this.stopBgs();
    this.stopSe();
};

/**
 * 保存bgm
 */
AudioManager.saveBgm = function() {
    if (this._currentBgm) {
        const bgm = this._currentBgm;
        return {
            name: bgm.name,
            volume: bgm.volume,
            pitch: bgm.pitch,
            pan: bgm.pan,
            pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};

/**
 * 保存bgs
 */
AudioManager.saveBgs = function() {
    if (this._currentBgs) {
        const bgs = this._currentBgs;
        return {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};

/**
 * 制作空音频对象
 */
AudioManager.makeEmptyAudioObject = function() {
    return { name: "", volume: 0, pitch: 0 };
};

/**
 * 创造缓存
 * @param {string} folder 文件夹
 * @param {string} name 名称
 */
AudioManager.createBuffer = function(folder, name) {
    const ext = this.audioFileExt();
    const url = this._path + folder + Utils.encodeURI(name) + ext;
    const buffer = new WebAudio(url);
    buffer.name = name;
    buffer.frameCount = Graphics.frameCount;
    return buffer;
};

/**
 * 更新缓存参数
 * @param {WebAudio} buffer 缓存
 * @param {number} configVolume 大小
 * @param {*} audio 音频数据
 */
AudioManager.updateBufferParameters = function(buffer, configVolume, audio) {
    if (buffer && audio) {
        buffer.volume = (configVolume * (audio.volume || 0)) / 10000;
        buffer.pitch = (audio.pitch || 0) / 100;
        buffer.pan = (audio.pan || 0) / 100;
    }
};

/**
 * 音频文件提取
 * @mz 
 * mv中会判断后选择使用.ogg或.m4a
 */
AudioManager.audioFileExt = function() {
    return ".ogg";
};

/**
 * 检查错误
 */
AudioManager.checkErrors = function() {
    const buffers = [this._bgmBuffer, this._bgsBuffer, this._meBuffer];
    buffers.push(...this._seBuffers);
    buffers.push(...this._staticBuffers);
    for (const buffer of buffers) {
        if (buffer && buffer.isError()) {
            this.throwLoadError(buffer);
        }
    }
};

/**
 * 抛出读取错误
 * @param {WebAudio} webAudio 网络音频
 */
AudioManager.throwLoadError = function(webAudio) {
    const retry = webAudio.retry.bind(webAudio);
    throw ["LoadError", webAudio.url, retry];
};

