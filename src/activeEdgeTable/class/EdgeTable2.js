// import { DrawObj } from "../../v4/class/DrawObj";

//接受顶点数组

// const colorWhite = 0;
const colorBlack = 1;



export class Edge {
  constructor(x, maxY, minY, k_reciprocal) {
    this.x = x;
    this.oriX = x;
    this.maxY = maxY;
    this.minY = minY;
    this.k_reciprocal = k_reciprocal;
    // this.next = null;
  }
}

/**
 * 装入每条边的信息
 */
export class EdgeTable {

  constructor(points, fillInConstrutor = true) {
    points = points.filter(item => item.color === colorBlack);
    let [minY, maxY] = [Math.min(...points.map(xy => xy.y)), Math.max(...points.map(xy => xy.y))]
    this.nodes = [];
    for (let i = minY; i <= maxY; i++) {
      this.nodes[i] = [];
    }
    if (fillInConstrutor) {
      this.fillEdgeTable(points);
    }
  }

  fillEdgeTable(points) {
    console.log('初始顶点 ', points);

    let startEdge = null;
    let lastEdge = null;  //用于后续处理公共顶点

    for (let i = 0; i < points.length; i++) {
      //两两遍历节点作为边
      let p1 = points[i];
      let p2 = points[(i + 1) % points.length];
      console.log('p1 : ', p1, "p2:", p2);


      //构造节点
      // let startX = Math.min(p1.x, p2.x);
      let maxY = Math.max(p1.y, p2.y);
      let k = (p2.y - p1.y) / (p2.x - p1.x);
      let k_reciprocal = 1 / k;


      //找到两点的y值最小的那个,将这个节点放入表中相应y处
      let minY = Math.min(p1.y, p2.y);
      let XofMinY = p1.y < p2.y ? p1.x : p2.x;
      //考虑缩短maxY,以应对公共顶点
      //与上一个边相交的情况
      if (lastEdge && lastEdge.maxY === minY) {
        lastEdge.maxY -= 1;
        console.log("缩短了maxY");
      }
      let curEdge = new Edge(XofMinY, maxY, minY, k_reciprocal);
      this.nodes[minY].push(curEdge);
      lastEdge = curEdge;
      if (!startEdge) {
        startEdge = curEdge;
      }
      console.log('构造ET中', JSON.parse(JSON.stringify(this.nodes)));
    }

    //循环中没有尝试缩短lastEdge,放到现在来进行
    if (startEdge && lastEdge) {
      if (lastEdge && lastEdge.maxY === startEdge.minY) {
        lastEdge.maxY -= 1;
        console.log("缩短了maxY");
      }
    }

    //对每个链表进行排序
    for (let i = 0; i < this.nodes.length; i++) {
      if (!this.nodes[i]) {
        continue;
      }
      this.nodes[i].sort((a, b) => a.x - b.x);
    }

  }

}

function getMinY(points) {

  return Math.min(...points.map(xy => xy.y));

}

function getMaxY(points) {

  return Math.max(...points.map(xy => xy.y));

}


/**
 * 
 * @param {Point[]} points 
 * @param {Function} fillFunc - 接受y,x1,x2,请自己实现fill过程
 */
export function scanFill(points, fillFunc) {

  //* 1.获得被填充的ET和空的AET
  let ET = new EdgeTable(points, true);
  // let AET = new EdgeTable(figure, false);
  let AET = [];

  //扫描线工作范围
  let startY = getMinY(points);
  let endY = getMaxY(points);

  //* 2.将第一个不空的ET表中的边与AET表合并
  for (let curY = startY; curY <= endY; curY++) {
    if (ET.nodes[curY].length > 0) {
      console.log('ET.nodes: ', ET.nodes);
      AET = AET.concat(ET.nodes[curY]);
      break;
    }
  }
  console.log("初始AET:", AET);


  //* 3.由AET表中取出交点并进行填充

  let curY = startY;

  while (AET.length > 0) {
    console.log('当前Y: ', curY);
    console.log("当前AET:", AET);

    let onFill = false; //是否在填充中（是否在多边形内部）
    let lastX = 0;      //上一个点的x坐标
    //遍历AET表
    for (let node of AET) {
      onFill = !onFill;

      if (onFill === false) {
        //若onFill遍历此点时被置为false,则此点为内部第二点
        //填充此点与上个点之间的区域
        //对x进行处理
        //左边界ceil
        let leftX = lastX;
        leftX = Math.ceil(leftX);
        //右边界若为整数，则-1，否则floor
        let rightX = node.x;
        rightX = rightX % 1 === 0
          ? rightX - 1
          : Math.floor(rightX);

        //填充
        console.log('填充: ', leftX, rightX);
        fillFunc(curY, leftX, rightX);  //* 接口，让调用者自己实现

      }
      //后续处理

      lastX = node.x;

    }

    //* 4.当前Y的扫描结束，为下一个Y的扫描做准备
    //清除当前y>=maxY的边
    let _curY = curY;
    AET = AET.filter(node => node.maxY > _curY);

    //y=y+1
    curY += 1;
    for (let node of AET) {
      node.x += node.k_reciprocal;
    }
    //将下一个Y的边加入AET表
    if (ET.nodes[curY]) {
      AET = AET.concat(ET.nodes[curY]);
    }
    //按x的大小排序
    AET.sort((a, b) => {
      return (a.x - b.x) === 0 ? (a.k_reciprocal - b.k_reciprocal) : (a.x - b.x);
    })

    //开始下个循环


  }
}


export let testRun = () => {
  let figure = {
    points: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
    ]
  }
  scanFill(figure);
}

