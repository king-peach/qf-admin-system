<template>
  <!-- 两列自适应布局 -->
  <two-column-layout :leftColumnTitle="leftColumnTitle">
    <template v-slot:left-content>
      <h4 @click="selectedShowBox = !selectedShowBox">
        <i :class="selectedShowBox ? 'icon-down' : 'icon-left'" />
        选择题
      </h4>
      <div class="selectedShowBox showBox" :style="selectedShowBox ? 'display: block;' : 'display: none;'">
        <div @click="addOption('radio')">单选</div>
        <div @click="addOption('checkBox')">多选</div>
        <div @click="addOption('select')">下拉框</div>
      </div>
      <h4 @click="fillShowBox = !fillShowBox">
        <i :class="fillShowBox ? 'icon-down' : 'icon-left'" />
        填空题
      </h4>
      <div class="fillShowBox showBox" :style="fillShowBox ? 'display: block;' : 'display: none;'">
        <div @click="addOption('singleInput')">单项填空</div>
        <div @click="addOption('arrayInput')">矩阵填空</div>
      </div>
    </template>
    <template v-slot:right-content>
      <div id="questionaire-conntainer">
        <div class="title-box" @click="titleVisible = true">
          <h3>{{ title }}</h3>
          <div class="questionaire-explain" v-html="questionaireDescription.html" />
        </div>

        <div class="question-box">
          <template v-for="(item, index) in questionaireData">
            <template v-if="['radio', 'select', 'checkBox'].includes(item.type)">
              <question-selector
                :key="index"
                :data="item"
                :editVisible="item.editVisible"
                :type="item.type"
                @done="itemEditDone"
                @del="del(index)"
                @up="up(index)"
                @down="down(index)"
                @top="top(index)"
                @bottom="bottom(index)"
              />
            </template>
            <template v-else-if="['singleInput', 'arrayInput'].includes(item.type)">
              <question-input
                :key="index"
                :data="item"
                :type="item.type"
                @done="itemEditDone"
                @del="del(index)"
                @up="up(index)"
                @down="down(index)"
                @top="top(index)"
                @bottom="bottom(index)"
              />
            </template>
          </template>
        </div>

        <!-- 标题弹出框 -->
        <el-dialog
          :visible.sync="titleVisible"
          width="50%"
          center
          @close="titleVisible = false"
        >
          <tr class="m-tr">
            <td class="m-td-label">标题: </td>
            <td>
              <input v-model="title" type="text" class="title-input" @change="titleChange">
            </td>
          </tr>
          <tr class="gap" />
          <tr class="m-tr">
            <td class="m-td-label">说明: </td>
            <td>
              <vue-quill-editor
                :defaultContent="questionaireDescription.html"
                @handleEditorChange="titleEditorChange"
              />
            </td>
          </tr>
          <span slot="footer" class="dialog-footer">
            <el-button @click="titleVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleTitleEditorDialogConfirm">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 预览、完成编辑 -->
        <div class="done-wrapper">
          <div class="preview">
            <svg-icon icon-class="preview" />
            预览
          </div>
          <div class="finish">
            <svg-icon icon-class="finish" />
            完成编辑
          </div>
        </div>
      </div>
    </template>
  </two-column-layout>
</template>

