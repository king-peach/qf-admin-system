<template>
  <div class="main">
    <el-row>
      <template v-for="(item, key) in data">
        <el-col :span="24" :key="key">
          <div class="grid-content bg-purple">
            {{ key }}
            <el-button type="text" class="btn-dialog" @click="open(item)">查看</el-button>
            <!-- Form -->
            <div v-if="dialogFormVisible">
              <!-- elementUI固定格式，必须使用:visible.sync，外层添加v-if属性是必须的 -->
              <el-dialog :visible.sync="dialogFormVisible" :title="configTitle" :center="true" :before-close="handleClose" top="3vh" append-to-body>
                <!-- 对当前item进行数据解析 -->
                <el-form>
                  <el-form-item v-for="(value, key) of todo" :key="key" :label= "key" :label-width="formLabelWidth">
                    <el-input :value="value" autocomplete="off" />
                  </el-form-item>
                  <el-form-item size="large" class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button type="primary" @click="onSubmit">保 存</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
            </div>
          </div>
        </el-col>
      </template>
    </el-row>
  </div>
</template>

<script>
import { getConfigMsg } from '@/api/configItem'
export default {
  data() {
    return {
      configTitle: '基础平台',
      dialogFormVisible: false,
      data: [],
      todo: [],
      formLabelWidth: '120px'
    }
  },
  created() { // 先请求数据，获取列表信息，渲染行数
    getConfigMsg().then(response => {
      // 利用map将后台返回字段名映射到中文字段名
      const data = response.data.map(function(item) {
        return {
          创建用户: item.createBy,
          创建时间: item.createTime,
          备注: item.remark,
          更新用户: item.updateBy,
          更新时间: item.updateTime,
          配置关键字段: item.configKey,
          配置项: item.configName,
          配置类型: item.configType,
          配置值: item.configValue,
          模版ID: item.moduleId
        }
      })
      for (const i in data) {
        this.data.push(data[i])
      }
    })
  },
  watch: {
    form: function(val, oldVal) {
      console.log(val, oldVal)
    }
  },
  methods: {
    open(item) { // 打开弹框处理函数
      this.dialogFormVisible = true
      this.todo = item
    },
    // confirm(todo) { // 确认保存处理函数
    //   const configName = todo.configName
    //   const configKey = todo.configKey
    //   const configValue = todo.configValue
    //   const remark = todo.remark
    //   saveConfigMsg(configName, configKey, configValue, remark).then(response => {
    //     if (response.status === 1) {
    //       Message({
    //         message: '保存成功',
    //         type: 'success'
    //       })
    //     } else {
    //       Message({
    //         message: '出错了，请联系管理员',
    //         type: 'error'
    //       })
    //     }
    //   }).catch(error => {
    //     console.info(error)
    //   })
    //   this.dialogFormVisible = false
    // },
    onSubmit(value) {
      this.dialogFormVisible = false
    },
    handleClose(done) { // 取消保存处理函数，参数见element-ui
      this.dialogFormVisible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
 .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    &.el-col {
    border-radius: 4px;
    }
  }
  .bg-purple {
    background: #eaedf1;
    margin-top: 20px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding: 20px 20px;
    position: relative;
      .btn-dialog {
      position: absolute;
      right: 20px;
      top:10px;
    }
  }
  .dialog-footer {
    text-align: right;
  }
</style>
