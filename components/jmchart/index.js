// components/jmchart/index.js
import jmChart from "jmchart";
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        height: {
            type: Number,
            value: 100
        },
        width: {
            type: Number,
            value: 100
        },
        options: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        chart: null
    },
    created() {
        //this.initChart();    
    },
    detached() {
        this.data.chart && this.data.chart.destroy();
        this.data.chart = null;
        this.data.jmgraphPromise = null;
    },
    /**
     * 组件的方法列表
     */
    methods: {
        initChart: async function() {
            if(this.data.chart) return this.data.chart;
            if(this.data.jmgraphPromise) return this.data.jmgraphPromise;
            return this.data.jmgraphPromise = new Promise((resolve) => {
                const query = wx.createSelectorQuery().in(this);
                wx.nextTick(()=>{
                    query.select('#jmchart_canvas')
                    .fields({ node: true, size: true })
                    .exec((res) => {
                        const canvas = res[0].node;
                        const chart = this.data.chart || (this.data.chart = new jmChart(canvas, {
                            width: res[0].width,
                            height: res[0].height,
                            autoRefresh: true,
                            ...this.data.options
                        }));  
                        resolve(chart);
                    });
                });                
            });            
          },
          handleTouch(name, ...args) {
            const chart = this.data.chart;
            if(!chart) return;
            const eventHandler = chart.eventHandler;
            if(!eventHandler) return;
            return eventHandler[name](...args);
          },
          canvastouchstart(...args) {
            return this.handleTouch('touchStart', ...args);
          },
          canvastouchmove(...args) {
            return this.handleTouch('touchMove', ...args);
          },
          canvastouchend(...args) {
            return this.handleTouch('touchEnd', ...args);
          },
          canvastouchcancel(...args) {
            return this.handleTouch('touchCancel', ...args);
          }
    }
})
