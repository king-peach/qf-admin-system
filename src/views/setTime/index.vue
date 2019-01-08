<template>
  <div class="main">
    <el-table
      ref="setTimeForm"
      :data="tableData3"
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
          <el-button size="mini">编辑</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getSetTimeData } from '@/api/setTime'
export default {
  data() {
    return {
        tableData3: [{
          type: '系统任务',
          name: 'Framework Cron Task',
          status: '启用',
          nextDate: '2019-01-04 16:30:30',
          timeout: '-1 ms',
          startDate: '2019-01-05 11:00:00',
          endDate: '2019-01-06 10:00:00',
          descript: 'com.framework.cn.frameworkTask'
        }, {
          type: '系统任务',
          name: 'Framework Cron Task',
          status: '启用',
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
        },{
          type: '系统任务',
          name: 'Framework Cron Task',
          status: '启用',
          nextDate: '2019-01-04 16:30:30',
          timeout: '-1 ms',
          startDate: '2019-01-05 11:00:00',
          endDate: '2019-01-06 10:00:00',
          descript: 'com.framework.cn.frameworkTask'
        },],
      multipleSelection: [],
      data: []
    }
  },
  created: {
    
  },
  methods: {
    getData() {

    }
  }
}
</script>