import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';
import { environment } from '../../environments/environment';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _isLoggedIn = false;
    private baseUrl = environment.baseUrl;

    constructor(
        private router: Router,
        private toast: ToastService,
        private http: HttpClient,
        private loader: LoaderService
    ) {
        this._isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    }

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    get user() {
        const stored = localStorage.getItem('userData');
        return stored ? JSON.parse(stored) : { login_id: 'Guest', role: 'User' };
    }

    login(username: string, pass: string) {
        this.loader.show();
        this.http.post<any>(`${this.baseUrl}/api-token-auth/`, { username, password: pass })
            .pipe(finalize(() => this.loader.hide()))
            .subscribe({
                next: (res) => {
                    this._isLoggedIn = true;
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('userData', JSON.stringify({
                        full_name: res.full_name,
                        login_id: res.email || res.username,
                        role: 'Administrator'
                    }));
                    this.toast.success('🎉 Welcome back!');
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    this.toast.error('Invalid credentials.');
                    console.error('Login error:', err);
                }
            });
        return false;
    }

    logout() {
        this._isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        // Use replaceUrl to prevent the back button from returning to protected pages
        this.router.navigateByUrl('/login', { replaceUrl: true });
    }
}
