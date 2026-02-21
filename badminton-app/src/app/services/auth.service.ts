import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _isLoggedIn = false;
    private baseUrl = environment.baseUrl;

    constructor(private router: Router, private toast: ToastService, private http: HttpClient) {
        this._isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    login(email: string, pass: string) {
        const username = email.split('@')[0]; // Using 'admin' from 'admin@mail.com'
        this.http.post<any>(`${this.baseUrl}/api-token-auth/`, { username, password: pass })
            .subscribe({
                next: (res) => {
                    this._isLoggedIn = true;
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('token', res.token);
                    this.toast.success('🎉 Welcome back!');
                    this.router.navigate(['/dashboard']);
                },
                error: () => {
                    this.toast.error('Invalid credentials.');
                }
            });
        return false;
    }

    logout() {
        this._isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }
}
