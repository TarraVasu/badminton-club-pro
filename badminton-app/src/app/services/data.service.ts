import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, finalize, map } from 'rxjs/operators';
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

@Injectable({ providedIn: 'root' })
export class DataService {

  private apiUrl = environment.apiUrl;

  // Global counts for sidebar badges
  public playersCount$ = new BehaviorSubject<number>(0);
  public matchesCount$ = new BehaviorSubject<number>(0);
  public sessionsCount$ = new BehaviorSubject<number>(0);
  public paymentsCount$ = new BehaviorSubject<number>(0);

  // Data Caches
  private playersSubject = new BehaviorSubject<Player[]>([]);
  private matchesSubject = new BehaviorSubject<Match[]>([]);
  private sessionsSubject = new BehaviorSubject<Session[]>([]);
  private paymentsSubject = new BehaviorSubject<Payment[]>([]);

  private playersLoaded = false;
  private matchesLoaded = false;
  private sessionsLoaded = false;
  private paymentsLoaded = false;

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private loader: LoaderService
  ) {
    this.playersSubject.subscribe(d => this.playersCount$.next(d.length));
    this.matchesSubject.subscribe(d => this.matchesCount$.next(d.length));
    this.sessionsSubject.subscribe(d => this.sessionsCount$.next(d.length));
    this.paymentsSubject.subscribe(d => this.paymentsCount$.next(d.length));

    // Preload data
    this.getPlayers().subscribe();
    this.getMatches().subscribe();
    this.getSessions().subscribe();
    this.getPayments().subscribe();
  }

  // refreshCounts is no longer needed but kept for backward compatibility
  refreshCounts() { }

  getPlayers(): Observable<Player[]> {
    if (this.playersLoaded) return of(this.playersSubject.value);

    // this.loader.show();
    return this.http.get<Player[]>(`${this.apiUrl}/players/`).pipe(
      tap(data => {
        this.playersSubject.next(data);
        this.playersLoaded = true;
      })
      // finalize(() => this.loader.hide())
    );
  }

  getMatches(): Observable<Match[]> {
    if (this.matchesLoaded) return of(this.matchesSubject.value);

    // this.loader.show();
    return this.http.get<Match[]>(`${this.apiUrl}/matches/`).pipe(
      tap(data => {
        this.matchesSubject.next(data);
        this.matchesLoaded = true;
      })
      // finalize(() => this.loader.hide())
    );
  }

  getSessions(): Observable<Session[]> {
    if (this.sessionsLoaded) return of(this.sessionsSubject.value);

    // this.loader.show();
    return this.http.get<Session[]>(`${this.apiUrl}/sessions/`).pipe(
      tap(data => {
        this.sessionsSubject.next(data);
        this.sessionsLoaded = true;
      })
      // finalize(() => this.loader.hide())
    );
  }

  getPayments(): Observable<Payment[]> {
    if (this.paymentsLoaded) return of(this.paymentsSubject.value);

    // this.loader.show();
    return this.http.get<Payment[]>(`${this.apiUrl}/payments/`).pipe(
      tap(data => {
        this.paymentsSubject.next(data);
        this.paymentsLoaded = true;
      })
      // finalize(() => this.loader.hide())
    );
  }

  addPlayer(player: any): Observable<Player> {
    this.loader.show();
    return this.http.post<Player>(`${this.apiUrl}/players/`, player).pipe(
      tap((newPlayer) => {
        this.playersSubject.next([...this.playersSubject.value, newPlayer]);
        this.toast.success('Player saved successfully!');
      }),
      finalize(() => this.loader.hide())
    );
  }

  deletePlayer(id: number): Observable<void> {
    this.loader.show();
    return this.http.delete<void>(`${this.apiUrl}/players/${id}/`).pipe(
      tap(() => {
        this.playersSubject.next(this.playersSubject.value.filter(p => p.id !== id));
        this.toast.success('Player removed!');
      }),
      finalize(() => this.loader.hide())
    );
  }

  addMatch(match: Omit<Match, 'id'>): Observable<Match> {
    this.loader.show();
    return this.http.post<Match>(`${this.apiUrl}/matches/`, match).pipe(
      tap((newMatch) => {
        this.matchesSubject.next([newMatch, ...this.matchesSubject.value]);
        this.toast.success('Match scheduled successfully!');
      }),
      finalize(() => this.loader.hide())
    );
  }

  deleteMatch(id: number): Observable<void> {
    this.loader.show();
    return this.http.delete<void>(`${this.apiUrl}/matches/${id}/`).pipe(
      tap(() => {
        this.matchesSubject.next(this.matchesSubject.value.filter(p => p.id !== id));
        this.toast.success('Match deleted!');
      }),
      finalize(() => this.loader.hide())
    );
  }

  addSession(session: Omit<Session, 'id'>): Observable<Session> {
    this.loader.show();
    return this.http.post<Session>(`${this.apiUrl}/sessions/`, session).pipe(
      tap((newSession) => {
        this.sessionsSubject.next([newSession, ...this.sessionsSubject.value]);
        this.toast.success('Session created successfully!');
      }),
      finalize(() => this.loader.hide())
    );
  }

  deleteSession(id: number): Observable<void> {
    this.loader.show();
    return this.http.delete<void>(`${this.apiUrl}/sessions/${id}/`).pipe(
      tap(() => {
        this.sessionsSubject.next(this.sessionsSubject.value.filter(p => p.id !== id));
        this.toast.success('Session removed!');
      }),
      finalize(() => this.loader.hide())
    );
  }

  addPayment(payment: Omit<Payment, 'id'>): Observable<Payment> {
    this.loader.show();
    return this.http.post<Payment>(`${this.apiUrl}/payments/`, payment).pipe(
      tap((newPayment) => {
        this.paymentsSubject.next([newPayment, ...this.paymentsSubject.value]);
        this.toast.success('Payment recorded successfully!');
      }),
      finalize(() => this.loader.hide())
    );
  }

  updatePlayer(id: number, player: any): Observable<Player> {
    this.loader.show();
    return this.http.put<Player>(`${this.apiUrl}/players/${id}/`, player).pipe(
      tap((updated) => {
        const current = this.playersSubject.value;
        const idx = current.findIndex(p => p.id === id);
        if (idx !== -1) {
          current[idx] = updated;
          this.playersSubject.next([...current]);
        }
        this.toast.success('Player updated!');
      }),
      finalize(() => this.loader.hide())
    );
  }

  updateSession(id: number, session: Session): Observable<Session> {
    this.loader.show();
    return this.http.put<Session>(`${this.apiUrl}/sessions/${id}/`, session).pipe(
      tap((updated) => {
        const current = this.sessionsSubject.value;
        const idx = current.findIndex(p => p.id === id);
        if (idx !== -1) {
          current[idx] = updated;
          this.sessionsSubject.next([...current]);
        }
        this.toast.success('Session updated!');
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
