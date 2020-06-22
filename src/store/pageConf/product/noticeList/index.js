import noticeList from './noticeList';

export default function(category) {
  // category4 holding_report 持仓研报
  // category3 product_notice 产品公告
  const filterModel = { ...noticeList.filterModel };
  const baseFilterOptionsFun = noticeList.filterOptions;
  const bassTableColumnFun = noticeList.tableColumn;
  if (category === 'holding_report') {
    filterModel.publishDateStart = ''; // 发布开始日期
    filterModel.publishDateEnd = ''; // 发布截至日期
  } else if (category === 'product_notice') {
    filterModel.submitTimeStart = ''; // 提交开始日期
    filterModel.submitTimeEnd = ''; // 截止日期
    filterModel.submiterName = '';
  }

  const filterOptions = vm => {
    const rtFilterOptions = baseFilterOptionsFun(vm);
    if (category === 'holding_report') {
      // 发布日期
      rtFilterOptions[0] = [
        ...rtFilterOptions[0],
        {
          labelName: '发布日期',
          tagName: 'el-date-picker',
          modelName: 'publishDateStart',
          props: {
            clearable: true,
            placeholder: '开始时间',
            'value-format': 'yyyy-MM-dd 00:00:00'
          }
        },
        {
          labelName: '-',
          tagName: 'el-date-picker',
          modelName: 'publishDateEnd',
          props: {
            clearable: true,
            placeholder: '结束时间',
            'value-format': 'yyyy-MM-dd 23:59:59'
          }
        }
      ];
    }
    if (category === 'product_notice') {
      // 提交者，提交日期
      rtFilterOptions[0] = [
        ...rtFilterOptions[0],
        {
          labelName: '提交者',
          tagName: 'el-input',
          modelName: 'submiterName',
          props: {
            clearable: true,
            placeholder: '提交者'
          }
        },
        {
          labelName: '发布日期',
          tagName: 'el-date-picker',
          modelName: 'submitTimeStart',
          props: {
            clearable: true,
            placeholder: '开始时间',
            'value-format': 'yyyy-MM-dd 00:00:00'
          }
        },
        {
          labelName: '-',
          tagName: 'el-date-picker',
          modelName: 'submitTimeEnd',
          props: {
            clearable: true,
            placeholder: '结束时间',
            'value-format': 'yyyy-MM-dd 23:59:59'
          }
        }
      ];
    }
    rtFilterOptions[0].push({
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
            icon: 'el-icon-refresh-left'
          },
          eventOn: {
            click: vm.doDefaultReset
          }
        }
      ]
    });
    return rtFilterOptions;
  };

  const tableColumn = vm => {
    const rtTableColumn = bassTableColumnFun(vm);
    let col;
    if (category === 'holding_report') {
      // 倒数第二个插入发布日期字段
      col = {
        label: '发布日期',
        dataKey: 'publishDate',
        props: {
          formatter: (row) => row.publishDate.substring(0, 10)
        }
      };
      rtTableColumn[0].slotComps.push({
        tagName: 'el-button',
        innerText: '下载报告',
        props: {
          type: 'text',
          size: 'mini'
        },
        eventOn(scope) {
          return {
            click() {
              vm.downloadReport(scope.row);
            }
          };
        }
      });
    }
    if (category === 'product_notice') {
      // 倒数第二个插入提交者字段
      rtTableColumn[0].props.width = 86;
      col = {
        label: '提交者',
        dataKey: 'submitorName',
        props: {
          sortable: 'custom'
        }
      };
    }
    rtTableColumn.splice(rtTableColumn.length - 2, 0, col);
    return rtTableColumn;
  };
  return { filterModel, filterOptions, tableColumn };
}
