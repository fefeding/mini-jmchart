
const rollup = require('rollup');
const rollupOptions = require('./rollup.config.js');

/**
 * format
	amd – 异步模块定义，用于像RequireJS这样的模块加载器
	cjs – CommonJS，适用于 Node 和 Browserify/Webpack
	esm – 将软件包保存为 ES 模块文件，在现代浏览器中可以通过 <script type=module> 标签引入
	iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
	umd – 通用模块定义，以amd，cjs 和 iife 为一体
	system - SystemJS 加载器格式
*/
async function build(format = 'cjs') {
	const bundle = await rollup.rollup(rollupOptions);

	const outputOptions = Object.assign(rollupOptions.output, {
		file: `./dist/jmchart.${format}.js`,
		format
	})
	const { code, map } = await bundle.generate(rollupOptions.output);

	await bundle.write(outputOptions);
}

build('cjs');

build('esm');

build('iife');

build('amd');

//build('umd');

build('system');