import { PaymentFactory } from "./factory";
import { UserSession } from "./singleton";
// npx ts-node src/foo.ts
class main {
    private user: UserSession;

    constructor() {
        this.user = UserSession.getSession();
    }
    public trySingleton(): void {
        this.user.getCredentials();
    }

    private factory: PaymentFactory = new PaymentFactory();

    public tryFactory(): void {
        const paymentStripe = this.factory.products.stripe;
        const paymentPaypal = this.factory.createPayment("paypal");
        paymentStripe.pay();
        paymentPaypal.pay();
    }
}

const mainExecution = new main();
// mainExecution.trySingleton();
mainExecution.tryFactory();
