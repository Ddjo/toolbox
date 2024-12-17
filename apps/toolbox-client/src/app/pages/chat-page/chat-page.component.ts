import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChatService } from '../../core/services/chat.service';
import { HeaderComponent } from '../../core/shell/layout/header/header.component';
import { ChatRoomsStore } from '../../core/store/chat/chat-room.store';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-chat-page',
    templateUrl: './chat-page.component.html',
    styleUrl: './chat-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ButtonModule,
        HeaderComponent,
        ChatRoomComponent
    ]
})
export class ChatPageComponent {


    readonly chatService = inject(ChatService);
    readonly chatRoomStore = inject(ChatRoomsStore);
    
    createChatRoom() {
        this.chatService.createChatRoom().subscribe()
    }

 }
