/*
赎回直销订单页面设置
 */
const argGroupKey = 'product_type';
export default {
  filterOptions(vm) {
    return [
      [
        {
          labelName: '产品名称',
          tagName: 'el-input',
          modelName: 'productName',
          props: {
            clearable: true,
            placeholder: '产品名称'
          }
        },
        {
          labelName: '产品类型',
          tagName: 'el-select',
          modelName: 'productType',
          props: {
            clearable: true,
            placeholder: '请选择'
          },
          options: [
            {
              label: '私募股权',
              value: 'equity'
            },
            {
              label: '类固收',
              value: 'fixed_income'
            },
            {
              label: '阳光私募',
              value: 'secondary_market'
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
    productName: '',
    productType: ''
  },
  tableColumn: vm => [
    {
      label: '操作',
      dataKey: '',
      props: {
        align: 'center',
        width: 200,
        fixed: 'right',
        formatter: (row) => {
          const getHref = (clickEvent, text) => {
            const options = {
              style: 'color:red;padding: 0 5px;cursor:pointer;',
              on: {
                click: () => clickEvent(row)
              }
            };
            return vm.$createElement('a', options, text);
          };
          const links = [getHref(vm.goToDurationManage, '存续列表')];
          if (row.isProxy === 1) return vm.$createElement('div', {}, links);
          switch (row.productType) {
            case '私募股权':
              links.push(getHref(vm.goToBenefitList, '收益分配明细'));
              break;
            case '类固收':
              links.push(getHref(vm.goToBenefitList, '付息明细'));
              break;
          }
          return vm.$createElement('div', {}, links);
        }
      }
    },
    {
      label: '序号',
      dataKey: 'tradeId',
      props: {
        width: 140,
        formatter: (row, column, cellValue, index) => {
          const { currentPageNo, pageSize } = vm.paginationState;
          return (currentPageNo - 1) * pageSize + index + 1;
        }
      }
    },
    {
      label: '产品名称',
      dataKey: 'productName',
      props: {}
    },
    {
      label: '产品简称',
      dataKey: 'productNameShort',
      props: {
        align: 'left'
      }
    },
    {
      label: '产品类型',
      dataKey: 'productType',
      props: {
      }
    },
    {
      label: '存续人数',
      dataKey: 'pinSum',
      props: {
        width: 70,
        align: 'right'
      }
    },
    {
      label: '存续份额(份)',
      dataKey: 'durationShare',
      props: {
        align: 'right',
        width: 150,
        formatter: row => {
          return vm.$utils.emptyableValue(row.durationShare, (val) => {
            return vm.$utils.number.formatMoney(val, 2, 0);
          });
        }
      }
    },
    {
      label: '存续金额(元)',
      dataKey: 'durationAmount',
      props: {
        align: 'right',
        formatter: row => {
          return vm.$utils.emptyableValue(row.durationAmount, (val) => {
            return vm.$utils.number.formatMoney(val, 2, 0);
          });
        }
      }
    }
  ]
};
