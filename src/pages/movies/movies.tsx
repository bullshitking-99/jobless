import movies from "../../../app/crawler/assets/data.json";
import "./index.scss";
import { motion } from "framer-motion";

function App() {
  // 取初始数据
  const data = movies[0];

  return (
    <div className="container">
      {data.map((m) => (
        <div key={m.title} className="movie">
          <div className="img">
            <motion.img drag dragSnapToOrigin src={m.pic} alt={m.title} />
          </div>
          <div className="info">
            <div className="title">{m.title} </div>
            <div className="star">{m.star} </div>
            <div className="inq">{m.inq} </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
