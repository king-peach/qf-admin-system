<template>
  <el-dialog :visible.sync="infoVisible" :title="flag ? '新增部门' : '编辑部门'"  center @close="cancel('departForm')">
    <el-form :model="formData" label-suffix=":" :rules="rule" ref="departForm" label-width="100px">
      <el-form-item label="上级部门" prop="parent">
        <el-popover
          placement="bottom"
          v-model="parentVisible"
          title="部门列表"
          visible-arrow
          width="400">
          <el-tree :data="treeData" :props="defaultProps" accordion @node-click="handleNodeClick"/>
          <div align="right" style="margin-top: 1em">
            <el-button size="mini" @click="parentVisible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="selected">确定</el-button>
          </div>
          <el-input v-model="formData.parentName" slot="reference" class="parent-department"/>
        </el-popover>
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" />
      </el-form-item>
      <el-form-item label="部门主管" prop="leader">
        <el-input v-model="formData.leader" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <template>
          <el-switch
            v-model="formData.status"
            active-color="#13ce66"
            active-value=1
            inactive-value=0
          >
          </el-switch>
        </template>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="formData.phone" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="formData.remark" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="cancel('departForm')">取消</el-button>
      <el-button type="primary" @click="confirm('departForm')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    flag: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      required: true
    },
    treeData: {
      type: Array,
      required: true
    }
  },
  data() {
    const phoneValid = (rule, value, callback) => {
      if (value !== '') {
        const telReg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
        telReg.test(value) ? true : callback(new Error('请输入正确的手机号或固定电话'))
      }
      callback()
    }
    return {
      infoVisible: this.show, // 对话框开关
      parentVisible: false, // 选择parent值弹出框开关
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      parentDepart: '', // 存放选取上级部门值
      rule: {
        parent: [
          { required: true, message: '请选择上级部门', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        leader: [
          { required: true, message: '请输入部门主管', trigger: 'blur' }
        ],
        phone: [
          { validator: phoneValid, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    show() {
      this.infoVisible = this.show
    }
  },
  methods: {
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const newFormData = { ... this.formData }
          this.$emit('confirmAdd', newFormData)
          this.$refs[formName].resetFields()
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.$emit('cancelAdd')
      this.$refs[formName].resetFields()
    },
    handleNodeClick(data) { // parent树节点被选择时回调函数
      this.parentDepart = data.name
    },
    selected() { // 确定选中上级部门
      this.formData.parent = this.parentDepart
      this.parentVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.parent-department {
  input {
    background-color: #999;
  }
}
</style>
