import { Button } from "antd";

// 测试数据
const data = [
  { id: 1, parentId: 0, name: "A" },
  { id: 22121, parentId: 1, name: "B" },
  { id: 32121, parentId: 1, name: "C" },
  { id: 12121, parentId: 22121, name: "D" },
];

// 目标输出
// {
//     id: 1,
//     parentId: 0,
//     name: 'A',
//     children: [
//       {
//         id: 2,
//         parentId: 1,
//         name: 'B',
//         children: [
//           { id: 4, parentId: 2, name: 'D' }
//         ]
//       },
//       { id: 3, parentId: 1, name: 'C' }
//     ]
//   }

const ArrayToTree = () => {
  const transfer = () => {
    let root = null;
    const map = new Map();

    data.forEach((c) => {
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

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          console.log(transfer());
        }}
      >
        transfer
      </Button>
    </div>
  );
};

export default ArrayToTree;
