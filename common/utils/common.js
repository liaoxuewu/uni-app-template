/**
 * 获取角色code
 * @param key
 * @returns {*}
 */
export const getRoleCode = key => ROLES_OBJ[key]?.code

/**
 * 将tree结构 转化成 list
 * @param tree 要转换的tree数据集
 * @param props 自定义字段
 * @param retainChild 是否保留每一项中的 子节点
 * @param PID
 * @param list 要转化成list
 * @returns {*[]}
 */
export const treeToList = ({
  tree = [],
  props = {
    id: 'id',
    parentId: 'parentId',
    children: 'children'
  },
  retainChild = false,
  PID = '0',
  list = []
}) => {
  if (Array.isArray(tree) && tree.length) {
    tree.forEach((item, index) => {
      if (!item.PID) item.PID = PID
      item.ID = `${item.PID}-${index + 1}`
      list.push(item)
      if (Array.isArray(item[props.children]) && item[props.children].length) {
        treeToList({
          tree: item[props.children],
          props,
          retainChild,
          PID: item.ID,
          list
        })
      }
    })
  }

  if (!retainChild) {
    list.forEach(item => {
      delete item[props.children]
    })
  }

  return list
}

/**
 * 自动化注册 需要模块
 * @param requireContext 语法require.context(目录,是否递归目录, 文件筛选条件)所有参数必须是直接字符串，变量无效。
 * @param exclude 只引入包括的模块
 * @param include 排除的模块 include 和 exclude不能同时共用
 * @returns {*}  Array
 */
export const requireAllModule = ({ requireContext, exclude = [], include = [] }) => {
  if (!Array.isArray(exclude)) {
    console.error('[warning] exclude字段类型应为Array')
    exclude = []
  }
  if (!Array.isArray(include)) {
    console.error('[warning] include字段类型应为Array')
    include = []
  }
  const isNoEmptyArray = function () {
    return !!(Array.isArray(this) && this.length)
  }
  const isEmptyArray = function () {
    return !!(Array.isArray(this) && this.length === 0)
  }
  if (isNoEmptyArray.apply(exclude) && isNoEmptyArray.apply(include)) {
    throw new Error('include 和 exclude字段不能同时共用')
  }
  const requireAll = context =>
    context.keys().reduce((pre, cur) => {
      const _key = cur.replace(/^\.\/(.*)\.\w+$/, '$1')
      if (isNoEmptyArray.apply(include)) {
        include.some(v => new RegExp(v).test(_key)) && pre.push(context(cur))
      } else if (isNoEmptyArray.apply(exclude)) {
        exclude.every(v => !new RegExp(v).test(_key)) && pre.push(context(cur))
      } else if (isEmptyArray.apply(include) && isEmptyArray.apply(exclude)) {
        pre.push(context(cur))
      }
      return pre
    }, [])
  return requireAll(requireContext)
}

/**
 * 截流函数
 * @param fn
 * @param wait
 */
export function throttle(fn, wait = 800) {
  let startTime = 0
  return function () {
    let now = Date.now()
    let resTime = now - startTime
    if (resTime >= wait) {
      fn.apply(this, arguments)
      startTime = now
    }
  }
}

/**
 * 防抖函数
 * @param fn
 * @param wait
 */
export function debounce(fn, wait = 800) {
  let timer
  return function () {
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}

/**
 * 获取UUID
 * @returns {`X${string}${string}`}
 */
export const getUUID = () => `X${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`

/**
 * @description: 获取今天前后多少天的日期
 * @param day
 */
export const getDayFromNow = day => {
  const today = new Date()
  const times = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(times)

  const tYear = today.getFullYear()
  const tMonth = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1
  const tDate = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
  return tYear + '-' + tMonth + '-' + tDate
  //return tDate;
}

/**
 * @description: 获取当前日期戳YYYY-MM-DD
 * @param day
 */
export const getTodayStamp = () => {
  const now = new Date()
  var year = now.getFullYear() //取得4位数的年份
  var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
  return year + '-' + month + '-' + date
}

/**
 * @description: 获取时间戳
 * @param datetime 时间
 */
export const getFormatDateTime = datetime => {
  let now = new Date(datetime)
  var year = now.getFullYear() //取得4位数的年份
  var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
  var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
  var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
  var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
  var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
  return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
}

/**
 * @description: 操作DOM
 * @param select 容器标识
 */
export const queryViewData = select => {
  return new Promise((resolve, reject) => {
    uni
      .createSelectorQuery()
      .select(select)
      .boundingClientRect(data => {
        resolve(data)
      })
      .exec()
  })
}
