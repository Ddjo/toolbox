import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { IChatMessageDisplayed } from '../chat-room.component';

@Component({
    selector: 'app-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrl: './chat-message.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        AvatarModule
    ]
})
export class ChatMessageComponent implements AfterViewInit, OnDestroy {

    private destroy$ = new Subject<void>();

    private authService = inject(AuthService);

    messageInput = input.required<IChatMessageDisplayed>();
    maxHeight= input.required<number>();
    
    isSenderCurrentUserInput = false;
    displayUserMailInput = false;
    isLongMessage = signal(false);
    isExpanded = signal(true);
    truncatedMessage = '';

    ngAfterViewInit(): void {
        this.checkMessageLength();

        this.isSenderCurrentUserInput = this.messageInput().sender._id === this.authService.currentUserSig()?._id;
        this.displayUserMailInput = this.messageInput().displayEmail;
    }

    ngOnDestroy(): void {
        // Emit a value to complete all subscriptions using `takeUntil`
        this.destroy$.next();
        this.destroy$.complete();
    }

    checkMessageLength(): void {
        const dummyElement = document.createElement('div');
        dummyElement.style.position = 'absolute';
        // dummyElement.style.visibility = 'visible';
        // dummyElement.style.border = '1px solid red'; // Add a border for visibility
        dummyElement.style.maxWidth = '180px';
        dummyElement.style.maxHeight = this.maxHeight().toString() + 'px';
        dummyElement.style.overflow = 'hidden';
        dummyElement.style.wordBreak = 'break-word'
        dummyElement.textContent = this.messageInput().content;
        document.body.appendChild(dummyElement);
    
        if (dummyElement.scrollHeight > dummyElement.offsetHeight) {
            // console.log('too big ',this.messageInput().content )
          this.isLongMessage.set(true);
          this.isExpanded.set(false);
          this.truncatedMessage = this.messageInput().content.slice(0, 150); // Truncate at 150 chars or adjust
        }
        document.body.removeChild(dummyElement);
    }

    toggleExpand(): void {
        this.isExpanded.set(!this.isExpanded());
    }
 }
