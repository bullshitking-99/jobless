// 虽然Chrome浏览器会自动限制请求的最大并发数（一般是6-10）
// 但是觉得挺好玩的还是动手实现一个
// refer post ：https://juejin.cn/post/7356534347509645375

// import axios from "axios";

/**
 * @param 允许的最大并发数量
 * @return 加工后的请求限制函数，控制传入其中的请求的触发时机
 */
export default function setMaxConcurrencyReq(maxConcurrency = 6) {
  // 请求存储队列
  const requestQueue: (() => Promise<any>)[] = [];

  // 当前可并发数
  let rest = maxConcurrency;

  // 执行当前队列中可执行的请求
  const deQueue = () => {
    // 执行完一个修改一次状态
    // 由于请求已经入队
    // 当前被block的请求也会在之前的未完成deQueue中继续执行
    while (rest > 0 && requestQueue.length) {
      const req = requestQueue.shift();
      rest--;
      if (req) {
        req().finally(() => {
          rest++;
          // 因为请求异步，所以这里要手动去触发
          deQueue();
        });
      } else {
        rest++;
      }
    }
  };

  // 入队
  return (requestFunc: () => Promise<any>) => {
    requestQueue.push(requestFunc);
    // 执行
    deQueue();
  };
}

// const test = () => {
//   const reqs = new Array(30).fill("");

//   const enqueue = setMaxConcurrencyReq(3);

//   const run = () => {
//     for (let i = 0; i < reqs.length; i++) {
//       enqueue(() => axios.get("/api/test" + i));
//     }
//   };
// };
