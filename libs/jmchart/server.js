const express = require('express');
const rollup = require('rollup');
const rollupOptions = require('./rollup.config.js');



//rollupOptions.output.format = 'esm';// 方便调用
const esmWatcher = rollup.watch(rollupOptions);


esmWatcher.on('event', event => {
  // event.code 会是下面其中一个：
  //   START        — 监听器正在启动（重启）
  //   BUNDLE_START — 构建单个文件束
  //   BUNDLE_END   — 完成文件束构建
  //   END          — 完成所有文件束构建
  //   ERROR        — 构建时遇到错误
  //   FATAL        — 遇到无可修复的错误
  console.log(event);

  //const bundle = await rollup.rollup(inputOptions);
  if(event && event.code == 'END') {
    startServer();
  }
});

// 启动server


let serverInstance = null;
const port = process.env.PORT || 8800;
const ip = process.env.IP || '127.0.0.1';

startServer();

function startServer() {

  if(!serverInstance) {
    const app = express();
    app.use(express.static("."));
    serverInstance = app.listen(port, ip);
  }

  console.log(`dev server listend at ${port}`);
}
