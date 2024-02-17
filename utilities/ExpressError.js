class ExpressError extends Error {
    constructor(message, statusCode) {
        super(); //Call the parent class constructor with default values
        this.message = message
        this.statusCode = statusCode
    }
}

module.exports = ExpressError