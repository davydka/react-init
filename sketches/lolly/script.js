'use strict';

var renderer, scene, camera, mesh, group, fov = 18, material;

var container = document.getElementById( 'container' );

window.addEventListener( 'load', init );

function init() {
	
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 10, 1000 );
	camera.position.z = 100;
	camera.position.x = 100;

	scene.add( camera );

	material = new THREE.ShaderMaterial( {

		uniforms: { 
			tMatCap: { type: 't', value: THREE.ImageUtils.loadTexture( '/sketches/lab/metal-shine-edge.jpg' ) },
		},
		vertexShader: document.getElementById( 'sem-vs' ).textContent,
		fragmentShader: document.getElementById( 'sem-fs' ).textContent,
		shading: THREE.SmoothShading
		
	} );

	material.uniforms.tMatCap.value.wrapS = material.uniforms.tMatCap.value.wrapT = 
	THREE.ClampToEdgeWrapping;

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	onWindowResize();

	// model

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};

	var onError = function ( xhr ) {
	};


//	THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

//	var loader = new THREE.OBJMTLLoader();
//	loader.load( 'obj/male02.obj', 'obj/male02_dds.mtl', function ( object ) {

//		object.position.y = - 80;
//		scene.add( object );

//	}, onProgress, onError );

	group = new THREE.Object3D();

	//scene.add(group);
/*
	var geometry = new THREE.CubeGeometry(10,20,3,3,6,2);
	var modifier = new THREE.SubdivisionModifier( 3 );
	//modifier.modify( geometry );
	var mesh = new THREE.Mesh( geometry, material );
	group.add( mesh );
	var geometry = new THREE.CubeGeometry(2,13,0.3,2,10,8);
	//modifier.modify( geometry );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.y = -20;
	group.add( mesh );
*/
	//var geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
	var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
	var mesh = new THREE.Mesh( geometry, material );
	group.add( mesh );

	scene.add(group);


	render();
	
}

function onWindowResize() {

	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, camera.near, camera.far );
}

function render() {

	requestAnimationFrame( render );

	camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, camera.near, camera.far );
	
	camera.lookAt( scene.position );

	if(typeof group != "undefined"){
		group.rotation.y += 0.06;
		group.rotation.x += 0.03;
	}

	renderer.render( scene, camera );
}
