<template>
  <div id="questionaire-options-wrapper">
    <div class="div_preview">
      <div class="question_title">
        <span v-show="required" class="required">*</span>
        <span class="m-title" v-html="titleEditorValue" />
        &nbsp;&nbsp;
        <span class="limit-tip">{{ limitTip }}</span>
        <span v-show="currentType === 'multipleInput'" class="title_tip">[矩阵填空]</span>
      </div>
      <div class="title-tip" v-html="titleTipContent.html" />
      <div class="question-container">
        <template v-if="currentType === 'singleInput'">
          <el-input
            v-model="singleTextarea"
            type="textarea"
            :rows="currentHeight === '' ? 1 : currentHeight"
            disabled
            :style="currentWidth === '' ? '' : 'width: ' + currentWidth + 'px;'"
          />
        </template>
        <template v-else-if="currentType === 'arrayInput'">
          <div v-for="(item, index) in arrayInputData" :key="index" class="array-input-row-wrapper">
            <span class="m-title">{{ item.rowTitle }}</span>
            <el-input
              v-model="item.value"
              type="textarea"
              rows="1"
              class="m-input"
            />
            <span>{{ item.limitTip }}</span>
            <span v-show="!required && item.required" class="m-required-wrapper">*</span>
          </div>
        </template>
      </div>
    </div>
    <div class="questionaire-editor-wrapper">
      <span class="m-trangle" />
      <vue-quill-editor
        editorId="twoRowEditor"
        @handleEditorChange="titleEditorChange"
      />
      <div class="options">
        <el-select v-model="currentType" placeholder="请选择">
          <el-option
            v-for="(item, index) in typeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-checkbox v-model="required" class="required-wrapper" @change="allRequired">必答</el-checkbox>
        <span class="title-tip-button" @click="handleTitleTip">填写提示</span>
      </div>
      <div v-if="currentType === 'singleInput'" class="attribute-wrapper">
        <el-checkbox v-model="limit">限制范围</el-checkbox>
        <template v-if="limit">
          &nbsp;&nbsp;
          <span>最小字数: </span>
          &nbsp;&nbsp;
          <el-input v-model="minLimit" maxlength="4" class="limit-input" @change="wordsLimit" />
          &nbsp;&nbsp;
          <span>最大字数: </span>
          &nbsp;&nbsp;
          <el-input v-model="maxLimit" maxlength="4" class="limit-input" @change="wordsLimit" />
          &nbsp;&nbsp;
        </template>
        <el-checkbox v-model="isShowDefault">默认值</el-checkbox>
        <template v-if="isShowDefault">
          &nbsp;&nbsp;
          <el-input v-model="singleTextarea" style="width: 20%;" />
        </template>
        <div style="height: 10px;" />
        <el-select v-model="currentHeight" placeholder="设置高度">
          <el-option
            v-for="(item, index) in heightOptions"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
        &nbsp;&nbsp;
        <el-select v-model="currentWidth" placeholder="设置宽度">
          <el-option
            v-for="(item, index) in widthOptions"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </div>
      <template v-else-if="currentType === 'arrayInput'">
        <table class="table-option">
          <tbody>
            <tr>
              <th>行标题</th>
              <th>最小字数</th>
              <th>最大字数</th>
              <th style="text-align: center;">必答</th>
              <th>默认值</th>
            </tr>
            <tr v-for="(item, index) in arrayInputData" :key="index">
              <td>
                <el-input v-model="item.rowTitle" style="width: 70%" />
                <span @click="handleAddOption(index)">
                  <svg-icon icon-class="plus-circle" />
                </span>
                <span @click="handleRemoveOption(index)">
                  <svg-icon icon-class="minus-circle" />
                </span>
              </td>
              <td style="text-align: center;">
                <el-input v-model="item.minLimit" style="width: 80%;" @change="arrayWordMinLimit(index)" />
              </td>
              <td style="text-align: center;">
                <el-input v-model="item.maxLimit" style="width: 80%;" @change="arrayWordMaxLimit(index)" />
              </td>
              <td style="text-align: center;">
                <el-checkbox v-model="item.required" @change="handleChecked" />
              </td>
              <td>
                <el-input v-model="item.defaultVal" @change="handleRowRequired(index)" />
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <!-- 提示弹出框 -->
      <el-dialog
        title="标题提示"
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
    </div>
  </div>
</template>

