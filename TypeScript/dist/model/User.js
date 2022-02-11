"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(id) {
        this.mySubject = "http://user_" + id;
        this.counter = 0;
        this.mytriples = new Array();
    }
    add(t) {
        this.mytriples.push(t);
    }
    generateSparqlQuery(graph) {
        return "SELECT ?o WHERE {GRAPH <" + graph + "> {?s ?p ?o}FILTER(str(?s)!= \"" + this.mySubject + "\")}";
    }
    countMatch(arr) {
        for (const x in arr) {
            const temp = arr[x].o.value;
            for (let y = 0; y < this.mytriples.length; y++) {
                if (this.mytriples[y].object === temp) {
                    this.counter += 1;
                }
            }
        }
        return this.counter;
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map