/**
 * @Description:
 * @Author BPF
 * @create 2021/12/6 16:20
 */

/**
 * 判断各个类型
 * @type {{isObject: (function(*): boolean), isSymbol: (function(*=): boolean), isFunction: (function(*=): boolean), isSet: (function(*=): boolean), isRegExp: (function(*=): boolean), isArrayEmpty: (function(*=)), isPC: (function(): boolean), isStringEmpty: (function(*=)), isBoolean: (function(*=): boolean), isPromise: (function(*=): boolean), isError: (function(*=): boolean), isNumber: (function(*=): boolean), isNull: (function(*): boolean), browser: ((function(): (string|{isOpera: boolean, isIE11: boolean, isEdge: boolean, isFF: boolean, isSafari: boolean, isChrome: boolean}))|*), isString: (function(*): boolean), isDate: (function(*=): boolean), isUndefined: (function(*=): boolean), isWx: (function(): boolean), isAndroid: (function()), isIos: ((function(): (boolean))|*)}}
 */
export const TYPE = {
  /**
   * 是否是字符串
   * @param {any} args
   * @returns {boolean}
   */
  isString: args => Object.prototype.toString.call(args) === '[object String]',

  /**
   * 是否是对象
   * @param {any} args
   * @returns {boolean}
   */
  isObject: args => Object.prototype.toString.call(args) === '[object Object]',

  /**
   * 是否是null
   * @param {any} args
   * @returns {boolean}
   */
  isNull: args => Object.prototype.toString.call(args) === '[object Null]',
  isUndefined: args => Object.prototype.toString.call(args) === '[object Undefined]',
  isNumber: args => Object.prototype.toString.call(args) === '[object Number]',
  isFunction: args => Object.prototype.toString.call(args) === '[object Function]',
  isArrayEmpty: args => Array.isArray(args) && args.length == 0,
  isStringEmpty: args => String.isString(args) && args == '',
  isBoolean: o => Object.prototype.toString.call(o).slice(8, -1) === 'Boolean',
  isDate: o => Object.prototype.toString.call(o).slice(8, -1) === 'Date',
  isRegExp: o => Object.prototype.toString.call(o).slice(8, -1) === 'RegExp',
  isError: o => Object.prototype.toString.call(o).slice(8, -1) === 'Error', //是否错误对象
  isSymbol: o => Object.prototype.toString.call(o).slice(8, -1) === 'Symbol', //是否Symbol函数
  isPromise: o => Object.prototype.toString.call(o).slice(8, -1) === 'Promise', //是否Promise对象
  isSet: o => Object.prototype.toString.call(o).slice(8, -1) === 'Set', //是否Set对象
  isWx: () => navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger', // 判断是否在微信环境中
  isIos: () => {
    let u = navigator.userAgent
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
      //安卓手机
      // return "Android";
      return false
    } else if (u.indexOf('iPhone') > -1) {
      //苹果手机
      // return "iPhone";
      return true
    } else if (u.indexOf('iPad') > -1) {
      //iPad
      // return "iPad";
      return false
    } else if (u.indexOf('Windows Phone') > -1) {
      //winphone手机
      // return "Windows Phone";
      return false
    } else {
      return false
    }
  },
  isAndroid: () => navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1,

  isPC: () => {
    //是否为PC端
    let userAgentInfo = navigator.userAgent
    let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    let flag = true
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  },

  browser: () => {
    let userAgent = navigator.userAgent //取得浏览器的userAgent字符串
    let isOpera = userAgent.indexOf('Opera') > -1 //判断是否Opera浏览器
    let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera //判断是否IE浏览器
    let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
    let isEdge = userAgent.indexOf('Edge') > -1 && !isIE //判断是否IE的Edge浏览器
    let isFF = userAgent.indexOf('Firefox') > -1 //判断是否Firefox浏览器
    let isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1 //判断是否Safari浏览器
    let isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1 //判断Chrome浏览器

    if (isIE) {
      let reIE = new RegExp('MSIE (\\d+\\.\\d+);')
      reIE.test(userAgent)
      let fIEVersion = parseFloat(RegExp['$1'])
      if (fIEVersion == 7) return 'IE7'
      else if (fIEVersion == 8) return 'IE8'
      else if (fIEVersion == 9) return 'IE9'
      else if (fIEVersion == 10) return 'IE10'
      else return 'IE7以下' //IE版本过低
    }

    return {
      isIE11: isIE11,
      isEdge: isEdge,
      isFF: isFF,
      isOpera: isOpera,
      isSafari: isSafari,
      isChrome: isChrome
    }
  }
}
