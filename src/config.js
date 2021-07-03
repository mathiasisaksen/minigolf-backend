const gameConfig = {
    golfBallRadius: 0.8,
    relativeMaxSpeed: 60,
    frictionPerTime: 0.4,
    relativeSpeedThreshold: 1.6,
    maxDirectionLineLength: 20,
    framesPerSecond: 60,
    gravity: Infinity,
    interpolationsPerStep: 5,
    coverPriority: {wind: 1, bridge: 2, water: 3, sand: 4}
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