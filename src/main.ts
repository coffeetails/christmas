import './style.css';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import {threeArray, mountainArray} from './shapes';

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
	camera.position.y = 1;


	const fogFar = 50;
	const scene = new THREE.Scene();
	const color = '#000000';
	scene.fog = new THREE.Fog(color, near, fogFar);


	const bumpTextureSnow = new THREE.TextureLoader().load('snow_bump_map.jpeg')
	const materialSnow = new THREE.MeshPhongMaterial({ 
		color: "white", 
		flatShading: true, 
		side: THREE.DoubleSide, 
		bumpMap: bumpTextureSnow, 
		bumpScale: 1 
	});
	
	
	const width = 200;  
	const height =  1;  
	const depth = 100;  
	const geometryGround = new THREE.BoxGeometry( width, height, depth );
	const ground = new THREE.Mesh( geometryGround, materialSnow );
	ground.position.set(0, -10, -20);
	ground.rotation.y = 0;
	scene.add(ground);

	drawThrees(threeArray);
	drawMountain(mountainArray);

	//   ADD LIGHT   \\
	const intensity = 4;
	const lightOne = new THREE.DirectionalLight("white", intensity);
	lightOne.position.set(0, 20, 35);
	scene.add(lightOne);

	function render( time: number ) {
		time *= 0.001;
		if ( resizeRendererToDisplaySize( renderer ) ) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		const canvasMiddleX = canvas!.clientWidth / 2;
		const canvasMiddleY = canvas!.clientHeight / 2;
		console.log(`CURSOR: X: ${(cursorY-canvasMiddleY)*-0.001} Y: ${(cursorX-canvasMiddleX)*0.001}`);

		ground.rotation.x = (cursorY-canvasMiddleY)*0.0001;
		ground.rotation.y = (cursorX-canvasMiddleX)*0.0001;

		renderer.render( scene, camera );
		requestAnimationFrame( render );
	}
	requestAnimationFrame( render );

	//  ===  FUNCTIONS  ===  \\
	
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
			const pointsThree = [];
			const pointsSnow = [];
			for ( let i = 0; i < 10; ++ i ) {
				// 	params: sinWave, width, positionHeight, shapeHeight
				pointsStump.push( new THREE.Vector2( 
					Math.sin( i * 0.4 ) * 1.5 + 0, ( i - 5 ) * 0.8 
				) );
				pointsThree.push( new THREE.Vector2( 
					Math.sin( i * shape.params[0] ) * shape.params[1] + 0, ( i - shape.params[2] ) * shape.params[3] 
				) );
				pointsSnow.push( new THREE.Vector2( 
					Math.sin( i * shape.params[0] ) * (shape.params[1]+0.3) + 0, ( i - (shape.params[2]+1.6) ) * (shape.params[3]-0.2) 
				) );
			}

			const segments = 12;  
			const phiStart = Math.PI * 0.00;  
			const phiLength = Math.PI * 2.00;  
			const geometryShapeStump = new THREE.LatheGeometry(pointsStump, segments, phiStart, phiLength );
			const geometryShapeThree = new THREE.LatheGeometry(pointsThree, segments, phiStart, phiLength );
			const geometryShapeSnow = new THREE.LatheGeometry(pointsSnow, segments, phiStart, phiLength );
	
			const materialStump = new THREE.MeshPhongMaterial({ 
				color: "brown", 
				flatShading: true, 
				side: THREE.DoubleSide, 
				bumpMap: bumpTextureSnow, 
				bumpScale: 1 
			});
			const materialThree = new THREE.MeshPhongMaterial({ 
				color: shape.color, 
				flatShading: true, 
				side: THREE.DoubleSide, 
				bumpMap: bumpTextureSnow, 
				bumpScale: 1 
			});
			const materialSnow = new THREE.MeshPhongMaterial({ 
				color: "white", 
				flatShading: true, 
				side: THREE.DoubleSide, 
				bumpMap: bumpTextureSnow, 
				bumpScale: 1 
			});
	
			
			const newStump = new THREE.Mesh( geometryShapeStump, materialStump );
			const newThree = new THREE.Mesh( geometryShapeThree, materialThree );
			const newSnow = new THREE.Mesh( geometryShapeSnow, materialSnow );
			[newStump, newThree, newSnow].forEach(model => {
				model.position.set(shape.pos.x, shape.pos.y, shape.pos.z);
				model.rotation.x = 3.1;
				ground.add(model);
			})
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
