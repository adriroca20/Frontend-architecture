interface Product {
    getPrice(): number;
    getDescription(): string;
}

class BaseProduct implements Product {
    getPrice(): number {
        return 100;
    }

    getDescription(): string {
        return "Base product";
    }
}

abstract class ProductDecorator implements Product {
    protected product: Product;

    constructor(product: Product) {
        this.product = product;
    }

    getPrice(): number {
        return this.product.getPrice();
    }

    getDescription(): string {
        return this.product.getDescription();
    }
}

class GiftWrappingDecorator extends ProductDecorator {
    getPrice(): number {
        return this.product.getPrice() + 10;
    }

    getDescription(): string {
        return `${this.product.getDescription()} with gift wrapping`;
    }
}

class ExpeditedShippingDecorator extends ProductDecorator {
    getPrice(): number {
        return this.product.getPrice() + 20;
    }

    getDescription(): string {
        return `${this.product.getDescription()} with expedited shipping`;
    }
}

// Usage:
const baseProduct = new BaseProduct();
const productWithGiftWrapping = new GiftWrappingDecorator(baseProduct);
const productWithExpeditedShipping = new ExpeditedShippingDecorator(baseProduct);
const productWithBoth = new ExpeditedShippingDecorator(new GiftWrappingDecorator(baseProduct));

console.log(baseProduct.getPrice()); // Output: 100
console.log(baseProduct.getDescription()); // Output: Base product

console.log(productWithGiftWrapping.getPrice()); // Output: 110
console.log(productWithGiftWrapping.getDescription()); // Output: Base product with gift wrapping

console.log(productWithExpeditedShipping.getPrice()); // Output: 120
console.log(productWithExpeditedShipping.getDescription()); // Output: Base product with expedited shipping

console.log(productWithBoth.getPrice()); // Output: 130
console.log(productWithBoth.getDescription()); // Output: Base product with gift wrapping with expedited shipping