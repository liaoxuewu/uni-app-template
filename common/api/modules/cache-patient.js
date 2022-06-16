/**
 * @Author: liaoxuewu
 * @Date: 2021-08-02 09:40:23
 * @Description: 缓存信息接口
 */
export default {
  download(filepath, filename) {
    return new Promise((resolve, reject) => {
      const url =
        'http://192.168.21.44:9001/Down/DownLoad?path=' +
        encodeURIComponent(filepath) +
        '&filename=' +
        encodeURIComponent(filename)
      // const url = 'http://192.168.21.44:9001/Down/DownLoad?path=D:%5Cworkspace%5CJAVA%5CCF%5CPatients/2022-04-14/%E4%BA%A7%E7%A7%91%E7%97%85%E5%8C%BA/Patients_%E4%BA%A7%E7%A7%91%E7%97%85%E5%8C%BA_0.txt&filename=Patients_%E4%BA%A7%E7%A7%91%E7%97%85%E5%8C%BA_0.txt';
      // console.log(url);
      // 本地路径开头使用file://，跟上手机文件本地目录storage/emulated/0
      // 利用保存路径，实现下载文件的重命名
      const downloadTask = plus.downloader.createDownload(
        url,
        {
          filename: 'file://storage/emulated/0/查房/' + filename
        },
        (d, status) => {
          // d为下载的文件对象
          if (status == 200) {
            // 下载成功,d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
            let fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename)
            resolve(fileSaveUrl)
          } else {
            // 下载失败
            plus.downloader.clear() //清除下载任务
            reject('下载失败')
          }
        }
      )
      downloadTask.start()
    })
  },
  readFile(file) {
    return new Promise((resolve, reject) => {
      file = 'file://storage/emulated/0/2.txt'
      console.log(file + '读取文件地址')
      plus.io.requestFileSystem(
        plus.io.PUBLIC_DOCUMENTS,
        fs => {
          fs.root.getFile(
            file,
            {
              create: false // 文件不存在则创建
            },
            fileEntry => {
              let fileReader = new plus.io.FileReader()
              fileReader.readAsText(fileEntry, 'utf-8')
              fileReader.onloadend = event => {
                const data = JSON.parse(event.target.result)
                console.log(data + '读取文件成功')
                resolve(data)
              }
            }
          )
        },
        function (e) {
          console.log('读取失败' + e.message)
        }
      )
    })
  }
}
