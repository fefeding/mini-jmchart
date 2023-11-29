import * as THREE from '../../utils/threejs/libs/three.weapp';
import gLTF from '../../utils/threejs/jsm/loaders/GLTFLoader';
import { OrbitControls } from '../../utils/threejs/jsm/controls/OrbitControls';
const GLTFLoader = gLTF(THREE);

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        height: {
            type: Number,
            value: 100
        },
        width: {
            type: Number,
            value: 100
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    detached() {
        if(this.data.canvas && this.data.canvas.cancelAnimationFrame) {
            this.data.canvas.cancelAnimationFrame();
        }
        //注意清理global中的canvas对象
        THREE.global.clearCanvas();
        delete this.data.canvas;
    },

    /**
     * 组件的方法列表
     */
    methods: {
        initTHREE: async function(option={}) {
            if(this.data.threeCanvas) return this.data.threeCanvas;
            if(this.data.threePromise) return this.data.threePromise;
            return this.data.threePromise = new Promise((resolve) => {
                
                wx.nextTick(()=>{
                    const query = wx.createSelectorQuery().in(this);
                    query.select('#webgl_canvas')
                    .fields({ node: true, size: true })
                    .exec((res) => {
                        const canvas = this.data.canvas = new THREE.global.registerCanvas(res[0].node);
                        const clock = new THREE.Clock();
                        option.width = option.width || canvas.width;
                        option.height = option.height || canvas.height;
                        option.aspect = option.aspect || (option.width / option.height);
                        const camera = new THREE.PerspectiveCamera( option.fov||50, option.aspect, option.near || 0.1, option.far || 1000 );
                    
                        camera.position.z = 60; 
                        camera.position.x = 0;
                        camera.position.y = 10;
                        camera.lookAt(0, 0);
                    
                        const backgroundColor = option.backgroundColor || 0xf1f1f1;
                    
                        const scene = new THREE.Scene();
                        scene.background = new THREE.Color(backgroundColor);
                    
                        const renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
                        renderer.setSize( option.width, option.height );
                        // 人物对象能投射阴影
                        renderer.shadowMap.enabled = true;
                        renderer.setPixelRatio(option.devicePixelRatio || wx.getSystemInfoSync().pixelRatio);
                    
                        const control = new OrbitControls(camera, renderer.domElement);
                        control.update();

                        const app = {
                            THREE,
                            scene,
                            clock,
                            camera,
                            renderer,
                            animations: [],
                            bindAnimation(cb) {
                                app.animations.push(cb);
                            },
                            unbindAnimation(cb) {
                                for(let i=app.animations.length-1; i>=0; i--) {
                                    if(app.animations[i] === cb) {
                                        app.animations.splice(i, 1);
                                    }
                                }
                            },
                            control,
                            loadObj: (...args)=>{
                                this.loadObj(...args);
                            },
                            drawCoord: (...args)=>{
                                this.drawCoord(...args);
                            },
                            addLights: (...args)=>{
                                this.addLights(...args);
                            },
                            addFloor: (...args)=>{
                                this.addFloor(...args);
                            }
                        }
                    
                        canvas.requestAnimationFrame(()=>{
                            this.render();
                        });

                        this.data.threejsApp = app;

                        resolve(app);
                    });
                });                
            });            
          },
        render() {
            if(!this.data.canvas || !this.data.threejsApp) return;
            this.data.canvas.requestAnimationFrame(()=>{
                this.render();
            });

            this.data.threejsApp.animations.forEach((cb)=>{
                cb && cb.call(this.data.threejsApp, time);
            });
            this.data.threejsApp.control.update();
            this.data.threejsApp.renderer.render( this.data.threejsApp.scene, this.data.threejsApp.camera );
        },
        canvastouchstart(e) {
            THREE.global.touchEventHandlerFactory('canvas', 'touchstart')(e)
          },
          canvastouchmove(e) {
            THREE.global.touchEventHandlerFactory('canvas', 'touchmove')(e)
          },
          canvastouchend(e) {
            THREE.global.touchEventHandlerFactory('canvas', 'touchend')(e)
          },
          canvastouchcancel(e) {
            THREE.global.touchEventHandlerFactory('canvas', 'touchcancel')(e)
          },
        // 添加光源
        addLights(scene=this.data.threejsApp.scene, option={}) {
            const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
            hemiLight.position.set(0, 50, 0);
            // Add hemisphere light to scene
            scene.add(hemiLight);

            const d = 800.25;
            const lightPosition = option.position || [-40, 40, 30];
            let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
            dirLight.position.set(...lightPosition);
            dirLight.castShadow = true;
            dirLight.shadow.mapSize = new THREE.Vector2(10240, 10240);
            dirLight.shadow.camera.near = 10;
            dirLight.shadow.camera.far = 15000;
            dirLight.shadow.camera.left = d * -1;
            dirLight.shadow.camera.right = d;
            dirLight.shadow.camera.top = d;
            dirLight.shadow.camera.bottom = d * -1;
            // Add directional Light to scene
            scene.add(dirLight);
        },

        // 添加一个地板
        addFloor(scene=this.data.threejsApp.scene, option={}) {
            // Floor
            const floorGeometry = new THREE.PlaneGeometry(option.width||100, option.height||100, option.widthSegments||300, option.heightSegments||300);
            const floorMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color(option.color||"#ccc"),
                wireframe: true,
                shininess: 0,
            });

            const floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
            floor.receiveShadow = true;

            option.position = option.position || {x:0, y: -11, z: 0};
            floor.position.x = option.position.x || 0;
            floor.position.y = option.position.y || 0;
            floor.position.z = option.position.z || 0;
            scene.add(floor);
        },

        // 加载3D模型
        loadObj(url, success, progress, traverse) {
            let loader = new GLTFLoader();
           // if(url.toLowerCase().includes('.fbx')) loader = new FBXLoader();
            //else loader = new GLTFLoader();

            loader.load(url, (obj) => {
                const model = (obj.scene||obj);
                // 使用模型的 traverse 方法遍历所有网格（mesh）以启用投射和接收阴影的能力。该操作需要在 scene.add(model) 前完成。
                model.traverse && model.traverse(o => {
                    if(traverse) traverse(o);
                    
                    if (o.isMesh) {
                        o.castShadow = true;
                        o.receiveShadow = true;
                        //o.material = stacy_mtl;
                    }
                });

                success && success(obj);
            }, (e)=>{
                progress && progress(e);
            }, (err) => {
                console.error(err);
            });
        },

        // 画坐标系
        drawCoord(position={
            x: 40,
            y: 0,
            z: 30
        }, size=5, scene=this.data.threejsApp.scene) {
            
            // x
            this.drawLines(scene, [position.x-size, position.y, position.z], [20, 0, 0], '#ff0000', 'X', size*2);
            // y
            this.drawLines(scene, [position.x, position.y-size, position.z], [0, 20, 0], '#00ff00', 'Y', size*2);
            // z
            this.drawLines(scene, [position.x, position.y, position.z-size], [0, 0, 20], '#0000ff', 'Z', size*2);
        },

        drawLines(scene, p1, p2, color, txt, size=5) {
            const point1 = new THREE.Vector3(...p1);
            const point2 = new THREE.Vector3(...p2);

            // 添加箭头
            const arrowLength = size;
            const arrowColor = new THREE.Color(color) || 0xffff00;
            const arrowHelper = new THREE.ArrowHelper(point2.normalize(), point1, arrowLength, arrowColor);
            scene.add(arrowHelper);

            //const m = drawText(txt, color);
            //m.position.set(...p1);
            //scene.add(m);
        }
    }
})