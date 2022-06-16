import { Slider } from "antd";
import { useState } from "react";
import Canvas from "./components/Canvas";

import './AntiAliasing.css';

const AntiAliasing = () => {

  const [pointSize, setPointSize] = useState(100);
  const [pointFreq, setPointFreq] = useState(2);
  // const [x1, setX1] = useState(0);
  // const [y1, setY1] = useState(0);
  const x1 = 0;
  const y1 = 0;
  const [x2, setX2] = useState(500);
  const [y2, setY2] = useState(500);

  const width = 500;
  const height = 500;

  return (
    <div className="AntiAliasing">
      <div className='Bars'>
        x2<Slider min={0} max={width} value={x2} onChange={setX2} />
        y2<Slider min={0} max={x2} value={y2} onChange={setY2} />
        point size<Slider min={1} max={100} value={pointSize} onChange={setPointSize} />
        point freq<Slider min={0.01} max={4} step={0.01} value={pointFreq} onChange={setPointFreq} />
      </div>
      <Canvas width={width} height={height} x1={x1} y1={y1} x2={x2} y2={y2} pointSize={pointSize} pointFreq={pointFreq} />
    </div>
  );


}
export default AntiAliasing;