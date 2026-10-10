require("dotenv").config();

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const viewRoutes = require("./routes/viewRoutes");

const errorHandler =
    require("./middleware/errorMiddleware");

const app = express();


// ===============================
// DATABASE
// ===============================

connectDB();


// ===============================
// SECURITY
// ===============================

app.use(helmet());


// ===============================
// CORS
// ===============================

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN,
        credentials: true
    })
);


// ===============================
// BODY PARSERS
// ===============================

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ===============================
// COOKIES
// ===============================

app.use(cookieParser());


// ===============================
// EJS
// ===============================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


// ===============================
// STATIC FILES
// ===============================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ===============================
// ROUTES
// ===============================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/posts",
    postRoutes
);

app.use(
    "/",
    viewRoutes
);


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.redirect("/posts");
});


// ===============================
// ERROR HANDLER
// ===============================

app.use(errorHandler);


// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});