const express  = require("express");
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

const user = null;

message = null;
//Login routes
router.get("/login", (req, res) => { 
    if(req.session.isAuth){res.redirect('/blogs');}
    res.render('login.ejs', { title: 'Login' ,user:user ,message: message});
    
});
router.post("/login", async (req, res) => {

    const username= req.body.username;
    const user = await User.findOne({username:username})

    if(!user){
        message = " Wrong password or username";
        res.redirect('/login');
        return;
    }
    const isMatch= await bcrypt.compare(req.body.password, user.password);
    
    if(!isMatch){
        message = " Wrong password or username";
        res.redirect('/login');
        return;
    }
    req.session.username = user.username;
    req.session.isAuth= true;
    message = null;
    res.redirect('/');
    
});

//Register routes
router.get("/register", (req, res) => {
    res.redirect('/login');
});
router.post("/register", async (req, res) => {

    const isExist= await User.findOne({username:req.body.username});
    if(isExist){
        res.redirect('/login');
        return;
    }
    const user= new User({
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
        });
        try{
            await user.save();
            message = "You are now registered";
            res.redirect('/login');
        }catch(err){
        console.log(err);
        }
});

router.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;