<template>
  <div :id="id" :class="className" :style="{width: width, height: height}" />
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'StackLineChart',
  props: {
    id: {
      type: String,
      default: 'stackLineChart'
    },
    className: {
      type: String,
      default: 'stackLineChart'
    },
    width: {
      type: String,
      default: '300px'
    },
    height: {
      type: String,
      default: '300px'
    },
    title: {
      type: String,
      default: '折线图堆叠'
    },
    legendData: {
      type: Array,
      required: true
    },
    xAxisData: {
      type: Array,
      required: true
    },
    series: {
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
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      // 绘制图表
      this.chart.setOption({
        title: {
          text: this.title
        },
        tooltip: {
          triggle: 'axis'
        },
        legend: {
          data: this.legendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImg: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: this.series
      })
      window.addEventListener('resize', () => { this.chart.resize() })
    }
  }
}
</script>
