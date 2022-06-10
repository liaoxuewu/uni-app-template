# uCharts JSSDK 说明

1、如不使用 uCharts 组件，可直接引用 u-charts.js，打包编译后会`自动压缩`，压缩后体积约为`98kb`。
2、如果 100kb 的体积仍需压缩，请手动删除 u-charts.js 内您不需要的图表类型，如 k 线图 candle。
3、config-ucharts.js 为 uCharts 组件的用户配置文件，升级前请`自行备份config-ucharts.js`文件，以免被强制覆盖。
3、config-echarts.js 为 ECharts 组件的用户配置文件，升级前请`自行备份config-echarts.js`文件，以免被强制覆盖。

# v1.0 转 v2.0 注意事项

1、opts.colors 变更为 opts.color
2、ring 圆环图的扩展配置由 extra.pie 变更为 extra.ring
3、混合图借用的扩展配置由 extra.column 变更为 extra.mix.column
4、全部涉及到 format 的格式化属性变更为 formatter
5、不需要再传 canvasId 及$this 参数，如果通过 uChats 获取 context，可能会导致 this 实例混乱，导致小程序开发者工具报错。如果不使用 qiun-data-charts 官方组件，需要在 new uCharts()实例化之前，自行获取 canvas 的上下文 context（ctx），并传入 new 中的 context（opts.context）。为了能跨更多的端，给您带来的不便敬请谅解。
