import ENUM_PEN_TYPES from "../types/penTypes"


const History = ({ pen, figure, index }) => {

  const item = figure
  index = figure.index || index


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
          ENUM_PEN_TYPES.circle,
          ENUM_PEN_TYPES.line,
          ENUM_PEN_TYPES.rect,
          // ENUM_PEN_TYPES.multiLines,
        ].includes(item.type) ?
          <button onClick={() => {
            alert('暂不支持')
          }}>
            编辑
          </button>
          : null
      }

    </div>
  )


}
export default History;