const { gameConfig } = require('../config');
const mUtils = require('../utilities/math-utilities')

// vertices is an object containing two arrays: boundary and obstacles
// boundary contains the vertices of the polygonal boundary, while
// obstacles contains zero or more array of vertices for internal obstacles
const Course = function(courseData) {
    const boundaryVertices = courseData.boundary;
    const obstacles = courseData.obstacles;
    const holePosition = mUtils.Vector(courseData.hole.position);
    const holeRadius = courseData.hole.radius;

    let edges = [];
    computeEdges();

    function computeEdges() {
        const boundaryVerticesLooped = [...boundaryVertices];
        boundaryVerticesLooped.push(boundaryVerticesLooped[0]);
    
        // Create array of edges from both boundary and inner obstacles
        for (let i = 1; i < boundaryVerticesLooped.length; i++) {
            const a = boundaryVerticesLooped[i-1];
            const b = boundaryVerticesLooped[i];
            edges.push(mUtils.Edge(mUtils.Vector({x: a.x, y: a.y}), 
                                   mUtils.Vector({x: b.x, y: b.y})));
        }
        if (obstacles) {
            obstacles.forEach(obstacleVertices => {
                const obstacleVerticesLooped = [...obstacleVertices];
                obstacleVerticesLooped.push(obstacleVerticesLooped[0]);
                for (let i = 1; i < obstacleVerticesLooped.length; i++) {
                    const a = obstacleVerticesLooped[i-1];
                    const b = obstacleVerticesLooped[i];
                edges.push(mUtils.Edge(mUtils.Vector({x: a.x, y: a.y}), 
                                       mUtils.Vector({x: b.x, y: b.y})));
                }
            });
        }
    
    }

    function getBoundaryVertices() {
        return(boundaryVertices);
    }

    function getObstacles() {
        return(obstacles);
    }

    function getEdges() {
        return(edges);
    }

    function getHole() {
        return({position: holePosition, radius: holeRadius});
    }

    return({ getBoundaryVertices, getObstacles, getEdges,
        getHole });
};

module.exports = Course;