import { Button } from "antd";

const LexicalEnvironment = () => {
  const text = 1;

  const func1 = (text) => {
    console.log(text);
  };

  const func2 = () => {
    func1(text);
  };

  const run = () => {
    const text = 2;

    func2(); // 1
  };

  return <Button onClick={run}>RUN LEXICAL ENVIRONMENT</Button>;
};

export default LexicalEnvironment;
