
/**
 * 画笔
 */
interface Pen {
  penType: ENUM_PEN_TYPES;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  stack: Array<ImageData>;
  onDraw: boolean;
  downX: number;
  downY: number;
  upX: number;
  upY: number;
  curX: number;
  curY: number;
  beforePreview: ImageData;
  bindCanvasComponent: (canvas: Canvas) => void;
  injectEvent(canvasObj: HTMLCanvasElement): void;
  changeType(type: penType): void;
  bindEventListener: (eventName: string, callback: (e: MouseEvent) => void) => void;
  setOnDrawToTrue: () => void;
  setOnDrawToFalse: () => void;
  undo: () => void;
  clearCanvas: () => void;
  clearStack: () => void;
  savePreview: () => void;
  readPreview: () => void;

}
