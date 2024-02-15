class Product {
    private subscribers: Observer[] = [];

    subscribe(observer: Observer): void {
        this.subscribers.push(observer);
    }

    unsubscribe(observer: Observer): void {
        const index = this.subscribers.indexOf(observer);
        if (index !== -1) {
            this.subscribers.splice(index, 1);
        }
    }

    notify(): void {
        for (const subscriber of this.subscribers) {
            subscriber.update(this);
        }
    }
}

interface Observer {
    update(product: Product): void;
}

class User implements Observer {
    private name: string;

    constructor(name: string) {
        this.name = name;
    }

    update(product: Product): void {
        console.log(`User ${this.name}: ${product} is now available.`);
    }
}

// Usage:
const product = new Product();
const user1 = new User("Paco");
const user2 = new User("Maria");

product.subscribe(user1);
product.subscribe(user2);

// Product becomes available
product.notify();