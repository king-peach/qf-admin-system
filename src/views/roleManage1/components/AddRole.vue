<template>
  <el-dialog :visible.sync="addRoleVisible" :show="show" :append-to-body="true" title="新增角色" center @close="$emit('update:show', false)">
    <el-form :label-position="labelPosition" :model="role" label-width="80px">
      <el-form-item label="角色代码" prop="id">
        <el-input v-model="role.id" />
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="role.name" />
      </el-form-item>
      <el-form-item label="所属机构" prop="group">
        <el-select v-model="role.group" placeholder="所属机构">
          <el-option label="总公司" value="header" />
          <el-option label="分公司" value="branch" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="role.remark"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addRoleVisible = false">取 消</el-button>
      <el-button type="peimary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    role: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      labelPosition: 'right', // 新增表单的位置
      addRoleVisible: this.show
    }
  },
  watch: {
    show() {
      this.addRoleVisible = this.show
    }
  },
  methods: {
    confirm() {
      this.$emit('confirmAdd')
    }
  }
}
</script>
