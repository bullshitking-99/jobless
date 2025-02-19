import { Button } from "antd";

// 测试数据
const dataArr = [
  { id: 1, parentId: 0, name: "A" },
  { id: 2, parentId: 1, name: "B" },
  { id: 3, parentId: 1, name: "C" },
  { id: 4, parentId: 2, name: "D" },
];

// 目标输出
const dataTree = {
  id: 1,
  parentId: 0,
  name: "A",
  children: [
    {
      id: 2,
      parentId: 1,
      name: "B",
      children: [{ id: 4, parentId: 2, name: "D" }],
    },
    { id: 3, parentId: 1, name: "C" },
  ],
};

const ArrayToTree = () => {
  const Arr2Tree = () => {
    let root = null;
    const map = new Map();

    dataArr.forEach((c) => {
      if (c.parentId === 0) root = c;
      map.set(c.id, c);
    });

    map.forEach((node) => {
      if (!node.parentId) return;

      const parent = map.get(node.parentId);

      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(node);
    });

    return root;
  };

  const Tree2Arr = () => {
    const arr = [];
    const queue = [dataTree];

    while (queue.length) {
      const node = queue.shift();
      const { children, ...rest } = node;
      arr.push(rest);
      if (children && children.length) {
        children.forEach((c) => {
          queue.push(c);
        });
      }
    }

    return arr;
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          console.log(Arr2Tree());
        }}
      >
        Arr2Tree
      </Button>
      {"    "}
      <Button
        type="primary"
        onClick={() => {
          console.log(Tree2Arr());
        }}
      >
        Tree2Arr
      </Button>
    </div>
  );
};

export default ArrayToTree;
