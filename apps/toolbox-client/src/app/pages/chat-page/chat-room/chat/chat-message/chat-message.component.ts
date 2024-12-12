import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { IChatMessage } from '@libs/common';
import { AuthService } from '../../../../../../../src/app/core/services/auth.service';

@Component({
    selector: 'app-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrl: './chat-message.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
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

  message = input.required<IChatMessage>();
  isSenderCurrentUser = input.required<boolean>();

 }
