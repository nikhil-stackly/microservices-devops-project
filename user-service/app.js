const express = require("express");

const app = express();
app.use(express.json());

const users = [
    { id: 1, name: "Nikhil", email: "nikhil@example.com" },
    { id: 2, name: "Rahul", email: "rahul@example.com" }
];

app.get("/", (req, res) => {
    res.send("User Service is Running");
});

app.get("/health", (req, res) => {
    res.json({ status: "healthy", service: "user-service" });
});

app.get("/users", (req, res) => {
    res.json(users);
});

app.get("/users/:id", (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id));

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`User Service running on port ${PORT}`);
});
