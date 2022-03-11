//-----------------------------------------------------------------------------
/**
 * 网络音频
 * The audio object of Web Audio API.
 *
 * Web Audio API的音频对象。
 * 
 * @class
 * @param {string} url 音频文件的URL。- The url of the audio file.
 */
function WebAudio() {
    this.initialize(...arguments);
}

/**
 * 初始化 
 * @param {string} url 网址
 */
WebAudio.prototype.initialize = function(url) {
    this.clear();
    this._url = url;
    this._startLoading();
};

/**
 * 初始化
 * Initializes the audio system.
 * 初始化音频系统。
 *
 * @returns {boolean} 如果有音频系统，则为True。True if the audio system is available.
 */
WebAudio.initialize = function() {
    this._context = null;
    this._masterGainNode = null;
    this._masterVolume = 1;
    this._createContext();
    this._createMasterGainNode();
    this._setupEventHandlers();
    return !!this._context;
};

/**
 * 设置主音量
 * Sets the master volume for all audio.
 * 设置所有音频的主音量。
 *
 * @param {number} value 主音量（0到1）- The master volume (0 to 1).
 */
WebAudio.setMasterVolume = function(value) {
    this._masterVolume = value;
    this._resetVolume();
};

/**
 * 创建上下文
 */
WebAudio._createContext = function() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this._context = new AudioContext();
    } catch (e) {
        this._context = null;
    }
};

/**
 * 当前时间
 */
WebAudio._currentTime = function() {
    return this._context ? this._context.currentTime : 0;
};

/**
 * 创建主增益节点
 */
WebAudio._createMasterGainNode = function() {
    const context = this._context;
    if (context) {
        this._masterGainNode = context.createGain();
        this._resetVolume();
        this._masterGainNode.connect(context.destination);
    }
};

/**
 * 设置事件处理程序
 */
WebAudio._setupEventHandlers = function() {
    const onUserGesture = this._onUserGesture.bind(this);
    const onVisibilityChange = this._onVisibilityChange.bind(this);
    document.addEventListener("keydown", onUserGesture);
    document.addEventListener("mousedown", onUserGesture);
    document.addEventListener("touchend", onUserGesture);
    document.addEventListener("visibilitychange", onVisibilityChange);
};

/**
 * 当用户手势
 */
WebAudio._onUserGesture = function() {
    const context = this._context;
    if (context && context.state === "suspended") {
        /**
         * 恢复
         */
        context.resume();
    }
};

/**
 * 可见度变化
 */
WebAudio._onVisibilityChange = function() {
    if (document.visibilityState === "hidden") {
        this._onHide();
    } else {
        this._onShow();
    }
};

/**
 * 当隐藏
 */
WebAudio._onHide = function() {
    if (this._shouldMuteOnHide()) {
        this._fadeOut(1);
    }
};

/**
 * 当显示
 */
WebAudio._onShow = function() {
    if (this._shouldMuteOnHide()) {
        this._fadeIn(1);
    }
};

/**
 * 应该在隐藏时静音
 */
WebAudio._shouldMuteOnHide = function() {
    /**
     * 是移动设备() && !独立的
     */
    return Utils.isMobileDevice() && !window.navigator.standalone;
};

/**
 * 重置音量
 */
WebAudio._resetVolume = function() {
    if (this._masterGainNode) {
        const gain = this._masterGainNode.gain;
        const volume = this._masterVolume;
        const currentTime = this._currentTime();
        gain.setValueAtTime(volume, currentTime);
    }
};

/**
 * 淡入
 * @param {number} duration 时间
 */
WebAudio._fadeIn = function(duration) {
    if (this._masterGainNode) {
        const gain = this._masterGainNode.gain;
        const volume = this._masterVolume;
        const currentTime = this._currentTime();
        gain.setValueAtTime(0, currentTime);
        gain.linearRampToValueAtTime(volume, currentTime + duration);
    }
};

/**
 * 淡出
 * @param {number} duration 时间
 */
WebAudio._fadeOut = function(duration) {
    if (this._masterGainNode) {
        const gain = this._masterGainNode.gain;
        const volume = this._masterVolume;
        const currentTime = this._currentTime();
        gain.setValueAtTime(volume, currentTime);
        gain.linearRampToValueAtTime(0, currentTime + duration);
    }
};

/**
 * 清除
 * Clears the audio data.
 * 清除音频数据。
 */