<script>
import VueQuillEditor from '@/components/VueQuillEditor'
export default {
  name: 'InputQuestionaire',
  components: {
    VueQuillEditor
  },
  data() {
    return {
      titleEditorValue: '标题',
      singleTextarea: '',
      titleTipContent: {
        html: null,
        text: null
      },
      tipEditorVisible: false,
      tipContent: '',
      currentEditorValue: {
        html: null,
        text: null
      },
      required: true,
      typeOptions: [{
        value: 'singleInput',
        label: '单项填空'
      }, {
        value: 'multipleInput',
        label: '多项填空'
      }, {
        value: 'arrayInput',
        label: '矩阵填空'
      }],
      currentType: 'arrayInput',
      limit: false,
      minLimit: '',
      maxLimit: '',
      isShowDefault: false,
      heightOptions: [{
        value: null,
        label: '设置高度'
      }, {
        value: 1,
        label: '高度1行'
      }, {
        value: 2,
        label: '高度2行'
      }, {
        value: 3,
        label: '高度3行'
      }, {
        value: 4,
        label: '高度4行'
      }, {
        value: 5,
        label: '高度5行'
      }, {
        value: 10,
        label: '高度10行'
      }],
      currentHeight: '',
      widthOptions: [{
        value: null,
        label: '设置宽度'
      }, {
        value: 100,
        label: '宽度100'
      }, {
        value: 200,
        label: '宽度200'
      }, {
        value: 300,
        label: '宽度300'
      }, {
        value: 400,
        label: '宽度400'
      }, {
        value: 500,
        label: '宽度500'
      }, {
        value: 800,
        label: '宽度800'
      }],
      currentWidth: '',
      arrayInputData: [
        { rowTitle: '填空1', minLimit: '', maxLimit: '', value: '', required: true, defaultVal: '', limitTip: '' },
        { rowTitle: '填空2', minLimit: '', maxLimit: '', value: '', required: true, defaultVal: '', limitTip: '' }
      ]
    }
  },
  computed: {
    limitTip() {
      if (this.maxLimit === '' && this.minLimit === '') {
        return ``
      } else if (this.maxLimit === '' && this.minLimit !== '') {
        return `(至少${this.minLimit}个字)`
      } else if (this.minLimit === '' && this.maxLimit !== '') {
        return `(至多${this.maxLimit}个字)`
      } else {
        return `(${this.minLimit}到${this.maxLimit}个字)`
      }
    }
  },
  methods: {
    /**
     * @method 编辑标题
     * @param {String} e 动态编辑数据
     */
    titleEditorChange(e) {
      if (e.html !== ``) {
        let text = e.html.replace(/<\/p>/g, `<br>`)
        text = text.replace(/\s{2}/g, `&nbsp;&nbsp;`)
        this.titleEditorValue = text.replace(/<p\>/g, ``)
      } else {
        this.titleEditorValue = `标题`
      }
    },
    /**
     * @method 点击填写提示
     */
    handleTitleTip() {
      this.tipEditorVisible = true
      this.tipContent = this.titleTipContent.text
    },
    /**
     * @method 编辑提示
     */
    tipEditorChange(e) {
      let text = e.html.replace(/<p\/>/g, `<br>`)
      text = text.replace(/\s{2}/g, `&nbsp;&nbsp;`)
      this.currentEditorValue.html = text.replace(/<p>/g, ``)
      this.currentEditorValue.text = e.text
    },
    /**
     * @method 富文本编辑确认提交
     */
    handleEditorConfirm() {
      this.tipEditorVisible = false
      this.titleTipContent = { ...this.currentEditorValue }
    },
    /**
     * @method 输入框最大最小字数限制
     */
    wordsLimit(val) {
      const type = val === this.maxLimit ? `最大` : `最小`
      const numberReg = /^\+?[1-9][0-9]*$/
      if (!numberReg.test(val) && val !== '') {
        this.$notify({
          title: `警告`,
          type: `warning`,
          message: `${type}字数限制不能填写非正整数类型`
        })
        type === `最大` ? this.maxLimit = `` : this.minLimit = ``
      } else if (numberReg.test(val) && Number(val) > 3000) {
        this.$notify({
          title: `警告`,
          type: `warning`,
          message: `${type}字数不能大于3000`
        })
        type === `最大` ? this.maxLimit = `` : this.minLimit = ``
      } else if ((Number(this.maxLimit) < Number(this.minLimit) || Number(this.maxLimit) === Number(this.minLimit)) && Number(this.maxLimit) !== 0) {
        this.$notify({
          title: `警告`,
          type: `warning`,
          message: `${type}字数不合理`
        })
        type === `最大` ? this.maxLimit = `` : this.minLimit = ``
      }
    },
    /**
     * @method handleAddOption 点击增加选项
     * @param {Number} index 当前点击行索引
     */
    handleAddOption(index) {
      const optionObj = {}
      optionObj.rowTitle = `填空${index + 2}`
      optionObj.minLimit = ''
      optionObj.maxLimit = ''
      optionObj.required = true
      optionObj.defaultVal = ''
      this.arrayInputData.splice(index + 1, 0, optionObj)
    },
    /**
     * @method handleRemoveOption 点击删除选项
     * @param {Number} index 当前点击行索引
     */
    handleRemoveOption(index) {
      if (this.arrayInputData.length === 2) {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: '矩阵填空至少需要两项'
        })
      } else {
        this.arrayInputData.splice(index, 1)
      }
    },
    /**
     * @method handleChecked 矩阵填空必答项设置
     */
    handleChecked() {
      this.arrayInputData.forEach(item => {
        if (!item.required) {
          this.required = false
          item.required = false
        } else {
          item.required = true
        }
      })
      const flag = this.arrayInputData.every(item => {
        return item.required === true
      })
      flag ? this.required = true : this.required = false
    },
    /**
     * @method handleRowRequired 处理矩阵填空默认值
     * @param {Number} index 当前修改行索引
     */
    handleRowRequired(index) {
      this.arrayInputData[index].value = this.arrayInputData[index].defaultVal
    },
    /**
     * @method allRequired 处理必答按钮
     */
    allRequired(selected) {
      if (this.currentType === 'arrayInput') {
        this.arrayInputData.forEach(item => {
          item.required = selected
        })
      }
    },
    /**
     * @method arrayWordLimit 矩阵填空最小值限制
     */
    arrayWordMinLimit(index) {
      const numberReg = /^\+?[1-9][0-9]*$/
      const minLimit = this.arrayInputData[index].minLimit
      const maxLimit = this.arrayInputData[index].maxLimit
      let message
      if (Number(minLimit) > 3000) {
        message = `最小字数不能大于3000`
        this.arrayInputData[index].minLimit = ``
      } else if (!numberReg.test(minLimit) && minLimit !== '') {
        message = `最小字数不合理`
        this.arrayInputData[index].minLimit = ``
      } else if ((Number(minLimit) > Number(maxLimit) || Number(minLimit) === Number(maxLimit)) && Number(maxLimit) !== 0) {
        message = `最小字数不合理`
        this.arrayInputData[index].minLimit = ``
      }

      if (message) {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: message
        })
      }

      // 行字数提示
      let tip = ''
      const max = this.arrayInputData[index].maxLimit
      const min = this.arrayInputData[index].minLimit
      if (max === '' && min === '') {
        tip = ``
      } else if (max === '' && min !== '') {
        tip = `(至少${min}个字)`
      } else if (min === '' && max !== '') {
        tip = `(至多${max}个字)`
      } else {
        tip = `(${min}到${max}个字)`
      }
      this.arrayInputData[index].limitTip = tip
    },
    /**
     * @method arrayWordMaxLimit 矩阵填空最大值限制
     */
    arrayWordMaxLimit(index) {
      const maxLimit = this.arrayInputData[index].maxLimit
      const minLimit = this.arrayInputData[index].minLimit
      const numberReg = /^\+?[1-9][0-9]*$/
      let message
      if (Number(maxLimit) > 3000) {
        message = `最大字数不能大于3000`
        this.arrayInputData[index].maxLimit = ``
      } else if (!numberReg.test(maxLimit) && maxLimit !== '') {
        message = `最大字数填写不合理`
        this.arrayInputData[index].maxLimit = ``
      } else if (Number(maxLimit) < Number(minLimit) || Number(maxLimit) === Number(minLimit) && Number(minLimit) !== 0) {
        message = `最大字数填写不合理`
        this.arrayInputData[index].maxLimit = ``
      }

      if (message) {
        this.$notify({
          title: '警告',
          type: 'warning',
          message: message
        })
      }

      // 行字数提示
      let tip = ''
      const max = this.arrayInputData[index].maxLimit
      const min = this.arrayInputData[index].minLimit
      if (max === '' && min === '') {
        tip = ``
      } else if (max === '' && min !== '') {
        tip = `(至少${min}个字)`
      } else if (min === '' && max !== '') {
        tip = `(至多${max}个字)`
      } else {
        tip = `(${min}到${max}个字)`
      }
      this.arrayInputData[index].limitTip = tip
    }
  }
}
</script>

<style lang="scss" scoped>
.array-input-row-wrapper {
  margin-bottom: 10px;
  span {
    vertical-align: middle;
    &:nth-child(3) {
      margin-left: 5px;
    }
  }
  .m-title {
    display: inline-block;
    width: 10%;
    vertical-align: middle;
    padding: 5px;
    word-break: break-all;
  }
  .m-input {
    display: inline-block;
    width: 50%;
    vertical-align: middle;
  }
  .m-required-wrapper {
    margin-left: 10px;
    color: red;
    vertical-align: middle;
  }
}
.attribute-wrapper {
  margin-top: 20px;
  min-height: 40px;
  line-height: 40px;
  .limit-input {
    width: 10%;
  }
}
.table-option {
  position: relative;
  margin-top: 10px;
  width: 100%;
  padding: 0;
  border-collapse: collapse;
  border: none;
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
        width: 10%;
        text-align: center;
      }
      &:nth-child(3) {
        width: 10%;
        text-align: center;
      }
      &:nth-child(4) {
        width: 5%;
      }
      &:nth-child(5) {
        width: 20%;
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
    fill: #409EFF;
  }
}
</style>
