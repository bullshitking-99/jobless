import { useSyncExternalStore } from "react";

// 订阅 react 之外的数据源，是这个hook设计的初衷
// 提供了一个快捷的根据订阅重渲染方式
const onLineStore = {
  subscribe(cb: () => void) {
    window.addEventListener("online", cb);
    window.addEventListener("offline", cb);

    return () => {
      window.removeEventListener("online", cb);
      window.removeEventListener("offline", cb);
    };
  },

  getSnapshot() {
    return navigator.onLine;
  },
};

// 抽成自定义hook 方便外部使用
export const useOnlineStatus = () => {
  const { subscribe, getSnapshot } = onLineStore;
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  return isOnline;
};
