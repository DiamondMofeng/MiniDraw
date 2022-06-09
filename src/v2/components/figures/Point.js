import React, { useState } from "react";
import Dragable from "../auxi/Dragable";

import './Point.css';

const Point = ({ x, y }) => {

  // const pointStyle = {
  //   width: 200,
  //   height: 200,
  //   backgroundColor: "#FF1453",
  //   borderRadius: "50%",
  // }

  const [_x, setX] = useState(x);
  const [_y, setY] = useState(y);

  const [boundedComponents, setBoundedComponents] = useState([]);

  const myPoint = {
    left: _x,
    top: _y,
    width: 50,
    height: 50,
    backgroundColor: "#147aff",
    borderRadius: "50%",
  }

  // const myPoint{
  //   background-color: #1437ff;
  //   box-shadow: 0px 6px 20px rgba(51, 141, 231, 0.603);
  //   cursor: move;
  // }


  return (
    <Dragable x={_x} y={_y}>
      <p
        className="myPoint"

      />
    </Dragable>
  )



}

export default Point;





