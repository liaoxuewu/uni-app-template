<!--
 * @Description: 编辑
 * @Author liaoxuewu
 * @create 2022/5/18 11:07
 -->
<template>
  <view>
    <view class="uni-note-container">
      <htz-signature
        v-if="isShowSignature"
        :isShowSignature.sync="isShowSignature"
        :isShowMask.sync="isShowMask"
        class="uni-note-draw"
        @sumbit="sumbit"
        cid="ceshi1"
      ></htz-signature>
      <uni-audio-record
        ref="record"
        class="uni-note-record"
        v-if="isShowRecord"
        :isShowRecord.sync="isShowRecord"
        :isShowMask.sync="isShowMask"
        @recordConfirm="recordConfirm"
      ></uni-audio-record>
      <scroll-view :scroll-top="scrollTop" scroll-y :style="`height:${rightContentScrollH}px`">
        <mp-html
            ref="article"
            container-style="padding:20px"
            :content="content"
            domain="https://6874-html-foe72-1259071903.tcb.qcloud.la/demo"
            :editable="editable"
            @remove="remove"
        />
      </scroll-view>
      <block v-if="modal">
        <view class="mask"/>
        <view class="modal">
          <view class="modal_title">{{ modal.title }}</view>
          <input class="modal_input" :value="modal.value" maxlength="-1" auto-focus @input="modalInput"/>
          <view class="modal_foot">
            <view class="modal_button" @tap="modalCancel">取消</view>
            <view
                class="modal_button"
                style="color: #576b95; border-left: 1px solid rgba(0, 0, 0, 0.1)"
                @tap="modalConfirm"
            >确定
            </view
            >
          </view>
        </view>
      </block>
      <view class="uni-note-bottom">
        <view class="uni-note-bottom-button uni-note-cancel">
          撤销
        </view>
        <view class="uni-note-bottom-button uni-note-save">
          保存
        </view>
      </view>
    </view>
    <view v-if="isShowMask"
          class="uni-note-mask"
          :style="`height:${systemInfo.windowHeight}px;width:${systemInfo.windowWidth}px;`"
    ></view>
  </view>
</template>

<script>
import mpHtml from '@/components/mp-html/mp-html'
import content from './content'
import htzSignature from '@/components/htz-signature/htz-signature.vue'

// 上传图片方法
function upload(src, type) {
  return new Promise((resolve, reject) => {
    console.log('上传', type === 'img' ? '图片' : '视频', '：', src)
    resolve(src)
    /*
    // 实际使用时，上传到服务器
    wx.uploadFile({
      url: 'xxx', // 接口地址
      filePath: src,
      name: 'xxx',
      success(res) {
        resolve(res.data.path) // 返回线上地址
      },
      fail: reject
    })
    */
  })
}

// 删除图片方法
function remove(src) {
  console.log('删除图片：', src)
  // 实际使用时，删除线上资源
}

