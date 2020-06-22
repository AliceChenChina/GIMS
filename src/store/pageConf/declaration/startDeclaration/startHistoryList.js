// 启动历史列表视图数据
export default {
  tableColumn: vm => [
    {
      label: '操作',
      props: {
        align: 'center',
        width: 140,
        fixed: 'right',
        formatter: row => {
          const getHref = (clickEvent, text) => {
            const options = {
              style: 'padding: 0 5px;cursor:pointer;color:#EB5954',
              on: {
                click: () => {
                  clickEvent(row);
                }
              }
            };
            return vm.$createElement('a', options, text);
          };
          const links = [
            getHref(vm.edit, '编辑启动报单')
          ];
          return vm.$createElement('div', {}, links);
        }
      }
    },
    {
      label: '序号',
      dataKey: '',
      props: {
        width: 50,
        formatter: (row, col, cellval, index) => {
          const { currentPageNo, pageSize } = vm.viewData.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '报单类型',
      props: {
        formatter: row => {
          if (!row.bookingStartDto || !row.bookingStartDto.tradeType) {
            return '-';
          };
          return row.bookingStartDto.tradeType.toString() === '10' ? '认购' : row.bookingStartDto.tradeType.toString() === '20' ? '申购' : '-';
        }
      }
    },
    {
      label: '报单开放状态',
      props: {
        width: 100,
        formatter: row => row.bookingStartDto ? row.bookingStartDto.openStatus === 1 ? '开放' : '关闭' : '-'
      }
    },
    {
      label: '报单开放周期',
      props: {
        width: 200,
        formatter: row => {
          if (!row.bookingStartDto || !row.bookingStartDto.openStart || !row.bookingStartDto.openEnd) {
            return '-';
          }
          return row.bookingStartDto.openStart.substring(0, 10) + ' ~ ' + row.bookingStartDto.openEnd.substring(0, 10);
        }
      }
    },
    {
      label: '启动报单名称',
      props: {
        width: 140,
        formatter: row => row.bookingStartDto ? row.bookingStartDto.startName || '-' : '-'
      }
    },
    {
      label: ' 产品名称',
      props: {
        width: 160,
        formatter: row => row.productDto ? row.productDto.productName || '-' : '-'
      }
    },
    {
      label: '产品简称',
      props: {
        width: 120,
        formatter: row => row.productDto ? row.productDto.productNameShort || '-' : '-'
      }
    },
    {
      label: '产品状态',
      props: {
        formatter: row => {
          if (!row.bookingStartDto || !row.bookingStartDto.tradeType) {
            return '-';
          };
          return row.bookingStartDto.tradeType.toString() === '10' ? '认购期' : row.bookingStartDto.tradeType.toString() === '20' ? '正常开放' : '-';
        }
      }
    },
    {
      label: '风险等级',
      props: {
        width: 120,
        formatter: row => row.productDto ? row.productDto.riskLevelName || '-' : '-'
      }
    },
    {
      label: '管理人简称',
      props: {
        formatter: row => row.productDto ? row.productDto.shortName || '-' : '-'
      }
    },
    {
      label: '成立日期',
      props: {
        width: 120,
        formatter: row => row.productDto ? row.productDto.setupDate ? row.productDto.setupDate.toString().substring(0, 10) : '-' : '-'
      }
    },
    {
      label: '到期日期',
      props: {
        width: 120,
        formatter: row => row.productDto ? row.productDto.contractEndDate ? row.productDto.contractEndDate.toString().substring(0, 10) : '-' : '-'
      }
    },
    {
      label: '折标系数',
      props: {
        width: 100,
        align: 'right',
        formatter: row => {
          if (!row.bookingStartDto) return '-';
          return vm.$utils.emptyableValue(row.bookingStartDto.commissionConvert, (val) => {
            return val;
          });
        }
      }
    },
    {
      label: '提成比例(%)',
      props: {
        width: 100,
        align: 'right',
        formatter: row => {
          if (!row.bookingStartDto) return '-';
          return vm.$utils.emptyableValue(row.bookingStartDto.commissionRate, (val) => {
            return vm.$utils.number.deciToPer_three(val);
          });
        }
      }
    }
  ]
};
