import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, output, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IUser } from '@libs/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../../../../src/app/core/services/auth.service';
import { ChatRoomsStore } from '../../../../../../src/app/core/store/chat/chat-room.store';
import { UsersStore } from '../../../../../../src/app/core/store/users/users.store';
import { ChatService } from '../../../../core/services/chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      ButtonModule,
      CardModule,
      InputTextModule
    ]
})
export class ChatComponent implements OnDestroy {

  readonly userStore = inject(UsersStore);
  readonly chatRoomsStore = inject(ChatRoomsStore);

  authService = inject(AuthService);
  member = input.required<IUser>();

  memberLeavesChat = output<IUser>();
  sendMessage = output<string | null>();
  
  currentUser = this.authService.currentUserSig;
  messageContent = new FormControl<string | null>(null);

  isLoading = signal(false);
  isSendingMessage = signal(false);

  constructor(private chatService: ChatService) {}
  
  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
  
  testChat() {
    this.chatService.emit('test-chat')
  }

 }
