import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import V1 from './v1/v1';
// import V2 from './v2/V2';
import V3 from "./v3/v3";
import AntiAliasing from "./anti-aliasing/AntiAliasing";
// import LearnWebGL from "./learnWebGL";







function App() {



  return (
    <div className="App" style={{ textAlign: "center" }}>
      <h1>MiniDraw</h1>

      <nav>
        |
        <Link to="/V1">Canvas2D实现</Link>|
        <Link to="/V3">WebGL实现</Link>|
        <Link to="/AA">反走样1</Link>|
      </nav>



      <Routes>
        <Route path="V1" element={<V1 />} />
        <Route path="V3" element={<V3 />} />
        <Route path="AA" element={<AntiAliasing />} />
      </Routes>

    </div>
  );
}

// React.render((
//   <Router>
//     <Route path="/" component={App}>
//       <Route path="about" component={About} />
//       <Route path="inbox" component={Inbox} />
//     </Route>
//   </Router>
// ), document.body)

export default App;
