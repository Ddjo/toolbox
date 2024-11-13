import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { GlobalService } from '@core/services/global.service';
import { MenuItem } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenubarModule } from "primeng/menubar";
import { GlobalService } from '../../../services/global.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MenubarModule,
    InputSwitchModule
  ],
})
export class HeaderComponent  {

  mockResponses$: BehaviorSubject<boolean>;
  
  constructor(private globalService : GlobalService) {
    this.mockResponses$ = this.globalService.mockResponses;
  }


  items: MenuItem[] = [
    {
      label: "Books crud",
      routerLink : 'books-crud'
    }, {
    label: "Chat",
    routerLink : 'chat'
  }, {
    label: "Sandbox",
    routerLink : 'sandbox'
  }, {
    label: "Auth",
    routerLink : 'auth'
  }]

}
