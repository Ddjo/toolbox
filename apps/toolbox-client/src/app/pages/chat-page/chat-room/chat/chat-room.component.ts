import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, HostBinding, inject, input, OnDestroy, output, signal, viewChild, viewChildren } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CHAT_MESSAGE_RECEIVE_TYPING_MESSAGE_EVENT } from '@constants';
import { IChatMessage, IChatRoom, IUser } from '@libs/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { filter, Observable, Subject, takeUntil, tap, throttleTime } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ChatService } from '../../../../core/services/chat.service';
import { typingUserDisplayTimeMs } from '../chat.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';

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
      ProgressSpinnerModule
    ]
})
export class ChatRoomComponent implements AfterViewInit, OnDestroy {

  @HostBinding('attr.class')
  get direction() { return this.chatRoomUnfold() ? 'unfold' : 'fold' }

  private destroy$ = new Subject<void>();

  chatService = inject(ChatService);
  authService = inject(AuthService);

  // memberInput = input.required<IUser>();
  chatRoomInput = input.required<IChatRoom>();
  memberLeavesChatOutput = output<IUser>();
  // sendMessageOutput = output<string | null>();
  // typingUserOutput = output<IUser>();
  // seenMessageOuput = output<{chatMessageId: string, seenBy: IUser}>();
  // loadPreviousMessagesOuput = output();

  // typingUserEmail$: Observable<string> = this.chatService.fromEvent<string>(`${this.chatRoomInput()?._id}-${CHAT_MESSAGE_RECEIVE_TYPING_MESSAGE_EVENT}`)
  // .pipe(tap(() => console.log('typing signal receivedS')));


  typingUsers = signal<string[]>([]);  
  messagesViewPortScrollPosition = signal<number | null>(null);
  loadingMessages = signal(false);
  chatMembersMails = computed(() => this.chatRoomInput().members.filter(member => member._id !== this.currentUser()?._id).map(member => member.email));
  chatRoomUnfold = computed(() => this.chatService.clientChatRoomsConfigSig().unfoldedChatRoomsIds.includes(this.chatRoomInput()._id));


  messagesRefs = viewChildren<ChatMessageComponent>("messageElement"); 
  messagesElements = viewChildren('messageElement', { read: ElementRef });
  messagesPositions: {_id:string , height: number, top: number, isNew: boolean}[] = []; 

  messagesViewport = viewChild.required<CdkVirtualScrollViewport>('messagesViewport');

  currentUser = this.authService.currentUserSig;

  unreadMessages = 0;
  lastMessageIdOnTop: string | null = null;


  filteredMessages$: Observable<( IChatMessage & {displayEmail: boolean})[]> = toObservable(computed(()=> {
    return this.chatRoomInput().messages
    .map((message, index) => { 
      return {
        ...message,
        displayEmail : this.displayMailForMessage(index, message),
      }
    })
  })).pipe(
    tap((res) => {
      console.log('this.chatRoomInput().messages xhanged ', res)
      // Scroll only for the user who sent the new message or for the users who are already seeing the last message
      if (!this.isCurrentUserSender() &&  !this.isScrollAtBottom()) {
        // this.unreadMessages++;
      } else {
        this.scrollToLastMessage('smooth')
      }

      setTimeout(() => {
        this.saveMessagesPositions();

        // If previous messages just got loaded, scroll to the one that was on top before loading messages
        if(this.lastMessageIdOnTop) {
          const offsetToScroll = this.messagesPositions.find(message => message._id === this.lastMessageIdOnTop)?.top;

          this.messagesViewport().scrollTo({top: offsetToScroll})

          this.lastMessageIdOnTop = null;
          this.loadingMessages.set(false);
        }
      });
    })
  );
  
  
  typingUsersWithoutCurrentMember = computed(() => {
    return this.typingUsers().filter(mail => mail !== (this.currentUser() as IUser).email);
  })

  messageContent = new FormControl<string | null>(null);


