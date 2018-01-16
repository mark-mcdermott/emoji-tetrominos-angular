import { Component, OnInit } from '@angular/core';
import { Score } from '../../models/score';
import { ScoreService } from '../../services/score/score.service';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css'],
  providers: [ScoreService]
})

export class ScoresComponent implements OnInit {
  scores: Score[];
  selectedScore: Score;
  name: string;
  score: string;

  constructor(private scoreService: ScoreService) {
    this.scoreService.getScores()
      .subscribe(scores => {
        this.scores = scores;
      });
  }

  ngOnInit() {
  }

  addScore(event){
    event.preventDefault();
    const newScore:Score = {
      name: this.name,
      score: this.score,
      _id: ''
    };
    this.scoreService.addScore(newScore)
      .subscribe(score => {
        this.scores.push(newScore);
        this.name = '';
        this.score = '';

        this.scoreService.getScores()
          .subscribe(scores => {
            this.scores = scores;
          });

      })
  }

  deleteScore(id) {
    //const response = confirm('are you sure to delete it?');
    //if (response){
    const scores = this.scores;
    this.scoreService.deleteScore(id)
      .subscribe(data => {
          for(let i = 0; i < scores.length; i++) {
            if(scores[i]._id == id) {
              scores.splice(i, 1);
            }
          }
        })
    //}
  }

  onSelect(score: Score) {
    this.selectedScore = score;
  }



}
