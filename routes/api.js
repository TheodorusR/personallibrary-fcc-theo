/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false});

const bookSchema = new mongoose.Schema({
  title: String,
  commentcount: {type: Number, default: 0},
  comments: {type: [String], default: []}
})

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      try {
        let books = await Book.find();
        res.json(books);
      } catch (err) {
        res.json({error: 'Error finding books.'})
      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      if (!title) {
        res.send("missing required field title");
        return;
      }
      try {
        let book = await Book.create({title: title});
        res.json({
          title: book.title,
          _id: book._id
        })
      } catch (err) {
        res.json({error: 'Cannot add book.'});
      }
    })
    
    .delete(async function(req, res){
      try {
        let books = await Book.deleteMany();
        if (!books) {
          throw Error();
        }
        res.send("complete delete successful");
      } catch (err) {
        res.json({error: "Error deleting all books."});
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      try {
        let book = await Book.findById(bookid);
        res.json({
          title: book.title,
          _id: book._id,
          comments: book.comments
        });
      } catch (err) {
        res.send("no book exists");
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send("missing required field comment");
        return;
      } 
      try {
        let book = await Book.findByIdAndUpdate(bookid, {$push:{comments: comment}, $inc: {commentcount: 1}}, {new:true});
        res.json({
          title: book.title,
          _id: book._id,
          comments: book.comments
        });
      } catch (err) {
        res.send("no book exists");
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      try {
        let book = await Book.findByIdAndRemove(bookid);
        if (!book) {
          throw Error();
        }
        res.send("delete successful");
      } catch (err) {
        res.send("no book exists");
      }
    });
  
};
