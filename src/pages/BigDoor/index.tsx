import movies from "../../../app/crawler/assets/data.json";
import "./index.scss";
import { motion } from "framer-motion";

function App() {
  // 填充10个图片
  const data = movies[0].slice(0, 10);

  // 根据index放置位置
  const position = {
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
      {/* 顶部title */}
      <div className="top"></div>
      {/* 轮播list */}
      <motion.div
        className="middle"
        initial={{
          x: "100%",
        }}
        animate={{
          x: "-10%",
          transition: {
            // delay: 2,
            duration: 1,
          },
        }}
      >
        {data.map((m, i) => (
          <motion.div className="movie" key={m.title} custom={i}>
            <img src={m.pic} alt={m.title} />
          </motion.div>
        ))}
      </motion.div>
      {/* 底部controler */}
      <div className="bottom"></div>
    </div>
  );
}

export default App;
