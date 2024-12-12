import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, output, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatMessage, IChatRoom, IUser } from '@libs/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../../../../src/app/core/services/auth.service';
import { ChatRoomsStore } from '../../../../../../src/app/core/store/chat/chat-room.store';
import { UsersStore } from '../../../../../../src/app/core/store/users/users.store';
import { ChatService } from '../../../../core/services/chat.service';
import { debounceTime, distinctUntilChanged, exhaustMap, mergeMap, of, Subject, switchMap, tap } from 'rxjs';
import { ChatMessageComponent } from './chat-message/chat-message.component';

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
      InputTextModule,
      ChatMessageComponent
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
  private typingSubject = new Subject<boolean>();
  private typingTimeout?: NodeJS.Timeout;

  constructor(private chatService: ChatService) {
    this.messageContent.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
    ).subscribe(() => {
      console.log('user typing')
    }
  );

    // Émettre les états de "saisie" aux autres utilisateurs
    this.typingSubject.subscribe(isTyping => {
      this.chatService.sendTypingSignal(isTyping);
    });
  }
  
  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
  
  userIsTyping() {
    // Émettre "en train de taper"
    this.typingSubject.next(true);

    // Réinitialiser le timeout pour arrêter l'état "en train de taper"
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = setTimeout(() => {
      this.typingSubject.next(false);
    }, 2000); // 2 secondes d'inactivité
  }

  testChat() {
    this.chatService.emit('test-chat')
  }
 }
