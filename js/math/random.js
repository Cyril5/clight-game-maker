class Random {
    static pickElementFromArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

export {Random}