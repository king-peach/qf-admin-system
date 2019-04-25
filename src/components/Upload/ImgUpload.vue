<template>
  <div class="container">
    <div class="upload-img-box">
      <input ref="createFile" type="file" class="hide-file-input" @change="uploadFile">
      <el-button type="primary">上传文件</el-button>
    </div>

    <!-- 提示文案 -->
    <slot name="tips" />

    <!-- 上传图片展示区 -->
    <div ref="showImg" class="showImg">
      <div v-for="item of imgList" :key="item.src" class="img-box">
        <img :src="item.src" alt="">
        <span class="img-name">{{ item.imgName }}</span>
        <label v-if="item.status === 'success'" class="upload-status upload-success">
          <i class="el-icon-check" />
        </label>
        <label v-if="item.status === 'fail'" class="upload-status upload-fail">
          <i class="el-icon-close" />
        </label>
        <i class="icon-delete el-icon-close" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ImgUpload',
  props: {
    uploadUrl: {
      type: String,
      default: () => 'http://192.168.1.164:8088/group1/upload'
    }
  },
  data() {
    return {
      imgList: []
    }
  },
  methods: {
    uploadFile() {
      const imgObj = {}
      imgObj.src = window.URL.createObjectURL(this.$refs.createFile.files[0])
      imgObj.imgName = this.$refs.createFile.files[0].name
      imgObj.status = 'loading'
      this.imgList.push(imgObj)
      const index = this.imgList.length - 1
      const param = new FormData()
      param.append('file', this.$refs.createFile.files[0])
      param.append('output', 'json')
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      axios.post(this.uploadUrl, param, config)
        .then(response => {
          if (response.status === 200) {
            this.imgList[index].status = 'success'
          } else {
            this.$message.error('上传失败，请重新上传！')
            this.imgList[index].status = 'fail'
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .upload-img-box {
    position: relative;
    .hide-file-input {
      width: 6.5em;
      height: 2.5em;
      position: absolute;
      top: 0;
      opacity: 0;
      z-index: 999;
    }
  }
  .img-box {
    border-radius: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    color: #666;
    margin: 10px auto;
    overflow: hidden;
    position: relative;
    .upload-status {
      position: absolute;
      position: absolute;
      right: -17px;
      top: -7px;
      width: 50px;
      height: 30px;
      text-align: center;
      transform: rotate(45deg);
      box-shadow: 0 1px 1px #ccc;
      i {
        font-size: 14px;
        margin-top: 14px;
        transform: rotate(-45deg);
      }
    }
    .upload-success {
      background: #13ce66;
    }
    .upload-fail {
      background: #ff5e5e;
    }
    .icon-delete {
      display: none;
    }
    &:hover {
      .upload-status {
        display: none;
      }
      .icon-delete {
        display: block;
        position: absolute;
        right: 8px;
        top: 8px;
        font-size: 14px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    img {
      display: inline-block;
      width: 100px;
      height: 100px;
      vertical-align: middle;
    }
    .img-name {
      vertical-align: text-top;
      margin-left: 5px;
    }
  }
}
</style>
