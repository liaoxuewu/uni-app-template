/**
 * 2022-3-31 2012 陆文伟
 * io操作工具
 */
module.exports = {
  /**
   *  H5+提供了几个变量，文件目录
   *  PRIVATE_WWW:应用是私有资源目录常量，这个目录是只读的，所以无法编辑文件
   *  PRIVATE_DOC：应用私有文档目录常量
   *  PUBLIC_DOCUMENTS：应用公共文档目录常量
   *  PUBLIC_DOWNLOADS：应用公共下载目录常量
   *  产量使用方式 plus.io.PRIVATE_WWW
   */
  PRIVATE_WWW: plus.io.PRIVATE_WW,
  PRIVATE_DOC: plus.io.PRIVATE_DOC,
  PUBLIC_DOCUMENTS: plus.io.PUBLIC_DOCUMENTS,
  PUBLIC_DOWNLOADS: plus.io.PUBLIC_DOWNLOADS,

  /**
   * 复制static目录下的文件到设备的指定目录，
   * @param {String} static目录下的文件名
   * @param {String} tofolder 复制的目录,例如'_doc/'
   */
  copyFileFromStatic: function (staticfilename, tofolder) {
    return new Promise((resolve, reject) => {
      console.log(plus.io)
      plus.io.resolveLocalFileSystemURL('_www/static/' + staticfilename, function (entry) {
        plus.io.resolveLocalFileSystemURL(tofolder, function (docEntry) {
          entry.copyTo(
            docEntry,
            staticfilename,
            function (data) {
              console.log('复制文件成功' + data.fullPath)
              resolve(data)
            },
            function (err) {
              console.error('复制文件异常')
              reject(err)
            }
          )
        })
      })
    })
  },
  /**
   * 编辑本地文件，文件都放在plus.io.PRIVATE_DOC下
   * @param {Object} fielname 文件名称
   */
  _localFileWriter: function (fielname, stringValue, writefunction) {
    return new Promise((resolve, reject) => {
      // 请求本地系统文件对象 plus.io.PRIVATE_WWW：应用运行资源目录常量
      plus.io.requestFileSystem(
        plus.io.PRIVATE_DOC,
        fs => {
          // 创建或打开文件, fs.root是根目录操作对象,直接fs表示当前操作对象
          fs.root.getFile(
            fielname,
            {
              create: true // 文件不存在则创建
            },
            fileEntry => {
              // 文件在手机中的路径
              console.log(`文件路径 ${fileEntry.fullPath}`)
              fileEntry.createWriter(writer => {
                // 写入文件成功完成的回调函数
                writer.onwrite = e => {
                  resolve(e) //成功回调
                }
                writefunction(writer)
                //追加写入
                //writer.seek(writer.length - 1)
                // 向文件中写入数据
                //writer.write(stringValue);
              })
            },
            e => {
              console.log('getFile failed: ' + e.message)
              reject(e) //回失败调
            }
          )
        },
        e => {
          console.log(e.message)
          reject(e) //回失败调
        }
        // resolve(e); //成功回调
        // reject(e); //回失败调
      )
    })
  },

  /**
   * 文本追加，并且换行
   * @param {Object} fielname
   * @param {Object} stringValue
   */
  localFileWriteLine: function (fielname, stringValue) {
    return this._localFileWriter(fielname, stringValue, writer => {
      writer.seek(writer.length - 1)
      writer.write(stringValue + '\r\n')
    })
  },

  /**
   * 文本追加，并且换行
   * @param {Object} fielname
   * @param {Object} stringValue
   */
  localFileAppend: function (fielname, stringValue) {
    return this._localFileWriter(fielname, stringValue, writer => {
      writer.seek(writer.length - 1)
      writer.write(stringValue)
    })
  },

  /**
   *  读取本地文件
   *  PRIVATE_WWW:应用是私有资源目录常量，这个目录是只读的，所以无法编辑文件
   *  PRIVATE_DOC：应用私有文档目录常量
   *  PUBLIC_DOCUMENTS：应用公共文档目录常量
   *  PUBLIC_DOWNLOADS：应用公共下载目录常量
   *  产量使用方式 plus.io.PRIVATE_WWW
   * @param {Object} filename 文件名称
   * @param {Object} folderConst 目录常量，注意plus.io.PRIVATE_WWW是只读目录
   */
  localFileReader: function (filename, folderConst) {
    return new Promise((resolve, reject) => {
      plus.io.requestFileSystem(
        folderConst,
        fs => {
          fs.root.getFile(
            filename,
            {
              create: false
            },
            fileEntry => {
              fileEntry.file(function (file) {
                console.log('文件大小:' + file.size + '-- 文件名:' + file.name)
                //创建读取文件对象
                let fileReader = new plus.io.FileReader()
                //以文本格式读取文件数据内容
                fileReader.readAsText(file, 'utf-8')
                //文件读取操作完成时的回调函数 evt.target.result获取值
                fileReader.onloadend = function (evt) {
                  resolve(evt.target.result)
                }
              })
            },
            e => {
              console.log('getFile failed: ' + e.message)
              reject(e) //回失败调
            }
          )
        },
        e => {
          console.log(e.message)
          reject(e) //回失败调
        }
        // resolve(e); //成功回调
        // reject(e); //回失败调
      )
    })
  }
}
