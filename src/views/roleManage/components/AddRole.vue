<template>
  <el-dialog :visible.sync="addRoleVisible" :show="show" :append-to-body="true" title="新增角色" center @close="cancelAdd('ruleForm')">
    <el-form :label-position="labelPosition" :rules="rules" ref="ruleForm" :model="role" label-width="80px">
      <el-form-item label="角色代码" prop="roleKey">
        <el-input v-model="role.roleKey" />
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="role.roleName" />
      </el-form-item>
      <!-- <el-form-item label="所属机构" prop="group">
        <el-select v-model="role.group" placeholder="所属机构">
          <el-option label="总公司" value="header" />
          <el-option label="分公司" value="branch" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="role.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="role.remark"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelAdd('ruleForm')">取 消</el-button>
      <el-button type="primary" @click="onSubmit('ruleForm')">立即创建</el-button>
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
      required: true
    }
  },
  data() {
    return {
      labelPosition: 'right', // 新增表单的位置
      addRoleVisible: this.show,
      rules: {
        roleKey: [
          { required: true, message: '请输入角色代码', trigger: 'blur' }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    show() {
      this.addRoleVisible = this.show
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.info(this.role)
          const createRole = { ...this.role }
          this.$emit('confirmAdd', createRole)
        } else {
          console.log('error submit!')
          return false
        }
      })
    },
    cancelAdd(formName) {
      this.$refs[formName].resetFields();
      this.$emit('cancel')
    }
  }
}
</script>
