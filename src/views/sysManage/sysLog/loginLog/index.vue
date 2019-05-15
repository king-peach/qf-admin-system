<template>
  <div id="main">
    <el-row>
      <el-input v-model="searchValue" placeholder="请输入搜索关键词" suffix-icon="el-icon-search" class="search-input" @keyup.enter.native="search" />
      <el-button type="primary" @click="search">搜索</el-button>
    </el-row>
    <!-- 操作日志表格 -->
    <el-table :data="tables.slice((currentPage - 1) * pageSize,currentPage * pageSize)" border>
      <el-table-column type="index" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="date" label="登录时间" align="center" />
      <el-table-column prop="IP" label="IP地址" align="center" />
      <el-table-column prop="operateSystem" label="操作系统" align="center" />
      <el-table-column prop="browser" label="浏览器" align="center" />
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :total="tables.length"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      class="pagination-style"
      @size-change="getPageSize"
      @current-change="getCurrentPage"
    />
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  data() {
    return {
      tableData: [
        { username: 'admin', date: '2019-01-24 19:00:00', IP: '192.168.1.114', operateSystem: 'windows', browser: 'safari' },
        { username: 'admin', date: '2019-01-24 19:00:00', IP: '192.168.1.114', operateSystem: 'windows', browser: 'safari' },
        { username: 'admin', date: '2019-01-24 19:00:00', IP: '192.168.1.114', operateSystem: 'windows', browser: 'safari' },
        { username: 'admin', date: '2019-01-24 19:00:00', IP: '192.168.1.114', operateSystem: 'windows', browser: 'safari' },
        { username: 'admin', date: '2019-01-24 19:00:00', IP: '192.168.1.114', operateSystem: 'windows', browser: 'safari' },
        { username: 'admin', date: '2019-01-24 19:00:00', IP: '192.168.1.114', operateSystem: 'windows', browser: 'safari' },
        { username: 'admin', date: '2019-01-24 19:00:00', IP: '192.168.1.114', operateSystem: 'windows', browser: 'safari' }
      ],
      logFilter: '',
      searchValue: '',
      pageSize: 4,
      currentPage: 1
    }
  },
  computed: {
    tables() {
      const logFilter = this.logFilter
      if (logFilter !== '') {
        const reg = /^[\u4e00-\u9fa5\da-z-.]+$/
        if (!reg.test(logFilter)) {
          Message({
            type: 'error',
            message: '请输入中文、小写字母、数字、"-"、"."类型的关键词'
          })
        } else {
          return this.tableData.filter(dataNews => {
            return Object.keys(dataNews).some(key => {
              return dataNews[key].toLowerCase().indexOf(logFilter) > -1
            })
          })
        }
      }

      return this.tableData
    }
  },
  methods: {
    search() {
      this.logFilter = this.searchValue
    },
    getPageSize(val) {
      this.pageSize = val
    },
    getCurrentPage(val) {
      this.currentPage = val
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
}
.search-input {
  width: 30%;
}
</style>
