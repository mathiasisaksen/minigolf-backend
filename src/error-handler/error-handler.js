
function errorHandler(webSocket, error) {
    console.trace(error.stack);
    const errorDescription = 'An unknown error occurred. Please try again.'
    const response = {eventName: 'serverError', data: {errorDescription}};
    webSocket.send(JSON.stringify(response));
}

module.exports = errorHandler;