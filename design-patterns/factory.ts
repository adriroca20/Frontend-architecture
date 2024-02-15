abstract class Payment {
    abstract pay(): void;
}
class Stripe extends Payment {
    pay(): void {
        console.log("Stripe Payment");
    }
}

class Paypal extends Payment {
    pay(): void {
        console.log("Paypal Payment");
    }
}

// Factory class
export class PaymentFactory {
    createPayment(type: string): Payment {
        if (type === "stripe") {
            return new Stripe();
        } else if (type === "paypal") {
            return new Paypal();
        } else {
            throw new Error("Invalid Payment type.");
        }
    }
    public products: any = {
        stripe: new Stripe(),
        paypal: new Paypal(),
    }    
}



