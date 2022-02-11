"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Triple {
    constructor(s, p, o) {
        this.subject = s;
        this.predicate = p;
        this.object = o;
    }
    generateInsertSPARQL(graph) {
        return "INSERT DATA { GRAPH <" + graph + "> {<"
            + this.subject + "><" + this.predicate + ">\"" + this.object + "\".}}";
    }
}
exports.default = Triple;
//# sourceMappingURL=Triple.js.map