import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// const socketConfig: SocketIoConfig = { url: 'http://localhost:4200', options: {} };

export const appConfig: ApplicationConfig = {  
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAnimations(),
    // importProvidersFrom(SocketIoModule.forRoot(socketConfig))
    // provideStore(),
    // provideEffects(),
    // provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode(), actionsBlocklist:['@ngrx/router-store'] }),
    // provideRouterStore(),
    // {provide: API_BOOK_TOKEN, useValue: environment.gatewayApiUrl + '/books'},
  ]
};
