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

	group = new THREE.Object3D();

	var geometry = new THREE.CubeGeometry(10,20,3,3,6,2);
	var modifier = new THREE.SubdivisionModifier( 3 );
	modifier.modify( geometry );
	var mesh = new THREE.Mesh( geometry, material );
	group.add( mesh );
	var geometry = new THREE.CubeGeometry(2,13,0.3,2,10,8);
	modifier.modify( geometry );
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.y = -10;
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

	group.rotation.y += 0.06;
	group.rotation.x += 0.03;
	
	renderer.render( scene, camera );
}
