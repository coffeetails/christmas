import './style.css';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import {threeArray, mountainArray} from './shapes';
import { FontLoader } from 'three/examples/jsm/Addons.js';


let canvas = document.querySelector( '#canvas' );
let cursorX = canvas!.clientWidth;
let cursorY = canvas!.clientHeight;

canvas?.addEventListener('mousemove', ((event: MouseEvent) => {
    cursorX = event.clientX;
    cursorY = event.clientY;

}) as EventListener);

canvas?.addEventListener('touchmove', ((event: TouchEvent) => {
    const touch = event.touches[0];
    cursorX = touch.clientX;
    cursorY = touch.clientY;

}) as EventListener);

function main() {

	//   CREATE SCENE   \\

	//@ts-ignore
	const renderer = new THREE.WebGLRenderer({canvas,alpha: true,premultipliedAlpha: false});

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 7;
	camera.position.y = 0;


	const fogFar = 100;
	const scene = new THREE.Scene();
	const color = '#000000';
	scene.fog = new THREE.Fog(color, near, fogFar);


	const bumpTextureSnow = new THREE.TextureLoader().load('snow_04_bump.jpg');
	bumpTextureSnow.wrapS = THREE.RepeatWrapping;
	bumpTextureSnow.wrapT = THREE.RepeatWrapping;
	bumpTextureSnow.rotation = 80;
	const bumpTextureTree = new THREE.TextureLoader().load('snow_04_bump_small.jpg');
	bumpTextureTree.wrapS = THREE.RepeatWrapping;
	bumpTextureTree.wrapT = THREE.RepeatWrapping;
	// bumpTextureTree.rotation = 110;

	const materialSnow = new THREE.MeshPhongMaterial({ 
		color: "white", 
		flatShading: true, 
		side: THREE.DoubleSide, 
		bumpMap: bumpTextureSnow, 
		bumpScale: 7,
	});


	const materialText = new THREE.MeshPhongMaterial({
		color: "white",
		flatShading: true,
	});
	
	const width = 200;  
	const height =  1;  
	const depth = 100;  
	const geometryGround = new THREE.BoxGeometry( width, height, depth );
	const ground = new THREE.Mesh( geometryGround, materialSnow );
	ground.position.set(0, -11, -20);
	ground.rotation.y = 0;
	scene.add(ground);

	drawThrees(threeArray);
	drawMountain(mountainArray);

	const loader = new FontLoader(); 
	loader.load( 'The_Perfect_Christmas.json', function ( font ) { 
		const geometryText = new TextGeometry( 'Have a warm and cozy Yule', { 
			font: font,
			size:  2.0,  
			depth: 0.1,  
			curveSegments:  1,
		} ); 
		const floatingText = new THREE.Mesh( geometryText, materialText );
		floatingText.position.set(-9, 1.2, 10);
		floatingText.rotation.x = -0.1;
		ground.add(floatingText);
	} );

	//   ADD LIGHT   \\
	const lightIntensity = 2;
	const lights = [
		{color: "rgba(235,104,36,1)", pos: [0, 100, -100]},
		{color: "rgba(46,30,108,1)", pos: [0, 100, 0]},
		{color: "rgba(104,102,102,1)", pos: [0, 100, 100]},
	];
	lights.forEach(light => {
		const newLight = new THREE.DirectionalLight(light.color, lightIntensity);
		newLight.position.set(light.pos[0],light.pos[1],light.pos[2]);
		scene.add(newLight);
	});


	function render( time: number ) {
		time *= 0.001;
		if ( resizeRendererToDisplaySize( renderer ) ) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		const canvasMiddleX = canvas!.clientWidth / 2;
		const canvasMiddleY = canvas!.clientHeight / 2;

		ground.rotation.x = (cursorY-canvasMiddleY)*0.0001;
		ground.rotation.y = (cursorX-canvasMiddleX)*0.0001;

		renderer.render( scene, camera );
		requestAnimationFrame( render );
	}
	requestAnimationFrame( render );

	function resizeRendererToDisplaySize( renderer: THREE.WebGLRenderer ) {
		const canvas = renderer.domElement;
		const pixelRatio = window.devicePixelRatio;
		const width = Math.floor( canvas.clientWidth * pixelRatio );
		const height = Math.floor( canvas.clientHeight * pixelRatio );
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {
			renderer.setSize( width, height, false );
		}
		return needResize;
	}


	function drawThrees(array: any[]) {
	array.forEach(shape => {
		const pointsStump = [];
		const pointsTree = [];
		const pointsSnow = [];
		const pointsTreeOne = [];
		const pointsSnowOne = [];
		const pointsTreeTwo = [];
		const pointsSnowTwo = [];
		for ( let i = 0; i < 10; ++ i ) {
			// 											params: sinWave, width, positionHeight, shapeHeight
			pointsStump.push( new THREE.Vector2( Math.sin( i * 0.4 ) * 1.5 + 0, ( i - 5 ) * 1.5 ) );
			pointsTree.push( new THREE.Vector2( Math.sin( i * shape.params[0] ) * (shape.params[1]*4) + 0, ( i - shape.params[2] ) * shape.params[3] ) );
			pointsSnow.push( new THREE.Vector2( Math.sin( i * shape.params[0] ) * (shape.params[1]*4) + 0, ( i - (shape.params[2]*0.8) ) * (shape.params[3]*2.3) ) );
			
			pointsTreeOne.push( new THREE.Vector2( Math.sin( i * shape.params[0] ) * (shape.params[1]*3.2) + 0, ( i - (shape.params[2]*1.5) ) * shape.params[3] ) );
			pointsSnowOne.push( new THREE.Vector2( Math.sin( i * shape.params[0] ) * (shape.params[1]*3.2) + 0, ( i - (shape.params[2]*1.01) ) * (shape.params[3]*2.3) ) );

			pointsTreeTwo.push( new THREE.Vector2( Math.sin( i * shape.params[0] ) * (shape.params[1]*2.5) + 0, ( i - (shape.params[2]*2.05) ) * shape.params[3] ) );
			pointsSnowTwo.push( new THREE.Vector2( Math.sin( i * shape.params[0] ) * (shape.params[1]*2.3) + 0, ( i - (shape.params[2]*1.8) ) * (shape.params[3]*1.3) ) );
		}

		const segments = 12;
		const geometryShapeStump = new THREE.LatheGeometry(pointsStump, segments);
		const geometryShapeTree = new THREE.LatheGeometry(pointsTree, segments);
		const geometryShapeSnow = new THREE.LatheGeometry(pointsSnow, segments);

		const geometryShapeTreeOne = new THREE.LatheGeometry(pointsTreeOne, segments);
		const geometryShapeSnowOne = new THREE.LatheGeometry(pointsSnowOne, segments);
		const geometryShapeTreeTwo = new THREE.LatheGeometry(pointsTreeTwo, segments);
		const geometryShapeSnowTwo = new THREE.LatheGeometry(pointsSnowTwo, segments);


		const materialStump = new THREE.MeshPhongMaterial({ 
			color: "brown", 
			flatShading: false, 
			side: THREE.DoubleSide, 
			bumpMap: bumpTextureTree, 
			bumpScale: 30,
		});
		const materialTree = new THREE.MeshPhongMaterial({ 
			color: shape.color, 
			flatShading: false, 
			side: THREE.DoubleSide, 
			bumpMap: bumpTextureTree, 
			bumpScale: 20,
		});
		const materialSnow = new THREE.MeshPhongMaterial({ 
			color: "white", 
			flatShading: false, 
			side: THREE.DoubleSide, 
			bumpMap: bumpTextureTree, 
			bumpScale: 4,
		});

		const newTrees = [
			new THREE.Mesh( geometryShapeStump, materialStump ),
			new THREE.Mesh( geometryShapeTree, materialTree ),
			new THREE.Mesh( geometryShapeSnow, materialSnow ),
			new THREE.Mesh( geometryShapeTreeOne, materialTree ),
			new THREE.Mesh( geometryShapeSnowOne, materialSnow ),
			new THREE.Mesh( geometryShapeTreeTwo, materialTree ),
			new THREE.Mesh( geometryShapeSnowTwo, materialSnow ),
		]

		newTrees.forEach(model => {
			model.position.set(shape.pos.x, shape.pos.y, shape.pos.z);
			model.rotation.x = 3.1;
			ground.add(model);
		});
	});
	}
	
	
	function drawMountain(array: any[]) {
		const segments = 12;  
		const phiStart = Math.PI * 0.00;  
		const phiLength = Math.PI * 2.00;  

		array.forEach(shape => {
			const points = [];
			for ( let i = 0; i < 10; ++ i ) {
				points.push( new THREE.Vector2( 
					Math.sin( i * shape.params[0] ) * shape.params[1] + 0, ( i - shape.params[2] ) * shape.params[3] 
				) );
			}
			const geometryShape = new THREE.LatheGeometry(points, segments, phiStart, phiLength );
	
			const materialSnow = new THREE.MeshPhongMaterial({ 
				color: shape.color, 
				flatShading: true, 
				side: THREE.DoubleSide, 
				bumpMap: bumpTextureSnow, 
				bumpScale: 1 
			});
	
			const newShape = new THREE.Mesh( geometryShape, materialSnow );
			newShape.position.set(shape.pos.x, shape.pos.y, shape.pos.z);
			newShape.rotation.x = 3;
			ground.add(newShape);
		});
	}

}


if ( WebGL.isWebGL2Available() ) {
	main();
	// animate();
} else {
	const warning = WebGL.getWebGL2ErrorMessage();
	alert(warning);
}
