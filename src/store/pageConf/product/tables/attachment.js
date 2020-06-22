/*
附件查看下载删除
 */
export default {
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 143,
        fixed: 'right'
      },
      slotComps: [
        {
          tagName: 'el-button',
          innerText: '下载',
          props: {
            type: 'danger',
            size: 'mini'
          },
          eventOn(scope) {
            return {
              click() {
                vm.downloadAttachment(scope.row);
              }
            };
          }
        },
        {
          tagName: 'el-button',
          innerText: '删除',
          props: {
            type: 'mini'
          },
          eventOn(scope) {
            return {
              click() {
                vm.deleteProductNotice(scope.row);
              }
            };
          }
        }
      ]
    },
    {
      label: '序号',
      dataKey: '',
      props: {
        width: 60,
        align: 'left',
        formatter: (row, column, cellValue, index) => {
          const { currentPageNo, pageSize } = vm.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '文件名称',
      dataKey: 'fileName',
      props: {
        width: 250
      }
    },
    {
      label: '扩展名',
      dataKey: 'fileNameExt',
      props: {
        width: 100
      }
    },
    {
      label: '文件大小',
      props: {
        formatter: (row) => {
          const b = row.fileSize;
          if (b < 1024) {
            return b + 'B';
          } else if (b < 1024 * 1024) {
            return (b / 1024).toFixed(2) + 'KB';
          } else if (b < 1024 * 1024 * 1024) {
            return (b / 1024 / 1024).toFixed(2) + 'MB';
          } else if (b < 1024 * 1024 * 1024 * 1024) {
            return (b / 1024 / 1024 / 1024).toFixed(2) + 'MB';
          } else {
            return b + 'KB';
          }
        }
      }
    },
    {
      label: '创建人',
      dataKey: 'creatorName'
    },
    {
      label: '创建时间',
      dataKey: 'createdTime'
    }
  ]
};
