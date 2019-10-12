<template>
	<div  style="width:100%;height:100%">
		<div  class="loginWrapper" id="starry-frame">
		</div>
		<div class="loginInput">
			<div class="title">3D调试系统</div>
			<el-form :model="form" ref="form" :rules="rules">
				<el-form-item prop="userName">
					<el-input placeholder="用户名" v-model="form.userName" clearable></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input placeholder="密码" type="password" v-model="form.password" clearable style="margin-top:20px;" @keyup.enter.native="loginFun('form')"></el-input>
				</el-form-item>
			</el-form>
			<el-button type="primary" class="submitBtn" @click="submit('form')">登录</el-button>
		</div>
	</div>
</template>

<script>
	import api from "../common/api.js";
	import Vue from "vue";
	import { Message, MessageBox } from 'element-ui'
	var camera, scene, renderer;
	var mesh;
	export default {
		name: 'Header',
		data() {
			return {
				form: {
					userName: '',
					password: '',
				},
				rules: {
					userName: [{
						required: true,
						message: '请输入必填项',
						trigger: 'blur'
					}, ],
					password: [{
						required: true,
						message: '请输入必填项',
						trigger: 'blur'
					}, ]

				}
			}
		},
		methods: {
			loginFun(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let req = {
							account: this.form.userName,
							password: this.form.password
						}
						api.post(api.getUrl('login'), req).then(res => {
							if(res.code == '0000') {
								sessionStorage.setItem('userName', res.content.name)
								sessionStorage.setItem('token', res.content.token)
								this.$router.push("/ObjManagement")
							} else {
								MessageBox.alert(res.desc, '提示')
							}
						}).catch(() => {
							console.log("系统异常")
						})
					} else {
						console.log(valid)
						console.log('error submit!!');
						return false;
					}
				});
			},
			submit(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						let req = {
							account: this.form.userName,
							password: this.form.password
						}
						api.post(api.getUrl('login'), req).then(res => {
							if(res.code == '0000') {
								sessionStorage.setItem('userName', res.content.name)
								sessionStorage.setItem('token', res.content.token)
								this.$router.push("/ObjManagement")
							} else {
								MessageBox.alert(res.desc, '提示')
							}
						}).catch(() => {
							console.log("系统异常")
						})
					} else {
						console.log(valid)
						console.log('error submit!!');
						return false;
					}
				});

			}
		},
		mounted() {
// 渲染器
	    var renderer = null;
	    // 相机
	    var camera = null;
	    // 场景
	    var scene = null;
	    // 中心球体（太阳）
	    var centerBall = null;
	    // 中心球体轨道组合体（行星）
	    var starLites = [];
	    // 包裹画布dom
	    var dom = document.getElementById("starry-frame");
	    // orbitcontrols对象参数
	    var orbitcontrols = null;
	    /**
	     * 返回行星轨道的组合体
	     * @param starLiteSize 行星的大小
	     * @param starLiteRadius 行星的旋转半径
	     * @param rotation 行星组合体的x,y,z三个方向的旋转角度
	     * @param speed 行星运动速度
	     * @param imgUrl 行星的贴图
	     * @param scene 场景
	     * @returns {{satellite: THREE.Mesh, speed: *}} 卫星组合对象;速度
	     */
	    var initSatellite = function (starLiteSize, starLiteRadius, rotation, speed, imgUrl, scene) {
	        var track = new THREE.Mesh(new THREE.RingGeometry(starLiteRadius, starLiteRadius + 0.05, 50, 1), new THREE.MeshBasicMaterial());
	        var centerMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 1, 1), new THREE.MeshLambertMaterial()); //材质设定
	        var starLite = new THREE.Sprite(new THREE.SpriteMaterial({
	        	map: THREE.ImageUtils.loadTexture(imgUrl)
	        }));
	        starLite.scale.x = starLite.scale.y = starLite.scale.z = starLiteSize;
	        starLite.position.set(starLiteRadius, 0, 0);
	 
	        var pivotPoint = new THREE.Object3D();
	        pivotPoint.add(starLite);
	        pivotPoint.add(track);
	        centerMesh.add(pivotPoint);
	        centerMesh.rotation.set(rotation.x, rotation.y, rotation.z);
	        centerMesh.position.set(-100,0,0)
	        scene.add(centerMesh);
	        return {starLite: centerMesh, speed: speed};
	    };
	 
	    /**
	     * 实现球体发光
	     * @param color 颜色的r,g和b值,比如：“123,123,123”;
	     * @returns {Element} 返回canvas对象
	     */
	    var generateSprite = function (color) {
	        var canvas = document.createElement('canvas');
	        canvas.width = 16;
	        canvas.height = 16;
	        var context = canvas.getContext('2d');
	        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
	        gradient.addColorStop(0, 'rgba(' + color + ',1)');
	        gradient.addColorStop(0.2, 'rgba(' + color + ',1)');
	        gradient.addColorStop(0.4, 'rgba(' + color + ',.6)');
	        gradient.addColorStop(1, 'rgba(0,0,0,0)');
	        context.fillStyle = gradient;
	        context.fillRect(0, 0, canvas.width, canvas.height);
	        return canvas;
	    };
	    // 执行函数
	    var render = function () {
	        renderer.render(scene, camera);
	        centerBall.rotation.y -= 0.01;
	        for (var i = 0; i < starLites.length; i++) {
	            starLites[i].starLite.rotation.z -= starLites[i].speed;
	        }
	    	orbitcontrols.update();
	        requestAnimationFrame(render);
	    }
	    // 初始化函数
	    var initThree = function () {
	        // 初始化场景
	        scene = new THREE.Scene();
	        // 初始化相机
	        camera = new THREE.PerspectiveCamera(35, dom.clientWidth / dom.clientHeight, 1, 10000);
	        // 设置相机位置
	        camera.position.set(0, 0, 500);
	        renderer = new THREE.WebGLRenderer({
	            alpha: true,
	            antialias: true
	        });
	        // 设置窗口尺寸
	        renderer.setSize(dom.clientWidth, dom.clientHeight);
	        // 初始化控制器
	        orbitcontrols = new THREE.OrbitControls(camera,renderer.domElement);
	        dom.appendChild(renderer.domElement);
	        // 定义太阳材质
	        var sunTexture = THREE.ImageUtils.loadTexture('../../static/textures/sun_bg.jpg', {}, function () {
	            renderer.render(scene, camera);
	        });
	        // 太阳以及太阳材质设定
	        centerBall = new THREE.Mesh(new THREE.SphereGeometry(40, 40, 40), new THREE.MeshBasicMaterial({
	            map: sunTexture
	        }));
	        // 添加太阳发光效果
	        var centerBallLite = new THREE.Sprite(new THREE.SpriteMaterial({
	            map: new THREE.CanvasTexture(generateSprite('253,111,7')),
	            blending: THREE.AdditiveBlending
	        }));
	        centerBallLite.scale.x = centerBallLite.scale.y = centerBallLite.scale.z = 90;
	        scene.add(centerBallLite);
	         centerBallLite.position.set(-100,0,0)
	          centerBall.position.set(-100,0,0)
	        scene.add(centerBall);
	        //添加水星
	        starLites.push(initSatellite(2, 34, {x: -Math.PI * 0.42, y: Math.PI * 0.02, z: 0}, 0.02, '../../static/textures/mercury_bg.png', scene));
	        //添加金星
	        starLites.push(initSatellite(3, 38, {x: -Math.PI * 0.42, y: Math.PI * 0.02, z: 0}, 0.018, '../../static/textures/venus_bg.png', scene));
	        //添加地球
	        starLites.push(initSatellite(3.2, 42.2, {x: -Math.PI * 0.42, y: Math.PI * 0.02, z: 0}, 0.016, '../../static/textures/earth_bg.png', scene));
	        //添加火星
	        starLites.push(initSatellite(2.5, 47.1, {x: -Math.PI * 0.42, y: Math.PI * 0.02, z: 0}, 0.014, '../../static/textures/spark_bg.png', scene));
	        //添加木星
	        starLites.push(initSatellite(35, 71, {x: -Math.PI * 0.42, y: Math.PI * 0.02, z: 0}, 0.012, '../../static/textures/jupiter_bg.png', scene));
	        //添加土星
	        starLites.push(initSatellite(45, 110, {x: -Math.PI * 0.42, y: Math.PI * 0.02, z: 0}, 0.01, '../../static/textures/saturn_bg.png', scene));
	        //添加天王星
	        starLites.push(initSatellite(17, 158, {x: -Math.PI * 0.42, y: Math.PI * 0.02, z: 0}, 0.008, '../../static/textures/uranus_bg.png', scene));
	        //添加海王星
	        starLites.push(initSatellite(15, 188, {x: -Math.PI * 0.42, y: Math.PI * 0.02, z: 0}, 0.006, '../../static/textures/neptune_bg.png', scene));
	        
	        render();
	    }
	    
	    // 页面资源加载完全执行函数
