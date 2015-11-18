var app = {};

(function() {

	Physijs.scripts.worker = '/js/libs/physijs_worker.js';
	Physijs.scripts.ammo = '/js/libs/ammo.js';

	app.material = new THREE.MeshLambertMaterial({ color: 0xffffff, opacity: 1, transparent: true });

	app.init = function() {
		TWEEN.start();
		
		container = document.createElement('div');
		document.body.appendChild(container);

		renderer = new THREE.WebGLRenderer({ antialias: true });

		// renderer.setClearColor(0xffffff);

		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;
		container.appendChild( renderer.domElement );


		scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
		scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
		scene.addEventListener(
			'update',
			function() {
				scene.simulate( undefined, 2 );
			}
			);
		
		app.camera = new THREE.PerspectiveCamera(
			35,
			window.innerWidth / window.innerHeight,
			1,
			1000
			);
		app.camera.position.set( 60, 50, 60 );
		app.camera.lookAt( scene.position );
		scene.add( app.camera );

		light = new THREE.DirectionalLight( 0xFFFFFF );
		light.position.set( 20, 40, -15 );
		light.target.position.copy( scene.position );
		light.castShadow = true;
		light.shadowCameraLeft = -60;
		light.shadowCameraTop = -60;
		light.shadowCameraRight = 60;
		light.shadowCameraBottom = 60;
		light.shadowCameraNear = 20;
		light.shadowCameraFar = 200;
		light.shadowBias = -.0001
		light.shadowMapWidth = light.shadowMapHeight = 2048;
		light.shadowDarkness = .5;
		scene.add( light );
		
		// scene.fog = new THREE.FogExp2( 0x515150, 0.007 );

		ground_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ color: 0xf1f1f1, opacity: 0.1, transparent: true })
			,
			.8, 
			.4 
			);

		ground = new Physijs.CylinderMesh(
			new THREE.CylinderGeometry( 30, 30, 0.1, 50 ),
			ground_material,
			0 
			);
		ground.receiveShadow = true;
		scene.add( ground );
		
		app.render();
		scene.simulate();

		// scene.add( app.hut() );

		app.makeShape();

		window.addEventListener('resize', app.onWindowResize, false);

	};

	app.objects = [];

	app.makeMaterial = function(color){

		return new Physijs.createMaterial(
		    new THREE.MeshLambertMaterial({ color: color }),
		    .8,
		    .3
		);
		
	}

	app.makeWood = function(){
		
		var colors = [
		0xbeb093,
		0x2a2b2f,
			//0x937568,
			//0x7d5748,
			0xefefed
			];

			// colors = [0xbeb093];
			var color = colors[Math.floor(Math.random() * colors.length)];
		// color = colors[2];
		return app.makeMaterial(color);
	}
	
	app.render = function() {
		requestAnimationFrame( app.render );
		renderer.render( scene, app.camera );
	};

	app.hut = function(){
		var shape, base, part, section, piece;
		var material = app.makeWood();

		var width = 5;
		var height = 5;
		var length = 20;
		var rungs = 8;

		shape = new Physijs.BoxMesh(
			new THREE.CubeGeometry( .1, .1, .1 ),
			material
			);

		var section = function(){

			base = new Physijs.BoxMesh(
				new THREE.CubeGeometry( .2, height, .2 ),
				material
				);

			part = new Physijs.BoxMesh(
				new THREE.CubeGeometry( .2, height, .2 ),
				material
				);

			part.position.set(
				width,
				0,
				0
				);
			base.add( part );

			part = new Physijs.BoxMesh(
				new THREE.CubeGeometry( width, .2, .2 ),
				material
				);

			part.position.set(
				width/2,
				-height/2,
				0
				);

			base.add( part );

			part = new Physijs.BoxMesh(
				new THREE.CubeGeometry( width, .2, .2 ),
				material
				);

			part.position.set(
				width/2,
				height/2,
				0
				);

			base.add( part );

			return base;
		}

		for(i=0; i < rungs; i++){

			var piece = section();
			piece.position.set(
				0,
				0,
				i * (length/(rungs-1))
			);

			shape.add(piece);
	
		}

		var section = function(){

			base = new Physijs.BoxMesh(
				new THREE.CubeGeometry( .2, .2, length ),
				material
				);

			return base;
		}

		var piece = section();
		piece.position.set(0, height/2, length/2);
		shape.add( piece );

		var piece = section();
		piece.position.set(0, -height/2, length/2);
		shape.add( piece );

		var piece = section();
		piece.position.set(width, -height/2, length/2);
		shape.add( piece );

		var piece = section();
		piece.position.set(width, height/2, length/2);
		shape.add( piece );

		var piece = section();
		shape.add(piece);

		shape.castShadow = true;
		shape.receiveShadow = true;

		shape.position.set(0,height,0);

		return shape;
	}
	
	app.shapes = [];

	app.shapes[0] = function(){
		var material = app.makeWood();
		var length = (Math.random() * 10) + 2;
		var width = (Math.random() * 1) + 0.3;
		var shape = new Physijs.BoxMesh(
			new THREE.CubeGeometry( width, length, 0.2 ),
			material
			);
		return shape;
	};

	/*
	app.shapes[1] = function(){
		var shape;
		var material = app.makeWood();
		part = new Physijs.BoxMesh(
			new THREE.CubeGeometry( .2, 3, .2 ),
			material
			);

		shape = new Physijs.BoxMesh(
			new THREE.CubeGeometry( 3, .2, .2 ),
			material
			);

		shape.add( part );
		return shape;
	}

	app.shapes[2] = function(){
		var shape = new Physijs.CylinderMesh(
			new THREE.CylinderGeometry( 1, 1, 2.5, 32 ),
			app.makeMaterial(0x4ea6d8)
			);
		return shape;
	}

	app.shapes[3] = function(){
		var shape;
		var material = app.makeWood();
		part = new Physijs.BoxMesh(
			new THREE.CubeGeometry( .2, 6, 4 ),
			material
			);

		part.position.set(
			2,
			0,
			2
			);

		shape = new Physijs.BoxMesh(
			new THREE.CubeGeometry( 4, 6, .2 ),
			material
			);

		shape.add( part );
		return shape;
	}

	app.shapes[4] = function(){
		var shape;
		var material = app.makeWood();
		shape = new Physijs.BoxMesh(
			new THREE.CubeGeometry( .2, 8, .2 ),
			material
			);

		part = new Physijs.BoxMesh(
			new THREE.CubeGeometry( .2, 8, .2 ),
			material
			);

		part.position.set(
			1.5,
			0,
			0
			);
		shape.add( part );

		var rungs = 10;

		for(i=0; i < rungs; i++){

			part = new Physijs.BoxMesh(
				new THREE.CubeGeometry( 1.5, .2, .2 ),
				material
				);

			part.position.set(
				0.75,
				(.8*i)-3.6,
				0
				);
			shape.add( part );
		}

		return shape;
	}

	app.shapes[5] = function(){
		return app.hut();
	}
*/

	app.shapeCount = 0;

	app.makeShape = function (){

		var shape = app.shapes[Math.floor(Math.random() * app.shapes.length)]();

		// var shape = app.shapes[3]();

		shape.castShadow = true;
		shape.receiveShadow = true;

		shape.position.set(
			Math.random() * 20 - 10,
			10,
			Math.random() * 20 - 10
			);

		shape.rotation.set(
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2
			);

		scene.add( shape );

		app.objects.push(shape);

		app.shapeCount++;

		if(app.shapeCount < 200){
			setTimeout( app.makeShape, 150 );
		} 
	// }
		// 	scene.setGravity(new THREE.Vector3( 
		// 		0 - Math.floor(Math.random() * 100), 
		// 		-10, 
		// 		0 - Math.floor(Math.random() * 100)
		// 		));
			//setTimeout( app.startAgain, 2000 );
		// }

	}


	// app.startAgain = function(){
	// 	console.log(app.objects);
	// 	scene.setGravity(new THREE.Vector3( 0, -30, 0 ));

	// 	for(i=0; i < app.objects.length; i++){

	// 		app.objects[i].position.set(
	// 			Math.random() * 30 - 15,
	// 			20,
	// 			Math.random() * 30 - 15
	// 			);
	// 	}
	// }

	app.onWindowResize = function() {

		app.camera.aspect = window.innerWidth / window.innerHeight;
		app.camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

	}

})();
app.init();