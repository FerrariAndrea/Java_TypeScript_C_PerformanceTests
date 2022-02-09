"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Triple_1 = __importDefault(require("../model/Triple"));
const User_1 = __importDefault(require("../model/User"));
const ServerSession_1 = __importDefault(require("./ServerSession"));
class Test1 {
    static init() {
        Test1.sendPOSTUpdate("DELETE WHERE {GRAPH <" + Test1.graph + "> { ?s ?p ?o }}", () => {
            console.log("RDF store clenned");
        }, (err) => {
            // console.log("Error Test1.sendPostUpdate: " + err);
            console.log("Post Error: ", err);
        });
    }
    static processRequest(id, res) {
        if (id === null || id === undefined) {
            // console.log("Error: ID is: ",id);
            res.send("Error: ID is null");
        }
        else {
            let u = ServerSession_1.default.getUser(id);
            if (u === null || u === undefined) {
                u = new User_1.default(id);
                ServerSession_1.default.addUser(id, u);
            }
            //generate a random triple 
            const t = Test1.generateTriple(u.mySubject);
            //save the generated triple in own server session
            u.add(t);
            //call Blazegraph to save it in the RDF-Store
            //console.log("t.generateInsertSPARQL(Test1.graph)",t.generateInsertSPARQL(Test1.graph));
            Test1.sendPOSTUpdate(t.generateInsertSPARQL(Test1.graph), (ris) => {
                if (ris === null || ris === undefined) {
                    // console.log("Post: ",ris);
                    res.send("Post update resp is null");
                }
                else {
                    //ask to blazegraph all the triples in the store, excluding their own triples
                    Test1.sendGETQuery(u.generateSparqlQuery(Test1.graph), (ris2) => {
                        var _a, _b;
                        if (ris2 === null || ((_b = (_a = ris2 === null || ris2 === void 0 ? void 0 : ris2.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b.bindings) === undefined) {
                            // console.log("ris2: ",ris2);
                            res.send("GET query resp is null");
                        }
                        else {
                            //compare all the query result triples with all the triples in the own session, 
                            //and if there is a match it will increase a counter
                            const userStatus = "User " + id + " counter: " + u.countMatch(ris2.data.results.bindings);
                            console.log(userStatus);
                            res.send(userStatus);
                        }
                    }, (err2) => {
                        res.send("GET Error: " + err2);
                    });
                }
            }, (err) => {
                // console.log("Post Error: ",err);
                res.send("Post Error: " + err);
            });
        }
    }
    static generateTriple(id) {
        const o = "obj_" + Test1.getRandomNumber(1, 100);
        const p = "http://at_" + new Date().getTime();
        return new Triple_1.default(id, p, o);
    }
    static getRandomNumber(min, max) {
        return Math.trunc((Math.random() * (max - min)) + min);
    }
    static sendPOSTUpdate(sparqlUpdate, cbok, cbErr) {
        const config = {
            headers: {
                'Accept': 'application/json'
            }
        };
        const params = new URLSearchParams();
        params.append('update', sparqlUpdate);
        axios_1.default.post(Test1.blazegraphURI, params, config)
            .then(cbok)
            .catch(cbErr);
    }
    static sendGETQuery(sparqlQuery, cbok, cbErr) {
        const config = {
            headers: {
                Accept: 'application/json',
            }
        };
        axios_1.default.get(Test1.blazegraphURI + "?query=" + sparqlQuery, config)
            .then(cbok)
            .catch(cbErr);
    }
}
Test1.blazegraphURI = "http://localhost:9999/blazegraph/namespace/kb/sparql";
Test1.graph = "http://test1/typescript";
exports.default = Test1;
//# sourceMappingURL=Test1.js.map