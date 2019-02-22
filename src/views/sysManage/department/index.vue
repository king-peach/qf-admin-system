<template>
  <div class="main">
    <search-box :formData="searchForm" @search="search" />
    <!-- 部门treeTable -->
    <div class="container">
      <tree-table
        :data="treeData"
        :eval-func="func"
        :expand-all="true"
        stripe>
        <el-table-column label="部门名称" align="center">
          <template slot-scope="scope">
            <span style="color:#ef0c4f">{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门主管" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.leader }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              active-value=1
              inactive-value=0
              @change="statusChange(scope.row.status)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
            <div v-show="scope.row.parentId !== 0">
              <el-button size="mini" @click="add(scope.row)">新增</el-button>
              <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </tree-table>

      <!-- 删除提示框 -->
      <del-item :show.sync="delItemVisible" @confirmDelOne="delItem" :type="delType" />
      <!-- 新增机构组件 -->
      <info-dialog :show.sync="infoVisible" :treeData="parentTree" :formData="formData" :flag="isCreate" @confirmAdd="confirm" @cancelAdd="cancel" />
    </div>
  </div>
</template>

<script>
/**
 * @Author : W_peach on 2019/1/16 14:54
 */
import TreeTable from '@/components/TreeTable'
import treeToArray from '@/utils/customEval'
import DelItem from '@/components/ConfirmDel/index'
import InfoDialog from './components/Info'
import SearchBox from '@/components/SearchBox'
import { getDeptData, createDept } from '@/api/sysManage/department'
import { filterNode } from '@/utils/getTree'
// import { listToTree } from '@/utils/getTree'
import { Notification } from 'element-ui'

export default {
  name: 'Department',
  components: {
    TreeTable,
    DelItem,
    InfoDialog,
    SearchBox
  },
  data() {
    return {
      func: treeToArray, // 数据格式化
      delType: 'delOne',
      treeData: [], // 原始数据
      oldTree: [], // 存储原始数据
      // listData: [],
      searchForm: { // 条件搜索数据
        deptName: { label: '部门名称', value: '' },
        status: { label: '状态', value: null }
      },
      defaultForm: {
        parentName: '',
        deptName: '',
        leader: '',
        status: '',
        phone: '',
        remark: '',
        parentId: 0
      },
      parentTree: [],
      formData: {},
      delItemVisible: false,
      infoVisible: false,
      isCreate: true
    }
  },
  created() {
    getDeptData().then(response => {
      if (response.success === true) {
        this.treeData = response.data
        this.oldTree = response.data
        // this.listData = response.data
        // this.treeData = listToTree(response.data, { parentId: 'parentId', id: 'deptId' }, 0)
      }
    })
  },
  methods: {
    del(row) { // 删除操作打开提示框
      console.info(row.name)
      this.delItemVisible = true
    },
    delItem() { // 确认删除操作
      this.delItemVisible = false
    },
    add(row) { // 新增机构
      this.infoVisible = true
      this.isCreate = true
      this.formData = { ...this.defaultForm }
      this.formData.parentName = row.parentName
      this.parentTree = this.treeData
    },
    edit(row) { // 编辑机构
      this.infoVisible = true
      this.isCreate = false
      this.formData = { ...row }
      this.formData.parent = row.parent.name
      this.parentTree = this.treeData
    },
    confirm(newFormData) { // 确定新增/编辑
      newFormData.orderNum = '1'
      createDept(newFormData).then(response => {
        if (response.success === true) {
          this.infoVisible = false
          Notification({
            type: 'success',
            message: '新增机构成功'
          })
        }
      }).catch(error => { return error })
    },
    cancel() { // 取消新增/编辑
      this.infoVisible = false
    },
    search(searchForm) {
      const deptName = searchForm.deptName
      getDeptData().then(response => {
        if (response.success === true) {
          this.oldTree = response.data
        }
      })
      if (searchForm.status !== null) {
        this.treeData = filterNode(filterNode(this.oldTree, node => node.deptName.indexOf(deptName) > -1), node => node.status === String(searchForm.status))
      } else {
        this.treeData = filterNode(this.oldTree, node => node.deptName.indexOf(deptName) > -1)
      }
      // const deptName = searchForm.deptName
      // const status = searchForm.status
      // let data = null
      // if (status !== null && deptName !== '') {
      //   data = this.listData.filter(element => {
      //     return element.deptName.indexOf(deptName) > -1 && element.status.indexOf(status) > -1
      //   })
      // } else if (deptName !== '' && status === null) {
      //   data = this.listData.filter(element => {
      //     return element.deptName.indexOf(deptName) > -1
      //   })
      // } else {
      //   console.info(this.listData)
      //   data = this.listData.filter(element => {
      //     return element.status.indexOf(status) > -1
      //   })
      // }
      // if (status === null && deptName === '') {
      //   data = listToTree(this.listData, { parentId: 'parentId', id: 'deptId' }, 0)
      // }
      // console.info(data)
      // this.treeData = data
    },
    statusChange(value) {
      console.info(value)
    }
  }
}
</script>
