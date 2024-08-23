import * as THREE from "three";

export function main(imageURL) {
    
    const canvas = document.querySelector( "#c" );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas, alpha: true } );
    renderer.setClearColor( 0x000000, 0 );

    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 10;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.z = 7;
    camera.position.y = -3;

    renderer.setSize( 150, 225);
    camera.aspect = 150 / 225;
    camera.updateProjectionMatrix();

    const scene = new THREE.Scene();

    const img = new Image();
    img.src = imageURL;
    img.onload = () => {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(imageURL);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.NearestFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping; // Use ClampToEdgeWrapping to avoid seams
        texture.wrapT = THREE.ClampToEdgeWrapping;
    
        const offset = 0.003; //to prevent bleeding texture
    
        const verticesHead = [
            // front
            { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0.125 + offset, 0.75 + offset], },
            { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [0.25 - offset, 0.75 + offset], },
            { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0.125 + offset, 0.875 - offset], },
            { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [0.25 - offset, 0.875 - offset], },
            // back
            { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0.375 + offset, 0.75 + offset], },
            { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [0.5 - offset, 0.75 + offset], },
            { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0.375 + offset, 0.875 - offset], },
            { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [0.5 - offset, 0.875 - offset], },
            // left
            { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0.25 + offset,  0.75 + offset], },
            { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [0.375 - offset,  0.75 + offset], },
            { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0.25 + offset, 0.875 - offset], },
            { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [0.375 - offset, 0.875 - offset], },
            // right
            { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0 + offset, 0.75 + offset], },
            { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [0.125 - offset, 0.75 + offset], },
            { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0 + offset, 0.875 - offset], },
            { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [0.125 - offset, 0.875 - offset], },
            // top
            { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0.125 + offset, 1 - offset], }, 
            { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [0.25 - offset, 1 - offset], },
            { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0.125 + offset, 0.875 + offset], },
            { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [0.25 - offset, 0.875 + offset], },
            // bottom
            { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0.25 + offset, 0.875 + offset], },
            { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [0.375 - offset, 0.875 + offset], },
            { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0.25 + offset, 1 - offset], },
            { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [0.375 - offset, 1 - offset], },
        ];
        
        const verticesBody = [
            // front body
            { pos: [-1, -4,  0.5], norm: [ 0,  0,  1], uv: [0.3125 + offset, 0.5 + offset], },
            { pos: [ 1, -4,  0.5], norm: [ 0,  0,  1], uv: [0.4375 - offset, 0.5 + offset], },
            { pos: [-1, -1,  0.5], norm: [ 0,  0,  1], uv: [0.3125 + offset, 0.6875 - offset], },
            { pos: [ 1, -1,  0.5], norm: [ 0,  0,  1], uv: [0.4375 - offset, 0.6875 - offset], },
            // back body
            { pos: [ 1, -4, -0.5], norm: [ 0,  0, -1], uv: [0.5 + offset, 0.5 + offset], },
            { pos: [-1, -4, -0.5], norm: [ 0,  0, -1], uv: [0.625 - offset, 0.5 + offset], },
            { pos: [ 1, -1, -0.5], norm: [ 0,  0, -1], uv: [0.5 + offset, 0.6875 - offset], },
            { pos: [-1, -1, -0.5], norm: [ 0,  0, -1], uv: [0.625 - offset, 0.6875 - offset], },
            // left body
            { pos: [ 1, -4,  0.5], norm: [ 1,  0,  0], uv: [0.4375 + offset,  0.5 + offset], },
            { pos: [ 1, -4, -0.5], norm: [ 1,  0,  0], uv: [0.5 - offset,  0.5 + offset], },
            { pos: [ 1, -1,  0.5], norm: [ 1,  0,  0], uv: [0.4375 + offset, 0.6875 - offset], },
            { pos: [ 1, -1, -0.5], norm: [ 1,  0,  0], uv: [0.5 - offset, 0.6875 - offset], },
            // right body
            { pos: [-1, -4, -0.5], norm: [-1,  0,  0], uv: [0.25 + offset, 0.5 + offset], },
            { pos: [-1, -4,  0.5], norm: [-1,  0,  0], uv: [0.3125 - offset, 0.5 + offset], },
            { pos: [-1, -1, -0.5], norm: [-1,  0,  0], uv: [0.25 + offset, 0.6875 - offset], },
            { pos: [-1, -1,  0.5], norm: [-1,  0,  0], uv: [0.3125 - offset, 0.6875 - offset], },
            //top body
            { pos: [ 1,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.3125 + offset, 0.75 - offset], }, 
            { pos: [-1,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.4375 - offset, 0.75 - offset], },
            { pos: [ 1,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.3125 + offset, 0.6875 + offset], },
            { pos: [-1,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.4375 - offset, 0.6875 + offset], },
            // bottom body
            { pos: [ 1, -4,  0.5], norm: [ 0, -1,  0], uv: [0.4375 + offset, 0.75 - offset], },
            { pos: [-1, -4,  0.5], norm: [ 0, -1,  0], uv: [0.5625 - offset, 0.75 - offset], },
            { pos: [ 1, -4, -0.5], norm: [ 0, -1,  0], uv: [0.4375 + offset, 0.6875 + offset], },
            { pos: [-1, -4, -0.5], norm: [ 0, -1,  0], uv: [0.5625 - offset, 0.6875 + offset], },
        ];
    
        const verticesRightArm = [
            //front right arm
            { pos: [-2, -4,   0.5], norm: [ 0,  0,  1], uv: [0.6875 + offset, 0.5 + offset], },
            { pos: [-1, -4,   0.5], norm: [ 0,  0,  1], uv: [0.75 - offset, 0.5 + offset], },
            { pos: [-2, -1,   0.5], norm: [ 0,  0,  1], uv: [0.6875 + offset, 0.6875 - offset], },
            { pos: [-1, -1,   0.5], norm: [ 0,  0,  1], uv: [0.75 - offset, 0.6875 - offset], },
            //back right arm
            { pos: [-1, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.8125 + offset, 0.5 + offset], },
            { pos: [-2, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.875 - offset, 0.5 + offset], },
            { pos: [-1, -1,  -0.5], norm: [ 0,  0,  -1], uv: [0.8125 + offset, 0.6875 - offset], },
            { pos: [-2, -1,  -0.5], norm: [ 0,  0,  -1], uv: [0.875 - offset, 0.6875 - offset], },
            //left right arm
            { pos: [-1, -4,   0.5], norm: [ 1,  0,  0], uv: [0.75 + offset, 0.5 + offset], }, 
            { pos: [-1, -4,  -0.5], norm: [ 1,  0,  0], uv: [0.8125 - offset, 0.5 + offset], },
            { pos: [-1, -1,   0.5], norm: [ 1,  0,  0], uv: [0.75 + offset, 0.6875 - offset], },
            { pos: [-1, -1,  -0.5], norm: [ 1,  0,  0], uv: [0.8125 - offset, 0.6875 - offset], },
            //right right arm
            { pos: [-2, -4,  -0.5], norm: [ -1,  0,  0], uv: [0.625 + offset, 0.5 + offset], }, 
            { pos: [-2, -4,   0.5], norm: [ -1,  0,  0], uv: [0.6875 - offset, 0.5 + offset], },
            { pos: [-2, -1,  -0.5], norm: [ -1,  0,  0], uv: [0.625 + offset, 0.6875 - offset], },
            { pos: [-2, -1,   0.5], norm: [ -1,  0,  0], uv: [0.6875 - offset, 0.6875 - offset], },
            //top right arm
            { pos: [-2,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.6875 + offset, 0.6875 + offset], },
            { pos: [-1,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.75 - offset, 0.6875 + offset], },
            { pos: [-2,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.6875 + offset, 0.75 - offset], },
            { pos: [-1,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.75 - offset, 0.75 - offset], },
            //bottom right arm
            { pos: [-1, -4,  0.5], norm: [ 0, -1,  0], uv: [0.8125 - offset, 0.6875 + offset], },
            { pos: [-2, -4,  0.5], norm: [ 0, -1,  0], uv: [0.75 + offset, 0.6875 + offset], },
            { pos: [-1, -4, -0.5], norm: [ 0, -1,  0], uv: [0.8125 - offset, 0.75 - offset], },
            { pos: [-2, -4, -0.5], norm: [ 0, -1,  0], uv: [0.75 + offset, 0.75 - offset], },
        ];
    
        const verticesLeftArm = [
            //front left arm
            { pos: [1, -4,   0.5], norm: [ 0,  0,  1], uv: [0.5625 + offset, 0 + offset], },
            { pos: [2, -4,   0.5], norm: [ 0,  0,  1], uv: [0.625 - offset, 0 + offset], },
            { pos: [1, -1,   0.5], norm: [ 0,  0,  1], uv: [0.5625 + offset, 0.1875 - offset], },
            { pos: [2, -1,   0.5], norm: [ 0,  0,  1], uv: [0.625 - offset, 0.1875 - offset], },
            //back left arm
            { pos: [2, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.6875 + offset, 0 + offset], },
            { pos: [1, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.75 - offset, 0 + offset], },
            { pos: [2, -1,  -0.5], norm: [ 0,  0,  -1], uv: [0.6875 + offset, 0.1875 - offset], },
            { pos: [1, -1,  -0.5], norm: [ 0,  0,  -1], uv: [0.75 - offset, 0.1875 - offset], },
            //left left arm
            { pos: [2, -4,   0.5], norm: [ 1,  0,  0], uv: [0.625 + offset, 0 + offset], }, 
            { pos: [2, -4,  -0.5], norm: [ 1,  0,  0], uv: [0.6875 - offset, 0 + offset], },
            { pos: [2, -1,   0.5], norm: [ 1,  0,  0], uv: [0.625 + offset, 0.1875 - offset], },
            { pos: [2, -1,  -0.5], norm: [ 1,  0,  0], uv: [0.6875 - offset, 0.1875 - offset], },
            //right left arm
            { pos: [1, -4,  -0.5], norm: [ -1,  0,  0], uv: [0.5 + offset, 0 + offset], }, 
            { pos: [1, -4,   0.5], norm: [ -1,  0,  0], uv: [0.5625 - offset, 0 + offset], },
            { pos: [1, -1,  -0.5], norm: [ -1,  0,  0], uv: [0.5 + offset, 0.1875 - offset], },
            { pos: [1, -1,   0.5], norm: [ -1,  0,  0], uv: [0.5625 - offset, 0.1875 - offset], },
            //top left arm
            { pos: [1,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.5625 + offset, 0.1875 + offset], },
            { pos: [2,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.625 - offset, 0.1875 + offset], },
            { pos: [1,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.5625 + offset, 0.25 - offset], },
            { pos: [2,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.625 - offset, 0.25 - offset], },
            //bottom left arm
            { pos: [2, -4,  0.5], norm: [ 0, -1,  0], uv: [0.6875 - offset, 0.1875 + offset], },
            { pos: [1, -4,  0.5], norm: [ 0, -1,  0], uv: [0.625 + offset, 0.1875 + offset], },
            { pos: [2, -4, -0.5], norm: [ 0, -1,  0], uv: [0.6875 - offset, 0.25 - offset], },
            { pos: [1, -4, -0.5], norm: [ 0, -1,  0], uv: [0.625 + offset, 0.25 - offset], },
        ];
    
        const verticesRightLeg = [
            //front right leg
            { pos: [-1, -7,   0.5], norm: [ 0,  0,  1], uv: [0.0625 + offset, 0.5 + offset], },
            { pos: [ 0, -7,   0.5], norm: [ 0,  0,  1], uv: [0.125 - offset, 0.5 + offset], },
            { pos: [-1, -4,   0.5], norm: [ 0,  0,  1], uv: [0.0625 + offset, 0.6875 - offset], },
            { pos: [ 0, -4,   0.5], norm: [ 0,  0,  1], uv: [0.125 - offset, 0.6875 - offset], },
            //back right leg
            { pos: [ 0, -7,  -0.5], norm: [ 0,  0,  -1], uv: [0.1875 + offset, 0.5 + offset], },
            { pos: [-1, -7,  -0.5], norm: [ 0,  0,  -1], uv: [0.25 - offset, 0.5 + offset], },
            { pos: [ 0, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.1875 + offset, 0.6875 - offset], },
            { pos: [-1, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.25 - offset, 0.6875 - offset], },
            //left right leg
            { pos: [ 0, -7,   0.5], norm: [ 1,  0,  0], uv: [0.125 + offset, 0.5 + offset], }, 
            { pos: [ 0, -7,  -0.5], norm: [ 1,  0,  0], uv: [0.1875 - offset, 0.5 + offset], },
            { pos: [ 0, -4,   0.5], norm: [ 1,  0,  0], uv: [0.125 + offset, 0.6875 - offset], },
            { pos: [ 0, -4,  -0.5], norm: [ 1,  0,  0], uv: [0.1875 - offset, 0.6875 - offset], },
            //right right leg
            { pos: [-1, -7,  -0.5], norm: [ -1,  0,  0], uv: [0 + offset, 0.5 + offset], }, 
            { pos: [-1, -7,   0.5], norm: [ -1,  0,  0], uv: [0.0625 - offset, 0.5 + offset], },
            { pos: [-1, -4,  -0.5], norm: [ -1,  0,  0], uv: [0 + offset, 0.6875 - offset], },
            { pos: [-1, -4,   0.5], norm: [ -1,  0,  0], uv: [0.0625 - offset, 0.6875 - offset], },
            //top right leg
            { pos: [-1, -4,  0.5], norm: [ 0,  1,  0], uv: [0.0625 + offset, 0.6875 + offset], },
            { pos: [ 0, -4,  0.5], norm: [ 0,  1,  0], uv: [0.125 - offset, 0.6875 + offset], },
            { pos: [-1, -4, -0.5], norm: [ 0,  1,  0], uv: [0.0625 + offset, 0.75 - offset], },
            { pos: [ 0, -4, -0.5], norm: [ 0,  1,  0], uv: [0.125 - offset, 0.75 - offset], },
            //bottom right leg
            { pos: [ 0, -7,  0.5], norm: [ 0, -1,  0], uv: [0.1875 - offset, 0.6875 + offset], },
            { pos: [-1, -7,  0.5], norm: [ 0, -1,  0], uv: [0.125 + offset, 0.6875 + offset], },
            { pos: [ 0, -7, -0.5], norm: [ 0, -1,  0], uv: [0.1875 - offset, 0.75 - offset], },
            { pos: [-1, -7, -0.5], norm: [ 0, -1,  0], uv: [0.125 + offset, 0.75 - offset], },
        ];
    
        const verticesLeftLeg = [
            //front left leg
            { pos: [0, -7,   0.5], norm: [ 0,  0,  1], uv: [0.3125 + offset, 0 + offset], },
            { pos: [1, -7,   0.5], norm: [ 0,  0,  1], uv: [0.375 - offset, 0 + offset], },
            { pos: [0, -4,   0.5], norm: [ 0,  0,  1], uv: [0.3125 + offset, 0.1875 - offset], },
            { pos: [1, -4,   0.5], norm: [ 0,  0,  1], uv: [0.375 - offset, 0.1875 - offset], },
            //back left leg
            { pos: [1, -7,  -0.5], norm: [ 0,  0,  -1], uv: [0.4375 + offset, 0 + offset], },
            { pos: [0, -7,  -0.5], norm: [ 0,  0,  -1], uv: [0.5 - offset, 0 + offset], },
            { pos: [1, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.4375 + offset, 0.1875 - offset], },
            { pos: [0, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.5 - offset, 0.1875 - offset], },
            //left left leg
            { pos: [1, -7,   0.5], norm: [ 1,  0,  0], uv: [0.375 + offset, 0 + offset], }, 
            { pos: [1, -7,  -0.5], norm: [ 1,  0,  0], uv: [0.4375 - offset, 0 + offset], },
            { pos: [1, -4,   0.5], norm: [ 1,  0,  0], uv: [0.375 + offset, 0.1875 - offset], },
            { pos: [1, -4,  -0.5], norm: [ 1,  0,  0], uv: [0.4375 - offset, 0.1875 - offset], },
            //right left leg
            { pos: [0, -7,  -0.5], norm: [ -1,  0,  0], uv: [0.25 + offset, 0 + offset], }, 
            { pos: [0, -7,   0.5], norm: [ -1,  0,  0], uv: [0.3125 - offset, 0 + offset], },
            { pos: [0, -4,  -0.5], norm: [ -1,  0,  0], uv: [0.25 + offset, 0.1875 - offset], },
            { pos: [0, -4,   0.5], norm: [ -1,  0,  0], uv: [0.3125 - offset, 0.1875 - offset], },
            //top left leg
            { pos: [0,  -4,  0.5], norm: [ 0,  1,  0], uv: [0.3125 + offset, 0.1875 + offset], },
            { pos: [1,  -4,  0.5], norm: [ 0,  1,  0], uv: [0.375 - offset, 0.1875 + offset], },
            { pos: [0,  -4, -0.5], norm: [ 0,  1,  0], uv: [0.3125 + offset, 0.25 - offset], },
            { pos: [1,  -4, -0.5], norm: [ 0,  1,  0], uv: [0.375 - offset, 0.25 - offset], },
            //bottom left leg
            { pos: [1, -7,  0.5], norm: [ 0, -1,  0], uv: [0.4375 - offset, 0.1875 + offset], },
            { pos: [0, -7,  0.5], norm: [ 0, -1,  0], uv: [0.375 + offset, 0.1875 + offset], },
            { pos: [1, -7, -0.5], norm: [ 0, -1,  0], uv: [0.4375 - offset, 0.25 - offset], },
            { pos: [0, -7, -0.5], norm: [ 0, -1,  0], uv: [0.375 + offset, 0.25 - offset], },
        ];
    
        const verticesBodyLayer = [
            // front body layer 
            { pos: [-1.118033989, -4.1770509835,  0.5590169945], norm: [ 0,  0,  1], uv: [0.3125 + offset, 0.25 + offset], },
            { pos: [ 1.118033989, -4.1770509835,  0.5590169945], norm: [ 0,  0,  1], uv: [0.4375 - offset, 0.25 + offset], },
            { pos: [-1.118033989, -0.8229490165,  0.5590169945], norm: [ 0,  0,  1], uv: [0.3125 + offset, 0.4375 - offset], },
            { pos: [ 1.118033989, -0.8229490165,  0.5590169945], norm: [ 0,  0,  1], uv: [0.4375 - offset, 0.4375 - offset], },
            // back body layer
            { pos: [ 1.118033989, -4.1770509835, -0.5590169945], norm: [ 0,  0, -1], uv: [0.5 + offset, 0.25 + offset], },
            { pos: [-1.118033989, -4.1770509835, -0.5590169945], norm: [ 0,  0, -1], uv: [0.625 - offset, 0.25 + offset], },
            { pos: [ 1.118033989, -0.8229490165, -0.5590169945], norm: [ 0,  0, -1], uv: [0.5 + offset, 0.4375 - offset], },
            { pos: [-1.118033989, -0.8229490165, -0.5590169945], norm: [ 0,  0, -1], uv: [0.625 - offset, 0.4375 - offset], },
            // left body layer
            { pos: [ 1.118033989, -4.1770509835,  0.5590169945], norm: [ 1,  0,  0], uv: [0.4375 + offset, 0.25 + offset], },
            { pos: [ 1.118033989, -4.1770509835, -0.5590169945], norm: [ 1,  0,  0], uv: [0.5 - offset, 0.25 + offset], },
            { pos: [ 1.118033989, -0.8229490165,  0.5590169945], norm: [ 1,  0,  0], uv: [0.4375 + offset, 0.4375 - offset], },
            { pos: [ 1.118033989, -0.8229490165, -0.5590169945], norm: [ 1,  0,  0], uv: [0.5 - offset, 0.4375 - offset], },
            // right body layer
            { pos: [-1.118033989, -4.1770509835, -0.5590169945], norm: [-1,  0,  0], uv: [0.25 + offset, 0.25 + offset], },
            { pos: [-1.118033989, -4.1770509835,  0.5590169945], norm: [-1,  0,  0], uv: [0.3125 - offset, 0.25 + offset], },
            { pos: [-1.118033989, -0.8229490165, -0.5590169945], norm: [-1,  0,  0], uv: [0.25 + offset, 0.4375 - offset], },
            { pos: [-1.118033989, -0.8229490165,  0.5590169945], norm: [-1,  0,  0], uv: [0.3125 - offset, 0.4375 - offset], },
            //top body layer
            { pos: [ 1.118033989,  -0.8229490165, -0.5590169945], norm: [ 0,  1,  0], uv: [0.3125 + offset, 0.5 - offset], }, 
            { pos: [-1.118033989,  -0.8229490165, -0.5590169945], norm: [ 0,  1,  0], uv: [0.4375 - offset, 0.5 - offset], },
            { pos: [ 1.118033989,  -0.8229490165,  0.5590169945], norm: [ 0,  1,  0], uv: [0.3125 + offset, 0.4375 + offset], },
            { pos: [-1.118033989,  -0.8229490165,  0.5590169945], norm: [ 0,  1,  0], uv: [0.4375 - offset, 0.4375 + offset], },
            // bottom body layer
            { pos: [ 1.118033989, -4.1770509835,  0.5590169945], norm: [ 0, -1,  0], uv: [0.4375 + offset, 0.5 - offset], },
            { pos: [-1.118033989, -4.1770509835,  0.5590169945], norm: [ 0, -1,  0], uv: [0.5625 - offset, 0.5 - offset], },
            { pos: [ 1.118033989, -4.1770509835, -0.5590169945], norm: [ 0, -1,  0], uv: [0.4375 + offset, 0.4375 + offset], },
            { pos: [-1.118033989, -4.1770509835, -0.5590169945], norm: [ 0, -1,  0], uv: [0.5625 - offset, 0.4375 + offset], },
        ];
    
        const verticesRightArmLayer = [
            //front right arm layer
            { pos: [-2.0590169945, -4.1770509835,   0.5590169945], norm: [ 0,  0,  1], uv: [0.6875 + offset, 0.25 + offset], },
            { pos: [-0.9409830055, -4.1770509835,   0.5590169945], norm: [ 0,  0,  1], uv: [0.75 - offset, 0.25 + offset], },
            { pos: [-2.0590169945, -0.8229490165,   0.5590169945], norm: [ 0,  0,  1], uv: [0.6875 + offset, 0.4375 - offset], },
            { pos: [-0.9409830055, -0.8229490165,   0.5590169945], norm: [ 0,  0,  1], uv: [0.75 - offset, 0.4375 - offset], },
            //back right arm layer
            { pos: [-0.9409830055, -4.1770509835,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.8125 + offset, 0.25 + offset], },
            { pos: [-2.0590169945, -4.1770509835,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.875 - offset, 0.25 + offset], },
            { pos: [-0.9409830055, -0.8229490165,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.8125 + offset, 0.4375 - offset], },
            { pos: [-2.0590169945, -0.8229490165,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.875 - offset, 0.4375 - offset], },
            //left right arm layer
            { pos: [-0.9409830055, -4.1770509835,   0.5590169945], norm: [ 1,  0,  0], uv: [0.75 + offset, 0.25 + offset], }, 
            { pos: [-0.9409830055, -4.1770509835,  -0.5590169945], norm: [ 1,  0,  0], uv: [0.8125 - offset, 0.25 + offset], },
            { pos: [-0.9409830055, -0.8229490165,   0.5590169945], norm: [ 1,  0,  0], uv: [0.75 + offset, 0.4375 - offset], },
            { pos: [-0.9409830055, -0.8229490165,  -0.5590169945], norm: [ 1,  0,  0], uv: [0.8125 - offset, 0.4375 - offset], },
            //right right arm layer
            { pos: [-2.0590169945, -4.1770509835,  -0.5590169945], norm: [ -1,  0,  0], uv: [0.625 + offset, 0.25 + offset], }, 
            { pos: [-2.0590169945, -4.1770509835,   0.5590169945], norm: [ -1,  0,  0], uv: [0.6875 - offset, 0.25 + offset], },
            { pos: [-2.0590169945, -0.8229490165,  -0.5590169945], norm: [ -1,  0,  0], uv: [0.625 + offset, 0.4375 - offset], },
            { pos: [-2.0590169945, -0.8229490165,   0.5590169945], norm: [ -1,  0,  0], uv: [0.6875 - offset, 0.4375 - offset], },
            //top right arm layer
            { pos: [-2.0590169945,  -0.8229490165,  0.5590169945], norm: [ 0,  1,  0], uv: [0.6875 + offset, 0.4375 + offset], },
            { pos: [-0.9409830055,  -0.8229490165,  0.5590169945], norm: [ 0,  1,  0], uv: [0.75 - offset, 0.4375 + offset], },
            { pos: [-2.0590169945,  -0.8229490165, -0.5590169945], norm: [ 0,  1,  0], uv: [0.6875 + offset, 0.5 - offset], },
            { pos: [-0.9409830055,  -0.8229490165, -0.5590169945], norm: [ 0,  1,  0], uv: [0.75 - offset, 0.5 - offset], },
            //bottom right arm layer
            { pos: [-0.9409830055, -4.1770509835,  0.5590169945], norm: [ 0, -1,  0], uv: [0.8125 - offset, 0.4375 + offset], },
            { pos: [-2.0590169945, -4.1770509835,  0.5590169945], norm: [ 0, -1,  0], uv: [0.75 + offset, 0.4375 + offset], },
            { pos: [-0.9409830055, -4.1770509835, -0.5590169945], norm: [ 0, -1,  0], uv: [0.8125 - offset, 0.5 - offset], },
            { pos: [-2.0590169945, -4.1770509835, -0.5590169945], norm: [ 0, -1,  0], uv: [0.75 + offset, 0.5 - offset], },
        ];
    
        const verticesLeftArmLayer = [
            //front left arm layer
            { pos: [0.9409830055, -4.1770509835,   0.5590169945], norm: [ 0,  0,  1], uv: [0.8125 + offset, 0 + offset], },
            { pos: [2.0590169945, -4.1770509835,   0.5590169945], norm: [ 0,  0,  1], uv: [0.875 - offset, 0 + offset], },
            { pos: [0.9409830055, -0.8229490165,   0.5590169945], norm: [ 0,  0,  1], uv: [0.8125 + offset, 0.1875 - offset], },
            { pos: [2.0590169945, -0.8229490165,   0.5590169945], norm: [ 0,  0,  1], uv: [0.875 - offset, 0.1875 - offset], },
            //back left arm layer
            { pos: [2.0590169945, -4.1770509835,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.9375 + offset, 0 + offset], },
            { pos: [0.9409830055, -4.1770509835,  -0.5590169945], norm: [ 0,  0,  -1], uv: [1 - offset, 0 + offset], },
            { pos: [2.0590169945, -0.8229490165,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.9375 + offset, 0.1875 - offset], },
            { pos: [0.9409830055, -0.8229490165,  -0.5590169945], norm: [ 0,  0,  -1], uv: [1 - offset, 0.1875 - offset], },
            //left left arm layer
            { pos: [2.0590169945, -4.1770509835,   0.5590169945], norm: [ 1,  0,  0], uv: [0.875 + offset, 0 + offset], }, 
            { pos: [2.0590169945, -4.1770509835,  -0.5590169945], norm: [ 1,  0,  0], uv: [0.9375 - offset, 0 + offset], },
            { pos: [2.0590169945, -0.8229490165,   0.5590169945], norm: [ 1,  0,  0], uv: [0.875 + offset, 0.1875 - offset], },
            { pos: [2.0590169945, -0.8229490165,  -0.5590169945], norm: [ 1,  0,  0], uv: [0.9375 - offset, 0.1875 - offset], },
            //right left arm layer
            { pos: [0.9409830055, -4.1770509835,  -0.5590169945], norm: [ -1,  0,  0], uv: [0.75 + offset, 0 + offset], }, 
            { pos: [0.9409830055, -4.1770509835,   0.5590169945], norm: [ -1,  0,  0], uv: [0.8125 - offset, 0 + offset], },
            { pos: [0.9409830055, -0.8229490165,  -0.5590169945], norm: [ -1,  0,  0], uv: [0.75 + offset, 0.1875 - offset], },
            { pos: [0.9409830055, -0.8229490165,   0.5590169945], norm: [ -1,  0,  0], uv: [0.8125 - offset, 0.1875 - offset], },
            //top left arm layer
            { pos: [0.9409830055,  -0.8229490165,  0.5590169945], norm: [ 0,  1,  0], uv: [0.8125 + offset, 0.1875 + offset], },
            { pos: [2.0590169945,  -0.8229490165,  0.5590169945], norm: [ 0,  1,  0], uv: [0.875 - offset, 0.1875 + offset], },
            { pos: [0.9409830055,  -0.8229490165, -0.5590169945], norm: [ 0,  1,  0], uv: [0.8125 + offset, 0.25 - offset], },
            { pos: [2.0590169945,  -0.8229490165, -0.5590169945], norm: [ 0,  1,  0], uv: [0.875 - offset, 0.25 - offset], },
            //bottom left arm layer
            { pos: [2.0590169945, -4.1770509835,  0.5590169945], norm: [ 0, -1,  0], uv: [0.9375 - offset, 0.1875 + offset], },
            { pos: [0.9409830055, -4.1770509835,  0.5590169945], norm: [ 0, -1,  0], uv: [0.875 + offset, 0.1875 + offset], },
            { pos: [2.0590169945, -4.1770509835, -0.5590169945], norm: [ 0, -1,  0], uv: [0.9375 - offset, 0.25 - offset], },
            { pos: [0.9409830055, -4.1770509835, -0.5590169945], norm: [ 0, -1,  0], uv: [0.875 + offset, 0.25 - offset], },
        ];
    
        const verticesRightLegLayer = [
            //front right leg layer
            { pos: [-1.0590169945, -7.1770509835,   0.5590169945], norm: [ 0,  0,  1], uv: [0.0625 + offset, 0.25 + offset], },
            { pos: [ 0.0590169945, -7.1770509835,   0.5590169945], norm: [ 0,  0,  1], uv: [0.125 - offset, 0.25 + offset], },
            { pos: [-1.0590169945, -3.8229490165,   0.5590169945], norm: [ 0,  0,  1], uv: [0.0625 + offset, 0.4375 - offset], },
            { pos: [ 0.0590169945, -3.8229490165,   0.5590169945], norm: [ 0,  0,  1], uv: [0.125 - offset, 0.4375 - offset], },
            //back right leg layer
            { pos: [ 0.0590169945, -7.1770509835,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.1875 + offset, 0.25 + offset], },
            { pos: [-1.0590169945, -7.1770509835,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.25 - offset, 0.25 + offset], },
            { pos: [ 0.0590169945, -3.8229490165,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.1875 + offset, 0.4375 - offset], },
            { pos: [-1.0590169945, -3.8229490165,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.25 - offset, 0.4375 - offset], },
            //left right leg layer
            { pos: [ 0.0590169945, -7.1770509835,   0.5590169945], norm: [ 1,  0,  0], uv: [0.125 + offset, 0.25 + offset], }, 
            { pos: [ 0.0590169945, -7.1770509835,  -0.5590169945], norm: [ 1,  0,  0], uv: [0.1875 - offset, 0.25 + offset], },
            { pos: [ 0.0590169945, -3.8229490165,   0.5590169945], norm: [ 1,  0,  0], uv: [0.125 + offset, 0.4375 - offset], },
            { pos: [ 0.0590169945, -3.8229490165,  -0.5590169945], norm: [ 1,  0,  0], uv: [0.1875 - offset, 0.4375 - offset], },
            //right right leg layer
            { pos: [-1.0590169945, -7.1770509835,  -0.5590169945], norm: [ -1,  0,  0], uv: [0 + offset, 0.25 + offset], }, 
            { pos: [-1.0590169945, -7.1770509835,   0.5590169945], norm: [ -1,  0,  0], uv: [0.0625 - offset, 0.25 + offset], },
            { pos: [-1.0590169945, -3.8229490165,  -0.5590169945], norm: [ -1,  0,  0], uv: [0 + offset, 0.4375 - offset], },
            { pos: [-1.0590169945, -3.8229490165,   0.5590169945], norm: [ -1,  0,  0], uv: [0.0625 - offset, 0.4375 - offset], },
            //top right leg layer
            { pos: [-1.0590169945, -3.8229490165,  0.5590169945], norm: [ 0,  1,  0], uv: [0.0625 + offset, 0.4375 + offset], },
            { pos: [ 0.0590169945, -3.8229490165,  0.5590169945], norm: [ 0,  1,  0], uv: [0.125 - offset, 0.4375 + offset], },
            { pos: [-1.0590169945, -3.8229490165, -0.5590169945], norm: [ 0,  1,  0], uv: [0.0625 + offset, 0.5 - offset], },
            { pos: [ 0.0590169945, -3.8229490165, -0.5590169945], norm: [ 0,  1,  0], uv: [0.125 - offset, 0.5 - offset], },
            //bottom right leg layer
            { pos: [ 0.0590169945, -7.1770509835,  0.5590169945], norm: [ 0, -1,  0], uv: [0.1875 - offset, 0.4375 + offset], },
            { pos: [-1.0590169945, -7.1770509835,  0.5590169945], norm: [ 0, -1,  0], uv: [0.125 + offset, 0.4375 + offset], },
            { pos: [ 0.0590169945, -7.1770509835, -0.5590169945], norm: [ 0, -1,  0], uv: [0.1875 - offset, 0.5 - offset], },
            { pos: [-1.0590169945, -7.1770509835, -0.5590169945], norm: [ 0, -1,  0], uv: [0.125 + offset, 0.5 - offset], },
        ];
    
        const verticesLeftLegLayer = [
            //front left leg layer
            { pos: [-0.0590169945, -7.1770509835,   0.5590169945], norm: [ 0,  0,  1], uv: [0.0625 + offset, 0 + offset], },
            { pos: [1.0590169945, -7.1770509835,   0.5590169945], norm: [ 0,  0,  1], uv: [0.125 - offset, 0 + offset], },
            { pos: [-0.0590169945, -3.8229490165,   0.5590169945], norm: [ 0,  0,  1], uv: [0.0625 + offset, 0.1875 - offset], },
            { pos: [1.0590169945, -3.8229490165,   0.5590169945], norm: [ 0,  0,  1], uv: [0.125 - offset, 0.1875 - offset], },
            //back left leg layer
            { pos: [1.0590169945, -7.1770509835,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.1875 + offset, 0 + offset], },
            { pos: [-0.0590169945, -7.1770509835,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.25 - offset, 0 + offset], },
            { pos: [1.0590169945, -3.8229490165,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.1875 + offset, 0.1875 - offset], },
            { pos: [-0.0590169945, -3.8229490165,  -0.5590169945], norm: [ 0,  0,  -1], uv: [0.25 - offset, 0.1875 - offset], },
            //left left leg layer
            { pos: [1.0590169945, -7.1770509835,   0.5590169945], norm: [ 1,  0,  0], uv: [0.125 + offset, 0 + offset], }, 
            { pos: [1.0590169945, -7.1770509835,  -0.5590169945], norm: [ 1,  0,  0], uv: [0.1875 - offset, 0 + offset], },
            { pos: [1.0590169945, -3.8229490165,   0.5590169945], norm: [ 1,  0,  0], uv: [0.125 + offset, 0.1875 - offset], },
            { pos: [1.0590169945, -3.8229490165,  -0.5590169945], norm: [ 1,  0,  0], uv: [0.1875 - offset, 0.1875 - offset], },
            //right left leg layer
            { pos: [-0.0590169945, -7.1770509835,  -0.5590169945], norm: [ -1,  0,  0], uv: [0 + offset, 0 + offset], }, 
            { pos: [-0.0590169945, -7.1770509835,   0.5590169945], norm: [ -1,  0,  0], uv: [0.0625 - offset, 0 + offset], },
            { pos: [-0.0590169945, -3.8229490165,  -0.5590169945], norm: [ -1,  0,  0], uv: [0 + offset, 0.1875 - offset], },
            { pos: [-0.0590169945, -3.8229490165,   0.5590169945], norm: [ -1,  0,  0], uv: [0.0625 - offset, 0.1875 - offset], },
            //top left leg layer
            { pos: [-0.0590169945,  -3.8229490165,  0.5590169945], norm: [ 0,  1,  0], uv: [0.0625 + offset, 0.1875 + offset], },
            { pos: [1.0590169945,  -3.8229490165,  0.5590169945], norm: [ 0,  1,  0], uv: [0.125 - offset, 0.1875 + offset], },
            { pos: [-0.0590169945,  -3.8229490165, -0.5590169945], norm: [ 0,  1,  0], uv: [0.0625 + offset, 0.25 - offset], },
            { pos: [1.0590169945,  -3.8229490165, -0.5590169945], norm: [ 0,  1,  0], uv: [0.125 - offset, 0.25 - offset], },
            //bottom left leg layer
            { pos: [1.0590169945, -7.1770509835,  0.5590169945], norm: [ 0, -1,  0], uv: [0.1875 - offset, 0.1875 + offset], },
            { pos: [-0.0590169945, -7.1770509835,  0.5590169945], norm: [ 0, -1,  0], uv: [0.125 + offset, 0.1875 + offset], },
            { pos: [1.0590169945, -7.1770509835, -0.5590169945], norm: [ 0, -1,  0], uv: [0.1875 - offset, 0.25 - offset], },
            { pos: [-0.0590169945, -7.1770509835, -0.5590169945], norm: [ 0, -1,  0], uv: [0.125 + offset, 0.25 - offset], },
        ];
    
        const verticesHeadLayer = [
            // front head layer
            { pos: [-1.22474487139, -1.22474487139,  1.22474487139], norm: [ 0,  0,  1], uv: [0.625 + offset, 0.75 + offset], },
            { pos: [ 1.22474487139, -1.22474487139,  1.22474487139], norm: [ 0,  0,  1], uv: [0.75 - offset, 0.75 + offset], },
            { pos: [-1.22474487139,  1.22474487139,  1.22474487139], norm: [ 0,  0,  1], uv: [0.625 + offset, 0.875 - offset], },
            { pos: [ 1.22474487139,  1.22474487139,  1.22474487139], norm: [ 0,  0,  1], uv: [0.75 - offset, 0.875 - offset], },
            // back head layer
            { pos: [ 1.22474487139, -1.22474487139, -1.22474487139], norm: [ 0,  0, -1], uv: [0.875 + offset, 0.75 + offset], },
            { pos: [-1.22474487139, -1.22474487139, -1.22474487139], norm: [ 0,  0, -1], uv: [1 - offset, 0.75 + offset], },
            { pos: [ 1.22474487139,  1.22474487139, -1.22474487139], norm: [ 0,  0, -1], uv: [0.875 + offset, 0.875 - offset], },
            { pos: [-1.22474487139,  1.22474487139, -1.22474487139], norm: [ 0,  0, -1], uv: [1 - offset, 0.875 - offset], },
            // left head layer
            { pos: [ 1.22474487139, -1.22474487139,  1.22474487139], norm: [ 1,  0,  0], uv: [0.75 + offset,  0.75 + offset], },
            { pos: [ 1.22474487139, -1.22474487139, -1.22474487139], norm: [ 1,  0,  0], uv: [0.875 - offset,  0.75 + offset], },
            { pos: [ 1.22474487139,  1.22474487139,  1.22474487139], norm: [ 1,  0,  0], uv: [0.75 + offset, 0.875 - offset], },
            { pos: [ 1.22474487139,  1.22474487139, -1.22474487139], norm: [ 1,  0,  0], uv: [0.875 - offset, 0.875 - offset], },
            // right head layer
            { pos: [-1.22474487139, -1.22474487139, -1.22474487139], norm: [-1,  0,  0], uv: [0.5 + offset, 0.75 + offset], },
            { pos: [-1.22474487139, -1.22474487139,  1.22474487139], norm: [-1,  0,  0], uv: [0.625 - offset, 0.75 + offset], },
            { pos: [-1.22474487139,  1.22474487139, -1.22474487139], norm: [-1,  0,  0], uv: [0.5 + offset, 0.875 - offset], },
            { pos: [-1.22474487139,  1.22474487139,  1.22474487139], norm: [-1,  0,  0], uv: [0.625 - offset, 0.875 - offset], },
            // top head layer
            { pos: [ 1.22474487139,  1.22474487139, -1.22474487139], norm: [ 0,  1,  0], uv: [0.625 + offset, 1 - offset], }, 
            { pos: [-1.22474487139,  1.22474487139, -1.22474487139], norm: [ 0,  1,  0], uv: [0.75 - offset, 1 - offset], },
            { pos: [ 1.22474487139,  1.22474487139,  1.22474487139], norm: [ 0,  1,  0], uv: [0.625 + offset, 0.875 + offset], },
            { pos: [-1.22474487139,  1.22474487139,  1.22474487139], norm: [ 0,  1,  0], uv: [0.75 - offset, 0.875 + offset], },
            // bottom head layer
            { pos: [ 1.22474487139, -1.22474487139,  1.22474487139], norm: [ 0, -1,  0], uv: [0.75 + offset, 0.875 + offset], },
            { pos: [-1.22474487139, -1.22474487139,  1.22474487139], norm: [ 0, -1,  0], uv: [0.875 - offset, 0.875 + offset], },
            { pos: [ 1.22474487139, -1.22474487139, -1.22474487139], norm: [ 0, -1,  0], uv: [0.75 + offset, 1 - offset], },
            { pos: [-1.22474487139, -1.22474487139, -1.22474487139], norm: [ 0, -1,  0], uv: [0.875 - offset, 1 - offset], },
        ];

        const verticesOldHead = [
            // front
            { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0.125 + offset, 0.5 + offset], },
            { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [0.25 - offset, 0.5 + offset], },
            { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0.125 + offset, 0.75 - offset], },
            { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [0.25 - offset, 0.75 - offset], },
            // back
            { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0.375 + offset, 0.5 + offset], },
            { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [0.5 - offset, 0.5 + offset], },
            { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0.375 + offset, 0.75 - offset], },
            { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [0.5 - offset, 0.75 - offset], },
            // left
            { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0.25 + offset,  0.5 + offset], },
            { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [0.375 - offset,  0.5 + offset], },
            { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0.25 + offset, 0.75 - offset], },
            { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [0.375 - offset, 0.75 - offset], },
            // right
            { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0 + offset, 0.5 + offset], },
            { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [0.125 - offset, 0.5 + offset], },
            { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0 + offset, 0.75 - offset], },
            { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [0.125 - offset, 0.75 - offset], },
            // top
            { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0.125 + offset, 1 - offset], }, 
            { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [0.25 - offset, 1 - offset], },
            { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0.125 + offset, 0.75 + offset], },
            { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [0.25 - offset, 0.75 + offset], },
            // bottom
            { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0.25 + offset, 0.75 + offset], },
            { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [0.375 - offset, 0.75 + offset], },
            { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0.25 + offset, 1 - offset], },
            { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [0.375 - offset, 1 - offset], },
        ];

        const verticesOldBody = [
            // front body
            { pos: [-1, -4,  0.5], norm: [ 0,  0,  1], uv: [0.3125 + offset, 0 + offset], },
            { pos: [ 1, -4,  0.5], norm: [ 0,  0,  1], uv: [0.4375 - offset, 0 + offset], },
            { pos: [-1, -1,  0.5], norm: [ 0,  0,  1], uv: [0.3125 + offset, 0.375 - offset], },
            { pos: [ 1, -1,  0.5], norm: [ 0,  0,  1], uv: [0.4375 - offset, 0.375 - offset], },
            // back body
            { pos: [ 1, -4, -0.5], norm: [ 0,  0, -1], uv: [0.5 + offset, 0 + offset], },
            { pos: [-1, -4, -0.5], norm: [ 0,  0, -1], uv: [0.625 - offset, 0 + offset], },
            { pos: [ 1, -1, -0.5], norm: [ 0,  0, -1], uv: [0.5 + offset, 0.375 - offset], },
            { pos: [-1, -1, -0.5], norm: [ 0,  0, -1], uv: [0.625 - offset, 0.375 - offset], },
            // left body
            { pos: [ 1, -4,  0.5], norm: [ 1,  0,  0], uv: [0.4375 + offset,  0 + offset], },
            { pos: [ 1, -4, -0.5], norm: [ 1,  0,  0], uv: [0.5 - offset,  0 + offset], },
            { pos: [ 1, -1,  0.5], norm: [ 1,  0,  0], uv: [0.4375 + offset, 0.375 - offset], },
            { pos: [ 1, -1, -0.5], norm: [ 1,  0,  0], uv: [0.5 - offset, 0.375 - offset], },
            // right body
            { pos: [-1, -4, -0.5], norm: [-1,  0,  0], uv: [0.25 + offset, 0 + offset], },
            { pos: [-1, -4,  0.5], norm: [-1,  0,  0], uv: [0.3125 - offset, 0 + offset], },
            { pos: [-1, -1, -0.5], norm: [-1,  0,  0], uv: [0.25 + offset, 0.375 - offset], },
            { pos: [-1, -1,  0.5], norm: [-1,  0,  0], uv: [0.3125 - offset, 0.375 - offset], },
            //top body
            { pos: [ 1,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.3125 + offset, 0.5 - offset], }, 
            { pos: [-1,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.4375 - offset, 0.5 - offset], },
            { pos: [ 1,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.3125 + offset, 0.375 + offset], },
            { pos: [-1,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.4375 - offset, 0.375 + offset], },
            // bottom body
            { pos: [ 1, -4,  0.5], norm: [ 0, -1,  0], uv: [0.4375 + offset, 0.5 - offset], },
            { pos: [-1, -4,  0.5], norm: [ 0, -1,  0], uv: [0.5625 - offset, 0.5 - offset], },
            { pos: [ 1, -4, -0.5], norm: [ 0, -1,  0], uv: [0.4375 + offset, 0.375 + offset], },
            { pos: [-1, -4, -0.5], norm: [ 0, -1,  0], uv: [0.5625 - offset, 0.375 + offset], },
        ];
    
        const verticesOldRightArm = [
            //front right arm
            { pos: [-2, -4,   0.5], norm: [ 0,  0,  1], uv: [0.6875 + offset, 0 + offset], },
            { pos: [-1, -4,   0.5], norm: [ 0,  0,  1], uv: [0.75 - offset, 0 + offset], },
            { pos: [-2, -1,   0.5], norm: [ 0,  0,  1], uv: [0.6875 + offset, 0.375 - offset], },
            { pos: [-1, -1,   0.5], norm: [ 0,  0,  1], uv: [0.75 - offset, 0.375 - offset], },
            //back right arm
            { pos: [-1, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.8125 + offset, 0 + offset], },
            { pos: [-2, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.875 - offset, 0 + offset], },
            { pos: [-1, -1,  -0.5], norm: [ 0,  0,  -1], uv: [0.8125 + offset, 0.375 - offset], },
            { pos: [-2, -1,  -0.5], norm: [ 0,  0,  -1], uv: [0.875 - offset, 0.375 - offset], },
            //left right arm
            { pos: [-1, -4,   0.5], norm: [ 1,  0,  0], uv: [0.75 + offset, 0 + offset], }, 
            { pos: [-1, -4,  -0.5], norm: [ 1,  0,  0], uv: [0.8125 - offset, 0 + offset], },
            { pos: [-1, -1,   0.5], norm: [ 1,  0,  0], uv: [0.75 + offset, 0.375 - offset], },
            { pos: [-1, -1,  -0.5], norm: [ 1,  0,  0], uv: [0.8125 - offset, 0.375 - offset], },
            //right right arm
            { pos: [-2, -4,  -0.5], norm: [ -1,  0,  0], uv: [0.625 + offset, 0 + offset], }, 
            { pos: [-2, -4,   0.5], norm: [ -1,  0,  0], uv: [0.6875 - offset, 0 + offset], },
            { pos: [-2, -1,  -0.5], norm: [ -1,  0,  0], uv: [0.625 + offset, 0.375 - offset], },
            { pos: [-2, -1,   0.5], norm: [ -1,  0,  0], uv: [0.6875 - offset, 0.375 - offset], },
            //top right arm
            { pos: [-2,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.6875 + offset, 0.375 + offset], },
            { pos: [-1,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.75 - offset, 0.375 + offset], },
            { pos: [-2,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.6875 + offset, 0.5 - offset], },
            { pos: [-1,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.75 - offset, 0.5 - offset], },
            //bottom right arm
            { pos: [-1, -4,  0.5], norm: [ 0, -1,  0], uv: [0.8125 - offset, 0.375 + offset], },
            { pos: [-2, -4,  0.5], norm: [ 0, -1,  0], uv: [0.75 + offset, 0.375 + offset], },
            { pos: [-1, -4, -0.5], norm: [ 0, -1,  0], uv: [0.8125 - offset, 0.5 - offset], },
            { pos: [-2, -4, -0.5], norm: [ 0, -1,  0], uv: [0.75 + offset, 0.5 - offset], },
        ];
    
        const verticesOldLeftArm = [
            //front left arm
            { pos: [1, -4,   0.5], norm: [ 0,  0,  1], uv: [0.75 - offset, 0 + offset], },
            { pos: [2, -4,   0.5], norm: [ 0,  0,  1], uv: [0.6875 + offset, 0 + offset], },
            { pos: [1, -1,   0.5], norm: [ 0,  0,  1], uv: [0.75 - offset, 0.375 - offset], },
            { pos: [2, -1,   0.5], norm: [ 0,  0,  1], uv: [0.6875 + offset, 0.375 - offset], },
            //back left arm
            { pos: [2, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.875 - offset, 0 + offset], },
            { pos: [1, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.8125 + offset, 0 + offset], },
            { pos: [2, -1,  -0.5], norm: [ 0,  0,  -1], uv: [0.875 - offset, 0.375 - offset], },
            { pos: [1, -1,  -0.5], norm: [ 0,  0,  -1], uv: [0.8125 + offset, 0.375 - offset], },
            //left left arm
            { pos: [2, -4,   0.5], norm: [ 1,  0,  0], uv: [0.8125 - offset, 0 + offset], }, 
            { pos: [2, -4,  -0.5], norm: [ 1,  0,  0], uv: [0.75 + offset, 0 + offset], },
            { pos: [2, -1,   0.5], norm: [ 1,  0,  0], uv: [0.8125 - offset, 0.375 - offset], },
            { pos: [2, -1,  -0.5], norm: [ 1,  0,  0], uv: [0.75 + offset, 0.375 - offset], },
            //right left arm
            { pos: [1, -4,  -0.5], norm: [ -1,  0,  0], uv: [0.6875 - offset, 0 + offset], }, 
            { pos: [1, -4,   0.5], norm: [ -1,  0,  0], uv: [0.625 + offset, 0 + offset], },
            { pos: [1, -1,  -0.5], norm: [ -1,  0,  0], uv: [0.6875 - offset, 0.375 - offset], },
            { pos: [1, -1,   0.5], norm: [ -1,  0,  0], uv: [0.625 + offset, 0.375 - offset], },
            //top left arm
            { pos: [1,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.75 - offset, 0.375 + offset], },
            { pos: [2,  -1,  0.5], norm: [ 0,  1,  0], uv: [0.6875 + offset, 0.375 + offset], },
            { pos: [1,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.75 - offset, 0.5 - offset], },
            { pos: [2,  -1, -0.5], norm: [ 0,  1,  0], uv: [0.6875 + offset, 0.5 - offset], },
            //bottom left arm
            { pos: [2, -4,  0.5], norm: [ 0, -1,  0], uv: [0.75 + offset, 0.375 + offset], },
            { pos: [1, -4,  0.5], norm: [ 0, -1,  0], uv: [0.8125 - offset, 0.375 + offset], },
            { pos: [2, -4, -0.5], norm: [ 0, -1,  0], uv: [0.75 + offset, 0.5 - offset], },
            { pos: [1, -4, -0.5], norm: [ 0, -1,  0], uv: [0.8125 - offset, 0.5 - offset], },
        ];
    
        const verticesOldRightLeg = [
            //front right leg
            { pos: [-1, -7,   0.5], norm: [ 0,  0,  1], uv: [0.0625 + offset, 0 + offset], },
            { pos: [ 0, -7,   0.5], norm: [ 0,  0,  1], uv: [0.125 - offset, 0 + offset], },
            { pos: [-1, -4,   0.5], norm: [ 0,  0,  1], uv: [0.0625 + offset, 0.375 - offset], },
            { pos: [ 0, -4,   0.5], norm: [ 0,  0,  1], uv: [0.125 - offset, 0.375 - offset], },
            //back right leg
            { pos: [ 0, -7,  -0.5], norm: [ 0,  0,  -1], uv: [0.1875 + offset, 0 + offset], },
            { pos: [-1, -7,  -0.5], norm: [ 0,  0,  -1], uv: [0.25 - offset, 0 + offset], },
            { pos: [ 0, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.1875 + offset, 0.375 - offset], },
            { pos: [-1, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.25 - offset, 0.375 - offset], },
            //left right leg
            { pos: [ 0, -7,   0.5], norm: [ 1,  0,  0], uv: [0.125 + offset, 0 + offset], }, 
            { pos: [ 0, -7,  -0.5], norm: [ 1,  0,  0], uv: [0.1875 - offset, 0 + offset], },
            { pos: [ 0, -4,   0.5], norm: [ 1,  0,  0], uv: [0.125 + offset, 0.375 - offset], },
            { pos: [ 0, -4,  -0.5], norm: [ 1,  0,  0], uv: [0.1875 - offset, 0.375 - offset], },
            //right right leg
            { pos: [-1, -7,  -0.5], norm: [ -1,  0,  0], uv: [0 + offset, 0 + offset], }, 
            { pos: [-1, -7,   0.5], norm: [ -1,  0,  0], uv: [0.0625 - offset, 0 + offset], },
            { pos: [-1, -4,  -0.5], norm: [ -1,  0,  0], uv: [0 + offset, 0.375 - offset], },
            { pos: [-1, -4,   0.5], norm: [ -1,  0,  0], uv: [0.0625 - offset, 0.375 - offset], },
            //top right leg
            { pos: [-1, -4,  0.5], norm: [ 0,  1,  0], uv: [0.0625 + offset, 0.375 + offset], },
            { pos: [ 0, -4,  0.5], norm: [ 0,  1,  0], uv: [0.125 - offset, 0.375 + offset], },
            { pos: [-1, -4, -0.5], norm: [ 0,  1,  0], uv: [0.0625 + offset, 0.5 - offset], },
            { pos: [ 0, -4, -0.5], norm: [ 0,  1,  0], uv: [0.125 - offset, 0.5 - offset], },
            //bottom right leg
            { pos: [ 0, -7,  0.5], norm: [ 0, -1,  0], uv: [0.1875 - offset, 0.375 + offset], },
            { pos: [-1, -7,  0.5], norm: [ 0, -1,  0], uv: [0.125 + offset, 0.375 + offset], },
            { pos: [ 0, -7, -0.5], norm: [ 0, -1,  0], uv: [0.1875 - offset, 0.5 - offset], },
            { pos: [-1, -7, -0.5], norm: [ 0, -1,  0], uv: [0.125 + offset, 0.5 - offset], },
        ];
    
        const verticesOldLeftLeg = [
            //front left leg
            { pos: [0, -7,   0.5], norm: [ 0,  0,  1], uv: [0.125 - offset, 0 + offset], },
            { pos: [1, -7,   0.5], norm: [ 0,  0,  1], uv: [0.0625 + offset, 0 + offset], },
            { pos: [0, -4,   0.5], norm: [ 0,  0,  1], uv: [0.125 - offset, 0.375 - offset], },
            { pos: [1, -4,   0.5], norm: [ 0,  0,  1], uv: [0.0625 + offset, 0.375 - offset], },
            //back left leg
            { pos: [1, -7,  -0.5], norm: [ 0,  0,  -1], uv: [0.25 - offset, 0 + offset], },
            { pos: [0, -7,  -0.5], norm: [ 0,  0,  -1], uv: [0.1875 + offset, 0 + offset], },
            { pos: [1, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.25 - offset, 0.375 - offset], },
            { pos: [0, -4,  -0.5], norm: [ 0,  0,  -1], uv: [0.1875 + offset, 0.375 - offset], },
            //left left leg
            { pos: [1, -7,   0.5], norm: [ 1,  0,  0], uv: [0.1875 - offset, 0 + offset], }, 
            { pos: [1, -7,  -0.5], norm: [ 1,  0,  0], uv: [0.125 + offset, 0 + offset], },
            { pos: [1, -4,   0.5], norm: [ 1,  0,  0], uv: [0.1875 - offset, 0.375 - offset], },
            { pos: [1, -4,  -0.5], norm: [ 1,  0,  0], uv: [0.125 + offset, 0.375 - offset], },
            //right left leg
            { pos: [0, -7,  -0.5], norm: [ -1,  0,  0], uv: [0.0625 - offset, 0 + offset], }, 
            { pos: [0, -7,   0.5], norm: [ -1,  0,  0], uv: [0 + offset, 0 + offset], },
            { pos: [0, -4,  -0.5], norm: [ -1,  0,  0], uv: [0.0625 - offset, 0.375 - offset], },
            { pos: [0, -4,   0.5], norm: [ -1,  0,  0], uv: [0 + offset, 0.375 - offset], },
            //top left leg
            { pos: [0,  -4,  0.5], norm: [ 0,  1,  0], uv: [0.125 - offset, 0.375 + offset], },
            { pos: [1,  -4,  0.5], norm: [ 0,  1,  0], uv: [0.0625 + offset, 0.375 + offset], },
            { pos: [0,  -4, -0.5], norm: [ 0,  1,  0], uv: [0.125 - offset, 0.5 - offset], },
            { pos: [1,  -4, -0.5], norm: [ 0,  1,  0], uv: [0.0625 + offset, 0.5 - offset], },
            //bottom left leg
            { pos: [1, -7,  0.5], norm: [ 0, -1,  0], uv: [0.125 + offset, 0.375 + offset], },
            { pos: [0, -7,  0.5], norm: [ 0, -1,  0], uv: [0.1875 - offset, 0.375 + offset], },
            { pos: [1, -7, -0.5], norm: [ 0, -1,  0], uv: [0.125 + offset, 0.5 - offset], },
            { pos: [0, -7, -0.5], norm: [ 0, -1,  0], uv: [0.1875 - offset, 0.5 - offset], },
        ];
    
        let bodyParts = [];
        let bodyPartsLayers = [];
        let oldSkin = false;
    
        if (img.width == 64 && img.height == 64) 
        {
            oldSkin = false;
            bodyParts = [
                verticesBody,
                verticesRightArm,
                verticesLeftArm,
                verticesRightLeg,
                verticesLeftLeg,
                verticesHead,
            ];
            bodyPartsLayers = [
                verticesBodyLayer,
                verticesRightArmLayer,
                verticesLeftArmLayer,
                verticesRightLegLayer,
                verticesLeftLegLayer,
                verticesHeadLayer,
            ];
        } 
        else if (img.width == 64 && img.height == 32)
        {
            oldSkin = true;
            bodyParts = [
                verticesOldBody,
                verticesOldRightArm,
                verticesOldLeftArm,
                verticesOldRightLeg,
                verticesOldLeftLeg,
                verticesOldHead,
            ];
        }
        const numVertices = 24;
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        const uvNumComponents = 2;
    
        const groupBodyParts = new THREE.Group();
    
        for(let i = 0; i < bodyParts.length; i++) 
        {
            const positions = new Float32Array(numVertices * positionNumComponents);
            const normals = new Float32Array(numVertices * normalNumComponents);
            const uvs = new Float32Array(numVertices * uvNumComponents);
            let posNdx = 0;
            let nrmNdx = 0;
            let uvNdx = 0;
    
            for (const vertex of bodyParts[i]) {
                positions.set(vertex.pos, posNdx);
                normals.set(vertex.norm, nrmNdx);
                uvs.set(vertex.uv, uvNdx);
                posNdx += positionNumComponents;
                nrmNdx += normalNumComponents;
                uvNdx += uvNumComponents;
            }
    
            const geometry = new THREE.BufferGeometry();
    
            geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, positionNumComponents));
            geometry.setAttribute(
                'normal',
                new THREE.BufferAttribute(normals, normalNumComponents));
            geometry.setAttribute(
                'uv',
                new THREE.BufferAttribute(uvs, uvNumComponents));
    
            geometry.setIndex([
                0, 1, 2,  2, 1, 3,  // front
                4, 5, 6,  6, 5, 7,  // back
                8, 9, 10,  10, 9, 11,  // left
                12, 13, 14,  14, 13, 15,  // right
                16, 17, 18,  18, 17, 19,  // top
                20, 21, 22,  22, 21, 23,  // bottom
            ]);
    
            const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, depthWrite: true} );
    
            const pivot = new THREE.Object3D();
            const cube = new THREE.Mesh( geometry, material );
    
            pivot.add(cube);
            groupBodyParts.add(pivot);
        }
    
        const groupBodyPartsLayers = new THREE.Group();
    
        for(let i = 0; i < bodyPartsLayers.length; i++) 
        {
            const positions = new Float32Array(numVertices * positionNumComponents);
            const normals = new Float32Array(numVertices * normalNumComponents);
            const uvs = new Float32Array(numVertices * uvNumComponents);
            let posNdx = 0;
            let nrmNdx = 0;
            let uvNdx = 0;
    
            for (const vertex of bodyPartsLayers[i]) {
                positions.set(vertex.pos, posNdx);
                normals.set(vertex.norm, nrmNdx);
                uvs.set(vertex.uv, uvNdx);
                posNdx += positionNumComponents;
                nrmNdx += normalNumComponents;
                uvNdx += uvNumComponents;
            }
    
            const geometry = new THREE.BufferGeometry();
    
            geometry.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, positionNumComponents));
            geometry.setAttribute(
                'normal',
                new THREE.BufferAttribute(normals, normalNumComponents));
            geometry.setAttribute(
                'uv',
                new THREE.BufferAttribute(uvs, uvNumComponents));
    
            geometry.setIndex([
                0, 1, 2,  2, 1, 3,  // front
                4, 5, 6,  6, 5, 7,  // back
                8, 9, 10,  10, 9, 11,  // left
                12, 13, 14,  14, 13, 15,  // right
                16, 17, 18,  18, 17, 19,  // top
                20, 21, 22,  22, 21, 23,  // bottom
            ]);
    
            const material = new THREE.MeshBasicMaterial( { transparent: true, map: texture, side: THREE.DoubleSide, depthWrite: false } );
    
            const pivot = new THREE.Object3D();
            const cube = new THREE.Mesh( geometry, material );
    
            pivot.add(cube);
            groupBodyPartsLayers.add(pivot);
        }
    
        for(let i = 1; i < 3; i++)
        {
            groupBodyParts.children[i].children[0].position.set(0, 1.5, 0);
            groupBodyParts.children[i].position.set(0, -1.5, 0);

            if(!oldSkin)
            {
                groupBodyPartsLayers.children[i].children[0].position.set(0, 1.5, 0);
                groupBodyPartsLayers.children[i].position.set(0, -1.5, 0);
            }
        }
        
        for(let i = 3; i < 5; i++)
        {
            groupBodyParts.children[i].children[0].position.set(0, 4.5, 0);
            groupBodyParts.children[i].position.set(0, -4.5, 0);

            if(!oldSkin)
            {
                groupBodyPartsLayers.children[i].children[0].position.set(0, 4.5, 0);
                groupBodyPartsLayers.children[i].position.set(0, -4.5, 0);
            }
        }
    
        const body = new THREE.Group();
        body.add(groupBodyParts);
        body.add(groupBodyPartsLayers);
    
        scene.add(body);
        renderer.render(scene, camera);
        
        let targetLimbTime = 0;
        let limbTime = 0;
        let signChange = 1;
        const lerpFactor = 0.05; // Adjust this value to control the smoothness
        
        function render(time)
        {
            time *= 0.0005;
    
            //body.rotation.x = time;
            body.rotation.y = time;
    
            if (targetLimbTime > 0.5 || targetLimbTime < -0.5) 
            {
                signChange *= -1;
            }
            
            targetLimbTime += (signChange * 0.005);
    
            limbTime = THREE.MathUtils.lerp(limbTime, targetLimbTime, lerpFactor);

            groupBodyParts.children[2].rotation.x = limbTime;
            groupBodyParts.children[1].rotation.x = -limbTime;
            groupBodyParts.children[3].rotation.x = limbTime;
            groupBodyParts.children[4].rotation.x = -limbTime;

            if(!oldSkin)
            {
                groupBodyPartsLayers.children[2].rotation.x = limbTime;
                groupBodyPartsLayers.children[1].rotation.x = -limbTime;
                groupBodyPartsLayers.children[3].rotation.x = limbTime;
                groupBodyPartsLayers.children[4].rotation.x = -limbTime;
            }
    
            renderer.render(scene, camera);
    
            requestAnimationFrame(render);
        }
    
        requestAnimationFrame(render);
    }

    img.onerror = () => {
        console.error('Failed to load the image.');
        // Handle the error
    };
}
