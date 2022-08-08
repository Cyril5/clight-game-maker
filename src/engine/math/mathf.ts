export class Mathf {
    static getVarClassName() {
      return '__'+Mathf.name;
    }
    static getDistClassFilePath() {
      return '../../../dist/src/math/mathf.js';
    }

    static degToRad(deg: number) {
        return deg * (Math.PI/180);
    }
}