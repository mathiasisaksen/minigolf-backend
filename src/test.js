const GolfBall = require('./minigolf-components/golf-ball');
const Course = require('./minigolf-components/course');
const GameMechanics = require('./minigolf-components/game-mechanics');
const { generateCourse } = require('./minigolf-components/course-generation');
const mUtils = require('./utilities/math-utilities');

const courseData = generateCourse();
//console.log(courseData);

const golfBall = GolfBall(courseData);
const course = Course(courseData);

golfBall.setPosition(mUtils.Vector({x: 11.42188833090937, y: 43.35030030966768}));
golfBall.setDirection(1.39579228410672);
golfBall.setSpeed(6.679834407047205);

const gameMechanics = GameMechanics(golfBall, course);
const result = gameMechanics.computePosition();
console.log(result);
