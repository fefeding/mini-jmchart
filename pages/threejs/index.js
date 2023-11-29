// pages/threejs/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canvasHeight: 600,
        canvasWidth: 500
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    async onReady() {
        this.threejs = this.selectComponent('#threejs_component');
        var wxInfo = wx.getSystemInfoSync();//获取系统信息
        this.setData({
          canvasHeight: wxInfo.windowHeight * 0.99,
          canvasWidth: wxInfo.windowWidth
        }, async ()=>{   
            const threeApp = await this.threejs.initTHREE();
            threeApp.addFloor();
            threeApp.addLights();
            threeApp.drawCoord({
                x: 4,
                y: -5,
                z: 35
            }, 1);

            threeApp.loadObj('https://jt-ai-draw-1301270551.cos.ap-guangzhou.myqcloud.com/obj/yz.glb', (gltf)=>{
                gltf.scene.scale.set(15, 15, 15);
                gltf.scene.position.set(-10, -11, -10);
                threeApp.scene.add(gltf.scene);
            });
        });
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