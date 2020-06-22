/*
浮动横向滚动插件
 */
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { CreateElement } from 'vue';

interface XScrollerConf {
  subscriber: HTMLDivElement, // 需要被滚动条操作的滚动元素
  path: string, // 当前需要滚动的页面路径
  scrollLeft: number, // 当前滚动的位置
  onXScrollCallBack?: Function // 滚动回调，传入的参数为按照订阅者比例缩放过的scrollLeft值
}

interface XScrollerState {
  subscriber: HTMLDivElement, // 需要被滚动条操作的滚动元素
  scrollLeft: number, // 当前滚动的位置
  scrollCtlLeft: number,
  onXScrollCallBack?: Function
}

@Component
export default class XScroller extends Vue {
  // 注入此服务到全局属性
  // 浮动主要参数：
  contentWrapper!: HTMLDivElement;
  scrollConfState: { [key: string]: XScrollerState } = {};
  wrapperScrollHeight: number = 0;
  wrapperScrollPos: number = 0;
  isBottom = false;
  isInitScroll = false;

  get subscriber() {
    if (!this.scrollConfState[this.currentPagePath]) return null;
    return this.scrollConfState[this.currentPagePath].subscriber;
  }

  get hasSubscriber() {
    return !!this.scrollConfState[this.currentPagePath];
  }

  get currentScrollState() {
    return this.scrollConfState[this.currentPagePath];
  }

  get scroller() {
    // 组件滚动条
    return this.$refs.scroller as HTMLDivElement;
  }

  get scrollerCtl() {
    // 包含滚动条的div
    return this.$refs.scroller_ctl as HTMLDivElement;
  }

  get currentPagePath() {
    return this.$route.path;
  }

  get onXScrollCallback() {
    // 滚动回调，传入的参数为按照订阅者比例缩放过的scrollLeft值
    if (!this.scrollConfState[this.currentPagePath]) return null;
    return this.scrollConfState[this.currentPagePath].onXScrollCallBack;
  }

  get isShowScroller() {
    return this.hasSubscriber && !this.isBottom;
  }

  get scrollerVisibleStyle() {
    if (this.isShowScroller) {
      return {
        opacity: 1
      };
    }
    return {
      opacity: 0
    };
  }

  addXScroll(scrollConf: XScrollerConf) {
    this.$set(this.scrollConfState, scrollConf.path, scrollConf);
    setTimeout(() => {
      this.initScrollEvent();
    });
  }

  mounted() {
    setTimeout(() => {
      this.regWrapperScrollEvent();
    }, 1000);
  }

  initScrollEvent() {
    if (!this.subscriber) return;
    this.scroller.style.width = this.subscriber!.scrollWidth + 'px';
    this.scrollerCtl.scrollLeft = 0;
    setTimeout(() => {
      this.wrapperScrollHeight = this.contentWrapper.scrollHeight;
      this.setHideBottomScroll();
    });
    if (this.isInitScroll) return;
    this.isInitScroll = true;
    this.scrollerCtl.addEventListener('scroll', (e) => {
      // 更新订阅的组件横向滚动位置
      // 直接让订阅者滚动，或者向订阅者发布滚动事件位置
      const subscriberScrollLeft = this.subscriber!.scrollWidth - this.subscriber!.clientWidth;
      const scrollDivScrollLeft = this.scrollerCtl.scrollWidth - this.scrollerCtl.clientWidth;
      // 计算吸底滚动条与被滚动元素滚动系数，直接取值会导致吸底滚动条无法让订阅者滚到底
      this.currentScrollState.scrollCtlLeft = this.scrollerCtl.scrollLeft;
      const k = subscriberScrollLeft / scrollDivScrollLeft;
      const scrollLeftVal = (e.target as HTMLDivElement).scrollLeft * k;
      this.subscriber!.scrollLeft = scrollLeftVal;
      this.currentScrollState.scrollLeft = scrollLeftVal;
      if (typeof this.onXScrollCallback === 'function') {
        this.onXScrollCallback(scrollLeftVal);
      }
    });
  }

  regWrapperScrollEvent() {
    // 监听y滚动容器，到底部隐藏浮动滚动条组件
    this.contentWrapper.addEventListener('scroll', () => {
      if (!this.subscriber) return;
      this.setHideBottomScroll();
      this.wrapperScrollPos = this.contentWrapper.scrollTop;
    });
  }

  setHideBottomScroll() {
    // 当滚动到屏幕底部时候隐藏滚动条
    const viewPortHeight = document.documentElement.clientHeight;
    const viewPortBottom = (this.subscriber!.getBoundingClientRect() as DOMRect).bottom;
    this.isBottom = viewPortBottom < viewPortHeight;
  }

  @Watch('$route.path')
  handleRouteChange() {
    // 路由改变的时候，提取并激活当前路由对应的滚动配置，并且恢复滚动的位置
    setTimeout(() => {
      if (this.hasSubscriber) {
        // 恢复页面离开之前的位置
        requestAnimationFrame(() => {
          this.scroller.style.width = this.subscriber!.scrollWidth + 'px';
          this.subscriber!.scrollLeft = this.currentScrollState.scrollLeft;
          requestAnimationFrame(() => {
            this.scrollerCtl.scrollLeft = this.currentScrollState.scrollCtlLeft;
            this.wrapperScrollHeight = this.contentWrapper.scrollHeight;
            this.setHideBottomScroll();
          });
        });
      }
    });
  }

  @Watch('isBottom')
  handleShowBottomScroller() {
    if (!this.isBottom) {
      // 获取最新订阅者滚动条位置
      const subscriberScrollLeft = this.subscriber!.scrollWidth - this.subscriber!.clientWidth;
      const scrollDivScrollLeft = this.scrollerCtl.scrollWidth - this.scrollerCtl.clientWidth;
      // 计算吸底滚动条与被滚动元素滚动系数，直接取值会导致吸底滚动条无法让订阅者滚到底
      this.currentScrollState.scrollCtlLeft = this.scrollerCtl.scrollLeft;
      const k = subscriberScrollLeft / scrollDivScrollLeft;
      const scrollLeftVal = this.subscriber!.scrollLeft / k;
      this.scrollerCtl!.scrollLeft = scrollLeftVal;
      this.currentScrollState.scrollLeft = scrollLeftVal;
      if (typeof this.onXScrollCallback === 'function') {
        setTimeout(() => {
          this.onXScrollCallback!(this.subscriber!.scrollLeft);
        });
      }
    }
  }

  render(h: CreateElement) {
    return (
      <div class="x-scroll-control" ref="scroller_ctl" style={this.scrollerVisibleStyle}>
        <div class="scroll" ref="scroller" />
      </div>
    );
  }
}
