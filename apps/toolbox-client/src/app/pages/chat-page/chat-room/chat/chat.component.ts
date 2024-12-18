import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, input, output, ViewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IChatMessage, IChatRoom, IUser } from '@libs/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Scroller } from 'primeng/scroller';
import { filter, Observable, tap, throttleTime } from 'rxjs';
import { CdkDynamicHeightDirective } from '../../../../../../src/app/core/directives/cdk-dynamic-height.directive';
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
      MessageModule,
      // ExperimentalScrollingModule,
      ScrollingModule,
      CdkDynamicHeightDirective
    ]
})
export class ChatComponent implements AfterViewInit {
  
  @ViewChild('sc') sc!: Scroller;
  @ViewChild('messagesViewport') messagesViewport!: CdkVirtualScrollViewport;
  
  authService = inject(AuthService);

  memberInput = input.required<IUser>();
  chatRoomInput = input.required<IChatRoom>();
  typingUsersInput = input<string[]>([]);
  
  memberLeavesChatOutput = output<IUser>();
  sendMessageOutput = output<string | null>();
  typingUserOutput = output<IUser>();
  loadPreviousMessagesOuput = output();

  currentUser = this.authService.currentUserSig;

  unreadMessages = 0;
  // currentElementsInView: ScrollerScrollIndexChangeEvent = {first: 0, last: 0};
  // scrollerOptions : ScrollerOptions = {
  //   showSpacer: false,
  //   itemSize: 40,
  //   autoSize: true,
  //   scrollHeight: '100%',
  // };

  
  // Observe messages to display it, flag it with a displayEmail if it's the first one of a serie
  filteredMessages$: Observable<( IChatMessage & {displayEmail: boolean, height: number})[]> = toObservable(computed(()=> {
    return this.chatRoomInput().messages.map((message, index) => { 
      return {
        ...message,
        displayEmail : index === 0 || message.sender._id !== this.chatRoomInput().messages[index - 1].sender._id,
        height:  index === 0 || message.sender._id !== this.chatRoomInput().messages[index - 1].sender._id ? 500 : 500
      }
    }).sort((message1, message2) => new Date(message1.createdAt).getTime() -  new Date(message2.createdAt).getTime())
  })).pipe(
    tap(() => {
      // Scroll only for the user who sent the new message or for the users who are already seeing the last message
      if (!this.isCurrentUserSender() &&  !this.isNewMessageInViewPort()) {
        this.unreadMessages++;
      } else {
        // this.scrollToLastMessage('smooth')
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
    // this.scrollToLastMessage('instant');
    // this.currentElementsInView.last =  this.chatRoomInput().messages.length;

    console.log(this.messagesViewport)
    

    console.log('this.chatRoomInput().messages.length', this.chatRoomInput().messages.length)

    // this.sc.onScrollIndexChange.subscribe((res) => {
    //   console.log('onScrollIndexChange : ', res)
    //   this.currentElementsInView = res});
  }

  sendMessage() {
    this.sendMessageOutput.emit(this.messageContent.value);
    this.messageContent.setValue(null);  
  }

  scrollToLastMessage(scrollBehaviour : ScrollBehavior): void {
    try {
        setTimeout(() => {
          console.log('scroll to Index : ', this.chatRoomInput().messages.length)
          this.messagesViewport.scrollToIndex(this.chatRoomInput().messages.length, scrollBehaviour);
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

  isNewMessageInViewPort() {
    // console.log(' this.memberInput().email ',  this.memberInput().email)

    // console.log(' this.currentElementsInView ',  this.currentElementsInView)

    // console.log(' this.chatRoomInput().messages.length - 1 ',  this.chatRoomInput().messages.length)
    // console.log(' this.currentElementsInView.first === 0 || (this.currentElementsInView.last <  this.chatRoomInput().messages.length) ',  
    //   this.currentElementsInView.first === 0 || (this.currentElementsInView.last <  this.chatRoomInput().messages.length))
    // return this.currentElementsInView.first === 0 || (this.currentElementsInView.last <  this.chatRoomInput().messages.length);
    return true;
  }

  loadOlderMessages(){
    this.loadPreviousMessagesOuput.emit();

  }

 }
