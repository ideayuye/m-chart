// 维度 满分
// { name: 'Sales', max: 6500 },
// 各项 得分
// value: [4200, 3000, 20000, 35000, 50000, 18000],
// 根据维度计算展示位置

// function drawPath(context, drawFn) {
//   context.beginPath();
//   drawFn(context);
//   context.closePath();
// }

// 帮我绘制指定宽高的圆角矩形
function drawRect(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  borderRadius: number,
  x: number,
  y: number
) {
  // 创建路径
  context.beginPath();

  // 绘制圆角矩形，需要传入四个点以定义圆角的位置和大小
  context.moveTo(x + borderRadius, y);
  context.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
  context.arcTo(
    x + width,
    y + height,
    x + width - borderRadius,
    y + height,
    borderRadius
  );
  context.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
  context.arcTo(x, y, x + borderRadius, y, borderRadius);

  // 填充或描边圆角矩形（这里假设填充并设置颜色）
  context.fillStyle = "#ddd";
  context.fill();

  // 关闭路径（可选，但在绘制完图形后关闭路径是一种好的实践）
  context.closePath();
}

// 帮我写个函数用户canvas的api绘制文本，x、y是文本的中心位置, context是canvas的上下文
function drawText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number
) {
  // 设置文本样式（如果需要的话）
  context.font = "12px Arial"; // 字体大小和类型
  context.textAlign = "center";
  context.textBaseline = "middle";
  // 获取文本的宽度和高度，以便计算文本中心点坐标
  const metrics = context.measureText(text);
  const textWidth = metrics.width;
  const textHeight = parseInt(context.font); // 这里假设字体大小为整数，否则需要更精确的方法获取字体高度

  // 计算文本左上角的位置（以文本中心为基准）
  const centerX = x;
  const centerY = y; // 注意这里通常是以基线为基准定位，所以y轴会偏上一些，具体数值根据字体大小和样式调整
  const rw = textWidth + 16;
  const rh = textHeight + 8;
  const ox = x - rw / 2;
  const oy = y - rh / 2 - 1;
  const borderRadius = rh * 0.5;
  drawRect(context, rw, rh, borderRadius, ox, oy);
  context.fillStyle = "black"; // 颜色
  // 绘制文本
  context.fillText(text, centerX, centerY);
}

class Label {
  constructor() {}
}

export class RadarChart {
  axises: any[] = [];
  labels: any[] = [];
  context: CanvasRenderingContext2D;
  dimension: any[];
  values: any[];
  size: number;
  radius: number;
  bgRadius: number;
  constructor(
    context: CanvasRenderingContext2D,
    dimension: any[],
    values: any[],
    size: number
  ) {
    this.context = context;
    this.dimension = dimension;
    this.values = values;
    this.size = size;
    this.radius = size * 0.9 * 0.5;
    this.bgRadius = size * 0.6 * 0.5;

    // 计算每个维度文本展示的位置
    this.labels = this.calculate();
    // 绘制维度文本
    // 计算每个轴的位置
    // 绘制轴线
  }

  get num() {
    return this.dimension.length;
  }

  get angle() {
    return ((360 / this.num) * Math.PI) / 180;
  }

  calculate() {
    const num = this.num;
    const angle = this.angle;
    return this.dimension.map((item, index) => {
      const x = Math.floor(Math.sin(angle * index) * this.radius);
      const y = Math.floor(-Math.cos(angle * index) * this.radius);
      return {
        title: item.name + ":" + this.values[index],
        x,
        y,
      };
    });
  }

  drawValue() {
    const num = this.num;
    const angle = this.angle;
    const points = this.values.map((item, index) => {
      const max = this.dimension[index].max;
      const r = (this.bgRadius * item) / max;
      const x = Math.floor(Math.sin(angle * index) * r);
      const y = Math.floor(-Math.cos(angle * index) * r);

      return {
        x,
        y,
      };
    });
    this.context.beginPath();
    points.forEach((p, i) => {
      if (i === 0) {
        this.context.moveTo(p.x, p.y);
        return;
      }
      this.context.lineTo(p.x, p.y);
    });
    this.context.closePath();
    // this.context.stroke()
    const middle = Math.ceil(points.length * 0.5);
    const gradient = this.context.createLinearGradient(
      points[0].x,
      points[0].y,
      points[middle].x,
      points[middle].y
    );
    // // Add three color stops
    gradient.addColorStop(0, "#FECF65");
    gradient.addColorStop(1, "#FF8D78");
    this.context.fillStyle = gradient;
    this.context.fill(); // 填充闭合区域
    points.forEach((p) => {
      this.context.beginPath();
      this.context.arc(p.x, p.y, 3, 0, 2 * Math.PI, true);
      this.context.fillStyle = "#384855";
      this.context.fill();
      this.context.closePath();
    });
  }

  drawScale() {
    const max = this.dimension[0]?.max || 100;
    const segment = 10;
    const scaleNum = parseInt(max / segment);
    for (let i = 1; i < scaleNum; i++) {
      this.context.beginPath();
      this.context.strokeStyle = "#F2F5F6";
      this.context.arc(0, 0, (this.bgRadius * i) / scaleNum, 0, 2 * Math.PI);
      this.context.stroke();
      this.context.closePath();
    }
  }

  drawDimensions() {
    this.labels.forEach((item, index) => {
      drawText(this.context, item.title, item.x, item.y);
      const toX = item.x * 0.75;
      const toY = item.y * 0.75;
      this.context.beginPath();
      this.context.strokeStyle = "#F2F5F6";
      this.context.moveTo(0, 0);
      this.context.lineTo(toX, toY);
      this.context.closePath();
      this.context.stroke();
      this.context.closePath();

      this.context.beginPath();
      this.context.fillStyle = "#D1D6DA";
      this.context.arc(toX, toY, 5, 0, 2 * Math.PI);
      this.context.fill();
      this.context.strokeStyle = "#F2F5F6";
      this.context.arc(toX, toY, 3, 0, 2 * Math.PI);
      this.context.stroke();
      this.context.closePath();
    });
  }

  drawBg() {
    this.context.beginPath();
    this.context.arc(0, 0, this.bgRadius, 0, 2 * Math.PI);
    this.context.fillStyle = "#dddddd";
    this.context.fill();
    this.context.closePath();
  }
}
