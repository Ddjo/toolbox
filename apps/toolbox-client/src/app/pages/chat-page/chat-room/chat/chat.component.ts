import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatRoom } from '@libs/common';
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
  memberId = input.required<string>();
  chatRoom = input.required<IChatRoom>();
  
  currentUser = this.authService.currentUserSig;
  messageContent = new FormControl<string | undefined>(undefined);

  member = computed(() => this.userStore.usersEntities().find(user => user._id === this.memberId()) );
  isLoading = signal(false);
  isSendingMessage = signal(false);

  constructor(private chatService: ChatService) {}
  
  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
  
  testChat() {
    this.chatService.emit('test-chat')
  }
  
  sendMessage() {
    this.isSendingMessage.set(true);
    this.chatService.sendMessage('id-test', this.messageContent.getRawValue() as string);
  }

  leaveChat() {
    this.isLoading.set(true)
    this.chatService.removeMemberFromChatRoom(this.chatRoom(), this.memberId())
      .subscribe(() => this.isLoading.set(false));
  }
 }
