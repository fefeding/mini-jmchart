const Login = require('./login');

  //生成请求的header
  //需要在header中带上cookie
  const getRequestHeader = (header) => {
    const session = Login.getLoginInfo();
    if (session) {
      let cookie = '';
      if(session.id) {
          cookie += `jvSessionToken=${session.id}`;
      }
      header['cookie'] = cookie;
    }
    return header;
  }

//请求服务器
async function request(url, data) {    
    if(typeof url === 'object') {
        data = url.data || {};
        url = url.url || '';
    }
    data = data||{};
    const header = getRequestHeader({
        'content-type': 'application/json', // 默认值
      });
    console.log('req:' + url);
    console.log(data);
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
            header: header,
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
            complete: function () {
              
            }
          });
    });
  }

  module.exports = {
    request
  }
  