  ngAfterViewInit(): void {

    this.scrollToLastMessage('instant')

    // Typing user notif output
    this.messageContent.valueChanges.pipe(
      filter(value => !!value),
      throttleTime(typingUserDisplayTimeMs)
    ).subscribe(() => {

      this.chatService.sendTypingSignal(this.chatRoomInput(), this.currentUser() as IUser);
      // this.typingUserOutput.emit(this.memberInput());
    });


    // // Observe new message socket emission
    // this.chatService.getNewMessage(this.chatRoomInput()._id).subscribe((message) => {
    //   // Remove the user from the typing users list
    //   this.typingUsers.set(this.typingUsers().filter(user => user !== message.sender.email));
    // });
  

    // // Observe websocket sending back a user typing message
    // this.chatService.getTypingSignal(this.chatRoomInput()._id).subscribe((typingUser) => {

    //   // console.log('get typing signal !!')
    //   // Add user to typingUser array
    //   this.typingUsers.set([...this.typingUsers(), typingUser]);

    //   // Remove him after 'typingUserDisplayTimeMs'
    //   setTimeout(() => {
    //     this.typingUsers.set(this.typingUsers().filter(user => user !== typingUser));
    //   }, typingUserDisplayTimeMs);
    // })
    
    this.chatService.fromEvent<string>(`${this.chatRoomInput()?._id}-${CHAT_MESSAGE_RECEIVE_TYPING_MESSAGE_EVENT}`)
    .pipe(
      takeUntil(this.destroy$),
    )
    .subscribe((typingUser) => {
        // Add user to typingUser array
        this.typingUsers.set([...this.typingUsers(), typingUser]);
  
        // Remove him after 'typingUserDisplayTimeMs'
        setTimeout(() => {
          this.typingUsers.set(this.typingUsers().filter(user => user !== typingUser));
        }, typingUserDisplayTimeMs);
      });

  }

  ngOnDestroy(): void {
    // Emit a value to complete all subscriptions using `takeUntil`
    this.destroy$.next();
    this.destroy$.complete();
  }

  sendMessage() {
    // this.sendMessageOutput.emit(this.messageContent.value);
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
        this.unreadMessages = 0;
      });

    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  isCurrentUserSender(): boolean {
    return this.chatRoomInput().messages[this.chatRoomInput().messages.length - 1]?.sender._id === (this.currentUser() as IUser)._id;
  }

  messagesViewportScrolling(event: any) {
    console.log('scolling : ', event);
  }

  scrollingIndexChanged(index: number) {

    // --------
    // Check if scroll is on the top to eventually get older messages
    if (index === 0 && 
      (this.chatRoomInput().messages.length < this.chatRoomInput().totalMessages) // If all the messages aren't loaded already
    ) {
      this.loadingMessages.set(true);
      // Check if after the timeout, the scroll index is still 0
      setTimeout(() => { 
        if (this.messagesViewport().measureScrollOffset() === 0) { 
          this.loadOlderMessages();
        } else {
          this.loadingMessages.set(false);
        }
      }, 2000);
    }

    // this.checkMessagesSeenInViewport();
  }

  isScrollAtBottom() {
    // console.log(' this.memberInput().email ',  this.memberInput().email)

    // console.log(' this.currentElementsInView ',  this.currentElementsInView)

    // console.log(' this.chatRoomInput().messages.length - 1 ',  this.chatRoomInput().messages.length)
    // console.log(' this.currentElementsInView.first === 0 || (this.currentElementsInView.last <  this.chatRoomInput().messages.length) ',  
    //   this.currentElementsInView.first === 0 || (this.currentElementsInView.last <  this.chatRoomInput().messages.length))
    // return this.currentElementsInView.first === 0 || (this.currentElementsInView.last <  this.chatRoomInput().messages.length);
    
    return false;
  }

  loadOlderMessages(){
    this.lastMessageIdOnTop = this.chatRoomInput().messages[0]._id;
    this.chatService.loadPreviousMessagesForChatRoom(this.chatRoomInput()).subscribe();
    // this.loadPreviousMessagesOuput.emit();
  }

  // Save the messages positions from the DOM, as they can have different sizes.
  // Useful to check if any message is the viewport, or to scroll to a position
  saveMessagesPositions() {
    this.messagesPositions = [];
    let top = 0;

    this.messagesPositions = this.messagesRefs().map((message, index) => {
      top += this.messagesElements()[index].nativeElement.clientHeight;
      return {
        _id: message.messageInput()._id,
        height: this.messagesElements()[index].nativeElement.clientHeight,
        top: top,
        isNew: false
      }
    });

    // console.log('this.messagesPositions for user '+ (this.currentUser() as IUser).email, this.messagesPositions)
  }

  checkIfSomeMessagesNew(topOffset: number) {

    console.log('topOffset ', topOffset)
    console.log('this.messagesViewport().measureViewportSize', this.messagesViewport().measureViewportSize('vertical'))
    console.log('this.messagesViewport().measureScrollOffset', this.messagesViewport().measureScrollOffset())

    // this.messagesPositions.filter()

    return topOffset > (this.messagesViewport().measureViewportSize('vertical') + this.messagesViewport().measureScrollOffset());

    // console.log('this.messagesViewport().measureViewportOffset', this.messagesViewport().measureViewportOffset())
  
    // return true;
  }

  setFirstMessageAsSeen() {
    this.chatService.sendSeenChatMessage( this.chatRoomInput().messages[0]._id, this.currentUser() as IUser);
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
}
