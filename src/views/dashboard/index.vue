<template>
  <div class="dashboard-container">
    <div ref="demo" class="dashboard-text">
      name:{{ name }}
    </div>
    <bar-charts :id="barChartId" :className="barChartClassName" :dataX="barChartDataX" :dataY="barChartDataY" :width="barChartWidth" :height="barChartHeight" />
    <stack-line-chart :id="stackLineChartId" :className="stackLineChartClassName" :width="stackLineChartWidth" :height="stackLineChartHeight" :legendData="satckLineChartLegendData" :xAxisData="stackLineChartXAxisData" :series="stackLineChartSeries" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BarCharts from '@/components/Charts/BarCharts.vue'
import StackLineChart from '@/components/Charts/StackLineChart'
export default {
  name: 'Dashboard',
  components: {
    BarCharts,
    StackLineChart
  },
  data() {
    return {
      barChartId: 'barChart',
      barChartClassName: 'barChart',
      barChartWidth: '100%',
      barChartHeight: '600px',
      barChartDataX: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
      barChartDataY: [20, 20, 36, 10, 10, 20],
      stackLineChartId: 'stackLineChart',
      stackLineChartClassName: 'stackLineChart',
      stackLineChartWidth: '100%',
      stackLineChartHeight: '500px',
      satckLineChartLegendData: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
      stackLineChartXAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      stackLineChartSeries: [
        {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '联盟广告',
          type: 'line',
          stack: '总量',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '视频广告',
          type: 'line',
          stack: '总量',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '直接访问',
          type: 'line',
          stack: '总量',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '搜索引擎',
          type: 'line',
          stack: '总量',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
