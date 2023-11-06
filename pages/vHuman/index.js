const Login = require('../../utils/login.js');
const VirtualHumanService = require('../../service/virtualHuman.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 当前采用的数智人类型 xiaowei | xiaoyong
        virtual_type: 'xiaoyong',
        virtualman_Key: '201ee6c1282c46b7890d166d78e7b076', //'69f14ab3909b470586e4be5755829969'; // 数智人形象id
        setssion: null,
        playerUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        const res = await Login.check();
        console.log('登陆：', res);

        if(!res) {
            wx.showModal({
              title: '登陆失败',
              content: '无法访问企业内部服务！',
              showCancel: false,
              complete: (res) => {
                wx.redirectTo({
                  url: '/pages/index/index?err=1',
                })
              }
            });
            return;
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        this.connectSession();
    },

    // 生成新的连接
    async connectSession() {
        let session = await VirtualHumanService.getSession(this.data.virtual_type, this.data.virtualman_Key);
        if(session) {
            wx.showToast({
              title: '找到正在运行的会话，接入!',
            });
            // 未开启的要开启
            if(!session.IsSessionStarted) {
                await VirtualHumanService.startSession(this.data.virtual_type, session.SessionId);
            }
        }
        if(!session) {
            session = await VirtualHumanService.createSession(this.data.virtual_type, this.data.virtualman_Key);
            if(session) await VirtualHumanService.startSession(this.data.virtual_type, session.SessionId);
        }
        if(session) {
            this.data.session = session;      
            const url = session.PlayStreamAddr;
        
            await bindSession(url);
            //await connectChannel(session.SessionId);
            //statSessionHanlder();// 查询状态当心跳
        }
        else {
            wx.showModal({
                title: '',
                content: '创建会话失败',
                showCancel: false
            });
        }
    },
    // 绑定直播url
    bindSession(url) {
        this.setData({
            playerUrl: url
        });
    },
    player_statechange(e) {
        console.log('live-player code:', e.detail.code)
    },
    player_error(e) {
    console.error('live-player error:', e.detail.errMsg)
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})