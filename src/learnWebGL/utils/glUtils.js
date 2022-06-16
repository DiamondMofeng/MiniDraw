/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current
 */
export function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log('无法创建程序对象');
    return false;
  }

  gl.useProgram(program);
  gl.program = program;

  return true;
}


/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
export function createProgram(gl, vshader, fshader) {
  // 创建着色器对象
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // 创建程序对象
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // 为程序对象分配顶点着色器和片元着色器
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // 连接着色器
  gl.linkProgram(program);

  // 检查连接
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log('无法连接程序对象: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

/**
* 创建着色器对象
* @param gl GL context
* @param type the type of the shader object to be created
* @param source shader program (string)
* @return created shader object, or null if the creation has failed.
*/
export function loadShader(gl, type, source) {
  // 创建着色器对象
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log('无法创建着色器');
    return null;
  }

  // 设置着色器源代码
  gl.shaderSource(shader, source);

  // 编译着色器
  gl.compileShader(shader);

  // 检查着色器的编译状态
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} points 
 * @param {*} attributeName 
 */
export function pointsIntoAttributeByAttributeName(gl, points, attributeName) {

  if (points instanceof Float32Array === false) {
    points = new Float32Array(points);
  }
  // console.log('points: ', points);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
  //把点数据传给attribute变量
  const a_Position = gl.getAttribLocation(gl.program, attributeName);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} points 
 * @param {*} attributeName 
 */
export function pointsIntoAttributeByLocation(gl, points, attributeLocation) {

  if (points instanceof Float32Array === false) {
    points = new Float32Array(points);
  }
  // console.log('points: ', points);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
  //把点数据传给attribute变量
  const a_Position = attributeLocation
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

}



/**
 * 每两个数字为一个点，绘制闭合直线。
 * @param {WebGLRenderingContext} gl 
 * @param {Float32Array[]} points 
 * @param {String} attributeName
 */
export function drawLineLoop(gl, points, attributeName) {
  let n = points.length / 2;

  pointsIntoAttributeByLocation(gl, points, attributeName);

  gl.drawArrays(gl.LINE_LOOP, 0, n);
}


/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} points 
 * @param {*} attributeName 
 */
export function drawLines(gl, points, attributeName) {
  let n = points.length / 2;

  pointsIntoAttributeByLocation(gl, points, attributeName);

  gl.drawArrays(gl.LINES, 0, n);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} points 
 * @param {*} attributeName 
 */
export function drawLineStrip(gl, points, attributeName) {
  let n = points.length / 2;

  pointsIntoAttributeByLocation(gl, points, attributeName);

  gl.drawArrays(gl.LINE_STRIP, 0, n);
}


const exports = {
  initShaders,
  createProgram,
  loadShader
}

export default exports