import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TaskService } from './services/task.service';
import { ImdbService } from './services/imdb.service';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    TaskService,
    ImdbService,
    importProvidersFrom(HttpClientModule),
  ],
};
