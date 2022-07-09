export function drawImg(gl, index, vertexArray, imgObj) {



  // const source = new Float32Array([
  //   -0.5, 0.5, 0.0, 1.0,
  //   -0.5, -0.5, 0.0, 0.0,
  //   0.5, 0.5, 1.0, 1.0,
  //   0.5, -0.5, 1.0, 0.0,
  // ]);
  const source = vertexArray instanceof Float32Array
    ? vertexArray
    : new Float32Array(vertexArray);
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
  gl.activeTexture(gl.TEXTURE0 + index);

  //纹理对象
  const texture = gl.createTexture();
  //把纹理对象装进纹理单元里
  gl.bindTexture(gl.TEXTURE_2D, texture);

  //image 对象
  const image = imgObj
  // image.src = '../textures-skybox/erha_128_jpg.jpg';
  console.log(image);
  image.onload = function () {
    // showMap()
    // console.log("image loaded")
  }
  // this.forceUpdate();
  console.log(image)
  showMap()



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
    gl.uniform1i(u_Sampler, 0 + index);
    // console.log(gl.TEXTURE0)

    //渲染
    render()
  }

  function render() {
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, sourceSize);
  }



}



export function getCubeVertexArrayList(width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0) {
  let w = width * 0.5, h = height * 0.5, d = depth * 0.5;
  let x0 = x - w, x1 = x + w, y0 = y - h, y1 = y + h, z0 = z - d, z1 = z + d;
  let vertList = [
    [
      x0, y1, z1, 0,	//0 Front
      x0, y0, z1, 0,	//1
      x1, y0, z1, 0,	//2
      x1, y1, z1, 1,	//3 
    ],
    [
      x1, y1, z0, 1,	//4 Back
      x1, y0, z0, 1,	//5
      x0, y0, z0, 1,	//6
      x0, y1, z0, 0,	//7 
    ],
    [
      x0, y1, z0, 2,	//7 Left
      x0, y0, z0, 2,	//6
      x0, y0, z1, 2,	//1
      x0, y1, z1, 1,	//0
    ],
    [
      x0, y0, z1, 3,	//1 Bottom
      x0, y0, z0, 3,	//6
      x1, y0, z0, 3,	//5
      x1, y0, z1, 2,	//2
    ],
    [
      x1, y1, z1, 4,	//3 Right
      x1, y0, z1, 4,	//2 
      x1, y0, z0, 4,	//5
      x1, y1, z0, 3,	//4
    ],
    [
      x0, y1, z0, 5,	//7 Top
      x0, y1, z1, 5,	//0
      x1, y1, z1, 5,	//3
      x1, y1, z0, 1	//4
    ]
  ]
  for (let i in vertList) {
    vertList[i] = new Float32Array(vertList[i])
  }

  return vertList;
}