"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Test1_1 = __importDefault(require("./test1/Test1"));
const app = (0, express_1.default)();
const port = 81;
app.get('/test1', (req, res) => {
    Test1_1.default.processRequest(req.query.ID.toString(), res);
});
app.listen(port, () => {
    Test1_1.default.init();
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map