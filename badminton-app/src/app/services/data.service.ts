import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';
import { environment } from '../../environments/environment';

export interface Player {
  id?: number;
  name: string;
  email: string;
  phone: string;
  level: string;
  wins: number;
  losses: number;
  points: number;
  status: string;
  avatar: string;
  joinDate: string;
  matchesPlayed: number;
  image?: string;
}

export interface Match {
  id?: number;
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  date: string;
  court: string;
  type: string;
  status: string;
  winner: string;
  duration: string;
}

export interface Session {
  id?: number;
  title: string;
  date: string;
  time: string;
  court: string;
  coach: string;
  players: number;
  maxPlayers: number;
  type: string;
  status: string;
  fee: number;
}

export interface Payment {
  id?: number;
  player: string;
  amount: number;
  type: string;
  date: string;
  status: string;
  method: string;
  reference: string;
}

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DataService {

  private apiUrl = environment.apiUrl;

  // Global counts for sidebar badges
  public playersCount$ = new BehaviorSubject<number>(0);
  public matchesCount$ = new BehaviorSubject<number>(0);
  public sessionsCount$ = new BehaviorSubject<number>(0);
  public paymentsCount$ = new BehaviorSubject<number>(0);

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private loader: LoaderService
  ) {
    this.refreshCounts();
  }

  refreshCounts() {
    this.getPlayers().subscribe(data => this.playersCount$.next(data.length));
    this.getMatches().subscribe(data => this.matchesCount$.next(data.length));
    this.getSessions().subscribe(data => this.sessionsCount$.next(data.length));
    this.getPayments().subscribe(data => this.paymentsCount$.next(data.length));
  }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(`${this.apiUrl}/players/`);
  }

  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/matches/`);
  }

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/sessions/`);
  }

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/`);
  }

  addPlayer(player: any): Observable<Player> {
    this.loader.show();
    return this.http.post<Player>(`${this.apiUrl}/players/`, player).pipe(
      tap(() => {
        this.toast.success('Player saved successfully!');
        this.refreshCounts();
      }),
      finalize(() => this.loader.hide())
    );
  }

  deletePlayer(id: number): Observable<void> {
    this.loader.show();
    return this.http.delete<void>(`${this.apiUrl}/players/${id}/`).pipe(
      tap(() => {
        this.toast.success('Player removed!');
        this.refreshCounts();
      }),
      finalize(() => this.loader.hide())
    );
  }

  addMatch(match: Omit<Match, 'id'>): Observable<Match> {
    this.loader.show();
    return this.http.post<Match>(`${this.apiUrl}/matches/`, match).pipe(
      tap(() => {
        this.toast.success('Match scheduled successfully!');
        this.refreshCounts();
      }),
      finalize(() => this.loader.hide())
    );
  }

  deleteMatch(id: number): Observable<void> {
    this.loader.show();
    return this.http.delete<void>(`${this.apiUrl}/matches/${id}/`).pipe(
      tap(() => {
        this.toast.success('Match deleted!');
        this.refreshCounts();
      }),
      finalize(() => this.loader.hide())
    );
  }

  addSession(session: Omit<Session, 'id'>): Observable<Session> {
    this.loader.show();
    return this.http.post<Session>(`${this.apiUrl}/sessions/`, session).pipe(
      tap(() => {
        this.toast.success('Session created successfully!');
        this.refreshCounts();
      }),
      finalize(() => this.loader.hide())
    );
  }

  deleteSession(id: number): Observable<void> {
    this.loader.show();
    return this.http.delete<void>(`${this.apiUrl}/sessions/${id}/`).pipe(
      tap(() => {
        this.toast.success('Session removed!');
        this.refreshCounts();
      }),
      finalize(() => this.loader.hide())
    );
  }

  addPayment(payment: Omit<Payment, 'id'>): Observable<Payment> {
    this.loader.show();
    return this.http.post<Payment>(`${this.apiUrl}/payments/`, payment).pipe(
      tap(() => {
        this.toast.success('Payment recorded successfully!');
        this.refreshCounts();
      }),
      finalize(() => this.loader.hide())
    );
  }

  updatePlayer(id: number, player: any): Observable<Player> {
    this.loader.show();
    return this.http.put<Player>(`${this.apiUrl}/players/${id}/`, player).pipe(
      tap(() => {
        this.toast.success('Player updated!');
        this.refreshCounts();
      }),
      finalize(() => this.loader.hide())
    );
  }

  updateSession(id: number, session: Session): Observable<Session> {
    this.loader.show();
    return this.http.put<Session>(`${this.apiUrl}/sessions/${id}/`, session).pipe(
      tap(() => {
        this.toast.success('Session updated!');
        this.refreshCounts();
      }),
      finalize(() => this.loader.hide())
    );
  }
  getProfile(): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/profile/`);
  }

  updateProfile(profile: any): Observable<Player> {
    this.loader.show();
    return this.http.put<Player>(`${this.apiUrl}/profile/`, profile).pipe(
      tap(() => this.toast.success('Profile updated successfully!')),
      finalize(() => this.loader.hide())
    );
  }
}
