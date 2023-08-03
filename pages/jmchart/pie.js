
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
            },
            style: {
                markLine: false, // 不展示标线
                margin: {
                    left: 50
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
        
        const pie = chart.createSeries('pie', {
            field: 'y1',
            startAngle: function(data) {
                const step = Math.abs(data[0].y1 / this.totalValue);
                return Math.PI/2 - step * Math.PI;// 当前占的角度的一半加上偏移要刚好等于90度
            },//10,
            anticlockwise: false, //是否逆时针
            legendFormat: function(options) {
                return 'test' + options.data.x;
            },
            itemLabelFormat: function(point) {
                //return (point.step * 100).toFixed(2) + '%';
                //return point.data.name;
                const label = this.graph.createShape('label', {
                    style: this.style.label,
                    text: point.data.name,
                    position: function() {
                        
                        // 动态计算位置
                        const parentRect = this.parent.getBounds();

                        // 圆弧的中间位，离圆心最近和最完的二个点
                        let centerMaxPoint = this.parent.points[Math.floor(this.parent.points.length / 2)];
                        // 如果是空心圆，则要计算 1/4 和 3/4位的点。顺时针和逆时针二个点大小不一样，这里只取，大小计算时处理
                        if(point.shape.style.isHollow) {
                            centerMaxPoint = this.parent.points[Math.floor(this.parent.points.length * 0.75)];
                        }

                        const size = this.testSize();
                        const offset = 100;
                        const position = {
                            x: 0,
                            y: 0
                        };

                        position.x = (centerMaxPoint.x - this.parent.center.x) / this.parent.radius * offset + centerMaxPoint.x - parentRect.left;
                        position.y = (centerMaxPoint.y - this.parent.center.y) / this.parent.radius * offset + centerMaxPoint.y - parentRect.top;
                        return position;
                    }
                });
                return label;
            },
            /*radius: function(p, radius, index) {
                if(p.data.selected) {
                    return radius + 10;
                }
                return radius;
            },*/
            minRadius: function(p, r, i) {
                if(p.data.selected) {
                    return r + 10;
                }
                return r;
            },
            maxRadius: function(p, r, i) {
                if(p.data.selected) {
                    return r + 10;
                }
                return r;
            },
            center: function(p, center, index) {
                // 如果被选中
                if(p.data.selected) {
                    // 根据中心角度，偏移离中心偏移一个量
                    const mradius = 10;
                    // 逆时针需要反过来
                    const angle = ((p.endAngle - p.startAngle) / 2 + p.startAngle) * (p.anticlockwise? 1: -1);
                    if(angle !== 0) {
                        return {
                            x: center.x + Math.cos(angle) * mradius,
                            y: center.y - Math.sin(angle) * mradius
                        }
                    }
                }
                return center;
            },
            // 点击事件
            onClick: function(point, e) {							
                
            },
            /*onOver: function(point, e) {
                point.data.overColor = '#D8E404';
                this.needUpdate = true;

                // 每隔一段时间检查是否在图形上，否则认为离开
                clearTimeout(point.data.___event_check_handler);
                point.data.___event_check_handler = setTimeout(() => {
                    if(point.data.overColor) {
                        point.data.overColor = '';
                        this.needUpdate = true;
                    }
                }, 200);
            },
            onLeave: function(point, e) {
                point.data.overColor = '';// 去除当前色
                this.needUpdate = true;
            },*/
            style: {
                isHollow: true, // 是否空心
                arcWidth: 30, // 圆弧宽
                marginAngle: 0.02,// 间隔角度
                // 指定颜色获取方式，不指定就会使用默认的
                color: function(point) {	
                    if(!point || !point.data) return;							
                    const color = point.data.color || this.graph.getColor(point.x);
                    if(!point.data.selected) {
                    // 如果没有被选中，则给个透明度
                        const colorRGBA = this.graph.utils.hexToRGBA(color);
                        return `rgba(${colorRGBA.r},${colorRGBA.g},${colorRGBA.b}, 0.5)`;
                    }
                    return color;
                },
                label: {
                    show: false, // 默认就是true
                    stroke: '#ccc',
                    fill: 'blue',
                    textAlign: 'center',
                    textBaseline: 'middle',
                    border: {
                        top: true,
                        left: true,
                        right: true,
                        bottom: true,
                        style: {
                            fill: '#000'
                        }
                    }
                }
            }
        });
        chart.data = [
            {
                x : 0,
                name: 'test1',
                color: '#249FDA',
                y1 :  50,
                selected: true
            },
            {
                x : 1,
                name: 'test2',
                color: '#EA3B7C',
                y1 :  100
            },
            {
                x : 2,
                name: 'test3',
                color: '#8EBC00',
                y1 :  66
            },
            {
                x : 3,
                name: 'test4',
                color: '#309B46',
                y1 :  88
            }
        ];	
        chart.refresh();
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