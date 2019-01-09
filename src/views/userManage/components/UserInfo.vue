<template>
  <el-dialog :visible.sync="userinfoVisible" :show="show" :title="flag ? '新建用户' : '编辑用户'" center @close="cancel('ruleForm')">
    <el-form :model="formData" :rules="rule" ref="ruleForm" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" :disabled="!flag" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="密码" :prop="flag ? 'password' : ''" v-show="flag">
        <el-input v-model="formData.password" />
      </el-form-item>
      <el-form-item label="重复密码" :prop="flag ? 'repeatPass' : ''" v-show="flag">
        <el-input v-model="formData.repeatPass" />
      </el-form-item>
      <el-form-item label="所属机构" prop="department">
        <el-select v-model="formData.department" placeholder="请选择所属机构">
          <el-option label="总公司" value="department1" />
          <el-option label="分公司" value="department2" />
        </el-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" />
      </el-form-item>
      <el-form-item label="固定电话" prop="telephone">
        <el-input v-model="formData.telephone" />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobphone">
        <el-input v-model="formData.mobphone" />
      </el-form-item>
      <el-form-item label="入职时间" prop="startDate">
        <el-date-picker type="date" placeholder="选择日期" v-model="formData.startDate" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.remark" />
      </el-form-item>
      <el-form-item align="right">
        <el-button @click="cancel('ruleForm')">取消</el-button>
        <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    flag: { // 编辑/新增功能标识
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true
    }
  },
  data() {
    const validUsername = (rule, value, callback) => {
      const regUsername = /^[_a-zA-Z0-9]{4,15}$/

      !value ? callback(new Error('用户名不能为空')) : regUsername.test(value) ? callback() : callback(new Error('请输入含有字母、数字或下划线的4-16用户名'))
    }
    const validPassword = (rule, value, callback) => {
      const regPassword = /^[_a-zA-Z0-9]+$/

      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      this.formData.password !== '' ? this.$refs.ruleForm.validateField('repeatPass') : true
      regPassword.test(value) ? callback() : callback(new Error('请输入含有字母、数组或下划线的密码'))
    }
    const validRepeatPass = (rule, value, callback) => {
      !value ? callback(new Error('重复密码不能为空')) : value = this.formData.repeatPass ? callback() : callback(new Error('请保持重复密码与上一条密码一致'))
    }
    const validEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/

      !value ? callback(new Error('邮箱不能为空')) : regEmail.test(value) ? callback() : callback(new Error('请填写正确的邮箱'))
    }
    const validTelephone = (rule, value, callback) => {
      const regTelephone = /0\d{2,3}-\d{7,8}/

      !value ? callback(new Error('固定电话不能为空')) : regTelephone.test(value) ? callback() : callback(new Error('请填写例：0123-1234567类型的固定电话'))
    }
    const validMobphone = (rule, value, callback) => {
      const regMobphone = /^[1][3,4,5,7,8]\d{9}$/

      !value ? callback(new Error('手机不能为空')) : regMobphone.test(value) ? callback() : callback(new Error('请填写正确的手机'))
    }
    return {
      userinfoVisible: this.show,
      title: '用户信息',
      rule: {
        username: [
          { validator: validUsername, trigger: 'blur' }
        ],
        name: [
          { type: 'string', required: true, message: '请填写真实姓名', trigger: 'blur' }
        ],
        password: [
          { validator: validPassword, trigger: 'blur' }
        ],
        repeatPass: [
          { validator: validRepeatPass, trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请选择机构', trigger: 'change' }
        ],
        email: [
          { validator: validEmail, trigger: 'blur' }
        ],
        telephone: [
          { validator: validTelephone, trigger: 'blur' }
        ],
        mobphone: [
          { validator: validMobphone, trigger: 'blur' }
        ],
        startDate: [
          { type: 'date', required: true, message: '请选择入职时间', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    show() {
      this.userinfoVisible = this.show
    }
  },
  methods: {
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let newFormData = JSON.parse(JSON.stringify(this.formData))
          console.info(newFormData)
          // this.$emit('update:formData', newFormData)
          this.$emit('confirmAdd', newFormData)
          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.$emit('closeDialog')
      this.$refs[formName].resetFields()
    }
  }
}
</script>
