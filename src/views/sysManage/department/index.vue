<template>
  <div id="main">
    <search-box :formData="searchForm" @search="search" />
    <!-- 部门treeTable -->
    <div id="container">
      <tree-table
        v-loading="loading"
        :data="treeData"
        :eval-func="func"
        :expand-all="true">
        <el-table-column label="部门名称" align="center">
          <template slot-scope="scope">
            <span style="color:#ef3434">{{ scope.row.deptName }}</span>
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
              @change="statusChange(scope.row.status, scope.row.deptId)" />
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
              <el-button type="text" size="medium" @click="add(scope.row)">新增</el-button>
              <el-button type="text" size="medium" @click="edit(scope.row)">编辑</el-button>
              <el-button type="text" size="medium" style="color: #ef3434" @click="del(scope.row.deptId)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </tree-table>

      <!-- 删除提示框 -->
      <del-item :show.sync="delItemVisible" :type="delType" @confirmDelOne="delItem" />
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
import { getDeptData, createDept, ChangeStatus, editDept, delDept } from '@/api/sysManage/department'
import { filterNode } from '@/utils/getTree'
import { listToTree } from '@/utils/getTree'
import { Notification, Message } from 'element-ui'

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
      loading: true, // 加载状态
      func: treeToArray, // 数据格式化
      delType: 'delOne',
      treeData: [], // 原始数据
      oldTree: [], // 存储原始数据
      searchForm: { // 条件搜索数据
        deptName: { label: '部门名称', value: '' },
        status: { label: '状态', value: null }
      },
      defaultForm: {
        parentName: '',
        deptName: '',
        leader: '',
        status: true,
        phone: '',
        remark: '',
        parentId: 0,
        orderNum: '0'
      },
      parentTree: [],
      formData: {},
      delItemVisible: false,
      infoVisible: false,
      isCreate: true,
      delId: null // 删除所需id
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData(data) {
      getDeptData().then(response => {
        if (response.success === true) {
          response.data.forEach(element => {
            element.status === 1 ? element.status = true : element.status = false
          })
          this.treeData = listToTree(response.data, { parentId: 'parentId', id: 'deptId' }, 0)
          this.loading = false
        }
      })
    },
    del(id) { // 删除操作打开提示框
      this.delId = id
      this.delItemVisible = true
    },
    delItem() { // 确认删除操作
      delDept(this.delId).then(response => {
        if (response.success === true) {
          this.delItemVisible = false
          this.getData()
          Notification({
            type: 'success',
            message: '删除成功'
          })
        }
      }).catch(error => { return error })
    },
    add(row) { // 新增机构
      this.infoVisible = true
      this.isCreate = false
      this.formData = { ...this.defaultForm }
      this.formData.parentName = row.parentName
      this.parentTree = this.treeData
    },
    edit(row) { // 编辑机构
      this.infoVisible = true
      this.isCreate = true
      this.formData = { ...row }
      this.parentTree = this.treeData
    },
    confirm(newFormData) { // 确定新增/编辑
      newFormData.status = newFormData.status ? 1 : 0
      console.info(newFormData)
      if (!this.isCreate) {
        createDept(newFormData).then(response => {
          if (response.success === true) {
            this.infoVisible = false
            this.getData()
            Message({
              type: 'success',
              message: '新增机构成功'
            })
          }
        }).catch(error => { return error })
      } else {
        editDept(newFormData).then(response => {
          if (response.success === true) {
            this.infoVisible = false
            this.getData()
            Message({
              type: 'success',
              message: '编辑内容提交成功'
            })
          }
        }).catch(error => { return error })
      }
    },
    cancel() { // 取消新增/编辑
      this.infoVisible = false
    },
    search(searchForm) {
      const deptName = searchForm.deptName
      let status = null
      searchForm.status === 1 ? status = true : status = false
      getDeptData().then(response => {
        if (response.success === true) {
          response.data.forEach(element => {
            element.status === 1 ? element.status = true : element.status = false
          })
          this.oldTree = listToTree(response.data, { parentId: 'parentId', id: 'deptId' }, 0)
        }
        // 获取并处理值以后进行过滤
        if (searchForm.status !== null) {
          this.treeData = filterNode(filterNode(this.oldTree, node => node.deptName.indexOf(deptName) > -1), node => node.status === status)
        } else {
          this.treeData = filterNode(this.oldTree, node => node.deptName.indexOf(deptName) > -1)
        }
        this.loading = false
      }).catch(error => { return error })
    },
    statusChange(rowStatus, rowId) {
      const data = {}
      data.status = rowStatus ? 1 : 0
      data.deptId = rowId
      ChangeStatus(data).then(response => {
        if (response.success === true) {
          Notification({
            type: 'success',
            message: '状态修改成功'
          })
        }
      }).catch(error => { return error })
    }
  }
}
</script>
