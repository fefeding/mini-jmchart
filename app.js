//app.js
App({
  onLaunch: function () {
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.globalData.isWXWork = this.globalData.systemInfo.environment === 'wxwork';
    console.log('isWXWork', this.globalData.isWXWork, this.globalData.systemInfo.environment);
  },
  globalData:{
    userInfo: null,
    // 企业内部应用ID
    appId: 91,
    loginApi: 'https://sso.ciccjinteng.com/account/api/login/loginByWeWork'
  }
})