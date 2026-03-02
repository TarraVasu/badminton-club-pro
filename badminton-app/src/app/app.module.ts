import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlayersComponent } from './components/players/players.component';
import { PlayerDialogComponent } from './components/players/player-dialog/player-dialog.component';
import { MatchesComponent } from './components/matches/matches.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ToastComponent } from './components/toast/toast.component';
import { LoginComponent } from './components/login/login.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoadingStateComponent } from './components/shared/loading-state/loading-state.component';
import { SessionDialogComponent } from './components/sessions/session-dialog/session-dialog.component';
import { PaymentDialogComponent } from './components/payments/payment-dialog/payment-dialog.component';
import { ScheduleMatchDialogComponent } from './components/matches/schedule-match-dialog/schedule-match-dialog.component';
import { ScoreMatchDialogComponent } from './components/matches/score-match-dialog/score-match-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    PlayersComponent,
    PlayerDialogComponent,
    MatchesComponent,
    SessionsComponent,
    PaymentsComponent,
    LeaderboardComponent,
    ToastComponent,
    LoginComponent,
    LoaderComponent,
    ProfileComponent,
    ConfirmDialogComponent,
    LoadingStateComponent,
    SessionDialogComponent,
    PaymentDialogComponent,
    ScheduleMatchDialogComponent,
    ScoreMatchDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    NgChartsModule,
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


