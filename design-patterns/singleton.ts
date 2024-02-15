export class UserSession{
    private static session:UserSession;
    //Haciendolo privado haces que no se puedan instanciar nuevos objetos
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