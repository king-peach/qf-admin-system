<template>
  <el-dialog :visible.sync="addRoleVisible" :show="show" :append-to-body="true" title="新增角色" center @close="cancelAdd('ruleForm')">
    <el-form :label-position="labelPosition" :rules="rules" ref="ruleForm" :model="role" label-width="80px">
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
      default: () => {}
    }
  },
  data() {
    return {
      labelPosition: 'right', // 新增表单的位置
      addRoleVisible: this.show,
      rules: {
        id: [
          { required: true, message: '请输入角色代码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        group: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
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
          console.log('success submit!')
          this.$emit('confirmAdd')
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
