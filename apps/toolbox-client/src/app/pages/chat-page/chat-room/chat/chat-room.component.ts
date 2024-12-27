import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostBinding, inject, input, OnDestroy, output, signal, viewChild, viewChildren } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatMessage, IUser } from '@libs/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { filter, Subject } from 'rxjs';
import { IChatRoomEntity } from '../../../../../app/core/store/chat/chat-room.store';
import { VisibilityObserverDirective } from '../../../../core/directives/visibility-observer.directive';
import { AuthService } from '../../../../core/services/auth.service';
import { ChatService } from '../../../../core/services/chat.service';
import { ChatMessageComponent } from './chat-message/chat-message.component';

export interface IChatMessageDisplayed extends IChatMessage {
  displayEmail: boolean;
  viewed: boolean;
}

@Component({
    selector: 'app-chat-room',
    templateUrl: './chat-room.component.html',
    styleUrl: './chat-room.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
      CommonModule, 
      FormsModule,
      ReactiveFormsModule,
      ButtonModule,
      CardModule,
      InputTextModule,
      ChatMessageComponent,
      MessageModule,
      ScrollingModule,
      ProgressSpinnerModule,
      BadgeModule,
      VisibilityObserverDirective
    ]
})
export class ChatRoomComponent implements AfterViewInit, OnDestroy {

  @HostBinding('attr.class')
  get direction() { return this.chatRoomUnfold() ? 'unfold' : 'fold' }

  private destroy$ = new Subject<void>();

  chatService = inject(ChatService);
  authService = inject(AuthService);

  chatRoomInput = input.required<IChatRoomEntity>();


  typingUsers: string[] = [];  
  loadingMessages = false;
  chatMembersMails = '';
  filteredMessages: IChatMessageDisplayed[] = [];
  unviewedMessages = signal(0);

  chatRoomUnfold = computed(() => this.chatService.clientChatRoomsConfigSig().unfoldedChatRoomsIds.includes(this.chatRoomInput()._id));

  messageInput = viewChild<ElementRef>('messageInput');
  messagesRefs = viewChildren<ChatMessageComponent>("messageElement"); 
  messagesElements = viewChildren('messageElement', { read: ElementRef });
  messagesPositions: {_id:string , height: number, top: number, isNew: boolean}[] = []; 

  messagesViewport = viewChild.required<CdkVirtualScrollViewport>('messagesViewport');

  currentUser = this.authService.currentUserSig;


  lastMessageIdOnTop: string | null = null;

  messageContent = new FormControl<string | null>(null);

  constructor() {
    effect(() => {
      const chatRoom = this.chatRoomInput();

      // ----------- Chat members mails
      this.chatMembersMails = this.chatRoomInput().members
        .filter(member => member._id !== this.currentUser()?._id)
        .map(member =>member.email).join(',');

      // ----------- Typing users 
      this.typingUsers =chatRoom.typingUsers.filter(typingUser => typingUser.userMail !== (this.currentUser() as IUser).email).map(typingUser => typingUser.userMail);

      // ----------- If new message and user already seeing the last message, scroll to the bottom
      if (this.filteredMessages.length !== chatRoom.messages.length) {
        if (this.isScrollAtBottom() || this.isCurrentUserSender()) 
          setTimeout(() => {   
            this.scrollToLastMessage('instant');
          });
      }

      this.filteredMessages = chatRoom.messages.map((message, index) => {
        return {
        ...message,
        displayEmail : this.displayMailForMessage(index, message),
        viewed: !!message.views.find(view => view.user._id === this.currentUser()?._id)
      }});


      setTimeout(() => {
        this.checkUnseenMessages();
      }, 100);

    })
  }

  ngAfterViewInit(): void {
    // Typing user notif output
    this.messageContent.valueChanges.pipe(
      filter(value => !!value),
      // throttleTime(typingUserDisplayTimeMs / 2)
    ).subscribe(() => {
      this.chatService.sendTypingSignal(this.chatRoomInput(), this.currentUser() as IUser);
    });
    
    setTimeout(() => {
      this.focusOnMessageInput(); 
      this.scrollToLastMessage('instant')
    });
  }

  ngOnDestroy(): void {
    // Emit a value to complete all subscriptions using `takeUntil`
    this.destroy$.next();
    this.destroy$.complete();
  }

  focusOnMessageInput() {
    this.messageInput()?.nativeElement.focus();
  }

  checkUnseenMessages() {
    // Find messages without views matching the current user
    this.unviewedMessages.set(this.chatRoomInput().messages.filter(message => {
      return !message.views.some(view => view.user._id === this.currentUser()?._id);
    }).length);
  }

  sendMessage() {
    this.chatService.sendMessage(this.chatRoomInput(), this.currentUser() as IUser, this.messageContent.value || '');
    this.messageContent.setValue(null);  
  }

  displayMailForMessage(index: number, message: IChatMessage): boolean {
    
    // If message is the first one, display mail
    if (index === 0 )
      return true;

    // If previous message is not from the same sender, display mail
    return message.sender._id !== this.chatRoomInput().messages[index - 1].sender._id
  }

  scrollToLastMessage(scrollBehaviour : ScrollBehavior): void {
    try {
      setTimeout(() => {
        this.messagesViewport().scrollToIndex(this.chatRoomInput().messages.length, scrollBehaviour);
      });

    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  isCurrentUserSender(): boolean {
    return this.chatRoomInput().messages[this.chatRoomInput().messages.length - 1]?.sender._id === (this.currentUser() as IUser)._id;
  }

  isScrollAtBottom() {
    // Size of the viewport (visible messages)
    const viewPortSize = Math.round(this.messagesViewport().measureViewportSize('vertical'));
    // Size of messages container
    const contentSize =  Math.round(this.messagesViewport().measureRenderedContentSize());
    // Current scroll position
    const scrollOffset =  Math.round(this.messagesViewport().measureScrollOffset());

    // console.log(`viewPortSize : ${this.messagesViewport().measureViewportSize('vertical')}`)
    // console.log(`contentSize : ${this.messagesViewport().measureRenderedContentSize()}`)
    // console.log(`scrollOffset : ${this.messagesViewport().measureScrollOffset()}`)
    // console.log(`contentSize - scrollOffset : ${this.messagesViewport().measureRenderedContentSize() - this.messagesViewport().measureViewportSize('vertical')}`)

    // Compare with a margin of 2 pixels
    return (contentSize - scrollOffset) >= viewPortSize - 2 && (contentSize - scrollOffset) <= viewPortSize + 2;
  }

  loadOlderMessages(){
    this.lastMessageIdOnTop = this.chatRoomInput().messages[0]._id;
    this.chatService.loadPreviousMessagesForChatRoom(this.chatRoomInput()).subscribe();
  }

  removeChatRoom() {
    this.chatService.removeChatRoom(this.chatRoomInput()._id).subscribe();
  }

  desactivateChatRoom() {
    this.chatService.desactivateChatRoomInStorage(this.chatRoomInput()._id);
  }

  toggleChatroomFold() {
    if(this.chatRoomUnfold()) {
      this.chatService.foldChatRoomInStorage(this.chatRoomInput()._id);
    } else {
      this.chatService.unfoldChatRoomInStorage(this.chatRoomInput()._id);
    }
  }

  messageVisibilityChangedEvent(message: IChatMessageDisplayed, visibility: boolean) {
    if (!!visibility && !message.views.some(view => view.user._id === this.currentUser()?._id)) {
      this.chatService.setMessageAsViewed(message._id, this.currentUser() as IUser);
    }
    
  }
}
