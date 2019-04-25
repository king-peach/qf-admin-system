<template>
  <el-form :inline="true" :data="formData" label-suffix=":" label-width="80px" label-position="right" class="box">
    <el-form-item v-for="(item, key) in formData" :key="key" :label="item.label">
      <template v-if="key === 'status'">
        <el-select v-model="item.value" placeholder="请选择">
          <el-option
            v-for="element in options"
            :key="element.value"
            :label="element.label"
            :value="element.value" />
        </el-select>
      </template>
      <template v-else-if="key === 'date'">
        <el-date-picker
          v-model="item.value"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="left" />
      </template>
      <template v-else>
        <el-input v-model="item.value" />
      </template>
    </el-form-item>

    <!-- 自定义内容插槽 -->
    <slot />

    <el-form-item>
      <el-button type="primary" size="medium" icon="el-icon-search" round @click="submit">
        搜索
      </el-button>
      <el-button size="medium" icon="el-icon-refresh" round @click="reset">
        重 置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    formData: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      options: [{
        value: null,
        label: '所有'
      }, {
        value: 1,
        label: '正常'
      }, {
        value: 0,
        label: '停用'
      }],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    submit() {
      const searchForm = {}
      for (const i in this.formData) {
        Object.defineProperty(searchForm, i, {
          value: this.formData[i].value
        })
      }
      this.$emit('search', searchForm)
    },
    reset() {
      for (const i in this.formData) {
        this.formData[i].value = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 20px 0 0 20px;
  margin-bottom: 20px;
  box-shadow: 1px 1px 3px #ddd;
  @media screen and (max-width: 990px) {
    display: none;
  }
  border-radius: 5px;
  background-color: #fff;
  .el-form-item {
    margin-right: 20px;
  }
}
</style>
