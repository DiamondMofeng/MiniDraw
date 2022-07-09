
//偷懒不用webgl了，用小方块元素来模拟

import { Component, createRef } from "react";
import { initShaders, pointsIntoAttributeByAttributeName } from "../../learnWebGL/utils/glUtils";
import { scanFill } from "../class/EdgeTable2";
import { Slider } from "antd";

const canvasWidth = 500;
const canvasHeight = 500;

const colorWhite = 0;
const colorBlack = 1;
const colorYellow = 2;
const colorRed = 3;

// const colorLine = new Float32Array([0, 0, 0, 1]);


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
          <p>网格大小</p>
          <Slider value={this.state.gridSize} onChange={(value) => this.setState({ gridSize: value })} style={{ width: "30%", position: "relative", left: "35%" }} />
        </div>
        <canvas ref={this.canvasRef} width={canvasWidth} height={canvasHeight} style={{ borderStyle: 'solid' }} />
        <p>
          <button onClick={() => this.runScanFill()}>扫描填充</button>
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

  drawAll() {
    // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    let [vertexes, color] = this.getVerticesAndColorByPoints(this.state.points);
    this.drawGrid(this.gl, this.containerX, this.containerY);
    this.drawPointsWithColor(this.gl, vertexes, color);
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
  drawPointsWithColor(gl, vertices, color) {
    vertices = (vertices instanceof Float32Array) ? vertices : new Float32Array(vertices);
    color = (color instanceof Float32Array) ? color : new Float32Array(color);

    pointsIntoAttributeByAttributeName(gl, vertices, "a_Position", 4);
    pointsIntoAttributeByAttributeName(gl, color, "a_Color", 4);

    gl.drawArrays(gl.POINTS, 0, vertices.length / 4);
    // gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 4);
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





  runScanFill() {
    let points = JSON.parse(JSON.stringify(this.state.points));

    scanFill(points,
      (y, x1, x2) => {
        // sleep(100);//sleep
        console.log('y, x1, x2: ', y, x1, x2);
        let points = this.state.points;
        for (let x = x1; x <= x2; x++) {
          if (points.find(point => point.x === x && point.y === y)) {
            continue;
          }
          points.push(new Point(x, y, colorRed));
        }
        this.setState({ points })
      }

    );

    // function sleep(delay) {
    //   var start = (new Date()).getTime();
    //   while ((new Date()).getTime() - start < delay) {
    //     continue;
    //   }
    // }



  }







}
export default GridCanvas2;