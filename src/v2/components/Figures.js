
import { useState } from 'react';
import Line from './figures/Line';

import Point from './figures/Point';

const Figures = () => {

  const testPoints = [{ x: 0, y: 0 }, { x: 100, y: 100 }]
  const [testPoint1, testPoint2] = testPoints


  const [Points, setPoints] = useState(testPoints || []);

  const [Lines, setLines] = useState([{ point1: testPoint1, point2: testPoint2 }] || []);

  return (
    <div>
      {Points.map((point, index) =>
        <Point key={index} x={point.x} y={point.y} />
      )}

      {Lines.map((line, index) =>
        <Line key={index} point1={line.point1} point2={line.point2} />
      )}

    </div>
  )
}

export default Figures;