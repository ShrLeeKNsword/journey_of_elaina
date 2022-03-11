//-----------------------------------------------------------------------------
/**
 * The static class that handles video playback.
 * 处理视频播放的静态类。
 *
 * @namespace
 */
function Video() {
    throw new Error("This is a static class");
}

/**
 * 初始化
 * Initializes the video system.
 * 初始化视频系统。
 *
 * @param {number} width 视频的宽度。- The width of the video.
 * @param {number} height 视频的高度。- The height of the video.
 */
Video.initialize = function(width, height) {
    this._element = null;
    this._loading = false;
    this._volume = 1;
    this._createElement();
    this._setupEventHandlers();
    this.resize(width, height);
};

/**
 * Changes the display size of the video.
 * 更改视频的显示大小。
 *
 * @param {number} width 视频的宽度。- The width of the video.
 * @param {number} height 视频的高度。- The height of the video.
 */
Video.resize = function(width, height) {
    if (this._element) {
        this._element.style.width = width + "px";
        this._element.style.height = height + "px";
    }
};

/**
 * 播放
 * Starts playback of a video.
 * 开始播放视频。
 *
 * @param {string} src 视频的网址。- The url of the video.
 */
Video.play = function(src) {
    this._element.src = src;
    this._element.onloadeddata = this._onLoad.bind(this);
    this._element.onerror = this._onError.bind(this);
    this._element.onended = this._onEnd.bind(this);
    this._element.load();
    this._loading = true;
};

/**
 * 是正在播放
 * Checks whether the video is playing.
 * 检查视频是否正在播放。
 *
 * @returns {boolean} 如果正在播放视频，则为True。True if the video is playing.
 */
Video.isPlaying = function() {
    return this._loading || this._isVisible();
};

/**
 * 设定音量
 * Sets the volume for videos.
 * 设置视频的音量。
 *
 * @param {number} volume 视频的音量（0到1）。- The volume for videos (0 to 1).
 */
Video.setVolume = function(volume) {
    this._volume = volume;
    if (this._element) {
        this._element.volume = this._volume;
    }
};

/**
 * 创建元素
 */
Video._createElement = function() {
    this._element = document.createElement("video");
    this._element.id = "gameVideo";
    this._element.style.position = "absolute";
    this._element.style.margin = "auto";
    this._element.style.top = 0;
    this._element.style.left = 0;
    this._element.style.right = 0;
    this._element.style.bottom = 0;
    this._element.style.opacity = 0;
    this._element.style.zIndex = 2;
    this._element.setAttribute("playsinline", "");
    this._element.oncontextmenu = () => false;
    document.body.appendChild(this._element);
};

/**
 * 当读取
 */
Video._onLoad = function() {
    this._element.volume = this._volume;
    this._element.play();
    this._updateVisibility(true);
    this._loading = false;
};

/**
 * 当错误
 */
Video._onError = function() {
    this._updateVisibility(false);
    const retry = () => {
        this._element.load();
    };
    throw ["LoadError", this._element.src, retry];
};

/**
 * 当结束
 */
Video._onEnd = function() {
    this._updateVisibility(false);
};

/**
 * 更新可见性
 * @param {boolean} videoVisible 视频可见
 */
Video._updateVisibility = function(videoVisible) {
    if (videoVisible) {
        Graphics.hideScreen();
    } else {
        Graphics.showScreen();
    }
    this._element.style.opacity = videoVisible ? 1 : 0;
};

/**
 * 是可见
 */
Video._isVisible = function() {
    return this._element.style.opacity > 0;
};

/**
 * 设置事件处理程序
 */
Video._setupEventHandlers = function() {
    const onUserGesture = this._onUserGesture.bind(this);
    document.addEventListener("keydown", onUserGesture);
    document.addEventListener("mousedown", onUserGesture);
    document.addEventListener("touchend", onUserGesture);
};

/**
 * 当用户手势
 */
Video._onUserGesture = function() {
    if (!this._element.src && this._element.paused) {
        this._element.play().catch(() => 0);
    }
};

