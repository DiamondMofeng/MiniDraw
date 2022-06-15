import { useEffect, useState } from "react"
import ENUM_PEN_TYPES from "../types/penTypes";

const History = ({ pen }) => {
  // console.log('pen: ', pen);

  const [stack, setStack] = useState([]);

  useEffect(() => {
    // first

    return () => {
      pen.bindStack([], setStack);
    }
  })

  // const [isShowEdit, setIsShowEdit] = useState([]);

  // const EditBox = (x1, y1, x2, y2) => {
  //   return (
  //     <div style={{
  //       position: "absolute",
  //       top: "0px",
  //       left: "0px",
  //     }}>
  //       x1:<input type="text" value={x1} onChange={({ target }) => setAuthor(target.value)} />
  //       y1:<input type="text" value={y1} />
  //       x2:<input type="text" value={x2} />
  //       y2:<input type="text" value={y2} />

  //     </div>)
  // }





  // useEffect(() => {
  //   if(isShowEdit)
  // }, [stack])

  const style_history = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    width: "10%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.2)",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 100,
    overflow: "scroll",

  }

  return (
    <>

      <div style={style_history}>
        {
          stack.map((item, index) => {
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
          })
        }
      </div>
    </>
  )

}


export default History;