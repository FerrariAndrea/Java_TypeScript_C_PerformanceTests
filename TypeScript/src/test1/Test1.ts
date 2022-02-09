import axios from "axios";
import Triple from '../model/Triple';
import User from '../model/User';
import ServerSession from './ServerSession';
class Test1{
	private static blazegraphURI = "http://localhost:9999/blazegraph/namespace/kb/sparql";
	private static graph = "http://test1/typescript";

    public static init():void{
        Test1.sendPOSTUpdate("DELETE WHERE {GRAPH <"+Test1.graph+"> { ?s ?p ?o }}",()=>{
            console.log("RDF store clenned");
        },(err)=>{
           // console.log("Error Test1.sendPostUpdate: " + err);
            console.log("Post Error: " , err);
        });
    }
    
    public static processRequest(id:string,res):void{ 
		if(id===null || id===undefined) {
            // console.log("Error: ID is: ",id);
			res.send("Error: ID is null");
		}else{
            let u = ServerSession.getUser(id);
            if(u===null|| u===undefined) {
                u=new User(id);
                ServerSession.addUser(id,u);
            }
            //generate a random triple 
            const t = Test1.generateTriple(u.mySubject);
            //save the generated triple in own server session
            u.add(t);
            //call Blazegraph to save it in the RDF-Store
            //console.log("t.generateInsertSPARQL(Test1.graph)",t.generateInsertSPARQL(Test1.graph));
            Test1.sendPOSTUpdate(t.generateInsertSPARQL(Test1.graph),(ris)=>{
                if(ris===null || ris===undefined) {
                    // console.log("Post: ",ris);
                    res.send("Post update resp is null");
                }else{
                    //ask to blazegraph all the triples in the store, excluding their own triples
                    Test1.sendGETQuery(u.generateSparqlQuery(Test1.graph),(ris2)=>{
                        if(ris2===null || ris2?.data?.results?.bindings===undefined) {
                            // console.log("ris2: ",ris2);
                            res.send("GET query resp is null");
                        }else{
                            //compare all the query result triples with all the triples in the own session, 
                            //and if there is a match it will increase a counter
                            const userStatus = "User "+id+" counter: "+ u.countMatch(ris2.data.results.bindings);
                            console.log(userStatus);
                            res.send(userStatus);
                        }
                    },(err2)=>{
                        res.send("GET Error: "+ err2);
                    });
                 
                }
            },(err)=>{
                // console.log("Post Error: ",err);
                res.send("Post Error: "+ err);
            });
            
        }

    }

	private static generateTriple(id:string):Triple {
		const o = "obj_"+Test1.getRandomNumber(1,100);
		const p= "http://at_"+new Date().getTime();
		return new Triple(id,p,o);
	}
	
	private static getRandomNumber(min:number, max:number):number {
        return Math.trunc((Math.random() * (max - min)) + min);
	}
    private static sendPOSTUpdate(sparqlUpdate:string,cbok:(ris) => void,cbErr:(err) => void){    
        const config = {
            headers: {
                'Accept': 'application/json'
            }
        }   
        const params = new URLSearchParams();
        params.append('update', sparqlUpdate);
        axios.post(Test1.blazegraphURI,params,config)
        .then(cbok)
        .catch(cbErr);
    }

    private static sendGETQuery(sparqlQuery:string,cbok:(ris) => void,cbErr:(err) => void){   
        const config = {
            headers: {
                Accept: 'application/json',
            }
        }          
        axios.get(Test1.blazegraphURI+"?query="+sparqlQuery,config)
        .then(cbok)
        .catch(cbErr);
    }
}

export default Test1;