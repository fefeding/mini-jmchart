# mini-jmchart

[jmGraph](https://github.com/jiamao/jmgraph) / [jmChart](https://github.com/jiamao/jmchart) 微信小程序示例，用于在小程序环境中体验两个库的图形与图表能力。

## 依赖

| 包 | 说明 |
| --- | --- |
| [jmgraph](https://github.com/jiamao/jmgraph) | 基于 Canvas 2D 的图形库，本示例使用 `3.3.1` |
| [jmchart](https://github.com/jiamao/jmchart) | 基于 jmgraph 的图表库，本示例使用 `1.2.22` |

## 初始化

```shell
# 1. 安装依赖
npm install

# 2. 用微信开发者工具打开本目录（project.config.json）

# 3. 工具栏「工具 -> 构建 npm」
#    构建完成后生成 miniprogram_npm/，即可运行
```

> 两个依赖包的 `package.json` 都声明了 `"miniprogram": "miniprogram_dist"` 字段，
> 微信构建 npm 时会直接复制 `miniprogram_dist/index.js`（自包含构建产物）到 `miniprogram_npm`，
> 不会再做二次打包。因此 `miniprogram_npm` 是构建产物，**不要手工修改**，
> 如有问题请到 [jmgraph](https://github.com/jiamao/jmgraph) / [jmchart](https://github.com/jiamao/jmchart) 源码仓库修复后重新发布。

## 页面

| 页面 | 路径 | 内容 |
| --- | --- | --- |
| 首页 | `pages/index/index` | 入口导航（jmChart / jmGraph / threejs） |
| jmGraph 示例 | `pages/jmgraph/index` | 8 个示例，radio 切换 |
| jmChart 示例 | `pages/jmchart/index` | 线图 / 柱图 / 饼图 / 雷达图 |
| threejs | `pages/threejs/index` | three.js 小程序适配示例 |

### jmGraph 示例（`pages/jmgraph/`）

| 示例 | 文件 | 说明 |
| --- | --- | --- |
| base | `rect.js` | 基础图形（rect / arc / arrow）与拖拽 |
| bezier | `bezier.js` | 贝塞尔曲线动画 |
| resize | `resize.js` | 图形缩放 |
| 动画 | `progress.js` | 进度环动画 |
| 球 | `ball.js` | 小球物理碰撞 |
| 孢子 | `cell.js` | 细胞分裂 |
| 排序 | `sort.js` | 堆排序可视化 |
| PSO | `pso.js` | 粒子群算法 |

每个示例模块导出 `init(graph)` / `destory(graph)`，由 `pages/jmgraph/index.js` 统一调度。

### jmChart 示例（`pages/jmchart/`）

`line.js` / `bar.js` / `pie.js` / `radar.js`，通过 `components/jmchart` 组件创建图表：

```js
const chart = await this.selectComponent('#jmchart_component').initChart();
const line = chart.createSeries('line', { field: 'y1', style: { curve: true } });
chart.data = [{ x: 0, y1: 10 }, { x: 1, y1: 20 }];
chart.refresh();
```

## 组件

| 组件 | 说明 |
| --- | --- |
| `components/jmgraph` | 封装 Canvas 2D + `jmGraph` 实例，`initGraph()` 返回 graph，触摸事件自动转发 |
| `components/jmchart` | 封装 Canvas 2D + `jmChart` 实例，`initChart()` 返回 chart，触摸事件自动转发 |
| `components/threejs` | 封装 three.js 渲染器 |

## 目录结构

```
├── app.js                  # 入口，获取系统信息（新版拆分 API）
├── components/             # 自定义组件
│   ├── jmgraph/            # jmgraph 画布组件
│   ├── jmchart/            # jmchart 画布组件
│   └── threejs/            # threejs 渲染组件
├── pages/
│   ├── index/              # 首页导航
│   ├── jmgraph/            # jmgraph 示例（8 个 demo 模块）
│   ├── jmchart/            # jmchart 示例（line/bar/pie/radar）
│   ├── threejs/            # threejs 示例
│   └── vHuman/             # 数智人（企微环境）
├── utils/
│   ├── util.js             # 系统信息等工具（getSystemInfo 已缓存）
│   └── threejs/            # three.js 小程序适配层
└── miniprogram_npm/        # 构建 npm 产物（勿手改）
```

## 注意事项

- 基础库版本：`project.config.json` 中 `libVersion` 为 `2.19.3`，Canvas 2D 需要基础库 `2.9.0+`。
- 系统信息统一走 `utils/util.js` 的 `getSystemInfo()`（优先 `getWindowInfo` / `getDeviceInfo` / `getAppBaseInfo`，已缓存），避免 `wx.getSystemInfoSync` 废弃告警。
- 升级 `jmgraph` / `jmchart` 版本后，需重新 `npm install` 并在开发者工具中重新「构建 npm」。
