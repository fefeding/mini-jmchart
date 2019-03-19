

// pages/live/index.js
var util = require('../../utils/util');
var login = require('../../utils/login');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    live_url: '',
    live_mode: 'RTC', //SD（标清）, HD（高清）, FHD（超清）, RTC（实时通话）
    min_bitrate: 50,
    max_bitrate: 500,
    aspect: '3:4',
    buttonHide: {
      startLive: '',
      stopLive: 'hide',
      switchCamera: 'hide'
    }
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
  //去后台请求ID
  createLiveId: function(info) {
    var self = this;
    wx.showLoading({
      title: '准备中...',
      mask: true
    });
    util.request('user/get_live_id/publish/0', {
      uid: info.id
    }, function (err, data) {
      if (!err && data) {
        self.startLive(data);   
      }
      else {
        console.error && console.error(err);
        wx.showModal({
          title: '错误',
          content: err ? (err.errMsg || '生成ID失败，请稍候再试') : '生成ID失败，请稍候再试',
          showCancel: false,
          success: function (res) {
            wx.navigateBack({
              delta: 1
            });
          }
        });
      }
      wx.hideLoading();
    });
  },

  //开启
  startLive: function(data) {
    var self = this;
    //请求授权
    this.checkApi(function(){
      var url = 'rtmp://' + util.serverConfig.host + '/live/' + data.liveid;
     
      //如果有配置签名
      if (data.hashValue && data.timestamp) {
        url += '?sign=' + data.timestamp + '-' + data.hashValue;
      }
      console.log(url);
      self.setData({
        live_mode: data.liveMode || 'RTC',
        live_url: url,
        min_bitrate: data.min_bitrate||50,
        max_bitrate: data.max_bitrate || 1000,
        aspect: data.aspect||'3:4'
      });
      
      self.ctx.start({
        success: res => {
          console.log('start success');
          //显示停止按钮
          self.setData({
            buttonHide: {
              startLive: 'hide',
              stopLive: '',
              switchCamera: ''
            }
          });
        },
        fail: res => {
          console.log('start fail')
        }
      })
    });
  },

  //检查授权
  checkApi: function(callback) {
    wx.getSetting({
      success(res) {
        var ret = 0;
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            complete: function() {              
              // 用户已经同意
             if(ret) callback && callback();
              ret += 1;
            }
          });
        }
        else {
          ret += 1;
        }
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            complete: function () {
              // 用户已经同意
              if (ret) callback && callback();
              ret = 1;
            }
          });
        }
        else {
          if (ret) callback && callback();
          ret += 1;
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ctx = wx.createLivePusherContext('pusher');
  },
  //开始按钮
  bindStartLive: function() {
    this.createLiveId(this.loginInfo);
  },

  //停止按钮
  bindStopLive: function () {
    var self = this;
    this.ctx.stop({
      success: res => {
        console.log('stop success');
        //显示停止按钮
        self.setData({
          buttonHide: {
            startLive: '',
            stopLive: 'hide',
            switchCamera: 'hide'
          }
        });
      },
      fail: res => {
        console.log('stop fail')
      }
    });    
  },
  bindSwitchCamera: function() {
    this.ctx.switchCamera({
      success: res => {
        console.log('switchCamera success')
      },
      fail: res => {
        console.log('switchCamera fail')
      }
    })
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
  statechange: function(res){
    console.log(res);
    if ([-1301, -1302, -1303, -1304, -1307, -1308, -1309, -1310, 1104, 3001, 3002, 3003, 3004, 3005].indexOf(res.detail.code) > -1) {
      wx.showToast({
        title: res.detail.code + ':' + res.detail.message,
        icon: 'success',
        duration: 4000,
        complete: function () {
        }
      });
    }
  }
})