window.addEventListener( 'load', init );

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	scene = new THREE.Scene();
	
	fov = 150;

	camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 10, 1000 );
	camera.position.z = 100;

	scene.add( camera );

	controls = new THREE.TrackballControls(camera);
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = true;
	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	material = new THREE.ShaderMaterial( {

		uniforms: { 
			tMatCap: { type: 't', value: THREE.ImageUtils.loadTexture( '/sketches/lab/metal-shine.jpg' ) },
		},
		vertexShader: document.getElementById( 'sem-vs' ).textContent,
		fragmentShader: document.getElementById( 'sem-fs' ).textContent,
		shading: THREE.SmoothShading

	} );

	material.uniforms.tMatCap.value.wrapS = material.uniforms.tMatCap.value.wrapT = 
	THREE.ClampToEdgeWrapping;

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );

	renderer.setClearColor(0x222222);

	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	onWindowResize();

	material.side = THREE.DoubleSide;

	loader = new THREE.JSONLoader();

	group = new THREE.Object3D();
	count = 50;

	loaded = false;

	//https://stemkoski.github.io/Three.js/Polyhedra.html
	
	loadCallBack = function ( geometry, materials ) { 

		geometry.computeBoundingBox();

		geometry.boundingBox.center();

		loaded = true;
		
		console.log(geometry.vertices);

		refGeometry = geometry.clone();

		for ( var i = 0; i < count; i ++ ) {

			var object = new THREE.Mesh( geometry , material );

			object.scale.x = (3+ Math.random())*.1;
			object.scale.y = (3+ Math.random())*.1;
			object.scale.z = (3+ Math.random())*.1;

			if(i%2){
				object.scale.x = (1+ Math.random())*.1;
				object.scale.y = (1+ Math.random())*.1;
				object.scale.z = (1+ Math.random())*.1;
			}

			object.rotation.y = Math.random()* Math.PI * 2;
			object.rotation.x = Math.random()* Math.PI * 2;
			object.rotation.z = Math.random()* Math.PI * 2;


			group.add( object );
		}

		redraw();

	};

	scene.add(group);

	loader.load( "/models/hex.js", loadCallBack );

	render();

	framesCount = 50;
	frameLength = 800;

	redrawInterval = setInterval(redraw,frameLength);

	// startAgainInterval = setInterval(startAgain,framesCount*frameLength);
	// window.onmousedown = mousedown;
	window.addEventListener('mousedown', onMouseDown, true );
	window.addEventListener('mouseup', onMouseUp, true );
}

function onWindowResize() {

	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, camera.near, camera.far );
}


mousedown = false;
function onMouseDown()
{
	mousedown = true;
	clearInterval(redrawInterval);
}
function onMouseUp()
{
	mousedown = false;
	redrawInterval = setInterval(redraw,frameLength);
}

var frameI = 0;
function redraw(){
	frameI++;
	if(frameI > framesCount){
		startAgain();
		frameI = 0;
	} else if(group.children.length > 1){

		for ( var i = 0; i < count; i ++ ) {
			group.children[i].rotation.y = Math.random()* Math.PI * 2;
			group.children[i].rotation.x = Math.random()* Math.PI * 2;
			group.children[i].rotation.z = Math.random()* Math.PI * 2;

			for ( var o = 0; o < group.children[i].geometry.vertices.length; o ++ ) {
				group.children[i].geometry.vertices[o].x = group.children[i].geometry.vertices[o].x + Math.random() * .1;
				group.children[i].geometry.vertices[o].y = group.children[i].geometry.vertices[o].y + Math.random() * .1;
				group.children[i].geometry.vertices[o].z = group.children[i].geometry.vertices[o].z + Math.random() * .1;
			}
			group.children[i].geometry.verticesNeedUpdate = true;

		}
		fov -= 2;
	}


}

function startAgain(){
	for ( var i = 0; i < count; i ++ ) {
		for ( var o = 0; o < group.children[i].geometry.vertices.length; o ++ ) {
			group.children[i].geometry.vertices[o].x = refGeometry.vertices[o].x;
			group.children[i].geometry.vertices[o].y = refGeometry.vertices[o].y;
			group.children[i].geometry.vertices[o].z = refGeometry.vertices[o].z;
		}
		group.children[i].geometry.verticesNeedUpdate = true;
	}
	fov = 100;
}

function render() {

	requestAnimationFrame( render );

	camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, camera.near, camera.far );
	
	controls.update();
	camera.lookAt( scene.position );
	
	if(!mousedown){	
		group.rotation.y += 0.006;
		group.rotation.z += 0.005;
		group.rotation.y -= 0.002;
	}

	renderer.render( scene, camera );

}
