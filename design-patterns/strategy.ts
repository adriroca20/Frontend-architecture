interface DiscountStrategy {
    calculateDiscount(price: number): number;
}

class BronzeDiscountStrategy implements DiscountStrategy {
    calculateDiscount(price: number): number {
        // Apply discount calculation logic for bronze level customers
        return price * 0.95;
    }
}

class SilverDiscountStrategy implements DiscountStrategy {
    calculateDiscount(price: number): number {
        // Apply discount calculation logic for silver level customers
        return price * 0.9;
    }
}

class GoldDiscountStrategy implements DiscountStrategy {
    calculateDiscount(price: number): number {
        // Apply discount calculation logic for gold level customers
        return price * 0.85;
    }
}

class Customer {
    private loyaltyLevel: DiscountStrategy;

    constructor(loyaltyLevel: DiscountStrategy) {
        this.loyaltyLevel = loyaltyLevel;
    }

    setLoyaltyLevel(loyaltyLevel: DiscountStrategy): void {
        this.loyaltyLevel = loyaltyLevel;
    }

    calculateTotalWithDiscount(price: number): number {
        return this.loyaltyLevel.calculateDiscount(price);
    }
}

// Usage:
const bronzeCustomer = new Customer(new BronzeDiscountStrategy());
const silverCustomer = new Customer(new SilverDiscountStrategy());
const goldCustomer = new Customer(new GoldDiscountStrategy());

const price = 100;
console.log(bronzeCustomer.calculateTotalWithDiscount(price)); // Output: 95
console.log(silverCustomer.calculateTotalWithDiscount(price)); // Output: 90
console.log(goldCustomer.calculateTotalWithDiscount(price)); // Output: 85
