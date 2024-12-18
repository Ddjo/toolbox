import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatRoom, IUser } from '@libs/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { filter, switchMap } from 'rxjs';
import { AuthService } from '../../../../../src/app/core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { ChatRoomsStore } from '../../../../../src/app/core/store/chat/chat-room.store';
import { UsersStore } from '../../../../../src/app/core/store/users/users.store';
import { ChatComponent } from "./chat/chat.component";

export const typingUserDisplayTimeMs = 3000;

@Component({
    selector: 'app-chat-room',
    templateUrl: './chat-room.component.html',
    styleUrl: './chat-room.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ChatComponent,
    SelectModule
]
})
export class ChatRoomComponent implements OnInit {

  chatRoom = input.required<IChatRoom>();

  readonly userStore = inject(UsersStore);
  readonly chatRoomsStore = inject(ChatRoomsStore);
  readonly chatService = inject(ChatService);
  readonly authService = inject(AuthService);
  
  typingUsers = signal<string[]>([]);

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

    // Observe new message socket emission
    this.chatService.getNewMessage(this.chatRoom()._id).subscribe((message) => {
      // Remove the user from the typing users list
      this.typingUsers.set(this.typingUsers().filter(user => user !== message.sender.email));
    });
  

    // Observe websocket sending back a user typing message
    this.chatService.getTypingSignal(this.chatRoom()._id).subscribe((typingUser) => {
      // Add user to typingUser array
      this.typingUsers.set([...this.typingUsers(), typingUser]);

      // Remove him after 'typingUserDisplayTimeMs'
      setTimeout(() => {
        this.typingUsers.set(this.typingUsers().filter(user => user !== typingUser));
      }, typingUserDisplayTimeMs);
    })
  
  }

  removeChatRoom() {
    this.chatService.removeChatRoom(this.chatRoom()._id).subscribe();
  }

  sendMessageEvent(message: string | null, member: IUser) {
    // // Remove sender from typing users array
    // this.typingUsers.set(this.typingUsers().filter(user => user !== member.email));

    this.chatService.sendMessage(this.chatRoom(), member, message as string);
  }

  memberLeavesChatEvent(member: IUser) {
    this.chatService.removeMemberFromChatRoom(this.chatRoom(), member)
      .subscribe();
  }

  typingUserEvent(typingUser: IUser) {
    this.chatService.sendTypingSignal(this.chatRoom(), typingUser);
  }

  getMessagesForChatroom() {
    this.chatService.getMessagesForChatroom(this.chatRoom()).subscribe(() => console.log);
  }


 }
