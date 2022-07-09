
//偷懒不用webgl了，用小方块元素来模拟

import { Component, createRef } from "react";
import { initShaders, pointsIntoAttributeByAttributeName } from "../../learnWebGL/utils/glUtils";
import { scanFill } from "../class/EdgeTable2";
import SliderWithInput from "../../v4/components/SliderWithInput";

const canvasWidth = 500;
const canvasHeight = 500;

const colorWhite = 0;
const colorBlack = 1;
const colorYellow = 2;
const colorRed = 3;
const colorBlue = 4;


const maxSideSize = 200;
// const colorLine = new Float32Array([0, 0, 0, 1]);

// async function sleep(time) {
//   console.log('Hello')
//   await _sleep(time)
//   console.log('world!')
// }

// function _sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }


class Point {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
}

class GridCanvas2 extends Component {

  constructor() {
    super();
    this.canvasRef = createRef();
    this.gl = null;
    //构建一个数组，存放每个顶点的坐标和颜色
    this.state = {
      points: [],
      gridSize: 20,
    }

  }

  //* 生命周期函数

  componentDidMount() {

    //防止bug
    if (this.mounted) {
      return;
    }
    this.mounted = true;


    //初始化gl
    let canvas = this.canvasRef.current;
    let gl = canvas.getContext("webgl2");
    // console.log('gl: ', gl);
    this.gl = gl;

    //初始化着色器
    const glsl = String.raw;
    let vshader = glsl`
      attribute vec4 a_Position;
      attribute vec4 a_Color;
      attribute float a_PointSize;
      varying vec4 v_Color;
      void main(){
          gl_Position=a_Position;
          gl_PointSize=a_PointSize;
          v_Color=a_Color;
      }
      `;
    let fshader = glsl`
      precision mediump float;
      varying vec4 v_Color;
      void main(){
          gl_FragColor=v_Color;
      }
      `;

    initShaders(gl, vshader, fshader);


    this.updateSize();

    this.drawAll();

    //* 绑定点击事件
    //非常简单的考虑，仅翻转所点击方块的颜色
    canvas.addEventListener('click', (e) => {
      e.preventDefault();
      // console.log('e: ', e);
      let x = Math.floor(e.offsetX / this.blockWidth);
      let y = Math.floor(e.offsetY / this.blockHeight);
      //倒转y坐标
      y = this.containerY - y - 1;
      this.reverseBlock(x, y);


    })



  }

  componentDidUpdate() {
    // console.log('did update')
    this.updateSize();
    this.drawAll();
  }

  render() {
    return (
      <div className="gridCanvas">
        <div style={{ alignContent: "center" }}>
          <p />
          <p>网格密度</p>
          <SliderWithInput min={10} max={maxSideSize} value={this.state.gridSize} onChange={(value) => this.setState({ gridSize: value })} style={{ width: "30%", position: "relative", left: "40%" }} />
          <p />
        </div>
        <canvas ref={this.canvasRef} width={canvasWidth} height={canvasHeight} style={{ borderStyle: 'solid' }} />
        <p>
          <button onClick={() => this.runScanFill()}>全部填充</button>
          <button onClick={() => this.delayDrawAll()}>逐步扫描</button>
          <button onClick={() => this.setState({ points: [] })}>clear</button>
        </p>
      </div>
    )
  }



  //* 辅助函数

  updateSize() {
    let { gridSize } = this.state;

    this.containerX = gridSize;
    this.containerY = gridSize;


    this.blockWidth = canvasWidth / this.containerX;
    this.blockHeight = canvasHeight / this.containerY;

    this.blockPadding = Math.min(this.blockHeight, this.blockWidth) / 10; //10%

    this.blockSize = Math.min(this.blockWidth - this.blockPadding, this.blockHeight - this.blockPadding);

    let a_PointSize = this.gl.getAttribLocation(this.gl.program, 'a_PointSize');
    this.gl.vertexAttrib1f(a_PointSize, this.blockSize);

  }

  drawAll(points = this.state.points) {
    // this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    let isDrawOuterLine = points.every(point => point.color === colorBlack);

    let [vertexes, color] = this.getVerticesAndColorByPoints(points);
    this.drawGrid(this.gl, this.containerX, this.containerY);
    this.drawPointsWithColor(this.gl, vertexes, color, isDrawOuterLine);
    // sleep(1000);
  }


  /**
   * 若存在点，则删除。若不存在点，则添加
   * @param {*} x 
   * @param {*} y 
   */
  reverseBlock(x, y) {
    // console.log('x, y: ', x, y);
    const points = this.state.points;
    let pointIndex = points.indexOf(p => p.x === x && p.y === y);
    if (pointIndex !== -1) {
      points.splice(pointIndex, 1);
    }
    else {
      points.push(new Point(x, y, colorBlack));
    }
    this.setState({ points });
  }



