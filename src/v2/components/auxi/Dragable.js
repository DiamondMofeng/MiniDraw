import React from "react";

class Dragable extends React.Component {

  constructor({ children, x, y }) {
    super();

    this.div = React.createRef();

    this.state = {
      x: x || 0,
      y: y || 0,
      dragging: false,
    }

    this.children = children;

    this.initOffsetX = 0;
    this.initOffsetY = 0;

    this.style = {
      position: 'absolute',
      top: this.state.y,
      left: this.state.x,
    }


  }




  render() {
    return (
      <div ref={this.div}
        draggable={true}
        style={{
          position: 'absolute',
          top: this.state.y,
          left: this.state.x,
        }
        }>
        {this.children}
      </div>
    )
  }

  componentDidMount() {
    // console.log('this.div.current: ', this.div);
    const div = this.div.current;
    div.ownerDocument.addEventListener('dragover', (e) => e.preventDefault());

    div.addEventListener('dragstart', this.onDragStart);
    div.addEventListener('drag', this.onDrag);
    div.addEventListener('dragend', this.onDragEnd);

    // div.addEventListener('dragover', (e) => e.preventDefault());

    // div.addEventListener('mousedown', this.onMouseDown);
    // div.addEventListener('mousemove', this.onMouseMove);
    // div.addEventListener('mouseup', this.onMouseUp);

  }

  onDragStart = (e) => {
    // e.preventDefault();
    // console.log(e)
    this.setState({
      dragging: true,
    })
    this.initOffsetX = e.pageX - this.state.x;
    this.initOffsetY = e.pageY - this.state.y;
    // console.log('onDragStart: ', this.initOffsetX, this.initOffsetY);
  }

  onDrag = (e) => {
    e.preventDefault()
    // console.log(e)
    if (this.state.dragging) {
      // console.log('onDrag: ', e.pageX, e.pageY);
      this.setState({
        x: e.pageX - this.initOffsetX,
        y: e.pageY - this.initOffsetY,
      })
    }
  }

  onDragEnd = (e) => {
    console.log(e)

    this.setState({
      dragging: false,
      x: e.pageX - this.initOffsetX,
      y: e.pageY - this.initOffsetY,
    })
  }




  // ==========================================================
  onMouseDown = (e) => {
    e.preventDefault();
    this.setState({
      dragging: true,
      // x: e.clientX,
      // y: e.clientY,
    })
    this.initOffsetX = e.offsetX;
    this.initOffsetY = e.offsetY;
    // console.log(this.state)
  }

  onMouseMove = (e) => {
    e.preventDefault();
    // console.log(e)
    if (this.state.dragging) {
      const newX = e.clientX - this.initOffsetX;
      const newY = e.clientY - this.initOffsetY;
      // console.log({ newX, newY })
      // console.log({
      //   a: this.initOffsetX,
      //   b: this.initOffsetY
      // })
      this.setState({
        x: newX,
        y: newY,
      })
      // console.log(this.state)
    }

  }

  onMouseUp = (e) => {
    e.preventDefault();
    this.setState({
      dragging: false,
    })
  }
}

export default Dragable;