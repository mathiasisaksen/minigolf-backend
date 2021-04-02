
// Generates random string consisting of numbers and lowercase letters
function generateId(numberOfCharacters) {
    let result = "";
    while (result.length < numberOfCharacters) {
        const randomInt = -9 + Math.floor(36*Math.random());
        if (randomInt < 1) {
            // Number between 0 and 9
            result += Math.abs(randomInt);
        } else {
            // Letter between a and z
            result += String.fromCharCode(randomInt + 96);
        }
    }
    return(result);
}

// Check if id consists of letters (a-z), numbers and hyphen-minus (-)
function checkValidId(name) {
    const nameArray = [...name.toLowerCase()];
    const isValid = nameArray.every(char => {
        const c = char.charCodeAt(0);
        return((c >= 97 && c <= 122) || (c >= 48 && c <= 57) || c === 45);
    });
    return(isValid);
}

module.exports = { generateId, checkValidId };