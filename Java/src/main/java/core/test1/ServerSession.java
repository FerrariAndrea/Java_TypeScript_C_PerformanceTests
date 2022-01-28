package core.test1;

import java.util.HashMap;
import java.util.concurrent.Semaphore;

import model.User;

public class ServerSession {
	
	 private static HashMap<String,User> users= new HashMap<String,User>();
	 private static final Semaphore sem = new Semaphore(1, true);
	 
	 public static void addUser(String id, User u) throws InterruptedException{
		 sem.acquire();
		 users.put(id,u);
		 sem.release();
	 }
	 
	 public static User getUser(String id) throws InterruptedException{ 
		 sem.acquire();
		 User u = users.get(id);
		 sem.release();
		 //after that the Semaphore should't necessary because in the test case
		 //ad User object is required just by one real user 
		 //we should't have more than one access to the same User object at the same time
		 return u;
	 }
	 
	 
}
