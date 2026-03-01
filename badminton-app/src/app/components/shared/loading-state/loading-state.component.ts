import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: `
    <div class="loading-state-container animate-fade-in">
      <div class="loader-visual" *ngIf="isLoading">
        <!-- Animated Smash Loader -->
        <div class="badminton-loader">
          <div class="racket racket-left">🏸</div>
          <div class="shuttle">☁️</div>
          <div class="racket racket-right">🏸</div>
        </div>
        
        <div class="loader-info">
          <h3>Birdie Beasts are Smashing...</h3>
          <p>Please wait while we fetch the latest updates 🐾</p>
        </div>
      </div>

      <div class="empty-visual" *ngIf="!isLoading">
        <div class="empty-icon">{{ emptyIcon }}</div>
        <h3>{{ emptyTitle }}</h3>
        <p>{{ emptyMessage }}</p>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .loading-state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 24px;
      text-align: center;
      min-height: 350px;
      background: rgba(15, 23, 42, 0.4);
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .loader-visual {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    /* Animated Badminton Loader */
    .badminton-loader {
      position: relative;
      width: 240px;
      height: 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .racket {
      font-size: 48px;
      z-index: 2;
    }

    .racket-left {
      animation: swingLeft 1.2s infinite ease-in-out;
    }

    .racket-right {
      animation: swingRight 1.2s infinite ease-in-out;
    }

    .shuttle {
      font-size: 28px;
      position: absolute;
      left: 10%;
      z-index: 1;
      animation: shuttleSmash 1.2s infinite ease-in-out;
      filter: drop-shadow(0 0 10px rgba(0, 212, 170, 0.4));
    }

    @keyframes swingLeft {
      0%, 100% { transform: rotate(-20deg) translateX(0); }
      10% { transform: rotate(30deg) translateX(15px); }
    }

    @keyframes swingRight {
      40%, 60% { transform: rotate(20deg) translateX(0); }
      50% { transform: rotate(-30deg) translateX(-15px); }
    }

    @keyframes shuttleSmash {
      0% { left: 15%; transform: rotate(0deg) scale(1); }
      45% { transform: rotate(180deg) scale(1.1); }
      50% { left: 80%; transform: rotate(180deg) scale(1); }
      95% { transform: rotate(360deg) scale(1.1); }
      100% { left: 15%; transform: rotate(360deg) scale(1); }
    }

    .loader-info {
      h3 {
        font-family: 'Poppins', sans-serif;
        color: var(--text-primary);
        font-size: 20px;
        margin-bottom: 8px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
      p {
        color: var(--text-muted);
        font-size: 14px;
      }
    }

    .empty-visual {
      .empty-icon {
        font-size: 64px;
        margin-bottom: 20px;
        filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
      }
      h3 {
        font-family: 'Poppins', sans-serif;
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 10px;
        color: var(--text-primary);
      }
      p {
        color: var(--text-secondary);
        max-width: 400px;
        margin: 0 auto;
        line-height: 1.6;
      }
    }
  `]
})
export class LoadingStateComponent {
  @Input() isLoading: boolean = false;
  @Input() emptyIcon: string = '🔍';
  @Input() emptyTitle: string = 'No results found';
  @Input() emptyMessage: string = 'Try adjusting your search or filters';
}
