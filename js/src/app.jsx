var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');
//var Socket = require('socket.io-client')(location.protocol+'//'+location.hostname+(location.port == '' ? '' : ':'+location.port));
var OrbitControls = require('three-orbit-controls')(THREE);
var Stats = require('stats-js');

var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms 
 
//Align top-left 
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );

setInterval( function () {
stats.begin();
stats.end();
}, 1000 / 60 );

var App = React.createClass({
	scene: null,
	camera: null,
	renderer: null,
	orbitControls: null,

	getInitialState: function(){
		return {
			coords: [0, 0],
			rotate: 0,
			angle: 0
		}
	},

	componentDidMount: function(){
		this.listenToGyro();
		this.startThree();
		window.addEventListener('deviceorientation', function(e){
			var angle = e.beta * Math.PI / -180 + 1;
			angle = Math.round(angle * 100) / 100;
			this.setState({
				angle: angle
			});
		}.bind(this));
	},

	onMouseMove: function(e){
		return;
		this.setState({
			coords:[
				e.clientX - window.innerWidth/2,
				-(e.clientY - window.innerHeight/2)
			]
		});
		//console.log(this.state.coords[1]);
	},

	render: function () {
		return <div onMouseMove={this.onMouseMove}>
			<div id='three'></div>
			<div className='console'>{this.state.angle}</div>
		</div>
	},

	scale: function(x, in_min, in_max, out_min, out_max){
		return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	},

	listenToGyro: function(){
		Compass.watch(function(heading){
			var rotate = heading * Math.PI / -180;
			rotate = Math.round(rotate * 100) / 100;
			rotate = this.scale(rotate, 0, -6.3, -2.22, -4);
			this.setState({
				rotate: rotate,
			});
		}.bind(this));
	},
	
	startThree: function(){
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 100000);

		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			//preserveDrawingBuffer: true
		});
		this.renderer.setClearColor( 0x1A450F );
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.domElement.className = 'content-threejs';

		//this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
		//this.camera.position.set(0, 0, 0);
		this.camera.position.set(0, 100, 200);

		document.querySelector('#three').insertBefore(
			this.renderer.domElement, 
			document.querySelector('#three').childNodes[0]
		);
		
		TweenMax.ticker.addEventListener('tick', function(){
			this.camera.rotation.y = this.state.rotate;
			this.camera.rotation.x = this.state.angle;
		
			for(var ii = 0; ii < this.scene.children.length; ii++){
				if(this.scene.children[ii].type == "Mesh"){
					this.scene.children[ii].rotation.y += .01 ;
				}
			}
			this.renderer.render(this.scene, this.camera);
		}.bind(this));

		var geometry = new THREE.TorusGeometry( 20, 16, 16, 100 );
		var material = new THREE.MeshPhongMaterial( {color: 0x2194ce} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(-100, 100, 0);
		this.scene.add( mesh );

		var geometry = new THREE.BoxGeometry( 20, 20, 20 );
		var material = new THREE.MeshPhongMaterial( {color: 0x2194ce} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(50, 100, 180);
		this.scene.add( mesh );

		var geometry = new THREE.BoxGeometry( 20, 20, 20 );
		var material = new THREE.MeshPhongMaterial( {color: 0xffffce} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(-150, 100, 100);
		this.scene.add( mesh );

		var geometry = new THREE.BoxGeometry( 20, 20, 20 );
		var material = new THREE.MeshPhongMaterial( {color: 0xffffce} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(-150, 100, 180);
		this.scene.add( mesh );
	
		var geometry = new THREE.TorusKnotGeometry( 20, 6, 100, 16, 3, 4 );
		var material = new THREE.MeshPhongMaterial( {color: 0x3e146e} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(-100, 100, 320);
		this.scene.add( mesh );
		var geometry = new THREE.PlaneGeometry( 108, 22.5, 32 );
		var material = new THREE.MeshPhongMaterial( {
			map: THREE.ImageUtils.loadTexture('images/buzzfeed.png'), 
			side: THREE.DoubleSide
		});
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(-100, 100, 280);
		this.scene.add( mesh );
	
		var geometry = new THREE.TorusKnotGeometry( 20, 6, 100, 16 );
		var material = new THREE.MeshPhongMaterial( {color: 0x9994ce, emissive: 0x072534} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(100, 100, 320);
		this.scene.add( mesh );
		var geometry = new THREE.PlaneGeometry( 108, 37.8, 32 );
		var material = new THREE.MeshPhongMaterial( {
			map: THREE.ImageUtils.loadTexture('images/vice.png'), 
			side: THREE.DoubleSide
		});
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(100, 100, 280);
		this.scene.add( mesh );

	
		var geometry = new THREE.TorusGeometry( 20, 6, 16, 100 );
		var material = new THREE.MeshPhongMaterial( {color: 0x2194ce} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(100, 100, 0);
		this.scene.add( mesh );
	
		var geometry = new THREE.CylinderGeometry( 10, 10, 100, 8 );
		var material = new THREE.MeshPhongMaterial( {color: 0xfff000} );
		var cylinder = new THREE.Mesh( geometry, material );
		cylinder.position.set(-100, 100, 400);
		var edges = new THREE.EdgesHelper( cylinder, 0x00ffff );
		this.scene.add( cylinder );
		this.scene.add( edges );
		var geometry = new THREE.PlaneGeometry( 108, 36.2, 32 );
		var material = new THREE.MeshPhongMaterial( {
			map: THREE.ImageUtils.loadTexture('images/esquire.png'), 
			side: THREE.DoubleSide
		});
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(-100, 160, 400);
		this.scene.add( mesh );
	
		var geometry = new THREE.CylinderGeometry( 10, 10, 100, 8 );
		var material = new THREE.MeshPhongMaterial( {color: 0x2194ff} );
		var cylinder = new THREE.Mesh( geometry, material );
		cylinder.position.set(100, 100, 400);
		var edges = new THREE.EdgesHelper( cylinder, 0x00ffff );
		this.scene.add( cylinder );
		this.scene.add( edges );
		var geometry = new THREE.PlaneGeometry( 108, 14.5, 32 );
		var material = new THREE.MeshPhongMaterial( {
			map: THREE.ImageUtils.loadTexture('images/popular-mechanics.png'), 
			side: THREE.DoubleSide
		});
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(100, 160, 400);
		this.scene.add( mesh );
	
		var geometry = new THREE.CylinderGeometry( 10, 10, 100, 8 );
		var material = new THREE.MeshPhongMaterial( {color: 0x2194ce} );
		var cylinder = new THREE.Mesh( geometry, material );
		cylinder.position.set(0, 100, 400);
		var edges = new THREE.EdgesHelper( cylinder, 0x00ff00 );
		this.scene.add( cylinder );
		this.scene.add( edges );
		var geometry = new THREE.PlaneGeometry( 108, 39.7, 32 );
		var material = new THREE.MeshPhongMaterial( {
			map: THREE.ImageUtils.loadTexture('images/espn.png'), 
			side: THREE.DoubleSide
		});
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(0, 170, 400);
		this.scene.add( mesh );

		var geometry = new THREE.CylinderGeometry( 10, 10, 100, 8 );
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
	}
});

var element = React.createElement(App, {});
ReactDOM.render(element, document.querySelector('.container-fluid'));
