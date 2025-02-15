import { Button } from "antd";

const DateFormat = () => {
  const dateFormat = (date: Date, format: string): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const getFullString = (n: number, l: number): string => {
      const restZero = l - String(n).length;
      let res = String(n);
      for (let i = 0; i < restZero; i++) {
        res = "0" + res;
      }
      return res;
    };

    let newDate = format.replace(/yyyy/g, getFullString(year, 4));
    newDate = newDate.replace(/MM/g, getFullString(month, 2));
    newDate = newDate.replace(/dd/g, getFullString(day, 2));

    console.log(newDate);
    return newDate;
  };

  dateFormat(new Date("2020-12-01"), "yyyy/MM/dd/yyyy"); // 2020/12/01/2020
  dateFormat(new Date("2020-04-01"), "yyyy/MM/dd"); // 2020/04/01
  dateFormat(new Date("2020-04-01"), "yyyy年MM月dd日"); // 2020年04月01日

  return <Button type="primary">Format</Button>;
};

export default DateFormat;