export default {
  name: 'uni-note-edit',
  components: {
    mpHtml,
    htzSignature
  },
  props: {
    rightContentScrollH: {
      type: Number,
      default: () => 0
    },
    personInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    isShowDialog: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      placeholder: '开始输入...',
      scrollTop: 0,
      content, // 编辑器渲染内容
      modal: null,
      editable: true, // 编辑器是否启用编辑
      operateType: 'audio', // 操作的类型 audio：录音 signature：画板
      isShowRecord: false, // 是否显示录音操作界面
      isShowZoomButton: false, // 是否显示缩放按钮
      isShowSignature: false, // 是否显示画板
      signatureImgUrl: '', // 画板生成的图片地址
      recordUrl: '', // 录音生成地址
      systemInfo: uni.getSystemInfoSync(),
      isShowMask: false
    }
  },
  mounted() {
    /**
     * @description 设置获取链接的方法
     * @param {String} type 链接的类型（img/video/audio/link）
     * @param {String} value 修改链接时，这里会传入旧值
     * @returns {Promise} 返回线上地址
     * type 为音视频时可以返回一个数组作为源地址
     * type 为 audio 时，可以返回一个 object，包含 src、name、author、poster 等字段
     */
    this.$refs.article.getSrc = (type, value) => {
      console.log(type + 'type......', value + 'value.....')
      return new Promise((resolve, reject) => {
        if (this.operateType === 'record') {
          uni.showLoading({
            title: '上传中'
          });
          (async () => {
            const arr = []
            const src = await upload(this.recordUrl, type)
            arr.push(src)
            return arr
          })().then(res => {
            uni.hideLoading()
            resolve(res)
          })
        }
        if (type === 'img' || type === 'video') {
          // 画板传来的图片
          if (this.operateType === 'signature') {
            uni.showLoading({
              title: '上传中'
            });
            (async () => {
              const arr = []
              const src = await upload(this.signatureImgUrl, type)
              arr.push(src)
              this.isShowSignature = false
              this.isShowMask = false
              return arr
            })().then(res => {
              uni.hideLoading()
              resolve(res)
            })
          } else {
            uni.showActionSheet({
              itemList: ['本地选取', '远程链接'],
              success: res => {
                if (res.tapIndex === 0) {
                  // 本地选取
                  if (type === 'img') {
                    uni.chooseImage({
                      count: value === undefined ? 9 : 1, // 2.2.0 版本起插入图片时支持多张（修改图片链接时仅限一张）
                      success: res => {
                        uni.showLoading({
                          title: '上传中'
                        });
                        (async () => {
                          const arr = []
                          for (let item of res.tempFilePaths) {
                            // 依次上传
                            console.log(item)
                            const src = await upload(item, type)
                            arr.push(src)
                          }
                          return arr
                        })().then(res => {
                          uni.hideLoading()
                          resolve(res)
                        })
                      },
                      fail: reject
                    })
                  } else {
                    uni.chooseVideo({
                      success: res => {
                        uni.showLoading({
                          title: '上传中'
                        })
                        console.log(res.tempFilePath + 111111)
                        upload(res.tempFilePath, type).then(res => {
                          // this.save()
                          uni.hideLoading()
                          resolve(res)
                        })
                      },
                      fail: reject
                    })
                  }
                } else {
                  // 远程链接
                  this.callback = {
                    resolve,
                    reject
                  }
                  this.$set(this, 'modal', {
                    title: (type === 'img' ? '图片' : '视频') + '链接',
                    value
                  })
                }
              }
            })
          }
        } else {
          this.callback = {
            resolve,
            reject
          }
          let title
          if (type === 'audio') {
            title = '音频链接'
          } else if (type === 'link') {
            title = '链接地址'
          }
          this.$set(this, 'modal', {
            title,
            value
          })
        }
      })
    }
  },
  methods: {
    /**
     * 删除图片/视频/音频标签事件
     */
    remove(e) {
      // 删除线上资源
      remove(e.src)
    },
    /**
     * 调用编辑接口
     */
    edit(e, type) {
      if (type === '') {
        this.$refs.article[e.currentTarget.dataset.method]()
      } else if (type === 'record') {
        this.$refs.article['insertAudio']()
      } else if (type === 'signature') {
        this.$refs.article['insertImg']()
      }
    },
    /**
     * 清空编辑内容
     */
    clear() {
      uni.showModal({
        title: '确认',
        content: '确定清空内容吗？',
        success: res => {
          if (res.confirm) this.$refs.article.clear()
        }
      })
    },
    /**
     * 保存编辑内容
     */
    save() {
      setTimeout(() => {
        let content = this.$refs.article.getContent()
        uni.showModal({
          title: '保存',
          content,
          confirmText: '完成',
          success: res => {
            if (res.confirm) {
              // 复制到剪贴板
              uni.setClipboardData({
                data: content
              })
              // 结束编辑
              this.editable = false
            }
          }
        })
      }, 50)
    },
    /**
     * 显示录音弹框
     */
    showRecord() {
      this.changePullStatus(false)
      this.isShowRecord = true
      this.isShowMask = true
    },
    /**
     * 显示画板弹框
     */
    showSignature() {
      this.changePullStatus(false)
      this.isShowSignature = true
      this.isShowMask = true
    },
    /**
     * 画板确认按钮
     */
    async sumbit(res) {
      console.log('sumbit', res)
      this.signatureImgUrl = res.tempFilePath
      this.operateType = 'signature'
      this.edit('', 'signature')
      try {
        uni.setStorageSync('ceshiUrl', res.tempFilePath)
        // uni.navigateBack()
      } catch (e) {
        // error
      }
    },
    /**
     * 录音完成
     */
    recordConfirm() {
      this.recordUrl = this.$refs.record.tempFilePath
      this.recordUrl = plus.io.convertLocalFileSystemURL(this.recordUrl);
      console.log(this.recordUrl + '录音文件地址...')
      this.operateType = 'record'
      this.edit('', 'record')
    },
    /**
     * 动态控制下拉刷新开启状态
     */
    changePullStatus(status) {
      // #ifdef APP-PLUS
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const currentWebview = page.$getAppWebview();
      currentWebview.setStyle({
        pullToRefresh: {
          support: status,
          style: plus.os.name === 'Android' ? 'circle' : 'default'
        }
      });
      // #endif
    },
    /**
     * 处理模态框
     */
    modalInput(e) {
      this.value = e.detail.value
    },
    modalConfirm(path) {
      console.log(path)
      this.callback.resolve(this.value || this.modal.value || '')
      this.callback.resolve(path || '')
      this.$set(this, 'modal', null)
    },
    modalCancel() {
      this.callback.reject()
      this.$set(this, 'modal', null)
    }
  }
}
</script>

