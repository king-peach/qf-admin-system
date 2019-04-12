<template>
  <el-dialog :visible.sync="taskinfoVisible" :show="show" center @close="cancel('ruleForm')" :title="flag ? '新建任务' : '编辑任务'">
    <el-form ref="ruleForm" :rules="rule" :model="formData" label-width="150px">
      <el-form-item label="任务名称" prop="taskName">
        <el-input v-model="formData.taskName" />
      </el-form-item>
      <el-form-item label="任务类别" prop="taskType">
        <el-input v-model="formData.taskType" />
      </el-form-item>
      <el-form-item label="起始时间" prop="startDate">
        <el-date-picker v-model="formData.startDate" type="date" placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="执行表达式(cron)" prop="setTime">
        <!-- <el-radio-group v-model="formData.radio">
          <el-radio :label="1" prop="setTime1">
            每隔&nbsp;&nbsp;&nbsp;&nbsp;
            <el-cascader expand-trigger="hover" v-model="formData.setTime1" :options="options" :disabled="formData.radio === 2" />
          </el-radio>
          <div style="height: 20px;" />
          <el-radio :label="2" prop="setTime2" style="display: block;">
            使用Cron表达式 <br /> -->
            <el-input v-model="formData.setTime" @change="handlerChange" style="margin-top: 10px;"/>
          <!-- </el-radio> -->
        <!-- </el-radio-group> -->
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="formData.status">
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="formData.remark" />
      </el-form-item>
      <el-form-item align="right">
        <el-button @click="cancel('ruleForm')">取消</el-button>
        <el-button type="primary" @click="confirm('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { cronValidate } from '@/utils/cronValid'
