import * as THREE from "three";
import { GameObject } from "@engine/gameObject";
import {Water} from 'three/examples/jsm/objects/Water';
import WaterNormalsTexture from '@renderer/assets/textures/waternormals.jpg';
import Renderer from "@renderer/components/Renderer.vue";
import { RendererManager } from "../../renderer/src/rendererManager";

export class WaterGO extends GameObject {
    constructor() {
        super('Ocean');
        // Water

				const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

				const water = new Water(
					waterGeometry,
					{
						textureWidth: 512,
						textureHeight: 512,
						waterNormals: new THREE.TextureLoader().load(WaterNormalsTexture, function ( texture ) {

							texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

						} ),
						sunDirection: new THREE.Vector3(),
						sunColor: 0xffffff,
						waterColor: 0x001e0f,
						distortionScale: 3.7,
						fog: RendererManager.getMainScene().fog !== undefined
					}
				);

				water.rotation.x = - Math.PI / 2;

                this.add(water);

    }
}