import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

import { BookComponent } from './pages/books-page/book/book.component';
import { BookResolver } from './pages/books-page/book/resolvers/book.resolver';
import { LibraryComponent } from './pages/books-page/library/library.component';
import { LibraryResolver } from './pages/books-page/library/resolvers/library.resolver';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  { 
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(x => x.HomeComponent),
    canActivate: [AuthGuard],
    children: [
      { 
        path: 'sandbox',
        loadComponent: () => import('./pages/sandbox/sandbox.component').then(x => x.SandboxComponent),
        canActivate: [AuthGuard],
      },
      { 
        path: 'music',
        loadComponent: () => import('./pages/music-page/music-page.component').then(x => x.MusicPageComponent),
        canActivate: [AuthGuard],
      },
      { 
        path: 'books',
        loadComponent: () => import('./pages/books-page/books-page.component').then(x => x.BooksPageComponent),
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: LibraryComponent,
            resolve: [LibraryResolver],
          },
          {
            path: 'create',
            component: BookComponent
          },
          {
            path: 'update/:id',
            component: BookComponent,
            resolve: [
              BookResolver
            ]
          },
        ]
      },
      { path: '', redirectTo: 'books', pathMatch: 'full' },
    ],
  },
  { 
    path: 'login', 
    component: LoginComponent,
  },
  { 
    path: 'signup', 
    component: SignupComponent
  },

  { 
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
{ path: '', redirectTo: 'books', pathMatch: 'full' },
{ path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },
];