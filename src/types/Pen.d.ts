
/**
 * 画笔
 */
interface Pen {
  injectEvent(canvasObj: HTMLCanvasElement): void;
  changeType(type: penType): void;
  draw_rect(): void;
  draw_free(): void;
}
