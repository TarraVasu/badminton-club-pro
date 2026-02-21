import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastService } from './toast.service';
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

@Injectable({ providedIn: 'root' })
export class DataService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private toast: ToastService) { }

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
    return this.http.post<Player>(`${this.apiUrl}/players/`, player).pipe(
      tap(() => this.toast.success('Player saved successfully!'))
    );
  }

  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/players/${id}/`).pipe(
      tap(() => this.toast.success('Player removed!'))
    );
  }

  addMatch(match: Omit<Match, 'id'>): Observable<Match> {
    return this.http.post<Match>(`${this.apiUrl}/matches/`, match).pipe(
      tap(() => this.toast.success('Match scheduled successfully!'))
    );
  }

  deleteMatch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/matches/${id}/`).pipe(
      tap(() => this.toast.success('Match deleted!'))
    );
  }

  addSession(session: Omit<Session, 'id'>): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/sessions/`, session).pipe(
      tap(() => this.toast.success('Session created successfully!'))
    );
  }

  deleteSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sessions/${id}/`).pipe(
      tap(() => this.toast.success('Session removed!'))
    );
  }

  addPayment(payment: Omit<Payment, 'id'>): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/payments/`, payment).pipe(
      tap(() => this.toast.success('Payment recorded successfully!'))
    );
  }

  updatePlayer(id: number, player: any): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/players/${id}/`, player).pipe(
      tap(() => this.toast.success('Player updated!'))
    );
  }

  updateSession(id: number, session: Session): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/sessions/${id}/`, session).pipe(
      tap(() => this.toast.success('Session updated!'))
    );
  }
}
