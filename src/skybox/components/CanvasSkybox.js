import { Switch } from "antd";
import React, { Component } from "react";
import { initShaders, pointsIntoAttributeByAttributeName } from "../../learnWebGL/utils/glUtils";
import SliderWithInput from "../../v4/components/SliderWithInput";
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
      new Image(require("../textures-skybox/top_rr.jpg"), "TEXTURE_CUBE_MAP_POSITIVE_Y"),
      new Image(require("../textures-skybox/bottom_rr.jpg"), "TEXTURE_CUBE_MAP_NEGATIVE_Y"),
      new Image(require("../textures-skybox/right.jpg"), "TEXTURE_CUBE_MAP_NEGATIVE_Z"),
      new Image(require("../textures-skybox/left.jpg"), "TEXTURE_CUBE_MAP_POSITIVE_Z")

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

    this.width = width || 1600;
    this.height = height || 900;

    this.state = {
      fov: 60,
      autoSpin: true,
      width: this.width,
      height: this.height
    }

  }
  render() {
    // const DISPLAY_NONE = { display: "none" };
    return (
      <div className="CanvasSkybox">
        <span style={{ backgroundColor: "rgb(123,123,123,0.75)", width: "30%", position: "fixed", right: "10%", bottom: "10%" }}>
          宽<SliderWithInput min={500} max={1920} step={1} value={this.state.width} onChange={(value) => {
            this.setState({ width: value });
          }} />
          高<SliderWithInput min={500} max={1080} step={1} value={this.state.height} onChange={(value) => {
            this.setState({ height: value });
          }} />
          <p />
          {/* 方向键控制 */}
          <Switch checked={this.state.autoSpin} onChange={
            () => {
              this.setState({ autoSpin: !this.state.autoSpin });
            }} ></Switch>
          自动旋转
          <p>FOV</p>
          <SliderWithInput min={1} max={179} step={1} value={this.state.fov}
            onChange={(value) => {
              this.setState({ fov: value });
              // this.canvasRef.current.focus()
            }}
          />

        </span>


        <canvas ref={this.canvasRef} width={this.state.width} height={this.state.height} style={style} tabIndex="0">
          如果您看到了这条消息,说明您的浏览器不支持canvas
        </canvas>


        {
          this.imgs.map((img, index) => {
            return <img key={index} ref={img.ref} src={null} alt={index} style={{ display: "none" }} />
          })
        }
      </div>


    )
  }
  componentDidMount() {

    if (this.mounted === true) {
      return
    }
    this.mounted = true;

    // this.bindKeyBoardEvent();


    this.gl = this.canvasRef.current.getContext("webgl2");
    // const gl: WebGLRenderingContext = this.gl;
    const gl = this.gl;

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


    if (this.state.autoSpin) {
      requestAnimationFrame((time) =>
        this.drawScenceByTime(time, this)
      );
    }


    //* 绘制主入口
    //作为回调函数执行

    this.drawScene(1, 0, 1)

  }

  // bindKeyBoardEvent() {

  //   let timer = null

  //   this.canvasRef.current.addEventListener("keydown", (e) => {
  //     e.preventDefault();
  //     switch (e.key) {
  //       case "ArrowUp":
  //       case "w":
  //       case "W":
  //         this.w = true;
  //         break;
  //       case "ArrowDown":
  //       case "s":
  //       case "S":
  //         this.s = true;
  //         break;
  //       case "ArrowLeft":
  //       case "a":
  //       case "A":
  //         this.a = true;
  //         break;
  //       case "ArrowRight":
  //       case "d":
  //       case "D":
  //         this.d = true;
  //         break;

  //       default:
  //         break;
  //     }
  //     timer = setInterval(() => {
  //       const SPEED_STEP = 1;
  //       this.speed = 0;
  //       if (this.d) {
  //         this.speed += SPEED_STEP;
  //       }
  //       if (this.a) {
  //         this.speed -= SPEED_STEP;
  //       }

  //       let curRad = Math.atan2(this.y, this.x);
  //       let newDegree = (curRad * 180 / Math.PI + this.speed) % 360;
  //       this.x = Math.cos(newDegree * Math.PI / 180);
  //       this.z = Math.sin(newDegree * Math.PI / 180);
  //       this.drawScene(this.x, 0, this.z)
  //     }, 30)


  //   }
  //     , false);

  //   this.canvasRef.current.addEventListener("keyup", (e) => {
  //     e.preventDefault();
  //     switch (e.key) {
  //       case "ArrowUp":
  //       case "w":
  //       case "W":
  //         this.w = false;
  //         break;
  //       case "ArrowDown":
  //       case "s":
  //       case "S":
  //         this.s = false;
  //         break;
  //       case "ArrowLeft":
  //       case "a":
  //       case "A":
  //         this.a = false;
  //         break;
  //       case "ArrowRight":
  //       case "d":
  //       case "D":
  //         this.d = false;
  //         break;
  //       default:
  //         break;
  //     }
  //     clearInterval(timer);
  //   })

  // }









  componentDidUpdate() {
    requestAnimationFrame((time) =>
      this.drawScenceByTime(time, this)
    );
  }


  drawScenceByTime(time, _this) {
    time *= 0.001;
    let x = Math.cos(time * 0.1);
    let z = Math.sin(time * 0.1);
    _this.drawScene(x, 0, z)
    if (_this.state.autoSpin) {
      requestAnimationFrame((time) =>
        _this.drawScenceByTime(time, _this)
      );
    }
  }


  drawScene(x, y, z) {

    let gl = this.gl

    this.x = x;
    this.y = y;
    this.z = z;

    function degToRad(d) {
      return d * Math.PI / 180;
    }

    var fieldOfViewRadians = degToRad(this.state.fov || 60);

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

    // 清空画布
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // 计算投影矩阵

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let projectionMatrix = M4.perspective(fieldOfViewRadians, aspect, 1, 2000); //* 投影矩阵没有问题

    // 不断旋转目标对象位置
    // 计算lookat矩阵
    // let x = Math.cos(time * 0.1);
    // let z = Math.sin(time * 0.1);
    let cameraPosition = [x, 0, z];
    let target = [0, 0, 0];
    let up = [0, 1, 0];

    let cameraMatrix = M4.lookAt(cameraPosition, target, up); //* LookAt没有问题


    // 由lookAt得出观察矩阵
    let viewMatrix = cameraMatrix.inverse();  //* 观察矩阵没有问题

    // 去掉缩放部分
    viewMatrix.elements[12] = 0;
    viewMatrix.elements[13] = 0;
    viewMatrix.elements[14] = 0;

    let viewDirectionProjectionMatrix = M4.multiplyBetween(projectionMatrix, viewMatrix);
    let viewDirectionProjectionInverseMatrix = viewDirectionProjectionMatrix.inverse();

    // 处理片元
    //片元数据空间
    let skyboxLocation = gl.getUniformLocation(gl.program, "u_skybox");
    let viewDirectionProjectionInverseLocation = gl.getUniformLocation(gl.program, "u_viewDirectionProjectionInverse");

    gl.uniformMatrix4fv(
      viewDirectionProjectionInverseLocation, false,
      viewDirectionProjectionInverseMatrix.elements);

    gl.uniform1i(skyboxLocation, 0);

    // let our quad pass the depth test at 1.0
    gl.depthFunc(gl.LEQUAL);

    gl.drawArrays(gl.TRIANGLES, 0, 1 * 6);

    // requestAnimationFrame(drawScene);

  }








}



export default CanvasSkybox;



