import React, { Component } from "react";
import { initShaders } from "../../learnWebGL/utils/glUtils";

const style = {
  borderStyle: "dashed"
}


class CanvasSkybox extends Component {
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
    // const gl: WebGLRenderingContext = canvas.getContext("webgl2");  //用于智能补全
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("WebGL not supported");
    }

    // const var_a_Position = 'a_Position';
    // const var_a_PointSize = 'a_PointSize';

    const glsl = String.raw;

    const vertexShader = glsl`#version 300 es
      in vec4 a_position;	
      in vec2 a_uv;

      uniform mat4 uPMatrix;
      uniform mat4 uMVMatrix;
      uniform mat4 uCameraMatrix;

      out highp vec3 texCoord;  //Interpolate UV values to the fragment shader

      void main(void){
           texCoord = a_position.xyz;
           vec4 pos = uPMatrix * uCameraMatrix * vec4(a_position.xyz, 1.0); 
           gl_Position = pos.xyww; 
      }
    `;

    const fragmentShader = glsl`#version 300 es
      precision mediump float;
              
      in highp vec3 texCoord;
      uniform samplerCube uCubemap;
                  
      out vec4 finalColor;
      void main(void){
           finalColor = texture(uCubemap, texCoord);
      }
    `;

    initShaders(gl, vertexShader, fragmentShader);


    const image = this.img1.current;
    // image.src = '../textures-skybox/erha_128_jpg.jpg';
    console.log(image);
    image.onload = function () {
      // showMap()
      // console.log("image loaded")
    }
    // this.forceUpdate();
    console.log(image)



    const imgArray = [
      this.back.current,
      this.front.current,
      this.left.current,
      this.right.current,
      this.top.current,
      this.bottom.current,
    ]

    gl.fLoadCubeMap = function (name, imgArray) {

      if (imgArray.length !== 6) return null;
      let tex = this.createTexture();
      this.bindTexture(this.TEXTURE_CUBE_MAP, tex);
      for (let i = 0; i < 6; i++) {
        this.texImage2D(this.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.RGBA, this.RGBA, this.UNSIGNED_BYTE, imgArray[i]);
      }

      this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MAG_FILTER, this.LINEAR);
      this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_MIN_FILTER, this.LINEAR);
      this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WARP_S, this.CLAMP_TO_EDGE);
      this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WARP_T, this.CLAMP_TO_EDGE);
      this.texParameteri(this.TEXTURE_CUBE_MAP, this.TEXTURE_WARP_R, this.CLAMP_TO_EDGE);

      this.bindTexture(this.TEXTURE_CUBE_MAP, null);
      this.mTextureCache = this.mTextureCache === undefined ? this.mTextureCache = {} : this.mTextureCache;
      this.mTextureCache[name] = tex;
      return tex;
    }


    gl.fLoadCubeMap("skybox", imgArray);


    let cubemap = gl.getUniformLocation(this.program, "uCubemap");

    this.gl.activeTexture(this.gl.TEXTURE0);

    // this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, cubeMapTexId);
    this.gl.uniform1i(cubemap, 0);

    function createMesh(gl, name, width, height, depth, x, y, z) {
      let w = width * 0.5, h = height * 0.5, d = depth * 0.5;
      let x0 = x - w, x1 = x + w, y0 = y - h, y1 = y + h, z0 = z - d, z1 = z + d;
      var aVert = [
        x0, y1, z1, 0,	//0 Front
        x0, y0, z1, 0,	//1
        x1, y0, z1, 0,	//2
        x1, y1, z1, 1,	//3 

        x1, y1, z0, 1,	//4 Back
        x1, y0, z0, 1,	//5
        x0, y0, z0, 1,	//6
        x0, y1, z0, 0,	//7 

        x0, y1, z0, 2,	//7 Left
        x0, y0, z0, 2,	//6
        x0, y0, z1, 2,	//1
        x0, y1, z1, 1,	//0

        x0, y0, z1, 3,	//1 Bottom
        x0, y0, z0, 3,	//6
        x1, y0, z0, 3,	//5
        x1, y0, z1, 2,	//2

        x1, y1, z1, 4,	//3 Right
        x1, y0, z1, 4,	//2 
        x1, y0, z0, 4,	//5
        x1, y1, z0, 3,	//4

        x0, y1, z0, 5,	//7 Top
        x0, y1, z1, 5,	//0
        x1, y1, z1, 5,	//3
        x1, y1, z0, 1	//4
      ];
      //Build the index of each quad [0,1,2, 2,3,0]
      var aIndex = [];
      for (var i = 0; i < aVert.length / 4; i += 2) aIndex.push(i, i + 1, (Math.floor(i / 4) * 4) + ((i + 2) % 4));

      //Build UV data for each vertex
      var aUV = [];
      for (var i = 0; i < 6; i++) aUV.push(0, 0, 0, 1, 1, 1, 1, 0);

      //Build Normal data for each vertex
      var aNorm = [
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,		//Front
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,		//Back
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,		//Left
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,		//Bottom
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,		//Right
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0		//Top
      ]

      var mesh = gl.fCreateMeshVAO(name, aIndex, aVert, aNorm, aUV, 4);
      mesh.noCulling = true;
      return mesh;
    }



  }










}



export default CanvasSkybox;