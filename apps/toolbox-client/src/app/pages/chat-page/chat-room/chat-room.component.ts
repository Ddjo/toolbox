import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatRoom } from '@libs/common';
import { ChatService } from '../../../../../src/app/core/services/chat.service';
import { CardModule } from 'primeng/card';
import { ChatComponent } from "./chat/chat.component";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UsersStore } from '../../../../../src/app/core/store/users/users.store';

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
]
})
export class ChatRoomComponent  {

  // @Input() chatRoom!: IChatRoom;
  chatRoom = input.required<IChatRoom>();


  readonly chatService = inject(ChatService);
  readonly userStore = inject(UsersStore);


  addMemberToChat() {
    this.chatService.addMemberToChatRoom(this.chatRoom()).subscribe();

  }

  removeChatRoom() {
    this.chatService.removeChatRoom(this.chatRoom()._id).subscribe();
  }
 }
