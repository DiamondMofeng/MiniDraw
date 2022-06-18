import Canvas from './components/Canvas';
import Pen from './class/Pen';
import Buttons from './components/Buttons';
// import History from './components/History';
import HistoryList from './components/HistoryList';





function V4() {

  let pen = new Pen();

  return (
    <div style={{ textAlign: "center" }}>
      <p>
        提示：鼠标悬浮可查看具体的按钮名称； multiLines模式下,单击左键绘制各路径点，右键完成绘制。
        其他模式下按住左键开始绘制，松开左键完成绘制。
      </p>
      <Buttons pen={pen} />
      <Canvas pen={pen} width={900} height={600} />
      <HistoryList pen={pen} />
      <p>Copyright ©2021-2022 Mofeng. All Rights Reserved.
      </p>
      <p>
        <a href={"https://blog.mofengfeng.com/"}>Blog</a>|<a href={"https://github.com/DiamondMofeng/"}>Github</a>
      </p>
    </div>
  );
}

export default V4;
