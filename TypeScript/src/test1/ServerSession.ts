
import User from '../model/User';

class ServerSession{
    private static users: Map<string, User>= new Map<string, User>(); 

    public static addUser(id:string, u:User):void{
        ServerSession.users.set(id,u);
    }
    
    public static getUser(id:string):User{ 
        return ServerSession.users.get(id);
    }
}


export default ServerSession;