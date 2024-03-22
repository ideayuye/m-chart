import { RadarChart } from "./src/RadarChart";

const dimension = [
  { name: "客厅环境", max: 100 },
  { name: "全屋家具", max: 100 },
  { name: "卫浴空间", max: 100 },
  { name: "厨房空间", max: 100 },
  { name: "起居卧室", max: 100 },
  { name: "肢体功能", max: 100 },
];

const values = [42, 30, 20, 35, 50, 18];

function drawFn() {
  const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let context = canvas.getContext("2d");
    if (context) {
      const mx = width * 0.5;
      const my = height * 0.5;
      context.fillStyle = "#EBEFF2";
      context.fillRect(0, 0, width, height);
      context.translate(mx, my);
      const radarChart = new RadarChart(context, dimension, values, 280);
      radarChart.drawBg();
      radarChart.drawScale();
      radarChart.drawDimensions();
      radarChart.drawValue();
      // context.draw();
    }
  }
}

drawFn();
