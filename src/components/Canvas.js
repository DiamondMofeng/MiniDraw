import React, { Component } from "react";
// import Pen from "../utils/Pen";

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

  render() {
    return (
      <canvas ref={this.canvas} width={this.width} height={this.height} style={style}>
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

    //绑定pen与画布（向画布中注入pen的鼠标事件）
    this.pen.injectEvent(canvas);
  }
}



export default Canvas;