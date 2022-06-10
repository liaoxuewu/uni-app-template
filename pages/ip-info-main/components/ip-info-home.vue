<template>
  <view class="uni-content-right">
    <view v-if="isShowHome">
      <view class="uni-tabber-header">
        <view class="uni-left-info">
          <uni-custom-picker
            :rangeData="areaNames"
            :inputData="areaData"
            :selectImgSrc="tabSelectImg"
            @onClickPicker="onClickArea"
            @onCancelPicker="onCancelArea"
            @onChangePicker="onChangeArea"
          >
          </uni-custom-picker>
        </view>
        <view class="uni-right-info">
          <u--input
            placeholder="请输入"
            prefixIcon="search"
            prefixIconStyle="font-size: 20px;color: #909399"
            placeholderStyle="font-size: 10rpx;"
            v-model="searchValue"
            @change="getPatientLikeList"
          ></u--input>
        </view>
      </view>
      <view class="uni-grid-wrap-index">
        <uni-empty v-if="!patientData.length"></uni-empty>
        <u-grid v-else :border="true" col="4">
          <u-grid-item v-for="(item, index) in patientData" :key="index" @click="goToDetail(index)">
            <view class="uni-grid-item-index">
            </view>
          </u-grid-item>
        </u-grid>
        <u-toast ref="uToast" />
      </view>
    </view>
    <ip-info-detail v-if="!isShowHome" :personInfo="personInfo" :isShowHome.sync="isShowHome"></ip-info-detail>
    <u-toast ref="uToast"></u-toast>
    <u-loading-icon duration="2000" :show="isShowLoading"></u-loading-icon>
  </view>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import api from '@/common/api/'
  import ipInfoDetail from '../../ip-info-detail/ip-info-detail.vue'
  import { queryViewData } from '@/common/utils/common'
  import config from '@/config.js'

  // #ifdef APP-PLUS
  // 引入封装的 sqlite
  import DB from '@/common/utils/sqlitedb.js'
  // #endif
  export default {
    components: {
      ipInfoDetail
    },
    data() {
      return {
        isShowLoading: true,
        isShowHome: true,
        systemInfo: [
          null,
          {
            windowWidth: 0
          }
        ],
        personInfo: '', // 个人信息
        doctAreaList: [], // 医生所属病区列表信息
        areaNames: [], // 所有病区名称
        areaData: '',
        selectImg: {
          // 下来框箭头
          up: '../../static/select_up.png',
          down: '../../static/select_down.png'
        },
        hospitalTypeIndex: '', // 院区下拉选择索引
        hospitalObjType: {},
        tabSelectImg: '../../static/select_down.png',
        searchValue: '', // 搜索内容
        patientData: [], // 病区患者列表信息
        patientData1: [], // 病区患者列表信息
        isShowMarquee: false
      }
    },
    computed: {
      ...mapState('user', ['userInfo']),
      ...mapState('user', ['baseUrl']),
      _tendData() {
        // 患者等级map
        return new Map([
          ['一级', 'grid-item-top-lable1'],
          ['二级', 'grid-item-top-lable2'],
          ['特级', 'grid-item-top-lable3']
        ])
      }
    },
    watch: {
      // 切换
      hospitalTypeIndex(val) {
        // console.log(val, this.doctAreaList)
        this.tabSelectImg = '../../static/select_down.png'
        this.hospitalObjType = this.doctAreaList[val]
        if (this.hospitalObjType) {
          this.areaData = this.hospitalObjType.wardName
          const baseParams = {
            hospcode: this.userInfo.hospitalCode,
            wardcode: this.hospitalObjType.wardCode
          }
          this.getPatientList(baseParams)
        }
      }
    },
    async mounted() {
      this.$bus.$on('isShowHome', msg => {
        // console.log(msg);
        this.isShowHome = msg
      })
      console.log(this.userInfo)
      if (!this.userInfo.token) {
        console.log('没有token')
        uni.reLaunch({
          url: '/pages/login/login'
        })
      } else {
        this.init()
      }
      this.systemInfo = await uni.getSystemInfo()
      this.setSysInfo(this.systemInfo)
    },
    methods: {
      ...mapActions({
        setUserInfo: 'user/setUserInfo',
        setSysInfo: 'app/setSysInfo'
      }),
      /**
       *  初始化
       */
      async init() {
        // uni.showLoading({
        // 	title: '加载中',
        // 	mask: true
        // });
        this.resetCondition()
        try {
          const baseParams = {
            hospcode: this.userInfo.hospitalCode,
            wardcode: this.userInfo.wardcode
          }
          await Promise.all([this.getDoctAreaList()])
          // #ifdef APP-PLUS
          await this.getPatientList(baseParams)
          DB.openDB().then(async res => {
            console.log('本地数据库打开。。。')
            const res1 = await this.selectTableData()
            console.log('本地数据库查询返回的结果' + res1)
            // 查询本地数据库存储的患者信息，如果无数据则发送请求查询
            if (res1) {
              // DB.closeDatabase()
              this.handlePatientData(res1)
            } else {
              await this.getPatientList(baseParams)
            }
          })
          // #endif
          // #ifdef H5
          await Promise.all([this.getPatientList(baseParams)])
          // #endif
        } catch (e) {
          console.log(e)
          const info = e.message === '连接服务器失败!' ? '请重新登陆并修改服务器地址' : ''
          this.$refs.uToast.show({
            type: 'default',
            // title: '默认主题',
            message: `${e.message + info}`
          })
          if (info) {
            uni.reLaunch({
              url: '/pages/login/login'
            })
          }
        } finally {
          this.isShowLoading = false
          // uni.hideLoading();
          uni.stopPullDownRefresh()
        }
      },
      // #ifdef APP-PLUS
      /**
       *  查询表数据
       */
      async selectTableData() {
        console.log('查询数据开始。。。')
        let sql = 'select * from TB_Patient'
        console.log('查询数据开始1。。。')
        return DB.selectSQL(sql)
      },
      // #endif
      /**
       * @description: 获取医生所属病区列表
       * @param usercode 医院代码
       * @param hossn 病区代码
       * @return {*}
       */
      async getDoctAreaList() {
        const baseParams = {
          usercode: this.userInfo.doctcode,
          hossn: this.userInfo.hospitalSn
        }
        const res = await api.getDoctArea({
          baseUrl: this.baseUrl,
          params: baseParams
        })
        this.areaNames = []
        this.doctAreaList = []
        if (res.data.code === '200' && res.data.data.length) {
          const data = res.data.data
          this.areaData = data[0].wardName
          data.map(o => {
            this.areaNames.push(o.wardName)
            this.doctAreaList.push(o)
          })
          this.hospitalObjType = this.doctAreaList[0]
        } else if (res.data.code === '426') {
          uni.showToast({
            title: `${res.data.msg}请重新登陆`,
            duration: 2000
          })
          uni.redirectTo({
            url: '/pages/login/login'
          })
        } else {
          uni.showToast({
            title: `${res.data.msg}`,
            duration: 2000
          })
        }
      },
      /**
       * @description: 当前病区负责的患者信息列表
       * @param hospcode 医院代码
       * @param wardcode 病区代码
       * @return {*}
       */
      async getPatientList(baseParams) {
        this.reset()
        const res = await api.loadAreaPatient({
          baseUrl: this.baseUrl,
          params: baseParams
        })
        if (res.data.code === '200' && res.data.data.length) {
          this.handlePatientData(res.data.data)
        }
      },
      /**
       *  过敏原是否滚动显示
       */
      allergyScroll() {
        // 生成0 - length值 的数据
        let indexs = [...Array(this.patientData.length).keys()]
        const textAllergyIds = []
        indexs.forEach(item => {
          textAllergyIds.push(item)
        })
        let textAllergyViews = []
        let textAllergyViews1 = []
        this.$nextTick(async () => {
          textAllergyIds.forEach(async item => {
            // 过敏原限制宽度
            textAllergyViews.push(queryViewData(`#textAllergy${item}`))
            // 过敏原实际宽度
            textAllergyViews1.push(queryViewData(`#textAllergy${item} span`))
          })
          const arr = await Promise.all(textAllergyViews)
          const arr1 = await Promise.all(textAllergyViews1)
          arr.forEach((item, index) => {
            if (item) {
              console.log(item.width, arr1[index].width)
              if (item.width < arr1[index].width) {
                this.patientData[index].isShowMarquee = true
              }
            }
          })
        })
      },
      /**
       * 重置数据
       */
      reset() {
        this.patientData = []
        this.patientData1 = []
      },
      /**
       * 重置搜索条件
       */
      resetCondition() {
        this.hospitalTypeIndex = 0
        this.hospitalObjType = {}
        this.areaData = ''
        this.tabSelectImg = '../../static/select_down.png'
        this.searchValue = ''
      },
      /**
       * 选择病区
       */
      onChangeArea(value) {
        // console.log(value)
        this.hospitalTypeIndex = value
      },
      onCancelArea() {
        this.tabSelectImg = '../../static/select_down.png'
      },
      onClickArea() {
        this.tabSelectImg = '../../static/select_up.png'
      },
      searchCancel() {},
      /**
       * 点击进入患者详情页面
       */
      goToDetail(index) {
      }
    }
  }
