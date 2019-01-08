<template>
  <div class="main">
    <el-row type="flex" justify="space-between">
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-arrow-right">手动执行</el-button>
      </el-col>
      <el-col :span="10">
        <el-input v-model="searchValue" placeholder="请输入搜索关键字" @keyup.enter.native="searchTask" suffix-icon="el-icon-search" class="search-input" />
        <el-button type="primary" @click="searchTask">搜索</el-button>
        <el-button type="primary" @click="createTask">+ 添加</el-button>
      </el-col>
    </el-row>
    <!-- 定时任务表单 -->
    <el-table
      ref="setTimeForm"
      :data="tables"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column type="index" width="30" />
      <el-table-column type="selection" width="30" align="center"/>
      <el-table-column prop="type" label="类别" align="center" />
      <el-table-column prop="name" label="任务名称" show-overflow-tooltip width="120" align="center"/>
      <el-table-column prop="status" label="任务状态" align="center" />
      <el-table-column prop="nextDate" label="下次执行时间" show-overflow-tooltip align="center" />
      <el-table-column prop="timeout" label="当前任务耗时" align="center" />
      <el-table-column prop="startDate" label="上次任务开始时间" show-overflow-tooltip align="center" />
      <el-table-column prop="endDate" label="上次任务结束时间" show-overflow-tooltip align="center" />
      <el-table-column prop="descript" label="任务描述" show-overflow-tooltip align="center"/>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="medium" type="text" @click="editTask">编辑</el-button>
          <el-button size="medium" type="text" style="color:#F56C6C;" @click="handlerDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 确认删除任务组件 -->
    <del-task :show.sync="delTaskVisible" @confirmDel="delTask"/>
    <!-- 新增/编辑任务组件 -->
    <task-info :show.sync="taskinfoVisible" :flag="isCreate" :formData="formData" @confirmAdd="addTask" @closeDialog="cancel"/>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import DelTask from '@/components/confirmDel/index'
import TaskInfo from './components/TaskInfo'
// import { getSetTimeData } from '@/api/setTime'
export default {
  components: {
    DelTask,
    TaskInfo
  },
  data() {
    return {
        tableData: [{
          type: '系统任务',
          name: 'Framework Cron Task',
          status: '启用',
          nextDate: '2019-01-04 16:30:30',
          timeout: '-1 ms',
          startDate: '2019-01-05 11:00:00',
          endDate: '2019-01-06 10:00:00',
          descript: 'com.framework.cn.frameworkTask'
        }, {
          type: '系统任务1',
          name: 'Framework Cron Task',
          status: '启用',
          nextDate: '2019-01-04 16:30:30',
          timeout: '1 ms',
          startDate: '2019-01-05 11:00:00',
          endDate: '2019-01-06 10:00:00',
          descript: 'com.framework.cn.frameworkTask'
        },{
          type: '系统任务',
          name: 'Framework Cron Task',
          status: '禁用',
          nextDate: '2019-01-04 16:30:30',
          timeout: '-1 ms',
          startDate: '2019-01-05 11:00:00',
          endDate: '2019-01-06 10:00:00',
          descript: 'com.framework.cn.frameworkTask'
        },{
          type: '系统任务',
          name: 'Framework Cron Task',
          status: '启用',
          nextDate: '2019-01-04 16:30:30',
          timeout: '-1 ms',
          startDate: '2019-01-05 11:00:00',
          endDate: '2019-01-06 10:00:00',
          descript: 'com.framework.cn.frameworkTask'
        }],
      formData: {
        taskName: '',
        taskClass: '',
        startDate: '',
        setTime1: [],
        setTime2: [],
        remark: ''
      },
      delRow: {},
      searchValue: '', // 搜索框值
      taskFilter: '', // 存储模糊搜索值
      delTaskVisible: false,
      taskinfoVisible: false,
      isCreate: true
    }
  },
  methods: {
    searchTask() { // enter触发模糊搜索
      this.taskFilter = this.searchValue
    },
    handlerDel(row) { // 删除项
      this.delRow = Object.assign({}, row)
      this.delTaskVisible = true
    },
    delTask() { //  确认删除
      this.delTaskVisible = false
      console.info(this.delRow)
      Message({
        type: 'info',
        message: '删除成功'
      })
    },
    addTask() { // 确认新增/编辑任务
      this.taskinfoVisible = false
    },
    cancel() { // 取消新增/编辑任务
      this.taskinfoVisible = false
    },
    createTask() { // 打开新增任务组件
      this.isCreate = true
      this.taskinfoVisible = true
    },
    editTask() { // 打开编辑任务组件
      this.isCreate = false
      this.taskinfoVisible = true
    }
  },
  computed: {
    tables() { // 模糊搜索功能
      const taskFilter = this.taskFilter
      if (taskFilter !== '') {
        const reg = /^[\u4e00-\u9fa5\da-z-]+$/
        if (!reg.test(taskFilter)) {
          Message({
            type: 'error',
            message: '请输入中文、小写字母、数字、"-"类型的关键词'
          })
        } else {
          return this.tableData.filter(dataNews => {
            return Object.keys(dataNews).some(key => {
              return String(dataNews[key]).toLowerCase().indexOf(taskFilter) > -1
            })
          })
        }
      }

      return this.tableData
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .search-input {
    width: 63%;
  }
</style>
