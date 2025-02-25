export type SetStateInternal<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean
) => void;

export type Listener<T> = (state: T, prevState: T) => void;

export interface StoreApi<T> {
  setState: SetStateInternal<T>;
  getState: () => T;
  getInitialState: () => T;
  subscribe: (listener: Listener<T>) => () => void;
}

// 状态函数创造器类型
export type creatorState<T> = (
  setState: StoreApi<T>["setState"],
  getState: StoreApi<T>["getState"]
) => T;

// 泛型函数类型，函数重载，支持两种模式：直接传参调用，或者不传参调用，返回一个同样的函数（柯里化）
export type creatorStore = {
  <T>(initializer: creatorState<T>): StoreApi<T>;
  <T>(): (initializer: creatorState<T>) => StoreApi<T>;
};

// 状态仓库创造器类型
export type creatorStoreImpl = <T>(initializer: creatorState<T>) => StoreApi<T>;

// 获取状态类型的工具类型
export type GetState<S> = S extends { getState: () => infer T } ? T : never;

export type ReadonlyStoreApi<T> = Pick<
  StoreApi<T>,
  "getState" | "getInitialState" | "subscribe"
>;

// 函数重载，既可以不传参数，返回状态的类型，也可以传一个 selector
export type UseBoundStore<S extends ReadonlyStoreApi<unknown>> = {
  (): GetState<S>;
  <U>(selector: (state: GetState<S>) => U): U;
} & S;

// 创造函数类型定义
export type Creator = <T>(
  initializer: creatorState<T>
) => UseBoundStore<StoreApi<T>>;
