

// pages/live/index.js
var util = require('../../utils/util');
var login = require('../../utils/login');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //如果没有登录，退回到首页
    this.loginInfo = login.getSession();
    if (!this.loginInfo) {
      wx.navigateBack({
        delta: 1
      });
    }
  },
  //拉取在线的直播
  search: function() {
    var self = this;
    wx.showLoading({
      title: '刷新列表...',
      mask: true
    });
    this.reqHandler = util.request('user/live_list', {
      limit: 100
    }, function (err, data) {
      if (!err && data) {
        self.setData({
          liveList: data.data
        });
      }
      else {
        console.error && console.error(err);
      }
      wx.hideLoading();
      self.interval = setTimeout(function () {
        self.search();
      }, 5000);
    });
  },
  //点击进入直播
  bindLiveItem: function(e){
    var liveid = e.target.dataset.liveid;
    console.log(liveid);
    wx.navigateTo({
      url: '/pages/live/play?liveid=' + liveid
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //this.search();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.search();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.interval) clearTimeout(this.interval);
    if (this.reqHandler) this.reqHandler.abort();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.interval) clearTimeout(this.interval);
    if (this.reqHandler) this.reqHandler.abort();
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

  },
  statechange: function (res) {
    console.log(res);
  }
})