import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UsersService } from "../../../core/services/users.service";


@Component({
  selector: 'app-register',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {

  errorMsg = signal<string>('');

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  createAccountForm = new FormGroup({
    email: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required, Validators.email],
      // nonNullable: true
    }),
    password: new FormControl<string | undefined>(undefined, {
      validators: [Validators.required],
      // nonNullable: true
    }),
  });

  createAccount() {
    if (this.createAccountForm.valid){
      this.usersService.createUser(this.createAccountForm.getRawValue() as {email: string, password: string})
      .subscribe({
        error: err => this.errorMsg.set(err?.error?.message),
        complete: () => this.router.navigate(['auth'])
      });
    }
  }
}
 