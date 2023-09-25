import movies from "../../../app/crawler/assets/data.json";
import "./index.scss";
import { motion } from "framer-motion";

function App() {
  return (
    <div className="container">
      {/* 顶部title */}
      <div className="top"></div>
      {/* 轮播list */}
      <div className="middle"></div>
      {/* 底部controler */}
      <div className="bottom"></div>
    </div>
  );
}

export default App;
