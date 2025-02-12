const DelayOutput = () => {
  const list = [
    { id: "id_a", name: "red", delay: 3 },
    { id: "id_b", name: "yellow", delay: 3 },
    { id: "id_c", name: "green", delay: 3 },
  ];

  const idList = ["id_a", "id_b", "id_c"];

  function main(idList, list) {
    // 包装输出任务
    const taskProducer = ({ name, delay }) => {
      return () => {
        return new Promise<void>((r) => {
          setTimeout(() => {
            console.log(name);
            r();
          }, delay * 1000); // 面试的时候少了一个 1000 导致看起来是同步输出的 get 不到哪里有问题
        });
      };
    };

    // 输出函数
    const output = async () => {
      if (!idList.length) return;
      const id = idList.shift();
      const item = list.find((l) => l.id === id);
      const task = taskProducer(item);

      await task();
      output();
    };

    // 执行
    output();
  }

  main(idList, list);

  return <div>Baidu is my Dad</div>;
};

export default DelayOutput;
