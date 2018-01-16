// Based in large part on https://github.com/FaztWeb/crud-mean-angular5

const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('express-promise-router')();
const mongojs = require('mongojs');
const db = mongojs('scores', ['scores']);
const app = express();

// port
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Get All Scores
app.get('/api/scores', (req, res, next) => {
    db.scores.find((err, scores) => {
        if (err) return next(err);
        res.json(scores);
    });
});

// Single Score
app.get('/api/score/:id', (req, res, next) => {
    db.scores.findOne({_id: mongojs.ObjectId(req.params.id)}, (err, score) => {
        if (err) return next(err);
        res.json(score);
    });
});

// Add a Score
app.post('/api/scores', (req, res, next) => {
    const task = req.body;
    if(!task.name || !(task.isDone + '')) {
        res.status(400).json({
            'error': 'Bad Data'
        });
    } else {
        db.scores.save(task, (err, task) => {
            if (err) return next(err);
            res.json(task);
        });
    }
});

// Delete Score
app.delete('/api/scores/:id', (req, res, next) => {
    db.scores.remove({_id: mongojs.ObjectId(req.params.id)}, (err, score) => {
        if(err){ res.send(err); }
        res.json(score);
    });
})

// Update Score
app.put('/api/scores/:id', (req, res, next) => {
    const score = req.body;
    let updateScore = {};

    if(score.isDone) {
        updateScore.isDone = score.isDone;
    }
    if(score.name) {
        updateScore.name = score.name;
    }
    if(score.score) {
        updateScore.score = score.score;
    }
    db.scores.update({_id: mongojs.ObjectId(req.params.id)}, updateScore, {}, (err, score) => {
        if (err) return next(err);
        res.json(score);
    });
    /*if(!updateTask) {
        res.status(400);
        res.json({'error': 'bad request'});
    } else {
        db.scores.update({_id: mongojs.ObjectId(req.params.id)}, updateScore, {}, (err, score) => {
            if (err) return next(err);
            res.json(score);
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
