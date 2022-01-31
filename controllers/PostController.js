const async = require("async");
const { body, validationResult } = require("express-validator");
const User = require('../models/User');
const Post = require('../models/Posts');
const moment=require('moment');


//Display all posts
exports.get_posts=function(req,res,next){
    Post.find().sort({timestamp:'desc'})
    .populate('user')
    .exec(function(err,posts){
        if(err) return next(err);
        console.log(posts,req.user)
        let admin,member=false;
        if(req.user){
            admin=req.user.admin;
            member=req.user.member;
        }
        console.log(admin)
        res.render('posts',{user:req.user,posts,admin,member})

    })
    
}


//Display post form
exports.postform_get=function(req,res,next){
    if(!req.user){
        res.redirect('/');
        return;
    }
    res.render('message')
}

//Handle post form on POST
exports.postform_post=[
    body('title').trim().isLength({min:2})
    .withMessage('Title must be at least 2 characters')
    .isLength({max:20})
    .withMessage('Title cannot be more than 20 characters')
    .escape(),
    body('message').trim().isLength({min:2})
    .withMessage('Post must be at least 2 characters')
    .isLength({max:100})
    .withMessage('Title cannot be more than 100 characters')
    .escape(),

    (req,res,next)=>{
        //user logged in?
        if(!req.user) {
            res.redirect('/login');
            return;
        };

        //extract errors
        
        const errors=validationResult(req);
        let titleErr,messageErr;
        if(!errors.isEmpty()){
            for(let err of errors.array()){
                switch(err.param){
                    case 'title':
                        titleErr=err.msg;
                        break;
                    case 'message':
                        messageErr=err.msg;
                        break;                    
                };
            };
            console.log(moment(Date.now()).format('YYYY/MM/D hh:mm'))
            res.render('message',{titleErr,messageErr})
        }else{
            const post=new Post({
                user:req.user._id,
                title:req.body.title,
                post:req.body.message,
                timestamp:Date.now(),
                date:moment(Date.now()).format('YYYY/MM/D hh:mm:')
            }).save(err=>{
                if(err) return next(err);
                //Sucess , redirect
                res.redirect('/');
                
            });
        }
    }
];

exports.delete=function(req,res,next){
    if(!req.user){
        res.redirect('/');
    }else if(!req.user.admin){
        res.redirect('/');
    }else{
        Post.findByIdAndDelete(req.params.id,function(err,post){
            if(err){
              app.use(function(req, res, next) {
                next(err);
              });
            }else{
              
                console.log("deleted:",post)
                res.redirect('/');
                return;
              
            }
          })
    }
}