import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginSuccessComponent } from './login-success/login-success.component';
import { AuthGuard } from '../../core/guards/auth.guard';
// import { ExperienceComponent } from './components/experiences/experience/experience.component';

const authRoutes: Routes = [
  { 
    path: '',
    component: LoginComponent,
  }, {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login-success',
    component: LoginSuccessComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'prefix'}

  // { path: '', children: [
  //   { path: 'login',  component: LoginComponent,},
  //   { path: 'register',  component: RegisterComponent, },
  //   { path: '', redirectTo: '/login', pathMatch: 'prefix'}
  // ]},

];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