WebAudio.prototype.clear = function() {
    this.stop();
    this._data = null;
    this._fetchedSize = 0;
    this._fetchedData = [];
    this._buffers = [];
    this._sourceNodes = [];
    this._gainNode = null;
    this._pannerNode = null;
    this._totalTime = 0;
    this._sampleRate = 0;
    this._loop = 0;
    this._loopStart = 0;
    this._loopLength = 0;
    this._loopStartTime = 0;
    this._loopLengthTime = 0;
    this._startTime = 0;
    this._volume = 1;
    this._pitch = 1;
    this._pan = 0;
    this._endTimer = null;
    this._loadListeners = [];
    this._stopListeners = [];
    this._lastUpdateTime = 0;
    this._isLoaded = false;
    this._isError = false;
    this._isPlaying = false;
    this._decoder = null;
};

/**
 * The url of the audio file.
 * 音频文件的网址。
 *
 * @readonly
 * @type string
 * @name WebAudio#url
 */
Object.defineProperty(WebAudio.prototype, "url", {
    get: function() {
        return this._url;
    },
    configurable: true
});

/**
 * The volume of the audio.
 * 音频音量。
 *
 * @type number
 * @name WebAudio#volume
 */
Object.defineProperty(WebAudio.prototype, "volume", {
    get: function() {
        return this._volume;
    },
    set: function(value) {
        this._volume = value;
        if (this._gainNode) {
            this._gainNode.gain.setValueAtTime(
                this._volume,
                WebAudio._currentTime()
            );
        }
    },
    configurable: true
});

/**
 * The pitch of the audio.
 * 音频的音高。
 *
 * @type number
 * @name WebAudio#pitch
 */
Object.defineProperty(WebAudio.prototype, "pitch", {
    get: function() {
        return this._pitch;
    },
    set: function(value) {
        if (this._pitch !== value) {
            this._pitch = value;
            if (this.isPlaying()) {
                this.play(this._loop, 0);
            }
        }
    },
    configurable: true
});

/**
 * The pan of the audio.
 * 音频声像。
 *
 * @type number
 * @name WebAudio#pan
 */
Object.defineProperty(WebAudio.prototype, "pan", {
    get: function() {
        return this._pan;
    },
    set: function(value) {
        this._pan = value;
        this._updatePanner();
    },
    configurable: true
});

/**
 * 是准备好
 * Checks whether the audio data is ready to play.
 * 检查音频数据是否已准备好播放。
 *
 * @returns {boolean} 如果音频数据已准备好播放，则为True。True if the audio data is ready to play.
 */
WebAudio.prototype.isReady = function() {
    return this._buffers && this._buffers.length > 0;
};

/**
 * 是错误
 * Checks whether a loading error has occurred.
 * 检查是否发生加载错误。
 *
 * @returns {boolean} 如果发生加载错误，则为True。True if a loading error has occurred.
 */
WebAudio.prototype.isError = function() {
    return this._isError;
};

/**
 * 正在播放
 * Checks whether the audio is playing.
 * 检查音频是否正在播放。
 *
 * @returns {boolean} 如果正在播放音频，则为True。True if the audio is playing.
 */
WebAudio.prototype.isPlaying = function() {
    return this._isPlaying;
};

/**
 * 播放
 * Plays the audio.
 * 播放音频。
 *
 * @param {boolean} loop 音频数据是否循环播放。 - Whether the audio data play in a loop.
 * @param {number} offset 播放秒数的开始位置。- The start position to play in seconds.
 */
WebAudio.prototype.play = function(loop, offset) {
    this._loop = loop;
    if (this.isReady()) {
        offset = offset || 0;
        this._startPlaying(offset);
    } else if (WebAudio._context) {
        this.addLoadListener(() => this.play(loop, offset));
    }
    this._isPlaying = true;
};

/**
 * 停止
 * Stops the audio.
 * 停止音频。
 */
WebAudio.prototype.stop = function() {
    this._isPlaying = false;
    this._removeEndTimer();
    this._removeNodes();
    this._loadListeners = [];
    if (this._stopListeners) {
        while (this._stopListeners.length > 0) {
            const listner = this._stopListeners.shift();
            listner();
        }
    }
};

/**
 * 销毁
 * Destroys the audio.
 * 销毁音频。
 */
WebAudio.prototype.destroy = function() {
    this._destroyDecoder();
    this.clear();
};

/**
 * 淡入
 * Performs the audio fade-in.
 * 执行音频淡入。
 *
 * @param {number} duration 淡入时间（以秒为单位）。- Fade-in time in seconds.
 */
