import { useEffect, useState } from "react";
import { setColor } from "../../learnWebGL/utils/glUtils";
import { Slider } from "antd";


const EditBox = ({ pen, figure, index }) => {
  const [onEdit, setOnEdit] = useState(false);
  const [x1, setX1] = useState(figure.x1);
  const [y1, setY1] = useState(figure.y1);
  const [x2, setX2] = useState(figure.x2);
  const [y2, setY2] = useState(figure.y2);

  const onEditClick = () => {
    setOnEdit(!onEdit);
  }

  const onEditCancel = () => {
    setOnEdit(false);
  }

  const onEditConfirm = () => {
    setOnEdit(false);
    pen.editAt(index, x1, y1, x2, y2);
  }

  useEffect(() => {
    if (!onEdit) {
      return
    }
    setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]));
    pen.renderAll();

    setColor(pen.gl, 'u_FragColor', new Float32Array([1.0, 0.0, 0.0, 1.0]));
    new figure.constructor(x1, y1, x2, y2).draw(pen.gl, 'a_Position');

    setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]));

  })

  return (

    <div >
      <button onClick={onEditClick} >编辑</button>
      {onEdit === false
        ? null
        : <>
          <li>x1<Slider type="number" step={0.01} max={1} min={-1} value={x1} onChange={setX1} /></li>
          <li>y1<Slider type="number" step={0.01} max={1} min={-1} value={y1} onChange={setY1} /></li>
          <li>x2<Slider type="number" step={0.01} max={1} min={-1} value={x2} onChange={setX2} /></li>
          <li>y2<Slider type="number" step={0.01} max={1} min={-1} value={y2} onChange={setY2} /></li>
          <button onClick={onEditConfirm}>确认</button>
          <button onClick={onEditCancel}>取消</button>
        </>
      }
    </div>

  )
}

export default EditBox;