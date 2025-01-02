// Import Angular modules and components
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, effect, ElementRef, HostBinding, inject, input, OnDestroy, signal, viewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import application-specific interfaces
import { IChatMessage, IUser } from '@libs/common';

// Import UI components from PrimeNG
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Import RxJS utilities
import { filter, Subject } from 'rxjs';

// Import directives and services from the application
import { VisibilityObserverDirective } from '../../../core/directives/visibility-observer.directive';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService } from '../../../core/services/chat.service';
import { IChatRoomEntity } from '../../../core/store/chat/chat-room.store';

// Import child component
import { ChatMessageComponent } from './chat-message/chat-message.component';

// Extended chat message interface for display logic
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

  // Bind CSS class to the component's host element based on chat room state
  @HostBinding('attr.class')
  get direction() { return this.chatRoomUnfold() ? 'unfold' : 'fold' }

  private destroy$ = new Subject<void>(); // Used to clean up subscriptions

  // Inject required services
  chatService = inject(ChatService);
  authService = inject(AuthService);

  // Input property for the chat room entity
  chatRoomInput = input.required<IChatRoomEntity>();

  filteredMessages: IChatMessageDisplayed[] = []; // Messages displayed in the chat room

  typingUsers: string[] = []; // List of users currently typing
  loadingMessages = signal(false); // Whether older messages are loading
  showLoader = signal(false); // Whether to show the loader
  chatMembersMails = ''; // List of emails of other chat members
  unviewedMessages = signal(0); // Count of unviewed messages

  // Computed property to determine if the chat room is unfolded
  chatRoomUnfold = computed(() => this.chatService.clientChatRoomsConfigSig().unfoldedChatRoomsIds.includes(this.chatRoomInput()._id));

  // References to specific DOM elements in the template
  messageInput = viewChild<ElementRef>('messageInput');
  messagesViewport = viewChild.required<CdkVirtualScrollViewport>('messagesViewport');

  currentUser = this.authService.currentUserSig; // Current user signal

  lastMessageIdOnTop: string | null = null; // ID of the last message displayed at the top

  messageContent = new FormControl<string | null>(null); // Form control for message input

  constructor() {
    // React to changes in the chat room input
    effect(() => {
      const chatRoom = this.chatRoomInput();

      // Generate email list of other chat members
      this.chatMembersMails = this.chatRoomInput().members
        .filter(member => member._id !== this.currentUser()?._id)
        .map(member => member.email).join(',');

      // Update typing users
      this.typingUsers = chatRoom.typingUsers
        .filter(typingUser => typingUser.userMail !== (this.currentUser() as IUser).email)
        .map(typingUser => typingUser.userMail);

      // Scroll to the bottom if new messages arrive
      if (this.filteredMessages.length !== chatRoom.messages.length) {
        if (this.isScrollAtBottom() || this.isCurrentUserSender()) 
          setTimeout(() => {   
            this.scrollToLastMessage('instant');
          });
      }

      // Transform messages for display
      this.filteredMessages = chatRoom.messages.map((message, index) => ({
        ...message,
        displayEmail: this.displayMailForMessage(index, message),
        viewed: !!message.views.find(view => view.user._id === this.currentUser()?._id)
      }));

      setTimeout(() => {
        // Scroll adjustments when older messages are loaded
        if (this.lastMessageIdOnTop) {
          if (this.filteredMessages.length === this.chatRoomInput().totalMessages) {
            this.scrollToTop('instant');
          } else {
            const lastMessageOnTopIndex = this.filteredMessages.map(msg => msg._id).indexOf(this.lastMessageIdOnTop);
            this.messagesViewport().scrollToIndex(lastMessageOnTopIndex + 1);
            this.lastMessageIdOnTop = null;
            this.showLoader.set(false);
          }
        }

        this.checkUnseenMessages(); // Check for unseen messages
      }, 100);
    });
  }

  ngAfterViewInit(): void {
    // React to typing in the message input field
    this.messageContent.valueChanges.pipe(
      filter(value => !!value)
    ).subscribe(() => {
      this.chatService.sendTypingSignal(this.chatRoomInput(), this.currentUser() as IUser);
    });

    // Focus on the message input and scroll to the bottom initially
    setTimeout(() => {
      this.focusOnMessageInput(); 
      this.scrollToLastMessage('instant');
    });
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to avoid memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }


  focusOnMessageInput() {
    this.messageInput()?.nativeElement.focus();
  }

  checkUnseenMessages() {
    // Find messages without views matching the current user
    this.unviewedMessages.set(this.filteredMessages.filter(message => {
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

  scrollToTop(scrollBehaviour : ScrollBehavior): void {
    this.messagesViewport().scrollToIndex(0, scrollBehaviour);
  }

  scrollToLastMessage(scrollBehaviour : ScrollBehavior): void {
    const contentSize =  Math.round(this.messagesViewport().measureRenderedContentSize());

    try {
      setTimeout(() => {
        this.messagesViewport().scrollToIndex(contentSize, scrollBehaviour);
      });

    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  isCurrentUserSender(): boolean {
    return this.chatRoomInput().messages[this.chatRoomInput().messages.length - 1]?.sender._id === (this.currentUser() as IUser)._id;
  }

  scrollingIndexChanged(index: number) {

    // --------
    // Check if scroll is on the top to eventually get older messages
    if (index === 0 && 
      (this.chatRoomInput().messages.length < this.chatRoomInput().totalMessages) // If all the messages aren't loaded already
    ) {
      this.showLoader.set(true);
      // Check if after the timeout, the scroll index is still 0
      setTimeout(() => { 
        if (this.messagesViewport().measureScrollOffset() === 0) { 
          this.loadOlderMessages();
        } else {
          this.showLoader.set(false);
        }
      }, 2000);
    }
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
   if(!this.loadingMessages()){
      this.scrollToTop('instant');
      this.lastMessageIdOnTop = this.filteredMessages[0]._id;
      this.loadingMessages.set(true);
      this.chatService.loadPreviousMessagesForChatRoom(this.chatRoomInput()).subscribe(() => {
        this.loadingMessages.set(false);
        this.showLoader.set(false);
      });
    }
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
    if (visibility && !message.views.some(view => view.user._id === this.currentUser()?._id)) {
      this.chatService.setMessageAsViewed(message._id, this.currentUser() as IUser);
    }
    
  }
}
