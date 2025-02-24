import { Button, Input } from "antd";
import { useState } from "react";

interface ITodo {
  id: string;
  val: string;
}

const SyncExternalStoreTodo = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [val, setVal] = useState<string>("");

  const addTodo = () => {
    const todo = {
      id: Math.random().toFixed(2),
      val,
    };

    setTodos([...todos, todo]);
    setVal("");
  };

  return (
    <>
      <div>
        <Input
          value={val}
          onChange={({ target }) => {
            setVal(target.value);
          }}
          style={{ width: "200px", marginRight: "16px" }}
          onPressEnter={addTodo}
        ></Input>
        <Button style={{ marginRight: "8px" }} onClick={addTodo} type="primary">
          Add
        </Button>
        <Button
          onClick={() => {
            setTodos([]);
          }}
          type="default"
        >
          Clear
        </Button>
      </div>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>{t.val}</li>
        ))}
      </ul>
    </>
  );
};

export default SyncExternalStoreTodo;
