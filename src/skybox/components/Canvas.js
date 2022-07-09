import React, { Component } from "react";
import { initShaders } from "../../learnWebGL/utils/glUtils";
import { drawImg, getCubeVertexArrayList } from "../utils/glutils";

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

    //imgae refs
    this.img1 = React.createRef();

    this.back = React.createRef();
    this.front = React.createRef();
    this.left = React.createRef();
    this.right = React.createRef();
    this.top = React.createRef();
    this.bottom = React.createRef();


    this.width = width || 750;
    this.height = height || 750;
  }
  render() {
    // const DISPLAY_NONE = { display: "none" };
    return (
      <>
        <canvas ref={this.canvas} width={this.width} height={this.height} style={style} tabIndex="0">
          如果您看到了这条消息,说明您的浏览器不支持canvas
        </canvas>

        <img ref={this.img1} src={require("../textures-skybox/erha_128_jpg.jpg")} alt="dog" style={{ display: "none" }} />

        <img ref={this.back} src={require("../textures-skybox/back.jpg")} alt="back" style={{ display: "none" }} />
        <img ref={this.front} src={require("../textures-skybox/front.jpg")} alt="front" style={{ display: "none" }} />
        <img ref={this.left} src={require("../textures-skybox/left.jpg")} alt="left" style={{ display: "none" }} />
        <img ref={this.right} src={require("../textures-skybox/right.jpg")} alt="right" style={{ display: "none" }} />
        <img ref={this.top} src={require("../textures-skybox/top.jpg")} alt="top" style={{ display: "none" }} />
        <img ref={this.bottom} src={require("../textures-skybox/bottom.jpg")} alt="bottom" style={{ display: "none" }} />

      </>
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
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("WebGL not supported");
    }

    const glsl = String.raw;

    const vertexShader = glsl`
      attribute vec4 a_Position;
      attribute vec2 a_Pin;
      varying vec2 v_Pin;
      void main(){
        gl_Position = a_Position;
        v_Pin=a_Pin;
      }
    `;

    const fragmentShader = glsl`
      precision mediump float;
      uniform sampler2D u_Sampler;
      varying vec2 v_Pin;
      void main(){
        gl_FragColor=texture2D(u_Sampler,v_Pin);
      }
    `;

    initShaders(gl, vertexShader, fragmentShader);
    //数据源
    // const source = new Float32Array([
    //   -0.5, 0.5, 0.0, 1.0,
    //   -0.5, -0.5, 0.0, 0.0,
    //   0.5, 0.5, 1.0, 1.0,
    //   0.5, -0.5, 1.0, 0.0,
    // ]);
    // drawImg(gl, source, this.front.current)


    let back = this.back.current;
    let front = this.front.current;
    let left = this.left.current;
    let right = this.right.current;
    let top = this.top.current;
    let bottom = this.bottom.current;

    let imgObjList = [back, front, left, right, top, bottom];

    let vertList = getCubeVertexArrayList(1, 1, 1)

    for (let i = 0; i < imgObjList.length; i++) {
      drawImg(gl, i, vertList[i], imgObjList[i])
    }






  }

}

export default Canvas;