<template>
  <div id="main">
    <!-- 搜索组件 -->
    <search-box :formData="searchForm" />

    <div id="container">
      <!-- 定时任务表单 -->
      <el-table
        ref="setTimeForm"
        border
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="index" width="30" align="center" />
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column prop="type" label="类别" align="center" />
        <el-table-column prop="name" label="任务名称" show-overflow-tooltip width="120" align="center" />
        <el-table-column prop="status" label="任务状态" align="center" />
        <el-table-column prop="nextDate" label="下次执行时间" show-overflow-tooltip align="center" />
        <el-table-column prop="timeout" label="当前任务耗时" align="center" />
        <el-table-column prop="startDate" label="上次任务开始时间" show-overflow-tooltip align="center" />
        <el-table-column prop="endDate" label="上次任务结束时间" show-overflow-tooltip align="center" />
        <el-table-column prop="descript" label="任务描述" show-overflow-tooltip align="center" />
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="medium" type="text" @click="editTask">编辑</el-button>
            <el-button size="medium" type="text" style="color:#F56C6C;" @click="handlerDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 确认删除任务组件 -->
      <del-task :show.sync="delTaskVisible" @confirmDel="delTask" />
      <!-- 新增/编辑任务组件 -->
      <task-info :show.sync="taskinfoVisible" :flag="isCreate" :formData="formData" @confirmAdd="addTask" @closeDialog="cancel" />
      <!-- 分页器 -->
      <el-pagination
        :page-size="pageSize"
        :current-page="currentPage"
        :total="tableData.length"
        layout="total, prev, pager, next, jumper"
        style="margin-top: 20px;"
        @size-page="getPageSize"
        @current-change="getCurrentPage"
      />
      <div>
        {{ set_timeout }}
        <el-button type="primary" size="mini" @click="increment">自增一</el-button>
        <el-button type="danger" size="mini" @click="decrement">自减一</el-button>
      </div>

      <div class="img-upload-box">
        <img-upload uploadUrl="http://192.168.1.164:8088/group1/upload">
          <template v-slot:tips>
            <div class="tips">图片上传组件</div>
          </template>
        </img-upload>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import DelTask from '@/components/ConfirmDel/index'
import TaskInfo from './components/TaskInfo'
import SearchBox from '@/components/SearchBox'
import { mapGetters } from 'vuex'
import ImgUpload from '@/components/Upload/ImgUpload'
export default {
  name: 'setTime',
  components: {
    DelTask,
    TaskInfo,
    ImgUpload,
    SearchBox
  },
  data() {
    return {
      fileList: [],
      searchForm: {
        status: { label: '状态', value: null }
      },
      tableData: [{
        type: '系统任务1',
        name: 'Framework Cron Task',
        status: '启用',
        nextDate: '2019-01-04 16:30:30',
        timeout: '-1 ms',
        startDate: '2019-01-05 11:00:00',
        endDate: '2019-01-06 10:00:00',
        descript: 'com.framework.cn.frameworkTask'
      }, {
        type: '系统任务2',
        name: 'Framework Cron Task',
        status: '启用',
        nextDate: '2019-01-04 16:30:30',
        timeout: '1 ms',
        startDate: '2019-01-05 11:00:00',
        endDate: '2019-01-06 10:00:00',
        descript: 'com.framework.cn.frameworkTask'
      }, {
        type: '系统任务3',
        name: 'Framework Cron Task',
        status: '禁用',
        nextDate: '2019-01-04 16:30:30',
        timeout: '-1 ms',
        startDate: '2019-01-05 11:00:00',
        endDate: '2019-01-06 10:00:00',
        descript: 'com.framework.cn.frameworkTask'
      }, {
        type: '系统任务4',
        name: 'Framework Cron Task',
        status: '启用',
        nextDate: '2019-01-04 16:30:30',
        timeout: '-1 ms',
        startDate: '2019-01-05 11:00:00',
        endDate: '2019-01-06 10:00:00',
        descript: 'com.framework.cn.frameworkTask'
      }],
      createForm: {
        taskName: '',
        taskType: '',
        startDate: '',
        radio: 1,
        // setTime1: [],
        setTime: '',
        status: true,
        remark: ''
      },
      editForm: {
        taskName: 'Framework Cron Task',
        taskType: '系统任务',
        startDate: new Date('2019-01-09T03:00:00.000Z'),
        // setTime1: ['Minutes', '2'],
        setTime: '0 26,29,33 * * * ?',
        radio: 2,
        status: true,
        remark: 'com.framework.cn.frameworkTask'
      },
      formData: {}, // 存储新增/编辑表单数据
      delRow: {},
      delTaskVisible: false,
      taskinfoVisible: false,
      isCreate: true,
      pageSize: 2,
      currentPage: 1,
      btnVisible: true,
      imgList: []
    }
  },
  computed: {
    ...mapGetters(['set_timeout']) // 使用对象拓展运算符将getter混入computed对象中
    // set_timeout() {
    //   return this.$store.getters.set_timeout
    // }
  },
  methods: {
    increment() {
      this.$store.dispatch('IncrementCount', 1)
    },
    decrement() {
      this.$store.dispatch('DecrementCount', 1)
    },
    searchTask() { // enter触发模糊搜索
      this.taskFilter = this.searchValue
    },
    handlerDel(row) { // 删除项
      this.delRow = Object.assign({}, row)
      this.delTaskVisible = true
    },
    delTask() { //  确认删除
      this.delTaskVisible = false
      Message({
        type: 'info',
        message: '删除成功'
      })
    },
    addTask(newFromData) { // 确认新增/编辑任务
      this.taskinfoVisible = false
    },
    cancel() { // 取消新增/编辑任务
      this.taskinfoVisible = false
    },
    createTask() { // 打开新增任务组件
      this.isCreate = true
      this.taskinfoVisible = true
      this.formData = Object.assign({}, this.createForm)
    },
    editTask() { // 打开编辑任务组件
      this.isCreate = false
      this.taskinfoVisible = true
      this.formData = Object.assign({}, this.editForm)
    },
    getPageSize(val) { // pageSize改变时触发，获取页面元素个数
      this.pageSize = val
    },
    getCurrentPage(val) { // 当前页码改变时触发，获取当前页码
      this.currentPage = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
    margin-bottom: 20px;
    .col-right {
      text-align: right;
    }
  }
  .search-input {
    width: 30%;
  }
  .showFile img {
    width: 100px;
    height: 100px;
    display: inline-block;
  }
  .img-upload-box {
    width: 400px;
    .tips {
      font-size: .5em;
      color: #999;
      margin-top: 10px;
    }
  }
</style>
