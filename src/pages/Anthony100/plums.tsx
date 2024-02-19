import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface Branch {
  start: Point;
  length: number;
  theta: number;
}

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);

  function init(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "#fff5";

    const start: Point = { x: 0, y: 0 };

    const branch: Branch = {
      start,
      length: 10,
      theta: Math.PI / 4,
    };

    const pendingTasks: Array<() => void> = [];

    try {
      step(branch);
    } catch (error) {
      console.log(error);
    }

    startFrame();

    let framesCount = 0;
    function startFrame() {
      requestAnimationFrame(() => {
        framesCount++;
        if (framesCount % 3 === 0) frame();
        startFrame();
      });
    }

    function frame() {
      const tasks = [...pendingTasks];
      pendingTasks.length = 0;
      tasks.forEach((task) => {
        task();
      });
    }

    // 递归随机树
    function step(b: Branch, depth = 0) {
      drawBranch(b);

      const { length, theta } = b;

      const end = getEndPoint(b);

      if (depth < 6 || Math.random() > 0.5)
        // 放入缓冲区，等待执行
        pendingTasks.push(() =>
          step(
            {
              start: end,
              length: length * (Math.random() + 0.5),
              theta: theta + 0.3 * Math.random(),
            },
            depth + 1
          )
        );

      if (depth < 6 || Math.random() > 0.5)
        pendingTasks.push(() =>
          step(
            {
              start: end,
              length: length * (Math.random() + 0.5),
              theta: theta - 0.3 * Math.random(),
            },
            depth + 1
          )
        );
    }

    function drawBranch(b: Branch) {
      const end = getEndPoint(b);
      lineTo(b.start, end);
    }

    function getEndPoint(b: Branch): Point {
      const { start, length, theta } = b;
      return {
        x: start.x + length * Math.cos(theta),
        y: start.y + length * Math.sin(theta),
      };
    }

    function lineTo(p1: Point, p2: Point) {
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  useEffect(() => {
    const ctx = canvas.current!.getContext("2d")!;
    init(ctx);

    return () => ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }, []);

  return (
    <>
      <canvas
        ref={canvas}
        width={WIDTH}
        height={HEIGHT}
        origin-top-left="true"
      ></canvas>
    </>
  );
}

export default App;
