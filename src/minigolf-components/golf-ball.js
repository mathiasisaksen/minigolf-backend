const mUtils = require('../utilities/math-utilities');

const GolfBall = function(courseData) {
    
    let position = mUtils.Vector(courseData.initialGolfBallPosition);
    let speed;
    let direction;
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
        speed = newSpeed;
    }

    function getDirection() {
        return(direction);
    }

    function setDirection(newDirection) {
        direction = newDirection;
        _unitDirectionVector = mUtils.createUnitVector(direction)
    }

    function step(timeStep) {
        const stepSize = speed*timeStep;
        let newPosition = position;
        newPosition.setX(newPosition.getX() + stepSize*_unitDirectionVector.getX());
        newPosition.setY(newPosition.getY() + stepSize*_unitDirectionVector.getY());
        //console.log(newPosition.getString());
        setPosition(newPosition);
    }

    return({
        getPosition, setPosition, 
        getSpeed, setSpeed,
        getDirection, setDirection, step})

}

module.exports = GolfBall;