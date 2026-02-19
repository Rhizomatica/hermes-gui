import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private dark = false;

  toggle() {
    this.dark = !this.dark;
    document.body.classList.toggle('dark', this.dark);
    localStorage.setItem('dark-mode', this.dark ? '1' : '0');
  }

  init() {
    const saved = localStorage.getItem( 'dark-mode');
    if (saved === '1') {
      this.dark = true;
      document.body.classList.add('dark');
    }
  }
}
