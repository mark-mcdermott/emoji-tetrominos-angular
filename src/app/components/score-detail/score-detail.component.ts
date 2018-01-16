import { Component, OnInit } from '@angular/core';
import { Score } from '../../models/score';
import { ActivatedRoute } from '@angular/router';
import { ScoreService } from '../../services/score/score.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-score-detail',
  templateUrl: './score-detail.component.html',
  styleUrls: ['./score-detail.component.css'],
  providers: [ScoreService]
})
export class ScoreDetailComponent implements OnInit {

  score: Score;
  scores: Score[];
  author: string;
  title: string;
  id: string;

  constructor(private router: Router, private route: ActivatedRoute, private scoreService: ScoreService) {
    this.route.params.subscribe( params => this.id = params.id );

    this.scoreService.getScores()
      .subscribe(scores => {
        this.scores = scores;
        for (let score of scores) {
          if (score._id === this.id) {
            this.score = score;
          }
        }
      });

  }

  ngOnInit() {
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
              this.router.navigate(['/scores']);
            }
          }
        })

    //}
  }

  updateScore(updatedScore){
    // event.preventDefault();
    // const updatedBook:Book = {
    //   title: this.title,
    //   author: this.author,
    //   _id: this.id
    // }
    // console.log(updatedBook);
    this.scoreService.updateScore(updatedScore)
      .subscribe(score => {
        this.scores.push(updatedScore);
        this.router.navigate(['/scores']);
        // this.name = '';
        // this.score = '';
        // this.id = '';
      })
  }

}
