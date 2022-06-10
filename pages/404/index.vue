<template>
  <view>
    <button @click="copyFile">复制文件</button>
    <button @click="openSQL">打开+关闭数据库</button>
    <button @click="createTable">创建表</button>
    <button @click="insertTableData">新增表数据</button>
    <button @click="selectTableData">查询表数据</button>
    <button @click="deleteTableData">删除表数据</button>
    <button @click="getVersion">获取版本</button>
    <button @click="Download">下载缓存文件</button>
    <button @click="ReadFile">读取缓存文件</button>

    <view v-for="item in listData">
      <view>姓名：{{ item.PATINAME }}</view>
      <view>住院号：{{ item.PATIENTNO }}</view>
      <view>标签：{{ item.TAG }}</view>
    </view>
  </view>
</template>

<script>
  // 引入封装的 sqlite
  import DB from '@/common/utils/sqlitedb.js'
  import IO from '@/common/utils/helper-io.js'
  import api from '@/common/api/'

  export default {
    data() {
      return {
        listData: []
      }
    },
    methods: {
      //复制文件
      copyFile() {
        IO.copyFileFromStatic('404.png', '_doc/')
          .then(data => {})
          .catch(err => {
            console.log(err)
          })
      },
      // 打开数据库

      openSQL() {
        console.log('打开数据库')
        // 这个是查询有没有打开数据库
        DB.openDB()
          .then(data => {
            console.log('数据库状态', data)
          })
          .then(res => {
            return DB.closeDatabase()
          })
          .then(res => {
            console.log('关闭', res)
          })
          .catch(err => {})
      },
      // 测试热更新表
      createTable() {
        DB.openDB()
          .then(data => {
            console.log('数据库状态', data)
          })
          .then(res => {
            let sql =
              '"INPATIENTNO" text,"PATIENTNO" text,"PATIID" text,"PATINAME" text,"GENDERCODE" text,"IDCARDNO" text,"AGE" text,"BIRTHDATE" text,"INDATE" text,"LEAVEDATE" text,"DEPTCODE" text,"DEPTNAME" text,"WARDCODE" text,"WARDNAME" text,"BEDNO" text,"ROOMNO" text,"HOUSEDOCTCODE" text,"HOUSEDOCTNAME" text,"CHARGEDOCTCODE" text,"CHARGEDOCTNAME" text,"CHIEFDOCTCODE" text,"CHIEFDOCTNAME" text,"DUTYNURSECODE" text,"DUTYNURSENAME" text,"HASBABYFLAG" text,"MOTHERINPATIENTNO" text,"CRITICALSTATE" text,"ALLERGYFLAG" text,"ALLERGYMENO" text,"PREPAYCOST" text,"FREECOST" text,"TOTCOST" text,"HOMEADDRESS" text,"HOMETEL" text,"InDiagnoseName" text,"TEND" text,"INSTATE" text,"TAG" text,"PROFCODE" text,"PROFNAME" text,"NATIONCODE" text,"NATIONNAME" text,"MARI" text,"MARINAME" text'
            return DB.createTbSql('TB_Patient', sql)
          })
          .then(res => {
            console.log('建表完成', res)
            return DB.closeDatabase()
          })
          .then(res => {
            console.log('关闭', res)
            this.showToast('创建表成功')
          })
          .catch(err => {
            console.log('建表异常', err)
            DB.closeDatabase()
            this.showToast('创建表失败')
          })
      },

      // 新增表数据
      insertTableData(list) {
        let arr2 = [
          {
            INPATIENTNO: '住院流水号',
            PATIENTNO: '住院号',
            PATIID: '唯一号',
            PATINAME: '患者姓名',
            GENDERCODE: '患者性别',
            IDCARDNO: '患者身份证',
            AGE: '患者年龄',
            BIRTHDATE: '患者出生日期',
            INDATE: '入院日期',
            LEAVEDATE: '出院日期',
            DEPTCODE: '科室编号',
            DEPTNAME: '科室名称',
            WARDCODE: '病区编号',
            WARDNAME: '病区名称',
            BEDNO: '床位号',
            ROOMNO: '病房号',
            HOUSEDOCTCODE: '住院医师编号',
            HOUSEDOCTNAME: '住院医师姓名',
            CHARGEDOCTCODE: '主治医师编号',
            CHARGEDOCTNAME: '主治医师姓名',
            CHIEFDOCTCODE: '主任医师编号',
            CHIEFDOCTNAME: '主任医师姓名',
            DUTYNURSECODE: '责任护士编号',
            DUTYNURSENAME: '责任护士姓名',
            HASBABYFLAG: '有无婴儿',
            MOTHERINPATIENTNO: '母亲住院流水号',
            CRITICALSTATE: '病危重信息',
            ALLERGYFLAG: '是否过敏',
            ALLERGYMENO: '过敏原',
            PREPAYCOST: '预交金',
            FREECOST: '余额',
            TOTCOST: '费用',
            HOMEADDRESS: '住址',
            HOMETEL: '联系电话',
            InDiagnoseName: '诊断',
            TEND: '护理等级',
            INSTATE: '住院状态',
            TAG: '标签',
            PROFCODE: '职业编码',
            PROFNAME: '职业',
            NATIONCODE: '民族编码',
            NATIONNAME: '民族',
            MARI: '婚姻编码',
            MARINAME: '婚姻'
          }
        ]
        list.map(item => {
          DB.openDB()
            .then(data => {
              console.log('数据库状态', data)
            })
            .then(res => {
              let sql = `INSERT INTO TB_Patient("INPATIENTNO","PATIENTNO","PATIID","PATINAME","GENDERCODE","IDCARDNO","AGE","BIRTHDATE","INDATE","LEAVEDATE","DEPTCODE","DEPTNAME","WARDCODE","WARDNAME","BEDNO","ROOMNO","HOUSEDOCTCODE","HOUSEDOCTNAME","CHARGEDOCTCODE","CHARGEDOCTNAME","CHIEFDOCTCODE","CHIEFDOCTNAME","DUTYNURSECODE","DUTYNURSENAME","HASBABYFLAG","MOTHERINPATIENTNO","CRITICALSTATE","ALLERGYFLAG","ALLERGYMENO","PREPAYCOST","FREECOST","TOTCOST","HOMEADDRESS","HOMETEL","InDiagnoseName","TEND","INSTATE","TAG","PROFCODE","PROFNAME","NATIONCODE","NATIONNAME","MARI","MARINAME")values ("${item.iNPATIENTNO}","${item.pATIENTNO}","${item.pATIID}","${item.pATINAME}","${item.gENDERCODE}","${item.iDCARDNO}","${item.aGE}","${item.bIRTHDATE}","${item.iNDATE}","${item.lEAVEDATE}","${item.dEPTCODE}","${item.dEPTNAME}","${item.wARDCODE}","${item.wARDNAME}","${item.bEDNO}","${item.rOOMNO}","${item.hOUSEDOCTCODE}","${item.hOUSEDOCTNAME}","${item.cHARGEDOCTCODE}","${item.cHARGEDOCTNAME}","${item.cHIEFDOCTCODE}","${item.cHIEFDOCTNAME}","${item.dUTYNURSECODE}","${item.dUTYNURSENAME}","${item.hASBABYFLAG}","${item.mOTHERINPATIENTNO}","${item.cRITICALSTATE}","${item.aLLERGYFLAG}","${item.aLLERGYMENO}","${item.pREPAYCOST}","${item.fREECOST}","${item.tOTCOST}","${item.hOMEADDRESS}","${item.hOMETEL}","${item.inDiagnoseName}","${item.tEND}","${item.iNSTATE}","${item.tAG}","${item.pROFCODE}","${item.pROFNAME}","${item.nATIONCODE}","${item.nATIONNAME}","${item.mARI}","${item.mARINAME}")`
              return DB.executeSQL(sql, true)
            })
            .then(res => {
              console.log('插入完成', res)
              // return DB.closeDatabase();
            })
            .then(res => {
              console.log('关闭', res)
              this.showToast('插入成功')
            })
            .catch(err => {
              console.log('插入异常', err)
              DB.closeDatabase()
              this.showToast('插入失败')
            })
        })
      },

      // 查询表数据
      selectTableData() {
        var that = this
        var list = [] //结果临时存储，为了避免阻塞dbclose
        let sql = 'select * from TB_Patient'
        DB.openDB()
          .then(data => {
            console.log('数据库状态', data)
          })
          .then(res => {
            console.log('查询sql', sql)
            return DB.selectSQL(sql)
          })
          .then(res => {
            console.log('查询结果', res)
            list = res //注意赋值防止渲染造成阻塞关闭
            // return DB.closeDatabase();
          })
          .then(res => {
            console.log('连接关闭', res)
            this.showToast('获取成功')
            that.listData = list //渲染
          })
          .catch(err => {
            console.log('查询异常', err)
            this.showToast('查询失败')
          })
      },

      // 删除表数据
      deleteTableData() {
        var that = this
        let sql = 'delete from TB_Patient'
        DB.openDB()
          .then(data => {
            console.log('数据库状态', data)
          })
          .then(res => {
            return DB.executeSQL(sql, true)
            // return DB.clearTable(TB_Patient);
          })
          .then(res => {
            console.log('删除结果', res)
            // return DB.closeDatabase();
          })
          .then(res => {
            console.log('连接关闭', res)
            this.showToast('删除成功')
          })
          .catch(err => {
            console.log('删除异常', err)
            this.showToast('删除失败')
          })
      },

      //下载文件
      Download() {
        var url =
          'http://192.168.21.44:9001/Down/DownLoad?path=D:%5Cworkspace%5CJAVA%5CCF%5CPatients/2022-04-14/%E4%BA%A7%E7%A7%91%E7%97%85%E5%8C%BA/Patients_%E4%BA%A7%E7%A7%91%E7%97%85%E5%8C%BA_0.txt&filename=Patients_%E4%BA%A7%E7%A7%91%E7%97%85%E5%8C%BA_0.txt'
        var name = 'Patients_产科病区_0.txt'
        let dtask = plus.downloader.createDownload(
          url,
          {
            //本地路径开头使用file://，跟上手机文件本地目录storage/emulated/0
            filename: 'file://storage/emulated/0/查房/' + name //利用保存路径，实现下载文件的重命名
          },
          function (d, status) {
            //d为下载的文件对象
            if (status == 200) {
              //下载成功,d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
              let fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename)
              // plus.runtime.openFile(d.filename); //选择软件打开文件
              console.log('下载成功')
            } else {
              //下载失败
              console.log('下载失败')
              plus.downloader.clear() //清除下载任务
            }
          }
        )
        dtask.start()
      },

      //ReadFile
      ReadFile() {
        var that = this
        var file = 'file://storage/emulated/0/查房/Patients_产科病区_0.txt'
        plus.io.requestFileSystem(
          plus.io.PUBLIC_DOCUMENTS,
          function (fs) {
            fs.root.getFile(
              file,
              {
                create: false // 文件不存在则创建
              },
              fileEntry => {
                var fileReader = new plus.io.FileReader()
                fileReader.readAsText(fileEntry, 'utf-8')
                fileReader.onloadend = function (evt) {
                  let data = JSON.parse(evt.target.result)
                  console.log(data)
                  // that.listData=data;
                  that.deleteTableData()
                  that.insertTableData(data)
                }
              }
            )
          },
          function (e) {
            console.log('读取失败' + e.message)
          }
        )
      },

      //获取缓存文件版本
      getVersion() {
        const baseParams = {
          hospcode: '74342582-7',
          wardcode: '16424023'
        }
        api
          .GetPatientVersion({
            params: baseParams
          })
          .then(
            res => {
              console.log(res)
              if (res.data.code === '200' && res.data.data) {
                console.log(data.filename)
                console.log(data.filepath)
              } else {
              }
            },
            err => {
              console.log(err)
            }
          )
      },

      // 提示框
      showToast: function (str) {
        uni.showToast({
          icon: 'none',
          title: str,
          mask: true
        })
      },

      // 时间戳转年月日
      formatDate(data) {
        let now = new Date(data)
        var year = now.getFullYear() //取得4位数的年份
        var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
        var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
        var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours()
        var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
        var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
      },

      returnshow() {
        uni.navigateTo({
          url: '/PagesA/main/index'
        })
      }
    }
  }
</script>
