import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'bcp-theme';
  private _theme$ = new BehaviorSubject<Theme>(this.getSavedTheme());

  theme$ = this._theme$.asObservable();

  get isDark(): boolean {
    return this._theme$.value === 'dark';
  }

  get currentTheme(): Theme {
    return this._theme$.value;
  }

  constructor() {
    this.applyTheme(this._theme$.value);
  }

  toggle(): void {
    const next: Theme = this._theme$.value === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(theme: Theme): void {
    this._theme$.next(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  private getSavedTheme(): Theme {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    // Also check OS preference if no saved setting
    if (!saved) {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return saved === 'light' ? 'light' : 'dark';
  }
}
