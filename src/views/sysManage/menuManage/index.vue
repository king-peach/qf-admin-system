<template>
  <div class="main">
    <!-- 搜索组件 -->
    <SearchBox :formData="searchForm" @search="search"/>
    <!-- 菜单树形表单 -->
    <div class="container">
      <TreeTable
      :data="treeData"
      :eval-func="func"
      :expand-all="true"
      stripe>
        <el-table-column label="部门名称" align="center">
          <template slot-scope="scope">
            <span style="color:#ef0c4f">{{ scope.row.deptName }}</span>
          </template>
        </el-table-column>
      </TreeTable>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/SearchBox'
import TreeTable from '@/components/TreeTable'
import treeToArray from '@/utils/customEval'
import { getDeptData } from '@/api/sysManage/department'
export default {
  components: { 
    SearchBox,
    TreeTable
  },
  data() {
    return {
      searchForm: {
        menuName: { label: '菜单名称', value: '' },
        status: { label: '状态', value: null }
      },
      treeData: [],
      func: treeToArray, // 树形表格数据格式化
    }
  },
  created() {
    getDeptData().then(response => {
      this.treeData = response.data
      console.info(this.treeData)
    }).catch(error => { return error })
  },
  methods: {
    search(searchForm) { // 搜索
      console.info(searchForm)
    }
  }
}
</script>
