//index.js
const Login = require('../../utils/login.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isWXWork: true,
    canIPlay: false, //是否有直播权限
    canIView: false, //是否有观看直播权限
    getUserInfoButtonDisplay: 'none', //是否显示授权按钮
    mylive_disabled: true, //默认直播入口禁用
    mylivelist_loading: false, //默认直播loading不显示
    userInfo: {},
    version: ''
  },
  onLoad: function (option) {
      this.setData({
        isWXWork: app.globalData.isWXWork,
        version: app.globalData.version
      });
    // 企微环境，直接跳虚拟人
    if(option.err !== '1' && (app.globalData.isWXWork || option.jvSessionKey)) {
        // 指定了登陆态，则写入
        if(option.jvSessionKey) {
            Login.setLoginInfo({
                id: option.jvSessionKey
            });
        }
        //setTimeout(()=>{
        //    wx.redirectTo({
         //       url: '/pages/vHuman/index',
         //     });
        //}, 500);
    }
  },
  onReady: async function(){

  },
  statechange(e) {
    console.log('live-pusher code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  bindGetUserInfo: function (e) {
    
  },
  getLogin: function(info) {
    
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
  bindGojmChart() {
    wx.navigateTo({
      url: '/pages/jmchart/index'
    });
  },
  bindGoVideo: function(){
    wx.navigateTo({
      url: '/pages/video/play'
    });
  },
  bindGovHuman() {
    wx.navigateTo({
        url: '/pages/vHuman/index'
      });
  },
  bindGothreejs() {
    wx.navigateTo({
        url: '/pages/threejs/index'
      });
  },
  onShow: function() {
    this.setData({
      mylive_loading: false,
      mylivelist_loading: false
    });
  }
})
