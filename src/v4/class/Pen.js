import { cssXYtoWebGLXY } from "../../learnWebGL/utils/utils.js";
import ENUM_PEN_TYPES from "../types/penTypes.js";
import { Circle, Free, Line, MultiLines, Rect } from "./DrawObj.js";



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

    this.stack = [];//画笔记录栈
    this.setStack = function (newStack) { this.stack = newStack };  //接受react设置栈的方法

    this.onDraw = false;

    // this.beforePreview = undefined; //记录预览前的图像作辅助

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
  injectEvent(canvasObj, attributeName) {
    let pen = this;
    this.canvas = canvasObj;
    this.gl = canvasObj.getContext("webgl");
    this.attributeName = attributeName;

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
    // canvasObj.addEventListener('mousemove', console.log, false)

    canvasObj.addEventListener('mousedown', handleMouseDown, false)
    canvasObj.addEventListener('mouseup', handleMouseUp, false)
    canvasObj.addEventListener('mousemove', handleMouseMove, false)

    //加入对触屏的支持
    const touchToMouse = {
      'touchstart': 'mousedown',
      'touchend': 'mouseup',
      'touchmove': 'mousemove'
    }

    for (let touchEvent in touchToMouse) {

      canvasObj.addEventListener(touchEvent, (e) => {
        if (e.touches.length !== 1) {
          return
        }
        e.preventDefault();

        let touch = e.touches[0];
        if (!touch) {
          return
        }
        let simMouseEvent = new MouseEvent(touchToMouse[touchEvent], {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        // return simMouseEvent
        canvasObj.dispatchEvent(simMouseEvent);

      }, false)
    }

    //实现一个Ctrl+Z
    canvasObj.parentElement.addEventListener('keydown', (e) => {
      // console.log(e)
      if (e.code === 'KeyZ' && e.ctrlKey) {
        console.log('Ctrl+Z')
        pen.undo();
      }
    })

  }

  bindStack(stack, setStack) {
    // this.stack = stack;
    this.setStack = setStack;
    console.log('bindStack')
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
          // this.tempFigure = null; //既然JS有GC，这里就不用了
          // console.log('mousedown');
          // console.log(this.gl)
        });

        this.bindEventListener('mouseup', (e) => {

          if (this.onDraw === false) {
            return
          }

          this.setOnDrawToFalse();
          this.clearCanvas();

          let [x1, y1] = cssXYtoWebGLXY(this.downX, this.downY, this.canvas.width, this.canvas.height);
          let [x2, y2] = cssXYtoWebGLXY(this.upX, this.upY, this.canvas.width, this.canvas.height);

          this.addToStack(new Line(x1, y1, x2, y2));

          this.renderAll();

        });

        // 仅用作预览
        this.bindEventListener('mousemove', (e) => {
          if (this.onDraw === false) {
            return
          }

          this.clearCanvas();
          this.renderAll();

          let [x1, y1] = cssXYtoWebGLXY(this.downX, this.downY, this.canvas.width, this.canvas.height);
          let [x2, y2] = cssXYtoWebGLXY(this.curX, this.curY, this.canvas.width, this.canvas.height);

          new Line(x1, y1, x2, y2).draw(this.gl, this.attributeName);

        })
        break;

      case ENUM_PEN_TYPES.free:

        this.bindEventListener('mousedown', (e) => {
          this.setOnDrawToTrue();
          this.tempPoints = [];
        });

        //实时显示，无需另加预览
        this.bindEventListener('mousemove', (e) => {
          if (this.onDraw === false) {
            return
          }

          this.clearCanvas();
          this.renderAll();

          let [x, y] = cssXYtoWebGLXY(this.curX, this.curY, this.canvas.width, this.canvas.height);
          this.tempPoints.push(x, y);

          new Free(this.tempPoints).draw(this.gl, this.attributeName);
        });

        this.bindEventListener('mouseup', (e) => {

          if (this.onDraw === false) {
            return
          }

          this.setOnDrawToFalse();

          let [x, y] = cssXYtoWebGLXY(this.upX, this.upY, this.canvas.width, this.canvas.height);
          this.tempPoints.push(x, y);

          this.addToStack(new Free(this.tempPoints));
          this.tempPoints = undefined;

          this.clearCanvas();
          this.renderAll();

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

          this.clearCanvas();
          this.setOnDrawToFalse();

          let [x1, y1] = cssXYtoWebGLXY(this.downX, this.downY, this.canvas.width, this.canvas.height);
          let [x2, y2] = cssXYtoWebGLXY(this.upX, this.upY, this.canvas.width, this.canvas.height);

          this.addToStack(new Rect(x1, y1, x2, y2));

          this.renderAll();
          // console.log(this.stack)

        });

        // 仅用作预览
        this.bindEventListener('mousemove', (e) => {
          if (this.onDraw === false) {
            return
          }
          this.clearCanvas();
          this.renderAll();

          let [x1, y1] = cssXYtoWebGLXY(this.downX, this.downY, this.canvas.width, this.canvas.height);
          let [x2, y2] = cssXYtoWebGLXY(this.curX, this.curY, this.canvas.width, this.canvas.height);

          new Rect(x1, y1, x2, y2).draw(this.gl, this.attributeName);
          // console.log('draw')

        })

        break;

      case ENUM_PEN_TYPES.circle:

        //暂定点击确定圆心，移动确定半径
        this.bindEventListener('mousedown', (e) => {
          this.setOnDrawToTrue();
        });

        this.bindEventListener('mouseup', (e) => {

          if (this.onDraw === false) {
            return
          }
          this.setOnDrawToFalse();

          let [x1, y1] = cssXYtoWebGLXY(this.downX, this.downY, this.canvas.width, this.canvas.height);
          let [x2, y2] = cssXYtoWebGLXY(this.upX, this.upY, this.canvas.width, this.canvas.height);

          this.addToStack(new Circle(x1, y1, x2, y2));
          // console.log(this.stack)
        });

        // 仅用作预览
        this.bindEventListener('mousemove', (e) => {
          if (this.onDraw === false) {
            return
          }
          this.clearCanvas();
          this.renderAll();

          let [x1, y1] = cssXYtoWebGLXY(this.downX, this.downY, this.canvas.width, this.canvas.height);
          let [x2, y2] = cssXYtoWebGLXY(this.curX, this.curY, this.canvas.width, this.canvas.height);

          new Circle(x1, y1, x2, y2).draw(this.gl, this.attributeName);

        })

        break;

      case ENUM_PEN_TYPES.multiLines:

        this.bindEventListener('mousedown', (e) => {

          //* 监听点击右键为终止
          if (e.button === 2 && this.onDraw === true) {
            // console.log('stop drawing multiLine')
            this.setOnDrawToFalse();

            this.addToStack(new MultiLines(this.tempPoints));
            this.tempPoints = undefined;

            this.clearCanvas();
            this.renderAll();
            return;
          }

          if (this.onDraw === false) {
            // console.log('start drawing multiLine')
            this.setOnDrawToTrue();
            this.tempPoints = [];
          }

          this.clearCanvas();
          this.renderAll();

          let [x, y] = cssXYtoWebGLXY(this.downX, this.downY, this.canvas.width, this.canvas.height);
          this.tempPoints.push(x, y);
          // console.log('this.tempPoints: ', this.tempPoints);
          new MultiLines(this.tempPoints).draw(this.gl, this.attributeName);

        });

        //预览
        this.bindEventListener('mousemove', (e) => {
          if (this.onDraw === false) {
            return
          }
          this.clearCanvas();
          this.renderAll();

          let [x, y] = cssXYtoWebGLXY(this.curX, this.curY, this.canvas.width, this.canvas.height);
          this.tempPoints.push(x, y);
          new MultiLines(this.tempPoints).draw(this.gl, this.attributeName);
          this.tempPoints.length = this.tempPoints.length - 2;  //去除最后一个点

        });

        break;

      default:
        if (!Object.values(ENUM_PEN_TYPES).includes(this.penType)) {
          throw new Error('未知的画笔类型！');
        }
        break;
    }
  }

  setOnDrawToTrue() {
    this.onDraw = true;
  }

  setOnDrawToFalse() {
    this.onDraw = false;
  }

  // /**
  //  * 本来想放到画布组件里面，先放到这里吧
  //  */

  undo() {
    if (this.stack.length === 0) {
      return
    }
    this.clearCanvas();

    let newStack = this.stack.slice(0, this.stack.length - 1);
    this.stack = newStack;
    this.setStack(newStack);

    this.renderAll();
  }


  clearCanvas() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  clearStack() {
    this.stack = [];
    this.setStack([]);
  }

  removeAt(index) {
    if (this.stack.length === 0) {
      return
    }
    this.clearCanvas();
    let newStack = this.stack.filter((item, i) => item.index !== index)
    this.stack = newStack;
    this.setStack(newStack);
    this.renderAll();
  }

  addToStack(figure) {

    if (!figure.index) {
      if (this.stack.length === 0) {
        figure.index = 0;
      }
      else {
        figure.index = this.stack[this.stack.length - 1].index + 1;
      }
    }

    let newStack = this.stack.concat(figure);
    this.stack = newStack;
    this.setStack(newStack);
  }

  setHidden(index) {
    let newStack = this.stack.map((item, i) => {
      if (item.index === index) {
        item.hidden = !item.hidden;
      }
      return item;
    })

    this.stack = newStack;
    this.setStack(newStack);
    this.renderAll();
  }

  editAt(index, x1, y1, x2, y2) {
    let newStack = this.stack.map((item, i) => {
      if (item.index === index) {
        item.x1 = x1;
        item.y1 = y1;
        item.x2 = x2;
        item.y2 = y2;
      }
      return item;
    })

    this.stack = newStack;
    this.setStack(newStack);
    this.renderAll();
  }

  renderAll() {
    this.clearCanvas();
    this.stack.forEach((figure) => {
      if (!figure.hidden) {
        figure.draw(this.gl, this.attributeName)
      }
    }
    )
  }




}



export default Pen;
