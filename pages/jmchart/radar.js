import jmChart from "../../components/jmchart/jmchart/dist/jmchart.esm.js";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canvasHeight: 600,
        canvasWidth: 400,
        options: {            
            xField: 'x',
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        const wxInfo = wx.getSystemInfoSync();//获取系统信息
        this.setData({
          canvasHeight: wxInfo.windowHeight * 0.5,
          canvasWidth: wxInfo.windowWidth,
          options: {   
            enableAnimate: true,
            yLabelFormat: function() {
                return this.field;
            },
            style: {
                markLine: false, // 不展示标线
                chartArea: {
                    stroke: 'transparent'
                },
                axis: {
                    stroke: '#ccc',
                    // 指定栅格条数
                    xLabel: {
                        count: 3
                    }
                },
                grid: {
                    x: true, // 是否显示网格
                    stroke: '#eaeaf1',
                    lineType: 'dotted', // 虚线，不填为实线
                    dashLength: 6, //虚线条间隔，默认5
                    lineWidth: 1,
                    zIndex: 0
                },
                margin: {
                    left: 10,
                    top: 10,
                    right: 80,
                    bottom: 10
                }
            }
        }
        }, ()=>{     
            const chart = this.selectComponent('#jmchart_component');
            this.initChart(chart);  
        });
    },
    initChart: async function(g) {
    
        const chart = await g.initChart();   
        
        const radar = chart.createSeries('radar', {
            fields: ['y1' , 'y2', 'y3', 'y4', 'y5', 'y6'],
            legendFormat: function(options) {
                return options.data.x;
            },
            onOver: function(e) {
                console.log(this.option.data)
                e.cancel = true;
                return false;
            },
            itemLabelFormat: function(point) {
                return point.yValue.toFixed(2);
            },
            style: {
                // 指定颜色获取方式，不指定就会使用默认的
                color: function(option) {	
                    if(!option || !option.data) return;							
                    const color = option.data.color || this.graph.getColor(option.index);								
                    return color;
                },
                fill: function(style) {
                    if(!style) return '';
                    const color = this.graph.utils.hexToRGBA(style.stroke);
                    return `rgba(${color.r},${color.g},${color.b}, 0.2)`;
                },
                label: {
                    show: true, // 默认就是true, 如果不想显示标签，设为false
                    stroke: '#ccc',
                    fill: 'green',
                    textAlign: 'center',
                    textBaseline: 'middle',
                    zIndex: -1,
                    border: 0
                }
            }
        });


            const data = [];
            for(let i=0; i<4; i++) {                           
               
                data.push({
                    x: 'test' + i,
                    y1: 10 * i + Math.random() * 10,
                    y2: 10 * i + Math.random() * 50,
                    y3: 10 * i + Math.random() * 100,
                    y4: 10 * i + Math.random() * 120,
                    y5: 10 * i + Math.random() * 120,
                    y6: 10 * i + Math.random() * 120
                });
            }

            chart.data = data;
            //chart.refresh(); 
         
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})