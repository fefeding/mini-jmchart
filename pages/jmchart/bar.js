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
              xField: 'x',
              enableAnimate: true
          }
        }, ()=>{      
            this.chart = this.selectComponent('#jmchart_component');
            this.initChart(this.chart);      
        });
    },
    initChart: async function(g) {
        const chart = await g.initChart();
        
        const bar1 = chart.createSeries('bar', {
            field: 'y1',
            style: {
							// 渐变色
							color: 'linear-gradient(50% 0 50% 100%, #ccc 0, #000 0.5, #fff 1)',
							label: {
								show: true,
								offset: 5, // 离柱偏移量
								shadow: {
									x: 0,
									y: 0,
									blur: 0,
									color: 'transparent'
								},
								fill: function(point) {
									console.log(point);
									if(point.yValue < 0) return 'green';
									else return 'red';
								}
							}
            },
            itemLabelFormat(p) {
							return p.yValue.toFixed(2);
						},
            // 图例格式化，如果不给定，则采用legendLabel
            legendFormat: function(options) {
                return '图1';
            },
            yLabelFormat: (v, label) => {
                return v.toFixed(0);
            }
        });		
        
        const bar2 = chart.createSeries('bar', {
            field: 'y2',
            legendLabel: '图例3',
            style: {
							// 自定义单个bar的颜色
							color: function(p) {
								if(p && p.xValue == 3) {
									return 'green';
								}
								// 默认值
								return 'linear-gradient(50% 0 50% 100%, #ff0000 0, #00ff00 0.5, #0000ff 1)';
							},
							label: {
								show: false,
								offset: 5 // 离柱偏移量
							}
						},
        });	

        chart.data = [];
        for(let i = 0; i< 5;i++) {
            const data = {
                x : i,
                y1: Math.random() * 200 + i,
                y2: Math.random() * 10 + i * 5,
            };
            chart.data.push(data);
        }
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