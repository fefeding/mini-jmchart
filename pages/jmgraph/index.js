// pages/jmgraph/index.js
//https://github.com/jiamao/jmgraph

import {jmGraph} from "../../libs/jmgraph/index.js";
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
    canvasHeight: 600
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

    //let jmGraph = require('../../utils/jmgraph');

    var self = this;
    var wxInfo = wx.getSystemInfoSync();//获取系统信息
    this.setData({
      canvasHeight: wxInfo.windowHeight - 50
    }, function(){     
         
      var g = new jmGraph('firstCanvas', {
        style: {
          fill: '#000'
        },
        width: wxInfo.windowWidth,
        height: self.data.canvasHeight,
        autoRefresh: true
      });      
        self.initGraph(g);      
    });
  },
  initGraph: function(g) {
    
    this.graph = g;   

    this.changeShape('rect');//默认显示

    //初始化jmGraph事件
    //把小程序中的canvas事件交给jmGraph处理
    this.canvastouchstart = function (...arg) {
      return g.eventHandler.touchStart(...arg);
    }
    this.canvastouchmove = function (...arg) {
      return g.eventHandler.touchMove(...arg);
    }
    this.canvastouchend = function (...arg) {
      return g.eventHandler.touchEnd(...arg);
    }
    this.canvastouchcancel = function (...arg) {
      return g.eventHandler.touchCancel(...arg);
    }
  },

  radioChange: function(e) {
    console.log(e);
    //切换示例
    this.changeShape(e.detail.value);
  },

  changeShape: function(s) {
      
    this.destory();
    
    //切换示例
    let shape = null;
    for(const o of this.data.shapes) {
        if(o.name === s) shape = o;
    }
    console.log('require', shape);
    this.graphShape = shape.page;
    this.graphShape.init(this.graph);
    this.graph.needUpdate = true;
  },

  destory() {
    this.graph.children.clear();
    if (this.graphShape && this.graphShape.destory) {
      this.graphShape.destory(this.graph);
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