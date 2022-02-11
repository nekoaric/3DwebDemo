		
		const canvas = document.getElementById("renderCanvas"); // Get the canvas element
        const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
        // Add your code here matching the playground format

        const createScene = function(){
		    // Create a basic BJS Scene object
		    const scene = new BABYLON.Scene(engine);
		    
		    /**俯视图camera
		    const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 1, new BABYLON.Vector3(0, 0, 0));
		    camera.setPosition(new BABYLON.Vector3(0, 15, -40));
		    camera.zoomToMouseLocation = true ;
		    camera.wheelDeltaPercentage  = 0.05;
		    camera.lowerBetaLimit = null;
		    //防止入地
		    camera.upperBetaLimit = Math.PI / 2.2;
		    camera.lowerAlphaLimit = null;
		    camera.upperAlphaLimit = null;
		    camera.minZ = 0.1;
		    camera.useAutoRotationBehavior = true;
		    camera.autoRotationBehavior.idleRotationSpeed = 0.05;
		    camera.setTarget(BABYLON.Vector3.Zero());
		     */
		    
		    //gamecamera
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
		    
		    camera1.attachControl(canvas, true);
		   
		    
		BABYLON.SceneLoader.ImportMeshAsync("","", "jackle.gltf").then((result) =>{
		        // do something with the scene
		        //console.log(result);
		    	const anim = scene.getAnimationGroupByName("wajueji_rigAction");
		    	anim.start(true, 1.0, anim.from, anim.to, false);
		    	const keyAnim = scene.getAnimationGroupByName("KeyAction");
		    	keyAnim.start(true, 1.0, keyAnim.from, keyAnim.to, false);
		    	
		    	//启用碰撞
		    	const root = result.meshes[0] ;
			    const childMeshes = root.getChildMeshes() ;
			    for (let mesh of childMeshes) {
			        mesh.checkCollisions = true ;
			    }
					    	
		    });
		    /**拉进动画
		    //动画集合
		    const animations = [];
		    const animCam = new BABYLON.Animation("camAnimation", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3);
		    //定义帧位置
	        animCam.setKeys([
				{frame: 0,value: new BABYLON.Vector3(-100, 40, -200)},
				{frame: 120,value: new BABYLON.Vector3(0, 10, -30)},
			]);
			animations.push(animCam);
	        scene.beginDirectAnimation(camera,animations, 0, 120, false);
		     */
		    
		    
		    //TODO:替换材质
		    const whiteMat = new BABYLON.StandardMaterial("whiteMat");
			whiteMat.diffuseColor = new BABYLON.Color3.White();
			const picMat = new BABYLON.StandardMaterial("picMat");
			picMat.diffuseTexture = new BABYLON.Texture("/imgs/skybox_nx.jpg");
		    
		    /** Lights*/
		    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
		    light.intensity = 0.6;
		    light.specular = BABYLON.Color3.Black();
		    var light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
		    light2.position = new BABYLON.Vector3(0, 5, 5);
		    
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
		const startBtn = new BABYLON.GUI.Button.CreateSimpleButton("start", "PLAY");
		startBtn.width = 0.2;
		startBtn.height = "40px";
		startBtn.color = "white";
		startBtn.top = "-14px";
		startBtn.thickness = 0;
		startBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
		guiMenu.addControl(startBtn);
		
		//this handles interactions with the start button attached to the scene
		startBtn.onPointerDownObservable.add(() => {
		    //this._goToCutScene();
		   // scene.detachControl(); //observables disabled
		});
		
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
			console.log(mesh);
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
        
        	
