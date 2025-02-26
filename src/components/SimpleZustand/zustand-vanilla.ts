import { creatorStore, creatorStoreImpl, Listener, StoreApi } from "./type";

export const createStore = ((createStateFn) =>
  createStateFn
    ? createStoreImpl(createStateFn)
    : createStoreImpl) as creatorStore;

export const createStoreImpl: creatorStoreImpl = (createStateFn) => {
  type TState = ReturnType<typeof createStateFn>;

  let state: TState;
  const listeners = new Set<Listener<TState>>();

  // 先定义需要传入 createStateFn 的参数函数
  const setState: StoreApi<TState>["setState"] = (partial, replace) => {
    // 计算新状态
    const newState =
      typeof partial === "function"
        ? (partial as (state: TState) => TState)(state)
        : partial;

    // 判断是否更新 拦截 setState(s => s) 的情况
    if (!Object.is(state, newState)) {
      const previousState = state;
      state =
        replace ?? (typeof newState !== "object" || newState === null)
          ? (newState as TState)
          : Object.assign({}, state, newState);

      // 发布订阅
      // 虽然 state 对象地址更新了，但是组件订阅的值如果没变化不会触发重新渲染
      // useSyncExternalStore 中有第二道拦截
      listeners.forEach((l) => l(state, previousState));
    }
  };

  const getState: StoreApi<TState>["getState"] = () => state;
  const getInitialState: StoreApi<TState>["getInitialState"] = () =>
    initialState;
  const subscribe: StoreApi<TState>["subscribe"] = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  state = createStateFn(setState, getState);
  const initialState = state;

  const api = {
    getState,
    setState,
    getInitialState,
    subscribe,
  };

  return api;
};
