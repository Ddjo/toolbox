import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../core/shell/layout/header/header.component';
import { ChatComponent } from './chat/chat.component';

@Component({
    selector: 'app-chat-page',
    templateUrl: './chat-page.component.html',
    styleUrl: './chat-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        ButtonModule,
        HeaderComponent,
        ChatComponent
    ]
})
export class ChatPageComponent {
    

 }
