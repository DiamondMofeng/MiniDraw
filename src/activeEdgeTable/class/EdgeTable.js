// import { DrawObj } from "../../v4/class/DrawObj";

//直接使用二维矩阵的格式

// const colorWhite = 0;
const colorBlack = 1;

function getXYPointsFromMatrix(matrix) {
  let points = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      if (matrix[y][x] === colorBlack) {
        points.push({
          x: x,
          y: y
        });
      }
    }
  }
  return points;
}

export class ActiveNode {
  constructor(id, x, ymax) {
    this.id = id;
    this.x = x;
    this.ymax = ymax;
    this.k_1 = 0;
    this.next = null;
  }

}

export class ActiveEdgeTable {



}


export class Edge {
  constructor(x, maxY, k_reciprocal) {
    this.x = x;
    this.maxY = maxY;
    this.k_reciprocal = k_reciprocal;
    // this.next = null;
  }
}

/**
 * 装入每条边的信息
 */
export class EdgeTable {

  constructor(matrix, fillInConstrutor = true) {
    let points = getXYPointsFromMatrix(matrix);
    let [minY, maxY] = [Math.min(...points.map(xy => xy.y)), Math.max(...points.map(xy => xy.y))]
    this.nodes = [];
    for (let i = minY; i <= maxY; i++) {
      this.nodes[i] = [];
    }
    if (fillInConstrutor) {
      this.fillEdgeTable(matrix);
    }
  }

  fillEdgeTable(matrix) {
    let points = getXYPointsFromMatrix(matrix);
    console.log('points: ', points);
    for (let i = 0; i < points.length; i++) {
      //两两遍历节点作为边
      let p1 = points[i];
      let p2 = points[(i + 1) % points.length];

      //构造节点
      let startX = Math.min(p1.x, p2.x);
      let maxY = Math.max(p1.y, p2.y);
      let k = (p2.y - p1.y) / (p2.x - p1.x);
      let K_reciprocal = 1 / k;


      //找到两点的y值最小的那个,将这个节点放入表中相应y处
      let minY = Math.min(p1.y, p2.y);
      console.log('minY: ', minY);
      console.log('this.nodes: ', this.nodes);
      this.nodes[minY].push(new Edge(startX, maxY, K_reciprocal));

    }
  }

}

function getMinY(matrix) {

  let points = getXYPointsFromMatrix(matrix);
  return Math.min(...points.map(xy => xy.y));

}

function getMaxY(matrix) {

  let points = getXYPointsFromMatrix(matrix);
  return Math.max(...points.map(xy => xy.y));

}


export function scanFill(matrix, fillFunc) {

  //* 1.获得被填充的ET和空的AET
  let ET = new EdgeTable(matrix, true);
  // let AET = new EdgeTable(figure, false);
  let AET = [];

  //扫描线工作范围
  let startY = getMinY(matrix);
  let endY = getMaxY(matrix);

  //* 2.将第一个不空的ET表中的边与AET表合并
  for (let curY = startY; curY <= endY; curY++) {
    if (ET.nodes[curY].length > 0) {
      AET = AET.concat(ET.nodes[curY]);
      break;
    }
  }


  //* 3.由AET表中取出交点并进行填充

  let curY = startY;

  while (AET.length > 0) {

    let onFill = false; //是否在填充中（是否在多边形内部）
    let lastX = 0;      //上一个点的x坐标
    //遍历AET表
    for (let node of AET) {
      onFill = !onFill;

      if (onFill === false) {
        //若onFill遍历此点时被置为false,则此点为内部第二点
        //填充此点与上个点之间的区域

        fillFunc(curY, lastX, node.x);  //TODO

      }
      //后续处理

      lastX = node.x;

    }

    //* 4.当前Y的扫描结束，为下一个Y的扫描做准备
    //清除当前y=maxY的边
    let _curY = curY;
    AET = AET.filter(node => node.maxY !== _curY);

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
      return a.x - b.x;
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

// function fill() {
//   //TODO
// }