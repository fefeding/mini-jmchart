// pages/jmgraph/index.js
//https://github.com/jiamao/jmgraph

import rectPage from './rect.js';
import bezierPage from './bezier.js';
import resizePage from './resize.js';
import progressPage from './progress.js';
import ballPage from './ball.js';
import cellPage from './cell.js';
import sortPage from './sort.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shapes: [
      { name: 'rect', value: 'base', checked: 'true', page: rectPage},
      { name: 'bezier', value: 'bezier', page: bezierPage  },
      { name: 'resize', value: 'resize', page: resizePage },
      { name: 'progress', value: '动画', page: progressPage },
      { name: 'ball', value: '球', page: ballPage },
      { name: 'cell', value: '孢子', page: cellPage },
      { name: 'sort', value: '排序', page: sortPage },
    ],
    canvasHeight: 600,
    canvasWidth: 500
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('jmgraph load');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.jmgraph = this.selectComponent('#jmgraph_component');
    var wxInfo = wx.getSystemInfoSync();//获取系统信息
    this.setData({
      canvasHeight: wxInfo.windowHeight - 50,
      canvasWidth: wxInfo.windowWidth
    }, ()=>{   
         this.changeShape('rect');
    });
  },
  

  radioChange: function(e) {
    console.log(e);
    //切换示例
    this.changeShape(e.detail.value);
  },

  changeShape: async function(s) {
      const graph = await this.jmgraph.initGraph();
        this.destory(graph);
    
        //切换示例
        let shape = null;
        for(const o of this.data.shapes) {
            if(o.name === s) shape = o;
        }
        console.log('require', shape);
        this.graphShape = shape.page;
        this.graphShape.init(graph);
  },

  destory(graph) {
    graph && graph.children.clear();
    if (this.graphShape && this.graphShape.destory) {
      this.graphShape.destory(graph);
    }
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
    this.destory();
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