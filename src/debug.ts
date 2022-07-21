export class Debug {

    static writeInConsole(msg: string,color: string) {
        const element = '<p style="color: '+color+'">'+msg+'</p>';
        console.log(element);
        //@ts-ignore
        document.getElementById('console').innerHTML += element;
    }
}