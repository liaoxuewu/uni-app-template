/**
 * @Description:
 * @Author BPF
 * @create 2021/12/5 16:11
 */

import { debounce as debounceFn, throttle as throttleFn } from '@/common/utils/common'

/**
 * 函数节流装饰器
 * @param {number} wait 节流的毫秒
 * [options.leading=true] (boolean): 指定调用在节流开始前。
 * [options.trailing=true] (boolean): 指定调用在节流结束后。
 */
export const throttle = function (wait) {
  return function (target, name, descriptor) {
    descriptor.value = throttleFn(descriptor.value, wait)
  }
}

/**
 * 函数防抖装饰器
 * @param {number} wait 需要延迟的毫秒数。
 * [options.leading=false] (boolean): 指定在延迟开始前调用。
 * [options.maxWait] (number): 设置 func 允许被延迟的最大值。
 */
export const debounce = function (wait) {
  return function (target, name, descriptor) {
    descriptor.value = debounceFn(descriptor.value, wait)
  }
}

export function log(target, name, decriptor) {
  let _origin = decriptor.value
  decriptor.value = function () {
    console.log(`Calling ${name} with `, arguments)
    return _origin.apply(null, arguments)
  }

  return decriptor
}
