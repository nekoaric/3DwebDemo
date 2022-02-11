		
		const canvas = document.getElementById("renderCanvas"); // Get the canvas element
        const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
        // Add your code here matching the playground format

        const createScene = function(){
		    // Create a basic BJS Scene object
		    const scene = new BABYLON.Scene(engine);
		    
		    /** Lights*/
		    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
		    light.intensity = 0.6;
		    light.specular = BABYLON.Color3.Black();
		    var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
		    light2.position = new BABYLON.Vector3(0, 5, 5);
		    
		    
		    /**俯视图camera*/
		    const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 1, new BABYLON.Vector3(0, 0, 0));
		    camera.setPosition(new BABYLON.Vector3(0, 15, -40));
		    camera.zoomToMouseLocation = true ;
		    camera.wheelDeltaPercentage  = 0.01;
		    camera.lowerBetaLimit = null;
		    //防止入地
		    camera.upperBetaLimit = Math.PI / 2.2;
		    camera.lowerAlphaLimit = null;
		    camera.upperAlphaLimit = null;
		    //camera.minZ = 0.1;
		    //camera.useAutoRotationBehavior = true;
		    //camera.autoRotationBehavior.idleRotationSpeed = 0.05;
		    camera.setTarget(BABYLON.Vector3.Zero());
		     
		    
		    /** gamecamera
		    const camera1 = new BABYLON.UniversalCamera("FirstViewCamera", new BABYLON.Vector3(0, 10, -30), scene);
		    camera1.ellipsoid = new BABYLON.Vector3(0.3, 0.3, 0.3);
		    camera1.speed = 0.1;
		    scene.collisionsEnabled = true;
		    //camera1.checkCollisions = true;
		    //camera1.applyGravity = true;
		    //Controls  WASD
		    camera1.keysUp.push(87);
		    camera1.keysDown.push(83);
		    camera1.keysRight.push(68);
		    camera1.keysLeft.push(65);
		    camera1.keysUpward.push(32);
		    camera1.minZ = 0.1;
		    */
		    camera.attachControl(canvas, true);
		    
		    // Create the SSR post-process!
		    var ssr = new BABYLON.ScreenSpaceReflectionPostProcess("ssr", scene, 1.0, camera);
		    ssr.reflectionSamples = 32; // Low quality.
		    ssr.strength = 2; // Set default strength of reflections.
		    ssr.reflectionSpecularFalloffExponent = 3; // Attenuate the reflections a little bit. (typically in interval [1, 3])
		    
		    
		    /**镜面材质
		    var reflectionMaterial = new BABYLON.StandardMaterial("reflectionMaterial", scene);
		    reflectionMaterial.diffuseTexture = new BABYLON.Texture("/textures/Grass001_1K_Roughness.jpg", scene);
		    reflectionMaterial.diffuseTexture.uScale = 16;
		    reflectionMaterial.diffuseTexture.vScale = 16;
		    reflectionMaterial.specularTexture = new BABYLON.Texture("/textures/Grass001_1K_Roughness.jpg", scene);
		    reflectionMaterial.specularTexture.uScale = 8;
		    reflectionMaterial.specularTexture.vScale = 8;
		  
		    var refMat2 = reflectionMaterial.clone();
		    reflectionMaterial.alphaMode = 1;
		    reflectionMaterial.alpha = 0.2;
		    reflectionMaterial.roughness = 0.6;
		     */
		    //reflectionMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, true);
		    //reflectionMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, -2.0);
		    
		    //噪波发光材质
		    var emLightmat = new BABYLON.StandardMaterial("emLightmat", scene);
		    emLightmat.disableLighting = true;
		    emLightmat.backFaceCulling = false;
		    var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
		    noiseTexture.octaves = 7;
		    noiseTexture.persistence = 1.1;
		    noiseTexture.wrapU = 2 ;
    		noiseTexture.wrapV = 2 ;
    		//emLightmat.transparencyMode  = 2;
		    emLightmat.alphaMode = 1;
		    emLightmat.opacityTexture = noiseTexture;
		    emLightmat.emissiveTexture = noiseTexture;
		    //var plane = BABYLON.Mesh.CreatePlane("plane", 10.0, scene);
		    //plane.material =  emLightmat;
		    
			// Environment Texture
		    var hdrTexture = new BABYLON.HDRCubeTexture("hdr/greenwich_park_02_2k.hdr", scene, 512);

		    // Skybox
		    var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
		    var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
		    hdrSkyboxMaterial.backFaceCulling = false;
		    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
		    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
			hdrSkyboxMaterial.microSurface = 1.0;
			hdrSkyboxMaterial.cameraExposure = 0.66;
			hdrSkyboxMaterial.cameraContrast = 1.66;
		    hdrSkyboxMaterial.disableLighting = true;
		    hdrSkybox.material = hdrSkyboxMaterial;
		    hdrSkybox.infiniteDistance = true;
			// Create meshes
		    var sphereGlass = BABYLON.Mesh.CreatePlane("plane",{width:50, height:50}, scene);
		    
		    // Create materials
		    var glass = new BABYLON.PBRMaterial("glass", scene);
		    glass.reflectionTexture = hdrTexture;    
		    glass.indexOfRefraction = 0.52;
		    glass.alpha = 0.5;
		    glass.directIntensity = 0.0;
		    glass.environmentIntensity = 0.7;
		    glass.cameraExposure = 0.66;
		    glass.cameraContrast = 1.66;
		    glass.microSurface = 1;
		    glass.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
		    glass.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.95);
		    sphereGlass.material = glass;
		    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 64, height: 64 }, scene);
		    ground.material = glass;
		    //导入模型
		    //SceneLoader.ImportMesh("","/models/","factoryBuild2.gltf",this.scene);
		    //BABYLON.SceneLoader.Append("/models/", "fac_suzhou.glb", scene, function () {
			BABYLON.SceneLoader.ImportMeshAsync("","models/", "ocInflate.glb").then((result) =>{
		        // do something with the scene
		        //console.log(result);
		    	//const anim = scene.getAnimationGroupByName("wajueji_rigAction");
		    	//anim.start(true, 1.0, anim.from, anim.to, false);
		    	//const keyAnim = scene.getAnimationGroupByName("KeyAction");
		    	//keyAnim.start(true, 1.0, keyAnim.from, keyAnim.to, false);
		    	
		    	for (var i = 0; i < result.meshes.length; i++) {
				//console.log(result.meshes[i]);
	            	
	            		if(result.meshes[i].name.indexOf("mirror") !== -1){
						//result.meshes[i].material  = reflectionMaterial;
					} 
					
					if(result.meshes[i].name.indexOf("line") !== -1){
						//result.meshes[i].material  = emLightmat;
					} 
					if(result.meshes[i].name.indexOf("machine") !== -1){
						//result.meshes[i].material  = refMat2;
					} 
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

			//const machine_mat = scene.getMaterialByName ("machine_base");
		    	
		    	/** 启用碰撞
		    	const root = result.meshes[0] ;
			    const childMeshes = root.getChildMeshes() ;
			    for (let mesh of childMeshes) {
			        mesh.checkCollisions = true ;
			    }
				    	
			//阴影生成器
			var generator = new BABYLON.ShadowGenerator(512, light2);
			generator.useBlurExponentialShadowMap = true;
			generator.blurKernel = 32;

			for (var i = 0; i < result.meshes.length; i++) {
				//console.log(result.meshes[i]);
				//启用阴影
				generator.addShadowCaster(result.meshes[i]);    
			}
		        */
		    });
		    
		    /**反射地板
		    var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 64, height: 64 }, scene);
			ground.position.y = 0.1 ;
			ground.position.x = 30 ;
		    ground.material = reflectionMaterial;
		     
		     */
		    
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
		    
		    
		    /** 环境盒子
		    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:150}, scene);
		    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		    skyboxMaterial.backFaceCulling = false;
		    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/imgs/skybox", scene);
		    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		    skybox.material = skyboxMaterial;
		    */
		    
		    // Return the created scene
		    return scene;
		}
		
		var  scene = createScene();
		
		
		//create a fullscreen ui for all of our GUI elements
		const guiMenu = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
		guiMenu.idealHeight = 720; //fit our fullscreen ui to this height
		
		//create a simple button
		const startBtn = new BABYLON.GUI.Button.CreateSimpleButton("start", "PUMP");
		startBtn.width = 0.2;
		startBtn.height = "40px";
		startBtn.color = "white";
		startBtn.top = "-14px";
		startBtn.thickness = 0;
		startBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
		guiMenu.addControl(startBtn);
		
		function pumpMove(){
			const pump = scene.getAnimationGroupByName("PumpAction");
			const inflate = scene.getAnimationGroupByName("InflateAction");
			const rig = scene.getAnimationGroupByName("metarigAction");
			inflate.play(0);
			rig.play(0);
		    	pump.play(0);
			setTimeout(()=>{
				rig.pause();
				pump.pause();
			},"1500");
		}

		//this handles interactions with the start button attached to the scene
		startBtn.onPointerDownObservable.add(pumpMove());
		
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
		
		//模型点击事件
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
			//console.log(mesh);
			if(mesh.name.indexOf("pump") !== -1){
				pumpMove();
			} 
			
		}
	    
        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
				//scene.camera.rotation.z += 0.1;
                scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
                engine.resize();
        });
        
        	
