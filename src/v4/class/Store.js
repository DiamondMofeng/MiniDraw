/**
 * 储存所有figure
 */
export default class Store {
  constructor() {
    this.figures = [];
  }
  /**
   * 添加figure
   * @param {Figure} figure
   * @returns {Figure}
   * @memberof Store
   * @example
   * store.add(new Line(0,0,100,100));
   * store.add(new Rect(0,0,100,100));
   * store.add(new Circle(0,0,100,100));
   * store.add(new Point(0,0));
   */
  add(figure) {
    this.figures.push(figure);
    return figure;
  }


  /**
   * 删除figure
   * @param {Figure} figure
   * @returns {Figure}
   * @memberof Store
   * @example
   * store.remove(new Line(0,0,100,100));
   */
  remove(figure) {
    this.figures = this.figures.filter(f => f !== figure);
    return figure;
  }
    

  drawAll(figure) {
    this.figures.forEach(f => f.draw());
  }

}