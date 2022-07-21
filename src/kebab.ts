export class Kebab {

    constructor() {
        console.log("Hello kebab !");
    }

    static eat(): void {
        alert('miam !');
    }
}
module.exports = {Kebab : Kebab}