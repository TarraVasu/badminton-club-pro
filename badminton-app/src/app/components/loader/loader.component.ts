import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-overlay" *ngIf="loaderService.loading$ | async">
      <div class="loader-content">
        <div class="badminton-court">
          <div class="racket racket-left">🏸</div>
          <div class="shuttlecock">☁️</div>
          <div class="racket racket-right">🏸</div>
        </div>
        <p class="loader-text">Birdie Beasts are Smashing... 🐾</p>
      </div>
    </div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #071927 0%, #083030 40%, #0a1f35 100%);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      overflow: hidden;
    }

    /* Glowing orb top-left */
    .loader-overlay::before {
      content: '';
      position: absolute;
      top: -80px;
      left: -80px;
      width: 350px;
      height: 350px;
      background: radial-gradient(circle, rgba(0, 212, 170, 0.18) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulse 4s ease-in-out infinite alternate;
      pointer-events: none;
    }

    /* Glowing orb bottom-right */
    .loader-overlay::after {
      content: '';
      position: absolute;
      bottom: -80px;
      right: -80px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulse 4s ease-in-out infinite alternate-reverse;
      pointer-events: none;
    }

    @keyframes pulse {
      from { opacity: 0.5; transform: scale(1); }
      to   { opacity: 1;   transform: scale(1.15); }
    }

    .loader-content {
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .badminton-court {
      position: relative;
      width: 300px;
      height: 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .racket {
      font-size: 3rem;
      transition: transform 0.1s ease;
      filter: drop-shadow(0 0 14px rgba(0, 212, 170, 0.6));
    }

    .shuttlecock {
      font-size: 2rem;
      position: absolute;
      left: 10%;
      animation: smash 1.2s infinite ease-in-out;
      filter: drop-shadow(0 0 14px rgba(0, 212, 170, 0.7));
    }

    .racket-left {
      animation: swing-left 1.2s infinite ease-in-out;
    }

    .racket-right {
      animation: swing-right 1.2s infinite ease-in-out;
    }

    @keyframes smash {
      0% { left: 10%; transform: rotate(0deg) scale(1); }
      45% { transform: rotate(180deg) scale(1.2); }
      50% { left: 85%; transform: rotate(180deg) scale(1); }
      95% { transform: rotate(360deg) scale(1.2); }
      100% { left: 10%; transform: rotate(360deg) scale(1); }
    }

    @keyframes swing-left {
      0%, 100% { transform: rotate(-20deg) translateX(0); }
      10% { transform: rotate(20deg) translateX(10px); }
    }

    @keyframes swing-right {
      40%, 60% { transform: rotate(20deg) translateX(0); }
      50% { transform: rotate(-20deg) translateX(-10px); }
    }

    .loader-text {
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
      font-weight: 600;
      letter-spacing: 1.5px;
      background: linear-gradient(90deg, #ffffff 0%, #00d4aa 50%, #ffffff 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shine 2s linear infinite;
    }

    @keyframes shine {
      to { background-position: 200% center; }
    }
  `]
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) { }
}
