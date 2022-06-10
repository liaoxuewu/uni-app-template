<template>
  <view class="uni-content-right">
    <view class="page-title">
      <text class="iconfont icon-bianji_2"></text>
      快记
    </view>
    <view class="quick-note-content">
      <view class="quick-note-left">
        <view class="quick-note-left-search">
          <u--input
            placeholder="请输入患者姓名、床号、住院号"
            prefixIcon="search"
            prefixIconStyle="font-size: 20px;color: #909399"
            placeholderStyle="font-size: 10rpx;"
            v-model="searchValue"
            @change="getPatientLikeList"
          ></u--input>
        </view>
        <scroll-view :scroll-top="scrollTop" scroll-y :style="`height:${toggleScrollH}px`">
          <view id="leftToggle">
            <view
              @click="onClickItem(index)"
              :style="current === index ? activeColor : {}"
              class="quick-note-left-item"
              v-for="(item, index) in patientData"
              :key="index"
            >
              <view class="item-left">
                <view class="left-item-department">
                  <text :class="`toggle-icon iconfont ${item.deptIcon}`"></text>
                  <text class="department-name-text">{{ item.deptname }}</text>
                </view>
                <view style="margin-top: 10rpx">
                  <text class="left-item-name-text">{{ item.housedoctname }}</text>
                  <text class="iconfont icon-nan"></text>
                </view>
              </view>
              <view class="item-right">
                <view>2022.2.10</view>
                <view style="margin-top: 10rpx"><text class="iconfont icon-yiyuan1">No.{{ item.inpatientno }}</text> </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="quick-note-right">
        <view id="rightContent" class="right-content">
          <uni-note-edit :rightContentScrollH="rightContentScrollH" :personInfo="patientData[current]"></uni-note-edit>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import api from '@/common/api/'
  import { queryViewData } from '@/common/utils/common'
  import config from '@/config.js'

  export default {
    components: {},

    data() {
      return {
        topData: {
          name: '神经外科'
        },
        rightWidth: 0,
        searchValue: '',
        scrollTop: 0,
        toggleScrollH: 0, // 左侧切换滚动区域高度
        rightContentScrollH: 0, // 右侧内容滚动区域高度
        patientData: [], // 左侧列表信息
        current: 0,
        activeColor: {
          background: '#F3FCF8',
          borderLeftWidth: '3rpx',
          borderLeftStyle: 'solid',
          borderLeftColor: '#11BC7D'
        }
      }
    },
    computed: {
      ...mapState('app', ['systemInfo']),
      ...mapState('user', ['userInfo']),
      ...mapState('user', ['baseUrl'])
    },
    async onLoad() {
      const res = await uni.getSystemInfo()
      this.rightWidth = res[1].windowWidth - 100
    },
    async mounted() {
      const leftToggleView = await queryViewData('#leftToggle')
      const rightContentView = await queryViewData('#rightContent')
      this.toggleScrollH = Number(this.systemInfo[1].windowHeight) - Number(leftToggleView.top)
      this.rightContentScrollH = Number(this.systemInfo[1].windowHeight) - Number(rightContentView.top) - 6
      const baseParams = {
        hospcode: this.userInfo.hospitalCode,
        wardcode: this.userInfo.wardcode
      }
      await this.getPatientList(baseParams)
    },
    methods: {
      ...mapActions({
        setUserInfo: 'user/setUserInfo',
        setSysInfo: 'app/setSysInfo'
      }),
      /**
       * @description: 当前病区负责的患者信息列表
       * @param hospcode 医院代码
       * @param wardcode 病区代码
       * @return {*}
       */
      async getPatientList(baseParams) {
        const res = await api.loadAreaPatient({
          baseUrl: this.baseUrl,
          params: baseParams
        })
        const deptList = config.deptList
        if (res.data.code === '200' && res.data.data.length) {
          let data = res.data.data
          data.forEach(i => {
            i.bedno = i.bedno ? `${i.bedno}床` : '--'
            i.roomno = i.roomno ? i.roomno : '其他'
            deptList.forEach(o => {
              if (i.deptname === o.name) {
                i.deptIcon = o.icon
              }
            })
          })
          data = data.map( v => {
            return {
              ...v,
              bedNo: v.roomno === '其他' ? '--' : `${v.roomno}-${v.bedno}`,
              avatarName: v.gendercode === '男' ? 'patient_avatar' : 'patient_avatar1', // 男女头像
              genderIcon: v.gendercode === '男' ? 'icon-nan' : 'icon-nv' // 性别标签
            }
          })
          this.patientData = data
          console.log(this.patientData)
        }
      },
      onClickItem(index) {
        if (this.current !== index) {
          this.current = index
        }
      },
      handleShowHtml(html) {
        this.html = html
      },
      getPatientLikeList() {}
    }
  }
</script>

<style scoped lang="scss">
  uni-page-body {
    height: 100%;
  }

  .quick-note-wrap {
    height: 100%;
    position: fixed;
  }

  .icon-nan {
    color: #0062ff;
  }

  .left-item-name-text {
    color: #000;
    font-weight: bold;
  }

  .icon-miniaoke {
    width: 10rpx;
    height: 10rpx;
    border-radius: 10rpx;
    padding: 5rpx;
    background-color: #fff5e5;
    color: #ffa000;
  }

  .icon-fuchanke {
    width: 10rpx;
    height: 10rpx;
    border-radius: 10rpx;
    padding: 5rpx;
    background-color: #fdeeee;
    color: #fa5151;
  }

  .icon-waike {
    width: 10rpx;
    height: 10rpx;
    border-radius: 10rpx;
    padding: 5rpx;
    background-color: #e5efff;
    color: #0062ff;
  }

  .page-title {
    width: 100%;
    color: #262727;
    text-align: center;
    background-color: #fff;
    height: 20rpx;
    line-height: 20rpx;
    font-size: $uni-font-size-base-rpx;
    // position: fixed;
  }

  .uni-info-note-mask {
    width: 100%;
    height: 100%;
    background: yellowgreen;
  }

  .quick-note-content {
    width: 100%;
    // height: calc(100% - 20rpx);
    display: flex;
    flex-direction: row;
    // margin-top: 20rpx;

    .quick-note-left {
      width: 25%;
      // height: 100%;
      background: #fff;
      padding: 5rpx 5rpx 0 5rpx;

      .quick-note-left-search {
        height: 50px;
        background-color: #fff;
        margin-right: 3px;
      }

      .quick-note-left-item {
        padding: 5px;
        margin: 3px 3px 0 0;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        border-bottom: 1rpx solid #f0f0f3;
        border-left: 3rpx solid #fff;
        font-size: $uni-font-size-lg-rpx;

        .left-item-department {
          color: #1e201f;
          font-size: 12rpx;
        }
      }
    }
    .quick-note-right {
      width: 75%;
      // height: 100%;
      background: #f3fcf8;
      padding: 6rpx 6rpx 0 6rpx;

      .right-content {
        // position: relative;
      }
    }
  }
</style>
