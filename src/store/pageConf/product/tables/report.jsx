/*
净值列表
 */
export default {
  filterOptions() {
    return [];
  },
  filterModel: {},
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 280,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const h = vm.$createElement;
          return (
            <div>
              <el-button type="text" size="mini" onClick={ () => { vm.downloadReport(row); } }>下载报告</el-button>
            </div>
          );
        }
      }
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
      label: '产品名称',
      dataKey: 'createdTime',
      props: {
        formatter: (row) => {
          return row.productDto.productName;
        }
      }
    },
    {
      label: '产品简称',
      props: {
        formatter: (row) => {
          return row.productDto.productNameShort;
        }
      }
    },
    {
      label: '报告标题',
      dataKey: 'title'
    },
    {
      label: '发布日期',
      dataKey: 'publishDate',
      props: {
        formatter: (row) => {
          return row.publishDate ? row.publishDate.substring(0, 10) : '-';
        }
      }
    }
  ]
};
