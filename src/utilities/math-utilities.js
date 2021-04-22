
// Represents a general two-dimensional vector (or point)
function Vector({x, y}) {
    let _x = x;
    let _y = y;
    let _length;

    function getX() {
        return(_x);
    }

    function setX(newX) {
        _x = newX;
    }

    function getY() {
        return(_y);
    }

    function setY(newY) {
        _y = newY;
    }

    function getCoordinates() {
        return({x: _x, y: _y})
    }

    function getPerpendicular() {
        return(Vector({x: -_y, y: _x}));
    }

    function getLength() {
        if (!_length) {
            _length = Math.sqrt(_x**2 + _y**2)
        }
        return(_length);
    }

    function normalize() {
        const length = getLength();
        if (length == 0) return;
        _x /= length;
        _y /= length;
    }

    function getNormalized() {
        return(Vector({x: _x / getLength(), y: _y / getLength()}));
    }

    function getDirection() {
        return(Math.atan2(_y, _x));
    }

    function getString() {
        return(`[x: ${_x}, y: ${_y}]`)
    }
    return({ getX, setX, getY, setY, getPerpendicular, getLength, normalize,
            getCoordinates, getNormalized, getDirection, getString })
}

function dotProduct(vector1, vector2) {
    return(vector1.getX()*vector2.getX() + vector1.getY()*vector2.getY());
}

function crossProduct2D(vector1, vector2) {
    return(vector1.getX()*vector2.getY() - vector2.getX()*vector1.getY());
}

function addVectors(vector1, vector2) {
    const sumX = vector1.getX() + vector2.getX();
    const sumY = vector1.getY() + vector2.getY();
    return(Vector({x: sumX, y: sumY}));
}

function subtractVectors(vector1, vector2) {
    const differenceX = vector1.getX() - vector2.getX();
    const differenceY = vector1.getY() - vector2.getY();
    return(Vector({x: differenceX, y: differenceY}));
}

function scaleVector(vector, scalar) {
    const scaledX = scalar*vector.getX();
    const scaledY = scalar*vector.getY();
    return(Vector({x: scaledX, y: scaledY}));
}

function createUnitVector(direction) {
    return(Vector({x: Math.cos(direction), y: Math.sin(direction)}));
}

// Computes the projection of vectorA onto vectorB
function vectorProjection(vectorA, vectorB) {
    const scalarProjection = dotProduct(vectorA, vectorB) / vectorB.getLength()**2;
    return(scaleVector(vectorB, scalarProjection));
}

// Reflects the vectorA by vectorB. This is done by first computing the vector
// rejection of vectorA on vectorB (vectorA - the projection of vectorA on vectorB).
// Then, the reflection is given by vectorA - 2*(rejection of vectorA on vectorB)
function vectorReflection(vectorA, vectorB) {
    const rejection = subtractVectors(vectorA, vectorProjection(vectorA, vectorB));
    return(subtractVectors(vectorA, scaleVector(rejection, 2)));
}

function VectorDistance(vector1, vector2) {
    return(subtractVectors(vector2, vector1).getLength());
}

// Represents an edge in a polygon
function Edge(startVertex, endVertex) {
    let _startVertex = startVertex;
    let _endVertex = endVertex;
    let _diffVector = subtractVectors(_endVertex, _startVertex);

    function getLength() {
        return(_diffVector.getLength());
    }

    function getStartVertex() {
        return(_startVertex);
    }

    function getEndVertex() {
        return(_endVertex);
    }

    function getDifferenceVector() {
        return(_diffVector);
    }

    // Takes in a position on the edge and computes the proportion,
    // so that a value between 0 (startVertex) and 1 (endVertex) is returned
    // when the position is on the vertex
    function computePositionProportion(position) {
        const startPositionDistance = subtractVectors(startVertex, position).getLength();
        const endPositionDistance = subtractVectors(endVertex, position).getLength();
        const proportion = startPositionDistance / getLength();
        if (endPositionDistance > getLength()) {
            return(-proportion);
        }
        return(proportion);
    }

    function getString() {
        return(`Start: ${_startVertex.getString()}, end: ${_endVertex.getString()}`)
    }
    
    return({ getLength, getStartVertex, getEndVertex, getDifferenceVector, getString,
            computePositionProportion });
}

// A path describes the motion of the ball
function Path(initialPoint, directionVector) {
    let _initialPoint = initialPoint;
    let _directionVector = directionVector;

    function getInitialPoint() {
        return(_initialPoint);
    }

    function getDirectionVector() {
        return(_directionVector);
    }

    function getPositionAtTime(time) {
        return(addVectors(_initialPoint, scaleVector(_directionVector, time)));
    }

    function getString() {
        return(`Initial point: ${_initialPoint.getString()}, direction: ${_directionVector.getString()}`)
    }

    return({ getInitialPoint, getDirectionVector, getPositionAtTime, getString });
}

