import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { USER_EMAIL_ALREADY_EXISTS } from '@constants';
import { filter, switchMap, tap } from "rxjs";
import { AuthService } from "../../../core/services/auth.service";


@Component({
  selector: 'app-register',
  // standalone: true,
  // imports: [CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {

  emailExists = signal<boolean>(false);

  constructor(private authService: AuthService) {}

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
      this.authService.createUser(this.createAccountForm.getRawValue() as {email: string, password: string})
      .pipe(
        tap( res => {
          if (res.error === USER_EMAIL_ALREADY_EXISTS) 
                this.emailExists.set(true);
        }),
        filter(res => !res.error),
        switchMap(res => this.authService.login(res as {email: string, password: string}) )
      ).subscribe();
    }
  }


}
 