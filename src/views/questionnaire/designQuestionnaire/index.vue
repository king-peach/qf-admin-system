<template>
  <!-- 两列自适应布局 -->
  <two-column-layout :leftColumnTitle="leftColumnTitle">
    <template v-slot:left-content>
      <h4 @click="selectedShowBox = !selectedShowBox">
        <i :class="selectedShowBox ? 'icon-down' : 'icon-left'" />
        选择题
      </h4>
      <div class="selectedShowBox showBox" :style="selectedShowBox ? 'display: block;' : 'display: none;'">
        <div>单选</div>
        <div>多选</div>
        <div>下拉框</div>
      </div>
      <h4 @click="fillShowBox = !fillShowBox">
        <i :class="fillShowBox ? 'icon-down' : 'icon-left'" />
        填空题
      </h4>
      <div class="fillShowBox showBox" :style="fillShowBox ? 'display: block;' : 'display: none;'">
        <div>单项填空</div>
        <div>矩阵填空</div>
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
              <question-selector :key="index" :data="item" :type="item.type" @done="itemEditDone">
                <template v-slot:sortWrapper>
                  <el-button size="mini" icon="el-icon-edit" @click="edit">编辑</el-button>
                  <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="del">删除</el-button>
                  <el-button size="mini" icon="el-icon-arrow-up">上移</el-button>
                  <el-button size="mini" icon="el-icon-arrow-down">下移</el-button>
                  <el-button size="mini" icon="el-icon-sort-up">最前</el-button>
                  <el-button size="mini" icon="el-icon-sort-down">最后</el-button>
                </template>
              </question-selector>
            </template>
            <template v-else-if="['singleInput', 'multipleInput'].includes(item.type)">
              <question-input :key="index" :data="item" :type="item.type">
                <template v-slot:sortWrapper>
                  <el-button size="mini" icon="el-icon-edit">编辑</el-button>
                  <el-button type="danger" size="mini" plain icon="el-icon-delete">删除</el-button>
                  <el-button size="mini" icon="el-icon-arrow-up">上移</el-button>
                  <el-button size="mini" icon="el-icon-arrow-down">下移</el-button>
                  <el-button size="mini" icon="el-icon-sort-up">最前</el-button>
                  <el-button size="mini" icon="el-icon-sort-down">最后</el-button>
                </template>
              </question-input>
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
      </div>
    </template>
  </two-column-layout>
</template>

<script>
import TwoColumnLayout from '@/components/TwoColumnLayout'
import VueQuillEditor from '@/components/VueQuillEditor'
import QuestionSelector from '@/components/Questionaire/Selector'
import QuestionInput from '@/components/Questionaire/Input'
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
            { questionTitle: '选项3', placeholder: '选项3', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false },
            { questionTitle: '选项4', placeholder: '选项4', questionImg: { src: false, width: 'auto', height: 'auto' }, questionTip: { html: null, text: null }, questionChecked: false }
          ]
        },
        {
          type: 'singleInput',
          index: 1,
          itemTitle: '',
          required: true,
          titleTip: '',
          minLimit: '',
          maxLimit: '',
          singleTextarea: '',
          currentWidth: null,
          currentHeight: null
        }
      ]
    }
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
      if (data.index < this.questionaireData.length) {
        this.questionaireData[data.index] = data
      } else {
        this.questionaireData.push(data)
      }
    },
    /**
     * @method 编辑当前问题选项
     */
    edit() {},
    /**
     * @method 删除当前选项
     */
    del() {}
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
}
</style>
