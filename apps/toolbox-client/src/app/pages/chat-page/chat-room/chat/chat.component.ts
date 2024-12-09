import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatRoom } from '@libs/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { UsersStore } from '../../../../../../src/app/core/store/users/users.store';
import { ChatService } from '../../../../core/services/chat.service';
import { AuthService } from '../../../../../../src/app/core/services/auth.service';
import { CommonModule } from '@angular/common';

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
    
  
  authService = inject(AuthService);
  memberId = input.required<string>();
  chatRoom = input.required<IChatRoom>();
  
  currentUser = this.authService.currentUserSig;
  messageContent = new FormControl<string | undefined>(undefined);

  member = computed(() => this.userStore.usersEntities().find(user => user._id === this.memberId()) );

  constructor(private chatService: ChatService) {}
  
  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
  
  testChat() {
    this.chatService.emit('test-chat')
  }
  
  sendMessage() {
    this.chatService.sendMessage('id-test', this.messageContent.getRawValue() as string);
  }

  leaveChat() {
    this.chatService.removeMemberFromChatRoom(this.chatRoom(), this.memberId()).subscribe();
  }
 }
