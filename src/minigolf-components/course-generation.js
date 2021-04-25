let i = 0;
function generateCourse() {
    let courseData;
    if (i === 0) {
        courseData = {
            boundary: [
                {x: 10, y: 40},
                {x: 30, y: 40},
                {x: 30, y: 45},
                {x: 65, y: 45},
                {x: 65, y: 40},
                {x: 90, y: 40},
                {x: 90, y: 60},
                {x: 65, y: 60},
                {x: 65, y: 55},
                {x: 30, y: 55},
                {x: 30, y: 60},
                {x: 10, y: 60}
            ],
            obstacles: [
                [
                    {x: 15, y: 55},
                    {x: 25, y: 55},
                    {x: 25, y: 45},
                    {x: 15, y: 45}
                ]
            ],
            covers: [
                {
                    type: 'sand', 
                    frictionMultiplier: 5, 
                    vertices: [{x: 65, y: 52},
                               {x: 65, y: 55},
                               {x: 30, y: 55},
                               {x: 30, y: 52}]
                },
            
                {
                    type: 'water',
                    vertices: [{x: 65, y: 48},
                               {x: 65, y: 52},
                               {x: 30, y: 52},
                               {x: 30, y: 48}]
                },

                {
                    type: 'bridge',
                    vertices: [{x: 67, y: 49},
                               {x: 67, y: 51},
                               {x: 28, y: 51},
                               {x: 28, y: 49}]
                },
            
                {
                    type: 'wind',
                    windStrength: 10,
                    vertices: [{x: 65, y: 45},
                               {x: 65, y: 48},
                               {x: 30, y: 48},
                               {x: 30, y: 45}]
                }
            ],
            golfBall: {initialPosition: {x: 80, y: 50}, radius: 0.8},
            hole: {position: {x: 12.5, y: 50}, radius: 2.1}
            };
    } else {
        courseData = {boundary: 
            [
                {x: 88.38, y: 37.15},
                {x: 84.15, y: 48.92},
                {x: 72.43, y: 61.96},
                {x: 55.25, y: 68.69},
                {x: 37.56, y: 67.01},
                {x: 25.61, y: 60.48},
                {x: 14.06, y: 45.26},
                {x: 11, y: 31.88},
                {x: 88.38, y: 31.61},
                {x: 88.38, y: 35.05},
                {x: 23.92, y: 34.88},
                {x: 27.44, y: 43.97},
                {x: 34.52, y: 51.55},
                {x: 44.18, y: 55.89},
                {x: 53.69, y: 56.27},
                {x: 64.4, y: 52.28},
                {x: 71.5, y: 45.55},
                {x: 75.56, y: 37.12}
            ], 
            golfBall: {initialPosition: {x: 80, y: 40}, radius: 0.6},
            hole: {position: {x: 86, y: 33.4}, radius: 1.5}};
    }
    i++;
    return(courseData);
}

module.exports = { generateCourse };