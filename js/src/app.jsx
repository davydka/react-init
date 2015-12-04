var React = require('react');
var ReactDOM = require('react-dom');
//var Socket = require('socket.io-client')(location.protocol+'//'+location.hostname+(location.port == '' ? '' : ':'+location.port));
var OrbitControls = require('three-orbit-controls')(THREE);


var App = React.createClass({
	scene: null,
	camera: null,
	renderer: null,
	orbitControls: null,

	getInitialState: function(){
		return {
			coords: [0, 0]
		}
	},

	componentDidMount: function(){
		this.startThree();
	},

	onMouseMove: function(e){
		this.setState({
			coords:[
				e.clientX - window.innerWidth/2,
				-(e.clientY - window.innerHeight/2)
			]
		});
		console.log(this.state.coords[1]);
	},

	render: function () {
		return <div onMouseMove={this.onMouseMove}>
			<div id='three'></div>
		</div>
	},

	startThree: function(){
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 100000);
		this.camera.position.set(0, 100, 200);

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			//preserveDrawingBuffer: true
		});
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.domElement.className = 'content-threejs';

		this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

		document.querySelector('#three').insertBefore(
			this.renderer.domElement, 
			document.querySelector('#three').childNodes[0]
		);

		TweenMax.ticker.addEventListener('tick', function(){
			this.camera.lookAt( 
				new THREE.Vector3( 
					this.state.coords[0], 
					this.state.coords[1],
					0
				)
			);
			this.renderer.render(this.scene, this.camera);
		}.bind(this));
	
		var geometry = new THREE.CylinderGeometry( 50, 50, 200, 8 );
		var material = new THREE.MeshPhongMaterial( {color: 0x2194ce} );
		var cylinder = new THREE.Mesh( geometry, material );
		cylinder.position.set(0, 100, 0);
		var edges = new THREE.EdgesHelper( cylinder, 0x00ff00 );
		this.scene.add( cylinder );
		this.scene.add( edges );

		var directionalLighting = new THREE.DirectionalLight(0xffffff, 0.5);
		directionalLighting.position.set(0, 0, 1000);
		this.scene.add( directionalLighting );

		var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
		hemisphereLight.position.set(0, 0, 1000);
		this.scene.add( hemisphereLight );

		var gridHelper = new THREE.GridHelper( 1000, 10 );
		this.scene.add( gridHelper );

		var helper = new THREE.HemisphereLightHelper( hemisphereLight, 100 );
		this.scene.add( helper );

		/*
		var helper = new THREE.CameraHelper( this.camera );
		this.scene.add( helper );
		*/


		/*
		var geometry = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerWidth, 9, 9);
		var material = new THREE.MeshBasicMaterial({
			color: 0xce21af,
			side: THREE.DoubleSide
		});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.name = 'floor';
		this.scene.add( mesh );
		*/
	}
});

var element = React.createElement(App, {});
ReactDOM.render(element, document.querySelector('.container-fluid'));
