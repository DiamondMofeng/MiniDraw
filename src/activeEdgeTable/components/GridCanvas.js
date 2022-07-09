
//偷懒不用webgl了，用小方块元素来模拟

import { Component, createRef } from "react";
import { initShaders, pointsIntoAttributeByAttributeName } from "../../learnWebGL/utils/glUtils";
import { scanFill } from "../class/EdgeTable";

const canvasWidth = 500;
const canvasHeight = 500;

const containerX = 10;
const containerY = 10;

const blockPadding = 5;

const blockWidth = canvasWidth / containerX;
const blockHeight = canvasHeight / containerY;

const blockSize = Math.min(blockWidth - blockPadding, blockHeight - blockPadding);


const colorWhite = 0;
const colorBlack = 1;

const colorLine = new Float32Array([1, 1, 1, 1]);


class GridCanvas extends Component {

  constructor() {
    super();
    this._width = containerX;
    this._height = containerY;
    this.canvasRef = createRef();
    this.gl = null;
    //构建一个矩阵，用来存储每个方块的状态
    //暂时只储存每个方块的颜色
    this.state = {
      grid: new Array(this._height).fill(0).map(() => new Array(this._width).fill(colorWhite))
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
      varying vec4 v_Color;
      void main(){
          gl_Position=a_Position;
          gl_PointSize=${blockSize.toFixed(1)};
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

    this.drawAll();

    //* 绑定点击事件
    //非常简单的考虑，仅翻转所点击方块的颜色
    canvas.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('e: ', e);
      let x = Math.floor(e.offsetX / blockWidth);
      let y = Math.floor(e.offsetY / blockHeight);
      //倒转y坐标
      y = containerY - y - 1;
      this.reverseBlock(x, y);


    })



  }

  componentDidUpdate() {
    // console.log('did update')
    this.drawAll();
  }

  render() {
    return (
      <div className="gridCanvas">
        <canvas ref={this.canvasRef} width={500} height={500} style={{ borderStyle: 'solid' }} />
        <p>
          <button onClick={() => this.runScanFill()}>扫描填充</button>
        </p>
      </div>
    )
  }



  //* 辅助函数

  drawAll() {
    // this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    let [vertexes, color] = this.getVerticesAndColorByMatrix(this.state.grid);
    this.drawPointsWithColor(this.gl, vertexes, color);
    this.drawGrid(this.gl, containerX, containerY);
  }

  reverseBlock(x, y) {
    // console.log('x, y: ', x, y);
    const grid = this.state.grid;
    grid[y][x] = grid[y][x] === colorWhite ? colorBlack : colorWhite;
    this.setState({
      grid: grid
    })
    // this.renderAll();
  }



  /**
   * 
   * @param {*} matrix 
   * @returns [ vetexes, color ]
   */
  getVerticesAndColorByMatrix(matrix) {
    let vertexes = [];
    let row = matrix.length;
    let col = matrix[0].length;

    let pointIntervalX = 2 / col;
    let pointIntervalY = 2 / row;

    for (let y = 0; y < row; y++) {
      for (let x = 0; x < col; x++) {
        //调整至[-1,1]
        let xPos = -1 + (x + 0.5) * pointIntervalX;
        let yPos = -1 + (y + 0.5) * pointIntervalY;
        vertexes.push(
          xPos,  //x
          yPos,  //y
          0,
          1
        );
      }
    }
    // console.log('vertexes: ', vertexes);



    let color = [];
    for (let y = 0; y < row; y++) {
      for (let x = 0; x < col; x++) {
        color.push(
          matrix[y][x] === colorWhite ? 1 : 0,
          matrix[y][x] === colorWhite ? 1 : 0,
          matrix[y][x] === colorWhite ? 1 : 0,
          1
        )
      }
    }
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

    let vertices = new Float32Array(points_line_x.concat(points_line_y));
    console.log('vertices : ', vertices);
    pointsIntoAttributeByAttributeName(gl, vertices, "a_Position", 4);

    let color = colorLine;
    gl.vertexAttrib4fv(gl.getAttribLocation(gl.program, "a_Color"), color);

    // let color = new Array(points_line_x.length + points_line_y.length).fill(1)
    // color = new Float32Array(color);
    // pointsIntoAttributeByAttributeName(gl, color, "a_Color", 4);
    // console.log('color: ', color);


    gl.drawArrays(gl.LINES, 0, vertices.length / 4);

  }





  runScanFill() {
    let matrix = [...this.state.grid];

    scanFill(matrix, ((y, x1, x2) => {
      console.log('y, x1, x2: ', y, x1, x2);
      for (let x = x1; x <= x2; x++) {
        matrix[y][x] = colorBlack;
      }
      // this.setState({
      //   grid: matrix
      // })
    }));
  }







}
export default GridCanvas;