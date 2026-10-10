const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/bookstore")
    .then(async () => {
        const user = await User.create({
            name: "Rahul",
            email: "rahul@example.com",
            password: "hashedPassword123"
        });

        console.log(user);
        process.exit();
    })
    .catch(console.error);