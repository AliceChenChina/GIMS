import Vue from 'vue';
import util from '@/utils';
import { initPaginationAndTableState } from '@/store/mutations';
import myConsumerVisitListInitialize from '@/store/pageConf/myConsumer/myConsumerVisitList';
import myConsumerListState from '@/store/pageConf/myConsumer/myConsumerList';
import myConsumerAddForm from '@/store/pageConf/myConsumer/myConsumerAddForm';
import { jdInfo, followInfo, leadsInfo, linkInfo, AddLinkForm } from '@/store/pageConf/myConsumer/myConsumerViewState';

export const mutations = {
  /*
   理财师客户模块客户拜访列表初始化
 */
  COMMIT_VIST_LIST_VIEWER_STATE(state, data) {
    state.visitListState = initPaginationAndTableState(myConsumerVisitListInitialize);
  },
  /*
  /*
  理财师客户模块客户拜访列表
 */
  SET_VISIT_LIST(state, data) {
    Vue.set(state.visitListState, 'tableData', data);
  },
  // 我的客户列表 -- 视图数据
  COMMIT_MY_CONSUMER_LIST_STATE(state) {
    state.myConsumerListState = initPaginationAndTableState(myConsumerListState);
  },
  // 我的客户列表 -- 数据
  SET_MY_CONSUMER_LIST(state, data) {
    Vue.set(state.myConsumerListState, 'tableData', data);
  },
  // 新增客户
  COMMIT_DECLARATION_FORM_VIEWER(state) {
    Vue.set(state.myConsumerInfoState, 'fields', myConsumerAddForm.createFormDatas);
    Vue.set(state.myConsumerInfoState, 'initData', myConsumerAddForm.initData);
  },
  // 得到新增客户前验证客户信息状态
  GET_PREPOSE_ADD_STATE(state, res) {
    Vue.set(state.preposeAddState, 'code', res.code);
    Vue.set(state.preposeAddState, 'message', res.message);
  },
  // 理财师客户管理 -- 获取基础信息
  GET_CONSUMER_BASIC_INFO(state, res) {
    res.contact = res.oriContact;
    res.isDjTrade = res.customerDto ? res.customerDto.isDjTrade === 0 ? '否' : res.customerDto.isDjTrade === 1 ? '是' : '-' : '-';
    if (res.source !== 1 && res.source !== 2 && res.source !== 3) {
      res.source = '';
    }
    state.myConsumerInfoState.initData = res;
    const areaAddress = res.province ? res.province.split(',') : [];
    Vue.set(state.myConsumerInfoState.initData, 'areaAddress', areaAddress);
    state.myConsumerInfoState.initData.timeless = (res.timeless === 1);
  },
  // 理财师客户管理 -- 获取京东客户详情
  GET_JD_INFO(state, res) {
    state.myConsumerInfoState.jdInfo = jdInfo(res);
    Vue.set(state.myConsumerInfoState, 'followInfoTableData', res.customerVisitDtoList);
    Vue.set(state.myConsumerInfoState, 'leadsInfoTableData', res.userAppointmentDtoList);
  },
  // 理财师客户管理 -- 获取联系方式
  GET_CONSUMER_LINK_INFO(state, res) {
    Vue.set(state.myConsumerInfoState, 'linkInfoTableData', res.records);
    if (state.myConsumerInfoState.linkInfoTableData.length > 0) {
      state.myConsumerInfoState.linkInfoTableData.map(row => {
        let linkAddreess = '';
        if (row.prov) {
          linkAddreess += row.prov;
        }
        if (row.city) {
          linkAddreess += row.city;
        }
        if (row.area) {
          linkAddreess += row.area;
        }
        if (row.address) {
          linkAddreess += row.address;
        }
        row.linkAddreess = linkAddreess;
      });
    }
  },
  // 京东信息视图数据
  COMMIT_JD_VIEWER(state) {
    Vue.set(state.myConsumerInfoState, 'jdInfo', jdInfo);
    Vue.set(state.myConsumerInfoState, 'followInfo', followInfo);
    Vue.set(state.myConsumerInfoState, 'leadsInfo', leadsInfo);
    Vue.set(state.myConsumerInfoState, 'linkInfo', linkInfo);
  },
  // 新增更多联系方式
  COMMIT_LINK_FORM_VIEWER(state) {
    Vue.set(state.myConsumerInfoState, 'linkForm', AddLinkForm.createFormDatas);
    Vue.set(state.myConsumerInfoState, 'likInitData', AddLinkForm.initData);
  },
  GET_MANAGE_ASSETS_LIST_DATA(state, data) {
    const finalData = [];
    if (data && data.length > 0) {
      data.forEach(itemData => {
        const finalDataItem = {};
        const title = itemData.productNameShort ? `${itemData.productName}(${itemData.productNameShort})` : itemData.productName;
        finalDataItem.title = title;
        finalDataItem.productId = itemData.productId;
        finalDataItem.btnName = '查看投后报告';
        finalDataItem.customerCapitalList = itemData.customerCapitalList;
        finalDataItem.elements = [];
        if (itemData.productType === 'fixed_income') {
          finalDataItem.productType = 'fixed_income';
          finalDataItem.elements[0] = {
            eleName: '预计到期日:',
            eleVal: util.emptyableValue(itemData.expectedDueDate)
          };
        }
        if (itemData.productType === 'secondary_market') {
          finalDataItem.productType = 'secondary_market';
          finalDataItem.elements[0] = {
            eleName: '最近申购开放日:',
            eleVal: util.emptyableValue(itemData.subscribeOpenDays)
          };
          finalDataItem.elements[1] = {
            eleName: '最近赎回开放日:',
            eleVal: util.emptyableValue(itemData.redemptionOpenDays)
          };
        }
        if (itemData.productType === 'equity') {
          finalDataItem.productType = 'equity';
          finalDataItem.elements[0] = {
            eleName: '成立日:',
            eleVal: util.emptyableValue(itemData.subscribeOpenDays)
          };
          finalDataItem.elements[1] = {
            eleName: '产品期限:',
            eleVal: util.emptyableValue(itemData.productPeriod)
          };
        }
        finalData.push(finalDataItem);
      });
    }
    state.manageAssetsListState = finalData;
  },
  GET_TOTAL_ASSETS_LIST_DATA(state, data) {
    const finalData = [];
    if (data && data.length > 0) {
      data.forEach(itemData => {
        const finalDataItem = {};
        finalDataItem.titleLeft = itemData.holdingTypeName;
        finalDataItem.titleRight = itemData.typeAmount ? util.number.formatMoney(itemData.typeAmount, 2, false) : itemData.message;
        finalDataItem.contenData = [];
        itemData.holdingList = itemData.holdingList ? itemData.holdingList : [];
        if (itemData.holdingList && itemData.holdingList.length > 0) {
          if (itemData.holdingType !== 'PRIVATE_HOLD') {
            itemData.holdingList.forEach(holdingListItem => {
              const eleItem = {};
              eleItem.contentItemTitle = holdingListItem.productName ? holdingListItem.productName : '-';
              const tradeAmount = holdingListItem.tradeAmount ? util.number.formatMoney(holdingListItem.tradeAmount, 2, false) : '-';
                eleItem.spanArr = [
                  { labelName: '持有金额:', labelVal: tradeAmount }
                ];
              finalDataItem.contenData.push(eleItem);
            })
            finalData.push(finalDataItem);
            return false;
          }
          itemData.holdingList.forEach(holdingListItem => {
            const eleItem = {};
            eleItem.contentItemTitle = holdingListItem.skuName + '(' + holdingListItem.skuShortName + ')';
            const tradeAmount = holdingListItem.tradeAmount ? util.number.formatMoney(holdingListItem.tradeAmount, 2, false) : '-';
            if (holdingListItem.productType === '1') {
              // 私募股权
              eleItem.spanArr = [
                { labelName: '持有金额:', labelVal: tradeAmount },
                { labelName: '确认日期:', labelVal: holdingListItem.confirmDate ? holdingListItem.confirmDate.substring(0, 10) : '-' },
                {
                  labelName: '最近收益分配日:', labelVal: holdingListItem.latestInterestDate ? holdingListItem.latestInterestDate : '-'
                },
                {
                  labelName: '分配金额:', labelVal: holdingListItem.interestTotalAmount ? util.number.formatMoney(holdingListItem.interestTotalAmount, 2, false) : '-'
                }
              ];
            }
            if (holdingListItem.productType === '2') {
              // 类固收
              eleItem.spanArr = [
                { labelName: '持有金额:', labelVal: tradeAmount },
                { labelName: '起息日:', labelVal: holdingListItem.interestDate ? holdingListItem.interestDate.substring(0, 10) : '-' },
                {
                  labelName: '最新付息日:', labelVal: holdingListItem.latestInterestDate ? holdingListItem.latestInterestDate.substring(0, 10) : '-'
                },
                {
                  labelName: '付息金额:', labelVal: holdingListItem.interestTotalAmount ? util.number.formatMoney(holdingListItem.interestTotalAmount, 2, false) : '-'
                }
              ];
            }
            if (holdingListItem.productType === '3') {
              const navDate = holdingListItem.navDate ? util.transferTimeToMonthDate(holdingListItem.navDate) : '-';
              const newNav = `最新净值(${navDate}):`;
              // 阳光私募
              eleItem.spanArr = [
                { labelName: '持有金额:', labelVal: tradeAmount },
                { labelName: newNav, labelVal: util.emptyableValue(holdingListItem.nav) },
                {
                  labelName: '持有份额:', labelVal: holdingListItem.holdShare ? util.number.formatMoney(holdingListItem.holdShare, 2, false) : '-'
                },
                {
                  labelName: '买入均价:', labelVal: util.number.keepFourDecimal(holdingListItem.buyAvgPrice)
                }
              ];
            }
            finalDataItem.contenData.push(eleItem);
          })
        }
        finalData.push(finalDataItem);
      });
    }
    state.totalAssetsListState = finalData;
  }
};
