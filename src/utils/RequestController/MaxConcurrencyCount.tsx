import { useRef, useState } from "react";

const MaxConcurrencyCount = () => {
  const [finishedRequest, setFinishedRequest] = useState<string[]>([]);

  // request array
  const requestArray = useRef(
    new Array(10).fill(null).map((_, index) => {
      return () =>
        new Promise<string>((r) => {
          setFinishedRequest((fr) => [...fr, `mission ${index} begin`]);
          setTimeout(() => {
            r(`mission ${index} finished`);
          }, 500);
        });
    })
  );

  // part concurrency
  const run2 = () => {
    return new Promise((r) => {
      const result: string[] = [];
      let currentActiveCount = 0;
      const maxActiveCount = 2;
      let currentIndex = 0;

      const run = async () => {
        if (currentIndex >= requestArray.current.length) {
          return r(result);
        }
        const _currentIndex = currentIndex++;
        currentActiveCount++;

        const task = requestArray.current[_currentIndex];
        const runTask = async () => {
          const res = await task();
          result[_currentIndex] = res;
          currentActiveCount--;
        };

        if (currentActiveCount < maxActiveCount) {
          runTask();
        } else {
          await runTask();
        }

        run();
      };

      run();
    });
  };

  // all concurrency
  const run1 = () => {
    Promise.all(requestArray.current.map((r) => r()));
  };

  // one by one
  const run3 = () => {
    const run = async () => {
      const task = requestArray.current.shift();
      if (task) {
        await task();
        run();
      }
    };

    run();
  };

  const runWithConcurrencyLimit = (
    tasks: (() => Promise<string>)[],
    maxConcurrency: number
  ) => {
    const result = new Array(tasks.length);
    let currentIndex = 0;
    let activeCount = 0;

    const runTask = async () => {
      // 确保任务能够逐个执行并控制最大并发量
      while (currentIndex < tasks.length) {
        if (activeCount >= maxConcurrency) {
          // 等待一个任务完成
          await new Promise((resolve) => setTimeout(resolve, 50)); // 小延迟，避免忙等
          continue;
        }

        // 获取当前任务
        const index = currentIndex++;
        activeCount++;

        const task = tasks[index];
        task().then((res) => {
          result[index] = res;
          activeCount--;
        });
      }
    };

    // 启动多个任务并发
    const promises = Array.from({ length: maxConcurrency }, runTask);

    return Promise.all(promises).then(() => result);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <button onClick={run1}>全并发</button>
      <button
        onClick={() =>
          run2().then((res) => {
            console.log(res);
          })
        }
      >
        部分并发
      </button>
      <button
        onClick={() => {
          runWithConcurrencyLimit(requestArray.current, 2).then((result) => {
            console.log(result); // 输出每个任务的执行结果
          });
        }}
      >
        GPT write
      </button>
      <button onClick={run3}>串行请求</button>

      {finishedRequest.map((res) => (
        <p key={res}>{res}</p>
      ))}
    </div>
  );
};

export default MaxConcurrencyCount;
