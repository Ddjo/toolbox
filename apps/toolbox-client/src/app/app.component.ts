import {
  Component,
  HostListener
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/shell/layout/header/header.component';
// import { HeaderComponent } from '@core/shell/layout/header/header.component';
// import { RouterOutlet, Router, NavigationStart, NavigationEnd, RouteReuseStrategy } from '@angular/router';
// import { ContentService } from './shared/content/content.service';
// import { NotificationModalComponent } from './shared/modals/notification-modal/notification-modal.component';
// import { ContactModalComponent } from './shared/modals/contact-modal/contact-modal.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent
  ]
})
export class AppComponent {


  codeInvocationPequenioAnimal = [1, 1, 2, 2];
  codeTry: number[] = [];
  lateralMenuHidden = true;
  displayContentOverlay = false;
  pequenioAnimalInvocationCount = 0;
  pequenioAnimalInvoqued = false;
  pequenioAnimalleaving = false;

  invoquePequenioAnimal(number: number) {

    if (!this.pequenioAnimalInvoqued) {
      if (this.codeInvocationPequenioAnimal[this.codeTry.length] === number) {
        this.codeTry.push(number);
      } else {
        this.codeTry = [];
      }

      if (JSON.stringify(this.codeTry) === JSON.stringify(this.codeInvocationPequenioAnimal)) {
          this.pequenioAnimalleaving = false;
          this.pequenioAnimalInvoqued = true;
          this.codeTry = [];
      }
    } else {
      this.removePequenioAnimal();
    }
  }

  isContent() {
    // return this.contentService.isContent();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.pequenioAnimalInvoqued) {
      if (!event.target.closest('.pequenio-animal') && !event.target.closest('.brand' )) {
        this.removePequenioAnimal();
      }
    }
  }

  removePequenioAnimal() {
    this.pequenioAnimalleaving = true;

    setTimeout(() => {
      this.pequenioAnimalInvoqued = false;
    }, 2700);
  }
}
