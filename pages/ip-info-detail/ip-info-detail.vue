<template>
  <view class="uni-content">
    <view id="topContent" class="uni-content-top">
      <view class="page-title">
        <text class="iconfont icon-shenfen" style="vertical-align: middle"></text>
        <text>患者详情</text>
      </view>
      <view style="padding: 6rpx 6rpx 0 6rpx">
        <uni-person-info :personInfo="personInfo"></uni-person-info>
        <view class="uni-toggle-wrap">
          <view
            :class="current === index ? selectClass : ''"
            @click="onClickItem(index)"
            class="uni-toggle-item"
            v-for="(item, index) in typeItems"
            :key="index"
          >
            <text :class="`toggle-icon iconfont ${item.icon}`"></text>
            {{ item.name }}
          </view>
        </view>
        <view class="uni-detail-space-col"></view>
      </view>
    </view>
    <view id="contentBottom" class="uni-content-bottom">
    </view>
    <uni-note-edit
      v-if="isShowNote"
      :isShowNote.sync="isShowNote"
      :rightContentScrollH="bottomContentH"
    ></uni-note-edit>
<!--    <view v-if="!isShowNote" class="uni-content-note-edit" @click="showNote">-->
<!--      <text class="uni-content-note-edit-icon iconfont icon-bianji_2"></text>-->
<!--    </view>-->
  </view>
</template>

<script>
  import { mapState } from 'vuex'
  import api from '@/common/api/'
  import { queryViewData, getTodayStamp } from '@/common/utils/common'
  export default {
    props: {
      personInfo: {
        type: Object,
        default: () => {}
      },
      isShowHome: {
        type: Boolean,
        default: () => false
      }
    },
    data() {
      return {
        topData: {
          // 顶部标题
          name: '神经外科'
        },
        viewDataTitle: {
          // 顶部标题容器
          width: 0,
          height: 0
        },
        bottomContentH: 0, // 传递到子组件的高度
        isShowNote: false
      }
    },
    computed: {
      ...mapState('user', ['userInfo']),
      ...mapState('app', ['systemInfo']),
      ...mapState('user', ['baseUrl'])
    },
    watch: {
      current(val) {
        if (val === 0) {
          this.selectClass = 'outside-circle outside-circle2'
        } else if (val === 4) {
          this.selectClass = 'outside-circle outside-circle1'
        } else {
          this.selectClass = 'outside-circle outside-circle1 outside-circle2'
        }
      },
      // 快记窗口的显示隐藏
      isShowNote(val) {
        // #ifdef APP-PLUS
        const webView = this.$refs.medicalRecord.currentWebview.children()[0]
        if (val) {
          webView.hide()
        } else {
          webView.show()
        }
        // #endif
      }
    },
    async mounted() {
      this.init()
      this.viewDataTitle = await queryViewData('#topContent')
      // 底部内容容器
      const bottomContent = await queryViewData('#contentBottom')
      // 计算底部内容高度，确定上下滑动范围
      this.bottomContentH = Number(this.systemInfo[1].windowHeight) - Number(bottomContent.top)
      console.log(this.$refs.medicalRecord.currentWebview)
    },
    methods: {
      /**
       *  初始化
       */
      async init() {
        uni.showLoading({
          title: '加载中',
          mask: true
        })
        try {
          const params = {
            inpatientno: this.personInfo.inpatientno,
            hospcode: this.userInfo.hospitalCode
          }
          const params1 = {
            inpatientno: this.personInfo.inpatientno
          }
          await Promise.all([])
        } catch (e) {
          uni.showToast({
            title: `${e}`,
            icon: 'none',
            duration: 2000
          })
        } finally {
          uni.hideLoading()
        }
      },
      /**
       * 切换患者信息页面
       */
      onClickItem(index) {
        if (this.current != index) {
          this.current = index
          this.detailType = this.typeItems[index].id
        }
      },
      /**
       * 返回首页
       */
      backToMain() {
        this.$emit('update:isShowHome', true)
      },
      /**
       * 显示快记
       */
      showNote() {
        this.isShowNote = true
      }
    }
  }
</script>
<style lang="scss">
  .outside-circle {
    position: relative;
    // background: #F6F6F9;
    background: #fff;
    border-radius: 10rpx 10rpx 0 0;
    border: 2rpx solid #fff;
    border-bottom: none;
  }

  .outside-circle1 {
    &::before {
      content: '';
      position: absolute;
      width: 20rpx;
      height: 20rpx;
      left: -14px;
      bottom: 0;
      background: #000;
      background: radial-gradient(circle at 0 0, transparent 20rpx, #fff 21rpx);
    }
  }

  .outside-circle2 {
    &::after {
      content: '';
      position: absolute;
      width: 20rpx;
      height: 20rpx;
      right: -14rpx;
      bottom: 0;
      background: #000;
      background: radial-gradient(circle at 100% 0, transparent 20rpx, #fff 21rpx);
    }
  }

  .uni-content {
    width: 94%;
    background: #eef1f9;
  }

  .content {
    position: fixed;
    width: 100%;
    height: 100%;
  }

  .page-title {
    width: 100%;
    color: #262727;
    text-align: center;
    background-color: #fff;
    height: 20rpx;
    line-height: 20rpx;
    font-size: $uni-font-size-base-rpx;
  }

  .uni-detail-space-col {
    height: $uni-spacing-col-base-rpx;
    background: #fff;
    padding: 0 6rpx;
  }

  .uni-note-container {
    position: absolute;
    top: 0;
    height: 100% !important;
    // background: #fff;
  }

  .uni-content-note-edit {
    width: 50rpx;
    height: 50rpx;
    line-height: 50rpx;
    border-radius: 50rpx;
    text-align: center;
    background: #ffa000;
    position: fixed;
    bottom: 10rpx;
    left: 60rpx;
    z-index: 10;
    color: #fff;

    .uni-content-note-edit-icon {
      font-size: 25rpx;
    }
  }

  .uni-toggle-wrap {
    width: 100%;
    height: 28rpx;
    line-height: 28rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background: #f1f2f4;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
    border-radius: 5rpx;
    font-size: $uni-font-size-lg-rpx;
    color: #898d99;
    margin-top: 5px;

    .uni-toggle-item {
      width: 100%;
      text-align: center;

      .toggle-icon {
        width: 10rpx;
        height: 10rpx;
        border-radius: 10rpx;
        padding: 3rpx;
        color: #fff;
        font-size: 12rpx;
        margin-right: 5rpx;
      }

      .icon-bingli {
        background: #085cfe;
      }

      .icon-yisheng {
        background: #fc970c;
      }

      .icon-tijianke {
        background: #207c4d;
      }

      .icon-jiance {
        background: #f53840;
      }

      .icon-wendu {
        background: #fc9709;
      }

      .icon-danrenchuang {
        background: #2d8558;
      }
    }
  }

  .uni-content-bottom {
    padding: 0 6rpx;
  }
</style>
