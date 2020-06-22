<template>
  <div class="upLoad">
    <el-upload
      :disabled="check"
      :action="action"
      :headers="headers"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :file-list="fileListLocal"
      :on-success="onSuccess"
      :limit="1"
      :on-exceed="onExceed"
      list-type="picture-card"
    >
      <el-button
        size="small"
        type="primary"
        v-if="!check"
      >点击上传</el-button
      >
    </el-upload>
  </div>
</template>

<script>

  export default {
    name: 'UpLoad',
    data() {
      return {
        fileListLocal: []
      };
    },
    props: {
      picKey: {
        type: String,
        default: ''
      },
      check: {
        type: Boolean,
        default: true
      },
      action: {
        type: String,
        default: ''
      },
      headers: {
        type: Object,
        default: () => {}
      },
      fileList: { // 图片文件
        type: Array,
        default: () => []
      }
    },
    watch: {
      fileList: {
        deep: true,
        handler(newVal) {
          this.fileListLocal = newVal;
        }
      }
    },
    created(){
      this.fileListLocal = this.fileList;
    },
    components: {
    },
    methods: {
      beforeUpload(file) {
        const typeArr = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const isJPG = typeArr.indexOf(file.type) !== -1;
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('图片只能是 jpg、jpeg、png、gif 格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('图片大小不能超过 2MB!');
          return false;
        }
        if (this.picKey && this.picKey === 'picReccond') {
          const isSize = new Promise(function(resolve, reject) {
            const width = 1080;
            const _URL = window.URL || window.webkitURL;
            const img = new Image();
            img.src = _URL.createObjectURL(file);
            img.onload = () => {
              const valid = img.width === width;
              valid ? resolve() : reject(width);
            };
          }).then(
            () => {
              return file;
            },
            () => {
              this.$message.error('上传的图片宽度必须是1080!');
              return Promise.reject(width);
            }
          );
          return isSize;
        }
      },
      handleRemove(file, fileList) {
        this.fileListLocal = [];
        this.$emit('updateFileList', this.fileListLocal);
      },
      onSuccess(res, file, fileList) {
        res.url = res.datas.pictureLink;
        this.fileListLocal[0] = res;
        this.$emit('updateFileList', this.fileListLocal);
      },
      onExceed(file, fileList) {
        if (fileList.length >= 1) {
          this.$message.error('最多可上传1张图片');
          return false;
        }
      }
    }
  };
</script>
<style>
  .upLoad /deep/ .el-upload--picture-card {
    display: block;
    width: auto;
    height: auto;
    line-height: unset;
    border: none;
  }
  .el-upload--picture-card{
    display: block;
    width: auto;
    height: auto;
    line-height: unset;
    border: none;
  }

</style>
