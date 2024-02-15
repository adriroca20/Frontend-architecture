import { UserSession } from "./singleton";

class main{
    const user = UserSession.getSession();
    user.getCredentials();
}