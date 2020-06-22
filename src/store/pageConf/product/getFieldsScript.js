/*eslint-disable*/
// 解析dom并且转成对象描述
let sectionsTitleDom = Array.from(document.querySelectorAll('.form-group-title'));
sectionsTitleDom = sectionsTitleDom.filter(dom => {
  // 下一个元素是不是table，是table保留
  if (dom.nextElementSibling.localName === 'table') return true;
});
const sections = sectionsTitleDom.map(dom => dom.innerText);
const formTables = document.querySelectorAll('.form-table');
const regMatchModel = /^\w+\.(\w+(\.\w+)?)$/;
const rs = sections.map((sectionName, index) => {
  const resultFormItems = [];
  const formTable = formTables[index];
  const allFormItems = formTable.querySelectorAll('Form-item');
  allFormItems.forEach(formItem => {
    const attrs = formItem.attributes;
    // 类型判断children的第一个节点类型， //todo 如果是td再往下找一层
    const originInputType = formItem.children[0].localName;
    let inputTag;
    const resultItem = {
      formLabel: attrs.label.value,
    };
    if (originInputType === 'i-input') {
      inputTag = 'el-input';
      const model = formItem.children[0].attributes[':value.sync'].value;
      const modelKey = model.match(regMatchModel)[1];
      const attrs = formItem.children[0].attributes;
      if (attrs.type && attrs.type.value === 'textarea') {
        resultItem.inputProps = {
          type: 'textarea', // 奇数行放textarea
          rows: 2
        }
      }
      resultItem.modelKey = modelKey;

    } else if (originInputType === 'i-select') {
      let vFornodeValue;
      if (formItem.children[0].children[0].attributes['v-for']) {
        vFornodeValue = formItem.children[0].children[0].attributes['v-for'].nodeValue;
        const matchedVarName = vFornodeValue.match(/^\w+ in (\w+)$/);
        resultItem.inputTagOptions = matchedVarName[1];
      } else {
        // 写死的i-option
        const optionChildren = formItem.children[0].children;
        resultItem.inputTagOptions = Array.from(optionChildren).map(option => {
          return {
            label: option.innerText,
            value: option.attributes[':value'] ? option.attributes[':value'].value: option.attributes['value'].value
          }
        });
      }
      const model = formItem.children[0].attributes[':model.sync'].value;
      const modelKey = model.match(/^\w+\.(\w+)/)[1];
      resultItem.modelKey = modelKey;
      inputTag = 'el-select';
    } else if (originInputType === 'radio-group') {
      const radioChildren = formItem.children[0].children;
      // 属性
      const model = formItem.children[0].attributes[':model.sync'].value;
      const modelKey = model.match(regMatchModel)[1];
      resultItem.inputTagOptions = Array.from(radioChildren).map(radioOption => {
        return {
          label: radioOption.innerText,
          value: radioOption.attributes.value.value
        }
      });
      resultItem.modelKey = modelKey;
      inputTag = 'el-radio-group';
    } else if (originInputType === 'date-picker') {
      const model = formItem.children[0].attributes[':value.sync'].value;
      const modelKey = model.match(regMatchModel)[1];
      inputTag = 'el-date-picker';
      resultItem.modelKey = modelKey;
    }
    // 有prop属性那么先设为必选
    const validateProp = formItem.attributes['prop'];
    if (validateProp && validateProp.value) {
      resultItem.formRules = 'required';
    }

    // 是否disabled
    const inputEle = formItem.children[0];
    let hasDisabled = inputEle.attributes[':disabled'] || inputEle.attributes['disabled'];
    if (hasDisabled) {
      if (!resultItem.inputProps) {
        resultItem.inputProps = {};
      }
      resultItem.inputProps.disabled = true;
    }
    resultFormItems.push(resultItem);
    resultItem.inputTag = inputTag;
  });
  return {
    title: sectionName,
    formItems: resultFormItems
  };
});
