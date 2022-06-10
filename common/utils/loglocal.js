/**
 * 2022-3-31 2012 陆文伟
 * 本地日志存储工具
 */
import io from '@/common/utils/helper-io.js'
var comm = require('@/common/utils/common.js')
module.exports = {
  LogLevles: ['DEBUG', 'INFO', 'ERROR'],

  _log: function (msg, obj, levlename) {
    let cfg = getApp().globalData.logLevel
    let cfglv = this.LogLevles.indexOf(cfg)
    let curlv = this.LogLevles.indexOf(levlename)
    //console.debug(`预设${cfglv},记录${curlv}`);
    if (curlv >= cfglv) {
      //console.log(comm.getFormatDateTime(new Date()));
      let date = comm.getTodayStamp()
      //console.log(date);
      io.localFileWriteLine(
        `Log/Log${date}.log`,
        `[${levlename}][${comm.getFormatDateTime(new Date())}] - ${msg} - ${JSON.stringify(obj)} `
      )
        .then(e => {
          console.log('日志成功')
        })
        .catch(e => {
          console.log('日志异常', e)
        })
    }
  },
  /**
   * 普通信息
   * @param {String} msg 消息
   * @param {Object} obj 其他
   */
  LogInfo: function (msg, obj) {
    this._log(msg, obj, 'INFO')
  },
  /**
   * 异常信息
   * @param {String} msg 消息
   * @param {Object} obj 其他
   */
  LogError: function (msg, obj) {
    this._log(msg, obj, 'ERROR')
  },
  /**
   * 调试信息
   * @param {String} msg 消息
   * @param {Object} obj 其他
   */
  LogDebug: function (msg, obj) {
    this._log(msg, obj, 'DEBUG')
  }
}
