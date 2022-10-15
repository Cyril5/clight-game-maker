import {GameObject} from '@engine/gameObject'

// Base for all components
export class Component {

    private _gameObject: GameObject;
    
    constructor(gameObject : GameObject) {
      this._gameObject = gameObject;
    }
    update() {
    }
  }