WebAudio.prototype.fadeIn = function(duration) {
    if (this.isReady()) {
        if (this._gainNode) {
            const gain = this._gainNode.gain;
            const currentTime = WebAudio._currentTime();
            gain.setValueAtTime(0, currentTime);
            gain.linearRampToValueAtTime(this._volume, currentTime + duration);
        }
    } else {
        this.addLoadListener(() => this.fadeIn(duration));
    }
};

/**
 * 淡出
 * Performs the audio fade-out.
 * 执行音频淡出。
 *
 * @param {number} duration 淡出时间，以秒为单位。- Fade-out time in seconds.
 */
WebAudio.prototype.fadeOut = function(duration) {
    if (this._gainNode) {
        const gain = this._gainNode.gain;
        const currentTime = WebAudio._currentTime();
        gain.setValueAtTime(this._volume, currentTime);
        gain.linearRampToValueAtTime(0, currentTime + duration);
    }
    this._isPlaying = false;
    this._loadListeners = [];
};

/**
 * 获取音频的搜索位置。
 * Gets the seek position of the audio.
 */
WebAudio.prototype.seek = function() {
    if (WebAudio._context) {
        let pos = (WebAudio._currentTime() - this._startTime) * this._pitch;
        if (this._loopLengthTime > 0) {
            while (pos >= this._loopStartTime + this._loopLengthTime) {
                pos -= this._loopLengthTime;
            }
        }
        return pos;
    } else {
        return 0;
    }
};

/**
 * 添加加载监听器
 * Adds a callback function that will be called when the audio data is loaded.
 * 添加一个回调函数，该函数将在加载音频数据时被调用。
 *
 * @param {function} listner 回调函数。- The callback function.
 */
WebAudio.prototype.addLoadListener = function(listner) {
    this._loadListeners.push(listner);
};

/**
 * 添加停止监听器
 * Adds a callback function that will be called when the playback is stopped.
 * 添加一个回调函数，该函数将在播放停止时被调用。
 *
 * @param {function} listner 回调函数。- The callback function.
 */
WebAudio.prototype.addStopListener = function(listner) {
    this._stopListeners.push(listner);
};

/**
 * Tries to load the audio again.
 * 尝试再次加载音频。
 */
WebAudio.prototype.retry = function() {
    this._startLoading();
    if (this._isPlaying) {
        this.play(this._loop, 0);
    }
};

/**
 * 开始加载
 */
WebAudio.prototype._startLoading = function() {
    if (WebAudio._context) {
        const url = this._realUrl();
        if (Utils.isLocal()) {
            this._startXhrLoading(url);
        } else {
            this._startFetching(url);
        }
        const currentTime = WebAudio._currentTime();
        this._lastUpdateTime = currentTime - 0.5;
        this._isError = false;
        this._isLoaded = false;
        this._destroyDecoder();
        if (this._shouldUseDecoder()) {
            this._createDecoder();
        }
    }
};

/**
 * 需要使用解码器
 */
WebAudio.prototype._shouldUseDecoder = function() {
    return !Utils.canPlayOgg() && typeof VorbisDecoder === "function";
};

/**
 * 创建解码器
 */
WebAudio.prototype._createDecoder = function() {
    this._decoder = new VorbisDecoder(
        WebAudio._context,
        this._onDecode.bind(this),
        this._onError.bind(this)
    );
};

/**
 * 销毁解码器
 */
WebAudio.prototype._destroyDecoder = function() {
    if (this._decoder) {
        this._decoder.destroy();
        this._decoder = null;
    }
};

/**
 * 真实网址
 */
WebAudio.prototype._realUrl = function() {
    return this._url + (Utils.hasEncryptedAudio() ? "_" : "");
};

/**
 * 开始Xhr加载
 * @param {string} url 网址 
 */
WebAudio.prototype._startXhrLoading = function(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => this._onXhrLoad(xhr);
    xhr.onerror = this._onError.bind(this);
    xhr.send();
};

/**
 * 开始提取
 * @param {string} url 网址 
 */
WebAudio.prototype._startFetching = function(url) {
    const options = { credentials: "same-origin" };
    fetch(url, options)
        .then(response => this._onFetch(response))
        .catch(() => this._onError());
};

/**
 * 当Xhr加载
 * @param {XMLHttpRequest} xhr xhr请求 
 */
WebAudio.prototype._onXhrLoad = function(xhr) {
    if (xhr.status < 400) {
        this._data = new Uint8Array(xhr.response);
        this._isLoaded = true;
        this._updateBuffer();
    } else {
        this._onError();
    }
};


