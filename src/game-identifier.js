const MD5 = require('crypto-js/md5');
const { randomInteger } = require('./utilities/utilities');

let numberOfGames = 0;
let gameSalt = MD5(String(randomInteger())).toString().substr(0, 10);

function generateGameIdentifier() {
    const gameId = MD5(numberOfGames + gameSalt).toString().substr(0, 10);
    numberOfGames++;
    return(gameId);
}

module.exports = {generateGameIdentifier};