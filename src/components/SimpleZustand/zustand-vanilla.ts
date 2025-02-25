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

    console.log("state", state);

    // 判断是否更新
    if (!Object.is(state, newState)) {
      const previousState = state;
      state =
        replace ?? (typeof newState !== "object" || newState === null)
          ? (newState as TState)
          : Object.assign({}, state, newState);

      console.log("newState", state);

      // 发布订阅
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
