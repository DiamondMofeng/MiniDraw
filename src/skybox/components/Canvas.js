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
    const gl: WebGLRenderingContext = canvas.getContext("webgl");  //用于智能补全
    // const gl = canvas.getContext("webgl");
    if (!gl) {
      throw new Error("WebGL not supported");
    }

    // const var_a_Position = 'a_Position';
    // const var_a_PointSize = 'a_PointSize';

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
    const source = new Float32Array([
      -0.5, 0.5, 0.0, 1.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5, 0.5, 1.0, 1.0,
      0.5, -0.5, 1.0, 0.0,
    ]);
    // const FSIZE = source.BYTES_PER_ELEMENT;
    //元素字节数
    const elementBytes = source.BYTES_PER_ELEMENT
    //系列尺寸
    const posSize = 2
    const PinSize = 2
    //类目尺寸
    const categorySize = posSize + PinSize
    //类目字节数
    const categoryBytes = categorySize * elementBytes
    //系列字节索引位置
    const posByteIndex = 0
    const pinByteIndex = posSize * elementBytes
    //顶点总数
    const sourceSize = source.length / categorySize


    const sourceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, sourceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, source, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(
      a_Position,
      posSize,
      gl.FLOAT,
      false,
      categoryBytes,
      posByteIndex
    );
    gl.enableVertexAttribArray(a_Position);

    const a_Pin = gl.getAttribLocation(gl.program, 'a_Pin');
    gl.vertexAttribPointer(
      a_Pin,
      PinSize,
      gl.FLOAT,
      false,
      categoryBytes,
      pinByteIndex
    );
    gl.enableVertexAttribArray(a_Pin);


    //对纹理图像垂直翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    //纹理单元
    gl.activeTexture(gl.TEXTURE0);

    //纹理对象
    const texture = gl.createTexture();
    //把纹理对象装进纹理单元里
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //image 对象
    const image: HTMLImageElement = this.img1.current;
    // image.src = '../textures-skybox/erha_128_jpg.jpg';
    console.log(image);
    image.onload = function () {
      // showMap()
      // console.log("image loaded")
    }
    // this.forceUpdate();
    console.log(image)
    showMap()



    // const imgArray = [
    //   this.back.current,
    //   this.front.current,
    //   this.left.current,
    //   this.right.current,
    //   this.top.current,
    //   this.bottom.current,
    // ]

    // gl.fLoadCubeMap = function (name, imgArray) {
    //   if (imgArray.length !== 6) return null;
    //   let tex = this.createTexture();
    //   this.bindTexture(this.TEXTURE_CUBE_MAP, tex);
    //   for (let i = 0; i < 6; i++) {
    //     this.texImage2D(this.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, imgArray[i]);
    //   }

    //   this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MAG_FILTER, this.LINEAR);
    //   this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MIN_FILTER, this.LINEAR);
    //   this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WARP_S, this.CLAMP_TO_EDGE);
    //   this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WARP_T, this.CLAMP_TO_EDGE);
    //   this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WARP_R, this.CLAMP_TO_EDGE);

    //   this.bindTexture(this.TEXTURE_CUBE_MAP, null);
    //   this.mTextureCache[name] = tex;
    //   return tex;
    // }


    // gl.fLoadCubeMap("skybox", imgArray);




    //贴图
    function showMap() {
      //配置纹理图像
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGB,
        gl.RGB,
        gl.UNSIGNED_BYTE,
        image
      );

      //配置纹理参数
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR
      );

      //获取u_Sampler 
      const u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
      //将0号纹理分配给着色器，0 是纹理单元编号
      gl.uniform1i(u_Sampler, 0);

      //渲染
      render()
    }

    function render() {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, sourceSize);
    }


  }










}



export default Canvas;