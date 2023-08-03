import jmGraph from "jmgraph";
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
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        graph: null
    },

    created() {
        this.initGraph();    
    },
    detached() {
        this.data.graph && this.data.graph.destroy();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        initGraph: async function() {
            if(this.data.graph) return this.data.graph;
            if(this.data.jmgraphPromise) return this.data.jmgraphPromise;
            return this.data.jmgraphPromise = new Promise((resolve) => {
                const query = wx.createSelectorQuery().in(this);
                wx.nextTick(()=>{
                    query.select('#jmgraph_canvas')
                    .fields({ node: true, size: true })
                    .exec((res) => {
                        const canvas = res[0].node
                        const graph = this.data.graph || (this.data.graph = new jmGraph(canvas, {
                            style: {
                            //fill: '#000'
                            },
                            width: this.data.width,
                            height: this.data.height,
                            autoRefresh: true
                        }));  
                        console.log(graph);
                        resolve(graph);
                    });
                });                
            });            
          },
          canvastouchstart(...args) {
            return this.data.graph.eventHandler.touchStart(...args);
          },
          canvastouchmove(...args) {
            return this.data.graph.eventHandler.touchMove(...args);
          },
          canvastouchend(...args) {
            return this.data.graph.eventHandler.touchEnd(...args);
          },
          canvastouchcancel(...args) {
            return this.data.graph.eventHandler.touchCancel(...args);
          }
    }
})
