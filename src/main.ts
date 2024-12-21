import './style.css';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';


function main() {

	//   CREATE SCENE   \\
	let canvas = document.querySelector( '#canvas' );

	//@ts-ignore
	const renderer = new THREE.WebGLRenderer({canvas,alpha: true,premultipliedAlpha: false});

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 7;
	camera.position.y = 1;

	const fogFar = 35;
	const scene = new THREE.Scene();
	const color = '#000000';
	scene.fog = new THREE.Fog(color, near, fogFar);
	

	//   ADD SPERE   \\
	const radiusSpere = 2;  
	const detail = 0;  
	const geometrySpere = new THREE.IcosahedronGeometry( radiusSpere, detail );
	const spereMaterial = new THREE.MeshPhongMaterial({color: "0xffffff"}); // white
	const spere = new THREE.Mesh( geometrySpere, spereMaterial );
	spere.position.set(0, 0.5, -5);
	scene.add(spere);

	//   ADD LIGHT   \\
	const intensity = 4;
	const colorOne = 0xcc0000; // red
	const lightOne = new THREE.DirectionalLight(colorOne, intensity);
	lightOne.position.set(2, 2, 0);
	scene.add(lightOne);

	const colorTwo = 0x6aa84f; // green
	const lightTwo = new THREE.DirectionalLight(colorTwo, intensity);
	lightTwo.position.set(-2, 2, 0);
	scene.add(lightTwo);


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

		spere.rotation.y += 0.005;
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