<script>
import TwoColumnLayout from '@/components/TwoColumnLayout'
import VueQuillEditor from '@/components/VueQuillEditor'
import QuestionSelector from '@/components/Questionaire/Selector'
import QuestionInput from '@/components/Questionaire/Input'
import { zIndexUp, zIndexBottom, zIndexTop, zIndexDown } from '@/utils/arrMove'
import { deepClone } from '@/utils/deepClone'
export default {
  name: 'editQuestionaire',
  components: {
    TwoColumnLayout,
    VueQuillEditor,
    QuestionSelector,
    QuestionInput
  },
  data() {
    return {
      leftColumnTitle: '题目选项',
      selectedShowBox: true,
      fillShowBox: true,
      title: '问卷标题',
      questionaireDescription: {
        html: '请填写问卷说明',
        text: '请填写问卷说明'
      },
      titleVisible: false,
      questionaireDescriptionChangeVal: null,
      questionaireData: [
        {
          type: 'radio',
          index: 0,
          itemTitle: '',
          required: true,
          titleTip: '',
          currentRows: 4,
          tableOptions: [
            { questionTitle: '选项1', placeholder: '选项1', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false },
            { questionTitle: '选项2', placeholder: '选项2', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false },
            { questionTitle: '选项3', placeholder: '选项3', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false }
          ]
        },
        {
          type: 'radio',
          index: 1,
          itemTitle: '',
          required: true,
          titleTip: '',
          currentRows: 4,
          tableOptions: [
            { questionTitle: '选项1', placeholder: '选项1', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false },
            { questionTitle: '选项2', placeholder: '选项2', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false },
            { questionTitle: '选项3', placeholder: '选项3', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false }
          ]
        },
        {
          type: 'singleInput',
          editVisible: false,
          index: 2,
          itemTitle: '',
          required: true,
          titleTip: '',
          minLimit: '',
          maxLimit: '',
          singleTextarea: '',
          currentWidth: null,
          currentHeight: null
        },
        {
          type: 'arrayInput',
          editVisible: false,
          index: 3,
          itemTitle: '',
          required: true,
          titleTip: '',
          arrayInputData: [
            { rowTitle: '填空1', minLimit: '', maxLimit: '', value: '', required: true, defaultVal: '', limitTip: '' },
            { rowTitle: '填空2', minLimit: '', maxLimit: '', value: '', required: true, defaultVal: '', limitTip: '' }
          ]
        }
      ]
    }
  },
  /**
   * @method 給问卷列表元素添加编辑状态
   */
  created() {
    this.questionaireData.forEach(item => {
      if (!item.editVisible) {
        item.editVisible = false
      }
    })
  },
  methods: {
    /**
     * @method 标题内容改变
     */
    titleChange() {
      this.title = !this.title ? '问卷标题' : this.title
    },
    /**
     * @method 将弹出框中富文本内容暂存在变量中
     * @param {String} e 富文本当前内容
     */
    titleEditorChange(e) {
      this.questionaireDescriptionChangeVal = e
    },
    /**
     * @method 关闭弹出框給问卷标题说明赋值
     */
    handleTitleEditorDialogConfirm() {
      this.questionaireDescription = { ...this.questionaireDescriptionChangeVal }
      const e = this.questionaireDescription
      if (e.html !== '' && Object.keys(e).length > 0) {
        let text = e.html.replace(/<\/p>/g, '<br>')
        text = text.replace(/\s{2}/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
        this.questionaireDescription.html = text.replace(/<p\>/g, '')
      } else {
        this.questionaireDescription.html = '请填写问卷说明'
      }
      this.titleVisible = false
    },
    /**
     * @method 完成选项编辑,更新当前问卷数据
     */
    itemEditDone(data) {
      data.editVisible = false
      if (data.index < this.questionaireData.length) {
        this.questionaireData[data.index] = data
      } else {
        this.questionaireData.push(data)
      }
    },
    /**
     * @method 编辑当前问题选项
     */
    edit(index) {
      this.questionaireData[index].editVisible = true
    },
    /**
     * @method 删除当前选项
     * @param {String} index 当前选中项索引
     */
    del(index) {
      if (this.questionaireData.length < 2) {
        this.$notify({
          type: 'error',
          message: '该问卷最少保留一项'
        })
        return false
      }

      this.questionaireData.splice(index, 1)
      if (index < this.questionaireData.length) {
        this.questionaireData[index].index = index
      }
    },
    /**
     * @method 上移
     * @param {String} index 当前选中项索引
     */
    up(index) {
      const flag = zIndexUp(this.questionaireData, index)
      if (flag === undefined) {
        this.questionaireData[index].index = index
        this.questionaireData[index - 1].index = index - 1
      } else {
        this.$notify({
          type: 'warning',
          message: '已经是第一个了, 不能进行上移操作'
        })
      }
    },
    /**
     * @method 下移
     * @param {String} index 当前选中项索引
     */
    down(index) {
      const flag = zIndexDown(this.questionaireData, index)
      if (flag === undefined) {
        this.questionaireData[index].index = index
        this.questionaireData[index + 1].index = index + 1
      } else {
        this.$notify({
          type: 'warning',
          message: '已经是最后一个了, 不能进行下移操作'
        })
      }
    },
    /**
     * @method 移至最前
     * @param {String} index 当前选中项索引
     */
    top(index) {
      const flag = zIndexTop(this.questionaireData, index)
      if (flag === undefined) {
        this.questionaireData[0].index = 0
        this.questionaireData[index].index = index
      } else {
        this.$notify({
          type: 'warning',
          message: '已经是第一个了, 不能进行置顶操作'
        })
      }
      // 视图不更新, 置空后重新赋值
      const temp = deepClone(this.questionaireData)
      this.questionaireData = []
      this.questionaireData = temp
    },
    /**
     * @method 移至最后
     * @param {String} index 当前选中项索引
     */
    bottom(index) {
      const flag = zIndexBottom(this.questionaireData, index)
      if (flag === undefined) {
        this.questionaireData[index].index = index
        this.questionaireData[this.questionaireData.length - 1].index = this.questionaireData.length - 1
      } else {
        this.$notify({
          type: 'warning',
          message: '已经是最后一个了, 不能进行置底操作'
        })
      }
      // 与上一致, 解决视图不更新问题
      const temp = deepClone(this.questionaireData)
      this.questionaireData = []
      this.questionaireData = temp
    },
    /**
     * @method 点击添加问题
     * @param {String} index 问题类型参数
     */
    addOption(type) {
      const data = {}
      data.type = type
      data.required = true
      data.itemTitle = ''
      data.editVisible = false
      data.titleTip = ''
      data.index = this.questionaireData.length

      if (['radio', 'checkBox', 'select'].indexOf(type) > -1) {
        data.currentRows = 4
        data.tableOptions = [
          { questionTitle: '选项1', placeholder: '选项1', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false },
          { questionTitle: '选项2', placeholder: '选项2', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false },
          { questionTitle: '选项3', placeholder: '选项3', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false }
        ]
      } else if (type === 'singleInput') {
        data.minLimit = ''
        data.maxLimit = ''
        data.singleTextarea = ''
        data.currentWidth = null
        data.currentHeight = null
      } else if (type === 'arrayInput') {
        data.arrayInputData = [
          { rowTitle: '填空1', minLimit: '', maxLimit: '', value: '', required: true, defaultVal: '', limitTip: '' },
          { rowTitle: '填空2', minLimit: '', maxLimit: '', value: '', required: true, defaultVal: '', limitTip: '' }
        ]
      }

      this.questionaireData.push(data)
    }
  }
}
</script>

<style lang="scss" scoped>
h4 {
  color: #333;
  margin: 15px 0;
  &:first-child() {
    margin-top: 0;
  }
}

.m-td-label {
  white-space: nowrap;
  padding-right: 20px;
  vertical-align: middle;
  font-weight: bold;
}

.icon-down {
  display: inline-block;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-top-color: #333;
  margin-right: 5px;
}

.icon-left {
  display: inline-block;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-left-color: #333;
  top: 10px;
  margin-right: 5px;
}

.showBox {
  div {
    height: 28px;
    line-height: 28px;
    color: #666;
    text-indent: 5px;
    cursor: pointer;
    font-size: 14px;
    &:hover {
      color: #409EFF;
      font-size: 16px;
      font-weight: 500;
    }
  }
}

#questionaire-conntainer {
  height: calc(100vh - 160px);
  width: 90%;
  margin: 5px auto;
  overflow: hidden;
  overflow-y: scroll;
  box-shadow: 0px 2px 5px 0px #D9D9D9;
  border-radius: 2px;
  border: 1px solid rgba(217,217,217,1);
  .title-box {
    padding: 10px 0;
    cursor: pointer;
    border-bottom: 1px solid #E0E0E0;
    &:hover {
      background: rgb(250, 250, 250);
    }
    h3 {
      text-align: center;
      letter-spacing: 2px;
      font-size: 24px;
      font-weight: bold;
      word-break: break-all;
      padding: 0 50px;
    }
    .questionaire-explain {
      margin-top: 20px;
      padding: 0 30px;
      color: #555;
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
    }
  }
  .gap {
    height: 20px;
  }
  .title-input {
    width: 75%;
    min-height: 40px;
    text-indent: 2%;
  }
  .done-wrapper {
    position: fixed;
    right: 0px;
    top: 50px;
    height: 52px;
    text-align: center;
    cursor: pointer;
    .preview {
      display: inline-block;
      text-align: center;
      height: 100%;
      line-height: 52px;
      padding: 0 20px;
      color: #409EFF;
      border-left: 1px solid #eaeaea;
      &:hover {
        opacity: .8;
      }
      .svg-icon {
        font-size: 20px;
        fill: #409EFF;
        vertical-align: middle;
      }
    }
    .finish {
      display: inline-block;
      text-align: center;
      background: #409EFF;
      height: 100%;
      line-height: 52px;
      padding: 0 10px;
      color: #fff;
      &:hover {
        opacity: .8;
      }
      .svg-icon {
        font-size: 20px;
        vertical-align: middle;
      }
    }
  }
}
</style>
