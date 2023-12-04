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
            /*threeApp.drawCoord({
                x: 4,
                y: -5,
                z: 35
            }, 1);*/

            threeApp.loadObj('https://jt-ai-draw-1301270551.cos.ap-guangzhou.myqcloud.com/obj/yz.glb', (gltf)=>{
                gltf.scene.scale.set(15, 15, 15);
                gltf.scene.position.set(-10, -11, -10);
                threeApp.scene.add(gltf.scene);
            });

            const stacy_txt = new threeApp.THREE.TextureLoader().load('https://jt-ai-draw-1301270551.cos.ap-guangzhou.myqcloud.com/obj/football.jpg');
            stacy_txt.flipY = false; // we flip the texture so that its the right way up
            const stacy_mtl = new threeApp.THREE.MeshPhongMaterial({
                map: stacy_txt,
                color: 0xffffff,
                skinning: true
            });
            // 创建一个球体几何体
            const ballGeometry = new threeApp.THREE.SphereGeometry(5, 25, 25);
            
            // 使用几何体和材质创建球体
            const sphere = new threeApp.THREE.Mesh(ballGeometry, stacy_mtl);
            sphere.position.set(-10, 20, 10);
            sphere.castShadow = true;
            // 将球体添加到场景中
            threeApp.scene.add(sphere);

            threeApp.bindAnimation((time) => {
                const rx = time / 5000;
                const ry = time / 2000;
                sphere.rotation.y = ry;
                sphere.rotation.x = rx;
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