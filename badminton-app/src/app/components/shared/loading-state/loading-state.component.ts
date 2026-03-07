import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  template: `
    <div class="loading-state-container animate-fade-in">
      <div class="loader-visual" *ngIf="isLoading">
        <!-- Animated Smash Loader -->
        <div class="badminton-loader">
          <div class="racket racket-left">
            <svg class="racket-icon" viewBox="0 0 100 100">
              <ellipse cx="50" cy="35" rx="30" ry="35" fill="none" stroke="currentColor" stroke-width="4"/>
              <path d="M50 70 L50 95" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
              <path d="M35 20 L65 50 M25 35 L75 35 M35 50 L65 20" stroke="currentColor" stroke-width="1" opacity="0.4"/>
            </svg>
          </div>
          <div class="shuttle">
            <img src="assets/images/jam.gif" alt="shuttle" class="shuttle-gif">
          </div>
          <div class="racket racket-right">
            <svg class="racket-icon" viewBox="0 0 100 100">
              <ellipse cx="50" cy="35" rx="30" ry="35" fill="none" stroke="currentColor" stroke-width="4"/>
              <path d="M50 70 L50 95" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
              <path d="M35 20 L65 50 M25 35 L75 35 M35 50 L65 20" stroke="currentColor" stroke-width="1" opacity="0.4"/>
            </svg>
          </div>
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
      background: linear-gradient(135deg, #0d2137 0%, #0a3d3d 50%, #0d1f2d 100%);
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(0, 212, 170, 0.2);
      box-shadow:
        0 0 60px rgba(0, 212, 170, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
      position: relative;
    }

    /* Subtle animated glow orbs in background */
    .loading-state-container::before {
      content: '';
      position: absolute;
      top: -40px;
      left: -40px;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(0, 212, 170, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulseBg 3s ease-in-out infinite alternate;
      pointer-events: none;
    }

    .loading-state-container::after {
      content: '';
      position: absolute;
      bottom: -40px;
      right: -40px;
      width: 220px;
      height: 220px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulseBg 3s ease-in-out infinite alternate-reverse;
      pointer-events: none;
    }

    @keyframes pulseBg {
      from { opacity: 0.6; transform: scale(1); }
      to   { opacity: 1;   transform: scale(1.2); }
    }

    .loader-visual {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      position: relative;
      z-index: 1;
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
      width: 60px;
      height: 60px;
      z-index: 2;
      color: #00d4aa;
      filter: drop-shadow(0 0 12px rgba(0, 212, 170, 0.5));
    }

    .racket-icon {
      width: 100%;
      height: 100%;
    }

    .racket-left {
      animation: swingLeft 1.2s infinite ease-in-out;
    }

    .racket-right {
      animation: swingRight 1.2s infinite ease-in-out;
    }

    .shuttle {
      position: absolute;
      left: 10%;
      z-index: 1;
      animation: shuttleSmash 1.2s infinite ease-in-out;
      filter: drop-shadow(0 0 14px rgba(0, 212, 170, 0.6));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .shuttle-gif {
      width: 20px;
      height: 20px;
      object-fit: contain;
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
      position: relative;
      z-index: 1;

      h3 {
        font-family: 'Poppins', sans-serif;
        background: linear-gradient(90deg, #ffffff, #00d4aa, #ffffff);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 22px;
        margin-bottom: 10px;
        font-weight: 700;
        letter-spacing: -0.5px;
        animation: textShine 2.5s linear infinite;
      }

      p {
        color: rgba(180, 220, 215, 0.85);
        font-size: 14px;
        letter-spacing: 0.3px;
      }
    }

    @keyframes textShine {
      to { background-position: 200% center; }
    }

    .empty-visual {
      position: relative;
      z-index: 1;

      .empty-icon {
        font-size: 64px;
        margin-bottom: 20px;
        filter: drop-shadow(0 10px 20px rgba(0, 212, 170, 0.3));
      }

      h3 {
        font-family: 'Poppins', sans-serif;
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 10px;
        color: #e2f8f4;
      }

      p {
        color: rgba(180, 220, 215, 0.8);
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
