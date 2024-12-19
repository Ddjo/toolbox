import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit } from '@angular/core';
import { IChatMessage } from '@libs/common';
import { ChatService } from '../../../../../../../src/app/core/services/chat.service';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'app-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrl: './chat-message.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        AvatarModule
    ]
})
export class ChatMessageComponent implements OnInit {
  chatService = inject(ChatService);

  messageInput = input.required<IChatMessage>();
  isSenderCurrentUserInput = input.required<boolean>();
  displayUserMailInput = input.required<boolean>();

    ngOnInit(): void {
        // Observe websocket to get the seen message notifs
        this.chatService.getSeenChatMessage(this.messageInput()._id).subscribe((seenBy) => {
            console.log('message seen by ', seenBy.email)
        })
    }
 }
