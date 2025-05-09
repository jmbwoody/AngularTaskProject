import { Routes } from '@angular/router';
import { TasksComponent } from './pages/tasks/tasks.component';
import { ImdbDemoComponent } from './pages/imdb-demo/imdb-demo.component';

export const routes: Routes = [
  { path: 'tasks', component: TasksComponent },
  { path: 'imdb', component: ImdbDemoComponent },
  { path: '', redirectTo: '/tasks', pathMatch: 'full' }
];
