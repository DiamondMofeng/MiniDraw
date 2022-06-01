import React from "react";
import ENUM_PEN_TYPES from "../types/penTypes";

//* ==================Style=====================
const Style_Button = {
  width: "100px",
  height: "100px",
  margin: "5px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  backgroundColor: "#fff",
  color: "#000",
  fontSize: "20px",
  cursor: "pointer",
  textAlign: "center",
  lineHeight: "30px",
  outline: "none"
}

const Style_Button_Chossen = {
  ...Style_Button,
  backgroundColor: "#eee"

}


//* ==================Component=====================

/**
 * 仅仅用来改变画笔的类型
 * @param {Pen} pen - 画笔的实例对象
 */
const Buttons = ({ pen }) => {

  // const pen=pen

  const [choosenType, setChoosenType] = React.useState(null)

  const handleClick = (type) => {
    // console.log(choosenType)
    setChoosenType(type)
    pen.changeType(type);
  }


  return (
    <div>
      {Object.values(ENUM_PEN_TYPES).map((type) =>
        <button
          key={type}
          style={choosenType === type ? Style_Button_Chossen : Style_Button}
          onClick={function () { return handleClick(type) }}
        >
          {type}
        </button>
      )}

      <button style={Style_Button}
        onClick={function () { return pen.undo() }}
      >undo</button>
    </div>
  )
}

export default Buttons;