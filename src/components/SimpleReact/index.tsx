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

  const createDom = (vdom) => {
    // const dom = document.createElement()
    // props
  };

  const performanceUnit = (fiber) => {
    // slef
    if (!fiber.dom) {
      fiber.dom = createDom(dom);
    }
    // child
    const { children } = fiber.props;
    if (children?.length) {
      children.forEach((c, i) => {
        if (i === 0) fiber.child = c;
        c.parent = fiber;
      });
    }
    // sibling
    // parent
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
    const children = new Array(10000)
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
