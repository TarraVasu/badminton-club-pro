import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { LoaderService } from './loader.service';
import { environment } from '../../environments/environment';
import { finalize } from 'rxjs';

export interface UserData {
    full_name: string;
    login_id: string;
    role: string;
}

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
        const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const token = sessionStorage.getItem('token');
        this._isLoggedIn = !!(loggedIn && token);
    }

    get isLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    get user(): UserData {
        const stored = sessionStorage.getItem('userData');
        return stored ? JSON.parse(stored) : { login_id: 'Guest', full_name: 'Guest', role: 'User' };
    }

    getUserInitial(): string {
        const loginId = this.user.login_id;
        return loginId ? loginId.charAt(0).toUpperCase() : '?';
    }

    login(username: string, pass: string) {
        return this.http.post<any>(`${this.baseUrl}/api-token-auth/`, { username, password: pass });
    }

    handleLoginSuccess(res: any, username: string) {
        this._isLoggedIn = true;
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('userData', JSON.stringify({
            full_name: res.full_name,
            login_id: res.email || res.username || username,
            role: 'Administrator'
        }));
        this.toast.success('🎉 Welcome back!');
        this.router.navigate(['/dashboard']);
    }

    logout() {
        this._isLoggedIn = false;
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('userData');
        // Use replaceUrl to prevent the back button from returning to protected pages
        this.router.navigateByUrl('/login', { replaceUrl: true });
    }
}
