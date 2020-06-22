/*
 未读消息列表
 */
export default {
  filterOptions(vm) {
    return [
      [
        {
          labelName: '消息类型',
          tagName: 'el-select',
          modelName: 'msgType',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: vm.msgType
        },
        {
          labelName: '消息内容',
          tagName: 'el-input',
          modelName: 'keyword',
          props: {
            clearable: true,
            placeholder: '消息内容'
          }
        },
        {
          labelName: '状态',
          tagName: 'el-select',
          modelName: 'status',
          props: {
            clearable: true,
            placeholder: '状态'
          },
          options: [
            {
              label: '未读',
              value: 1
            },
            {
              label: '已读',
              value: 2
            }
          ]
        },
        {
          labelName: '',
          tagName: 'el-button-group',
          slotComps: [
            {
              tagName: 'el-button',
              innerText: '查询',
              props: {
                type: 'primary',
                icon: 'el-icon-search'
              },
              eventOn: {
                click: vm.doQuery
              }
            },
            {
              tagName: 'el-button',
              innerText: '重置',
              props: {
                icon: 'el-icon-refresh-right'
              },
              eventOn: {
                click: vm.doDefaultReset
              }
            }
          ]
        }
      ]
    ];
  },
  filterModel: {
    msgType: '', // 消息类型
    keyword: '', // 消息内容
    status: 1 // 状态
  },
  tableColumn: vm => [
    {
      label: '',
      props: {
        type: 'selection',
        selectable: (row, index) => {
          return true;
        }
      }
    },
    {
      label: '序号',
      dataKey: ' ',
      props: {
        width: 45,
        formatter: (row, col, cellval, index) => {
          const { currentPageNo, pageSize } = vm.viewerState.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '提醒内容',
      dataKey: 'title',
      props: {
        sortable: 'custom',
        formatter: (row, col, cellval, index) => {
          if (row.title && row.content) {
            const text = `【${row.title}】: ${row.content}`;
            let chidNode;
            if (row.link && row.status === 1) { // 未读+链接
              const options = {
                style: 'color: #F52020;cursor:pointer',
                on: {
                  click: () => {
                    vm.goLink(row.id);
                  }
                }
              };
              chidNode = vm.$createElement('a', options, text);
            } else {
              chidNode = vm.$createElement('span', {}, text);
            }
            return vm.$createElement('div', {}, [chidNode]);
          } else {
            return '';
          }
        }
      }
    },
    {
      label: '发送时间',
      dataKey: 'createdTime',
      props: {
        width: 200,
        sortable: 'custom',
        formatter: (row, col, cellval, index) => {
          return vm.$utils.date.format(cellval, 'yyyy-MM-dd hh:mm:ss');
        }
      }
    },
    {
      label: '状态',
      dataKey: 'status',
      props: {
        width: 120,
        sortable: 'custom',
        formatter: (row, col, cellval, index) => {
          if (cellval) {
            if (cellval === 1) {
              const options = {
                style: 'color:red;'
              };
              return vm.$createElement('span', options, '未读');
            } else if (cellval === 2) {
              const option = {
                style: 'color:green;'
              };
              return vm.$createElement('span', option, '已读');
            } else {
              return '删除';
            }
          }
          return '';
        }
      }
    }
  ]
};
