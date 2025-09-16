console.log("Executing latest version of app.js");
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
    console.log(process.env);
};
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./ExpressError.js"); // Standardize to ExpressError
const { listingSchema} = require("../schema.js"); // Keep local schema import

const dbUrl = process.env.ATLASDB_URL; // Use environment variable for DB URL

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user.js");

const listingRouter = require("../routes/listing.js");
const reviewRouter = require("../routes/review.js");
const userRouter = require("../routes/user.js");

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(dbUrl); // Use dbUrl from environment variable
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl, // Use dbUrl from environment variable
    crypto: {
        secret: process.env.SECRET || 'thisshouldbeabettersecret!', // Use environment variable for secret
    },
    touchAfter: 24 * 3600,
})

store.on("error", (err) => { // Added err parameter for consistency
    console.log("ERROR in MONGO SESSION STORE.", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET, // Use environment variable for secret
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // Standardized cookie expiration
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // Use passport-local-mongoose methods
passport.deserializeUser(User.deserializeUser()); // Use passport-local-mongoose methods

app.use((req,res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

app.get("/", (req, res) => { // Keep local redirect
    res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!")); // Standardize to ExpressError
})

app.use((err, req, res, next) => { // Standardized error handling middleware
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err }); // Pass err object to template
});

app.listen(8080, () => { // Use port 8080
    console.log("server is started");
});