const async = require("async");
const { body, validationResult } = require("express-validator");
const User = require('../models/User');

//Display member form
exports.member_get=function(req,res,next){
    if (!req.user) {
      res.redirect("/login");
      return;
    } else if (req.user.member) {
      res.redirect("/");
    }
    
    res.render('secret',{type:'Member'});
}

//Handle member form on post
exports.member_post=[
    body('member').trim() 
    .escape(),

    (req,res,next)=>{
        if(!req.user){
            res.redirect('/login');
            return;
        }
        if(req.body.member!=='becomeAmemberPassword'){
            res.render('secret',{type:'Member',error:'This is not the password! Try again'})
        }else{
            User.findByIdAndUpdate(req.user._id,{member:true},function(err,theUser){
                if(err) return next(err);
                //success , redirect
                res.redirect('/');
            })
            
        }
    }
]

//Display admin form
exports.admin_get=function(req,res,next){
    if (!req.user) {
        res.redirect("/login");
        return;
      } else if (req.user.member) {
        res.redirect("/");
      }
    res.render('secret',{type:'Admin'});
}

//Handle admin form on post
exports.admin_post=[
    body('admin').trim() 
    .escape(),

    (req,res,next)=>{
        if(!req.user){
            res.redirect('/login');
            return;
        }
        if(req.body.admin!=='becomeAnadminPassword'){
            res.render('secret',{type:'admin',error:'This is not the password! Try again'})
        }else{
            User.findByIdAndUpdate(req.user._id,{admin:true},function(err,theUser){
                if(err) return next(err);
                //success , redirect
                res.redirect('/');
            })
            
        }
    }
]

