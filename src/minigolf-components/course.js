const { gameConfig } = require('../config');
const mUtils = require('../utilities/math-utilities')

// vertices is an object containing two arrays: boundary and obstacles
// boundary contains the vertices of the polygonal boundary, while
// obstacles contains zero or more array of vertices for internal obstacles
const Course = function(courseData) {
    const boundaryVertices = courseData.boundary;
    const obstacles = courseData.obstacles;
    const covers = courseData.covers;
    const holePosition = mUtils.Vector(courseData.hole.position);
    const holeRadius = courseData.hole.radius;

    let edges = [];
    initialize();

    function fixVertexOrientation() {
        if (computePolygonOrientation(boundaryVertices) < 0) {
            boundaryVertices.reverse();
        }
        if (obstacles) {
            obstacles.forEach(obstacle => {
                if (computePolygonOrientation(obstacle) > 0) {
                    obstacle.reverse();
                }
            });
        }
    }

    // Uses approach from https://en.wikipedia.org/wiki/Curve_orientation
    function computePolygonOrientation(polygon) {
        const minXIndex = polygon.reduce((minIndex, curElem, curIndex, arr) => 
            minIndex = curElem.x < arr[minIndex].x ? curIndex : minIndex, 
            0);
        const prevIndex = minXIndex === 0 ? polygon.length - 1 : minXIndex - 1;
        const nextIndex = minXIndex === polygon.length - 1 ? 0 : minXIndex + 1;

        const vertexA = polygon[prevIndex];
        const vertexB = polygon[minXIndex];
        const vertexC = polygon[nextIndex];

        const determinant = (vertexB.x - vertexA.x)*(vertexC.y - vertexA.y) -
                            (vertexC.x - vertexA.x)*(vertexB.y - vertexA.y)
        return(Math.sign(determinant));
    }

    function computeEdgesAndAABB() {
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
        
        if (covers) {
            covers.forEach(cover => {
                cover.AABB = cover.vertices.reduce((coverAABB, curVertex) => {
                    coverAABB.xMin = Math.min(curVertex.x, coverAABB.xMin);
                    coverAABB.xMax = Math.max(curVertex.x, coverAABB.xMax);
                    coverAABB.yMin = Math.min(curVertex.y, coverAABB.yMin);
                    coverAABB.yMax = Math.max(curVertex.y, coverAABB.yMax);
                    return(coverAABB);
                }, {xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity});
            });
        }
    }

    function sortCovers() {
        if (covers) {
            covers.sort((a, b) => 
                gameConfig.coverPriority[a.type] - gameConfig.coverPriority[b.type]);
        }
    }

    function initialize() {
        fixVertexOrientation();
        sortCovers();
        computeEdgesAndAABB();
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

    function getCoversAtPosition(position) {
        const result = [];
        if (covers) {
            covers.forEach(cover => {
                if (mUtils.isPointInPolygon(position, cover.vertices)) {
                    result.push(cover);
                }
            });
        }
        return(result);
    }

    return({ getBoundaryVertices, getObstacles, getEdges,
        getHole, getCoversAtPosition });
};

module.exports = Course;