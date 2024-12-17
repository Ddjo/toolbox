import { Component, inject } from '@angular/core';
// import { GlobalService } from '@core/services/global.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        MenubarModule,
        InputSwitchModule,
        ButtonModule
    ]
})
export class HeaderComponent {
  
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
    private router: Router
  ) {
    // this.mockResponses$ = this.globalService.mockResponses;
  }

  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(["/login"]));
  }

}
