// 1、利用babel完成代码转换,并生成单个文件的依赖
// 2、生成依赖图谱
// 3、生成最后打包代码

//导入包
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

// 通过 AST 获取依赖关系
// 转换为 es5 代码
function stepOne(filename) {
  // read file
  const codeString = fs.readFileSync(filename, "utf-8"); // 文本字符串

  // ast
  const ast = parser.parse(codeString, {
    sourceType: "module", //babel官方规定必须加这个参数，不然无法识别ES Module
  });

  // dependencies
  const dependencies = {};
  //获取通过import引入的模块
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename); // 当前处理文件的目录名 比如 filename 是 "./testJs/index.js"，这里是 ./testJs
      const newFile = "./" + path.join(dirname, node.source.value); // ./testJs\message.js

      //保存所依赖的模块
      dependencies[node.source.value] = newFile; // 引用时的相对路径：拼接目录路径后的更完整路径
    },
  });

  // es5 code
  //通过@babel/core和@babel/preset-env进行代码的转换
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });

  return {
    filename, //该文件名
    dependencies, //该文件所依赖的模块集合(键值对存储)
    code, //转换后的代码
  };
}

function stepTwo(entry) {
  const graphArray = [stepOne(entry)];

  // for 循环中遍历和存储背后所有依赖，其实就是 bfs
  for (let i = 0; i < graphArray.length; i++) {
    const { dependencies } = graphArray[i];

    for (let key in dependencies) {
      const depPath = dependencies[key]; // 相对于 entry 的完整路径
      const depModule = stepOne(depPath);
      graphArray.push(depModule);
    }
  }

  // 生成依赖图谱，就是 路径 为 key 的对象，便于索引吧
  const graph = {};
  graphArray.forEach((g) => {
    const { filename, ...rest } = g;
    graph[filename] = {
      ...rest,
    };
  });

  return graph;
}

stepTwo("./testJs/index.js");

// 拼接完整的代码字符串，使其可在浏览器运行
// 为什么返回函数字符串，而不是直接运行完之后返回完整code
// 因为最终要在浏览器环境中运行，浏览器不支持原生的 require ，需要这里的 require 定义，供 code 中去调用 require
function step3(entry) {
  //要先把对象转换为字符串，不然在下面的模板字符串中会默认调取对象的toString方法，参数变成[Object object],显然不行
  const graph = JSON.stringify(stepTwo(entry));

  // 外部定义的 require ，会在 code 内部执行
  // 如 index.js code : var message = require("./message.js").default;
  // require("./message.js") : graph[module].code : exports.default = 'Hello World'; : return export
  // index.js : var message = "Hello World"
  // 未来的 lmh 还是不懂就去问ai
  return `
        (function(graph) {
            //require函数的本质是执行一个模块的代码，然后将相应变量挂载到exports对象上
            function require(module) {
                //localRequire的本质是拿到依赖包的exports变量
                function localRequire(relativePath) {
                    return require(graph[module].dependencies[relativePath]);
                }
                var exports = {};
                (function(require, exports, code) {
                    eval(code);
                })(localRequire, exports, graph[module].code);
                return exports;//函数返回指向局部变量，形成闭包，exports变量在函数执行后不会被摧毁
            }
            require('${entry}')
        })(${graph})`;
}

const code = step3("./testJs/index.js");
console.log(code); // 在浏览器中可顺利运行
