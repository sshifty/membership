const express = require('express');
const router = express.Router();
const auth_controller=require('../controllers/AuthController');
const post_controller=require('../controllers/PostController');
const user_controller=require('../controllers/UserController');

/* GET home page filled with posts */
router.get('/', post_controller.get_posts);

//signup
router.get('/signup',auth_controller.signup_get);
router.post('/signup',auth_controller.signup_post);

//Login Router
router.get('/login',auth_controller.login_get);
router.post('/login',auth_controller.login_post);

//create Post
router.get('/message',post_controller.postform_get);
router.post('/message',post_controller.postform_post);

//Logout
router.get('/logout',(req, res,next) => {
    req.logout();
    res.redirect('/');
});


//Member 
router.get('/member',user_controller.member_get);
router.post('/member',user_controller.member_post);

//Admin
router.get('/admin',user_controller.admin_get);
router.post('/admin',user_controller.admin_post);

router.get('/:id/delete',post_controller.delete);

module.exports = router;
