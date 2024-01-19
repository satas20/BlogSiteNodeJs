const express = require('express');
const bcrypt = require('bcrypt');
const morgan =require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const app = express();

//Routes
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/auth');

// EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//MongoDB connection
const dbURI = "mongodb+srv://admin:admin@cluster0.hcm9u0d.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result) => app.listen(process.env.PORT || 3000)).catch((err) => console.log(err));

//Session store
const store= new MongoDBSession({
    uri:dbURI,
    collection:'Sessions'
 })
const isAuth= (req, res, next) => {
    if(req.session.isAuth){
        next();
    }else{
        res.redirect('/login');
    }
}
///Midileware
app.use(morgan('dev'));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store:store,
}));


app.get("/", (req, res) => {
    
    res.redirect('/blogs');
});


app.use(blogRoutes);
app.use((authRoutes));
app.use((req, res) => {
    res.status(404).render('404.ejs', { title: '404' });
});