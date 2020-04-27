// Campgroud routes
var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var mongoose   = require("mongoose");
var middleware = require("../middleware")


// INDEX
router.get("/", function(req, res){
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else{
            //the source of the 2nd campgrounds is no hard coded
            //it is defined inside this function
            //render campgrounds
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser:req.user});
        }
        
    });
    
})

//NEW
router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// CREATE
router.post("/",middleware.isLoggedIn, function(req,res){
    var campName= req.body.name;
    var campPrice=req.body.price;
    var campImage= req.body.image;
    var campDesc=req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCamp ={name:campName, price:campPrice, image:campImage, description:campDesc, author: author};
    //create a new campground and save to db
    Campground.create(newCamp, function(err, newlyCreated){
        if (err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
             //redirect back to campgrounds
            res.redirect("/campgrounds");
        }
    })
})

//SHOW
router.get("/:id", function(req,res){
    //find the campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(err, selectedCampground){
        if (err){
            console.log(err);
        } else{
            //the source of the 2nd campgrounds is no hard coded
            //it is defined inside this function
            //render campgrounds
            res.render("campgrounds/show", {campground:selectedCampground});
        }
        
    });
})

// EDIT
router.get("/:id/edit",middleware.checkCampgroundOwnersip, function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit", {campground:foundCampground});
    });
});

// UPDATE
router.put("/:id",middleware.checkCampgroundOwnersip, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
            res.redirect("/campgrounds/" + req.params.id);
    })
})

// DESTROY
router.delete("/:id",middleware.checkCampgroundOwnersip, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        res.redirect("/campgrounds");
    });
});


module.exports = router;