<style scoped lang="scss">
.uni-note-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 12;
  // background: yellowgreen;
}

.uni-note-container {
  width: 100%;
  height: 100%;
  line-height: 30rpx;
  text-align: center;
  position: relative;
  top: 10%;
  background: #fff;

  .uni-note-record {
    width: 50%;
    height: 50%;
    background: #fff;
    left: 50%;
    transform: translate(-50%, 10%);
    z-index: 20;
  }

  .uni-note-draw {
    width: 65%;
    height: 80%;
    border: 1 rpx solid red;
    background: #fff;
    left: 50%;
    transform: translate(-50%, 10%);
    position: fixed;
    z-index: 1000;
  }

  .uni-note-top {
    width: 100%;
    position: absolute;
    background: #f3fcf8;
    margin: 0 auto;
    z-index: 10;

    .uni-note-top-user {
      display: flex;
      justify-content: space-around;
      background: #fff;
      border-radius: 3rpx;
      font-size: 12rpx;
      position: relative;
      height: 25rpx;
      line-height: 25rpx;
      margin-bottom: 6rpx;

      .user-avatar {
        width: 20rpx;
        height: 20rpx;
        vertical-align: middle;
      }

      .user-info-icon {
        display: inline-block;
        vertical-align: middle;
        width: 15rpx;
        height: 15rpx;
        line-height: 15rpx;
        border-radius: 15rpx;
        padding: 3rpx;
        font-size: 14rpx;
      }

      .user-icon-gender {
        color: #0844ff;
      }

      .user-icon-depart {
        color: #ffa000;
        background: rgba(255, 160, 0, 0.2);
      }

      .user-icon-hospital {
        color: #0062ff;
        background: rgba(0, 98, 255, 0.2);
      }

      .user-icon-bed {
        color: #fa5151;
        background: rgba(250, 81, 81, 0.2);
      }

      .user-avatar {
        width: 20rpx;
        height: 20rpx;
        vertical-align: middle;
      }
    }

    .uni-note-top-operate {
      width: 100%;
      height: 25rpx;
      line-height: 25rpx;
      background: #f3f4fa;
      text-align: center;

      .uni-note-operate-content {
        width: 50%;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
      }
    }

    text {
      margin-left: 8 rpx;
    }
  }
}

.uni-note-bottom {
  position: absolute;
  right: 0;
  bottom: 0;

  .uni-note-bottom-button {
    display: inline-block;
    width: 50rpx;
    height: 20rpx;
    line-height: 20rpx;
    border-radius: 4rpx;
    font-size: $uni-font-size-base;
  }

  .uni-note-cancel {
    border: 1rpx solid #C4C6CB;
    background: #fff;
    color: #898D99;
  }

  .uni-note-save {
    background: #38B071;
    border: 1rpx solid #38B071;
    margin-left: 20rpx;
    color: #fff;
  }
}

.iconfont {
  flex: 1;
  text-align: center;
  font-family: 'iconfont' !important;
  font-size: 22px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 模态框 */
.modal {
  position: fixed;
  top: 50%;
  left: 16px;
  right: 16px;
  background-color: #fff;
  border-radius: 12px;
  transform: translateY(-50%);
}

.modal_title {
  padding: 32px 24px 16px;
  font-size: 17px;
  font-weight: 700;
  text-align: center;
}

.modal_input {
  display: block;
  padding: 5px;
  margin: 0 24px 32px 24px;
  font-size: 14px;
  border: 1px solid #dfe2e5;
}

.modal_foot {
  display: flex;
  line-height: 56px;
  font-weight: 700;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.modal_button {
  flex: 1;
  text-align: center;
}

/* 蒙版 */
.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: black;
  opacity: 0.5;
}
</style>
