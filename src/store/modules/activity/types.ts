import { ListViewerState } from '@/types/types';
import ActivityVueClass from '@/components/page/activity/activity';
import { HotCoordInfo } from '@/components/page/activity/ImageCanvas';

interface ActivityState {
  activityListState: ListViewerState<ActivityVueClass>,
  posterListState: ListViewerState<ActivityVueClass>,
  articleListState: ListViewerState<ActivityVueClass>,
  shareListState: ListViewerState<ActivityVueClass>,
  shareDetailListState: ListViewerState<ActivityVueClass>
}

// 活动状态枚举
enum ActivityStatus {
  draft = 1,
  online = 2,
  offline = 3
}

// 浏览条件枚举
enum ActivityViewPermissions {
  all = 1, // 所有用户
  onlyLogin = 2, // 需要登陆
  certificatedUser = 3 // 合格投资者
}

enum HotType {
  link = 1,
  reserve = 2
}

enum AppointChannel {
  activityReserve = 2, // 活动预约
  serviceReserve = 3, // 服务预约
  productReserve = 1 // 产品预约
}

enum AppointType {
  onlineReserve = 1, // 线上财富预约
  certificateUser = 2, // 线上合格投资者
  offlineReserve = 3, // 线下财富预约
  oversea = 5, // 海外
  insurance = 7, // 保险
  other = 6 // 其他
}

enum AppointProductType {
  fixed = 1, // 类固收
  stock = 2, // 私募股权
  secondaryMarket = 3, // 阳光私募
  oversea = 4, // 海外资产
  xintuo = 8, // 信托资产
  qsdjh = 7, // 券商大集合
  qsxjh = 6 // 券商小集合
}

enum AppointNumber {
  times3 = 2,
  times1 = 1,
  times1in3Days = 3
}

// 活动对象
export interface ActivityItem {
  id: number,
  remarkName: string,
  activityTitle: string,
  activityLink: string,
  validTime: string,
  createdTimeStr: string,
  createdUser: string,
  activityStatus: ActivityStatus
}
// 海报对象
export interface PosterItem {
  id: number,
  remarkName: string,
  activityTitle: string,
  activityLink: string,
  validTime: string,
  createdTimeStr: string,
  createdUser: string,
  onlineStatus: number,
  cfgPicture: ''
}
// 海报创建表单对象
interface PosterModel {
  id?: number,
  cfgName: string,
  linkUrl: string,
  sharePictureModel: Array<any>,
  cfgPicture: string,
  startTime: string,
  endTime: string,
  onlineStatus:string,
  cfgType: string,
  linkShow: string
}

// 活动创建表单对象
interface ActivityModel {
  id?: number,
  activityTitle: string,
  remarkName: string,
  viewPermissions: ActivityViewPermissions,
  ynShare: 0 | 1 // 0不可以分享，1可以分享
  sharePictureModel: Array<any>, // 和上传框绑定是数组
  sharePicture: string,
  shareContent: string,
  startTime: string,
  endTime: string,
  activityMd: string
  dataType: number
}
// 文章创建表单对象
interface ArticleModel {
  id?: number,
  activityTitle: string,
  remarkName: string,
  viewPermissions: ActivityViewPermissions,
  ynShare: 0 | 1 // 0不可以分享，1可以分享
  sharePictureModel: Array<any>, // 和上传框绑定是数组
  sharePicture: string,
  shareContent: string,
  startTime: string,
  endTime: string,
  activityMd: string
  dataType: number,
  labels: string,
  labelArr: Array<any>
}
// 链接表单对象
interface LinkModel {
  url: string
}

interface HotInfo {
  id?: number,
  hotType: HotType,
  hotCoord: HotCoordInfo,
  jumpUrl: string,
  hotMd: string,
  appointChannel: AppointChannel,
  appointType: AppointType,
  appointProductType: AppointProductType,
  appointNumber: AppointNumber,
  appointName: string
}

interface ActivityPictureItem {
  id?: number, // 图片id
  pictureLink: string,
  bottomFlag: 0 | 1 // 0不吸底1吸低,
  hotInfo: Array<HotInfo>
}

interface ActivityDetail {
  pictureInfo: Array<ActivityPictureItem>,
  id?: number | string // 活动id
}

export {
  ActivityState,
  ActivityStatus,
  ActivityModel,
  ArticleModel,
  PosterModel,
  LinkModel,
  ActivityViewPermissions,
  ActivityDetail,
  ActivityPictureItem,
  HotInfo,
  HotType,
  AppointChannel,
  AppointType,
  AppointProductType,
  AppointNumber
};
