
// Generates string consisting of numbers and lowercase letters
function generateId(numberOfCharacters) {
    let result = "";
    while (result.length < numberOfCharacters) {
        const randomInt = -9 + Math.floor(36*Math.random());
        if (randomInt < 1) {
            result += Math.abs(randomInt);
        } else {
            result += String.fromCharCode(randomInt + 96);
        }
    }
    return(result);
}

module.exports = { generateId };