import { Button, Input, message } from "antd";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { todoStore } from "./todoStore";
import { useOnlineStatus } from "./useOnLineStatus";

const AddTodo = () => {
  const [val, setVal] = useState<string>("");

  const addTodo = () => {
    if (!val) return;
    todoStore.addTodo(val);
    setVal("");
  };

  return (
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
    </div>
  );
};

const TodoList = () => {
  const todoList = useSyncExternalStore(
    todoStore.subscribe,
    todoStore.getSnapShot
  );

  return (
    <ul>
      {todoList.map((t) => (
        <li key={t.id}>{t.val}</li>
      ))}
    </ul>
  );
};

const TodoMessage = () => {
  const todoList = useSyncExternalStore(
    todoStore.subscribe,
    todoStore.getSnapShot
  );

  const currentTodoList = useRef(todoList);

  useEffect(() => {
    if (todoList.length === 0) return;

    const [newTodo] = todoList.filter(
      (t) => !currentTodoList.current.map((t) => t.id).includes(t.id)
    );
    currentTodoList.current = todoList;

    message.success("you add a new todo : " + newTodo.val);
  }, [todoList]);

  return <></>;
};

const OnLineStatus = () => {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    isOnline ? message.success("onLine now !") : message.error("offLine now ~");
  }, [isOnline]);

  return <h2>{isOnline ? "✅ Online" : "❌ Disconnected"}</h2>;
};

const SyncExternalStoreTodo = () => {
  return (
    <>
      <OnLineStatus></OnLineStatus>
      <AddTodo></AddTodo>
      <TodoList></TodoList>
      <TodoMessage></TodoMessage>
    </>
  );
};

export default SyncExternalStoreTodo;
