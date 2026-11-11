const express = require("express");

const app = express();
app.use(express.json());

const orders = [
    { id: 1, userId: 1, productId: 1, quantity: 1 },
    { id: 2, userId: 2, productId: 2, quantity: 2 }
];

app.get("/", (req, res) => {
    res.send("Order Service is Running");
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "order-service"
    });
});

app.get("/orders", (req, res) => {
    res.json(orders);
});

app.get("/orders/:id", (req, res) => {
    const order = orders.find(
        o => o.id === Number(req.params.id)
    );

    if (!order) {
        return res.status(404).json({
            error: "Order not found"
        });
    }

    res.json(order);
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Order Service running on port ${PORT}`);
});
