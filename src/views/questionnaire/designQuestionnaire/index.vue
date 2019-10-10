<template>
  <!-- 两列自适应布局 -->
  <two-column-layout :leftColumnTitle="leftColumnTitle">
    <template v-slot:left-content>
      <h4 @click="handleSelectedShowBox">
        <i :class="selectedShowBox ? 'icon-down' : 'icon-left'" />
        选择题
      </h4>
      <div class="selectedShowBox showBox" :style="selectedShowBox ? 'display: block;' : 'display: none;'">
        <div>单选</div>
        <div>多选</div>
        <div>下拉框</div>
      </div>
      <h4 @click="handleFillShowBox">
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
        <div class="title-box" @click="handleSwitchTitleEditDialog">
          <h3>{{ title }}</h3>
          <div class="questionaire-explain" v-html="questionaireDescription.html" />
        </div>

        <div class="question-box">
          <question-selector>
            <template v-slot:sortWrapper>排序功能选项框</template>
          </question-selector>
          <question-input>
            <template v-slot:sortWrapper>排序功能选项框</template>
          </question-input>
        </div>

        <!-- 标题弹出框 -->
        <el-dialog
          :visible.sync="titleVisible"
          width="50%"
          :before-close="handleTitleEditorDialogClose"
          center
        >
          <tr class="m-tr">
            <td class="m-td-label">标题: </td>
            <td>
              <input v-model="title" type="text" class="title-input">
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
      questionaireDescriptionChangeVal: null
    }
  },
  methods: {
    handleSelectedShowBox(e) {
      this.selectedShowBox ? this.selectedShowBox = false : this.selectedShowBox = true
    },
    handleFillShowBox(e) {
      this.fillShowBox ? this.fillShowBox = false : this.fillShowBox = true
    },
    titleEditorChange(e) {
      this.questionaireDescriptionChangeVal = e
    },
    handleTitleEditorDialogClose() {
      this.titleVisible = false
    },
    handleSwitchTitleEditDialog() {
      this.titleVisible = true
    },
    handleTitleEditorDialogConfirm() {
      this.questionaireDescription = { ...this.questionaireDescriptionChangeVal }
      this.titleVisible = false
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
}
</style>
