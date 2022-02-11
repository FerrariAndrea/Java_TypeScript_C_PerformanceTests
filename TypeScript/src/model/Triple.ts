class Triple{
    
    subject: string;
    predicate: string;
    object: string;

    constructor(s: string,p: string, o: string){
        this.subject=s;
        this.predicate=p;
        this.object=o;
    }



    generateInsertSPARQL(graph: string):string {
		return "INSERT DATA { GRAPH <"+graph+"> {<"
					+this.subject+"><"+this.predicate+">\""+this.object+"\".}}";
	}
	
	// objectMatch(str: string):boolean {
	// 	return this.object===str;
	// }
}

export default Triple;