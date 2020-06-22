import { initPaginationAndTableState } from '@/store/mutations';
import { ActivityState } from '@/store/modules/activity/types';

const activityStateData: ActivityState = {
  activityListState: initPaginationAndTableState({}),
  posterListState: initPaginationAndTableState({}),
  articleListState: initPaginationAndTableState({}),
  shareListState: initPaginationAndTableState({}),
  shareDetailListState: initPaginationAndTableState({})
};

export { activityStateData };
