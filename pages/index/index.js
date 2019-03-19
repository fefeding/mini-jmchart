//index.js
var util = require('../../utils/util');
var login = require('../../utils/login');
//获取应用实例
var app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIPlay: false, //是否有直播权限
    canIView: false, //是否有观看直播权限
    getUserInfoButtonDisplay: 'none', //是否显示授权按钮
    mylive_disabled: true, //默认直播入口禁用
    mylivelist_loading: false, //默认直播loading不显示
    userInfo: {}
  },
  onLoad: function () {
    global.test = function(){
      console.log('global test');
    }
  },
  onReady: function(){
    global.test();
    let self = this;   
    //获取微信用户信息
    util.getUserInfo(function (info) {
      console.log(info);
      if (!info) {
        self.setData({
          getUserInfoButtonDisplay: ''
        });
      }
      else {
        self.getLogin(info);
      }
    });  

    //wx.showNavigationBarLoading()
  },
  statechange(e) {
    console.log('live-pusher code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo);
    this.getLogin(e.detail.userInfo);
  },
  getLogin: function(info) {
    var self = this;
    login.check(info, function (err, data) {
     
      if (err) {
        wx.showModal({
          title: '登录错误',
          content: err ?(err.errMsg||err.toString()):'登录出错，请稍候再试',
          showCancel: false,          
          success: function (res) {
            
          }
        });
      }
      else {
        data.auth = data.auth||'';
        //登录成功
        self.setData({
          canIPlay: data.auth[0]=='1',
          canIView: data.auth[1] == '1',
          mylive_disabled: false //可以用我要直播了
        });
      }
    });
  },
  //开启直播
  startLive: function(){
    this.setData({
      mylive_loading: true
    });
    wx.navigateTo({
      url: '/pages/live/publish'
    });
  },
  bindViewLive: function () {
    this.setData({
      mylivelist_loading: true
    });
    wx.navigateTo({
      url: '/pages/live/viewLive'
    });
  },
  bindGojmGraph: function() {
    wx.navigateTo({
      url: '/pages/jmgraph/index'
    });
  },
  bindGoVideo: function(){
    wx.navigateTo({
      url: '/pages/video/play'
    });
  },
  onShow: function() {
    this.setData({
      mylive_loading: false,
      mylivelist_loading: false
    });
  }
})
