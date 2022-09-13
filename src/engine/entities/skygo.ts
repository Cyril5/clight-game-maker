import * as THREE from 'three';
import { GameObject } from "@engine/gameObject";
import {Sky} from "three/examples/jsm/objects/Sky";
import Renderer from '@renderer/components/Renderer.vue';
import { RendererManager } from '../../renderer/src/rendererManager';

export class SkyGO extends GameObject {
    constructor() {
        super("Sky");
        // Skybox
        const sky = new Sky();
        sky.scale.setScalar( 450000 );
        this.add( sky );
        
        let sun = new THREE.Vector3();

        const renderer = Renderer.getRenderer();


        const uniforms = sky.material.uniforms;
					uniforms[ 'turbidity' ].value = 10;
					uniforms[ 'rayleigh' ].value = 3;
					uniforms[ 'mieCoefficient' ].value = 0.005;
					uniforms[ 'mieDirectionalG' ].value = 0.7;

					const phi = THREE.MathUtils.degToRad( 90 - 2); // elevation (90-value)
					const theta = THREE.MathUtils.degToRad( 180); // azimuth

					sun.setFromSphericalCoords( 1, phi, theta );

					uniforms[ 'sunPosition' ].value.copy( sun );

					renderer.toneMappingExposure = 0.5; // explosure
					renderer.render( RendererManager.getMainScene(), Renderer.getCamera() );

			
    }
}