<template>
  <el-dialog :visible.sync="infoVisible" title="日志详情" @close="close">
    <ul class="list">
      <li>
        <span class="title">操作名称:</span>
        <span class="detail">{{ info.title }}</span>
      </li>
      <li>
        <span class="title">登录信息:</span>
        <span class="detail">{{ info.operBy }} / {{ info.operLocation }} / {{ info.operIp }}</span>
      </li>
      <li>
        <span class="title">请求地址:</span>
        <span class="detail">{{ info.operUrl }}</span>
      </li>
      <li>
        <span class="title">操作方法:</span>
        <span class="detail">{{ info.method }}</span>
      </li>
      <li>
        <span class="title">请求参数:</span>
        <el-input type="textarea" class="detail" :value="info.operParam" disabled />
      </li>
      <li v-if="info.status === 0">
        <span class="title">错误信息:</span>
        <span class="detail" style="color: red">{{ info.errorMsg }}</span>
      </li>
    </ul>
    <div align="right" slot="footer" class="dialog-footer">
      <el-button @click="close" type="primary">关闭</el-button>
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
    info: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      infoVisible: false
    }
  },
  watch: {
    show() {
      this.infoVisible = this.show
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  list-style: none;
  li {
    margin: 30px 0;
    white-space: nowrap;
    &:first-child {
      margin-top: 10px;
    }
    .title {
      font-size: 16px;
      margin-right: 20px;
    }
    .detail {
      display: inline-block;
      vertical-align: top;
      max-width: 80%;
      overflow: hidden;
      white-space: normal;
    }
  }
}
</style>
