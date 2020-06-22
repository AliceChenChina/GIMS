<script>
  /*
动态产生表单
*/
  import DynamicElComponent from 'common/DynamicElComponent';
  import { DefaultResultWrapper } from '../../api/ResultWrapper';

  export default {
    name: 'DynamicForm',
    components: {
      DynamicElComponent
    },
    props: {
      form: {
        type: Array,
        default() {
          return [];
        }
      },
      model: {
        type: Object,
        default() {
          return {};
        }
      },
      labelWidth: {
        type: String,
        default: '180px'
      },
      colSpan: {
        type: Number,
        default: 24
      }
    },
    data() {
      return {
        localModel: {},
        formRules: {}
      };
    },
    computed: {
      _form() {
        if (this.form.length > 0 && (this.form[0] instanceof Array === false)) {
          return this.normalizeForm();
        }
        return this.form;
      }
    },
    watch: {
      model: {
        deep: true,
        handler() {
          this.localModel = { ...this.model };
          this.convertNumberVal();
        }
      }
    },
    created() {
      this.localModel = { ...this.model };
      this.convertNumberVal();
    },
    methods: {
      convertNumberVal() {
        Object.keys(this.localModel).forEach(modelKey => {
          if (/^\d+$/.test(this.localModel[modelKey])) {
            if (this.localModel[modelKey].length < 11) {
              // 返回的数字统一转为整形
              this.localModel[modelKey] = parseInt(this.localModel[modelKey]);
            }
          }
        });
      },
      normalizeForm() {
        // 如果是一维数组，那么以一列展示表单
        return this.form.map((formItem) => {
          return [formItem];
        });
      },
      // 获取element ui输入框组件
      // 目前支持一层children
      getElementUIComponent(itemArg) {
        // todo formRules的设置不能放在这个函数
        const formItem = { ...itemArg };
        if (typeof formItem.inputEvents === 'undefined') {
          formItem.inputEvents = {};
        }
        const comp = {
          tagName: formItem.inputTag,
          options: {
            props: formItem.inputProps || {},
            on: formItem.inputEvents || {},
            attrs: formItem.inputAttrs || {}
          },
          children: formItem.inputTagOptions
        };
        if (typeof formItem.inputTagOptions === 'undefined') {
          formItem.inputTagOptions = [];
        }
        const bindDefaultValueComps = ['el-input',
                                       'el-select',
                                       'el-date-picker',
                                       'el-radio-group',
                                       'el-upload',
                                       'el-cascader',
                                       'el-checkbox',
                                       'share-icon-upload', 'upload-img', 'el-tag'];
        if (typeof this.$utils.objStrGet(this.localModel, formItem.modelKey) === 'undefined') {
          // 设置model字段
          // 支持字符串嵌套获取多层对象
          if (formItem.inputTag === 'el-upload') {
            this.$utils.observerStrKeySetter(this.localModel, formItem.modelKey, []);
          } else {
            this.$utils.observerStrKeySetter(this.localModel, formItem.modelKey, '');
          }
        }
        // 绑定默认输入事件
        // todo 外部注册处理方法
        if (bindDefaultValueComps.indexOf(comp.tagName) >= 0) {
          if (!(comp.options.on.input instanceof Function)) {
            // 没有设置过input事件
            comp.options.on.input = value => {
              this.$utils.observerStrKeySetter(this.localModel, formItem.modelKey, value);
              this.$emit('onFormChange', this.localModel);
            };
          }
          if (comp.tagName === 'el-radio-group') {
            // 转换children到el-radio元素
            comp.children = formItem.inputTagOptions.map(item => {
              return {
                tagName: 'el-radio',
                options: {
                  props: {
                    label: item.value // 选中的值
                  }
                },
                children: item.label // 单选文字
              };
            });
          }
          if (comp.tagName === 'el-select') {
            // 转换children到el-radio元素
            comp.children = formItem.inputTagOptions.map(item => {
              return {
                tagName: 'el-option',
                options: {
                  props: {
                    label: item.label,
                    value: item.value
                  }
                }
              };
            });
          }
          if (comp.tagName === 'el-upload') {
            // todo 接受外部配置
            const defaultProps = {
              action: '/djjf-web/fileUpload/upload',
              headers: {
                token: window.localStorage.getItem('token')
              },
              onSuccess: (response, file, fileList) => {
                let resultWrapper;
                if (!comp.options.props.resultWrapper) {
                  resultWrapper = new DefaultResultWrapper();
                } else {
                  resultWrapper = comp.options.props.resultWrapper;
                }
                const extractRs = resultWrapper.extractResult(response);
                const uploadClass = 'upload' + formItem.modelKey;
                if (!extractRs.success) {
                  this.$message.error(extractRs.data);
                  this.$utils.observerStrKeySetter(this.localModel, formItem.modelKey, fileList.slice(0, fileList.length - 1));
                  this.$emit('onFormChange', this.localModel);
                  if (comp.options.props.limit && comp.options.props['list-type'] === 'picture-card') {
                    document.getElementsByClassName(uploadClass)[0].childNodes[1].style.display = 'inline-block';
                  }
                  return;
                }
                if (comp.options.props.limit && comp.options.props.limit === fileList.length && comp.options.props['list-type'] === 'picture-card') {
                  document.getElementsByClassName(uploadClass)[0].childNodes[1].style.display = 'none';
                }
                this.$utils.observerStrKeySetter(this.localModel, formItem.modelKey, fileList);
                this.$emit('onFormChange', this.localModel);
                if (comp.options.props.onSuccessResponse instanceof Function) {
                  // 执行自定义相应成功回调
                  comp.options.props.onSuccessResponse(extractRs);
                }
              },
              onRemove: (file, fileList) => {
                if (comp.options.props.limit && comp.options.props['list-type'] === 'picture-card') {
                  const uploadClass = 'upload' + formItem.modelKey;
                  document.getElementsByClassName(uploadClass)[0].childNodes[1].style.display = 'inline-block';
                }
                this.$utils.observerStrKeySetter(this.localModel, formItem.modelKey, fileList);
                this.$emit('onFormChange', this.localModel);
              },
              fileList: this.$utils.objStrGet(this.localModel, formItem.modelKey)
            };
            comp.options.props = { ...defaultProps, ...comp.options.props };
            const defaultTips = [{
              tagName: 'el-button',
              children: '点击上传',
              options: {
                props: {
                  size: 'small',
                  type: 'primary'
                }
              }
            }];
            if (comp.options.props.limit && comp.options.props['list-type'] === 'picture-card') {
              comp.options.class = 'upload' + formItem.modelKey;
            }
            comp.children = comp.children ? comp.children : defaultTips;
          }
          if (comp.tagName === 'el-cascader') {
            comp.options.on.change = value => {
              // const val = value[value.length - 1];
              this.$utils.observerStrKeySetter(this.localModel, formItem.modelKey, value);
              this.$emit('onFormChange', this.localModel);
            };
          }
          if (comp.tagName === 'el-checkbox') {
            comp.options.on.change = value => {
              // const val = value[value.length - 1];
              this.$utils.observerStrKeySetter(this.localModel, formItem.modelKey, value);
              this.$emit('onFormChange', this.localModel);
            };
          }
          if (comp.tagName === 'el-date-picker') {
            comp.options.on.change = value => {
              if (!value) {
                // 点clear value为null时
                value = '';
              }
              this.$utils.observerStrKeySetter(this.localModel, formItem.modelKey, value);
            };
          }
          if (comp.tagName === 'share-icon-upload' || comp.tagName === 'upload-img') {
            comp.options.on.change = value => {
              this.$utils.observerStrKeySetter(this.localModel, formItem.modelKey, value.pictureLink);
              this.$emit('onFormChange', this.localModel);
              this.getFormValidate()()
            };
          }
          if (comp.tagName === 'el-tag') {
            comp.options.on.change = value => {
              this.$utils.observerStrKeySetter(this.localModel, formItem.modelKey, value);
              this.$emit('onFormChange', this.localModel);
            };
          }
        }
        // 绑定value到组件上面
        comp.options.props.value = this.$utils.objStrGet(this.localModel, formItem.modelKey);
        if (formItem.formRules === 'required') {
          // 生成一条form默认的required规则
          const rules = this.defaultRequiredRules(formItem);
          this.setFormRules(formItem.modelKey, rules);
        } else if (formItem.formRules instanceof Array) {
          this.setFormRules(formItem.modelKey, formItem.formRules);
        } else {
          this.setFormRules(formItem.modelKey, []);
        }
        // 默认form-item的prop（el-form里用来规则检测的prop字段）为modelKey
        return (
          <el-form-item label={ formItem.formLabel } class="dy-form-item" prop={formItem.modelKey}>
            <dynamic-el-component
              key={formItem.modelKey}
              comp={ comp }
            />
          </el-form-item>
        );
      },
      // element ui返回一条required规则对象
      defaultRequiredRules(formItem) {
        let { formLabel } = formItem;
        formLabel = formLabel.replace(/：|:/, '');
        const defaultRequiredMsg = `请填写${formLabel}`;
        return [{ required: true, message: defaultRequiredMsg, trigger: 'blur' }];
      },
      setFormRules(propKeyName, rules) {
        // 设置el-from的的form规则数组
        if (typeof this.formRules[propKeyName] === 'undefined') {
          this.$set(this.formRules, propKeyName, []);
          this.formRules[propKeyName] = rules;
        }
      },
      getFormValidate() {
        return this.$refs['dy_form'].validate;
      },
      clearFormValid() {
        return this.$refs['dy_form'].clearValidate();
      },
      validateForm(fn) {
        return this.$refs['dy_form'].validate(fn);
      },
      resetFields() {
        // 获取表单验证函数
        setTimeout(() => {
          this.$refs['dy_form'].clearValidate();
        }, 100);
      }
    },
    render() {
      // model={ this.localModel }
      // jsx里面，属性（props）和事件（on）参照$createElement用法
      const dynamicProps = {
        props: {
          rules: this.formRules,
          model: this.localModel,
          'label-width': this.labelWidth
        },
        on: {}
      };
      return (
        // 这里<el-form>直接写<el-form model={this.localModel}>会一直报表单input事件找不到
        // 排查了一下应该是jsx分类属性的问题，生成的$createElement里把model归类到attrs属性里面去了
        // 所以就显式分类了一下props属性
        // 参考https://juejin.im/post/5b221e2951882574aa5f4c5a
        <el-form ref="dy_form" {...dynamicProps}>
          {this._form.map(row => {
            return (
              <el-row type="flex" className="row-bg" justify="space-between">
                { row.map(compItem => {
                  return (
                    <el-col className="col-test" span={this.colSpan}>
                      { this.getElementUIComponent(compItem) }
                    </el-col>
                  );
                })
                }
              </el-row>
            );
          })
        }
        </el-form>
      );
    }
  };
</script>
