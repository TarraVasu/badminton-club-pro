import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlayersComponent } from './components/players/players.component';
import { MatchesComponent } from './components/matches/matches.component';
import { SessionsComponent } from './components/sessions/sessions.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login | Birdie Beasts' },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], title: 'Dashboard | Birdie Beasts' },
  { path: 'players', component: PlayersComponent, canActivate: [AuthGuard], title: 'Players Directory | Birdie Beasts' },
  { path: 'matches', component: MatchesComponent, canActivate: [AuthGuard], title: 'Matches | Birdie Beasts' },
  { path: 'sessions', component: SessionsComponent, canActivate: [AuthGuard], title: 'Sessions | Birdie Beasts' },
  { path: 'payments', component: PaymentsComponent, canActivate: [AuthGuard], title: 'Payments | Birdie Beasts' },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard], title: 'Leaderboard | Birdie Beasts' },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], title: 'My Profile | Birdie Beasts' },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
