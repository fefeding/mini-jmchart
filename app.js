//app.js
App({
  onLaunch: function () {
    this.globalData.systemInfo = wx.getSystemInfoSync();
    this.globalData.isWXWork = this.globalData.systemInfo.environment === 'wxwork';
    const accInfo = wx.getAccountInfoSync();      
    if(accInfo && accInfo.miniProgram ) this.globalData.version = accInfo.miniProgram.version || accInfo.miniProgram.envVersion || '';
    console.log('globalData', this.globalData);
  },
  globalData:{
    userInfo: null,
    // 企业内部应用ID
    appId: 91,
    version: '',
    loginApi: 'https://sso.ciccjinteng.com/account/api/login/loginByWeWork'
  }
})