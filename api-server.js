// Based in large part on https://github.com/FaztWeb/crud-mean-angular5

const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('express-promise-router')();
const mongojs = require('mongojs');
const db = mongojs('books', ['books']);
const app = express();

// port
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Get All Books
app.get('/api/books', (req, res, next) => {
    db.books.find((err, books) => {
        if (err) return next(err);
        res.json(books);
    });
});

// Single Book
app.get('/api/book/:id', (req, res, next) => {
    db.books.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, book) => {
        if (err) return next(err);
        res.json(book);
    });
});

// Add a Book
app.post('/api/books', (req, res, next) => {
    const task = req.body;
    if(!task.title || !(task.isDone + '')) {
        res.status(400).json({
            'error': 'Bad Data'
        });
    } else {
        db.books.save(task, (err, task) => {
            if (err) return next(err);
            res.json(task);
        });
    }
});

// Delete Book
app.delete('/api/books/:id', (req, res, next) => {
    db.books.remove({_id: mongojs.ObjectId(req.params.id)}, (err, book) => {
        if(err){ res.send(err); }
        res.json(book);
    });
})

// Update Book
app.put('/api/books/:id', (req, res, next) => {
    const book = req.body;
    let updateBook = {};

    if(book.isDone) {
        updateBook.isDone = book.isDone;
    }
    if(book.title) {
        updateBook.title = book.title;
    }
    db.books.update({_id: mongojs.ObjectId(req.params.id)}, updateBook, {}, (err, book) => {
        if (err) return next(err);
        res.json(book);
    });
    /*if(!updateTask) {
        res.status(400);
        res.json({'error': 'bad request'});
    } else {
        db.books.update({_id: mongojs.ObjectId(req.params.id)}, updateBook, {}, (err, book) => {
            if (err) return next(err);
            res.json(book);
        });
    }*/
});

// server
//app.use('/api', routes);

// client
// app.use(express.static(path.join(__dirname, 'dist')));

// listen
app.listen(app.get('port'), () => {
    console.log('api server listening on port 3000');
});
