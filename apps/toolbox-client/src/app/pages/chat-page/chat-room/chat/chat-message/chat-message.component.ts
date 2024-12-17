import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IChatMessage } from '@libs/common';

@Component({
    selector: 'app-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrl: './chat-message.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        // FormsModule,
        // ReactiveFormsModule,
        // ButtonModule,
        // CardModule,
        // InputTextModule
    ]
})
export class ChatMessageComponent{

  messageInput = input.required<IChatMessage>();
  isSenderCurrentUserInput = input.required<boolean>();
  displayUserMailInput = input.required<boolean>();


 }
