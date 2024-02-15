// Using the Singleton pattern ensures that there is only one instance of the class throughout 

class UserSession{
    private static session:UserSession;

    private constructor(){}
    public static getSession():UserSession{
        if(!UserSession.session){
            UserSession.session = new UserSession();
        }
        return UserSession.session;
    }
    public getCredentials():void{
        console.log("User: Paco");
    }
}

const user = UserSession.getSession();
user.getCredentials();