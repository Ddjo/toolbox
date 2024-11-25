import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { API_BOOK_TOKEN } from '@site/shared-store';
import { environment } from '../environments/environments';
export const appConfig: ApplicationConfig = {
  
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), actionsBlocklist:['@ngrx/router-store'] }),
    provideRouterStore(),
    {provide: API_BOOK_TOKEN, useValue: environment.gatewayApiUrl + '/books'},
  ]
};
