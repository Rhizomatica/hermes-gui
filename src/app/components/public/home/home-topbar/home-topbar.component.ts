import { Component, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { Radio } from 'src/app/interfaces/radio';
import { RadioService } from 'src/app/_services/radio.service';

@Component({
  selector: 'app-home-topbar',
  templateUrl: './home-topbar.component.html',
  styleUrls: ['./home-topbar.component.less']
})
export class HomeTopbarComponent {
  @Input() radio: Radio | undefined;
  @Input() currentUser: User | undefined;
  @Input() currentTheme: string = 'light';
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() logOut = new EventEmitter<void>();

  menuOpen = false;
  error: any;
  errorAlert: boolean | undefined;

  constructor(private elRef: ElementRef, private radioService: RadioService) { }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  changeRadioProfile(): void {
    if (this.radio?.connection)
      return

    const toggleProfile = this.radio?.profile === 0 ? 1 : 0;
    this.radioService.changeOperateModeProfile(toggleProfile).subscribe({
      next: (res: any) => {
      },
      error: (err: any) => {
        this.error = err;
        this.errorAlert = true;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }
}
