import axios from "axios";
import setMaxConcurrencyReq from "./utils/maxConcurrencyReq";

function App() {
  const reqs = new Array(30).fill("");

  const enqueue = setMaxConcurrencyReq(3);

  const run = () => {
    for (let i = 0; i < reqs.length; i++) {
      enqueue(() => axios.get("/api/test" + i));
    }
  };

  return <h1 onClick={run}>并发请求，启动！</h1>;
}

export default App;
