import { Component } from "react"
// import ENUM_PEN_TYPES from "../types/penTypes";
import History from "./History";

class HistoryList extends Component {
  // console.log('pen: ', pen);

  constructor({ pen }) {
    super();
    this.pen = pen;
    this.state = {
      stack: []
    }

    this.style_historyList = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      // justifyContent: "center",
      width: "15%",
      height: "100%",
      // backgroundColor: "rgba(0,0,0,0.2)",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 100,
      overflow: "scroll",

    }

    this.setStack = (stack) => this.setState({ stack })
  }

  componentDidMount() {
    this.pen.bindStack(this.state.stack, this.setStack);
  }

  componentDidUpdate() {
    this.pen.bindStack(this.state.stack, this.setStack)
  }

  render() {
    return (
      <>

        <div style={this.style_historyList}>
          {
            this.state.stack.map(
              (item, index) => <History pen={this.pen} figure={item} index={index} key={index} />
            )
          }
        </div>
      </>
    )
  }

}


export default HistoryList;