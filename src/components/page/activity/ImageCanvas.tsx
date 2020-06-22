import { CreateElement } from 'vue';
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';

export interface HotCoordInfo {
  startPos: CoordArray, // 左上角顶点坐标[xx, xx]
  endPos: CoordArray // 右下角顶点坐标[xx, xx]
}

interface DrawConfig {
  canvasLineWidth: number;
  canvasLineColor: string; // 默认边框色
  canvasFillColor: string; // 默认填充色
  canvasLineDash: [number];
}

type CoordArray = [number, number];

class CanvasLayer {
  canvas!: HTMLCanvasElement;
  canvasContext!: CanvasRenderingContext2D;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvas = document.createElement('canvas') as HTMLCanvasElement;
    this.canvas.width = canvasWidth; // 实际图片大小
    this.canvas.height = canvasHeight;
    this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  // 画矩形，x和y是相对canvas的实际坐标（未经过缩放）
  drawRect(x: number, y: number, w: number, h: number, drawConfig: DrawConfig) {
    if (!this.canvasContext) {
      throw new Error('canvas context is null');
    }
    this.canvasContext.beginPath();
    this.canvasContext.lineWidth = drawConfig.canvasLineWidth;
    this.canvasContext.strokeStyle = drawConfig.canvasLineColor;
    this.canvasContext.fillStyle = drawConfig.canvasFillColor;
    this.canvasContext.setLineDash(drawConfig.canvasLineDash);
    this.canvasContext.rect(x, y, w, h);
    this.canvasContext.stroke();
    this.canvasContext.fill();
  }

  // 画每个热区的标签，x和y是相对canvas的实际坐标（未经过缩放）
  drawLabel(x: number, y: number, number: number, fillStyle = '#fff') {
    if (!this.canvasContext) {
      throw new Error('canvas context is null');
    }
    this.canvasContext.fillStyle = fillStyle;
    this.canvasContext.font = 'bold 40px serif';
    this.canvasContext.beginPath();
    this.canvasContext.rect(x, y, 50, 50);
    this.canvasContext.fill();
    this.canvasContext.fillStyle = '#000';
    this.canvasContext.fillText(number.toString(), x + 15, y + 40);
  }
}

enum HotEditPos {
  miny, minx, maxy, maxx, none
}

@Component
export class ImageHotEditCanvas extends Vue {
  @Prop({ type: String, default: '' }) imgSrc!: string;

  drawLayer: CanvasLayer = {} as CanvasLayer;
  backgroundLayer: CanvasLayer = {} as CanvasLayer;
  fixedRectLayer: CanvasLayer = {} as CanvasLayer;
  isDrawing = false;
  canDrag = false;
  isDraging = false;
  dragStartOffset!: CoordArray;
  onEditingMouseMoving = false;
  editingControlPos: HotEditPos = HotEditPos.none;
  drawStartPos!: CoordArray;
  drawEndPos!: CoordArray;
  hotCoordInfoArray: Array<HotCoordInfo> = [];
  // 当前正在编辑的区域信息
  editCoordIndex = 0;
  isLoad = false; // canvas是否加载完成
  choosed = false;
  drawHotRectConfig: DrawConfig = {
    canvasLineWidth: 5,
    canvasLineColor: '#ccc', // 默认边框色
    canvasFillColor: 'rgba(0, 0, 0, 0.3)', // 默认填充色
    canvasLineDash: [8]
  };
  img!: HTMLImageElement;
  beforeDrawMouseDown!: Function;
  canvasWrapper!: HTMLDivElement;

  get hotEditingInfoCoord(): HotCoordInfo {
    return this.hotCoordInfoArray[this.editCoordIndex];
  }

