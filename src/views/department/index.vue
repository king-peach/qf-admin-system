<template>
  <div class="main">
    <search-box :formData="searchForm" @search="search" />
    <!-- 部门treeTable -->
    <tree-table :data="data" :eval-func="func" :eval-args="args" :expand-all="expandAll" border>
      <el-table-column label="部门名称">
        <template slot-scope="scope">
          <span style="color:#ef0c4f">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门主管">
        <template slot-scope="scope">
          <span>{{ scope.row.leader }}</span>
        </template>
      </el-table-column>
      <el-table-column label="传真">
        <template slot-scope="scope">
          <span>{{ scope.row.fax }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template slot-scope="scope">
          <div v-show="scope.row._level !== 1">
            <el-button size="mini" @click="add(scope.row)">新增</el-button>
            <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </tree-table>

    <!-- 删除提示框 -->
    <del-item :show.sync="delItemVisible" @confirmDel="delItem" />
    <!-- 新增机构组件 -->
    <info-dialog :show.sync="infoVisible" :treeData="parentTree" :formData="formData" :flag="isCreate" @confirmAdd="confirm" @cancelAdd="cancel" />
  </div>
</template>

<script>
/**
  Auth: W_peach
  Created: 2019/1/16 14:54
*/
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import DelItem from '@/components/ConfirmDel/index'
import InfoDialog from './components/Info'
import SearchBox from '@/components/SearchBox'
import { Message } from 'element-ui'

export default {
  name: 'Department',
  components: {
    treeTable,
    DelItem,
    InfoDialog,
    SearchBox
  },
  data() {
    return {
      func: treeToArray,
      expandAll: true,
      data: {
        name: '总公司',
        leader: '系统管理员',
        fax: '0730-12344',
        tel: '13517302233',
        children: [
          {
            name: '七风网络',
            leader: '管理员',
            fax: '0731-22222',
            tel: '18723124442',
            children: [
              {
                name: '运营部',
                leader: '',
                fax: '0730-231231',
                tel: ''
              }, {
                name: '技术部',
                leader: '',
                fax: '0730-231231',
                tel: ''
              }, {
                name: '商务部',
                leader: '',
                fax: '0730-231231',
                tel: ''
              }, {
                name: '编辑部',
                leader: '',
                fax: '0730-231231',
                tel: ''
              }, {
                name: '财务部',
                leader: '',
                fax: '0730-231231',
                tel: ''
              }
            ]
          }
        ]
      },
      searchForm: { // 条件搜索数据
        name: { label: '部门名称', value: '' },
        leader: { label: '部门主管', value: '' },
        tel: { label: '电话', value: '' },
        fax: { label: '传真', value: '' }
      },
      defaultForm: {
        parent: '',
        name: '',
        leader: '',
        fax: '',
        tel: ''
      },
      parentTree: [],
      formData: {},
      args: [null, null, 'timeLine'],
      delItemVisible: false,
      infoVisible: false,
      isCreate: true
    }
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
      console.info(row)
      this.infoVisible = true
      this.isCreate = true
      this.formData = { ...this.defaultForm }
      this.formData.parent = row.name
      this.parentTree = [this.data]
    },
    edit(row) { // 编辑机构
      this.infoVisible = true
      this.isCreate = false
      this.formData = { ...row }
      this.formData.parent = row.parent.name
      this.parentTree = [this.data]
    },
    confirm(newFormData) { // 确定新增/编辑
      this.infoVisible = false
      console.info(newFormData)
    },
    cancel() { // 取消新增/编辑
      this.infoVisible = false
    },
    search(searchForm) {
      const regTel = /^$|^[\d]{0,11}$/
      if (!regTel.test(searchForm.tel)) {
        Message({
          type: 'error',
          message: '请填写不超过11位数字的电话'
        })
        return false
      }
      console.info(searchForm)
    }
  }
}
</script>
