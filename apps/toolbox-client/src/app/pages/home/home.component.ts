import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../core/shell/layout/header/header.component';
import { ChatComponent } from '../chat-page/chat-room/chat.component';
import { RouterModule } from '@angular/router';

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
