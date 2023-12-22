import * as THREE from '../node_modules/three/build/three.module.js';
// Create a scene
const scene = new THREE.Scene();

// Create a perspective camera
const width = 3380;
const height = 740;
const camera = new THREE.PerspectiveCamera(90, width / height, 1, 1000);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

// Attach renderer to the HTML container
const appContainer = document.getElementById("app");

// display the renderer
appContainer.appendChild(renderer.domElement);


const geometry = new THREE.PlaneGeometry(40, 10); 


// create an HLS video source using hls.js
const videoElement = document.createElement('video');
const videoLinks = document.querySelectorAll('.stitch-video-link');

let newVideoUrl = document.getElementById('stitch-src1').getAttribute('data-src');
changeVideoSource(newVideoUrl);

videoLinks.forEach(videoLink => {       
    videoLink.addEventListener('click', () => {
        let newVideoUrl = videoLink.getAttribute('data-src');
        changeVideoSource(newVideoUrl);
    });
});

function changeVideoSource(newVideoUrl) {
    if (newVideoUrl) {
        videoElement.src = newVideoUrl;//https://s.bepro11.com/vr-video-sample.mp4
        videoElement.loop = true;
        videoElement.muted = true;
        videoElement.playsInline = true;
        videoElement.crossOrigin = "anonymous"; 
        //videoElement.autoplay = true;
        videoElement.play();
    } else {
        console.log('Please enter a valid video URL.');
    }
}


// get video resolution
videoElement.addEventListener('loadedmetadata', function () {
    console.log(videoElement.videoWidth, videoElement.videoHeight);
});

const texture = new THREE.VideoTexture(videoElement);

// create a material from the texture
const material = new THREE.MeshBasicMaterial({ map: texture });

// create a mesh and add to the scene
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// position the camera to face the mesh
camera.position.x = 2;
camera.position.z = 6;

const buttonPlayPress = () => {
    if (videoElement.paused) {
        videoElement.play();
    } else {
        videoElement.pause();
    }
}

const buttonStopPress = () => {
    videoElement.pause();
    videoElement.currentTime = 0;
}

const buttonBackPress = () => {
    videoElement.currentTime -= 1;
}

const buttonForwardPress = () => {
    videoElement.currentTime += 1;
}

//playButton.addEventListener('click', togglePlay);
window.addEventListener('keydown', e => {
    if (e.code === 'Space') buttonPlayPress();
});


const playButton = document.getElementById('button_play');
const pauseButton = document.getElementById('button_stop');
const backButton = document.getElementById('button_bw');
const forwardButton = document.getElementById('button_fw');
const moveLeftButton = document.getElementById('move_left');
const moveRightButton = document.getElementById('move_right');

playButton.addEventListener('click', buttonPlayPress);
pauseButton.addEventListener('click', buttonStopPress);
backButton.addEventListener('click', buttonBackPress);
forwardButton.addEventListener('click', buttonForwardPress);

// render loop
renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
});

// zoom in / out
const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
renderer.domElement.addEventListener('wheel', e => {
    camera.fov = clamp(camera.fov + e.deltaY / 10, 10, 120);
    // need to call this function after changing most of properties in PerspectiveCamera
    camera.updateProjectionMatrix();
});

// rotate camera left/right
let mouseDown = false;
let lastMouseX = 0;
renderer.domElement.addEventListener('mousedown', e => {
    if (e.button === 0) {
        mouseDown = true;
        lastMouseX = e.clientX;
    }
});

window.addEventListener('mouseup', e => {
    if (e.button === 0) mouseDown = false;
});

// Set the limits for rotation in radians
const minRotationY = -Math.PI / 9; // Minimum rotation (180/9 degrees left)
const maxRotationY = Math.PI / 9;  // Maximum rotation (180/9 degrees right)
window.addEventListener('mousemove', e => {
    if (!mouseDown) return;

    const movementX = e.clientX - lastMouseX;

    // Calculate the new rotation angle
    const rotateY = movementX / 3000;
    const newRotationY = camera.rotation.y + rotateY;

    // Check if the new rotation is within limits
    if (newRotationY >= minRotationY && newRotationY <= maxRotationY) {
        camera.rotateY(rotateY);
        lastMouseX = e.clientX;
    }
});

// Add a reset camera function
const resetCamera = () => {
    camera.position.set(0, 0, 5); // Reset position
    camera.rotation.set(0, 0, 0); // Reset rotation
    cameraX = 0; // Reset horizontal position
};


// Move camera left/right using arrow keys
const moveStep = 0.2;

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowLeft':
            camera.position.x -= moveStep;
            break;
        case 'ArrowRight':
            camera.position.x += moveStep;
            break;
        case 'ArrowUp':
            camera.position.y += moveStep;
            break;
        case 'ArrowDown':
            camera.position.y -= moveStep;
            break;
        case 'r': 
        case 'R':
            resetCamera();
            break;
    }
});

moveLeftButton.addEventListener('click', () => {
    camera.position.x -= moveStep;
});

moveRightButton.addEventListener('click', () => {
    camera.position.x += moveStep;
});