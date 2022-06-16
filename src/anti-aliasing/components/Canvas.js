import React from "react";
import { initShaders, pointsIntoAttributeByLocation } from "../../learnWebGL/utils/glUtils";
import { mapXYtoWebGLXY } from "../../learnWebGL/utils/utils";

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);

    const { x1, y1, x2, y2, pointSize } = props;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.pointSize = pointSize;

    this.canvas = React.createRef();
    this.canvasObj = undefined;

    this.varName_a_PointSize = undefined;
    this.varName_a_Position = undefined;


  }

  render() {
    return (
      <canvas ref={this.canvas} width={this.props.width} height={this.props.height} style={this.props.style} >
        如果您看到了这条消息, 说明您的浏览器不支持canvas
      </canvas>
    );
  }

  componentDidMount() {
    //禁用浏览器右键菜单，方便后续操作
    window.oncontextmenu = (e) => {
      e.preventDefault();
    }
    //获取当前真实canvasDOM对象
    const canvas: HTMLCanvasElement = this.canvas.current;
    // const canvas = this.canvas.current;
    this.canvasObj = canvas;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.log("WebGL not supported, falling back to WebGLProxy");
      return;
    }

    const glsl = String.raw

    this.varName_a_PointSize = 'a_PointSize';
    this.varName_a_Position = 'a_Position';

    const vertexShader =
      glsl`
      attribute vec4 ${this.varName_a_Position};
      attribute float ${this.varName_a_PointSize};
      void main() {

        gl_Position = ${this.varName_a_Position};
        gl_PointSize = ${this.varName_a_PointSize};
      } 
    `;


    const fragmentShader =
      glsl`
      precision mediump float;
      uniform vec4 u_FragColor;
      void main() {
        gl_FragColor = u_FragColor;
      }
      `;

    initShaders(gl, vertexShader, fragmentShader);

    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0);


    const a_Position = gl.getAttribLocation(gl.program, this.varName_a_Position);
    const a_PointSize = gl.getAttribLocation(gl.program, this.varName_a_PointSize);
    gl.vertexAttrib1f(a_PointSize, this.props.pointSize)


    // let points = this.getPointsBetween(this.x1, this.y1, this.x2, this.y2, this.pointSize);
    let points = this.getPointsBetween(this.x1, this.y1, this.x2, this.y2, this.props.pointSize);
    points = new Float32Array(points);
    console.log(points)
    pointsIntoAttributeByLocation(gl, points, a_Position);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, points.length / 2);
    // const vertices = new Float32Array([
    //   0.0, 0.1,
    //   -0.1, -0.1,
    //   0.1, -0.1
    // ])
    // const vertexBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // // const a_Position=gl.getAttribLocation(gl.program,'a_Position');
    // gl.vertexAttribPointer(var_a_Position, 2, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(var_a_Position);

    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.drawArrays(gl.POINTS, 0, 3);


    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)
    // gl.drawArrays(gl.POINTS, 0, 1);
  }

  componentDidUpdate() {
    // console.log('componentDidUpdate', this.props.pointSize)
    const gl = this.canvasObj.getContext("webgl");
    // console.log(gl.isProgram(gl.program))
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let points = this.getPointsBetween(this.props.x1, this.props.y1, this.props.x2, this.props.y2, this.props.pointSize);
    let a_PointSize = gl.getAttribLocation(gl.program, this.varName_a_PointSize);
    gl.vertexAttrib1f(a_PointSize, this.props.pointSize)
    points = new Float32Array(points);
    // console.log('points: ', points);
    pointsIntoAttributeByLocation(gl, points, this.varName_a_Position);

    gl.drawArrays(gl.POINTS, 0, points.length / 2);
  }

  /**
   * 仅支持 k<=1 !
   * @param {*} x1 
   * @param {*} y1 
   * @param {*} x2 
   * @param {*} y2 
   * @param {*} pointSize 
   * @returns 
   */
  getPointsBetween(x1 = 0, y1 = 0, x2, y2, pointSize) {
    const points = [];

    // x2 = (Math.floor(x2 / pointSize));
    // y2 = (Math.floor(y2 / pointSize));

    const dx = x2 - x1;
    const dy = y2 - y1;

    // pointSize = pointSize / this.canvasObj.width / 2

    let e = -dx;

    let x = x1 + pointSize / 2;
    let y = y1 + pointSize / 2;

    while (x <= x2) {
      // console.log(x, y)
      points.push(...mapXYtoWebGLXY(x, y, this.canvasObj.width, this.canvasObj.height));

      e = e + 2 * dy;
      if (e > 0) {
        x = x + pointSize * 4;
        y = y + pointSize * 4;
        e = e - 2 * dx;
      }
      else {
        x = x + pointSize;
      }

    }

    return points;

  }

}