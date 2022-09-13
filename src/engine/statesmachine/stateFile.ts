export class StateFile {

    private filename : string;
    
    outputCode : string = '';

    constructor(filename:string) {
        this.filename = filename;
    }

    getFileName() {
        return this.filename;
    }

    open() {

    }

    serialize() {
        return {
            "filename": this.filename,
        }
    }
}