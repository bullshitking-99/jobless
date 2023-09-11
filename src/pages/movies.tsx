import movies from "../../app/crawler/assets/data.json";

function App() {
  // 取初始数据
  const data = movies[0];

  return <div>{JSON.stringify(data)}</div>;
}

export default App;