</script>

<style lang="scss">
  $uni-label-color: #e75e58;
  $uni-label-color1: #5cc177;
  $uni-label-color2: #3375f6;
  $uni-label-color3: #f57a04;
  $uni-label-color4: #04c9ba;
  $uni-label-color5: #f57a04;
  $uni-label-color6: #7873ff;

  .uni-main-right {
    // float: right;
    // width: calc(100vw - (var(--top-window-height)))
  }

  .text-area {
    display: flex;
    justify-content: center;
  }

  .grid-item-box {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: column;
    /* align-items: center; */
    justify-content: center;
    padding: 8rpx;
  }

  // 顶部内容
  .uni-tabber-header {
    width: 94%;
    // height: 5%;
    position: fixed;
    top: var(--status-bar-height);
    z-index: 100;
    height: 32rpx;
    line-height: 32rpx;
    background: #fff;
    padding: 2rpx 10rpx;

    .uni-left-info {
      float: left;
      text-align: center;
      display: flex;
    }

    // 搜索、扫描
    .uni-right-info {
      width: 200rpx;
      height: 22rpx;
      display: flex;
      position: absolute;
      top: 50%;
      right: 4%;
      transform: translate(0, -50%);
      font-size: $uni-font-size-base-rpx;
      border: 1rpx solid #e9e9e9;
      vertical-align: middle;

      .uni-header-search-bar {
        display: inline-block;
      }

      .uni-header-scan {
        display: inline-block;
        line-height: 50px;
      }
    }
  }

  // 患者列表内容
  .uni-grid-wrap-index {
    padding: 6rpx;
    margin-top: 36rpx;

    .uni-grid-item-index {
      width: 95%;
      border-radius: 4rpx;
      position: relative;
      overflow: hidden;
      border-top: 2rpx solid transparent;
      background: linear-gradient(white, white) padding-box,
        repeating-linear-gradient(
            -45deg,
            red 0,
            red 12.5%,
            transparent 0,
            transparent 25%,
            #58a 0,
            #58a 37.5%,
            transparent 0,
            transparent 50%
          )
          0/3em 3em;
      margin-bottom: 10rpx;

      .grid-item-top-lable {
        position: absolute;
        top: 3rpx;
        right: -195rpx;
        height: 16rpx;
        width: 410rpx;
        transform: rotate(45deg);
        color: #fff;
        text-align: center;
        font-size: $uni-font-size-base-rpx;
      }

      .grid-item-top-lable1 {
        background: #ffa700;
      }

      .grid-item-top-lable2 {
        background: #30a45d;
      }

      .grid-item-top-lable3 {
        background: #f53842;
      }

      // flex: 0 0 32%;
      .grid-item-wrap {
        .index-text {
          font-size: $uni-font-size-base-rpx;
        }

        .grid-item-title {
          color: #818a9f;
        }

        .grid-item-title1 {
          display: inline-block;
          width: 40rpx;
          text-align: justify; // 文字分散，两端对齐
          text-align-last: justify;
          // text-justify: inter-ideograph;
          text-justify: distribute-all-lines; // 这行必加，兼容ie浏览器
        }

        .grid-item-name {
          font-size: 14rpx !important;
          font-weight: bold;
        }

        .grid-item-content {
          color: #262626;
          font-size: $uni-font-size-base-rpx;
        }

        .grid-item-content1 {
          width: 65%;
          display: inline-block;
          vertical-align: middle;
        }

        .index-text-icon {
          border-radius: 10rpx;
          color: #fff;
          margin-right: 6rpx;
          padding: 4rpx;
          font-size: 6rpx;
        }
      }

      .grid-item-wrap-bottom {
        margin-top: 3rpx;
        background-color: #f3fcf8;
        border-radius: 4rpx;
        padding: 4rpx;
      }

      .grid-item-sort-lable-wrap {
        width: 100%;
        margin: 5rpx 0;

        .grid-item-sort-lable {
          display: inline-block;
          width: 14rpx;
          height: 14rpx;
          line-height: 14rpx;
          color: #fff;
          text-align: center;
          border-radius: 3rpx;
          margin-right: 6rpx;
          font-size: 10rpx;
          font-weight: bold;
        }

        /* 术 */
        .grid-item-sort-lable1 {
          background: #feeeee;
          border: 1rpx solid $uni-label-color;
          color: $uni-label-color;
        }

        /* 产 */
        .grid-item-sort-lable2 {
          background: #eff8f1;
          border: 1rpx solid $uni-label-color1;
          color: $uni-label-color1;
        }

        /* 儿 */
        .grid-item-sort-lable3 {
          background: #e8effe;
          border: 1rpx solid $uni-label-color2;
          color: $uni-label-color2;
        }

        /* 出 */
        .grid-item-sort-lable4 {
          background: #f9e4f5;
          border: 1rpx solid $uni-label-color3;
          color: $uni-label-color3;
        }

        /* 入 */
        .grid-item-sort-lable5 {
          background: #e4f9f7;
          border: 1rpx solid $uni-label-color4;
          color: $uni-label-color4;
        }

        /* 危 */
        .grid-item-sort-lable6 {
          background: #fdf0e4;
          border: 1rpx solid $uni-label-color5;
          color: $uni-label-color5;
        }

        /* 孕 */
        .grid-item-sort-lable7 {
          background: #f0f0ff;
          border: 1rpx solid $uni-label-color6;
          color: $uni-label-color6;
        }
      }
    }
  }

  .icon-nan {
    font-size: 18rpx;
  }

  .icon-nv {
    font-size: 18rpx;
  }

  .icon-danrenchuang {
    width: 10rpx;
    height: 10rpx;
    border-radius: 10rpx;
    background: rgba(196, 198, 204, 0.2);
    color: #898d99;
    padding: 3rpx;
    margin-right: 5rpx;
  }

  .icon-yisheng {
    background: #1cc46f;
  }

  .icon-hushi {
    background: #ffc400;
  }

  .icon-dangan {
    background: #0077ff;
  }

  /* #ifdef H5 */
  @media screen and (min-width: 768px) and (max-width: 1425px) {
    .swiper {
      height: 630px;
    }
  }

  @media screen and (min-width: 1425px) {
    .swiper {
      height: 830px;
    }
  }

  /* #endif */
</style>
