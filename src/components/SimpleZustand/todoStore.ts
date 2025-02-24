interface ITodo {
  id: number;
  val: string;
}

let curId = 0;
let listeners: (() => void)[] = [];
let todoList: ITodo[] = [];

const emitChange = () => {
  listeners.forEach((l) => l());
};

export const todoStore = {
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];

    return () => (listeners = listeners.filter((l) => l !== listener));
  },
  addTodo(val: string) {
    todoList = [...todoList, { id: curId++, val }];
    emitChange();
  },
  getSnapShot() {
    return todoList;
  },
};
