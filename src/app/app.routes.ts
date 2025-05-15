import { Routes } from '@angular/router';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ImdbDemoComponent } from './pages/imdb-demo/imdb-demo.component';
import { SignalsDemoComponent } from './pages/signals-demo/signals-demo.component';

export const routes: Routes = [
  { path: 'tasks', component: TasksComponent },
  { path: 'imdb', component: ImdbDemoComponent },
  { path: 'signals-demo', component: SignalsDemoComponent },
  // default route below, will change to main page when it is ready
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
];
