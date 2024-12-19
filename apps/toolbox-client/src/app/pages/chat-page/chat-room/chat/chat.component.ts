import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, output, signal, viewChild, viewChildren } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatMessage, IChatRoom, IUser } from '@libs/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { filter, Observable, tap, throttleTime } from 'rxjs';
import { AuthService } from '../../../../../../src/app/core/services/auth.service';
import { ChatService } from '../../../../../../src/app/core/services/chat.service';
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
      MessageModule,
      ScrollingModule,
      ProgressSpinnerModule
    ]
})
export class ChatComponent implements AfterViewInit {
  
  chatService = inject(ChatService);
  authService = inject(AuthService);

  memberInput = input.required<IUser>();
  chatRoomInput = input.required<IChatRoom>();
  memberLeavesChatOutput = output<IUser>();
  // sendMessageOutput = output<string | null>();
  // typingUserOutput = output<IUser>();
  // seenMessageOuput = output<{chatMessageId: string, seenBy: IUser}>();
  // loadPreviousMessagesOuput = output();
  
  typingUsers = signal<string[]>([]);  
  messagesViewPortScrollPosition = signal<number | null>(null);
  loadingMessages = signal(false);
  // messagesRefs = viewChildren("messageElement");

  messagesRefs = viewChildren<ChatMessageComponent>("messageElement"); 
  messagesElements = viewChildren('messageElement', { read: ElementRef });
  messagesPositions: {_id:string , height: number, top: number, isNew: boolean}[] = []; 

  messagesViewport = viewChild.required<CdkVirtualScrollViewport>('messagesViewport');

  currentUser = this.authService.currentUserSig;

  unreadMessages = 0;
  lastMessageIdOnTop: string | null = null;

  private resizeObserver: ResizeObserver | undefined;

  // currentElementsInView: ScrollerScrollIndexChangeEvent = {first: 0, last: 0};
  // scrollerOptions : ScrollerOptions = {
  //   showSpacer: false,
  //   itemSize: 40,
  //   autoSize: true,
  //   scrollHeight: '100%',
  // };

  
  // Observe messages to display it, flag it with a displayEmail if it's the first one of a serie
  // filteredMessages$: Observable<( IChatMessage & {displayEmail: boolean, height: number})[]> = toObservable(computed(()=> {
    
  filteredMessages$: Observable<( IChatMessage & {displayEmail: boolean})[]> = toObservable(computed(()=> {
    return this.chatRoomInput().messages
    .map((message, index) => { 
      return {
        ...message,
        displayEmail : this.displayMailForMessage(index, message),
        // height:  index === 0 || message.sender._id !== this.chatRoomInput().messages[index - 1].sender._id ? 42.8 : 42.8
      }
    })
  })).pipe(
    tap(() => {
      // Scroll only for the user who sent the new message or for the users who are already seeing the last message
      if (!this.isCurrentUserSender() &&  !this.isScrollAtBottom()) {
        this.unreadMessages++;
      } else {
        this.scrollToLastMessage('smooth')
      }

      setTimeout(() => {
        this.saveMessagesPositions();

        // If previous messages just got loaded, scroll to the one that was on top before loading messages
        if(this.lastMessageIdOnTop) {
          // const offsetToScroll = this.messagesPositions
          //   .slice(0, this.messagesPositions.findIndex(message => message._id === this.lastMessageIdOnTop))
          //   .reduce((acc, value) => acc + value.height, 0);
          const offsetToScroll = this.messagesPositions.find(message => message._id === this.lastMessageIdOnTop)?.top;

          this.messagesViewport().scrollTo({top: offsetToScroll})

          this.lastMessageIdOnTop = null;
          this.loadingMessages.set(false);
        }
      });
    })
  );
  
  
  typingUsersWithoutCurrentMember = computed(() => {
    return this.typingUsers().filter(mail => mail !== this.memberInput().email);
  })

  messageContent = new FormControl<string | null>(null);


  ngAfterViewInit(): void {

    this.scrollToLastMessage('instant')

    // Typing user notif output
    this.messageContent.valueChanges.pipe(
      filter(value => !!value),
      throttleTime(typingUserDisplayTimeMs)
    ).subscribe(() => {
      this.chatService.sendTypingSignal(this.chatRoomInput(), this.memberInput());
      // this.typingUserOutput.emit(this.memberInput());
    });


    // Observe new message socket emission
    this.chatService.getNewMessage(this.chatRoomInput()._id).subscribe((message) => {
      // Remove the user from the typing users list
      this.typingUsers.set(this.typingUsers().filter(user => user !== message.sender.email));
    });
  

    // Observe websocket sending back a user typing message
    this.chatService.getTypingSignal(this.chatRoomInput()._id).subscribe((typingUser) => {
      // Add user to typingUser array
      this.typingUsers.set([...this.typingUsers(), typingUser]);

      // Remove him after 'typingUserDisplayTimeMs'
      setTimeout(() => {
        this.typingUsers.set(this.typingUsers().filter(user => user !== typingUser));
      }, typingUserDisplayTimeMs);
    })
    
  }

  sendMessage() {
    // this.sendMessageOutput.emit(this.messageContent.value);
    this.chatService.sendMessage(this.chatRoomInput(), this.memberInput(), this.messageContent.value || '');
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
    return this.chatRoomInput().messages[this.chatRoomInput().messages.length - 1]?.sender._id === this.memberInput()._id;
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
    this.chatService.loadPreviousMessagesForChatRoom(this.chatRoomInput());
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

    console.log('this.messagesPositions for user '+ this.memberInput().email, this.messagesPositions)
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
}
