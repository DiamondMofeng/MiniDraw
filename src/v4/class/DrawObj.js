import { drawLines, drawLineLoop, drawLineStrip } from "../../learnWebGL/utils/glUtils";
import ENUM_PEN_TYPES from "../types/penTypes";



/**
 * 储存绘制对象的基本信息
 */
class DrawObj {
  constructor(type) {
    this.type = type;
    this.points = [];
  }
  /**
   * 
   * @param {WebGLRenderingContext} gl 
   */
  draw(gl, attributeName) { }
  
  clone() {
    let clone = new this.constructor()
    Object.assign(clone, this)
    return clone
  }

}

class Line extends DrawObj {
  constructor(x1, y1, x2, y2) {
    super(ENUM_PEN_TYPES.line);
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.points = [];
  }

  /**
   * 
   * @param {WebGLRenderingContext} gl
   * @param {String} attributeName 
   */
  draw(gl, attributeName) {

    if (
      !(this.lastX1 === this.x1) ||
      !(this.lastY1 === this.y1) ||
      !(this.lastX2 === this.x2) ||
      !(this.lastY2 === this.y2)) {
      this.updatePoints();
    }

    drawLines(gl, this.points, attributeName);

  }

  updatePoints() {
    this.lastX1 = this.x1
    this.lastY1 = this.y1
    this.lastX2 = this.x2
    this.lastY2 = this.y2
    this.points = new Float32Array([this.x1, this.y1, this.x2, this.y2]);
  }

}


class Rect extends DrawObj {
  constructor(x1, y1, x2, y2) {
    super(ENUM_PEN_TYPES.rect);
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
  }

  /**
   * 
   * @param {WebGLRenderingContext} gl 
   * @param {String} attributeName 
   */
  draw(gl, attributeName) {
    if (
      !(this.lastX1 === this.x1) ||
      !(this.lastY1 === this.y1) ||
      !(this.lastX2 === this.x2) ||
      !(this.lastY2 === this.y2)) {
      // console.log('update points')
      this.updatePoints();
    }

    // console.log('!this.lastX1 === this.x1: ', !this.lastX1 === this.x1);
    // console.log(this.points)

    drawLineLoop(gl, this.points, attributeName);

  }

  updatePoints() {
    this.lastX1 = this.x1
    this.lastY1 = this.y1
    this.lastX2 = this.x2
    this.lastY2 = this.y2
    this.points = new Float32Array([
      this.x1, this.y1,
      this.x2, this.y1,
      this.x2, this.y2,
      this.x1, this.y2,
    ]);
  }

}

class Circle extends DrawObj {
  /**
   * 
   * @param {Number} x - 圆心的x坐标
   * @param {Number} y - 圆心的y坐标
   * @param {Number} r - 圆的半径
   * @param {Number} pointNum - 圆的点数
   */
  constructor(x1, y1, x2, y2, pointNum = 48) {
    super(ENUM_PEN_TYPES.circle);
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.pointNum = pointNum;
    this.points = [];



  }

  draw(gl, attributeName) {

    if (
      !(this.lastX1 === this.x1) ||
      !(this.lastY1 === this.y1) ||
      !(this.lastX2 === this.x2) ||
      !(this.lastY2 === this.y2)) {
      this.updatePoints();
    }

    drawLineLoop(gl, this.points, attributeName);

  }

  updatePoints() {
    this.lastX1 = this.x1
    this.lastY1 = this.y1
    this.lastX2 = this.x2
    this.lastY2 = this.y2
    this.points = new Float32Array(this.points);

    let x1 = this.x1,
      y1 = this.y1,
      x2 = this.x2,
      y2 = this.y2;
    let pointNum = this.pointNum

    let centerX = (x1 + x2) / 2;
    let centerY = (y1 + y2) / 2;

    let rX = (x2 - x1) / 2;
    let rY = (y2 - y1) / 2;

    //提前求出圆上的点的坐标
    let pointsArr = [];
    for (let i = 0; i < pointNum; i++) {
      let x = centerX + rX * Math.cos(2 * Math.PI / pointNum * i);
      let y = centerY + rY * Math.sin(2 * Math.PI / pointNum * i);
      pointsArr.push(x);
      pointsArr.push(y);
    }

    this.points = pointsArr

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
    this.points = pointsArr;
  }

  addPoint(x, y) {
    this.points.push(x, y);
  }

  draw(gl, attributeName) {

    drawLineLoop(gl, this.points, attributeName);

  }
}

class Free extends DrawObj {
  constructor(pointsArr) {
    super(ENUM_PEN_TYPES.free);
    this.points = pointsArr;
  }

  addPoint(x, y) {
    this.points.push(x, y);
  }

  draw(gl, attributeName) {

    drawLineStrip(gl, this.points, attributeName);

  }
}

export { DrawObj, Line, Rect, Circle, Circle2, MultiLines, Free };