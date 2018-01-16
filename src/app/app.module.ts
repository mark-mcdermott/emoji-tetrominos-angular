import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';
import { AuthService } from './services/auth/auth.service';
import { ScoreService } from './services/score/score.service';

import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { CallbackComponent } from './components/callback/callback.component';
import { LoggedInContentComponent } from './components/logged-in-content/logged-in-content.component';
import { ScoresComponent } from './components/scores/scores.component';
import { ScoreDetailComponent } from './components/score-detail/score-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { GameComponent } from './components/game/game.component';
import { FooterComponent } from './components/footer/footer.component';



@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AboutComponent,
    CallbackComponent,
    LoggedInContentComponent,
    ScoresComponent,
    ScoreDetailComponent,
    ProfileComponent,
    AdminComponent,
    GameComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
