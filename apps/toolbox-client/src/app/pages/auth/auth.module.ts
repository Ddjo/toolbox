
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginSuccessComponent } from './login-success/login-success.component';


@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    LoginSuccessComponent,
    RegisterComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    InputTextModule,
    ButtonModule
  ],
  exports : [
    AuthComponent
  ]
})
export class AuthModule { }