  /**
   * 
   * @param {*} matrix 
   * @returns [ vetexes, color ]
   */
  getVerticesAndColorByPoints(points) {
    let vertexes = [];
    let color = [];

    let pointIntervalX = 2 / this.containerX;
    let pointIntervalY = 2 / this.containerY;

    for (let point of points) {
      //处理顶点坐标
      let { x, y } = point;
      //调整至[-1,1]
      let xPos = -1 + (x + 0.5) * pointIntervalX;
      let yPos = -1 + (y + 0.5) * pointIntervalY;
      vertexes.push(
        xPos,  //x
        yPos,  //y
        0,
        1
      );

      //处理顶点颜色
      let thisColor;
      switch (point.color) {
        case colorWhite:
          thisColor = [1, 1, 1, 1];
          break;
        case colorBlack:
          thisColor = [0, 0, 0, 1];
          break;
        case colorYellow:
          thisColor = [1, 1, 0, 1];
          break;
        case colorRed:
          thisColor = [1, 0, 0, 1];
          break;
        case colorBlue:
          thisColor = [0, 0, 1, 1];
          break;
        default:
          thisColor = [0, 0, 0, 1];
          break;
      }
      color.push(
        ...thisColor
      )

    }

    // console.log('color: ', color);
    return [new Float32Array(vertexes), new Float32Array(color)]
  }

  /**
   * 传入顶点数组与颜色数组，绘制点
   * @param {WebGLRenderingContext} gl 
   * @param {Array|Float32Array} vertices - 一维顶点数组，每个顶点是一个vec2
   * @param {Array|Float32Array} color - 一维颜色数组，每个颜色是一个vec4
   */
  drawPointsWithColor(gl, vertices, color, isDrawOuterLine) {
    vertices = (vertices instanceof Float32Array) ? vertices : new Float32Array(vertices);
    color = (color instanceof Float32Array) ? color : new Float32Array(color);

    pointsIntoAttributeByAttributeName(gl, vertices, "a_Position", 4);
    pointsIntoAttributeByAttributeName(gl, color, "a_Color", 4);

    gl.drawArrays(gl.POINTS, 0, vertices.length / 4);

    if (isDrawOuterLine) {
      gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 4);
    }
  }


  /**
   * 画网格线
   * @param {WebGLRenderingContext} gl 
   * @param {number} containerX - x方向有多少个方块
   * @param {number} containerY - y方向有多少个方块
   * @param {undefined|number} intervalX - x方向的方块宽度
   * @param {undefined|number} intervalY - y方向的方块高度
   */
  drawGrid(gl, containerX, containerY, intervalX = undefined, intervalY = undefined) {

    //直接使用画线段功能就行
    //x方向上应有containerX+1条线
    //y方向上应有containerY+1条线
    let points_line_x = [];
    let points_line_y = [];
    intervalX = intervalX || 2 / containerX;
    intervalY = intervalY || 2 / containerY;
    for (let i = 0; i < containerX + 1; i++) {
      points_line_x.push(i * intervalX - 1, -1, 0, 1);
      points_line_x.push(i * intervalX - 1, 1, 0, 1);
    }
    for (let i = 0; i < containerY + 1; i++) {
      points_line_y.push(-1, i * intervalY - 1, 0, 1);
      points_line_y.push(1, i * intervalY - 1, 0, 1);
    }

    let vertexes = new Float32Array(points_line_x.concat(points_line_y));
    // console.log('vertices : ', vertices);
    pointsIntoAttributeByAttributeName(gl, vertexes, "a_Position", 4);

    // let color = colorLine;
    // gl.vertexAttrib4fv(gl.getAttribLocation(gl.program, "a_Color"), color);

    let color = new Array(points_line_x.length + points_line_y.length).fill(0)
    for (let i in color) {
      if ((i - 3) % 4 === 0) {
        color[i] = 1;
      }
    }
    color = new Float32Array(color);
    pointsIntoAttributeByAttributeName(gl, color, "a_Color", 4);
    // console.log('color: ', color);


    gl.drawArrays(gl.LINES, 0, vertexes.length / 4);

  }





  runScanFill(onlyGetVertices = false) {
    let oriPoints = JSON.parse(JSON.stringify(this.state.points));

    scanFill(oriPoints,
      onlyGetVertices
        ? (y, x1, x2) => {
          for (let x = x1; x <= x2; x++) {
            if (oriPoints.find(point => point.x === x && point.y === y)) {
              continue;
            }
            oriPoints.push(new Point(x, y, colorRed));
          }
        }
        : (y, x1, x2) => {
          // console.log('y, x1, x2: ', y, x1, x2);
          let points = this.state.points;
          for (let x = x1; x <= x2; x++) {
            if (points.find(point => point.x === x && point.y === y)) {
              continue;
            }
            points.push(new Point(x, y, colorRed));
          }
          this.setState({ points })
        })

    if (onlyGetVertices) {
      return oriPoints;
    }



  }

  /**
   * 
   * @param {Number} delay 
   */
  delayDrawAll(delay) {

    if (this.delayDrawing) {
      return;
    }
    this.delayDrawing = true;

    if (delay === undefined) {
      //自动得出delay
      const TimeDuration = 3000;
      delay = TimeDuration / this.containerY;
    }


    //对points进行延时绘制
    //思路：先绘制原顶点，再逐y绘制
    let allPoints = this.runScanFill(true);
    // console.log('allPoints: ', allPoints);
    let points = [];  //要绘制的点储存在这里

    points = allPoints.filter(point => point.color === colorBlack);
    let blackPoints = [...points];
    this.drawAll(points);

    let ys = points.map(point => point.y);
    let y = Math.min(...ys);
    let endY = Math.max(...ys);

    let timer = setInterval(() => {
      points = points.concat(allPoints.filter(point => point.y === y && blackPoints.includes(point) === false)
        .map(point => new Point(point.x, point.y, colorBlue)));
      this.drawAll(points);
      y++;
      if (y > endY) {
        this.setState({ points: allPoints });
        clearInterval(timer);
      }
    }, delay);


    this.delayDrawing = false;


  }






}
export default GridCanvas2;