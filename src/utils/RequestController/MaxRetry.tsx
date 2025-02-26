import { Button } from "antd";
import { useState } from "react";

const unstableFetch: () => Promise<string> = () => {
  const isSucceed = Math.random() < 0.1;

  return new Promise((r, j) => {
    setTimeout(() => {
      isSucceed ? r("succeed") : j("failed");
    }, 500);
  });
};

const MaxRetry = () => {
  const [res, setRes] = useState<string[]>([]);

  const maxRetryCount = 3;

  let active = 0;
  let isFinished = false;

  const run = async () => {
    if (active > maxRetryCount - 1 || isFinished) return;
    try {
      const r = await unstableFetch();
      setRes((res) => [...res, r]);
      isFinished = true;
    } catch (error: unknown) {
      setRes((res) => [...res, String(error)]);
      active++;
      run();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Button onClick={run} style={{ width: "200px" }}>
        run
      </Button>

      {res.map((r) => (
        <b>{r}</b>
      ))}
    </div>
  );
};

export default MaxRetry;
