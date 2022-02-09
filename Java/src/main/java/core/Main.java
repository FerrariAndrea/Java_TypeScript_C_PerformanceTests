package core;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import core.test1.Test1;




public class Main {

	private static final int PORT = 81;
	private static final int THREAD_POOL= 1;

	public static void main(String[] args) throws Exception {
		Test1.init();
		HttpServer server = HttpServer.create(new InetSocketAddress("localhost", PORT), 0);   
		HttpContext context = server.createContext("/test1");
		context.setHandler(
				new HttpHandler() {
					@Override
					public void handle( HttpExchange httpExchange ) throws IOException {
						Map<String, String> params = new HashMap<>();
						for (String param : httpExchange.getRequestURI().getQuery().split("&")) {
							String[] entry = param.split("=");
							if (entry.length > 1) {
								params.put(entry[0], entry[1]);
							}else{
								params.put(entry[0], "");
							}
						}
						try {
							String response = Test1.processRequest(params);
							httpExchange.sendResponseHeaders(200, response.getBytes().length);
							OutputStream os = httpExchange.getResponseBody();
							os.write(response.getBytes());
							os.close();
						} catch (IOException | InterruptedException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						httpExchange.close();
					}
				}
				);		
		ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor)Executors.newFixedThreadPool(THREAD_POOL);
		server.setExecutor(threadPoolExecutor);    	
		server.start();
		System.out.println("Server started on port: "+ PORT);
		System.out.println("THREAD_POOL: "+ THREAD_POOL);
	}



}
