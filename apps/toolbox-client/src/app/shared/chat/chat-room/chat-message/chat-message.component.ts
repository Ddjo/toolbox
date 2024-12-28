import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnDestroy } from '@angular/core';
import { IChatMessage } from '@libs/common';
import { AvatarModule } from 'primeng/avatar';
import { Subject } from 'rxjs';

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
export class ChatMessageComponent implements OnDestroy {
    private destroy$ = new Subject<void>();

    messageInput = input.required<IChatMessage>();
    isSenderCurrentUserInput = input.required<boolean>();
    displayUserMailInput = input.required<boolean>();

    ngOnDestroy(): void {
        // Emit a value to complete all subscriptions using `takeUntil`
        this.destroy$.next();
        this.destroy$.complete();
    }
 }
