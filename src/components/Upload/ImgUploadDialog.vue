<template>
  <!-- 图片上传弹出框 -->
  <el-dialog
    title="上传图片"
    :visible.sync="imgUploadVisible"
    :show="show"
    @close="cancel"
  >
    <div>
      <el-input :value="avator ? avator : ''" placeholder="可直接粘贴图片地址" class="img-src" @change="imgSrcChange">
        <i
          v-show="avator"
          slot="suffix"
          class="el-icon-delete el-input__icon"
          @click="avator = ''"
        />
      </el-input>
      <el-button type="primary" size="mini">确定</el-button>
    </div>
    <div v-show="avator" class="scale-wrapper">
      缩放为原图的<el-input v-model="scale" size="mini" @change="scaleImgSize" />%
    </div>
    <div class="upload-container">
      <div v-if="avator" class="img-wrapper">
        <img ref="uploadImg" :src="avator" alt="上传图片" :style="`width:${uploadImgWidth};height:${uploadImgHeight};`">
        <input ref="avatorInput" type="file" class="input-file" accept="image/gif, image/jpg, image/jpeg, image/png" @change="uploadImgChange($event)">
      </div>
      <div v-else class="upload-wrapper">
        <i class="upload-img-icon el-icon-plus" />
        <p>点击上传图片</p>
        <div class="upload-img-tip">不超过4M</div>
        <input ref="avatorInput" type="file" class="input-file" :style="`width:70px;height:70px;`" name="avator" accept="image/gif, image/jpg, image/jpeg, image/png" @change="uploadImgChange($event)">
      </div>
    </div>
    <div class="upload-status-tip">{{ uploadStatusTip }}</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  naem: 'ImgUploadDialog',
  props: {
    show: {
      required: true,
      type: Boolean
    },
    index: {
      type: Number,
      default: null
    },
    imgData: {
      type: Object,
      default: () => {
        return {
          src: false,
          width: 'auto',
          height: 'auto'
        }
      }
    }
  },
  data() {
    return {
      imgUploadVisible: this.show,
      scale: '',
      uploadImgWidth: this.imgData.width,
      uploadImgHeight: this.imgData.height,
      imgOriginWidth: '',
      imgOriginHeight: '',
      imgFile: '',
      avator: this.imgData.src,
      uploadStatusTip: ''
    }
  },
  watch: {
    show() {
      this.imgUploadVisible = this.show
    },
    uploadStatusTip() {
      return this.avator ? '上传成功, 点击图片可以重新上传' : ''
    },
    imgData() {
      this.avator = this.imgData.src
      this.uploadImgWidth = this.imgData.width
      this.uploadImgHeight = this.imgData.height
    }
  },
  methods: {
    /**
     * @method 上传图片更改事件
     * @param {Object} e 当前DOM对象
     */
    uploadImgChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.avator = window.URL.createObjectURL(file)
        this.imgFile = file
        this.uploadImgWidth = 'auto'
        this.uploadImgHeight = 'auto'
        this.uploadStatusTip = '上传成功, 点击图片可以重新上传'
        this.scale = 100
      } else {
        this.$notify({
          type: 'error',
          message: `本地上传图片失败, 请重新上传`
        })
      }
    },
    /**
     * @method 点击确认
     */
    confirm() {
      if (this.avator) {
        const index = this.index
        const img = {}
        img.src = this.avator
        img.width = this.uploadImgWidth
        img.height = this.uploadImgHeight
        this.$emit('comfirmSubmit', img, index)
        this.avator = false
      } else {
        this.$notify({
          type: 'warning',
          message: '图片格式错误, 请重新上传图片'
        })
      }
    },
    /**
     * @method 点击取消或者取消icon
     */
    cancel() {
      this.$emit('cancelSubmit')
    },
    /**
     * @method 图片缩放比例变化
     */
    scaleImgSize(val) {
      const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/

      if (!reg.test(val) || Number(val) > 200) {
        this.$notify({
          type: 'error',
          title: '输入错误',
          message: '缩放比例输入格式错误, 请重新输入'
        })
        this.scale = ''
        return false
      }

      if (this.uploadImgWidth === 'auto') {
        this.imgOriginWidth = this.$refs.uploadImg.width
        this.imgOriginHeight = this.$refs.uploadImg.height
      }

      if (val) {
        this.uploadImgWidth = this.imgOriginWidth * val / 100 + 'px'
        this.uploadImgHeight = this.imgOriginHeight * val / 100 + 'px'
      } else {
        this.uploadImgWidth = this.uploadImgHeight = 'auto'
      }
    },
    /**
     * @method 上传线上图片
     */
    imgSrcChange(val) {
      const img = new Image()
      img.src = val
      const that = this

      img.onload = function() {
        if (img.fileSize > 0 || img.width > 0 || img.height > 0) {
          that.avator = val
          that.uploadImgWidth = 'auto'
          that.uploadImgHeight = 'auto'
        } else {
          that.avator = ''
          that.$notify({
            type: 'warning',
            message: '获取线上图片失败, 请重新上传'
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__footer {
    text-align: center;
  }
  .img-src {
    width: 60%;
    margin-right: 20px;
  }
  .scale-wrapper {
    color: #000;
    margin-top: 10px;
    .el-input {
      width: 55px;
      margin: 0 5px;
    }
  }
  .upload-container {
    overflow: hidden;
    width: 100%;
    margin-top: 15px;
    text-align: center;
    height: 284px;
    border-radius: 4px;
    border: solid 1px #d7d8d9;
    background-color: #f7f8f9;
    overflow-x: auto;
    overflow-y: auto;
    .upload-wrapper {
      margin-top: 85px;
      position: relative;
      .upload-img-icon {
        font-size: 70px;
      }
      p {
        font-size: 16px;
      }
      .upload-img-tip {
        font-size: 12px;
      }
      .input-file {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        transform: translateX(-50%);
        top: 0;
      }
    }
    .img-wrapper {
      display: inline-block;
      position: relative;
      .input-file {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
  .upload-status-tip {
    color: red;
    text-align: center;
  }
</style>
