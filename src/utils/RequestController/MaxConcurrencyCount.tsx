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
          }, index * 100);
        });
    })
  );

  // all concurrency
  const run1 = () => {
    Promise.all(requestArray.current.map((r) => r()));
  };

  // part concurrency
  const run2 = async () => {
    let cur = 0;

    const run = async () => {
      const task = requestArray.current.shift();
      if (task) {
        if (cur < 5) {
          task();
        } else {
          await task();
        }
        cur++;
        run();
      }
    };

    run();
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <button onClick={run1}>全并发</button>
      <button onClick={run2}>部分并发</button>
      <button onClick={run3}>串行请求</button>

      {finishedRequest.map((res) => (
        <p key={res}>{res}</p>
      ))}
    </div>
  );
};

export default MaxConcurrencyCount;
