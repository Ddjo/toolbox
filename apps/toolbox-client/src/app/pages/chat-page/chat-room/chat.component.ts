import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatRoom, IUser } from '@libs/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { filter, switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { ChatRoomsStore } from '../../../core/store/chat/chat-room.store';
import { UsersStore } from '../../../core/store/users/users.store';

export const typingUserDisplayTimeMs = 10000;

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        InputTextModule,
        SelectModule
    ]
})
export class ChatComponent implements OnInit {

  chatRoom = input.required<IChatRoom>();

  readonly userStore = inject(UsersStore);
  readonly chatRoomsStore = inject(ChatRoomsStore);
  readonly chatService = inject(ChatService);
  readonly authService = inject(AuthService);
  
  // typingUsers = signal<string[]>([]);

  currentUser = this.authService.currentUserSig;
  addMemberControl = new FormControl();

  // Get the available users to add to the chat (the ones that are not already in)
  availableUsersToAdd = computed(() => {
    return this.userStore.usersEntities().filter(user => 
      !this.chatRoom().members.map(member => member._id).includes(user._id)
      && user._id !== this.currentUser()?._id
    )
  })

  ngOnInit(): void {

    this.chatService.connect();

    // Adding user to the chat
    this.addMemberControl.valueChanges.pipe(
      filter(user => user),
      switchMap(user => this.chatService.addMemberToChatRoom(this.chatRoom(), user))
    ).subscribe(() => this.addMemberControl.setValue(undefined));
  }

  removeChatRoom() {
    this.chatService.removeChatRoom(this.chatRoom()._id).subscribe();
  }

  memberLeavesChatEvent(member: IUser) {
    this.chatService.removeMemberFromChatRoom(this.chatRoom(), member)
      .subscribe();
  }

 }
