import { Component, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { Radio } from 'src/app/interfaces/radio';

@Component({
  selector: 'app-home-topbar',
  templateUrl: './home-topbar.component.html',
  styleUrls: ['./home-topbar.component.less']
})
export class HomeTopbarComponent {
  @Input() radio: Radio;
  @Input() currentUser: User;
  @Input() currentTheme: string = 'light';
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() logOut = new EventEmitter<void>();

  menuOpen = false;

  constructor(private elRef: ElementRef) {}

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
}
