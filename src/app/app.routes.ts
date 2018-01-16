import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoggedInContentComponent } from './components/logged-in-content/logged-in-content.component';
import { CallbackComponent } from './components/callback/callback.component';
import { ScoresComponent } from './components/scores/scores.component';
import { ScoreDetailComponent } from './components/score-detail/score-detail.component';


export const ROUTES: Routes = [
   { path: '', component: HomeComponent },
   { path: 'home', component: HomeComponent },
   { path: 'about', component: AboutComponent },
   { path: 'logged-in-content', component: LoggedInContentComponent },
   { path: 'callback', component: CallbackComponent },
   { path: 'scores', component: ScoresComponent },
   { path: 'score/:id', component: ScoreDetailComponent },
   { path: '**', redirectTo: '' }
];
