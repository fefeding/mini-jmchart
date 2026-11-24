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
        //this.initGraph();    
    },
    detached() {
        this.data.graph && this.data.graph.destroy();
        this.data.graph = null;
        this.data.jmgraphPromise = null;
    },
    /**
     * 组件的方法列表
     */
    methods: {
        initGraph: async function() {
            if(this.data.graph) return this.data.graph;
            if(this.data.jmgraphPromise) return this.data.jmgraphPromise;
            return this.data.jmgraphPromise = new Promise((resolve) => {
                
                wx.nextTick(()=>{
                    const query = wx.createSelectorQuery().in(this);
                    query.select('#jmgraph_canvas')
                    .fields({ node: true, size: true })
                    .exec((res) => {
                        const canvas = res[0].node
                        const graph = this.data.graph || (this.data.graph = new jmGraph(canvas, {
                            style: {
                                fill: '#000'
                            },
                            width: res[0].width,
                            height: res[0].height,
                            autoRefresh: true,
                        }));  
                        resolve(graph);
                    });
                });                
            });            
          },
          handleTouch(name, ...args) {
            const eventHandler = this.data.graph && this.data.graph.eventHandler;
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
