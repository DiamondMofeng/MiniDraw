import { DrawObj } from "../class/DrawObj";

interface Canvas  {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  stack: Array<DrawObj>;
}