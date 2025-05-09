import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule],
  template: `
    <p-menubar [model]="items"></p-menubar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }
  `]
})
export class AppComponent {
  items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => {
        window.location.href = 'https://jmbwoody.github.io/PortfolioWebsite/';
      }
    },
    {
      label: 'Tasks',
      icon: 'pi pi-check-square',
      routerLink: '/tasks'
    },
    {
      label: 'IMDB Search',
      icon: 'pi pi-search',
      routerLink: '/imdb'
    }
  ];
}
