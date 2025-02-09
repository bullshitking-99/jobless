/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Input } from "antd";
import { useState, useEffect, useCallback, useRef } from "react";

function debounce(func: any, delay: number) {
  let timeId;

  return (...args) => {
    clearTimeout(timeId);
    timeId = setTimeout(func.bind(null, ...args), delay);
  };
}

const useDebounce = (func, delay) => {
  const _debounce = useCallback(debounce(func, delay), []); // 副作用是返回的函数绑定的永远是同一个状态
  return _debounce;
};

const useLazyEffect = (effect, deps) => {
  const init = useRef(true);

  useEffect(() => {
    if (init.current) {
      init.current = false;
      return;
    }
    effect();
  }, deps);
};

const useDebounceEffect = (effect, deps, delay) => {
  const [update, setUpdate] = useState({ name: "lee" });

  const handleUpdate = useDebounce(() => {
    setUpdate({});
    // 这里拿到的update永远是初始值，因为 useCallback 绑定了初始状态
    // 所以每次赋给一个新值确保能触发effect
  }, delay);

  useLazyEffect(handleUpdate, deps);

  useLazyEffect(effect, [update]);
};

const Debounce = () => {
  const [text, setText] = useState<string>();

  const handleSearch = (text) => {
    console.log("searh for " + text);
  };

  // 仍不知道为什么初始时会搜索两次，lazyEffect怎么没起作用
  useDebounceEffect(
    () => {
      handleSearch(text);
    },
    [text],
    300
  );

  return (
    <>
      <Input
        value={text} // 不受控的话也可以不使用useEffect, 不setState也不会有防抖函数更新的问题
        onChange={({ target }) => {
          setText(target.value);
        }}
        style={{ width: "200px" }}
        allowClear
      />
      <h2>Search Value: {text}</h2>
    </>
  );
};

export default Debounce;
