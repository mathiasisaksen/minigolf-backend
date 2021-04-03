const gameConfig = {
    golfBallRadius: 0.8,
    maxSpeed: 40,
    frictionPerTime: 0.5,
    speedThreshold: 0.5,
    maxDirectionLineLength: 20,
    framesPerSecond: 60,
    gravity: Infinity,
    interpolationsPerStep: 5,
};

const idConfig = {
    numberOfCharacters: 12,
}

const playerConfig = {
    maxNameLength: 20,
}

const serverConfig = {
    port: 5600,
}

module.exports = { gameConfig, idConfig, serverConfig, playerConfig };