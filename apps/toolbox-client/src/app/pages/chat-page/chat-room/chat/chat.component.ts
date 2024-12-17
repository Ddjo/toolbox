import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output, ViewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatMessage, IChatRoom, IUser } from '@libs/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { filter, Observable, tap, throttleTime } from 'rxjs';
import { AuthService } from '../../../../../../src/app/core/services/auth.service';
import { typingUserDisplayTimeMs } from '../chat-room.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

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
        ChatMessageComponent,
        TooltipModule
    ]
})
export class ChatComponent implements AfterViewInit {
  
  @ViewChild('messagesContainer', { read: ElementRef }) messagesContainer!: ElementRef;

  authService = inject(AuthService);
  memberInput = input.required<IUser>();
  chatRoomInput = input.required<IChatRoom>();
  typingUsersInput = input<string[]>([]);

  memberLeavesChatOutput = output<IUser>();
  sendMessageOutput = output<string | null>();
  typingUserOutput = output<IUser>();

  currentUser = this.authService.currentUserSig;

  // Observe messages to display it, flag it with a displayEmail if it's the first one of a serie
  filteredMessages$: Observable<( IChatMessage & {displayEmail: boolean})[]> = toObservable(computed(()=> {
    return this.chatRoomInput().messages.map((message, index) => { return {
      ...message,
      displayEmail : index === 0 || message.sender._id !== this.chatRoomInput().messages[index - 1].sender._id
    }})
  })).pipe(
    tap(() => {
      // Scroll only for the user who sent the new message
      if (this.chatRoomInput().messages[this.chatRoomInput().messages.length - 1].sender._id === this.memberInput()._id) {
        this.scrollToLastMessage()
      }
    })
  );
  
  
  typingUsersWithoutCurrentMember = computed(() => {
    return this.typingUsersInput().filter(mail => mail !== this.memberInput().email);
  })

  messageContent = new FormControl<string | null>(null);

  constructor(
  ) {
    this.messageContent.valueChanges.pipe(
      filter(value => !!value),
      throttleTime(typingUserDisplayTimeMs)
    ).subscribe(() => {
      this.typingUserOutput.emit(this.memberInput());
    });
  }

  ngAfterViewInit(): void {
    this.scrollToLastMessage();
  }
  sendMessage() {
    this.sendMessageOutput.emit(this.messageContent.value);
    this.messageContent.setValue(null);  
  }

  scrollToLastMessage(): void {
    try {
      setTimeout(() => {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      });
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

 }
