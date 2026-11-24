'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

/**
 * @fileoverview jmList 列表类
 * 
 * jmList 是 jmGraph 库的集合类，继承自原生 Array。
 * 提供了增强的列表操作方法，包括去重添加、条件查找、遍历等。
 * 
 * 主要功能：
 * - 去重添加元素（add）
 * - 条件查找（get）
 * - 正向/反向遍历（each）
 * - 元素计数（count）
 * - 移除回调支持
 * 
 * @module jmList
 * @author jmGraph Team
 * @license MIT
 */

/**
 * jmList 列表类
 * 
 * 继承自 Array 的增强列表类，提供去重、遍历、查找等功能。
 * 主要用于管理图形对象的子元素集合。
 * 
 * @class jmList
 * @extends Array
 * 
 * @param {...*} arg 初始元素或数组
 * 
 * @example
 * // 创建列表
 * const list = new jmList([1, 2, 3]);
 * 
 * // 添加元素（自动去重）
 * list.add(4);
 * list.add([5, 6]);
 * 
 * // 遍历
 * list.each((index, item) => {
 *     console.log(index, item);
 * });
 * 
 * // 条件查找
 * const found = list.get(item => item > 3);
 */
class jmList extends Array {
    /**
     * 构造函数
     * 
     * @param {...*} arg 初始元素或数组
     */
    constructor(...arg) {
        const ps = [];
        if(arg && arg.length && Array.isArray(arg[0])) {
            for(let i=0; i< arg[0].length; i++) ps.push(arg[0][i]);
            super(...ps);
        }
        else {
            super();
        }
        /**
         * 配置选项
         * @type {Object}
         * @property {function} removeHandler 元素移除时的回调函数
         */
        this.option = {};
        /**
         * 类型标识
         * @type {string}
         */
        this.type = 'jmList';
    }

    /**
     * 添加元素到列表
     * 
     * 自动去重，如果元素已存在则不会重复添加。
     * 支持添加单个元素或数组。
     * 
     * @method add
     * @param {*} obj 要添加的元素或数组
     * @returns {*} 添加的元素
     * 
     * @example
     * list.add(1);           // 添加单个元素
     * list.add([2, 3, 4]);   // 添加数组
     */
    add(obj) {
        if(obj && Array.isArray(obj)) {
            for(let i=0; i < obj.length; i++) {
                if(!this.includes(obj[i])) this.push(obj[i]);
            }
            return obj;
        }
        if(typeof obj == 'object' && this.includes(obj)) return obj;
        this.push(obj);
        return obj;
    }

    /**
     * 从列表中移除元素
     * 
     * 移除所有匹配的元素，并触发移除回调。
     * 
     * @method remove
     * @param {*} obj 要移除的元素
     * 
     * @example
     * list.remove(item);
     */
    remove(obj) {
        for(let i = this.length -1; i>=0; i--) {
            if(this[i] == obj) {
                this.removeAt(i);
            }
        }
    }

    /**
     * 移除指定索引位置的元素
     * 
     * @method removeAt
     * @param {number} index 要移除的元素索引
     * 
     * @example
     * list.removeAt(0);  // 移除第一个元素
     */
    removeAt(index) {
        if(this.length > index) {
            const obj = this[index];
            this.splice(index,1);
            if(this.option.removeHandler) this.option.removeHandler.call(this, obj, index);
        }
    }

    /**
     * 检查列表是否包含指定元素
     * 
     * @method contain
     * @param {*} obj 要检查的元素
     * @returns {boolean} 如果包含返回 true，否则返回 false
     * 
     * @example
     * if (list.contain(item)) {
     *     console.log('元素存在');
     * }
     */
    contain(obj) {
        return this.includes(obj);
    }

    /**
     * 获取元素
     * 
     * 如果参数是函数，则返回第一个满足条件的元素；
     * 如果参数是数字，则返回指定索引的元素。
     * 
     * @method get
     * @param {number|function} index 索引或条件函数
     * @returns {*} 找到的元素，如果未找到返回 undefined
     * 
     * @example
     * // 按索引获取
     * const item = list.get(0);
     * 
     * // 按条件查找
     * const found = list.get(item => item.id === 5);
     */
    get(index) {
        if(typeof index == 'function') {
            return this.find(index);
        }
        else {
            return this[index];
        }
    }

    /**
     * 遍历列表
     * 
     * 支持正向和反向遍历。在回调中返回 false 可以中断遍历。
     * 
     * @method each
     * @param {function} cb 回调函数，参数为 (index, item)
     * @param {boolean} [inverse=false] 是否反向遍历
     * 
     * @example
     * // 正向遍历
     * list.each((index, item) => {
     *     console.log(index, item);
     *     if (item.id === 3) return false;  // 中断遍历
     * });
     * 
     * // 反向遍历
     * list.each((index, item) => {
     *     console.log(index, item);
     * }, true);
     */
    each(cb, inverse) {
        if(cb && typeof cb == 'function') {
            if(inverse) {
                for(let i = this.length - 1;i>=0; i--) {
                    const r = cb.call(this, i, this[i]);
                    if(r === false) break;
                }
            }
            else {
                const len = this.length;
                for(let i = 0; i < len;i++) {
                    const r = cb.call(this, i, this[i]);
                    if(r === false) break;
                }
            }
        }
    }

    /**
     * 统计元素数量
     * 
     * 如果提供了条件函数，返回满足条件的元素数量；
     * 否则返回列表总长度。
     * 
     * @method count
     * @param {function} [handler] 条件函数
     * @returns {number} 元素数量
     * 
     * @example
     * const total = list.count();  // 总数量
     * const matched = list.count(item => item.active);  // 满足条件的数量
     */
    count(handler) {
        if(handler && typeof handler == 'function') {
            let count = 0;
            const len = this.length;
            for(let i = 0; i<len;i++) {
                if(handler(this[i])) {
                    count++;
                }
            }
            return count;
        }
        return this.length;
    }

    /**
     * 清空列表
     * 
     * 移除列表中的所有元素。
     * 
     * @method clear
     * 
     * @example
     * list.clear();
     */
    clear() {
        this.splice(0, this.length);
    }
}

/**
 * CSS 颜色关键字映射表
 * 
 * 包含所有 CSS 标准颜色名称到十六进制值的映射。
 * 支持 147 种命名颜色 + CSS 系统颜色。
 * 
 * @constant {Object.<string, string>}
 * @private
 */
const colorKeywords = {
    aliceblue:            "#f0f8ff",
    antiquewhite:         "#faebd7",
    aqua:                 "#00ffff",
    aquamarine:           "#7fffd4",
    azure:                "#f0ffff",
    beige:                "#f5f5dc",
    bisque:               "#ffe4c4",
    black:                "#000000",
    blanchedalmond:       "#ffebcd",
    blue:                 "#0000ff",
    blueviolet:           "#8a2be2",
    brown:                "#a52a2a",
    burlywood:            "#deb887",
    cadetblue:            "#5f9ea0",
    chartreuse:           "#7fff00",
    chocolate:            "#d2691e",
    coral:                "#ff7f50",
    cornflowerblue:       "#6495ed",
    cornsilk:             "#fff8dc",
    crimson:              "#dc143c",
    cyan:                 "#00ffff",
    darkblue:             "#00008b",
    darkcyan:             "#008b8b",
    darkgoldenrod:        "#b8860b",
    darkgray:             "#a9a9a9",
    darkgreen:            "#006400",
    darkkhaki:            "#bdb76b",
    darkmagenta:          "#8b008b",
    darkolivegreen:       "#556b2f",
    darkorange:           "#ff8c00",
    darkorchid:           "#9932cc",
    darkred:              "#8b0000",
    darksalmon:           "#e9967a",
    darkseagreen:         "#8fbc8f",
    darkslateblue:        "#483d8b",
    darkslategray:        "#2f4f4f",
    darkslategrey:        "#2f4f4f",
    darkturquoise:        "#00ced1",
    darkviolet:           "#9400d3",
    deeppink:             "#ff1493",
    deepskyblue:          "#00bfff",
    dimgray:              "#696969",
    dimgrey:              "#696969",
    dodgerblue:           "#1e90ff",
    firebrick:            "#b22222",
    floralwhite:          "#fffaf0",
    forestgreen:          "#228b22",
    fuchsia:              "#ff00ff",
    gainsboro:            "#dcdcdc",
    ghostwhite:           "#f8f8ff",
    gold:                 "#ffd700",
    goldenrod:            "#daa520",
    gray:                 "#808080",
    green:                "#008000",
    greenyellow:          "#adff2f",
    grey:                 "#808080",
    honeydew:             "#f0fff0",
    hotpink:              "#ff69b4",
    indianred:            "#cd5c5c",
    indigo:               "#4b0082",
    ivory:                "#fffff0",
    khaki:                "#f0e68c",
    lavender:             "#e6e6fa",
    lavenderblush:        "#fff0f5",
    lawngreen:            "#7cfc00",
    lemonchiffon:         "#fffacd",
    lightblue:            "#add8e6",
    lightcoral:           "#f08080",
    lightcyan:            "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgrey:            "#d3d3d3",
    lightgreen:           "#90ee90",
    lightpink:            "#ffb6c1",
    lightsalmon:          "#ffa07a",
    lightseagreen:        "#20b2aa",
    lightskyblue:         "#87cefa",
    lightslategray:       "#778899",
    lightslategrey:       "#778899",
    lightsteelblue:       "#b0c4de",
    lightyellow:          "#ffffe0",
    lime:                 "#00ff00",
    limegreen:            "#32cd32",
    linen:                "#faf0e6",
    magenta:              "#ff00ff",
    maroon:               "#800000",
    mediumaquamarine:     "#66cdaa",
    mediumblue:           "#0000cd",
    mediumorchid:         "#ba55d3",
    mediumpurple:         "#9370d8",
    mediumseagreen:       "#3cb371",
    mediumslateblue:      "#7b68ee",
    mediumspringgreen:    "#00fa9a",
    mediumturquoise:      "#48d1cc",
    mediumvioletred:      "#c71585",
    midnightblue:         "#191970",
    mintcream:            "#f5fffa",
    mistyrose:            "#ffe4e1",
    moccasin:             "#ffe4b5",
    navajowhite:          "#ffdead",
    navy:                 "#000080",
    oldlace:              "#fdf5e6",
    olive:                "#808000",
    olivedrab:            "#6b8e23",
    orange:               "#ffa500",
    orangered:            "#ff4500",
    orchid:               "#da70d6",
    palegoldenrod:        "#eee8aa",
    palegreen:            "#98fb98",
    paleturquoise:        "#afeeee",
    palevioletred:        "#d87093",
    papayawhip:           "#ffefd5",
    peachpuff:            "#ffdab9",
    peru:                 "#cd853f",
    pink:                 "#ffc0cb",
    plum:                 "#dda0dd",
    powderblue:           "#b0e0e6",
    purple:               "#800080",
    red:                  "#ff0000",
    rebeccapurple:        "#663399",
    rosybrown:            "#bc8f8f",
    royalblue:            "#4169e1",
    saddlebrown:          "#8b4513",
    salmon:               "#fa8072",
    sandybrown:           "#f4a460",
    seagreen:             "#2e8b57",
    seashell:             "#fff5ee",
    sienna:               "#a0522d",
    silver:               "#c0c0c0",
    skyblue:              "#87ceeb",
    slateblue:            "#6a5acd",
    slategray:            "#708090",
    slategrey:            "#708090",
    snow:                 "#fffafa",
    springgreen:          "#00ff7f",
    steelblue:            "#4682b4",
    tan:                  "#d2b48c",
    teal:                 "#008080",
    thistle:              "#d8bfd8",
    tomato:               "#ff6347",
    turquoise:            "#40e0d0",
    violet:               "#ee82ee",
    wheat:                "#f5deb3",
    white:                "#ffffff",
    whitesmoke:           "#f5f5f5",
    yellow:               "#ffff00",
    yellowgreen:          "#9acd32",
    transparent:          "rgba(0,0,0,0)",
    // grey 别名（已有 darkslategrey/lightslategrey/slategrey/dimgrey）
    // 以下为 CSS 系统颜色
    activeborder:         "#bfcaca",
    activecaption:        "#000080",
    appworkspace:         "#ababab",
    background:           "#636363",
    buttonface:           "#c0c0c0",
    buttonhighlight:      "#dedede",
    buttonshadow:         "#808080",
    buttontext:           "#000000",
    captiontext:          "#000000",
    graytext:             "#808080",
    highlight:            "#b3d4fc",
    highlighttext:        "#000000",
    inactiveborder:       "#d4d0c8",
    inactivecaption:      "#bfbbb0",
    inactivecaptiontext:  "#545454",
    infobackground:       "#fbfcc5",
    infotext:             "#000000",
    menu:                 "#c0c0c0",
    menutext:             "#000000",
    scrollbar:            "#c0c0c0",
    threeddarkshadow:     "#696969",
    threedface:           "#c0c0c0",
    threedhighlight:      "#dfdfdf",
    threedlightshadow:    "#dcdcdc",
    threedshadow:         "#808080",
    window:               "#ffffff",
    windowframe:          "#646464",
    windowtext:           "#000000"
  };

/**
 * jmGraph 工具类
 * 
 * 提供常用的静态工具方法，包括对象操作、事件处理、几何计算、颜色转换等。
 * 
 * @class jmUtils
 * @static
 * 
 * @example
 * // 克隆对象
 * const newObj = jmUtils.clone({ a: 1, b: 2 });
 * 
 * // 绑定事件
 * jmUtils.bindEvent(element, 'click', handler);
 * 
 * // 检查点是否在多边形内
 * const inside = jmUtils.pointInPolygon({x: 10, y: 10}, polygonPoints);
 */
class jmUtils {
    /**
     * 复制一个对象
     * 
     * @method clone
     * @static
     * @param {object} source 被复制的对象
     * @param {object} target 可选，如果指定就表示复制给这个对象，如果为boolean它就是deep参数
     * @param {boolean} deep 是否深度复制，如果为true,数组内的每个对象都会被复制
     * @param {function} copyHandler 复制对象回调，如果返回undefined，就走后面的逻辑，否则到这里中止
     * @return {object} 参数source的拷贝对象
     */
    static clone(source, target, deep = false, copyHandler = null, deepIndex = 0, cloned = null) {
        // 如果有指定回调，则用回调处理，否则走后面的复制逻辑
        if(typeof copyHandler === 'function') {
            const obj = copyHandler(source, deep, deepIndex);
            if(obj) return obj;
        }

        // 首次调用时初始化克隆映射表（用于处理循环引用）
        if(!cloned) cloned = new WeakMap();

        if(typeof target === 'boolean') {
            deep = target;
            target = undefined;
        }

        // 非对象直接返回
        if(!source || typeof source !== 'object') {
            return typeof target !== 'undefined' ? target : source;
        }

        // 如果source已经被克隆过，直接返回之前的克隆对象，打破循环引用
        if(cloned.has(source)) return cloned.get(source);

        // 数组处理
        if(Array.isArray(source)) {
            //如果为当前泛型，则直接new
            if(this.isType(source, jmList)) {
                return new jmList(source);
            }
            if(deep) {
                let dest = [];
                cloned.set(source, dest);
                for(let i = 0; i < source.length; i++) {
                    dest.push(this.clone(source[i], undefined, deep, copyHandler, deepIndex + 1, cloned));
                }
                return dest;
            }
            return source.slice(0);
        }

        // 不复制页面元素和class对象（如jmControl实例等复杂对象保持引用）
        if(source.tagName || source.getContext || source.emit) {
            return source;
        }

        // 普通对象处理
        target = target || {};
        cloned.set(source, target);

        // 保持原型链一致
        if(source.__proto__) target.__proto__ = source.__proto__;
        
        // 遍历自身可枚举属性（字符串键 + Symbol键），避免触发原型链上宿主对象的getter
        const keys = Object.keys(source).concat(Object.getOwnPropertySymbols(source));
        for(const k of keys) {
            if(k === 'constructor') continue;
            const v = source[k];
            // 不复制页面元素和class对象
            if(v && (v.tagName || v.getContext || v.emit)) {
                target[k] = v;
                continue;
            }

            // 如果不是对象和空，则采用target的属性
            if(typeof target[k] === 'object' || typeof target[k] === 'undefined') {                    
                target[k] = this.clone(v, target[k], deep, copyHandler, deepIndex + 1, cloned);
            }
        }
        return target;
    }

    /**
     * 绑定事件到html对象
     * 
     * @method bindEvent
     * @static
     * @param {element} html元素对象
     * @param {string} name 事件名称
     * @param {function} fun 事件委托
     * @returns {name, fun, target} 返回当前绑定
     */
    static bindEvent(target, name, fun, opt) {
        if(name &&  name.indexOf && name.indexOf(' ') != -1) {
            let ns = name.split(' ');
            for(let i=0;i<ns.length;i++) {
                this.bindEvent(target, ns[i], fun, opt);
            }
        }
        if(target.attachEvent) {
            target.attachEvent("on"+name, fun, opt);
        }    
        else if(target.addEventListener) {
            target.addEventListener(name, fun, opt);
        }
        return {
            name,
            target,
            fun
        };
    }

    /**
     * 从对象中移除事件到
     * 
     * @method removeEvent
     * @static
     * @param {element} html元素对象
     * @param {string} name 事件名称
     * @param {function} fun 事件委托
     */
    static removeEvent(target, name, fun) {
        if(target.removeEventListener) {
            return target.removeEventListener(name, fun, false);
        }    
        else if(target.detachEvent) {
            target.detachEvent('on' + name, fun);
            return true;
        }
        else {
            target['on' + name] = null;
        }
    }

    /**
     * 获取元素的绝对定位
     *
     * @method getElementPosition
     * @static
     * @param {element} el 目标元素对象
     * @return {position} 位置对象(top,left)
     */
    static getElementPosition(el) {    
        let pos = {"top": 0, "left": 0};
        if(!el) return pos;

        if (el.offsetParent) {
            while (el.offsetParent) {
                pos.top += el.offsetTop;
                pos.left += el.offsetLeft;
                el = el.offsetParent;
            }
        }
		else if(el.x) {
			pos.left += el.x;
		}
		else if(el.y){
			pos.top += el.y;
		}
        return pos;
    }
    /**
     * 获取元素事件触发的位置
     *
     * @method getEventPosition
     * @static
     * @param {eventArg} evt 当前触发事件的参数
     * @param {point} [scale] 当前画布的缩放比例
     * @return {point} 事件触发的位置 
     */
    static getEventPosition (evt, scale) {
        evt = evt || event;
        const isWXMiniApp = evt.isWXMiniApp;
        let isTouch = false;
        let touches = evt.changedTouches || evt.targetTouches || evt.touches;
        let target = evt.target || evt.srcElement;
        if(touches && touches.length) {
            evt = touches[0];//兼容touch事件            
            if(!evt.target) evt.target = target;
            isTouch = true;
        }
        let px = evt.pageX || evt.x;
        if(typeof px == 'undefined')  px = evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);    
        let py = evt.pageY || evt.y;
        if(typeof py == 'undefined')  py = evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop);

        let ox = evt.offsetX;
        let oy = evt.offsetY;
        if(typeof ox === 'undefined' && typeof oy === 'undefined') {
            // 小程序下取x,y就是它的相对坐标
            if(isWXMiniApp) {
                ox = evt.x;
                oy = evt.y;
            }
            else {
                let p = this.getElementPosition(target);
                ox= px - p.left;
                oy = py - p.top;
            }
        }
        if(scale) {
            if(scale.x) ox = ox / scale.x;
            if(scale.y) oy = oy / scale.y;
        }

        return {
            pageX: px,
            pageY: py,
            clientX: evt.clientX,
            clientY: evt.clientY,
            //相对于容器偏移量
            offsetX: ox,
            offsetY: oy,
            layerX: evt.layerX,
            layerY: evt.layerY,
            screenX: evt.screenX,
            screenY: evt.screenY,
            x: ox,
            y: oy,
            isTouch: isTouch,
            touches,
            isWXMiniApp
        };
    }

    /**
     * 检 查对象是否为指定的类型,不包括继承
     * 
     * @method isType
     * @static
     * @param {object} target 需要判断类型的对象
     * @param {class} type 对象类型
     * @return {boolean} 返回对象是否为指定类型 
     */
    static isType(target, type) {
        if(!target || typeof target !== 'object') return false;
        if(target.constructor === type) return true;
        /*if(target.__baseType) {        
            return jmUtils.isType(target.__baseType.prototype,type);
        }*/

        //return target instanceof type;
        return false;
    }
    /**
     * 判断点是否在多边形内
     * 如果一个点在多边形内部，任意角度做射线肯定会与多边形要么有一个交点，要么有与多边形边界线重叠。
     * 如果一个点在多边形外部，任意角度做射线要么与多边形有一个交点，要么有两个交点，要么没有交点，要么有与多边形边界线重叠。
     * 利用上面的结论，我们只要判断这个点与多边形的交点个数，就可以判断出点与多边形的位置关系了。
     * 
     * @method pointInPolygon
     * @static
     * @param {point} pt 坐标对象
     * @param {array} polygon 多边型角坐标对象数组
     * @param {number} offset 判断可偏移值
     * @return {integer} 0= 不在图形内和线上，1=在边上，2=在图形内部
     */
    static pointInPolygon(pt, polygon, offset) {
        offset = offset || 1;
        offset = offset / 2;
        const n = polygon.length;
        
        if(!polygon || n == 0) return 0;
        
        if(n == 1) {
            return Math.abs(polygon[0].x - pt.x) <= offset && Math.abs(polygon[0].y - pt.y) <= offset ? 1 : 0;
        }
        
        if(n == 2) {
            return this.pointOnLine(pt, polygon[0], polygon[1], offset);
        }

        for (let i = 0; i < n; i++) {
            if (Math.abs(polygon[i].x - pt.x) <= offset && 
                Math.abs(polygon[i].y - pt.y) <= offset) {
                return 1;
            }
        }

        return this.rayCasting(pt, polygon, offset);
    }

    /**
     * 判断点是否在线段上
     * 
     * 通过计算点到线段的垂直距离来判断点是否在线段上。
     * 同时检查点是否在线段的范围内（不仅仅是直线上）。
     * 
     * @method pointOnLine
     * @static
     * @private
     * @param {Object} pt 待检测的点 {x, y}
     * @param {Object} p1 线段起点 {x, y}
     * @param {Object} p2 线段终点 {x, y}
     * @param {number} offset 允许的偏差值（像素）
     * @returns {number} 0=不在线段上, 1=在线段上
     * 
     * @example
     * const onLine = jmUtils.pointOnLine(
     *     {x: 5, y: 5},      // 待检测点
     *     {x: 0, y: 0},      // 起点
     *     {x: 10, y: 10},    // 终点
     *     2                  // 允许偏差
     * );
     * // 返回 1，点在对角线上
     */
    static pointOnLine(pt, p1, p2, offset) {
        const minX = Math.min(p1.x, p2.x);
        const maxX = Math.max(p1.x, p2.x);
        const minY = Math.min(p1.y, p2.y);
        const maxY = Math.max(p1.y, p2.y);

        if (minX - pt.x > offset || pt.x - maxX > offset) {
            return 0;
        }
        if (minY - pt.y > offset || pt.y - maxY > offset) {
            return 0;
        }

        if (p1.x == p2.x) {
            return Math.abs(p1.x - pt.x) <= offset && 
                   (pt.y - p1.y) * (pt.y - p2.y) <= 0 ? 1 : 0;
        }

        if (p1.y == p2.y) {
            return Math.abs(p1.y - pt.y) <= offset && 
                   (pt.x - p1.x) * (pt.x - p2.x) <= 0 ? 1 : 0;
        }

        if (Math.abs(p1.x - pt.x) < offset && Math.abs(p1.y - pt.y) < offset) {
            return 1;
        }
        if (Math.abs(p2.x - pt.x) < offset && Math.abs(p2.y - pt.y) < offset) {
            return 1;
        }

        if (pt.y != p1.y && pt.y != p2.y) {
            const f = (p2.x - p1.x) / (p2.y - p1.y) * (pt.y - p1.y);
            const ff = (pt.y - p1.y) / Math.sqrt(f * f + (pt.y - p1.y) * (pt.y - p1.y));
            const l = ff * (pt.x - p1.x - f);
            
            return Math.abs(l) <= offset ? 1 : 0;
        }
        return 0;
    }

    /**
     * 射线法判断点是否在多边形内部
     * 
     * 从待测点向右发射一条水平射线，计算与多边形边界的交点数量。
     * - 交点数为奇数：点在多边形内部
     * - 交点数为偶数：点在多边形外部
     * 
     * 这是判断点是否在任意多边形内的经典算法，时间复杂度 O(n)。
     * 
     * @method rayCasting
     * @static
     * @private
     * @param {Object} pt 待检测的点 {x, y}
     * @param {Array<Object>} polygon 多边形顶点数组 [{x, y}, ...]
     * @param {number} offset 允许的偏差值（未使用）
     * @returns {number} 0=在多边形外部, 2=在多边形内部
     * 
     * @see {@link https://en.wikipedia.org/wiki/Point_in_polygon Point in polygon - Wikipedia}
     */
    static rayCasting(pt, polygon, offset) {
        const n = polygon.length;
        let inside = false;
        const testY = pt.y;
        const testX = pt.x;

        for (let i = 0, j = n - 1; i < n; j = i++) {
            const yi = polygon[i].y;
            const yj = polygon[j].y;
            const xi = polygon[i].x;
            const xj = polygon[j].x;

            const intersect = ((yi > testY) !== (yj > testY)) &&
                (testX < (xj - xi) * (testY - yi) / (yj - yi) + xi);

            if (intersect) {
                inside = !inside;
            }
        }

        return inside ? 2 : 0;
    }

    /**
     * @method judge 判断点是否在多边形中
     * @param {point} dot {{x,y}} 需要判断的点
     * @param {array} coordinates {{x,y}} 多边形点坐标的数组，为保证图形能够闭合，起点和终点必须相等。
     *        比如三角形需要四个点表示，第一个点和最后一个点必须相同。 
     * @param  {number} 是否为实心 1= 是
     * @returns {boolean} 结果 true=在形状内
     */
    /*static judge(dot,coordinates,noneZeroMode) {
        // 默认启动none zero mode
        noneZeroMode=noneZeroMode||1;
        var x = dot.x,y=dot.y;
        var crossNum = 0;
        // 点在线段的左侧数目
        var leftCount = 0;
        // 点在线段的右侧数目
        var rightCount = 0;
        for(var i=0;i<coordinates.length-1;i++){
            var start = coordinates[i];
            var end = coordinates[i+1];
                
            // 起点、终点斜率不存在的情况
            if(start.x===end.x) {
                // 因为射线向右水平，此处说明不相交
                if(x>start.x) continue;
                
                // 从左侧贯穿
                if((end.y>start.y&&y>=start.y && y<=end.y)){
                    leftCount++;
                    crossNum++;
                }
                // 从右侧贯穿
                if((end.y<start.y&&y>=end.y && y<=start.y)) {
                    rightCount++;
                    crossNum++;
                }
                continue;
            }
            // 斜率存在的情况，计算斜率
            var k=(end.y-start.y)/(end.x-start.x);
            // 交点的x坐标
            var x0 = (y-start.y)/k+start.x;
            // 因为射线向右水平，此处说明不相交
            if(x>x0) continue;
                
            if((end.x>start.x&&x0>=start.x && x0<=end.x)){
                crossNum++;
                if(k>=0) leftCount++;
                else rightCount++;
            }
            if((end.x<start.x&&x0>=end.x && x0<=start.x)) {
                crossNum++;
                if(k>=0) rightCount++;
                else leftCount++;
            }
        }
        
        return noneZeroMode===1?leftCount-rightCount!==0:crossNum%2===1;
    }*/

    /**
     * 检查边界，子对象是否超出父容器边界
     * 当对象偏移offset后是否出界
     * 返回(left:0,right:0,top:0,bottom:0)
     * 如果right>0表示右边出界right偏移量,left<0则表示左边出界left偏移量
     * 如果bottom>0表示下边出界bottom偏移量,top<0则表示上边出界ltop偏移量
     *
     * @method checkOutSide
     * @static
     * @param {bound} parentBounds 父对象的边界
     * @param {bound} targetBounds 对象的边界
     * @param {number} offset 判断是否越界可容偏差
     * @return {bound} 越界标识
     */
    static checkOutSide(parentBounds, targetBounds, offset) {
        let result = {left:0,right:0,top:0,bottom:0};
        if(offset.x < 0 ) {
            result.left = targetBounds.left + offset.x - parentBounds.left;
        }
        else if(offset.x > 0 ) {
            result.right = targetBounds.right + offset.x - parentBounds.right;
        }

        if(offset.y < 0 ) {
            result.top = targetBounds.top + offset.y - parentBounds.top;
        }
        else if(offset.y > 0) {
            result.bottom = targetBounds.bottom + offset.y - parentBounds.bottom;
        }
        return result;
    }

    /**
     * 把一个或多个点绕某个点旋转一定角度
     * 先把坐标原点移到旋转中心点，计算后移回
     * @method rotatePoints
     * @static
     * @param {Array/object} p 一个或多个点
     * @param {*} rp 旋转中心点
     * @param {*} r 旋转角度
     */
    static rotatePoints(p, rp, r) {
        if(!r || !p) return p;
        let cos = Math.cos(r);
        let sin = Math.sin(r);
        if(Array.isArray(p)) {
            for(let i=0;i<p.length;i++) {
                if(!p[i]) continue;
                let x1 = p[i].x - rp.x;
                let y1 = p[i].y - rp.y;
                p[i].x = x1 * cos - y1 * sin + rp.x;
                p[i].y = x1 * sin + y1 * cos + rp.y;
            }
        }
        else {
            let x1 = p.x - rp.x;
            let y1 = p.y - rp.y;
            p.x = x1 * cos - y1 * sin + rp.x;
            p.y = x1 * sin + y1 * cos + rp.y;
        }
        return p;
    }

    /**
     * 去除字符串开始字符
     * 
     * @method trimStart
     * @static
     * @param {string} source 需要处理的字符串
     * @param {char} [c] 要去除字符串的前置字符
     * @return {string} 去除前置字符后的字符串
     */
    static trimStart(source, c) {
        c = c || ' ';
        if(source && source.length > 0) {
            let sc = source[0];
            if(sc === c || c.indexOf(sc) >= 0) {
                source = source.substring(1);
                return this.trimStart(source,c);
            }        
        }
        return source;
    }

    /**
     * 去除字符串结束的字符c
     *
     * @method trimEnd
     * @static
     * @param {string} source 需要处理的字符串
     * @param {char} [c] 要去除字符串的后置字符
     * @return {string} 去除后置字符后的字符串
     */
    static trimEnd(source, c) {
        c = c || ' ';
        if(source && source.length > 0) {
            let sc = source[source.length - 1];
            if(sc === c || c.indexOf(sc) >= 0) {
                source = source.substring(0,source.length - 1);
                return this.trimStart(source,c);
            }        
        }
        return source;
    }

    /**
     * 去除字符串开始与结束的字符
     *
     * @method trim
     * @static
     * @param {string} source 需要处理的字符串
     * @param {char} [c] 要去除字符串的字符
     * @return {string} 去除字符后的字符串
     */
    static trim(source,c) {
        return this.trimEnd(this.trimStart(source,c),c);
    }

    /**
     * 检查是否为百分比参数
     *
     * @method checkPercent
     * @static
     * @param {string} 字符串参数
     * @return {boolean} true=当前字符串为百分比参数,false=不是
     */
    static checkPercent(per) {
        if(typeof per === 'string') {
            per = this.trim(per);
            if(per[per.length - 1] == '%') {
                return per;
            }
        }
    }

    /**
     * 转换百分数为数值类型
     *
     * @method percentToNumber
     * @static
     * @param {string} per 把百分比转为数值的参数
     * @return {number} 百分比对应的数值
     */
    static percentToNumber(per) {
        if(typeof per === 'string') {
            let tmp = this.checkPercent(per);
            if(tmp) {
                per = this.trim(tmp,'% ');
                per = per / 100;
            }
        }
        return per;
    }

    /**
     * 转换16进制为数值
     *
     * @method hexToNumber
     * @static
     * @param {string} h 16进制颜色表达
     * @return {number} 10进制表达
     */
    static hexToNumber(h) {
        if(typeof h !== 'string') return h;

        h = h.toLowerCase();
        let hex = '0123456789abcdef';
        let v = 0;
        let l = h.length;
        for(let i=0;i<l;i++) {
            let iv = hex.indexOf(h[i]);
            if(iv == 0) continue;
            
            for(let j=1;j<l - i;j++) {
                iv *= 16;
            }
            v += iv;
        }
        return v;
    }

    /**
     * 转换数值为16进制字符串表达
     *
     * @method hex
     * @static
     * @param {number} v 数值
     * @return {string} 16进制表达
     */
    static numberToHex(v) {
        let hex = '0123456789abcdef';
        
        let h = '';
        while(v > 0) {
            let t = v % 16;
            h = hex[t] + h;
            v = Math.floor(v / 16);
        }
        return h;
    }

    /**
     * 16进制颜色转为r g b a 对象 {r, g , b, a}
     * @param {string}} hex 16进度的颜色
     */
    static hexToRGBA(hex) {
        if(typeof hex === 'string') hex = this.trim(hex);   
        else return hex;

        // 如果缓存存在，则直接返回
        this.__hexToRGBA_Cache = this.__hexToRGBA_Cache || {};
        if(this.__hexToRGBA_Cache[hex]) return this.__hexToRGBA_Cache[hex];

        let res = hex;

        // 系统颜色
        if(colorKeywords[res]) res = colorKeywords[res];

        //当为7位时，表示需要转为带透明度的rgba
        if(res[0] == '#') {
            const color = {
                a: 1
            };
            if(res.length >= 8) {
                color.a = res.substr(1,2);
                color.g = res.substr(5,2);
                color.b = res.substr(7,2);
                color.r = res.substr(3,2);
                //透明度
                color.a = Number((this.hexToNumber(color.a) / 255).toFixed(4));

                color.r = this.hexToNumber(color.r||0);
                color.g = this.hexToNumber(color.g||0);
                color.b = this.hexToNumber(color.b||0);
                res = color; 
            }
            // #cccccc || #ccc
            else if(res.length === 7 || res.length === 4) {
                // #ccc这种情况，把每个位复制一份
                if(res.length === 4) {
                    color.g = res.substr(2, 1);
                    color.g = color.g + color.g;
                    color.b = res.substr(3, 1);
                    color.b = color.b + color.b;
                    color.r = res.substr(1, 1);
                    color.r = color.r + color.r;
                }
                else {
                    color.g = res.substr(3, 2);//除#号外的第二位
                    color.b = res.substr(5, 2);
                    color.r = res.substr(1, 2);
                }

                color.r = this.hexToNumber(color.r||0);
                color.g = this.hexToNumber(color.g||0);
                color.b = this.hexToNumber(color.b||0);
                
                res = color; 
            }
            //如果是5位的话，# 则第2位表示A，后面依次是r,g,b
            else if(res.length === 5) {
                color.a = res.substr(1,1);
                color.g = res.substr(3,1);//除#号外的第二位
                color.b = res.substr(4,1);
                color.r = res.substr(2,1);

                color.r = this.hexToNumber(color.r||0);
                color.g = this.hexToNumber(color.g||0);
                color.b = this.hexToNumber(color.b||0);
                //透明度
                color.a = Number((this.hexToNumber(color.a) / 255).toFixed(4));
                res = color; 
            }
        }  
        if(typeof res === 'string') {
            const m = res.match(/rgb(a)?\s*\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*(,\s*[\d\.]+)?\s*\)/i); 
            if(m && m.length === 6) {
                const color = {
                    r: Number(m[2]),
                    g: Number(m[3]),
                    b: Number(m[4]),
                    a: Number(this.trimStart(m[5]||'1', ','))
                };
                res = color;
            }
        }
        return this.__hexToRGBA_Cache[hex] = res;     
    }

    /**
     * 将 RGB 颜色值从 0-255 范围转换为 0-1 范围
     * 
     * WebGL 中的颜色值通常使用 0-1 的浮点数表示，
     * 此方法用于将标准 RGB 值转换为 WebGL 兼容格式。
     * 
     * @method rgbToDecimal
     * @static
     * @param {Object} color 颜色对象 {r, g, b, a?}
     * @returns {Object} 转换后的颜色对象 {r, g, b, a?}，其中 r/g/b 为 0-1 范围
     * 
     * @example
     * const color = jmUtils.rgbToDecimal({ r: 255, g: 128, b: 64 });
     * // 返回 { r: 1, g: 0.502, b: 0.251 }
     */
    static rgbToDecimal(color) {
        color = this.clone(color);
        color.r = this.byteToDecimal(color.r);
        color.g = this.byteToDecimal(color.g);
        color.b = this.byteToDecimal(color.b);
        return color;
    }

    /**
     * 将字节值（0-255）转换为小数（0-1）
     * 
     * @method byteToDecimal
     * @static
     * @private
     * @param {number} b 字节值（0-255）
     * @returns {number} 小数值（0-1）
     */
    static byteToDecimal(b) {
        return b / 255;
    }

    /**
     * 转换颜色格式，如果输入r,g,b则转为hex格式,如果为hex则转为r,g,b格式
     *
     * @method toColor
     * @static
     * @param {string} hex 16进制颜色表达
     * @return {string} 颜色字符串
     */
    static toColor(r, g, b, a) {    
        if(typeof r === 'string' && r) {
            r = this.trim(r); 
            // 正常的颜色表达，不需要转换
            if(r[0] === '#' && (r.length === 4 || r.length === 7)) return r;

            const color = this.hexToRGBA(r);
            if(typeof color === 'string') return color;
            
            r = typeof color.r !== 'undefined'? color.r: r;
            g = typeof color.g !== 'undefined'? color.g: g;
            b = typeof color.b !== 'undefined'? color.b: b;
            a = typeof color.a !== 'undefined'? color.a: a;
        }
        if(r && typeof r === 'object') {
            g = r.g;
            b = r.b;
            a = r.a || 1;
            r = r.r;
        }
        if(typeof r != 'undefined' && typeof g != 'undefined' && typeof b != 'undefined') {
            if(typeof a != 'undefined') {            
                return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
            }
            else {
                return 'rgb(' + r + ',' + g + ',' + b + ')';
            }
        }
        return r;
    }
    /**
     * 请求动画帧
     * 
     * 封装浏览器原生的 requestAnimationFrame 方法，提供跨浏览器兼容性。
     * 在不支持 requestAnimationFrame 的环境中降级为 setTimeout。
     * 
     * @method requestAnimationFrame
     * @static
     * @param {Function} callback 动画帧回调函数，接收时间戳参数
     * @param {Window} [win] 可选的窗口对象（用于多窗口环境）
     * @returns {number} 动画帧请求ID，用于取消
     * 
     * @example
     * let animationId;
     * function animate(timestamp) {
     *     // 更新动画
     *     animationId = jmUtils.requestAnimationFrame(animate);
     * }
     * animationId = jmUtils.requestAnimationFrame(animate);
     * 
     * // 取消动画
     * jmUtils.cancelAnimationFrame(animationId);
     */
    static requestAnimationFrame(callback, win) {
        let fun = win && win.requestAnimationFrame? win.requestAnimationFrame: (typeof window !== 'undefined' && window.requestAnimationFrame? window.requestAnimationFrame: setTimeout);        
		return fun(callback, 20);
    }
    /**
     * 取消动画帧请求
     * 
     * 取消之前通过 requestAnimationFrame 注册的回调。
     * 在不支持 cancelAnimationFrame 的环境中降级为 clearTimeout。
     * 
     * @method cancelAnimationFrame
     * @static
     * @param {number} handler requestAnimationFrame 返回的请求ID
     * @param {Window} [win] 可选的窗口对象（用于多窗口环境）
     * 
     * @example
     * const animationId = jmUtils.requestAnimationFrame(animate);
     * jmUtils.cancelAnimationFrame(animationId);
     */
    static cancelAnimationFrame(handler, win) {
        let fun = win && win.cancelAnimationFrame? win.cancelAnimationFrame: (typeof window !== 'undefined' && window.cancelAnimationFrame? window.cancelAnimationFrame: clearTimeout);        
		return fun(handler);
    }	
}

/**
 * @fileoverview jmGradient 渐变类
 * 
 * jmGradient 提供了线性渐变和径向渐变的创建和管理功能。
 * 支持从 CSS 渐变字符串解析，以及转换为 Canvas 渐变对象。
 * 
 * 主要功能：
 * - 线性渐变（linear-gradient）
 * - 径向渐变（radial-gradient）
 * - CSS 渐变字符串解析
 * - Canvas 渐变对象生成
 * - WebGL 渐变支持
 * 
 * @module jmGradient
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 渐变类
 * 
 * 用于创建和管理线性渐变或径向渐变效果。
 * 支持 CSS 渐变字符串格式解析，可以转换为 Canvas 或 WebGL 兼容的渐变对象。
 * 
 * @class jmGradient
 * 
 * @param {Object|string} opt 渐变参数对象或 CSS 渐变字符串
 * @param {string} [opt.type='linear'] 渐变类型：'linear' 或 'radial'
 * @param {number|string} [opt.x1] 起点X坐标（支持百分比）
 * @param {number|string} [opt.y1] 起点Y坐标（支持百分比）
 * @param {number|string} [opt.x2] 终点X坐标（支持百分比）
 * @param {number|string} [opt.y2] 终点Y坐标（支持百分比）
 * @param {number|string} [opt.r1] 内圆半径（径向渐变）
 * @param {number|string} [opt.r2] 外圆半径（径向渐变）
 * @param {Array} [opt.stops] 颜色停止点数组 [{offset, color}, ...]
 * 
 * @example
 * // 创建线性渐变
 * const gradient = new jmGradient({
 *     type: 'linear',
 *     x1: 0, y1: 0,
 *     x2: '100%', y2: '100%',
 *     stops: [
 *         { offset: 0, color: '#ff0000' },
 *         { offset: 1, color: '#0000ff' }
 *     ]
 * });
 * 
 * // 从 CSS 字符串创建
 * const gradient = new jmGradient('linear-gradient(180deg, #ff0000, #0000ff)');
 */
class jmGradient {
	constructor(opt) {
		this.stops = new jmList();

		if(opt && typeof opt == 'object') {
			for(let k in opt) {
				if(k === 'stops') continue;
				this[k] = opt[k];
			}
			if(opt.stops && Array.isArray(opt.stops)) {
				this.stops.push(...opt.stops);
			}
		}
		//解析字符串格式
		//linear-gradient(direction, color-stop1, color-stop2, ...);
		//radial-gradient(center, shape size, start-color, ..., last-color);
		else if(typeof opt == 'string') {
			this.fromString(opt);
		}
	}
	/**
	 * 添加渐变色
	 * 
	 * @method addStop
	 * @for jmGradient
	 * @param {number} offset 放射渐变颜色偏移,可为百分比参数。
	 * @param {string} color 当前偏移颜色值
	 */
	addStop(offset, color) {
		this.stops.add({
			offset: Number(offset),
			color: color
		});
	}

	/**
	 * 生成为canvas的渐变对象
	 *
	 * @method toGradient
	 * @for jmGradient
	 * @param {jmControl} control 当前渐变对应的控件
	 * @return {gradient} canvas渐变对象
	 */
	toGradient(control) {
		let gradient;
		let context = control.context || control;
		let bounds = control.absoluteBounds?control.absoluteBounds:control.getAbsoluteBounds();
		let x1 = this.x1||0;
		let y1 = this.y1||0;
		let x2 = this.x2;
		let y2 = this.y2;

		let location = control.getLocation();

		let d = 0;
		if(location.radius) {
			d = location.radius * 2;				
		}
		if(!d) {
			d = Math.min(location.width || 0, location.height || 0);				
		}
		if(d <= 0) {
			d = Math.max(bounds.width || 0, bounds.height || 0, 100);
		}

		const width = bounds.width || d;
		const height = bounds.height || d;

		if(jmUtils.checkPercent(x1)) {
			x1 = jmUtils.percentToNumber(x1) * width;
		}
		else if(typeof x1 === 'number' && x1 >= 0 && x1 <= 1) {
			x1 = x1 * width;
		}
		else if(typeof x1 === 'string') {
			const num = parseFloat(x1);
			if(!isNaN(num)) x1 = num;
		}
		if(jmUtils.checkPercent(x2)) {
			x2 = jmUtils.percentToNumber(x2) * width;
		}
		else if(typeof x2 === 'number' && x2 >= 0 && x2 <= 1) {
			x2 = x2 * width;
		}
		else if(typeof x2 === 'string') {
			const num = parseFloat(x2);
			if(!isNaN(num)) x2 = num;
		}
		if(jmUtils.checkPercent(y1)) {
			y1 = jmUtils.percentToNumber(y1) * height;
		}
		else if(typeof y1 === 'number' && y1 >= 0 && y1 <= 1) {
			y1 = y1 * height;
		}
		else if(typeof y1 === 'string') {
			const num = parseFloat(y1);
			if(!isNaN(num)) y1 = num;
		}
		if(jmUtils.checkPercent(y2)) {
			y2 = jmUtils.percentToNumber(y2) * height;
		}
		else if(typeof y2 === 'number' && y2 >= 0 && y2 <= 1) {
			y2 = y2 * height;
		}
		else if(typeof y2 === 'string') {
			const num = parseFloat(y2);
			if(!isNaN(num)) y2 = num;
		}

		x1 = Number(x1) || 0;
		y1 = Number(y1) || 0;
		x2 = Number(x2) || 0;
		y2 = Number(y2) || 0;

		let sx1 = x1 + (bounds.left || 0);
		let sy1 = y1 + (bounds.top || 0);
		let sx2 = x2 + (bounds.left || 0);
		let sy2 = y2 + (bounds.top || 0);
		if(this.type === 'linear') {
			if(control.mode === 'webgl' && control.webglControl) {
				// WebGL 着色器中 v_text_coord 是绝对坐标，需要传递绝对坐标
				gradient = control.webglControl.createLinearGradient(sx1, sy1, sx2, sy2, bounds);
				gradient.key = this.toString();
			}	
			else {		
				context.createLinearGradient && (gradient = context.createLinearGradient(sx1, sy1, sx2, sy2));
			}
		}
		else if(this.type === 'radial') {
			let r1 = this.r1||0;
			let r2 = this.r2;
			
			if(d <= 0) {
				d = Math.max(bounds.width || 0, bounds.height || 0, 1);
			}
			
			if(jmUtils.checkPercent(r1)) {
				r1 = jmUtils.percentToNumber(r1);			
				r1 = d * r1;
			}
			else if(typeof r1 === 'number' && r1 >= 0 && r1 <= 1) {
				r1 = r1 * d;
			}
			else if(typeof r1 === 'string') {
				r1 = parseFloat(r1) || 0;
			}
			
			if(jmUtils.checkPercent(r2)) {
				r2 = jmUtils.percentToNumber(r2);
				r2 = d * r2;
			}
			else if(typeof r2 === 'number' && r2 >= 0 && r2 <= 1) {
				r2 = r2 * d;
			}
			else if(typeof r2 === 'string') {
				r2 = parseFloat(r2);
			}
			
			if(r2 === undefined || r2 === null || isNaN(Number(r2)) || Number(r2) <= 0) {
				r2 = d / 2;
			}
			
			r1 = Number(r1) || 0;
			r2 = Number(r2) || d / 2;
			
			if(control.mode === 'webgl' && control.webglControl) {
				gradient = control.webglControl.createRadialGradient(sx1, sy1, r1, sx2, sy2, r2, bounds);
				gradient.key = this.toString();
			}	
			else if(context.createRadialGradient) {
				gradient = context.createRadialGradient(sx1, sy1, r1, sx2, sy2, r2);	
			}
			else if(context.createCircularGradient) { 
				gradient = context.createCircularGradient(sx1, sy1, r2);
			}
		}
		
		//颜色渐变
		if(gradient) {
			this.stops.each(function(i,s) {	
				let c = jmUtils.toColor(s.color);
				//s.offset 0.0 ~ 1.0
				gradient && gradient.addColorStop(s.offset, c);		
			});
		}
		else {
			const s = this.stops.get(0);
			return (s && s.color) || '#000';
		}
		
		return gradient;
	}

	/**
	 * 解析渐变字符串
	 * 支持的格式:
	 * - linear-gradient(180deg, #8b5cf6 0%, #6366f1 50%, #4f46e5 100%)
	 * - linear-gradient(to top, red, blue)
	 * - linear-gradient(to right bottom, red, blue)
	 * - linear-gradient(45deg, red, blue)
	 * - linear-gradient(0.5turn, red, blue)
	 * - radial-gradient(circle, red, blue)
	 * - radial-gradient(ellipse at top, red, blue)
	 *
	 * @method fromString
	 * @for jmGradient
	 * @param {string} s 渐变字符串
	 */
	fromString(s) {
		if(!s) {
			console.warn('jmGradient: 渐变字符串为空');
			return;
		}
		// 使用 [\s\S] 匹配任意字符（包括换行符），支持多行渐变字符串
		const gradientMatch = s.match(/(linear|radial)-gradient\s*\(\s*([\s\S]+)\)/i);
		if(!gradientMatch || gradientMatch.length < 3) {
			console.warn('jmGradient: 无效的渐变字符串格式: "' + s + '"');
			return;
		}

		const type = gradientMatch[1].toLowerCase();
		if(type !== 'linear' && type !== 'radial') {
			console.warn('jmGradient: 不支持的渐变类型 "' + type + '"，仅支持 linear 和 radial');
			return;
		}

		this.type = type;
		const content = jmUtils.trim(gradientMatch[2]);

		const splitIndex = this._findSplitIndex(content);
		if(splitIndex < 0) {
			console.warn('jmGradient: 无法解析渐变内容: "' + content + '"');
			return;
		}

		const params = content.substring(0, splitIndex).trim();
		const colorPart = content.substring(splitIndex + 1).trim();

		if(!colorPart) {
			console.warn('jmGradient: 未找到颜色停止点');
			return;
		}

		if(this.type === 'linear') {
			this._parseLinearParams(params);
		}
		else {
			this._parseRadialParams(params);
		}

		const colorCount = this._parseColorStops(colorPart);
		if(colorCount === 0) {
			console.warn('jmGradient: 未找到有效的颜色停止点: "' + colorPart + '"');
		}
		else if(colorCount < 2) {
			console.warn('jmGradient: 颜色停止点至少需要2个，当前只有 ' + colorCount + ' 个');
		}
	}

	/**
	 * 找到参数和颜色的分割位置（第一个不在括号内的逗号）
	 * @param {string} content 内容字符串
	 * @returns {number} 分割位置索引
	 */
	_findSplitIndex(content) {
		let depth = 0;

		for(let i = 0; i < content.length; i++) {
			const char = content[i];
			if(char === '(') {
				depth++;
			}
			else if(char === ')') {
				depth--;
			}
			else if(char === ',' && depth === 0) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * 验证渐变配置是否有效
	 * @returns {boolean} 是否有效
	 */
	isValid() {
		if(!this.type) return false;
		if(this.type === 'linear') {
			return typeof this.x1 !== 'undefined' ||
				   typeof this.x2 !== 'undefined' ||
				   typeof this._angle !== 'undefined';
		}
		if(this.type === 'radial') {
			return this.stops && this.stops.length >= 2;
		}
		return false;
	}

	/**
	 * 解析线性渐变参数
	 * @param {string} params 参数字符串
	 */
	_parseLinearParams(params) {
		const trimmed = jmUtils.trim(params);

		if(trimmed.startsWith('to ')) {
			const direction = trimmed.substring(3).toLowerCase().trim();
			const dir = this._directionToAngle(direction);
			this._angle = dir.angle;
			this.x1 = dir.x1;
			this.y1 = dir.y1;
			this.x2 = dir.x2;
			this.y2 = dir.y2;
		}
		else if(this._hasAngleUnit(trimmed)) {
			const angle = this._parseAngle(trimmed);
			this._angle = angle;
			const coords = this._angleToCoords(angle);
			this.x1 = coords.x1;
			this.y1 = coords.y1;
			this.x2 = coords.x2;
			this.y2 = coords.y2;
		}
		else if(trimmed.startsWith('at ')) {
			const radialMatch = trimmed.match(/at\s+(.+)/i);
			if(radialMatch) {
				this._parseRadialParams(trimmed);
			}
		}
		else {
			const parts = trimmed.split(/\s+/);
			if(parts.length >= 4) {
				this.x1 = parts[0];
				this.y1 = parts[1];
				this.x2 = parts[2];
				this.y2 = parts[3];
			}
			else if(parts.length === 2) {
				this.x1 = 0;
				this.y1 = 0;
				this.x2 = parts[0];
				this.y2 = parts[1];
			}
		}
	}

	/**
	 * 解析径向渐变参数
	 * @param {string} params 参数字符串
	 */
	_parseRadialParams(params) {
		const trimmed = jmUtils.trim(params);

		this.shape = 'ellipse';
		this.position = { x: '50%', y: '50%' };

		const atMatch = trimmed.match(/^(.+?)\s+at\s+(.+)$/i);
		if(atMatch) {
			const shapePart = jmUtils.trim(atMatch[1]);
			const posPart = jmUtils.trim(atMatch[2]);
			this._parseRadialShape(shapePart);
			this._parseRadialPosition(posPart);
		}
		else if(trimmed.startsWith('circle') || trimmed.startsWith('ellipse')) {
			this._parseRadialShape(trimmed);
			this.x1 = '50%';
			this.y1 = '50%';
			this.x2 = '50%';
			this.y2 = '50%';
		}
		else {
			const parts = trimmed.split(/\s+/);
			if(parts.length >= 3) {
				this.x1 = parts[0];
				this.y1 = parts[1];
				this.r1 = parts[2];
			}
			if(parts.length >= 6) {
				this.x2 = parts[3];
				this.y2 = parts[4];
				this.r2 = parts[5];
			}
		}

		if(this.x1 === undefined && this.y1 === undefined) {
			this.x1 = '50%';
			this.y1 = '50%';
		}
		if(this.x2 === undefined && this.y2 === undefined) {
			this.x2 = '50%';
			this.y2 = '50%';
		}
		if(this.r2 === undefined) {
			this.r2 = '50%';
		}
	}

	/**
	 * 解析径向渐变形状
	 * @param {string} shapePart 形状描述
	 */
	_parseRadialShape(shapePart) {
		if(shapePart.startsWith('circle')) {
			this.shape = 'circle';
			const sizeMatch = shapePart.match(/circle\s*\(\s*([^)]+)\s*\)/i);
			if(sizeMatch) {
				this.r2 = jmUtils.trim(sizeMatch[1]);
			}
		}
		else if(shapePart.startsWith('ellipse')) {
			this.shape = 'ellipse';
			const sizeMatch = shapePart.match(/ellipse\s*\(\s*([^)]+)\s*\)/i);
			if(sizeMatch) {
				const sizes = jmUtils.trim(sizeMatch[1]).split(/\s+/);
				if(sizes.length >= 2) {
					this.rx = sizes[0];
					this.ry = sizes[1];
				}
			}
		}
	}

	/**
	 * 解析径向渐变位置
	 * @param {string} posPart 位置描述
	 */
	_parseRadialPosition(posPart) {
		const parts = posPart.split(/\s+/);
		if(parts.length >= 2) {
			this.x1 = parts[0];
			this.y1 = parts[1];
			this.x2 = parts[0];
			this.y2 = parts[1];
		}
	}

	/**
	 * 解析颜色停止点
	 * @param {string} colorPart 颜色部分字符串
	 * @returns {number} 成功解析的颜色数量
	 */
	_parseColorStops(colorPart) {
		if(!colorPart) {
			return 0;
		}

		const stops = this._splitColorStops(colorPart);
		let lastOffset = -1;
		let colorCount = 0;

		for(let i = 0; i < stops.length; i++) {
			const stop = jmUtils.trim(stops[i]);
			if(!stop) continue;

			const parsed = this._parseSingleColorStop(stop);
			if(!parsed) {
				continue;
			}

			let { color, offset } = parsed;

			if(color === 'transparent') {
				color = 'rgba(0,0,0,0)';
			}

			if(!this._isValidColor(color)) {
				console.warn('jmGradient: 无效的颜色格式 "' + color + '"');
				continue;
			}

			const normalizedOffset = this._normalizeOffset(offset);
			let finalOffset = normalizedOffset;

			if(finalOffset === null) {
				if(i === 0) {
					finalOffset = 0;
				}
				else if(i === stops.length - 1) {
					finalOffset = 1;
				}
				else {
					const nextOffset = this._findNextOffset(stops, i);
					if(nextOffset !== null) {
						finalOffset = (lastOffset + nextOffset) / 2;
					}
					else {
						finalOffset = Math.min(1, lastOffset + (1 - lastOffset) / (stops.length - i));
					}
				}
			}

			if(finalOffset !== null) {
				if(finalOffset < 0 || finalOffset > 1) {
					console.warn('jmGradient: 颜色偏移量 ' + finalOffset + ' 超出有效范围 [0, 1]，将调整为有效范围');
					finalOffset = Math.max(0, Math.min(1, finalOffset));
				}
				lastOffset = finalOffset;
				this.addStop(finalOffset, color);
				colorCount++;
			}
		}

		return colorCount;
	}

	/**
	 * 分割颜色停止点字符串
	 * @param {string} colorPart 颜色部分字符串
	 * @returns {string[]} 颜色停止点数组
	 */
	_splitColorStops(colorPart) {
		const stops = [];
		let depth = 0;
		let current = '';

		for(let i = 0; i < colorPart.length; i++) {
			const char = colorPart[i];
			if(char === '(') {
				depth++;
				current += char;
			}
			else if(char === ')') {
				depth--;
				current += char;
			}
			else if(char === ',' && depth === 0) {
				stops.push(current.trim());
				current = '';
			}
			else {
				current += char;
			}
		}

		if(current.trim()) {
			stops.push(current.trim());
		}

		return stops;
	}

	/**
	 * 解析单个颜色停止点
	 * @param {string} stop 单个颜色停止点字符串
	 * @returns {object|null} {color, offset} 或 null
	 */
	_parseSingleColorStop(stop) {
		const hexMatch = stop.match(/^(#[a-fA-F0-9]{3,8})\s*(\d+(?:\.\d+)?%?)?$/i);
		if(hexMatch) {
			return { color: hexMatch[1], offset: hexMatch[2] || null };
		}

		const rgbaMatch = stop.match(/^(rgba?\s*\([^)]+\))\s*(\d+(?:\.\d+)?%?)?$/i);
		if(rgbaMatch) {
			return { color: rgbaMatch[1], offset: rgbaMatch[2] || null };
		}

		const hslaMatch = stop.match(/^(hsla?\s*\([^)]+\))\s*(\d+(?:\.\d+)?%?)?$/i);
		if(hslaMatch) {
			return { color: hslaMatch[1], offset: hslaMatch[2] || null };
		}

		const namedMatch = stop.match(/^([a-zA-Z]+)\s*(\d+(?:\.\d+)?%?)?$/i);
		if(namedMatch && this._isValidColor(namedMatch[1])) {
			return { color: namedMatch[1], offset: namedMatch[2] || null };
		}

		return null;
	}

	/**
	 * 查找下一个有偏移量的颜色停止点
	 * @param {string[]} stops 颜色停止点数组
	 * @param {number} currentIndex 当前索引
	 * @returns {number|null} 下一个偏移量或null
	 */
	_findNextOffset(stops, currentIndex) {
		for(let i = currentIndex + 1; i < stops.length; i++) {
			const parsed = this._parseSingleColorStop(jmUtils.trim(stops[i]));
			if(parsed && parsed.offset) {
				return this._normalizeOffset(parsed.offset);
			}
		}
		return null;
	}

	/**
	 * 验证颜色格式是否有效
	 * @param {string} color 颜色字符串
	 * @returns {boolean} 是否有效
	 */
	_isValidColor(color) {
		if(!color) return false;

		const hexPattern = /^#([a-fA-F0-9]{3,8})$/;
		if(hexPattern.test(color)) return true;

		// 支持 rgba(r,g,b,a) 和 rgba(r, g, b, a) 等各种空格格式
		const rgbPattern = /^rgba?\s*\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+\s*)?\)$/i;
		if(rgbPattern.test(color)) return true;

		const hslPattern = /^hsla?\s*\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*(,\s*[\d.]+\s*)?\)$/i;
		if(hslPattern.test(color)) return true;

		// 使用 jmUtils 中的完整 CSS 颜色关键字表
		if(colorKeywords && colorKeywords[color.toLowerCase()]) return true;

		// 宽松处理：符合 CSS 关键字命名规则的字符串也视为有效颜色
		// (纯字母，可能在运行时被浏览器或其他环境解析)
		if(/^[a-zA-Z]+$/.test(color)) return true;

		return false;
	}

	/**
	 * 标准化偏移值
	 * @param {string} offset 偏移字符串
	 * @returns {number|null} 0-1之间的数值或null
	 */
	_normalizeOffset(offset) {
		if(!offset) return null;
		offset = jmUtils.trim(offset);
		if(offset.endsWith('%')) {
			return parseFloat(offset) / 100;
		}
		const num = parseFloat(offset);
		if(isNaN(num)) return null;
		if(num > 1) {
			return num / 100;
		}
		return num;
	}

	/**
	 * 检查字符串是否包含角度单位
	 * @param {string} str 待检查字符串
	 * @returns {boolean}
	 */
	_hasAngleUnit(str) {
		return /^-?\d+(\.\d+)?\s*(deg|rad|grad|turn)$/i.test(str);
	}

	/**
	 * 解析角度值
	 * @param {string} angleStr 角度字符串
	 * @returns {number} 弧度值
	 */
	_parseAngle(angleStr) {
		angleStr = jmUtils.trim(angleStr);
		const match = angleStr.match(/^(-?\d+(\.\d+)?)\s*(deg|rad|grad|turn)?$/i);
		if(!match) return 0;

		let value = parseFloat(match[1]);
		const unit = (match[3] || 'deg').toLowerCase();

		switch(unit) {
			case 'deg':
				return value * Math.PI / 180;
			case 'rad':
				return value;
			case 'grad':
				return value * Math.PI / 200;
			case 'turn':
				return value * 2 * Math.PI;
			default:
				return value * Math.PI / 180;
		}
	}

	/**
	 * 将角度转换为起点和终点坐标
	 * @param {number} angle 弧度值
	 * @returns {object} 坐标对象
	 */
	_angleToCoords(angle) {
		const x = Math.cos(angle);
		const y = -Math.sin(angle);

		return {
			x1: Math.round((0.5 - x * 0.5) * 1000) / 1000,
			y1: Math.round((0.5 + y * 0.5) * 1000) / 1000,
			x2: Math.round((0.5 + x * 0.5) * 1000) / 1000,
			y2: Math.round((0.5 - y * 0.5) * 1000) / 1000
		};
	}

	/**
	 * 将方向关键词转换为角度和坐标
	 * @param {string} direction 方向描述
	 * @returns {object} 包含angle和坐标的对象
	 */
	_directionToAngle(direction) {
		const directions = {
			'to top': { angle: 0, x1: '50%', y1: '100%', x2: '50%', y2: '0%' },
			'to bottom': { angle: Math.PI, x1: '50%', y1: '0%', x2: '50%', y2: '100%' },
			'to left': { angle: -Math.PI / 2, x1: '100%', y1: '50%', x2: '0%', y2: '50%' },
			'to right': { angle: Math.PI / 2, x1: '0%', y1: '50%', x2: '100%', y2: '50%' },
			'to top left': { angle: -Math.PI * 3 / 4, x1: '100%', y1: '100%', x2: '0%', y2: '0%' },
			'to top right': { angle: -Math.PI / 4, x1: '0%', y1: '100%', x2: '100%', y2: '0%' },
			'to bottom left': { angle: Math.PI * 3 / 4, x1: '100%', y1: '0%', x2: '0%', y2: '100%' },
			'to bottom right': { angle: Math.PI / 4, x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
			'top': { angle: 0, x1: '50%', y1: '100%', x2: '50%', y2: '0%' },
			'bottom': { angle: Math.PI, x1: '50%', y1: '0%', x2: '50%', y2: '100%' },
			'left': { angle: -Math.PI / 2, x1: '100%', y1: '50%', x2: '0%', y2: '50%' },
			'right': { angle: Math.PI / 2, x1: '0%', y1: '50%', x2: '100%', y2: '50%' }
		};

		const dir = directions[direction];
		if(dir) {
			return dir;
		}

		const keywordMatch = direction.match(/to\s+(top|bottom|left|right)/i);
		if(keywordMatch) {
			const mainDir = keywordMatch[1].toLowerCase();
			const secDir = direction.replace(keywordMatch[0], '').trim();
			if(secDir) {
				const combined = `to ${mainDir} ${secDir}`;
				if(directions[combined]) {
					return directions[combined];
				}
			}
		}

		return { angle: 0, x1: '50%', y1: '100%', x2: '50%', y2: '0%' };
	}

	/**
	 * 转换为渐变的字符串表达
	 *
	 * @method toString
	 * @for jmGradient
	 * @return {string} linear-gradient(x1 y1 x2 y2, color1 step, color2 step, ...);	//radial-gradient(x1 y1 r1 x2 y2 r2, color1 step,color2 step, ...);
	 */
	toString() {
		let str = this.type + '-gradient(';
		if(this.type == 'linear') {
			str += this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2;
		}
		else {
			str += this.x1 + ' ' + this.y1 + ' ' + this.r1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.r2;
		}
		//颜色渐变
		this.stops.each(function(i,s) {	
			str += ',' + s.color + ' ' + s.offset;
		});
		return str + ')';
	}
}

/**
 * @fileoverview jmShadow 阴影类
 * 
 * jmShadow 提供了图形阴影效果的创建和管理功能。
 * 支持设置阴影的偏移、模糊程度和颜色。
 * 
 * 主要功能：
 * - 阴影偏移设置（x, y）
 * - 模糊程度设置（blur）
 * - 阴影颜色设置（color）
 * - 字符串解析和序列化
 * 
 * @module jmShadow
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 阴影类
 * 
 * 用于创建图形的阴影效果。阴影可以应用于任何图形控件。
 * 
 * @class jmShadow
 * 
 * @param {number|string} x 横坐标偏移量，或阴影字符串格式 'x,y,blur,color'
 * @param {number} [y] 纵坐标偏移量
 * @param {number} [blur] 模糊值
 * @param {string} [color] 阴影颜色
 * 
 * @example
 * // 创建阴影
 * const shadow = new jmShadow(5, 5, 10, 'rgba(0,0,0,0.5)');
 * 
 * // 从字符串创建
 * const shadow = new jmShadow('5, 5, 10, rgba(0,0,0,0.5)');
 * 
 * // 应用到图形
 * rect.style.shadow = shadow;
 */
class jmShadow {
	constructor(x, y, blur, color) {
		if(typeof x == 'string' && !y && !blur && !color) {
			this.fromString(x);
		}
		else {
			this.x = x;
			this.y = y;
			this.blur = blur;
			this.color = color;
		}
	}
	/**
	 * 根据字符串格式转为阴影
	 * @method fromString
	 * @param {string} s 阴影字符串 x,y,blur,color
	 */
	fromString(s) {
		if(!s) return;
		let ms = s.match(/\s*([^,]+)\s*,\s*([^,]+)\s*(,[^,]+)?\s*(,[\s\S]+)?\s*/i);
		if(ms) {
			this.x = ms[1]||0;
			this.y = ms[2]||0;
			if(ms[3]) {
				ms[3] = jmUtils.trim(ms[3],', ');
				//如果第三位是颜色格式，则表示为颜色
				if(ms[3].indexOf('#')===0 || /^rgb/i.test(ms[3])) {
					this.color = ms[3];
				}
				else {
					this.blur = jmUtils.trim(ms[3],', ');
				}
			}
			if(ms[4]) {
				this.color = jmUtils.trim(ms[4],', ');
			}
		}
		return this;
	}

	/**
	 * 转为字符串格式 x,y,blur,color
	 * @method toString
	 * @returns {string} 阴影字符串
	 */
	toString() {
		let s = this.x + ',' + this.y;
		if(this.blur) s += ',' + this.blur;
		if(this.color) s += ',' + this.color;
		return s;
	}
}

/**
 * @fileoverview jmFilter 滤镜类
 * 
 * jmFilter 提供了 CSS 滤镜效果的管理和应用功能。
 * 支持多种滤镜效果，可以组合使用。
 * 
 * 支持的滤镜：
 * - blur: 模糊效果
 * - grayscale: 灰度效果
 * - sepia: 复古效果
 * - brightness: 亮度调节
 * - contrast: 对比度调节
 * - saturate: 饱和度调节
 * - hue-rotate: 色相旋转
 * - invert: 反色效果
 * - opacity: 透明度调节
 * 
 * @module jmFilter
 * @author jmGraph Team
 * @license MIT
 */

/**
 * CSS 滤镜效果类
 * 
 * 支持的滤镜: blur, grayscale, sepia, brightness, contrast, saturate, hue-rotate, invert, opacity
 *
 * @class jmFilter
 * @param {string|object} opt 滤镜参数
 *   字符串格式: "blur(2px) grayscale(50%) brightness(1.2)"
 *   对象格式: { blur: 2, grayscale: 0.5, brightness: 1.2 }
 * 
 * @example
 * // 从字符串创建
 * const filter = new jmFilter('blur(2px) grayscale(50%)');
 * 
 * // 从对象创建
 * const filter = new jmFilter({
 *     blur: 2,
 *     grayscale: 0.5,
 *     brightness: 1.2
 * });
 * 
 * // 应用到图形
 * shape.style.filter = filter;
 */
class jmFilter {
	constructor(opt) {
		this.filters = [];

		if(typeof opt === 'string') {
			this.fromString(opt);
		}
		else if(opt && typeof opt === 'object') {
			for(let k in opt) {
				if(k === 'constructor' || k === 'filters') continue;
				this.addFilter(k, opt[k]);
			}
		}
	}

	/**
	 * 添加单个滤镜
	 * @param {string} name 滤镜名称 (blur, grayscale, sepia, brightness, contrast, saturate, hue-rotate, invert, opacity)
	 * @param {number|string} value 滤镜值
	 */
	addFilter(name, value) {
		name = name.toLowerCase().trim();
		if(typeof value === 'string') {
			value = parseFloat(value);
		}
		if(isNaN(value)) return;

		// 规范化滤镜名称
		const normalized = {
			'blur': 'blur',
			'grayscale': 'grayscale',
			'greyscale': 'grayscale',
			'sepia': 'sepia',
			'brightness': 'brightness',
			'contrast': 'contrast',
			'saturate': 'saturate',
			'hue-rotate': 'hueRotate',
			'hueRotate': 'hueRotate',
			'invert': 'invert',
			'opacity': 'opacity'
		}[name];

		if(!normalized) return;

		// 检查是否已有同名滤镜，有则更新
		const existing = this.filters.find(f => f.name === normalized);
		if(existing) {
			existing.value = value;
		}
		else {
			this.filters.push({ name: normalized, value: value });
		}
	}

	/**
	 * 从字符串格式解析滤镜
	 * 格式: "blur(2px) grayscale(50%) brightness(1.2)"
	 * @param {string} s 滤镜字符串
	 */
	fromString(s) {
		if(!s || typeof s !== 'string') return;
		// 匹配 filterName(value) 模式
		const regex = /([a-zA-Z-]+)\s*\(\s*([^)]+)\s*\)/g;
		let match;
		while((match = regex.exec(s)) !== null) {
			const name = match[1];
			const valueStr = match[2].replace(/[a-z%]+$/i, '').trim();
			const value = parseFloat(valueStr);
			if(!isNaN(value)) {
				this.addFilter(name, value);
			}
		}
	}

	/**
	 * 转换为CSS filter字符串格式
	 * @returns {string}
	 */
	toString() {
		return this.filters.map(f => {
			switch(f.name) {
				case 'blur':
					return `blur(${f.value}px)`;
				case 'hueRotate':
					return `hue-rotate(${f.value}deg)`;
				default:
					return `${f.name}(${f.value})`;
			}
		}).join(' ');
	}

	/**
	 * 转换为Canvas context.filter可用的字符串
	 * @returns {string}
	 */
	toCanvasFilter() {
		if(this.filters.length === 0) return 'none';
		return this.toString();
	}

	/**
	 * 检查是否有指定名称的滤镜
	 * @param {string} name 滤镜名称
	 * @returns {boolean}
	 */
	has(name) {
		return this.filters.some(f => f.name === name);
	}

	/**
	 * 获取指定滤镜的值
	 * @param {string} name 滤镜名称
	 * @returns {number|undefined}
	 */
	get(name) {
		const f = this.filters.find(f => f.name === name);
		return f ? f.value : undefined;
	}

	/**
	 * 移除指定滤镜
	 * @param {string} name 滤镜名称
	 */
	remove(name) {
		const index = this.filters.findIndex(f => f.name === name);
		if(index > -1) {
			this.filters.splice(index, 1);
		}
	}

	/**
	 * 清空所有滤镜
	 */
	clear() {
		this.filters = [];
	}
}

/**
 * 控件ID计数器
 * 用于为每个新创建的对象生成唯一标识符
 * @type {number}
 * @private
 */
let control_id_counter = 0;

/**
 * jmGraph 基础对象类
 * 
 * 所有图形控件、属性对象、工具类的基类。
 * 提供了对象标识、类型检查和动画调度等核心功能。
 * 
 * @class jmObject
 * @example
 * // 创建一个基础对象
 * const obj = new jmObject();
 * console.log(obj.id); // 输出唯一ID
 * 
 * // 类型检查
 * obj.is('jmObject'); // true
 * obj.is(jmObject);  // true
 */
class jmObject {
	/**
	 * 构造函数
	 * 
	 * 创建一个新的基础对象实例，自动分配唯一ID。
	 * 如果传入的是 jmGraph 实例，则建立关联关系。
	 * 
	 * @constructor
	 * @param {jmGraph} [g] - 可选的 jmGraph 实例，用于建立对象与画布的关联
	 * 
	 * @example
	 * // 创建独立对象
	 * const obj = new jmObject();
	 * 
	 * // 创建关联画布的对象
	 * const graph = new jmGraph(canvas);
	 * const objWithGraph = new jmObject(graph);
	 */
	constructor(g) {
		// 如果传入的是 jmGraph 实例，则建立引用关系
		if(g && g.type == 'jmGraph') {
			this.graph = g;
		}
		// 生成唯一ID
		this.id = ++control_id_counter;
	}
	
	/**
	 * 检查对象是否为指定类型
	 * 
	 * 支持两种类型检查方式：
	 * 1. 字符串方式：检查对象的 type 属性是否匹配
	 * 2. 类构造函数方式：使用 instanceof 检查原型链
	 * 
	 * @method is
	 * @param {string|Function} type - 要检查的类型名称（字符串）或类构造函数
	 * @returns {boolean} 如果对象是指定类型则返回 true，否则返回 false
	 * 
	 * @example
	 * // 使用字符串检查
	 * control.is('jmRect'); // 检查是否为矩形
	 * 
	 * // 使用类构造函数检查
	 * control.is(jmControl); // 检查是否为 jmControl 实例
	 * control.is(jmPath);   // 检查是否继承自 jmPath
	 */
	is(type) {
		// 字符串类型：检查 type 属性
		if(typeof type == 'string') {
			return this.type == type;
		}
		// 类构造函数：使用 instanceof 检查原型链
		return this instanceof type;
	}

	/**
	 * 注册并执行动画帧回调
	 * 
	 * 提供动画帧调度功能，支持：
	 * - 按指定时间间隔执行回调
	 * - 多个动画句柄并行执行
	 * - 自动清理返回 false 的动画
	 * - 错误自动移除异常动画
	 * 
	 * 此方法通常由 jmGraph 实例调用，子控件会委托给所属的 graph 处理。
	 * 
	 * @method animate
	 * @param {Function} handle - 动画回调函数，返回 false 时自动移除
	 * @param {number} [millisec=20] - 执行间隔（毫秒），默认 20ms
	 * @param {...*} [params] - 传递给回调函数的额外参数
	 * 
	 * @example
	 * // 创建一个简单的动画
	 * let x = 0;
	 * graph.animate(function() {
	 *     x += 1;
	 *     rect.position.x = x;
	 *     graph.redraw();
	 *     
	 *     // 动画结束条件
	 *     if(x > 100) return false;
	 * }, 16); // 约60fps
	 * 
	 * // 带参数的动画
	 * graph.animate(function(speed) {
	 *     x += speed;
	 *     // ...
	 * }, 16, 5); // speed = 5
	 */
	animate(...args) {
		// 只有 jmGraph 实例才真正处理动画调度
		if(this.is('jmGraph')) {
			// 注册新的动画句柄
			if(args.length > 1) {
				if(!this.animateHandles) this.animateHandles = new jmList();
				
				// 收集额外参数
				const params = [];
				if(args.length > 2) {
					for(let i=2;i<args.length;i++) {
						params.push(args[i]);
					}
				}
				// 添加动画句柄到列表
				this.animateHandles.add({
					millisec: args[1] || 20,    // 执行间隔
					handle: args[0],             // 回调函数
					params: params               // 额外参数
				});
			}
			
			// 如果有动画句柄，启动调度循环
			if(this.animateHandles) {
				if(this.animateHandles.count() > 0) {
					const self = this;
					// 使用 setTimeout 进行调度（避免 requestAnimationFrame 的固定帧率限制）
					this.dispatcher = setTimeout(function(_this) {
						_this = _this || self;
						const overduehandles = [];  // 需要移除的句柄
						const curTimes = Date.now();
						
						// 遍历执行所有动画句柄
						_this.animateHandles.each(function(i,ani) {
							try {
								// 检查是否到达执行时间
								if(ani && ani.handle && (!ani.times || curTimes - ani.times >= ani.millisec)) {
									// 执行回调
									const r = ani.handle.apply(_this, ani.params);
									// 返回 false 表示动画结束
									if(r === false) {
										overduehandles.push(ani);
									}
									// 更新最后执行时间
									ani.times = curTimes;
								}
							}
							catch(e) {
								// 出错的句柄自动移除
								if(ani) overduehandles.push(ani);
							}
						});
						
						// 移除已完成的动画句柄
						for(const i in overduehandles) {
							_this.animateHandles.remove(overduehandles[i]);
						}
						
						// 继续下一轮调度
						_this.animate();
					},10,this);
				}
			}
		}
		else {
			// 非 jmGraph 对象委托给所属的 graph 处理
			const graph = this.graph;
			if(graph) {
				graph.animate(...args);
			}
		}
	}
}

/**
 * 属性存储的 Symbol 键
 * 使用 Symbol 确保属性存储的私有性和唯一性
 * @type {Symbol}
 * @private
 */
const PROPERTY_KEY = Symbol("properties");

/**
 * jmGraph 属性管理基类
 * 
 * jmProperty 是 jmControl 的父类，为所有图形控件提供属性管理功能。
 * 采用 Symbol + WeakMap 模式实现真正的私有属性存储，避免属性名冲突。
 * 
 * 核心特性：
 * 1. **私有属性存储**：使用 Symbol 键确保属性不被外部直接访问
 * 2. **属性变更通知**：设置属性时自动触发 'propertyChange' 事件
 * 3. **渲染模式继承**：子控件自动继承所属 graph 的渲染模式
 * 4. **脏标记传播**：子控件 needUpdate 会自动传播到 graph
 * 
 * @class jmProperty
 * @extends jmObject
 * 
 * @example
 * // 创建属性对象
 * const prop = new jmProperty({ mode: 'webgl' });
 * 
 * // 设置和获取属性
 * prop.property('customValue', 100);
 * console.log(prop.property('customValue')); // 100
 * 
 * // 监听属性变更
 * prop.on('propertyChange', (name, args) => {
 *     console.log(`${name} changed from ${args.oldValue} to ${args.newValue}`);
 * });
 */
class jmProperty extends jmObject {
	/**
	 * 构造函数
	 * 
	 * 初始化属性存储对象，并设置初始渲染模式。
	 * 
	 * @constructor
	 * @param {Object} [params] - 初始化参数
	 * @param {'2d'|'webgl'} [params.mode] - 渲染模式，默认 '2d'
	 * 
	 * @example
	 * // 创建使用 WebGL 渲染的属性对象
	 * const prop = new jmProperty({ mode: 'webgl' });
	 */
	constructor(params) {
		super();
		// 初始化私有属性存储对象
		this[PROPERTY_KEY] = {};
		// 设置渲染模式
		if(params && params.mode) this.mode = params.mode;
	}

	/**
	 * 获取或设置属性值
	 * 
	 * 这是属性系统的核心方法，所有属性的存取都通过此方法。
	 * 设置属性时会自动触发 'propertyChange' 事件，便于实现响应式更新。
	 * 
	 * @method property
	 * @param {string} name - 属性名称
	 * @param {*} [value] - 属性值（设置时提供）
	 * @returns {*} 获取时返回属性值，设置时返回设置的值
	 * 
	 * @example
	 * // 获取属性
	 * const value = obj.property('myProp');
	 * 
	 * // 设置属性
	 * obj.property('myProp', 'newValue');
	 * 
	 * // 链式调用
	 * obj.property('a', 1).property('b', 2);
	 */
	property(...pars) {
		if(pars) {
			const pros = this[PROPERTY_KEY];
			const name = pars[0];
			
			// 设置属性
			if(pars.length > 1) {
				const value = pars[1];
				const args = {oldValue: pros[name], newValue: value};
				pros[name] = pars[1];
				// 触发属性变更事件（如果对象支持事件）
				if(this.emit) this.emit('propertyChange', name, args);
				return pars[1];
			}
			// 获取属性
			else if(name) {
				return pros[name];
			}
		}
	}

	/**
	 * 是否需要重绘标记
	 * 
	 * 当属性变化导致需要重新渲染时设置此标记。
	 * 设置为 true 时，会自动将所属 graph 的 needUpdate 设为 true，
	 * 从而触发画布重绘。
	 * 
	 * @type {boolean}
	 * 
	 * @example
	 * // 标记需要重绘
	 * control.needUpdate = true;
	 * 
	 * // 检查是否需要重绘
	 * if(control.needUpdate) {
	 *     control.redraw();
	 * }
	 */
	get needUpdate() {
		return this.property('needUpdate');
	}
	set needUpdate(v) {
		this.property('needUpdate', v);
		// 传播脏标记到 graph（避免 jmGraph 自身循环）
		if(v && !this.is('jmGraph') && this.graph) {
			this.graph.needUpdate = true;
		}
	}

	/**
	 * 所属的画布实例
	 * 
	 * 获取或设置当前对象所属的 jmGraph 实例。
	 * 如果未显式设置，会自动向上查找父级链中的 jmGraph。
	 * 
	 * @type {jmGraph}
	 * 
	 * @example
	 * // 获取所属画布
	 * const graph = control.graph;
	 * 
	 * // 设置所属画布（通常由框架内部调用）
	 * control.graph = myGraph;
	 */
	get graph() {
		let g = this.property('graph');
		// 如果未设置，尝试从父级链查找
		g = g || (this.property('graph', this.findParent('jmGraph')));
		return g;
	}
	set graph(v) {
		return this.property('graph', v);
	}

	/**
	 * 渲染模式
	 * 
	 * 获取当前渲染模式，支持 '2d' 和 'webgl' 两种模式。
	 * 渲染模式的查找优先级：
	 * 1. 当前对象设置的 mode
	 * 2. 如果是 jmGraph，默认 '2d'
	 * 3. 从所属 graph 继承 mode
	 * 
	 * @type {'2d'|'webgl'}
	 * @readonly
	 * 
	 * @example
	 * // 检查渲染模式
	 * if(control.mode === 'webgl') {
	 *     // 使用 WebGL 特性
	 * } else {
	 *     // 使用 Canvas 2D API
	 * }
	 */
	get mode() {
		let m = this.property('mode');
		if(m) return m;
		// 如果当前对象是jmGraph且没有设置mode，返回默认值
		if(this.is('jmGraph')) return this.property('mode') || '2d';
		// 否则从所属的graph获取mode
		return this.graph?.mode || '2d';
	}
	set mode(v) {
		return this.property('mode', v);
	}

	/**
	 * 请求动画帧
	 * 
	 * 封装 requestAnimationFrame，支持在不同环境下工作。
	 * 如果当前对象关联了 canvas，会使用 canvas 的 requestAnimationFrame。
	 * 
	 * @method requestAnimationFrame
	 * @param {Function} handler - 动画帧回调函数
	 * @returns {number} 动画帧请求ID，用于取消
	 * 
	 * @example
	 * // 请求下一帧动画
	 * const frameId = control.requestAnimationFrame(() => {
	 *     // 更新动画状态
	 *     control.redraw();
	 * });
	 * 
	 * // 取消动画帧
	 * control.cancelAnimationFrame(frameId);
	 */
	requestAnimationFrame(handler) {
		return jmUtils.requestAnimationFrame(handler, this.graph? this.graph.canvas: null);
	}

	/**
	 * 取消动画帧请求
	 * 
	 * 取消之前通过 requestAnimationFrame 注册的回调。
	 * 
	 * @method cancelAnimationFrame
	 * @param {number} handler - 动画帧请求ID
	 * 
	 * @example
	 * // 取消动画帧
	 * control.cancelAnimationFrame(frameId);
	 */
	cancelAnimationFrame(handler) {
		return jmUtils.cancelAnimationFrame(handler, this.graph? this.graph.canvas: null);
	}
}

function earcut(data, holeIndices, dim) {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

    var minX, minY, maxX, maxY, x, y, invSize;

    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 32767 / invSize : 0;
    }

    earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
function linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
    }

    if (last && equals(last, last.next)) {
        removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
function filterPoints(start, end) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
            removeNode(p);
            p = end = p.prev;
            if (p === p.next) break;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim | 0);
            triangles.push(ear.i / dim | 0);
            triangles.push(next.i / dim | 0);

            removeNode(ear);

            // skipping the next vertex leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
function isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

    // triangle bbox; min & max are calculated like this for speed
    var x0 = ax < bx ? (ax < cx ? ax : cx) : (bx < cx ? bx : cx),
        y0 = ay < by ? (ay < cy ? ay : cy) : (by < cy ? by : cy),
        x1 = ax > bx ? (ax > cx ? ax : cx) : (bx > cx ? bx : cx),
        y1 = ay > by ? (ay > cy ? ay : cy) : (by > cy ? by : cy);

    var p = c.next;
    while (p !== a) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 &&
            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) &&
            area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

function isEarHashed(ear, minX, minY, invSize) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

    var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

    // triangle bbox; min & max are calculated like this for speed
    var x0 = ax < bx ? (ax < cx ? ax : cx) : (bx < cx ? bx : cx),
        y0 = ay < by ? (ay < cy ? ay : cy) : (by < cy ? by : cy),
        x1 = ax > bx ? (ax > cx ? ax : cx) : (bx > cx ? bx : cx),
        y1 = ay > by ? (ay > cy ? ay : cy) : (by > cy ? by : cy);

    // z-order range for the current triangle bbox;
    var minZ = zOrder(x0, y0, minX, minY, invSize),
        maxZ = zOrder(x1, y1, minX, minY, invSize);

    var p = ear.prevZ,
        n = ear.nextZ;

    // look for points inside the triangle in both directions
    while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;

        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
            pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    // look for remaining points in decreasing z-order
    while (p && p.z >= minZ) {
        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    // look for remaining points in increasing z-order
    while (n && n.z <= maxZ) {
        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
            pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
function cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

            triangles.push(a.i / dim | 0);
            triangles.push(p.i / dim | 0);
            triangles.push(b.i / dim | 0);

            // remove two nodes involved
            removeNode(p);
            removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return filterPoints(p);
}

// try splitting polygon into two and triangulate them independently
function splitEarcut(start, triangles, dim, minX, minY, invSize) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = splitPolygon(a, b);

                // filter colinear points around the cuts
                a = filterPoints(a, a.next);
                c = filterPoints(c, c.next);

                // run earcut on each half
                earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
                earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
function eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(getLeftmost(list));
    }

    queue.sort(compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        outerNode = eliminateHole(queue[i], outerNode);
    }

    return outerNode;
}

function compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
function eliminateHole(hole, outerNode) {
    var bridge = findHoleBridge(hole, outerNode);
    if (!bridge) {
        return outerNode;
    }

    var bridgeReverse = splitPolygon(bridge, hole);

    // filter collinear points around the cuts
    filterPoints(bridgeReverse, bridgeReverse.next);
    return filterPoints(bridge, bridge.next);
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
function findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                m = p.x < p.next.x ? p : p.next;
                if (x === hx) return m; // hole touches outer segment; pick leftmost endpoint
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m;

    do {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if (locallyInside(p, hole) &&
                (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    } while (p !== stop);

    return m;
}

// whether sector in vertex m contains sector in vertex p in the same coordinates
function sectorContainsSector(m, p) {
    return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
}

// interlink polygon nodes in z-order
function indexCurve(start, minX, minY, invSize) {
    var p = start;
    do {
        if (p.z === 0) p.z = zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
function sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }
            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and inverse of the longer side of data bbox
function zOrder(x, y, minX, minY, invSize) {
    // coords are transformed into non-negative 15-bit integer range
    x = (x - minX) * invSize | 0;
    y = (y - minY) * invSize | 0;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
function getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) >= (ax - px) * (cy - py) &&
           (ax - px) * (by - py) >= (bx - px) * (ay - py) &&
           (bx - px) * (cy - py) >= (cx - px) * (by - py);
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
function isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
           (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
            (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
            equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
}

// signed area of a triangle
function area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
function equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
function intersects(p1, q1, p2, q2) {
    var o1 = sign(area(p1, q1, p2));
    var o2 = sign(area(p1, q1, q2));
    var o3 = sign(area(p2, q2, p1));
    var o4 = sign(area(p2, q2, q1));

    if (o1 !== o2 && o3 !== o4) return true; // general case

    if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
    if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
    if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
    if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

    return false;
}

// for collinear points p, q, r, check if point q lies on segment pr
function onSegment(p, q, r) {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

function sign(num) {
    return num > 0 ? 1 : num < 0 ? -1 : 0;
}

// check if a polygon diagonal intersects any polygon segments
function intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
function locallyInside(a, b) {
    return area(a.prev, a, a.next) < 0 ?
        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
function middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
function splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
function insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

function removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
    // vertex index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertex nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = 0;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
earcut.deviation = function (data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};

function signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
earcut.flatten = function (data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};

/**
 * @fileoverview WebGL 渐变对象
 * 
 * 本模块提供了 WebGL 渐变功能，支持 GLSL 着色器直接计算渐变色，
 * 无需 textureCanvas，性能更优。
 * 
 * 支持的渐变类型：
 * - 线性渐变 (linear)
 * - 径向渐变 (radial)
 * 
 * @module lib/webgl/gradient
 * @author jmGraph Team
 */

/** @constant {number} 最大颜色断点数量 */
const MAX_STOPS = 16;

/**
 * WebGL 渐变类
 * 支持 GLSL 着色器直接计算渐变色
 * 
 * @class WebglGradient
 * @example
 * const gradient = new WebglGradient('linear', { x1: 0, y1: 0, x2: 100, y2: 0 });
 * gradient.addColorStop(0, '#ff0000');
 * gradient.addColorStop(1, '#0000ff');
 */
class WebglGradient {
    /**
     * 构造函数
     * @param {string} [type='linear'] 渐变类型：'linear' 或 'radial'
     * @param {Object} params 渐变参数
     * @param {number} [params.x1=0] 起点/内圆中心X坐标
     * @param {number} [params.y1=0] 起点/内圆中心Y坐标
     * @param {number} [params.r1=0] 内圆半径（径向渐变）
     * @param {number} [params.x2=0] 终点/外圆中心X坐标
     * @param {number} [params.y2=0] 终点/外圆中心Y坐标
     * @param {number} [params.r2=0] 外圆半径（径向渐变）
     * @param {Object} [params.bounds] 渐变边界
     * @param {Object} [params.control] 控制器对象
     */
    constructor(type = 'linear', params = {}) {
        /** @type {string} 渐变类型 */
        this.type = type || 'linear';

        this.x1 = params.x1 || 0;
        this.y1 = params.y1 || 0;
        this.r1 = params.r1 || 0;
        this.x2 = params.x2 || 0;
        this.y2 = params.y2 || 0;
        this.r2 = params.r2 || 0;

        /** @type {Object} 渐变边界 */
        this.bounds = params.bounds || { left: 0, top: 0, width: 0, height: 0 };

        this.control = params.control;

        /** @type {Array<{offset: number, color: string}>} 颜色断点数组 */
        this.stops = [];
        this._sortedStops = null;
        this._paramsHash = null;
    }

    /**
     * 添加颜色断点
     * @param {number} offset 断点位置 (0-1)
     * @param {string} color 颜色值
     */
    addColorStop(offset, color) {
        this.stops.push({
            offset: Math.max(0, Math.min(1, offset)),
            color
        });
        this._sortedStops = null;
        this._paramsHash = null;
    }

    /**
     * 获取排序后的断点数组（带解析后的颜色）
     * @private
     * @returns {Array<{offset: number, r: number, g: number, b: number, a: number}>}
     */
    _getSortedStops() {
        if (this._sortedStops) return this._sortedStops;

        const utils = this.control && this.control.graph && this.control.graph.utils;
        this._sortedStops = this.stops
            .map(s => {
                let c = s.color;
                if (utils && typeof c === 'string') {
                    c = utils.hexToRGBA(c);
                }
                if (typeof c === 'object' && c !== null) {
                    const needNormalize = (c.r > 1 || c.g > 1 || c.b > 1) ? 255 : 1;
                    return {
                        offset: s.offset,
                        r: (c.r !== undefined ? c.r : 0) / needNormalize,
                        g: (c.g !== undefined ? c.g : 0) / needNormalize,
                        b: (c.b !== undefined ? c.b : 0) / needNormalize,
                        a: c.a !== undefined ? c.a : 1
                    };
                }
                return { offset: s.offset, r: 0, g: 0, b: 0, a: 1 };
            })
            .sort((a, b) => a.offset - b.offset);

        return this._sortedStops;
    }

    /**
     * 将渐变参数转换为 uniform 格式，传递给着色器
     * @returns {Object} uniform 参数对象
     */
    toUniformParams() {
        const stops = this._getSortedStops();
        const count = Math.min(stops.length, MAX_STOPS);

        const flatStops = new Float32Array(count * 5);
        for (let i = 0; i < count; i++) {
            const s = stops[i];
            flatStops[i * 5 + 0] = s.offset;
            flatStops[i * 5 + 1] = s.r;
            flatStops[i * 5 + 2] = s.g;
            flatStops[i * 5 + 3] = s.b;
            flatStops[i * 5 + 4] = s.a;
        }

        return {
            gradientType: this.type === 'radial' ? 2 : 1,
            gradientStart: new Float32Array([
                this.x1, this.y1,
                this.type === 'radial' ? Math.max(0, this.r1) : 0,
                0
            ]),
            gradientEnd: new Float32Array([
                this.x2, this.y2,
                this.type === 'radial' ? Math.max(0, this.r2) : 0,
                0
            ]),
            stopCount: count,
            stops: flatStops
        };
    }

    /** 使缓存失效 */
    invalidateCache() {
        this._sortedStops = null;
        this._paramsHash = null;
    }

    /**
     * 转换为渐变的字符串表达
     * @returns {string} 渐变字符串
     */
    toString() {
        let str = this.type + '-gradient(';
        if (this.type == 'linear') {
            str += this.x1 + ' ' + this.y1 + ' ' + this.x2 + ' ' + this.y2;
        }
        else {
            str += this.x1 + ' ' + this.y1 + ' ' + this.r1 + ' ' + this.x2 + ' ' + this.y2 + ' ' + this.r2;
        }
        this.stops.forEach(function(s) {
            str += ',' + s.color + ' ' + s.offset;
        });
        return str + ')';
    }
}

/**
 * @fileoverview WebGL 着色器管理模块
 * 
 * 本模块提供了 WebGL 着色器的创建功能。
 * 
 * @module lib/webgl/core/shader
 * @author jmGraph Team
 */

/**
 * 创建 WebGL 着色器
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {number} type 着色器类型：gl.VERTEX_SHADER 或 gl.FRAGMENT_SHADER
 * @param {string} src 着色器源码
 * @returns {WebGLShader} 编译后的着色器对象
 */
function createShader(gl, type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
}

/**
 * @fileoverview GLSL 类型大小映射模块
 * 
 * 本模块提供了 GLSL 类型到其元素数量的映射。
 * 
 * @module lib/webgl/core/mapSize
 * @author jmGraph Team
 */

/**
 * GLSL 类型到元素数量的映射表
 * @constant {Object.<string, number>}
 */
const GLSL_TO_SIZE = {
    'float':    1,
    'vec2':     2,
    'vec3':     3,
    'vec4':     4,

    'int':      1,
    'ivec2':    2,
    'ivec3':    3,
    'ivec4':    4,

    'bool':     1,
    'bvec2':    2,
    'bvec3':    3,
    'bvec4':    4,

    'mat2':     4,
    'mat3':     9,
    'mat4':     16,

    'sampler2D':  1
};

/**
 * 根据 GLSL 类型名获取元素数量
 * @param {string} type GLSL 类型名
 * @returns {number} 元素数量
 */
const mapSize = function(type) { 
    return GLSL_TO_SIZE[type];
};

/**
 * @fileoverview WebGL 类型到 GLSL 类型映射模块
 * 
 * 本模块提供了 WebGL 常量类型到 GLSL 类型名的映射。
 * 
 * @module lib/webgl/core/mapType
 * @author jmGraph Team
 */

/** @type {Object.<number, string>|null} 缓存的类型映射表 */
var GL_TABLE = null;

/**
 * WebGL 常量到 GLSL 类型的映射表
 * @constant {Object.<string, string>}
 */
const GL_TO_GLSL_TYPES = {
    'FLOAT':       'float',
    'FLOAT_VEC2':  'vec2',
    'FLOAT_VEC3':  'vec3',
    'FLOAT_VEC4':  'vec4',

    'INT':         'int',
    'INT_VEC2':    'ivec2',
    'INT_VEC3':    'ivec3',
    'INT_VEC4':    'ivec4',
    
    'BOOL':        'bool',
    'BOOL_VEC2':   'bvec2',
    'BOOL_VEC3':   'bvec3',
    'BOOL_VEC4':   'bvec4',
    
    'FLOAT_MAT2':  'mat2',
    'FLOAT_MAT3':  'mat3',
    'FLOAT_MAT4':  'mat4',
    
    'SAMPLER_2D':  'sampler2D'  
};

/**
 * 将 WebGL 类型常量映射为 GLSL 类型名
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {number} type WebGL 类型常量
 * @returns {string} GLSL 类型名
 */
const mapType = function(gl, type) {
    if(!GL_TABLE) {
        const typeNames = Object.keys(GL_TO_GLSL_TYPES);
        GL_TABLE = {};
        for(let i = 0; i < typeNames.length; ++i) {
            const tn = typeNames[i];
            GL_TABLE[ gl[tn] ] = GL_TO_GLSL_TYPES[tn];
        }
    }

    return GL_TABLE[type];
};

/**
 * @fileoverview WebGL 着色器程序管理模块
 * 
 * 本模块提供了 WebGL 着色器程序的创建和管理功能，包括：
 * - 创建着色器程序
 * - 提取属性和 uniform 变量
 * - 顶点属性绑定
 * 
 * @module lib/webgl/core/program
 * @author jmGraph Team
 */

/**
 * 创建着色器程序
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {string} vertexSrc 顶点着色器源码
 * @param {string} fragmentSrc 片段着色器源码
 * @returns {Object} 程序对象 {program, attrs, uniforms}
 */
function createProgram(gl, vertexSrc, fragmentSrc) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('PError: Could not initialize shader.');
        console.error('gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS));
        console.error('gl.getError()', gl.getError());

        if (gl.getProgramInfoLog(program) !== '') {
            console.warn('Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
        }

        gl.deleteProgram(program);
    }

    useProgram(gl, program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    const attrs = extractAttributes(gl, program);
    const uniforms = extractUniforms(gl, program);
    
    return { program, attrs, uniforms };
}

/**
 * 使用指定的着色器程序
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {WebGLProgram} program 着色器程序
 */
function useProgram(gl, program) {
    return gl.useProgram(program);
}

/**
 * 提取着色器程序中的所有属性
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {WebGLProgram} program 着色器程序
 * @returns {Object} 属性对象字典
 */
function extractAttributes(gl, program) {
    const attributes = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < count; i++){
        const attribData = gl.getActiveAttrib(program, i);
        const type = mapType(gl, attribData.type);
        attributes[attribData.name] = {
            attribData,
            size: mapSize(type),
            type,
            location: gl.getAttribLocation(program, attribData.name),            
        };
    }

    return attributes;
}

/**
 * 提取着色器程序中的所有 uniform 变量
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {WebGLProgram} program 着色器程序
 * @returns {Object} uniform 变量对象字典
 */
function extractUniforms(gl, program) {
    const uniforms = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < count; i++) {
        const uniformData = gl.getActiveUniform(program, i);
        const name = uniformData.name.replace(/\[.*?\]/, "");
        const type = mapType(gl, uniformData.type);

        uniforms[name] = {
            uniformData,
            type: type,
            size: uniformData.size,
            location: gl.getUniformLocation(program, name),
        };
    }

    return uniforms;
}

/**
 * 将缓冲区数据写入顶点属性
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Object} buffer 缓冲区对象
 * @param {Object} attr 属性对象
 * @param {number} [size=2] 每个顶点的分量数（1-4）
 * @param {number} [strip=0] 步长，0 表示紧密排列
 * @param {number} [offset=0] 字节偏移量
 * @param {number} [dataType=gl.FLOAT] 数据类型
 * @returns {Object} 缓冲区对象
 */
function writeVertexAttrib(gl, buffer, attr, size=2, strip=0, offset=0, dataType=gl.FLOAT) {
    gl.bindBuffer(buffer.type, buffer.buffer);
    gl.vertexAttribPointer(
        attr.location,
        size,
        dataType,
        false,
        strip * buffer.unitSize,
        offset
    );
    gl.enableVertexAttribArray(attr.location);
    return buffer;
}

/**
 * 禁用顶点属性数组
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Object} attr 属性对象
 */
function disableVertexAttribArray(gl, attr) {
    return gl.disableVertexAttribArray(attr.location);
}

/**
 * @fileoverview WebGL 缓冲区管理模块
 * 
 * 本模块提供了 WebGL 缓冲区的创建和管理功能，包括：
 * - 创建通用缓冲区
 * - 创建 Float32 类型缓冲区
 * - 创建 Uint16 类型缓冲区
 * - 删除缓冲区
 * 
 * @module lib/webgl/core/buffer
 * @author jmGraph Team
 */

/**
 * 创建 WebGL 缓冲区
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Array|TypedArray} data 缓冲区数据
 * @param {number} [type=gl.ARRAY_BUFFER] 缓冲区类型
 * @param {number} [drawType=gl.STATIC_DRAW] 绘制类型
 * @returns {Object} 缓冲区对象 {type, drawType, buffer, unitSize}
 */
function createBuffer(gl, data, type=gl.ARRAY_BUFFER, drawType=gl.STATIC_DRAW) {
    const buffer = gl.createBuffer();
    if(!buffer) {
        throw Error('创建缓冲区对象失败');
    }
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data.buffer || data, drawType);
    return {
        type,
        drawType,
        buffer,
        unitSize: data.BYTES_PER_ELEMENT
    };
}

/**
 * 创建 Float32 类型缓冲区
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Array} data 数据数组
 * @param {number} [type=gl.ARRAY_BUFFER] 缓冲区类型
 * @param {number} [drawType=gl.STATIC_DRAW] 绘制类型
 * @returns {Object} 缓冲区对象
 */
function createFloat32Buffer(gl, data, type=gl.ARRAY_BUFFER, drawType=gl.STATIC_DRAW) {
    const vertices = new Float32Array(data);
    const buffer = createBuffer(gl, vertices, type, drawType);
    return buffer;
}

/**
 * 创建 Uint16 类型缓冲区
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Array} data 数据数组
 * @param {number} [type=gl.ARRAY_BUFFER] 缓冲区类型
 * @param {number} [drawType=gl.STATIC_DRAW] 绘制类型
 * @returns {Object} 缓冲区对象
 */
function createUint16Buffer(gl, data, type=gl.ARRAY_BUFFER, drawType=gl.STATIC_DRAW) {
    const vertices = new Uint16Array(data);
    const buffer = createBuffer(gl, vertices, type, drawType);
    return buffer;
}

/**
 * 删除缓冲区
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Object|WebGLBuffer} buffer 缓冲区对象或 WebGL 缓冲区
 */
function deleteBuffer(gl, buffer) {
    gl.deleteBuffer(buffer.buffer || buffer);
}

/**
 * @fileoverview WebGL 纹理管理模块
 * 
 * 本模块提供了 WebGL 纹理的创建和管理功能，包括：
 * - 创建 2D 纹理
 * - 创建图片纹理
 * - 创建数据纹理
 * - 删除纹理
 * 
 * @module lib/webgl/core/texture
 * @author jmGraph Team
 */

/**
 * 创建 2D 纹理
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @returns {WebGLTexture} 纹理对象
 */
function create2DTexture(gl) {
    const texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    return texture;
}

/**
 * 创建图片纹理
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {Image|HTMLImageElement} img 图像对象
 * @returns {Object} 纹理对象 {texture}
 */
function createImgTexture(gl, img) {
    const texture = create2DTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    return { texture };
}

/**
 * 根据像素数据创建纹理
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {ImageData|Object} pixels 像素数据 {data, width, height}
 * @returns {Object} 纹理对象 {texture}
 */
function createDataTexture(gl, pixels) {
    const data = new Uint8Array(pixels.data || pixels);
    const texture = create2DTexture(gl);

    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        pixels.width || 1,
        pixels.height || 1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data
    );
    return { texture };
}

/**
 * 删除纹理
 * @param {WebGLRenderingContext} gl WebGL 渲染上下文
 * @param {WebGLTexture} texture 纹理对象
 */
function deleteTexture(gl, texture) {
    return gl.deleteTexture(texture);
}

// 把canvas坐标转为webgl坐标系
const convertPointSource = `
    vec4 translatePosition(vec4 point, float x, float y) {
        point.x = (point.x-x)/x;
        point.y = (y-point.y)/y;
        return point;
    }`;
// 把纹理的canvas坐标转为纹理的坐标系
const convertTexturePosition = `
    vec2 translateTexturePosition(in vec2 point, vec4 bounds) {
        point.x = (point.x-bounds.x)/bounds.z; // 离左上角位置的X长比上纹理宽 0-1
        point.y = 1.0-(point.y-bounds.y)/bounds.w; // 离左上角位置的Y长比上高，因为纹理坐标是左下角起，所以要用1-
        return point;
    }`;

// path顶点着色器源码
const pathVertexSource = `
    attribute vec4 a_position;
    attribute vec4 a_color;
    attribute vec2 a_text_coord;
    uniform vec2 a_center_point; // 当前canvas的中心位置
    uniform float a_point_size; // 点的大小
    uniform int a_type;
    varying vec4 v_color;
    varying vec2 v_text_coord;
    varying float v_type;

    ${convertPointSource}

    void main() {
        gl_PointSize = a_point_size == 0.0? 1.0 : a_point_size;
        v_type = float(a_type);
        vec4 pos = translatePosition(a_position, a_center_point.x, a_center_point.y);
        gl_Position = pos;
        v_color = a_color;
        if(a_type == 2 || a_type == 5) {
            v_text_coord = a_position.xy;
        }
    }
`;
// path 片段着色器源码
const pathFragmentSource = `
    precision mediump float;
    uniform sampler2D u_sample;
    uniform vec4 v_texture_bounds; // 纹理的左上坐标和大小 x,y,z,w
    uniform vec4 v_single_color;
    // GLSL 渐变 uniforms
    uniform int u_gradient_type;     // 0=无 1=线性 2=径向
    uniform vec4 u_gradient_start;   // 线性:{x1,y1,0,0} 径向:{cx,cy,r1,0}
    uniform vec4 u_gradient_end;     // 线性:{x2,y2,0,0} 径向:{cx,cy,r2,0}
    uniform int u_gradient_stop_count;
    uniform float u_gradient_offsets[${MAX_STOPS}];
    uniform vec4 u_gradient_colors[${MAX_STOPS}]; // {r, g, b, a} 0~1 范围
    varying float v_type;
    varying vec4 v_color;
    varying vec2 v_text_coord;

    ${convertTexturePosition}

    // 在 sorted stops 中按 t 值采样颜色
    // 兼容 GLSL ES 1.0：循环仅与常量比较，无 break/continue
    vec4 sampleGradient(float t) {
        t = clamp(t, 0.0, 1.0);
        // 正向扫描：始终遍历 MAX_STOPS-1 次，找到 t 所在段并覆盖结果
        float localT = 0.0;
        vec4 c0 = u_gradient_colors[0];
        vec4 c1 = u_gradient_colors[0];
        for(int i = 0; i < ${MAX_STOPS - 1}; i++) {
            float s0 = u_gradient_offsets[i];
            float s1 = u_gradient_offsets[i + 1];
            if(t >= s0) {
                float range = s1 - s0;
                localT = range > 0.0001 ? clamp((t - s0) / range, 0.0, 1.0) : 0.0;
                c0 = u_gradient_colors[i];
                c1 = u_gradient_colors[i + 1];
            }
        }
        return mix(c0, c1, localT);
    }

    void main() {
        // 如果是fill，则直接填充颜色
        if(v_type == 1.0) {
            gl_FragColor = v_single_color;
        }
        // 渐变色 (旧方式，顶点颜色插值)
        else if(v_type == 3.0) {
            gl_FragColor = v_color;
        }
        // GLSL 渐变填充 (type=5)
        else if(v_type == 5.0) {
            float t;
            if(u_gradient_type == 2) {
                // 径向渐变
                vec2 d = v_text_coord - u_gradient_start.xy;
                float dist = length(d);
                float r1 = u_gradient_start.z;
                float r2 = u_gradient_end.z;
                float range = r2 - r1;
                t = range > 0.001 ? (dist - r1) / range : 0.0;
            } else {
                // 线性渐变
                vec2 dir = u_gradient_end.xy - u_gradient_start.xy;
                float lenSq = dot(dir, dir);
                if(lenSq > 0.001) {
                    vec2 pos = v_text_coord - u_gradient_start.xy;
                    t = dot(pos, dir) / lenSq;
                } else {
                    t = 0.0;
                }
            }
            gl_FragColor = sampleGradient(t) * v_single_color.a;
        }
        else if(v_type == 2.0) {
            vec2 pos = translateTexturePosition(v_text_coord, v_texture_bounds);
            gl_FragColor = texture2D(u_sample, pos);
        }
        else {
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            //根据距离设置片元
            if(r <= 0.5){
                // 方形区域片元距离几何中心半径小于0.5，像素颜色设置红色
                gl_FragColor = v_single_color;
            }else {
                // 方形区域距离几何中心半径不小于0.5的片元剪裁舍弃掉：
                discard;
            }
        }
    }
`;

/**
 * WebGL 基础渲染类
 * 提供 WebGL 渲染的核心功能，包括着色器、缓冲区、纹理管理等
 * 
 * @class WeblBase
 * @example
 * const base = new WeblBase(graph, { mode: 'webgl' });
 * base.setStyle({ fillStyle: '#ff0000' });
 */
class WeblBase {
    /**
     * 构造函数
     * @param {jmGraph} graph jmGraph 实例
     * @param {Object} option 配置选项
     */
    constructor(graph, option) {
        this.graph = graph;
        this.option = option || {};
        this.style = {
            globalAlpha: 1
        };
        this.stateStack = [];
        /** @type {number[]} 2D 变换矩阵 [a, b, c, d, tx, ty] */
        this.transformMatrix = [1, 0, 0, 1, 0, 0];
    }

    /** @returns {WebGLRenderingContext} WebGL 渲染上下文 */
    get context() {
        if(this.graph) return this.graph.context;
    }

    /** 保存当前状态到状态栈 */
    save() {
        this.stateStack.push({
            transformMatrix: [...this.transformMatrix],
            style: { ...this.style }
        });
    }

    /** 从状态栈恢复上一个状态 */
    restore() {
        if (this.stateStack.length > 0) {
            const state = this.stateStack.pop();
            this.transformMatrix = state.transformMatrix;
            this.style = state.style;
        }
    }

    /**
     * 平移变换
     * @param {number} x X 轴平移量
     * @param {number} y Y 轴平移量
     */
    translate(x, y) {
        this.transformMatrix[4] += x * this.transformMatrix[0] + y * this.transformMatrix[2];
        this.transformMatrix[5] += x * this.transformMatrix[1] + y * this.transformMatrix[3];
    }

    /**
     * 缩放变换
     * @param {number} sx X 轴缩放比例
     * @param {number} sy Y 轴缩放比例
     */
    scale(sx, sy) {
        this.transformMatrix[0] *= sx;
        this.transformMatrix[1] *= sx;
        this.transformMatrix[2] *= sy;
        this.transformMatrix[3] *= sy;
    }

    /**
     * 旋转变换
     * @param {number} angle 旋转角度（弧度）
     */
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const [a, b, c, d] = this.transformMatrix;
        this.transformMatrix[0] = a * cos - b * sin;
        this.transformMatrix[1] = a * sin + b * cos;
        this.transformMatrix[2] = c * cos - d * sin;
        this.transformMatrix[3] = c * sin + d * cos;
    }

    /**
     * 矩阵变换
     * @param {number} a 水平缩放
     * @param {number} b 垂直倾斜
     * @param {number} c 水平倾斜
     * @param {number} d 垂直缩放
     * @param {number} e 水平移动
     * @param {number} f 垂直移动
     */
    transform(a, b, c, d, e, f) {
        const [currentA, currentB, currentC, currentD, currentE, currentF] = this.transformMatrix;
        this.transformMatrix[0] = a * currentA + b * currentC;
        this.transformMatrix[1] = a * currentB + b * currentD;
        this.transformMatrix[2] = c * currentA + d * currentC;
        this.transformMatrix[3] = c * currentB + d * currentD;
        this.transformMatrix[4] = e * currentA + f * currentC + currentE;
        this.transformMatrix[5] = e * currentB + f * currentD + currentF;
    }

    /**
     * 应用变换到点
     * @param {Object} point 点坐标 {x, y}
     * @returns {Object} 变换后的点坐标 {x, y}
     */
    applyTransform(point) {
        const [a, b, c, d, tx, ty] = this.transformMatrix;
        return {
            x: a * point.x + c * point.y + tx,
            y: b * point.x + d * point.y + ty
        };
    }

    /**
     * 文本测量用的离屏 canvas context
     * @private
     * @returns {CanvasRenderingContext2D|null}
     */
    get _measureCtx() {
        if(!this.__measureCtx) {
            try {
                if(typeof document !== 'undefined') {
                    const c = document.createElement('canvas');
                    c.width = c.height = 1;
                    this.__measureCtx = c.getContext('2d');
                }
            } catch(e) {
                this.__measureCtx = null;
            }
        }
        return this.__measureCtx;
    }

    /**
     * 获取当前着色器程序
     * @returns {Object} 着色器程序对象
     */
    get program() {
        return this.graph.context.pathProgram || (this.graph.context.pathProgram=this.createProgram(pathVertexSource, pathFragmentSource));
    }

    /**
     * 设置样式
     * @param {Object|string} style 样式对象或样式属性名
     * @param {string} [value] 样式值（当 style 为字符串时使用）
     */
    setStyle(style = this.style, value = '') {
        if(typeof style === 'string') {
            const obj = {};
            obj[style] = value;
            style = obj;
        }
        this.style = {
            ...this.style,
            ...style
        };
    }

    /**
     * 将颜色转换为 WebGL 可识别的格式
     * @param {string|Object} color 颜色值
     * @returns {Object} RGBA 对象 {r, g, b, a}，范围 0-1
     */
    convertColor(color) {
        if(this.isGradient(color)) return color;
        if(typeof color === 'string') {
            color = this.graph.utils.hexToRGBA(color);
            if(typeof color === 'string') {
                color = this.__parseCSSColor(color);
            }
        }
        if(typeof color === 'object' && color.r !== undefined) {
            return this.graph.utils.rgbToDecimal(color);
        }
        return color;
    }

    /**
     * 利用离屏 canvas 解析任意 CSS 颜色
     * @private
     * @param {string} colorStr CSS 颜色字符串
     * @returns {Object} RGBA 对象 {r, g, b, a}
     */
    __parseCSSColor(colorStr) {
        const ctx = this._measureCtx;
        if(!ctx) return { r: 0, g: 0, b: 0, a: 0 };
        try {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = '#000000';
            ctx.fillStyle = colorStr;
            ctx.fillRect(0, 0, 1, 1);
            const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
            if(ctx.fillStyle === '#000000' && colorStr !== '#000000' && colorStr !== 'black') {
                return { r: 0, g: 0, b: 0, a: 0 };
            }
            return { r, g, b, a: a / 255 };
        } catch(e) {
            return { r: 0, g: 0, b: 0, a: 0 };
        }
    }

    /**
     * 创建着色器程序
     * @param {string} vertexSrc 顶点着色器源码
     * @param {string} fragmentSrc 片段着色器源码
     * @returns {Object} 着色器程序对象
     */
    createProgram(vertexSrc, fragmentSrc) {        
        return createProgram(this.context, vertexSrc, fragmentSrc);
    }

    /**
     * 使用指定的着色器程序
     * @param {Object} [program] 着色器程序，默认使用当前程序
     * @returns {Object} 着色器程序
     */
    useProgram(program=this.program) {
        program = program.program || program;
        if(this.context.__curent_program === program) return program;
        useProgram(this.context, program.program || program);
        this.context.__curent_program = program;
        return program;
    }

    /**
     * 获取属性位置
     * @param {string} name 属性名
     * @returns {number} 属性位置
     */
    getAttribLocation(name) {
        return this.context.getAttribLocation(this.program.program, name);
    }
    
    /**
     * 获取 uniform 位置
     * @param {string} name uniform 变量名
     * @returns {WebGLUniformLocation} uniform 位置
     */
    getUniformLocation(name) {
        return this.context.getUniformLocation(this.program.program, name);
    }

    /**
     * 将缓冲区数据写入顶点属性
     * @param {Object} buffer 缓冲区对象
     * @param {Object} attr 属性对象
     * @param {number} [size=2] 每个顶点的分量数（1-4）
     * @param {number} [strip=0] 步长，0 表示紧密排列
     * @param {number} [offset=0] 字节偏移量
     * @param {number} [dataType=FLOAT] 数据类型
     * @returns {Object} 缓冲区对象
     */
    writeVertexAttrib(buffer, attr, size=2, strip=0, offset=0, dataType=this.context.FLOAT) {
        buffer.attr = attr;
        return writeVertexAttrib(this.context, buffer, attr, size, strip, offset, dataType);
    }

    /**
     * 禁用顶点属性数组
     * @param {Object} attr 属性对象
     * @returns {Object} 属性对象
     */
    disableVertexAttribArray(attr) {
        try{
            if(!attr) return attr;
            return disableVertexAttribArray(this.context, attr);
        }
        catch(e) {
            console.error(e);
        }
        return attr;
    }

    /**
     * 创建 Float32 缓冲区
     * @param {Array} data 数据数组
     * @param {number} [type=ARRAY_BUFFER] 缓冲区类型
     * @param {number} [drawType=STATIC_DRAW] 绘制类型
     * @returns {Object} 缓冲区对象
     */
    createFloat32Buffer(data, type=this.context.ARRAY_BUFFER, drawType=this.context.STATIC_DRAW) {
        const buffer = createFloat32Buffer(this.context, data, type, drawType);
        return { data, ...buffer };
    }

    /**
     * 创建 Uint16 缓冲区
     * @param {Array} data 数据数组
     * @param {number} [type=ARRAY_BUFFER] 缓冲区类型
     * @param {number} [drawType=STATIC_DRAW] 绘制类型
     * @returns {Object} 缓冲区对象
     */
    createUint16Buffer(data, type=this.context.ARRAY_BUFFER, drawType=this.context.STATIC_DRAW) {
        const buffer = createUint16Buffer(this.context, data, type, drawType);
        return { data, ...buffer };
    }

    /**
     * 删除缓冲区
     * @param {Object} buffer 缓冲区对象
     * @returns {Object} 缓冲区对象
     */
    deleteBuffer(buffer) {
        try {
            if(!buffer) return;
            const bufferHandler = buffer.buffer || buffer;
            if(bufferHandler) return deleteBuffer(this.context, bufferHandler);
        }
        catch(e) {
            console.log(buffer);
            console.error(e);
        }
        return buffer;
    }

    /** @returns {WebGLTexture} 2D 纹理对象 */
    create2DTexture() { 
        return create2DTexture(this.context);
    }

    /**
     * 创建图片纹理
     * @param {Image|HTMLImageElement} img 图像对象
     * @returns {Object} 纹理对象
     */
    createImgTexture(img) {
        return createImgTexture(this.context, img);
    }

    /**
     * 根据像素数据创建纹理
     * @param {ImageData|Uint8Array} data 像素数据
     * @returns {Object} 纹理对象
     */
    createDataTexture(data) {
        return createDataTexture(this.context, data);
    }

    /**
     * 删除纹理
     * @param {Object} texture 纹理对象
     * @returns {Object} 纹理对象
     */
    deleteTexture(texture) {
        try {
            return deleteTexture(this.context, texture.texture || texture);
        }
        catch(e) {
            console.error(e);
        }
        return texture;
    }

    /**
     * 多边形三角化，得到三角形顶点索引数组
     * @param {Array<Object>} points 多边形顶点数组
     * @returns {Array<number>} 三角形顶点索引数组
     */
    earCutPoints(points) {
        const arr = this.pointsToArray(points);
        const ps = earcut(arr);
        return ps;
    }

    /**
     * 多边形三角化，得到三角形顶点数组
     * @param {Array<Object>} points 多边形顶点数组
     * @returns {Array<Array<Object>>} 三角形数组，每个三角形包含3个顶点
     */
    earCutPointsToTriangles(points) {
        this.earCutCache = this.earCutCache || (this.earCutCache = {});
        const len = points.length;
        const key = len + '_' + points[0].x + '_' + points[0].y + '_' + points[len-1].x + '_' + points[len-1].y;
        if (this.earCutCache[key]) return this.earCutCache[key];

        const ps = this.earCutPoints(points);
        const triangles = [];
        for(let i=0;i<ps.length; i+=3) {
            const p1 = points[ps[i]];
            const p2 = points[ps[i+1]];
            const p3 = points[ps[i+2]];
            triangles.push([p1, p2, p3]);
        }
        
        this.earCutCache[key] = triangles;
        return triangles;
    }

    /**
     * 点坐标数组转为一维数组
     * @param {Array<Object>} points 点数组 [{x, y}, ...]
     * @returns {Array<number>} 一维数组 [x1, y1, x2, y2, ...]
     */
    pointsToArray(points) {
        return [].concat(...points.map(p=>[p.x,p.y]));
    }

    /**
     * 一维数组转为点坐标数组
     * @param {Array<number>} arr 一维数组 [x1, y1, x2, y2, ...]
     * @returns {Array<Object>} 点数组 [{x, y}, ...]
     */
    arrayToPoints(arr) {
        const points = [];
        for(let i=0;i<arr.length; i+=2) {
            points.push({
                x: arr[i],
                y: arr[i+1]
            });
        }
        return points;
    }

    /**
     * 创建线性渐变
     * @param {number} x1 起点X坐标
     * @param {number} y1 起点Y坐标
     * @param {number} x2 终点X坐标
     * @param {number} y2 终点Y坐标
     * @param {Object} bounds 渐变边界
     * @returns {WebglGradient} 渐变对象
     */
    createLinearGradient(x1, y1, x2, y2, bounds) {
        return new WebglGradient('linear', {
            x1, y1, x2, y2, bounds,
            control: this
        });
    }

    /**
     * 创建径向渐变
     * @param {number} x1 内圆中心X坐标
     * @param {number} y1 内圆中心Y坐标
     * @param {number} r1 内圆半径
     * @param {number} x2 外圆中心X坐标
     * @param {number} y2 外圆中心Y坐标
     * @param {number} r2 外圆半径
     * @param {Object} bounds 渐变边界
     * @returns {WebglGradient} 渐变对象
     */
    createRadialGradient(x1, y1, r1, x2, y2, r2, bounds) {
        return new WebglGradient('radial', {
            x1, y1, r1,
            x2, y2, r2,
            bounds,
            control: this
        });
    }

    /**
     * 判断是否为渐变对象
     * @param {Object} obj 待检测对象
     * @returns {boolean} 是否为渐变对象
     */
    isGradient(obj) {
        return obj && obj instanceof WebglGradient;
    }

	/**
	 * 测试获取文本所占大小
	 *
	 * @method testSize
	 * @return {object} 含文本大小的对象
	 */
	testSize(text, style=this.style) {
		const ctx = this._measureCtx;
		if(!ctx) return { width: 15, height: style.fontSize || 15 };

		ctx.save && ctx.save();
		if(style.font || style.fontSize) ctx.font = style.font || (style.fontSize + 'px ' + style.fontFamily);
		const size = ctx.measureText ? ctx.measureText(text) : { width: 15 };
        ctx.restore && ctx.restore();
		size.height = style.fontSize ? parseInt(style.fontSize) : 15;
		return size;
	}
}

/**
 * @fileoverview WebGL 路径绘制类
 * 
 * 本模块提供了 WebGL 路径绘制功能，包括：
 * - 线条绘制（stroke）
 * - 填充绘制（fill）
 * - 纹理填充
 * - 渐变填充
 * - 文本绘制
 * - 多边形三角化
 * 
 * @module lib/webgl/path
 * @author jmGraph Team
 */

/**
 * WebGL 路径绘制类
 * 继承自 WeblBase，提供路径绘制功能
 * 
 * @class WebglPath
 * @extends WeblBase
 * @example
 * const path = new WebglPath(graph, { isRegular: false, needCut: true });
 * path.draw(points);
 * path.stroke(points, '#ff0000', 2);
 */
class WebglPath extends WeblBase {
    /**
     * 构造函数
     * @param {jmGraph} graph jmGraph 实例
     * @param {Object} option 配置选项
     * @param {boolean} [option.isRegular=false] 是否为规则图形（凸多边形）
     * @param {boolean} [option.needCut=false] 是否需要切割处理
     * @param {Object} [option.control] 控制器对象
     */
    constructor(graph, option) {
        super(graph, option);
        /** @type {boolean} 是否为规则图形（凸多边形），规则图形处理更高效 */
        this.isRegular = option.isRegular || false;
        /** @type {boolean} 是否需要切割处理 */
        this.needCut = option.needCut || false;
        this.control = option.control;
        /** @type {Array<Object>} 路径点数组 */
        this.points = [];
        /** @type {Array} 缓存的缓冲区，避免每帧创建/销毁 */
        this.__cachedBuffers = [];
        /** @type {Object} 缓存的纹理 */
        this.__cachedTexture = null;
        /** @type {string} 缓存纹理的 key */
        this.__cachedTextureKey = null;
    }

    /** 释放缓存的 WebGL 资源 */
    dispose() {
        for(const buf of this.__cachedBuffers) {
            this.deleteBuffer(buf);
        }
        this.__cachedBuffers = [];
        if(this.__cachedTexture) {
            this.deleteTexture(this.__cachedTexture);
            this.__cachedTexture = null;
            this.__cachedTextureKey = null;
        }
    }

    /**
     * 获取或创建缓冲区，优先复用缓存
     * @param {Array} data 数据数组
     * @param {Object} attr 属性对象
     * @returns {Object} 缓冲区对象
     */
    getOrCreateBuffer(data, attr) {
        let buffer = this.__cachedBuffers.find(b => b.attr === attr);
        if(buffer) {
            const gl = this.context;
            const float32 = new Float32Array(data);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, float32, gl.DYNAMIC_DRAW);
            buffer.data = data;
            return buffer;
        }
        buffer = this.createFloat32Buffer(data);
        buffer.attr = attr;
        this.__cachedBuffers.push(buffer);
        return buffer;
    }

    /**
     * 应用变换到点
     * @param {Object} point 点坐标 {x, y}
     * @returns {Object} 变换后的点坐标
     */
    applyTransform(point) {
        return super.applyTransform(point);
    }

    /**
     * 设置父级边界
     * @param {Object} [parentBounds] 父级边界 {left, top, width, height}
     */
    setParentBounds(parentBounds = this.parentAbsoluteBounds) {

        //this.useProgram();

        if(parentBounds) this.parentAbsoluteBounds = parentBounds;
        // 缓存中心点值，只在变化时才更新 uniform
        const cx = this.graph.width / 2;
        const cy = this.graph.height / 2;
        if(this.__lastCenterX !== cx || this.__lastCenterY !== cy) {
            this.context.uniform2f(this.program.uniforms.a_center_point.location, cx, cy);
            this.__lastCenterX = cx;
            this.__lastCenterY = cy;
        }
    }

    setFragColor(color) {
        
        if(!Array.isArray(color)) {
            color = this.convertColor(color);
            if(typeof color.a === 'undefined') color.a = 1;
            this.context.uniform4f(this.program.uniforms.v_single_color.location, color.r, color.g, color.b, color.a * this.style.globalAlpha);
            return null;
        }

        const colorData = [];
        for(let c of color) {
            c = this.convertColor(c);
            if(typeof c.a === 'undefined') c.a = 1;
            colorData.push(c.r, c.g, c.b, c.a * this.style.globalAlpha);
        }
        
        const colorBuffer = this.createFloat32Buffer(colorData); 
        this.writeVertexAttrib(colorBuffer, this.program.attrs.a_color, 4, 0, 0);
        colorBuffer.attr = this.program.attrs.a_color;
        return colorBuffer;
    }

    beginDraw() {
        this.useProgram();
    }

    // 开始绘制
    draw(points, parentBounds = this.parentAbsoluteBounds) {
        //this.useProgram();

        this.setParentBounds(parentBounds);
        
        this.points = points;
    }

    endDraw() {
        if(this.points) delete this.points;
        if(this.pathPoints) delete this.pathPoints;
        this.needClose = false;
        // 缓存的纹理保留到下次绘制（渐变可能不变）
    }

    /**
     * 标记路径需要闭合（不修改原始 points 数组）
     * 闭合逻辑由 stroke/fill 绘制方法自行处理
     */
    closePath() {
        this.needClose = true;
    }

    // 绘制点数组（使用 DYNAMIC_DRAW 复用 buffer，避免每帧 create/delete）
    writePoints(points, attr = this.program.attrs.a_position) {
        const fixedPoints = [];
        const [a, b, c, d, tx, ty] = this.transformMatrix;
        const isIdentity = (a === 1 && b === 0 && c === 0 && d === 1 && tx === 0 && ty === 0);
        const offsetLeft = this.parentAbsoluteBounds.left;
        const offsetTop = this.parentAbsoluteBounds.top;

        if(isIdentity) {
            // 单位矩阵时直接加偏移，避免逐点调用 applyTransform
            for(let i = 0; i < points.length; i++) {
                fixedPoints.push(points[i].x + offsetLeft, points[i].y + offsetTop);
            }
        } else {
            for(const p of points) {
                const transformedPoint = this.applyTransform(p);
                fixedPoints.push(
                    transformedPoint.x + offsetLeft,
                    transformedPoint.y + offsetTop
                );
            }
        }
        const float32 = new Float32Array(fixedPoints);
        const gl = this.context;

        // 复用已有 buffer 或创建新的
        if(this.__cachedBuffers.length > 0) {
            // 找一个同 attr 的 buffer 复用
            let buffer = this.__cachedBuffers.find(b => b.attr === attr);
            if(buffer) {
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, float32, gl.DYNAMIC_DRAW);
                buffer.data = fixedPoints;
                this.writeVertexAttrib(buffer, attr, 2, 0, 0);
                return buffer;
            }
        }
        const vertexBuffer = this.createFloat32Buffer(float32, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW); 
        this.writeVertexAttrib(vertexBuffer, attr, 2, 0, 0);
        vertexBuffer.attr = attr;
        this.__cachedBuffers.push(vertexBuffer);
        return vertexBuffer;
    }

    // 连接二个点
    genLinePoints(start, end) {
        const points = [start];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        if(dx !== 0 || dy !== 0) {
            const len = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            const cos = dx / len;
            const sin = dy / len;
            const step = 0.5;
            for(let l=step; l<len; l+=step) {
                const x = start.x + cos * l;
                const y = start.y + sin * l;
                points.push({
                    x, 
                    y
                });
            }
        }
        points.push(end);
        return points;
    }

    // 把path坐标集合分解成一个个点，并且处理moveTo线段能力
    pathToPoints(points=this.points) {
        let start = null;
        const res = [];
        for(let i=0; i<points.length; i++) {
            const p = points[i];
            if(start && !p.m) {
                const linePoints = this.genLinePoints(start, p);
                res.push(...linePoints);
            }
            else if(start && !res.includes(start)) {
                res.push(start);
            }
            start = p;
        }
        if(!res.includes(start)) res.push(start);
        return res;
    }
    // 二点是否重合
    equalPoint(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }

    // 将带 moveTo 标记的点集拆分为外轮廓和多个洞
    splitSubPaths(points) {
        const subPaths = [];
        let current = [];
        for(let i = 0; i < points.length; i++) {
            const p = points[i];
            if(p.m && current.length > 0) {
                subPaths.push(current);
                current = [];
            }
            current.push(p);
        }
        if(current.length > 0) subPaths.push(current);

        // 面积最大的作为外轮廓，其余作为洞
        let maxArea = -1;
        let outerIdx = 0;
        for(let i = 0; i < subPaths.length; i++) {
            const area = Math.abs(this.polygonArea(subPaths[i]));
            if(area > maxArea) {
                maxArea = area;
                outerIdx = i;
            }
        }

        const outerPoints = subPaths[outerIdx];
        const holes = [];
        for(let i = 0; i < subPaths.length; i++) {
            if(i !== outerIdx) holes.push(subPaths[i]);
        }
        return { outerPoints, holes };
    }

    // 计算多边形面积（Shoelace 公式）
    polygonArea(points) {
        let area = 0;
        const n = points.length;
        for(let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += points[i].x * points[j].y;
            area -= points[j].x * points[i].y;
        }
        return area / 2;
    }

    // 使用 earcut 带 holes 填充多边形
    fillWithHoles(outerPoints, holes, isTexture = false) {
        // 将所有点合并：外轮廓 + 各个洞，并记录洞的起始索引
        const allPoints = [...outerPoints];
        const holeIndices = [];
        for(const hole of holes) {
            holeIndices.push(allPoints.length);
            allPoints.push(...hole);
        }

        const dim = 2;
        const vertexData = [];
        for(const p of allPoints) {
            vertexData.push(p.x, p.y);
        }

        // 用 earcut 进行带洞三角化
        const indices = earcut(vertexData, holeIndices, dim);

        if(!indices || indices.length < 3) return;

        // 构建 GPU 顶点数据
        const allVertices = [];
        const allTexCoords = [];
        for(let i = 0; i < indices.length; i++) {
            const p = allPoints[indices[i]];
            allVertices.push(p.x, p.y);
            if(isTexture) allTexCoords.push(p.x, p.y);
        }

        const gl = this.context;
        const vertexArr = new Float32Array(allVertices);

        let posBuffer = this.__cachedBuffers.find(b => b.attr === this.program.attrs.a_position);
        if(!posBuffer) {
            posBuffer = this.createFloat32Buffer(vertexArr, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
            posBuffer.attr = this.program.attrs.a_position;
            this.__cachedBuffers.push(posBuffer);
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexArr, gl.DYNAMIC_DRAW);
        }
        this.writeVertexAttrib(posBuffer, this.program.attrs.a_position, 2, 0, 0);

        if(isTexture && allTexCoords.length) {
            const texData = new Float32Array(allTexCoords);
            let texBuffer = this.__cachedBuffers.find(b => b.attr === this.program.attrs.a_text_coord);
            if(!texBuffer) {
                texBuffer = this.createFloat32Buffer(texData, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
                texBuffer.attr = this.program.attrs.a_text_coord;
                this.__cachedBuffers.push(texBuffer);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, texData, gl.DYNAMIC_DRAW);
            }
            this.writeVertexAttrib(texBuffer, this.program.attrs.a_text_coord, 2, 0, 0);
        }

        gl.drawArrays(gl.TRIANGLES, 0, allVertices.length / 2);
    }
    // 把path坐标集合转为线段集
    pathToLines(points) {
        let start = null;
        const res = [];
        for(let i=0; i<points.length; i++) {
            const p = points[i];
            // 不重合的二个点，组成线段
            if(start && !p.m && !(start.x == p.x && start.y == p.y)) {
                const line = {
                    start,
                    end: p,
                };
                res.push(line);
            }
            start = p;
        }
        return res;
    }

    // 裁剪线段，如果二段线段有交点，则分割成四段， 端头相交的线段不用分割
    cutLines(lines, index1=0, index2=0) {
        if(lines && lines.length < 3) return lines;
        
        index2 = Math.max(index1 + 1, index2); //如果指定了比下一个更大的索引，则用更大的，说明前面的已经处理过了，不需要重复

        // 找出线段相交的点，并切割线段
        while(index1 < lines.length) {
            const line1 = lines[index1];

            while(index2 < lines.length) {
                const line2 = lines[index2];
                // 如果二条线顶点有重合，则不用处理
                if(this.equalPoint(line1.start, line2.start) || this.equalPoint(line1.end, line2.end) || 
                this.equalPoint(line1.start, line2.end) || this.equalPoint(line1.end, line2.start)) {
                    index2++;
                    continue;
                }
                let cuted = false;
                const intersection = this.getIntersection(line1, line2);// 计算交点
                if(intersection) {
                    // 如果交点不是线段的端点，则分割成二条线段
                    if(!this.equalPoint(line1.start, intersection) && !this.equalPoint(line1.end, intersection)) {
                        const sub1 = {
                            start: line1.start,
                            end: intersection
                        };
                        const sub2 = {
                            start: intersection,
                            end: line1.end
                        };
                        // 从原数组中删除当前线段，替换成新的线段
                        lines.splice(index1, 1, sub1, sub2);
                        // 当前线段被重新替换，需要重新从它开始处理
                        cuted = true;
                        index2 ++;// 因为多加入了一个线段，则对比线索引需要加1
                    }
                    // 如果交点不是线段的端点，则分割成二条线段
                    if(!this.equalPoint(line2.start, intersection) && !this.equalPoint(line2.end, intersection)) {
                        const sub1 = {
                            start: line2.start,
                            end: intersection
                        };
                        const sub2 = {
                            start: intersection,
                            end: line2.end
                        };
                        // 从原数组中删除当前线段，替换成新的线段
                        lines.splice(index2, 1, sub1, sub2);
                        index2 ++; // 线段2也切成了二段，对比索引要继续加1
                    }
                }
                index2++;
                // 如果已经分割了起始线段，则第一个子线段开始，重新对比后面还未对比完的。直接所有对比完成返回
                if(cuted) return this.cutLines(lines, index1, index2);
            }
            index1++;
            index2 = index1 + 1;
        }
        return lines;
    }

    // 计算二个线段的交点
    getIntersection(line1, line2) {
        // 如果首尾相接，也认为是有交点
        if(this.equalPoint(line1.start, line2.start) || this.equalPoint(line1.start, line2.end)) return line1.start;
        if(this.equalPoint(line1.end, line2.start) || this.equalPoint(line1.end, line2.end)) return line1.end;

        // 三角形abc 面积的2倍
        const area_abc = (line1.start.x - line2.start.x) * (line1.end.y - line2.start.y) - (line1.start.y - line2.start.y) * (line1.end.x - line2.start.x);
        
        // 三角形abd 面积的2倍
        const area_abd = (line1.start.x - line2.end.x) * (line1.end.y - line2.end.y) - (line1.start.y - line2.end.y) * (line1.end.x - line2.end.x);
        
        // 面积符号相同则两点在线段同侧,不相交 (=0表示在线段顶点上);
        if (area_abc * area_abd > 0) {
            return null;
        }
        
        // 三角形cda 面积的2倍
        const area_cda = (line2.start.x - line1.start.x) * (line2.end.y - line1.start.y) - (line2.start.y - line1.start.y) * (line2.end.x - line1.start.x);
        // 三角形cdb 面积的2倍
        // 注意: 这里有一个小优化.不需要再用公式计算面积,而是通过已知的三个面积加减得出.
        const area_cdb = area_cda + area_abc - area_abd ;
        if(area_cda * area_cdb > 0) {
            return null ;
        }
        if(area_abd === area_abc) return null;

        //计算交点坐标
        const t = area_cda / (area_abd - area_abc);
        const dx= t * (line1.end.x - line1.start.x);
        const dy= t * (line1.end.y - line1.start.y);

        return { 
            x: line1.start.x + dx, 
            y: line1.start.y + dy
        };
    }

    // 找出跟当前线段尾部相交的所有线段
    getIntersectionLines(line, lines, index, point=line.end, points=[], root=null) {
        const res = {
            line,
            polygons: []
        };
        
        points.push(point);
        
        if(root && this.equalPoint(root.line.start, point)) {
            points.unshift(root.line.start); // 把起始地址加入进去
            root.polygons.push(points);
            return res;
        }

        for(;index<lines.length; index++) {
            const l = lines[index];
            if(this.equalPoint(point, l.start)) {      
                if(points.includes(l.end)) continue;          
                this.getIntersectionLines(l, lines, index+1, l.end, [...points], root||res);
            }
            else if(this.equalPoint(point, l.end)) {
                if(points.includes(l.start)) continue;     
                this.getIntersectionLines(l, lines, index+1, l.start, [...points], root||res);
            }
        }
        return res;
    }

    // 根据路径点坐标，切割出封闭的多边形
    getPolygon(points) {
        let polygons = [];
        let lines = this.pathToLines(points); // 分解得到线段
        if(lines && lines.length > 2) {
            lines = this.cutLines(lines); // 把所有相交点切割线段找出来
            for(let i=0; i<lines.length-1; i++) {
                const line1 = lines[i];

                const treeLine = this.getIntersectionLines(line1, lines, i+1);
                
                if(treeLine.polygons.length) polygons.push(...treeLine.polygons);
                continue;
            }
        }
        
        // 当有多个封闭图形时，再弟归一下，里面是不是有封闭图形内还有子封闭图形
        /*if(polygons.length > 1) {
            const newPolygons = [];
            for(const polygon of polygons) {
                // 只有大于4才有可能有子封闭图形
                if(polygon.length > 4) {
                    const childPolygons = this.getPolygon(polygon);
                    // 当有多个子图形时，表示它不是最终封闭图形，跳过，
                    // 因为它的子图形之前有加入的，不需要重复加入
                    if(childPolygons.length > 1) {
                        //newPolygons.push(...childPolygons);
                        continue;
                    }
                }
                newPolygons.push(polygon);
            }
            polygons = newPolygons;
        }*/
        return polygons;
    }

    // 分割成一个个规则的三角形，不规则的多边形不全割的话纹理就会没法正确覆盖
    getTriangles(points) {
        this.trianglesCache = this.trianglesCache||(this.trianglesCache={});
        // 快速缓存 key：用长度和首尾点坐标（比 JSON.stringify 快几个数量级）
        const len = points.length;
        const key = len + '_' + points[0].x + '_' + points[0].y + '_' + points[len-1].x + '_' + points[len-1].y;
        if(this.trianglesCache[key]) return this.trianglesCache[key];

        const res = [];
        const polygons = this.getPolygon(points);                
        if(polygons.length) {            
            for(const polygon of polygons) {
                // 需要分割三角形，不然填充会有问题
                const triangles = this.earCutPointsToTriangles(polygon);
                res.push(...triangles);
            }   
        }
        this.trianglesCache[key] = res;
        return res;
    }

    // 画线条
    stroke(points = this.points, color = this.style.strokeStyle, lineWidth = this.style.lineWidth) {
        if(!points || !points.length) return;
       // this.useProgram();

        let colorBuffer = null;
        if(color) {
            colorBuffer = this.setFragColor(color);
        }
        // 线宽
        if(lineWidth) {
            this.context.uniform1f(this.program.uniforms.a_point_size.location, lineWidth);// * this.graph.devicePixelRatio
        }
        // 标注为stroke
        if(this.program.uniforms.a_type) {
            // 4表示单画一个圆点，1表示方块形成的线条
            this.context.uniform1i(this.program.uniforms.a_type.location, points.length === 1? 4 :1);
        }
        if(points && points.length) {
            const regular = lineWidth <= 1.2;
            const hasMoveTo = points.some && points.some(p => p.m);
            const isRing = !hasMoveTo && this.needCut; // 空心形状（jmHArc close=true 时无 m 标记）
            if(regular && (hasMoveTo || isRing)) {
                // 有 moveTo 标记或空心形状时，分段绘制每个子路径的 LINE_LOOP
                // 避免 LINE_LOOP 把不同子路径的点连起来产生拉扯线
                if(hasMoveTo) {
                    let subPath = [];
                    for(let i = 0; i < points.length; i++) {
                        if(points[i].m && subPath.length > 0) {
                            this.writePoints(subPath);
                            this.context.drawArrays(this.context.LINE_LOOP, 0, subPath.length);
                            subPath = [];
                        }
                        subPath.push(points[i]);
                    }
                    if(subPath.length > 1) {
                        this.writePoints(subPath);
                        this.context.drawArrays(this.context.LINE_LOOP, 0, subPath.length);
                    }
                }
                else if(isRing) {
                    // 空心形状：前半段为内弧，后半段为外弧（反向），各自 LINE_LOOP
                    const mid = Math.floor(points.length / 2);
                    const inner = points.slice(0, mid);
                    const outer = points.slice(mid);
                    if(inner.length > 1) {
                        this.writePoints(inner);
                        this.context.drawArrays(this.context.LINE_LOOP, 0, inner.length);
                    }
                    if(outer.length > 1) {
                        this.writePoints(outer);
                        this.context.drawArrays(this.context.LINE_LOOP, 0, outer.length);
                    }
                }
            }
            else {
                points = regular? points : this.pathToPoints(points);
                this.writePoints(points);
                this.context.drawArrays(regular? this.context.LINE_LOOP: this.context.POINTS, 0, points.length);
            }
            // buffer 由 endDraw 统一清理
        }
        colorBuffer && this.disableVertexAttribArray(colorBuffer && colorBuffer.attr);
    }

    // 填充图形
    fill(bounds = {left: 0, top: 0, width: 0, height: 0}, type = 1) {
       
        if(this.points && this.points.length) {            
            // 如果是颜色rgba
            if(this.style.fillStyle) {            
                this.fillColor(this.style.fillStyle, this.points, bounds, type);
            }
            if(this.style.fillImage) {            
                this.fillImage(this.style.fillImage, this.points, bounds, type); 
            }
        }
    }

    fillColor(color, points, bounds, type=1) {
        
        // 如果是渐变色，使用 GLSL 着色器直接计算
        if(this.isGradient(color)) {
            return this.fillGradient(color, points, bounds);
        }
        
        // 标注为fill
        this.context.uniform1i(this.program.uniforms.a_type.location, type);
        const colorBuffer = this.setFragColor(color);

        this.fillPolygons(points);                

        colorBuffer && this.disableVertexAttribArray(colorBuffer && colorBuffer.attr);

    }

    /**
     * 使用 GLSL 着色器渲染渐变填充
     * 无需 textureCanvas，直接通过 uniform 传递渐变参数给 GPU
     */
    fillGradient(gradient, points, bounds) {
        const params = gradient.toUniformParams();
        if(!params) return;

        // 标注为 GLSL 渐变 (type=5)
        this.context.uniform1i(this.program.uniforms.a_type.location, 5);

        // 设置 globalAlpha（通过 v_single_color.a 传递给着色器）
        this.context.uniform4f(this.program.uniforms.v_single_color.location, 1.0, 1.0, 1.0, this.style.globalAlpha);

        // 设置渐变类型
        if(this.program.uniforms.u_gradient_type) {
            this.context.uniform1i(this.program.uniforms.u_gradient_type.location, params.gradientType);
        }

        // 设置渐变起点/终点
        if(this.program.uniforms.u_gradient_start) {
            this.context.uniform4fv(this.program.uniforms.u_gradient_start.location, params.gradientStart);
        }
        if(this.program.uniforms.u_gradient_end) {
            this.context.uniform4fv(this.program.uniforms.u_gradient_end.location, params.gradientEnd);
        }

        // 设置颜色断点数量
        if(this.program.uniforms.u_gradient_stop_count) {
            this.context.uniform1i(this.program.uniforms.u_gradient_stop_count.location, params.stopCount);
        }

        // 设置每个 stop 的 offset
        // 关键：必须填充完整的 MAX_STOPS 长度数组，否则未初始化元素默认为 0
        // 会导致着色器循环中 t >= 0 始终为 true，返回黑色
        if(this.program.uniforms.u_gradient_offsets) {
            const offsets = new Float32Array(MAX_STOPS);
            for(let i = 0; i < params.stopCount; i++) {
                offsets[i] = params.stops[i * 5];
            }
            // 用 2.0 填充剩余项，使 t(0~1) >= 2.0 为 false，不会被匹配
            for(let i = params.stopCount; i < MAX_STOPS; i++) {
                offsets[i] = 2.0;
            }
            this.context.uniform1fv(this.program.uniforms.u_gradient_offsets.location, offsets);
        }

        // 设置每个 stop 的颜色 (rgba)
        if(this.program.uniforms.u_gradient_colors) {
            const colors = new Float32Array(MAX_STOPS * 4);
            for(let i = 0; i < params.stopCount; i++) {
                colors[i * 4 + 0] = params.stops[i * 5 + 1]; // r
                colors[i * 4 + 1] = params.stops[i * 5 + 2]; // g
                colors[i * 4 + 2] = params.stops[i * 5 + 3]; // b
                colors[i * 4 + 3] = params.stops[i * 5 + 4]; // a
            }
            // 用最后一个 stop 的颜色填充剩余项，确保不会返回黑色
            if(params.stopCount > 0) {
                const lastR = params.stops[(params.stopCount - 1) * 5 + 1];
                const lastG = params.stops[(params.stopCount - 1) * 5 + 2];
                const lastB = params.stops[(params.stopCount - 1) * 5 + 3];
                const lastA = params.stops[(params.stopCount - 1) * 5 + 4];
                for(let i = params.stopCount; i < MAX_STOPS; i++) {
                    colors[i * 4 + 0] = lastR;
                    colors[i * 4 + 1] = lastG;
                    colors[i * 4 + 2] = lastB;
                    colors[i * 4 + 3] = lastA;
                }
            }
            this.context.uniform4fv(this.program.uniforms.u_gradient_colors.location, colors);
        }

        // 填充多边形（需要纹理坐标来计算渐变位置）
        this.fillPolygons(points, true);
        this.disableVertexAttribArray(this.program.attrs.a_text_coord);
    }

    // 区域填充图片
    // points绘制的图形顶点
    // 图片整体绘制区域
    fillImage(img, points, bounds) {
        if(!img) return;

        // 对于 ImageData，生成缓存 key（基于渐变参数或 bounds），复用纹理
        let texture = null;
        if(img instanceof ImageData) {
            const key = `${img.width}_${img.height}_${bounds.width}_${bounds.height}_${bounds.left}_${bounds.top}`;
            if(this.__cachedTexture && this.__cachedTextureKey === key) {
                texture = this.__cachedTexture;
            } else {
                texture = this.createDataTexture(img);
                // 释放旧纹理
                if(this.__cachedTexture) {
                    this.deleteTexture(this.__cachedTexture);
                }
                this.__cachedTexture = texture;
                this.__cachedTextureKey = key;
            }
        } else {
            texture = this.createImgTexture(img);
        }
        this.context.uniform1i(this.program.uniforms.u_sample.location, 0); // 纹理单元传递给着色器

        // 指定纹理区域尺寸
        this.context.uniform4f(this.program.uniforms.v_texture_bounds.location, 
            bounds.left + this.parentAbsoluteBounds.left,
            bounds.top + this.parentAbsoluteBounds.top,
            bounds.width,
            bounds.height,
        ); // 纹理单元传递给着色器

        this.fillTexture(points);
        
        // 仅对非缓存纹理（非 ImageData）立即删除
        if(!(img instanceof ImageData)) {
            this.deleteTexture(texture);
        }
    }

    fillTexture(points) {        
        if(points && points.length) {  // 标注为纹理对象
            this.context.uniform1i(this.program.uniforms.a_type.location, 2);  
            // 纹理坐标
            //const coordBuffer = this.writePoints(points, this.program.attrs.a_text_coord);
            this.fillPolygons(points, true);
            //this.deleteBuffer(coordBuffer);  
            this.disableVertexAttribArray(this.program.attrs.a_text_coord);   
        } 
    }

    // 进行多边形填充
    fillPolygons(points, isTexture = false) {   
        if(points.length <= 3) {
            // 3个点以下的三角形直接画
            this.writePoints(points);
            isTexture? this.writePoints(points, this.program.attrs.a_text_coord): null;
            this.context.drawArrays(this.context.TRIANGLE_FAN, 0, points.length);
            return;
        }

        // 规则图形（凸多边形，如圆）：直接用 TRIANGLE_FAN 一次性绘制，无需 earcut
        if(this.isRegular) {
            // 检查是否有 moveTo 标记，如果有说明路径包含多个子路径（如空心圆弧 jmHArc）
            const hasMoveTo = points.some && points.some(p => p.m);
            if(hasMoveTo) {
                // 有 m 标记：按 m 标记拆分子路径
                const { outerPoints, holes } = this.splitSubPaths(points);
                this.fillWithHoles(outerPoints, holes, isTexture);
                return;
            }
            // 无 m 标记但 needCut=true 表示空心形状（如 jmHArc close=true）
            // 前半段为内弧，后半段为外弧（反向），按中点拆分
            if(this.needCut && points.length >= 6) {
                const mid = Math.floor(points.length / 2);
                const inner = points.slice(0, mid);
                const outer = points.slice(mid);
                const innerArea = Math.abs(this.polygonArea(inner));
                const outerArea = Math.abs(this.polygonArea(outer));
                if(outerArea >= innerArea) {
                    this.fillWithHoles(outer, [inner], isTexture);
                } else {
                    this.fillWithHoles(inner, [outer], isTexture);
                }
                return;
            }
            this.writePoints(points);
            isTexture? this.writePoints(points, this.program.attrs.a_text_coord): null;
            this.context.drawArrays(this.context.TRIANGLE_FAN, 0, points.length);
            return;
        }

        // 不规则图形：需要 earcut 三角化后，合并为一个大的顶点缓冲区，单次 drawArrays
        const triangles = this.needCut? this.earCutPointsToTriangles(points): this.getTriangles(points);
        if(!triangles.length) return;

        // 合并所有三角形的顶点到一个数组
        const allVertices = [];
        const allTexCoords = [];
        for(const triangle of triangles) {
            for(const p of triangle) {
                allVertices.push(p.x, p.y);
                if(isTexture) allTexCoords.push(p.x, p.y);
            }
        }

        // 一次性上传所有数据并绘制
        const vertexData = new Float32Array(allVertices);
        const gl = this.context;

        // 复用或创建 position buffer
        let posBuffer = this.__cachedBuffers.find(b => b.attr === this.program.attrs.a_position);
        if(!posBuffer) {
            posBuffer = this.createFloat32Buffer(vertexData, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
            posBuffer.attr = this.program.attrs.a_position;
            this.__cachedBuffers.push(posBuffer);
        } else {
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.DYNAMIC_DRAW);
        }
        this.writeVertexAttrib(posBuffer, this.program.attrs.a_position, 2, 0, 0);

        if(isTexture && allTexCoords.length) {
            const texData = new Float32Array(allTexCoords);
            let texBuffer = this.__cachedBuffers.find(b => b.attr === this.program.attrs.a_text_coord);
            if(!texBuffer) {
                texBuffer = this.createFloat32Buffer(texData, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
                texBuffer.attr = this.program.attrs.a_text_coord;
                this.__cachedBuffers.push(texBuffer);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer.buffer);
                gl.bufferData(gl.ARRAY_BUFFER, texData, gl.DYNAMIC_DRAW);
            }
            this.writeVertexAttrib(texBuffer, this.program.attrs.a_text_coord, 2, 0, 0);
        }

        gl.drawArrays(gl.TRIANGLES, 0, allVertices.length / 2);
    }

    // 填充图形
    drawImage(img, left=0, top=0, width=img.width, height=img.height) {
        width = width || img.width;
        height = height || img.height;

        this.fillImage(img, this.points, {
            left,
            top,
            width, 
            height
        });
    }

    drawText(text, x, y, bounds) {
        // 文本渲染仍需要 2D canvas 绘制字形，然后作为纹理上传
        // 使用临时 canvas，不依赖共享的 textureCanvas
        if(!bounds.width || !bounds.height) return null;
        if(typeof document === 'undefined') return null;

        let canvas = this.__textCanvas;
        if(!canvas) {
            canvas = document.createElement('canvas');
            this.__textCanvas = canvas;
        }
        canvas.width = bounds.width;
        canvas.height = bounds.height;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 修改字体
        ctx.font = this.style.font || (this.style.fontSize + 'px ' + this.style.fontFamily);

        x -= bounds.left;
        y -= bounds.top;

        // 设置文本样式
        if(this.style.fillStyle) {
            ctx.fillStyle = this.graph.utils.toColor(this.style.fillStyle);
        }
        if(this.style.strokeStyle) {
            ctx.strokeStyle = this.graph.utils.toColor(this.style.strokeStyle);
        }
        if(this.style.shadowColor) {
            ctx.shadowColor = this.graph.utils.toColor(this.style.shadowColor);
        }
        if(this.style.shadowBlur) {
            ctx.shadowBlur = this.style.shadowBlur;
        }
        if(this.style.shadowOffsetX !== undefined) {
            ctx.shadowOffsetX = this.style.shadowOffsetX;
        }
        if(this.style.shadowOffsetY !== undefined) {
            ctx.shadowOffsetY = this.style.shadowOffsetY;
        }
        if(this.style.textAlign) {
            ctx.textAlign = this.style.textAlign;
        }
        if(this.style.textBaseline) {
            ctx.textBaseline = this.style.textBaseline;
        }

        if(this.style.fillStyle && ctx.fillText) {
            if(this.style.maxWidth) {
                ctx.fillText(text, x, y, this.style.maxWidth);
            }
            else {
                ctx.fillText(text, x, y);
            }
        }
        if(this.style.strokeStyle && ctx.strokeText) {
            if(this.style.maxWidth) {
                ctx.strokeText(text, x, y, this.style.maxWidth);
            }
            else {
                ctx.strokeText(text, x, y);
            }
        }

        // 用纹理图片代替文字
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        this.fillImage(data, this.points, bounds);
    }
}

/**
 * 样式名称映射表
 * 
 * 将简化的样式名称映射到 Canvas API 的标准属性名。
 * 例如：'fill' -> 'fillStyle', 'stroke' -> 'strokeStyle'
 * 
 * @constant {Object.<string, string>}
 * @private
 */
const jmStyleMap = {
	'fill':'fillStyle',           // 填充颜色
	'fillImage':'fillImage',      // 填充图片
	'stroke':'strokeStyle',       // 描边颜色
	'shadow.blur':'shadowBlur',   // 阴影模糊度
	'shadow.x':'shadowOffsetX',   // 阴影X偏移
	'shadow.y':'shadowOffsetY',   // 阴影Y偏移
	'shadow.color':'shadowColor', // 阴影颜色
	'lineWidth' : 'lineWidth',    // 线宽
	'miterLimit': 'miterLimit',   // 斜接限制
	'fillStyle' : 'fillStyle',    // 填充样式
	'strokeStyle' : 'strokeStyle',// 描边样式
	'font' : 'font',              // 字体
	'opacity' : 'globalAlpha',    // 透明度
	'textAlign' : 'textAlign',    // 文本对齐
	'textBaseline' : 'textBaseline', // 文本基线
	'shadowBlur' : 'shadowBlur',  // 阴影模糊
	'shadowOffsetX' : 'shadowOffsetX', // 阴影X偏移
	'shadowOffsetY' : 'shadowOffsetY', // 阴影Y偏移
	'shadowColor' : 'shadowColor', // 阴影颜色
	'lineJoin': 'lineJoin',       // 线条连接样式
	'lineCap':'lineCap',          // 线条端点样式
	'lineDashOffset': 'lineDashOffset', // 虚线偏移
	'globalCompositeOperation': 'globalCompositeOperation' // 合成操作
};

/**
 * jmGraph 控件基类
 * 
 * jmControl 是所有可视化图形控件的基类，提供了完整的图形渲染和交互能力。
 * 
 * **核心功能：**
 * 
 * 1. **样式系统**
 *    - 支持填充色、描边色、渐变、图片填充
 *    - 支持阴影、滤镜、混合模式
 *    - 支持虚线、线宽、线帽等线条样式
 * 
 * 2. **变换系统**
 *    - 支持 translate（平移）
 *    - 支持 rotation（旋转）
 *    - 支持 transform（矩阵变换）
 * 
 * 3. **事件系统**
 *    - 鼠标事件：mousedown, mouseup, mousemove, click, dblclick
 *    - 触摸事件：touchstart, touchmove, touchend
 *    - 焦点事件：mouseover, mouseleave, touchover, touchleave
 *    - 自定义事件：支持任意事件类型
 * 
 * 4. **渲染系统**
 *    - 自动选择 Canvas 2D 或 WebGL 渲染器
 *    - 支持脏矩形优化
 *    - 支持层级排序（zIndex）
 * 
 * 5. **碰撞检测**
 *    - 支持点在多边形内判断
 *    - 支持自定义命中区域
 *    - 支持旋转后的碰撞检测
 * 
 * @class jmControl
 * @extends jmProperty
 * 
 * @example
 * // 创建自定义控件
 * class MyShape extends jmControl {
 *     constructor(params) {
 *         super(params, 'myShape');
 *     }
 *     
 *     // 重写绘制方法
 *     draw() {
 *         // 自定义绘制逻辑
 *     }
 * }
 * 
 * // 使用控件
 * const shape = new MyShape({
 *     position: { x: 100, y: 100 },
 *     width: 50,
 *     height: 50,
 *     style: {
 *         fill: 'red',
 *         stroke: 'black',
 *         lineWidth: 2
 *     }
 * });
 * graph.children.add(shape);
 */
class jmControl extends jmProperty {

	/**
	 * 构造函数
	 * 
	 * 创建一个新的控件实例。子类应该调用 super(params, 'typeName') 来设置类型名称。
	 * 
	 * @constructor
	 * @param {Object} [params] - 控件初始化参数
	 * @param {Object} [params.style] - 样式对象，包含填充、描边等属性
	 * @param {number} [params.width=0] - 控件宽度
	 * @param {number} [params.height=0] - 控件高度
	 * @param {Object} [params.position] - 控件位置 {x, y}
	 * @param {jmGraph} [params.graph] - 所属画布实例
	 * @param {number} [params.zIndex=0] - 层级顺序
	 * @param {boolean} [params.interactive=false] - 是否响应交互事件
	 * @param {Object} [params.hitArea] - 自定义命中区域 {x, y, width, height}
	 * @param {boolean} [params.isRegular] - 是否为规则图形（WebGL优化）
	 * @param {boolean} [params.needCut] - 是否需要裁剪（WebGL）
	 * @param {string} [t] - 控件类型名称，默认使用类名
	 * 
	 * @example
	 * // 创建矩形控件
	 * const rect = new jmControl({
	 *     position: { x: 10, y: 10 },
	 *     width: 100,
	 *     height: 50,
	 *     style: {
	 *         fill: '#ff0000',
	 *         stroke: '#000000',
	 *         lineWidth: 2
	 *     },
	 *     interactive: true
	 * }, 'jmRect');
	 */
	constructor(params, t) {
		params = params||{};
		super(params);
		// 设置控件类型标识
		this.property('type', t || new.target.name);
		// 初始化样式对象
		this.style = params && params.style ? params.style : {};
		// 设置尺寸
		this.width = params.width || 0;
		this.height = params.height  || 0;
		// 自定义命中区域（用于点击测试）
		this.hitArea = params.hitArea || null;

		// 设置位置
		if(params.position) {
			this.position = params.position;
		}

		// 关联画布
		this.graph = params.graph || null;
		// 层级顺序（用于排序）
		this.zIndex = params.zIndex || 0;
		// 是否响应交互事件
		this.interactive = typeof params.interactive == 'undefined'? false : params.interactive;

		// WebGL 模式下创建对应的渲染控制器
		if(this.mode === 'webgl') {
			this.webglControl = new WebglPath(this.graph, {
				style: this.style,
				control: this,
				isRegular: params.isRegular,
				needCut: params.needCut
			});
		}

		// 执行初始化
		this.initializing();
		
		// 别名：on 等同于 bind
		this.on = this.bind;
		
		// 保存原始参数
		this.option = params;
	}

	/**
	 * 控件类型标识
	 * 
	 * 用于类型检查和调试，由构造函数自动设置。
	 * 
	 * @type {string}
	 * @readonly
	 * 
	 * @example
	 * console.log(rect.type); // 'jmRect'
	 * if(control.type === 'jmCircle') { ... }
	 */
	get type() {
		return this.property('type');
	}

	/**
	 * 绘图上下文
	 * 
	 * 获取当前控件的 Canvas 2D 或 WebGL 渲染上下文。
	 * 如果控件本身不是 jmGraph，会返回所属 graph 的上下文。
	 * 
	 * @type {CanvasRenderingContext2D|WebGLRenderingContext}
	 * @readonly
	 * 
	 * @example
	 * // 获取上下文并绘制
	 * const ctx = control.context;
	 * ctx.fillStyle = 'red';
	 * ctx.fillRect(0, 0, 100, 100);
	 */
	get context() {
		let s = this.property('context');
		if(s) return s;
		else if(this.is('jmGraph') && this.canvas && this.canvas.getContext) {
			return this.context = this.canvas.getContext(this.mode || '2d');
		}
		const g = this.graph;
		if(g) return g.context;
		return g.canvas.getContext(this.mode || '2d');
	}
	set context(v) {
		return this.property('context', v);
	}

	/**
	 * 样式对象
	 * 
	 * 控件的视觉样式配置，包括：
	 * - fill: 填充颜色或渐变
	 * - stroke: 描边颜色
	 * - lineWidth: 线宽
	 * - shadow: 阴影配置
	 * - font: 字体（文本控件）
	 * - opacity: 透明度
	 * 
	 * 设置新样式会触发 needUpdate。
	 * 
	 * @type {Object}
	 * 
	 * @example
	 * // 设置样式
	 * control.style = {
	 *     fill: '#ff0000',
	 *     stroke: '#000000',
	 *     lineWidth: 2,
	 *     shadow: {
	 *         blur: 10,
	 *         x: 5,
	 *         y: 5,
	 *         color: 'rgba(0,0,0,0.5)'
	 *     }
	 * };
	 */
	get style() {
		let s = this.property('style');
		if(!s) s = this.property('style', {});
		return s;
	}
	set style(v) {
		this.needUpdate = true;
		return this.property('style', v);
	}

	/**
	 * 是否可见
	 * 
	 * 控制控件是否参与渲染和事件响应。
	 * 不可见的控件不会被绘制，也不会响应鼠标/触摸事件。
	 * 
	 * @type {boolean}
	 * @default true
	 * 
	 * @example
	 * // 隐藏控件
	 * control.visible = false;
	 * 
	 * // 显示控件
	 * control.visible = true;
	 */
	get visible() {
		let s = this.property('visible');
		if(typeof s == 'undefined') s = this.property('visible', true);
		return s;
	}
	set visible(v) {
		this.needUpdate = true;
		return this.property('visible', v);
	}

	/**
	 * 是否响应交互事件
	 * 
	 * 设置为 true 时，控件会响应鼠标和触摸事件。
	 * 设置为 false 时，事件会穿透到下层控件。
	 * 
	 * @type {boolean}
	 * @default false
	 * 
	 * @example
	 * // 启用交互
	 * control.interactive = true;
	 * control.bind('click', (evt) => {
	 *     console.log('clicked!');
	 * });
	 */
	get interactive() {
		const s = this.property('interactive');
		return s;
	}
	set interactive(v) {
		return this.property('interactive', v);
	}

	/**
	 * 自定义命中区域
	 * 
	 * 用于点击测试的自定义区域，格式为 {x, y, width, height}。
	 * 如果设置，点击测试会使用此区域而非实际图形边界。
	 * 
	 * @type {Object|null}
	 * 
	 * @example
	 * // 设置更大的点击区域
	 * control.hitArea = {
	 *     x: -10,
	 *     y: -10,
	 *     width: control.width + 20,
	 *     height: control.height + 20
	 * };
	 */
	get hitArea() {
		const s = this.property('hitArea');
		return s;
	}
	set hitArea(v) {
		return this.property('hitArea', v);
	}
		
	/**
	 * 子控件列表
	 * 
	 * 当前控件的所有子控件。子控件会按 zIndex 排序后绘制。
	 * 添加子控件时会自动建立父子关系。
	 * 
	 * @type {jmList}
	 * 
	 * @example
	 * // 添加子控件
	 * parent.children.add(child);
	 * 
	 * // 移除子控件
	 * parent.children.remove(child);
	 * 
	 * // 遍历子控件
	 * parent.children.each((i, child) => {
	 *     console.log(child);
	 * });
	 */
	get children() {
		let s = this.property('children');
		if(!s) s = this.property('children', new jmList());
		return s;
	}
	set children(v) {
		this.needUpdate = true;
		return this.property('children', v);
	}

	/**
	 * 控件宽度
	 * 
	 * 可以是具体数值或百分比字符串（如 '50%'）。
	 * 百分比会相对于父容器宽度计算。
	 * 
	 * @type {number|string}
	 * 
	 * @example
	 * // 设置固定宽度
	 * control.width = 100;
	 * 
	 * // 设置百分比宽度
	 * control.width = '50%';
	 */
	get width() {
		let s = this.property('width');
		if(typeof s == 'undefined') s = this.property('width', 0);
		return s;
	}
	set width(v) {
		this.needUpdate = true;
		return this.property('width', v);
	}

	/**
	 * 控件高度
	 * 
	 * 可以是具体数值或百分比字符串（如 '50%'）。
	 * 百分比会相对于父容器高度计算。
	 * 
	 * @type {number|string}
	 * 
	 * @example
	 * // 设置固定高度
	 * control.height = 100;
	 * 
	 * // 设置百分比高度
	 * control.height = '50%';
	 */
	get height() {
		let s = this.property('height');
		if(typeof s == 'undefined') s = this.property('height', 0);
		return s;
	}
	set height(v) {
		this.needUpdate = true;
		return this.property('height', v);
	}

	/**
	 * 层级顺序
	 * 
	 * 控制控件的绘制顺序，值越大越靠上。
	 * 设置 zIndex 会触发子控件重新排序。
	 * 
	 * @type {number}
	 * @default 0
	 * 
	 * @example
	 * // 将控件置于最上层
	 * control.zIndex = 100;
	 * 
	 * // 将控件置于最下层
	 * control.zIndex = -1;
	 */
	get zIndex() {
		let s = this.property('zIndex');
		if(!s) s = this.property('zIndex', 0);
		return s;
	}
	set zIndex(v) {
		this.property('zIndex', v);
		this.children.sort();
		this.needUpdate = true;
		return v;
	}

	/**
	 * 鼠标样式
	 * 
	 * 鼠标悬停在控件上时显示的光标样式。
	 * 常用值：'default', 'pointer', 'move', 'text', 'crosshair'
	 * 
	 * @type {string}
	 * 
	 * @example
	 * // 设置为手型指针
	 * control.cursor = 'pointer';
	 * 
	 * // 设置为移动样式
	 * control.cursor = 'move';
	 */
	set cursor(cur) {
		const graph = this.graph;
		if(graph) {
			graph.css('cursor',cur);
		}
	}
	get cursor() {
		const graph = this.graph;
		if(graph) {
			return graph.css('cursor');
		}
	}

	/**
	 * 初始化控件
	 * 
	 * 在构造函数末尾调用，用于设置子控件管理逻辑。
	 * 重写了 children 的 add、remove、sort、clear 方法，
	 * 实现自动的父子关系维护和脏标记传播。
	 * 
	 * @method initializing
	 * @protected
	 */
	initializing() {

		const self = this;
		this.children = this.children || new jmList();
		const oadd = this.children.add;
		
		/**
		 * 重写 add 方法，自动建立父子关系
		 * @param {jmControl} obj - 要添加的子控件
		 * @returns {jmControl} 添加的子控件
		 */
		this.children.add = function(obj) {
			if(typeof obj === 'object') {
				// 如果对象已有父级，先从原父级移除
				if(obj.parent && obj.parent != self && obj.parent.children) {
					obj.parent.children.remove(obj);
				}
				obj.parent = self;
				// 如果已存在，先移除再添加
				if(this.contain(obj)) {
					this.oremove(obj);
				}
				oadd.call(this, obj);
				obj.emit('add', obj);

				self.needUpdate = true;
				// 传播 graph 引用
				if(self.graph) obj.graph = self.graph;
				this.sort();
				return obj;
			}
		};
		this.children.oremove= this.children.remove;
		
		/**
		 * 重写 remove 方法，清理父子关系
		 * @param {jmControl} obj - 要移除的子控件
		 */
		this.children.remove = function(obj) {
			if(typeof obj === 'object') {
				obj.parent = null;
				obj.graph = null;
				obj.remove(true);
				this.oremove(obj);
				self.needUpdate = true;
			}
		};
		
		/**
		 * 按 zIndex 排序子控件
		 */
		this.children.sort = function() {
			const levelItems = {};
			this.each(function(i, obj) {
				if(!obj) return;
				let zindex = obj.zIndex;
				if(!zindex && obj.style && obj.style.zIndex) {
					zindex = Number(obj.style.zIndex);
					if(isNaN(zindex)) zindex=obj.style.zIndex||0;
				}
				let items = levelItems[zindex] || (levelItems[zindex] = []);
				items.push(obj);
			});

			this.splice(0, this.length);
			
			for(let index in levelItems) {
				oadd.call(this, levelItems[index]);
			}
		};
		
		/**
		 * 清空所有子控件
		 */
		this.children.clear = function() {
			this.each(function(i,obj) {
				this.remove(obj);
			},true);
		};
		this.needUpdate = true;
	} 

	/**
	 * 设置控件样式到绘图上下文
	 * 
	 * 将样式对象应用到 Canvas 上下文，支持：
	 * - 基础样式：fill, stroke, lineWidth, opacity 等
	 * - 阴影效果：shadow.blur, shadow.x, shadow.y, shadow.color
	 * - 渐变填充：支持线性渐变和径向渐变
	 * - 变换效果：rotation（旋转）、translate（平移）、transform（矩阵变换）
	 * - 高级效果：lineDash（虚线）、filter（滤镜）、clipPath（裁剪）、mask（遮罩）
	 * 
	 * @method setStyle
	 * @param {Object} [style] - 要应用的样式对象，默认使用 this.style
	 * 
	 * @example
	 * // 应用样式
	 * control.setStyle({
	 *     fill: '#ff0000',
	 *     stroke: '#000000',
	 *     lineWidth: 2,
	 *     shadow: {
	 *         blur: 10,
	 *         x: 5,
	 *         y: 5,
	 *         color: 'rgba(0,0,0,0.5)'
	 *     }
	 * });
	 * 
	 * // 使用渐变
	 * control.setStyle({
	 *     fill: 'linear-gradient(0,0,100,0,#ff0000,#0000ff)'
	 * });
	 */
	setStyle(style) {
		if(!style) {
			style = this.style;
		}
		if(!style) return;

		/**
		 * 内部样式设置函数
		 * @param {*} styleValue - 样式值
		 * @param {string} name - 样式名称
		 * @param {string} [mpkey] - 映射键名
		 * @private
		 */
		const __setStyle = (style, name, mpkey) => {
			if(style) {
				let styleValue = style;
				// 支持函数形式的样式值
				if(typeof styleValue === 'function') {
					try {
						styleValue = styleValue.call(this);
					}
					catch(e) {
						console.warn(e);
						return;
					}
				}
				let t = typeof styleValue;
				let mpname = jmStyleMap[mpkey || name];

				// 处理渐变
				if((styleValue instanceof jmGradient) || (t == 'string' && styleValue.indexOf('-gradient') > -1)) {
					if(t == 'string' && styleValue.indexOf('-gradient') > -1) {
						styleValue = new jmGradient(styleValue);
					}
					__setStyle(styleValue.toGradient(this), mpname||name);
				}
				// 处理标准样式映射
				else if(mpname) {
					if(this.webglControl) {
						this.webglControl.setStyle(mpname, styleValue);
					}
					else {
						if(t == 'string' && ['fillStyle', 'strokeStyle', 'shadowColor'].indexOf(mpname) > -1) {
							styleValue = jmUtils.toColor(styleValue);
						}
						this.context[mpname] = styleValue;
					}
				}
				// 处理特殊样式
				else {
					switch(name) {
						// 阴影样式
						case 'shadow' : {
							if(t == 'string') {
								__setStyle(new jmShadow(styleValue), name);
								break;
							}
							for(let k in styleValue) {
								__setStyle(styleValue[k], k, name + '.' + k);
							}
							break;
						}
						// 平移变换
						case 'translate' : {
							break;
						}
						// 旋转变换
						case 'rotation' : {
							if(typeof styleValue.angle === 'undefined' || isNaN(styleValue.angle)) break;
							styleValue = this.getRotation(styleValue);
							
							this.__translateAbsolutePosition = this.toAbsolutePoint({
								x: styleValue.x,
								y: styleValue.y
							});
							this.context.translate && this.context.translate(this.__translateAbsolutePosition.x, this.__translateAbsolutePosition.y);
							this.context.rotate && this.context.rotate(styleValue.angle);
							this.context.translate && this.context.translate(-this.__translateAbsolutePosition.x, -this.__translateAbsolutePosition.y);
							break;
						}
						// 矩阵变换
						case 'transform' : {
							if(!this.context.transform) break;
							if(Array.isArray(styleValue)) {
								this.context.transform.apply(this.context, styleValue);
							}
							else if(typeof styleValue == 'object') {
								this.context.transform(
									styleValue.scaleX || 1,
									styleValue.skewX || 0,
									styleValue.skewY || 0,
									styleValue.scaleY || 1,
									styleValue.offsetX || 0,
									styleValue.offsetY || 0
								);
							}
							break;
						}
						// 鼠标样式
						case 'cursor' : {
							this.cursor = styleValue;
							break;
						}
						// ===== 新增样式特性 =====

						/**
						 * 虚线样式
						 * 支持数组格式 [5, 3, 2] 或字符串格式 "5,3,2"
						 * @example
						 * style: { lineDash: [5, 3] } // 5px实线，3px空白
						 */
						case 'lineDash' : {
							if(!this.context.setLineDash) break;
							let dash;
							if(typeof styleValue === 'string') {
								dash = styleValue.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
							}
							else if(Array.isArray(styleValue)) {
								dash = styleValue.map(v => parseFloat(v)).filter(v => !isNaN(v));
							}
							if(dash && dash.length) {
								this.context.setLineDash(dash);
							}
							else {
								this.context.setLineDash([]);
							}
							break;
						}
						// 虚线偏移量
						case 'lineDashOffset' : {
							if(!this.context.setLineDash) break;
							this.context.lineDashOffset = Number(styleValue) || 0;
							break;
						}
						/**
						 * CSS滤镜效果
						 * 支持 blur, grayscale, sepia, brightness, contrast, saturate, hue-rotate, invert, opacity
						 * @example
						 * style: { filter: 'blur(5px) grayscale(50%)' }
						 * // 或使用对象
						 * style: { filter: { blur: 5, grayscale: 0.5 } }
						 */
						case 'filter' : {
							if(this.context.filter === undefined) break;
							if(styleValue instanceof jmFilter) {
								this.context.filter = styleValue.toCanvasFilter();
							}
							else if(typeof styleValue === 'string') {
								this.context.filter = styleValue || 'none';
							}
							else if(typeof styleValue === 'object') {
								this.context.filter = (new jmFilter(styleValue)).toCanvasFilter();
							}
							break;
						}
						/**
						 * 混合模式
						 * 常用值：source-over, multiply, screen, overlay, darken, lighten
						 * @example
						 * style: { globalCompositeOperation: 'multiply' }
						 */
						case 'globalCompositeOperation' : {
							if(!this.context.globalCompositeOperation) break;
							this.context.globalCompositeOperation = styleValue;
							break;
						}
						/**
						 * 裁剪路径
						 * 通过 canvas clip 实现裁剪效果
						 * @example
						 * style: { clipPath: clipShape } // clipShape 是一个图形控件
						 */
						case 'clipPath' : {
							if(!this.context.clip) break;
							// clipPath可以是一个图形控件实例
							if(styleValue && styleValue.points && styleValue.points.length > 0) {
								const bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
								this.context.beginPath();
								this.context.moveTo(styleValue.points[0].x + (bounds ? bounds.left : 0), styleValue.points[0].y + (bounds ? bounds.top : 0));
								for(let i = 1; i < styleValue.points.length; i++) {
									if(styleValue.points[i].m) {
										this.context.moveTo(styleValue.points[i].x + (bounds ? bounds.left : 0), styleValue.points[i].y + (bounds ? bounds.top : 0));
									}
									else {
										this.context.lineTo(styleValue.points[i].x + (bounds ? bounds.left : 0), styleValue.points[i].y + (bounds ? bounds.top : 0));
									}
								}
								if(styleValue.style && styleValue.style.close) {
									this.context.closePath();
								}
								this.context.clip();
							}
							break;
						}
						/**
						 * 遮罩效果
						 * 通过 globalCompositeOperation + destination-in 实现
						 * @example
						 * style: { mask: maskShape } // maskShape 是一个图形控件
						 */
						case 'mask' : {
							if(!this.context.globalCompositeOperation) break;
							// mask是一个图形控件实例，在绘制前需要先应用mask
							// 这里只是标记，实际绘制在paint流程中处理
							this.__mask = styleValue;
							break;
						}
						// 阴影相关样式（WebGL兼容）
						case 'shadowColor' : {
							if(this.webglControl) {
								this.webglControl.setStyle('shadowColor', styleValue);
							}
							else {
								this.context.shadowColor = jmUtils.toColor(styleValue);
							}
							break;
						}
						case 'shadowBlur' : {
							if(this.webglControl) {
								this.webglControl.setStyle('shadowBlur', styleValue);
							}
							else {
								this.context.shadowBlur = Number(styleValue) || 0;
							}
							break;
						}
						case 'shadowOffsetX' : {
							if(this.webglControl) {
								this.webglControl.setStyle('shadowOffsetX', styleValue);
							}
							else {
								this.context.shadowOffsetX = Number(styleValue) || 0;
							}
							break;
						}
						case 'shadowOffsetY' : {
							if(this.webglControl) {
								this.webglControl.setStyle('shadowOffsetY', styleValue);
							}
							else {
								this.context.shadowOffsetY = Number(styleValue) || 0;
							}
							break;
						}
					}
				}
			}
		};

		// 应用平移变换
		if(this.translate) {
			__setStyle(this.translate, 'translate');
		}
		// 应用矩阵变换
		if(this.transform) {
			__setStyle(this.transform, 'transform');
		}
		// 遍历应用所有样式
		for(let k in style) {
			if(k === 'constructor') continue;
			let t = typeof style[k];
			// 自动转换渐变字符串
			if(t == 'string' && style[k].indexOf('-gradient') > -1) {
				style[k] = new jmGradient(style[k]);
			}
			// 自动转换阴影字符串
			else if(t == 'string' && k == 'shadow') {
				style[k] = new jmShadow(style[k]);
			}
			// 自动转换滤镜字符串
			else if(t == 'string' && k == 'filter') {
				style[k] = new jmFilter(style[k]);
			}
			__setStyle(style[k], k);
		}
	}

	/**
	 * 获取当前控件的边界矩形
	 * 
	 * 通过分析控件的描点或位置加宽高得到边界矩形。
	 * 对于 jmGraph，边界为画布尺寸。
	 * 对于有 points 的控件，边界为所有点的最小包围矩形。
	 * 
	 * @method getBounds
	 * @param {boolean} [isReset=false] - 是否强制重新计算（忽略缓存）
	 * @returns {Object} 边界对象
	 * @returns {number} returns.left - 左边界 X 坐标
	 * @returns {number} returns.top - 上边界 Y 坐标
	 * @returns {number} returns.right - 右边界 X 坐标
	 * @returns {number} returns.bottom - 下边界 Y 坐标
	 * @returns {number} returns.width - 宽度
	 * @returns {number} returns.height - 高度
	 * 
	 * @example
	 * // 获取边界
	 * const bounds = control.getBounds();
	 * console.log(`宽: ${bounds.width}, 高: ${bounds.height}`);
	 * 
	 * // 强制重新计算
	 * const newBounds = control.getBounds(true);
	 */
	getBounds(isReset) {
		//如果当次计算过，则不重复计算
		if(this.bounds && !isReset) return this.bounds;

		const rect = {}; // left top
		//jmGraph，特殊处理
		if(this.type == 'jmGraph' && this.canvas) {
			if(typeof this.canvas.width === 'function') {
				rect.right = this.canvas.width(); 
			}
			else if(this.width) {
				rect.right = this.width;
			}
			
			if(typeof this.canvas.height === 'function') {
				rect.bottom = this.canvas.height(); 
			}
			else if(this.height) {
				rect.bottom = this.height;
			}
		}
		// 根据 points 计算边界
		else if(this.points && this.points.length > 0) {		
			for(const p of this.points) {
				if(typeof rect.left === 'undefined' || rect.left > p.x) {
					rect.left = p.x;
				}
				if(typeof rect.top === 'undefined'  || rect.top > p.y) {
					rect.top = p.y;
				}

				if(typeof rect.right === 'undefined'  || rect.right < p.x) {
					rect.right = p.x;
				}
				if(typeof rect.bottom === 'undefined' || rect.bottom < p.y) {
					rect.bottom = p.y;
				}
			}
		}
		// 根据位置和尺寸计算边界
		else if(this.getLocation) {
			let p = this.getLocation();
			if(p) {
				rect.left = p.left;
				rect.top = p.top;
				rect.right = p.left + p.width;
				rect.bottom = p.top + p.height;
			}		
		}
		if(rect.left === undefined) rect.left = 0; 
		if(rect.top === undefined) rect.top = 0; 
		if(rect.right === undefined) rect.right = 0; 
		if(rect.bottom === undefined) rect.bottom = 0; 
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;
		
		return this.bounds=rect;
	}

	/**
	 * 获取旋转后的边界矩形
	 * 
	 * 计算控件旋转后的最小包围矩形。
	 * 当控件有旋转变换时，实际占据的空间会发生变化。
	 * 
	 * @method getRotationBounds
	 * @param {Object} [rotation] - 旋转参数，默认使用 style.rotation
	 * @param {number} rotation.x - 旋转中心 X（相对于控件）
	 * @param {number} rotation.y - 旋转中心 Y（相对于控件）
	 * @param {number} rotation.angle - 旋转角度（弧度）
	 * @param {Object} [bounds] - 基础边界，默认使用 getBounds()
	 * @returns {Object} 旋转后的边界对象
	 * 
	 * @example
	 * // 获取旋转后的边界
	 * const bounds = control.getRotationBounds();
	 * console.log(`旋转后宽度: ${bounds.width}`);
	 */
	getRotationBounds(rotation=null) {
		rotation = rotation || this.getRotation();
		const bounds = this.getBounds();
		if(!rotation || !rotation.angle) return bounds;

		const rect = {
			width: 0,
			height: 0,
			oldBounds: bounds
		}; // left top
		let points = [];
		if(this.points && this.points.length > 0) {	
			points = jmUtils.clone(this.points, true); // 深度拷贝			
		}
		else if(this.getLocation) {
			const local = this.getLocation();
			if(local) {
				points.push({
					x: local.left,
					y: local.top
				},{
					x: local.left + local.width,
					y: local.top
				},{
					x: local.left + local.width,
					y: local.top + local.height
				},{
					x: local.left,
					y: local.top + local.height
				});
			}		
		}
		points = jmUtils.rotatePoints(points, {
			x: rotation.x + bounds.left,
			y: rotation.y + bounds.top
		}, rotation.angle);// 对现在点进行旋转

		for(const p of points) {
			if(typeof rect.left === 'undefined' || rect.left > p.x) {
				rect.left = p.x;
			}
			if(typeof rect.top === 'undefined'  || rect.top > p.y) {
				rect.top = p.y;
			}

			if(typeof rect.right === 'undefined'  || rect.right < p.x) {
				rect.right = p.x;
			}
			if(typeof rect.bottom === 'undefined' || rect.bottom < p.y) {
				rect.bottom = p.y;
			}
		}

		if(!rect.left) rect.left = 0; 
		if(!rect.top) rect.top = 0; 
		if(!rect.right) rect.right = 0; 
		if(!rect.bottom) rect.bottom = 0; 

		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;

		return rect;
	}

	/**
	 * 获取当前控件的位置参数
	 * 
	 * 解析百分比和 margin 参数，返回标准化的位置信息。
	 * 支持百分比定位（如 '50%'）和 margin 偏移。
	 * 
	 * @method getLocation
	 * @returns {Object} 位置参数对象
	 * @returns {number} returns.left - 左边距
	 * @returns {number} returns.top - 上边距
	 * @returns {number} returns.width - 宽度
	 * @returns {number} returns.height - 高度
	 * @returns {Object} [returns.position] - 位置对象 {x, y}
	 * @returns {Object} [returns.center] - 中心点
	 * @returns {Object} [returns.start] - 起点（线条类）
	 * @returns {Object} [returns.end] - 终点（线条类）
	 * @returns {number} [returns.radius] - 半径（圆形类）
	 * 
	 * @example
	 * const loc = control.getLocation();
	 * console.log(`位置: (${loc.left}, ${loc.top})`);
	 */
	getLocation() {
		//如果已经计算过则直接返回
		//在开画之前会清空此对象
		//if(reset !== true && this.location) return this.location;

		let local = this.location = {left: 0,top: 0,width: 0,height: 0};

		// 检查是否有百分比参数需要解析，没有则直接引用避免克隆开销
		const needResolve = this.parent && (jmUtils.checkPercent(this.width) || jmUtils.checkPercent(this.height) ||
			(this.position && jmUtils.checkPercent(this.position.x)) || (this.position && jmUtils.checkPercent(this.position.y)));
		local.position = typeof this.position == 'function'? this.position(): (needResolve? jmUtils.clone(this.position) : this.position);	
		local.center = this.center && typeof this.center === 'function'?this.center(): (needResolve? jmUtils.clone(this.center) : this.center);//中心
		local.start = this.start && typeof this.start === 'function'?this.start(): (needResolve? jmUtils.clone(this.start) : this.start);//起点
		local.end = this.end && typeof this.end === 'function'?this.end(): (needResolve? jmUtils.clone(this.end) : this.end);//起点
		local.radius = this.radius;//半径
		local.width = this.width;
		local.height = this.height;

		const margin = this.style.margin;
		const marginObj = needResolve && margin ? jmUtils.clone(margin, {}) : (margin || {});
		marginObj.left = (marginObj.left || 0);
		marginObj.top = (marginObj.top || 0);
		marginObj.right = (marginObj.right || 0);
		marginObj.bottom = (marginObj.bottom || 0);
		
		//如果没有指定位置，但指定了margin。则位置取margin偏移量
		if(local.position) {
			local.left = local.position.x;
			local.top = local.position.y;
		}
		else {
			local.left = marginObj.left;
			local.top = marginObj.top;
		}

		if(this.parent) {
			const parentBounds = this.parent.getBounds();	

			//处理百分比参数
			if(jmUtils.checkPercent(local.left)) {
				local.left = jmUtils.percentToNumber(local.left) * parentBounds.width;
			}
			if(jmUtils.checkPercent(local.top)) {
				local.top = jmUtils.percentToNumber(local.top) * parentBounds.height;
			}
			
			//如果没有指定宽度或高度，则按百分之百计算其父宽度或高度
			if(jmUtils.checkPercent(local.width)) {
				local.width = jmUtils.percentToNumber(local.width) * parentBounds.width;
			}
			if(jmUtils.checkPercent(local.height)) {
				local.height = jmUtils.percentToNumber(local.height) * parentBounds.height;
			}
			//处理中心点
			if(local.center) {
				//处理百分比参数
				if(jmUtils.checkPercent(local.center.x)) {
					local.center.x = jmUtils.percentToNumber(local.center.x) * parentBounds.width;
				}
				if(jmUtils.checkPercent(local.center.y)) {
					local.center.y = jmUtils.percentToNumber(local.center.y) * parentBounds.height;
				}
			}
			if(local.radius) {
				//处理百分比参数
				if(jmUtils.checkPercent(local.radius)) {
					local.radius = jmUtils.percentToNumber(local.radius) * Math.min(parentBounds.width, parentBounds.height);
				}
			}
		}
		return local;
	}

	/**
	 * 获取当前控件的旋转信息
	 * 
	 * 解析旋转参数，支持百分比形式的旋转中心。
	 * 如果控件本身没有旋转，会继承父级的旋转。
	 * 
	 * @method getRotation
	 * @param {Object} [rotation] - 旋转参数，默认使用 style.rotation
	 * @param {Object} [bounds] - 基础边界
	 * @returns {Object} 旋转信息
	 * @returns {number} returns.x - 旋转中心 X（相对于控件）
	 * @returns {number} returns.y - 旋转中心 Y（相对于控件）
	 * @returns {number} returns.angle - 旋转角度（弧度）
	 * @returns {Object} returns.bounds - 控件边界
	 * 
	 * @example
	 * // 获取旋转信息
	 * const rot = control.getRotation();
	 * if(rot.angle) {
	 *     console.log(`旋转角度: ${rot.angle} 弧度`);
	 * }
	 */
	getRotation(rotation, bounds = null) {
		rotation = rotation || jmUtils.clone(this.style.rotation);

		if(!rotation) {
			//如果本身没有，则可以继承父级的
			rotation = this.parent && this.parent.getRotation?this.parent.getRotation():null;
			//如果父级有旋转，则把坐标转换为当前控件区域
			if(rotation) {
				bounds = bounds || this.getBounds();
				rotation.x -= bounds.left;
				rotation.y -= bounds.top;
			}
		}
		else {
			bounds = bounds || this.getBounds();
			if(typeof rotation.x === 'undefined') rotation.x = '50%';
			if(typeof rotation.y === 'undefined') rotation.y = '50%';
			if(jmUtils.checkPercent(rotation.x)) {
				rotation.x  = jmUtils.percentToNumber(rotation.x) * bounds.width;
			}
			if(jmUtils.checkPercent(rotation.y)) {
				rotation.y  = jmUtils.percentToNumber(rotation.y) * bounds.height;
			}
		}
		return {
			...rotation,
			bounds
		};

	}

	/**
	 * 计算位移偏移量
	 * 
	 * 解析 translate 样式，支持百分比形式。
	 * 
	 * @method getTranslate
	 * @param {Object} [translate] - 平移参数，默认使用 style.translate
	 * @param {Object} [bounds] - 参考边界
	 * @returns {Object} 平移信息 {x, y}
	 * 
	 * @example
	 * const trans = control.getTranslate();
	 * console.log(`平移: (${trans.x}, ${trans.y})`);
	 */
	getTranslate(translate, bounds = null) {
		translate = translate || this.style.translate;
		if(!translate) return {x: 0, y: 0};
		const result = {
			x: translate.x || 0,
			y: translate.y || 0
		};
		
		if(jmUtils.checkPercent(result.x)) {
			if(!bounds && this.parent) bounds = this.parent.getBounds();
			result.x  = jmUtils.percentToNumber(result.x) * bounds.width;
		}
		if(jmUtils.checkPercent(result.y)) {
			if(!bounds && this.parent) bounds = this.parent.getBounds();
			result.y  = jmUtils.percentToNumber(result.y) * bounds.height;
		}
		return result;
	}

	/**
	 * 移除当前控件
	 * 
	 * 从父控件的子控件列表中移除当前控件。
	 * 移除后会触发 needUpdate 重绘。
	 * 
	 * @method remove
	 * 
	 * @example
	 * // 移除控件
	 * control.remove();
	 */
	remove() {	
		if(this.parent) {
			this.parent.children.remove(this);
		}
	}

	/**
	 * 对控件进行平移
	 * 
	 * 遍历控件所有描点或位置，设置其偏移量。
	 * 支持移动 position、center、start、end、points 等属性。
	 * 
	 * @method offset
	 * @param {number} x - X 轴偏移量
	 * @param {number} y - Y 轴偏移量
	 * @param {boolean} [trans=true] - 是否传递给监听者
	 * @param {Object} [evt] - 如果是事件触发，传递 move 事件参数
	 * 
	 * @example
	 * // 向右移动 10px，向下移动 5px
	 * control.offset(10, 5);
	 */
	offset(x, y, trans, evt) {
		trans = trans === false?false:true;	
		let local = this.getLocation(true);		
		let offseted = false;
		
		if(local.position) {
			local.left += x;
			local.top += y;
			// 由于local是clone出来的对象，为了保留位移，则要修改原属性
			this.position.x = local.left;
			this.position.y = local.top;
			offseted = true;
		}

		if(local.center) {		
			this.center.x = local.center.x + x;
			this.center.y = local.center.y + y;
			offseted = true;
		}

		if(local.start && typeof local.start == 'object') {	
			this.start.x = local.start.x + x;
			this.start.y = local.start.y + y;
			offseted = true;
		}

		if(local.end && typeof local.end == 'object') {		
			this.end.x = local.end.x + x;
			this.end.y = local.end.y + y;
			offseted = true;
		}


		if(offseted == false && this.cpoints) {
			let p = typeof this.cpoints == 'function'?this.cpoints:this.cpoints;
			if(p) {			
				let len = p.length;
				for(let i=0; i < len;i++) {
					p[i].x += x;
					p[i].y += y;
				}		
				offseted = true;
			}			
		}
		
		if(offseted == false && this.points) {
			let len = this.points.length;
			for(let i=0; i < len;i++) {
				this.points[i].x += x;
				this.points[i].y += y;
			}
			offseted = true;
		}
		
		//触发控件移动事件	
		this.emit('move',{
			offsetX: x,
			offsetY: y,
			trans: trans,
			evt: evt
		});

		this.needUpdate = true;
	}

	/**
	 * 获取控件相对于画布的绝对边界
	 * 
	 * 与 getBounds 不同的是：getBounds 获取的是相对于父容器的边界，
	 * 而 getAbsoluteBounds 获取的是相对于画布的边界。
	 * 
	 * @method getAbsoluteBounds
	 * @returns {Object} 绝对边界对象
	 * 
	 * @example
	 * const absBounds = control.getAbsoluteBounds();
	 * console.log(`画布上的位置: (${absBounds.left}, ${absBounds.top})`);
	 */
	getAbsoluteBounds() {
		//当前控件的边界，
		let rec = this.getBounds();
		if(this.parent && this.parent.absoluteBounds) {
			//父容器的绝对边界
			let prec = this.parent.absoluteBounds || this.parent.getAbsoluteBounds();
			
			return {
				left : prec.left + rec.left,
				top : prec.top + rec.top,
				right : prec.left + rec.right,
				bottom : prec.top + rec.bottom,
				width : rec.width,
				height : rec.height
			};
		}
		return rec;
	}

	/**
	 * 把当前控件内部坐标转为画布绝对坐标
	 * 
	 * @method toAbsolutePoint
	 * @param {Object} point - 内部坐标 {x, y}
	 * @returns {Object} 绝对坐标
	 * 
	 * @example
	 * const absPoint = control.toAbsolutePoint({x: 10, y: 10});
	 */
	toAbsolutePoint(point) {
		if(point.x || point.y) {
			const bounds = this.absoluteBounds?this.absoluteBounds:this.getAbsoluteBounds();
			
			point.x = (point.x||0) + bounds.left;
			point.y = (point.y||0) + bounds.top;	
		}
		return point;
	}

	/**
	 * 把画布绝对坐标转为当前控件坐标系内
	 * 
	 * @method toLocalPosition
	 * @param {Object} point - 绝对坐标
	 * @returns {Object|false} 相对坐标，如果无法转换返回 false
	 * 
	 * @example
	 * const localPoint = control.toLocalPosition({x: 100, y: 100});
	 */
	toLocalPosition(point) {
		
		const bounds = this.absoluteBounds?this.absoluteBounds:this.getAbsoluteBounds();
		if(!bounds) return false;	
		return { 
			x: point.x - bounds.left,
			y: point.y - bounds.top
		};
	}

	/**
	 * 画控件前初始化
	 * 
	 * 执行 beginPath 开始控件的绘制路径。
	 * 重置位置信息缓存，确保使用最新的位置数据。
	 * 
	 * @method beginDraw
	 * @protected
	 * 
	 * @example
	 * // 子类重写时需要调用父类方法
	 * class MyShape extends jmControl {
	 *     beginDraw() {
	 *         super.beginDraw();
	 *         // 自定义初始化逻辑
	 *     }
	 * }
	 */
	beginDraw() {	
		this.getLocation(true);//重置位置信息
		this.context.beginPath && this.context.beginPath();		
		if(this.webglControl && this.webglControl.beginDraw) this.webglControl.beginDraw();
	}

	/**
	 * 结束控件绘制
	 * 
	 * 根据样式执行 fill 或 stroke 操作。
	 * 如果设置了 close 样式，会先闭合路径。
	 * 
	 * @method endDraw
	 * @protected
	 * 
	 * @example
	 * // 绘制流程
	 * control.beginDraw();
	 * control.draw();
	 * control.endDraw();
	 */
	endDraw() {
		//如果当前为封闭路径
		if(this.style.close) {
			if(this.webglControl) this.webglControl.closePath();
			this.context.closePath && this.context.closePath();
		}

		// 根据渲染模式选择不同的绘制路径
		if(this.webglControl) {
			// WebGL 模式：使用 WebGL 绘制
			const fill = this.style['fill'] || this.style['fillStyle'];
			if(fill) {
				const bounds = this.getBounds();
				this.webglControl.fill(bounds);
			}
			if(this.style['stroke'] || (!fill && !this.is('jmGraph'))) {
				this.webglControl.stroke();
			}
			if(this.webglControl.endDraw) this.webglControl.endDraw();
		}
		else {
			// 2D 模式：使用 Canvas 2D API 绘制
			const fill = this.style['fill'] || this.style['fillStyle'];
			if(fill) {
				this.context.fill && this.context.fill();
			}
			if(this.style['stroke'] || (!fill && !this.is('jmGraph'))) {
				this.context.stroke && this.context.stroke();
			}
		}

		this.needUpdate = false;
	}

	/**
	 * 绘制控件路径
	 * 
	 * 在画布上绘制控件的路径点。
	 * 子类应该重写此方法实现自定义绘制逻辑。
	 * 
	 * @method draw
	 * @protected
	 * 
	 * @example
	 * // 子类重写绘制方法
	 * class MyShape extends jmControl {
	 *     draw() {
	 *         const ctx = this.context;
	 *         ctx.moveTo(0, 0);
	 *         ctx.lineTo(100, 100);
	 *         // ... 更多绘制逻辑
	 *     }
	 * }
	 */
	draw() {	
		if(this.points && this.points.length > 0) {
			//获取当前控件的绝对位置
			const bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
			if(this.webglControl) {
				this.webglControl.setParentBounds(bounds);
				this.webglControl.draw(this.points);
			}
			else if(this.context && this.context.moveTo) {
				this.context.moveTo(this.points[0].x + bounds.left,this.points[0].y + bounds.top);
				let len = this.points.length;			
				for(let i=1; i < len;i++) {
					let p = this.points[i];
					//移至当前坐标
					if(p.m) {
						this.context.moveTo(p.x + bounds.left,p.y + bounds.top);
					}
					else {
						this.context.lineTo(p.x+ bounds.left,p.y + bounds.top);
					}			
				}	
			}	
		}	
	}

	/**
	 * 绘制当前控件及其子控件
	 * 
	 * 协调控件的绘制流程：
	 * 1. 检查可见性
	 * 2. 初始化点数据
	 * 3. 计算边界
	 * 4. 应用样式
	 * 5. 绘制自身
	 * 6. 绘制子控件
	 * 7. 触发事件
	 * 
	 * @method paint
	 * @param {boolean} [v] - 是否可见，false 时跳过绘制
	 * 
	 * @example
	 * // 手动触发重绘
	 * control.paint();
	 */
	paint(v) {
		if(v !== false && this.visible !== false) {		
			if(this.initPoints) this.initPoints();
			//计算当前边界
			this.bounds = null;
			this.absoluteBounds = this.getAbsoluteBounds();
			let needDraw = true;//是否需要绘制
			if(!this.is('jmGraph') && this.graph) {
				if(this.absoluteBounds.left >= this.graph.width) needDraw = false;
				else if(this.absoluteBounds.top >= this.graph.height) needDraw = false;
				else if(this.absoluteBounds.right <= 0) needDraw = false;
				else if(this.absoluteBounds.bottom <= 0) needDraw = false;
			}
			
			this.context.save && this.context.save();

			this.emit('beginDraw', this);
			
			this.setStyle();//设定样式

			// 应用mask遮罩效果：在mask区域内绘制当前控件
			// 使用 destination-in 合成模式，只保留mask区域内的内容
			const maskStyle = this.style.mask || this.__mask;
			if(maskStyle && maskStyle.points && this.context.globalCompositeOperation) {
				// 先绘制当前控件
				if(needDraw && this.beginDraw) this.beginDraw();
				if(needDraw && this.draw) this.draw();	
				if(needDraw && this.endDraw) this.endDraw();

				// 再应用mask裁剪
				this.context.globalCompositeOperation = 'destination-in';
				if(maskStyle.initPoints) maskStyle.initPoints();
				const mBounds = maskStyle.parent && maskStyle.parent.absoluteBounds ? maskStyle.parent.absoluteBounds : this.absoluteBounds;
				this.context.beginPath();
				if(maskStyle.points && maskStyle.points.length > 0) {
					this.context.moveTo(maskStyle.points[0].x + (mBounds ? mBounds.left : 0), maskStyle.points[0].y + (mBounds ? mBounds.top : 0));
					for(let i = 1; i < maskStyle.points.length; i++) {
						if(maskStyle.points[i].m) {
							this.context.moveTo(maskStyle.points[i].x + (mBounds ? mBounds.left : 0), maskStyle.points[i].y + (mBounds ? mBounds.top : 0));
						}
						else {
							this.context.lineTo(maskStyle.points[i].x + (mBounds ? mBounds.left : 0), maskStyle.points[i].y + (mBounds ? mBounds.top : 0));
						}
					}
					if(maskStyle.style && maskStyle.style.close) {
						this.context.closePath();
					}
				}
				this.context.fillStyle = '#ffffff';
				this.context.fill();
				// 恢复合成模式
				this.context.globalCompositeOperation = 'source-over';
			}
			else {
				if(needDraw && this.beginDraw) this.beginDraw();
				if(needDraw && this.draw) this.draw();	
				if(needDraw && this.endDraw) this.endDraw();
			}

			if(this.children) {
				this.children.each(function(i,item) {
					if(item && item.paint) item.paint();
				});
			}

			this.emit('endDraw',this);	
			this.context.restore && this.context.restore();
			
			this.needUpdate = false;
		}
	}

	/**
	 * 获取指定事件的监听器集合
	 * 
	 * 返回绑定到指定事件名称的所有事件处理函数。
	 * 
	 * @method getEvent
	 * @param {string} name - 事件名称（如 'click', 'mousedown'）
	 * @returns {jmList|null} 事件处理函数集合，不存在则返回 null
	 * 
	 * @example
	 * const handlers = control.getEvent('click');
	 * if(handlers) {
	 *     console.log(`有 ${handlers.count()} 个点击事件处理器`);
	 * }
	 */
	getEvent(name) {		
		return this.__events?this.__events[name]:null;
	}

	/**
	 * 绑定控件事件
	 * 
	 * 为控件添加事件监听器。支持同时绑定多个事件（用空格分隔）。
	 * 同一个处理函数不会被重复添加。
	 * 
	 * @method bind
	 * @param {string} name - 事件名称，多个事件用空格分隔
	 * @param {Function} handle - 事件处理函数
	 * @returns {void}
	 * 
	 * @example
	 * // 绑定单个事件
	 * control.bind('click', (evt) => {
	 *     console.log('被点击了', evt);
	 * });
	 * 
	 * // 绑定多个事件
	 * control.bind('mousedown mouseup', (evt) => {
	 *     console.log('鼠标事件', evt);
	 * });
	 * 
	 * // 使用 on 别名
	 * control.on('mousemove', (evt) => {
	 *     console.log('鼠标移动', evt.position);
	 * });
	 */
	bind(name, handle) {	
		if(name && name.indexOf(' ') > -1) {
			name = name.split(' ');
			for(let n of name) {
				n && this.bind(n, handle);
			}
			return;
		}	
		/**
		 * 添加事件的集合
		 *
		 * @method _setEvent
		 * @private
		 */
		function _setEvent(name, events) {
			if(!this.__events) this.__events = {};
			return this.__events[name] = events;
		}
		let eventCollection = this.getEvent(name) || _setEvent.call(this, name, new jmList());
		if(!eventCollection.contain(handle)) {
			eventCollection.add(handle);
		}
	}

	/**
	 * 移除控件事件
	 * 
	 * 移除已绑定的事件处理函数。如果不指定处理函数，则移除该事件的所有处理函数。
	 * 
	 * @method unbind
	 * @param {string} name - 事件名称，多个事件用空格分隔
	 * @param {Function} [handle] - 要移除的事件处理函数，不指定则移除所有
	 * 
	 * @example
	 * // 移除特定处理函数
	 * control.unbind('click', myHandler);
	 * 
	 * // 移除所有点击事件
	 * control.unbind('click');
	 * 
	 * // 移除多个事件
	 * control.unbind('mousedown mouseup');
	 */
	unbind(name, handle) {	
		if(name && name.indexOf(' ') > -1) {
			name = name.split(' ');
			for(let n of name) {
				n && this.unbind(n, handle);
			}
			return;
		}	
		let eventCollection = this.getEvent(name) ;		
		if(eventCollection) {
			if(handle) eventCollection.remove(handle);
			else eventCollection.clear();
		}
	}


	/**
	 * 触发事件
	 * 
	 * 执行指定事件的所有监听器。
	 * 支持传递多个参数给事件处理函数。
	 * 
	 * @method emit
	 * @param {string} name - 事件名称
	 * @param {...*} args - 传递给事件处理函数的参数
	 * @returns {jmControl} 返回 this 以支持链式调用
	 * 
	 * @example
	 * // 触发自定义事件
	 * control.emit('customEvent', { data: 'value' });
	 * 
	 * // 触发带多个参数的事件
	 * control.emit('dataChange', oldValue, newValue);
	 */
	emit(...args) {			
		// 避免每帧 args.slice(1) 分配临时数组
		// runEventHandle 内部会把非数组参数包装成数组
		if(args.length > 2) {
			this.runEventHandle(args[0], args.slice(1));
		} else if(args.length === 2) {
			this.runEventHandle(args[0], [args[1]]);
		} else {
			this.runEventHandle(args[0], []);
		}
		return this;
	}

	/**
	 * 执行事件处理函数
	 * 
	 * 内部方法，用于执行指定事件的所有监听器。
	 * 如果任一处理函数返回 false，会设置 args.cancel = true。
	 * 
	 * @method runEventHandle
	 * @param {string} name - 事件名称
	 * @param {Array|Object} args - 事件参数
	 * @returns {boolean} 是否被取消
	 * @protected
	 */
	runEventHandle(name, args) {
		let events = this.getEvent(name);		
		if(events) {
		
			var self = this;
			if(!Array.isArray(args)) args = [args];	
			events.each(function(i, handle) {
				//只要有一个事件被阻止，则不再处理同级事件，并设置冒泡被阻断
				if(false === handle.apply(self, args)) {
					args.cancel = true;
				}
			});		
		}	
		return args.cancel;
	}

	/**
	 * 检查坐标是否落在当前控件区域中
	 * 
	 * 用于点击测试和碰撞检测。
	 * 支持旋转后的碰撞检测，以及自定义命中区域。
	 * 
	 * @method checkPoint
	 * @param {Object} p - 要检测的点坐标
	 * @param {number} p.x - X 坐标
	 * @param {number} p.y - Y 坐标
	 * @param {number} [pad] - 容差范围，默认使用 lineWidth 或 1
	 * @returns {boolean} 点是否在控件区域内
	 * 
	 * @example
	 * // 检查点击位置
	 * graph.bind('click', (evt) => {
	 *     if(control.checkPoint(evt.position)) {
	 *         console.log('点击了控件');
	 *     }
	 * });
	 */
	checkPoint(p, pad) {
		//jmGraph 需要判断dom位置
		if(this.type == 'jmGraph') {
			//获取dom位置
			const position = this.getPosition();
			if(p.pageX > position.right || p.pageX < position.left) {
				return false;
			}
			if(p.pageY > position.bottom || p.pageY < position.top) {
				return false;
			}	
			return true;
		}
		
		const bounds = this.getBounds();	
		// 如果指定了合中区域，则以命中区域为准
		if(this.hitArea) {
			const hitArea = {
				left: this.hitArea.x + bounds.left,
				top: this.hitArea.y + bounds.top,
				right: this.hitArea.width + bounds.left,
				bottom: this.hitArea.height + bounds.top,
			};
			if(p.x > hitArea.right || p.x < hitArea.left) {
				return false;
			}
			if(p.y > hitArea.bottom || p.y < hitArea.top) {
				return false;
			}
			return true;
		}
		
		let ps = this.points;
		//如果不是路径组成，则采用边界做为顶点
		if(!ps || !ps.length) {
			ps = [];
			ps.push({x: bounds.left, y: bounds.top}); //左上角
			ps.push({x: bounds.right, y: bounds.top});//右上角
			ps.push({x: bounds.right, y: bounds.bottom});//右下角
			ps.push({x: bounds.left, y: bounds.bottom}); //左下
			ps.push({x: bounds.left, y: bounds.top}); //左上角   //闭合
		}
		//如果有指定padding 表示接受区域加宽，命中更易
		pad = Number(pad || this.style['touchPadding'] || this.style['lineWidth'] || 1);
		if(ps && ps.length) {
			const rotation = this.getRotation(null, bounds);//获取当前旋转参数
			//如果有旋转参数，则需要转换坐标再处理
			if(rotation && rotation.angle) {
				ps = jmUtils.clone(ps, true);//拷贝一份数据
				//rotateX ,rotateY 是相对当前控件的位置
				ps = jmUtils.rotatePoints(ps, {
					x: rotation.x + bounds.left,
					y: rotation.y + bounds.top
				}, rotation.angle || 0);
			}
			//如果当前路径不是实心的
			//就只用判断点是否在边上即可	
			if(ps.length > 2 && (!this.style['fill'] || this.style['stroke'])) {
				let i = 0;
				const count = ps.length;
				for(let j = i+1; j <= count; j = (++i + 1)) {
					//如果j超出最后一个
					//则当为封闭图形时跟第一点连线处理.否则直接返回false
					if(j == count) {
						if(this.style.close) {
							const r = jmUtils.pointInPolygon(p,[ps[i],ps[0]], pad);
							if(r) return true;
						}
					} 
					else {
						//判断是否在点i,j连成的线上
						const s = jmUtils.pointInPolygon(p,[ps[i],ps[j]], pad);
						if(s) return true;
					}			
				}
				//不是封闭的图形，则直接返回
				if(!this.style['fill']) return false;
			}

			const r = jmUtils.pointInPolygon(p,ps, pad);		
			return r;
		}

		if(p.x > bounds.right || p.x < bounds.left) {
			return false;
		}
		if(p.y > bounds.bottom || p.y < bounds.top) {
			return false;
		}
		
		return true;
	}


	/**
	 * 触发控件事件并执行事件冒泡
	 * 
	 * 组合事件参数，按控件层级关系执行事件冒泡。
	 * 事件从最上层的子控件开始触发，向上冒泡到父控件。
	 * 
	 * @method raiseEvent
	 * @param {string} name - 事件名称
	 * @param {Object} args - 原生事件对象
	 * @returns {boolean} 如果事件被阻止冒泡则返回 false，否则返回 true
	 * 
	 * @example
	 * // 通常由框架内部调用，用户一般不需要直接调用
	 * // 框架会自动处理鼠标/触摸事件
	 */
	raiseEvent(name, args) {
		if(this.visible === false) return ;//如果不显示则不响应事件	
		
		if(!args.position) {		
			const graph = this.graph;
			args.isWXMiniApp = graph.isWXMiniApp;

			const srcElement = args.srcElement || args.target;			
			
			const position = jmUtils.getEventPosition(args);//初始化事件位置
		
			args = {
				position: position,
				button: args.button == 0 || position.isTouch? 1: args.button,
				keyCode: args.keyCode || args.charCode || args.which,
				ctrlKey: args.ctrlKey,
				cancel : false,
				event: args, // 原生事件
				srcElement : srcElement,
				isWXMiniApp: graph.isWXMiniApp,
			};		
		}
		args.path = args.path||[]; //事件冒泡路径

		//先执行子元素事件，如果事件没有被阻断，则向上冒泡
		let stoped = false;
		if(this.children) {
			this.children.each(function(j, el) {
				//未被阻止才执行			
				if(args.cancel !== true) {
					//如果被阻止冒泡，
					stoped = el.raiseEvent(name, args) === false? true: stoped;
					// 不再响应其它元素
					if(stoped) return false;
				}
			}, true);//按逆序处理
		}
		// 如果已被阻止，不再响应上级事件
		if(stoped) return false;
		
		//获取当前对象的父元素绝对位置
		//生成当前坐标对应的父级元素的相对位置
		let abounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds : this.absoluteBounds;
		if(!abounds) return false;	
		//args = jmUtils.clone(args);//参数副本
		args.position.x = args.position.offsetX - abounds.left;
		args.position.y = args.position.offsetY - abounds.top;

		// 是否在当前控件内操作
		const inpos = this.interactive !== false && this.checkPoint(args.position);

		if(name === 'mousemove' && this.type == 'jmGraph' && !inpos) {
			console.log('mousemove out', args.position, abounds);
		}
		
		//事件发生在边界内或健盘事件发生在画布中才触发
		if(inpos) {
			//如果没有指定触发对象，则认为当前为第一触发对象
			if(!args.target) {
				args.target = this;
			}
			
			this.runEventAndPopEvent(name, args);

			if(!this.focused && (name === 'mousemove' || name === 'touchmove')) {
				this.focused = true;//表明当前焦点在此控件中
				this.raiseEvent(name === 'mousemove'? 'mouseover': 'touchover', args);
			}	
		}
		else {
			//如果焦点不在，且原焦点在，则触发mouseleave事件
			if(this.interactive !== false && !inpos &&
				this.focused && 
				(name === 'mousemove' || name === 'touchmove')) {

				this.focused = false;//表明当前焦点离开
				this.runEventHandle(name === 'mousemove'? 'mouseleave' : 'touchleave', args);//执行事件	
			}	
		}
			
		return args.cancel === false;//如果被阻止则返回false,否则返回true
	}

	/**
	 * 执行事件并进行冒泡
	 * 
	 * 内部方法，用于执行事件处理并添加到事件路径。
	 * 
	 * @method runEventAndPopEvent
	 * @param {string} name - 事件名称
	 * @param {Object} args - 事件参数
	 * @protected
	 */
	runEventAndPopEvent(name, args) {	

		if(args.cancel !== true) {
			// 添加到触发路径
			args.path.push(this);

			//如果返回true则阻断冒泡
			this.runEventHandle(name, args);//执行事件

			// // 向父节点冒泡事件		
			// if(args.cancel !== true && this.parent && this.parent.runEventAndPopEvent) {
			// 	// 相对位置需要改为父节点的
			// 	if(args.position) {
			// 		let bounds = this.parent.getBounds();
			// 		args.position.x += bounds.left;
			// 		args.position.y += bounds.top;
			// 	}
			// 	this.parent.runEventAndPopEvent(name, args);
			// }		
		}
	}

	/**
	 * 清空控件指定事件
	 * 
	 * 移除指定事件名称下的所有事件处理函数。
	 * 
	 * @method clearEvents
	 * @param {string} name - 需要清除的事件名称
	 * 
	 * @example
	 * // 清除所有点击事件
	 * control.clearEvents('click');
	 */
	clearEvents(name) {
		var eventCollection = this.getEvent(name);		
		if(eventCollection) {
			eventCollection.clear();
		}
	}

	/**
	 * 查找指定类型的父级控件
	 * 
	 * 沿着父级链向上查找，直到找到指定类型的控件或到达最顶级。
	 * 
	 * @method findParent
	 * @param {string|Function} type - 类型名称（字符串）或类构造函数
	 * @returns {jmControl|null} 找到的父级控件实例，未找到返回 null
	 * 
	 * @example
	 * // 查找 jmGraph 实例
	 * const graph = control.findParent('jmGraph');
	 * 
	 * // 查找特定类的实例
	 * const parent = control.findParent(MyCustomControl);
	 */
	findParent(type) {
		//如果为类型名称，则返回名称相同的类型对象
		if(typeof type === 'string') {
			if(this.type == type)
				return this;
		}
		else if(this.is(type)) {
			return this;
		}
		if(this.parent) {
			return this.parent.findParent(type);
		}
		return null;
	}

	/**
	 * 设置控件是否可拖动
	 * 
	 * 启用或禁用控件的拖动功能。
	 * 拖动时会触发 movestart、move、moveend 事件。
	 * 
	 * @method canMove
	 * @param {boolean} m - true 启用拖动，false 禁用拖动
	 * @param {jmGraph} [graph] - 画布实例，如果控件已添加到画布可省略
	 * @returns {jmControl} 返回 this 以支持链式调用
	 * 
	 * @example
	 * // 启用拖动
	 * control.canMove(true);
	 * 
	 * // 禁用拖动
	 * control.canMove(false);
	 * 
	 * // 监听拖动事件
	 * control.on('movestart', (evt) => console.log('开始拖动'));
	 * control.on('moveend', (evt) => console.log('结束拖动'));
	 */
	canMove(m, graph) {
		if(!this.__mvMonitor) {
			/**
			 * 控制控件移动对象
			 * 
			 * @property __mvMonitor
			 * @private
			 */
			this.__mvMonitor = {};
			this.__mvMonitor.mouseDown = false;
			this.__mvMonitor.curposition={x:0,y:0};
			var self = this;
			/**
			 * 控件移动鼠标事件
			 *
			 * @method mv
			 * @private
			 */
			this.__mvMonitor.mv = function(evt) {
				let _this = self;
				//如果鼠标经过当前可移动控件，则显示可移动指针
				//if(evt.path && evt.path.indexOf(_this)>-1) {
				//	_this.cursor('move');	
				//}
				if(_this.__mvMonitor.mouseDown) {
					_this.parent.bounds = null;
					//let parentbounds = _this.parent.getAbsoluteBounds();		
					let offsetx = evt.position.offsetX - _this.__mvMonitor.curposition.x;
					let offsety = evt.position.offsetY - _this.__mvMonitor.curposition.y;				
					//console.log(offsetx + ',' + offsety);
					//如果锁定边界
					if(_this.option.lockSide) {
						let thisbounds = _this.bounds || _this.getAbsoluteBounds();					
						//检查边界出界
						let outside = jmUtils.checkOutSide(_this.option.lockSide, thisbounds, { x: offsetx, y: offsety });
						if(outside.left < 0 && offsetx < 0) {
							//offsetx -= outside.left;
							offsetx = 0;
						}
						else if(outside.right > 0 && offsetx > 0) {
							//offsetx -= outside.right;
							offsetx = 0;
						}
						if(outside.top < 0 && offsety < 0) {
							//offsety -= outside.top;
							offsety = 0;
						}
						else if(outside.bottom > 0 && offsety > 0) {
							//offsety -= outside.bottom;
							offsety = 0;
						}
					}
					
					if(offsetx || offsety) {
						_this.offset(offsetx, offsety, true, evt);
						if(offsetx) _this.__mvMonitor.curposition.x = evt.position.offsetX;
						if(offsety) _this.__mvMonitor.curposition.y = evt.position.offsetY;	
						//console.log('mouse move',offsetx + '.' + offsety);
					}
					return false;
				}
			};
			/**
			 * 控件移动鼠标松开事件
			 *
			 * @method mu
			 * @private
			 */
			this.__mvMonitor.mu = function(evt) {
				let _this = self;
				if(_this.__mvMonitor.mouseDown) {
					_this.__mvMonitor.mouseDown = false;
					//_this.cursor('default');
					_this.emit('moveend',{position:_this.__mvMonitor.curposition});	
					//return false;
				}			
			};
			/**
			 * 控件移动鼠标离开事件
			 *
			 * @method ml
			 * @private
			 */
			this.__mvMonitor.ml = function() {
				let _this = self;
				if(_this.__mvMonitor.mouseDown) {
					_this.__mvMonitor.mouseDown = false;
					//_this.cursor('default');	
					_this.emit('moveend',{position:_this.__mvMonitor.curposition});
					return false;
				}	
			};
			/**
			 * 控件移动鼠标按下事件
			 *
			 * @method md
			 * @private
			 */
			this.__mvMonitor.md = function(evt) {
				
				if(this.__mvMonitor.mouseDown) return;
				if(evt.button == 0 || evt.button == 1) {
					this.__mvMonitor.mouseDown = true;
					//this.cursor('move');
					//var parentbounds = this.parent.absoluteBounds || this.parent.getAbsoluteBounds();	
					this.__mvMonitor.curposition.x = evt.position.offsetX;//evt.position.x + parentbounds.left;
					this.__mvMonitor.curposition.y = evt.position.offsetY;//evt.position.y + parentbounds.top;
					//触发控件移动事件
					this.emit('movestart',{position:this.__mvMonitor.curposition});
					
					evt.cancel = true;
					return false;
				}			
			};
		}
		graph = graph || this.graph ;//获取最顶级元素画布
		
		if(m !== false) {			
			graph.bind('mousemove',this.__mvMonitor.mv);
			graph.bind('mouseup',this.__mvMonitor.mu);
			graph.bind('mouseleave',this.__mvMonitor.ml);
			this.bind('mousedown',this.__mvMonitor.md);
			graph.bind('touchmove',this.__mvMonitor.mv);
			graph.bind('touchend',this.__mvMonitor.mu);
			this.bind('touchstart',this.__mvMonitor.md);
		}
		else {			
			graph.unbind('mousemove',this.__mvMonitor.mv);
			graph.unbind('mouseup',this.__mvMonitor.mu);
			graph.unbind('mouseleave',this.__mvMonitor.ml);
			this.unbind('mousedown',this.__mvMonitor.md);
			graph.unbind('touchmove',this.__mvMonitor.mv);
			graph.unbind('touchend',this.__mvMonitor.mu);
			this.unbind('touchstart',this.__mvMonitor.md);	
		}

		this.interactive = true;// 如果可以移动，则响应事件
		return this;
	}
}

/**
 * @fileoverview jmPath 路径基类
 * 
 * jmPath 是大部分图形的基类，提供了基于点序列的路径绘制能力。
 * 所有需要通过点序列定义形状的图形（如多边形、线条、贝塞尔曲线等）
 * 都可以继承此类。
 * 
 * 主要功能：
 * - 点序列管理（points 属性）
 * - SVG 导出支持（toSVG 方法）
 * - 路径闭合控制
 * 
 * @module jmPath
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 基础路径类
 * 
 * 大部分图形的基类，通过指定一系列点来画出图形。
 * 支持开放路径和闭合路径，支持 SVG 导出。
 * 
 * @class jmPath
 * @extends jmControl
 * 
 * @param {Object} params 路径参数
 * @param {Array<Object>} [params.points] 点序列，每个点格式：{x:0, y:0, m:false}
 * @param {string} [t='jmPath'] 类型标识
 * 
 * @example
 * // 创建自定义路径
 * const path = new jmPath({
 *     points: [
 *         {x: 0, y: 0},
 *         {x: 100, y: 0},
 *         {x: 100, y: 100},
 *         {x: 0, y: 100}
 *     ],
 *     style: {
 *         fill: '#ff0000',
 *         stroke: '#000000',
 *         close: true  // 闭合路径
 *     }
 * });
 */
class jmPath extends jmControl {	

	constructor(params, t='jmPath') {
		super(params, t);		
		this.points = params && params.points ? params.points : [];	
	}
	
	/**
	 * 描点集合
	 * point格式：{x:0,y:0,m:true}
	 * @property points
	 * @type {array}
	 */
	get points() {
		let s = this.property('points');
		return s;
	}
	set points(v) {
		this.needUpdate = true;
		return this.property('points', v);
	}

	/**
	 * 转换为SVG路径
	 * 
	 * @method toSVG
	 * @return {string} SVG路径字符串
	 */
	toSVG() {
		if(!this.points || this.points.length === 0) return '';
		
		let pathData = '';
		const points = this.points;
		
		// 移动到起点
		pathData += `M ${points[0].x} ${points[0].y}`;
		
		// 绘制路径
		for(let i = 1; i < points.length; i++) {
			const p = points[i];
			if(p.m) {
				// 移动到新位置
				pathData += ` M ${p.x} ${p.y}`;
			} else {
				// 直线到
				pathData += ` L ${p.x} ${p.y}`;
			}
		}
		
		// 如果是封闭路径
		if(this.style && this.style.close) {
			pathData += ' Z';
		}
		
		// 构建SVG元素
		let svg = '<path d="' + pathData + '"';
		
		// 添加样式
		if(this.style) {
			if(this.style.fill) {
				svg += ' fill="' + this.style.fill + '"';
			}
			if(this.style.stroke) {
				svg += ' stroke="' + this.style.stroke + '"';
			}
			if(this.style.lineWidth) {
				svg += ' stroke-width="' + this.style.lineWidth + '"';
			}
			if(this.style.opacity) {
				svg += ' opacity="' + this.style.opacity + '"';
			}
		}
		
		svg += '/>';
		return svg;
	}	
	
}

/**
 * @fileoverview jmArc 圆弧类
 * 
 * jmArc 提供了圆弧图形的绘制功能。
 * 可以绘制完整的圆、部分圆弧或扇形。
 * 
 * 主要功能：
 * - 圆弧绘制
 * - 扇形绘制（isFan=true）
 * - 顺时针/逆时针绘制
 * - 支持 WebGL 和 Canvas 2D 模式
 * 
 * @module jmArc
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 圆弧类
 * 
 * 绘制圆弧或扇形图形，继承自 jmPath。
 * 支持设置圆心、半径、起始角度和结束角度。
 *
 * @class jmArc
 * @extends jmPath
 * @param {object} params 圆弧参数
 * @param {object} [params.center] 圆弧中心点 {x, y}
 * @param {number} [params.radius] 圆弧半径
 * @param {number} [params.start=0] 圆弧起始角度（弧度）
 * @param {number} [params.end=Math.PI*2] 圆弧结束角度（弧度）
 * @param {boolean} [params.anticlockwise=false] 绘制方向：false=顺时针，true=逆时针
 * @param {boolean} [params.isFan=false] 是否绘制为扇形
 * 
 * @example
 * // 创建圆弧
 * const arc = graph.createShape('arc', {
 *     center: {x: 200, y: 200},
 *     radius: 50,
 *     start: 0,
 *     end: Math.PI,
 *     style: { stroke: '#000' }
 * });
 * 
 * // 创建扇形
 * const fan = graph.createShape('arc', {
 *     center: {x: 200, y: 200},
 *     radius: 50,
 *     start: 0,
 *     end: Math.PI / 2,
 *     isFan: true,
 *     style: { fill: '#ff0000' }
 * });
 */
class jmArc extends jmPath {

	constructor(params, t='jmArc') {
		if(!params) params = {};
		params.isRegular = params.isRegular === false? false: true;// 规则的
		params.needCut = params.needCut === true? true: false;// 规则的
		
		super(params, t);

		this.center = params.center || {x:0,y:0};
		this.radius = params.radius || 0;

		this.startAngle = params.start || params.startAngle || 0;
		this.endAngle = params.end || params.endAngle || Math.PI * 2;		

		this.anticlockwise = params.anticlockwise  || 0;

		this.isFan = !!params.isFan;
	}	

	/**
	 * 中心点
	 * point格式：{x:0,y:0,m:true}
	 * @property center
	 * @type {point}
	 */
	get center() {
		return this.property('center');
	}
	set center(v) {
		this.needUpdate = true;
		return this.property('center', v);
	}

	/**
	 * 半径
	 * @property radius
	 * @type {number}
	 */
	get radius() {
		return this.property('radius');
	}
	set radius(v) {
		this.needUpdate = true;
		return this.property('radius', v);
	}

	/**
	 * 扇形起始角度
	 * @property startAngle
	 * @type {number}
	 */
	get startAngle() {
		return this.property('startAngle');
	}
	set startAngle(v) {
		this.needUpdate = true;
		return this.property('startAngle', v);
	}

	/**
	 * 扇形结束角度
	 * @property endAngle
	 * @type {number}
	 */
	get endAngle() {
		return this.property('endAngle');
	}
	set endAngle(v) {
		this.needUpdate = true;
		return this.property('endAngle', v);
	}

	/**
	 * 可选。规定应该逆时针还是顺时针绘图
	 * false  顺时针，true 逆时针
	 * @property anticlockwise
	 * @type {boolean}
	 */
	get anticlockwise() {
		return this.property('anticlockwise');
	}
	set anticlockwise(v) {
		this.needUpdate = true;
		return this.property('anticlockwise', v);
	}


	/**
	 * 初始化图形点
	 * 
	 * @method initPoint
	 * @private
	 * @for jmArc
	 */
	initPoints() {
		let location = this.getLocation();//获取位置参数
		let mw = 0;
		let mh = 0;
		let cx = location.center.x ;
		let cy = location.center.y ;
		//如果设定了半径。则以半径为主	
		if(location.radius) {
			mw = mh = location.radius;
		}
		else {
			mw = location.width / 2;
			mh = location.height / 2;
		}	
		
		let start = this.startAngle;
		let end = this.endAngle;

		if((mw == 0 && mh == 0) || start == end) return;

		let anticlockwise = this.anticlockwise;
		let step = 1 / Math.max(mw, mh);

		//如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end
		if(anticlockwise) {
			let p2 =  Math.PI * 2;
			start = p2 - start;
			end = p2 - end;
		}
		if(start > end) step = -step;

		// 预计算需要的点数量
		let pointCount = Math.ceil(Math.abs(end - start) / Math.abs(step)) + 1;
		if(this.isFan) pointCount++;

		// 复用已有数组，避免每帧分配；大小变化时才重建
		if(!this.points || this.points.length !== pointCount) {
			this.points = new Array(pointCount);
			for(let i = 0; i < pointCount; i++) {
				this.points[i] = { x: 0, y: 0 };
			}
		}

		let idx = 0;
		if(this.isFan) {
			this.points[idx].x = location.center.x;
			this.points[idx].y = location.center.y;
			idx++;
		}
		
		//椭圆方程x=a*cos(r) ,y=b*sin(r)	
		for(let r=start;;r += step) {	
			if(step > 0 && r > end) r = end;
			else if(step < 0 && r < end) r = end;

			this.points[idx].x = Math.cos(r) * mw + cx;
			this.points[idx].y = Math.sin(r) * mh + cy;
			idx++;

			if(r == end) break;
		}
		return this.points;
	}
}

/**
 * @fileoverview jmArrow 箭头类
 * 
 * jmArrow 提供了箭头图形的绘制功能。
 * 可以单独使用，也可以与直线组合使用。
 * 
 * 主要功能：
 * - 箭头绘制
 * - 支持空心和实心箭头
 * - 自定义箭头大小和角度
 * 
 * @module jmArrow
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 箭头类
 * 
 * 绘制箭头图形，支持空心和实心两种样式。
 * 箭头方向由起点和终点决定。
 *
 * @class jmArrow
 * @extends jmPath
 * @param {object} params 箭头参数
 * @param {object} [params.start] 箭头起始点 {x, y}
 * @param {object} [params.end] 箭头终点（箭头尖端）{x, y}
 * @param {number} [params.angle] 箭头角度（弧度），不指定则自动计算
 * @param {number} [params.offsetX=5] 箭头X方向偏移量
 * @param {number} [params.offsetY=8] 箭头Y方向偏移量
 * 
 * @example
 * // 创建箭头
 * const arrow = graph.createShape('arrow', {
 *     start: {x: 100, y: 100},
 *     end: {x: 200, y: 100},
 *     style: { fill: '#ff0000', stroke: '#000' }
 * });
 */
class jmArrow extends jmPath {	

	constructor(params, t='jmArrow') {
		super(params, t);
		this.style.lineJoin = 'miter';
		this.style.lineCap = 'square';

		this.angle = params.angle  || 0;
		this.start = params.start  || {x:0,y:0};
		this.end = params.end  ||  {x:0,y:0};
		this.offsetX = params.offsetX || 5;
		this.offsetY = params.offsetY || 8;
	}

	/**
	 * 控制起始点
	 *
	 * @property start
	 * @for jmArrow
	 * @type {point}
	 */
	get start() {
		return this.property('start');
	}
	set start(v) {
		this.needUpdate = true;
		return this.property('start', v);
	}

	/**
	 * 控制结束点
	 *
	 * @property end
	 * @for jmArrow
	 * @type {point} 结束点
	 */
	get end() {
		return this.property('end');
	}
	set end(v) {
		this.needUpdate = true;
		return this.property('end', v);
	}

	/**
	 * 箭头角度
	 *
	 * @property angle
	 * @for jmArrow
	 * @type {number} 箭头角度
	 */
	get angle() {
		return this.property('angle');
	}
	set angle(v) {
		this.needUpdate = true;
		return this.property('angle', v);
	}

	/**
	 * 箭头X偏移量
	 *
	 * @property offsetX
	 * @for jmArrow
	 * @type {number}
	 */
	get offsetX() {
		return this.property('offsetX');
	}
	set offsetX(v) {
		this.needUpdate = true;
		return this.property('offsetX', v);
	}

	/**
	 * 箭头Y偏移量
	 *
	 * @property offsetY
	 * @for jmArrow
	 * @type {number}
	 */
	get offsetY() {
		return this.property('offsetY');
	}
	set offsetY(v) {
		this.needUpdate = true;
		return this.property('offsetY', v);
	}

	/**
	 * 初始化图形点
	 * 
	 * @method initPoint
	 * @private
	 * @param {boolean} solid 是否为实心的箭头
	 * @for jmArrow
	 */
	initPoints(solid) {	
		let rotate = this.angle;
		let start = this.start;
		let end = this.end;
		if(!end) return;
		//计算箭头指向角度
		if(!rotate) {
			rotate = Math.atan2(end.y - start.y,end.x - start.x);
		}
		this.points = [];
		let offx = this.offsetX;
		let offy = this.offsetY;
		//箭头相对于线的偏移角度
		let r = Math.atan2(offx,offy);
		let r1 = rotate + r;
		let rsin = Math.sin(r1);
		let rcos = Math.cos(r1);
		let sq = Math.sqrt(offx * offx  + offy * offy);
		let ystep = rsin * sq;
		let xstep = rcos * sq;
		
		let p1 = {
			x:end.x - xstep,
			y:end.y - ystep
		};
		let r2 = rotate - r;
		rsin = Math.sin(r2);
		rcos = Math.cos(r2);
		ystep = rsin * sq;
		xstep = rcos * sq;
		let p2 = {
			x:end.x - xstep,
			y:end.y - ystep
		};

		let s = jmUtils.clone(end);  
		s.m = true;  
		this.points.push(s);
		this.points.push(p1);
		//如果实心箭头则封闭路线
		if(solid || this.style.fill) {    	
			this.points.push(p2);
			this.points.push(end);
		}
		else {
			this.points.push(s);
			this.points.push(p2);
		}		
		return this.points;
	}

}

/**
 * @fileoverview jmBezier 贝塞尔曲线类
 * 
 * jmBezier 提供了 N 阶贝塞尔曲线的绘制功能。
 * 通过控制点定义曲线形状，支持任意阶数的贝塞尔曲线。
 * 
 * 主要功能：
 * - N 阶贝塞尔曲线
 * - 控制点管理
 * - 曲线平移
 * 
 * @module jmBezier
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 贝塞尔曲线类
 * 
 * 绘制 N 阶贝塞尔曲线，参数 points 中为控制点。
 * 支持 2 阶（二次贝塞尔）、3 阶（三次贝塞尔）及更高阶曲线。
 *
 * @class jmBezier
 * @extends jmPath
 * @param {object} params 参数
 * @param {array} [params.points] 控制点数组 [{x, y}, ...]
 * 
 * @example
 * // 创建二次贝塞尔曲线（3个控制点）
 * const quadBezier = graph.createShape('bezier', {
 *     points: [
 *         {x: 100, y: 100},  // 起点
 *         {x: 200, y: 50},   // 控制点
 *         {x: 300, y: 100}   // 终点
 *     ],
 *     style: { stroke: '#000', lineWidth: 2 }
 * });
 * 
 * // 创建三次贝塞尔曲线（4个控制点）
 * const cubicBezier = graph.createShape('bezier', {
 *     points: [
 *         {x: 100, y: 100},  // 起点
 *         {x: 150, y: 50},   // 控制点1
 *         {x: 250, y: 50},   // 控制点2
 *         {x: 300, y: 100}   // 终点
 *     ],
 *     style: { stroke: '#ff0000' }
 * });
 */ 
class jmBezier extends jmPath {	
	
	constructor(params, t='jmBezier') {
		// 参数初始化
		params = params || {};
		
		// 曲线默认不封闭
		if(!params.style) params.style = {};
		if(typeof params.style.close !== true) {
			params.style.close = false;
		}

		super(params, t);
		this.cpoints = params.points || [];
	}	
	
	/**
	 * 控制点
	 *
	 * @property cpoints
	 * @for jmBezier
	 * @type {array}
	 */
	get cpoints() {
		return this.property('cpoints');
	}
	set cpoints(v) {
		this.needUpdate = true;
		return this.property('cpoints', v);
	}
	
	/**
	 * 初始化图形点
	 *
	 * @method initPoints
	 * @private
	 */
	initPoints() {
		
		this.points = [];
		
		let cps = this.cpoints;
		for(let t = 0;t <= 1;t += 0.01) {
			let p = this.getPoint(cps,t);
			this.points.push(p);
		}	
		this.points.push(cps[cps.length - 1]);
		return this.points;
	}

	/**
	 * 根据控制点和参数t生成贝塞尔曲线轨迹点
	 *
	 * @method getPoint
	 * @param {array} ps 控制点集合
	 * @param {number} t 参数(0-1)
	 * @return {array} 所有轨迹点的数组
	 */
	getPoint(ps, t) {
		if(ps.length == 1) return ps[0];
		if(ps.length == 2) {					
			let p = {};
			p.x = (ps[1].x - ps[0].x) * t + ps[0].x;
			p.y = (ps[1].y - ps[0].y) * t + ps[0].y;
			return p;	
		}
		if(ps.length > 2) {
			let nps = [];
			for(let i = 0;i < ps.length - 1;i++) {
				let p = this.getPoint([ps[i],ps[i+1]],t);
				if(p) nps.push(p);
			}
			return this.getPoint(nps,t);
		}
	}

	/**
	 * 对控件进行平移
	 * 遍历控件所有描点或位置，设置其偏移量。
	 *
	 * @method offset
	 * @param {number} x x轴偏移量
	 * @param {number} y y轴偏移量
	 * @param {boolean} [trans] 是否传递,监听者可以通过此属性是否决定是否响应移动事件,默认=true
	 */
	offset(x, y, trans) {	
		let p = this.cpoints;
		if(p) {			
			let len = p.length;
			for(let i=0; i < len;i++) {
				p[i].x += x;
				p[i].y += y;
			}		
			
			//触发控件移动事件	
			this.emit('move',{
				offsetX: x,
				offsetY: y,
				trans: trans
			});
			this.getLocation(true);	//重置
		}
	}
}

/**
 * @fileoverview jmCircle 圆形类
 * 
 * jmCircle 提供了圆形图形的绘制功能。
 * 继承自 jmArc，可以绘制完整的圆或部分圆弧。
 * 
 * 主要功能：
 * - 圆形绘制
 * - 支持填充和描边
 * - 支持 WebGL 和 Canvas 2D 模式
 * 
 * @module jmCircle
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 圆形类
 * 
 * 绘制圆形图形，继承自 jmArc。
 * 可以通过 center 和 radius 指定圆心和半径，
 * 也可以通过 width 和 height 指定圆的尺寸。
 *
 * @class jmCircle
 * @extends jmArc
 * @param {object} params 圆的参数
 * @param {object} [params.center] 圆心坐标 {x, y}
 * @param {number} [params.radius] 圆半径（优先使用）
 * @param {number} [params.width] 圆宽度（无 radius 时使用）
 * @param {number} [params.height] 圆高度（无 radius 时使用）
 * 
 * @example
 * // 创建圆形
 * const circle = graph.createShape('circle', {
 *     center: {x: 200, y: 200},
 *     radius: 50,
 *     style: { fill: '#ff0000', stroke: '#000' }
 * });
 */
class jmCircle extends jmArc {		
	
	constructor(params, t='jmCircle') {
		params.isRegular = true;// 规则的
		super(params, t);		
	}
	/**
	 * 初始化图形点
	 * 
	 * @method initPoint
	 * @private
	 * @for jmCircle
	 */
	initPoints() {		
		if(this.graph.mode === 'webgl') {
			return super.initPoints();
		}	
		let location = this.getLocation();
		
		if(!location.radius) {
			location.radius = Math.min(location.width , location.height) / 2;
		}
		this.points = [];
		this.points.push({x:location.center.x - location.radius,y:location.center.y - location.radius});
		this.points.push({x:location.center.x + location.radius,y:location.center.y - location.radius});
		this.points.push({x:location.center.x + location.radius,y:location.center.y + location.radius});
		this.points.push({x:location.center.x - location.radius,y:location.center.y + location.radius});
	}

	/**
	 * 重写基类画图，此处为画一个完整的圆 
	 *
	 * @method draw
	 */
	draw() {
		if(this.graph.mode === 'webgl') {
			return super.draw();
		}
		let bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;	
		let location = this.getLocation();
		
		if(!location.radius) {
			location.radius = Math.min(location.width , location.height) / 2;
		}
		let start = this.startAngle;
		let end = this.endAngle;
		let anticlockwise = this.anticlockwise;
		//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
		this.context.arc(location.center.x + bounds.left,location.center.y + bounds.top, location.radius, start,end,anticlockwise);
	}
}

/**
 * @fileoverview jmHArc 空心圆弧类
 * 
 * jmHArc 提供了空心圆弧（圆环弧）的绘制功能。
 * 由内圆和外圆两个半径定义，形成一个环形的弧。
 * 
 * 主要功能：
 * - 空心圆弧绘制
 * - 支持顺时针/逆时针绘制
 * - 支持填充和描边
 * 
 * @module jmHArc
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 空心圆弧类
 * 
 * 绘制空心圆弧（圆环弧），继承自 jmArc。
 * 由内圆半径和外圆半径定义环形区域。
 *
 * @class jmHArc
 * @extends jmArc
 * @param {object} params 空心圆弧参数
 * @param {object} [params.center] 圆弧中心点 {x, y}
 * @param {number} [params.minRadius] 内圆半径
 * @param {number} [params.maxRadius] 外圆半径
 * @param {number} [params.start=0] 起始角度（弧度）
 * @param {number} [params.end=Math.PI*2] 结束角度（弧度）
 * @param {boolean} [params.anticlockwise=false] 是否逆时针绘制
 * 
 * @example
 * // 创建空心圆弧
 * const hArc = graph.createShape('hArc', {
 *     center: {x: 200, y: 200},
 *     minRadius: 30,
 *     maxRadius: 50,
 *     start: 0,
 *     end: Math.PI,
 *     style: { fill: '#ff0000' }
 * });
 */

class jmHArc extends jmArc {
		
	constructor(params, t='jmHArc') {
		params.isRegular = true;// 规则的
		params.needCut = true;
		super(params, t);

		this.minRadius = params.minRadius || this.style.minRadius || 0;
		this.maxRadius = params.maxRadius || this.style.maxRadius || 0;
	}

	/**
	 * 设定或获取内空心圆半径
	 * 
	 * @property minRadius
	 * @for jmHArc
	 * @type {number} 
	 */
	get minRadius() {
		return this.property('minRadius');
	}
	set minRadius(v) {
		this.needUpdate = true;
		return this.property('minRadius', v);
	}

	/**
	 * 设定或获取外空心圆半径
	 * 
	 * @property maxRadius
	 * @for jmHArc
	 * @type {number} 
	 */
	get maxRadius() {
		return this.property('maxRadius');
	}
	set maxRadius(v) {
		this.needUpdate = true;
		return this.property('maxRadius', v);
	}

	/**
	 * 初始化图形点
	 *
	 * @method initPoints
	 * @private
	 */
	initPoints() {	
		const location = this.getLocation();	
		//如果设定了半径。则以半径为主
		const minr = this.minRadius;
		const maxr = this.maxRadius;
		
		let start = this.startAngle;
		let end = this.endAngle;
		const anticlockwise = this.anticlockwise;

		//如果是逆时针绘制，则角度为负数，并且结束角为2Math.PI-end
		if(anticlockwise) {
			const p2 =  Math.PI*2;
			start = p2 - start;
			end = p2 - end;
		}

		let step = 0.1;
		if(start > end) step = -step;

		const minps = [];
		const maxps = [];
		//椭圆方程x=a*cos(r) ,y=b*sin(r)
		for(let r=start;;r += step) {
			if(step > 0 && r > end) {
				r = end;
			}
			else if(step < 0 && r < end) {
				r = end;
			}

			const cos = Math.cos(r);
			const sin = Math.sin(r);
			const p1 = {
				x : cos * minr + location.center.x,
				y : sin * minr + location.center.y
			};
			const p2 = {
				x : cos * maxr + location.center.x,
				y : sin * maxr + location.center.y
			};
			minps.push(p1);
			maxps.push(p2);

			if(r === end) break;
		}
		
		maxps.reverse();//大圆逆序
		if(!this.style || !this.style.close) {
			maxps[0].m = true;//非闭合时标记 moveTo，分隔内外两个子路径
		}
		this.points = minps.concat(maxps);
	}
}

/**
 * @fileoverview jmLine 直线类
 * 
 * jmLine 提供了直线图形的绘制功能，支持实线和虚线。
 * 虚线支持自定义间隔长度。
 * 
 * 主要功能：
 * - 直线绘制
 * - 虚线模式
 * - 自定义虚线间隔
 * 
 * @module jmLine
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 直线类
 * 
 * 绘制从起点到终点的直线，支持实线和虚线两种模式。
 *
 * @class jmLine
 * @extends jmPath
 * @param {object} params 直线参数
 * @param {object} [params.start] 起始点 {x, y}
 * @param {object} [params.end] 结束点 {x, y}
 * @param {string} [params.lineType='solid'] 线类型：'solid'=实线，'dotted'=虚线
 * @param {number} [params.dashLength=4] 虚线间隔长度
 * 
 * @example
 * // 创建实线
 * const line = graph.createShape('line', {
 *     start: {x: 0, y: 0},
 *     end: {x: 100, y: 100},
 *     style: { stroke: '#000', lineWidth: 2 }
 * });
 * 
 * // 创建虚线
 * const dottedLine = graph.createShape('line', {
 *     start: {x: 0, y: 0},
 *     end: {x: 100, y: 100},
 *     lineType: 'dotted',
 *     dashLength: 5,
 *     style: { stroke: '#000' }
 * });
 */
class jmLine extends jmPath {	
	
	constructor(params, t='jmLine') {
		
		params.isRegular = true;// 规则的

		super(params, t);

		this.start = params.start || {x:0,y:0};
		this.end = params.end || {x:0,y:0};
		this.style.lineType = this.style.lineType || 'solid';
		this.style.dashLength = this.style.dashLength || 4;
		this.style.close = false;
	}	

	/**
	 * 控制起始点
	 * 
	 * @property start
	 * @for jmLine
	 * @type {point}
	 */
	get start() {
		return this.property('start');
	}
	set start(v) {
		this.needUpdate = true;
		return this.property('start', v);
	}

	/**
	 * 控制结束点
	 * 
	 * @property end
	 * @for jmLine
	 * @type {point}
	 */
	get end() {
		return this.property('end');
	}
	set end(v) {
		this.needUpdate = true;
		return this.property('end', v);
	}

	/**
	 * 初始化图形点,如呆为虚线则根据跳跃间隔描点
	 * @method initPoints
	 * @private
	 */
	initPoints() {	
		const start = this.start;
		const end = this.end;
		this.points = [];	
		this.points.push(start);

		if(this.style.lineType === 'dotted') {			
			let dx = end.x - start.x;
			let dy = end.y - start.y;
			const lineLen = Math.sqrt(dx * dx + dy * dy);
			dx = dx / lineLen;
			dy = dy / lineLen;
			let dottedstart = false;

			const dashLen = this.style.dashLength || 5;
			const dottedsp = dashLen / 2;
			for(let l=dashLen; l<=lineLen;) {
				const p = {
					x: start.x + dx * l, 
					y: start.y + dy * l
				};
				if(dottedstart === false) {					
					l += dottedsp;
				}
				else {				
					p.m = true;// 移动到当时坐标
					l += dashLen;
				}
				this.points.push(p);
				dottedstart = !dottedstart;				
			}
		}
		this.points.push(end);
		return this.points;
	}
}

/**
 * @fileoverview jmPrismatic 棱形类
 * 
 * jmPrismatic 提供了棱形（菱形）图形的绘制功能。
 * 棱形是一个四边形，其对角线互相垂直平分。
 * 
 * 主要功能：
 * - 棱形绘制
 * - 支持填充和描边
 * - 自定义宽高
 * 
 * @module jmPrismatic
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 棱形类
 * 
 * 绘制棱形（菱形）图形，继承自 jmPath。
 * 棱形由中心点、宽度和高度定义。
 *
 * @class jmPrismatic
 * @extends jmPath
 * @param {object} params 参数
 * @param {object} [params.center] 棱形中心点 {x, y}
 * @param {number} [params.width] 棱形宽度
 * @param {number} [params.height] 棱形高度
 * 
 * @example
 * // 创建棱形
 * const prismatic = graph.createShape('prismatic', {
 *     center: {x: 200, y: 200},
 *     width: 100,
 *     height: 80,
 *     style: { fill: '#ff0000', stroke: '#000' }
 * });
 */
class jmPrismatic extends jmPath {	
	
	constructor(params, t='jmPrismatic') {
		params.isRegular = true;// 规则的
		
		super(params, t);
		this.style.close = typeof this.style.close == 'undefined'? true : this.style.close;

		this.center = params.center || {x:0,y:0};
		this.width = params.width || 0;

		//this.on('PropertyChange',this.initPoints);
		this.height = params.height  || 0;
	}
	
	/**
	 * 中心点
	 * point格式：{x:0,y:0,m:true}
	 * @property center
	 * @type {point}
	 */
	get center() {
		return this.property('center');
	}
	set center(v) {
		this.needUpdate = true;
		return this.property('center', v);
	}
	
	/**
	 * 初始化图形点
	 * 计算棱形顶点
	 * 
	 * @method initPoints
	 * @private
	 */
	initPoints() {		
		let location = this.getLocation();
		let mw = location.width / 2;
		let mh = location.height / 2;
		
		this.points = [];
		this.points.push({x:location.center.x - mw, y:location.center.y});
		this.points.push({x:location.center.x, y:location.center.y + mh});
		this.points.push({x:location.center.x + mw, y:location.center.y});
		this.points.push({x:location.center.x, y:location.center.y - mh});
	}
}

/**
 * @fileoverview jmRect 矩形类
 * 
 * jmRect 提供了矩形图形的绘制功能，支持圆角矩形。
 * 圆角支持四角独立设置，可以创建各种样式的矩形。
 * 
 * 主要功能：
 * - 矩形绘制
 * - 圆角矩形（支持四角独立圆角）
 * - 虚线边框
 * - 填充和描边样式
 * 
 * @module jmRect
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 矩形类
 * 
 * 绘制矩形图形，支持圆角和虚线边框。
 * 圆角可以统一设置或四角独立设置。
 *
 * @class jmRect
 * @extends jmPath
 * @param {object} params 参数
 * @param {object} [params.position] 矩形左上角顶点坐标 {x, y}
 * @param {number} [params.width] 矩形宽度
 * @param {number} [params.height] 矩形高度
 * @param {number|object} [params.radius] 边角弧度，支持数字(四角相同)或对象 { topLeft, topRight, bottomRight, bottomLeft }
 * 
 * @example
 * // 创建普通矩形
 * const rect = graph.createShape('rect', {
 *     position: {x: 100, y: 100},
 *     width: 200,
 *     height: 150,
 *     style: { fill: '#ff0000', stroke: '#000' }
 * });
 * 
 * // 创建圆角矩形
 * const roundedRect = graph.createShape('rect', {
 *     position: {x: 100, y: 100},
 *     width: 200,
 *     height: 150,
 *     radius: 10,  // 四角统一圆角
 *     // 或 radius: { topLeft: 5, topRight: 10, bottomRight: 15, bottomLeft: 20 }
 *     style: { fill: '#00ff00' }
 * });
 */ 
class jmRect extends jmPath {		

	constructor(params, t='jmRect') {
		params = params||{};
		params.isRegular = true;// 规则的
		super(params, t);

		this.style.close = true;
		const r = params.radius || this.style.radius || this.style.borderRadius || 0;
		if(typeof r === 'object' && r !== null) {
			// 四角独立圆角
			this.radius = {
				topLeft: Number(r.topLeft) || 0,
				topRight: Number(r.topRight) || 0,
				bottomRight: Number(r.bottomRight) || 0,
				bottomLeft: Number(r.bottomLeft) || 0
			};
		}
		else {
			this.radius = r;
		}
	}
	/**
	 * 圆角半径，支持数字或四角独立对象
	 * @property radius
	 * @type {number|object}
	 */
	get radius() {
		return this.property('radius');
	}
	set radius(v) {
		this.needUpdate = true;
		return this.property('radius', v);
	}

	/**
	 * 获取规范化的圆角值（四角独立）
	 * @returns {object} { topLeft, topRight, bottomRight, bottomLeft }
	 */
	getNormalizedRadius() {
		const r = this.radius;
		if(typeof r === 'number') {
			const v = Math.max(0, r);
			return { topLeft: v, topRight: v, bottomRight: v, bottomLeft: v };
		}
		if(typeof r === 'object' && r !== null) {
			return {
				topLeft: Math.max(0, Number(r.topLeft) || 0),
				topRight: Math.max(0, Number(r.topRight) || 0),
				bottomRight: Math.max(0, Number(r.bottomRight) || 0),
				bottomLeft: Math.max(0, Number(r.bottomLeft) || 0)
			};
		}
		return { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 };
	}

	/**
	 * 检查是否有圆角
	 * @returns {boolean}
	 */
	hasRadius() {
		const nr = this.getNormalizedRadius();
		return nr.topLeft > 0 || nr.topRight > 0 || nr.bottomRight > 0 || nr.bottomLeft > 0;
	}	

	/**
	 * 当前位置左上角
	 * @property position
	 * @type {point}
	 */
	get position() {
		return this.property('position');
	}
	set position(v) {
		this.needUpdate = true;
		return this.property('position', v);
	}

	/**
	 * 获取当前控件的边界
	 *
	 * @method getBounds
	 * @return {bound} 当前控件边界
	 */
	getBounds(isReset) {
		//如果当次计算过，则不重复计算
		if(this.bounds && !isReset) return this.bounds;
		let rect = {};
		this.initPoints();
		let p = this.getLocation();
		rect.left = p.left; 
		rect.top = p.top; 
		
		rect.right = p.left + p.width; 
		rect.bottom = p.top + p.height; 
		
		rect.width = rect.right - rect.left;
		rect.height = rect.bottom - rect.top;

		return this.bounds=rect;
	}
	
	/**
	 * 重写检查坐标是否在区域内
	 *
	 * @method checkPoint
	 * @param {point} p 待检查的坐标
	 * @return {boolean} 如果在则返回true,否则返回false
	 */
	/*checkPoint(p) {	
		//生成当前坐标对应的父级元素的相对位置
		let abounds = this.bounds || this.getBounds();

		if(p.x > abounds.right || p.x < abounds.left) {
			return false;
		}
		if(p.y > abounds.bottom || p.y < abounds.top) {
			return false;
		}
		
		return true;
	}*/

	/**
	 * 初始化图形点
	 * 支持四角独立圆角，借助圆弧对象计算描点
	 * 
	 * @method initPoints
	 * @private
	 */
	initPoints() {
		let location = this.getLocation();	
		let p1 = {x:location.left,y:location.top};
		let p2 = {x:location.left + location.width,y:location.top};
		let p3 = {x:location.left + location.width,y:location.top + location.height};
		let p4 = {x:location.left,y:location.top + location.height};

		//如果指定为虚线 , 则初始化一个直线组件，来构建虚线点集合
		if(this.style.lineType === 'dotted' && !this.dottedLine) {
			this.dottedLine = this.graph.createShape(jmLine, {style: this.style});
		}
		
		const nr = this.getNormalizedRadius();
		const hasRadius = this.hasRadius();

		// 如果有圆角（支持四角独立），借助圆弧对象计算描点
		if(hasRadius) {
			let q = Math.PI / 2;

			// 限制圆角不超过短边的一半
			const maxR = Math.min(location.width / 2, location.height / 2);
			const rtl = Math.min(nr.topLeft, maxR);
			const rtr = Math.min(nr.topRight, maxR);
			const rbr = Math.min(nr.bottomRight, maxR);
			const rbl = Math.min(nr.bottomLeft, maxR);

			// 左上角圆弧
			if(rtl > 0) {
				let arc = this.graph.createShape(jmArc,{radius:rtl,anticlockwise:false});
				arc.center = {x:location.left + rtl, y:location.top + rtl};
				arc.startAngle = Math.PI;
				arc.endAngle = Math.PI + q;
				var ps1 = arc.initPoints();
			}
			else {
				var ps1 = [p1];
			}

			// 右上角圆弧
			if(rtr > 0) {
				let arc = this.graph.createShape(jmArc,{radius:rtr,anticlockwise:false});
				arc.center = {x:p2.x - rtr, y:p2.y + rtr};
				arc.startAngle = Math.PI + q;
				arc.endAngle = Math.PI * 2;
				var ps2 = arc.initPoints();
			}
			else {
				var ps2 = [p2];
			}

			// 右下角圆弧
			if(rbr > 0) {
				let arc = this.graph.createShape(jmArc,{radius:rbr,anticlockwise:false});
				arc.center = {x:p3.x - rbr, y:p3.y - rbr};
				arc.startAngle = 0;
				arc.endAngle = q;
				var ps3 = arc.initPoints();
			}
			else {
				var ps3 = [p3];
			}

			// 左下角圆弧
			if(rbl > 0) {
				let arc = this.graph.createShape(jmArc,{radius:rbl,anticlockwise:false});
				arc.center = {x:p4.x + rbl, y:p4.y - rbl};
				arc.startAngle = q;
				arc.endAngle = Math.PI;
				var ps4 = arc.initPoints();
			}
			else {
				var ps4 = [p4];
			}
			this.points = ps1.concat(ps2,ps3,ps4);
		}
		else {
			this.points = [];
			this.points.push(p1);
			//如果是虚线
			if(this.dottedLine) {
				this.dottedLine.start = p1;
				this.dottedLine.end = p2;
				this.points = this.points.concat(this.dottedLine.initPoints());
			}
			this.points.push(p2);
			//如果是虚线
			if(this.dottedLine) {
				this.dottedLine.start = p2;
				this.dottedLine.end = p3;
				this.points = this.points.concat(this.dottedLine.initPoints());
			}
			this.points.push(p3);
			//如果是虚线
			if(this.dottedLine) {
				this.dottedLine.start = p3;
				this.dottedLine.end = p4;
				this.points = this.points.concat(this.dottedLine.initPoints());
			}
			this.points.push(p4);
			//如果是虚线
			if(this.dottedLine) {
				this.dottedLine.start = p4;
				this.dottedLine.end = p1;
				this.points = this.points.concat(this.dottedLine.initPoints());
			}
		}		
		
		return this.points;
	}
}

/**
 * @fileoverview jmArrowLine 带箭头的直线类
 * 
 * jmArrowLine 提供了带箭头直线的绘制功能。
 * 继承自 jmLine，在直线末端添加箭头。
 * 
 * 主要功能：
 * - 带箭头的直线绘制
 * - 支持虚线模式
 * - 可控制箭头显示
 * 
 * @module jmArrowLine
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 带箭头的直线类
 * 
 * 绘制带箭头的直线，继承自 jmLine。
 * 箭头位于直线的末端。
 *
 * @class jmArrowLine
 * @extends jmLine
 * @param {object} params 直线参数
 * @param {object} [params.start] 直线起始点 {x, y}
 * @param {object} [params.end] 直线终结点 {x, y}
 * @param {boolean} [params.arrowVisible=true] 是否显示箭头
 * 
 * @example
 * // 创建带箭头的直线
 * const arrowLine = graph.createShape('arrowLine', {
 *     start: {x: 100, y: 100},
 *     end: {x: 200, y: 100},
 *     style: { stroke: '#000', lineWidth: 2 }
 * });
 */	
class jmArrowLine extends jmLine {	

	constructor(params, t) {

		params.start = params.start || {x:0,y:0};
		params.end = params.end || {x:0,y:0};

		super(params, t||'jmArrowLine');
		this.style.lineJoin = this.style.lineJoin || 'miter';
		this.arrow = new jmArrow(params);
	}

	/**
	 * 初始化直线和箭头描点
	 *
	 * @method initPoints
	 * @private
	 */
	initPoints() {	
		this.points = super.initPoints();
		if(this.arrowVisible !== false) {
			this.points = this.points.concat(this.arrow.initPoints());
		}
		return this.points;
	}
}

/**
 * @fileoverview jmImage 图片类
 * 
 * jmImage 提供了图片显示功能。
 * 支持从 URL 或 Image 对象加载图片，支持图片裁剪和缩放。
 * 
 * 主要功能：
 * - 图片加载和显示
 * - 图片裁剪
 * - 图片缩放
 * - 支持 WebGL 和 Canvas 2D 模式
 * 
 * @module jmImage
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 图片类
 * 
 * 显示图片控件，支持从 URL 或 Image 对象加载图片。
 * 支持图片裁剪和缩放功能。
 *
 * @class jmImage
 * @extends jmControl
 * @param {object} params 控件参数
 * @param {string|HTMLImageElement} [params.image] 图片源地址或图片对象
 * @param {object} [params.position] 图片位置 {x, y}
 * @param {number} [params.width] 图片显示宽度
 * @param {number} [params.height] 图片显示高度
 * @param {object} [params.sourcePosition] 图片裁剪起始位置 {x, y}
 * @param {number} [params.sourceWidth] 图片裁剪宽度
 * @param {number} [params.sourceHeight] 图片裁剪高度
 * 
 * @example
 * // 从 URL 加载图片
 * const img = graph.createShape('image', {
 *     image: 'path/to/image.png',
 *     position: {x: 100, y: 100},
 *     width: 200,
 *     height: 150
 * });
 * 
 * // 裁剪图片
 * const croppedImg = graph.createShape('image', {
 *     image: 'path/to/sprite.png',
 *     position: {x: 100, y: 100},
 *     sourcePosition: {x: 0, y: 0},
 *     sourceWidth: 50,
 *     sourceHeight: 50,
 *     width: 100,
 *     height: 100
 * });
 */
class jmImage extends jmControl {

	constructor(params, t) {
		params = params || {};
		params.isRegular = true;// 规则的
		super(params, t||'jmImage');

		this.style.fill = this.fill || 'transparent';//默认指定一个fill，为了可以鼠标选中

		this.sourceWidth = params.sourceWidth;
		this.sourceHeight = params.sourceHeight;
		this.sourcePosition = params.sourcePosition;
		this.image = params.image || this.style.image;
	}

	/**
	 * 画图开始剪切位置
	 *
	 * @property sourcePosition
	 * @type {point}
	 */
	get sourcePosition() {
		return this.property('sourcePosition');
	}
	set sourcePosition(v) {
		return this.property('sourcePosition', v);
	}

	/**
	 * 被剪切宽度
	 *
	 * @property sourceWidth
	 * @type {number}
	 */
	get sourceWidth() {
		return this.property('sourceWidth');
	}
	set sourceWidth(v) {
		this.needUpdate = true;
		return this.property('sourceWidth', v);
	}

	/**
	 * 被剪切高度
	 *
	 * @method sourceHeight
	 * @type {number}
	 */
	get sourceHeight() {
		return this.property('sourceHeight');
	}
	set sourceHeight(v) {
		this.needUpdate = true;
		return this.property('sourceHeight', v);
	}

	/**
	 * 设定要绘制的图像或其它多媒体对象，可以是图片地址，或图片image对象
	 *
	 * @method image
	 * @type {img}
	 */
	get image() {
		return this.property('image');
	}
	set image(v) {
		this.needUpdate = true;
		return this.property('image', v);
	}

	/**
	 * 重写控件绘制
	 * 根据父边界偏移和此控件参数绘制图片
	 *
	 * @method draw
	 */
	draw() {	
		try {			
			const img = this.getImage();	
			this.drawImg(img);
		}
		catch(e) {
			console.error && console.error(e);
		}
	}

	// 绘制
	drawImg(img) {
		if(!img || !img.complete) {
			console.warn('image is empty');
			return;
		}
		let bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
		if(!bounds) bounds = this.parent && this.parent.getAbsoluteBounds?this.parent.getAbsoluteBounds():this.getAbsoluteBounds();

		let p = this.getLocation();		

		let sp = this.sourcePosition;
		let sw = this.sourceWidth;
		let sh = this.sourceHeight;

		const ctx = this.webglControl || this.context;
		if(this.webglControl) {
			ctx.setParentBounds && ctx.setParentBounds(bounds);
			const localBounds = this.getBounds();
			// 给图片给定顶点
			ctx.draw([
				{
					x: localBounds.left,
					y: localBounds.top
				},
				{
					x: localBounds.left + localBounds.width,
					y: localBounds.top
				},
				{
					x: localBounds.left + localBounds.width,
					y: localBounds.top + localBounds.height
				},
				 {
					x: localBounds.left, 
					y: localBounds.top + localBounds.height
				 }
			], bounds);
			ctx.drawImage(img, localBounds.left, localBounds.top, localBounds.width, localBounds.height);
			return;
		}

		// 计算绝对定位
		p.left += bounds.left;
		p.top += bounds.top;

		if(sp || typeof sw != 'undefined' || typeof sh != 'undefined') {	
			if(typeof sw == 'undefined') sw= p.width || img.width || 0;
			if(typeof sh == 'undefined') sh= p.height || img.height || 0;
			sp = sp || {x:0, y:0};			

			if(p.width && p.height) ctx.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,p.height);
			else if(p.width) {
				ctx.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,p.width,sh);
			}		
			else if(p.height) {
				ctx.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,sw,p.height);
			}		
			else ctx.drawImage(img,sp.x,sp.y,sw,sh,p.left,p.top,sw,sh);		
		}
		else if(p) {
			if(p.width && p.height) ctx.drawImage(img,p.left,p.top,p.width,p.height);
			else if(p.width) ctx.drawImage(img,p.left,p.top,p.width,img.height);
			else if(p.height) ctx.drawImage(img,p.left,p.top,img.width,p.height);
			else ctx.drawImage(img,p.left,p.top);
		}
		else {
			ctx.drawImage(img);
		}
	}

	/**
	 * 获取当前控件的边界 
	 * 
	 * @method getBounds
	 * @return {object} 边界对象(left,top,right,bottom,width,height)
	 */
	getBounds(isReset) {
		//如果当次计算过，则不重复计算
		if(this.bounds && !isReset) return this.bounds;
		let rect = {};
		let img = this.getImage() || {
			width: 0,
			height: 0
		};
		let p = this.getLocation();
		let w = p.width || img.width;
		let h = p.height || img.height;
		rect.left = p.left; 
		rect.top = p.top; 
		rect.right = p.left + w; 
		rect.bottom = p.top + h; 
		rect.width = w;
		rect.height = h;
		return this.bounds=rect;
	}

	getLocation() {
		const img = this.getImage();
		const loc = super.getLocation();
		// 如果指定了宽度，但没有指定高宽，则等比缩放
		if(loc.width && !loc.height) {
			loc.height = loc.width / img.width * img.height;
		}
		else if(loc.height && !loc.width) {
			loc.width = loc.height / img.height * img.width;
		}
		return loc;
	}

	/**
	 * img对象
	 *
	 * @method getImage
	 * @return {img} 图片对象
	 */
	getImage() {
		const src = this.image || this.style.src || this.style.image;
		if(this.__img && this.__img.src && this.__img.src.indexOf(src) != -1) {
			return this.__img;
		}
		else if(src && src.src) {
			this.__img = src;
		}
		else if(typeof document !== 'undefined' && document.createElement) {
			this.__img = document.createElement('img');
			this.__img.onload = ()=>{
				this.needUpdate = true;
			};
			if(src && typeof src == 'string') this.__img.src = src;
		}
		else if(this.graph.isWXMiniApp && this.graph.canvas && typeof src === 'string') {
			// 图片对象
			this.__img = this.graph.canvas.createImage();
			this.__img.onload = ()=>{
				this.needUpdate = true;
			};
			// 设置图片src
			this.__img.src = src;
		}
		else {
			this.__img = src;
		}
		if(this.__img) this.image = this.__img.src;
		return this.__img;
	}
}

/**
 * @fileoverview jmLabel 文本标签类
 * 
 * jmLabel 提供了文本显示功能。
 * 支持单行和多行文本，支持自动换行。
 * 
 * 主要功能：
 * - 文本绘制
 * - 自动换行
 * - 文本对齐（水平/垂直）
 * - 字体样式设置
 * 
 * @module jmLabel
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 文本标签类
 * 
 * 显示文字控件，支持多种文本样式和对齐方式。
 *
 * @class jmLabel
 * @extends jmControl
 * @param {object} params 参数
 * @param {string} [params.text=''] 显示的文字内容
 * @param {object} [params.center] 文本中心点坐标
 * @param {object} [params.style] 样式对象
 * @param {string} [params.style.font] 字体样式
 * @param {string} [params.style.textAlign='left'] 水平对齐方式
 * @param {string} [params.style.textBaseline='middle'] 垂直对齐方式
 * @param {number} [params.style.maxWidth] 最大宽度（用于自动换行）
 * 
 * @example
 * // 创建文本标签
 * const label = graph.createShape('label', {
 *     position: {x: 100, y: 100},
 *     text: 'Hello World',
 *     style: {
 *         fill: '#000',
 *         font: '20px Arial',
 *         textAlign: 'center'
 *     }
 * });
 */
class jmLabel extends jmControl {

	constructor(params, t) {
		params = params || {};
		params.isRegular = true;// 规则的
		super(params, t||'jmLabel');

		this.style.font = this.style.font || "15px Arial";
		this.style.fontFamily = this.style.fontFamily || 'Arial';
		this.style.fontSize = this.style.fontSize || 15;

		// 显示不同的 textAlign 值
		//文字水平对齐
		this.style.textAlign = this.style.textAlign || 'left';
		//文字垂直对齐
		this.style.textBaseline = this.style.textBaseline || 'middle';
		this.text = params.text || params.value || '';

		this.center = params.center || null;
	}

	/**
	 * 显示的内容
	 * @property text
	 * @type {string}
	 */
	get text() {
		return this.property('text');
	}
	set text(v) {
		this.needUpdate = true;
		return this.property('text', v);
	}

	/**
	 * 中心点
	 * point格式：{x:0,y:0,m:true}
	 * @property center
	 * @type {point}
	 */
	get center() {
		return this.property('center');
	}
	set center(v) {
		this.needUpdate = true;
		return this.property('center', v);
	}	

	/**
	 * 当前位置左上角
	 * @property position
	 * @type {point}
	 */
	get position() {
		return this.property('position');
	}
	set position(v) {
		this.needUpdate = true;
		return this.property('position', v);
	}

	/**
	 * 在基础的getLocation上，再加上一个特殊的center处理
	 * 
	 * @method getLocation
	 * @returns {Object}
	 */
	getLocation() {
		let location = super.getLocation();
		let size = this.testSize();	
		
		location.width = location.width || size.width;
		location.height = location.height || size.height;	

		//如果没有指定位置，但指定了中心，则用中心来计算坐标
		if(!location.left && !location.top && location.center) {
			location.left = location.center.x - location.width / 2;
			location.top = location.center.y - location.height / 2;
		}
		return location;
	}

	/**
	 * 初始化图形点,主要用于限定控件边界。
	 *
	 * @method initPoints
	 * @return {array} 所有边界点数组
	 * @private
	 */
	initPoints() {	
		this.__size = null;
		let location = this.getLocation();

		this.points = [{x: location.left, y: location.top}];
		this.points.push({x: location.left + location.width, y: location.top});
		this.points.push({x: location.left + location.width, y: location.top + location.height});
		this.points.push({x: location.left, y: location.top + location.height});
		return this.points;
	}

	/**
	 * 测试获取文本所占大小
	 * 计算文本渲染所需的宽度和高度，支持自动换行
	 * 
	 * @method testSize
	 * @return {object} 含文本大小的对象 {width, height}
	 */
	testSize() {
		// 使用缓存提高性能，避免重复计算
		if(this.__size) return this.__size;

		if(this.webglControl) {
			this.__size = this.webglControl.testSize(this.text, this.style);
		}
		else {
			this.context.save && this.context.save();
			
			// 设置字体样式用于测量
			this.setStyle({
				font: this.style.font || (this.style.fontSize + 'px ' + this.style.fontFamily)
			});
			
			// 计算文本尺寸
			if(this.style.maxWidth && this.text) {
				// 文本换行处理
				const lines = this.wrapText(this.text, this.style.maxWidth);
				let maxWidth = 0;
				
				// 找出最宽的一行
				for(let line of lines) {
					const width = this.context.measureText(line).width;
					if(width > maxWidth) maxWidth = width;
				}
				
				// 计算总高度（行数 × 行高）
				const lineHeight = this.style.lineHeight || this.style.fontSize * 1.2;
				this.__size = {
					width: maxWidth,
					height: lineHeight * lines.length
				};
			}
			else {
				// 单行文本
				this.__size = this.context.measureText ?
								this.context.measureText(this.text) :
								{width: 15};
				this.__size.height = this.style.fontSize ? this.style.fontSize : 15;
			}
			
			this.context.restore && this.context.restore();
		}

		// 设置默认宽高
		if(!this.width) this.width = this.__size.width;
		if(!this.height) this.height = this.__size.height;
		
		return this.__size;
	}

	/**
	 * 文本换行处理
	 * 根据最大宽度将文本分割成多行
	 * 支持中英文混合文本，优先在空格处换行
	 * 
	 * @method wrapText
	 * @param {string} text 文本内容
	 * @param {number} maxWidth 最大宽度（像素）
	 * @return {array} 换行后的文本数组
	 */
	wrapText(text, maxWidth) {
		// 参数验证
		if(!text || !maxWidth) return [text || ''];
		
		// 检查缓存，避免重复计算
		const cacheKey = `${text}_${maxWidth}`;
		if(this.__wrapTextCache && this.__wrapTextCache.key === cacheKey) {
			return this.__wrapTextCache.lines;
		}
		
		const lines = [];
		
		// 先按换行符分割
		const paragraphs = text.split('\n');
		
		for(let paragraph of paragraphs) {
			// 如果段落为空，添加空行
			if(!paragraph) {
				lines.push('');
				continue;
			}
			
			// 按空格分割单词
			const words = paragraph.split(' ');
			let currentLine = words[0];
			
			for(let i = 1; i < words.length; i++) {
				const word = words[i];
				const testLine = currentLine + ' ' + word;
				const metrics = this.context.measureText(testLine);
				const testWidth = metrics.width;
				
				if(testWidth <= maxWidth) {
					// 当前行还能容纳这个单词
					currentLine = testLine;
				} else {
					// 当前行已满，保存当前行并开始新行
					if(currentLine) lines.push(currentLine);
					currentLine = word;
				}
			}
			
			// 添加最后一行
			if(currentLine) lines.push(currentLine);
		}
		
		// 缓存结果
		this.__wrapTextCache = {
			key: cacheKey,
			lines: lines
		};
		
		return lines;
	}

	/**
	 * 根据位置偏移画字符串
	 * 
	 * @method draw
	 */
	draw() {
		
		//获取当前控件的绝对位置
		let bounds = this.parent && this.parent.absoluteBounds?this.parent.absoluteBounds:this.absoluteBounds;
		this.testSize();
		let location = this.location;
		let x = location.left + bounds.left;
		let y = location.top + bounds.top;
		//通过文字对齐方式计算起始X位置
		switch(this.style.textAlign) {
			case 'right': {
				x += location.width;
				break;
			}
			case 'center': {
				x += location.width / 2;
				break;
			}
		}
		//通过垂直对齐方式计算起始Y值
		switch(this.style.textBaseline) {
			case 'bottom': {
				y += location.height;
				break;
			}
			case 'hanging':
			case 'alphabetic':
			case 'middle' : {
				y += location.height/2;
				break;
			}

		}

		let txt = this.text;
		if(typeof txt !== 'undefined') {
			// webgl方式
			if(this.webglControl) {
				this.webglControl.draw(this.points, bounds);
				this.webglControl.drawText(txt, x, y, location);
			}
			else if(this.style.fill && this.context.fillText) {
				if(this.style.maxWidth) {
					// 绘制换行文本
					const lines = this.wrapText(txt, this.style.maxWidth);
					const lineHeight = this.style.fontSize;
					// 调整起始Y位置以支持垂直对齐
					const startY = y - (lines.length - 1) * lineHeight / 2;
					
					for(let i = 0; i < lines.length; i++) {
						const lineY = startY + i * lineHeight;
						this.context.fillText(lines[i], x, lineY);
					}
				}
				else {
					this.context.fillText(txt,x,y);
				}
			}
			else if(this.context.strokeText) {
				if(this.style.maxWidth) {
					// 绘制换行文本
					const lines = this.wrapText(txt, this.style.maxWidth);
					const lineHeight = this.style.fontSize;
					// 调整起始Y位置以支持垂直对齐
					const startY = y - (lines.length - 1) * lineHeight / 2;
					
					for(let i = 0; i < lines.length; i++) {
						const lineY = startY + i * lineHeight;
						this.context.strokeText(lines[i], x, lineY);
					}
				}
				else {
					this.context.strokeText(txt,x,y);
				}
			}
		}
	}

	endDraw() {
		if(this.mode === '2d') {
			super.endDraw();
		}
	}
}

/**
 * @fileoverview jmResize 可缩放控件类
 * 
 * jmResize 提供了可缩放的矩形控件功能。
 * 在矩形四边和四角添加可拖拽的控制点，实现图形的缩放和调整。
 * 
 * 主要功能：
 * - 8个方向的控制点
 * - 鼠标拖拽缩放
 * - 支持旋转后的缩放
 * - 自定义最小尺寸
 * 
 * @module jmResize
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 可缩放控件类
 * 
 * 继承自 jmRect，在矩形四边和四角添加可拖拽的控制点。
 * 用于实现图形的缩放和调整功能。
 *
 * @class jmResize
 * @extends jmRect
 * @param {object} params 控件参数
 * @param {boolean} [params.resizable=true] 是否可缩放
 * @param {boolean} [params.movable] 是否可移动
 * @param {number} [params.rectSize=8] 控制点大小
 * 
 * @example
 * // 创建可缩放矩形
 * const resize = graph.createShape('resize', {
 *     position: {x: 100, y: 100},
 *     width: 200,
 *     height: 150,
 *     resizable: true,
 *     movable: true
 * });
 * 
 * // 监听缩放事件
 * resize.on('resize', (px, py, dx, dy) => {
 *     console.log('缩放中', px, py, dx, dy);
 * });
 */
class jmResize extends jmRect {	

	constructor(params, t='jmResize') {
		params = params || {};
		params.isRegular = true;// 规则的
		
		super(params, t);
		//是否可拉伸
		this.resizable = params.resizable === false?false:true;	
		this.movable = params.movable;
		this.rectSize = params.rectSize || 8;
		this.style.close = this.style.close || true;

		// 方块鼠标指针方向
		this.rectCursors = ['w-resize','nw-resize','n-resize','ne-resize','e-resize','se-resize','s-resize','sw-resize'];

		this.init(params);
	}
	/**
	 * 拉动的小方块大小
	 * @property rectSize
	 * @type {number}
	 */
	get rectSize() {
		return this.property('rectSize');
	}
	set rectSize(v) {
		return this.property('rectSize', v);
	}

	/**
	 * 是否可以拉大缩小
	 * @property resizable
	 * @type {boolean}
	 */
	get resizable() {
		return this.property('resizable');
	}
	set resizable(v) {
		return this.property('resizable', v);
	}

	/**
	 * 初始化控件的8个拉伸方框
	 *
	 * @method init
	 * @private
	 */
	init(params) {
		//如果不可改变大小。则直接退出
		if(this.resizable === false) return;
		this.resizeRects = [];	
		let rs = this.rectSize;
		let rectStyle = this.style.rectStyle || {
				stroke: 'red',
				fill: 'transparent',
				lineWidth: 2,
				close: true,
				zIndex:100
			};
		rectStyle.close = true;
		rectStyle.fill = rectStyle.fill || 'transparent';
		
		for(let i = 0; i<8; i++) {
			//生成改变大小方块
			const r = (this.graph || params.graph).createShape(jmRect,{
					position:{x:0,y:0},
					width: rs,
					height: rs,
					style: rectStyle,
					interactive: true
				});
			r.index = i;
			r.visible = true;
			this.resizeRects.push(r);	
			this.children.add(r);
			r.canMove(true,this.graph);	
		}	
		this.reset(0,0,0,0);//初始化位置
		//绑定其事件
		this.bindRectEvents();
	}

	/**
	 * 绑定周边拉伸的小方块事件
	 *
	 * @method bindRectEvents
	 * @private
	 */
	bindRectEvents() {		
		for(let i =0; i<this.resizeRects.length; i++) {
			const r = this.resizeRects[i];		
			//小方块移动监听
			r.on('move',function(arg) {					
				arg.cancel = true;
				let px=0, py=0, dx=0, dy=0;
				if(this.index == 0) {				
					dx = - arg.offsetX;
					px = arg.offsetX;						
				}
				else if(this.index == 1) {
					dx = - arg.offsetX;
					px = arg.offsetX;				
					dy = - arg.offsetY;
					py = arg.offsetY;						
				}
				else if(this.index == 2) {				
					dy = -arg.offsetY;				
					py = arg.offsetY;						
				}
				else if(this.index == 3) {
					dx = arg.offsetX;				
					dy = -arg.offsetY;
					py = arg.offsetY;
				}
				else if(this.index == 4) {
					dx = arg.offsetX;							
				}
				else if(this.index == 5) {
					dx = arg.offsetX;
					dy = arg.offsetY;					
				}
				else if(this.index == 6) {
					dy = arg.offsetY;					
				}
				else if(this.index == 7) {
					dx = - arg.offsetX;
					dx = - arg.offsetX;
					px = arg.offsetX;
					dy = arg.offsetY;				
				}
				//重新定位
				this.parent.reset(px, py, dx, dy);
			});
			//鼠标指针
			r.bind('mousemove', function() {	
				// 如果有旋转方位，则重新定义小块的作用
				const rotation = this.parent.getRotation();	
				let cursor = this.parent.rectCursors[this.index];

				// 旋转一定角度后的位置
				const position = rotation && rotation.angle? this.graph.utils.rotatePoints(this.graph.utils.clone(this.position), rotation, rotation.angle): this.position;
				const center = {
					x: this.parent.width / 2,
					y: this.parent.height / 2
				};

				this.rotationAngleByCenter = Math.atan((position.y - center.y) / (position.x - center.x));// 与中心连线和x轴的夹角
				// 把90度分割成三个区域，不同的指针
				const angleSplit1 = Math.atan(center.y / center.x) / 2;
				const angleSplit2 = angleSplit1 * 2 + Math.PI / 4;

				// 如果在左边，
				if(position.x < center.x) {
					if(this.rotationAngleByCenter >= -angleSplit1 && this.rotationAngleByCenter <= angleSplit1) {
						cursor = this.parent.rectCursors[0];
					}
					else if(this.rotationAngleByCenter > angleSplit1 && this.rotationAngleByCenter < angleSplit2) {
						cursor = this.parent.rectCursors[1];
					}
					else if(this.rotationAngleByCenter >= angleSplit2) {
						cursor = this.parent.rectCursors[2];
					}
					else if(this.rotationAngleByCenter <= -angleSplit1 && this.rotationAngleByCenter > -angleSplit2) {
						cursor = this.parent.rectCursors[7];
					}
					else if(this.rotationAngleByCenter <= -angleSplit2) {
						cursor = this.parent.rectCursors[6];
					}
				}
				else {
					if(this.rotationAngleByCenter >= -angleSplit1 && this.rotationAngleByCenter <= angleSplit1) {
						cursor = this.parent.rectCursors[4];
					}
					else if(this.rotationAngleByCenter > angleSplit1 && this.rotationAngleByCenter < angleSplit2) {
						cursor = this.parent.rectCursors[5];
					}
					else if(this.rotationAngleByCenter >= angleSplit2) {
						cursor = this.parent.rectCursors[6];
					}
					else if(this.rotationAngleByCenter <= -angleSplit1 && this.rotationAngleByCenter > -angleSplit2) {
						cursor = this.parent.rectCursors[3];
					}
					else if(this.rotationAngleByCenter <= -angleSplit2) {
						cursor = this.parent.rectCursors[2];
					}
				}
						
				this.cursor = cursor;
			});
			r.bind('mouseleave', function() {
				this.cursor = 'default';
			});
		}
		/*
		// 如果是双指开始滑动
		let touchPositions;
		this.on('touchstart', (evt) => {
			if(evt.touches && evt.touches.legnth === 2) {
				touchPositions = evt.touches;
			}
		});

		// 如果是双指滑动
		//计算二手指滑动距离，然后再通过在父容器中的占比得到缩放比例
		this.on('touchmove', (evt) => {
			if(touchPositions && evt.touches && evt.touches.length == 2) {
				//上次滑动二指的距离
				const preOffX = touchPositions[0].x - touchPositions[1].x;
				const preOffY = touchPositions[0].y - touchPositions[1].y;
				const preDis = Math.sqrt(preOffX * preOffX + preOffY * preOffY);
				//当次滑动二指的距离
				const curOffX = evt.touches[0].x - evt.touches[1].x;
				const curOffY = evt.touches[0].y - evt.touches[1].y;
				const curDis = Math.sqrt(curOffX * curOffX + curOffY * curOffY);
	
				//const disx = Math.abs(preOffX - curOffX);//x轴滑行的距离
				//const disy = Math.abs(preOffY - curOffY);//y轴滑行的距离
				
				const offset = curDis - preDis;

				this.reset(0, 0, offset, offset);
			}
		});	
		// 结束滑动
		this.on('touchend touchcancel', (evt) => {
			touchPositions = null;
		});*/
	}

	/**
	 * 按移动偏移量重置当前对象，并触发大小和位置改变事件
	 * @method reset
	 * @param {number} px 位置X轴偏移
	 * @param {number} py 位置y轴偏移
	 * @param {number} dx 大小x轴偏移
	 * @param {number} dy 大小y轴偏移
	 */
	reset(px, py, dx, dy) {
		const minWidth = typeof this.style.minWidth=='undefined'?5:this.style.minWidth;
		const minHeight = typeof this.style.minHeight=='undefined'?5:this.style.minHeight;

		const location = this.getLocation();
		if(dx != 0 || dy != 0) {
			const w = location.width + dx;
			const h = location.height + dy;
			if(w >= minWidth || h >= minHeight) {
				if(w >= minWidth) {
					this.width = w;
				}
				else {
					px = 0;
					dx = 0;
				}
				if(h >= minHeight) {
					this.height = h;
				}
				else {
					py = 0;
					dy = 0;
				}
				//如果当前控件能移动才能改变其位置
				if(this.movable !== false && (px||py)) {
					const p = this.position;
					p.x = location.left + px;
					p.y = location.top + py;
					this.position = p;
				}			
				//触发大小改变事件
				this.emit('resize',px,py,dx,dy);
			}	
		}

		const newLocation = this.getLocation();
		for(let i in this.resizeRects) {
			const r = this.resizeRects[i];
			switch(r.index) {
				case 0: {
					r.position.x = -r.width / 2;
					r.position.y = (newLocation.height - r.height) / 2;
					break;
				}	
				case 1: {
					r.position.x = -r.width / 2;
					r.position.y = -r.height / 2;
					break;
				}		
				case 2: {
					r.position.x = (newLocation.width - r.width) / 2;
					r.position.y = -r.height / 2;
					break;
				}
				case 3: {
					r.position.x = newLocation.width - r.width / 2;
					r.position.y = -r.height / 2;
					break;
				}
				case 4: {
					r.position.x = newLocation.width - r.width / 2;
					r.position.y = (newLocation.height - r.height) / 2;
					break;
				}
				case 5: {
					r.position.x = newLocation.width - r.width / 2;
					r.position.y = newLocation.height - r.height /2;
					break;
				}
				case 6: {
					r.position.x = (newLocation.width - r.width) / 2;
					r.position.y = newLocation.height - r.height / 2;
					break;
				}
				case 7: {
					r.position.x = -r.width / 2;
					r.position.y = newLocation.height - r.height / 2;
					break;
				}
			}
			r.needUpdate = true;
		}
	}
}

/**
 * @fileoverview jmEllipse 椭圆类
 * 
 * jmEllipse 提供了椭圆图形的绘制功能。
 * 椭圆是通过缩放圆形来实现的，支持完整的椭圆和椭圆弧。
 * 
 * 主要功能：
 * - 椭圆绘制
 * - 椭圆弧绘制
 * - 支持 WebGL 和 Canvas 2D 模式
 * 
 * @module jmEllipse
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 椭圆类
 * 
 * 绘制椭圆图形，继承自 jmArc。
 * 可以指定起始角度和结束角度来绘制椭圆弧。
 *
 * @class jmEllipse
 * @extends jmArc
 * @param {object} params 椭圆的参数
 * @param {object} [params.center={x:0,y:0}] 椭圆中心点坐标
 * @param {number} [params.width=100] 椭圆宽度（长轴直径）
 * @param {number} [params.height=60] 椭圆高度（短轴直径）
 * @param {number} [params.startAngle=0] 起始角度（弧度）
 * @param {number} [params.endAngle=Math.PI*2] 结束角度（弧度）
 * @param {boolean} [params.anticlockwise=false] 是否逆时针绘制
 * 
 * @example
 * // 创建椭圆
 * const ellipse = graph.createShape('ellipse', {
 *     center: {x: 200, y: 200},
 *     width: 200,
 *     height: 100,
 *     style: { fill: '#ff0000', stroke: '#000' }
 * });
 */
class jmEllipse extends jmArc {
	
	constructor(params, t='jmEllipse') {
		params = params || {};
		params.isRegular = true; // 标记为规则图形
		super(params, t);
	}

	/**
	 * 初始化图形点
	 * 为WebGL模式生成控制点，2D模式使用draw方法直接绘制
	 * 
	 * @method initPoints
	 * @private
	 * @for jmEllipse
	 */
	initPoints() {
		// WebGL模式使用父类的点生成方法
		if(this.graph.mode === 'webgl') {
			return super.initPoints();
		}
		
		// 2D模式：生成4个控制点用于边界计算
		// 这些点不是实际的绘制点，而是用于碰撞检测和边界计算
		let location = this.getLocation();

		this.points = [];
		this.points.push({x:location.center.x - location.width/2, y:location.center.y}); // 左
		this.points.push({x:location.center.x, y:location.center.y - location.height/2}); // 上
		this.points.push({x:location.center.x + location.width/2, y:location.center.y}); // 右
		this.points.push({x:location.center.x, y:location.center.y + location.height/2}); // 下
	}

	/**
	 * 重写基类画图，此处为画一个椭圆
	 * 使用Canvas的变换功能（平移和缩放）来绘制椭圆
	 * 
	 * @method draw
	 */
	draw() {
		// WebGL模式使用父类的绘制方法
		if(this.graph.mode === 'webgl') {
			return super.draw();
		}
		
		// 获取边界和位置信息
		let bounds = this.parent && this.parent.absoluteBounds ? this.parent.absoluteBounds : this.absoluteBounds;
		let location = this.getLocation();

		// 获取椭圆弧参数
		let start = this.startAngle || 0;
		let end = this.endAngle || Math.PI * 2;
		let anticlockwise = this.anticlockwise || false;

		// 椭圆绘制：通过变换圆形来实现
		// 1. 保存当前绘图状态
		this.context.save();
		
		// 2. 平移到椭圆中心
		this.context.translate(location.center.x + bounds.left, location.center.y + bounds.top);
		
		// 3. 缩放坐标系，使圆形变为椭圆
		// 将X轴缩放width/2，Y轴缩放height/2，这样单位圆就变成了椭圆
		this.context.scale(location.width/2, location.height/2);
		
		// 4. 绘制单位圆（会被缩放成椭圆）
		this.context.arc(0, 0, 1, start, end, anticlockwise);
		
		// 5. 恢复绘图状态
		this.context.restore();
	}
}

/**
 * @fileoverview jmPolygon 多边形类
 * 
 * jmPolygon 提供了多边形图形的绘制功能。
 * 支持规则多边形（正多边形）和自定义多边形。
 * 
 * 主要功能：
 * - 规则多边形（正三角形、正方形、正五边形等）
 * - 自定义多边形（通过顶点数组定义）
 * - 填充和描边样式
 * 
 * @module jmPolygon
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 多边形类
 * 
 * 绘制多边形图形，支持规则多边形和自定义多边形。
 * 规则多边形通过边数和半径自动计算顶点，
 * 自定义多边形通过顶点数组定义。
 *
 * @class jmPolygon
 * @extends jmPath
 * @param {object} params 多边形的参数
 * @param {array} [params.points] 自定义顶点数组，如果提供则忽略sides和radius
 * @param {number} [params.sides=3] 多边形边数（3-100）
 * @param {number} [params.radius=50] 多边形半径（像素）
 * @param {object} [params.center={x:0,y:0}] 多边形中心点坐标
 * 
 * @example
 * // 创建正六边形
 * const hexagon = graph.createShape('polygon', {
 *     center: {x: 200, y: 200},
 *     sides: 6,
 *     radius: 50,
 *     style: { fill: '#ff0000', stroke: '#000' }
 * });
 * 
 * // 创建自定义多边形
 * const polygon = graph.createShape('polygon', {
 *     points: [
 *         {x: 100, y: 100},
 *         {x: 200, y: 50},
 *         {x: 300, y: 100},
 *         {x: 250, y: 200},
 *         {x: 150, y: 200}
 *     ],
 *     style: { fill: '#00ff00' }
 * });
 */
class jmPolygon extends jmPath {
	
	constructor(params, t='jmPolygon') {
		params = params || {};
		params.isRegular = true; // 标记为规则图形，便于优化渲染
		super(params, t);

		// 参数验证和初始化
		this.sides = params.sides || params.points?.length || 3;
		this.radius = params.radius || 50;
		this.center = params.center || {x: 0, y: 0};
	}

	/**
	 * 设定或获取多边形边数
	 * 边数决定了多边形的形状，最小为3（三角形）
	 * 
	 * @property sides
	 * @for jmPolygon
	 * @type {number}
	 */
	get sides() {
		return this.property('sides');
	}
	set sides(v) {
		// 参数验证：边数必须在3-100之间
		if(typeof v !== 'number' || isNaN(v) || v < 3) {
			console.warn('jmPolygon: sides must be a number >= 3');
			v = 3;
		}
		if(v > 100) {
			console.warn('jmPolygon: sides should not exceed 100 for performance reasons');
			v = 100;
		}
		this.needUpdate = true;
		return this.property('sides', Math.floor(v)); // 确保是整数
	}

	/**
	 * 设定或获取多边形半径
	 * 半径是从中心点到顶点的距离
	 * 
	 * @property radius
	 * @for jmPolygon
	 * @type {number}
	 */
	get radius() {
		return this.property('radius');
	}
	set radius(v) {
		// 参数验证：半径必须为正数
		if(typeof v !== 'number' || isNaN(v) || v <= 0) {
			console.warn('jmPolygon: radius must be a positive number');
			v = 1;
		}
		this.needUpdate = true;
		return this.property('radius', v);
	}

	/**
	 * 设定或获取多边形中心
	 * 中心点是多边形的几何中心
	 * 
	 * @property center
	 * @for jmPolygon
	 * @type {object}
	 */
	get center() {
		return this.property('center');
	}
	set center(v) {
		// 参数验证：中心点必须包含x和y属性
		if(!v || typeof v.x !== 'number' || typeof v.y !== 'number') {
			console.warn('jmPolygon: center must be an object with x and y properties');
			v = {x: 0, y: 0};
		}
		this.needUpdate = true;
		return this.property('center', v);
	}

	/**
	 * 初始化图形点
	 * 如果提供了自定义顶点，则使用自定义顶点
	 * 否则根据边数和半径自动计算规则多边形的顶点
	 * 
	 * @method initPoints
	 * @private
	 * @for jmPolygon
	 */
	initPoints() {
		// 如果提供了自定义顶点，直接使用
		if (this.points && this.points.length > 0) {
			return;
		}

		// 计算规则多边形的顶点
		const points = [];
		const sides = this.sides;
		const radius = this.radius;
		const center = this.center;

		// 从顶部开始绘制（-90度），顺时针方向
		for (let i = 0; i < sides; i++) {
			const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
			const x = center.x + Math.cos(angle) * radius;
			const y = center.y + Math.sin(angle) * radius;
			points.push({x, y});
		}

		this.points = points;
	}
}

/**
 * @fileoverview jmStar 星形类
 * 
 * jmStar 提供了星形图形的绘制功能。
 * 支持自定义顶点数和内外半径，创建各种星形图案。
 * 
 * 主要功能：
 * - 星形绘制
 * - 自定义角数
 * - 自定义内外半径
 * 
 * @module jmStar
 * @author jmGraph Team
 * @license MIT
 */

/**
 * 星形类
 * 
 * 绘制星形图形，支持自定义顶点数和内外半径。
 * 星形由交替的外半径和内半径顶点组成。
 *
 * @class jmStar
 * @extends jmPath
 * @param {object} params 星形的参数
 * @param {number} [params.points=5] 星形顶点数（角数，3-50）
 * @param {number} [params.radius=50] 星形外半径（从中心到尖角的距离）
 * @param {number} [params.innerRadius=25] 星形内半径（从中心到凹陷处的距离）
 * @param {object} [params.center={x:0,y:0}] 星形中心点坐标
 * 
 * @example
 * // 创建五角星
 * const star = graph.createShape('star', {
 *     center: {x: 200, y: 200},
 *     points: 5,
 *     radius: 50,
 *     innerRadius: 25,
 *     style: { fill: '#ff0000', stroke: '#000' }
 * });
 * 
 * // 创建六角星
 * const hexStar = graph.createShape('star', {
 *     center: {x: 200, y: 200},
 *     points: 6,
 *     radius: 60,
 *     innerRadius: 30
 * });
 */
class jmStar extends jmPath {
	
	constructor(params, t='jmStar') {
		params = params || {};
		params.isRegular = true; // 标记为规则图形
		super(params, t);

		// 参数验证和初始化
		this.pointsCount = params.points || 5;
		this.radius = params.radius || 50;
		this.innerRadius = params.innerRadius || 25;
		this.center = params.center || {x: 0, y: 0};
	}

	/**
	 * 设定或获取星形顶点数（角数）
	 * 顶点数决定了星形的角数，例如5表示五角星
	 * 
	 * @property pointsCount
	 * @for jmStar
	 * @type {number}
	 */
	get pointsCount() {
		return this.property('pointsCount');
	}
	set pointsCount(v) {
		// 参数验证：顶点数必须在3-50之间
		if(typeof v !== 'number' || isNaN(v) || v < 3) {
			console.warn('jmStar: pointsCount must be a number >= 3');
			v = 3;
		}
		if(v > 50) {
			console.warn('jmStar: pointsCount should not exceed 50 for performance reasons');
			v = 50;
		}
		this.needUpdate = true;
		return this.property('pointsCount', Math.floor(v)); // 确保是整数
	}

	/**
	 * 设定或获取星形外半径
	 * 外半径是从中心到尖角的距离
	 * 
	 * @property radius
	 * @for jmStar
	 * @type {number}
	 */
	get radius() {
		return this.property('radius');
	}
	set radius(v) {
		// 参数验证：半径必须为正数
		if(typeof v !== 'number' || isNaN(v) || v <= 0) {
			console.warn('jmStar: radius must be a positive number');
			v = 1;
		}
		this.needUpdate = true;
		return this.property('radius', v);
	}

	/**
	 * 设定或获取星形内半径
	 * 内半径是从中心到凹陷处的距离
	 * 内半径应该小于外半径，否则会产生奇怪的形状
	 * 
	 * @property innerRadius
	 * @for jmStar
	 * @type {number}
	 */
	get innerRadius() {
		return this.property('innerRadius');
	}
	set innerRadius(v) {
		// 参数验证：内半径必须为正数
		if(typeof v !== 'number' || isNaN(v) || v <= 0) {
			console.warn('jmStar: innerRadius must be a positive number');
			v = 1;
		}
		// 警告：内半径不应大于外半径
		if(v >= this.radius) {
			console.warn('jmStar: innerRadius should be less than radius for proper star shape');
		}
		this.needUpdate = true;
		return this.property('innerRadius', v);
	}

	/**
	 * 设定或获取星形中心
	 * 中心点是星形的几何中心
	 * 
	 * @property center
	 * @for jmStar
	 * @type {object}
	 */
	get center() {
		return this.property('center');
	}
	set center(v) {
		// 参数验证：中心点必须包含x和y属性
		if(!v || typeof v.x !== 'number' || typeof v.y !== 'number') {
			console.warn('jmStar: center must be an object with x and y properties');
			v = {x: 0, y: 0};
		}
		this.needUpdate = true;
		return this.property('center', v);
	}

	/**
	 * 初始化图形点
	 * 计算星形的顶点坐标，交替使用外半径和内半径
	 * 
	 * @method initPoints
	 * @private
	 * @for jmStar
	 */
	initPoints() {
		// 如果提供了自定义顶点，直接使用
		if (this.points && this.points.length > 0) {
			return;
		}

		// 计算星形顶点
		const points = [];
		const pointsCount = this.pointsCount;
		const radius = this.radius;
		const innerRadius = this.innerRadius;
		const center = this.center;

		// 星形有2倍顶点数的点（外半径和内半径交替）
		// 从顶部开始绘制（-90度），顺时针方向
		for (let i = 0; i < pointsCount * 2; i++) {
			const angle = (i / pointsCount) * Math.PI - Math.PI / 2;
			// 偶数索引使用外半径，奇数索引使用内半径
			const r = i % 2 === 0 ? radius : innerRadius;
			const x = center.x + Math.cos(angle) * r;
			const y = center.y + Math.sin(angle) * r;
			points.push({x, y});
		}

		this.points = points;
	}
}

/**
 * @fileoverview jmEvents 事件处理系统
 * 
 * jmEvents 是 jmGraph 库的事件处理模块，负责管理所有用户交互事件。
 * 包括鼠标事件、触摸事件和键盘事件的绑定、分发和销毁。
 * 
 * 主要功能：
 * - 鼠标事件：mousedown, mousemove, mouseup, click, dblclick 等
 * - 触摸事件：touchstart, touchmove, touchend, touchcancel, tap
 * - 键盘事件：keydown, keyup, keypress
 * - 事件冒泡和委托机制
 * 
 * @module jmEvents
 * @author jmGraph Team
 * @license MIT
 */

/**
 * jmEvents 事件处理类
 * 
 * 统一管理画布上的所有交互事件，包括鼠标、触摸和键盘事件。
 * 支持事件冒泡机制，可以将事件传递给子控件处理。
 * 
 * @class jmEvents
 * 
 * @param {jmGraph} container jmGraph 实例
 * @param {HTMLElement} target 事件目标元素（通常是 canvas 元素）
 * 
 * @example
 * // 通常由 jmGraph 内部创建，不需要手动实例化
 * const events = new jmEvents(graph, canvasElement);
 */
class jmEvents {

	/**
	 * 构造函数
	 * 
	 * @param {jmGraph} container jmGraph 实例
	 * @param {HTMLElement} target 事件目标元素
	 */
	constructor(container, target) {
		/**
		 * jmGraph 实例
		 * @type {jmGraph}
		 */
		this.container = container;
		/**
		 * 事件目标元素
		 * @type {HTMLElement}
		 */
		this.target = target || container;
		/**
		 * 鼠标事件处理器
		 * @type {jmMouseEvent}
		 */
		this.mouseHandler = new jmMouseEvent(this, container, target);
		/**
		 * 键盘事件处理器
		 * @type {jmKeyEvent}
		 */
		this.keyHandler = new jmKeyEvent(this, container, target);
	}

	/**
	 * 触摸开始事件处理
	 * 
	 * @method touchStart
	 * @param {TouchEvent} evt 触摸事件对象
	 * @return {boolean} 如果事件目标为画布本身则返回 false
	 */
	touchStart(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchstart';
		this.container.raiseEvent('touchstart',evt);
		const t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	/**
	 * 触摸移动事件处理
	 * 
	 * @method touchMove
	 * @param {TouchEvent} evt 触摸事件对象
	 * @return {boolean} 如果事件目标为画布本身则返回 false
	 */
	touchMove(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchmove';
		this.container.raiseEvent('touchmove',evt);
		const t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	/**
	 * 触摸结束事件处理
	 * 
	 * @method touchEnd
	 * @param {TouchEvent} evt 触摸事件对象
	 * @return {boolean} 如果事件目标为画布本身则返回 false
	 */
	touchEnd(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchend';
		
		this.container.raiseEvent('touchend',evt);
		const t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	/**
	 * 触摸取消事件处理
	 * 
	 * @method touchCancel
	 * @param {TouchEvent} evt 触摸事件对象
	 * @return {boolean} 如果事件目标为画布本身则返回 false
	 */
	touchCancel(evt) {
		evt = evt || window.event;
		evt.eventName = 'touchcancel';
		
		this.container.raiseEvent('touchcancel',evt);
		const t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	/**
	 * 轻触事件处理
	 * 
	 * @method tap
	 * @param {Event} evt 事件对象
	 * @return {boolean} 如果事件目标为画布本身则返回 false
	 */
	tap(evt) {
		evt = evt || window.event;
		evt.eventName = 'tap';
		
		this.container.raiseEvent('tap',evt);
		const t = evt.target || evt.srcElement;
		if(t == this.target) {
			return false;
		}
	};

	/**
	 * 销毁事件处理器
	 * 
	 * 移除所有绑定的事件监听器，释放资源。
	 * 
	 * @method destroy
	 */
	destroy() {
		this.mouseHandler.destroy();
		this.keyHandler.destroy();
	}
}

/**
 * 鼠标事件处理器
 * 
 * @class jmMouseEvent
 * @private
 */
class jmMouseEvent {
	/**
	 * 构造函数
	 * 
	 * @param {jmEvents} instance jmEvents 实例
	 * @param {jmGraph} container jmGraph 实例
	 * @param {HTMLElement} target 事件目标元素
	 */
	constructor(instance, container, target) {
		this.instance = instance;
		this.container = container;
		this.target = target || container;

		/**
		 * 已绑定的事件映射表
		 * @type {Object}
		 */
		this.eventEvents = {};

		this.init(instance, container, target);
	}
	
	/**
	 * 初始化鼠标事件绑定
	 * 
	 * @method init
	 * @private
	 * @param {jmEvents} instance jmEvents 实例
	 * @param {jmGraph} container jmGraph 实例
	 * @param {HTMLElement} target 事件目标元素
	 */
	init(instance, container, target) {
		const canvas = this.target;
		const doc = typeof document != 'undefined'? document: null;

		this.eventEvents['mousedown'] = jmUtils.bindEvent(this.target,'mousedown',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mousedown';
			container.raiseEvent('mousedown',evt);
		});
		
		this.eventEvents['mousemove'] = jmUtils.bindEvent(this.target,'mousemove',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mousemove';
			const target = evt.target || evt.srcElement;
			if(target == canvas) {
				container.raiseEvent('mousemove',evt);
				if(evt.preventDefault) evt.preventDefault();
				return false;
			}
		});
		
		this.eventEvents['mouseover'] = jmUtils.bindEvent(this.target,'mouseover',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mouseover';
			container.raiseEvent('mouseover',evt);
		});
		this.eventEvents['mouseleave'] = jmUtils.bindEvent(this.target,'mouseleave',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mouseleave';
			container.raiseEvent('mouseleave',evt);
		});
		this.eventEvents['mouseout'] = jmUtils.bindEvent(this.target,'mouseout',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mouseout';
			container.raiseEvent('mouseout',evt);
		});
		doc && (this.eventEvents['mouseup'] = jmUtils.bindEvent(doc,'mouseup',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'mouseup';
			const r = container.raiseEvent('mouseup',evt);
			if(r === false) {
				if(evt.preventDefault) evt.preventDefault();
				return false;
			}
		}));
		
		this.eventEvents['dblclick'] = jmUtils.bindEvent(this.target,'dblclick',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'dblclick';
			container.raiseEvent('dblclick',evt);
		});
		this.eventEvents['click'] = jmUtils.bindEvent(this.target,'click',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'click';
			container.raiseEvent('click',evt);
		});

		doc && (this.eventEvents['resize'] = jmUtils.bindEvent(doc,'resize',function(evt) {
			evt = evt || window.event;
			evt.eventName = 'resize';
			return container.raiseEvent('resize',evt);
		}));

		this.eventEvents['touchstart'] = jmUtils.bindEvent(this.target,'touchstart', function(evt) {
			evt.eventName = 'touchstart';
			return instance.touchStart(evt);
		},{ passive: false });

		this.eventEvents['touchmove'] = jmUtils.bindEvent(this.target,'touchmove', function(evt) {
			evt.eventName = 'touchmove';
			return instance.touchMove(evt);
		},{ passive: false });

		doc && (this.eventEvents['touchend'] = jmUtils.bindEvent(doc,'touchend', function(evt) {
			evt.eventName = 'touchend';
			return instance.touchEnd(evt);
		},{ passive: false }));

		doc && (this.eventEvents['touchcancel'] = jmUtils.bindEvent(doc,'touchcancel', function(evt) {
			evt.eventName = 'touchcancel';
			return instance.touchCancel(evt);
		},{ passive: false }));
	}

	/**
	 * 销毁鼠标事件处理器
	 * 
	 * 移除所有绑定的鼠标事件监听器。
	 * 
	 * @method destroy
	 */
	destroy() {
		for(const name in this.eventEvents) {
			const event = this.eventEvents[name];
			if(!event || !event.fun) continue;
			jmUtils.removeEvent(event.target, name, event.fun);
		}
	}
}

/**
 * 键盘事件处理器
 * 
 * @class jmKeyEvent
 * @private
 */
class jmKeyEvent {
	/**
	 * 构造函数
	 * 
	 * @param {jmEvents} instance jmEvents 实例
	 * @param {jmGraph} container jmGraph 实例
	 * @param {HTMLElement} target 事件目标元素
	 */
	constructor(instance, container,target) {
		this.instance = instance;
		this.container = container;
		this.target = target || container;

		/**
		 * 已绑定的事件映射表
		 * @type {Object}
		 */
		this.eventEvents = {};

		this.init(container, target);
	}

	/**
	 * 初始化键盘事件绑定
	 * 
	 * @method init
	 * @private
	 * @param {jmGraph} container jmGraph 实例
	 * @param {HTMLElement} target 事件目标元素
	 */
	init(container, target) {
		const doc = typeof document != 'undefined'? document: null;

		const checkKeyEvent = (evt) => {
			const target = evt.srcElement || evt.target;
			if(target && (target.tagName == 'INPUT' 
				|| target.tagName == 'TEXTAREA'
				|| target.tagName == 'ANCHOR' 
				|| target.tagName == 'FORM' 
				|| target.tagName == 'FILE'
				|| target.tagName == 'IMG'
				|| target.tagName == 'HIDDEN'
				|| target.tagName == 'RADIO'
				|| target.tagName == 'TEXT'	)) {
				return false;
			}
			return true;
		};

		doc && (this.eventEvents['keypress'] = jmUtils.bindEvent(doc,'keypress',function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;
			const r = container.raiseEvent('keypress',evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		}));
		doc && (this.eventEvents['keydown'] = jmUtils.bindEvent(doc,'keydown',function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;
			const r = container.raiseEvent('keydown',evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		}));
		doc && (this.eventEvents['keyup'] = jmUtils.bindEvent(doc,'keyup',function(evt) {
			evt = evt || window.event;
			if(!checkKeyEvent(evt)) return;
			const r = container.raiseEvent('keyup',evt);
			if(r === false && evt.preventDefault) 
				evt.preventDefault();
			return r;
		}));
	}

	destroy() {
		for(const name in this.eventEvents) {
			const event = this.eventEvents[name];
			if(!event || !event.fun) continue;
			jmUtils.removeEvent(event.target, name, event.fun);
		}
	}
}

/**
 * @fileoverview jmGraph 主画布类
 * 
 * jmGraph 是 jmGraph 库的核心类，代表一个完整的画布实例。
 * 它继承自 jmControl，提供了完整的图形渲染、事件处理、缩放平移等功能。
 * 
 * 主要功能：
 * - Canvas/WebGL 双渲染模式支持
 * - 图形创建与管理（createShape, createLine, createPath 等）
 * - 渐变和阴影效果（createLinearGradient, createRadialGradient, createShadow）
 * - 缩放和平移（setZoom, pan, resetTransform）
 * - 导出功能（toDataURL, exportToPNG, exportToJPEG, exportToSVG）
 * - 自动刷新动画循环（autoRefresh）
 * - 微信小程序支持
 * 
 * @module jmGraph
 * @author jmGraph Team
 * @license MIT
 */

/**
 * jmGraph 画图类
 * 
 * 对 Canvas 画图 API 进行二次封装，使其更易调用，省去很多重复的工作。
 * 支持多种图形的创建、渲染、交互和导出。
 * 
 * @class jmGraph
 * @extends jmControl
 * 
 * @param {HTMLElement|string} canvas Canvas 元素或元素 ID
 * @param {Object} [option] 配置选项
 * @param {number} [option.width] 画布宽度
 * @param {number} [option.height] 画布高度
 * @param {string} [option.mode='2d'] 渲染模式：'2d' 或 'webgl'
 * @param {boolean} [option.autoRefresh=false] 是否自动刷新
 * @param {Object} [option.shapes] 自定义图形类型映射
 * @param {function} [callback] 初始化完成后的回调函数
 * 
 * @example
 * // 创建画布实例
 * const graph = new jmGraph('canvasId', {
 *     width: 800,
 *     height: 600,
 *     mode: '2d'
 * });
 * 
 * // 创建一个矩形
 * const rect = graph.createShape('rect', {
 *     x: 100, y: 100,
 *     width: 200, height: 150,
 *     style: { fill: '#ff0000' }
 * });
 * graph.children.add(rect);
 * graph.refresh();
 */
class jmGraph extends jmControl {

	constructor(canvas, option, callback) {
		if(typeof option == 'function') {
			callback = option;
			option = {};
		}
	
		option = option || {};
		//option.mode = '2d'; // webgl | 2d 暂不支持webgl
		option.interactive = true;
		option.isRegular = true;// 规则的

		super(option, 'jmGraph');

		this.option = option || {};
		
		this.devicePixelRatio = 1; // 根据屏幕的缩放倍数

		/**
		 * 工具类
		 * @property utils/util
		 * @type {jmUtils}
		 */
		this.util = this.utils = jmUtils;	
		// 模式 webgl | 2d
		this.mode = option.mode || '2d';

		// 缩放和平移相关
		this.scaleFactor = 1;
		this.translation = {x: 0, y: 0};

		//如果是小程序
		if(typeof wx != 'undefined' && wx.canIUse && wx.canIUse('canvas')) {			
			if(typeof canvas === 'string') canvas = wx.createSelectorQuery().select('#' + canvas);
			this.isWXMiniApp = true;// 微信小程序平台
			this.container = canvas;
		}
		else {
			if(typeof canvas === 'string' && typeof document != 'undefined') {
				canvas = document.getElementById(canvas);
			}
			else if(canvas.length) {
				canvas = canvas[0];
			}

			if(!canvas.getContext && typeof document != 'undefined') {
				this.container = canvas;
				let cn = document.createElement('canvas');
				canvas.appendChild(cn);
				cn.width = canvas.offsetWidth||canvas.clientWidth;
				cn.height = canvas.offsetHeight||canvas.clientHeight;
				canvas = cn;
			}	
			else {
				this.container = canvas.parentElement;
			}
		}	
		this.canvas = canvas;	
		// Create context with preserveDrawingBuffer for webgl to prevent flickering
		if(this.mode === 'webgl') {
			this.context = canvas.getContext(this.mode, { preserveDrawingBuffer: true });
		}
		else {
			this.context = canvas.getContext(this.mode);
		}
		
		// webgl模式
		if(this.mode === 'webgl') {

			this.context.enable(this.context.BLEND);// 开启混合功能：（注意，它不可和gl.DEPTH_TEST一起使用）
			this.context.blendFunc(this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA); // 指定混合函数：
			// webglcontextlost webglcontextrestored
			jmUtils.bindEvent(canvas, 'webglcontextlost', (e)=> {
				console.log('canvas webglcontextlost', e);
				this.emit('webglcontextlost', e);
			});
			jmUtils.bindEvent(canvas, 'webglcontextrestored', (e)=> {
				console.log('canvas webglcontextrestored', e);
				this.emit('webglcontextrestored', e);
			});
		} 
		this.__init(callback);
	}

	/**
	 * 初始化画布
	 * @method init
	 */
	__init(callback) {
		/**
		 * 当前所有图形类型
		 * @property shapes
		 * @type {object}
		 */
		this.shapes = Object.assign({
			"path": jmPath,
		}, this.option.shapes);
		
		/**
		 * 画控件前初始化
		 * 为了解决一像素线条问题
		 */
		this.on('beginDraw', function() {  
			this.context.translate && this.context.translate(0.5, 0.5);
			// 应用缩放和平移变换
			if(this.context.translate && this.context.scale) {
				this.context.translate(this.translation.x, this.translation.y);
				this.context.scale(this.scaleFactor, this.scaleFactor);
			}
		});
		/**
		 * 结束控件绘制 为了解决一像素线条问题
		 */
		this.on('endDraw', function() {  
			this.context.translate && this.context.translate(-0.5, -0.5);
			// 恢复缩放和平移变换
			if(this.context.translate && this.context.scale) {
				this.context.scale(1/this.scaleFactor, 1/this.scaleFactor);
				this.context.translate(-this.translation.x, -this.translation.y);
			}
		});

		// devicePixelRatio初始化
		let dpr = typeof window != 'undefined' && window.devicePixelRatio > 1? window.devicePixelRatio : 1;
		if(this.isWXMiniApp) {
			dpr = wx.getWindowInfo().pixelRatio || 1;
		}		
		this.devicePixelRatio = dpr;
		// 为了解决锯齿问题，先放大canvas再缩放
		this.dprScaleSize = this.devicePixelRatio > 1? this.devicePixelRatio : 2;
		
		if(this.option.width > 0) this.width = this.option.width;
		if(this.option.height > 0) this.height = this.option.height;	
		this.resize();		

		//绑定事件
		this.eventHandler = new jmEvents(this, this.canvas.canvas || this.canvas);	

		//如果指定了自动刷新
		if(this.option.autoRefresh) {
			this.autoRefresh();
		}

		if(callback) callback(this);		
	}

	//  重置canvas大小，并判断高清屏，画图先放大二倍
	resize(w, h) {
		if(!this.canvas) return;

		this.__normalSize = this.__normalSize || { width: 0, height: 0};
		w = w || this.__normalSize.width || this.width, h = h || this.__normalSize.height || this.height;

		if(w) this.__normalSize.width = w;
		if(h) this.__normalSize.height = h;
	
		this.css('width', w + "px");
		this.css('height', h + "px");
		if(this.mode === '2d') {
			this.canvas.height = h * this.dprScaleSize;
			this.canvas.width = w * this.dprScaleSize;
			if(this.dprScaleSize !== 1) this.context.scale && this.context.scale(this.dprScaleSize, this.dprScaleSize);	
		}
		else {
			this.canvas.width = w;
			this.canvas.height = h;
		}

		this.context.viewport && this.context.viewport(0, 0, w, h);
		this.needUpdate = true;
	}

	/**
	 * 宽度
	 * @property width
	 * @type {number}
	 */
	get width() {
		if(this.__normalSize && this.__normalSize.width) return this.__normalSize.width;
		if(this.canvas) return this.canvas.width;
		return 0;
	}
	set width(v) {
		this.needUpdate = true;
		if(this.canvas) {
			this.resize(v);
		}	
		return v;
	}

	/**
	 * 高度
	 * @property height
	 * @type {number}
	 */
	get height() {
		if(this.__normalSize && this.__normalSize.height) return this.__normalSize.height;
		if(this.canvas) return this.canvas.height;
		return 0;
	}
	set height(v) {
		this.needUpdate = true;
		if(this.canvas) {
			this.resize(0, v);
		}
		return v;
	}

	/**
	 * 创建jmGraph的静态对象
	 *
	 * @method create
	 * @return {jmGraph} jmGraph实例对象
	 */
	static create(...args) {
		return new jmGraph(...args);
	}

	/**
	 * 获取当前画布在浏览器中的绝对定位
	 *
	 * @method getPosition
	 * @return {postion} 返回定位坐标
	 */
	getPosition() {
		const p = this.isWXMiniApp? {
			left: 0,
			top: 0
		} :jmUtils.getElementPosition(this.canvas.canvas || this.canvas);
		
		p.width = this.width;
		p.height = this.height;
		p.right = p.left + p.width;
		p.bottom = p.top + p.height;
		return p;
	}

	/**
	 * 注册图形类型,图形类型必需有统一的构造函数。参数为画布句柄和参数对象。
	 *
	 * @method registerShape 
	 * @param {string} name 控件图形名称
	 * @param {class} shape 图形控件类型
	 */
	registerShape(name, shape) {
		this.shapes[name] = shape;
	}

	/**
	 * 从已注册的图形类创建图形
	 * 简单直观创建对象
	 *
	 * @method createShape 
	 * @param {string} shape 注册控件的名称 也可以直接是控件类型
	 * @param {object} args 实例化控件的参数
	 * @return {object} 已实例化控件的对象
	 */
	createShape(shape, args) {
		if(typeof shape === 'string') {
			shape = this.shapes[shape];
		}
		if(shape) {
			if(!args) args = {};
			args.graph = this;
			const obj = new shape(args);
			return obj;
		}
	}

	/**
	 * 生成阴影对象
	 *
	 * @method createShadow
	 * @param {number} x x偏移量
	 * @param {number} y y偏移量
	 * @param {number} blur 模糊值
	 * @param {string} color 颜色
	 * @return {jmShadow} 阴影对象
	 */
	createShadow(x, y, blur, color) {
		const sh = new jmShadow(x, y, blur, color);
		return sh;
	}

	/**
	 * 生成线性渐变对象
	 *
	 * @method createLinearGradient
	 * @param {number} x1 线性渐变起始点X坐标
	 * @param {number} y1 线性渐变起始点Y坐标
	 * @param {number} x2 线性渐变结束点X坐标
	 * @param {number} y2 线性渐变结束点Y坐标
	 * @return {jmGradient} 线性渐变对象
	 */
	createLinearGradient(x1, y1, x2, y2, stops=[]) {
		const gradient = new jmGradient({
			type:'linear',
			x1: x1,
			y1: y1,
			x2: x2,
			y2: y2,
			stops
		});
		return gradient;
	}

	/**
	 * 生成放射渐变对象
	 *
	 * @method createRadialGradient
	 * @param {number} x1 放射渐变小圆中心X坐标
	 * @param {number} y1 放射渐变小圆中心Y坐标
	 * @param {number} r1 放射渐变小圆半径
	 * @param {number} x2 放射渐变大圆中心X坐标
	 * @param {number} y2 放射渐变大圆中心Y坐标
	 * @param {number} r2 放射渐变大圆半径
	 * @return {jmGradient} 放射渐变对象
	 */
	createRadialGradient(x1, y1, r1, x2, y2, r2, stops=[]) {	
		const gradient = new jmGradient({
			type:'radial',
			x1: x1,
			y1: y1,
			r1: r1,
			x2: x2,
			y2: y2,
			r2: r2,
			stops
		});
		return gradient;
	}

	/**
	 * 重新刷新整个画板
	 * 以加入动画事件触发延时10毫秒刷新，保存最尽的调用只刷新一次，加强性能的效果。
	 *
	 * @method refresh
	 */
	refresh() {	
		//加入动画，触发redraw，会导致多次refresh只redraw一次
		/*this.animate(function() {
			return false;
		},100,'jmgraph_refresh');*/
		this.redraw();
	}

	/**
	 * 重新刷新整个画板
	 * 此方法直接重画，与refresh效果类似
	 *
	 * @method redraw
	 * @param {number} [w] 清除画布的宽度
	 * @param {number} [h] 清除画布的高度
	 */
	redraw(w, h) {	
		this.clear(w||this.width, h||this.height);
		this.paint();
	}

	/**
	 * 清除画布
	 * 
	 * @method clear
	 * @param {number} [w] 清除画布的宽度
	 * @param {number} [h] 清除画布的高度
	 */
	clear(w, h) {
		if(!w || !h) {
			w = this.width;
			h = this.height;
			/*if(this.scaleSize) {
				w = w / this.scaleSize.x;
				h = h / this.scaleSize.y;
			}*/
		}
		
		if(this.context.clearRect) {
			if(this.style && this.style.fill) {
				this.points = [
					{x:0, y:0},
					{x:w, y:0},
					{x:w, y:h},
					{x:0, y:h}
				];
				this.style.close = true;// 封闭填充
			}

			this.context.clearRect(0, 0, w, h);
		}
		else if(this.mode === 'webgl' && this.context.clear) {
			// 缓存 clearColor 对象，避免每帧创建
			if(this.style && this.style.fill) {
				const color = this.utils.hexToRGBA(this.style.fill);
				this.__lastClearColor = color;
				this.context.clearColor(color.r, color.g, color.b, color.a);
			}
			else if(!this.__lastClearColor) {
				this.__lastClearColor = { r: 0, g: 0, b: 0, a: 0 };
				this.context.clearColor(0, 0, 0, 0);
			}
			else {
				this.context.clearColor(this.__lastClearColor.r, this.__lastClearColor.g, this.__lastClearColor.b, this.__lastClearColor.a);
			}
        	this.context.clear(this.context.COLOR_BUFFER_BIT); // 清空颜色缓冲区，也就是清空画布
		}
	}

	/**
	* 设置画布样式，此处只是设置其css样式
	*
	* @method css
	* @param {string} name 样式名
	* @param {string} value 样式值
	*/
	css(name, value) {
		if(this.canvas && this.canvas.style) {
			if(typeof value != 'undefined') this.canvas.style[name] = value;
			return this.canvas.style[name];
		}
	}

	/**
	 * 生成路径对象
	 *
	 * @method createPath
	 * @param {array} points 路径中的描点集合
	 * @param {style} style 当前路径的样式
	 * @return {jmPath} 路径对象jmPath
	 */
	createPath(points, style, option={}) {
		const path = this.createShape('path',{
			points: points,
			style: style,
			...option
		});
		return path;
	}

	/**
	 * 生成直线
	 * 
	 * @method createLine
	 * @param {point} start 直线的起点
	 * @param {point} end 直线的终点
	 * @param {style} 直线的样式
	 * @return {jmLine} 直线对象
	 */
	createLine(start, end, style) {
		const line = this.createShape('line', {
			start: start,
			end: end,
			style: style
		});
		return line;
	}

	/**
	 * 缩小整个画布按比例0.9
	 * 
	 * @method zoomOut
	 */
	zoomOut() {
		this.scale(0.9 ,0.9);
	}

	/**
	 * 放大 每次增大0.1的比例
	 * 
	 * @method zoomIn
	 */
	zoomIn() {		
		this.scale(1.1 ,1.1);
	}

	/**
	 * 大小复原
	 * 
	 * @method zoomActual
	 */
	zoomActual() {
		if(this.scaleSize) {
			this.scale(1 / this.scaleSize.x ,1 / this.scaleSize.y);	
		}
		else {
			this.scale(1 ,1);	
		}	
	}

	/**
	 * 放大缩小画布
	 * 
	 * @method scale
	 * @param {number} dx 缩放X轴比例
	 * @param {number} dy 缩放Y轴比例
	 */
	scale(dx, dy) {
		if(!this.normalSize) {
			this.normalSize = {
				width: this.canvas.width,
				height: this.canvas.height
			};
		}
		
		//this.context.scale && this.context.scale(dx,dy);
		if(!this.scaleSize) {
			this.scaleSize = {x: 1,y: 1};
		}
		else {
			this.scaleSize = {x: dx * this.scaleSize.x, y: dy * this.scaleSize.y};
		}
		this.canvas.style && (this.canvas.style.transform = `scale(${this.scaleSize.x}, ${this.scaleSize.y})`);
	}

	/**
	 * 设置缩放因子
	 * 支持以指定点为中心进行缩放，保持该点在屏幕上的位置不变
	 * 
	 * @method setZoom
	 * @param {number} zoom 缩放因子（建议范围：0.1 - 10）
	 * @param {number} [x] 缩放中心X坐标（画布坐标）
	 * @param {number} [y] 缩放中心Y坐标（画布坐标）
	 * @return {jmGraph} 返回当前实例，支持链式调用
	 */
	setZoom(zoom, x, y) {
		// 参数验证
		if(typeof zoom !== 'number' || isNaN(zoom)) {
			console.warn('jmGraph: setZoom - 无效的缩放因子');
			return this;
		}
		
		// 限制缩放范围，防止过度缩放导致性能问题或显示异常
		const minZoom = 0.1;  // 最小缩放到10%
		const maxZoom = 10;   // 最大放大到10倍
		zoom = Math.max(minZoom, Math.min(maxZoom, zoom));
		
		if (x !== undefined && y !== undefined) {
			// 计算缩放前后的坐标偏移
			// 保持缩放中心点在屏幕上的位置不变
			const oldZoom = this.scaleFactor;
			const newZoom = zoom;
			
			// 调整平移量以保持缩放中心位置不变
			this.translation.x = x - (x - this.translation.x) * (newZoom / oldZoom);
			this.translation.y = y - (y - this.translation.y) * (newZoom / oldZoom);
		}
		
		this.scaleFactor = zoom;
		this.needUpdate = true;
		this.redraw();
		
		return this; // 支持链式调用
	}

	/**
	 * 平移画布
	 * 移动画布视图，改变可视区域
	 * 
	 * @method pan
	 * @param {number} dx X轴平移量（像素）
	 * @param {number} dy Y轴平移量（像素）
	 * @return {jmGraph} 返回当前实例，支持链式调用
	 */
	pan(dx, dy) {
		// 参数验证
		if(typeof dx !== 'number' || typeof dy !== 'number' || isNaN(dx) || isNaN(dy)) {
			console.warn('jmGraph: pan - 无效的平移参数');
			return this;
		}
		
		this.translation.x += dx;
		this.translation.y += dy;
		this.needUpdate = true;
		this.redraw();
		
		return this; // 支持链式调用
	}

	/**
	 * 重置缩放和平移
	 * 恢复画布到初始状态（缩放为1，平移为0）
	 * 
	 * @method resetTransform
	 * @return {jmGraph} 返回当前实例，支持链式调用
	 */
	resetTransform() {
		this.scaleFactor = 1;
		this.translation = {x: 0, y: 0};
		this.needUpdate = true;
		this.redraw();
		
		return this; // 支持链式调用
	}

	/**
	 * 保存为base64图形数据
	 * 
	 * @method toDataURL
	 * @return {string} 当前画布图的base64字符串
	 */
	toDataURL() {
		let data = this.canvas.toDataURL?this.canvas.toDataURL():'';
		return data;
	}

	/**
	 * 导出为PNG图片
	 * 使用Canvas的toDataURL方法导出当前画布内容
	 * 
	 * @method exportToPNG
	 * @param {string} [fileName='jmgraph-export'] 文件名（不含扩展名）
	 * @param {string} [format='image/png'] 图片格式，支持image/png和image/jpeg
	 * @param {number} [quality=0.9] 图片质量（0-1之间，仅对JPEG格式有效）
	 */
	exportToPNG(fileName = 'jmgraph-export', format = 'image/png', quality = 0.9) {
		try {
			// 确保画布已渲染
			this.redraw();
			
			const dataURL = this.canvas.toDataURL(format, quality);
			this.downloadFile(dataURL, fileName, 'png');
		} catch(error) {
			console.error('jmGraph: exportToPNG - 导出失败', error);
		}
	}

	/**
	 * 导出为JPEG图片
	 * 
	 * @method exportToJPEG
	 * @param {string} [fileName='jmgraph-export'] 文件名（不含扩展名）
	 * @param {number} [quality=0.9] 图片质量（0-1之间）
	 */
	exportToJPEG(fileName = 'jmgraph-export', quality = 0.9) {
		this.exportToPNG(fileName, 'image/jpeg', quality);
	}

	/**
	 * 导出为SVG文件
	 * 将当前画布内容转换为SVG格式
	 * 注意：只有实现了toSVG方法的形状才能被导出
	 * 
	 * @method exportToSVG
	 * @param {string} [fileName='jmgraph-export'] 文件名（不含扩展名）
	 */
	exportToSVG(fileName = 'jmgraph-export') {
		try {
			const svg = this.toSVG();
			const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
			const url = URL.createObjectURL(blob);
			this.downloadFile(url, fileName, 'svg');
			
			// 释放URL对象，避免内存泄漏
			setTimeout(() => URL.revokeObjectURL(url), 100);
		} catch(error) {
			console.error('jmGraph: exportToSVG - 导出失败', error);
		}
	}

	/**
	 * 遍历所有形状，生成SVG标记
	 *
	 * @method toSVG
	 * @return {string} SVG字符串
	 */
	toSVG() {
		// SVG头部，包含命名空间和画布尺寸
		let svg = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}">`;

		// 添加背景色（如果有）
		if(this.style && this.style.fill) {
			svg += `<rect width="100%" height="100%" fill="${this.style.fill}"/>`;
		}

		// 遍历所有直接添加的形状
		this.children.each((i, shape) => {
			if(shape.toSVG) {
				svg += shape.toSVG();
			}
		});

		svg += '</svg>';
		return svg;
	}

	/**
	 * 下载文件
	 * 创建临时链接元素触发浏览器下载
	 * 
	 * @method downloadFile
	 * @private
	 * @param {string} url 文件URL或Data URL
	 * @param {string} fileName 文件名（不含扩展名）
	 * @param {string} extension 文件扩展名
	 */
	downloadFile(url, fileName, extension) {
		// 创建临时链接元素
		const link = document.createElement('a');
		link.href = url;
		link.download = `${fileName}.${extension}`;
		
		// 添加到DOM并触发点击
		document.body.appendChild(link);
		link.click();
		
		// 清理DOM
		document.body.removeChild(link);
	}

	/** 
	 * 自动刷新画版
	 * @param {function} callback 执行回调
	 */
	autoRefresh(callback) {
		if(this.___isAutoRefreshing) return;
		const self = this;
		this.___isAutoRefreshing = true;
		
		const refreshStartTime = Date.now();
		function update() {
			if(self.destroyed) {
				self.___isAutoRefreshing = false;
				return;// 已销毁
			}
			if(self.needUpdate) self.redraw();

			const time = Date.now() - refreshStartTime;
			// 触发刷新事件
			self.emit('update', time);

			// 直接 requestAnimationFrame，无需先 cancel
			self.__requestAnimationFrameFunHandler = self.requestAnimationFrame(update);
			if(callback) callback();
		}
		self.__requestAnimationFrameFunHandler && this.cancelAnimationFrame(self.__requestAnimationFrameFunHandler);
		self.__requestAnimationFrameFunHandler = this.requestAnimationFrame(update);
		return this;
	}

	// 销毁当前对象
	destroy() {
		this.eventHandler.destroy();
		this.destroyed = true;// 标记已销毁
	}
}

const shapes = {
    "arc": jmArc,
    "arrow": jmArrow,
    "bezier": jmBezier,
    "circle": jmCircle,
    "harc": jmHArc,
    "line": jmLine,
    "prismatic": jmPrismatic,
    "rect": jmRect,
    "arrowline": jmArrowLine,
    "image": jmImage,
    "img": jmImage,
    "label": jmLabel,
    "resize": jmResize,
    "ellipse": jmEllipse,
    "polygon": jmPolygon,
    "star": jmStar
};

class jmGraphImpl extends jmGraph {
    constructor(canvas, option, callback) {
        // 合并shapes
        option = Object.assign({}, option);
        option.shapes = Object.assign(shapes, option.shapes||{});

        if(typeof option == 'function') {
			callback = option;
			option = {};
		} 
        
        super(canvas, option, callback);
    }

    static create(...args) {
        return new jmGraphImpl(...args);
    }
}

/**
 * 基础样式
 *
 * @class jmChartStyle
 * @module jmChart
 * @static
 */
var defaultStyle = {
  layout: 'normal',
  // inside 二边不对齐Y轴，内缩一个刻度 | normal
  margin: {
    left: 40,
    top: 20,
    right: 20,
    bottom: 40
  },
  itemLabel: {
    textAlign: 'left',
    textBaseline: 'middle',
    font: '12px Arial',
    fill: '#000'
  },
  // 跟随标线
  markLine: {
    x: true,
    // 显示X标线
    y: true,
    // 显示Y标线
    stroke: '#EB792A',
    fill: '#CCC',
    lineWidth: 1,
    radius: 5,
    // 中间小圆圈大小
    zIndex: 20
  },
  legend: {
    stroke: 'transparent',
    lineWidth: 0,
    margin: {
      left: 10,
      top: 10,
      right: 20,
      bottom: 10
    },
    width: 200,
    height: 0,
    item: {
      shape: {
        width: 20,
        height: 15
      },
      label: {
        textAlign: 'left',
        textBaseline: 'middle',
        font: '12px Arial',
        fill: '#000'
      },
      normal: {
        fill: 'transparent',
        cursor: 'default'
      },
      hover: {
        fill: '#ccc',
        cursor: 'pointer'
      }
    }
  },
  chartArea: {
    stroke: 'rgb(229,229,229)',
    zIndex: 5
  },
  axis: {
    stroke: '#05468E',
    lineWidth: 1,
    zIndex: 1,
    // 显示网格
    grid: {
      x: true,
      // 是否显示网格
      y: false,
      stroke: 'rgb(229,229,229)',
      lineType: 'dotted',
      // 虚线，不填为实线
      dashLength: 6,
      //虚线条间隔，默认5
      lineWidth: 1,
      zIndex: 0
    },
    // 如果标签居中 center，则把二头的标签左边的左对齐，右边的右对齐
    align: 'normal',
    xLabel: {
      count: 5,
      length: 5,
      fill: '#000',
      stroke: '#000',
      margin: {
        left: 0,
        top: 10,
        right: 6,
        bottom: 0
      },
      textAlign: 'center',
      textBaseline: 'top',
      font: '12px Arial',
      zIndex: 20,
      // 旋转角度
      rotation: {
        angle: 0,
        point: {
          x: 0,
          y: 0
        }
      }
    },
    yLabel: {
      count: 5,
      length: 1,
      fill: '#000',
      margin: {
        left: 2,
        top: 6,
        right: 8,
        bottom: 0
      },
      textAlign: 'right',
      textBaseline: 'middle',
      font: '12px Arial',
      zIndex: 20,
      // 旋转角度
      rotation: {
        angle: 0,
        point: {
          x: 0,
          y: 0
        }
      }
    }
  },
  // 图形样式集
  chartColors: ['#249FDA', '#EA3B7C', '#8EBC00', '#309B46', '#4B507E', '#D8E404', '#EB792A', '#A00DA0'],
  /*tooltip: {
  	'background-color': 'rgb(255,255,255)',
  	'padding':'4px',
  	'opacity':'0.8',
  	'border':'1px solid #000',
  	'box-shadow': '0 0 3px #000',
  	'border-radius': '6px'
  },*/
  line: {
    normal: {
      lineWidth: 1,
      zIndex: 18,
      cursor: 'default'
    },
    hover: {
      lineWidth: 4,
      //zIndex: 100,
      cursor: 'pointer'
    },
    lineWidth: 1,
    zIndex: 18,
    cursor: 'default',
    radius: 3,
    fill: null,
    showItem: false,
    // 是否展示圆点
    item: {
      fill: '#fff',
      zIndex: 19
    },
    // 默认不填充，需要填满请配置{fill:'',stroke:''}
    area: false
  },
  stackLine: {
    normal: {
      lineWidth: 1,
      zIndex: 18,
      cursor: 'default'
    },
    hover: {
      lineWidth: 4,
      //zIndex: 100,
      cursor: 'pointer'
    },
    lineWidth: 1,
    zIndex: 18,
    cursor: 'default',
    radius: 3,
    fill: null,
    showItem: true,
    // 是否展示圆点
    item: {
      fill: '#fff',
      zIndex: 19
    },
    // 默认不填充，需要填满请配置{fill:'',stroke:''}
    area: false
  },
  range: {
    normal: {
      lineWidth: 1,
      zIndex: 18,
      cursor: 'default'
    },
    hover: {
      lineWidth: 4,
      cursor: 'pointer'
    },
    lineWidth: 1,
    zIndex: 18,
    cursor: 'default',
    radius: 3,
    fill: null,
    showItem: true,
    item: {
      fill: '#fff',
      zIndex: 19
    },
    area: {
      fill: null,
      opacity: 0.3
    }
  },
  bar: {
    normal: {
      lineWidth: 1,
      zIndex: 17,
      cursor: 'default',
      opacity: 0.8
    },
    hover: {
      lineWidth: 4,
      //zIndex: 100,
      opacity: 1,
      cursor: 'pointer'
    },
    lineWidth: 1,
    // 柱子宽占比，决定了柱子相对于总宽度
    perWidth: 0.5,
    zIndex: 17,
    cursor: 'default',
    close: true,
    shadow: {
      x: 1,
      y: 1,
      blur: 2,
      color: '#000'
    }
  },
  pie: {
    normal: {
      zIndex: 11,
      cursor: 'default',
      opacity: 0.8
    },
    hover: {
      //zIndex: 100,
      opacity: 1,
      cursor: 'pointer'
    },
    margin: {
      left: 10,
      top: 10,
      right: 10,
      bottom: 10
    },
    lineWidth: 1,
    zIndex: 11,
    cursor: 'default',
    close: true,
    shadow: {
      x: 1,
      y: 1,
      blur: 2,
      color: '#ccc'
    }
  },
  radar: {
    normal: {
      zIndex: 11,
      cursor: 'default',
      opacity: 0.8
    },
    hover: {
      //zIndex: 100,
      opacity: 1,
      cursor: 'pointer'
    },
    margin: {
      left: 10,
      top: 10,
      right: 10,
      bottom: 10
    },
    lineWidth: 1,
    zIndex: 11,
    cursor: 'default',
    close: true,
    shadow: {
      x: 1,
      y: 1,
      blur: 2,
      color: '#ccc'
    }
  },
  candlestick: {
    normal: {
      lineWidth: 1,
      zIndex: 18,
      cursor: 'default'
    },
    hover: {
      //zIndex: 100,
      cursor: 'pointer'
    },
    perWidth: 0.5,
    // 阴线颜色
    negativeColor: 'green',
    // 阳线颜色
    masculineColor: 'red',
    lineWidth: 1
  },
  scatter: {
    normal: {
      lineWidth: 1,
      zIndex: 18,
      cursor: 'default'
    },
    hover: {
      //zIndex: 100,
      cursor: 'pointer'
    },
    radius: 5,
    lineWidth: 1,
    zIndex: 18,
    cursor: 'default',
    item: {
      fill: '#fff',
      zIndex: 19
    }
  },
  bubble: {
    normal: {
      lineWidth: 1,
      zIndex: 18,
      cursor: 'default'
    },
    hover: {
      //zIndex: 100,
      cursor: 'pointer'
    },
    radius: 5,
    radiusScale: 1,
    opacity: 0.6,
    lineWidth: 1,
    zIndex: 18,
    cursor: 'default',
    item: {
      fill: '#fff',
      zIndex: 19
    }
  },
  heatmap: {
    normal: {
      lineWidth: 1,
      zIndex: 18,
      cursor: 'default'
    },
    hover: {
      //zIndex: 100,
      cursor: 'pointer'
    },
    cellWidth: 20,
    cellHeight: 20,
    lineWidth: 1,
    zIndex: 18,
    cursor: 'default',
    defaultColor: '#ccc',
    colorGradient: ['#313695',
    // 蓝色（最小值）
    '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026' // 红色（最大值）
    ],
    item: {
      fill: '#fff',
      zIndex: 19
    }
  },
  gauge: {
    normal: {
      lineWidth: 1,
      zIndex: 11,
      cursor: 'default'
    },
    hover: {
      //zIndex: 100,
      cursor: 'pointer'
    },
    min: 0,
    max: 100,
    startAngle: -150,
    endAngle: 150,
    radiusScale: 0.8,
    lineWidth: 15,
    backgroundStroke: '#e0e0e0',
    backgroundFill: 'transparent',
    backgroundLineWidth: 20,
    gradient: true,
    gradientColors: [{
      offset: 0,
      color: '#52c41a'
    },
    // 绿色
    {
      offset: 0.7,
      color: '#faad14'
    },
    // 黄色
    {
      offset: 1,
      color: '#f5222d'
    } // 红色
    ],
    tickCount: 10,
    tickColor: '#666',
    tickLabelColor: '#333',
    pointerColor: '#333',
    pointerWidth: 3,
    centerColor: '#333',
    centerRadius: 8,
    valueColor: '#333',
    valueFont: '24px Arial',
    unit: '',
    unitColor: '#666',
    unitFont: '14px Arial',
    zIndex: 11,
    cursor: 'default'
  },
  area: {
    normal: {
      lineWidth: 1,
      zIndex: 18,
      cursor: 'default'
    },
    hover: {
      lineWidth: 4,
      //zIndex: 100,
      cursor: 'pointer'
    },
    lineWidth: 1,
    zIndex: 18,
    cursor: 'default',
    radius: 3,
    fill: null,
    showItem: false,
    // 是否展示圆点
    item: {
      fill: '#fff',
      zIndex: 19
    },
    // 默认填充，使用渐变色
    area: {
      stroke: 'transparent',
      fill: null
    }
  },
  waterfall: {
    normal: {
      lineWidth: 1,
      zIndex: 17,
      cursor: 'default',
      opacity: 0.8
    },
    hover: {
      lineWidth: 4,
      //zIndex: 100,
      opacity: 1,
      cursor: 'pointer'
    },
    lineWidth: 1,
    // 柱子宽占比，决定了柱子相对于总宽度
    perWidth: 0.5,
    zIndex: 17,
    cursor: 'default',
    increaseColor: '#52c41a',
    // 增长颜色
    decreaseColor: '#f5222d',
    // 减少颜色
    connectorColor: '#999',
    // 连接线颜色
    close: true,
    shadow: {
      x: 1,
      y: 1,
      blur: 2,
      color: '#000'
    }
  },
  funnel: {
    normal: {
      lineWidth: 1,
      zIndex: 17,
      cursor: 'default',
      opacity: 0.9
    },
    hover: {
      opacity: 1,
      cursor: 'pointer'
    },
    lineWidth: 1,
    zIndex: 17,
    cursor: 'default',
    align: 'center',
    gap: 2,
    stroke: '#fff',
    label: {
      show: true,
      fill: '#fff',
      font: '12px Arial'
    }
  },
  ringProgress: {
    normal: {
      zIndex: 11,
      cursor: 'default'
    },
    hover: {
      cursor: 'pointer'
    },
    lineWidth: 20,
    startAngle: -90,
    max: 100,
    ringGap: 10,
    backgroundColor: '#e0e0e0',
    showLabel: true,
    labelColor: '#333',
    labelFont: '14px Arial',
    zIndex: 11,
    cursor: 'default'
  },
  boxPlot: {
    normal: {
      lineWidth: 1,
      zIndex: 17,
      cursor: 'default'
    },
    hover: {
      cursor: 'pointer'
    },
    lineWidth: 1,
    boxWidth: null,
    whiskerWidth: 1,
    whiskerLength: 20,
    boxFill: 'transparent',
    zIndex: 17,
    cursor: 'default',
    label: {
      show: true,
      fill: '#333',
      font: '12px Arial'
    }
  },
  wordCloud: {
    normal: {
      zIndex: 11,
      cursor: 'default'
    },
    hover: {
      cursor: 'pointer'
    },
    minFontSize: 12,
    maxFontSize: 60,
    spiral: true,
    zIndex: 11,
    cursor: 'default'
  }
};

const MAX_LABEL_COUNT = 10;

/**
 * 轴
 *
 * @class jmAxis
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {string} [type] 轴类型(x/y/radar),默认为x
 * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
 * @param {object} [style] 样式
 */

class jmAxis extends jmArrowLine {
  constructor(options) {
    super(options);
    /**
     * 轴类型(x/y/radar),默认为x
     *
     * @property type
     * @type string
     */
    _defineProperty(this, "type", 'x');
    /**
     * 对应的字段
     */
    _defineProperty(this, "field", '');
    /**
     * 轴标签起始坐标
     *
     * @property labelStart
     * @type number
     */
    _defineProperty(this, "labelStart", 0);
    /**
     * 否从0开始
     *
     * @property type
     * @type bool
     * @for jmAxis
     */
    _defineProperty(this, "zeroBase", false);
    /**
     * 显示标签个数
     *
     * @property labelCount
     * @type number
     * @for jmAxis
     */
    _defineProperty(this, "labelCount", 1);
    /**
     * 轴上的刻度，由动态计算出
     */
    _defineProperty(this, "scalePoints", []);
    /**
     * 轴上的标签，只读
     */
    _defineProperty(this, "labels", []);
    this.arrowVisible = !!options.arrowVisible;
    this.zeroBase = options.zeroBase || false;
    this.labelCount = Math.min(options.labelCount || 5, MAX_LABEL_COUNT);
    this.type = options.type || 'x';
    if (this.type == 'x') {
      this.dataType = options.dataType || 'string';
    } else {
      this.dataType = options.dataType || 'number';
    }
    this.field = options.field || '';
    this.index = options.index || 0;
    this.gridLines = [];
    this.init(options);
  }
  init(options) {
    options = options || {};
    if (options.style) this.graph.utils.clone(options.style, this.style, true);
    this.field = options.field || this.field || '';
    this.radarOption = options.radarOption;
    if (this.type == 'x') {
      if (typeof options.maxXValue !== 'undefined') this.maxValue = options.maxXValue;
      if (typeof options.minXValue !== 'undefined') this.minValue = options.minXValue;
    } else {
      if (typeof options.maxYValue !== 'undefined' && (options.maxYValue > this.maxValue || typeof this.maxValue === 'undefined')) {
        this.maxValue = options.maxYValue;
      }
      if (typeof options.minYValue !== 'undefined' && (options.minYValue < this.minValue || typeof this.minValue === 'undefined')) {
        this.minValue = options.minYValue;
      }
    }
  }
  /**
   * 关联访问的是chart的数据源
   */
  get data() {
    return this.graph.data;
  }
  set data(d) {
    this.graph.data = d;
  }

  // 生成绘制点，
  // 重写原函数
  initPoints() {
    // 如果是雷达图
    if (this.radarOption && this.type === 'x') {
      this.points = [];
      for (const axis of this.radarOption.yAxises) {
        axis.end && this.points.push(axis.end);
      }
      this.points.push(this.points[0]);
      return this.points;
    } else {
      return super.initPoints();
    }
  }

  /**
   * 计算当前轴的位置
   * 
   * @method reset
   */
  reset() {
    const bounds = this.graph.chartArea.getBounds(); // 获取画图区域
    switch (this.type) {
      case 'x':
        {
          //初始化显示标签个数
          this.labelCount = this.style.xLabel.count || 5;
          // 如果是雷达图，则画栅格线
          if (this.radarOption) {
            if (this.style.grid && this.style.grid.x) {
              for (let i = 1; i < this.labelCount + 1; i++) {
                const points = [];
                const curRadius = this.radarOption.radius / this.labelCount * i;
                for (const axis of this.radarOption.yAxises) {
                  if (!axis.radarOption) continue;
                  const point = {};
                  point.x = axis.radarOption.center.x + axis.radarOption.cos * curRadius + bounds.left;
                  point.y = axis.radarOption.center.y - axis.radarOption.sin * curRadius + bounds.top;
                  points.push(point);
                }
                // 画栅格线
                for (let j = 0; j < points.length; j++) {
                  const start = points[j];
                  const end = points[j + 1] || points[0];
                  const gridLine = this.graph.createShape('line', {
                    start,
                    end,
                    style: this.style.grid
                  });
                  this.parent.children.add(gridLine);
                  this.gridLines.push(gridLine);
                }
              }
            }
            break;
          }
          this.start.x = bounds.left;
          this.start.y = bounds.bottom;
          this.end.x = bounds.right;
          this.end.y = bounds.bottom;

          // zeroBase 时才需要移到0位置，否则依然为沉底
          if (this.graph.baseY === 0) {
            const yAxis = this.graph.yAxises[1];
            if (!yAxis) return;
            this.value = 0;
            const y = this.start.y + yAxis.min() * yAxis.step();
            this.start.y = this.end.y = y;
          }
          break;
        }
      case 'y':
        {
          //初始化显示标签个数
          this.labelCount = this.style.yLabel.count || 5;
          const index = this.index || 1;
          // 如果是雷达图，则画发散的线
          if (this.radarOption) {
            this.end.x = this.radarOption.center.x + this.radarOption.cos * this.radarOption.radius + bounds.left;
            this.end.y = this.radarOption.center.y - this.radarOption.sin * this.radarOption.radius + bounds.top;
            this.start.x = this.radarOption.center.x + bounds.left;
            this.start.y = this.radarOption.center.y + bounds.top;
          } else {
            let xoffset = bounds.left;

            //多Y轴时，第二个为右边第一轴，其它的依此递推
            if (index == 2) {
              xoffset = bounds.right;
            } else if (index > 2) {
              xoffset = this.graph.yAxises[index - 1].start.x + this.graph.yAxises[index - 1].width + 10;
            }
            this.start.x = xoffset;
            this.start.y = bounds.bottom;
            this.end.x = this.start.x;
            this.end.y = bounds.top;
          }
          break;
        }
    }
    this.createLabel();
  }

  // 绘制完成后，生成label标签
  draw() {
    this.points.push(...this.scalePoints); // 把刻度也画出来
    super.draw();
  }

  /**
   * 生成轴标签
   *
   * @method createLabel
   */
  createLabel() {
    if (this.visible === false) return;

    // 雷达图的标签单独处理
    if (this.radarOption) {
      return this.createRadarLabel();
    }

    //如果是？X轴则执行X轴标签生成
    if (this.type == 'x') {
      this.createXLabel();
    } else if (this.type == 'y') {
      this.createYLabel();
    }
  }

  /**
   * 生成X轴标签
   *
   * @method createXLabel
   * @private
   */
  createXLabel() {
    //var max = this.max();
    //var min = this.min();
    const step = this.step();
    this.scalePoints = []; // 刻度点集合
    //最多显示标签个数
    //var count = this.style.xLabel.count || this.data.length;	
    //字符串轴。则显示每个标签	
    const format = this.option.format || this.format;
    const top = this.style.xLabel.margin.top || 0;
    for (let i = 0; i < this.data.length; i++) {
      const d = this.data[i];
      const v = d[this.field];

      // 不显示就不生成label。这里性能影响很大
      const text = format.call(this, v, d, i); // 格式化label
      if (!text) continue;

      /// 只有一条数据，就取这条数据就可以了	
      const w = i * step;
      const label = this.graph.createShape('label', {
        style: this.style.xLabel
      });
      label.data = d; // 当前点的数据结构值
      label.text = text;
      this.labels.push(label);
      this.children.add(label);
      label.width = label.testSize().width + 2;
      label.height = 15;
      const pos = {
        x: this.labelStart + w,
        y: top
      };

      // 指定要显示网格
      if (this.style.grid && this.style.grid.y) {
        // 它的坐标是相对于轴的，所以Y轴会用负的区域高度
        const line = this.graph.createShape('line', {
          start: {
            x: pos.x,
            y: 0
          },
          end: {
            x: pos.x,
            y: -this.graph.chartArea.height
          },
          style: this.style.grid
        });
        this.children.add(line);
      }

      //在轴上画小标记m表示移至当前点开画
      this.scalePoints.push({
        x: pos.x + this.start.x,
        y: this.start.y,
        m: true
      });
      this.scalePoints.push({
        x: pos.x + this.start.x,
        y: this.start.y + (this.style.length || 5)
      });

      //如果进行了旋转，则处理位移
      const rotation = label.style.rotation;
      if (rotation && rotation.angle) {
        //设定旋转原点为label左上角					
        rotation.point = pos;
        //当旋转后，其原点位移至左上角，所有当前控件必须反向移位其父容器位置
        label.position = {
          x: -this.graph.chartArea.position.x,
          y: -this.graph.chartArea.position.y
        };
      } else {
        // 如果标签居中，则把二头的标签左边的左对齐，右边的右对齐
        if (this.style.align === 'center' && this.data.length > 1 && (i === 0 || i === this.data.length - 1)) {
          if (i === this.data.length - 1) {
            pos.x -= label.width;
          }
        } else {
          pos.x -= label.width / 2; //向左偏移半个label宽度
        }
        label.position = pos;
      }
    }
  }

  /**
   * 生成Y轴标签
   *
   * @method createYLabel
   * @private
   */
  createYLabel() {
    const max = this.max();
    const min = this.min();
    const step = this.step();
    const index = this.index || 1;
    this.scalePoints = []; // 刻度点集合

    let count = this.labelCount;
    const mm = max - min;
    let pervalue = mm / count || 1;
    const format = this.option.format || this.format;
    const marginLeft = this.style.yLabel.margin.left || 0;
    const marginRight = this.style.yLabel.margin.right || 0;
    let p = 0;
    for (let i = 0; i < count + 1; i++) {
      p = min + pervalue * i;
      if (p > max || i === count) p = max;
      const h = (p - min) * step; // 当前点的偏移高度
      const label = this.graph.createShape('label', {
        style: this.style.yLabel
      });
      label.text = format.call(this, p, label); // 格式化label
      this.labels.push(label);
      this.children.add(label);
      const w = label.testSize().width;
      const offy = this.height - h; // 刻度的偏移量
      // label的位置
      const pos = {
        x: 0,
        y: 0
      };

      //轴的宽度
      const axiswidth = marginLeft + marginRight + w;
      this.width = Math.max(axiswidth, this.width);

      //计算标签位置
      if (index <= 1) {
        pos.x = -w - marginRight;
        pos.y = offy - label.height / 2;

        //在轴上画小标记m表示移至当前点开画
        this.scalePoints.push({
          x: this.start.x,
          y: offy + this.end.y,
          m: true
        });
        this.scalePoints.push({
          x: this.start.x,
          y: offy + this.end.y
        });

        // 指定要显示网格
        if (!this.radarOption && this.style.grid && this.style.grid.x) {
          // 它的坐标是相对于轴的，所以Y轴会用负的区域高度
          const line = this.graph.createShape('line', {
            start: {
              x: 0,
              y: offy
            },
            end: {
              x: this.graph.chartArea.width,
              y: offy
            },
            style: this.style.grid
          });
          this.children.add(line);
        }
      } else {
        pos.x = marginLeft;
        pos.y = offy - label.height / 2;

        //在轴上画小标记m表示移至当前点开画
        this.scalePoints.push({
          x: this.start.x,
          y: offy + this.end.y,
          m: true
        });
        this.scalePoints.push({
          x: this.start.x,
          y: offy + this.end.y
        });
      }

      // label对齐方式
      switch (this.style.yLabel.textAlign) {
        case 'center':
          {
            pos.x = pos.x / 2 - w / 2;
            break;
          }
        case 'right':
          {
            if (index <= 1) pos.x = -axiswidth;else {
              // 轴在最右边时，轴宽减去label宽就是右对齐
              pos.x = axiswidth - w;
            }
            break;
          }
      }

      //如果进行了旋转，则处理位移
      const rotation = label.style.rotation;
      if (rotation && rotation.angle) {
        label.translate = pos; //先位移再旋转
        label.position = {
          x: -w / 2,
          y: 0
        };
      } else {
        label.position = pos;
      }
    }
  }

  /**
   * 生成雷达图的Y轴标签
   */
  createRadarLabel() {
    const format = this.option.format;
    const bounds = this.graph.chartArea.getBounds(); // 获取画图区域
    const self = this;
    const label = this.graph.createShape('label', {
      style: this.style.yLabel,
      position: function () {
        // 因为axis是相对于chart的，而center是相对于chartArea的，所以要计算axis位置相对于chartArea来比较
        const pos = {
          x: self.end.x - bounds.left,
          y: self.end.y - bounds.top
        };
        const size = this.testSize();
        if (pos.x < self.radarOption.center.x) {
          pos.x -= size.width;
        }
        if (pos.y < self.radarOption.center.y) {
          pos.y -= size.height;
        }
        return pos;
      }
    });
    label.text = typeof format === 'function' ? format.call(this, label) : this.field; // 格式化label
    this.labels.push(label);
    this.graph.chartArea.children.add(label);
  }

  /**
  * 获取当前轴所占宽
  *
  * @method width
  */
  get width() {
    if (this._width) {
      return this._width;
    }
    return Math.abs(this.end.x - this.start.x);
  }
  set width(w) {
    this._width = w;
  }

  /**
  * 获取当前轴所占高
  *
  * @method height
  */
  get height() {
    return Math.abs(this.end.y - this.start.y);
  }
  // 这里设置高度没意义
  set height(h) {}

  /**
  * 获取或设置当前轴最大值
  *
  * @method max
  * @param {number/date/string} 当前轴的最大值
  * @return 当前轴的最大值
  */
  max(m) {
    if (typeof m !== 'undefined') {
      //如果为0为基线，则最小值不能大于0
      if (this.dataType == 'number' && m < 0 && this.zeroBase) {
        m = 0;
      }
      this._max = this._max != null && typeof this._max != 'undefined' ? Math.max(m, this._max) : m;
      // 如果有指定默认最大值，则不超过它就采用它
      if (typeof this.maxValue != 'undefined') this._max = Math.max(this.maxValue, this._max);
    }
    //如果为字符串，则返回分类个数
    if (this.dataType == 'string' && this.data) {
      return this.data.length;
    }

    //如果是数字类型，则在最大值基础上加一定的值
    if (this.dataType == 'number') {
      m = this._max;

      // 如果有指定默认最大值，则不超过它就采用它
      if (typeof this.maxValue != 'undefined' && m <= this.maxValue) {
        return this.maxValue;
      }
      if (m <= 0) {
        if (m >= -10) m = 0;else m = -10;
      } else if (m > 500) {
        m = Math.ceil(m / 100);
        m = m * 100 + 100;
      } else if (m > 100) {
        m = Math.ceil(m / 50);
        m = m * 50 + 50;
      } else if (m > 10) {
        m = Math.ceil(m / 10);
        m = m * 10 + 10;
      } else {
        m = Math.ceil(m);
      }
      return m;
    }
    return this._max;
  }

  /**
  * 获取或设置当前轴最小值
  *
  * @method min
  * @param {number/date/string} 当前轴的最小值
  * @return 当前轴的最小值
  */
  min(m) {
    if (typeof m !== 'undefined') {
      //如果为0为基线，则最小值不能大于0
      if (this.dataType == 'number' && m > 0 && this.zeroBase) {
        m = 0;
      }
      this._min = this._min != null && typeof this._min != 'undefined' ? Math.min(m, this._min) : m;
      // 如果有指定默认最小值，则不小于它就采用它
      if (typeof this.minValue != 'undefined') this._min = Math.min(this.minValue, this._min);
    }

    //如果是数字类型，则在最小值基础上减去一定的值
    if (this.dataType == 'number') {
      m = this._min;

      // 如果有指定默认最小值，则不小于它就采用它
      if (typeof this.minValue != 'undefined') {
        return typeof m !== 'undefined' ? Math.min(this.minValue, m) : this.minValue;
      }
      if (m >= 0) {
        if (m <= 10) m = 0;else {
          m = Math.floor(m / 10) * 10 - 10;
        }
      } else if (m < -500) {
        m = Math.floor(m / 100);
        m = m * 100 - 100;
      } else if (m < -100) {
        m = Math.floor(m / 50);
        m = m * 50 - 50;
      } else if (m < -10) {
        m = Math.floor(m / 10);
        m = m * 10 - 10;
      } else {
        m = Math.floor(m);
      }
      return m;
    }
    //如果为字符串则返回0
    return this.dataType == 'string' ? 0 : this._min;
  }

  /**
   * 清除一些属性
   *
   * @method clear
   */
  clear() {
    this._min = null;
    this._max = null;
    this._width = null; // 清除宽度缓存
    this.children.each((i, c) => {
      c.remove();
    }, true);
    // 清空栅格线
    if (this.gridLines && this.gridLines.length) {
      for (let i = 0; i < this.gridLines.length; i++) {
        this.gridLines[i].remove();
      }
    }
    this.labels && this.labels.forEach(label => {
      label.remove();
    });
    this.labels = [];
    this.gridLines = [];
  }

  /**
   * 计算当前轴的单位偏移量
   *
   * @method step
   * @return {number} 单位偏移量
   */
  step() {
    if (this.type == 'x') {
      const w = this.radarOption ? this.radarOption.radius : this.width;

      //如果排版为内联，则单位占宽减少一个单位,
      //也就是起始位从一个单位开始
      if (this.graph.style.layout == 'inside') {
        const sp = w / this.max();
        this.labelStart = sp / 2;
        return sp;
      } else {
        this.labelStart = 0;
      }
      let tmp = this.max() - 1;
      if (tmp === 0) tmp = 2; // 只有一个数据的情况，就直接居中
      return w / tmp;
    } else if (this.type == 'y') {
      const h = this.radarOption ? this.radarOption.radius : this.height;
      switch (this.dataType) {
        case 'string':
          {
            return h / this.max();
          }
        case 'date':
        case 'number':
        default:
          {
            let tmp = Math.abs(this.max() - this.min());
            tmp = tmp || 1;
            return h / tmp;
          }
      }
    }
  }
  // 格式化标签值
  format(v, item) {
    return v + '';
  }
}

/**
 * 图例的容器
 *
 * @class jmLegend
 * @module jmChart
 * @param {jmChart} chart 当前图表
 */

class jmLegend extends jmRect {
  constructor(options) {
    //当前图例位置偏移量
    options.position = options.position || {
      x: 0,
      y: 0
    };
    super(options);
    /**
     * 图例放置位置
     */
    _defineProperty(this, "legendPosition", '');
  }
  /**
   * 添加图例
   *
   * @method append
   * @param {jmSeries} series 当前图序列
   * @param {jmControl} shape 当前图例的图形对象
   */
  append(series, shape, options = {}) {
    // 如果不显示图例，就不处理
    if (this.visible === false) return;
    const panel = this.graph.createShape('rect', {
      style: this.graph.utils.clone(this.style.item),
      position: {
        x: 0,
        y: 0
      }
    });
    this.children.add(panel);
    panel.children.add(shape);
    shape.width = panel.style.shape.width;
    shape.height = panel.style.shape.height;
    let name = options.name || series.legendLabel;
    name = series.option.legendFormat ? series.option.legendFormat.call(series, options) : name;
    if (name) {
      //生成图例名称
      const label = this.graph.createShape('label', {
        style: panel.style.label,
        text: name || ''
      });
      label.height = shape.height;
      label.position = {
        x: shape.width + 4,
        y: 0
      };
      panel.children.add(label);
      panel.width = shape.width + label.testSize().width;
    } else {
      panel.width = shape.width;
    }
    panel.height = shape.height;

    //执行进入事件
    options.hover && panel.bind('mouseover touchover', options.hover);
    options.leave && panel.bind('mouseleave touchleave', options.leave);
    const legendPosition = this.legendPosition || this.style.legendPosition || 'right';
    if (legendPosition == 'top' || legendPosition == 'bottom') {
      //顶部和底部图例横排，每次右移位一个单位图例
      panel.position.x = this.width + 15;
      this.width = panel.position.x + panel.width; // 把容器宽指定为所有图例宽和
      this.height = Math.max(panel.height, this.height);
    } else {
      //右边和左边图例竖排
      panel.position.y += this.height + 5;
      this.height = panel.position.y + panel.height;
      this.width = Math.max(panel.width, this.width);
    }
    this.needUpdate = true;
  }

  /**
   * 初始化图例
   *
   * @method init
   */
  init() {
    this.position.x = 0;
    this.position.y = 0;
    this.width = 0;
    this.height = 0;
    this.style.lineWidth = 0;
    this.children.clear();
  }

  /**
   * 重置图例属性,根据图例内容计算期大小并更新画图区域大小
   *
   * @method reset
   */
  reset() {
    if (this.visible !== false) {
      this.position.x = this.graph.chartArea.position.x;
      this.position.y = this.graph.chartArea.position.y;
      const legendPosition = this.legendPosition || this.style.legendPosition;
      switch (legendPosition) {
        case 'left':
          {
            this.graph.chartArea.width = this.graph.chartArea.width - this.width;
            //画图区域向右偏移
            this.graph.chartArea.position.x = this.position.x + this.width + this.style.margin.right;
            break;
          }
        case 'top':
          {
            this.graph.chartArea.height = this.graph.chartArea.height - this.height;
            this.graph.chartArea.position.y = this.position.y + this.height + this.style.margin.bottom;
            break;
          }
        case 'bottom':
          {
            this.graph.chartArea.height = this.graph.chartArea.height - this.height;
            this.position.y = this.graph.chartArea.position.y + this.graph.chartArea.height + this.style.margin.top;
            break;
          }
        case 'right':
        default:
          {
            this.graph.chartArea.width = this.graph.chartArea.width - this.width;
            this.position.x = this.graph.chartArea.position.x + this.graph.chartArea.width + this.style.margin.left;
            break;
          }
      }
    }
  }
}

var utils = {
  /**
   * 对比二个数组数据是否改变
   * @param {Array} source 被对比的数组
   * @param {Array} target 对比数组
   * @param {Function} compare 比较函数
   * @return {boolean} 是否改变
   */
  arrayIsChange(source, target, compare) {
    if (!source || !target) return true;
    if (source.length !== target.length) return true;
    if (typeof compare === 'function') {
      for (let i = 0; i < source.length; i++) {
        if (!compare(source[i], target[i])) return true;
      }
      return false;
    }
    return source !== target;
  }
};

// 公共常量提取到基类，避免每个子类重复定义
const ANIMATION_DATA_THRESHOLD = 100;
const DEFAULT_ANIMATION_COUNT = 10;

/**
 * 图表系列基类
 * 
 * 所有图表类型的基类，提供通用的数据点生成、坐标轴管理、动画控制和图例生成功能。
 * 子类需要实现 init() 方法来定义具体的图表绘制逻辑。
 *
 * @class jmSeries
 * @module jmChart
 * @extends jmPath
 * 
 * @example
 * // 创建自定义图表系列
 * class MySeries extends jmSeries {
 *   init() {
 *     const { points } = this.initDataPoint();
 *     // 绘制图形...
 *   }
 * }
 */
class jmSeries extends jmPath {
  constructor(options) {
    super(options);
    /**
     * 图例名称
     * @type {string}
     */
    _defineProperty(this, "legendLabel", '');
    /**
     * 当前图形下的所有子图形状
     * @type {jmList}
     */
    _defineProperty(this, "shapes", new jmList());
    /**
     * 关键点集合，用于交互和提示
     * @type {Array}
     */
    _defineProperty(this, "keyPoints", []);
    /**
     * 标注集合
     * @type {Array}
     */
    _defineProperty(this, "labels", []);
    /**
     * 图表绑定的数据字段名
     * @type {string|string[]}
     */
    _defineProperty(this, "field", '');
    /**
     * Y轴的基线跟最底层的高度
     * @type {number}
     */
    _defineProperty(this, "baseYHeight", 0);
    /**
     * Y轴基线的Y坐标
     * @type {number}
     */
    _defineProperty(this, "baseY", 0);
    /**
     * 当前基线Y的值，不给basey就会默认采用当前Y轴最小值
     * @type {number}
     */
    _defineProperty(this, "baseYValue", 0);
    this.option = options;
    this.field = options.field || options.fields || '';
    this.index = options.index || 1;
    this.legendLabel = options.legendLabel || '';
    this.___animateCounter = 0;
    this._cache = new Map();
    this.xAxis = this.graph.createXAxis();
    this.xAxis.init({
      field: options.xField
    });
    this.yAxis = this.yAxis || this.graph.createYAxis({
      index: this.index,
      format: options.yLabelFormat || this.graph.option.yLabelFormat
    });
    this.yAxis.init({
      field: Array.isArray(this.field) ? this.field[0] : this.field,
      minYValue: options.minYValue,
      maxYValue: options.maxYValue
    });
  }

  /**
   * 关联访问的是chart的数据源
   * @type {Array}
   */
  get data() {
    return this.graph.data;
  }
  set data(d) {
    this.graph.data = d;
  }

  /**
   * 是否启用动画效果
   * @type {boolean}
   */
  get enableAnimate() {
    if (typeof this.option.enableAnimate !== 'undefined') return !!this.option.enableAnimate;else {
      return this.graph.enableAnimate;
    }
  }
  set enableAnimate(v) {
    this.option.enableAnimate = v;
  }
  /**
   * 初始化数据点
   * 
   * 根据数据生成图表的数据点，支持动画效果。
   * 当数据量小于阈值(100)且启用动画时，会记录上一次的数据点用于动画过渡。
   *
   * @param {...any} args 传递给 createPoints 的参数
   * @returns {Object} 包含 points 和 dataChanged 的对象
   */
  initDataPoint(...args) {
    let dataChanged = false;
    if (this.enableAnimate && this.data && this.data.length < ANIMATION_DATA_THRESHOLD) {
      // 仅在数据引用变化时才做深度比较
      if (this._lastData !== this.data) {
        this.lastPoints = this.graph.utils.clone(this.dataPoints, null, true, obj => {
          if (obj instanceof jmControl) return obj;
        });
        this.dataPoints = this.createPoints(...args);
        dataChanged = utils.arrayIsChange(this.lastPoints, this.dataPoints, (s, t) => {
          return s.x === t.x && s.y === t.y;
        });
        this._lastData = this.data;
      } else {
        this.dataPoints = this.createPoints(...args);
      }
      if (dataChanged) {
        this.___animateCounter = 0;
      }
    } else {
      this.dataPoints = this.createPoints(...args);
    }
    if (this.option && this.option.onInit) {
      this.option.onInit.apply(this, args);
    }
    return {
      dataChanged,
      points: this.dataPoints
    };
  }

  /**
   * 根据X轴坐标获取最近的数据描点
   * 
   * @param {number} x X轴坐标
   * @returns {Object|null} 最近的数据点对象
   */
  getDataPointByX(x) {
    if (!this.dataPoints) return null;
    let prePoint = undefined;
    for (let i = 0; i < this.dataPoints.length; i++) {
      const p = this.dataPoints[i];
      if (p.x == x) return p;
      if (p.x < x) {
        if (i === this.dataPoints.length - 1) return p;
        prePoint = p;
      }
      if (p.x > x) {
        if (prePoint && x - prePoint.x < p.x - x) return prePoint;else return p;
      }
    }
    return null;
  }

  /**
   * 根据X轴值获取数据点
   * 
   * @param {any} xValue X轴值
   * @returns {Object|null} 数据点对象
   */
  getDataPointByXValue(xValue) {
    if (!this.dataPoints) return null;
    for (let i = 0; i < this.dataPoints.length; i++) {
      const p = this.dataPoints[i];
      if (p.xValue == xValue) return p;
    }
    return null;
  }

  /**
   * 重置图表系列
   * 
   * 清除所有形状，重新初始化坐标轴和图例
   * 
   * @returns {Object} 包含 xAxis 和 yAxis 的信息对象
   */
  reset() {
    var shape;
    while (shape = this.shapes.shift()) {
      shape && shape.remove();
    }
    this.initAxisValue();
    this.createLegend();
    return this.chartInfo = {
      xAxis: this.xAxis,
      yAxis: this.yAxis
    };
  }

  /**
   * 初始化坐标轴的值范围
   * 
   * 遍历数据，计算X轴和Y轴的最大最小值
   */
  initAxisValue() {
    if (!this.data || !this.data.length) return;
    for (var i = 0; i < this.data.length; i++) {
      if (Array.isArray(this.field)) {
        this.field.forEach(f => {
          const v = this.data[i][f];
          if (v != null) {
            this.yAxis.max(v);
            this.yAxis.min(v);
          }
        });
      } else {
        const v = this.data[i][this.field];
        if (v != null) {
          this.yAxis.max(v);
          this.yAxis.min(v);
        }
      }
      const xv = this.data[i][this.xAxis.field];
      if (xv != null) {
        this.xAxis.max(xv);
        this.xAxis.min(xv);
      }
    }
  }

  /**
   * 创建数据点
   * 
   * 根据数据源和坐标轴配置，计算每个数据点的屏幕坐标位置
   * 
   * @param {Array} data 数据源，默认使用 this.data
   * @returns {Array} 数据点数组
   */
  createPoints(data) {
    data = data || this.data;
    if (!data || !data.length) return [];
    const xstep = this.xAxis.step();
    const minY = this.yAxis.min();
    const ystep = this.yAxis.step();
    this.baseYValue = typeof this.graph.baseY === 'undefined' ? minY : this.graph.baseY || 0;
    this.baseYHeight = (this.baseYValue - minY) * ystep;
    this.baseY = this.graph.chartArea.height - this.baseYHeight;
    const fields = Array.isArray(this.field) ? this.field : [this.field];
    const dataPoints = [];
    for (let i = 0; i < data.length; i++) {
      const s = data[i];
      const xv = s[this.xAxis.field];
      const p = {
        data: s,
        index: i,
        xValue: xv,
        xLabel: xv,
        points: [],
        style: this.style // 共享引用，避免深拷贝；子类如需修改应自行创建副本
      };
      p.x = xstep * i + this.xAxis.labelStart;
      for (let j = 0; j < fields.length; j++) {
        const f = fields[j];
        let yv = s[f];
        p.yLabel = p.yValue = yv;
        p.height = (yv - this.baseYValue) * ystep;
        const point = {
          x: p.x,
          height: p.height,
          yValue: yv,
          field: f
        };
        if (yv == null || typeof yv == 'undefined') {
          point.m = p.m = true;
        } else {
          if (this.yAxis.dataType != 'number') {
            yv = i;
          }
          point.y = p.y = this.baseY - point.height;
        }
        p.points.push(point);
      }
      if (typeof this.option.initItemHandler === 'function') {
        this.option.initItem.call(this, p);
      }
      dataPoints.push(p);
    }
    this.dataPoints = dataPoints;
    return this.dataPoints;
  }

  /**
   * 生成颜色
   * 
   * @param {Object} p 数据点对象
   * @returns {string} 颜色值
   */
  getColor(p) {
    if (typeof this.style.color === 'function') {
      return this.style.color.call(this, p);
    } else {
      return this.style.color;
    }
  }

  /**
   * 生成图例
   * 
   * @returns {jmShape} 图例形状
   */
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.fill = this.getColor();
    const shape = this.graph.createShape('rect', {
      style
    });
    this.graph.legend.append(this, shape);
    return shape;
  }

  /**
   * 生成数据项标签
   * 
   * 在数据点上方或指定位置显示数值标签
   * 
   * @param {Object} point 数据点对象
   * @param {string} position 标签位置 (top/bottom/left/right/inside)
   */
  createItemLabel(point, position) {
    if (!this.style.label || this.style.label.show !== true) return;
    const text = this.option.itemLabelFormat ? this.option.itemLabelFormat.call(this, point) : point.yValue;
    if (!text) return;
    if (text instanceof jmControl) {
      this.addShape(text);
      return text;
    }
    const style = this.graph.utils.clone(this.graph.style.itemLabel, {
      zIndex: 21,
      ...this.style.label
    });
    if (typeof style.fill === 'function') {
      style.fill = style.fill.call(this, point);
    }
    const barWidth = (this.barTotalWidth || 0) / 2 - (this.barWidth || 0) * (this.barIndex || 0) - (this.barWidth || 0) / 2;
    const baseOffset = point.y - this.baseY;
    const label = this.graph.createShape('label', {
      style,
      text: text,
      data: point,
      position: function () {
        const offh = style.offset || 5;
        const size = this.testSize();
        const position = style.position || (baseOffset > 0 ? 'top' : 'bottom');
        switch (position) {
          case 'top':
            return {
              x: point.x - size.width / 2 - barWidth,
              y: point.y - size.height - offh
            };
          case 'bottom':
            return {
              x: point.x - size.width / 2 - barWidth,
              y: point.y + offh
            };
          case 'left':
            return {
              x: point.x - size.width - offh - barWidth,
              y: point.y - size.height / 2
            };
          case 'right':
            return {
              x: point.x + offh - barWidth,
              y: point.y - size.height / 2
            };
          case 'inside':
            return {
              x: point.x - size.width / 2 - barWidth,
              y: point.y + (baseOffset > 0 ? -size.height / 2 : size.height / 2)
            };
          default:
            return {
              x: point.x - size.width / 2 - barWidth,
              y: baseOffset > 0 ? point.y - size.height - offh : point.y + offh
            };
        }
      }
    });
    this.addShape(label);
  }

  /**
   * 在图表上添加形状
   * 
   * @param {jmShape} shape 图形对象
   * @returns {jmShape} 添加的图形对象
   */
  addShape(shape) {
    this.graph.chartArea.children.add(shape);
    this.shapes.add(shape);
    return shape;
  }

  /**
   * 获取指定事件的集合
   * 
   * @param {string} name 事件名称
   * @returns {jmList} 事件委托的集合
   */
  getEvent(name) {
    const event = this.option ? this.option[name] : null;
    if (!event) {
      return super.getEvent(name);
    } else {
      const events = new jmList();
      events.add(event);
      const oldevents = super.getEvent(name);
      if (oldevents) {
        events.concat(oldevents);
      }
      return events;
    }
  }
}

/**
 * 柱图
 *
 * @class jmBarSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

class jmBarSeries extends jmSeries {
  constructor(options) {
    super(options);
  }

  /**
   * 初始化柱图
   *
   * @method init
   * @for jmBarSeries
   */
  init() {
    const {
      points,
      dataChanged
    } = this.initDataPoint();
    const len = points.length;
    if (!len) return;
    this.initWidth(len);
    const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < ANIMATION_DATA_THRESHOLD;
    let aniIsEnd = true;
    const aniCount = this.style.aniCount || DEFAULT_ANIMATION_COUNT;
    for (let i = 0; i < len; i++) {
      const point = points[i];
      if (typeof point.y === 'undefined' || point.y === null) {
        continue;
      }
      const style = Object.assign({}, point.style, {
        fill: this.getColor(point)
      });
      const sp = this.addShape(this.graph.createPath(null, style));
      const p1 = {
        x: point.x - this.barTotalWidth / 2 + this.barWidth * this.barIndex,
        y: this.baseY
      };
      const p4 = {
        x: p1.x + this.barWidth,
        y: p1.y
      };
      const p2 = {
        x: p1.x,
        y: p1.y
      };
      const p3 = {
        x: p4.x,
        y: p1.y
      };
      if (isRunningAni) {
        const step = point.height / aniCount;
        const offHeight = step * this.___animateCounter;
        p2.y = p1.y - offHeight;
        if (step >= 0 && p2.y <= point.y || step < 0 && p2.y >= point.y) {
          p2.y = point.y;
        } else {
          aniIsEnd = false;
        }
        p3.y = p2.y;
      } else {
        p2.y = point.y;
        p3.y = point.y;
      }
      sp.points.push(p1);
      sp.points.push(p2);
      sp.points.push(p3);
      sp.points.push(p4);
      this.createItemLabel(point);
      this.emit('onPointCreated', point);
    }
    if (aniIsEnd) {
      this.___animateCounter = 0;
    } else {
      this.___animateCounter++;
      this.graph.utils.requestAnimationFrame(() => {
        this.needUpdate = true;
      });
    }
  }

  // 计算柱子宽度
  initWidth(count) {
    //计算每个柱子占宽
    //每项柱子占宽除以柱子个数,默认最大宽度为30
    const maxWidth = this.xAxis.width / count / this.graph.barSeriesCount;
    if (this.style.barWidth > 0) {
      this.barWidth = Number(this.style.barWidth);
      this.barTotalWidth = this.barWidth * this.graph.barSeriesCount;
    } else {
      this.barTotalWidth = this.xAxis.width / count * (this.style.perWidth || 0.4);
      this.barWidth = this.barTotalWidth / this.graph.barSeriesCount;
    }
    if (this.barWidth > maxWidth) {
      this.barWidth = maxWidth;
      this.barTotalWidth = maxWidth * this.graph.barSeriesCount;
    }
  }

  /**
   * 在图上加下定制图形
   * @param {jmShape} shape  图形
   */
  addShape(shape) {
    this.children.add(shape);
    this.shapes.add(shape);
    return shape;
  }
}

/**
 * 堆叠柱状图
 * 
 * 堆叠柱状图用于显示多个数据系列的累积效果。
 * 每个柱子由多个部分堆叠而成，每个部分代表一个数据系列。
 * 
 * 数据格式要求：
 * - field: ['value1', 'value2', 'value3'] - 多个数据字段
 * - xField: 'category' - X轴字段
 * 
 * 样式配置：
 * - barWidth: 柱子宽度（像素）
 * - perWidth: 柱子宽度占比（0-1），默认0.5
 * - color: 颜色函数，可以根据索引返回不同颜色
 * 
 * 特点：
 * - 支持正负值堆叠
 * - 正值从基线向上堆叠
 * - 负值从基线向下堆叠
 * - 支持动画效果
 *
 * @class jmStackBarSeries
 * @module jmChart
 * @extends jmBarSeries
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

class jmStackBarSeries extends jmBarSeries {
  constructor(options) {
    super(options);
  }

  /**
   * 初始化堆叠柱状图
   * 
   * 绘制逻辑：
   * 1. 遍历所有数据点
   * 2. 对每个数据点的多个字段进行堆叠
   * 3. 正值向上堆叠，负值向下堆叠
   * 4. 支持动画效果
   */
  init() {
    const {
      points,
      dataChanged
    } = this.initDataPoint();
    const len = points.length;
    this.initWidth(len);
    const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < ANIMATION_DATA_THRESHOLD;
    let aniIsEnd = true;
    const aniCount = this.style.aniCount || DEFAULT_ANIMATION_COUNT;
    for (let i = 0; i < len; i++) {
      const point = points[i];
      let topStartY = this.baseY;
      let bottomStartY = this.baseY;
      for (let index = 0; index < point.points.length; index++) {
        const p = point.points[index];
        let fillColor;
        if (this.style.color && typeof this.style.color === 'function') {
          fillColor = this.style.color.call(this, {
            index,
            point: p
          });
        } else {
          fillColor = this.graph.getColor(index);
        }
        // 使用浅拷贝而非深拷贝
        const style = Object.assign({}, this.style, {
          fill: fillColor
        });
        const sp = this.addShape(this.graph.createPath(null, style));
        let startY = topStartY;
        if (p.yValue < this.baseYValue) startY = bottomStartY;
        const p1 = {
          x: p.x - this.barTotalWidth / 2,
          y: startY
        };
        const p4 = {
          x: p1.x + this.barWidth,
          y: p1.y
        };
        const p2 = {
          x: p1.x,
          y: p1.y
        };
        const p3 = {
          x: p4.x,
          y: p1.y
        };
        if (isRunningAni) {
          const step = p.height / aniCount;
          const offHeight = step * this.___animateCounter;
          p2.y = startY - offHeight;
          if (step >= 0 && offHeight >= p.height || step < 0 && offHeight <= p.height) {
            p2.y = startY - p.height;
          } else {
            aniIsEnd = false;
          }
          p.y = p3.y = p2.y;
        } else {
          p2.y = startY - p.height;
          p.y = p3.y = p2.y;
        }
        if (p.yValue < this.baseYValue) bottomStartY = p2.y;else topStartY = p2.y;
        sp.points.push(p1);
        sp.points.push(p2);
        sp.points.push(p3);
        sp.points.push(p4);
      }
      this.emit('onPointCreated', point);
    }
    if (aniIsEnd) {
      this.___animateCounter = 0;
    } else {
      this.___animateCounter++;
      this.graph.utils.requestAnimationFrame(() => {
        this.needUpdate = true;
      });
    }
  }

  /**
   * 计算最大值和最小值
   * 
   * 对于堆叠柱状图，需要计算所有字段的累加值
   * 正值累加得到最大值，负值累加得到最小值
   */
  initAxisValue() {
    const fields = Array.isArray(this.field) ? this.field : [this.field];
    for (const row of this.data) {
      let max, min;
      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        const v = Number(row[f]);
        if (typeof max === 'undefined') max = v;else {
          if (v < 0 || max < 0) max = Math.max(max, v);else {
            max += v;
          }
        }
        if (typeof min === 'undefined') min = v;else {
          if (v >= 0 || min >= 0) min = Math.min(min, v);else {
            min += v;
          }
        }
      }
      this.yAxis.max(max);
      this.yAxis.min(min);
      const xv = row[this.xAxis.field];
      this.xAxis.max(xv);
      this.xAxis.min(xv);
    }
  }
}

/**
 * 饼图
 *
 * @class jmPieSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造函数
class jmPieSeries extends jmSeries {
  constructor(options) {
    super(options);
    this.xAxis.visible = false;
    this.yAxis.visible = false;
  }

  // 重新初始化图形
  init() {
    //总和
    this.totalValue = 0;
    //计算最大值和最小值
    if (this.data) {
      for (let i = 0; i < this.data.length; i++) {
        const s = this.data[i];
        const vy = s[this.field];
        if (vy) {
          this.totalValue += Math.abs(vy);
        }
      }
    }
    const center = {
      x: this.graph.chartArea.width / 2,
      y: this.graph.chartArea.height / 2
    };
    const radius = Math.min(center.x - this.style.margin.left - this.style.margin.right, center.y - this.style.margin.top - this.style.margin.bottom);

    //生成描点位
    // super.init会把参数透传给 createPoints
    const {
      points,
      dataChanged
    } = this.initDataPoint(center, radius);

    // 是否正在动画中
    const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0);

    // 在动画中，则一直刷新
    if (isRunningAni) {
      const aniCount = this.style.aniCount || 20;
      let aniIsEnd = true; // 当次是否结束动画
      const len = points.length;
      for (let i = 0; i < len; i++) {
        const p = points[i];
        const step = (p.y - p.shape.startAngle) / aniCount;
        p.shape.endAngle = p.shape.startAngle + this.___animateCounter * step;
        if (p.shape.endAngle >= p.y) {
          p.shape.endAngle = p.y;
        } else {
          aniIsEnd = false;
        }
        // p.shape.points = arc.initPoints();
        // p.shape.points.push(center);			
        //绑定提示框
        //this.bindTooltip(p.shape, p);
      }
      // 所有动画都完成，则清空计数器
      if (aniIsEnd) {
        this.___animateCounter = 0;
      } else {
        this.___animateCounter++;
        // next tick 再次刷新
        this.graph.utils.requestAnimationFrame(() => {
          this.needUpdate = true; //需要刷新
        });
      }
    }
  }

  // 当前总起画角度
  get startAngle() {
    return this.option.startAngle || 0;
  }
  set startAngle(v) {
    this.option.startAngle = v;
  }

  /**
   * 生成序列图描点
   *
   * @method createPoints
   */
  createPoints(center, radius) {
    if (!this.data) return [];
    const points = [];
    let index = 0;
    let startAni = this.startAngle; // 总起始角度
    if (typeof startAni === 'function') {
      startAni = startAni.call(this, this.data);
    }
    let cm = Math.PI * 2;
    //规定应该逆时针还是顺时针绘图 false  顺时针，true 逆时针
    const anticlockwise = this.option.anticlockwise || false;
    // 每项之间的间隔角度  顺时钟为正，否则为负
    const marginAngle = Number(this.style.marginAngle) || 0;
    for (let i = 0; i < this.data.length; i++) {
      const s = this.data[i];
      const yv = s[this.field];

      //如果Y值不存在。则此点无效，不画图
      if (yv == null || typeof yv == 'undefined') {
        continue;
      } else {
        const p = {
          data: s,
          x: i,
          yValue: yv,
          yLabel: yv,
          step: Math.abs(yv / this.totalValue),
          // 每个数值点比
          style: this.style,
          // 共享引用，仅在需要修改时才拷贝
          anticlockwise
        };
        points.push(p);
        //p.style.color = this.graph.getColor(index);
        if (p.style.color && typeof p.style.color === 'function') {
          p.style = this.graph.utils.clone(this.style);
          p.style.fill = p.style.color.call(this, p);
        } else {
          // fill 需要独立，创建轻量样式覆盖
          p.style = Object.assign({}, this.style, {
            fill: this.graph.getColor(index)
          });
        }
        const start = startAni; // 上一个扇形的结束角度为当前的起始角度
        // 计算当前结束角度, 同时也是下一个的起始角度
        p.y = startAni + p.step * cm;
        startAni = p.y;
        p.startAngle = start + marginAngle;
        p.endAngle = p.y;
        if (center && radius) {
          const arcWidth = this.style.arcWidth || radius * 0.2;
          p.radius = radius;
          // 如果有指定动态半径，则调用
          if (typeof this.option.radius === 'function') {
            p.radius = this.option.radius.call(this, p, radius, i);
          }
          p.maxRadius = p.radius;
          // 如果有指定动态半径，则调用
          if (typeof this.option.maxRadius === 'function') {
            p.maxRadius = this.option.maxRadius.call(this, p, p.maxRadius, i);
          }
          p.minRadius = p.radius - arcWidth;
          // 如果有指定动态半径，则调用
          if (typeof this.option.minRadius === 'function') {
            p.minRadius = this.option.minRadius.call(this, p, p.minRadius, i);
          }
          p.center = center;
          // 如果有指定动态半径，则调用
          if (typeof this.option.center === 'function') {
            p.center = this.option.center.call(this, p, p.center, i);
          }
          p.shape = this.graph.createShape(this.style.isHollow ? 'harc' : 'arc', {
            style: p.style,
            startAngle: p.startAngle,
            endAngle: p.endAngle,
            anticlockwise: anticlockwise,
            interactive: true,
            isFan: true,
            // 表示画扇形
            center: p.center,
            radius: p.radius,
            maxRadius: p.maxRadius,
            minRadius: p.minRadius
          });

          /**
           * 因为jmgraph是按图形形状来计算所占区域和大小的， 这里我们把扇形占区域改为整个图圆。这样计算大小和渐变时才好闭合。
           */
          p.shape.getLocation = function () {
            const local = this.location = {
              left: 0,
              top: 0,
              width: 0,
              height: 0,
              center: this.center,
              radius: p.radius
            };
            local.left = this.center.x - p.radius;
            local.top = this.center.y - p.radius;
            local.width = local.height = p.radius * 2;
            return local;
          };
          p.shape.getBounds = function () {
            return this.getLocation();
          };
          this.addShape(p.shape);

          // 如果有点击事件
          if (this.option.onClick || this.option.onOver || this.option.onLeave) {
            p.shape.interactive = true;
          }
          if (this.option.onClick) {
            p.shape.on('click', e => {
              return this.option.onClick.call(this, p, e);
            });
          }
          if (this.option.onOver) {
            p.shape.on('mouseover touchover', e => {
              return this.option.onOver.call(this, p, e);
            });
          }
          if (this.option.onLeave) {
            p.shape.on('mouseleave touchleave', e => {
              return this.option.onLeave.call(this, p, e);
            });
          }
          this.createLabel(p); // 生成标签
          // 生成标点的回调
          this.emit('onPointCreated', p);
        }
        index++;
      }
    }
    return points;
  }

  // 生成图的标注
  createLabel(point) {
    if (this.style.label && this.style.label.show === false) return;
    const text = this.option.itemLabelFormat ? this.option.itemLabelFormat.call(this, point) : point.step;
    if (!text) return;

    // v如果指定了为控件，则直接加入
    if (text instanceof jmControl) {
      point.shape.children.add(text);
      return text;
    }
    const self = this;
    const label = this.graph.createShape('label', {
      style: this.style.label,
      text: text,
      position: function () {
        if (!this.parent || !this.parent.points || !this.parent.points.length) return {
          x: 0,
          y: 0
        };

        // 动态计算位置
        const parentRect = this.parent.getBounds();
        //const rect = this.getBounds.call(this.parent);

        // 圆弧的中间位，离圆心最近和最远的二个点
        let centerMaxPoint = this.parent.points[Math.floor(this.parent.points.length / 2)];
        let centerMinPoint = this.parent.center;
        // 如果是空心圆，则要计算 1/4 和 3/4位的点。顺时针和逆时针二个点大小不一样，这里只取，大小计算时处理
        if (self.style.isHollow) {
          centerMaxPoint = this.parent.points[Math.floor(this.parent.points.length * 0.25)];
          centerMinPoint = this.parent.points[Math.floor(this.parent.points.length * 0.75)];
        }
        const centerMinX = Math.min(centerMaxPoint.x, centerMinPoint.x);
        const centerMaxX = Math.max(centerMaxPoint.x, centerMinPoint.x);
        const centerMinY = Math.min(centerMaxPoint.y, centerMinPoint.y);
        const centerMaxY = Math.max(centerMaxPoint.y, centerMinPoint.y);

        // 中心点
        const center = {
          x: (centerMaxX - centerMinX) / 2 + centerMinX,
          y: (centerMaxY - centerMinY) / 2 + centerMinY
        };
        const size = this.testSize();

        // 取图形中间的二个点
        // rect是相对于图形坐标点形图的图形的左上角，而parentRect是图形重新指定的整圆区域。减去整圆区域左上角就是相对于整圆区域坐标
        return {
          x: center.x - parentRect.left - size.width / 2,
          y: center.y - parentRect.top - size.height / 2
        };
      }
    });
    point.shape.children.add(label);
  }

  /**
   * 生成图例
   *
   * @method createLegend	 
   */
  createLegend() {
    if (!this.data || !this.data.length) return;
    const len = this.data.length;
    for (let k = 0; k < len; k++) {
      const s = this.data[k];
      if (!s) continue;
      const yv = s[this.field];
      if (yv == null || typeof yv === 'undefined') continue;
      const style = this.graph.utils.clone(this.style);
      if (style.color && typeof style.color === 'function') {
        style.fill = style.color.call(this, {
          data: s,
          index: k
        });
      } else {
        style.fill = this.graph.getColor(k);
      }
      const shape = this.graph.createShape('rect', {
        style: style,
        position: {
          x: 0,
          y: 0
        }
      });
      this.graph.legend.append(this, shape, {
        name: this.legendLabel,
        data: s
      });
    }
  }
}

/**
 * 雷达图
 *
 * @class jmRadarSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造函数
class jmRadarSeries extends jmSeries {
  constructor(options) {
    super(options);
  }

  // 重新生成轴，雷达图只需要Y轴即可
  createAxises(center, radius) {
    this.axises = [this.yAxis];
    const yCount = this.field.length;
    if (!yCount) return;

    //每个维度点的角度
    const rotateStep = Math.PI * 2 / yCount;

    // 清空除了一个默认外的所有Y轴
    const yAxisKeys = Object.keys(this.graph.yAxises || {});
    for (let k = 0; k < yAxisKeys.length; k++) {
      const axis = this.graph.yAxises[yAxisKeys[k]];
      if (!axis || axis === this.yAxis) continue;
      axis.remove();
      delete this.graph.yAxises[yAxisKeys[k]];
    }
    for (let index = 0; index < yCount; index++) {
      if (!this.field[index]) continue;
      let axis = this.yAxis;
      // 除了默认的y轴外，其它都重新生成
      if (index > 0) {
        axis = this.graph.createYAxis({
          index: index + 1,
          format: this.option.yLabelFormat || this.graph.option.yLabelFormat
        });
        this.axises.push(axis);
      }
      const rotate = Math.PI / 2 + rotateStep * index; //从向上90度开始
      axis.init({
        field: this.field[index],
        radarOption: {
          center,
          radius,
          yCount,
          rotate: rotate,
          cos: Math.cos(rotate),
          sin: Math.sin(rotate)
        }
      });
    }

    // x轴初始化
    this.xAxis.init({
      radarOption: {
        center,
        radius,
        yCount,
        yAxises: this.axises
      }
    });
    return this.axises;
  }

  // 计算最大值和最小值，一般图形直接采用最大最小值即可，有些需要多值叠加
  initAxisValue() {
    this.center = {
      x: this.graph.chartArea.width / 2,
      y: this.graph.chartArea.height / 2
    };
    this.radius = Math.min(this.center.x - this.style.margin.left - this.style.margin.right, this.center.y - this.style.margin.top - this.style.margin.bottom);
    const axises = this.createAxises(this.center, this.radius); // 重置所有轴
    // 计算最大最小值
    // 当前需要先更新axis的边界值，轴好画图
    for (let i = 0; i < this.data.length; i++) {
      axises.forEach(axis => {
        const v = this.data[i][axis.field];
        axis.max(v);
        axis.min(v);
      });
    }
  }

  // 重新初始化图形
  init() {
    //生成描点位
    // super.init会把参数透传给 createPoints
    const {
      points,
      dataChanged
    } = this.initDataPoint(this.center, this.radius);

    // 是否正在动画中
    const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0);
    const aniCount = this.style.aniCount || 20;
    let aniIsEnd = true; // 当次是否结束动画
    const len = points.length;
    const shapeMap = {};
    for (let i = 0; i < len; i++) {
      const p = points[i];
      let shape = shapeMap[p.index];
      if (!shape) {
        shape = shapeMap[p.index] = this.graph.createShape('path', {
          ...p,
          style: p.style,
          points: []
        });
        this.addShape(shape);

        // 如果有点击事件
        if (this.option.onClick || this.option.onOver || this.option.onLeave) {
          shape.interactive = true;
        }
        if (this.option.onClick) {
          shape.on('click', e => {
            return this.option.onClick.call(this, e);
          });
        }
        if (this.option.onOver) {
          shape.on('mouseover touchover', e => {
            return this.option.onOver.call(this, e);
          });
        }
        if (this.option.onLeave) {
          shape.on('mouseleave touchleave', e => {
            return this.option.onLeave.call(this, e);
          });
        }
        this.createLegend(p);
      }
      shape.zIndex += p.radius / this.radius; // 用每个轴占比做为排序号，这样占面积最大的排最底层
      let point = null;
      // 在动画中，则一直刷新
      if (isRunningAni) {
        let step = p.radius / aniCount * this.___animateCounter;
        if (step >= p.radius) {
          step = p.radius;
        } else {
          aniIsEnd = false;
        }
        point = {
          ...p,
          x: this.center.x + p.axis.radarOption.cos * step,
          y: this.center.y - p.axis.radarOption.sin * step
        };
      } else {
        point = p;
      }
      shape.points.push(point);
      this.createLabel(point); // 生成标签
    }
    // 所有动画都完成，则清空计数器
    if (aniIsEnd) {
      this.___animateCounter = 0;
    } else {
      this.___animateCounter++;
      // next tick 再次刷新
      this.graph.utils.requestAnimationFrame(() => {
        this.needUpdate = true; //需要刷新
      });
    }
  }

  /**
   * 生成序列图描点
   *
   * @method createPoints
   */
  createPoints(center, radius) {
    if (!this.data || !this.axises) return [];
    center = center || this.center;
    const points = [];
    for (let i = 0; i < this.data.length; i++) {
      const s = this.data[i];
      let strokeColor;
      if (this.style.color && typeof this.style.color === 'function') {
        strokeColor = this.style.color.call(this, {
          data: s,
          index: i
        });
      } else {
        strokeColor = this.graph.getColor(i);
      }
      let fillColor;
      if (typeof this.style.fill === 'function') {
        fillColor = this.style.fill.call(this, {
          ...this.style,
          stroke: strokeColor
        });
      } else {
        const color = this.graph.utils.hexToRGBA(strokeColor);
        fillColor = `rgba(${color.r},${color.g},${color.b}, 0.2)`;
      }
      // 使用浅拷贝而非深拷贝
      const style = Object.assign({}, this.style, {
        stroke: strokeColor,
        fill: fillColor
      });
      const shapePoints = [];
      for (const axis of this.axises) {
        if (!axis || !axis.field) continue;
        const yv = s[axis.field];
        const p = {
          x: center.x,
          y: center.y,
          index: i,
          radius: 0,
          data: s,
          yValue: yv,
          yLabel: yv,
          style,
          axis
        };
        shapePoints.push(p);

        //如果Y值不存在。则此点无效，不画图
        if (yv == null || typeof yv == 'undefined') {
          continue;
        }
        p.radius = Math.abs(yv - axis.min()) * axis.step();
        p.x = center.x + axis.radarOption.cos * p.radius;
        p.y = center.y - axis.radarOption.sin * p.radius;

        // 生成标点的回调
        this.emit('onPointCreated', p);
      }
      points.push(...shapePoints);
    }
    return points;
  }

  // 生成图的标注
  createLabel(point) {
    if (this.style.label && this.style.label.show === false) return;
    const text = this.option.itemLabelFormat ? this.option.itemLabelFormat.call(this, point) : point.yValue;
    if (!text) return;

    // v如果指定了为控件，则直接加入
    if (text instanceof jmControl) {
      this.addShape(text);
      return text;
    }
    const label = this.graph.createShape('label', {
      style: this.style.label || {},
      text: text
    });
    label.position = {
      x: point.x,
      y: point.y
    };
    this.addShape(label);
    return label;
  }

  /**
   * 生成图例
   */
  createLegend(point) {
    if (!point) return;
    const style = this.graph.utils.clone(point.style);
    const shape = this.graph.createShape('rect', {
      style: style,
      position: {
        x: 0,
        y: 0
      }
    });
    this.graph.legend.append(this, shape, {
      name: this.legendLabel,
      data: point.data
    });
  }
}

/**
 * 线图
 *
 * @class jmLineSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

class jmLineSeries extends jmSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.line;
    super(options);
  }

  /**
   * 初始化线条
   *
   * @method init
   * @for jmLineSeries
   */
  init() {
    const {
      points,
      dataChanged
    } = this.initDataPoint();
    const len = points.length;
    if (!len) return;
    this.style.stroke = this.style.color;
    this.style.fill = null;
    this.style.item.stroke = this.style.color;
    const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < ANIMATION_DATA_THRESHOLD;
    let shapePoints = [];
    const aniCount = this.style.aniCount || DEFAULT_ANIMATION_COUNT;
    const aniStep = Math.floor(len / aniCount) || 1;
    for (let i = 0; i < len; i++) {
      const p = points[i];
      if (typeof p.y === 'undefined' || p.y === null) {
        continue;
      }
      if (isRunningAni && i > this.___animateCounter) {
        break;
      }
      if (this.style.showItem) {
        this.createPointItem(p);
      }
      if (this.style.curve) {
        shapePoints = this.createCurePoints(shapePoints, p);
      } else if (this.style.lineType === 'dotted') {
        shapePoints = this.createDotLine(shapePoints, p);
      }
      shapePoints.push(p);
      this.createItemLabel(p);
      this.emit('onPointCreated', p);
    }
    if (this.___animateCounter >= len - 1) {
      this.___animateCounter = 0;
    } else if (isRunningAni) {
      this.___animateCounter += aniStep;
      this.graph.utils.requestAnimationFrame(() => {
        this.needUpdate = true;
      });
    }
    this.points = shapePoints;
    this.createArea(shapePoints);
  }

  // 生成点的小圆圈
  createPointItem(p) {
    const pointShape = this.graph.createShape('circle', {
      style: this.style.item,
      center: p,
      radius: this.style.radius || 3
    });
    pointShape.zIndex = (pointShape.style.zIndex || 1) + 1;
    return this.addShape(pointShape);
  }
  createCurePoints(shapePoints, p) {
    const startPoint = shapePoints[shapePoints.length - 1];
    if (!startPoint || !p) return shapePoints;
    if (startPoint.x === undefined || startPoint.x === null || startPoint.y === undefined || startPoint.y === null || p.x === undefined || p.x === null || p.y === undefined || p.y === null) {
      return shapePoints;
    }
    const p1 = {
      x: startPoint.x + (p.x - startPoint.x) / 5,
      y: startPoint.y
    };
    const p2 = {
      x: startPoint.x + (p.x - startPoint.x) / 2,
      y: p.y - (p.y - startPoint.y) / 2
    };
    const p3 = {
      x: p.x - (p.x - startPoint.x) / 5,
      y: p.y
    };
    this.__bezier = this.__bezier || this.graph.createShape('bezier');
    this.__bezier.cpoints = [startPoint, p1, p2, p3, p];
    const bzpoints = this.__bezier.initPoints();
    if (bzpoints && bzpoints.length) {
      shapePoints = shapePoints.concat(bzpoints);
    }
    return shapePoints;
  }
  createDotLine(shapePoints, p) {
    const startPoint = shapePoints[shapePoints.length - 1];
    if (!startPoint || !p) return shapePoints;
    if (startPoint.x === undefined || startPoint.x === null || startPoint.y === undefined || startPoint.y === null || p.x === undefined || p.x === null || p.y === undefined || p.y === null) {
      return shapePoints;
    }
    this.__line = this.__line || this.graph.createShape('line', {
      style: this.style
    });
    this.__line.start = startPoint;
    this.__line.end = p;
    const dots = this.__line.initPoints();
    if (dots && dots.length) {
      shapePoints = shapePoints.concat(dots);
    }
    return shapePoints;
  }

  /**
   * 生成图例
   *
   * @method createLegend	 
   */
  createLegend() {
    //生成图例前的图标
    const style = this.graph.utils.clone(this.style);
    style.stroke = style.color;
    const shape = this.graph.createShape('path', {
      style: style
    });
    if (this.curve || this.style.curve) {
      var p1 = {
        x: 0,
        y: this.graph.style.legend.item.shape.height
      };
      var p2 = {
        x: this.graph.style.legend.item.shape.width / 3,
        y: this.graph.style.legend.item.shape.height / 3
      };
      var p3 = {
        x: this.graph.style.legend.item.shape.width / 3 * 2,
        y: this.graph.style.legend.item.shape.height / 3 * 2
      };
      var p4 = {
        x: this.graph.style.legend.item.shape.width,
        y: 0
      };
      this.__bezier = this.__bezier || this.graph.createShape('bezier');
      this.__bezier.cpoints = [p1, p2, p3, p4]; //设置控制点		

      shape.points = this.__bezier.initPoints();
    } else {
      shape.points = [{
        x: 0,
        y: this.graph.style.legend.item.shape.height / 2
      }, {
        x: this.graph.style.legend.item.shape.width,
        y: this.graph.style.legend.item.shape.height / 2
      }];
    }
    this.graph.legend.append(this, shape);
  }

  // 生成面积效果
  createArea(points) {
    // 有指定绘制区域效果才展示
    if (!this.style.area || points.length < 2) return;

    // 基线：使用数据基准线（baseY），在 createPoints 中已根据 minY/baseYValue 正确计算
    const axisY = this.baseY;

    // 过滤有效点
    const validPoints = points.filter(p => p.y != null && typeof p.y !== 'undefined');
    if (validPoints.length < 2) return;

    // 检测所有点是否在基线的同一侧
    // y < axisY 表示在基线上方（数据值大于基线值），y > axisY 表示在基线下方
    let allAbove = true;
    let allBelow = true;
    for (const p of validPoints) {
      if (p.y <= axisY) allBelow = false;
      if (p.y >= axisY) allAbove = false;
    }
    if (allAbove || allBelow) {
      // 全部在基线同侧：创建单个封闭区域
      this._createAreaSegment(points, allAbove, axisY);
    } else {
      // 混合数据：在交叉点处分割，分别创建封闭区域
      this._createMixedAreas(points, axisY);
    }
  }

  /**
   * 创建单个面积段
   * @param {Array} points 线条上的点
   * @param {boolean} isAbove 是否在基线上方
   * @param {number} axisY 基线Y坐标（chartArea相对坐标）
   */
  _createAreaSegment(points, isAbove, axisY) {
    const start = points[0];
    const end = points[points.length - 1];
    const style = this.graph.utils.clone(this.style.area, {}, true);
    // 连框颜色如果没指定，就透明
    style.stroke = style.stroke || 'transparent';
    // 闭合路径，确保 fill/stroke 正确封闭多边形
    style.close = true;
    if (!style.fill) {
      const color = this.graph.utils.hexToRGBA(this.style.stroke);
      if (isAbove) {
        // 基线上方：渐变从线条处（顶部）不透明到基线处（底部）透明
        style.fill = `linear-gradient(50% 0 50% 100%, 
					rgba(${color.r},${color.g},${color.b}, 0) 1,
					rgba(${color.r},${color.g},${color.b}, 0.1) 0.7, 
					rgba(${color.r},${color.g},${color.b}, 0.3) 0)`;
      } else {
        // 基线下方：渐变从基线处（顶部）透明到线条处（底部）不透明
        style.fill = `linear-gradient(50% 0 50% 100%, 
					rgba(${color.r},${color.g},${color.b}, 0.3) 1,
					rgba(${color.r},${color.g},${color.b}, 0.1) 0.3, 
					rgba(${color.r},${color.g},${color.b}, 0) 0)`;
      }
    } else if (typeof style.fill === 'function') {
      style.fill = style.fill.call(this, style, isAbove);
    }
    const area = this.graph.createShape('path', {
      points: this.graph.utils.clone(points, true),
      style,
      width: this.graph.chartArea.width,
      height: this.graph.chartArea.height
    });

    // 在首尾加上基线上的点，组成封闭多边形
    // 如果首/尾点已经在基线上（交叉点），则不重复添加
    if (Math.abs(start.y - axisY) > 0.5) {
      area.points.unshift({
        x: start.x,
        y: axisY
      });
    }
    if (Math.abs(end.y - axisY) > 0.5) {
      area.points.push({
        x: end.x,
        y: axisY
      });
    }
    this.addShape(area);
  }

  /**
   * 处理跨基线的混合数据，在交叉点处分割成多个独立区域
   * @param {Array} points 线条上的点
   * @param {number} axisY 基线Y坐标（chartArea相对坐标）
   */
  _createMixedAreas(points, axisY) {
    const segments = [];
    let currentSegment = [];
    let prevAbove = null;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (p.y == null || typeof p.y === 'undefined') continue;
      const isAbove = p.y < axisY;
      if (currentSegment.length === 0) {
        currentSegment.push(p);
        prevAbove = isAbove;
      } else if (isAbove === prevAbove) {
        currentSegment.push(p);
      } else {
        // 检测到跨基线交叉：计算交叉点
        const prev = currentSegment[currentSegment.length - 1];
        const t = (axisY - prev.y) / (p.y - prev.y);
        const crossPoint = {
          x: prev.x + (p.x - prev.x) * t,
          y: axisY
        };

        // 当前段在交叉点处结束
        currentSegment.push(crossPoint);
        if (currentSegment.length >= 2) {
          segments.push({
            points: [...currentSegment],
            above: prevAbove
          });
        }

        // 新段从交叉点开始
        currentSegment = [crossPoint, p];
        prevAbove = isAbove;
      }
    }

    // 最后一段
    if (currentSegment.length >= 2) {
      segments.push({
        points: currentSegment,
        above: prevAbove
      });
    }

    // 为每段创建独立的面积
    for (const seg of segments) {
      this._createAreaSegment(seg.points, seg.above, axisY);
    }
  }
}

/**
 * 范围图（带状图）
 * 
 * 范围图用于显示数据的上下限范围，比如温度范围、价格波动范围等。
 * 它由两条线组成，两条线之间的区域用颜色填充，形成带状效果。
 * 
 * 数据格式要求：
 * - fields: ['min', 'max'] - 两个字段，分别表示下限和上限
 * - xField: 'category' - X轴字段
 * 
 * 样式配置：
 * - color: 线条和填充颜色
 * - showItem: 是否显示数据点
 * - curve: 是否使用平滑曲线
 * - area: 填充样式配置
 * 
 * 应用场景：
 * - 温度范围：显示每天的最高温和最低温
 * - 价格波动：显示股票的最高价和最低价
 * - 误差范围：显示测量值的误差范围
 * - 置信区间：显示统计数据的置信区间
 *
 * @class jmRangeSeries
 * @module jmChart
 * @extends jmLineSeries
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

class jmRangeSeries extends jmLineSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.range || options.graph.style.stackLine;
    super(options);
  }

  /**
   * 初始化范围图
   * 
   * 绘制逻辑：
   * 1. 遍历所有数据点
   * 2. 绘制两条线（上限线和下限线）
   * 3. 在两条线之间创建填充区域
   */
  init() {
    const {
      points,
      dataChanged
    } = this.initDataPoint();
    const len = points.length;
    this.style.stroke = this.style.color;
    this.style.item.stroke = this.style.color;
    const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0);
    let startShapePoints = [];
    let endShapePoints = [];
    const aniCount = this.style.aniCount || 10;
    const aniStep = Math.floor(len / aniCount) || 1;
    for (let i = 0; i < len; i++) {
      const p = points[i];
      if (isRunningAni) {
        if (i > this.___animateCounter) {
          break;
        }
      }
      if (this.style.showItem) {
        this.createPointItem(p.points[0]);
        this.createPointItem(p.points[1]);
      }
      if (this.style.curve) {
        startShapePoints = this.createCurePoints(startShapePoints, p.points[0]);
        endShapePoints = this.createCurePoints(endShapePoints, p.points[1]);
      } else if (this.style.lineType === 'dotted') {
        startShapePoints = this.createDotLine(startShapePoints, p.points[0]);
        endShapePoints = this.createDotLine(endShapePoints, p.points[1]);
      }
      startShapePoints.push(p.points[0]);
      endShapePoints.push(p.points[1]);
      this.emit('onPointCreated', p);
    }
    if (this.___animateCounter >= len - 1) {
      this.___animateCounter = 0;
    } else if (isRunningAni) {
      this.___animateCounter += aniStep;
      this.graph.utils.requestAnimationFrame(() => {
        this.needUpdate = true;
      });
    }
    if (endShapePoints.length) endShapePoints[0].m = true;
    this.points = startShapePoints.concat(endShapePoints);
    const reversedEndPoints = endShapePoints.slice().reverse();
    const areaPoints = startShapePoints.concat(reversedEndPoints);
    const areaEnd = areaPoints[areaPoints.length - 1] = this.graph.utils.clone(areaPoints[areaPoints.length - 1]);
    areaEnd.m = false;
    this.createArea(areaPoints, false);
  }

  /**
   * 生成图例
   */
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.stroke = style.color;
    const shape = this.graph.createShape('path', {
      style: style
    });
    if (this.curve || this.style.curve) {
      const p1 = {
        x: 0,
        y: this.graph.style.legend.item.shape.height
      };
      const p2 = {
        x: this.graph.style.legend.item.shape.width / 3,
        y: this.graph.style.legend.item.shape.height / 3
      };
      const p3 = {
        x: this.graph.style.legend.item.shape.width / 3 * 2,
        y: this.graph.style.legend.item.shape.height / 3 * 2
      };
      const p4 = {
        x: this.graph.style.legend.item.shape.width,
        y: 0
      };
      this.__bezier = this.__bezier || this.graph.createShape('bezier');
      this.__bezier.cpoints = [p1, p2, p3, p4];
      shape.points = this.__bezier.initPoints();
    } else {
      shape.points = [{
        x: 0,
        y: this.graph.style.legend.item.shape.height / 2
      }, {
        x: this.graph.style.legend.item.shape.width,
        y: this.graph.style.legend.item.shape.height / 2
      }];
    }
    this.graph.legend.append(this, shape);
  }
}

/**
 * 堆叠折线图（已废弃，请使用范围图）
 * 
 * @deprecated 此类已废弃，请使用 jmRangeSeries（范围图）代替
 * @class jmStackLineSeries
 * @module jmChart
 * @extends jmRangeSeries
 */

class jmStackLineSeries extends jmRangeSeries {
  constructor(options) {
    console.warn('jmStackLineSeries 已废弃，请使用 jmRangeSeries（范围图）代替');
    super(options);
  }
}

/**
 * K线图（蜡烛图）
 * 
 * K线图是金融领域常用的图表类型，用于显示股票、期货等金融产品的价格走势。
 * 每根K线包含四个价格：开盘价、收盘价、最高价、最低价。
 * 
 * 数据格式要求：
 * - fields: ['open', 'close', 'high', 'low']
 * - open: 开盘价
 * - close: 收盘价
 * - high: 最高价
 * - low: 最低价
 * 
 * 样式配置：
 * - masculineColor: 阳线颜色（收盘价 > 开盘价），默认红色
 * - negativeColor: 阴线颜色（收盘价 < 开盘价），默认绿色
 * - barWidth: K线宽度（像素）
 * - perWidth: K线宽度占比（0-1），默认0.4
 *
 * @class jmCandlestickSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

class jmCandlestickSeries extends jmSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.candlestick || options.graph.style.line;
    super(options);
  }

  /**
   * 初始化K线图
   * 
   * 绘制逻辑：
   * 1. 遍历所有数据点
   * 2. 判断阳线或阴线
   * 3. 绘制K线实体和上下影线
   */
  init() {
    const {
      points
    } = this.initDataPoint();
    const len = points.length;
    if (!len) return;
    this.initWidth(len);
    const w = this.barWidth / 2;
    for (let i = 0; i < len; i++) {
      const p = points[i];
      if (typeof p.y === 'undefined' || p.y === null) {
        continue;
      }
      if (!p.points || p.points.length < 4) {
        console.warn('K线图数据不完整，需要4个字段（开盘、收盘、最高、最低）');
        continue;
      }
      const bl = {
        x: p.x - w,
        y: p.points[0].y
      };
      const br = {
        x: p.x + w,
        y: p.points[0].y
      };
      const tl = {
        x: p.x - w,
        y: p.points[1].y
      };
      const tr = {
        x: p.x + w,
        y: p.points[1].y
      };
      let tm = p.points[1];
      let bm = p.points[0];

      // 使用浅拷贝避免污染共享引用
      const style = Object.assign({}, p.style);
      style.stroke = style.fill = style.masculineColor || 'red';
      if (p.points[0].yValue > p.points[1].yValue) {
        style.stroke = style.fill = style.negativeColor || 'green';
        bl.y = br.y = p.points[1].y;
        tl.y = tr.y = p.points[0].y;
        tm = p.points[0];
        bm = p.points[1];
      }
      const sp = this.addShape(this.graph.createPath([], style));
      sp.points.push(p.points[2], tm, tl, bl, bm, p.points[3], bm, br, tr, tm, p.points[2]);
      this.emit('onPointCreated', p);
    }
  }

  /**
   * 计算K线宽度
   * 
   * @param {number} count 数据点数量
   */
  initWidth(count) {
    const maxWidth = this.xAxis.width / count;
    if (this.style.barWidth > 0) {
      this.barWidth = Number(this.style.barWidth);
    } else {
      this.barWidth = maxWidth * (this.style.perWidth || 0.4);
    }
    if (this.barWidth > maxWidth) {
      this.barWidth = maxWidth;
      this.barTotalWidth = maxWidth * count;
    }
  }
}

/**
 * 散点图
 *
 * @class jmScatterSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

class jmScatterSeries extends jmSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.scatter;
    super(options);
  }

  /**
   * 初始化散点图
   *
   * @method init
   * @for jmScatterSeries
   */
  init() {
    const {
      points,
      dataChanged
    } = this.initDataPoint();
    const len = points.length;
    if (!len) return;
    this.style.stroke = this.style.color;
    this.style.item.stroke = this.style.color;
    const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < ANIMATION_DATA_THRESHOLD;
    const aniCount = this.style.aniCount || DEFAULT_ANIMATION_COUNT;
    const aniStep = Math.floor(len / aniCount) || 1;
    for (let i = 0; i < len; i++) {
      const p = points[i];
      if (typeof p.y === 'undefined' || p.y === null) {
        continue;
      }
      if (isRunningAni && i > this.___animateCounter) {
        break;
      }
      this.createPointItem(p);
      this.createItemLabel(p);
      this.emit('onPointCreated', p);
    }
    if (this.___animateCounter >= len - 1) {
      this.___animateCounter = 0;
    } else if (isRunningAni) {
      this.___animateCounter += aniStep;
      this.graph.utils.requestAnimationFrame(() => {
        this.needUpdate = true;
      });
    }
  }

  /**
   * 生成散点
   *
   * @method createPointItem
   * @for jmScatterSeries
   * @param {object} p 数据点
   */
  createPointItem(p) {
    // 获取点的大小，可以从数据中指定或使用默认值
    const radius = typeof p.size === 'number' ? p.size : this.style.radius || 5;

    // 获取点的颜色，可以从数据中指定或使用系列颜色
    const color = p.color || this.style.color;
    const pointStyle = this.graph.utils.clone(this.style.item, {
      stroke: color,
      fill: color
    });
    const pointShape = this.graph.createShape('circle', {
      style: pointStyle,
      center: p,
      radius: radius
    });
    pointShape.zIndex = (pointShape.style.zIndex || 1) + 1;
    return this.addShape(pointShape);
  }

  /**
   * 生成图例
   *
   * @method createLegend
   * @for jmScatterSeries
   */
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.stroke = style.color;
    style.fill = style.color;
    const shape = this.graph.createShape('circle', {
      style: style,
      center: {
        x: this.graph.style.legend.item.shape.width / 2,
        y: this.graph.style.legend.item.shape.height / 2
      },
      radius: this.style.radius || 5
    });
    this.graph.legend.append(this, shape);
  }
}

/**
 * 气泡图
 *
 * @class jmBubbleSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

class jmBubbleSeries extends jmSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.bubble;
    super(options);
  }

  /**
   * 初始化气泡图
   *
   * @method init
   * @for jmBubbleSeries
   */
  init() {
    const {
      points,
      dataChanged
    } = this.initDataPoint();
    const len = points.length;
    if (!len) return;
    this.style.stroke = this.style.color;
    this.style.item.stroke = this.style.color;
    const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < ANIMATION_DATA_THRESHOLD;
    const aniCount = this.style.aniCount || DEFAULT_ANIMATION_COUNT;
    const aniStep = Math.floor(len / aniCount) || 1;
    for (let i = 0; i < len; i++) {
      const p = points[i];
      if (typeof p.y === 'undefined' || p.y === null) {
        continue;
      }
      if (isRunningAni && i > this.___animateCounter) {
        break;
      }
      this.createBubbleItem(p);
      this.createItemLabel(p);
      this.emit('onPointCreated', p);
    }
    if (this.___animateCounter >= len - 1) {
      this.___animateCounter = 0;
    } else if (isRunningAni) {
      this.___animateCounter += aniStep;
      this.graph.utils.requestAnimationFrame(() => {
        this.needUpdate = true;
      });
    }
  }

  /**
   * 生成气泡
   *
   * @method createBubbleItem
   * @for jmBubbleSeries
   * @param {object} p 数据点
   */
  createBubbleItem(p) {
    // 获取气泡的大小，从数据中指定
    const size = typeof p.size === 'number' ? p.size : 10;
    const radius = Math.sqrt(size) * (this.style.radiusScale || 1);

    // 获取气泡的颜色，可以从数据中指定或使用系列颜色
    const color = p.color || this.style.color;

    // 获取气泡的透明度，可以从数据中指定或使用默认值
    const opacity = typeof p.opacity === 'number' ? p.opacity : this.style.opacity || 0.6;
    const bubbleStyle = this.graph.utils.clone(this.style.item, {
      stroke: color,
      fill: color,
      opacity: opacity
    });
    const bubbleShape = this.graph.createShape('circle', {
      style: bubbleStyle,
      center: p,
      radius: radius
    });
    bubbleShape.zIndex = (bubbleShape.style.zIndex || 1) + 1;
    return this.addShape(bubbleShape);
  }

  /**
   * 生成图例
   *
   * @method createLegend
   * @for jmBubbleSeries
   */
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.stroke = style.color;
    style.fill = style.color;
    style.opacity = style.opacity || 0.6;
    const shape = this.graph.createShape('circle', {
      style: style,
      center: {
        x: this.graph.style.legend.item.shape.width / 2,
        y: this.graph.style.legend.item.shape.height / 2
      },
      radius: this.style.radius || 5
    });
    this.graph.legend.append(this, shape);
  }
}

/**
 * 热力图
 *
 * @class jmHeatmapSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

class jmHeatmapSeries extends jmSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.heatmap;
    super(options);
  }

  /**
   * 初始化热力图
   *
   * @method init
   * @for jmHeatmapSeries
   */
  init() {
    const {
      points,
      dataChanged
    } = this.initDataPoint();
    const len = points.length;
    if (!len) return;

    // 计算数据的最大值和最小值，用于颜色映射
    let minValue = Infinity;
    let maxValue = -Infinity;
    for (let i = 0; i < len; i++) {
      const p = points[i];
      if (typeof p.value === 'number') {
        minValue = Math.min(minValue, p.value);
        maxValue = Math.max(maxValue, p.value);
      }
    }
    this.minValue = minValue;
    this.maxValue = maxValue;
    const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < ANIMATION_DATA_THRESHOLD;
    const aniCount = this.style.aniCount || DEFAULT_ANIMATION_COUNT;
    const aniStep = Math.floor(len / aniCount) || 1;
    for (let i = 0; i < len; i++) {
      const p = points[i];
      if (typeof p.y === 'undefined' || p.y === null) {
        continue;
      }
      if (isRunningAni && i > this.___animateCounter) {
        break;
      }
      this.createHeatmapCell(p, minValue, maxValue);
      this.createItemLabel(p);
      this.emit('onPointCreated', p);
    }
    if (this.___animateCounter >= len - 1) {
      this.___animateCounter = 0;
    } else if (isRunningAni) {
      this.___animateCounter += aniStep;
      this.graph.utils.requestAnimationFrame(() => {
        this.needUpdate = true;
      });
    }
  }

  /**
   * 生成热力图单元格
   *
   * @method createHeatmapCell
   * @for jmHeatmapSeries
   * @param {object} p 数据点
   * @param {number} minValue 最小值
   * @param {number} maxValue 最大值
   */
  createHeatmapCell(p, minValue, maxValue) {
    // 计算单元格大小
    const cellWidth = this.style.cellWidth || 20;
    const cellHeight = this.style.cellHeight || 20;

    // 计算颜色
    const color = this.getHeatmapColor(p.value, minValue, maxValue);

    // 创建矩形单元格
    const cellStyle = this.graph.utils.clone(this.style.item, {
      stroke: color,
      fill: color
    });
    const cellShape = this.graph.createShape('rect', {
      style: cellStyle,
      position: {
        x: p.x - cellWidth / 2,
        y: p.y - cellHeight / 2
      },
      width: cellWidth,
      height: cellHeight
    });
    cellShape.zIndex = (cellShape.style.zIndex || 1) + 1;
    return this.addShape(cellShape);
  }

  /**
   * 获取热力图颜色
   *
   * @method getHeatmapColor
   * @for jmHeatmapSeries
   * @param {number} value 当前值
   * @param {number} minValue 最小值
   * @param {number} maxValue 最大值
   * @return {string} 颜色值
   */
  getHeatmapColor(value, minValue, maxValue) {
    if (typeof value !== 'number') {
      return this.style.defaultColor || '#ccc';
    }

    // 计算值的比例
    const ratio = (value - minValue) / (maxValue - minValue);

    // 使用默认的颜色梯度
    const colors = this.style.colorGradient || ['#313695',
    // 蓝色（最小值）
    '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026' // 红色（最大值）
    ];

    // 根据比例获取颜色
    const index = Math.min(Math.floor(ratio * (colors.length - 1)), colors.length - 1);
    return colors[index];
  }

  /**
   * 生成图例
   *
   * @method createLegend
   * @for jmHeatmapSeries
   */
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.stroke = style.color;
    style.fill = style.color;
    const shape = this.graph.createShape('rect', {
      style: style,
      position: {
        x: 0,
        y: 0
      },
      width: this.graph.style.legend.item.shape.width,
      height: this.graph.style.legend.item.shape.height
    });
    this.graph.legend.append(this, shape);
  }
}

/**
 * 仪表盘
 *
 * @class jmGaugeSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

class jmGaugeSeries extends jmSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.gauge;
    super(options);
  }

  /**
   * 初始化仪表盘
   */
  init() {
    const {
      points,
      dataChanged
    } = this.initDataPoint();
    const len = points.length;
    if (!len) return;
    const p = points[0];
    const value = typeof p.yValue === 'number' ? p.yValue : 0;
    const min = this.style.min || 0;
    const max = this.style.max || 100;
    // 度数转弧度（jmArc 内部使用弧度）
    const DEG = Math.PI / 180;
    const startAngle = (this.style.startAngle || -150) * DEG;
    const endAngle = (this.style.endAngle || 150) * DEG;
    const angleRange = endAngle - startAngle;
    const normalizedValue = Math.max(min, Math.min(max, value));
    const ratio = (normalizedValue - min) / (max - min);
    const currentAngle = startAngle + ratio * angleRange;
    const centerX = this.graph.chartArea.width / 2;
    const centerY = this.graph.chartArea.height / 2;
    const radius = Math.min(centerX, centerY) * (this.style.radiusScale || 0.8);
    this.createGaugeBackground(centerX, centerY, radius, startAngle, endAngle);
    this.createGaugeTicks(centerX, centerY, radius, startAngle, endAngle, min, max);
    this.createGaugePointer(centerX, centerY, radius, currentAngle);
    this.createGaugeCenter(centerX, centerY, radius);
    this.createGaugeValueLabel(centerX, centerY, radius, value);
    this.emit('onPointCreated', p);
  }

  /**
   * 创建仪表盘背景
   */
  createGaugeBackground(centerX, centerY, radius, startAngle, endAngle) {
    const backgroundStyle = {
      stroke: this.style.backgroundStroke || '#e0e0e0',
      fill: this.style.backgroundFill || 'transparent',
      lineWidth: this.style.backgroundLineWidth || 20,
      zIndex: 1
    };
    const backgroundArc = this.graph.createShape('arc', {
      style: backgroundStyle,
      center: {
        x: centerX,
        y: centerY
      },
      radius: radius,
      startAngle: startAngle,
      endAngle: endAngle
    });
    this.addShape(backgroundArc);
    if (this.style.gradient) {
      const gradientColors = this.style.gradientColors || [{
        offset: 0,
        color: '#52c41a'
      }, {
        offset: 0.7,
        color: '#faad14'
      }, {
        offset: 1,
        color: '#f5222d'
      }];
      const step = (endAngle - startAngle) / (gradientColors.length - 1);
      for (let i = 0; i < gradientColors.length - 1; i++) {
        const start = startAngle + step * i;
        const end = startAngle + step * (i + 1);
        const gradientArc = this.graph.createShape('arc', {
          style: {
            stroke: gradientColors[i].color,
            fill: 'transparent',
            lineWidth: this.style.lineWidth || 15,
            zIndex: 2
          },
          center: {
            x: centerX,
            y: centerY
          },
          radius: radius - (this.style.backgroundLineWidth || 20) / 2,
          startAngle: start,
          endAngle: end
        });
        this.addShape(gradientArc);
      }
    }
  }

  /**
   * 创建仪表盘刻度
   */
  createGaugeTicks(centerX, centerY, radius, startAngle, endAngle, min, max) {
    const tickCount = this.style.tickCount || 10;
    const angleStep = (endAngle - startAngle) / (tickCount - 1);
    for (let i = 0; i < tickCount; i++) {
      const angle = startAngle + angleStep * i;
      const value = min + (max - min) / (tickCount - 1) * i;
      const tickStartX = centerX + Math.cos(angle) * (radius - 30);
      const tickStartY = centerY + Math.sin(angle) * (radius - 30);
      const tickEndX = centerX + Math.cos(angle) * (radius - 10);
      const tickEndY = centerY + Math.sin(angle) * (radius - 10);
      const tickLine = this.graph.createShape('line', {
        style: {
          stroke: this.style.tickColor || '#666',
          lineWidth: 2,
          zIndex: 3
        },
        start: {
          x: tickStartX,
          y: tickStartY
        },
        end: {
          x: tickEndX,
          y: tickEndY
        }
      });
      this.addShape(tickLine);
      const labelX = centerX + Math.cos(angle) * (radius - 45);
      const labelY = centerY + Math.sin(angle) * (radius - 45);
      const tickLabel = this.graph.createShape('label', {
        style: {
          fill: this.style.tickLabelColor || '#333',
          font: '12px Arial',
          textAlign: 'center',
          textBaseline: 'middle',
          zIndex: 4
        },
        position: {
          x: labelX,
          y: labelY
        },
        text: Number(value.toFixed(2)).toString()
      });
      this.addShape(tickLabel);
    }
  }

  /**
   * 创建仪表盘指针
   */
  createGaugePointer(centerX, centerY, radius, angle) {
    const pointerLength = radius * 0.7;
    const pointerX = centerX + Math.cos(angle) * pointerLength;
    const pointerY = centerY + Math.sin(angle) * pointerLength;
    const pointerLine = this.graph.createShape('line', {
      style: {
        stroke: this.style.pointerColor || '#333',
        lineWidth: this.style.pointerWidth || 3,
        zIndex: 5
      },
      start: {
        x: centerX,
        y: centerY
      },
      end: {
        x: pointerX,
        y: pointerY
      }
    });
    this.addShape(pointerLine);
  }

  /**
   * 创建仪表盘中心
   */
  createGaugeCenter(centerX, centerY, radius) {
    const centerCircle = this.graph.createShape('circle', {
      style: {
        fill: this.style.centerColor || '#333',
        stroke: 'transparent',
        zIndex: 6
      },
      center: {
        x: centerX,
        y: centerY
      },
      radius: this.style.centerRadius || 8
    });
    this.addShape(centerCircle);
  }

  /**
   * 创建仪表盘值标签
   */
  createGaugeValueLabel(centerX, centerY, radius, value) {
    // 使用 itemLabelFormat 格式化，如果没有则默认最多保留2位小数
    const text = this.option.itemLabelFormat ? this.option.itemLabelFormat.call(this, {
      yValue: value
    }) : Number(value.toFixed(2)).toString();
    const valueLabel = this.graph.createShape('label', {
      style: {
        fill: this.style.valueColor || '#333',
        font: this.style.valueFont || '24px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
        zIndex: 7
      },
      position: {
        x: centerX,
        y: centerY + radius * 0.3
      },
      text: text
    });
    this.addShape(valueLabel);
    if (this.style.unit) {
      const unitLabel = this.graph.createShape('label', {
        style: {
          fill: this.style.unitColor || '#666',
          font: this.style.unitFont || '14px Arial',
          textAlign: 'center',
          textBaseline: 'middle',
          zIndex: 8
        },
        position: {
          x: centerX,
          y: centerY + radius * 0.5
        },
        text: this.style.unit
      });
      this.addShape(unitLabel);
    }
  }

  /**
   * 生成图例
   */
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.stroke = style.color;
    style.fill = style.color;
    const shape = this.graph.createShape('arc', {
      style: style,
      center: {
        x: this.graph.style.legend.item.shape.width / 2,
        y: this.graph.style.legend.item.shape.height / 2
      },
      radius: this.graph.style.legend.item.shape.height / 2,
      startAngle: -150,
      endAngle: 150
    });
    this.graph.legend.append(this, shape);
  }
}

/**
 * 面积图
 * 继承自折线图，默认启用区域填充
 *
 * @class jmAreaSeries
 * @module jmChart
 * @extends jmLineSeries
 */
class jmAreaSeries extends jmLineSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.area;
    super(options);
    // 面积图默认显示面积填充
    this.style.area = true;
  }

  /**
   * 生成图例
   */
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.stroke = style.color;
    style.fill = style.color;
    const shape = this.graph.createShape('path', {
      style: style
    });
    if (this.curve || this.style.curve) {
      const p1 = {
        x: 0,
        y: this.graph.style.legend.item.shape.height
      };
      const p2 = {
        x: this.graph.style.legend.item.shape.width / 3,
        y: this.graph.style.legend.item.shape.height / 3
      };
      const p3 = {
        x: this.graph.style.legend.item.shape.width / 3 * 2,
        y: this.graph.style.legend.item.shape.height / 3 * 2
      };
      const p4 = {
        x: this.graph.style.legend.item.shape.width,
        y: 0
      };
      this.__bezier = this.__bezier || this.graph.createShape('bezier');
      this.__bezier.cpoints = [p1, p2, p3, p4];
      shape.points = this.__bezier.initPoints();
    } else {
      shape.points = [{
        x: 0,
        y: this.graph.style.legend.item.shape.height / 2
      }, {
        x: this.graph.style.legend.item.shape.width,
        y: this.graph.style.legend.item.shape.height / 2
      }];
    }
    this.graph.legend.append(this, shape);
  }
}

class jmWaterfallSeries extends jmSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.waterfall;
    super(options);
  }
  init() {
    const {
      points,
      dataChanged
    } = this.initDataPoint();
    const len = points.length;
    if (!len) return;
    this.pointsLen = len;
    this.style.stroke = this.style.color;
    let cumulativeValue = 0;
    const processedPoints = [];
    for (let i = 0; i < len; i++) {
      const p = points[i];
      if (typeof p.y === 'undefined' || p.y === null) {
        continue;
      }
      p.originalValue = p.yValue;
      p.startValue = cumulativeValue;
      p.endValue = cumulativeValue + p.yValue;
      cumulativeValue = p.endValue;
      processedPoints.push(p);
    }
    let minValue = Infinity;
    let maxValue = -Infinity;
    for (const p of processedPoints) {
      minValue = Math.min(minValue, p.startValue, p.endValue);
      maxValue = Math.max(maxValue, p.startValue, p.endValue);
    }
    if (this.yAxis) {
      this.yAxis.min(minValue);
      this.yAxis.max(maxValue);
    }
    const minY = this.yAxis ? this.yAxis.min() : 0;
    const ystep = this.yAxis ? this.yAxis.step() : 1;
    const chartHeight = this.graph.chartArea.height;
    const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < ANIMATION_DATA_THRESHOLD;
    const aniCount = this.style.aniCount || DEFAULT_ANIMATION_COUNT;
    const aniStep = Math.floor(len / aniCount) || 1;
    for (let i = 0; i < processedPoints.length; i++) {
      const p = processedPoints[i];
      if (isRunningAni && i > this.___animateCounter) {
        break;
      }
      const startY = chartHeight - (p.startValue - minY) * ystep;
      const endY = chartHeight - (p.endValue - minY) * ystep;
      const height = Math.abs(endY - startY);
      let barColor = this.style.color;
      if (p.yValue > 0) {
        barColor = this.style.increaseColor || '#52c41a';
      } else if (p.yValue < 0) {
        barColor = this.style.decreaseColor || '#f5222d';
      }
      this.createWaterfallBar(p, startY, endY, height, barColor);
      if (i < processedPoints.length - 1) {
        this.createConnectorLine(p, processedPoints[i + 1], chartHeight, minY, ystep);
      }
      this.createItemLabel(p);
      this.emit('onPointCreated', p);
    }
    if (this.___animateCounter >= len - 1) {
      this.___animateCounter = 0;
    } else if (isRunningAni) {
      this.___animateCounter += aniStep;
      this.graph.utils.requestAnimationFrame(() => {
        this.needUpdate = true;
      });
    }
  }
  createWaterfallBar(p, startY, endY, height, color) {
    const barWidth = this.style.perWidth || 0.5;
    const chartWidth = this.graph.chartArea.width;
    const barX = p.x - chartWidth * barWidth / this.pointsLen / 2;
    const barHeight = height;
    const barStyle = {
      stroke: color,
      fill: color,
      zIndex: 1
    };
    const barShape = this.graph.createShape('rect', {
      style: barStyle,
      position: {
        x: barX,
        y: Math.min(startY, endY)
      },
      width: chartWidth * barWidth / this.pointsLen,
      height: barHeight
    });
    this.addShape(barShape);
  }
  createConnectorLine(currentPoint, nextPoint, chartHeight, minY, ystep) {
    const startY = chartHeight - (currentPoint.endValue - minY) * ystep;
    const chartWidth = this.graph.chartArea.width;
    const barWidth = this.style.perWidth || 0.5;
    const nextX = nextPoint.x - chartWidth * barWidth / this.pointsLen / 2;
    const horizontalLine = this.graph.createShape('line', {
      style: {
        stroke: this.style.connectorColor || '#999',
        lineWidth: 1,
        lineType: 'dotted',
        zIndex: 0
      },
      start: {
        x: currentPoint.x,
        y: startY
      },
      end: {
        x: nextX,
        y: startY
      }
    });
    this.addShape(horizontalLine);
    const nextStartY = chartHeight - (nextPoint.startValue - minY) * ystep;
    const verticalLine = this.graph.createShape('line', {
      style: {
        stroke: this.style.connectorColor || '#999',
        lineWidth: 1,
        zIndex: 0
      },
      start: {
        x: nextX,
        y: startY
      },
      end: {
        x: nextX,
        y: nextStartY
      }
    });
    this.addShape(verticalLine);
  }
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.stroke = this.style.color;
    style.fill = this.style.color;
    const shape = this.graph.createShape('rect', {
      style: style,
      position: {
        x: 0,
        y: 0
      },
      width: this.graph.style.legend.item.shape.width,
      height: this.graph.style.legend.item.shape.height
    });
    this.graph.legend.append(this, shape);
  }
}

/**
 * 漏斗图
 * 
 * 漏斗图用于展示数据在不同阶段的转化情况，常用于分析业务流程中的转化率。
 * 每个阶段用一个梯形表示，宽度代表该阶段的数值大小。
 * 
 * 数据格式要求：
 * - field: 'value' - 数值字段
 * - xField: 'name' - 阶段名称字段
 * 
 * 样式配置：
 * - align: 'center'|'left'|'right' - 对齐方式，默认 center
 * - gap: 每层之间的间隔，默认 2
 * - colors: 颜色数组，默认使用图表配色
 *
 * @class jmFunnelSeries
 * @module jmChart
 * @extends jmSeries
 * 
 * @example
 * chart.createSeries('funnel', {
 *   field: 'value',
 *   xField: 'name',
 *   style: {
 *     align: 'center',
 *     gap: 2
 *   }
 * });
 */
class jmFunnelSeries extends jmSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.funnel;
    super(options);
  }

  /**
   * 初始化漏斗图
   */
  init() {
    const data = this.data;
    if (!data || !data.length) return;
    const chartWidth = this.graph.chartArea.width;
    const chartHeight = this.graph.chartArea.height;
    const centerX = chartWidth / 2;
    const field = this.field || 'value';
    const xField = this.option.xField || 'name';
    const values = data.map(item => Math.abs(item[field] || 0));
    const maxValue = values.reduce((a, b) => Math.max(a, b));
    if (maxValue === 0) return;
    const align = this.style.align || 'center';
    const gap = this.style.gap || 2;
    const len = data.length;
    const layerHeight = (chartHeight - gap * (len - 1)) / len;
    let currentY = 0;
    for (let i = 0; i < len; i++) {
      const item = data[i];
      const value = values[i];
      const ratio = value / maxValue;
      const width = chartWidth * ratio * 0.8;
      let topLeftX, topRightX, bottomLeftX, bottomRightX;
      const nextValue = i < len - 1 ? values[i + 1] : 0;
      const nextRatio = nextValue / maxValue;
      const nextWidth = chartWidth * nextRatio * 0.8;
      switch (align) {
        case 'left':
          topLeftX = 0;
          topRightX = width;
          bottomLeftX = 0;
          bottomRightX = nextWidth;
          break;
        case 'right':
          topLeftX = chartWidth - width;
          topRightX = chartWidth;
          bottomLeftX = chartWidth - nextWidth;
          bottomRightX = chartWidth;
          break;
        case 'center':
        default:
          topLeftX = centerX - width / 2;
          topRightX = centerX + width / 2;
          bottomLeftX = centerX - nextWidth / 2;
          bottomRightX = centerX + nextWidth / 2;
          break;
      }
      const color = this.getColor(item, i);
      const style = {
        fill: color,
        stroke: this.style.stroke || '#fff',
        lineWidth: this.style.lineWidth || 1,
        zIndex: 1
      };
      const trapezoid = this.graph.createShape('path', {
        style: style,
        points: [{
          x: topLeftX,
          y: currentY
        }, {
          x: topRightX,
          y: currentY
        }, {
          x: bottomRightX,
          y: currentY + layerHeight
        }, {
          x: bottomLeftX,
          y: currentY + layerHeight
        }]
      });
      this.addShape(trapezoid);
      if (this.style.label && this.style.label.show !== false) {
        this.createFunnelLabel(item, topLeftX, topRightX, currentY, layerHeight, i, field, xField);
      }
      currentY += layerHeight + gap;
    }
  }

  /**
   * 创建漏斗图标签
   */
  createFunnelLabel(item, leftX, rightX, y, height, index, field, xField) {
    const centerX = (leftX + rightX) / 2;
    const text = this.option.itemLabelFormat ? this.option.itemLabelFormat.call(this, {
      data: item,
      xLabel: item[xField],
      yValue: item[field]
    }) : `${item[xField]}: ${item[field]}`;
    if (!text) return;
    const label = this.graph.createShape('label', {
      style: {
        fill: this.style.label.fill || '#fff',
        font: this.style.label.font || '12px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
        zIndex: 10
      },
      text: text,
      position: {
        x: centerX,
        y: y + height / 2
      }
    });
    this.addShape(label);
  }

  /**
   * 获取颜色
   */
  getColor(item, index) {
    if (this.style.colors && this.style.colors.length > 0) {
      return this.style.colors[index % this.style.colors.length];
    }
    if (typeof this.style.color === 'function') {
      return this.style.color.call(this, item, index);
    }
    return this.graph.getColor(index);
  }

  /**
   * 生成图例
   */
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.fill = this.style.color || this.graph.getColor(0);
    style.stroke = style.fill;
    const shape = this.graph.createShape('path', {
      style: style,
      points: [{
        x: 0,
        y: 0
      }, {
        x: this.graph.style.legend.item.shape.width,
        y: 0
      }, {
        x: this.graph.style.legend.item.shape.width * 0.6,
        y: this.graph.style.legend.item.shape.height
      }, {
        x: this.graph.style.legend.item.shape.width * 0.4,
        y: this.graph.style.legend.item.shape.height
      }]
    });
    this.graph.legend.append(this, shape);
  }
}

/**
 * 环形进度图
 * 
 * 环形进度图用于展示单个或多个指标的完成进度或占比情况。
 * 每个指标用一个环形表示，进度用填充的弧线表示。
 * 
 * 数据格式要求：
 * - field: 'value' - 数值字段
 * - 多个指标时使用多个数据项
 * 
 * 样式配置：
 * - radius: 环形半径，默认自动计算
 * - lineWidth: 环形线宽，默认 20
 * - startAngle: 起始角度，默认 -90 (12点钟方向)
 * - max: 最大值，默认 100
 * - showLabel: 是否显示标签，默认 true
 *
 * @class jmRingProgressSeries
 * @module jmChart
 * @extends jmSeries
 * 
 * @example
 * chart.createSeries('ringProgress', {
 *   field: 'value',
 *   style: {
 *     lineWidth: 15,
 *     max: 100,
 *     showLabel: true
 *   }
 * });
 */
class jmRingProgressSeries extends jmSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.ringProgress;
    super(options);
  }

  /**
   * 初始化环形进度图
   */
  init() {
    const data = this.data;
    if (!data || !data.length) return;
    const chartWidth = this.graph.chartArea.width;
    const chartHeight = this.graph.chartArea.height;
    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    const maxRadius = Math.min(chartWidth, chartHeight) / 2 - 20;
    const lineWidth = this.style.lineWidth || 20;
    // 角度转弧度（jmArc 内部使用弧度）
    const DEG = Math.PI / 180;
    const startAngle = (this.style.startAngle !== undefined ? this.style.startAngle : -90) * DEG;
    const maxValue = this.style.max || 100;
    const field = this.field || 'value';
    const len = data.length;
    const ringGap = this.style.ringGap || 10;
    const totalRingSpace = len * lineWidth + (len - 1) * ringGap;
    const availableRadius = maxRadius - totalRingSpace / 2;
    for (let i = 0; i < len; i++) {
      const item = data[i];
      const value = Math.max(0, Math.min(maxValue, item[field] || 0));
      const ratio = value / maxValue;
      const radius = availableRadius + (len - 1 - i) * (lineWidth + ringGap);
      this.createRingBackground(centerX, centerY, radius, lineWidth, i);
      this.createRingProgress(centerX, centerY, radius, lineWidth, startAngle, ratio, i);
      if (this.style.showLabel !== false) {
        this.createRingLabel(centerX, centerY, radius, value, maxValue, i, item);
      }
    }
  }

  /**
   * 创建环形背景
   */
  createRingBackground(centerX, centerY, radius, lineWidth, index) {
    const bgColor = this.style.backgroundColor || '#e0e0e0';
    const bgArc = this.graph.createShape('arc', {
      style: {
        stroke: bgColor,
        fill: 'transparent',
        lineWidth: lineWidth,
        zIndex: 0
      },
      center: {
        x: centerX,
        y: centerY
      },
      radius: radius,
      startAngle: 0,
      endAngle: Math.PI * 2
    });
    this.addShape(bgArc);
  }

  /**
   * 创建环形进度
   */
  createRingProgress(centerX, centerY, radius, lineWidth, startAngle, ratio, index) {
    if (ratio <= 0) return;
    const color = this.getColor(null, index);
    const endAngle = startAngle + ratio * Math.PI * 2;
    const progressArc = this.graph.createShape('arc', {
      style: {
        stroke: color,
        fill: 'transparent',
        lineWidth: lineWidth,
        zIndex: 1,
        ...this.style.progressStyle
      },
      center: {
        x: centerX,
        y: centerY
      },
      radius: radius,
      startAngle: startAngle,
      endAngle: endAngle
    });
    this.addShape(progressArc);
  }

  /**
   * 创建环形标签
   */
  createRingLabel(centerX, centerY, radius, value, maxValue, index, item) {
    const text = this.option.itemLabelFormat ? this.option.itemLabelFormat.call(this, {
      yValue: value,
      index,
      data: item
    }) : `${Math.round(value / maxValue * 100)}%`;
    if (!text) return;
    const label = this.graph.createShape('label', {
      style: {
        fill: this.style.labelColor || '#333',
        font: this.style.labelFont || '14px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
        zIndex: 10
      },
      text: text,
      position: {
        x: centerX,
        y: centerY
      }
    });
    if (index === 0) {
      this.addShape(label);
    }
  }

  /**
   * 获取颜色
   */
  getColor(point, index) {
    if (this.style.colors && this.style.colors.length > 0) {
      return this.style.colors[index % this.style.colors.length];
    }
    if (typeof this.style.color === 'function') {
      return this.style.color.call(this, point, index);
    }
    return this.graph.getColor(index);
  }

  /**
   * 生成图例
   */
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.fill = this.style.color || this.graph.getColor(0);
    style.stroke = style.fill;
    const shape = this.graph.createShape('circle', {
      style: style,
      center: {
        x: this.graph.style.legend.item.shape.width / 2,
        y: this.graph.style.legend.item.shape.height / 2
      },
      radius: this.graph.style.legend.item.shape.height / 2
    });
    this.graph.legend.append(this, shape);
  }
}

/**
 * 箱线图
 * 
 * 箱线图用于展示数据的分布情况，包括最小值、第一四分位数(Q1)、中位数(Q2)、第三四分位数(Q3)和最大值。
 * 可以直观地显示数据的集中趋势、离散程度和异常值。
 * 
 * 数据格式要求：
 * - field: ['min', 'q1', 'median', 'q3', 'max'] - 五个数值字段
 * - xField: 'category' - 分类字段
 * 
 * 样式配置：
 * - boxWidth: 箱体宽度，默认自动计算
 * - whiskerWidth: 须线宽度，默认 1
 * - showOutliers: 是否显示异常值，默认 false
 *
 * @class jmBoxPlotSeries
 * @module jmChart
 * @extends jmSeries
 * 
 * @example
 * chart.createSeries('boxPlot', {
 *   field: ['min', 'q1', 'median', 'q3', 'max'],
 *   xField: 'category'
 * });
 */
class jmBoxPlotSeries extends jmSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.boxPlot;
    super(options);
  }

  /**
   * 初始化箱线图
   */
  init() {
    const data = this.data;
    if (!data || !data.length) return;
    const chartWidth = this.graph.chartArea.width;
    const chartHeight = this.graph.chartArea.height;
    const fields = Array.isArray(this.field) ? this.field : [this.field];
    if (fields.length < 5) {
      console.warn('箱线图需要5个字段（min, q1, median, q3, max）');
      return;
    }
    let allValues = [];
    for (const item of data) {
      for (const f of fields) {
        const v = item[f];
        if (v != null && !isNaN(v)) {
          allValues.push(v);
        }
      }
    }
    if (allValues.length === 0) return;
    const minValue = allValues.reduce((a, b) => Math.min(a, b));
    const maxValue = allValues.reduce((a, b) => Math.max(a, b));
    const valueRange = maxValue - minValue || 1;
    const boxWidth = this.style.boxWidth || chartWidth / data.length * 0.5;
    const whiskerWidth = this.style.whiskerWidth || 1;
    const xField = this.option.xField || 'category';
    const step = chartWidth / data.length;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const min = item[fields[0]];
      const q1 = item[fields[1]];
      const median = item[fields[2]];
      const q3 = item[fields[3]];
      const max = item[fields[4]];
      if ([min, q1, median, q3, max].some(v => v == null || isNaN(v))) {
        continue;
      }
      const minYPos = chartHeight - (min - minValue) / valueRange * chartHeight;
      const q1YPos = chartHeight - (q1 - minValue) / valueRange * chartHeight;
      const medianYPos = chartHeight - (median - minValue) / valueRange * chartHeight;
      const q3YPos = chartHeight - (q3 - minValue) / valueRange * chartHeight;
      const maxYPos = chartHeight - (max - minValue) / valueRange * chartHeight;
      const centerX = step * i + step / 2;
      const leftX = centerX - boxWidth / 2;
      const rightX = centerX + boxWidth / 2;
      const color = this.getColor(item, i);
      this.createBox(leftX, rightX, q1YPos, q3YPos, color);
      this.createMedianLine(leftX, rightX, medianYPos, color);
      this.createWhisker(centerX, minYPos, q1YPos, maxYPos, q3YPos, color, whiskerWidth);
      if (this.style.label && this.style.label.show) {
        this.createBoxLabel(item, centerX, medianYPos, xField);
      }
    }
  }

  /**
   * 创建箱体
   */
  createBox(leftX, rightX, q1Y, q3Y, color) {
    const box = this.graph.createShape('rect', {
      style: {
        fill: this.style.boxFill || 'transparent',
        stroke: color,
        lineWidth: this.style.lineWidth || 1,
        zIndex: 1
      },
      position: {
        x: leftX,
        y: Math.min(q1Y, q3Y)
      },
      width: rightX - leftX,
      height: Math.abs(q3Y - q1Y)
    });
    this.addShape(box);
  }

  /**
   * 创建中位数线
   */
  createMedianLine(leftX, rightX, medianY, color) {
    const line = this.graph.createShape('line', {
      style: {
        stroke: color,
        lineWidth: (this.style.lineWidth || 1) * 2,
        zIndex: 2
      },
      start: {
        x: leftX,
        y: medianY
      },
      end: {
        x: rightX,
        y: medianY
      }
    });
    this.addShape(line);
  }

  /**
   * 创建须线
   */
  createWhisker(centerX, minY, q1Y, maxY, q3Y, color, whiskerWidth) {
    const whiskerLength = this.style.whiskerLength || 20;
    const lowerWhisker = this.graph.createShape('line', {
      style: {
        stroke: color,
        lineWidth: whiskerWidth,
        zIndex: 0
      },
      start: {
        x: centerX,
        y: q1Y
      },
      end: {
        x: centerX,
        y: minY
      }
    });
    this.addShape(lowerWhisker);
    const lowerCap = this.graph.createShape('line', {
      style: {
        stroke: color,
        lineWidth: whiskerWidth,
        zIndex: 0
      },
      start: {
        x: centerX - whiskerLength / 2,
        y: minY
      },
      end: {
        x: centerX + whiskerLength / 2,
        y: minY
      }
    });
    this.addShape(lowerCap);
    const upperWhisker = this.graph.createShape('line', {
      style: {
        stroke: color,
        lineWidth: whiskerWidth,
        zIndex: 0
      },
      start: {
        x: centerX,
        y: q3Y
      },
      end: {
        x: centerX,
        y: maxY
      }
    });
    this.addShape(upperWhisker);
    const upperCap = this.graph.createShape('line', {
      style: {
        stroke: color,
        lineWidth: whiskerWidth,
        zIndex: 0
      },
      start: {
        x: centerX - whiskerLength / 2,
        y: maxY
      },
      end: {
        x: centerX + whiskerLength / 2,
        y: maxY
      }
    });
    this.addShape(upperCap);
  }

  /**
   * 创建箱线图标签
   */
  createBoxLabel(item, centerX, medianY, xField) {
    const text = this.option.itemLabelFormat ? this.option.itemLabelFormat.call(this, {
      data: item
    }) : item[xField];
    if (!text) return;
    const label = this.graph.createShape('label', {
      style: {
        fill: this.style.label.fill || '#333',
        font: this.style.label.font || '12px Arial',
        textAlign: 'center',
        textBaseline: 'top',
        zIndex: 10
      },
      text: text,
      position: {
        x: centerX,
        y: medianY + 5
      }
    });
    this.addShape(label);
  }

  /**
   * 获取颜色
   */
  getColor(item, index) {
    if (typeof this.style.color === 'function') {
      return this.style.color.call(this, item, index);
    }
    return this.style.color || this.graph.getColor(index);
  }

  /**
   * 生成图例
   */
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.fill = this.style.boxFill || 'transparent';
    style.stroke = this.style.color || this.graph.getColor(0);
    const shape = this.graph.createShape('rect', {
      style: style,
      position: {
        x: 0,
        y: 0
      },
      width: this.graph.style.legend.item.shape.width,
      height: this.graph.style.legend.item.shape.height
    });
    this.graph.legend.append(this, shape);
  }
}

/**
 * 词云图
 * 
 * 词云图用于展示文本数据中词语的频率或重要性，词语大小与其权重成正比。
 * 常用于文本分析、舆情监控等场景。
 * 
 * 数据格式要求：
 * - field: 'weight' - 权重字段
 * - xField: 'word' - 词语字段
 * 
 * 样式配置：
 * - minFontSize: 最小字体大小，默认 12
 * - maxFontSize: 最大字体大小，默认 60
 * - colors: 颜色数组
 * - spiral: 是否使用螺旋布局，默认 true
 *
 * @class jmWordCloudSeries
 * @module jmChart
 * @extends jmSeries
 * 
 * @example
 * chart.createSeries('wordCloud', {
 *   field: 'weight',
 *   xField: 'word',
 *   style: {
 *     minFontSize: 14,
 *     maxFontSize: 48
 *   }
 * });
 */
class jmWordCloudSeries extends jmSeries {
  constructor(options) {
    options.style = options.style || options.graph.style.wordCloud;
    super(options);
    this.placedWords = [];
  }

  /**
   * 初始化词云图
   */
  init() {
    const data = this.data;
    if (!data || !data.length) return;
    this.placedWords = [];
    const chartWidth = this.graph.chartArea.width;
    const chartHeight = this.graph.chartArea.height;
    const centerX = chartWidth / 2;
    const centerY = chartHeight / 2;
    const field = this.field || 'weight';
    const xField = this.option.xField || 'word';
    const weights = data.map(item => Math.abs(item[field] || 0));
    const maxWeight = weights.reduce((a, b) => Math.max(a, b));
    const minWeight = weights.reduce((a, b) => Math.min(a, b));
    if (maxWeight === 0) return;
    const minFontSize = this.style.minFontSize || 12;
    const maxFontSize = this.style.maxFontSize || 60;
    const sortedData = [...data].sort((a, b) => (b[field] || 0) - (a[field] || 0));
    for (let i = 0; i < sortedData.length; i++) {
      const item = sortedData[i];
      const weight = item[field] || 0;
      let fontSize;
      if (maxWeight === minWeight) {
        fontSize = (minFontSize + maxFontSize) / 2;
      } else {
        fontSize = minFontSize + (weight - minWeight) / (maxWeight - minWeight) * (maxFontSize - minFontSize);
      }
      const color = this.getColor(item, i);
      const text = item[xField] || '';
      if (!text) continue;
      const position = this.findPosition(centerX, centerY, text, fontSize, chartWidth, chartHeight);
      if (position) {
        this.createWordLabel(text, position.x, position.y, fontSize, color, item);
        this.placedWords.push({
          x: position.x,
          y: position.y,
          width: position.width,
          height: position.height
        });
      }
    }
  }

  /**
   * 查找词语位置
   */
  findPosition(centerX, centerY, text, fontSize, chartWidth, chartHeight) {
    const estimatedWidth = text.length * fontSize * 0.6;
    const estimatedHeight = fontSize * 1.2;
    if (this.style.spiral !== false) {
      return this.findSpiralPosition(centerX, centerY, estimatedWidth, estimatedHeight, chartWidth, chartHeight);
    } else {
      return this.findGridPosition(centerX, centerY, estimatedWidth, estimatedHeight, chartWidth, chartHeight);
    }
  }

  /**
   * 螺旋布局查找位置
   */
  findSpiralPosition(centerX, centerY, width, height, chartWidth, chartHeight) {
    const spiralStep = 5;
    const maxRadius = Math.max(chartWidth, chartHeight);
    let angle = 0;
    let radius = 0;
    for (let i = 0; i < 1000; i++) {
      const x = centerX + radius * Math.cos(angle) - width / 2;
      const y = centerY + radius * Math.sin(angle) - height / 2;
      if (this.canPlace(x, y, width, height, chartWidth, chartHeight)) {
        return {
          x,
          y,
          width,
          height
        };
      }
      angle += 0.5;
      radius += spiralStep * 0.02;
      if (radius > maxRadius) break;
    }
    return null;
  }

  /**
   * 网格布局查找位置
   */
  findGridPosition(centerX, centerY, width, height, chartWidth, chartHeight) {
    const gridSize = 20;
    const halfWidth = chartWidth / 2;
    const halfHeight = chartHeight / 2;
    for (let r = 0; r < Math.max(halfWidth, halfHeight); r += gridSize) {
      for (let dx = -r; dx <= r; dx += gridSize) {
        for (let dy = -r; dy <= r; dy += gridSize) {
          if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          const x = centerX + dx - width / 2;
          const y = centerY + dy - height / 2;
          if (this.canPlace(x, y, width, height, chartWidth, chartHeight)) {
            return {
              x,
              y,
              width,
              height
            };
          }
        }
      }
    }
    return null;
  }

  /**
   * 检查位置是否可用
   */
  canPlace(x, y, width, height, chartWidth, chartHeight) {
    if (x < 0 || y < 0 || x + width > chartWidth || y + height > chartHeight) {
      return false;
    }
    for (const placed of this.placedWords) {
      if (!(x + width < placed.x || x > placed.x + placed.width || y + height < placed.y || y > placed.y + placed.height)) {
        return false;
      }
    }
    return true;
  }

  /**
   * 创建词语标签
   */
  createWordLabel(text, x, y, fontSize, color, item) {
    const label = this.graph.createShape('label', {
      style: {
        fill: color,
        font: `${fontSize}px Arial`,
        textAlign: 'left',
        textBaseline: 'top',
        zIndex: 1
      },
      text: text,
      position: {
        x,
        y
      },
      data: item
    });
    this.addShape(label);
  }

  /**
   * 获取颜色
   */
  getColor(item, index) {
    if (this.style.colors && this.style.colors.length > 0) {
      return this.style.colors[index % this.style.colors.length];
    }
    if (typeof this.style.color === 'function') {
      return this.style.color.call(this, item, index);
    }
    return this.graph.getColor(index);
  }

  /**
   * 生成图例
   */
  createLegend() {
    const style = this.graph.utils.clone(this.style);
    style.fill = this.style.color || this.graph.getColor(0);
    style.stroke = style.fill;
    const shape = this.graph.createShape('label', {
      style: style,
      text: 'Aa',
      position: {
        x: 0,
        y: 0
      }
    });
    this.graph.legend.append(this, shape);
  }
}

/**
 * 轴
 *
 * @class jmMarkLine
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {string} [type] 轴类型(x/y/radar),默认为x
 * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
 * @param {object} [style] 样式
 */

class jmMarkLine extends jmLine {
  constructor(options) {
    super(options);
    this.visible = false;
    this.markLineType = options.type || 'x'; // 为横轴x或纵轴y  

    /**
    * 当前图形下的所有子图
    */
    this.shapes = new jmList();
  }

  // 初始化轴
  init() {
    if (!this.visible) return;

    // 纵标线，中间标小圆圈
    if (this.markLineType === 'y') {
      // 重置所有图形
      let shape;
      while (shape = this.shapes.shift()) {
        shape && shape.remove();
      }
      this.changeTouchPoint();
    }
  }

  // 滑动点改变事件
  changeTouchPoint() {
    // 纵标线，中间标小圆圈
    if (this.markLineType === 'y') {
      const touchPoints = []; // 命中的数据点
      let touchChange = false;
      // chartGraph 表示图表层，有可能当前graph为操作层
      const graph = this.graph.chartGraph || this.graph;
      const isTocuhGraph = graph !== this.graph; // 不在图表图层，在操作图层的情况

      try {
        // 查找最近的X坐标
        const findX = isTocuhGraph ? this.start.x - graph.chartArea.position.x : this.start.x;

        // 根据线条数生成标点个数
        for (const serie of graph.series) {
          // 得有数据描点的才展示圆
          if (!serie.getDataPointByX) continue;
          const point = serie.getDataPointByX(findX); // 找到最近的数据点
          if (!point) continue;

          // 锁定在有数据点的X轴上
          // 如果在操作图层上， 点的X轴需要加上图表图层区域偏移量
          this.start.x = this.end.x = isTocuhGraph ? point.x + graph.chartArea.position.x : point.x;
          const points = point.points || (point.y !== undefined ? [point] : []);
          for (const p of points) {
            if (!p || typeof p.y === 'undefined') continue;
            this.markArc = graph.createShape('circle', {
              style: this.style,
              radius: this.style.radius || 5
            });
            this.markArc.center.y = p.y;
            this.children.add(this.markArc);
            this.shapes.add(this.markArc);
          }
          // x轴改变，表示变换了位置
          if (!touchChange && (!serie.lastMarkPoint || serie.lastMarkPoint.x != point.x)) touchChange = true;
          touchPoints.push(point);
          serie.lastMarkPoint = point; // 记下最后一次改变的点

          // 同时改变下X轴标线的位置，它的Y坐标跟随最后一个命中的线点
          if (graph && graph.markLine && graph.markLine.xMarkLine) {
            graph.markLine.xMarkLine.start.y = graph.markLine.xMarkLine.end.y = isTocuhGraph ? point.y + graph.chartArea.position.y : point.y;
          }
        }
      } catch (e) {
        console.error(e);
      }

      // 触发touch数据点改变事件
      touchChange && this.graph.utils.requestAnimationFrame(() => {
        graph.emit('touchPointChange', {
          points: touchPoints
        });
      }, 10);
    }
  }

  /**
  * 移动标线
  * @param { object } args 移动事件参数
  */
  move(args) {
    // 事件是挂在graph下的，，但此轴是放在chartArea中的。所以事件判断用graph坐标，但是当前位置要相对于chartArea

    if (this.visible && this.markLineType === 'x') {
      // 有操作层的情况下，相对于左上角，否则是chartarea
      if (this.graph.chartGraph) {
        if (args.position.y <= this.graph.chartGraph.chartArea.position.y) {
          this.start.y = this.end.y = this.graph.chartGraph.chartArea.position.y;
        } else if (args.position.y > this.graph.chartGraph.chartArea.height + this.graph.chartGraph.chartArea.position.y) {
          this.start.y = this.end.y = this.graph.chartGraph.chartArea.height + this.graph.chartGraph.chartArea.position.y;
        } else {
          this.start.y = this.end.y = args.position.y;
        }
        this.start.x = this.graph.chartGraph.chartArea.position.x;
        this.end.x = this.start.x + this.graph.chartGraph.chartArea.width;
      } else {
        if (args.position.y <= this.graph.chartArea.position.y) {
          this.start.y = this.end.y = 0;
        } else if (args.position.y > this.graph.chartArea.height + this.graph.chartArea.position.y) {
          this.start.y = this.end.y = this.graph.chartArea.height;
        } else {
          this.start.y = this.end.y = args.position.y - this.graph.chartArea.position.y;
        }
        this.start.x = 0;
        this.end.x = this.graph.chartArea.width;
      }
      this.needUpdate = true;
    }
    if (this.visible && this.markLineType === 'y') {
      // 有操作层的情况下，相对于左上角，否则是chartarea
      if (this.graph.chartGraph) {
        if (args.position.x < this.graph.chartGraph.chartArea.position.x) {
          this.start.x = this.end.x = this.graph.chartGraph.chartArea.position.x;
        } else if (args.position.x > this.graph.chartGraph.chartArea.width + this.graph.chartGraph.chartArea.position.x) {
          this.start.x = this.end.x = this.graph.chartGraph.chartArea.width + this.graph.chartGraph.chartArea.position.x;
        } else {
          this.start.x = this.end.x = args.position.x;
        }
        this.start.y = this.graph.chartGraph.chartArea.position.y;
        this.end.y = this.start.y + this.graph.chartGraph.chartArea.height;
      } else {
        if (args.position.x < this.graph.chartArea.position.x) {
          this.start.x = this.end.x = 0;
        } else if (args.position.x > this.graph.chartArea.width + this.graph.chartArea.position.x) {
          this.start.x = this.end.x = this.graph.chartArea.width;
        } else {
          this.start.x = this.end.x = args.position.x - this.graph.chartArea.position.x;
        }
        this.start.y = 0;
        this.end.y = this.graph.chartArea.height;
      }
      this.needUpdate = true;
    }
  }

  /**
   * 中止
   */
  cancel() {
    this.visible = false;
    this.needUpdate = true;
  }
}

/**
 * 轴
 *
 * @class jmMarkLineManager
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {string} [type] 轴类型(x/y/radar),默认为x
 * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
 * @param {object} [style] 样式
 */

class jmMarkLineManager {
  constructor(chart) {
    this.chart = chart;
    this.init(chart);
  }

  // 初始化
  init(chart) {
    // 没有坐标系的图表不需要标线
    if (!chart.xAxis || !chart.yAxises) return;
    const graph = chart.touchGraph || chart;
    graph.on('beginDraw', () => {
      // 重置标线，会处理小圆圈问题
      this.xMarkLine && this.xMarkLine.init();
      this.yMarkLine && this.yMarkLine.init();
    });
    if (chart.style.markLine) {
      // 生成标线，可以跟随鼠标或手指滑动
      if (chart.style.markLine && chart.style.markLine.x) {
        this.xMarkLine = graph.createShape(jmMarkLine, {
          type: 'x',
          style: chart.style.markLine
        });
        const area = graph.chartArea || graph;
        area.children.add(this.xMarkLine);
      }
      if (chart.style.markLine && chart.style.markLine.y) {
        this.yMarkLine = graph.createShape(jmMarkLine, {
          type: 'y',
          style: chart.style.markLine
        });
        const area = graph.chartArea || graph;
        area.children.add(this.yMarkLine);
      }
      let longtap = 0; // 是否有长按, 0 未开始，1已按下，2识别为长按
      let lineTouching = 0; // 1=启用标线状态，2=非标线，则可以触发系统行为
      let longtapHandler = 0;
      let touchStartPos = {
        x: 0,
        y: 0
      };
      let lastMoveTime = 0;
      const MOVE_THROTTLE = 16; // 约60fps

      graph.on('mousedown touchstart', args => {
        lineTouching = 0;
        // 如果长按才启用
        if (chart.style.markLine.longtap) {
          longtap = 1;
          longtapHandler && graph.utils.cancelAnimationFrame(longtapHandler);
          const tapStartTime = Date.now();
          const reqFun = () => {
            if (longtap === 1 || longtap === 2) {
              // 如果还未过一定时间，则继续等待
              if (Date.now() - tapStartTime < 500) {
                longtapHandler = graph.utils.requestAnimationFrame(reqFun);
                return;
              }
              longtap = 2;
              this.startMove(args);
              chart.emit('marklinelongtapstart', args);
            }
          };
          // 如果一定时间后还没有取消，则表示长按了
          longtapHandler = graph.utils.requestAnimationFrame(reqFun);
        } else {
          this.startMove(args);
        }
        args.longtap = longtap;
        touchStartPos = args.position;
      });
      // 移动标线
      graph.on('mousemove touchmove', args => {
        // 添加节流，减少重绘次数
        const now = Date.now();
        if (now - lastMoveTime < MOVE_THROTTLE) {
          return;
        }
        lastMoveTime = now;
        args.offsetInfo = {
          x: 0,
          y: 0,
          offset: 0
        };
        args.offsetInfo.x = args.position.x - touchStartPos.x;
        args.offsetInfo.y = args.position.y - touchStartPos.y;
        args.offsetInfo.offset = Math.sqrt(args.offsetInfo.x * args.offsetInfo.x + args.offsetInfo.y * args.offsetInfo.y);

        // 记录当次滑动的位置
        touchStartPos = args.position;

        // 如果是长按启用，但手指又滑动了。则取消标线
        if (longtap === 1) {
          if (args.offsetInfo.offset > 15) longtap = 0; // 如果移动了，则取消长按
          else lineTouching = 1;
        }
        args.event && args.event.stopPropagation && args.event.stopPropagation();
        // 如果指定了锁定图表标线操作值，则触发后当次滑动不再响应系统默认行为
        if (chart.style.markLine.lock) {
          // 标线状态一直禁用系统能力
          // 如果指定了锁定值，只需要一项符合要求就进行锁定
          if (lineTouching === 0 && (chart.style.markLine.lock.y && Math.abs(args.offsetInfo.y) < chart.style.markLine.lock.y || chart.style.markLine.lock.x && Math.abs(args.offsetInfo.x) < chart.style.markLine.lock.x) || lineTouching === 1) {
            lineTouching = 1;
            args.event && args.event.preventDefault && args.event.preventDefault(); // 阻止默认行为
          }
        }
        if (lineTouching === 0) lineTouching = 2;
        args.longtap = longtap;
        this.move(args);
      });
      // 取消移动
      graph.on('mouseup touchend touchcancel touchleave', args => {
        longtap = 0;
        lineTouching = 0;
        this.endMove(args);
      });
    }
  }

  // 开始移动标线
  startMove(args, markLineType = 'xy') {
    if (this.xMarkLine && markLineType.includes('x')) {
      this.xMarkLine.visible = true;
      this.xMarkLine.move(args);
    }
    if (this.yMarkLine && markLineType.includes('y')) {
      this.yMarkLine.visible = true;
      this.yMarkLine.move(args);
    }
    if (!args.cancel) this.chart.emit('marklinestartmove', args);
  }

  // 移动标线
  move(args) {
    let moved = false;
    if (this.xMarkLine && this.xMarkLine.visible) {
      this.xMarkLine.move(args);
      moved = true;
    }
    if (this.yMarkLine && this.yMarkLine.visible) {
      this.yMarkLine.move(args);
      moved = true;
    }
    if (moved) {
      if (args.longtap === 2 && args.event) {
        args.event.preventDefault && args.event.preventDefault(); // 阻止默认行为			
        args.event.stopPropagation && args.event.stopPropagation();
      }
      if (!args.cancel) this.chart.emit('marklinemove', args);
    }
  }
  // 终止动移
  endMove(args) {
    if (this.xMarkLine && this.xMarkLine.visible) {
      this.xMarkLine.cancel(args);
    }
    if (this.yMarkLine && this.yMarkLine.visible) {
      this.yMarkLine.cancel(args);
    }
    if (!args.cancel) this.chart.emit('marklineendmove', args);
  }
}

/**
 * jm图表组件
 * option参数:graph=jmgraph
 *
 * @class jmChart
 * @module jmChart
 * @param {element} container 图表容器
 */
class jmChart extends jmGraphImpl {
  constructor(container, options) {
    options = options || {};
    const enableAnimate = !!options.enableAnimate;
    options.autoRefresh = typeof options.autoRefresh === 'undefined' ? enableAnimate : options.autoRefresh;
    if (enableAnimate && !options.autoRefresh) {
      console.warn('开启了动画，却没有开启自动刷新');
    }
    options.style = jmUtils.clone(defaultStyle, options.style, true);
    super(container, options);
    /**
     * 绑定的数据源
     */
    _defineProperty(this, "data", []);
    /**
     * 当前所有图
     */
    _defineProperty(this, "series", new jmList());
    this.enableAnimate = enableAnimate;
    this.data = options.data || [];
    this.xField = options.xField || '';
    this._cache = new Map();
    this.init(options);
    this.createTouchGraph(this.container, options);
  }
  /**
   * 是否启用动画
   */
  get enableAnimate() {
    if (typeof this.option.enableAnimate !== 'undefined') return !!this.option.enableAnimate;else {
      return false;
    }
  }
  set enableAnimate(v) {
    this.option.enableAnimate = v;
  }

  /**
   * Y轴的基线 默认是0
   */
  get baseY() {
    return this.option.baseY;
  }
  set baseY(v) {
    this.option.baseY = v;
  }

  // 初始化图表
  init(options) {
    /**
     * 绘图区域
     *
     * @property chartArea
     * @type jmControl
     */
    if (!this.chartArea) {
      this.chartArea = this.createShape('rect', {
        style: this.style.chartArea,
        position: {
          x: 0,
          y: 0
        }
      });
      this.children.add(this.chartArea);
    }

    /**
     * 图例
     *
     * @property legend
     * @type jmLegend
     */
    this.legend = this.legend || this.createShape(jmLegend, {
      style: this.style.legend
    });
    this.children.add(this.legend);
    // 不显示图例
    if (options.legendVisible === false) {
      this.legend.visible = false;
    }

    /**
     * 图表提示控件
     *
     * @property tooltip
     * @type jmTooltip
     */
    //this.tooltip = this.graph.createShape('tooltip',{style:this.style.tooltip});
    //this.chartArea.children.add(this.tooltip);

    this.createXAxis(); // 生成X轴

    // 绑定点击事件
    this.on('click', args => {
      if (!this.option.onClick) return;
      // 找到点击位置的数据点
      let closestPoint = null;
      let minDistance = 20; // 20px 范围，同时作为阈值，无需再比较小于阈值

      this.series.each((i, serie) => {
        if (!serie.dataPoints) return;
        const points = serie.dataPoints;
        for (let j = 0, len = points.length; j < len; j++) {
          const point = points[j];
          const dx = args.position.x - point.x;
          const dy = args.position.y - point.y;
          const distance = dx * dx + dy * dy; // 避免开方，直接比较平方
          if (distance < minDistance * minDistance) {
            minDistance = distance;
            closestPoint = point;
          }
        }
      });
      if (closestPoint) {
        this.option.onClick(closestPoint);
      }
    });
  }

  // 创建一个操作层，以免每次刷新
  createTouchGraph(container, options) {
    if (container && container.tagName === 'CANVAS') {
      container = container.parentElement;
    }
    container && container.style && (container.style.position = 'relative');
    // 要先从选项中取出canvas，否则clone过滤掉
    let cn = options.touchCanvas;

    // 生成图层, 当图刷新慢时，需要用一个操作图层来进行滑动等操作重绘
    // isWXMiniApp 非微信小程序下才能创建
    if (container && (options.touchGraph || cn)) {
      if (!cn && !this.isWXMiniApp) {
        cn = document.createElement('canvas');
        cn.width = container.offsetWidth || container.clientWidth;
        cn.height = container.offsetHeight || container.clientHeight;
        cn.style.position = 'absolute';
        cn.style.top = 0;
        cn.style.left = 0;
        container.appendChild(cn);
      }
      if (cn) {
        options = this.utils.clone(options, {
          autoRefresh: true
        }, true);
        this.touchGraph = new jmGraphImpl(cn, options);
        this.touchGraph.chartGraph = this;
        this.on('propertyChange', (name, args) => {
          if (['width', 'height'].includes(name)) {
            this.touchGraph[name] = args.newValue;
          }
        });
        // 把上层canvse事件传递给绘图层对象
        this.touchGraph.on('mousedown touchstart mousemove touchmove mouseup touchend touchcancel touchleave', args => {
          const eventName = args.event.eventName || args.event.type;
          if (eventName) {
            this.emit(eventName, args);
            args.event.stopPropagation && args.event.stopPropagation();
          }
        });
      }
    }
    // 初始化标线
    this.markLine = new jmMarkLineManager(this);
  }

  // 重置整个图表
  reset() {
    // 清空当前图形，重新生成
    let serie;
    while (serie = this.series.shift()) {
      // 重置所有图形
      let shape;
      while (shape = serie.shapes.shift()) {
        shape && shape.remove();
      }
      serie.remove();
    }

    // 轴删除
    if (this.xAxis) {
      this.xAxis.remove();
      delete this.xAxis;
    }
    if (this.yAxises) {
      const keys = Object.keys(this.yAxises);
      for (let k = 0; k < keys.length; k++) {
        this.yAxises[keys[k]].remove();
      }
      delete this.yAxises;
    }
  }
  /**
   * 获取颜色，使用缓存优化性能
   *
   * @method getColor 
   * @param {int} index 颜色索引
   */
  getColor(index) {
    const colors = this.style.chartColors;
    const colorIndex = index % colors.length;
    return colors[colorIndex];
  }

  /**
   * 绘制当前图表
   * 先绘制轴等基础信息
   *
   * @method beginDraw 
   */
  beginDraw() {
    if (this.legend) {
      this.legend.init();
    }
    this.resetAreaPosition();
    if (this.xAxis) {
      this.xAxis.clear();
    }
    if (this.yAxises) {
      const keys = Object.keys(this.yAxises);
      for (let k = 0; k < keys.length; k++) {
        this.yAxises[keys[k]].clear();
      }
    }
    this.barSeriesCount = 0;
    // 合并两次 series 遍历为一次，减少遍历开销
    const seriesInited = [];
    this.series.each((i, serie) => {
      if (!serie.style.color) {
        serie.style.color = serie.graph.getColor(i);
      }
      if (serie instanceof jmBarSeries) {
        if (serie.graph.style.layout != 'inside') {
          serie.graph.style.layout = 'inside';
        }
        serie.barIndex = serie.graph.barSeriesCount;
        serie.graph.barSeriesCount++;
      }
      serie.reset();
      seriesInited.push(serie);
    });
    if (this.legend) {
      this.legend.reset();
    }
    if (this.yAxises) {
      const keys = Object.keys(this.yAxises);
      for (let k = 0; k < keys.length; k++) {
        this.yAxises[keys[k]].reset();
      }
    }
    if (this.xAxis) {
      this.xAxis.reset();
    }
    for (let i = 0; i < seriesInited.length; i++) {
      seriesInited[i].init && seriesInited[i].init();
    }
  }

  /**
   * 重新定位区域的位置
   *
   * @method resetAreaPosition
   */
  resetAreaPosition() {
    this.chartArea.position.x = this.style.margin.left || 0;
    this.chartArea.position.y = this.style.margin.top || 0;
    const w = this.width - this.style.margin.right - this.chartArea.position.x;
    const h = this.height - this.style.margin.bottom - this.chartArea.position.y;
    this.chartArea.width = w;
    this.chartArea.height = h;
  }

  /**
   * 创建轴
   *
   * @method createAxis
   * @for jmChart
   * @param {string} [type] 轴类型(x/y/radar),默认为x
   * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
   * @param {object} [style] 样式
   * @return {axis} 轴
   */
  createAxis(options) {
    // 深度组件默认样式
    options.style = options.style ? this.utils.clone(this.style.axis, options.style, true) : this.style.axis;
    const axis = this.createShape(jmAxis, options);
    if (typeof options.visible !== 'undefined') axis.visible = options.visible;
    this.children.add(axis);
    return axis;
  }

  /**
   * 生成X轴
   *
   * @method createXAxis
   * @param {string} x轴的数据类型(string/number/date)
   * @param {bool} 是否从0开始
   */
  createXAxis(options) {
    if (!this.xAxis) {
      options = Object.assign({
        field: this.xField,
        type: 'x',
        visible: this.style.axis.x === false ? false : true,
        format: this.option.xLabelFormat,
        ...this.option.xAxisOption
      }, options || {});
      if (typeof this.option.minXValue !== 'undefined') {
        options.minXValue = typeof options.minXValue === 'undefined' ? this.option.minXValue : Math.min(this.option.minXValue, options.minXValue);
      }
      if (typeof this.option.maxXValue !== 'undefined') {
        options.maxXValue = typeof options.maxXValue === 'undefined' ? this.option.maxXValue : Math.max(this.option.maxXValue, options.maxXValue);
      }
      this.xAxis = this.createAxis(options);
    }
    return this.xAxis;
  }

  /**
   * 生成Y轴
   *
   * @method createYAxis
   * @param {int} Y轴索引，可以创建多个Y轴
   * @param {string} y轴的数据类型(string/number/date)
   * @param {bool} 是否从0开始
   */
  createYAxis(options) {
    if (!this.yAxises) {
      this.yAxises = {};
    }
    options = Object.assign({
      index: 1,
      type: 'y',
      visible: this.style.axis.y === false ? false : true,
      format: this.option.yLabelFormat,
      zeroBase: this.baseY === 0,
      ...this.option.yAxisOption
    }, options || {});
    if (typeof this.option.minYValue !== 'undefined') {
      options.minYValue = typeof options.minYValue === 'undefined' ? this.option.minYValue : Math.min(this.option.minYValue, options.minYValue);
    }
    if (typeof this.option.maxYValue !== 'undefined') {
      options.maxYValue = typeof options.maxYValue === 'undefined' ? this.option.maxYValue : Math.max(this.option.maxYValue, options.maxYValue);
    }
    const yaxis = this.yAxises[options.index] || (this.yAxises[options.index] = this.createAxis(options));
    return yaxis;
  }

  /**
   * 创建图形
   *
   * @method createSeries
   * @for jmChart
   * @param {string} [type] 图类型，（line/bar/pie/radar）
   * @param {object} [options] 生成图表选项 {xField, yField, index}
   * @return {series} 图形
   */
  createSeries(type, options = {}) {
    if (!this.serieTypes) {
      this.serieTypes = {
        'line': jmLineSeries,
        'bar': jmBarSeries,
        'stackBar': jmStackBarSeries,
        'pie': jmPieSeries,
        'radar': jmRadarSeries,
        'stackLine': jmStackLineSeries,
        'range': jmRangeSeries,
        'candlestick': jmCandlestickSeries,
        'scatter': jmScatterSeries,
        'bubble': jmBubbleSeries,
        'heatmap': jmHeatmapSeries,
        'gauge': jmGaugeSeries,
        'area': jmAreaSeries,
        'waterfall': jmWaterfallSeries,
        'funnel': jmFunnelSeries,
        'ringProgress': jmRingProgressSeries,
        'boxPlot': jmBoxPlotSeries,
        'wordCloud': jmWordCloudSeries
      };
    }

    //默认样式为类型对应的样式
    const style = this.style[type] || this.style['line'];
    // 深度组件默认样式
    options.style = this.utils.clone(style, options.style, true);
    if (typeof type == 'string') type = this.serieTypes[type];
    const serie = this.createShape(type, options);
    if (serie) {
      this.series.add(serie);
      this.chartArea.children.add(serie);
    }
    return serie;
  }

  // 销毁
  destroy() {
    super.destroy();
    this.touchGraph && this.touchGraph.destroy();
  }
}

var vchart = {
  props: {
    chartData: Array,
    chartOptions: Object,
    chartSeries: Array,
    width: {
      type: String,
      default: 200
    },
    height: {
      type: String,
      default: 200
    }
  },
  data: function () {
    return {
      option: this.chartOptions
    };
  },
  chartInstance: null,
  mounted() {
    this.option = Object.assign({
      enableAnimate: false,
      legendPosition: 'top',
      legendVisible: true,
      width: this.width,
      height: this.height
    }, this.chartOptions);
    this.initChart();
  },
  updated() {
    this.refresh();
  },
  destroyed() {
    this.chartInstance && this.chartInstance.destroy();
  },
  watch: {
    chartData: {
      handler: function (newData, oldData) {
        this.refresh();
      },
      deep: false // 仅监听引用变化，由使用者显式替换数组时触发
    },
    chartOptions: {
      handler: function (newOptions, oldOptions) {
        // 配置变化时需要重建图表
        if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
        }
        this.option = Object.assign({
          enableAnimate: false,
          legendPosition: 'top',
          legendVisible: true,
          width: this.width,
          height: this.height
        }, newOptions);
        this.$nextTick(() => this.initChart());
      },
      deep: false
    },
    width: function (newWidth, oldWidth) {
      if (!this.chartInstance) return;
      this.$nextTick(() => {
        if (!this.chartInstance || !this.$refs.jmChartContainer) return;
        this.chartInstance.width = this.$refs.jmChartContainer.clientWidth || this.$refs.jmChartContainer.offsetWidth;
      });
    },
    height: function (newHeight, oldHeight) {
      if (!this.chartInstance) return;
      this.$nextTick(() => {
        if (!this.chartInstance || !this.$refs.jmChartContainer) return;
        this.chartInstance.height = this.$refs.jmChartContainer.clientHeight || this.$refs.jmChartContainer.offsetHeight;
      });
    }
  },
  methods: {
    initChart() {
      if (this.chartInstance) return;
      this.chartInstance = new jmChart(this.$refs.jmChartContainer, this.option);
      if (this.chartData && this.chartData.length) this.refresh();
      this.chartInstance.bind('touchPointChange', args => {
        this.$emit('touch-point-change', args);
      });
      this.chartInstance.bind('marklinelongtapstart', args => {
        this.$emit('markline-longtap-start', args);
      });
      this.chartInstance.bind('marklinestartmove', args => {
        this.$emit('markline-start-move', args);
      });
      this.chartInstance.bind('marklinemove', args => {
        this.$emit('markline-move', args);
      });
      this.chartInstance.bind('marklineendmove', args => {
        this.$emit('markline-end-move', args);
      });
      this.chartInstance.touchGraph.bind('touchstart mousedown', args => {
        this.$emit('touchstart', args);
        this.$emit('mousedown', args);
      });
      this.chartInstance.touchGraph.bind('touchmove mousemove', args => {
        this.$emit('touchmove', args);
        this.$emit('mousemove', args);
      });
      this.chartInstance.touchGraph.bind('touchend touchcancel mouseup', args => {
        this.$emit('touchend', args);
        this.$emit('mouseup', args);
      });
      this.chartInstance.touchGraph.bind('touchleave', args => {
        this.$emit('touchleave', args);
      });
    },
    refresh() {
      this.$nextTick(() => {
        this.initChart();
        this.chartInstance.reset();
        if (this.chartSeries && this.chartSeries.length) {
          for (let s of this.chartSeries) {
            if (!s.type) {
              console.error('必须指定serie type');
              continue;
            }
            this.chartInstance.createSeries(s.type, s);
          }
        }
        this.chartInstance.data = this.chartData;
        this.chartInstance.refresh();
      });
    }
  },
  template: `<div ref="jmChartContainer" :style="{width: width, height: height}"></div>`
};

exports["default"] = jmChart;
exports.jmChart = jmChart;
exports.vChart = vchart;
