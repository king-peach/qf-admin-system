<template>
  <div class="main">
    <el-row>
      <el-col>
        <el-input v-model="searchValue" @keyup.enter.native="search" placeholder="请输入搜索关键词" suffix-icon="el-icon-search" class="search-input" />
        <el-button type="primary" @click="search">搜索</el-button>
      </el-col>
    </el-row>
    <!-- 登陆日志表格 -->
    <el-table
      :data="tables.slice((currentPage - 1) * pageSize,currentPage * pageSize)"
      border
      stripe>
      <el-table-column type="index" width="50px" label="序号" align="center" />
      <el-table-column prop="date" label="时间" align="center" />
      <el-table-column prop="username" label="用户名" align="center" />
      <el-table-column prop="IP" label="IP地址" align="center" />
      <el-table-column prop="info" label="原始消息" align="center" />
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :total="tables.length"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="total, prev, pager, next, jumper"
      @size-change="getPageSize"
      @current-change="getCurrentPage"
      class="pagination-style"
      />
  </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
  data() {
    return {
      tableData: [
        { date: '2019-01-14 10:13:43', username: 'admin', IP: '192.168.1.146', info: 'User login' },
        { date: '2019-01-14 10:13:43', username: 'admin', IP: '192.168.1.143', info: 'User login' },
        { date: '2019-01-14 10:13:43', username: 'admin', IP: '192.168.1.125', info: 'User login' },
        { date: '2019-01-14 10:13:43', username: 'admin', IP: '192.168.1.176', info: 'User login' },
        { date: '2019-01-14 10:13:43', username: 'admin', IP: '192.168.1.192', info: 'User login' },
        { date: '2019-01-14 10:13:43', username: 'admin', IP: '192.168.1.117', info: 'User login' },
        { date: '2019-01-14 10:13:43', username: 'admin', IP: '192.168.1.146', info: 'User login' },
        { date: '2019-01-14 10:13:43', username: 'admin', IP: '192.168.1.182', info: 'User login' },
        { date: '2019-01-14 10:13:43', username: 'admin', IP: '192.168.1.146', info: 'User login' }
      ],
      searchValue: '',
      logFilter: '',
      pageSize: 5,
      currentPage: 1
    }
  },
  computed: {
    tables() { // 模糊搜索功能
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
              return String(dataNews[key]).toLowerCase().indexOf(logFilter) > -1
            })
          })
        }
      }

      return this.tableData
    }
  },
  methods: {
    search() { // 触发模糊搜索
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
.pagination-style {
  margin-top: 20px;
}
</style>
