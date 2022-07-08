class Editor {

    json;

    gameObjectToExport;
    outputGameObject;

    saveSceneToJSON(scene) {
       this.json = scene.toJSON();
    }

    saveGameObjectToJSON() {
        //this.json = JSON.stringify(gameObject);
        this.json = this.gameObjectToExport.toJSON();
        console.log(this.json);
    }

    loadGameObjectFromJSON() {

        if (this.json) {
            const jsonString = JSON.stringify(this.json);
            var loadedGeometry = JSON.parse(jsonString);
            var loader = new THREE.ObjectLoader();

            this.outputGameObject = loader.parse(loadedGeometry);
            //this.loadedMesh.position.x -= 50;
        }
    }



}
export {Editor}