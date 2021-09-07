

import jmChart from '../../index.js';

export default {
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
        this.chartInstance && this.chartInstance.destory();
        this.chartInstance && this.chartInstance.touchGraph && this.chartInstance.touchGraph.destory();
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
}
