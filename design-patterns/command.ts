interface Command {
    execute(): void;
}

class AddToCartCommand implements Command {
    execute(): void {
        console.log("Product added to cart.");
        // Additional logic for adding the product to the cart
    }
}

class RemoveFromCartCommand implements Command {
    execute(): void {
        console.log("Product removed from cart.");
        // Additional logic for removing the product from the cart
    }
}

class PlaceOrderCommand implements Command {
    execute(): void {
        console.log("Order placed.");
        // Additional logic for placing the order
    }
}

class OrderHistory {
    private commands: Command[] = [];

    addCommand(command: Command): void {
        this.commands.push(command);
    }

    replayCommands(): void {
        for (const command of this.commands) {
            command.execute();
        }
    }
}

// Usage:
const orderHistory = new OrderHistory();

const addToCartCommand = new AddToCartCommand();
const removeFromCartCommand = new RemoveFromCartCommand();
const placeOrderCommand = new PlaceOrderCommand();

orderHistory.addCommand(addToCartCommand);
orderHistory.addCommand(removeFromCartCommand);
orderHistory.addCommand(placeOrderCommand);

orderHistory.replayCommands();
