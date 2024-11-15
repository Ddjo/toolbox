import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { GlobalService } from '@core/services/global.service';
import { MenuItem } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenubarModule } from "primeng/menubar";
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  mockResponses$: BehaviorSubject<boolean>;
  
  authService = inject(AuthService);
  currentUser = this.authService.currentUserSig;
  
  constructor(private globalService : GlobalService) {
    this.mockResponses$ = this.globalService.mockResponses;
  }



  items: MenuItem[] = [
    {
      label: "Books crud",
      routerLink : ['/books-crud']
    }, {
    label: "Chat",
    routerLink : '/chat'
  }, {
    label: "Sandbox",
    routerLink : '/sandbox'
  }, {
    label: "Auth",
    routerLink : '/auth'
  }]

}
