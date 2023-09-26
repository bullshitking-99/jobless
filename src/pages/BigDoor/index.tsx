import movies from "../../../app/crawler/assets/data.json";
import "./index.scss";
import { motion } from "framer-motion";

function App() {
  // 填充10个图片
  const data = movies[0].slice(0, 10);

  return (
    <div className="container">
      {/* 顶部title */}
      <div className="top circle">
        <div className="title">
          <TitleWithFadeIn content={"一场场电影"} index={0} />
          <TitleWithFadeIn content={"犹如人生与梦境的延续"} index={1} />
        </div>
      </div>
      {/* 轮播list */}
      <motion.div
        className="middle"
        initial={{
          x: "100%",
        }}
        animate={{
          x: "0%",
          transition: {
            delay: 2,
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
      <div className="bottom circle"></div>
    </div>
  );
}

// 渐入标题组件
function TitleWithFadeIn({
  content,
  index,
}: {
  content: string;
  index: number;
}) {
  // 渐进出现动画
  const fadeIn = {
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 1,
        duration: 1,
      },
    }),
    hidden: { opacity: 0, y: 50 },
  };

  return (
    <motion.h1
      custom={index}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
    >
      {content}
    </motion.h1>
  );
}

export default App;
