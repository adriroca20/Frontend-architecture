class InventoryManager {
    checkAvailability(productId: string): boolean {
        return true;
    }
}

class PaymentProcessor {
    processPayment(productId: string, amount: number): boolean {
        return true;
    }
}

class ShippingService {
    shipProduct(productId: string): void {
        console.log(`Product ${productId} has been shipped.`);
    }
}

class OrderFacade {
    private inventoryManager: InventoryManager;
    private paymentProcessor: PaymentProcessor;
    private shippingService: ShippingService;

    constructor() {
        this.inventoryManager = new InventoryManager();
        this.paymentProcessor = new PaymentProcessor();
        this.shippingService = new ShippingService();
    }

    placeOrder(productId: string, amount: number): void {
        const isAvailable = this.inventoryManager.checkAvailability(productId);
        if (isAvailable) {
            const isPaymentSuccessful = this.paymentProcessor.processPayment(
                productId,
                amount
            );
            if (isPaymentSuccessful) {
                this.shippingService.shipProduct(productId);
            }
        }
    }
}

// Usage:
const orderFacade = new OrderFacade();
orderFacade.placeOrder("ABC123", 100);
