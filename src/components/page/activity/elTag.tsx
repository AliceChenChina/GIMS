import { Component, Emit, Prop, Watch, Vue } from 'vue-property-decorator';
import './el_tag.scss';
import {ElButton} from "element-ui/types/button";
 // @ts-ignore

@Component
export default class ShareIconUpload extends Vue {
  @Prop() value!: Array<string>;
  dyValue = this.value;
  inputVisible = false;
  inputValue = '';
  name: string = 'ShareIconUpload';


  @Watch('value')
  protected valueWatch(newV: any, oldV: any) {
    if (newV instanceof Array) {
      this.dyValue = newV;
    } else {
      this.dyValue = [newV];
      console.log('this.dyValue', this.dyValue);
    }

  }

  handleClose(tag) {
    this.dyValue.splice(this.dyValue.indexOf(tag), 1);
    this.$emit('change', this.dyValue);
  }

  showInput() {
    this.inputVisible = true;
    this.$nextTick(() => {
      (this.$refs.saveTagInput as any).$refs.input.focus();
    });
  }

  handleInput(value){
    if(value.length > 6 ){
      this.$message.error(`标签文字不能超过6个字`);
      return false;
    }
    this.inputValue = value;
  }

  handleInputConfirm() {
    const inputValue = this.inputValue;
    if (inputValue) {
      if(this.dyValue.length >= 3) {
        this.$message.error(`最多添加3个标签！`);
        return false;
      }
      this.dyValue.push(inputValue);
      this.$emit('change', this.dyValue);
    }
    this.inputVisible = false;
    this.inputValue = '';
  }

  render() {
    console.log('dyValue', this.dyValue);
    let result;
    if(this.dyValue && this.dyValue.length < 3){
      if(!this.inputVisible) {
        result = (<el-button class="button-new-tag" size="small" onClick={() => this.showInput()}>+ 添加标签</el-button>)
      } else {
        result = (<el-input class="input-new-tag" value={this.inputValue} size="small" ref="saveTagInput"
                          onBlur={() => this.handleInputConfirm()} onInput={this.handleInput}/>)
      }
    }

    return (
        <div >
          {
            this.dyValue && this.dyValue.map(tag=>(
                <el-tag class="el-tag" closable disable-transitions={false} onClose={()=> this.handleClose(tag)}>{tag}</el-tag>
            ))
          }
          {
            result
          }
        </div>);
  }
}
