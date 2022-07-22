export class Debug {

    static getVarClassName() {
      return '__'+Debug.name;
    }

    static getDistClassFilePath() {
        return '../../../dist/src/debug.js';
    }

    static writeInConsole(msg: string,color: string) {
        const element = '<p style="color: '+color+'">'+msg+'</p>';
        console.log(element);
        //@ts-ignore
        document.getElementById('console').innerHTML += element;
    }
}