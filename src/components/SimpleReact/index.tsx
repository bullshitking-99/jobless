/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import React, { FC, useEffect, useState } from "react";

const SimpleReact: FC = () => {
  const [search, setSearch] = useState("");
  // jsx 2 vdom
  const Shit = {
    createElement: (type, props, ...children) => {
      const _children = children.map((child) => {
        return typeof child === "object"
          ? child
          : {
              type: "textNode",
              props: {
                nodeValue: child,
                children: [],
              },
            };
      });

      const vdom = {
        type,
        props: {
          ...props,
          children: _children,
        },
      };

      return vdom;
    },
  };

  // vdom 2 dom and mount
  const render = (vdom, container) => {
    const { type, props = {} } = vdom;

    const dom =
      type === "textNode"
        ? document.createTextNode("")
        : document.createElement(type);

    Object.entries(props).forEach(([key, value]) => {
      key === "children"
        ? value.forEach((c) => render(c, dom))
        : (dom[key] = value);
    });

    container.appendChild(dom);
  };

  const createDom = (fiber) => {
    // 根据虚拟DOM类型创建真实DOM
    const dom =
      fiber.type == SPECIAL_TYPE.TEXT_ELEMENT
        ? document.createTextNode("")
        : document.createElement(fiber.type);

    Object.keys(fiber.props)
      .filter(isProperty)
      .forEach((name) => {
        // 虚拟DOM的 props 绑定到真实 DOM上
        dom[name] = fiber.props[name];
      });

    return dom;
  };

  // vdom 2 fiber tree
  const performanceUnit = (fiber) => {
    // 当前fiber节点 不存在真实DOM，生成一个真实的DOM
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }
    // 如果当前节点的父级存在，就将当前虚拟DOM节点挂载在父级上
    if (fiber.parent) {
      // 把内容渲染到界面上。
      console.log("渲染节点", fiber);
      fiber.parent.dom.appendChild(fiber.dom);
    }
    // 遍历子节点，继续执行 children 属性来自于 createElement 函数。
    const elements = fiber.props.children;
    let index = 0;
    // 定义其父级的兄弟节点
    let prevSibling = null;
    // 处理子节点
    while (index < elements.length) {
      const element = elements[index];
      // 创建 element 元素对应的 fiber 工作单元
      const newFiber = {
        type: element.type,
        props: element.props,
        parent: fiber, // 指向其父级 fiber 节点
        dom: null, // 代表还没创建和挂载 DOM 节点
      };
      // 当前是第一个节点，child 绑定到自身，查找规则是 当前工作节点下的第一个节点
      if (index === 0) {
        fiber.child = newFiber;
      } else {
        // 绑定其兄弟节点
        prevSibling.sibling = newFiber;
      }
      // 新的 fiber节点 成为了 上一个兄弟节点
      prevSibling = newFiber;
      // 继续下一个工作
      index++;
    }
    console.log("处理完子节点以后的结果为", fiber);
    // 存在子节点，返回子节点
    if (fiber.child) {
      return fiber.child;
    }
    // 1. 如果没有子节点，就查找兄弟节点
    let nextFiber = fiber;
    while (nextFiber) {
      // 3. 兄弟节点存在就返回
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      // 2. 一层一层向上查找兄弟节点
      nextFiber = nextFiber.parent;
    }
  };

  let nextUnit;

  const workLoop: IdleRequestCallback = (deadline) => {
    let shouleYield = false;

    while (nextUnit && !shouleYield) {
      nextUnit = performanceUnit(nextUnit);
      shouleYield = deadline.timeRemaining() < 1;
    }

    requestIdleCallback(workLoop);
  };

  requestIdleCallback(workLoop);

  // init a fiber
  const initRender = (vdom, container) => {
    nextUnit = {
      dom: container,
      props: {
        children: Array.isArray(vdom) ? [...vdom] : [vdom],
      },
    };
  };

  // jsx
  const App = () => {
    const children = new Array(10)
      .fill(search)
      .map((t) => Shit.createElement("div", null, t));

    return Shit.createElement(
      "div",
      {
        title: "foo",
      },
      ...children
    );
  };

  useEffect(() => {
    const root = document.querySelector("#love");
    render(App(), root);

    return () => {
      root.innerHTML = null;
    };
  }, [search]);

  return (
    <>
      <input
        type="text"
        value={search}
        onChange={({ target }) => setSearch(target.value)}
      />
      <div id="love"></div>
    </>
  );
};

export default SimpleReact;