/**
 * 当提取时
 * @param {*} response 响应
 */
WebAudio.prototype._onFetch = function(response) {
    if (response.ok) {
        const reader = response.body.getReader();
        const readChunk = ({ done, value }) => {
            if (done) {
                this._isLoaded = true;
                if (this._fetchedSize > 0) {
                    this._concatenateFetchedData();
                    this._updateBuffer();
                    this._data = null;
                }
                return 0;
            } else {
                this._onFetchProcess(value);
                return reader.read().then(readChunk);
            }
        };
        reader
            .read()
            .then(readChunk)
            .catch(() => this._onError());
    } else {
        this._onError();
    }
};

/**
 * 当错误时
 */
WebAudio.prototype._onError = function() {
    if (this._sourceNodes.length > 0) {
        this._stopSourceNode();
    }
    this._data = null;
    this._isError = true;
};

/**
 * 在提取过程中
 * @param {*} value 
 */
WebAudio.prototype._onFetchProcess = function(value) {
    this._fetchedSize += value.length;
    this._fetchedData.push(value);
    this._updateBufferOnFetch();
};

/**
 * 更新提取缓冲区
 */
WebAudio.prototype._updateBufferOnFetch = function() {
    const currentTime = WebAudio._currentTime();
    const deltaTime = currentTime - this._lastUpdateTime;
    const currentData = this._data;
    const currentSize = currentData ? currentData.length : 0;
    if (deltaTime >= 1 && currentSize + this._fetchedSize >= 200000) {
        this._concatenateFetchedData();
        this._updateBuffer();
        this._lastUpdateTime = currentTime;
    }
};

/**
 * 连接提取的数据
 */
WebAudio.prototype._concatenateFetchedData = function() {
    const currentData = this._data;
    const currentSize = currentData ? currentData.length : 0;
    const newData = new Uint8Array(currentSize + this._fetchedSize);
    let pos = 0;
    if (currentData) {
        newData.set(currentData);
        pos += currentSize;
    }
    for (const value of this._fetchedData) {
        newData.set(value, pos);
        pos += value.length;
    }
    this._data = newData;
    this._fetchedData = [];
    this._fetchedSize = 0;
};

/**
 * 更新缓冲区
 */
WebAudio.prototype._updateBuffer = function() {
    const arrayBuffer = this._readableBuffer();
    this._readLoopComments(arrayBuffer);
    this._decodeAudioData(arrayBuffer);
};

/**
 * 可读缓冲区
 * @returns {ArrayBuffer} 返回数组缓冲区
 */
WebAudio.prototype._readableBuffer = function() {
    if (Utils.hasEncryptedAudio()) {
        return Utils.decryptArrayBuffer(this._data.buffer);
    } else {
        return this._data.buffer;
    }
};

/**
 * 解码音频数据
 * @param {ArrayBuffer} arrayBuffer 数组缓冲区
 */
WebAudio.prototype._decodeAudioData = function(arrayBuffer) {
    if (this._shouldUseDecoder()) {
        if (this._decoder) {
            this._decoder.send(arrayBuffer, this._isLoaded);
        }
    } else {
        // [Note] Make a temporary copy of arrayBuffer because
        //   decodeAudioData() detaches it.
        
        // [Note] 制作数组Buffer的临时副本，因为decodeAudioData()会将其分离。
        WebAudio._context
            .decodeAudioData(arrayBuffer.slice())
            .then(buffer => this._onDecode(buffer))
            .catch(() => this._onError());
    }
};

/**
 * 当解码
 * @param {AudioBuffer} buffer 音频缓冲器
 */
WebAudio.prototype._onDecode = function(buffer) {
    if (!this._shouldUseDecoder()) {
        this._buffers = [];
        this._totalTime = 0;
    }
    this._buffers.push(buffer);
    this._totalTime += buffer.duration;
    if (this._loopLength > 0 && this._sampleRate > 0) {
        this._loopStartTime = this._loopStart / this._sampleRate;
        this._loopLengthTime = this._loopLength / this._sampleRate;
    } else {
        this._loopStartTime = 0;
        this._loopLengthTime = this._totalTime;
    }
    if (this._sourceNodes.length > 0) {
        this._refreshSourceNode();
    }
    this._onLoad();
};

/**
 * 刷新源节点
 */
