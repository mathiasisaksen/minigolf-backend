const { gameConfig } = require('../config');
const mUtils = require('../utilities/math-utilities');

const GolfBall = function(courseData) {
    
    let {initialPosition, radius} = courseData.golfBall;
    let position = mUtils.Vector(initialPosition);
    let speed;
    let direction;
    if (!radius) {
        radius = gameConfig.golfBallRadius;
    }
    let maxSpeed = radius * gameConfig.relativeMaxSpeed;
    let _unitDirectionVector;

    function getPosition() {
        return(position);
    }

    function setPosition(newPosition) {
        position = newPosition;
    }

    function getSpeed() {
        return(speed);
    }

    function setSpeed(newSpeed) {
        speed = Math.min(newSpeed, maxSpeed);
    }

    function getDirection() {
        return(direction);
    }

    function setDirection(newDirection) {
        direction = newDirection;
        _unitDirectionVector = mUtils.createUnitVector(direction)
    }

    function getRadius() {
        return(radius);
    }

    function setRadius(newRadius) {
        radius = newRadius;
        maxSpeed = radius * gameConfig.relativeMaxSpeed;
    }

    function step(timeStep) {
        const stepSize = speed*timeStep;
        let newPosition = position;
        newPosition.setX(newPosition.getX() + stepSize*_unitDirectionVector.getX());
        newPosition.setY(newPosition.getY() + stepSize*_unitDirectionVector.getY());
        setPosition(newPosition);
    }

    function moveToInitialPosition() {
        position = mUtils.Vector(initialPosition);
    }

    function reset() {
        moveToInitialPosition();
        setSpeed(0);
        setDirection(0);
    }

    return({
        getPosition, setPosition, 
        getSpeed, setSpeed,
        getDirection, setDirection,
        getRadius, setRadius, 
        step, moveToInitialPosition, reset
    });
}

module.exports = GolfBall;