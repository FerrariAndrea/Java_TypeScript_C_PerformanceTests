
import Triple from './Triple';

class User{
    
    counter: number;
	mytriples: Array<Triple>;
	mySubject: string;

    constructor(id: string){
        this.mySubject="http://user_"+id;
        this.counter=0;
		this.mytriples= new Array<Triple>();
    }
	


    add(t: Triple):void {
		this.mytriples.push(t);
	}
	
	generateSparqlQuery(graph: string):string{
		return "SELECT ?o WHERE {GRAPH <"+graph+"> {?s ?p ?o}FILTER(str(?s)!= \""+this.mySubject+"\")}";
	}

	countMatch(arr: JSON):number{
		for (const x in arr) {
			const temp:string = arr[x].o.value;
			for (let y=0;y<this.mytriples.length;y++) {
				if(this.mytriples[y].object ===temp) {
					this.counter+=1;
				}
			}
		}
		return this.counter;
	}
}


export default User;