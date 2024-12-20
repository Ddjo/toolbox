import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatRoom, IUser } from '@libs/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { ChatRoomsStore } from '../../../core/store/chat/chat-room.store';
import { UsersStore } from '../../../core/store/users/users.store';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { UsersService } from '../../../core/services/users.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { ChatRoomComponent } from './chat/chat-room.component';
import { LocalStorageService } from '../../../core/services/local-storage.service';

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
        SelectModule,
        ChatRoomComponent
    ]
})
export class ChatComponent {

  
  readonly usersStore = inject(UsersStore);
  readonly chatRoomsStore = inject(ChatRoomsStore);
  
  readonly localStorageService = inject(LocalStorageService);
  readonly chatService = inject(ChatService);
  readonly authService = inject(AuthService);
  readonly usersService = inject(UsersService);
  
  currentUser = this.authService.currentUserSig;
  
  unfoldChatInterface = computed(() => this.chatService.clientChatRoomsConfigSig().unfoldedChatInterface);

  activeChatRooms$: Observable<IChatRoom[]> = toObservable(computed(()=> {
    return this.chatRoomsStore.chatRoomsEntities().filter(chatRoom => this.chatService.clientChatRoomsConfigSig().activeChatRoomsIds.includes(chatRoom._id ))
  }));

  // Users without the current one
  availableUsersToChat = computed(() => {
    return this.usersStore.usersEntities().filter(user => user._id !== this.currentUser()?._id
    )
  })

  constructor() {
    this.chatService.loadChatRoomsStore();
    this.usersService.loadUsersStore();
  }

  chatWithUser(user :IUser) {

    const chatRoom = this.chatRoomsStore.chatRoomsEntities().find(chatRoom => 
      chatRoom.members.length=== 2
      && chatRoom.members.map(member => member._id).includes((this.currentUser() as IUser)?._id)
      && chatRoom.members.map(member => member._id).includes(user._id)
    );
    // Check if a chatroom with only the 2 users exists
    if (chatRoom) {
      // Activate chatroom
      this.chatService.activateChatRoomInStorage(chatRoom._id);
      this.chatService.unfoldChatRoomInStorage(chatRoom._id);
    } else {
      // Create chatroom
      this.chatService.createChatRoom(user).subscribe((res) => {
        this.chatService.activateChatRoomInStorage(res._id);
        this.chatService.unfoldChatRoomInStorage(res._id);
      });
    }
  }

  toggleChatInterfaceFold() {
    if(this.unfoldChatInterface()) {
      this.chatService.foldChatInterface();
    } else {
      this.chatService.unfoldChatInterface();
    }
  }
 }
