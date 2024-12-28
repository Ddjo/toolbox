import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatRoom, IUser } from '@libs/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CHAT_ROOM_NEW_CHAT_FOR_USER_EVENT } from '@constants';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { UsersStore } from '../../core/store/users/users.store';
import { ChatRoomsStore, IChatRoomEntity } from '../../core/store/chat/chat-room.store';
import { ChatService } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';


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
export class ChatComponent implements OnDestroy {

  private destroy$ = new Subject<void>();

  readonly usersStore = inject(UsersStore);
  readonly chatRoomsStore = inject(ChatRoomsStore);
  
  readonly chatService = inject(ChatService);
  readonly authService = inject(AuthService);
  readonly usersService = inject(UsersService);
  
  unfoldChatInterface = computed(() => this.chatService.clientChatRoomsConfigSig().unfoldedChatInterface);

  activeChatRooms$: Observable<IChatRoomEntity[]> = toObservable(computed(()=> {
    return this.chatRoomsStore.chatRoomsEntities().filter(chatRoom => this.chatService.clientChatRoomsConfigSig().activeChatRoomsIds.includes(chatRoom._id ))
  }));

  // Users without the current one
  availableUsersToChat = computed(() => {
    return this.usersStore.usersEntities().filter(user => user._id !== this.authService.currentUserSig()?._id
    )
  })

  constructor() {
    // this.chatService.connect();
    this.chatService.loadChatRoomsStore();
    this.usersService.loadUsersStore();
    
    console.log(`subscribe ${this.authService.currentUserSig()?._id}-${CHAT_ROOM_NEW_CHAT_FOR_USER_EVENT}`)
    // Observe new chats creations for user. Receive a IChatRoom object, update the store
    this.chatService.fromEvent<IChatRoom>(`${this.authService.currentUserSig()?._id}-${CHAT_ROOM_NEW_CHAT_FOR_USER_EVENT}`)
    .pipe(
      takeUntil(this.destroy$),
    )
    .subscribe((chatRoom) => {
      this.chatService.subscribeToChatRoomUpdates(chatRoom._id);
      this.chatService.updateChatRoomInStore(chatRoom);
    });
  }

  ngOnDestroy(): void {
    // Emit a value to complete all subscriptions using `takeUntil`
    this.destroy$.next();
    this.destroy$.complete();
    this.chatService.ngOnDestroy();
  }

  chatWithUser(user :IUser) {

    const chatRoom = this.chatRoomsStore.chatRoomsEntities().find(chatRoom => 
      chatRoom.members.length=== 2
      && chatRoom.members.map(member => member._id).includes((this.authService.currentUserSig() as IUser)?._id)
      && chatRoom.members.map(member => member._id).includes(user._id)
    );
    // Check if a chatroom with only the 2 users exists
    if (chatRoom) {
      // Activate chatroom
      this.chatService.activateChatRoomInStorage(chatRoom._id);
      this.chatService.unfoldChatRoomInStorage(chatRoom._id);
    } else {
      // Create chatroom
      this.chatService.startChatWithUser(user).subscribe((res) => {
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
