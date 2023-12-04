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
         this.loadSoundFile('https://jt-ai-draw-1301270551.cos.ap-guangzhou.myqcloud.com/obj/1701177091784.mp3').then(buffer => {
            
            this.setData({
                currentAudioData: buffer
            })
         });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    async onReady() {
        this.threejs = this.selectComponent('#threejs_component');
        var wxInfo = wx.getSystemInfoSync();//获取系统信息
        this.setData({
          canvasHeight: wxInfo.windowHeight * 0.95,
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

            /*threeApp.loadObj('https://jt-ai-draw-1301270551.cos.ap-guangzhou.myqcloud.com/obj/kevin.glb', (gltf)=>{
                gltf.scene.scale.set(15, 15, 15);
                gltf.scene.position.set(0, -11, 5);
                threeApp.scene.add(gltf.scene);
            }, (e) => {
                console.log(e);
            });*/

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

            //画频谱能量图
            this.data.soundBox = new threeApp.THREE.Mesh(new threeApp.THREE.BoxGeometry(0.5, 0.5, 0.5), new threeApp.THREE.MeshNormalMaterial({
                // color: 0xff0000,
                opacity: 0.7,
                transparent: true
            }));
            this.data.soundBox.position.set(-5, -11, 25);
            threeApp.scene.add(this.data.soundBox);

            threeApp.bindAnimation((time) => {
                const rx = time / 5000;
                const ry = time / 2000;
                sphere.rotation.y = ry;
                sphere.rotation.x = rx;

                this.drawAnalyserData();
            });
        });
    },

    // 加载音频文件
    async loadSoundFile(url) {
        return new Promise((resolve) => {
            wx.request({
                url: url, 
                responseType: 'arraybuffer',
                success (res) {
                    resolve(res.data);
                }
              });
        });        
    },

    //解码
    decodeAudio(data) {
        if(!this.data.audioContext) {
            this.data.audioContext = wx.createWebAudioContext({
                useWebAudioImplement: true
            });
            this.data.audioContext.onstatechange = function(e) {
                console.log(e);
            }
        }
        console.log('解码中...');
        this.data.currentAudioData = data.slice(0);

        this.data.audioContext.decodeAudioData(data, (buffer)=>{
            console.log('解码成功');
            this.play(buffer); //播放
        }, function(e){
            console.log('解码失败,' + e.message);
        });
    },
    //播放
    play(buffer) {		
        //如果 已在播放，则中止
        if(this.data.audioBufferSouceNode) {
            this.data.audioBufferSouceNode.stop(0);
        }
        this.data.audioBufferSouceNode = this.data.audioContext.createBufferSource();	

        this.data.audioBufferSouceNode.onended = (e) => {
            console.log('play end', e);
            this.data.isTalking = false;
        }
        this.data.audioBufferSouceNode.addEventListener('play', (e)=>{
            console.log('play', e);
        });

        this.data.audioBufferSouceNode.buffer = buffer;
        ////连接到扬声器
        //audioBufferSouceNode.connect(audioContext.destination);
        //处理频谱
        this.createAnalyser(this.data.audioBufferSouceNode);
        //开始播放
        this.data.audioBufferSouceNode.start(0);
        this.data.isTalking = true;

        if(this.data.myTalkingAction) this.data.myTalkingAction.reset();
    },

    //生成频谱分析
    createAnalyser(souceNode) {
        if(this.data.analyser) {				
            this.data.analyser.disconnect(this.data.audioContext.destination);
        }
        //频谱能量分析器
        this.data.analyser = this.data.audioContext.createAnalyser();
        // 分析音频
        this.data.analyser.fftSize = 2048;

        souceNode.connect(this.data.analyser);
        //扬声器
        this.data.analyser.connect(this.data.audioContext.destination);

        //drawAnalyserData(analyser);//绘制漂亮的频谱图
    },

    onTalk(e) {
        if(this.data.currentAudioData) this.decodeAudio(this.data.currentAudioData);
    },

    drawAnalyserData() {
        if(!this.data.analyser) return;
        //获取频率能量值
        var array = new Uint8Array(this.data.analyser.frequencyBinCount);
        this.data.analyser.getByteFrequencyData(array);
        
        const sum = array.reduce((a, b) => a + b, 0);
        const average = sum / array.length;

        //const hasHuman = detectHumanVoice(analyser, array);
        if(this.data.myTalkingAction) {
            if(average > 25 && this.data.isTalking) {
                this.data.myTalkingAction.play();
            }
            else {
                this.data.myTalkingAction.stop();
            }
        }

        if(this.data.soundBox) {
            this.data.soundBox.scale.y = average/255*50;
            this.data.soundBox.position.y = -11;
        }
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
        if(this.data.audioContext) this.data.audioContext.close();
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