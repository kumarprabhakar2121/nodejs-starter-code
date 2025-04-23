// utils/AppResponder.js

const httpCodes = {
    2: true,
    4: false,
    5: false,
};

/**
 * @class AppResponder
 * @description A class to handle and format API responses
 * @property {string|null} message - Response message
 * @property {number|null} statusCode - HTTP status code
 * @property {string|null} status - HTTP status text
 * @property {Object|null} data - Response data/options
 * @property {Error|null} error - Error object if any
 */
class AppResponder {
    constructor() {
        this.message = null;
        this.statusCode = null;
        this.status = null;
        this.data = null;
        this.error = null;
    }

    /**
     * @method responder
     * @description Sets response properties for the AppResponder instance
     * @param {string} message - Message to be sent in response
     * @param {number} statusCode - HTTP status code for the response
     * @param {Object} [options={}] - Additional data/options to include in response
     * @returns {void}
     */
    responder(message, statusCode, options = {}, cookie = null) {
        this.message = message;
        this.statusCode = statusCode;
        this.status = httpCodes[`${statusCode}`[0]];
        this.data = options;
        this.error = null;
        cookie && (this.cookie = cookie);
        return this;
    }
}

module.exports = new AppResponder();

