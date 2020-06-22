
export default {
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 200,
        fixed: 'right',
        formatter: (row, column, cellValue, index) => {
          const h = vm.$createElement;
          return (
            <div>
              <el-button type="text" size="mini" onClick={ () => { vm.check(row, 'check'); } }>查看</el-button>
              <el-button type="text" size="mini" onClick={ () => { vm.check(row, 'edit'); } }>编辑</el-button>
              <el-button type="text" size="mini" onClick={ () => { vm.delete(row); } }>删除</el-button>
            </div>
          );
        }
      }
    },
    {
      label: '序号',
      props: {
        width: 120,
        align: 'center',
        formatter: (row, column, cellValue, index) => {
          const { currentPageNo, pageSize } = vm.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '组名',
      dataKey: 'groupName'
    },
    {
      label: '更新时间',
      dataKey: 'lastUpdateStr'
    }
  ]
};
