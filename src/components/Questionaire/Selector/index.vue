<template>
  <div id="questionaire-options-wrapper" :class="editOptionsVisible ? '' : 'hover-bg'">
    <div class="div_preview" @click="editOptionsVisible = true">
      <div class="question_title">
        <span v-show="required" class="required">*</span>
        <span class="m-title" v-html="titleEditorValue" />
        <span v-show="currentType === 'checkBox'" class="title_tip">[多选题]</span>
      </div>
      <div class="title-tip" v-html="titleTipContent.html" />
      <div class="question-container">
        <template v-if="currentType === 'radio'">
          <div v-for="(item, index) in tableOptions" :key="index" class="option-item" :style="`width: calc(100% / ${currentRows})`">
            <el-radio v-model="defaultSelected" disabled :border="false" :label="index + 1">
              {{ item.questionTxt }}
            </el-radio>
            <div v-html="item.questionTip.html" />
          </div>
        </template>
        <template v-else-if="currentType === 'checkBox'">
          <div v-for="(item, index) in tableOptions" :key="index" class="option-item checkBox-item" :style="`width: calc(100% / ${currentRows})`">
            <el-checkbox v-model="item.questionChecked" disabled>{{ item.questionTxt }}</el-checkbox>
            <div v-html="item.questionTip.html" />
          </div>
        </template>
        <template v-else>
          <el-select v-model="selectVal" placeholder="请选择" disabled>
            <el-option
              v-for="item in tableOptions"
              :key="item.questionTxt"
              :label="item.placeholder"
              :value="item.questionTxt"
            />
          </el-select>
        </template>
      </div>
    </div>
    <div class="sort-wrapper">
      <slot name="sortWrapper" />
    </div>
    <div v-show="editOptionsVisible" class="questionaire-editor-wrapper">
      <span class="m-trangle" />
      <vue-quill-editor
        :editorId="'twoRowEditor'"
        @handleEditorChange="titleEditorChange"
      />
      <div class="options">
        <template>
          <el-select v-model="currentType" placeholder="请选择" class="type-select" @change="handleTypeChange($event)">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <el-checkbox v-model="required" class="required-wrapper">必答</el-checkbox>
        <span class="title-tip-button" @click="handleTitleTip">标题提示</span>
        <el-select v-show="currentType === 'radio' || currentType === 'checkBox'" v-model="currentRows" placeholder="请选择" class="row-num-select">
          <el-option
            v-for="item in rowNumOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <table class="table-option">
        <tbody>
          <tr>
            <th>选项文字</th>
            <th v-show="currentType !== 'select'">图片</th>
            <th v-show="currentType !== 'select'">说明</th>
            <th>默认</th>
            <th>下移上移</th>
          </tr>
          <tr v-for="(item, index) in tableOptions" :key="index">
            <td>
              <el-input v-model="item.questionTxt" :placeholder="item.placeholder" style="width: 70%;" />
              <span @click="handleAddOption(index)">
                <svg-icon icon-class="plus-circle" />
              </span>
              <span @click="handleRemoveOption(index)">
                <svg-icon icon-class="minus-circle" />
              </span>
            </td>
            <td v-show="currentType !== 'select'">
              <svg-icon icon-class="file-image" class="file-image" />
            </td>
            <td v-show="currentType !== 'select'">
              <span @click="handleOptionTip(index)">
                <svg-icon icon-class="file-exception" :class="item.questionTip.html ? 'isChecked' : ''" />
              </span>
            </td>
            <td>
              <el-checkbox v-model="item.questionChecked" @change="handleSelectedChange(index, $event)" />
            </td>
            <td>
              <span @click="handleOptionDown(index)">
                <svg-icon icon-class="down-circle" />
              </span>
              <span @click="handleOptionUp(index)">
                <svg-icon icon-class="up-circle" />
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 提示弹出框 -->
      <el-dialog
        v-if="refresh"
        :title="tipTitle"
        :visible.sync="tipEditorVisible"
        width="50%"
        center
      >
        <vue-quill-editor
          :defaultContent="tipContent"
          @handleEditorChange="tipEditorChange"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="tipEditorVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleEditorConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <div class="complete-button" @click="handleSwitchEditOptions">完成编辑</div>
    </div>
  </div>
