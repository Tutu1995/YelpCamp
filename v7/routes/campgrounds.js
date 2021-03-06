var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res){
    Campground.find({}, function(err, allCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampground});
        }
    })

});

router.post("/", function(req, res){
    var name = req.body.name;
    var description= req.body.description;
    var image = req.body.image;
    var newCampground = {name: name, image:image, description:description}
    Campground.create(newCampground, function(err, newlyCreate){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
    
});

router.get("/new", function(req, res){
    res.render("campgrounds/new");
})

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground : foundCampground});
        }
    });  
})

module.exports = router;