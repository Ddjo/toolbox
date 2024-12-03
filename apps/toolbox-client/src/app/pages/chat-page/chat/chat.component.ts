import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ChatService } from '@toolbox-client/src/app/core/services/chat.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      ButtonModule,
      CardModule,
      InputTextModule
    ]
})
export class ChatComponent implements OnDestroy {
    
  constructor(private chatService: ChatService) {}

  testChat() {
    this.chatService.emit('test-chat')
  }

  ngOnDestroy(): void {
      this.chatService.disconnect();
  }
   
 }
