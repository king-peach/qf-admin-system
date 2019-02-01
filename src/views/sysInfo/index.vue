<template>
  <div class="main clearfix">
    <div class="title">
      <el-button type="warning">禁止登陆</el-button>
      <el-button type="danger">强制注销所有会话</el-button>
    </div>
    <el-card v-for="(value, key, index) in list" :key="key" :class="['info-box', index < 2 ? 'half' : 'all']">
      <div slot="header">
        <span>{{ key }}</span>
      </div>
      <el-table :data="value">
        <el-table-column prop="name" label="数据项" />
        <el-table-column prop="value" label="属性值" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getInfo } from '@/api/sysInfo'
export default {
  data() {
    return {
      activeName: '',
      list: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getInfo().then(response => {
        this.list = response.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .title{
    padding-bottom:20px;
  }
  .info-box {
    display: inline-block;
    min-height: 385px;
    margin-bottom: 20px;
  }
  .clearfix {
    clear: both;
  }
  .clearfix::before,
  .clearfix::after {
    display: table;
    content: '';
  }
  .half {
    width: 48%;
    @media screen and (max-width: 980px) {
      width: 100%;
    }
    &:nth-of-type(2) {
      float: right;
    }
  }
  .all {
    width: 100%;
  }
</style>
