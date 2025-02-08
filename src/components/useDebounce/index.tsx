/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { useState, useEffect } from "react";

const Debounce = () => {
  const [text, setText] = useState<string>();
  const [res, setRes] = useState<string>();

  function debounce(func: any, delay: number) {
    let timeId;

    return (...args) => {
      clearTimeout(timeId);
      timeId = setTimeout(func.bind(null, ...args), delay);
    };
  }

  const handleChange = debounce((text) => {
    setText(text);
  }, 300);

  useEffect(() => {
    setRes(text?.split(""));
  }, [text]);

  return (
    <>
      <input
        type="text"
        onChange={({ target }) => handleChange(target.value)}
      />
      <h2>Search Value: {text}</h2>
      {res?.map((s) => (
        <p>{s}</p>
      ))}
    </>
  );
};

export default Debounce;
