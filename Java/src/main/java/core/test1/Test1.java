package core.test1;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

import model.Triple;
import model.User;

public class Test1 {

	private static final String blazegraphURI = "http://localhost:9999/blazegraph/namespace/kb/sparql";
	private static final String graph = "http://test1/java";
	
	public static void init() throws IOException {
		//clean graph
		sendPOSTUpdate("DELETE WHERE {GRAPH <"+graph+"> { ?s ?p ?o }}");
	}
	
	public static String processRequest(Map<String,String> param) throws IOException, InterruptedException {
		String id = param.get("ID");
		if(id==null) {
			return "Error: ID is null";
		}
		User u = ServerSession.getUser(id);
		if(u==null) {
			u=new User(id);
			ServerSession.addUser(id,u);
		}
		//generate a random triple 
		Triple t = generateTriple(u.getMySubject());
		//save the generated triple in own server session
		u.add(t);
		//call Blazegraph to save it in the RDF-Store
		String resp = sendPOSTUpdate(t.generateInsertSPARQL(graph));
		if(resp==null) {
			throw new IOException("Post update resp is null");
		}

		//System.out.println(u.generateSparqlQuery(graph));
		//ask to blazegraph all the triples in the store, excluding their own triples
		resp=sendGETQuery(u.generateSparqlQuery(graph));
		if(resp==null) {
			throw new IOException("GET query resp is null");
		}
		System.out.println("\n\n---->"+resp.toString()+"\n");
		JSONObject obj = new JSONObject(resp);
		JSONArray arr = obj.getJSONObject("results").getJSONArray("bindings");
		//compare all the query result triples with all the triples in the own session, 
		//and if there is a match it will increase a counter
		String userStatus = "User "+id+" counter: "+ u.countMatch(arr);
		System.out.println(userStatus);
		return userStatus;
	}
	
	private static Triple generateTriple(String id) {
		String o = "obj_"+getRandomNumber(1,100);
		String p = "http://at_"+System.currentTimeMillis();
		return new Triple(id,p,o);
	}
	
	private static int getRandomNumber(int min, int max) {
	    return (int) ((Math.random() * (max - min)) + min);
	}
	
	
	private static String sendGETQuery(String query) throws IOException {
		String param = String.format("query=%s",  URLEncoder.encode(query, "UTF-8"));
		URL obj = new URL(blazegraphURI+"?"+param);
		//System.out.println(obj);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestMethod("GET");
		con.setRequestProperty("User-Agent", "Mozilla/5.0");
		con.setRequestProperty("Accept","application/json");
		int responseCode = con.getResponseCode();
		//System.out.println("GET Response Code :: " + responseCode);
		if (responseCode == HttpURLConnection.HTTP_OK) { // success
			BufferedReader in = new BufferedReader(new InputStreamReader(
					con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();

			// print result
			return response.toString();
		} else {
			return null;
		}

	}
	
	private static String sendPOSTUpdate(String update) throws IOException {
		URL obj = new URL(blazegraphURI);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		con.setRequestProperty("Accept","application/json");
		String urlParameters  = "update="+update;
		byte[] postData       = urlParameters.getBytes( StandardCharsets.UTF_8 );
		int    postDataLength = postData.length;
		con.setDoOutput( true );
		con.setInstanceFollowRedirects( false );
		con.setRequestMethod( "POST" );
		con.setRequestProperty( "Content-Type", "application/x-www-form-urlencoded"); 
		con.setRequestProperty( "charset", "utf-8");
		con.setRequestProperty( "Content-Length", Integer.toString( postDataLength ));
		con.setUseCaches( false );
		try( DataOutputStream wr = new DataOutputStream( con.getOutputStream())) {
		   wr.write( postData );
		}
		int responseCode = con.getResponseCode();
		if (responseCode == HttpURLConnection.HTTP_OK) { 
			BufferedReader in = new BufferedReader(new InputStreamReader(
					con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
			return response.toString();
		} else {
			return null;
		}

	}
}
