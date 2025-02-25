/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSyncExternalStore } from "react";
import { Creator, creatorState, GetState, ReadonlyStoreApi } from "./type";
import { createStore } from "./zustand-vanilla";

//实现create函数，接受一个函数作为参数，函数的作用是创建仓库对象
export const create: Creator = <T>(createStateFn: creatorState<T>) =>
  createStateImpl(createStateFn);

const createStateImpl = <T>(createStateFn: creatorState<T>) => {
  // 创建单一状态库
  const api = createStore(createStateFn);

  // 返回一个函数，供组件使用，获取和订阅相关状态
  const useBoundStore: any = (selector?: any) => useStore(api, selector);

  // ????
  // Object.assign(useBoundStore, api);

  return useBoundStore;
};

//默认返回自身的函数
const identity = <T>(arg: T): T => arg;
// 函数重载
export function useStore<S extends ReadonlyStoreApi<unknown>>(
  api: S
): GetState<S>;

export function useStore<S extends ReadonlyStoreApi<unknown>, U>(
  api: S,
  selector: (state: GetState<S>) => U
): U;

// 当你调用 useStore hook 时，useSyncExternalStore 内部会做如下几件事情：
// 调用 api.subscribe 来订阅 store 的状态变化。
// subscribe 函数会接收一个监听器（listener）作为参数，该监听器会在 store 状态发生变化时被调用。
// 此时listener会被加入到listeners当中
// 当状态发生变化时，lisntners会逐步遍历，从而通知组件，此时useSyncExternalStore 会获取最新的状态（通过 api.getState），并重新渲染组件。
export function useStore<TState, StateSlice>(
  api: ReadonlyStoreApi<TState>,
  selector: (state: TState) => StateSlice = identity as any
) {
  // 使组件订阅和获取该状态，当 subscribe 中的 listener 执行时，组件会自动调用 getSnapShot 获取最新状态并重渲染
  const slice = useSyncExternalStore(
    api.subscribe,
    () => selector(api.getState()),
    () => selector(api.getInitialState())
  );

  return slice;
}
