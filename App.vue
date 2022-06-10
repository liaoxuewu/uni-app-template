<script>
  import { mapState, mapActions } from 'vuex'
  import api from '@/common/api/'
  // #ifdef APP-PLUS
  // 引入封装的 sqlite
  import DB from '@/common/utils/sqlitedb.js'
  // #endif
  export default {
    data() {
      return {
        homeData: []
      }
    },
    computed: {
      ...mapState('user', ['userInfo', 'baseUrl'])
    },
    async onLaunch() {
      console.log('App Launch')
      // #ifdef APP-PLUS
      // 强制横屏
      // plus.screen.lockOrientation('landscape-secondary');
      plus.screen.lockOrientation('landscape-primary')
      plus.navigator.closeSplashscreen()
      console.log('App Launch')

      // app启动时打开启动广告页
      var w = plus.webview.open(
        'hybrid/html/advertise/advertise.html',
        '本地地址',
        {
          top: 0,
          bottom: 0,
          zindex: 999
        },
        'fade-in',
        5
      )

      // 设置定时器，4s后关闭启动广告页
      setTimeout(function () {
        plus.webview.close(w)
      }, 4000)
      this.init()
      // #endif
      // console.log(this.baseUrl)
      uni.switchTab({
        url: '/pages/login/login'
      })
    },
    async onShow() {
      console.log('App Show')
    },
    onHide: function () {
      console.log('App Hide')
    },
    methods: {
      ...mapActions({
        setHomeList: 'app/setHomeList'
      }),
      /**
       * 初始化
       */
      init() {
        try {
          this.getVersion()
        } catch (e) {
          uni.showToast({
            title: `${e}`,
            duration: 2000
          })
        } finally {
          uni.hideLoading()
        }
      },
      /**
       * @description: 获取版本信息
       * @param usercode 医院代码
       * @param wardcode 病区代码
       * @return {*}
       */
      async getVersion() {
        // 从缓存获取版本号
        const version = uni.getStorageSync('uni_version')
        uni.removeStorageSync('uni_version')
        console.log('缓存的版本号' + version)
        const baseParams = {
          hospcode: this.userInfo.hospitalCode,
          wardcode: this.userInfo.wardcode
        }
        // 1.获取版本
        const res = await api.GetPatientVersion({
          params: baseParams
        })
        console.log('发送请求获取的版本号' + res.data.data.version)
        // 2.下载文件
        if (res.data.code === '200' && res.data.data) {
          // 发送请求获取的版本号和缓存的版本号做对比
          if (version === res.data.data.version) {
            // 版本号相同直接进入首页
          } else {
            console.log('缓存版本号和请求版本号不同执行------')
            // const sendUrl = `${this.baseUrl}?path?=${res.data.data.filepath}&name?=${res.data.data.filename}`;
            // 版本号存入缓存
            uni.setStorageSync('uni_version', res.data.data.version)
            const res1 = await api.download(
              'D:\\workspace\\JAVA\\CF\\Patients/2022-04-19/产科病区/Patients_产科病区_2.txt',
              'Patients_产科病区_2.txt'
            )
            console.log('下载文件返回res' + res1)
            // 3.判断有无文件
            if (res1) {
              // 4.读文件
              const res2 = await api.readFile(res1)
              this.homeData = res2
              console.log(this.homeData + '读取文件的数据')
              if (res2) {
                // 5.打开数据库
                // this.deleteTableData(res2)
                DB.openDB().then(async res => {
                  console.log('数据库状态', res)
                  // if (res.isok) { // 6.数据库打开，建表
                  try {
                    await Promise.all([this.createTable(), this.deleteTableData(), this.insertTableData()])
                  } catch (e) {
                    uni.showToast({
                      title: `${e}`,
                      duration: 2000
                    })
                  } finally {
                  }
                  // }
                })
              }
            }
          }
        }
      },
      // #ifdef APP-PLUS
      /**
       *  创建表
       */
      async createTable() {
        console.log('建表')
        const sql =
          '"inpatientno" text,"patientno" text,"patiid" text,"patiname" text,"gendercode" text,"idcardno" text,"age" text,"birthdate" text,"indate" text,"leavedate" text,"deptcode" text,"deptname" text,"wardcode" text,"wardname" text,"bedno" text,"roomno" text,"housedoctcode" text,"housedoctname" text,"chargedoctcode" text,"chargedoctname" text,"chiefdoctcode" text,"chiefdoctname" text,"dutynursecode" text,"dutynursename" text,"hasbabyflag" text,"motherinpatientno" text,"criticalstate" text,"allergyflag" text,"allergymeno" text,"prepaycost" text,"freecost" text,"totcost" text,"homeaddress" text,"hometel" text,"indiagnosename" text,"tend" text,"instate" text,"tag" text,"profcode" text,"profname" text,"nationcode" text,"nationname" text,"mari" text,"mariname" text'
        return DB.createTbSql('TB_Patient', sql)
      },
      /**
       *  删除表数据
       */
      async deleteTableData() {
        console.log('删除表数据')
        let sql = 'delete from TB_Patient'
        return DB.executeSQL(sql, true)
      },
      /**
       *  插入表数据
       */
      async insertTableData() {
        console.log('插入表数据')
        this.homeData.map(item => {
          const sql = `INSERT INTO TB_Patient("inpatientno","patientno","patiid","patiname","gendercode","idcardno","age","birthdate","indate","leavedate","deptcode","deptname","wardcode","wardname","bedno","roomno","housedoctcode","housedoctname","chargedoctcode","chargedoctname","chiefdoctcode","chiefdoctname","dutynursecode","dutynursename","hasbabyflag","motherinpatientno","criticalstate","allergyflag","allergymeno","prepaycost","freecost","totcost","homeaddress","hometel","indiagnosename","tend","instate","tag","profcode","profname","nationcode","nationname","mari","mariname")values ("${item.inpatientno}","${item.patientno}","${item.patiid}","${item.patiname}","${item.gendercode}","${item.idcardno}","${item.age}","${item.birthdate}","${item.indate}","${item.leavedate}","${item.deptcode}","${item.deptname}","${item.wardcode}","${item.wardname}","${item.bedno}","${item.roomno}","${item.housedoctcode}","${item.housedoctname}","${item.chargedoctcode}","${item.chargedoctname}","${item.chiefdoctcode}","${item.chiefdoctname}","${item.dutynursecode}","${item.dutynursename}","${item.hasbabyflag}","${item.motherinpatientno}","${item.criticalstate}","${item.allergyflag}","${item.allergymeno}","${item.prepaycost}","${item.freecost}","${item.totcost}","${item.homeaddress}","${item.hometel}","${item.indiagnosename}","${item.tend}","${item.instate}","${item.tag}","${item.profcode}","${item.profname}","${item.nationcode}","${item.nationname}","${item.mari}","${item.mariname}")`
          return DB.executeSQL(sql, true)
        })
      }
      // #endif
    }
  }
</script>

<style lang="scss">
  /* 每个页面公共css */
  @import '@/common/uni.css';
  @import '@/common/icon/iconfont.css';
  @import '@/common/fonts/stylesheet.css';

  uni-page-body,
  page {
    height: 100%;
    background: #eef1f9;
  }
</style>
