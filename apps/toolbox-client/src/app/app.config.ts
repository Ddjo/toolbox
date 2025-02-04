import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import Material from '@primeng/themes/material';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

// const socketConfig: SocketIoConfig = { url: 'http://localhost:4200', options: {} };

export const appConfig: ApplicationConfig = {  
  providers: [
    provideClientHydration(withEventReplay()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    // provideAnimations(),
    provideAnimationsAsync(),
    providePrimeNG({ 
        theme: {
            preset: Material
        }
    })
    // importProvidersFrom(SocketIoModule.forRoot(socketConfig))
    // provideStore(),
    // provideEffects(),
    // provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), actionsBlocklist:['@ngrx/router-store'] }),
    // provideRouterStore(),
    // {provide: API_BOOK_TOKEN, useValue: environment.gatewayApiUrl + '/books'},
  ]
};
