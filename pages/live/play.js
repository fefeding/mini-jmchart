

// pages/live/index.js
var util = require('../../utils/util');
var login = require('../../utils/login');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    play_url: '',
    play_mode: 'RTC'//SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.liveid = options.liveid;
  },
  //去后台请求ID
  createLiveId: function (info, liveid) {
    var self = this;
    wx.showLoading({
      title: '进入中...',
      mask: true
    });
    util.request('user/get_live_id/play/' + liveid, {
      uid: info.id
    }, function (err, data) {
      if (!err && data) {
        self.play(data);
      }
      else {
        console.error && console.error(err);
        wx.showModal({
          title: '错误',
          content: err ? (err.errMsg || '生成ID失败，请稍候再试') : '生成ID失败，请稍候再试',
          showCancel: false,
          success: function (res) {
            //wx.navigateBack({
            //  delta: 1
            //});
            console.log(res);
          }
        });
      }
      wx.hideLoading();
    });
  },
  play: function(data) {
    /*var url = 'rtmp://'+util.serverConfig.host + '/live/' + data.liveid;
    //如果有配置签名
    if (data.hashValue && data.timestamp) {
      url += '?sign=' + data.timestamp + '-' + data.hashValue;
    }
    //url = 'rtmp://www.jmdraw.com/live/1'
    console.log(url);
    this.setData({
      play_url: url
    });*/
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    //如果没有登录，退回到首页
    this.loginInfo = login.getSession();
    if (!this.loginInfo) {
      wx.navigateBack({
        delta: 1
      });
    }
    else {
      /*this.ctx = wx.createLivePlayerContext('player');
      this.createLiveId(this.loginInfo, this.liveid);*/
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
  error: function(e){
    console.error(e);
    wx.showToast({
      title: '进入失败',
      icon: 'error',
      duration: 4000,
      complete: function(){        
        //setTimeout(function () {
          //wx.hideLoading();
          //wx.navigateBack({
          //  delta: 1
          //});
        //}, 4000)
      }
    });
    
  },
  statechange: function (res) {
    console.log(res);
    if ([2006, -2301, 2101, 2102, 2103, 2106, 3001, 3002, 3003, 3005].indexOf(res.detail.code)>-1) {
      wx.showToast({
        title: res.detail.code + ':' + res.detail.message,
        icon: 'success',
        duration: 4000,
        complete: function () {
        }
      });
    }
  },
  netstatuschange: function(res){
    console.log(res);
  }
})