  initImgCanvas() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.imgSrc;
    this.img = img;
    img.onload = () => {
      // 在图片加载完成后绘图，避免空白和断断续续加载
      this.backgroundLayer = new CanvasLayer(img.width, img.height);
      this.drawLayer = new CanvasLayer(img.width, img.height);
      this.fixedRectLayer = new CanvasLayer(img.width, img.height);
      // 由图片按css canvas缩放后大小设定canvasWrapper长宽
      this.backgroundLayer.canvasContext.imageSmoothingQuality = 'high';
      this.backgroundLayer.canvasContext.drawImage(img, 0, 0);
      this.canvasWrapper = this.$refs['canvas_ele'] as HTMLDivElement;
      this.canvasWrapper.appendChild(this.backgroundLayer.canvas);
      this.canvasWrapper.appendChild(this.fixedRectLayer.canvas);

      this.registerChooseMouseEvent(); // 鼠标选择事件
      this.isLoad = true;
      // todo 画出当前热区所有信息

      this.drawFixedRects();
      this.emitCanvasLoad();
    };
  }

  // canvas加载完毕事件（包含图片事件）
  @Emit('canvasLoad')
  emitCanvasLoad() {}

  // canvas被选择触发事件
  @Emit('canvasChoosed')
  emitCanvasChoosed() {}

  @Emit('coordAdded')
  emitCoordAdded() {
    return this.hotCoordInfoArray[this.hotCoordInfoArray.length - 1];
  }

  @Emit('editCoordUpdated')
  emitEditCoordUpdated() {
    return this.hotEditingInfoCoord;
  }

  @Watch('choosed')
  onChoosedChange(val: boolean) {
    if (val) {
      this.emitCanvasChoosed();
      this.drawChoosed();
    } else {
      this.clearRect(this.fixedRectLayer);
    }
  }

  // 初始化热区坐标点
  setHotCoordArray(coordArray: Array<HotCoordInfo>) {
    this.hotCoordInfoArray = coordArray;
  }

  // 编辑坐标，传入index
  editCoord(editCoordIndex: number) {
    this.editCoordIndex = editCoordIndex;
    this.setDrawLayer();
    this.registerEditMouseEvent();
    // 操作完成后移除drawLayer
  }

  setAddCoordDrawLayer() {
    this.setDrawLayer();
    this.registerDrawMouseEvent();
    // 操作完成后移除drawLayer
  }

  // 设置开启画热区事件
  setDrawLayer() {
    (this.$refs['canvas_ele'] as HTMLDivElement).appendChild(this.drawLayer.canvas);
  }

  // 移除绘图层
  removeDrawLayer() {
    this.drawLayer.canvas.remove();
  }

  setCanvasWrapperHeight(clientWidth: number) {
    this.canvasWrapper.style.height = (this.img.height * (clientWidth / 1125)).toString() + 'px';
  }

  registerDrawMouseEvent() {
    const layer = this.drawLayer;
    layer.canvas.addEventListener('mouseup', this.handleDrawMouseUp);
    layer.canvas.addEventListener('mousedown', this.handleDrawMouseDown);
    layer.canvas.addEventListener('mousemove', this.handleDrawMouseMove);
  }

  registerChooseMouseEvent() {
    const layer = this.fixedRectLayer;
    layer.canvas.addEventListener('mouseup', this.handleChoose);
  }

  registerEditMouseEvent() {
    const layer = this.drawLayer;
    layer.canvas.addEventListener('mouseup', this.handleEditMouseUp);
    layer.canvas.addEventListener('mousedown', this.handleEditMouseDown);
    layer.canvas.addEventListener('mousemove', this.handleEditMouseMove);
  }

  // 编辑的四个顶点和直线选择事件
  handleEditMouseDown(e: any) {
    if (this.canDrag) {
      this.isDraging = true;
      // 记录当前点下的位置offset
      const offsetX = e.offsetX - this.drawStartPos[0];
      const offsetY = e.offsetY - this.drawStartPos[1];
      this.dragStartOffset = [offsetX, offsetY];
    } else if (this.editingControlPos !== HotEditPos.none) {
      this.onEditingMouseMoving = true;
    }
  }

  updateDrag(e: any) {
    const editingPos = { ...this.hotEditingInfoCoord };
    const width = Math.abs(editingPos.startPos[0] - editingPos.endPos[0]);
    const height = Math.abs(editingPos.startPos[1] - editingPos.endPos[1]);
    const x = e.offsetX - this.dragStartOffset[0];
    const y = e.offsetY - this.dragStartOffset[1];
    this.clearRect(this.drawLayer);
    this.drawLayer.drawRect(x, y, width, height, this.drawHotRectConfig);
    this.drawStartPos = [x, y];
    this.drawEndPos = [x + width, y + height];
  }

  // 编辑时移动事件
  // 如果没有选中，那么处理鼠标手势事件
  // 否则重绘拖动的位置
  handleEditMouseMove(e: any) {
    const layer = this.drawLayer;
    const moveOffset = 10; // 范围上下10像素
    const minx = this.hotEditingInfoCoord.startPos[0];
    const miny = this.hotEditingInfoCoord.startPos[1];
    const maxx = this.hotEditingInfoCoord.endPos[0];
    const maxy = this.hotEditingInfoCoord.endPos[1];
    const [currentX, currentY] = this.convertMousePos(e.offsetX, e.offsetY);
    if (this.isDraging) {
      this.updateDrag(e);
      return;
    }
    if (currentX >= minx && currentY >= miny && currentX <= maxx && currentY <= maxy) {
      // 在图形区域内可以拖动
      this.canDrag = true;
      this.drawStartPos = this.hotEditingInfoCoord.startPos;
    }
    if (!this.onEditingMouseMoving) {
      if (currentY <= miny + moveOffset && currentY >= miny - moveOffset) {
        if (currentX <= maxx && currentX >= minx) {
          this.editingControlPos = HotEditPos.miny;
          // console.warn('on min y'); // 上边框
          this.drawLayer.canvas.setAttribute('class', 's-resize');
        }
      } else if (currentY <= maxy + moveOffset && currentY >= maxy - moveOffset) {
        if (currentX <= maxx && currentX >= minx) {
          this.editingControlPos = HotEditPos.maxy;
          // console.warn('on max y'); // 下边框
          this.drawLayer.canvas.setAttribute('class', 's-resize');
        }
      } else if (currentX <= maxx + moveOffset && currentX >= maxx - moveOffset) {
        if (currentY <= maxy && currentY >= miny) {
          this.editingControlPos = HotEditPos.maxx;
          // console.warn('on max x'); // 右边框
          this.drawLayer.canvas.setAttribute('class', 'e-resize');
        }
      } else if (currentX <= minx + moveOffset && currentX >= minx - moveOffset) {
        if (currentY <= maxy && currentY >= miny) {
          this.editingControlPos = HotEditPos.minx;
          console.warn('on min x'); // 左边框/
          this.drawLayer.canvas.setAttribute('class', 'e-resize');
        }
      } else {
        this.drawLayer.canvas.setAttribute('class', '');
        this.editingControlPos = HotEditPos.none;
      }
      if (this.editingControlPos !== HotEditPos.none) {
        this.canDrag = false;
      }
    } else {
      // 更新选中的热区区域
      this.drawEndPos = this.convertMousePos(e.offsetX, e.offsetY);
      switch (this.editingControlPos) {
        case HotEditPos.maxx:
          this.drawStartPos = this.hotEditingInfoCoord.startPos;
          this.drawEndPos = [currentX, this.hotEditingInfoCoord.endPos[1]];
          break;
        case HotEditPos.minx:
          this.drawStartPos = this.hotEditingInfoCoord.endPos;
          this.drawEndPos = [currentX, this.hotEditingInfoCoord.startPos[1]];
          break;
        case HotEditPos.miny:
          this.drawStartPos = this.hotEditingInfoCoord.endPos;
          this.drawEndPos = [this.hotEditingInfoCoord.startPos[0], currentY];
          break;
        case HotEditPos.maxy:
          this.drawStartPos = this.hotEditingInfoCoord.startPos;
          this.drawEndPos = [this.hotEditingInfoCoord.endPos[0], currentY];
          break;
      }
      const width = this.drawStartPos[0] - this.drawEndPos[0];
      const height = this.drawStartPos[1] - this.drawEndPos[1];
      this.clearRect(layer);
      layer.drawRect(this.drawEndPos[0], this.drawEndPos[1], width, height, this.drawHotRectConfig);
    }
  }

  // 编辑完成时鼠标事件
  handleEditMouseUp() {
    if (this.isDraging) {
      this.isDraging = false;
    } else if (this.editingControlPos === HotEditPos.none) return;
    // 处理添加热区完成后返回坐标
    this.onEditingMouseMoving = false;
    const coordInfo = this.getCoordInfo();
    const originCoorInfo = { ...this.hotEditingInfoCoord };
    this.hotEditingInfoCoord.startPos = [0, 0];
    this.hotEditingInfoCoord.endPos = [1, 1];
    if (this.hotCoordInfoArray.some((hotInfoExistItem) =>
      this.isAreaCross(hotInfoExistItem, coordInfo))) {
      this.$message.error('热区不能和现有区域交叉');
      this.clearRect(this.drawLayer);
      this.hotEditingInfoCoord.startPos = originCoorInfo.startPos;
      this.hotEditingInfoCoord.endPos = originCoorInfo.endPos;
      return;
    }
    if (this.isOutArea(coordInfo)) {
      this.$message.error('热区不能超出图片区域');
      this.hotEditingInfoCoord.startPos = originCoorInfo.startPos;
      this.hotEditingInfoCoord.endPos = originCoorInfo.endPos;
      this.clearRect(this.drawLayer);
      return;
    }
    this.clearRect(this.drawLayer);
    // 更新当前坐标集合
    this.hotEditingInfoCoord.startPos = coordInfo.startPos;
    this.hotEditingInfoCoord.endPos = coordInfo.endPos;
    this.drawFixedRects();
    this.emitEditCoordUpdated();
  }

  handleChoose(e: any) {
    // 选择事件标红，并且传出事件
    this.choosed = true;
  }

  drawChoosed() {
    const layer = this.fixedRectLayer;
    const drawConfig: DrawConfig = {
      canvasFillColor: 'rgba(0, 0, 0, 0)',
      canvasLineWidth: 10,
      canvasLineColor: 'red',
      canvasLineDash: [0]
    };
    layer.drawRect(10, 10, layer.canvas.width - 20, layer.canvas.height - 20, drawConfig);
  }

  // 绘制hotCoordInfoArray内的所有坐标到展示层
  drawFixedRects() {
    this.clearRect(this.fixedRectLayer);
    for (const index in this.hotCoordInfoArray) {
      if (this.editCoordIndex === parseInt(index)) {
        this.addFixedRect(this.hotCoordInfoArray[index], parseInt(index) + 1, true);
      } else {
        this.addFixedRect(this.hotCoordInfoArray[index], parseInt(index) + 1);
      }
    }
  }

  // 绘制矩形区域
  handleDrawMouseMove(e: any) {
    const layer = this.drawLayer;
    if (this.isDrawing) {
      this.drawEndPos = this.convertMousePos(e.offsetX, e.offsetY);
      const width = this.drawStartPos[0] - this.drawEndPos[0];
      const height = this.drawStartPos[1] - this.drawEndPos[1];
      this.clearRect(layer);
      // 如果width和height是负数转换起点为鼠标移动的位置
      layer.drawRect(this.drawEndPos[0], this.drawEndPos[1], width, height, this.drawHotRectConfig);
    }
  }

  // 鼠标释放结束绘画
  handleDrawMouseUp() {
    this.isDrawing = false;
    const coordInfo = this.getCoordInfo();
    if (this.hotCoordInfoArray.some((hotInfoExistItem) =>
      this.isAreaCross(hotInfoExistItem, coordInfo))) {
      this.$message.error('热区不能和现有区域交叉');
      this.clearRect(this.drawLayer);
      return;
    }
    if (this.isOutArea(coordInfo)) {
      this.$message.error('热区不能超出图片区域');
      this.clearRect(this.drawLayer);
      return;
    }
    this.hotCoordInfoArray.push(coordInfo);
    this.drawFixedRects();
    this.clearRect(this.drawLayer);
    this.emitCoordAdded(); // 通知外部组件坐标更新
  }

  getCoordInfo(): HotCoordInfo {
    const startPos = [Math.min(this.drawStartPos[0], this.drawEndPos[0]),
      Math.min(this.drawStartPos[1], this.drawEndPos[1])
    ] as [number, number];
    const endPos = [Math.max(this.drawStartPos[0], this.drawEndPos[0]),
      Math.max(this.drawStartPos[1], this.drawEndPos[1])
    ] as [number, number];
    return {
      startPos,
      endPos
    };
  }

  // 开始绘制矩形
  handleDrawMouseDown(e: any) {
    if (this.beforeDrawMouseDown instanceof Function) {
      this.beforeDrawMouseDown();
    }
    this.isDrawing = true;
    this.drawStartPos = this.convertMousePos(e.offsetX, e.offsetY);
  }

  clearRect(layer: CanvasLayer) {
    layer.canvasContext!.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
  }

  // 绘制热区展示层canvas，添加热区标签
  private addFixedRect(hotCoordItem: HotCoordInfo, labelNumber: number, isOrange = false) {
    const width = hotCoordItem.endPos[0] - hotCoordItem.startPos[0];
    const height = hotCoordItem.endPos[1] - hotCoordItem.startPos[1];
    this.fixedRectLayer.drawRect(hotCoordItem.startPos[0], hotCoordItem.startPos[1], width, height, this.drawHotRectConfig);
    this.fixedRectLayer.drawLabel(hotCoordItem.startPos[0], hotCoordItem.startPos[1], labelNumber, isOrange ? 'orange' : '#fff');
  }

  // 判断区域是否相交
  isAreaCross(origin: HotCoordInfo, target: HotCoordInfo) {
    const minx = Math.max(origin.startPos[0], target.startPos[0]);
    const miny = Math.max(origin.startPos[1], target.startPos[1]);
    const maxx = Math.min(origin.endPos[0], target.endPos[0]);
    const maxy = Math.min(origin.endPos[1], target.endPos[1]);
    // 如果两个矩形不相交，那么计算得到的点对坐标必然满足 minx > maxx || miny > maxy
    return !(minx > maxx || miny > maxy);
  }

  isOutArea(target: HotCoordInfo) {
    return target.startPos[0] < 0 || target.startPos[1] < 0 ||
      target.endPos[0] > 1125 || target.endPos[1] > this.img.height;
  }

  // 转为鼠标坐标到相对于canvas实际大小的坐标
  convertMousePos(x: number, y: number): CoordArray {
    return [x, y];
  }

  mounted() {
    this.initImgCanvas();
  }

  render(h: CreateElement) {
    return (<div class="canvas-wrapper" ref="canvas_ele">
      </div>);
  }
}
