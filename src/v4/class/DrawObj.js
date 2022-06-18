import { drawLines, drawLineLoop, drawLineStrip } from "../../learnWebGL/utils/glUtils";
import ENUM_PEN_TYPES from "../types/penTypes";



/**
 * 储存绘制对象的基本信息
 */
class DrawObj {
  constructor(type) {
    this.type = type;
    // this.startX = x;
    // this.startY = y;
  }
  /**
   * 
   * @param {WebGLRenderingContext} gl 
   */
  draw(gl, attributeName) { }
}

class Line extends DrawObj {
  constructor(x1, y1, x2, y2) {
    super(ENUM_PEN_TYPES.line);
    this.x1 = x1.toFixed(2);
    this.y1 = y1.toFixed(2);
    this.x2 = x2.toFixed(2);
    this.y2 = y2.toFixed(2);
  }

  /**
   * 
   * @param {WebGLRenderingContext} gl
   * @param {String} attributeName 
   */
  draw(gl, attributeName) {

    drawLines(gl, new Float32Array([this.x1, this.y1, this.x2, this.y2]), attributeName);

  }

}


class Rect extends DrawObj {
  constructor(x1, y1, x2, y2) {
    super(ENUM_PEN_TYPES.rect);
    this.x1 = x1.toFixed(2);
    this.y1 = y1.toFixed(2);
    this.x2 = x2.toFixed(2);
    this.y2 = y2.toFixed(2);
  }

  /**
   * 
   * @param {WebGLRenderingContext} gl 
   * @param {String} attributeName 
   */
  draw(gl, attributeName) {
    const vertices = new Float32Array([
      this.x1, this.y1,
      this.x2, this.y1,
      this.x2, this.y2,
      this.x1, this.y2,
    ])

    drawLineLoop(gl, vertices, attributeName);

  }
}

class Circle extends DrawObj {
  /**
   * 
   * @param {Number} x - 圆心的x坐标
   * @param {Number} y - 圆心的y坐标
   * @param {Number} r - 圆的半径
   * @param {Number} points - 圆的点数
   */
  constructor(x1, y1, x2, y2, points = 48) {
    super(ENUM_PEN_TYPES.circle);

    let centerX = (x1 + x2) / 2;
    let centerY = (y1 + y2) / 2;

    let rX = (x2 - x1) / 2;
    let rY = (y2 - y1) / 2;

    //提前求出圆上的点的坐标
    let pointsArr = [];
    for (let i = 0; i < points; i++) {
      let x = centerX + rX * Math.cos(2 * Math.PI / points * i);
      let y = centerY + rY * Math.sin(2 * Math.PI / points * i);
      pointsArr.push(x);
      pointsArr.push(y);
    }

    this.pointsArr = pointsArr

  }

  draw(gl, attributeName) {

    drawLineLoop(gl, this.pointsArr, attributeName);

  }
}

// 测试产物
class Circle2 extends DrawObj {
  /**
   * 
   * @param {Number} x - 圆心的x坐标
   * @param {Number} y - 圆心的y坐标
   * @param {Number} r - 圆的半径
   * @param {Number} points - 圆的点数
   */
  constructor(x, y, r, points = 48) {
    super(ENUM_PEN_TYPES.circle);
    this.x = x.toFixed(2);
    this.y = y.toFixed(2);
    this.r = r.toFixed(2);
    this.points = points;

    //提前求出圆上的点的坐标
    this.pointsArr = [];
    for (let i = 0; i < points; i++) {
      const angle = i * Math.PI * 2 / points;
      this.pointsArr.push(
        x + r * Math.cos(angle),
        y + r * Math.sin(angle)
      )
    }
    this.pointsArr = this.pointsArr.map(num => num.toFixed(4));

  }

  draw(gl, attributeName) {

    drawLineLoop(gl, this.pointsArr, attributeName);

  }
}

class MultiLines extends DrawObj {
  constructor(pointsArr) {
    super(ENUM_PEN_TYPES.multiLines);
    this.pointsArr = pointsArr;
  }

  addPoint(x, y) {
    this.pointsArr.push(x, y);
  }

  draw(gl, attributeName) {

    drawLineLoop(gl, this.pointsArr, attributeName);

  }
}

class Free extends DrawObj {
  constructor(pointsArr) {
    super(ENUM_PEN_TYPES.free);
    this.pointsArr = pointsArr;
  }

  addPoint(x, y) {
    this.pointsArr.push(x, y);
  }

  draw(gl, attributeName) {

    drawLineStrip(gl, this.pointsArr, attributeName);

  }
}

export { DrawObj, Line, Rect, Circle, Circle2, MultiLines, Free };