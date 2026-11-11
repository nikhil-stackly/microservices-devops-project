const express = require("express");

const app = express();
app.use(express.json());

const products = [
    { id: 1, name: "Laptop", price: 55000 },
    { id: 2, name: "Mobile", price: 25000 },
    { id: 3, name: "Headphones", price: 2000 }
];

app.get("/", (req, res) => {
    res.send("Product Service is Running");
});

app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        service: "product-service"
    });
});

app.get("/products", (req, res) => {
    res.json(products);
});

app.get("/products/:id", (req, res) => {
    const product = products.find(
        p => p.id === Number(req.params.id)
    );

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Product Service running on port ${PORT}`);
});
