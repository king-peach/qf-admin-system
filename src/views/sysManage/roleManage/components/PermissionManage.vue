<template>
  <el-dialog :visible.sync="permissionManageVisible" :show="show" :title="'权限设置'" @close="cancelEdit">
    <div class="menuPermission">
      <div class="label">菜单权限</div>
      <div class="content">
        <el-tree
          :data="treeData"
          :show-checkbox="true"
          node-key="menuId"
          ref="menuTree"
          :default-checked-keys="menuPer"
          :render-content="renderContent">
        </el-tree>
      </div>
    </div>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" @click="cancelEdit">取消</el-button>
      <el-button @click="confirmEdit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getMenuList } from '@/api/sysManage/menuManage'
import { editRole } from '@/api/sysManage/roleManage'
import { listToTree } from '@/utils/getTree'
export default {
  name: 'PermissionManage',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    roleInfo: {
      type: Object
    },
    menuIds: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      permissionManageVisible: this.show,
      menuPer: this.menuIds,
      treeData: null,
      data: null
    }
  },
  watch: {
    show() {
      this.permissionManageVisible = this.show
    }
  },
  created() {
    getMenuList().then(response => {
      this.data = listToTree(response.data, { id: 'menuId', parentId: 'parentId' }, 0)
      this.treeData = JSON.parse(JSON.stringify(this.data))
    }).catch(error => error)
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{data.menuName}</span>
          <span>{data.perms}</span>
        </span>)
    },
    cancelEdit() {
      this.$emit('cancel')
    },
    confirmEdit() {
      const menuIds = this.$refs.menuTree.getCheckedKeys()
      this.roleInfo.menuIds = menuIds
      this.roleInfo.status = this.roleInfo.status ? 1 : 0
      editRole(this.roleInfo).then(response => {
        if (response.success) {
          this.$emit('confirm')
        }
      }) 
    }
  }
}
</script>

<style lang="scss" scope>
.menuPermission {
  padding: 0 20px;
  display: flex;
  .label {
    padding: 5px 10px 0 0;
  }
}
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    span {
      margin-left: 5px;
    }
  }
</style>
