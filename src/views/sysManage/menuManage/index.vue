<template>
  <div id="main">
    <!-- 搜索组件 -->
    <SearchBox :formData="searchForm" @search="search" />
    <!-- 菜单树形表单 -->
    <div id="container">
      <TreeTable
        :data="treeData"
        :eval-func="func"
        :expand-all="true"
      >
        <el-table-column label="菜单名称" align="center" width="120">
          <template slot-scope="scope">
            <span style="color: #ef3434">{{ scope.row.menuName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.menuType === 2 ? 'warning' : ''" size="small">{{ scope.row.menuType === 2 ? '按钮' : '菜单' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="请求地址" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-button :type="scope.row.visible === 1 ? 'success' : 'danger'" size="mini" circle>{{ scope.row.visible === 1 ? '启用' : '禁用' }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </TreeTable>
    </div>
    <!-- 新增/编辑组件 -->
    <menu-info :show.sync="infoVisible" :flag="infoType" :formData="formData" @cancel="handleCancel" @confirm="confirmEdit" />
  </div>
</template>

<script>
import SearchBox from '@/components/SearchBox'
import TreeTable from '@/components/TreeTable'
import treeToArray from '@/utils/customEval'
import { getMenu } from '@/api/sysManage/menuManage'
import { listToTree, filterNode } from '@/utils/getTree'
import { parseTime } from '@/utils/index'
import MenuInfo from './components/info'
export default {
  components: {
    SearchBox,
    TreeTable,
    MenuInfo
  },
  data() {
    return {
      searchForm: {
        menuName: { label: '菜单名称', value: '' },
        status: { label: '状态', value: null }
      },
      treeData: [],
      oldTree: [], // 存储原始数据用于搜索
      func: treeToArray, // 树形表格数据格式化
      infoVisible: false, // 新增/编辑组件开关
      infoType: 1, // params: [0: 目录、1: 菜单、2:按钮]
      formData: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getMenu().then(response => {
        if (response.success === true) {
          response.data.forEach(element => {
            element.createTime = parseTime(element.createTime)
          })
          this.treeData = listToTree(response.data, { id: 'menuId', parentId: 'parentId' }, 0)
        }
      }).catch(error => { return error })
    },
    search(searchForm) { // 搜索
      getMenu().then(response => {
        if (response.success === true) {
          response.data.forEach(element => {
            element.createTime = parseTime(element.createTime)
          })
          this.oldTree = listToTree(response.data, { id: 'menuId', parentId: 'parentId' }, 0)
          this.treeData = filterNode(this.oldTree, node => node.menuName.indexOf(searchForm.menuName) > -1)
        }
      }).catch(error => { return error })
    },
    handleCancel() { //  取消新增/编辑
      this.infoVisible = false
    },
    edit(row) { // 编辑
      this.infoVisible = true
      this.formData = { ...row }
      this.infoType = row.menuType
      console.info(this.infoType)
    },
    confirmEdit() { // 确认编辑
      this.infoVisible = false
    }
  }
}
</script>
