var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");

seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"))
mongoose.connect("mongodb://localhost/yelp_camp_v6");


// Password configuration
app.use(require("express-session")({
    secret: "tutu is fairytale!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res,next){
    res.locals.currentUser = req.user;
    next();
});


// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//         description: "This is a huge granite hill"
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("newly create:");
//             console.log(campground);
//         }
//     }
// );


var campgrounds =[
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
]

app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampground});
        }
    })

    

    // res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
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

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground : foundCampground});
        }
    });
    
})
// ===========================
// COMMENTS ROUTES
// ===========================

app.get("/campgrounds/:id/comments/new", isLogginedIn, function(req,res){
    // find campground by id
    Campground.findById(req.params.id,function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
    
});

app.post("/campgrounds/:id/comments", isLogginedIn,function(req, res){
    // lookup campground using id
    // create new comment
    // connect new comment to campground
    // redirect campground 
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
            
        }
    })
})


// ===========================
// AUTH ROUTES
// ===========================

app.get("/register", function(req, res){
    res.render("register");
})
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,function(err, user){
        if (err) {
            console.log(err);
            return res.send("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    });
});

// show login form
app.get("/login", function(req, res){
    res.render("login");
})
// app.post("/login", middleware, callback);
app.post("/login", passport.authenticate("local", 
    {
        successRedirect : "/campgrounds",
        failureRedirect : "/login"
    }),function(req,res){
        
    });

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLogginedIn(req,res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))