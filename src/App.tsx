import { useMemo } from 'react';
import VirtualTable from './pages/VirtualTable';

function App() {
  const columns = useMemo(() => [
    { width: 200, title: '姓名', dataIndex: 'name' },
    { width: 150, title: '年龄', dataIndex: 'age' },
    { width: 300, title: '地址', dataIndex: 'address' },
  ], []);

  const dataSource = useMemo(() => new Array(1000).fill(null).map((_, i) => ({
    name: `用户${i + 1}`,
    age: Math.floor(Math.random() * 50) + 20,
    address: '上海市浦东新区世纪大道1234号'
  })), []);

  return (
    <div style={{ padding: 20 }}>
      <h1>高性能虚拟表格演示</h1>
      <VirtualTable
        columns={columns}
        dataSource={dataSource}
        rowHeight={40}
        visibleRows={20}
      />
    </div>
  );
}

export default App;
