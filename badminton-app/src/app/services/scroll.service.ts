import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScrollService {
    private activeModals = 0;

    constructor() { }

    disableScroll() {
        this.activeModals++;
        if (this.activeModals === 1) {
            document.documentElement.classList.add('modal-open');
        }
    }

    enableScroll() {
        this.activeModals--;
        if (this.activeModals <= 0) {
            this.activeModals = 0;
            document.documentElement.classList.remove('modal-open');
        }
    }
}
