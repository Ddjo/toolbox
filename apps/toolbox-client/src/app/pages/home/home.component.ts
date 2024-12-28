import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../core/shell/layout/header/header.component';
import { RouterModule } from '@angular/router';
import { ChatComponent } from '../../shared/chat/chat.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        HeaderComponent,
        RouterModule,
        ChatComponent
    ]
})
export class HomeComponent  {


}
