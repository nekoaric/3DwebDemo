		
		const canvas = document.getElementById("renderCanvas"); // Get the canvas element
        const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
        // Add your code here matching the playground format
        
        function vecToLocal(vector, mesh){
	        var m = mesh.getWorldMatrix();
	        var v = BABYLON.Vector3.TransformCoordinates(vector, m);
			return v;		 
	    }

        const createScene = function(){
		    // Create a basic BJS Scene object
		    const scene = new BABYLON.Scene(engine);
		    scene.clearColor = new BABYLON.Color4();
		    /** Lights*/
		    
		    var lightD = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, 1), scene);
		    lightD.position = new BABYLON.Vector3(0, 50, -100);
		    //反射黑色 
		    lightD.specular = BABYLON.Color3.Gray();
		    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
		    light.intensity = 0.1;
		    light.specular = BABYLON.Color3.Black();
		    
		    //var lightD2 = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
		    //lightD2.specular = BABYLON.Color3.Black();
		    
		    // Shadow generator
    		const shadowGenerator = new BABYLON.ShadowGenerator(1024, lightD);
		    //阴影    	
	        //lightD.shadowMinZ = 1
	        //lightD.shadowMaxZ = 60
	        lightD.autoCalcShadowZBounds = true
	     
	        //shadowGenerator.setDarkness(0.2);
	        shadowGenerator.filter = BABYLON.ShadowGenerator.FILTER_PCF;//?????????,????
	        // shadowGenerator.usePoissonSampling = true;
	        //shadowGenerator.useContactHardeningShadow = true;
	        // shadowGenerator.usePercentageCloserFiltering = true;//?????????,????
	        shadowGenerator.bias = 0.01
	        //shadowGenerator.getShadowMap().renderList = refList
		    /**俯视图camera  */
		    
		    //const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 1, new BABYLON.Vector3(0, 0, 0));
		     var camera = new BABYLON.ArcRotateCamera("camera0",-Math.PI/2-0.2, 1.2,7, null, scene, true);
		    //删除鼠标按键控制
		    camera.inputs.remove(camera.inputs.attached.keyboard);
    		//camera.inputs.remove(camera.inputs.attached.mousewheel);
		    camera.setPosition(new BABYLON.Vector3(3, 5, 3));
		    camera.zoomToMouseLocation = true ;
		    camera.wheelDeltaPercentage  = 0.01;
		    camera.lowerBetaLimit = 0;
		    //防止入地
		    camera.upperBetaLimit = Math.PI / 2.2;
		    //camera.lowerAlphaLimit = null;
		    //camera.upperAlphaLimit = null;
		    //camera.minZ = 0.1;
		    //camera.useAutoRotationBehavior = true;
		    //camera.autoRotationBehavior.idleRotationSpeed = 0.05;
		    //camera.setTarget(BABYLON.Vector3.Zero());
		   
		    /** gamecamera
		    const camera = new BABYLON.UniversalCamera("FirstViewCamera", new BABYLON.Vector3(0, 3, 3), scene);
		    //camera.ellipsoid = new BABYLON.Vector3(0.3, 0.3, 0.3);
		    camera.speed = 0.1;
		    //camera1.checkCollisions = true;
		    //Controls  WASD
		    //camera.keysUp.push(87);
		    //camera.keysDown.push(83);
		    //camera.keysRight.push(68);
		    //camera.keysLeft.push(65);
		    //camera.keysUpward.push(32);
		    camera.minZ = 0.1;
		    */
		    camera.attachControl(canvas, true);
		    
		    
		    /********************世界控制组 ********************/
		    //Set gravity for the scene (G force like, on Y-axis)
		    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
		
		    // Enable Collisions
		    scene.collisionsEnabled = true;
		
		    //相机碰撞体
		    //camera.checkCollisions = true;
		    //camera.applyGravity = true;
		    //Set the ellipsoid around the camera (e.g. your oc's size)
		    //camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);
		
		    /** 环境盒子*/
		    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:400}, scene);
		    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		    skyboxMaterial.backFaceCulling = false;
		    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("imgs/skybox", scene);
		    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		    skybox.material = skyboxMaterial;
		    
		    /** Create the SSR post-process!
		    var ssr = new BABYLON.ScreenSpaceReflectionPostProcess("ssr", scene, 1.0, camera);
		    ssr.reflectionSamples = 32; // Low quality.
		    ssr.strength = 2; // Set default strength of reflections.
		    ssr.reflectionSpecularFalloffExponent = 3; // Attenuate the reflections a little bit. (typically in interval [1, 3])
		     */
		     
		    /***************材质组******************* */
		    //高级渲染？？
		    var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
		    var curve = new BABYLON.ColorCurves();
		    curve.globalHue = 200;
		    curve.globalDensity = 80;
		    curve.globalSaturation = 80;
		    curve.highlightsHue = 20;
		    curve.highlightsDensity = 80;
		    curve.highlightsSaturation = -80;
		    curve.shadowsHue = 2;
		    curve.shadowsDensity = 80;
		    curve.shadowsSaturation = 40;
		    defaultPipeline.imageProcessing.colorCurves = curve;
		    defaultPipeline.depthOfField.focalLength = 150;
		    //辉光
	        defaultPipeline.bloomEnabled = true;
	        defaultPipeline.bloomKernel = 0.5;
	        defaultPipeline.bloomWeight = 0.5;
	        defaultPipeline.bloomThreshold = 0.5;
	        //defaultPipeline.bloomScale = value;

		    
		    //机器SSR镜面材质
		    var reflectionMaterial = new BABYLON.StandardMaterial("reflectionMaterial", scene);
		    reflectionMaterial.diffuseTexture = new BABYLON.Texture("textures/tex_floor.png", scene);
		    reflectionMaterial.diffuseTexture.uScale = 32;
		    reflectionMaterial.diffuseTexture.vScale = 32;
		    reflectionMaterial.specularTexture = new BABYLON.Texture("textures/tex_floor.png", scene);
		    reflectionMaterial.specularTexture.uScale = 32;
		    reflectionMaterial.specularTexture.vScale = 32;
		    
		    //地板半透SSR镜面材质
		    //var refMat2 = reflectionMaterial.clone();
		    //reflectionMaterial.alphaMode = 1;
		    //reflectionMaterial.alpha = 0.8;
		    //reflectionMaterial.roughness = 0.8;
		    reflectionMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, true);
		    reflectionMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, -2.0);
		    
		    //噪波发光材质
		    var emLightmat = new BABYLON.StandardMaterial("emLightmat", scene);
		    emLightmat.disableLighting = true;
		    emLightmat.backFaceCulling = false;
		    const noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
		    noiseTexture.octaves = 7;
		    noiseTexture.persistence = 1.1;
		    noiseTexture.wrapU = 2 ;
    		noiseTexture.wrapV = 2 ;
    		noiseTexture.brightness = 0;
    		//自发光材质
    		//emLightmat.transparencyMode  = 2;
		    emLightmat.alphaMode = 1;
		    emLightmat.opacityTexture = noiseTexture;
		    emLightmat.emissiveTexture = noiseTexture;
		    //var plane = BABYLON.Mesh.CreatePlane("plane", 10.0, scene);
		    //plane.material =  emLightmat;
		    //镜面材质：二次渲染 需要把物体加入list并重新渲染
		   // mirror.scaling = new BABYLON.Vector3(100.0, 0.01, 100.0);
		    var mirrormat = new BABYLON.StandardMaterial("mirror", scene);
		    mirrormat.diffuseTexture = new BABYLON.Texture("textures/tex_floor.png", scene);
		    mirrormat.reflectionTexture = new BABYLON.MirrorTexture("mirror", { ratio: 0.5 }, scene, true);
		    mirrormat.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -0.5, 0, -0.1);
		    mirrormat.reflectionTexture.renderList = refList;
		    mirrormat.reflectionTexture.level = 1.0;
        	mirrormat.reflectionTexture.adaptiveBlurKernel = 32;
		    //地面贴图
		    const groundMat = new BABYLON.StandardMaterial("ground",scene);
		    groundMat.diffuseColor = new BABYLON.Color3.Green();
		    groundMat.diffuseTexture = new BABYLON.Texture("textures/Grass001_1K_Color.jpg", scene);
		    groundMat.diffuseTexture.uScale = 10.0;
			groundMat.diffuseTexture.vScale = 10.0;
		    groundMat.bumpTexture = new BABYLON.Texture("textures/Grass001_1K_NormalDX.jpg", scene);
		    groundMat.bumpTexture.uScale = 10.0;
			groundMat.bumpTexture.vScale = 10.0;
			//墙面贴图
			const houseMat = new BABYLON.StandardMaterial("wall",scene);
		    houseMat.diffuseColor = new BABYLON.Color3.White();
		    houseMat.diffuseTexture = new BABYLON.Texture("textures/cubehouse.png", scene);
		    //镜面重新渲染组
		    var refList = [];
		    
		    //************************* */ui 组*******************
		    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
		    var guiText01 = new BABYLON.GUI.TextBlock("guiTextBlock01", "");
		    guiText01.color = "white";
		    guiText01.textHorizontalAlignment = BABYLON.GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
		    guiText01.textVerticalAlignment = BABYLON.GUI.TextBlock.VERTICAL_ALIGNMENT_TOP;
		    guiText01.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
		    guiText01.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
		    guiText01.fontFamily = "Courier New";
		    guiText01.fontSize = "15pt"; 
		    
		    advancedTexture.addControl(guiText01); 
		    
		    //************************* *功能元素组*******************
		    //射线接触组
		    var coicols = [];
		    
		    
		    
		    /***************模型组******************* */
		    //可站方块
		    var obstacles = [];
		    //事件方块
		    var eventTarget = [];
		    //const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:100, height:100});
		    //ground.material = groundMat;
		    //导入模型
		    //SceneLoader.ImportMesh("","models/","factoryBuild2.gltf",this.scene);
		    //碰撞发生https://playground.babylonjs.com/#KBS9I5#83
			//地形
			BABYLON.SceneLoader.ImportMeshAsync("","models/", "yard.glb").then((result) =>{
		        
		        //console.log(result);
		    	//const anim = scene.getAnimationGroupByName("wajueji_rigAction");
		    	//anim.start(true, 1.0, anim.from, anim.to, false);
		    	//const keyAnim = scene.getAnimationGroupByName("KeyAction");
		    	//keyAnim.start(true, 1.0, keyAnim.from, keyAnim.to, false);
		    	//shadowGenerator.addShadowCaster(result.meshes, true);
		    	defaultPipeline.imageProcessing.toneMappingEnabled = false;
			    for (var i = 0; i < result.meshes.length; i++) {
					//移动碰撞
					result.meshes[i].checkCollisions = true ;
					//站立碰撞
					coicols.push(result.meshes[i]);
					//refList.push(result.meshes[i]);
					//console.log(result.meshes[i]);
					// 地面接受阴影
					obstacles.push(result.meshes[i]);
					shadowGenerator.addShadowCaster(result.meshes[i], true);
	            	if(result.meshes[i].name.indexOf("ground") !== -1){
						//result.meshes[i].material  = reflectionMaterial;
						const ground = result.meshes[i];
						ground.material = groundMat;
						ground.receiveShadows = true;
					} 
					/**
					if(result.meshes[i].name.indexOf("line") !== -1  ){
						var lineMat = result.meshes[i].material  ;
						lineMat.emissiveColor = new BABYLON.Color3(0, 0.3, 0.4);
						lineMat.alphaMode = 1;
					    lineMat.opacityTexture = noiseTexture;
					    lineMat.emissiveTexture = noiseTexture;
					} 
					if(result.meshes[i].name.indexOf("point") !== -1  ){
						var pointMat = result.meshes[i].material ;
						pointMat.emissiveColor = new BABYLON.Color3(0, 0.3, 0.4);
					 
					}
					
					if(result.meshes[i].name.indexOf("machine") !== -1){
						//refList.push(result.meshes[i]);
						//var machineMat = result.meshes[i].material ;
						//machineMat.transparencyMode = 2;
					} 
					 */
		        }
		        
		       
		        /**
		        for (var i = 0; i < scene.animationGroups.length; i++) {
					console.log(scene.animationGroups[i]);
	            	keyAnim = scene.animationGroups[i];
		    		keyAnim.start(true, 1.0, keyAnim.from, keyAnim.to, false);
		        }
			     */
			    
			    scene.animationGroups.forEach(anima =>{
					anima.stop();
				})
			     
				
		    });
		    
		    //树
		    BABYLON.SceneLoader.ImportMeshAsync("","models/", "tree.glb").then((rs) => {
				var tree = rs.meshes[1];
				shadowGenerator.addShadowCaster(tree, true);
				tree.position = new BABYLON.Vector3(50.0, 0.00, 5.0);
				const trees = [];
			    //We create trees at random positions
			    for (let i = 0; i < 50; i++) {
			        trees[i] = tree.createInstance("tree" + i);
			        trees[i].position.x = Math.random() * (-90);
			        trees[i].position.z = Math.random() * 80 + 40;
			        trees[i].position.y = 0.5;
			        trees[i].checkCollisions = true ;
			        shadowGenerator.addShadowCaster(trees[i], true);
			    }
			});
			
			//角色碰撞块
			var oc = new BABYLON.MeshBuilder.CreateSphere("oc", {
	        diameterX: 1, 
	        diameterY: 2.5, 
	        diameterZ: 1});
		    oc.position = new BABYLON.Vector3(0, 1.3, 0);
		    oc.material = new BABYLON.StandardMaterial("playerMat", scene);
		    oc.material.emissiveColor = new BABYLON.Color4(0,0.8,0,1);
		    oc.material.wireframe = true;
		    oc.material.transparencyMode = 2;
		    oc.material. roughness = 1;
		    oc.material.alpha = 0;
		    
		    //角色
		    BABYLON.SceneLoader.ImportMeshAsync("","models/", "charater.glb").then((rs) => {
				scene.animationGroups.forEach(anima =>{
					anima.stop();
				})
				scene.meshes.forEach(mesh =>{
					mesh.isPickable =false ;
				})
				
				var oc_mesh = rs.meshes[0];
				//模型
				oc_mesh.position = new BABYLON.Vector3(0, -1.2, 0);
				oc_mesh.showBoundingBox = true;
				//将模型绑到碰撞块
				oc_mesh.parent = oc;
				
				oc.checkCollisions = true ;
				//按键位移
				oc.inputDirection = new BABYLON.Vector3(0,0,0);
				//鼠标操作旋转
			    oc.velocity = new BABYLON.Vector3(0,0,0);
			    oc.normal = new BABYLON.Vector3(0,1,0);
			    // state falling正在掉落 此时不能跳跃
			    oc.falling = true;
			    oc.climbing = false;
			    oc.sprinting = false;
			    oc.jump = false;
				
				/** 面朝方向发出接触射线用于判断交互  
				var origin = oc.position;
			    var forward = new BABYLON.Vector3(0,0,1);
			    //世界坐标和相对坐标转换		
			    forward = vecToLocal(forward, oc);
			    var direction = forward.subtract(origin);
			    direction = BABYLON.Vector3.Normalize(direction);
				oc.eventRay = new BABYLON.Ray(origin, direction, 0.9);
				var rayHelper = new BABYLON.RayHelper(oc.eventRay);
     			rayHelper.show(scene);
     			//互动射线
					var event = scene.pickWithRay(oc.eventRay);
					if (event.pickedMesh){
					    eventhit = event.pickedMesh.name;
					    if(eventhit.indexOf("door") !== -1  ){
							scene.getAnimationGroupByName("front doorAction.002").play(true);
						}
				    }
				*/
				var eventRay = new BABYLON.Ray();
				var rayHelper = new BABYLON.RayHelper(eventRay);
				rayHelper.attachToMesh(oc, new BABYLON.Vector3(0,0,1),new BABYLON.Vector3(0,0,0), 0.9);
				//eventRay.parent = oc ;
     			rayHelper.show(scene);
				
				//朝下发出接触射线用于判断落地
				oc.contactRay = new BABYLON.Ray(oc.position,new BABYLON.Vector3(0, -1.3, 0));
    			oc.contactRay.length = 0.9;
				
				camera.lockedTarget = oc;
		        oc.speed = 6;
		        oc.speedsprint = 12;
		        oc.jumpSpeed = 6;
				//正在动画flag
				var animating = true;
				//scene.beginAnimation(rs.skeletons[0], 0, 100, true, 1.0);
				const walkAnim = scene.getAnimationGroupByName("walk");
				const idleAnim = scene.getAnimationGroupByName("idle");
				const attackAnim = scene.getAnimationGroupByName("attack");
				const backAnim = scene.getAnimationGroupByName("back");
				const sprintAnim = scene.getAnimationGroupByName("sprint");
				const jumpAnim = scene.getAnimationGroupByName("jump");
		    	idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);
		    	/** Rendering loop (executed for everyframe)
		    		动画和物理后每一帧触发
		    	 */
		        scene.onBeforeRenderObservable.add(() => {
					//每一帧设置为未按
		            var keydown = false;
		            //Manage the movements of the character (e.g. position, direction)
		            if (inputMap["w"]||inputMap["a"]||inputMap["s"]||inputMap["d"]||inputMap["q"]) {
		                keydown = true;
		            }
		           
		            //持续按键才能播放的动画 按了有效键之后播放动画 
		            if (keydown) {
						//console.log(inputMap);
		                if (!animating&&!oc.falling) {
		                    
		                    if (inputMap["s"]) {
		                        //Walk backwards
		                        backAnim.start(true, 1.0, backAnim.from, backAnim.to, false);
		                        animating = true;
		                    }else if(inputMap["q"]){
		                        //持续性动画
		                       attackAnim.start(true, 1.0, attackAnim.from, attackAnim.to, false);
		                       setTimeout(()=>{animating = true},1500) ;
		                    }
		                    else {
								
		                        //Walk
		                        walkAnim.start(true, 1.0, walkAnim.from, walkAnim.to, false);
		                        animating = true;
		                    }
		                }
		            }
		            //松开按键后停止行走动画
		            else {
		                if (animating) {
		                    //Default animation is idle when no key is down  
		                    sprintAnim.stop();   
		                    walkAnim.stop();
		                    backAnim.stop();
		                    attackAnim.stop();
		                    idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, false);
		                    //Ensure animation are played only once per rendering loop
		                    animating = false;
		                }
		            }
		        });
		       
		        // user input --------------------------------------------------------------------------------------------------------------
			    scene.onKeyboardObservable.add((kbinfo) => {
					//console.log(kbinfo);
			        if(kbinfo.event.code == "KeyW") {
			            oc.inputDirection.z = kbinfo.event.type == "keydown" ? 1 : 0;
			        } else if(kbinfo.event.code == "KeyS") {
			            oc.inputDirection.z = kbinfo.event.type == "keydown" ? -1 : 0;
			        } else if(kbinfo.event.code == "KeyD") {
			            oc.inputDirection.x = kbinfo.event.type == "keydown" ? 1 : 0;
			        } else if(kbinfo.event.code == "KeyA") {
			            oc.inputDirection.x = kbinfo.event.type == "keydown" ? -1 : 0;
			        } else if(kbinfo.event.key == "Shift") {
			            oc.sprinting = kbinfo.event.type == "keydown" ? true : false;
						sprintAnim.start(true, 1.0, sprintAnim.from, sprintAnim.to, false);   
			            animating = true;
			        }  else if(kbinfo.event.code == "KeyQ") {
						
			        } else if(kbinfo.event.code == "Space" && !oc.falling) {
			            oc.jump = true;
			            jumpAnim.stop();
			            jumpAnim.start(false, 1.0, jumpAnim.from, jumpAnim.to, false);
			            setTimeout(()=>{animating = true},1500) ;   
			        }
    			});
    			
    			var cameraRay = new BABYLON.Ray(camera.position,camera.getForwardRay.direction,10000);
    			var cameraRayHelper = new BABYLON.RayHelper(cameraRay);
    			cameraRayHelper.attachToMesh(camera);
    			// main loop --------------------------------------------------------------------------------------------------------------
			    // engine.runRenderLoop(()=>{}) whats the difference?! besides its an unremovable callback(?)
			    engine.onBeginFrameObservable.add(() => {
					//清空状态栏
					guiText01.text = "";
			        var dt = engine.getDeltaTime() / 1000;
			
			        var externalPhysicalImpact = false;
			
			        var results = [];
			        //遁地返回起始点
			        if(oc.position.y <= -100){
						oc.position = new BABYLON.Vector3(0, 1, 0);
					} 
					
					//互动射线
					var eventInfo = eventRay.intersectsMeshes(obstacles);
					//console.log(eventMesh);
					var eventhitname = "";
			        if (eventInfo.length){
					    eventhitname = eventInfo[0].pickedMesh.name;
					    eventInfo[0].showBoundingBox = true ;
					    if(eventhitname.indexOf("door") !== -1  ){
							scene.getAnimationGroupByName("front doorAction.002").play(false);
						}
				    }
					
					//视角射线
					//TODO：相机扫描线 目标为玩家 扫描到屋顶时 屋顶消失
				    
					//var cameraRay = camera.getForwardRay(10000);
					//cameraRay.length = ;
					var rayhit = "";
					const hitInfo = cameraRay.intersectsMeshes(obstacles);
			        if (hitInfo.length){
						//console.log(hitInfo[0]);
					    rayhit = hitInfo[0].pickedMesh.name;
					    if(rayhit.indexOf("roof") !== -1  ){
							scene.getNodeByName("roof assembly").setEnabled(false);
						}else {
							scene.getNodeByName("roof assembly").setEnabled(true);
						}
					}
								
			        //用射线判断触碰
			    	const pick = oc.contactRay.intersectsMeshes(obstacles,false,results);
			        if (results.length>0) {
						//落地
			            oc.falling = false;
			            oc.normal = results[0].getNormal();
			
			            if (results[0].pickedMesh.name == "trampoline") {
			                oc.velocity.y = 10;
			                externalPhysicalImpact = true;
			            }
			        } else {
			            oc.falling = true;
			        }
			 
			        if (oc.jump) {
			            oc.jump = false;
			            oc.falling = true;
			            oc.velocity.y = oc.jumpSpeed;
			        }
			
			        // copy rotation from camera orientation if camera was turned and oc is about to be moved ---------------
			        if(oc.inputDirection.length() > 0.1){
			        	oc.rotation.y = Math.PI/2 - camera.alpha + Math.PI; 
			        }
			
			        // input form oc + pyhsical interaction -----------------------------------------------------------------
			        const velocityIntended = oc.inputDirection.normalize()
			            .scale(
			                oc.sprinting ? oc.speedsprint : oc.speed);
			
			        // combine kinematic impacts such as gravity ----------------------------------------------------------------
			        const velocityPhysics =  new BABYLON.Vector3(0,0,0);
			        //下落
			        if (oc.falling || externalPhysicalImpact) {
			            velocityPhysics.y = oc.velocity.y - 9.81 * dt;
			            oc.velocity.y = velocityPhysics.y;
			        } 
			
			        const toWorld = new BABYLON.Matrix.RotationYawPitchRoll(oc.rotation.y,0,0); 
			        
			        const moveCombined = velocityPhysics.add(
			            BABYLON.Vector3.TransformCoordinates(velocityIntended, toWorld));
			
			        // move the oc based on input + physics
			        oc.moveWithCollisions(moveCombined.scale(dt));
					
					guiText01.text += "Falling           : "+ oc.falling + "\n";
			        guiText01.text += "Climbing          : "+ oc.climbing + "\n";
			        guiText01.text += "Sprinting         : "+ oc.sprinting + "\n";
			        guiText01.text += "Jump              : "+ oc.jump + "\n";
			        guiText01.text += "looking           : "+ rayhit + "\n";
			        guiText01.text += "event           : "+ eventhitname + "\n";
			        
			        if(results.length>0) {
			            guiText01.text += "Raycast Results   : "+ results.length + " \n";
			            guiText01.text += "Standing on       : "+ results[0].pickedMesh.name + "\n";
			        }
			    });
		        
		    });
		    
		    /**控制组 */
		    // Keyboard events
		    var inputMap = {};
		    scene.actionManager = new BABYLON.ActionManager(scene);
		    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
		        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
		    }));
		    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
		        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
		    }));
		    
		    //隐藏鼠标
		    scene.onPointerDown = evt => {
		        scene.getEngine().enterPointerlock();
		    }
		    
		    /**拉进动画
		    //动画集合
		    const animations = [];
		    const animCam = new BABYLON.Animation("camAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3);
		    //定义帧位置
	        animCam.setKeys([
				{frame: 0,value: new BABYLON.Vector3(-50, 20, 100)},
				{frame: 60,value: new BABYLON.Vector3(5, 5, 10)},
			]);
			animations.push(animCam);
	        scene.beginDirectAnimation(camera,animations, 0, 60, false);
		     
		    
		    */
		    
		    
		    
		    /**2D gui
		    
		    
		    
			const guiMenu = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
			var panel = new BABYLON.GUI.StackPanel();
			guiMenu.addControl(panel);
			panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
			const startBtn = new BABYLON.GUI.Button.CreateSimpleButton("start", "实体");
			const ChaMatBtn = new BABYLON.GUI.Button.CreateSimpleButton("changeMat", "虚化");
			startBtn.width = 0.2;
			startBtn.height = "40px";
			startBtn.color = "white";
			startBtn.top = "14px";
			startBtn.thickness = 0;
			
			ChaMatBtn.width = 0.2;
			ChaMatBtn.height = "40px";
			ChaMatBtn.color = "white";
			ChaMatBtn.top = "34px";
			ChaMatBtn.thickness = 0;
			panel.addControl(startBtn);
			panel.addControl(ChaMatBtn);
			*/
			/** 添加滑动控制条
			
			addSlider("速度", noiseTexture.animationSpeedFactor, -20, 20, (value) => {
		        noiseTexture.animationSpeedFactor = value;
		    });        
		    
		     addSlider("亮度", noiseTexture.brightness, 0, 1, (value) => {
		        noiseTexture.brightness = value;
		    });
			*/	
			var addSlider = function(title, value, min, max, onChange, isInteger) {
		        var header = new BABYLON.GUI.TextBlock();
		        header.text = title + ": " + (isInteger ? value | 0 : value.toFixed(2));
		        header.height = "30px";
		        header.color = "white";
		        panel.addControl(header); 
		    
		        var slider = new BABYLON.GUI.Slider();
		        slider.minimum = min;
		        slider.maximum = max;
		        slider.value = value;
		        slider.height = "20px";
		        slider.width = "200px";
		        slider.onValueChangedObservable.add(function(value) {
			            header.text = title + ": " + (isInteger ? value | 0 : value.toFixed(2));
			            onChange(value);
			    
			        });
		        panel.addControl(slider);    
		    }
		   
			
			
			/**physical
			var box = BABYLON.MeshBuilder.CreateBox("box", {width: 10, depth: 10, height:5}, scene);
			box.position.y = 10;
			box.position.x = 30;
		    box.forceSharedVertices();
		    box.increaseVertices(5);
		
		    shadowGenerator.addShadowCaster(box);
			
		    var softBoxOptions = {
		        mass: 15,
		        friction: 0.1,
		        restitution: 1,
		        pressure: 10500,
		        velocityIterations: 10, 
		        positionIterations: 10,
		        stiffness: 0.1,
		        damping: 0.05
		    }
		
		    scene.enablePhysics(null, new BABYLON.AmmoJSPlugin());
		
		    box.physicsImpostor =  new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.SoftbodyImpostor, softBoxOptions, scene);
		    
			var ground = BABYLON.MeshBuilder.CreateBox("ground", {width: 80, depth: 80, height:1}, scene);
		
		    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0 }, scene);
						 
		     */
						 
			/** button evenet this handles interactions with the start button attached to the scene
			startBtn.onPointerDownObservable.add(() => {
			    scene.getMaterialByName("machine_base").alpha = 1;
			});
			ChaMatBtn.onPointerDownObservable.add(() => {
			    scene.getMaterialByName("machine_base").alpha = 0.2;
			});
			 */
		    scene.meshes.forEach(mesh =>{
					mesh.checkCollisions = true;
				})
			
			   
		    

		    return scene;
		}
		
		var  scene = createScene();
		
		/**按钮点击事件
		const changeMat = () =>{
			scene.materials.forEach(mat =>{
				if(mat.name.indexOf("machine") !== -1  ){
						 mat = emLightmat ;
					}
			})
			
		} */
		
		 
		/** Create the 3D UI manager
	    var manager = new BABYLON.GUI.GUI3DManager(scene);
	    var panel = new BABYLON.GUI.StackPanel3D();
	   
	    panel.margin = 0.2;
	    manager.addControl(panel);
	    panel.position = new BABYLON.Vector3(0, 4, 0)  ; 
	    var button1 = new BABYLON.GUI.HolographicButton("start",);
	    button1.text = "实体" ;
	    var button2 = new BABYLON.GUI.HolographicButton("changeMat" );
	    button2.text = "虚化" ;
	    panel.addControl(button1);
	    panel.addControl(button2);
	    
		
		//this handles interactions with the start button attached to the scene
		button1.onPointerDownObservable.add(() => {
		    scene.getMaterialByName("machine_base").alpha = 1;
		});
		button2.onPointerDownObservable.add(() => {
		    scene.getMaterialByName("machine_base").alpha = 0.2;
		});
		 */
		
		
		/**TODO: 场景debug
		// hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey  && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });
		*/
		
		/**模型点击事件
		let switched = false;  //on off flag

		scene.onPointerObservable.add((pointerInfo) => {            
		    switch (pointerInfo.type) {
		        case BABYLON.PointerEventTypes.POINTERDOWN:
		            if(pointerInfo.pickInfo.hit) {
		                pointerDown(pointerInfo.pickInfo.pickedMesh);
		            }
		        break;
		    }
		});
		 
		const pointerDown = (mesh) => {
			console.log(mesh);
		}
		*/
		scene.debugLayer.show({ showExplorer: true });
	    
        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
				//scene.camera.rotation.z += 0.1;
                scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
                engine.resize();
        });
        
        	