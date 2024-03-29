export default class SocketError extends Error {
    status;

    constructor(status, message) {
        super(message);
        this.status = status;
    }

    static BadRequest(message) {
        return new SocketError("NOK", message);
    }
    static Forbidden(message) {
        return new SocketError("NOK", message);
    }
}