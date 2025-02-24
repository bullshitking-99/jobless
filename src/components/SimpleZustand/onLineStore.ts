export const onLineStore = {
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
