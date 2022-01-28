package model;

import java.util.ArrayList;

import org.json.JSONArray;

public class User {

	private int counter=0;
	private ArrayList<Triple> mytriples= new ArrayList<Triple>();
	private String mySubject;
	public User(String id) {
		super();
		mySubject= "http://user_"+id;
	}

	public int getCounter() {
		return counter;
	}

	public void setCounter(int counter) {
		this.counter = counter;
	}

	public ArrayList<Triple> getMytriples() {
		return mytriples;
	}

	public void setMytriples(ArrayList<Triple> mytriples) {
		this.mytriples = mytriples;
	}
	
	public void add(Triple t ) {
		mytriples.add(t);
	}
	
	public String generateSparqlQuery(String graph){
		return "SELECT ?o WHERE {GRAPH <"+graph+"> {?s ?p ?o}FILTER(str(?s)!= \""+mySubject+"\")}";
	}

	public String getMySubject() {
		return mySubject;
	}
	public int countMatch(JSONArray arr) {
		for (int x =0;x<arr.length();x++) {
			String temp = arr.getJSONObject(x).getJSONObject("o").getString("value");
			for (int y =0;y<mytriples.size();y++) {
				if(mytriples.get(y).objectMatch(temp)) {
					this.counter+=1;
				}
			}
		}
		return this.counter;
	}
}
