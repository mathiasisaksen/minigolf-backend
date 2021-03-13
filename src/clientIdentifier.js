const MD5 = require('crypto-js/md5');

function randomInteger() {
    const upperLimit = Math.pow(2, 32);
    return(Math.round(Math.random()*upperLimit));
}

function generateUniqueIdentifier() {
    const id = String(randomInteger());
    const string = MD5(id).toString();
    return({id, string});
}

console.log(generateUniqueIdentifier());