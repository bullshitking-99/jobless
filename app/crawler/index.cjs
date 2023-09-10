/* eslint-disable no-undef */
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

//引入模块
const https = require("https");
const cheerio = require("cheerio");
const fs = require("fs");

// 总数组
// let topMovies = [];

//单次获取
function getTopMovies(page) {
  return new Promise((resolve, reject) => {
    try {
      https.get(
        `https://movie.douban.com/top250?start=${page}`,
        function (res) {
          let html = "";

          res.on("data", function (chunk) {
            html += chunk;
          });

          res.on("end", function () {
            // 获取html中的数据
            const $ = cheerio.load(html);
            let allFiles = [];
            //拿到每一个item中我们需要的数据
            $("li .item").each(function () {
              const title = $(".title", this).text();
              const star = $(".info .bd .rating_num", this).text();
              const pic = $(".pic img", this).attr("src");
              //数据以对象的形式存放在数组中
              allFiles.push({
                title: title,
                star: star,
                pic: pic,
              });
            });

            resolve(allFiles);
          });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

// 根据pages创建任务数组

const tasks = new Array(10).fill(0).map((_, index) => getTopMovies(index * 25));

Promise.all(tasks)
  .then((val) => {
    //将数据写入文件中
    fs.writeFile(
      __dirname + "/assets/data.json",
      JSON.stringify(val),
      function (err) {
        if (err) {
          throw err;
        }
        console.log("文件保存成功");
      }
    );
  })
  .catch((err) => {
    console.log(err);
  });

// eslint-disable-next-line no-undef
// module.exports = https;
