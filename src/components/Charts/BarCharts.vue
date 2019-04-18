<template>
  <div :id="id" :class="className" :style="{width:width, height:height}" />
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
export default {
  name: 'BarCharts',
  props: {
    text: {
      type: String,
      default: '基础 Bar Chart 组件'
    },
    id: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    className: {
      type: String,
      default: 'BarChart'
    },
    dataX: {
      type: Array,
      required: true
    },
    dataY: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  deforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      // 绘制图表
      this.chart.setOption({
        title: {
          text: this.text
        },
        tooltip: {},
        xAxis: {
          data: this.dataX
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: this.dataY
        }]
      })
      window.addEventListener('resize', debounce(() => {
        this.chart.resize()
      }, 200))
    }
  }
}
</script>

<style lang="scss" scoped>
.barChart {
  width: 500px;
  height: 500px;
}
</style>
