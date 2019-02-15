<template>
  <div class="main">
    <!-- 搜索组件 -->
    <search-box :formData="searchForm" @search="search">
      <el-form-item label="操作类型">
        <el-select v-model="operType">
          <el-option
            v-for="item in operTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </search-box>
    <!-- 操作日志表格 -->
    <div class="container">
      <el-button type="danger" icon="el-icon-delete" size="medium" @click="clear">清空</el-button>
      <el-button type="danger" icon="el-icon-arrow-down" size="medium" @click="delMultiple">批量删除</el-button>
      <el-table
        :data="tableData"
        stripe
        @row-click="handleRowClick"
        @select="handleSelected"
        @select-all="handleSelectAll"
        style="margin-top: 10px;">
        <el-table-column prop="num" label="序号" width="80px" align="center" sortable />
        <el-table-column type="selection" />
        <el-table-column prop="title" label="操作名称" align="center" width="180" />
        <el-table-column prop="operatorType" label="操作类型" :formatter="formatterOperType" align="center" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.operatorType.type" size="small">{{ scope.row.operatorType.txt }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operBy" label="操作人员" align="center" />
        <el-table-column prop="operLocation" label="操作地点" align="center" />
        <el-table-column prop="operIp" label="主机" align="center" width="180" sortable show-overflow-tooltip />
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="tableData.status === 1 ? 'success' : 'danger'" round>{{ scope.row.status === 1 ? '成功' : '失败' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operTime" label="操作时间" align="center" width="160" sortable />
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope" >
            <el-button type="danger" size="mini" @click="delCurrent(scope.row)">删除</el-button>
            <el-button type="info" size="mini" @click="openInfo">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="total, prev, pager, next, jumper"
        @current-change="getCurrentPage"
        class="pagination-style"
      />
      <!-- 确认删除组件 -->
      <confirm-del :show.sync="confirmDelVisible" :type="delType" @confirmDelOne="delOne" @confirmDelMore="delMore" @confirmClear="delAll"/>
      <!-- 查看详情组件 -->
      <log-info :show.sync="infoVisible" :info="rowInfo" @close="closeInfo"/>
    </div>
  </div>
</template>

<script>
import { getLogInfo, delLog, clearLog } from '@/api/systemLog/operationLog'
import { parseTime } from '@/utils/index'
import ConfirmDel from '@/components/ConfirmDel'
import LogInfo from './components/Info'
import SearchBox from '@/components/SearchBox'
import { Message } from 'element-ui'
export default {
  components: {
    ConfirmDel,
    LogInfo,
    SearchBox
  },
  data() {
    return {
      tableData: [],
      pageSize: 8, // 单页容量
      currentPage: 1, // 当前页码
      total: 8, // 总数据条数
      multipleDelIds: [], // 存储批量删除操作id
      currentId: null, // 存储当前行id
      confirmDelVisible: false, // 删除组件开关
      delType: 'delOne', // 删除组件状态
      infoVisible: false, // 点击查看详情组件开关
      rowInfo: {}, // 存储当前行日志信息
      searchForm: { // 存储搜索条件
        title: { label: '操作名称', value: null },
        operBy: { label: '操作人员', value: null },
        operLocation: { label: '操作地点', value: null }
      },
      searchData: {}, // 存储搜索请求参数
      operType: null, // 搜索框操作类型值
      operTypeOptions: [{ // 多选框数据
        value: null,
        label: '所有'
      }, {
        value: 1,
        label: '代码生成'
      }, {
        value: 2,
        label: '一般类型'
      }]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData(data) { // 获取后台数据
      getLogInfo(this.currentPage, this.pageSize, data).then(response => {
        this.tableData = response.data.list
        this.total = response.data.total
        this.tableData.forEach((element, index) => {
          element.num = (this.currentPage - 1) * this.pageSize + index + 1
          element.operTime = parseTime(element.operTime)
          element.operatorType = this.formatterOperType(element.operatorType)
        })
      })
    },
    handleRowClick(row) { // 点击当前行
      this.currentId = row.operId
      this.rowInfo = { ...row }
    },
    getCurrentPage(val) { // 改变页码回调
      this.currentPage = val
      this.getData(this.searchData)
    },
    formatterOperType(index) { // 格式化操作类型
      const data = [
        { type: 'danger', txt: '删除' },
        { type: 'primary', txt: '代码生成' },
        { type: 'primary', txt: '修改' }
      ]
      return data[index]
    },
    handleSelected(selection) { // 已勾选数据回调
      this.multipleDelIds = []
      selection.forEach(element => {
        this.multipleDelIds.push(element.operId)
      })
    },
    handleSelectAll(selection) { // 勾选全选时回调
      this.multipleDelIds = []
      selection.forEach(element => {
        this.multipleDelIds.push(element.operId)
      })
    },
    delCurrent() { // 删除当前行
      this.delType = 'delOne'
      this.confirmDelVisible = true
    },
    delOne() { // 确认删除当前行
      const data = []
      data.push(this.currentId)
      delLog(data).then(response => {
        if (response.success === true) {
          this.confirmDelVisible = false
          this.getData()
          Message({
            type: 'success',
            message: '删除成功'
          })
        }
      }).catch(error => { return error })
    },
    delMultiple() { // 批量删除
      if (this.multipleDelIds.length === 0) {
        Message({
          type: 'warning',
          message: '请勾选待删除数据'
        })
        return false
      }
      this.delType = 'delMore'
      this.confirmDelVisible = true
    },
    delMore() { // 确认批量删除
      const data = []
      this.multipleDelIds.forEach(id => {
        data.push(id)
      })
      delLog(data).then(response => {
        if (response.success === true) {
          this.confirmDelVisible = false
          this.getData()
          Message({
            type: 'success',
            message: '批量删除成功'
          })
        }
      }).catch(error => { return error })
    },
    clear() { // 清空
      this.delType = 'clear'
      this.confirmDelVisible = true
    },
    delAll() { // 确认清空
      console.info(1)
      clearLog().then(response => {
        if (response.success === true) {
          this.confirmDelVisible = false
          this.getData()
          Message({
            type: 'success',
            message: '已清空所有日志'
          })
        }
      }).catch(error => { return error })
    },
    openInfo() { // 打开详情组件
      this.infoVisible = true
    },
    closeInfo() { // 关闭详情组件
      this.infoVisible = false
    },
    search(searchForm) { // 搜索
      Object.getOwnPropertyNames(searchForm).forEach((key) => {
        this.searchData[key] = searchForm[key]
      })
      this.searchData.operType = this.operType
      this.getData(this.searchData)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 600px;
  padding: 20px;
  box-shadow: 1px 1px 3px #ddd;
  border-radius: 5px;
  background-color: #fff;
  .pagination-style {
    margin-top: 20px;
  }
}
</style>
