import movies from "../../../app/crawler/assets/data.json";
import "./index.scss";
import { motion } from "framer-motion";

function App() {
  // 取初始数据
  const data = movies[0];

  // 动画状态切换

  const info = {
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.3,
      },
    }),
    hidden: { opacity: 0, x: 100 },
  };

  return (
    <div className="container">
      {data.map((m, i) => (
        <motion.div key={m.title} className="movie">
          <div className="img">
            <motion.img drag dragSnapToOrigin src={m.pic} alt={m.title} />
          </div>
          <motion.div
            className="info"
            custom={i}
            variants={info}
            initial="hidden"
            animate="visible"
          >
            <div className="title">{m.title} </div>
            <div className="star">{m.star} </div>
            <div className="inq">{m.inq} </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export default App;
