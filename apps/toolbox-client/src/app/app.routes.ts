import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  { 
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(x => x.HomeComponent),
    canActivate: [AuthGuard],
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
    path: 'sandbox',
    loadComponent: () => import('./pages/sandbox/sandbox.component').then(x => x.SandboxComponent),
    canActivate: [AuthGuard],
  },
  { 
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat.component').then(x => x.ChatComponent),
    canActivate: [AuthGuard],
  },
  { 
    path: 'books-crud',
    loadComponent: () => import('./pages/books-crud/books-crud.component').then(x => x.BooksCrudComponent),
    canActivate: [AuthGuard],
  },
  { 
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
{ path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },
];