
const LoginSessionKey = 'session';
const app = getApp();

function getLoginInfo() {
    const info = wx.getStorageSync(LoginSessionKey);
    console.log('getLoginInfo', info);
    return info;
}

function setLoginInfo(data) {
    wx.setStorageSync(LoginSessionKey, data);
    return data;
}

// 检查登陆态
async function check() {
    return new Promise(async (resolve, reject) => {
        try {
            let info = getLoginInfo();
            if(!info) {
                info = await login();
                resolve(info);
            }
            else {
                // 如果是企业微信下工作
                (wx.qy||wx).checkSession({
                    success() {
                        resolve(info);
                    },
                    async fail() {
                        console.log('session timeout, relogin');
                        info = await login();
                        resolve(info);
                    }
                });
            }
        }
        catch(e) {
            console.error(e);
            resolve(false);
        }
    });
}

async function login() {
    return new Promise((resolve, reject)=>{
        wx.showLoading({
          title: '登陆中...',
        });
        (wx.qy || wx).login({
            async success(res) {
                if(res.code) {
                    const info = await code2Session(res.code);
                    if(info && info.ret === 0 && info.data) {
                        setLoginInfo(info.data);
                        resolve(info.data);
                    }
                    else {
                        console.log('登录失败！', res, info);
                        resolve(false);
                    }
                }
                else {
                    console.log('登录失败！' + res.errMsg);
                    resolve(false);
                }
            },
            fail() {
                resolve(false);
            },
            complete() {
                wx.hideLoading();
            }
        });
    });    
}
// 转换成登陆session
async function code2Session(code) {
    console.log('code2Session', app.globalData.loginApi, code);
    return new Promise((resolve, reject) => {
        wx.request({
          url: app.globalData.loginApi,
          data: {
                code,
                appId: app.globalData.appId,
                isMiniProgram: true
            },
          success: function (res) {
            if (res.statusCode == 200 && res.data) {
              resolve && resolve(res.data);
            }
            else {
              reject && reject({
                message: res.statusCode + ':' + (res.data.msg||'服务器请求异常，请稍候再试')
              }, res.data);
            }
            console.log(res);
          },
          fail: function (err) {
              reject && reject({
                  message: (err.message || '服务器请求异常，请稍候再试')
            });
            console.log(err);
          },
        });
    });
}

module.exports = {
    check,
    login,
    getLoginInfo,
    setLoginInfo
}