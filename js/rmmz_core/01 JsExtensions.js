//-----------------------------------------------------------------------------
/**
 * This section contains some methods that will be added to the standard
 * Javascript objects.
 *
 * 本节包含一些将添加到标准Javascript对象中的方法。
 * @namespace JsExtensions Js扩展
 */

/**
 * Makes a shallow copy of the array.
 * 制作数组的浅副本。
 *
 * @memberof JsExtensions
 * @returns {array} 数组的浅副本。A shallow copy of the array.
 */
Array.prototype.clone = function() {
    return this.slice(0);
};

Object.defineProperty(Array.prototype, "clone", {
    enumerable: false
});

/**
 * 包含
 * Checks whether the array contains a given element.
 * 检查数组是否包含给定元素。
 *
 * @memberof JsExtensions
 * @param {any} element 要搜索的元素。- The element to search for.
 * @returns {boolean} 如果数组包含给定元素，则为true。True if the array contains a given element.
 * @deprecated 应该使用include()代替。includes() should be used instead.
 */
Array.prototype.contains = function(element) {
    return this.includes(element);
};

/**
 * 包含
 */
Object.defineProperty(Array.prototype, "contains", {
    enumerable: false
});

/**
 * 等于
 * Checks whether the two arrays are the same.
 * 检查两个数组是否相同。
 *
 * @memberof JsExtensions
 * @param {array} array 要比较的数组。- The array to compare to.
 * @returns {boolean} 如果两个数组相同，则为true。True if the two arrays are the same.
 */
Array.prototype.equals = function(array) {
    if (!array || this.length !== array.length) {
        return false;
    }
    for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i])) {
                return false;
            }
        } else if (this[i] !== array[i]) {
            return false;
        }
    }
    return true;
};

/**
 * 等于
 */
Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
});

/**
 * 移除
 * Removes a given element from the array (in place).
 * 从数组中移除给定的元素（处理本数组）。
 *
 * @memberof JsExtensions
 * @param {any} element 要删除的元素。- The element to remove.
 * @returns {array} 删除后的数组。The array after remove.
 */
Array.prototype.remove = function(element) {
    for (;;) {
        const index = this.indexOf(element);
        if (index >= 0) {
            this.splice(index, 1);
        } else {
            return this;
        }
    }
};

/**
 * 去掉
 */
Object.defineProperty(Array.prototype, "remove", {
    enumerable: false
});

/**
 * Generates a random integer in the range (0, max-1).
 * 生成范围为（0，max-1）的随机整数。
 *
 * @memberof JsExtensions
 * @param {number} max 上限（不包括）。- The upper boundary (excluded).
 * @returns {number} 一个随机整数。A random integer.
 */
Math.randomInt = function(max) {
    return Math.floor(max * Math.random());
};

/**
 * Returns a number whose value is limited to the given range.
 * 返回一个数字，其值限制在给定范围内。
 *
 * @memberof JsExtensions
 * @param {number} min -下限。- The lower boundary.
 * @param {number} max -上限。- The upper boundary.
 * @returns {number} 范围内的数字（最小，最大）。A number in the range (min, max).
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

/**
 * Returns a modulo value which is always positive.
 * 返回始终为正的模值。
 *
 * @memberof JsExtensions
 * @param {number} n 除数。- The divisor.
 * @returns {number} 模值。 A modulo value.
 */
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

/**
 * Makes a number string with leading zeros.
 *使数字字符串前填充零。
 *
 * @memberof JsExtensions
 * @param {number} length 输出字符串的长度。- The length of the output string.
 * @returns {string} 带有前填充0的字符串。 A string with leading zeros.
 */
Number.prototype.padZero = function(length) {
    return String(this).padZero(length);
};

/**
 * Checks whether the string contains a given string.
 * 检查字符串是否包含给定的字符串。
 *
 * @memberof JsExtensions
 * @param {string} string 要搜索的字符串。- The string to search for.
 * @returns {boolean} 如果字符串包含给定的字符串，则为True。 True if the string contains a given string.
 * @deprecated 应该使用include()代替。 includes() should be used instead.
 */
String.prototype.contains = function(string) {
    return this.includes(string);
};

/**
 * 将字符串中的%1, %2等替换为参数。
 * Replaces %1, %2 and so on in the string to the arguments.
 *
 * @memberof JsExtensions
 * @param {any} ... args要格式化的对象。 ...args The objects to format.
 * @returns {string} 格式化的字符串。A formatted string.
 */
String.prototype.format = function() {
    return this.replace(/%([0-9]+)/g, (s, n) => arguments[Number(n) - 1]);
};

/**
 * 填充零
 * Makes a number string with leading zeros.
 * 使数字字符串前添加零。
 *
 * @memberof JsExtensions
 * @param {number} length 输出字符串的长度。- The length of the output string.
 * @returns {string} 带有前填充0的字符串。A string with leading zeros.
 */
String.prototype.padZero = function(length) {
    return this.padStart(length, "0");
};

