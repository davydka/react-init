Math.PHI = (Math.sqrt(5) + 1) / 2 - 1;

Math.Golden = Math.PHI * (Math.PI + Math.PI);

var app = {};

(function() {

	app.settings = {
		// lg_rad: 100,
		// lg_area: (this.lg_rad * this.lg_rad) * Math.PI,

		sm_area: 10000,
		sm_rad: Math.sqrt(this.sm_area / Math.PI),

		// fudge: .87,
		// fudge: .4,
		// adj_sm_diameter: this.sm_rad * 2 * this.fudge,

		total: 500
	}

	app.colours = [
		0xa1803d, //gold
		0x00a2dd, //baby blue
		0xdccae2, //lilac
		// 0xfdf066, //yellow
		0x132843, //navy
		0xcfebf7, //lightblue
		0xf5faf3, //off-white
		0x4d6782 //blue gray
	];

	app.objects = [];

	app.init = function() {

		scene = new THREE.Scene();
		app.camera();
		app.lights();
		app.build();
		app.scenery();
		app.action();
		app.animate();

		window.addEventListener('resize', app.onWindowResize, false);
	}

	app.camera = function() {
		app.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
		app.camera.position.z = 1500;
		app.camera.position.x = 3000;
		app.camera.position.y = 1400;

		controls = new THREE.TrackballControls(app.camera);
		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.2;
		controls.panSpeed = 0.8;
		controls.noZoom = false;
		controls.noPan = true;
		controls.staticMoving = true;
		controls.dynamicDampingFactor = 0.3;
	}


	app.lights = function() {

		scene.fog = new THREE.FogExp2( 0x515150, 0.0003 );

		scene.add(new THREE.AmbientLight(0x505050, 0.9));

		lightrig = new THREE.Object3D();

		light = new THREE.SpotLight(0xffffff, 1.3);
		light.position.set(0, 2000, 4000);
		light.castShadow = true;

		light.shadowCameraNear = 200;
		light.shadowCameraFar = app.camera.far;
		light.shadowCameraFov = 60;

		light.shadowBias = -0.00022;

		light.shadowDarkness = 0.5;

		light.shadowMapWidth = 2048;
		light.shadowMapHeight = 2048;

		// light.shadowCameraVisible = true;

		lightrig.add(light);

		scene.add(lightrig);

	}
	app.hut = function(i) {

		hut = new THREE.Object3D();


		// var body = function(){

		shape = new THREE.Shape();

		shape.moveTo(0, 0);
		shape.lineTo(0, 50);
		if(i > 100){
			
			if (Math.random() > 0.5) {
			shape.lineTo(25, 75);
		}
		}
		shape.lineTo(50, 50);
		shape.lineTo(50, 0);
		shape.lineTo(0, 0);



		extrudeSettings = {
			amount: 100,
			bevelEnabled: false
		};

		geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

		geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-25, 0, -50));

		rand = Math.floor(Math.random() * app.colours.length);

		object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
			//color: app.colours[rand]
			color: 0x666666
		}));

		object.material.ambient = object.material.color;

		object.castShadow = true;
		object.receiveShadow = true;

		if(i < 100){

			object.scale.y = Math.random() * (10 * ((app.settings.total - i) / 500));
		} else {
			// object.scale.x = Math.random() * 1 + 0.5;
			// object.scale.y = Math.random() * 1 + 0.5 + ((app.settings.total - i) / 200);
			object.scale.z = Math.random() * 1 + 0.5;
		}
		// return object;
		// }
		hut.add(object);
		return hut;
	}

	app.tree = function() {
		tree = new THREE.Object3D();

		// shape = new THREE.Shape();

		// shape.moveTo(0, 0);
		// shape.lineTo(0, 50);
		// if (Math.random() > 0.5) {
		// 	shape.lineTo(25, 75);
		// }
		// shape.lineTo(50, 50);
		// shape.lineTo(50, 0);
		// shape.lineTo(0, 0);

		// shape = app.treeShape(50);

		// shape.computeLineDistances();



		// tree = new THREE.Line(shape, new THREE.LineDashedMaterial({
		// 	color: 0xffffff,
		// 	dashSize: 5,
		// 	gapSize: 5
		// }), THREE.LineStrip);

		material = new THREE.MeshLambertMaterial({
			color: app.colours[1]
		});

		material.side = THREE.DoubleSide;

		trunk = new THREE.Mesh(new THREE.PlaneGeometry(10, 50), material);

		trunk.applyMatrix(new THREE.Matrix4().makeTranslation(0, 25, 0));

		trunk.castShadow = true;
		trunk.receiveShadow = true;

		tree.add(trunk);

		leaves = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), material);

		leaves.applyMatrix(new THREE.Matrix4().makeTranslation(0, 50, 0));


		leaves.castShadow = true;
		leaves.receiveShadow = true;

		tree.add(leaves);

		return tree;
	}

	// app.treeShape = function(size) {

	// 	var h = size * 0.5;

	// 	var geometry = new THREE.Geometry();

	// 	geometry.vertices.push(new THREE.Vector3(-h, -h, -h));
	// 	geometry.vertices.push(new THREE.Vector3(-h, h, -h));

	// 	geometry.vertices.push(new THREE.Vector3(-h, h, -h));
	// 	geometry.vertices.push(new THREE.Vector3(h, h, -h));

	// 	geometry.vertices.push(new THREE.Vector3(h, h, -h));
	// 	geometry.vertices.push(new THREE.Vector3(h, -h, -h));

	// 	geometry.vertices.push(new THREE.Vector3(h, -h, -h));
	// 	geometry.vertices.push(new THREE.Vector3(-h, -h, -h));


	// 	geometry.vertices.push(new THREE.Vector3(-h, -h, h));
	// 	geometry.vertices.push(new THREE.Vector3(-h, h, h));

	// 	geometry.vertices.push(new THREE.Vector3(-h, h, h));
	// 	geometry.vertices.push(new THREE.Vector3(h, h, h));

	// 	geometry.vertices.push(new THREE.Vector3(h, h, h));
	// 	geometry.vertices.push(new THREE.Vector3(h, -h, h));

	// 	geometry.vertices.push(new THREE.Vector3(h, -h, h));
	// 	geometry.vertices.push(new THREE.Vector3(-h, -h, h));

	// 	geometry.vertices.push(new THREE.Vector3(-h, -h, -h));
	// 	geometry.vertices.push(new THREE.Vector3(-h, -h, h));

	// 	geometry.vertices.push(new THREE.Vector3(-h, h, -h));
	// 	geometry.vertices.push(new THREE.Vector3(-h, h, h));

	// 	geometry.vertices.push(new THREE.Vector3(h, h, -h));
	// 	geometry.vertices.push(new THREE.Vector3(h, h, h));

	// 	geometry.vertices.push(new THREE.Vector3(h, -h, -h));
	// 	geometry.vertices.push(new THREE.Vector3(h, -h, h));

	// 	return geometry;

	// }

	app.build = function() {

		group = new THREE.Object3D();

		for (var i = 1; i < app.settings.total; i++) {

			if (Math.random() > 1) {
				object = new app.tree();
			} else {
				object = new app.hut(i);
			}

			angle = i * Math.Golden;
			cum_area = i * app.settings.sm_area;
			spiral_rad = Math.sqrt(cum_area / Math.PI) + (i * 2);

			x = Math.cos(angle) * spiral_rad;
			z = Math.sin(angle) * spiral_rad;
			object.position.x = x;
			object.position.z = z;

			// object.rotation.y = angle*2;

			object.rotation.y = Math.random() * 3;

			// object.scale.x = Math.random() * 1 + 0.5;
			// object.scale.y = Math.random() * 1 + 0.5 + ((app.settings.total - i) / 200);
			// object.scale.z = Math.random() * 1 + 0.5;

			group.add(object);

			app.objects.push(object);

			// arrow = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 500, 0xff0000 );
			// arrow.position.x = x;
			// arrow.position.z = z;
			// scene.add( arrow );

		}
		scene.add(group);
	}

	app.scenery = function() {

		material = new THREE.MeshBasicMaterial({
			color: 0x515150
		});

		ground = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000), material);
		ground.position.y = 0;
		ground.rotation.x = -Math.PI / 2;
		ground.receiveShadow = true;
		ground.castShadow = true;

		scene.add(ground);

	}

	app.action = function() {

		projector = new THREE.Projector();

		renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setClearColor(0x515150);

		renderer.sortObjects = false;
		renderer.setSize(window.innerWidth, window.innerHeight);

		renderer.shadowMapEnabled = true;
		//renderer.shadowMapType = THREE.PCFShadowMap;

		renderer.shadowMapSoft = true;


		container = document.createElement('div');
		document.body.appendChild(container);

		container.appendChild(renderer.domElement);

		// stats = new Stats();
		// stats.domElement.style.position = 'absolute';
		// stats.domElement.style.top = '0px';
		// container.appendChild(stats.domElement);

	}

	app.onWindowResize = function() {

		app.camera.aspect = window.innerWidth / window.innerHeight;
		app.camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

	}

	app.animate = function() {

		requestAnimationFrame(app.animate);

		app.render();
		// stats.update();

	}
	// app.degree = 0;
	app.render = function() {
		// app.degree = app.degree + 1;
		// if(app.degree > 360){
		// 	app.degree =0;
		// }
		// angle = app.degree * 3.14159 / 180;
		
		// posx = 2000 * Math.sin(angle);
		// posz = 4000 * Math.cos(angle);



		// lightrig.rotation.y  += 0.005;

		// app.degree += 0.5;
		// app.degree += 10;

		// if(app.degree >= 360){
		// 	app.degree = 0;
		// }
		// lightrig.rotation.y = app.degree * (Math.PI/180);

		lightrig.rotation.y += 0.001;


		// app.lightheight = Math.abs(app.degree-180);

		// lightrig.position.x = app.lightheight*20;

		// console.log(app.lightheight);

		//group.rotation.y  += 0.0005;

		controls.update();
		// light.position.z += 5;
		// light.position.set(posx, 2000, posz);
		renderer.render(scene, app.camera);

	}
})();
app.init();