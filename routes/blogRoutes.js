const express  = require("express");
const router = express.Router();

const Blog = require('../models/blog');



router.get("/blogs",(req,res)=>{
    
    Blog.find().sort({createdAt:-1}).then((result) => {
        res.render('index.ejs', { blogs: result , title: 'All Blogs' ,user:req.session.isAuth , username:req.session.username});
    }).catch((err) => {
        console.log(err);
    });
});
router.get("/blogs/crate", (req, res) => {    
    if(!req.session.isAuth){res.redirect('/login');
return}
    res.render('create.ejs', { title: 'Create a new Blog',user:req.session.isAuth});
});

router.post("/blogs", (req, res) => {
    
    const blog= new Blog({
        title: req.body.title,
        snippet: req.body.snippet,
        body: req.body.body,
        username:req.session.username,
        });
    blog.save().then((result) => {
        res.redirect('/blogs');
    }).catch((err) => {
        console.log(err);
    });

});
router.get("/blogs/:id", (req, res) => {

    const id = req.params.id;
    Blog.findById(id).then((result) => {
        console.log(result);
        res.render('post.ejs', { blog: result , title: 'Blog Details',user:req.session.isAuth });
    }).catch((err) => {
        console.log(err);
    });
});

router.post('/blogs/:id/comments', (req, res) => {
    const comment = {
        username: req.session.username,
        text: req.body.text,
        date: new Date()
    };
    Blog.findByIdAndUpdate(req.params.id, { $push: { comments: comment } }, { new: true })
        .then((result) => {
            res.redirect('/blogs/' + req.params.id);
        })
        .catch((err) => {
            console.log(err);
        });
});
module.exports = router;