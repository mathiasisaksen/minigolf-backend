
function randomInteger() {
    const upperLimit = Math.pow(2, 32);
    return(Math.round(Math.random()*upperLimit));
}

module.exports = {randomInteger};