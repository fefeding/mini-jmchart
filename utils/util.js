function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//检查登录态，优先检查session_key是否过期
function checkLogin(callback) {
  wx.checkSession({
    success: function (res) {
      console.log(res);
      //session_key 未过期，并且在本生命周期一直有效
      callback && callback(1);
    },
    fail: function () {
      // session_key 已经失效，需要重新执行登录流程
      callback && callback(0);
    }
  });
}
//获取登录态code
function getAuthCode(callback) {
  wx.showLoading({
    title: '登录中',
    mask: true
  });
  wx.login({
    success: function (res) {  
      console.log(res);   
      callback && callback(res);
    },
    fail: function () {
      wx.showModal({
        title: '失败',
        content: '登录失败，请稍重试',
        mask: true,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');            
          }
        }
      });
    },
    complete: function () {
      wx.hideLoading();
    }
  }); //重新登录
}

// 获取系统信息
function getSystemInfo() {
    const systemInfo = wx.getSystemInfoSync();
    return systemInfo;
}

//获取用户详情信息
function getUserInfo(callback) {
  // 查看是否授权
  wx.getSetting({
    success: function (res) {
      if (res.authSetting['scope.userInfo']) {
        console.log('getUserInfo withCredentials:true');
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        wx.getUserInfo({
          //withCredentials: true,
          lang: 'zh_CN',
          success: function (res) {
            console.log(res.userInfo);
            callback && callback(res.userInfo);
          },
          fail: function(res){
            console.error && console.error(res);
            callback && callback(null);
          },
          complete: function() {

          }
        });
      }
      else {
        callback && callback(null);
      }
    }
  });
}




module.exports = {
  formatTime: formatTime,
  checkLogin: checkLogin,
  getUserInfo: getUserInfo,
  getAuthCode: getAuthCode,
  getSystemInfo,
  serverConfig: {
    appid: 'wx0ee68cb48a2a96f8',
    host: 'www.jmdraw.com',
    url: 'https://www.jmdraw.com/cgi/proxy.ashx?'
  }
}
