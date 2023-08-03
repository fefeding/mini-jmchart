
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
          options:  {
                xField: 'x',
                //baseY: 0,
                // 最大和最小X值，  这里一般不用指定，除非硬是需要
                minXValue : 0,
                maxXValue : 10,
                minYValue: -100,
                maxYValue: 400,
                enableAnimate: true,
                autoRefresh: true,
                yLabelFormat: (value, shape)=>{
                    return value + '%';
                },
                xLabelFormat: (value, data, index)=>{
                    if(index % 5 === 0) return value + 'x';
                    return '';
                }
            }
        }, ()=>{      
            this.chart = this.selectComponent('#jmchart_component');
            this.initChart(this.chart);            
        });
    },
    initChart: async function(g) {
        const chart = await g.initChart();
    
        const self = this;
        const line1 = chart.createSeries('line', {
            field: 'y1',
            //index: 2, // 指定Y轴索引，如是档指定就会共用左边的Y轴，
            // 最大值和最小值，如果不指定会自动计算，
            // 如果指定了也只是指定了最大或最小边界，如果有数值超过它，依然以事实数值为准
            minYValue: 0,
            //maxYValue: 200 ,
            style: {
                // 画圆滑的曲线 
                curve: true,// 填充图形
                area: {
                    // 自定义填充颜色处理
                    fill: function(style) {
                        // 根据颜色生成渐变效果
                        const color = this.graph.utils.hexToRGBA(this.style.stroke);
                        return `linear-gradient(50% 0 50% 100%, 
                            rgba(${color.r},${color.g},${color.b}, 0) 1, 
                            rgba(${color.r},${color.g},${color.b}, 0) 0.8,
                            rgba(${color.r},${color.g},${color.b}, 0.3) 0.5,
                            rgba(${color.r},${color.g},${color.b}, 0.5) 0.2, 
                            rgba(${color.r},${color.g},${color.b}, 0.8) 0)`;
                    }
                }
            },
            legendFormat: function(options) {
                return '图例2';
            },
            // 生成点的回调
            onPointCreated(point) {
                //console.log('onPointCreated', point);
                if(point.data.x === 10) {
                    self.addPointMarkLabel(point, this, {
                        index: 0,
                        text: '买入',
                        style: {
                            fill: '#55cccccc',
                            stroke: 'blue'
                        },
                        labelStyle: {
                            fill: 'blue'
                        }
                    });
                    self.addPointMarkLabel(point, this, {
                        index: 1,
                        text: '卖出',
                        style: {
                            fill: '#22cccccc',
                            stroke: 'red'
                        },
                        labelStyle: {
                            fill: 'green'
                        }
                    });
                }
            }
        });		
        
        const line2 = chart.createSeries('line', {
            field: 'y2',
            legendLabel: '图例3',
            index: 2,
            style: {
                showItem: false,
                // 画圆滑的曲线 
                curve: true,// 填充图形
                area: {
                    // 自定义填充颜色处理
                    fill: function(style) {
                        // 根据颜色生成渐变效果
                        const color = this.graph.utils.hexToRGBA(this.style.stroke);
                        return `linear-gradient(50% 0 50% 100%, 
                            rgba(${color.r},${color.g},${color.b}, 0) 1, 
                            rgba(${color.r},${color.g},${color.b}, 0) 0.8,
                            rgba(${color.r},${color.g},${color.b}, 0.3) 0.5,
                            rgba(${color.r},${color.g},${color.b}, 0.5) 0.2, 
                            rgba(${color.r},${color.g},${color.b}, 0.8) 0)`;
                    }
                }
            },
            // 生成点的回调
            onPointCreated(point) {
                //console.log('onPointCreated', point);							
                if(point.index % 7 === 0) {
                    self.addPointMark(point, this, {
                        style: {
                            fill: this.style.stroke,
                            stroke: '#ffffff',
                            lineWidth: 3,
                        }
                    });
                }
                else if(point.index % 5 === 0) {
                    self.addPointMark(point, this, {
                        style: {
                            fill: '#ffffff',
                            stroke: 'green',
                            lineWidth: 2,
                        }
                    });
                }
            }
        });	

        chart.data = [];
        for(let i = 0;i<20;i++) {
            const data = {
                x : i,
                y1: Math.random() * 200 + i,
                y2: Math.random() * 10 + i * 5,
            };
            chart.data.push(data);
        }
        chart.refresh();
      },
      addPointMark(point, serie, options) {
        const mark = serie.graph.createShape('circle', {
            radius: 6 * serie.graph.devicePixelRatio,
            style: {
                fill: 'red',
                zIndex: 18,
                ...options.style
            },
            center: point
        });
        serie.addShape(mark);
    },
        // 创建点的标注
    addPointMarkLabel(point, serie, options = {index:0}) {
        const w = 40 * serie.graph.devicePixelRatio;
        const h = 20 * serie.graph.devicePixelRatio;
        const arrowOffset = 10 * serie.graph.devicePixelRatio;
        
        const bottom = 20 * serie.graph.devicePixelRatio + (h + arrowOffset) * options.index;

        // 标注图形左上角
        const p1 = {
                    x: point.x - w / 2,
                    y: point.y - bottom - h
                };
        const p2 = {
                    x: p1.x,
                    y: p1.y + h
                };
        const p3 = {
                    x: p2.x + w,
                    y: p2.y
                };
        const p4 = {
                    x: p3.x,
                    y: p1.y
                };
        
        const labelPath = serie.graph.createShape('path', {
            style: {
                stroke: 'red',
                fill: '#55cccccc',
                zIndex: 20,
                close: true,
                ...options.style
            },
            points: [
                p1,
                p2,
                {
                    x: point.x - arrowOffset / 2,
                    y: p2.y
                },
                {
                    x: point.x,
                    y: p2.y + arrowOffset
                },
                {
                    x: point.x + arrowOffset / 2,
                    y: p2.y
                },
                p3,
                p4
            ]
        });
        const label = serie.graph.createShape('label', {
            style: {
                textAlign: 'center',
                textBaseline: 'middle',
                ...options.labelStyle
            },
            center: {
                x: w / 2,
                y: h / 2 + 2
            },
            text: options.text
        });
        
        labelPath.children.add(label);
        serie.addShape(labelPath);
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