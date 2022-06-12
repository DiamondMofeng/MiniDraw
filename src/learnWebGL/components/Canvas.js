import React from "react";
import {
  Circle,
  // Line
} from "../../v3/class/DrawObj";
import { initShaders } from "../utils/glUtils";
import { cssXYtoWebGLXY } from "../utils/utils";







export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.stack = [];
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

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.log("WebGL not supported, falling back to WebGLProxy");
      return;
    }

    const glsl = String.raw

    const vertexShader =
      glsl`
      attribute vec4 a_Position;
      void main() {

        gl_Position = a_Position;
        gl_PointSize = 5.0;
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

    // const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);


    let figures = [];

    canvas.addEventListener('click', function (event) {
      const [x, y] = cssXYtoWebGLXY(event.offsetX, event.offsetY, canvas.width, canvas.height);
      // figures.push(new Line(x, y, x + 0.5, y + 0.5));
      figures.push(new Circle(x, y, 0.3));
      gl.clear(gl.COLOR_BUFFER_BIT);
      for (let p of figures) {

        p.draw(gl, "a_Position");
      }
    })



    // const vertices = new Float32Array([
    //   0.0, 0.1,
    //   -0.1, -0.1,
    //   0.1, -0.1
    // ])
    // const vertexBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // // const a_Position=gl.getAttribLocation(gl.program,'a_Position');
    // gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(a_Position);

    // gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    // gl.drawArrays(gl.POINTS, 0, 3);


    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)
    // gl.drawArrays(gl.POINTS, 0, 1);
  }


}