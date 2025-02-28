const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const invoiceRoutes = require("./routes/invoice");
const verifyToken = require('./middleware/authMiddle');

const app = express();
const PORT = 5000;
const MONGO_URI = "mongodb+srv://maryam2002:maryam2002@cluster0.2jaj3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    });

app.use(express.json());

//  Define Routes
app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", verifyToken, invoiceRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
