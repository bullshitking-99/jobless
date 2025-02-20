import { Button, message } from "antd";
import { useEffect, useState } from "react";

const useGoodLuck = (user?: string) => {
  const [msg, setMsg] = useState<string>();

  // 参数变化时 effect 会重新执行
  useEffect(() => {
    user && setMsg("Good Luck to " + user);
  });

  return { msg };
};

const GreatCustomHooks = () => {
  const [user, setUser] = useState<string>();
  const { msg } = useGoodLuck(user);

  // 在当前为Jack时，同时 set LOO + Jack，Jack会重新渲染一次
  message.info("reRender " + user);

  useEffect(() => {
    msg && message.success(msg);
  }, [msg]);

  // 上面说 同时 set 会执行一次函数组件，但是 Effect 不会重新执行，他有自己的比对
  useEffect(() => {
    user && message.info(user);
  }, [user]);

  return (
    <>
      <Button
        onClick={() => {
          setUser("Lee");
        }}
      >
        Lee
      </Button>
      {"   "}
      <Button
        onClick={() => {
          setUser("LOO");
          setUser("Jack"); //之前不是 Jack 会导致一次重渲染，跟我理解的 异步队列+组件对比 不一样
        }}
      >
        Jack
      </Button>
    </>
  );
};

export default GreatCustomHooks;
