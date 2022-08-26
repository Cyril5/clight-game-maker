export class StateFile {

    private filename : string;
    private jsonData : any;

    constructor(filename:string) {
        this.filename = filename+".json";
    }

    getFileName() {
        return this.filename;
    }

    open() {

    }

    rename() {

    }
}