WebAudio.prototype._refreshSourceNode = function() {
    if (this._shouldUseDecoder()) {
        const index = this._buffers.length - 1;
        this._createSourceNode(index);
        if (this._isPlaying) {
            this._startSourceNode(index);
        }
    } else {
        this._stopSourceNode();
        this._createAllSourceNodes();
        if (this._isPlaying) {
            this._startAllSourceNodes();
        }
    }
    if (this._isPlaying) {
        this._removeEndTimer();
        this._createEndTimer();
    }
};

/**
 * 开始播放
 * @param {*} offset 
 */
WebAudio.prototype._startPlaying = function(offset) {
    if (this._loopLengthTime > 0) {
        while (offset >= this._loopStartTime + this._loopLengthTime) {
            offset -= this._loopLengthTime;
        }
    }
    this._startTime = WebAudio._currentTime() - offset / this._pitch;
    this._removeEndTimer();
    this._removeNodes();
    this._createPannerNode();
    this._createGainNode();
    this._createAllSourceNodes();
    this._startAllSourceNodes();
    this._createEndTimer();
};

/**
 * 开始所有源节点
 */
WebAudio.prototype._startAllSourceNodes = function() {
    for (let i = 0; i < this._sourceNodes.length; i++) {
        this._startSourceNode(i);
    }
};

/**
 * 开始源节点
 * @param {*} index 
 */
WebAudio.prototype._startSourceNode = function(index) {
    const sourceNode = this._sourceNodes[index];
    const seekPos = this.seek();
    const currentTime = WebAudio._currentTime();
    const loop = this._loop;
    const loopStart = this._loopStartTime;
    const loopLength = this._loopLengthTime;
    const loopEnd = loopStart + loopLength;
    const pitch = this._pitch;
    let chunkStart = 0;
    for (let i = 0; i < index; i++) {
        chunkStart += this._buffers[i].duration;
    }
    const chunkEnd = chunkStart + sourceNode.buffer.duration;
    let when = 0;
    let offset = 0;
    let duration = sourceNode.buffer.duration;
    if (seekPos >= chunkStart && seekPos < chunkEnd - 0.01) {
        when = currentTime;
        offset = seekPos - chunkStart;
    } else {
        when = currentTime + (chunkStart - seekPos) / pitch;
        offset = 0;
        if (loop) {
            if (when < currentTime - 0.01) {
                when += loopLength / pitch;
            }
            if (seekPos >= loopStart && chunkStart < loopStart) {
                when += (loopStart - chunkStart) / pitch;
                offset = loopStart - chunkStart;
            }
        }
    }
    if (loop && loopEnd < chunkEnd) {
        duration = loopEnd - chunkStart - offset;
    }
    if (this._shouldUseDecoder()) {
        if (when >= currentTime && offset < duration) {
            sourceNode.loop = false;
            sourceNode.start(when, offset, duration);
            if (loop && chunkEnd > loopStart) {
                sourceNode.onended = () => {
                    this._createSourceNode(index);
                    this._startSourceNode(index);
                };
            }
        }
    } else {
        if (when >= currentTime && offset < sourceNode.buffer.duration) {
            sourceNode.start(when, offset);
        }
    }
    chunkStart += sourceNode.buffer.duration;
};

/**
 * 停止源节点
 */
WebAudio.prototype._stopSourceNode = function() {
    for (const sourceNode of this._sourceNodes) {
        try {
            sourceNode.onended = null;
            sourceNode.stop();
        } catch (e) {
            // Ignore InvalidStateError
        }
    }
};

/**
 * 创建声像节点
 */
WebAudio.prototype._createPannerNode = function() {
    this._pannerNode = WebAudio._context.createPanner();
    this._pannerNode.panningModel = "equalpower";
    this._pannerNode.connect(WebAudio._masterGainNode);
    this._updatePanner();
};

/**
 * 创建增益节点
 */
WebAudio.prototype._createGainNode = function() {
    const currentTime = WebAudio._currentTime();
    this._gainNode = WebAudio._context.createGain();
    this._gainNode.gain.setValueAtTime(this._volume, currentTime);
    this._gainNode.connect(this._pannerNode);
};

/**
 * 创建所有源节点
 */
WebAudio.prototype._createAllSourceNodes = function() {
    for (let i = 0; i < this._buffers.length; i++) {
        this._createSourceNode(i);
    }
};

/**
 * 创建源节点
 * @param {*} index 
 */
