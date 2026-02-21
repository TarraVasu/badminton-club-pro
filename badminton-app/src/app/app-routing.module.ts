import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlayersComponent } from './components/players/players.component';
import { MatchesComponent } from './components/matches/matches.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'players', component: PlayersComponent, canActivate: [AuthGuard] },
  { path: 'matches', component: MatchesComponent, canActivate: [AuthGuard] },
  { path: 'sessions', component: SessionsComponent, canActivate: [AuthGuard] },
  { path: 'payments', component: PaymentsComponent, canActivate: [AuthGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
