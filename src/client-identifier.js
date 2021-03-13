const MD5 = require('crypto-js/md5');
const { randomInteger } = require('./utilities/utilities');

let numberOfClients = 0;
let clientSalt = MD5(String(randomInteger())).toString().substr(0, 10);

function generateClientIdentifier(generatePassword = true) {
    const identification = {};
    identification.id = MD5(numberOfClients + clientSalt).toString().substr(0, 10);
    if (generatePassword) {
        identification.password = MD5(String(randomInteger())).toString();
    }
    numberOfClients++
    return(identification);
}
module.exports = {generateClientIdentifier};