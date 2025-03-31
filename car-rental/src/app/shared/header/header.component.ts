import { Component, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { HEADER_LABELS } from './header.constants';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly HEADER_LABELS = HEADER_LABELS;
  menuOpen = signal(false);
  @ViewChild('menuRef') menuRef!: ElementRef;

  constructor(router: Router) {
    router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  toggleMenu() {
    this.menuOpen.update(open => !open);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.menuRef?.nativeElement.contains(event.target);
    const clickedToggle = (event.target as HTMLElement).closest('button'); // assuming your button is outside menu

    if (!clickedInside && !clickedToggle) {
      this.menuOpen.set(false);
    }
  }
}