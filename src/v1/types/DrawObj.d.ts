interface DrawObj {
  type: string;

  draw(ctx: CanvasRenderingContext2D): void;
}