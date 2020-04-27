// middleware file
var middleware={};
var Campground = require ("../models/campground");
var Comment    = require ("../models/comment");

middleware.checkCampgroundOwnersip =function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }else{
                // check if the user owns the campground
                if(foundCampground.author.id.equals(req.user.id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        })
        // if not loggged in don't let edit
    }else{
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
}

middleware.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login"); 
    } 
}

middleware.checkCommentOwnersip= function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }else{
                // check if the user owns the comment
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                } else{
                    req.params("error", "You do not have permission to do that");
                    res.redirect("back")
                }
            }
        })
        // if not loggged in don't let edit
    }else{
        req.flash("You need to be logged in to do that");
        res.redirect("back");
    }
}


module.exports = middleware;