import { Component, inject } from '@angular/core';
// import { GlobalService } from '@core/services/global.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { GlobalService } from '../../../services/global.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MenubarModule,
    InputSwitchModule,
    ButtonModule
  ]
})
export class HeaderComponent {
  mockResponses$: BehaviorSubject<boolean>;
  
  authService = inject(AuthService);
  currentUser = this.authService.currentUserSig;
  
  items: MenuItem[] = [
    {
      label: "Books crud",
      routerLink : ['/books']
    }, {
    label: "Chat",
    routerLink : '/chat'
  }, {
    label: "Sandbox",
    routerLink : '/sandbox'
  }];

  constructor(
    private globalService : GlobalService,
    private router: Router
  ) {
    this.mockResponses$ = this.globalService.mockResponses;
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(["/login"]));
  }

}
