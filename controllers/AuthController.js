const async = require("async");
const {check, body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt=require('bcryptjs');
const User = require('../models/User');

//Display Sign Up
exports.signup_get=function(req,res,next){
    if(req.user){
        res.redirect('/');
    }else{
        res.render('signup',{type:'signup'});
    }
}

//Handle Sign Up form on POST
exports.signup_post=[
    body('username').trim().isLength({min:8})
    .withMessage('Username must be at least 8 characters')
    .isAlphanumeric("en-US")
    .withMessage(" Username cannot contain non-alphanumeric character")
    .escape(),
    body('password').trim().isLength({min:8})
    .withMessage('Password must be at least 8 characters')    
    .escape(),
    body('confirm').trim()
    .escape(),
    check('password')
    .custom(value=>!/\s/.test(value))
    .withMessage('No spaces are allowed in the password')
    .exists(),
    check(
        'confirm',
        'Password Confirmation field must have the same value as the password field',
    )
    .exists()
    .custom((value, { req }) => value === req.body.password),
    
    (req,res,next)=>{
        //extract errors
        const errors=validationResult(req);
        let nameErr,pwErr,confErr;
        if(!errors.isEmpty()){            
            for(let err of errors.array()){
                switch(err.param){
                    case 'username':
                        nameErr=err.msg;
                        break;
                    case 'password':
                        pwErr=err.msg;
                        break;
                    case 'confirm':
                        confErr=err.msg;
                        break;
                };
            };
            res.render('signup',{type:"signup",nameErr,pwErr,confErr})            
        }else{
            //Check if username is existing in database
            console.log(req.body)
            User.findOne({username:req.body.username})
            .exec(function(err,foundUser){
                
                if(err) return next(err);
                
                if(foundUser){
                    res.render('signup',{type:"signup",foundUser:req.body.username})
                }else{
                    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                        if(err) return next(err);
                        // otherwise, store hashedPassword in DB
                        const user = new User({
                          username: req.body.username,
                          password: hashedPassword,
                          member:false,
                          admin:false,
                          avatar:`https://avatars.dicebear.com/api/human/${Math.floor(Math.random()*100)+1}.svg`
                        }).save(err => {
                            if (err) return next(err);
                            passport.authenticate('local',{
                                successRedirect: "/",
                                failureRedirect: "/"
                              })(req,res,next);
                        });               
                      }); 
                }
            })
        }
    }
    
];


//Display Login form
exports.login_get=function(req,res,next){
    if(req.user){
        res.redirect('/');
    }else{
        
        res.render('signup',{type:'login',errorMessage:req.flash().error});
        return;
    }
}

//Display Login form
exports.login_post=[
    body('username').trim().isLength({min:8})
    .withMessage('Username must be at least 8 characters')
    .escape(),
    body('password').trim().isLength({min:8})
    .withMessage('Password must be at least 8 characters')
    .escape(),

    (req,res,next)=>{
        passport.authenticate('local', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash :true // allow flash messages
        })(req, res, next);
    }
]


