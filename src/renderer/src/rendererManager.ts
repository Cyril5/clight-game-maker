export class RendererManager {

    renderer : THREE.WebGLRenderer | undefined;
    scene : THREE.Scene | undefined;
    camera : THREE.Camera | undefined;

    private static instance;
    
    constructor(renderer : THREE.WebGLRenderer, camera : THREE.Camera, scene : THREE.Scene) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
        if(RendererManager.instance === undefined) {
            RendererManager.instance =this;
        }
    }

    static getInstance() : RendererManager {
        return RendererManager.instance;
    }
    
}