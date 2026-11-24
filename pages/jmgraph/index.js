// pages/jmgraph/index.js
//https://github.com/jiamao/jmgraph

import rectPage from './rect.js';
import bezierPage from './bezier.js';
import resizePage from './resize.js';
import progressPage from './progress.js';
import ballPage from './ball.js';
import cellPage from './cell.js';
import sortPage from './sort.js';
import psoPage from './pso.js';
const util = require('../../utils/util.js');

// 示例模块只放在逻辑层，避免随 setData 序列化到视图层
const shapePages = {
  rect: rectPage,
  bezier: bezierPage,
  resize: resizePage,
  progress: progressPage,
  ball: ballPage,
  cell: cellPage,
  sort: sortPage,
  pso: psoPage
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shapes: [
      { name: 'rect', value: 'base', checked: 'true' },
      { name: 'bezier', value: 'bezier' },
      { name: 'resize', value: 'resize' },
      { name: 'progress', value: '动画' },
      { name: 'ball', value: '球' },
      { name: 'cell', value: '孢子' },
      { name: 'sort', value: '排序' },
      { name: 'pso', value: 'PSO' },
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
    var wxInfo = util.getSystemInfo();//获取系统信息
    this.setData({
      canvasHeight: wxInfo.windowHeight * 0.9,
      canvasWidth: wxInfo.windowWidth
    }, ()=>{   
         this.changeShape('rect');
    });
  },
  

  radioChange: function(e) {
    //切换示例
    this.changeShape(e.detail.value);
  },

  changeShape: async function(s) {
      const graph = await this.jmgraph.initGraph();
        this.destory(graph);
    
        //切换示例
        this.graphShape = shapePages[s];
        if(this.graphShape) this.graphShape.init(graph);
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