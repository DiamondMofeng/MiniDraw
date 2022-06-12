import React, { Component } from "react";
import { initShaders } from "../../learnWebGL/utils/glUtils";

const style = {
  borderStyle: "dashed"
}


class Canvas extends Component {
  /**
   * 
   * @param {Pen} pen - util中的画笔的实例对象
   */
  constructor({ pen, width, height }) {
    super();
    // 创建一个 ref 来存储 canvas 的 DOM 元素
    this.canvas = React.createRef();

    this.stack = [];

    this.pen = pen;

    this.width = width || 750;
    this.height = height || 750;
  }
  ww
  render() {
    return (
      <canvas ref={this.canvas} width={this.width} height={this.height} style={style} tabIndex="0">
        如果您看到了这条消息,说明您的浏览器不支持canvas
      </canvas>
    )
  }
  componentDidMount() {

    //禁用浏览器右键菜单，方便后续操作
    window.oncontextmenu = (e) => {
      e.preventDefault();
    }

    //获取当前真实canvasDOM对象
    const canvas = this.canvas.current;

    //初始化webgl
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw new Error("WebGL not supported");
    }

    const var_a_Position = 'a_Position';

    const glsl = String.raw;
    const vertexShader = glsl`
      attribute vec4 ${var_a_Position};
      void main() {
        gl_Position = ${var_a_Position};
        gl_PointSize = 5.0;
      }
    `;
    const fragmentShader = glsl`
      
      precision mediump float;
      uniform vec4 u_FragColor ;
      void main() {
        gl_FragColor = vec4(0.0,0.0,0.0,1.0);
      }
    `;
    initShaders(gl, vertexShader, fragmentShader);

    //绑定pen与画布（向画布中注入pen的鼠标事件）
    this.pen.injectEvent(canvas, var_a_Position);

    // new Line(0.5, 0.5, 1, 1).draw(gl, var_a_Position);//test

  }
}



export default Canvas;