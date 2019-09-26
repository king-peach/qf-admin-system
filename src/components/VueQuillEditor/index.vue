<template>
  <quill-editor
    :id="editorId"
    ref="myQuillEditor"
    v-model="content"
    :options="editorOptions"
    @focus="onEditorFocus($event)"
    @blur="onEditorBlur($event)"
    @change="onEditorChange($event)"
  />
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
import * as Quill from 'quill'

//  自定义字体
const fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif']
const Font = Quill.import('formats/font')
Font.whitelist = fonts
Quill.register(Font, true)

// 图片可拖拽上传
import { ImageDrop } from 'quill-image-drop-module'
Quill.register('modules/imageDrop', ImageDrop)

// 图片可改变大小
// import ImageResize from 'quill-image-resize-module'
// Quill.register('modules/imageResize', ImageResize)

// 自定义字体大小
const sizes = ['12px', false, '16px', '18px', '20px', '24px']
const Size = Quill.import('attributors/style/size')
Size.whitelist = sizes
Quill.register(Size, true)

export default {
  name: 'VueQuillEditor',
  components: {
    quillEditor
  },
  props: {
    defaultContent: {
      type: String,
      default: ``
    },
    editorId: {
      type: String,
      default: ``
    }
  },
  data() {
    return {
      editor: null,
      content: this.defaultContent,
      editorOptions: {
        modules: {
          imageDrop: true,
          // imageResize: {},
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗、斜体、下划线、删除线
            ['blockquote'], // 引用、代码块
            [{ 'header': 1 }, { 'header': 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ 'list': 'ordered' }, { 'list': 'bullet' }], // 列表
            [{ 'script': 'sub' }, { 'script': 'super' }], // 上下标
            [{ 'indent': '-1' }, { 'indent': '+1' }], // 缩进
            [{ 'direction': 'rtl' }], // 文本方向
            [{ 'size': sizes }], // 字体大小
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // 几级标题
            [{ 'color': [] }, { 'background': [] }], // 字体颜色，字体背景颜色
            [{ 'font': fonts }], // 字体
            [{ 'align': [] }], // 对齐方式
            ['clean'], // 清除字体样式
            ['link', 'image', 'formula'] // 上传图片、上传视频
          ]
        },
        theme: 'snow',
        placeholder: '请输入文本'
      }
    }
  },
  mounted() {
    console.log(this.defaultContent)
    this.editor = this.$refs.myQuillEditor.quill
  },
  beforeDestroy() {
    this.editor = null
    delete this.editor
  },
  methods: {
    onEditorReady(editor) {
      this.$emit('handleEditorReady', editor)
    },
    onEditorFocus(editor) {
      this.$emit('handleEditorFocus', editor)
    },
    onEditorBlur(editor) {
      this.$emit('handleEditorBlur', editor)
    },
    onEditorChange(editor) {
      this.$emit('handleEditorChange', editor)
    }
  }
}
</script>

<style lang="scss">
  #selectorEditor {
    .ql-container {
      .ql-editor {
        min-height: 50px;
      }
    }
  }
</style>
