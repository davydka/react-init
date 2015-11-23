var React = require('react');
var ReactDOM = require('react-dom');
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
//var Firebase = require('firebase');

//var fbRef = new Firebase("https://<firebase-server>.firebaseio.com/");

//var renderer, scene, camera, mesh, group, fov = 18, material;
//var container = document.getElementById( 'container' );

var Hello = React.createClass({
	renderer: null, scene: null, camera: null, mesh: null, group: null, fov: 18, material: null,
	container: document.getElementById( 'container' ),
	meshTorus: null,
	meshCylinder: null,
	meshPop1: null,
	meshPop2: null,
	meshFlatPop1: null,
	meshFlatPop2: null,


	getInitialState: function(){
		return {
			geometry: 'cylinder',
			torusVisible: false,
			cylinderVisible: false,
			popVisible: true,
			flatPopVisible: false
		}
	},
	
	componentDidUpdate: function(){
		this.torusVisible();
		this.cylinderVisible();
		this.popVisible();
		this.flatPopVisible();
	},
	
	componentDidMount: function(){
		this.scene = new THREE.Scene();
		
		this.camera = new THREE.PerspectiveCamera( this.fov, window.innerWidth / window.innerHeight, 10, 1000 );
		this.camera.position.z = 100;
		this.camera.position.x = 100;

		this.scene.add( this.camera );

		this.material = new THREE.ShaderMaterial( {

			uniforms: { 
				tMatCap: { type: 't', value: THREE.ImageUtils.loadTexture( '/sketches/lab/metal-shine-edge.jpg' ) },
			},
			vertexShader: document.getElementById( 'sem-vs' ).textContent,
			fragmentShader: document.getElementById( 'sem-fs' ).textContent,
			shading: THREE.SmoothShading
		
		} );

		this.material.uniforms.tMatCap.value.wrapS = this.material.uniforms.tMatCap.value.wrapT = 
		THREE.ClampToEdgeWrapping;

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		
		this.container.appendChild( this.renderer.domElement );

		window.addEventListener( 'resize', this.onWindowResize, false );

		this.onWindowResize();

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

		// END model

		this.group = new THREE.Object3D();

		this.addCylinder();
		this.addTorus();
		this.addPopsicle();
		this.addFlatPopsicle();

		this.scene.add(this.group);


		this.animate();
	},

	render: function () {
		return <ButtonToolbar className="buttons">
			<Button bsStyle={this.state.popVisible      ? "success":"default"} onClick={this.handlePopClick}>Popsicle</Button>
			<Button bsStyle={this.state.torusVisible    ? "success":"default"} onClick={this.handleTorusClick}>Torus</Button>
			<Button bsStyle={this.state.cylinderVisible ? "success":"default"} onClick={this.handleCylinderClick}>Cylinder</Button>
			<Button bsStyle={this.state.flatPopVisible  ? "success":"default"} onClick={this.handleFlatPopClick}>Flat Popsicle</Button>
			<Button bsStyle="primary" href="http://107.170.100.207:8000/sketches/lab/metal-shine-edge.jpg">Metal Material</Button>
		</ButtonToolbar>
	},

	handleFlatPopClick: function(){
		this.setState({
			popVisible:false,
			torusVisible: false,
			cylinderVisible: false,
			flatPopVisible: true
		});
	},

	handleCylinderClick: function(){
		this.setState({
			popVisible:false,
			torusVisible: false,
			cylinderVisible: true,
			flatPopVisible: false
		});
	},

	handlePopClick: function(){
		this.setState({
			popVisible:true,
			torusVisible: false,
			cylinderVisible: false,
			flatPopVisible: false
		});
	},
	
	handleTorusClick: function(){
		this.setState({
			popVisible:false,
			torusVisible: true,
			cylinderVisible: false,
			flatPopVisible: false
		});
	},

	cylinderVisible: function(){
		this.meshCylinder.traverse(function(child){
			child.visible = this.state.cylinderVisible;
		}.bind(this));
	},


	torusVisible: function(){
		this.meshTorus.traverse(function(child){
			child.visible = this.state.torusVisible;
		}.bind(this));
	},

	flatPopVisible: function(){
		this.meshFlatPop1.traverse(function(child){
			child.visible = this.state.flatPopVisible;
		}.bind(this));
		
		this.meshFlatPop2.traverse(function(child){
			child.visible = this.state.flatPopVisible;
		}.bind(this));
		
	},

	popVisible: function(){
		this.meshPop1.traverse(function(child){
			child.visible = this.state.popVisible;
		}.bind(this));
		
		this.meshPop2.traverse(function(child){
			child.visible = this.state.popVisible;
		}.bind(this));
		
	},

	addCylinder: function(){
		var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );

		this.meshCylinder = new THREE.Mesh( geometry, this.material );

		this.meshCylinder.traverse(function(child){
			child.visible = false;
		});
		this.group.add( this.meshCylinder );
		this.cylinderVisible();
	},

	addTorus: function(){
		var geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );

		this.meshTorus = new THREE.Mesh( geometry, this.material );

		this.meshTorus.traverse(function(child){
			child.visible = false;
		});
		this.group.add( this.meshTorus );
		this.torusVisible();
	},

	addFlatPopsicle: function(){
		var geometry = new THREE.CubeGeometry(10,20,3,3,6,2);
		this.meshFlatPop1 = new THREE.Mesh( geometry, this.material );
		this.group.add( this.meshFlatPop1 );

		var geometry = new THREE.CubeGeometry(2,13,0.3,2,10,8);
		this.meshFlatPop2 = new THREE.Mesh( geometry, this.material );
		this.meshFlatPop2.position.y = -20;
		this.group.add( this.meshFlatPop2 );

		this.meshFlatPop1.traverse(function(child){
			child.visible = false;
		});
		
		this.meshFlatPop2.traverse(function(child){
			child.visible = false;
		});
		this.popVisible();
		
	},

	addPopsicle: function(){
		var geometry = new THREE.CubeGeometry(10,20,3,3,6,2);
		var modifier = new THREE.SubdivisionModifier( 3 );
		modifier.modify( geometry );
		this.meshPop1 = new THREE.Mesh( geometry, this.material );
		this.group.add( this.meshPop1 );

		var geometry = new THREE.CubeGeometry(2,13,0.3,2,10,8);
		modifier.modify( geometry );
		this.meshPop2 = new THREE.Mesh( geometry, this.material );
		this.meshPop2.position.y = -10;
		this.group.add( this.meshPop2 );

		this.meshPop1.traverse(function(child){
			child.visible = false;
		});
		
		this.meshPop2.traverse(function(child){
			child.visible = false;
		});
		this.popVisible();
		
	},

	onWindowResize: function(){
		this.renderer.setSize( window.innerWidth-20, window.innerHeight-20 );
		this.camera.projectionMatrix.makePerspective( this.fov, window.innerWidth / window.innerHeight, this.camera.near, this.camera.far );
	},
	
	animate: function(){
		requestAnimationFrame( this.animate );

		this.camera.projectionMatrix.makePerspective( this.fov, window.innerWidth / window.innerHeight, this.camera.near, this.camera.far );
		
		this.camera.lookAt( this.scene.position );

		if(this.group != null){
			this.group.rotation.y += 0.06;
			this.group.rotation.x += 0.03;
		}

		this.renderer.render( this.scene, this.camera );
	}
});

var element = React.createElement(Hello, {});
ReactDOM.render(element, document.querySelector('.canvasContainer'));