// Useful reference: Intersection of two line segments
function computePathEdgeIntersection(path, edge) {
    // Path is on the form pathStart + pathVector*t, where t >= 0
    const pathStart = path.getInitialPoint();
    const pathVector = path.getDirectionVector();

    // Edge is on form edgeStart + edgeVector*u, where 0 <= s <= 1
    const edgeStart = edge.getStartVertex();
    const edgeVector = edge.getDifferenceVector();

    // Intersection when t = (edgeStart - pathStart) Ã— edgeVector / (pathVector Ã— edgeVector)
    //                or u = (edgeStart - pathStart) Ã— pathVector / (pathVector Ã— edgeVector)
    const startDiff = subtractVectors(edgeStart, pathStart);
    const denominator = crossProduct2D(pathVector, edgeVector);
    if (denominator === 0) return;

    const t = crossProduct2D(startDiff, edgeVector) / denominator;
    const u = crossProduct2D(startDiff, pathVector) / denominator;
    const intersectionPoint = path.getPositionAtTime(t);
    return({ intersectionPoint, pathParameter: t, edgeParameter: u});
}

// Given a circle and a path, returns the two paths that are parallel to the 
// original path and tangetial to the circle. These will go in the same 
// direction, but start in different points
function getParallelPaths(path, radius) {
    const directionVector = path.getDirectionVector();
    const unitPerpVector = directionVector.getNormalized().getPerpendicular();

    const initialPointA = addVectors(path.getInitialPoint(), scaleVector(unitPerpVector, radius));
    const initialPointB = subtractVectors(path.getInitialPoint(), scaleVector(unitPerpVector, radius));
    return({pathA: Path(initialPointA, directionVector), pathB: Path(initialPointB, directionVector)})
}

function isInRange(value, lower, upper) {
    return(value >= lower && value <= upper);
}

// Computes the intersection point between a circle moving along a straight
// path and an edge
function computeMovingCircleEdgeIntersection(path, radius, edge) {
    // Path is on the form pathStart + pathVector*t, where t >= 0
    const pathStart = path.getInitialPoint();
    const pathVector = path.getDirectionVector();

    // Edge is on form edgeStart + edgeVector*u, where 0 <= s <= 1
    const edgeStart = edge.getStartVertex();
    const edgeEnd = edge.getEndVertex();
    const edgeVector = edge.getDifferenceVector();

    let time = (radius*edgeVector.getLength() + 
        dotProduct(pathStart.getPerpendicular(), edgeVector) +
        dotProduct(edgeStart, edgeEnd.getPerpendicular())) / 
        dotProduct(pathVector, edgeVector.getPerpendicular())
    let collisionCenter = path.getPositionAtTime(time);

    const edgeStartCentered = subtractVectors(edgeStart, collisionCenter);
    const edgeEndCentered = subtractVectors(edgeEnd, collisionCenter);
    const crossProd = crossProduct2D(edgeStartCentered, edgeEndCentered);

    const collisionPointX = collisionCenter.getX() + 
        crossProd * edgeVector.getY() / edgeVector.getLength()**2;
    const collisionPointY = collisionCenter.getY() - 
        crossProd * edgeVector.getX() / edgeVector.getLength()**2;
    let collisionPoint = Vector({x: collisionPointX, y: collisionPointY});

    const collisionEdgeProportion = edge.computePositionProportion(collisionPoint);
    // If this value is between 0 and 1, the collision occurs on the "flat" 
    // part of the edge, not on a corner
    if (isInRange(collisionEdgeProportion, 0, 1)) {
        return({time, collisionCenter, collisionPoint});
    } else if (isInRange(collisionEdgeProportion, -Infinity, 0)) {
        // If computed collision happens before start of edge,
        // the circle will collide with the start vertex
        collisionPoint = edgeStart;
    } else {
        // Otherwise, it will collide with the end vertex
        collisionPoint = edgeEnd;
    }

    const startColDiff = subtractVectors(pathStart, collisionPoint);
    time = - (Math.sqrt((dotProduct(startColDiff, pathVector))**2 -
        pathVector.getLength()**2*(startColDiff.getLength()**2 - radius**2)) +
        dotProduct(startColDiff, pathVector))/(pathVector.getLength()**2);
    collisionCenter = path.getPositionAtTime(time);
    return({time, collisionCenter, collisionPoint});
}

function isPointInPolygon(pointPosition, polygonVertices, polygonAABB) {
    const pX = pointPosition.x;
    const pY = pointPosition.y;

    if (polygonAABB) {
        const isInsideAABB = (pX >= polygonAABB.xMin &&
                              pX <= polygonAABB.xMax &&
                              pY >= polygonAABB.yMin &&
                              pY <= polygonAABB.yMax);
        if (!isInsideAABB) {
            return(false);
        }
    }

    // Add first vertex to end to create loop
    polygonVertices.push[polygonVertices[0]];

    // Use ray casting method
    let isInPolygon = false;
    for (let i = 0; i < polygonVertices.length - 1; i++) {
        const a = polygonVertices[i];
        const b = polygonVertices[i + 1];
        if ((pY - a.y)*(pY - b.y) < 0 && a.x < pX && b.x < pX) {
            isInPolygon = !isInPolygon;
        }
    }
    return(isInPolygon);
}


module.exports = { Vector, dotProduct, crossProduct2D, addVectors, VectorDistance,
    subtractVectors, scaleVector, createUnitVector, vectorProjection,
    vectorReflection, Edge, Path, computePathEdgeIntersection, 
    getParallelPaths, isInRange, computeMovingCircleEdgeIntersection,
    isPointInPolygon };