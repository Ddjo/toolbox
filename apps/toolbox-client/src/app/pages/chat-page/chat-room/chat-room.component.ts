import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit } from '@angular/core';
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

  currentUser = this.authService.currentUserSig;
  addMemberControl = new FormControl();

  availableUsersToAdd = computed(() => {
    return this.userStore.usersEntities().filter(user => 
      !this.chatRoom().members.map(member => member._id).includes(user._id)
      && user._id !== this.currentUser()?._id
    )
  })

  ngOnInit(): void {
    this.addMemberControl.valueChanges.pipe(
      filter(user => user),
      switchMap(user => this.chatService.addMemberToChatRoom(this.chatRoom(), user))
    ).subscribe(() => this.addMemberControl.setValue(undefined));

    this.chatService.getNewMessage(this.chatRoom()).subscribe(message => console.log('new message for chatroom' + this.chatRoom()._id + ' : ', message))
  
    this.chatService.connect();
  }


  removeChatRoom() {
    this.chatService.removeChatRoom(this.chatRoom()._id).subscribe();
  }

  sendMessage(message: string | null, member: IUser) {
    this.chatService.sendMessage(this.chatRoom(), member, message as string);
  }

  memberLeavesChat(member: IUser) {
    this.chatService.removeMemberFromChatRoom(this.chatRoom(), member)
      .subscribe();
  }
 }
