import movies from "../../../app/crawler/assets/data.json";
import "./index.scss";
import { motion } from "framer-motion";

function App() {
  // 取初始数据
  const data = movies[0];

  // 动画状态存储与复用
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
            <motion.img
              drag
              dragSnapToOrigin
              whileHover={{
                y: -7,
                // scale: 1.02,
                boxShadow: "1px 1px 50px #5ababa63",
                transition: {
                  duration: 0.3,
                },
              }}
              whileTap={{ scale: 0.9, boxShadow: "none" }}
              src={m.pic}
              alt={m.title}
            />
          </div>
          <motion.div
            className="info"
            custom={i}
            variants={info}
            initial="hidden"
            animate="visible"
            whileInView={{
              opacity: 1,
              x: 0,
              transition: {
                duration: 0.3,
              },
            }}
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
