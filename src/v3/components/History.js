import { useState } from "react";
import ENUM_PEN_TYPES from "../types/penTypes"


const History = ({ pen, figure, index }) => {


  const EditBox = () => {
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


    return (onEdit
      ? (
        <div>
          <button onClick={onEditClick}>编辑</button>
          <p>x1<input type="number" step={0.01} max={1} min={-1} value={x1} onChange={(e) => setX1(e.target.value)} /></p>
          <p>y1<input type="number" step={0.01} max={1} min={-1} value={y1} onChange={(e) => setY1(e.target.value)} /></p>
          <p>x2<input type="number" step={0.01} max={1} min={-1} value={x2} onChange={(e) => setX2(e.target.value)} /></p>
          <p>y2<input type="number" step={0.01} max={1} min={-1} value={y2} onChange={(e) => setY2(e.target.value)} /></p>
          <button onClick={onEditConfirm}>确认</button>
          <button onClick={onEditCancel}>取消</button>
        </div>
      )
      : (<div>
        <button onClick={onEditClick}>编辑</button>
      </div>
      )
    )
  }







  const item = figure
  index = figure.index || index

  // const handelEdit = () => {
  //   pen.editAt(index)






  return (
    <div key={index}>
      <p>{index}.{item.type}</p>
      <button onClick={() => {
        pen.removeAt(index)
      }
      }>删除</button>

      <button onClick={() => {
        pen.setHidden(index)
      }
      }>{item.hidden ? "显示" : "隐藏"}</button>

      {
        [
          ENUM_PEN_TYPES.line,
          ENUM_PEN_TYPES.rect,
        ].includes(item.type)
          ? <EditBox />
          : null
      }

    </div>
  )


}
export default History;