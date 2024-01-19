const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String
    },
    body: {
        type: String,
        required: true
    }
    ,username:{
        type:String,
        required:true
    }
    ,comments: [{
        username: String,
        text: String,
        date: Date
    }]
}, { timestamps: true });

const Blog= mongoose.model('Blog', blogSchema);
module.exports = Blog;