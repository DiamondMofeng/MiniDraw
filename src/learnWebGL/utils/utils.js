
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


