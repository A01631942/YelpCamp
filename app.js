// Yelp Camp v2
var express               = require ("express"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    // seedDB                = require("./seeds"),
    passport              = require("passport"),
    localStrategy         = require("passport-local"),
    user                  = require("./models/user"),
    expressSession        = require("express-session"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride        = require("method-override"),
    
    campgroundRoutes      = require("./routes/campgrounds"),
    commentRoutes         = require("./routes/comments"),
    indexRoutes           = require("./routes/index");

// APP CONFIG
require("dotenv").config({path:"variables.env"});
mongoose.connect(process.env.DB_URL, 
    {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
var app=express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))
app.use(flash());

// PASSPORT CONFIGURATION
// IMPORTANT: this line of code has to be before all the passport code
app.use(expressSession({
    secret:"Gracias",
    resave: false,
    saveUninitialized: false,
}))

// we need those lines every time we use passport
app.use(passport.initialize());
app.use(passport.session());

// creating a new local strategy  with the user.authenticate that is coming from passport local mongoose
// we're just tellig passport, for the local strategy us the .authenticate method
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// use currentUser in all of the ejs
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// Routing Files
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);



const host= process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 3000;

app.listen(port, host, function(){
    console.log("Yelp Camp server working");
})


// var port = process.env.PORT || 3000;
// app.listen(port, function () {
//   console.log("Server Has Started!");
// });