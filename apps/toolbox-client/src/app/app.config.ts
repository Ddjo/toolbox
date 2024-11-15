import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
// import { provideEffects } from '@ngrx/effects';
// import { provideRouterStore } from '@ngrx/router-store';
// import { provideStore } from '@ngrx/store';
// import { provideStoreDevtools } from '@ngrx/store-devtools';
// import { API_TOKEN } from '@site/shared-store';
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
    // {provide: API_TOKEN, useValue: 'http://localhost:3000/api'},
]
};
