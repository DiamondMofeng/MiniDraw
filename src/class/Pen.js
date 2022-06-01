import ENUM_PEN_TYPES from "../types/penTypes.js";



/**
 * 用于创建绘画对象
 */
class Pen {


  /**
   * 
   * @param {*} type 
   */
  constructor(type) {

    this.type = type || null;//笔类型，直线、圆、矩形等

    this.canvas = undefined;

    this.downX = -1;
    this.downY = -1;
    this.upX = -1;
    this.upY = -1;
    this.curX = -1;
    this.curY = -1;


  }

  /**
   * 
   * @param {HTMLCanvasElement} canvasObj - 要注入的canvas对象
   */
  injectEvent(canvasObj) {
    let pen = this;
    this.canvas = canvasObj;
    this.ctx = canvasObj.getContext("2d");
    this.ctx.beginPath();

    //将画笔事件注入canvas对象
    //debug
    canvasObj.addEventListener('mousedown', console.log, false)
    canvasObj.addEventListener('mouseup', console.log, false)

    //实时记录鼠标位置
    canvasObj.onmousemove = function (event) {

      event = event || window.event;
      pen.curX = event.offsetX;
      pen.curY = event.offsetY;
      // pen.draw_free()
      
    }

    //按下鼠标
    canvasObj.onmousedown = function (event) {

      event = event || window.event;
      pen.downX = event.offsetX;
      pen.downY = event.offsetY;

    }

    //松开鼠标
    canvasObj.onmouseup = function (event) {

      event = event || window.event;
      pen.upX = event.offsetX;
      pen.upY = event.offsetY;
      // pen.draw_rect()

    }



  }

  /**
   * 
   * @param {penType} type 
   */
  changeType(type) {
    this.type = type;

    switch (type) {

      case ENUM_PEN_TYPES.line:
        console.log('直线');
        break;

      case ENUM_PEN_TYPES.free:
        console.log('自由');
        this.draw_free();
        break;

      case ENUM_PEN_TYPES.rect:
        console.log('矩形');
        this.draw_rect();
        break;

      default:
        break

    }

  }

  draw_rect() {

    this.ctx.strokeRect(this.downX, this.downY, this.curX - this.downX, this.curY - this.downY)

  }


  draw_free() {

    // this.ctx.moveTo(this.downX, this.downY);

    this.ctx.lineTo(this.curX, this.curY);
    this.ctx.moveTo(this.curX, this.curY);
    this.ctx.stroke();

  }



}


export default Pen;
