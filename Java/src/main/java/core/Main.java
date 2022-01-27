package core;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

import com.sun.net.httpserver.HttpContext;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

public class Main {

	private static final int PORT = 81;
	private static final int THREAD_POOL= 10;
	
    public static void main(String[] args) throws Exception {
    	HttpServer server = HttpServer.create(new InetSocketAddress("localhost", PORT), 0);   
		HttpContext context = server.createContext("/test");
	    context.setHandler(Main::handleRequest);		
    	ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor)Executors.newFixedThreadPool(THREAD_POOL);
    	server.setExecutor(threadPoolExecutor);    	
    	server.start();
    	System.out.println(" Server started on port: "+ PORT);
    }
    
    private static void handleRequest(HttpExchange exchange)  {
        String response = "TEST";
        try {
			exchange.sendResponseHeaders(200, response.getBytes().length);
	        OutputStream os = exchange.getResponseBody();
	        os.write(response.getBytes());
	        os.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
 

}
