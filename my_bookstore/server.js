const express = require("express");
const app = express();

const adminRoutes = require("./routes/adminRoutes");

app.use(express.json());

app.use("/api/admin", adminRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});