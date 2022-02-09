"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerSession {
    static addUser(id, u) {
        ServerSession.users.set(id, u);
    }
    static getUser(id) {
        return ServerSession.users.get(id);
    }
}
ServerSession.users = new Map();
exports.default = ServerSession;
//# sourceMappingURL=ServerSession.js.map