module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1691561832756, function(require, module, exports) {
var __TEMP__ = require('./src/jmChart.js');var jmChart = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./src/component/vchart.js');var vChart = __REQUIRE_DEFAULT__(__TEMP__);

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = jmChart;

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, 'jmChart', { enumerable: true, configurable: true, get: function() { return jmChart; } });Object.defineProperty(exports, 'vChart', { enumerable: true, configurable: true, get: function() { return vChart; } });



}, function(modId) {var map = {"./src/component/vchart.js":1691561832758}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1691561832758, function(require, module, exports) {


var __TEMP__ = require('../../index.js');var jmChart = __REQUIRE_DEFAULT__(__TEMP__);

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = {
    props: {
        chartData: Array,
        chartOptions: Object,
        chartSeries: Array,
        width: {
            type: String,
            default: 200
        },
        height: {
            type: String,
            default: 200
        }
    },
    data: function() {
        return {
            //chartData: this.chartData,
            option: this.chartOptions
        }
    },
    // jmChart实例
    chartInstance: null,

    mounted () {
        this.option = Object.assign({
            enableAnimate: false,
            legendPosition: 'top',
            legendVisible: true, // 不显示图例    
            width: this.width,
            height: this.height        
        }, this.chartOptions);   
        
        this.initChart();
    },
    // DOM更新
    updated() {
        this.initChart();
    },

    // 销毁
    destroyed() {
        this.chartInstance && this.chartInstance.destroy();
    },

    watch: {
        // 数据发生改变，刷新
        chartData: function(newData, oldData) {
            this.refresh();
        },
        width: function(newWidth, oldWidth) {
            if(!this.chartInstance) return;            
            this.$nextTick(()=>{
                if(!this.chartInstance || !this.$refs.jmChartContainer) return;          
                this.chartInstance.width = this.$refs.jmChartContainer.clientWidth||this.$refs.jmChartContainer.offsetWidth;
                //this.chartInstance.refresh();
            });
        },
        height: function(newHeight, oldHeight) {
            if(!this.chartInstance) return;
            this.$nextTick(()=>{
                if(!this.chartInstance || !this.$refs.jmChartContainer) return;          
                this.chartInstance.height = this.$refs.jmChartContainer.clientHeight||this.$refs.jmChartContainer.offsetHeight;
                //this.chartInstance.refresh();
            });
        }
    },

    methods: {
        // 初始化图表组件
        initChart() {
            if(this.chartInstance) return;
            
            this.chartInstance = new jmChart(this.$refs.jmChartContainer, this.option);
            
            if(this.chartData && this.chartData.length) this.refresh(); // 这里有死循环的问题，但上面 chartInstance不为空就返回了，就没有这个问题了
            
            // touch改变数据点事件
            this.chartInstance.bind('touchPointChange', (args) => {
                this.$emit('touch-point-change', args);
            });

            // 图表标线事件
            this.chartInstance.bind('marklinelongtapstart', (args) => {
                this.$emit('markline-longtap-start', args);
            });
            this.chartInstance.bind('marklinestartmove', (args) => {
                this.$emit('markline-start-move', args);
            });
            this.chartInstance.bind('marklinemove', (args) => {
                this.$emit('markline-move', args);
            });
            this.chartInstance.bind('marklineendmove', (args) => {
                this.$emit('markline-end-move', args);
            });

            // touch事件
            this.chartInstance.touchGraph.bind('touchstart mousedown', (args) => {
                this.$emit('touchstart', args);
                this.$emit('mousedown', args);
            });
            this.chartInstance.touchGraph.bind('touchmove mousemove', (args) => {
                this.$emit('touchmove', args);
                this.$emit('mousemove', args);
            });
            this.chartInstance.touchGraph.bind('touchend touchcancel mouseup', (args) => {
                this.$emit('touchend', args);
                this.$emit('mouseup', args);
            });
            this.chartInstance.touchGraph.bind('touchleave', (args) => {
                this.$emit('touchleave', args);
            });
        },

        // 刷新图表
        refresh() {
            this.$nextTick(()=>{
                this.initChart();

                // 清空当前图形，重新生成
                this.chartInstance.reset();
    
                // 生成图
                if(this.chartSeries.length) {
                    for(let s of this.chartSeries) {
                        if(!s.type) {
                            console.error('必须指定serie type');
                            continue;
                        }
                        this.chartInstance.createSeries(s.type, s);
                    }
                }
                this.chartInstance.data = this.chartData;
                this.chartInstance.refresh();
            });            
        }
    },

    template: `<div ref="jmChartContainer" :style="{width: width, height: height}"></div>`
};

}, function(modId) { var map = {"../../index.js":1691561832756}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1691561832756);
})()
//miniprogram-npm-outsideDeps=["./src/jmChart.js"]
//# sourceMappingURL=index.js.map