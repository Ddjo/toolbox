import {
  Component,
  OnInit
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { UsersService } from './core/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
  ]
})
export class AppComponent implements OnInit {

  constructor(
    private userService: UsersService, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.userService.getUser().pipe(
    //   tap((userMail) => this.authService.currentUserSig.set(userMail))
    // ).subscribe({
    //   complete: () => { this.router.navigate(['/home']) },
    // });    
  }

}
