import React from "react"

// import Figure_Point from "../../class/figures/Point";

import "./Line.css"

class Line extends React.Component {
  constructor({ point1, point2 }) {
    super();
    this.point1 = point1;
    this.point2 = point2;
    console.log(point1, point2);

    if (point1.x === undefined || point1.y === undefined || point2.x === undefined || point2.y === undefined) {
      throw new Error("Line: point1 and point2 must have x and y");
    }

    this.lineRef = React.createRef();

    this.style_line = {
      stroke: "black",
      strokeWidth: "1",
    }

  }


  render() {
    return (
      <>

        <svg ref={this.lineRef} xmlns="http://www.w3.org/2000/svg" version="1.1">
          <line x1={this.point1.x} y1={this.point1.y} x2={this.point2.x} y2={this.point2.y}
            style={this.style_line} />
        </svg>

      </>
    )
  }

  componentDidMount() {
    const line = this.lineRef.current;
    // const document=line.ownerDocument;

    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `${this.point1.x} ${this.point1.y} ${this.point2.x - this.point1.x} ${this.point2.y - this.point1.y}`);
    svg.setAttribute("preserveAspectRatio", "none");
    line.appendChild(svg);

    const linePath = document.createElementNS(svgNS, "path");
    linePath.setAttribute("d", `M ${this.point1.x} ${this.point1.y} L ${this.point2.x} ${this.point2.y}`);
    linePath.setAttribute("stroke", "black");
    linePath.setAttribute("strokeWidth", "1");
    linePath.setAttribute("fill", "none");
    svg.appendChild(linePath);



  }
}

export default Line