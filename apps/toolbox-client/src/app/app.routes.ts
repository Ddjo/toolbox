import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  { 
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(x => x.HomeModule),
    canMatch: [AuthGuard],
    // resolve: [
    //   AuthResolve,
    // ]
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
    loadChildren: () => import('./pages/sandbox/sandbox.module').then(x => x.SandboxModule),
    canMatch: [AuthGuard],
  },
  { 
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then(x => x.ChatModule),
    canMatch: [AuthGuard],
  },
  { 
    path: 'books-crud',
    loadChildren: () => import('./pages/books-crud/books-crud.module').then(x => x.BooksCrudModule),
    canMatch: [AuthGuard],
  },
  { 
    path: 'page-not-found',
    component: PageNotFoundComponent
  },
{ path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },
];