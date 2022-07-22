
export class Game {
    static getVarClassName() {
      return '__'+Game.name;
    }

    static getDistClassFilePath() {
        return '../../../dist/src/game.js';
    }

    static deltaTime = 0;
}