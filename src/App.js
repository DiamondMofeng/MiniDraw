import './App.css';
import Canvas from './components/Canvas';
import Pen from './class/Pen';
import Buttons from './components/Buttons';





function App() {

  let pen = new Pen();


  return (
    <div className="App">
      <Buttons pen={pen} />
      <Canvas pen={pen} />
    </div>
  );
}

export default App;
