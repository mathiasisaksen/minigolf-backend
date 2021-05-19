const fs = require('fs');
const path = require('path');
const { normalizeCourse } = require('./normalize-course');

const COURSE_PATH = path.join(__dirname, '/../holes');
const CourseLoader = (() => {

    let courseArray;
    updateCourseArray();

    function updateCourseArray() {
        courseArray = fs.readdirSync(COURSE_PATH);
        courseArray = courseArray.filter(filename => filename
            .split('.')
            .pop()
            .toLowerCase() === "json");
        courseArray.sort((a, b) => {
            const aNum = parseInt(a.split('.')[0]);
            const bNum = parseInt(b.split('.')[0]);
            return(aNum - bNum);
        });
    };

    function getNumberOfCourses() {
        updateCourseArray();
        return(courseArray.length);
    }

    function getCourse(courseNumber) {
        return(getCourseByFilename(courseArray[courseNumber]));
    }

    function getCourseByFilename(filename) {
        const rawData = fs.readFileSync(path.join(COURSE_PATH, filename))
        let courseData = JSON.parse(rawData);
        courseData = normalizeCourse(courseData);
        return(courseData);
    }

    function getRandomCourses(numberOfCourses) {
        updateCourseArray();
        const shuffledArray = courseArray.slice();
        // Shuffle array
        shuffledArray.sort((a, b) => 0.5 - Math.random());
        const size = numberOfCourses > shuffledArray.length ?
         shuffledArray.length :
         numberOfCourses;
        return(shuffledArray.slice(0, size));
    }

    return({getNumberOfCourses, getCourse, getCourseByFilename, getRandomCourses});

})();

module.exports = CourseLoader;