WebAudio.prototype._createSourceNode = function(index) {
    const sourceNode = WebAudio._context.createBufferSource();
    const currentTime = WebAudio._currentTime();
    sourceNode.buffer = this._buffers[index];
    sourceNode.loop = this._loop && this._isLoaded;
    sourceNode.loopStart = this._loopStartTime;
    sourceNode.loopEnd = this._loopStartTime + this._loopLengthTime;
    sourceNode.playbackRate.setValueAtTime(this._pitch, currentTime);
    sourceNode.connect(this._gainNode);
    this._sourceNodes[index] = sourceNode;
};

/**
 * 删除节点
 */
WebAudio.prototype._removeNodes = function() {
    if (this._sourceNodes && this._sourceNodes.length > 0) {
        this._stopSourceNode();
        this._sourceNodes = [];
        this._gainNode = null;
        this._pannerNode = null;
    }
};

/**
 * 创建结束计时器
 */
WebAudio.prototype._createEndTimer = function() {
    if (this._sourceNodes.length > 0 && !this._loop) {
        const endTime = this._startTime + this._totalTime / this._pitch;
        const delay = endTime - WebAudio._currentTime();
        this._endTimer = setTimeout(this.stop.bind(this), delay * 1000);
    }
};

/**
 * 删除结束计时器
 */
WebAudio.prototype._removeEndTimer = function() {
    if (this._endTimer) {
        clearTimeout(this._endTimer);
        this._endTimer = null;
    }
};

/**
 * 更新声像
 */
WebAudio.prototype._updatePanner = function() {
    if (this._pannerNode) {
        const x = this._pan;
        const z = 1 - Math.abs(x);
        this._pannerNode.setPosition(x, 0, z);
    }
};

/**
 * 当加载
 */
WebAudio.prototype._onLoad = function() {
    while (this._loadListeners.length > 0) {
        const listner = this._loadListeners.shift();
        listner();
    }
};

/**
 * 阅读循环注释
 * @param {ArrayBuffer} arrayBuffer 数组缓冲区 
 */
WebAudio.prototype._readLoopComments = function(arrayBuffer) {
    const view = new DataView(arrayBuffer);
    let index = 0;
    while (index < view.byteLength - 30) {
        if (this._readFourCharacters(view, index) !== "OggS") {
            break;
        }
        index += 26;
        const numSegments = view.getUint8(index++);
        const segments = [];
        for (let i = 0; i < numSegments; i++) {
            segments.push(view.getUint8(index++));
        }
        const packets = [];
        while (segments.length > 0) {
            let packetSize = 0;
            while (segments[0] === 255) {
                packetSize += segments.shift();
            }
            packetSize += segments.shift();
            packets.push(packetSize);
        }
        let vorbisHeaderFound = false;
        for (const size of packets) {
            if (this._readFourCharacters(view, index + 1) === "vorb") {
                const headerType = view.getUint8(index);
                if (headerType === 1) {
                    this._sampleRate = view.getUint32(index + 12, true);
                } else if (headerType === 3) {
                    this._readMetaData(view, index, size);
                }
                vorbisHeaderFound = true;
            }
            index += size;
        }
        if (!vorbisHeaderFound) {
            break;
        }
    }
};

/**
 * 读取元数据
 * @param {DataView} view 视图
 * @param {number} index 索引
 * @param {number} size 长度
 */
WebAudio.prototype._readMetaData = function(view, index, size) {
    for (let i = index; i < index + size - 10; i++) {
        if (this._readFourCharacters(view, i) === "LOOP") {
            let text = "";
            while (view.getUint8(i) > 0) {
                text += String.fromCharCode(view.getUint8(i++));
            }
            if (text.match(/LOOPSTART=([0-9]+)/)) {
                this._loopStart = parseInt(RegExp.$1);
            }
            if (text.match(/LOOPLENGTH=([0-9]+)/)) {
                this._loopLength = parseInt(RegExp.$1);
            }
            if (text === "LOOPSTART" || text === "LOOPLENGTH") {
                let text2 = "";
                i += 16;
                while (view.getUint8(i) > 0) {
                    text2 += String.fromCharCode(view.getUint8(i++));
                }
                if (text === "LOOPSTART") {
                    this._loopStart = parseInt(text2);
                } else {
                    this._loopLength = parseInt(text2);
                }
            }
        }
    }
};

/**
 * 阅读四个字符
 * @param {DataView} view 视图
 * @param {number} index 索引
 */
WebAudio.prototype._readFourCharacters = function(view, index) {
    let string = "";
    if (index <= view.byteLength - 4) {
        for (let i = 0; i < 4; i++) {
            string += String.fromCharCode(view.getUint8(index + i));
        }
    }
    return string;
};

