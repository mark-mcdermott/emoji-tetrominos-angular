import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

import { Score } from '../../models/score' ;

@Injectable()
export class ScoreService {
  //domain: string = 'http://localhost:3000';
  domain: string = 'http://34.215.246.25:3000';

  constructor(private http: HttpClient) { }

  getScore(id) {
    return this.http.get<Score>(`${this.domain}/api/score/${id}`)
      .map(res => res);
  }

  getScores() {
    return this.http.get<Score[]>(`${this.domain}/api/scores`)
      .map(res => res);
  }

  addScore(newScore: Score) {
    return this.http.post<Score>(`${this.domain}/api/scores`, newScore)
      .map(res => res);
  }

  deleteScore(id) {
    return this.http.delete<Score>(`${this.domain}/api/scores/${id}`)
      .map(res => res);
  }

  updateScore(updatedScore: Score) {
    return this.http.put<Score>(`${this.domain}/api/scores/${updatedScore._id}`, updatedScore)
      .map(res => res)
  }

}
