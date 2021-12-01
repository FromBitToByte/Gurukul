const express = require("express");
const passport = require("passport");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
const SuperUser = require("../../models/SuperUser");
const router = express.Router();

router.get("/registerPage", (req,res)=>{
    res.render("signup", {
        currentUser: req.user,
        clientType: req.session.client
    });
   
});


router.post("/registerSuperUser",async (req,res)=>{

    SuperUser.create( req.body.mains1, (err,teacher)=>{
        if(err){
            console.log( "here" );
            console.log(err);
        }
    });

    res.render("home", {
        currentUser: req.user,
        clientType: req.session.client
    });

});


module.exports = router;