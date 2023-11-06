const { request } = require('../utils/request.js');

const apiUrl = 'https://oa.ciccjinteng.com/ai-helper/api/virtualHuman';
// 获取签名
async function getSign(virtualType, sessionId='') {
    const res = await request({
          method: "post",
          url: `${apiUrl}/getSign?virtualType=${virtualType}`,
          data: {
            requestId: sessionId
          }
        });
    if(res.ret === 0 && res.data) {
      return res.data;
    }
    return null;
  }
  
  // 获取当前session
  async function getSession(virtualType, key) {
    const res = await request({
          method: "post",
          url: `${apiUrl}/listSessionByKey?virtualType=${virtualType}`,
          data: {
            key: key
          }
        });
    if(res.ret === 0 && res.data.Sessions.length) {
      for(const session of res.data.Sessions) {
        // 找到会话有效，进行中或准备中
        if(session.SessionStatus === 1 || session.SessionStatus === 3) return session;
      }
    }
    return null;
  }
  
  // 创建会话
  async function createSession(virtualType, key) {
    const res = await request({
          method: "post",
          url: `${apiUrl}/createSession?virtualType=${virtualType}`,
          data: {
            key: key,
            protocol: 'rtmp'
          }
        });
    if(res.ret === 0 && res.data) {
      return res.data;
    }
    else if(res.msg) {
      console.error('创建会话失败 ' + res.msg);
    }
    return null;
  }
  
  // 开启会话
  async function startSession(virtualType, sessionId) {
    const res = await request({
          method: "post",
          url: `${apiUrl}/startSession?virtualType=${virtualType}`,
          data: {
            sessionId: sessionId,
          }
        });
    if(res.ret === 0 && res.data) {
      
      return res.data;
    }
    else if(res.msg) {
      //ElMessage.error('创建会话失败 ' + res.msg);
    }
    return null;
  }
  
  // 查询会话状态
  async function statSession(virtualType, sessionid) {
    const res = await request({
          method: "post",
          url: `${apiUrl}/statSession?virtualType=${virtualType}`,
          data: {
            sessionId: sessionid,
          }
        });
    if(res.data.ret === 0 && res.data) {
      return res.data;
    }
    else if(res.msg) {
     
    }
    return null;
  }
  
  // 发送驱动命令
  async function sendCommand(virtualType, data) {
    const res = await request({
          method: "post",
          url: `${apiUrl}/command?virtualType=${virtualType}`,
          data 
        });
    if(res.ret === 0 && res.data) {
      return res.data;
    }
    else if(res.msg) {
      console.error('发送： ' + res.msg);
    }
    return null;
  }

  module.exports = {
    getSign,
    getSession,
    createSession,
    startSession,
    statSession,
    sendCommand
  }