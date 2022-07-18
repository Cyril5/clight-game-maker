class Debug {

    static writeInConsole(msg,color) {
        const element = '<p style="color: '+color+'">'+msg+'</p>';
        console.log(element);
        document.getElementById('console').innerHTML += element;
    }
}
export {Debug}