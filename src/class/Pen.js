import ENUM_PEN_TYPES from "../types/penTypes.js";



/**
 * 用于创建绘画对象
 */
class Pen {


  /**
   * 实例化
   * @param {*} type 
   */
  constructor(type) {

    this.type = type || null;//笔类型，直线、圆、矩形等

    this.canvasComponent = undefined;//绑定的canvas组件
    this.canvas = undefined;  //canvas Dom对象

    // this.stack = undefined;//画笔记录栈
    this.stack = [];//画笔记录栈

    this.onDraw = false;

    this.beforePreview = undefined; //记录预览前的图像作辅助

    this.downX = -1;
    this.downY = -1;
    this.upX = -1;
    this.upY = -1;
    this.curX = -1;
    this.curY = -1;

    this.listenerMap = {
      mousedown: undefined,
      mouseup: undefined,
      mousemove: undefined,
    }

  }

  /**
   * 
   * @param {Canvas} canvasComponent 
   */
  bindCanvasComponent(canvasComponent) {

    this.canvasComponent = canvasComponent;
    // this.stack = canvasComponent.stack;

    this.injectEvent(canvasComponent.canvas);

  }


  /**
   * 
   * @param {HTMLCanvasElement} canvasObj - 要注入的canvas对象
   */
  injectEvent(canvasObj) {
    let pen = this;
    this.canvas = canvasObj;
    this.ctx = canvasObj.getContext("2d");

    //将画笔事件注入canvas对象
    //添加记录鼠标位置的监听

    const handleMouseDown = function (e) {
      pen.downX = e.offsetX;
      pen.downY = e.offsetY;
    };

    const handleMouseUp = function (e) {
      pen.upX = e.offsetX;
      pen.upY = e.offsetY;
    };

    const handleMouseMove = function (e) {
      pen.curX = e.offsetX;
      pen.curY = e.offsetY;
    };


    // canvasObj.addEventListener('mousedown', console.log, false)
    // canvasObj.addEventListener('mouseup', console.log, false)

    canvasObj.addEventListener('mousedown', handleMouseDown, false)
    canvasObj.addEventListener('mouseup', handleMouseUp, false)
    canvasObj.addEventListener('mousemove', handleMouseMove, false)

  }

  /**
   * 改变画笔的类型。 
   * 思路：
   * 清除当前的监听事件，重新绑定新的监听事件
   * @param {penType} type 
   */
  changeType(type) {

    this.type = type;
    this.clearAllEventListener();
    this.bindEventsWithPenType(type);

  }

  bindEventListener(event, callback) {
    this.listenerMap[event] = callback;
    this.canvas.addEventListener(event, callback, false);
  }


  /**
   * 注：不清除监听画笔位置的事件
   */
  clearAllEventListener() {
    for (let key in this.listenerMap) {
      this.canvas.removeEventListener(key, this.listenerMap[key], false);
      this.listenerMap[key] = undefined;
    }
  }

  bindEventsWithPenType(type) {
    switch (type) {

      case ENUM_PEN_TYPES.line:

        this.bindEventListener('mousedown', (e) => {
          this.setOnDrawToTrue();
          this.ctx.beginPath();
          this.ctx.moveTo(e.offsetX, e.offsetY);
        });
        this.bindEventListener('mouseup', (e) => {

          if (this.onDraw === false) {
            return
          }

          this.setOnDrawToFalse();
          this.ctx.lineTo(e.offsetX, e.offsetY);
          this.ctx.stroke();

          this.stack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));

        });
        break;

      case ENUM_PEN_TYPES.free:

        this.bindEventListener('mousedown', (e) => {
          this.setOnDrawToTrue();
          this.ctx.beginPath();
          this.ctx.moveTo(e.offsetX, e.offsetY);
        });

        this.bindEventListener('mousemove', (e) => {
          if (this.onDraw === false) {
            return
          }
          this.ctx.lineTo(e.offsetX, e.offsetY);
          this.ctx.stroke();
        });

        this.bindEventListener('mouseup', (e) => {

          if (this.onDraw === false) {
            return
          }

          this.setOnDrawToFalse();
          this.ctx.lineTo(e.offsetX, e.offsetY);
          this.ctx.stroke();

          this.stack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
        });

        break;

      case ENUM_PEN_TYPES.rect:

        this.bindEventListener('mousedown', (e) => {
          this.setOnDrawToTrue();
        });

        this.bindEventListener('mouseup', (e) => {

          if (this.onDraw === false) {
            return
          }

          this.setOnDrawToFalse();
          this.ctx.strokeRect(e.offsetX, e.offsetY, this.downX - e.offsetX, this.downY - e.offsetY);

          this.stack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));

        });

        break;

      case ENUM_PEN_TYPES.circle:

        this.bindEventListener('mousedown', (e) => {
          this.setOnDrawToTrue();
        });

        this.bindEventListener('mouseup', (e) => {

          if (this.onDraw === false) {
            return
          }

          this.setOnDrawToFalse();

          let centerX = (this.upX + this.downX) / 2
          let centerY = (this.upY + this.downY) / 2
          this.ctx.beginPath();
          this.ctx.ellipse(centerX, centerY, Math.abs((this.upX - this.downX) / 2), Math.abs((this.upY - this.downY)) / 2, 0, 0, 2 * Math.PI);
          this.ctx.stroke()

          this.stack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
          // this.ctx.arc(centerX, centerY, Math.abs((e.offsetX - this.downX) / 2), 0, 2 * Math.PI);
          // this.ctx.stroke();
        });

        break;

      case ENUM_PEN_TYPES.multiLine:

        this.bindEventListener('mousedown', (e) => {
          //* 监听点击右键为终止
          if (e.button === 2 && this.onDraw === true) {
            // console.log('stop drawing multiLine')
            this.setOnDrawToFalse();
            this.stack.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
            return;
          }

          if (this.onDraw === false) {
            // console.log('start drawing multiLine')
            this.setOnDrawToTrue();
            this.ctx.beginPath();
          }

          this.ctx.lineTo(e.offsetX, e.offsetY);
          this.ctx.moveTo(e.offsetX, e.offsetY);
          this.ctx.stroke();

        });

        break;

      default:
        break;
    }
  }

  setOnDrawToTrue() {
    this.onDraw = true;
  }

  setOnDrawToFalse() {
    this.onDraw = false;
  }

  /**
   * 本来想放到画布组件里面，先放到这里吧
   */
  undo() {
    // console.log(this.stack)
    if (this.stack.length === 0) {
      return
    }
    this.clearCanvas();
    let lastImage = this.stack.at(-2);  //-2，回到本次的上次，相当于撤销
    if (lastImage) {
      this.ctx.putImageData(lastImage, 0, 0);
    }
    this.stack.pop();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }




}



export default Pen;
