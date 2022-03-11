//-----------------------------------------------------------------------------
/**
 * Json加强
 * The static class that handles JSON with object information.
 * 处理带有对象信息的JSON的静态类。
 *
 * @namespace
 */
function JsonEx() {
    throw new Error("This is a static class");
}

/**
 * The maximum depth of objects.
 * 对象的最大深度。
 *
 * @type number
 * @default 100
 */
JsonEx.maxDepth = 100;

/**
 * Converts an object to a JSON string with object information.
 * 将对象转换为带有对象信息的JSON字符串。
 *
 * @param {object} object 要转换的对象。- The object to be converted.
 * @returns {string} JSON字符串。The JSON string.
 */
JsonEx.stringify = function(object) {
    return JSON.stringify(this._encode(object, 0));
};

/**
 * Parses a JSON string and reconstructs the corresponding object.
 * 解析JSON字符串并重建相应的对象。
 *
 * @param {string} json JSON字符串。- The JSON string.
 * @returns {object} 重建的对象。The reconstructed object.
 */
JsonEx.parse = function(json) {
    return this._decode(JSON.parse(json));
};

/**
 * 进行深拷贝
 * Makes a deep copy of the specified object.
 * 制作指定对象的深层副本。
 *
 * @param {object} object 要复制的对象。- The object to be copied.
 * @returns {object} 复制的对象。The copied object.
 */
JsonEx.makeDeepCopy = function(object) {
    return this.parse(this.stringify(object));
};

/**
 * 编码
 * @param {*} value 值
 * @param {*} depth 深度
 */
JsonEx._encode = function(value, depth) {
    // [Note] The handling code for circular references in certain versions of
    //   MV has been removed because it was too complicated and expensive.
    
    // [Note] 某些版本的MV中循环引用的处理代码已删除，因为它太复杂且太昂贵了。
    if (depth >= this.maxDepth) {
        throw new Error("Object too deep");
    }
    const type = Object.prototype.toString.call(value);
    if (type === "[object Object]" || type === "[object Array]") {
        const constructorName = value.constructor.name;
        if (constructorName !== "Object" && constructorName !== "Array") {
            value["@"] = constructorName;
        }
        for (const key of Object.keys(value)) {
            value[key] = this._encode(value[key], depth + 1);
        }
    }
    return value;
};

/**
 * 解码
 * @param {*} value 
 */
JsonEx._decode = function(value) {
    const type = Object.prototype.toString.call(value);
    if (type === "[object Object]" || type === "[object Array]") {
        if (value["@"]) {
            const constructor = window[value["@"]];
            if (constructor) {
                Object.setPrototypeOf(value, constructor.prototype);
            }
        }
        for (const key of Object.keys(value)) {
            value[key] = this._decode(value[key]);
        }
    }
    return value;
};

