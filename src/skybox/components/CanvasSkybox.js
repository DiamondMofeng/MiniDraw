import React, { Component } from "react";
import { Matrix4, Vector3 } from "three";
import { initShaders, pointsIntoAttributeByAttributeName } from "../../learnWebGL/utils/glUtils";
import { M4 } from "../utils/m4";

const style = {
  borderStyle: "dashed"
}

class Image {
  constructor(src, target) {
    this.src = src;
    this.target = target;
    this.ref = React.createRef();
  }
}

class CanvasSkybox extends Component {
  /**
   * 
   */
  constructor({ width, height }) {
    super();
    // 创建一个 ref 来存储 canvas 的 DOM 元素
    this.canvasRef = React.createRef();

    //imgae refs
    this.isLocalImg = true;
    this.imgs = [
      new Image(require("../textures-skybox/front.jpg"), "TEXTURE_CUBE_MAP_POSITIVE_X"),
      new Image(require("../textures-skybox/back.jpg"), "TEXTURE_CUBE_MAP_NEGATIVE_X"),
      new Image(require("../textures-skybox/top.jpg"), "TEXTURE_CUBE_MAP_POSITIVE_Y"),
      new Image(require("../textures-skybox/bottom.jpg"), "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
      new Image(require("../textures-skybox/right.jpg"), "TEXTURE_CUBE_MAP_POSITIVE_Z"),
      new Image(require("../textures-skybox/left.jpg"), "TEXTURE_CUBE_MAP_NEGATIVE_Z")

      // "../textures-skybox/back.jpg",
      // "../textures-skybox/front.jpg",
      // "../textures-skybox/left.jpg",
      // "../textures-skybox/right.jpg",
      // "../textures-skybox/top.jpg",
      // "../textures-skybox/bottom.jpg"
    ]

    this.img1 = React.createRef();

    this.back = React.createRef();
    this.front = React.createRef();
    this.left = React.createRef();
    this.right = React.createRef();
    this.top = React.createRef();
    this.bottom = React.createRef();

    this.gl = null;

    this.width = width || 750;
    this.height = height || 750;
  }
  render() {
    // const DISPLAY_NONE = { display: "none" };
    return (
      <>
        <canvas ref={this.canvasRef} width={this.width} height={this.height} style={style} tabIndex="0">
          如果您看到了这条消息,说明您的浏览器不支持canvas
        </canvas>

        <img ref={this.img1} src={require("../textures-skybox/erha_128_jpg.jpg")} alt="dog" style={{ display: "none" }} />

        {/* <img ref={this.back} src={require("../textures-skybox/back.jpg")} alt="back" style={{ display: "none" }} />
        <img ref={this.front} src={require("../textures-skybox/front.jpg")} alt="front" style={{ display: "none" }} />
        <img ref={this.left} src={require("../textures-skybox/left.jpg")} alt="left" style={{ display: "none" }} />
        <img ref={this.right} src={require("../textures-skybox/right.jpg")} alt="right" style={{ display: "none" }} />
        <img ref={this.top} src={require("../textures-skybox/top.jpg")} alt="top" style={{ display: "none" }} />
        <img ref={this.bottom} src={require("../textures-skybox/bottom.jpg")} alt="bottom" style={{ display: "none" }} /> */}

        {
          this.imgs.map((img, index) => {
            return <img key={index} ref={img.ref} src={null} alt={index} style={{ display: "none" }} />
          })
        }

      </>
    )
  }
  componentDidMount() {

    if (this.mounted === true) {
      return
    }
    this.mounted = true;

    this.gl = this.canvasRef.current.getContext("webgl2");
    const gl: WebGLRenderingContext = this.gl;
    // const gl = this.gl;

    //* 初始化着色器
    const glsl = String.raw;
    const vs =
      glsl`
      attribute vec4 a_position;
      varying vec4 v_position;
      void main() {
        v_position = a_position;
        gl_Position = a_position;
        gl_Position.z = 1.0;
      }
    `;

    const fs =
      glsl`
      precision mediump float;

      uniform samplerCube u_skybox;
      uniform mat4 u_viewDirectionProjectionInverse;
      
      varying vec4 v_position;
      void main() {
        vec4 t = u_viewDirectionProjectionInverse * v_position;
        gl_FragColor = textureCube(u_skybox, normalize(t.xyz / t.w));
      }
    
    `

    initShaders(gl, vs, fs);

    //* 初始化顶点 
    //顶点数据
    let positions = new Float32Array(
      [
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
      ]);

    pointsIntoAttributeByAttributeName(gl, positions, "a_position", 2);

    //片元数据空间
    let skyboxLocation = gl.getUniformLocation(gl.program, "u_skybox");
    let viewDirectionProjectionInverseLocation = gl.getUniformLocation(gl.program, "u_viewDirectionProjectionInverse");


    //* 绑定材质
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

    for (let img of this.imgs) {
      let { target, src } = img;
      target = gl[target];
      // let imgObj: HTMLImageElement = img.ref.current;
      let imgObj = img.ref.current;

      const level = 0;
      const internalFormat = gl.RGBA
      const width = 512;
      const height = 512;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;

      gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

      imgObj.src = src;
      imgObj.onload = () => {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(target, level, internalFormat, format, type, imgObj);
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      }

    }

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);



    //相机
    function radToDeg(r) {
      return r * 180 / Math.PI;
    }

    function degToRad(d) {
      return d * Math.PI / 180;
    }


    var fieldOfViewRadians = degToRad(60);
    var cameraYRotationRadians = degToRad(0);

    var spinCamera = true;
    // Get the starting time.
    var then = 0;


    requestAnimationFrame(drawScene);

    let timer = setInterval(
      () => drawScene(new Date() % 10000),100
    )
    // Draw the scene.
    function drawScene(time) {
      // time = time + 1
      // convert to seconds
      time *= 0.001;
      // Subtract the previous time from the current time
      var deltaTime = time - then;
      // Remember the current time for the next frame.
      then = time;

      resizeCanvasToDisplaySize(gl.canvas);

      function resizeCanvasToDisplaySize(canvas, multiplier) {
        multiplier = multiplier || 1;
        const width = canvas.clientWidth * multiplier | 0;
        const height = canvas.clientHeight * multiplier | 0;
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          return true;
        }
        return false;
      }

      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.enable(gl.CULL_FACE);
      gl.enable(gl.DEPTH_TEST);

      // Clear the canvas AND the depth buffer.
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // 计算投影矩阵

      let m4 = new M4();
      let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
      let projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

      // camera going in circle 2 units from origin looking at origin
      let x = Math.cos(time * 0.1);
      let z = Math.sin(time * 0.1);
      let cameraPosition = [0, 0, 0];
      let target = [x, 0, z];
      // console.log('target: ', target);
      let up = [0, 1, 0];
      // Compute the camera's matrix using look at.
      // console.log('cameraPosition, target, up: ', cameraPosition, target, up);
      let cameraMatrix = m4.lookAt(cameraPosition, target, up);
      // console.log('cameraMatrix: ', cameraMatrix);

      // Make a view matrix from the camera matrix.
      let viewMatrix = cameraMatrix.inverse();
      // console.log('viewMatrix: ', viewMatrix);

      // We only care about direction so remove the translation
      viewMatrix.elements[12] = 0;
      viewMatrix.elements[13] = 0;
      viewMatrix.elements[14] = 0;

      let viewDirectionProjectionMatrix = projectionMatrix.multiply(viewMatrix);
      console.log('projectionMatrix: ', projectionMatrix);
      // console.log('viewDirectionProjectionMatrix: ', viewDirectionProjectionMatrix);
      let viewDirectionProjectionInverseMatrix = viewDirectionProjectionMatrix.inverse();
      viewDirectionProjectionInverseMatrix = new Float32Array(viewDirectionProjectionInverseMatrix.elements)

      // viewDirectionProjectionInverseMatrix = new Float32Array([
      //   0.7765839695930481
      //   , -0
      //   , 1.1812782287597656
      //   , -5.956145798791113e-9
      //   , -0
      //   , 0.5773502588272095
      //   , -0
      //   , -0
      //   , -0
      //   , -0
      //   , -0
      //   , -0.499750018119812
      //   , 0.8356030583381653
      //   , -0
      //   , -0.5493336915969849
      //   , 0.5002500414848328
      // ])

      // Set the uniforms
      gl.uniformMatrix4fv(
        viewDirectionProjectionInverseLocation, false,
        viewDirectionProjectionInverseMatrix);

      // Tell the shader to use texture unit 0 for u_skybox
      gl.uniform1i(skyboxLocation, 0);

      // let our quad pass the depth test at 1.0
      gl.depthFunc(gl.LEQUAL);

      // Draw the geometry.
      gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);

      // requestAnimationFrame(drawScene);
    }














  }










}



export default CanvasSkybox;



