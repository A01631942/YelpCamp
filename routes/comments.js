// comments routes
var express        = require("express");
    router         = express.Router({mergeParams:true});
    Campground     = require("../models/campground");
    Comment        = require("../models/comment")
    methodOverride = require("method-override");
    middleware     = require("../middleware");

// NEW
router.get("/new",middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if (err){
            console.log(err);
        } else{
            res.render("comments/new", {campground:foundCampground});
        }
    })
});

// CREATE
router.post("/",middleware.isLoggedIn, function(req,res){
    // look campground by ID
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            req.flash("error","Comment not found");
            console.log(err);
        }
        else{
            // Create comment
            Comment.create(req.body.comment, function(err,comment){
                // save id and username
                comment.author.username = req.user.username;
                comment.author.id=req.user._id;
                // save comment
                comment.save();
                // Connect with campground
                foundCampground.comments.push(comment);
                foundCampground.save();
                req.flash("success", "Successfully created comment");
                res.redirect("/campgrounds/" + foundCampground._id);
            });
            
        }
    })
})

// EDIT
router.get("/:comment_id/edit",middleware.checkCommentOwnersip, function(req,res){
    // the id in the .id is the campground, since it is the first id stated
    // the second id (comment_id) is the comment id, it can be named anything
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
            req.flash("error", "Comment not found")
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id:req.params.id, comment:foundComment})
        }
    })    
})
// UPDATE

router.put("/:comment_id",middleware.checkCommentOwnersip, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            req.flash("error", "Comment not found");
            res.reditect("back");
        }else{
            req.flash("success", "Successfully updated comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:comment_id",middleware.checkCommentOwnersip, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err,foundComment){
        if(err){
            req.flash("error", "Comment not found");
            res.redirect("back");
        }else{
            req.flash("success","Successfully deleted comment")
            res.redirect("/campgrounds/"+ req.params.id);        }
        
    });
});

module.exports = router;