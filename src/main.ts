import './style.css';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';

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


	const bumpTexture = new THREE.TextureLoader().load('snow_bump_map.jpeg')
	const materialSnow = new THREE.MeshPhongMaterial({ 
		color: "white", 
		flatShading: true, 
		side: THREE.DoubleSide, 
		bumpMap: bumpTexture, 
		bumpScale: 1 
	});
	
	
	const width = 200;  
	const height =  1;  
	const depth = 50;  
	const geometryGround = new THREE.BoxGeometry( width, height, depth );
	const ground = new THREE.Mesh( geometryGround, materialSnow );
	ground.position.set(0, -10, -20);
	ground.rotation.y = 0;
	scene.add(ground);

	// radius, segments, positionX, positionY, positionZ
	const mountainArray = [
		// left side
		[40, 9, -65, 0, -20],
		[30, 4, -35, 0, -10],
		[15, 5, -15, 0, -3],
		[15, 8, -35, 0, -0],
		// right side
		[40, 9, 65, -10, -20],
		[30, 8, 40, -8, -10],
		[15, 12, 65, -5, -5],
		[15, 9, 25, -5, -7],
		[15, 14, 35, -5, -3],
		// horizont
		[15, 9, -12, -7, -25],
		[15, 6, 6, -11, -25],
		[15, 5, 27, -7, -25],
	];
	mountainArray.forEach(mountain => {
		const geometryMountain = new THREE.CircleGeometry( mountain[0], mountain[1]);
		const newMountain = new THREE.Mesh( geometryMountain, materialSnow );
		newMountain.position.set(mountain[2], mountain[3], mountain[4]);
		newMountain.rotation.x = -0.05;
		ground.add(newMountain);
	});

	//   ADD LIGHT   \\
	const intensity = 4;
	const lightOne = new THREE.DirectionalLight("white", intensity);
	lightOne.position.set(0, 5, 15);
	scene.add(lightOne);


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
}


if ( WebGL.isWebGL2Available() ) {
	main();
	// animate();
} else {
	const warning = WebGL.getWebGL2ErrorMessage();
	alert(warning);
}