</template>

<script>
import VueQuillEditor from '@/components/VueQuillEditor'
import { zIndexDown, zIndexUp } from '@/utils/arrMove.js'
export default {
  name: 'SelectorQuestionaire',
  components: {
    VueQuillEditor
  },
  props: {
    type: {
      type: String,
      default: 'radio'
    }
  },
  data() {
    return {
      editOptionsVisible: false,
      defaultSelected: null,
      titleEditorValue: '标题',
      tableOptions: [
        { questionTxt: '选项1', placeholder: '选项1', questionImage: null, questionTip: { html: null, text: null }, questionChecked: false },
        { questionTxt: '选项2', placeholder: '选项2', questionImage: null, questionTip: { html: null, text: null }, questionChecked: false },
        { questionTxt: '选项3', placeholder: '选项3', questionImage: null, questionTip: { html: null, text: null }, questionChecked: false },
        { questionTxt: '选项4', placeholder: '选项4', questionImage: null, questionTip: { html: null, text: null }, questionChecked: false }
      ],
      selectVal: '',
      typeOptions: [{
        value: 'radio',
        label: '单选'
      }, {
        value: 'checkBox',
        label: '多选'
      }, {
        value: 'select',
        label: '下拉框'
      }],
      required: true,
      currentType: this.type,
      tipTitle: null,
      tipEditorVisible: false,
      refresh: true,
      titleTipContent: {
        html: null,
        text: null
      },
      tipContent: '',
      selectedIndex: 0,
      currentEditorValue: {
        html: null,
        text: null
      },
      currentRows: 4,
      rowNumOptions: [{
        value: 1,
        label: '竖向排列'
      }, {
        value: 2,
        label: '每行2列'
      }, {
        value: 3,
        label: '每行3列'
      }, {
        value: 4,
        label: '每行4列'
      }, {
        value: 5,
        label: '每行5列'
      }, {
        value: 6,
        label: '每行6列'
      }, {
        value: 7,
        label: '每行7列'
      }, {
        value: 8,
        label: '每行8列'
      }, {
        value: 9,
        label: '每行9列'
      }, {
        value: 10,
        label: '每行10列'
      }]
    }
  },
  watch: {
    tipEditorVisible() {
      this.refresh = false
      this.$nextTick(() => {
        this.refresh = true
      })
    }
  },
  methods: {
    /**
     * @method 点击区块展示编辑选项盒子
     */
    handleSwitchEditOptions() {
      this.editOptionsVisible = !this.editOptionsVisible
    },
    /**
     * @method 类型下拉框选项值改变时修改对应数据
     * @param {String} type 当前选中的类型
     */
    handleTypeChange(type) {
      this.tableOptions.forEach(item => {
        item.questionChecked = false
      })
    },
    /**
     * @method 编辑选项默认值
     * @param {Number} selectedIndex 点击项索引
     * @param {Boolean} selected 点击项是否选中
     */
    handleSelectedChange(selectedIndex, selected) {
      // 单选框组件逻辑
      if (!selected) {
        this.defaultSelected = null
        return false
      }

      this.defaultSelected = selectedIndex + 1

      if (this.currentType === 'select') this.selectVal = this.tableOptions[selectedIndex].questionTxt

      if (this.currentType === 'radio' || this.currentType === 'select') {
        this.tableOptions.forEach((item, index) => {
          if (index !== selectedIndex) {
            item.questionChecked = false
          }
        })
      }
    },
    /**
     * @method 点击添加选项
     * @param {Number} selectedIndex 点击项索引
     */
    handleAddOption(selecedIndex) {
      const defaultObj = {}
      defaultObj.questionTxt = `选项1`
      defaultObj.placeholder = null
      defaultObj.questionImage = null
      defaultObj.questionTip = {
        html: null,
        text: null
      }
      defaultObj.questionChecked = false
      this.tableOptions.splice(selecedIndex + 1, 0, defaultObj)
      this.tableOptions.forEach((item, index) => {
        item.placeholder = `选项${index + 1}`
        if (item.questionTxt.indexOf('选项') > -1 && item.questionTxt.length === 3) {
          item.questionTxt = `选项${index + 1}`
        }
      })
    },
    /**
     * @method 点击删除选项
     * @param {Number} selectedIndex 点击项索引
     */
    handleRemoveOption(selecedIndex) {
      if (this.tableOptions.length === 1) {
        this.$notify({
          title: '错误',
          type: 'error',
          message: '至少保留一个选项, 不可删除'
        })
      } else {
        this.tableOptions.splice(selecedIndex, 1)
        this.tableOptions.forEach((item, index) => {
          item.placeholder = `选项${index + 1}`
        })
      }
    },
    /**
     * @method 点击选项下移
     * @param {Number} selectedIndex 点击选项索引
     */
    handleOptionDown(selectedIndex) {
      const isDownTip = zIndexDown(this.tableOptions, selectedIndex)
      if (isDownTip === false) {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '当前项是最后一位, 不可下移'
        })
      }
    },
    /**
     * @method 点击选项上移
     * @param {Number} selectedIndex 点击选项索引
     */
    handleOptionUp(selectedIndex) {
      const isUpTip = zIndexUp(this.tableOptions, selectedIndex)
      if (isUpTip === false) {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '当前项是第一位, 不可上移'
        })
      }
    },
    /**
     * @method 编辑标题
     * @param {String} e 改变以后的内容
     */
    titleEditorChange(e) {
      if (e.html !== '') {
        let text = e.html.replace(/<\/p>/g, '<br>')
        text = text.replace(/\s{2}/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
        this.titleEditorValue = text.replace(/<p\>/g, '')
      } else {
        this.titleEditorValue = `标题`
      }
    },
    /**
     * @method 点击弹出标题提示编辑
     */
    handleTitleTip() {
      this.tipTitle = `标题提示`
      this.tipContent = this.titleTipContent.html
      this.tipEditorVisible = true
    },
    /**
     * @method 标题编辑富文本change函数
     */
    tipEditorChange(e) {
      let text = e.html.replace(/<\/p>/g, '<br>')
      text = text.replace(/\s{2}/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      this.currentEditorValue.html = text.replace(/<p>/g, '')
      this.currentEditorValue.text = e.text
    },
    /**
     * @method 点击弹出选项提示编辑
     */
    handleOptionTip(selectedIndex) {
      this.tipContent = this.tableOptions[selectedIndex].questionTip.html
      this.selectedIndex = selectedIndex
      this.tipTitle = `选项提示`
      this.tipEditorVisible = true
    },
    /**
     * @method 确认提交提示信息
     */
    handleEditorConfirm() {
      if (this.tipTitle === `标题提示`) {
        this.titleTipContent = { ...this.currentEditorValue }
      } else if (this.tipTitle === `选项提示`) {
        this.tableOptions[this.selectedIndex].questionTip.html = this.currentEditorValue.html
        this.tableOptions[this.selectedIndex].questionTip.text = this.currentEditorValue.text
      }
      this.tipEditorVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.table-option {
    position: relative;
    margin-top: 10px;
    width: 100%;
    padding: 0;
    border-collapse:collapse;
    border:none;
    tr:first-child {
      background-color: #E8E8E8;
      th {
        color: #333;
        height: 26px;
        text-align: left;
        &:first-child {
          text-indent: 10px;
          width: 42%;
        }
        &:nth-child(2) {
          width: 5%;
        }
        &:nth-child(3) {
          width: 5%;
        }
        &:nth-child(4) {
          width: 5%;
        }
      }
    }
    td {
      padding: 7px 0 0;
      white-space: nowrap;
      &:first-child {
        .svg-icon {
          margin-left: 5px;
        }
      }
    }
  }
.svg-icon {
  display: inline-block;
  vertical-align: middle;
  width: 25px;
  height: 25px;
  fill: #999999;
  &:hover {
    fill: #409EFF;
  }
  &.isChecked {
    fill: #409eFF;
  }
}
</style>