export default {
  name: 'TaskInfo',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    flag: { // 编辑/新增功能标识
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      required: true
    }
  },
  data() {
    var cronValidate = (rule, value, callback) => {
      !value ? callback(new Error('cron表达式内容不能为空')) : this.cronValid === true ? callback() : callback(new Error(this.cronValid))
    }
    return {
      options: [
        { // 执行周期选择数据
          value: 'Seconds',
          label: '秒',
          children: [
            { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
            { value: '5', label: '5' }, { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' },
            { value: '9', label: '9' }, { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' },
            { value: '13', label: '13' }, { value: '14', label: '14' }, { value: '15', label: '15' }, { value: '16', label: '16' },
            { value: '17', label: '17' }, { value: '18', label: '18' }, { value: '19', label: '19' }, { value: '20', label: '20' },
            { value: '21', label: '21' }, { value: '22', label: '22' }, { value: '23', label: '23' }, { value: '24', label: '24' },
            { value: '25', label: '25' }, { value: '26', label: '26' }, { value: '27', label: '27' }, { value: '28', label: '28' },
            { value: '29', label: '29' }, { value: '30', label: '30' }, { value: '31', label: '31' }, { value: '32', label: '32' },
            { value: '33', label: '33' }, { value: '34', label: '34' }, { value: '35', label: '35' }, { value: '36', label: '36' },
            { value: '37', label: '37' }, { value: '38', label: '38' }, { value: '39', label: '39' }, { value: '40', label: '40' },
            { value: '41', label: '41' }, { value: '42', label: '42' }, { value: '43', label: '43' }, { value: '44', label: '44' },
            { value: '45', label: '45' }, { value: '46', label: '46' }, { value: '47', label: '47' }, { value: '48', label: '48' },
            { value: '49', label: '49' }, { value: '50', label: '50' }, { value: '51', label: '51' }, { value: '52', label: '52' },
            { value: '53', label: '53' }, { value: '54', label: '54' }, { value: '55', label: '55' }, { value: '56', label: '56' },
            { value: '57', label: '57' }, { value: '58', label: '58' }, { value: '59', label: '59' }, { value: '60', label: '60' }
          ]
        },
        {
          value: 'Minutes',
          label: '分',
          children: [
            { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
            { value: '5', label: '5' }, { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' },
            { value: '9', label: '9' }, { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' },
            { value: '13', label: '13' }, { value: '14', label: '14' }, { value: '15', label: '15' }, { value: '16', label: '16' },
            { value: '17', label: '17' }, { value: '18', label: '18' }, { value: '19', label: '19' }, { value: '20', label: '20' },
            { value: '21', label: '21' }, { value: '22', label: '22' }, { value: '23', label: '23' }, { value: '24', label: '24' },
            { value: '25', label: '25' }, { value: '26', label: '26' }, { value: '27', label: '27' }, { value: '28', label: '28' },
            { value: '29', label: '29' }, { value: '30', label: '30' }, { value: '31', label: '31' }, { value: '32', label: '32' },
            { value: '33', label: '33' }, { value: '34', label: '34' }, { value: '35', label: '35' }, { value: '36', label: '36' },
            { value: '37', label: '37' }, { value: '38', label: '38' }, { value: '39', label: '39' }, { value: '40', label: '40' },
            { value: '41', label: '41' }, { value: '42', label: '42' }, { value: '43', label: '43' }, { value: '44', label: '44' },
            { value: '45', label: '45' }, { value: '46', label: '46' }, { value: '47', label: '47' }, { value: '48', label: '48' },
            { value: '49', label: '49' }, { value: '50', label: '50' }, { value: '51', label: '51' }, { value: '52', label: '52' },
            { value: '53', label: '53' }, { value: '54', label: '54' }, { value: '55', label: '55' }, { value: '56', label: '56' },
            { value: '57', label: '57' }, { value: '58', label: '58' }, { value: '59', label: '59' }, { value: '60', label: '60' }
          ]
        },
        {
          value: 'Hours',
          label: '时',
          children: [
            { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
            { value: '5', label: '5' }, { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' },
            { value: '9', label: '9' }, { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' },
            { value: '13', label: '13' }, { value: '14', label: '14' }, { value: '15', label: '15' }, { value: '16', label: '16' },
            { value: '17', label: '17' }, { value: '18', label: '18' }, { value: '19', label: '19' }, { value: '20', label: '20' },
            { value: '21', label: '21' }, { value: '22', label: '22' }, { value: '23', label: '23' }, { value: '24', label: '24' }
          ]
        },
        {
          value: 'Days',
          label: '天',
          children: [
            { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
            { value: '5', label: '5' }, { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' },
            { value: '9', label: '9' }, { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' },
            { value: '13', label: '13' }, { value: '14', label: '14' }, { value: '15', label: '15' }, { value: '16', label: '16' },
            { value: '17', label: '17' }, { value: '18', label: '18' }, { value: '19', label: '19' }, { value: '20', label: '20' },
            { value: '21', label: '21' }, { value: '22', label: '22' }, { value: '23', label: '23' }, { value: '24', label: '24' },
            { value: '25', label: '25' }, { value: '26', label: '26' }, { value: '27', label: '27' }, { value: '28', label: '28' },
            { value: '29', label: '29' }, { value: '30', label: '30' }, { value: '31', label: '31' }
          ]
        },
        {
          value: 'Months',
          label: '月',
          children: [
            { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' },
            { value: '5', label: '5' }, { value: '6', label: '6' }, { value: '7', label: '7' }, { value: '8', label: '8' },
            { value: '9', label: '9' }, { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' }
          ]
        }
      ],
      taskinfoVisible: this.show,
      cronValid: '',
      rule: {
        taskName: [
          { required: true, message: '请填写任务名', trigger: 'blur' }
        ],
        taskType: [
          { required: true, message: '请填写任务类型', trigger: 'blur' }
        ],
        startDate: [
          { type: 'date', required: true, meessage: '请选择起始时间', trigger: 'blur' }
        ],
        setTime: [
          { validator: cronValidate, trigger: 'blur' }
        ]
      }
    }
  },
  updated() { // 虚拟DOM渲染更新以后进行corn校验并赋值给cronValid
    this.cronValid = cronValidate(this.formData.setTime)
  },
  watch: {
    show() {
      this.taskinfoVisible = this.show
    }
  },
  methods: {
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const newFormData = JSON.parse(JSON.stringify(this.formData))
          // newFormData.radio === 1 ? newFormData.setTime2 = '' : newFormData.setTime1 = []
          this.$emit('confirmAdd', newFormData)
        } else {
          return false
        }
      })
      
    },
    cancel(formName) {
      this.$emit('closeDialog')
      this.$refs[formName].resetFields()
    },
    handlerChange(value) { // setTime字段变化时校验corn值，并赋给cornValid
      this.cronValid = cronValidate(value)
    }
  }
}
</script>
