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

const BUTTON_TYPE_UNDO = "undo"
const BUTTON_TYPE_CLEAR = "clear"

const map_typeToEmoji = {
  [ENUM_PEN_TYPES.line]: "📏",
  [ENUM_PEN_TYPES.rect]: "⬜",
  [ENUM_PEN_TYPES.circle]: "⚪",
  [ENUM_PEN_TYPES.free]: "🖌️",
  [ENUM_PEN_TYPES.multiLines]: "📉",

  [BUTTON_TYPE_UNDO]: "↩️",
  [BUTTON_TYPE_CLEAR]: "🗑️",

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
          onClick={() => handleClick(type)}
          title={type}
        >
          {map_typeToEmoji[type] || type}
        </button>
      )}

      <button style={Style_Button}
        onClick={() => pen.undo()}
        title={BUTTON_TYPE_UNDO}
      >
        {map_typeToEmoji[BUTTON_TYPE_UNDO] || BUTTON_TYPE_UNDO}
      </button>
      <button style={Style_Button}
        onClick={() => { pen.clearStack(); pen.clearCanvas() }}
        title={BUTTON_TYPE_CLEAR}
      >
        {map_typeToEmoji[BUTTON_TYPE_CLEAR] || BUTTON_TYPE_CLEAR}
      </button>
    </div>
  )
}

export default Buttons;