import { useRef, useEffect } from "react";
import { setColor } from "../../learnWebGL/utils/glUtils";
import ENUM_PEN_TYPES from "../types/penTypes"
import EditBox from "./EditBox";
import './History.css'
import Transform from "./Transform";

const History = ({ pen, figure, index }) => {

  const historyRef = useRef(null);
  // console.log(historyRef)

  const handleMouseEnter = () => {
    setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]))
    pen.renderAll();

    setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.5, 1.0, 1.0]))
    figure.draw(pen.gl, 'a_Position');
    console.log(figure)

    setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]))
  }

  const handleMouseLeave = () => {
    setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]))
    pen.renderAll();
  }


  //挂载后，监听鼠标悬浮事件
  useEffect(() => {
    // componentDidMount
    const historyDiv = historyRef.current;
    historyDiv.addEventListener("mouseenter", handleMouseEnter);
    historyDiv.addEventListener("mouseleave", handleMouseLeave);


    //用于componentDidUnmount
    return () => {
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // componentDidUpdate
    const historyDiv = historyRef.current;
    historyDiv.addEventListener("mouseenter", handleMouseEnter);
    historyDiv.addEventListener("mouseleave", handleMouseLeave);
  })






  const _figure = figure
  index = figure.index || index

  // const handelEdit = () => {
  //   pen.editAt(index)






  return (
    <div key={index} ref={historyRef} className='History'>
      <p>{index}.{_figure.type}</p>
      <button onClick={() => {
        pen.removeAt(index)
      }
      }>删除</button>

      <button onClick={() => {
        pen.setHidden(index)
      }
      }>{_figure.hidden ? "显示" : "隐藏"}</button>

      {
        [
          ENUM_PEN_TYPES.line,
          ENUM_PEN_TYPES.rect,
          ENUM_PEN_TYPES.circle,
        ].includes(_figure.type)
          ? <EditBox pen={pen} figure={_figure} index={index} />
          : null
      }

      <Transform pen={pen} figure={_figure} index={index} />

    </div>
  )


}
export default History;