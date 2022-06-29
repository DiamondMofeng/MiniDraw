import React, { Component } from "react";
import { initShaders } from "../../learnWebGL/utils/glUtils";

const style = {
  borderStyle: "dashed"
}


class Canvas extends Component {
  /**
   * 
   */
  constructor({ width, height }) {
    super();
    // 创建一个 ref 来存储 canvas 的 DOM 元素
    this.canvas = React.createRef();


    this.width = width || 750;
    this.height = height || 750;
  }
  render() {
    return (
      <canvas ref={this.canvas} width={this.width} height={this.height} style={style} tabIndex="0">
        如果您看到了这条消息,说明您的浏览器不支持canvas
      </canvas>
    )
  }
  componentDidMount() {
    //禁用浏览器右键菜单，方便后续操作
    // window.oncontextmenu = (e) => {
    //   e.preventDefault();
    // }

    //获取当前真实canvasDOM对象
    const canvas = this.canvas.current;

    //初始化webgl
    // const gl: WebGLRenderingContext = canvas.getContext("webgl");  //用于智能补全
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw new Error("WebGL not supported");
    }

    const var_a_Position = 'a_Position';
    const var_a_PointSize = 'a_PointSize';

    const glsl = String.raw;
    const vertexShader = glsl`
      attribute vec4 ${var_a_Position};
      attribute float ${var_a_PointSize};
      void main() {
        gl_Position = ${var_a_Position};
        gl_PointSize = ${var_a_PointSize};
      }
    `;
    const fragmentShader = glsl`
      
      precision mediump float;
      uniform vec4 u_FragColor ;
      void main() {
        // gl_FragColor = vec4(0.0,0.0,0.0,1.0);
        gl_FragColor = u_FragColor;
      }
    `;
    initShaders(gl, vertexShader, fragmentShader);
    gl.uniform4fv(gl.getUniformLocation(gl.program, 'u_FragColor'), new Float32Array([0.0, 0.0, 0.0, 1.0]));

    const a_PointSize = gl.getAttribLocation(gl.program, var_a_PointSize);
    gl.vertexAttrib1f(a_PointSize, 1);

      

  }










}



export default Canvas;