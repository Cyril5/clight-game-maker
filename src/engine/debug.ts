export class Debug {

    firstDebugTest = 'WAHHH';

    static getVarClassName() {
      return Debug.name;
    }

    static getDistClassFilePath() {
        return '../../../dist/src/debug.js';
    }

    static writeInConsole(msg: string,color: string='#ffffff') {
        const element = '<p style="color: '+color+'">'+msg+'</p>';
        //@ts-ignore
        document.getElementById('console').innerHTML += element;
    }
}