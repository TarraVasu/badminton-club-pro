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
        <p class="loader-text">Processing your Smash... 🚀</p>
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
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      color: white;
    }

    .loader-content {
      text-align: center;
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
    }

    .shuttlecock {
      font-size: 2rem;
      position: absolute;
      left: 10%;
      animation: smash 1.2s infinite ease-in-out;
      filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
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
      font-size: 1.2rem;
      font-weight: 500;
      letter-spacing: 1px;
      background: linear-gradient(90deg, #fff, #3b82f6, #fff);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
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
