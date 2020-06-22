 // 报单历史列表视图数据
 export default {
   filterOptions: {},
   filterOptionOther: vm => [
     [
       {
         labelName: '客户名称',
         tagName: 'el-input',
         modelName: 'customerName',
         props: {
           clearable: true
         }
       },
       {
         labelName: '理财师',
         tagName: 'el-input',
         modelName: 'salesName',
         props: {
           clearable: true
         }
       },
       {
         labelName: '报单状态',
         tagName: 'el-select',
         modelName: 'status',
         props: {
           clearable: true
         },
         options: vm.statusArgsWithElOptionsTag('trade_indent_status')
       },
       {
         labelName: '报单类型',
         tagName: 'el-select',
         modelName: 'tradeType',
         props: {
           clearable: true
         },
         options: [
           {
             label: '认购',
             value: '10'
           },
           {
             label: '申购',
             value: '20'
           }
         ]
       }
     ],
     [
       {
         labelName: '报单日期',
         tagName: 'el-date-picker',
         modelName: 'bookingTimeStart',
         props: {
           clearable: true,
           placeholder: '开始时间',
           'value-format': 'yyyy-MM-dd 00:00:00'
         }
       },
       {
         labelName: '--',
         tagName: 'el-date-picker',
         modelName: 'bookingTimeEnd',
         props: {
           clearable: true,
           placeholder: '结束时间',
           'value-format': 'yyyy-MM-dd 23:59:59'
         }
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
               icon: 'el-icon-refresh-left'
             },
             eventOn: {
               click: vm.doDefaultReset
             }
           }
         ]
       }
     ]
   ],
   filterModel: {},
   tableColumn: {
   },
   tableColumnOther: vm => [
     {
       label: '操作',
       props: {
         align: 'center',
         width: 100,
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
             getHref(vm.check, '查看')
           ];
           return vm.$createElement('div', {}, links);
         }
       }
     },
     {
       label: '理财师',
       dataKey: 'salesName',
       props: {
         width: 100
       }
     }
   ]
 };
