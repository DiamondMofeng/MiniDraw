import { useEffect, useState } from "react"

const History = ({ pen, stack }) => {
  console.log('pen: ', pen);

  const [history, setHistory] = useState(pen.stack);

  useEffect(() => {
    setHistory(pen.stack);
    return () => {
    }
  }, [pen.stack])


  return (
    <>
      <div style={{
        border: "1px solid #ccc",
        position: "absolute",
        top: "20px",
        left: "20px",
      }}>
        {
          history.map((item, index) => {
            return (
              <div key={index}>
                <p>{index}.{item.type}</p>
                <button onClick={() => {
                  pen.removeAt(index)
                }
                }>删除</button>

                <button onClick={() => {
                  item.hidden = !item.hidden
                }
                }>{item.hidden ? "显示" : "隐藏"}</button>

              </div>
            )
          })
        }
      </div>
    </>
  )

}


export default History;