import { Slider } from "antd";
import { useRef, useEffect, useState } from "react";
import { setColor } from "../../learnWebGL/utils/glUtils";
import ENUM_PEN_TYPES from "../types/penTypes"
import './History.css'

const History = ({ pen, figure, index }) => {

  const historyRef = useRef(null);
  // console.log(historyRef)

  //挂载后，监听鼠标悬浮事件
  useEffect(() => {
    // componentDidMount
    const historyDiv = historyRef.current;
    historyDiv.addEventListener("mouseenter", () => {
      // console.log("mouseenter", figure)
      setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]))
      pen.renderAll();

      setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.5, 1.0, 1.0]))
      figure.draw(pen.gl, 'a_Position');

      setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]))
    });

    historyDiv.addEventListener("mouseleave", () => {
      setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]))
      pen.renderAll();
    });


    //用于componentDidUnmount
    return () => {
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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

    return (onEdit
      ? (
        <div>
          <button onClick={onEditClick}>编辑</button>

          <p>x1<Slider type="number" step={0.01} max={1} min={-1} value={x1} onChange={setX1} /></p>
          <p>y1<Slider type="number" step={0.01} max={1} min={-1} value={y1} onChange={setY1} /></p>
          <p>x2<Slider type="number" step={0.01} max={1} min={-1} value={x2} onChange={setX2} /></p>
          <p>y2<Slider type="number" step={0.01} max={1} min={-1} value={y2} onChange={setY2} /></p>
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
    <div key={index} ref={historyRef} className='History'>
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