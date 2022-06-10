<template>
  <uni-table class="uni-table-container" border stripe emptyText="暂无更多数据">
    <!-- 表头行 -->
    <uni-tr id="tableHead" class="uni-table-thead">
      <uni-th
        v-for="(item, index) in columns"
        :key="index"
        :class="item.class"
        :style="`width: ${item.width}%`"
        align="center"
        >{{ item.label }}</uni-th
      >
    </uni-tr>
    <!-- 表格数据行 -->
    <scroll-view
      :scroll-top="scrollTop"
      scroll-y
      :style="`margin-top: ${scrollStyle.marginTop}px;height: ${scrollStyle.height}px`"
    >
      <uni-tr class="uni-table-body" v-for="(item, index) in data" :key="index">
        <uni-td
          class="uni-table-item"
          v-for="(thItem, thIndex) in columns"
          :key="thIndex"
          :style="`width: ${thItem.width}%`"
          align="center"
        >
          <!-- 是插槽 -->
          <template v-if="thItem.slot">
            <slot v-bind="{ $index: index, row: item }"></slot>
          </template>
          <!-- 是序号 -->
          <template v-else-if="thItem.type == 'index'">
            {{ index + 1 }}
          </template>
          <!-- 是链接 -->
          <template v-else-if="thItem.type == 'link'">
            <span class="font-blue text-underline">
              {{ item[thItem.prop] }}
            </span>
          </template>
          <!-- 其他 -->
          <template v-else>
            <text v-if="!thItem.class" class="text-ellipsis" :style="`${thItem.maxWidth}rpx !important`">
              {{ thItem.maxWidth }}
              {{ item[thItem.prop] }}
            </text>
            <text v-if="thItem.class" :style="item.style" class="td-class text-ellipsis">
              {{ item[thItem.prop] }}
            </text>
            <view v-if="item[thItem.image]">
              <image src="@/static/group_item.png" class="group-img" v-if="item.groupIndex === 0" />
              <image
                src="@/static/group_item2.png"
                class="group-img"
                v-else-if="item.groupIndex + 1 === item.groupLength"
              />
              <image src="@/static/group_item1.png" class="group-img group-img2" v-else />
            </view>
          </template>
        </uni-td>
      </uni-tr>
    </scroll-view>
  </uni-table>
</template>

<script>
  export default {
    name: 'uni-custom-table',
    props: {
      columns: {
        // 表头
        type: Array,
        default: () => [
          {
            label: '序号', // title名
            type: 'index', // 类型
            width: '10', // 宽度
            fixed: 'left' // 固定左侧
          }
        ]
      },
      data: {
        // 表格数据
        type: Array,
        default: () => []
      },
      scrollStyle: {
        // 表格内容滑动样式
        type: Object,
        default: () => ({
          marginTop: 0,
          height: 0
        })
      }
    },
    computed: {
      _tableColumns() {
        console.log(this.columns)
        return this.columns
      }
    },
    data() {
      return {
        scrollTop: 0
      }
    }
  }
</script>

<style scoped lang="scss">
  .uni-table-container {
    width: 100%;
  }

  .uni-table-thead {
    position: absolute;
    z-index: 100;
    width: 100%;
    background: #eff0f5;
    display: flex;
    text-align: center;
    font-size: 12rpx;
    color: #818a9f;
  }

  // 标题
  .order-detail-title {
    width: 90%;
    height: 20rpx;
    line-height: 20rpx;
    background: #f0f1f8;
    margin: 10rpx auto;
    color: #898d99;
    padding: 0 10rpx;
    position: fixed;
    z-index: 100;
    font-size: $uni-font-size-base-rpx;
  }

  .uni-table-tr:nth-child(even) {
    background: #f9f9fa;
  }

  .uni-table-tr:nth-child(odd) {
    background: #fff;
  }

  // 文字省略号
  .text-ellipsis {
    display: inline-block;
    overflow: hidden; // 超出的文本隐藏
    text-overflow: ellipsis; // 溢出用省略号显示
    white-space: nowrap; // 溢出不换行
  }

  .td-class {
    display: inline-block;
    width: 60%;
    border-radius: 5rpx;
    padding: 2rpx;
  }

  .group-img {
    width: 8rpx;
    height: 8rpx;
    margin-left: 5rpx;
    margin-bottom: -2rpx;
  }

  .group-img2 {
    width: 2rpx;
    margin-left: 10rpx;
  }
</style>