//	    window.onload = function () {
//	    	console.log('hhhhhhhhhhhhhhhhhhhhh')
//	    	initThree()
//	    	//aceInitFun()
//	    }
	    // 窗口resize事件
	    window.onresize = function () {
	    	// 重新初始化尺寸
	        camera.aspect = dom.clientWidth / dom.clientHeight
	        camera.updateProjectionMatrix()
	        renderer.setSize(dom.clientWidth, dom.clientHeight)
	    }
	    initThree()
		},
	}
</script>

<style lang="scss">
	.loginWrapper {
		width: 100%;
		height: 100%;
		background: url(../image/login/bg.jpg) no-repeat center center;
		background-size: cover;
	}
	
	.loginInput {
		position: absolute;
		right: 5%;
		top: 40%;
		width: 320px;
		margin: -150px 0 0 -190px;
		padding: 40px;
		border-radius: 22px;
		background: #fff;
		border: 1px #d7edff solid;
		border-radius: 5px;
		margin: 0px 0px 7px 0px;
		box-shadow: 5px 5px 10px gray;
		/* 标准的语法（必须放在最后） */
		input {
			height: 45px;
			width:320px!important;
			}
		.title {
			text-align: center;
			font-size: 30px;
			color: #95989a;
			margin-bottom: 20px;
		}
		.submitBtn {
			width: 80%;
			display: block;
			margin: 20px auto 0;
		}
	}
</style>