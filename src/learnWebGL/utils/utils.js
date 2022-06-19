import { Matrix3 } from "three";

/**
 * 输入offsetXY和画布的宽高来得到WebGL的坐标
 * @param {Number} x 
 * @param {Number} y
 * @param {Number} width - 画布的宽
 * @param {Number} height - 画布的高
 * @returns {Number[]} [x, y]
 * @example 
 * 对于输入[50, 50, 100, 100]，返回[0, 0]
 * 对于输入[20, 30, 100, 100]，返回[-30, 20]
 */
export function cssXYtoWebGLXY(x, y, width, height) {

  //求画布中点的CSS坐标
  let canvasHalfWidth = width / 2;
  let canvasHalfHeight = height / 2;

  //求对应的WebGL坐标
  //先移动原点，再改变坐标轴正负(y轴反向)
  let webGLX = x - canvasHalfWidth;
  let webGLY = -(y - canvasHalfHeight);

  //WebGL坐标的范围是(-1,1)，所以进行比例映射
  //以画布中点为原点的坐标的范围是(-half,half)，所以直接除以half即可
  webGLX = webGLX / canvasHalfWidth;
  webGLY = webGLY / canvasHalfHeight;

  return [webGLX, webGLY];

}


export function mapXYtoWebGLXY(x, y, width, height) {

  return [x / width / 2, y / height / 2];

}

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Matrix3|Number[]} matrix 
 */
export function transformXY(x, y, matrix) {
  let m;
  if (matrix instanceof Matrix3) {
    m = matrix;
  }
  else if (matrix instanceof Array || matrix instanceof Float32Array) {
    m = new Matrix3();
    m.set(...matrix);
  }
  else {
    throw new Error('matrix type error');
  }

  let _x = x;
  let _y = y;
  let _z = 1;

  let _x2 = m.elements[0] * _x + m.elements[1] * _y + m.elements[2] * _z;
  let _y2 = m.elements[3] * _x + m.elements[4] * _y + m.elements[5] * _z;
  // let _z2 = m.elements[6] * _x + m.elements[7] * _y + m.elements[8] * _z;

  return [_x2, _y2];

}


/**
 * 
 * @param {DrawObj} figure 
 * @param {Matrix3} matrix 
 */
export function transformFigure2D(figure, matrix) {

  let newPoints = [];
  for (let i = 0; i < figure.points.length; i += 2) {
    let [_x, _y] = figure.points.slice(i, i + 2);
    let [x, y] = transformXY(_x, _y, matrix);
    newPoints.push(x, y);
  }
  figure.points = new Float32Array(newPoints);
  return figure;
}

/**
 * 
 * @param {Matrix3} m 
 * @param {*} offsetX 
 * @param {*} offsetY 
 */
export function doOffset(m, offsetX, offsetY) {
  m.elements[2] += offsetX;
  m.elements[5] += offsetY;
}
