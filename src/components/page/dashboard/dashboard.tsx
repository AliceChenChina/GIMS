import { Component, Vue } from 'vue-property-decorator';
import './dashboard.scss';
import { State } from 'vuex-class';
import { sysManagerState } from '@/store/modules/systemManager/types';
import DynamicFilter from '@/components/common/dynamicFilter.tsx';
import Calendar from './calendar';
// @ts-ignore
import defaultAvatar from '../../../assets/img/img.jpg';

interface BoardDataItem {
  boardValue: number,
  boardName: string,
  dataUnit: 0 | 1 // 0显示整型，1显示千分位和小数点
}

interface LinkItem {
  funcName: string,
  funcUrl: string,
  funcIcon: string
}

@Component({
  components: {
    DynamicFilter, Calendar
  }
})
export default class Dashboard extends Vue {
  @State('sysManager') sysManagerState!: sysManagerState;
  loading = false;
  dataBoardIntLoading = true;
  linkBoardLoading = false;
  dataBoardArr: Array<BoardDataItem> = [];
  dataBoardNoPermission = false;
  linkBoardArr: Array<LinkItem> = [];

  get userInfo() {
    return this.$store.state.userInfo || {};
  }

  get userImgSrc() {
    if (this.$store.state.userInfo.avatar === 'null') {
      return defaultAvatar;
    }
    return this.$store.state.userInfo.avatar || defaultAvatar;
  }

  created() {
    // 15分钟刷一次看板数据
    this.fetchDataBoard();
    setInterval(() => {
      this.fetchDataBoard();
    }, 1000 * 60 * 15);
    this.fetchCommonFunc();
  }

  async fetchDataBoard() {
    const uri = '/desktop/dataBoard';
    try {
      const rs = await this.$fetch.setParam(uri, {}, 'get').doRequest();
      if (this.dataBoardIntLoading) {
        this.dataBoardIntLoading = false;
        this.dataBoardArr = rs;
      }
      if (rs.length === 0) {
        this.dataBoardNoPermission = true;
      } else {
        this.dataBoardNoPermission = false;
      }
      this.dataBoardArr = rs;
      // this.dataBoardArr = [];
      // // 动画过渡效果延迟
      // setTimeout(() => {
      //   this.dataBoardArr = rs;
      // }, 500);
    } catch (e) {
      this.$message.error('读取看板数据发生错误，请稍后重试');
    }
  }

  async fetchCommonFunc() {
    const uri = '/desktop/commonFunc';
    this.linkBoardLoading = true;
    try {
      this.linkBoardArr = await this.$fetch.setParam(uri, {}, 'get').doRequest();
    } catch (e) {
      this.$message.error('读取看板数据发生错误，请稍后重试');
    }
    this.linkBoardLoading = false;
  }

  buildDataItem(dataItem: BoardDataItem, borderClass) {
    let number = dataItem.boardValue;
    if (dataItem.dataUnit === 1) {
      number = this.$utils.number.formatMoney(number, 2, 0);
    }
    return (
      <div class={ ['data-item', borderClass] }>
        <div class="number">{ number }</div>
        <div class="data-desc">
          {dataItem.boardName}
        </div>
      </div>
    );
  }

  buildLinkItem(linkItem: LinkItem) {
    let url = linkItem.funcUrl;
    if (url.indexOf('http') < 0) {
      url = 'http://' + url;
    }
    return (
      <div class="link-item" onClick={() => {
        window.open(url);
      }}>
        <img src={linkItem.funcIcon} alt=""/>
        <span>{ linkItem.funcName }</span>
      </div>
    );
  }

  render() {
    const colorClassArr = ['border-purple', 'border-blue', 'border-orange', 'border-yellow'];
    return (
      <div class="dashboard">
        <el-card class="dashboard-header">
          <div class="avatar">
            <div class="user-avatar">
              <img src={this.userImgSrc}/>
              <span>{ this.userInfo.userName }，欢迎使用</span>
            </div>
          </div>
        </el-card>
        <el-card class="feature-links">
          <h3>常用功能</h3>
          {
            this.linkBoardArr.length || this.linkBoardLoading
            ? (
                <div class="links-container">
                  {
                    this.linkBoardArr.slice(0, 9).map((item) => {
                      return this.buildLinkItem(item);
                    })
                  }
                </div>
              )
            : (
                <div class="no-permission">
                  <p>暂无权限，请联系管理员开通</p>
                </div>
              )
          }
        </el-card>
        <el-card class="data-board" v-loading={this.dataBoardIntLoading}>
          <h3>数据看板</h3>
          {
            this.dataBoardNoPermission
            ? (
                <div class="no-permission">
                  <p>暂无权限，请联系管理员开通</p>
                </div>
            )
            : (
                <div class="data-container" key="data_container">
                  {
                    this.dataBoardArr.map((item, index) => {
                      return this.buildDataItem(item, colorClassArr[index % 4]);
                    })
                  }
                </div>
            )
          }
        </el-card>
        <calendar />
      </div>
    );
  }
}
