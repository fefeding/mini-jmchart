// pages/threejs/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canvasHeight: 600,
        canvasWidth: 500,
        floorY: -11
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
            threeApp.addFloor({
                position: {
                    x: 0,
                    y: this.data.floorY,
                    z: 0
                }
            });
            threeApp.addLights();
            threeApp.drawCoord({
                x: 4,
                y: -5,
                z: 35
            }, 1);

            threeApp.loadObj('https://jt-ai-draw-1301270551.cos.ap-guangzhou.myqcloud.com/obj/yz.glb', (gltf)=>{
                gltf.scene.scale.set(15, 15, 15);
                gltf.scene.position.set(-10,  this.data.floorY, -10);
                threeApp.scene.add(gltf.scene);
            });
/*
            threeApp.loadObj('https://jt-ai-draw-1301270551.cos.ap-guangzhou.myqcloud.com/obj/kevin.glb', (gltf)=>{
                //gltf.scene.scale.set(15, 15, 15);
                gltf.scene.position.set(0,  this.data.floorY, 5);
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

            threeApp.bindAnimation((time) => {
                const rx = time / 5000;
                const ry = time / 2000;
                sphere.rotation.y = ry;
                sphere.rotation.x = rx;

                this.drawAnalyserData();
            });
            this.threeApp = threeApp;
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
                console.log('onstatechange', e);
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

        this.data.currentPlayedBuffer = buffer;

        this.data.audioBufferSouceNode.onended = (e) => {
            console.log('play end', e);
            delete this.data.currentPlayedBuffer;
            this.data.isTalking = false;
        }
        this.data.audioBufferSouceNode.addEventListener && this.data.audioBufferSouceNode.addEventListener('play', (e)=>{
            console.log('play', e);
        });

        this.data.audioBufferSouceNode.buffer = buffer;
        ////连接到扬声器
        this.data.audioBufferSouceNode.connect(this.data.audioContext.destination);
        //处理频谱
        this.createAnalyser(this.data.audioBufferSouceNode);
        //开始播放
        this.data.audioBufferSouceNode.start(0);
        this.data.isTalking = true;
        console.log('play start');
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
        if(!this.data.analyser || !this.threeApp || !this.data.isTalking) return;
        //获取频率能量值
        var array = new Uint8Array(this.data.analyser.frequencyBinCount);
        this.data.analyser.getByteFrequencyData(array);
        
        let average = 0;

        //const hasHuman = detectHumanVoice(analyser, array);
        
        var arrper = 10;
        var count = Math.floor(array.length / arrper);
        //每个柱子的宽度
        var w = 1.4;
        var perh = 1;
        this.data.boxList = this.data.boxList || [];
        for(var i=0;i<count; i++) {
            var start = i*arrper;
            var end = start + arrper;
            var arr = array.slice(start, end);
            var arrsum = 0;
            arr.forEach(p=>arrsum+=p);
            average += arrsum;
            
            var h = perh * arrsum/arr.length/255*40;
            var bar = this.data.boxList[i];

            if(!bar)  {
                var x = i * w - 26;
                //画频谱能量图
                bar = new this.threeApp.THREE.Mesh(new this.threeApp.THREE.BoxGeometry(1, 1, 1), new this.threeApp.THREE.MeshNormalMaterial({
                    // color: 0xff0000,
                    opacity: 0.7,
                    transparent: true
                }));
                bar.castShadow = true;
                bar.position.set(x,  this.data.floorY, -28);
                this.threeApp.scene.add(bar);
                this.data.boxList[i] = bar;
            }
            bar.scale.y = h;
            bar.position.y = h/2 +  this.data.floorY;
        }
        if(this.data.myTalkingAction) {
            average = average / count;
            if(average > 25 && this.data.isTalking) {
                this.data.myTalkingAction.play();
            }
            else {
                this.data.myTalkingAction.stop();
            }
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