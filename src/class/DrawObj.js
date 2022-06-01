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
  draw(ctx) { }
}

class Line extends DrawObj {
  constructor(x1, y1, x2, y2) {
    super(ENUM_PEN_TYPES.line);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
  /**
   * 
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }
}


class Rect extends DrawObj {
  constructor(x1, y1, x2, y2) {
    super(ENUM_PEN_TYPES.rect);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} ctx 
   */
  draw(ctx) {
    ctx.strokeRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
  }
}

class Circle extends DrawObj {
  constructor(x1, y1, x2, y2) {
    super(ENUM_PEN_TYPES.circle);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  /**
   *  
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x1, this.y1, this.x2 - this.x1, 0, Math.PI * 2, true);
    ctx.stroke();
  }
}

export { DrawObj, Line, Rect, Circle };