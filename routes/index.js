var express    = require("express"),
    router     = express.Router(),
    user       = require("../models/user"),
    passport   = require("passport");


// HOME
router.get("/", function(req, res){
    res.render("campgrounds/home");
})

// REGISTER
router.get("/register", function(req,res){
    res.render("auth/register");
})

router.post("/register", function(req,res){
    var newUser = new user({username:req.body.username});
    user.register(newUser, req.body.password, function(err,user){
        if (err){
            req.flash("error", err.message);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                console.log(user);
                req.flash("success", "Welcome to Yelp Camp " + user.username);
                res.redirect("/campgrounds");
            })
        }
    })
})

// LOGIN
router.get("/login",function(req,res){
    res.render("auth/login");
})

router.post("/login", passport.authenticate("local",{ 
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: 'Welcome to YelpCamp!'
    }), function(req,res){
    });

    router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to YelpCamp!'
    }), function(req, res){
})

// LOGOUT
router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success", "Successfully logged out");
    res.redirect("/campgrounds");
})

module.exports = router;