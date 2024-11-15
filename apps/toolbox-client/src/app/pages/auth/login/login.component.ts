import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-login',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  
  errorMsg = signal<string>('');

  loginForm = new FormGroup({
    email: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required, Validators.email],
      // nonNullable: true
    }),
    password: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required],
      // nonNullable: true
    }),
  });

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {}
  
  login() {
    if (this.loginForm.valid){
      this.authService.login(this.loginForm.getRawValue() as {email: string, password: string})
      .subscribe({
        error: err => this.errorMsg.set(err?.error?.message),
        // complete: () => this.router.navigate(['login-success'])
      });
    }
  }

  getUser() {
    this.usersService.getUser().subscribe(console.log)
  }
}
