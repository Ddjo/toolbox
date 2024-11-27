import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
export const appConfig: ApplicationConfig = {
  
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    // provideStore(),
    // provideEffects(),
    // provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), actionsBlocklist:['@ngrx/router-store'] }),
    // provideRouterStore(),
    // {provide: API_BOOK_TOKEN, useValue: environment.gatewayApiUrl + '/books'},
  ]
};
