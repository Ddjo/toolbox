import { importProvidersFrom } from '@angular/core';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(x => x.HomeModule   )
  },
  { 
      path: 'sandbox',
    loadChildren: () => import('./pages/sandbox/sandbox.module').then(x => x.SandboxModule   )
  },
  { 
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(x => x.AuthModule   )
  },
  { 
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then(x => x.ChatModule   )
  },
  { 
    path: 'books-crud',
    loadChildren: () => import('./pages/books-crud/books-crud.module').then(x => x.BooksCrudModule   )
  },
{ path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: '**', redirectTo: '/home', pathMatch: 'full' },
];